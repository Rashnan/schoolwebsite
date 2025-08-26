"use client";

import type React from "react";
import { useEffect, useState, useTransition } from "react";
import { updatePageTitle } from "@/lib/metadata";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  CreditCard,
  ArrowLeft,
  Building2,
  Upload,
  FileImage,
  Tag,
} from "lucide-react";
import { toast } from "sonner";
import { useRegistration } from "@/contexts/RegistrationContext";
import { useReceipt } from "@/contexts/ReceiptContext";
import { sendSlipPayment, startCardTransaction } from "@/components/backplug";//contains code to communicate with api endpoints

// Race categories with pricing
const raceCategories = {
  "5k-race": { name: "5K Race", fee: 300 },
  "10k-race": { name: "10K Race", fee: 350 },
  "half-marathon": { name: "Half Marathon", fee: 450 },
  "full-marathon": { name: "Full Marathon", fee: 550 },
};

interface Runner {
  fullName: string;
  email: string;
  phoneNumber: string;
  tshirtSize: string;
}

interface RegistrationData {
  id: string;
  category: string;
  runner: Runner;
  totalPrice: number;
}

export default function PaymentPage() {
  const router = useRouter();
  const { 
    isLoading,
    runners, 
    registrationName, 
    getTotalAmount, 
    clearRunners: clearCart 
  } = useRegistration();
  const { setReceiptData } = useReceipt();
  const [isPending, startTransition] = useTransition();
  const [submissionMessage, setSubmissionMessage] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileAsBase64, setSelectedFileAsBase64] = useState<string | null>(null); //for storing payment slip image as base64 text
  const [paymentMethod, setPaymentMethod] = useState<string>("card");
  const [discountCode, setDiscountCode] = useState<string>("");
  const [appliedDiscount, setAppliedDiscount] = useState<any>(null);
  const [discountLoading, setDiscountLoading] = useState<boolean>(false);
  const [finalAmount, setFinalAmount] = useState<number>(0);
  
  // Calculate discount amount
  const calculateDiscountAmount = () => {
    if (!appliedDiscount) return 0;
    
    const baseTotal = getTotalAmount();
    const discountValue = Number(appliedDiscount.value) || 0;
    
    let discountAmount = 0;
    
    if (appliedDiscount.type.toLowerCase() === 'percentage') {
      discountAmount = (baseTotal * discountValue) / 100;
    } else if (appliedDiscount.type.toLowerCase() === 'fixed') {
      discountAmount = discountValue;
    }
    
    return Math.min(discountAmount, baseTotal);
  };

  // Calculate final amount with discount
  const calculateFinalAmount = () => {
    const baseTotal = getTotalAmount();
    const discountAmount = calculateDiscountAmount();
    

    
    return baseTotal - discountAmount;
  };

  useEffect(() => {
    updatePageTitle("Payment");
  }, []);

  useEffect(() => {
    // Don't check for runners while still loading
    if (isLoading) return;
    
    // Check if we have runners from context after loading is complete
    if (runners.length === 0) {
      toast.error("No Registration Data Found", {
        description: "Please complete your registration first before proceeding to payment.",
      });
      router.push('/register');
      return;
    }
    
    // No need to manage finalAmount state anymore - using calculateFinalAmount() function
  }, [isLoading, runners, getTotalAmount, router]);

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

  const validateDiscountCode = async () => {
    if (!discountCode.trim()) {
      toast.error("Please enter a discount code");
      return;
    }

    setDiscountLoading(true);
    try {
      const response = await fetch('/api/discount', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: discountCode.trim(),
          totalAmount: getTotalAmount(),
          participantCount: runners.length
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setAppliedDiscount(data.discount);
        
        // Create description based on discount type
        let discountDescription = `${data.discount.name} - MVR ${data.discount.discountAmount} off`;
        if (data.discount.type === 'percentage') {
          discountDescription = `${data.discount.name} - ${data.discount.value}% discount (MVR ${data.discount.discountAmount} off)`;
        }
        
        toast.success("Discount Applied!", {
          description: discountDescription,
        });
      } else {
        toast.error("Invalid Discount Code", {
          description: data.error || "Please check your discount code and try again.",
        });
      }
    } catch (error) {
      console.error('Error validating discount:', error);
      toast.error("Error", {
        description: "Failed to validate discount code. Please try again.",
      });
    } finally {
      setDiscountLoading(false);
    }
  };

  const removeDiscount = () => {
    setAppliedDiscount(null);
    setDiscountCode("");
    toast.success("Discount Removed", {
      description: "Discount has been removed from your order.",
    });
  };

  // Re-validate discount before payment
  const revalidateDiscountBeforePayment = async () => {
    if (!appliedDiscount) return true; // No discount to validate
    
    try {
      const response = await fetch('/api/discount', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: appliedDiscount.code,
          totalAmount: getTotalAmount(),
          participantCount: runners.length
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Update discount data in case values changed
        setAppliedDiscount(data.discount);
        return true;
      } else {
        // Discount is no longer valid
        setAppliedDiscount(null);
        setDiscountCode("");
        toast.error("Discount No Longer Valid", {
          description: data.error || "The discount has expired or is no longer available.",
        });
        return false;
      }
    } catch (error) {
      console.error('Error revalidating discount:', error);
      toast.error("Discount Validation Error", {
        description: "Could not validate discount. Please try again.",
      });
      return false;
    }
  };

  //Used to convert payment slip images to base64
  const encodeToBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();

      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };

    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (file.type === "image/png" || file.type === "image/jpeg") {
        const base64Res = encodeToBase64(file).then(b64 => { setSelectedFileAsBase64(b64 as string) }); //Store the payment slip as base64 text.
        setSelectedFile(file);
        toast.success("File Selected Successfully", {
          description: `${file.name} has been selected and is ready for upload.`,
        });
      } else {
        toast.error("Invalid File Type", {
          description: "Please select a PNG or JPEG image file only.",
        });
        event.target.value = "";
      }
    }
  };

  const handleCardPayment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    startTransition(async () => {
      // Re-validate discount before payment
      const discountValid = await revalidateDiscountBeforePayment();
      if (!discountValid) {
        return; // Stop payment if discount is invalid
      }

      // Simulate payment processing
      //var customerSummary = JSON.parse(localStorage.getItem('checkoutParticipants') || JSON.stringify(cartItems));//cart used
      startCardTransaction()// [DEBUG] asks server to ask a pseudo card provider to process payment for testing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setSubmissionMessage({
        success: true,
        message: "Card payment successful! Registration completed.",
      });

      toast.success("Payment Successful!", {
        description: "Your registration has been confirmed. Redirecting to receipt...",
      });

      // Save receipt data to database
      try {
        const response = await fetch('/api/receipt', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            registrationName,
            runners,
            totalAmount: calculateFinalAmount(),
            originalAmount: getTotalAmount(),
            appliedDiscount: appliedDiscount,
            paymentMethod: "Card Payment"
          })
        });

        if (response.ok) {
          const result = await response.json();
          
          // Store receipt data in context
          setReceiptData(result.receiptData);
          
          // Redirect to receipt page (no ID in URL) then clear cart
          setTimeout(() => {
            router.push('/receipt');
            // Clear cart after navigation to prevent "no registration data" flash
            setTimeout(() => {
              clearCart();
            }, 200);
          }, 1500);
        } else {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          throw new Error(errorData.error || 'Failed to save registration');
        }
      } catch (error) {
        console.error('Error saving registration:', error);
        toast.error("Error saving registration. Please contact support.");
      }
    });
  };

  const handleBankingPayment = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!selectedFile) {
      toast.error("Payment Slip Required", {
        description: "Please upload your payment slip before submitting.",
      });
      return;
    }

    startTransition(async () => {
      // Re-validate discount before payment
      const discountValid = await revalidateDiscountBeforePayment();
      if (!discountValid) {
        return; // Stop payment if discount is invalid
      }

      sendSlipPayment(selectedFileAsBase64 || '')//Sends the payment slip as base64 text to server and finalize payment(from client side)
      // Simulate file upload and processing
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSubmissionMessage({
        success: true,
        message:
          "Payment slip uploaded successfully! Your registration is under review.",
      });

      toast.success("Payment Slip Uploaded!", {
        description:
          "We will verify your payment and confirm your registration within 24 hours. Redirecting to receipt...",
      });

      // Save receipt data to database
      try {
        const response = await fetch('/api/receipt', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            registrationName,
            runners,
            totalAmount: calculateFinalAmount(),
            originalAmount: getTotalAmount(),
            appliedDiscount: appliedDiscount,
            paymentMethod: "Bank Transfer"
          })
        });

        if (response.ok) {
          const result = await response.json();
          
          // Store receipt data in context
          setReceiptData(result.receiptData);
          
          // Redirect to receipt page (no ID in URL) then clear cart
          setTimeout(() => {
            router.push('/receipt');
            // Clear cart after navigation to prevent "no registration data" flash
            setTimeout(() => {
              clearCart();
            }, 200);
          }, 1500);
        } else {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          throw new Error(errorData.error || 'Failed to save registration');
        }
      } catch (error) {
        console.error('Error saving registration:', error);
        toast.error("Error saving registration. Please contact support.");
      }
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 px-4 max-w-6xl">
        <div className="text-center">
          <p>Loading payment details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto pt-6 pb-4 md:pb-12 px-4 max-w-6xl">
      {/* Header */}
      <div className="mb-4 md:mb-8">
        <Button
          variant="ghost"
          onClick={() => router.push("/register")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Registration
        </Button>
        <h1 className="text-3xl font-bold">Complete Your Payment</h1>
        <p className="text-gray-600 mt-2">
          Review your registration details and complete payment
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
        {/* Left Side - Bill Details */}
        <Card>
          <CardHeader>
            <CardTitle>Registration Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Registration Name */}
            {registrationName && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900">Registration Name</h4>
                <p className="text-blue-800 font-semibold">{registrationName}</p>
              </div>
            )}

            {/* Runner Details */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Runner Details</h4>
              {runners.map((registration) => (
                <div key={registration.id} className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-medium">
                    {registration.runner.fullName}
                  </p>
                  <p className="text-sm text-gray-600">
                    {registration.runner.email}
                  </p>
                  <p className="text-sm text-gray-600">
                    {registration.runner.phoneNumber}
                  </p>
                  <p className="text-sm text-gray-600">
                    Category: {getCategoryDisplayName(registration.category)}
                  </p>
                  <p className="text-sm text-gray-600">
                    T-shirt: Yes ({registration.runner.tshirtSize})
                  </p>
                </div>
              ))}
            </div>

            <Separator />

            {/* Cost Breakdown */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Cost Breakdown</h4>
              
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
                      <th className="px-2 md:px-4 py-2 md:py-3 text-right text-xs md:text-sm font-medium text-gray-900 border-b border-gray-200">
                        Entry Fee
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {runners.map((registration, index) => (
                      <tr key={registration.id} className="hover:bg-gray-50">
                        <td className="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm text-gray-900">
                          {registration.runner.fullName}
                        </td>
                        <td className="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm text-gray-600">
                          {getCategoryDisplayName(registration.category)}
                        </td>
                        <td className="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm font-medium text-gray-900 text-right">
                          MVR {registration.totalPrice}
                        </td>
                      </tr>
                    ))}
                    
                    {appliedDiscount && (
                      <tr className="bg-green-50">
                        <td className="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm font-medium text-green-800" colSpan={2}>
                          Discount ({appliedDiscount.name})
                        </td>
                        <td className="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm font-medium text-green-700 text-right">
                          -MVR {calculateDiscountAmount().toFixed(0)}
                        </td>
                      </tr>
                    )}
                    
                    <tr className="bg-gray-100 border-t-2 border-gray-300">
                      <td className="px-2 md:px-4 py-2 md:py-3 text-sm md:text-base font-bold text-gray-900" colSpan={2}>
                        Total
                      </td>
                      <td className="px-2 md:px-4 py-2 md:py-3 text-sm md:text-base font-bold text-gray-900 text-right">
                        MVR {calculateFinalAmount()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              {/* Discount Code Section */}
              <div className="mt-4 p-3 md:p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-3 flex items-center">
                  <Tag className="w-4 h-4 mr-2 text-amber-500" />
                  Discount Code
                </h4>
                {!appliedDiscount ? (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter discount code"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                      className="flex-1 bg-white border-blue-300 focus:border-blue-500 focus:ring-blue-500 placeholder:text-blue-400"
                    />
                    <Button
                      onClick={validateDiscountCode}
                      disabled={discountLoading || !discountCode.trim()}
                      className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700"
                    >
                      {discountLoading ? "Validating..." : "Apply"}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                      <div>
                        <p className="font-medium text-green-800 flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          {appliedDiscount.name}
                        </p>
                        <p className="text-sm text-green-700">
                          Code: <span className="font-mono font-semibold">{appliedDiscount.code}</span>
                          {appliedDiscount.type === 'percentage' && (
                            <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              {appliedDiscount.value}% OFF
                            </span>
                          )}
                          {appliedDiscount.type === 'fixed' && (
                            <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              MVR {appliedDiscount.value} OFF
                            </span>
                          )}
                        </p>
                      </div>
                      <Button
                        onClick={removeDiscount}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-800 hover:bg-red-50"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>




          </CardContent>
        </Card>

        {/* Right Side - Payment Options */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Payment Method Selection */}
            <div className="mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  variant={paymentMethod === "card" ? "default" : "outline"}
                  onClick={() => setPaymentMethod("card")}
                  className="flex items-center justify-center"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Debit/Credit Card
                </Button>
                <Button
                  variant={paymentMethod === "banking" ? "default" : "outline"}
                  onClick={() => setPaymentMethod("banking")}
                  className="flex items-center justify-center"
                >
                  <Building2 className="w-4 h-4 mr-2" />
                  Internet Banking
                </Button>
              </div>
            </div>

            {/* Credit/Debit Card Payment */}
            {paymentMethod === "card" && (
              <div className="space-y-6">
                <form onSubmit={handleCardPayment} className="space-y-6">
                  {/* Credit Card Visual */}
                  <div className="aspect-video max-h-[180px] mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 text-white relative overflow-hidden">
                    <div className="absolute top-4 right-4 w-8 h-6 bg-yellow-400 rounded"></div>
                    <div className="mt-8">
                      <div className="text-lg tracking-widest">
                        •••• •••• •••• ••••
                      </div>
                      <div className="mt-4 flex justify-between">
                        <div>
                          <div className="text-xs opacity-75">VALID THRU</div>
                          <div className="text-sm">MM/YY</div>
                        </div>
                        <div>
                          <div className="text-xs opacity-75">CVV</div>
                          <div className="text-sm">•••</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="cardNumber" className="mb-2">Card Number</Label>
                      <Input
                        id="cardNumber"
                        name="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="cardName" className="mb-2">Cardholder Name</Label>
                      <Input
                        id="cardName"
                        name="cardName"
                        placeholder="John Doe"
                        required
                      />
                    </div>

                    <div className="flex flex-row gap-4">
                      <div>
                        <Label htmlFor="expiryMonth" className="mb-2">Month</Label>
                        <Select name="expiryMonth" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Month" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 12 }, (_, i) => (
                              <SelectItem
                                key={i + 1}
                                value={String(i + 1).padStart(2, "0")}
                              >
                                {String(i + 1).padStart(2, "0")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="expiryYear" className="mb-2">Year</Label>
                        <Select name="expiryYear" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Year" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 10 }, (_, i) => (
                              <SelectItem
                                key={i}
                                value={String(new Date().getFullYear() + i)}
                              >
                                {new Date().getFullYear() + i}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="cvv" className="mb-2">CVV</Label>
                        <Input
                          id="cvv"
                          name="cvv"
                          placeholder="123"
                          maxLength={3}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isPending}
                  >
                    {isPending ? "Processing Payment..." : `Pay Now - MVR ${calculateFinalAmount()}`}
                  </Button>
                </form>
              </div>
            )}

            {/* Internet Banking Payment */}
            {paymentMethod === "banking" && (
              <div className="space-y-6">
                {/* Bank Transfer Details */}
                <div className="p-3 md:p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-3 flex items-center">
                    <Building2 className="w-4 h-4 mr-2 text-blue-600" />
                    Bank Transfer Details
                  </h4>
                  <div className="text-sm text-blue-800 space-y-2">
                    <p>
                      <strong>Bank:</strong> Maldivian Heritage Bank
                    </p>
                    <p>
                      <strong>Account Name:</strong> Race Event Organization
                    </p>
                    <p>
                      <strong>Account Number:</strong> 1234567890
                    </p>
                    <p>
                      <strong>Reference:</strong> <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded font-mono font-semibold">RACE-
                      {registrationName ? registrationName.replace(/\s+/g, "").toUpperCase() : 
                       runners[0]?.runner.fullName.replace(/\s+/g, "").toUpperCase()}</span>
                    </p>
                  </div>
                  <div className="mt-3 p-3 bg-amber-50 rounded border border-amber-200">
                    <p className="text-xs text-amber-800">
                      <strong>Important:</strong> Please include the reference number in your transfer and upload the payment slip below.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleBankingPayment} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="paymentSlip">Upload Payment Slip</Label>
                      <div className="mt-2">
                        <div className="flex items-center justify-center w-full">
                          <label
                            htmlFor="paymentSlip"
                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                          >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              {selectedFile ? (
                                <>
                                  <FileImage className="w-8 h-8 mb-2 text-green-500" />
                                  <p className="text-sm text-green-600 font-medium">
                                    {selectedFile.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    File selected successfully
                                  </p>
                                </>
                              ) : (
                                <>
                                  <Upload className="w-8 h-8 mb-2 text-gray-400" />
                                  <p className="mb-2 text-sm text-gray-500">
                                    <span className="font-semibold">
                                      Click to upload
                                    </span>{" "}
                                    payment slip
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    PNG or JPEG (MAX. 5MB)
                                  </p>
                                </>
                              )}
                            </div>
                            <Input
                              id="paymentSlip"
                              name="paymentSlip"
                              type="file"
                              accept=".png,.jpeg,.jpg"
                              onChange={handleFileChange}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-3 md:p-4 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                        <span className="w-2 h-2 bg-amber-400 rounded-full mr-2"></span>
                        Important Instructions:
                      </h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>
                          • Make sure to include the reference number in your
                          transfer
                        </li>
                        <li>• Upload a clear image of your payment slip</li>
                        <li>
                          • Your registration will be confirmed within 24 hours
                          after verification
                        </li>
                        <li>• Keep your payment slip for your records</li>
                      </ul>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-amber-50"
                    size="lg"
                    disabled={isPending}
                  >
                    {isPending
                      ? "Uploading Payment Slip..."
                      : `Submit Payment Slip - MVR ${calculateFinalAmount()}`}
                  </Button>
                </form>
              </div>
            )}

            {submissionMessage && (
              <div
                className={`mt-4 p-3 rounded-md text-center ${submissionMessage.success
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                  }`}
              >
                {submissionMessage.message}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 
