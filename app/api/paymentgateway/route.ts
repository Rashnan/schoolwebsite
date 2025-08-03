//Backend code used to process payment gateway requests(like BML for now)

import { NextResponse } from 'next/server';

//template for displaying error code 403
const rejectHTML = `
<html><head><title>Forbidden 403</title></head>
<body>
<h1>Forbidden 403</h1>
<p>You are not allowed to make this request</p>
</body></html>
`
async function response403(){

        return new NextResponse(rejectHTML, {
                status: 403,
                headers: {'Content-Type': 'text/html'},
        })
}

//template error for responding to corrupt or malformed requests
async function response400(){
	return NextResponse.json({error: 'Received broken request. Please Contact us for further support.'},{status: 400})
}

export async function GET(req: Request){

	//reject requests that are not defined in this API
	return response403();
	
}

//process requests made by the user/client/the guy who is registering for the marathon
export async function POST(req: Request){

	try {

		//Received Data
		const recData = await req.json();

		//simulation of payment processing. [TO BE SWITCHED TO PAYMENT GATEWAY IMPLEMENTATION]
		if (!recData.amount || !recData.cardHolder) {
			return response400();
		}
		
		return NextResponse.json({message: `Transaction of MVR ${recData.amount} by ${recData.cardHolder} has been processed`}, {status: 200});

	} catch (error) {
		return response400();
	}

}
