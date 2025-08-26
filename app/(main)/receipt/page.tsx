"use client";

import React, { useEffect, useState } from "react";
import { updatePageTitle } from "@/lib/metadata";
import { useRegistration } from "@/contexts/RegistrationContext";
import { useReceipt } from "@/contexts/ReceiptContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Download, 
  CheckCircle, 
  Calendar, 
  Mail, 
  Phone, 
  User, 
  Tag,
  Shirt,
  DollarSign,
  ArrowLeft,
  FileText
} from "lucide-react";
import Image from "next/image";

interface ReceiptData {
  registrationName: string;
  runners: any[];
  totalAmount: number;
  originalAmount?: number;
  appliedDiscount?: {
    name: string;
    type: string;
    value: number;
  };
  paymentMethod: string;
  paymentDate: string;
  receiptId: string;
}

export default function ReceiptPage() {
  const router = useRouter();
  const { runners, registrationName, getTotalAmount, clearRunners } = useRegistration();
  const { receiptData: contextReceiptData } = useReceipt();
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    updatePageTitle("Payment Receipt");
  }, []);

  useEffect(() => {
    // Give some time for context to load after navigation
    const timer = setTimeout(() => {
      // Check if we have receipt data from context (after payment)
      if (contextReceiptData) {
        setReceiptData(contextReceiptData);
        setIsLoading(false);
        return;
      }
      
      // Fallback to registration context data if available (direct access)
      if (runners.length > 0) {
        setReceiptData({
          registrationName,
          runners,
          totalAmount: getTotalAmount(),
          paymentMethod: "Bank Transfer",
          paymentDate: new Date().toLocaleDateString(),
          receiptId: `RCP-TEMP-${Date.now()}`
        });
        setIsLoading(false);
        return;
      }
      
      // No data available, redirect to register
      setIsLoading(false);
      router.push('/register');
    }, 100); // Small delay to allow context to populate

    return () => clearTimeout(timer);
  }, [contextReceiptData, runners, registrationName, getTotalAmount, router]);



  const getCategoryDisplayName = (category: string) => {
    const categoryMap: Record<string, string> = {
      "kids-dash": "Kids Dash",
      "5k-race": "5K Race",
      "10k-race": "10K Race",
      "half-marathon": "Half Marathon",
      "full-marathon": "Full Marathon"
    };
    return categoryMap[category] || category;
  };

  const handleDownloadPDF = () => {
    if (receiptData) {
      // Store receipt data in sessionStorage for the print page
      sessionStorage.setItem('printReceiptData', JSON.stringify(receiptData));
      // Open the dedicated printable receipt page
      window.open('/print/receipt', '_blank');
    }
  };

  if (!receiptData) {
    return (
      <div className="container mx-auto py-6 px-4 max-w-4xl">
        <div className="text-center">
          <p>Loading receipt...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 print:bg-white">
      <div className="container mx-auto py-6 px-4 max-w-4xl">
        {/* Header - No Print */}
        <div className="mb-8 no-print">
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Payment Receipt</h1>
              <p className="text-gray-600 mt-2">Your registration has been confirmed</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleDownloadPDF} className="bg-blue-600 hover:bg-blue-700">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>

        {/* Receipt Content */}
        <Card className="print:shadow-none print:border-none">
          <CardHeader className="text-center border-b">
            <div className="mb-6">
              <Image
                src="/images/mnu-logo.png"
                alt="MNU Logo"
                width={120}
                height={60}
                className="mx-auto mb-4"
              />
              <h2 className="text-2xl font-bold text-blue-900 mb-2">MNU Marathon</h2>
            </div>
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="w-12 h-12 text-green-600 mr-3" />
              <div>
                <CardTitle className="text-2xl text-green-600">Payment Successful!</CardTitle>
                <p className="text-sm text-gray-600 mt-1">Receipt ID: {receiptData.receiptId}</p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            {/* Registration Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Registration Details
                </h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Registration Name:</span> {receiptData.registrationName}</p>
                  <p><span className="font-medium">Number of Participants:</span> {receiptData.runners.length}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Payment Information
                </h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Payment Date:</span> {receiptData.paymentDate}</p>
                  <p><span className="font-medium">Payment Method:</span> {receiptData.paymentMethod}</p>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Participants Table */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Registered Participants</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-2 md:px-4 py-2 md:py-3 text-left text-xs md:text-sm font-medium text-gray-900 border-b border-gray-200">
                        Participant
                      </th>
                      <th className="px-2 md:px-4 py-2 md:py-3 text-left text-xs md:text-sm font-medium text-gray-900 border-b border-gray-200">
                        Category
                      </th>
                      <th className="px-2 md:px-4 py-2 md:py-3 text-left text-xs md:text-sm font-medium text-gray-900 border-b border-gray-200 hidden sm:table-cell">
                        Email
                      </th>
                      <th className="px-2 md:px-4 py-2 md:py-3 text-left text-xs md:text-sm font-medium text-gray-900 border-b border-gray-200 hidden sm:table-cell">
                        T-shirt Size
                      </th>
                      <th className="px-2 md:px-4 py-2 md:py-3 text-right text-xs md:text-sm font-medium text-gray-900 border-b border-gray-200">
                        Entry Fee
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {receiptData.runners.map((runner, index) => (
                      <tr key={runner.id || index} className="hover:bg-gray-50">
                        <td className="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm font-medium text-gray-900">
                          {runner.runner.fullName}
                        </td>
                        <td className="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm text-gray-600">
                          {getCategoryDisplayName(runner.category)}
                        </td>
                        <td className="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm text-gray-600 hidden sm:table-cell">
                          {runner.runner.email}
                        </td>
                        <td className="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm text-gray-600 hidden sm:table-cell">
                          {runner.runner.tshirtSize}
                        </td>
                        <td className="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm font-medium text-gray-900 text-right">
                          MVR {runner.totalPrice}
                        </td>
                      </tr>
                    ))}
                    
                    {receiptData.appliedDiscount && (
                      <tr className="bg-green-50">
                        <td className="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm font-medium text-green-800" colSpan={4}>
                          Discount ({receiptData.appliedDiscount.name})
                        </td>
                        <td className="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm font-medium text-green-700 text-right">
                          -MVR {(() => {
                            const originalAmount = receiptData.originalAmount || receiptData.totalAmount;
                            const discountValue = Number(receiptData.appliedDiscount.value) || 0;
                            let discountAmount = 0;
                            
                            if (receiptData.appliedDiscount.type?.toLowerCase() === 'percentage') {
                              discountAmount = (originalAmount * discountValue) / 100;
                            } else if (receiptData.appliedDiscount.type?.toLowerCase() === 'fixed') {
                              discountAmount = discountValue;
                            }
                            
                            return Math.min(discountAmount, originalAmount).toFixed(0);
                          })()}
                        </td>
                      </tr>
                    )}
                    
                    <tr className="bg-blue-50 border-t-2 border-blue-200">
                      <td className="px-2 md:px-4 py-2 md:py-3 text-sm md:text-base font-bold text-blue-800" colSpan={4}>
                        Total Amount Paid
                      </td>
                      <td className="px-2 md:px-4 py-2 md:py-3 text-sm md:text-base font-bold text-blue-800 text-right">
                        MVR {receiptData.totalAmount}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Important Information */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Important Information</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Please keep this receipt for your records</li>
                <li>• You will receive a confirmation email within 24 hours</li>
                <li>• T-shirts will be distributed on race day</li>
                <li>• Race day details will be sent via email</li>
                <li>• For any queries, contact us at mnumarathon@mnu.edu.mv</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Footer - No Print */}
        <div className="mt-8 text-center text-gray-600 no-print">
          <p>Thank you for registering for the MNU Marathon!</p>
          <p className="text-sm mt-2">We look forward to seeing you on race day.</p>
        </div>
      </div>
    </div>
  );
}
