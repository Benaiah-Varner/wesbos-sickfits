import styled from 'styled-components';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, Elements, useElements } from '@stripe/react-stripe-js';
import SickButton from './styles/SickButton';
import { useState } from 'react';
import { useStripe } from '@stripe/react-stripe-js';
import nProgress from 'nprogress';
import gql from 'graphql-tag';
import { useRouter } from 'next/router';
import { useMutation } from '@apollo/client';
import {useCart} from '../lib/CartState'
import {CURRENT_USER_QUERY} from './User';

const CheckoutFormStyles = styled.form`
  box-shadow: 0 1px 2px 2px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 5px;
  padding: 1rem;
  display: grid;
  grid-gap: 1rem;
`;

const CREATE_ORDER_MUTATION = gql`
    mutation CREATE_ORDER_MUTATION($token: String!) {
      checkout(token: $token) {
        id
        charge
        total
        items {
          id
          name
        }
      }
    }
 `;

const stripeLib = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

function CheckoutForm() {
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const elements = useElements();
  const stripe = useStripe();
  const router = useRouter();
  const { closeCart } = useCart();
  const [checkout, {error: graphQlError}] = useMutation(CREATE_ORDER_MUTATION, {
    refetchQueries: [{ query: CURRENT_USER_QUERY }]
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // need to stop the form from submitting and turn the loader on
    // start the page transistion
    nProgress.start();
    // create the payment method via stripe, return an token on sucess
    // handle any errors from stripe
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });
    if (error) {
        setError(error);
        nProgress.done();
        console.log(error);
        return;
    }
    // send the token from step 3 to keystone via custom mutation
    const order = await checkout({
      variables: {
        token: paymentMethod.id
      }
    });
    console.log(order);
    // change the page to view the order
    router.push(`/order/${order.data.checkout.id}`);
    closeCart();
    setLoading(false)
    // change page view to order
    nProgress.done();
  };

  return (
    <CheckoutFormStyles onSubmit={handleSubmit}>
        {error && <p style={{ fontSize: "12px" }}>{error.message}</p>}
        {graphQlError && <p style={{ fontSize: "12px" }}>{graphQlError.message}</p>}
      <CardElement />
      <SickButton>Check Out Now</SickButton>
    </CheckoutFormStyles>
  );
}

function Checkout() {
  return (
    <Elements stripe={stripeLib}>
      <CheckoutForm />
    </Elements>
  );
}

export default Checkout;
