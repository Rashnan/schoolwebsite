//BML Payment Gateway Library

//[DEBUG][NOTE] keys/secrets and URLs are saved in .env.local file

//Required Libraries
const crypto = require('crypto')

//Site will take payments as Maldivian Ruffiyaa
const defaultCurrency = 'MVR'

//Used to make getting BML config values from local environment easier in code
const enum bmlConfig {
    IS_UAT_ENABLED = 'BML_CONNECT_CONFIG_IS_UAT_ENABLED',   //check getBmlApiUrl()
    URL_UAT = 'BML_CONNECT_CONFIG_URL_UAT',                 //check getBmlApiUrl()
    URL_PRODUCTION = 'BML_CONNECT_CONFIG_URL_PRODUCTION',   //check getBmlApiUrl()
    API_SECRET = 'BML_CONNECT_CONFIG_API_SECRET',           //key to access BML api
    APP_VERSION = 'BML_CONNECT_CONFIG_APP_VERSION',         //required according to BML specification
    DEVICE_ID = 'BML_CONNECT_CONFIG_DEVICE_ID',             //required according to BML specification
    REDIRECT_URL = 'BML_CONNECT_CONFIG_REDIRECT_URL',       //required according to BML specification
}

//Transaction states used by BML Webhook to identify the status of an order
//all enum options may not be used but added just in case
const enum bmlTransState {
    QR_CODE_GENERATED = 'QR_CODE_GENERATED',
    CONFIRMED = 'CONFIRMED',
    CANCELLED = 'CANCELLED',
    REFUND_REQUESTED = 'REFUND_REQUESTED',
    REFUNDED = 'REFUNDED',
}

//Returns BML Gateway configuration values from local environment, throws errors if not loaded
function getBMLConfigValue(varName: bmlConfig){

    const requiredVal = process.env[varName]
    if (!requiredVal){
        throw new Error("Failed: Required parameters are missing for BML")
    }

    return requiredVal

}

//Helper function to return BML Gateway's API URL for processing transaction
//Return User Acceptance Testing URL if enabled in local environment
function getBmlApiUrl(): string{

    //must be stored as boolean in local environment
    const testing: boolean = getBMLConfigValue(bmlConfig.IS_UAT_ENABLED) //BML_CONNECT_CONFIG_IS_UAT_ENABLED

    //BML_CONNECT_CONFIG_URL_UAT or BML_CONNECT_CONFIG_URL_PRODUCTION
    return `${(testing)?(getBMLConfigValue(bmlConfig.URL_UAT)):(getBMLConfigValue(bmlConfig.URL_PRODUCTION))}`

}

//SHA1 signature generation based on total price
//the input parameter for this function must be in cents
//for example, for 30 Cents, the input is '30' and for 30 Dollars, the input is '3000'
function getSha1Sign(priceInCents: string): string{//Returns sha1 signature required by BML Connect API

    const rawText = `amount=${priceInCents}&currecny=${defaultCurrency}}&apiKey=${getBMLConfigValue(bmlConfig.API_SECRET)}`
    return crypto.createHash('sha1').update(rawText).digest('base64')

}

//Returns header data required for API endpoint communication with BML
function getBMLDefault_headers(): object{

    return {
            "Authorization": `${getBMLConfigValue(bmlConfig.API_SECRET)}`,
            "Accept": "application/json",
            "Content-Type": "application/json",
        }

}

//Returns request data required by BML api endpoint to start transaction
function getBMLDefault_requestBodyV2(orderId: string, orderAmount: number): object{

    //price by default is stored in dollar format in system/DB, conveniently converted to cents
    const amountInCents: number = orderAmount * 100;

    const tempSignSha1: string = getSha1Sign(`${amountInCents}`);

    return {
            localId: `${orderId}`,                                          //Used to identify orders from server(this) side
            customerReference: ``,                                          //Maybe add this?? will be convenient for customers
            signature: `${tempSignSha1}`,
            amount: Number(amountInCents),                                  //To make sure data type is a number
            currency: `${defaultCurrency}`,
            appVersion: `${getBMLConfigValue(bmlConfig.APP_VERSION)}`,
            apiVersion: "2.0",                                              // v2 according to BML specification
            deviceId: `${getBMLConfigValue(bmlConfig.DEVICE_ID)}`,
            signMethod: "sha1",
            redirectUrl: `${getBMLConfigValue(bmlConfig.REDIRECT_URL)}`     //URL used to show(redirect to) client the payment slip we generated
    }

}

//Returns BML Gateway API response in JSON that contains info on created transaction
async function requestBMLTransaction(orderId: string, orderAmount: number): object{

    try {

        const result = await fetch(getBmlApiUrl(), {
                method: "POST",
                headers: getBMLDefault_headers(),
                body: getBMLDefault_requestBodyV2(orderId, orderAmount),
        })

        if (!result.ok){
            throw new Error(`Failed: BML CONNECT API responded with HTTP error code:${result.status}`)
        }

        const json = await result.json()
        return json;

    } catch (error) {
        console.error("Failed: Cannot proceed with URL retrieval! Check if there are missing BML parameter!\nError Details: ", error)
        throw error;
    }
}

//Get URL to redirect client to BML payment page
export async function getBMLRedirectUrl(orderId: string): string{

    //rough work, not finalized
    //const price: number = DB.getPrice(orderId: string) //Price (in dollars, automatically converted to cents) retrieved from DB integration
    //DB.markAsPaymentInProgress(orderId: string) //Helps in prevention of order item alteration (ie. via cart api endpoint)
    //mark an order successfull in DB when BML webhook responds with success
    //const jsonResposne = requestBMLTransaction(orderId, price)
    //return jsonResponse.url //according to BML API docs, this might be the link that will redirect client to BML payment page

    return `https://example.com/order/${orderId}` //Used for testing. Actual code to be implemented
    //for convenience, URL is available at json().url
    //Assuming 'json()' returns the response JSON from BML servers if request was successful

}





