//Manages customers orders on server side

//'orderId' used in this endpoint can be used by 'payment' endpoint to perform money transaction via Payment Gateway Service

import { NextResponse } from 'next/server';
import { response400, response403, sendSuccess } from '@/components/response-template'; //error codes

export async function GET(req: Request){

    //reject requests that are not defined in this API
	return response403();

}

//Handle order requests
export async function POST(reqN: Request){

    try {

        //Get Cart processing data
        const request = await reqN.json()

        /*
         * JSON Request Parameters:
         *  {
         *      action:     (string -> What to do with a order, see the switch statement below for details),
         *      orderId:    (string -> Unique identifier of the order),
         *      totalPrice: (number -> Total price of the order, total calculated by client to free up server resources),
         *      cart:       (object -> List of orders made),
         *  }
         */

        /*** Data Verification ***/

        //Verify data action
        if (!request.action){return response400();}//Checks if action is present
        if ((typeof request.action)!='string'){return response400();}//reject if data type is not a string

        if (request.action!='delete'){//Only verify price and cart if the order is not being deleted

            //Verify data totalPrice
            if (!request.totalPrice){return response400();}//Checks if totalPrice is present
            if ((typeof request.totalPrice)!='number'){return response400();}//reject if data type is not a number

            //Verify data cart
            if (!request.cart){return response400();}//Checks if cart is present
            if ((typeof request.cart)!='object'){return response400();}//reject if data type is not an object list

        }

        //Verify data orderId
        if (request.action!='create'){ //We assume that orderId is not valid in this case since it is being created
                                        //so we ignore verifying this

            if (!request.orderId){return response400();}//Checks if orderId is present
            if ((typeof request.orderId)!='string'){return response400();}//reject if data type is not a string

        }

        //What should be done with the Order placed by the client
        switch (request.action) {
            case 'create'://Create order in the server and send orderId to client
                const newOrderId = await createCartOrder()
                console.log(`/api/cart: Order ${newOrderId} created with MVR ${request.totalPrice}`)
                return NextResponse.json({orderId: `${newOrderId}`},{status: 200}); //send server generated orderId to client
            case 'update'://Update an existing order
                console.log(`/api/cart: Order ${request.orderId} updated with MVR ${request.totalPrice}`)
                return sendSuccess();
            case 'delete'://Delete an existing order from server
                console.log(`/api/cart: Order ${request.orderId} removed from server`)
                return sendSuccess();
            default:
                return response400(); //bad action request
        }

    } catch (error) {
        return response400(); //Failed to process request
    }

}

//Generates UUID / Order ID
async function createCartOrder(){ //[DEBUG] must make sure that this ID is unique before saving to DB

    return crypto.randomUUID();
}
