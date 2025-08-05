//Backend code to process tasks related to payments
//Currently supports pseudo Card Provider and Slip method

import { NextResponse } from 'next/server';
import { response400, response403, sendSuccess } from '@/components/response-template'; //error codes

export async function GET(req: Request){

    //reject requests that are not defined in this API
	return response403();

}

//Process payment requests
export async function POST(reqN: Request){

    try {

        //Get Cart processing data
        const request = await reqN.json()

        /*
         * JSON Request Parameters: {
         *
         *      orderId:    (string -> The orderId of the order created in 'cart' endpoint for processing payment)
         *      payMethod:  (string -> How the user is going to pay, see the switch statement below)
         *      base64Slip: (string -> Base64 encoded text of the payment slip image, if 'payMethod' parameter is 'paymentSlip', else this is null or not defined)
         *
         *  }
         */

        /*** Data Verification ***/

        //Verify data orderId
        if (!request.orderId){return response400();}//Checks if orderId is present
        if ((typeof request.orderId)!='string'){return response400();}//reject if data type is not a string

        //Verify data payMethod
        if (!request.payMethod){return response400();}//Checks if payMethod is present
        if ((typeof request.payMethod)!='string'){return response400()}//reject if data type is not a string

        //Verify data base64Slip if user is choosing to pay with payment slip
        if (request.payMethod=='paymentSlip') {
            if (!request.base64Slip){return response400();}//Checks if base64Slip is present
            if ((typeof request.base64Slip)!='string'){return response400()}//reject if data type is not a string
        }

        switch (request.payMethod) {
            case 'paymentSlip':
                console.log(`BASE64 LENGTH: ${request.base64Slip.length}\n/api/payment: Payment slip received via order ${request.orderId}`);
                return sendSuccess();
            case 'card':
                console.log(`/api/payment: Order ${request.orderId} is being processed by the appropriate card provider`);
                return sendSuccess();
            case 'bml':
                console.log('/api/payment: BML payment gateway support not added yet')
                return response400();
            default:
                return response400(); //bad payment method request
        }

    } catch (error) {
        return response400(); //failed to process request
    }

}
