import React from 'react';
import { Icon, Button } from 'semantic-ui-react';
import StripeCheckout from 'react-stripe-checkout';
import { API } from 'aws-amplify';

import { convertFromCents } from '../../shared';

const stripeConfig = {
  currency: 'AUD',
  publishKey: process.env.REACT_APP_STRIPE_KEY
};

const PayButton = ({ product, user }) => {
  console.log('product:', product);
  console.log('user:', user);

  const onToken = async token => {
    console.log('token:', token);
    try {
      const result = await API.post('orderlambda', '/charge', {
        body: {
          token,
          charge: {
            currency: stripeConfig.currency,
            amount: product.price,
            description: product.description
          }
        }
      });
      console.log('result:', result);
    } catch (error) {
      console.error('error:', error);
    }
  };

  return (
    <>
      <StripeCheckout
        token={onToken}
        name={product.description}
        amount={product.price}
        currency={stripeConfig.currency}
        stripeKey={stripeConfig.publishKey}
        email={user.attributes.email}
        shippingAddress={product.shipped}
        billingAddress={product.shipped}
        locale='auto'
        allowRememberMe={false}>
        <Button animated='vertical' color='teal' floated='right'>
          <Button.Content visible>${convertFromCents(product.price)}</Button.Content>
          <Button.Content hidden>
            <Icon name='shop' /> Buy
          </Button.Content>
        </Button>
      </StripeCheckout>
    </>
  );
};

export default PayButton;
