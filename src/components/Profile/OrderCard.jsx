import React from 'react';
import { Card } from 'semantic-ui-react';

import { convertFromCents, formatOrderDate } from '../../shared';

const OrderCard = ({ order }) => {
  return (
    <Card>
      <Card.Content>
        <Card.Header style={{ paddingTop: '14px' }}>
          {order.product.description}
        </Card.Header>
        <Card.Meta>
          <p>Order Id: {order.id}</p>
          <p>Price: {convertFromCents(order.product.price)}</p>
          <p>Purchased on: {formatOrderDate(order.createdAt)}</p>
        </Card.Meta>
      </Card.Content>
      <Card.Content extra>
        {order.shippingAddress ? (
          <div>
            Shipping Address:
            <p>{order.shippingAddress.address_line1}</p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.address_state}{' '}
              {order.shippingAddress.country} {order.shippingAddress.address_zip}
            </p>
          </div>
        ) : (
          <p>Product shipped by email</p>
        )}
      </Card.Content>
    </Card>
  );
};

export default OrderCard;
