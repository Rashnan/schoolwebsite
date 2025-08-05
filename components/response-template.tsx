//Contains error and success http codes and response data needed to display in the client side / front end

import { NextResponse } from 'next/server';

//template for displaying error code 403
const rejectHTML = `
<html><head><title>Forbidden 403</title></head>
<body style="text-align: center;">
<h1>Forbidden 403</h1>
<hr>
<p>You are not allowed to make this request</p>
</body></html>
`
export async function response403(){

        return new NextResponse(rejectHTML, {
                status: 403,
                headers: {'Content-Type': 'text/html'},
        })
}

//template error for responding to corrupt or malformed requests
export async function response400(){
	return NextResponse.json({error: 'Received broken request. Please Contact us for further support.'},{status: 400})
}

export async function sendSuccess(){
        return NextResponse.json({message: 'success'},{status: 200});
}
