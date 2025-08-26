import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { discounts } from '@/db/schemas/discounts';
import { eq, and } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const { code, totalAmount, participantCount } = await request.json();

    if (!code || !totalAmount || !participantCount) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Find the discount code
    const discount = await db
      .select()
      .from(discounts)
      .where(
        and(
          eq(discounts.code, code.toUpperCase()),
          eq(discounts.isActive, true)
        )
      )
      .limit(1);

    if (discount.length === 0) {
      return NextResponse.json(
        { error: 'Invalid discount code' },
        { status: 404 }
      );
    }

    const discountData = discount[0];
    const now = new Date();

    // Check if discount is within valid date range
    if (now < discountData.validFrom || now > discountData.validUntil) {
      return NextResponse.json(
        { error: 'Discount code has expired or is not yet valid' },
        { status: 400 }
      );
    }

    // Check minimum participants requirement
    if (participantCount < (discountData.minParticipants || 1)) {
      return NextResponse.json(
        { 
          error: `This discount requires at least ${discountData.minParticipants || 1} participants` 
        },
        { status: 400 }
      );
    }

    // Calculate discount amount
    let discountAmount = 0;
    
    // Handle decimal values from database more carefully
    let discountValue = 0;
    if (typeof discountData.value === 'string') {
      discountValue = parseFloat(discountData.value);
    } else if (typeof discountData.value === 'number') {
      discountValue = discountData.value;
    } else {
      // Handle decimal object from database
      discountValue = parseFloat(discountData.value.toString());
    }
    
    if (discountData.type.toLowerCase() === 'percentage') {
      discountAmount = (totalAmount * discountValue) / 100;
    } else if (discountData.type.toLowerCase() === 'fixed') {
      discountAmount = discountValue;
    }
    


    // Ensure discount doesn't exceed total amount
    discountAmount = Math.min(discountAmount, totalAmount);

    const finalAmount = totalAmount - discountAmount;

    return NextResponse.json({
      success: true,
      discount: {
        id: discountData.id,
        name: discountData.name,
        code: discountData.code,
        type: discountData.type,
        value: discountData.value,
        discountAmount: discountAmount,
        originalAmount: totalAmount,
        finalAmount: finalAmount
      }
    });

  } catch (error) {
    console.error('Error validating discount:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
