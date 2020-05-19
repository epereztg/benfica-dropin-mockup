//const paymentsDefaultConfig = {
//import store from './script'

const defaultCurrency = 'EUR'
const defaultCountry = 'PT'
const defaultAmount = 100
const defaultShopperLocale = 'es-ES'

const getCountryCode = () => {
    return defaultCountry;
}
const getCurrencyCode = () => {
    return defaultCurrency;
}
const savePaymentData = (paymentData = {}) => {
  localStorage.setItem('paymentData', paymentData)
}
const getPaymentData = () => {
  return localStorage.getItem('paymentData')
}
const saveAmount = (amount = {}) => {
  localStorage.setItem('defaultAmount', amount)
}
const getAmount = () => {
  return localStorage.getItem('defaultAmount')
}
const paymentMethodsConfig = {
    //shopperReference: 'Checkout Components sample code test',
    reference: 'Checkout Components KIOSK',
    countryCode: defaultCountry,
    amount: {
        value: defaultAmount,
        currency: defaultCurrency
    },
    merchantId: 'MH5P3AYBGR47S',
    paypal: {
        merchantId: 'UZQDU74XMGU56',
        environment: "test",
        countryCode: defaultCountry,
        amount: {
            currency: defaultCurrency,
            value: defaultAmount
        }
    }
};

const paymentsDefaultConfig = {
    //shopperReference: 'Checkout Components sample code test',
    reference: 'Checkout Components COFEEKIOSK',
    channel: 'Web',
    returnUrl: 'http://localhost:3030/#/review',
    origin: 'http://localhost:3030/#/review',
    reference:'KIOSK-COMPONENTS',
    shopperReference:'paybylink_shopperreference',
    shopperEmail:'elena.pereztoril@adyen.com',
    countryCode: defaultCountry,
    amount: {
        value: defaultAmount,
        currency: defaultCurrency
    },
    shopperLocale: defaultShopperLocale ,
    //storePaymentMethod: true,
    card: {
      showPayButton:false,
      hasHolderName: true,
      locale: defaultShopperLocale,
    },
    paypal: {
        merchantId: 'UZQDU74XMGU56',
        environment: "test",
        countryCode: "ES",
        amount: {
            currency: "defaultCurrency",
            value: 100
        },
    },

    ideal: { // Optional configuration for iDEAL
        showImage: true, // Optional. Set to **false** to remove the bank logos from the iDEAL form.
        issuer: "0031" // // Optional. Set this to an **id** of an iDEAL issuer to preselect it.
    },
     shopperIP:'127.0.0.1',
     channel:'web',
    lineItems: [
        {
            id: '1',
            description: 'Test Item 1',
            amountExcludingTax: 100,
            amountIncludingTax: 118,
            taxAmount: 1800,
            taxPercentage: 1800,
            quantity: 1,
            taxCategory: 'High'
        }
    ]
};
const httpPostnoJson = (endpoint, data) =>
    fetch(`/${endpoint}`, {
    //fetch('https://cors-anywhere.herokuapp.com/https://checkout-test.adyen.com/v52/payment/details', {
        method: 'POST',
        headers: {
           //'x-api-key': 'AQEyhmfxJ4nNahZBw0m/n3Q5qf3VaY9UCJ1+XWZe9W27jmlZioAYf+2FreEhmT7Cir0XxJkQwV1bDb7kfNy1WIxIIkxgBw==-XTmw1r1ZnD/6UzAw1cJNMD2rAamgo6u8VBkEsQtmSHU=-NGN65Cs8e2urFAvR' ,
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(res => res.text())      ;    // convert to plain text

// Generic POST Helper
const httpPost = (endpoint, data) =>
    fetch(`/${endpoint}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => response.json());//.then(response => console.log('Response '+response))

// Get all available payment methods from the local server
const getPaymentMethods = () =>
    httpPost('paymentMethods', paymentMethodsConfig)
        .then(response => {
            if (response.error) throw 'No paymentMethods available';

            return response;
        })
        .catch(console.error);

// const makePayment = (paymentMethod, config = {}) => {
//     //const paymentsConfig = { ...config };
//     const paymentsConfig = { ...paymentsDefaultConfig, ...config };
//     const paymentRequest = { ...paymentsConfig, ...paymentMethod };
//
//     paymentRequest.amount.value = parseInt(getAmount());
//     paymentRequest.amount.currency = getCurrencyCode();
//
//     return httpPost('payments', paymentRequest)
//         .then(response => {
//             if (response.error) throw 'Payment initiation failed';
//
//             return response;
//         })
//         .catch(console.error);
// };

const handlePostMessage = (e) => {
    console.log('EVENTDATA: '+e)
};


const paymentDetails = (paymentData, details = {}) => {

  var paymentRequest =
  {
      paymentData: paymentData,
      details: {
        payload: details
      }
    }
     paymentRequest = { ...paymentRequest, ...{} };


    //updateRequestContainer(paymentRequest);

    return httpPostnoJson('payments/details', paymentRequest)
        .then(response => {
            //console.log('response payment details'+response);
            if (response.error) throw 'Payment initiation failed';


            return response;
        }).
        catch(console.error);
};

// Fetches an originKey from the local server
const getOriginKey = () =>
    httpPost('originKeys')
        .then(response => {
            if (response.error || !response.originKeys) throw 'No originKey available';

            return response.originKeys[Object.keys(response.originKeys)[0]];
        })
        .catch(console.error);
