//Backend code used to process payment gateway requests(like BML for now)

import { NextResponse } from 'next/server';
import { response400, response403 } from '@/components/error-template';

export async function GET(req: Request){

	//reject requests that are not defined in this API
	return response403();
	
}

//process requests made by the user/client/the guy who is registering for the marathon
export async function POST(req: Request){

	try {

		//Received Data
		const recData = await req.json();
		const cardData = await recData[recData.length - 1];//Get card related data from the client request

		//simulation of payment processing. [TO BE SWITCHED TO PAYMENT GATEWAY IMPLEMENTATION]
		if (!cardData.amount || !cardData.cardHolder) {
			return response400();
		}
		
		console.log(recData);//[DEBUG] for testing only. Prints customer details to the console
		return NextResponse.json({message: `Transaction of MVR ${cardData.amount} by ${cardData.cardHolder} has been processed`}, {status: 200});

	} catch (error) {
		return response400();
	}

}
