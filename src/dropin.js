var styleObject = {
    base: {
        fontSmoothing: 'antialiased'
    },
    error: {
        color: 'red'
    },
    placeholder: {
        color: '#d8d8d8'
    },
    validated: {
        color: 'green'
    },
    placeholder: {
        fontSize: '16px',
        fontSmoothing: 'antialiased',
        fontFamily: 'Helvetica',
        padding: '0',
        opacity: '0.6'
    },
    width: '50px'
};

var dropinComponent = getOriginKey().then(originKey => {
    getPaymentMethods().then(paymentMethodsResponse => {
            // 1. Create an instance of AdyenCheckout
            const checkout = new AdyenCheckout(
              {
                showPayButton: true,
                storePaymentMethod: true,
                environment: 'test',
                countryCode: getCountryCode(),
                originKey: originKey,
                paymentMethodsResponse,
                removePaymentMethods: ['paysafecard', 'c_cash', 'wechatpayQR','wechatpayWeb'],
                amount: {
                    currency: getCurrencyCode(),
                    value: getAmount()
                },
                enableStoreDetails: true,
                paypal:{
                  merchantId: 'UZQDU74XMGU56'
                },
                card: {
                    environment: 'test',
                    enableStoreDetails: true,
                    locale: 'en-EN',
                    hasHolderName: true,
                    holderNameRequired: true
                }
            }
          );


            // 2. Create and mount the Component
            const dropin = checkout
                .create('dropin', {

                        style: styleObject,
                        hasHolderName: true,
                        onComplete: state => {
                            console.log('onComplete!')
                        },
                        // Events
                        onSelect: activeComponent => {
                            //updateStateContainer(activeComponent.data); // Demo purposes only
                        },
                        onChange: state => {
                            //updateStateContainer(state); // Demo purposes only
                        },
                        onSubmit: (state, component) => {
                                makePayment(state.data)
                                    //makePayment(state.data, paymentRequest)
                                    .then(response => {
                                        if (response.action) {
                                          // Drop-in handles the action object from the /payments response.
                                          dropin.handleAction(response.action)
                                        } else if (response.resultCode === "Authorised") {
                                            dropin.setStatus('success');
                                        }
                                        else if (response.resultCode=== "Refused") {
                                            dropin.setStatus('error');
                                        }
                                         else {
                                            dropin.setStatus('error');
                                        }
                                    })
                            .catch(error => {
                                console.log('error' + error)
                                throw Error(error);
                            });
                    },
                    onAdditionalDetails: (state, dropin) => {
                        //console.log('onAdditionalDetails!')
                        paymentDetails(state.data)
                            .then(response => {
                              if(JSON.parse(response).resultCode == 'ChallengeShopper'){
                                dropin.handleAction(JSON.parse(response).action);
                              }
                              else {
                                router.push({
                                    name: 'Order Complete',
                                    path: '/orderCompleted'
                                })
                                location.reload();
                              }
                            })
                    },
                    onCancel: (data, dropin) => {
                        dropin.setStatus('ready');
                    },
                    onError: (state, dropin) => {
                        dropin.setStatus('error', {
                            message: 'Something went wrong.'
                        });
                    },
                })
        .mount('#dropin-container')//.$on('onAdditionalDetails', () => { console.log('onAdditionalDetails') })
    });
});
