import React, { useState } from 'react';
import { Card, Label, Icon, Button, Confirm } from 'semantic-ui-react';
import { S3Image } from 'aws-amplify-react';
import { API, graphqlOperation } from 'aws-amplify';

import { deleteProduct } from '../../graphql/mutations';
import { convertFromCents } from '../../shared';
import EditProduct from './EditProduct';

const Product = ({ product, user }) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showEditModale, setShowEditModale] = useState(false);
  // const [product, setProduct] = useState(false);
  // console.log('product:', product);

  const showConfirmDelete = () => {
    console.log('product:', product.id);
    setConfirmDelete(true);
  };

  const handleConfirmDelete = async () => {
    const { id } = product;
    const input = {
      id
    };
    console.log('input:', input);
    try {
      const result = await API.graphql(graphqlOperation(deleteProduct, { input }));
      // console.log('result:', result);
      setConfirmDelete(false);
    } catch (error) {
      console.log('error:', error);
      setConfirmDelete(false);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDelete(false);
  };

  const isOwner = user && product.owner === user.attributes.sub;

  return (
    <>
      <Card color='orange'>
        <Card.Content>
          {/* <Image src={imgUrl} /> */}
          <S3Image
            imgKey={product.file.key}
            theme={{
              photoImg: { maxWidth: '100%', maxHeight: '100%' }
            }}
          />
          <Card.Header style={{ paddingTop: '14px' }}>{product.description}</Card.Header>
        </Card.Content>
        <Card.Content extra>
          {product.shipped ? (
            <Label>
              <Icon name='mail' /> Emailed
            </Label>
          ) : (
            <Label>
              <Icon name='truck' /> Shipped
            </Label>
          )}
          <Button animated='vertical' color='teal' floated='right'>
            <Button.Content visible>${convertFromCents(product.price)}</Button.Content>
            <Button.Content hidden>
              <Icon name='shop' /> Buy
            </Button.Content>
          </Button>
        </Card.Content>
        {isOwner && (
          <Card.Content extra>
            <div className='ui two buttons'>
              <Button basic color='green' onClick={() => setShowEditModale(true)}>
                Edit
              </Button>
              <Button basic color='red' onClick={showConfirmDelete}>
                Delete
              </Button>
            </div>
          </Card.Content>
        )}
      </Card>
      <Confirm
        open={confirmDelete}
        header='Delete this product?'
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
      <EditProduct
        open={showEditModale}
        product={product}
        onClose={() => setShowEditModale(false)}
      />
    </>
  );
};

export default Product;

// const imgUrl = `https://s3-${product.file.region}.amazonaws.com/${
//   product.file.bucket
// }/public/${product.file.key}`;
