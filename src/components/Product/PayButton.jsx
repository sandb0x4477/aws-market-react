import React from 'react';
import { Icon, Button } from 'semantic-ui-react';
import StripeCheckout from 'react-stripe-checkout';
import { API, graphqlOperation } from 'aws-amplify';

import { getUser } from '../../graphql/queries';
import { createOrder } from '../../graphql/mutations';
import { convertFromCents } from '../../shared';

const stripeConfig = {
  currency: 'AUD',
  publishKey: process.env.REACT_APP_STRIPE_KEY
};

const PayButton = ({ product, user, userAttributes }) => {
  // console.log('userAttributes:', userAttributes);
  // console.log('product:', product);
  // console.log('user:', user);

  const getOwnerEmail = async ownerId => {
    try {
      const input = { id: ownerId };
      const result = await API.graphql(graphqlOperation(getUser, input));
      return result.data.getUser.email;
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const onToken = async token => {
    try {
      const ownerEmail = await getOwnerEmail(product.owner);
      // console.log('ownerEmail:', ownerEmail);
      const result = await API.post('orderlambda', '/charge', {
        body: {
          token,
          charge: {
            currency: stripeConfig.currency,
            amount: product.price,
            description: product.description
          },
          email: {
            customerEmail: userAttributes.email,
            ownerEmail,
            shipped: product.shipped
          }
        }
      });
      // console.log('result:', result);
      if (result.charge.status === 'succeeded') {
        let shippingAddress = null;
        if (product.shipped) {
          shippingAddress = createShippingAddress(result.charge.source);
        }
        const input = {
          orderUserId: user.attributes.sub,
          orderProductId: product.id,
          shippingAddress
        };
        const order = await API.graphql(graphqlOperation(createOrder, { input }));
        console.log('Create Order:', order);
      }
    } catch (error) {
      console.error('error:', error);
    }
  };

  const createShippingAddress = source => ({
    city: source.address_city,
    country: source.address_country,
    address_line1: source.address_line1,
    address_state: source.address_state,
    address_zip: source.address_zip
  });

  return (
    <>
      <StripeCheckout
        token={onToken}
        name={product.description}
        amount={product.price}
        currency={stripeConfig.currency}
        stripeKey={stripeConfig.publishKey}
        email={userAttributes.email}
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
