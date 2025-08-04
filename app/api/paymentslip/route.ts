//Used to process payment slips for users doing account transfers

import { NextResponse } from 'next/server';
import { response400, response403 } from '@/components/error-template';

export async function GET(req: Request){

	//reject requests that are not defined in this API
	return response403();

}

//Receives and processes the payment slip
export async function POST(req: Request){

        try {

            //Received data
            const recData = await req.json();

            // [DEBUG] Will clog up debug console. used for testing only. to be replaced with something practical
            //Displays info only when using payment slip method. will add support for payment gateway method later
            //used to test file/image upload(aka payment slip). file system or DB support to be added later
            console.log(recData)

            return NextResponse.json({message: "Customer data received"},
                                     {status: 200});

        } catch (error) {
            return response400();
        }

}
