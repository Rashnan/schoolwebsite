import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { registrations } from '@/db/schemas/registrations';
import { runners } from '@/db/schemas/runners';
import { eq } from 'drizzle-orm';

// GET endpoint removed for security - receipts should only be accessed through context after payment

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { registrationName, runners: runnerData, totalAmount, originalAmount, appliedDiscount, paymentMethod } = body;

    // Insert registration
    const [registration] = await db
      .insert(registrations)
      .values({
        registrationName,
        totalAmount,
        paymentStatus: paymentMethod === 'Card Payment' ? 'completed' : 'pending'
      });

    const registrationId = registration.insertId;

    // Insert runners and collect their data
    const insertedRunners = [];
    for (const runner of runnerData) {
      const [insertedRunner] = await db
        .insert(runners)
        .values({
          registrationId: registrationId,
          fullName: runner.runner.fullName,
          email: runner.runner.email,
          phoneNumber: runner.runner.phoneNumber,
          category: runner.category,
          tshirtSize: runner.runner.tshirtSize,
          individualPrice: runner.totalPrice
        });
      
      // Add the inserted runner data to our collection
      insertedRunners.push({
        id: insertedRunner.insertId,
        runner: {
          fullName: runner.runner.fullName,
          email: runner.runner.email,
          phoneNumber: runner.runner.phoneNumber,
          tshirtSize: runner.runner.tshirtSize
        },
        category: runner.category,
        totalPrice: runner.totalPrice
      });
    }

    // Generate server-side receipt ID
    const receiptId = `RCP-${registrationId}-${Date.now()}`;

    // Return complete receipt data
    const receiptData = {
      receiptId,
      registrationName,
      totalAmount,
      originalAmount: originalAmount || totalAmount,
      appliedDiscount: appliedDiscount,
      paymentMethod,
      paymentDate: new Date().toLocaleDateString(),
      runners: insertedRunners
    };

    return NextResponse.json({ 
      success: true, 
      registrationId: registrationId,
      receiptData
    });
  } catch (error) {
    console.error('Error saving receipt:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
