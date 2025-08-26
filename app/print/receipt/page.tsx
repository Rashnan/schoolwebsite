"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useReceipt } from "@/contexts/ReceiptContext";

interface ReceiptData {
  registrationName: string;
  runners: any[];
  totalAmount: number;
  paymentMethod: string;
  paymentDate: string;
  receiptId: string;
}

function PrintableReceiptContent() {
  const router = useRouter();
  const { receiptData: contextReceiptData } = useReceipt();
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    // Give some time for context to load
    const timer = setTimeout(() => {
      // Use receipt data from context first
      if (contextReceiptData) {
        setReceiptData(contextReceiptData);
        setIsLoading(false);
        // Auto-print when data is loaded
        setTimeout(() => window.print(), 500);
      } else {
        // Fallback to sessionStorage for print page (when opened in new tab)
        const storedReceiptData = sessionStorage.getItem('printReceiptData');
        if (storedReceiptData) {
          try {
            const parsedData = JSON.parse(storedReceiptData);
            setReceiptData(parsedData);
            setIsLoading(false);
            // Auto-print when data is loaded
            setTimeout(() => window.print(), 500);
            // Clean up sessionStorage after use
            sessionStorage.removeItem('printReceiptData');
          } catch (error) {
            console.error('Error parsing receipt data from sessionStorage:', error);
            router.push('/register');
          }
        } else {
          // No receipt data available, redirect to register
          router.push('/register');
        }
      }
    }, 200); // Small delay to allow context to populate

    return () => clearTimeout(timer);
  }, [isMounted, contextReceiptData, router]);



  const getCategoryDisplayName = (category: string) => {
    const categoryMap: Record<string, string> = {
      "kids-dash": "Kids Dash",
      "5k-race": "5K Race",
      "10k-race": "10K Race",
      "full-marathon": "Full Marathon"
    };
    return categoryMap[category] || category;
  };

  if (!isMounted) {
    return null; // Prevent hydration mismatch
  }

  if (isLoading || !receiptData) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'Arial, sans-serif'
      }}>
        Loading receipt...
      </div>
    );
  }

  return (
    <div style={{
        fontFamily: 'Arial, sans-serif',
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
        lineHeight: '1.6',
        color: '#333',
        backgroundColor: 'white'
      }}>
        {/* Simple Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '30px',
          paddingBottom: '20px'
        }}>
          <div style={{ marginBottom: '15px' }}>
            <Image
              src="/images/mnu-logo.png"
              alt="MNU Logo"
              width={120}
              height={60}
              style={{ display: 'inline-block' }}
            />
          </div>
          <h1 style={{
            color: '#333',
            margin: '10px 0',
            fontSize: '28px',
            fontWeight: 'bold'
          }}>
            MNU Marathon
          </h1>
          <p style={{
            margin: '5px 0',
            color: '#666',
            fontSize: '18px'
          }}>
            Payment Receipt
          </p>
          <p style={{
            margin: '5px 0',
            color: '#666',
            fontSize: '14px'
          }}>
            Receipt ID: {receiptData.receiptId}
          </p>
        </div>

        {/* Registration Info */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '30px',
          marginBottom: '30px'
        }}>
          <div>
            <h3 style={{
              color: '#333',
              marginBottom: '10px',
              fontSize: '16px',
              fontWeight: 'bold'
            }}>
              Registration Details
            </h3>
            <p style={{ margin: '5px 0', fontSize: '14px' }}>
              <strong>Registration Name:</strong> {receiptData.registrationName}
            </p>
            <p style={{ margin: '5px 0', fontSize: '14px' }}>
              <strong>Number of Participants:</strong> {receiptData.runners.length}
            </p>
          </div>
          
          <div>
            <h3 style={{
              color: '#333',
              marginBottom: '10px',
              fontSize: '16px',
              fontWeight: 'bold'
            }}>
              Payment Information
            </h3>
            <p style={{ margin: '5px 0', fontSize: '14px' }}>
              <strong>Payment Date:</strong> {receiptData.paymentDate}
            </p>
            <p style={{ margin: '5px 0', fontSize: '14px' }}>
              <strong>Payment Method:</strong> {receiptData.paymentMethod}
            </p>
          </div>
        </div>

        {/* Participants Table */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{
            color: '#333',
            marginBottom: '15px',
            fontSize: '16px',
            fontWeight: 'bold'
          }}>
            Registered Participants
          </h3>
          
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            border: '1px solid #ddd'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{
                  border: '1px solid #ddd',
                  padding: '12px',
                  textAlign: 'left',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>
                  Participant
                </th>
                <th style={{
                  border: '1px solid #ddd',
                  padding: '12px',
                  textAlign: 'left',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>
                  Category
                </th>
                <th style={{
                  border: '1px solid #ddd',
                  padding: '12px',
                  textAlign: 'left',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>
                  Email
                </th>
                <th style={{
                  border: '1px solid #ddd',
                  padding: '12px',
                  textAlign: 'left',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>
                  T-shirt Size
                </th>
                <th style={{
                  border: '1px solid #ddd',
                  padding: '12px',
                  textAlign: 'right',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>
                  Entry Fee
                </th>
              </tr>
            </thead>
            <tbody>
              {receiptData.runners.map((runner, index) => (
                <tr key={runner.id || index}>
                  <td style={{
                    border: '1px solid #ddd',
                    padding: '12px',
                    fontSize: '14px'
                  }}>
                    {runner.runner.fullName}
                  </td>
                  <td style={{
                    border: '1px solid #ddd',
                    padding: '12px',
                    fontSize: '14px'
                  }}>
                    {getCategoryDisplayName(runner.category)}
                  </td>
                  <td style={{
                    border: '1px solid #ddd',
                    padding: '12px',
                    fontSize: '14px'
                  }}>
                    {runner.runner.email}
                  </td>
                  <td style={{
                    border: '1px solid #ddd',
                    padding: '12px',
                    fontSize: '14px'
                  }}>
                    {runner.runner.tshirtSize}
                  </td>
                  <td style={{
                    border: '1px solid #ddd',
                    padding: '12px',
                    fontSize: '14px',
                    textAlign: 'right'
                  }}>
                    MVR {runner.totalPrice}
                  </td>
                </tr>
                            ))}
            
            {receiptData.appliedDiscount && (
              <tr style={{ backgroundColor: '#f0f9ff' }}>
                <td style={{
                  border: '1px solid #ddd',
                  padding: '12px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#16a34a'
                }} colSpan={4}>
                  Discount ({receiptData.appliedDiscount.name})
                </td>
                <td style={{
                  border: '1px solid #ddd',
                  padding: '12px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#16a34a',
                  textAlign: 'right'
                }}>
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
            
            <tr style={{
              backgroundColor: '#f8f9fa',
              borderTop: '2px solid #ddd'
            }}>
              <td style={{
                border: '1px solid #ddd',
                padding: '12px',
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#333'
              }} colSpan={4}>
                Total Amount Paid
              </td>
              <td style={{
                border: '1px solid #ddd',
                padding: '12px',
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#333',
                textAlign: 'right'
              }}>
                MVR {receiptData.totalAmount}
              </td>
            </tr>
            </tbody>
          </table>
        </div>

        {/* Important Information */}
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #ddd'
        }}>
          <h4 style={{
            color: '#333',
            marginBottom: '10px',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            Important Information
          </h4>
          <ul style={{
            margin: '0',
            paddingLeft: '20px',
            fontSize: '12px',
            color: '#666'
          }}>
            <li>Please keep this receipt for your records</li>
            <li>You will receive a confirmation email within 24 hours</li>
            <li>T-shirts will be distributed on race day</li>
            <li>Race day details will be sent via email</li>
            <li>For any queries, contact us at mnumarathon@mnu.edu.mv</li>
          </ul>
        </div>
      </div>
  );
}

export default function PrintableReceiptPage() {
  return (
    <Suspense fallback={
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'Arial, sans-serif'
      }}>
        Loading receipt...
      </div>
    }>
      <PrintableReceiptContent />
    </Suspense>
  );
}
