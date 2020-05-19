<?php
/**
 * Adyen Checkout Example (https://www.adyen.com/)
 * Copyright (c) 2019 Adyen BV (https://www.adyen.com/)
 * /payments Documentation: https://docs.adyen.com/api-explorer/#/PaymentSetupAndVerificationService/v40/payments
 */

/**
 * Make a payment
 */
 function handlePost(e) {
 	common.hide("#threeDSIframe");
 	common.output(e.data, "Data in redirect from issuer");

 	const request = {
 		paymentData: globals.paymentData,
 		details: {
 			MD: e.data.MD[0],
 			PaRes: e.data.PaRes[0]
 		}
 	}

 	if (globals.authenticationOnly) {
 		request.threeDSAuthenticationOnly = true;
 	}

 	request.endpoint = common.endpoints.paymentsDetails;
 	common.AJAXPost(common.SERVER_URL, postRedirectCallback, request);
 }
