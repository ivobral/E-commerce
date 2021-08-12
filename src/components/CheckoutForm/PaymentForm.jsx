import React, {useState} from 'react';
import { Typography, Button, Divider } from '@material-ui/core';
import Cards from 'react-credit-cards';
import 'react-credit-cards/es/styles-compiled.css';

import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js"

import Review from './Review';



const CARD_OPTIONS = {
    iconStyle: "solid",
    style: {
      base: {
        iconColor: "#c4f0ff",
        color: "#fff",
        fontWeight: 500,
        fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
        fontSize: "16px",
        fontSmoothing: "antialiased",
        ":-webkit-autofill": {
          color: "#fce883"
        },
        "::placeholder": {
          color: "#87bbfd"
        }
      },
      invalid: {
        iconColor: "#ffc7ee",
        color: "#ffc7ee"
      }
    }
  };
  
  const CardField = ({ onChange }) => (
    <div className="FormRow">
      <CardElement options={CARD_OPTIONS} onChange={onChange} />
    </div>
  );
  
  const SubmitButton = ({ processing, error, children, disabled }) => (
    <button
        id="botun"
        className={`SubmitButton ${error ? "SubmitButton--error" : ""}`}
        type="submit"
        disabled={processing || disabled}
    >
      {processing ? "Processing..." : children}
    </button>
  );
  
  const ErrorMessage = ({ children }) => (
    <div className="ErrorMessage" role="alert">
      <svg width="16" height="16" viewBox="0 0 17 17">
        <path
          fill="#FFF"
          d="M8.5,17 C3.80557963,17 0,13.1944204 0,8.5 C0,3.80557963 3.80557963,0 8.5,0 C13.1944204,0 17,3.80557963 17,8.5 C17,13.1944204 13.1944204,17 8.5,17 Z"
        />
        <path
          fill="#6772e5"
          d="M8.5,7.29791847 L6.12604076,4.92395924 C5.79409512,4.59201359 5.25590488,4.59201359 4.92395924,4.92395924 C4.59201359,5.25590488 4.59201359,5.79409512 4.92395924,6.12604076 L7.29791847,8.5 L4.92395924,10.8739592 C4.59201359,11.2059049 4.59201359,11.7440951 4.92395924,12.0760408 C5.25590488,12.4079864 5.79409512,12.4079864 6.12604076,12.0760408 L8.5,9.70208153 L10.8739592,12.0760408 C11.2059049,12.4079864 11.7440951,12.4079864 12.0760408,12.0760408 C12.4079864,11.7440951 12.4079864,11.2059049 12.0760408,10.8739592 L9.70208153,8.5 L12.0760408,6.12604076 C12.4079864,5.79409512 12.4079864,5.25590488 12.0760408,4.92395924 C11.7440951,4.59201359 11.2059049,4.59201359 10.8739592,4.92395924 L8.5,7.29791847 L8.5,7.29791847 Z"
        />
      </svg>
      {children}
    </div>
  );

const PaymentForm = ({ shippingData, checkoutToken, nextStep, backStep, onCaptureCheckout }) => {

    const [number, setNumber] = useState('');
    const [name, setName] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');
    const [focus, setFocus] = useState('');

    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [cardComplete, setCardComplete] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        if (!stripe || !elements) {
          return;
        }
    
        if (error) {
          elements.getElement("card").focus();
          return;
        }
    
        if (cardComplete) {
          setProcessing(true);
        }
    
        const payload = await stripe.createPaymentMethod({
          type: "card",
          card: elements.getElement(CardElement),
        });
    
        setProcessing(false);
    
        if (payload.error) {
          setError(payload.error);
        } else {
          setPaymentMethod(payload.paymentMethod);

          const orderData = {
            line_items: checkoutToken.live.line_items,
            customer: { firstname: shippingData.values.firstName, lastname: shippingData.values.lastName, email: shippingData.values.email },
            shipping: { name: 'International', street: shippingData.values.address1, town_city: shippingData.values.city, county_state: shippingData.shippingSubdivision, postal_zip_code: shippingData.values.zip, country: shippingData.shippingCountry },
            fulfillment: { shipping_method: shippingData.shippingOption },
            payment: {
              gateway: 'stripe',
              stripe: {
                payment_method_id: payload.paymentMethod.id,
              },
            },
          };
    
          onCaptureCheckout(checkoutToken.id, orderData);
    
          nextStep();
        }
    };

    return (
        <>
            <Review checkoutToken={checkoutToken} />
            <Divider />
            <Typography variant="h6" gutterBottom style={{ margin: '20px 0' }}>Payment method</Typography>
                <form className="Form" onSubmit={handleSubmit}>
                <fieldset className="FormGroup">
                <CardField
                    onChange={(e) => {
                    setError(e.error);
                    setCardComplete(e.complete);
                    }}
                />
                </fieldset>
                {error && <ErrorMessage>{error.message}</ErrorMessage>}
                <SubmitButton processing={processing} error={error} disabled={!stripe}>
                Pay {checkoutToken.live.subtotal.formatted_with_symbol}
                </SubmitButton>
            </form>
            
             <Cards 
                 number={number}
                 name={name}
                 expiry={expiry}
                 cvc={cvc}
                 focused={focus}
             />       
             <form>
                 <input 
                     type='tel' 
                     name='number' 
                     placeholder='Card Number' 
                     value={number} 
                     onChange={e => setNumber(e.target.value)}
                     onFocus={e => setFocus(e.target.name)}
                 />
                 <input 
                     type='text' 
                     name='name' 
                     placeholder='Name' 
                     value={name} 
                     onChange={e => setName(e.target.value)}
                     onFocus={e => setFocus(e.target.name)}
                 />
                 <input 
                     type='text' 
                     name='expiry' 
                     placeholder='MM/YY Expiry' 
                     value={expiry} 
                     onChange={e => setExpiry(e.target.value)}
                     onFocus={e => setFocus(e.target.name)}
                 />
                 <input 
                     type='tel' 
                     name='cvc' 
                     placeholder='CVC' 
                     value={cvc} 
                     onChange={e => setCvc(e.target.value)}
                     onFocus={e => setFocus(e.target.name)}
                 />
             </form>
        </>
    );
};
export default PaymentForm
