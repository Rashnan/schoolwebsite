//Webhook api endpoint used to retrieve order status sent by BML payment gateway

import { NextResponse } from 'next/server';
import { response400, response403, sendSuccess } from '@/components/response-template'; //error codes
import { bmlTransState } from '@/lib/bmlConnect'; //Transaction state used by BML webhook
//Library for DB integration

//BML uses POST for webhooks so we can safely add this function for now
export async function GET(req: Request){

    //reject requests that are not defined in this API
	return response403();

}

//Webhook requests pushed by BML(to this server)
export async function POST(reqN: Request){

    try {

        //Get JSON request sent by BML webhook
        const request = await reqN.json()

        //rough work, not finalized
        //Send transaction status to DB to update order status + other tasks
        //(BML)localId is the same as (This Server)orderId
        //if !DB.orderExists(request.localId) then throw error
        //
        //if request.state==bmlTransState.CONFIRMED then DB.sendOrderComplete(request.localId)
        //if request.state==bmlTransState.CANCELLED then DB.sendOrderCancel(request.localId)

        //BML might expect some other response from the server(this)
        //But this will do for now
        return sendSuccess();


    } catch (error) {
        return response400(); //failed to process request
    }

}
