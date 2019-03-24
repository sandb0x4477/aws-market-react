import React, { useState } from 'react';
import { Button, Modal, Form, Radio } from 'semantic-ui-react';
import { API, graphqlOperation } from 'aws-amplify';

import { convertFromCents, convertToCents } from '../../shared';
import { updateProduct } from '../../graphql/mutations';

const EditProduct = ({ open, product, onClose }) => {
  const [updateForm, setUpdateForm] = useState({
    description: product.description,
    price: convertFromCents(product.price),
    shipped: product.shipped
  });

  const [isUpdating, setIsUpdating] = useState(false);

  const handleChange = (e, { name, value }) => {
    setUpdateForm({ ...updateForm, [name]: value });
    console.log('updateForm:', updateForm);
  };

  const handleRadioButton = (e, { name, value }) => {
    if (value === 'true') {
      setUpdateForm({ ...updateForm, [name]: true });
    } else {
      setUpdateForm({ ...updateForm, [name]: false });
    }
  };

  const handleSubmit = async () => {
    console.log('Submitting...', updateForm);
    setIsUpdating(true);
    const input = {
      id: product.id,
      description: updateForm.description,
      price: convertToCents(updateForm.price),
      shipped: updateForm.shipped
    };
    try {
      const result = await API.graphql(graphqlOperation(updateProduct, { input }));
      console.log('updateProduct result:', result);
      setIsUpdating(false);
      onClose();
    } catch (error) {
      console.error('error:', error);
    }
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Modal.Header>Update Product</Modal.Header>
        <Modal.Content>
          <Form onSubmit={handleSubmit}>
            <Form.Group className='form-description'>
              <Form.Input
                className='form-description'
                required
                label='Update product description'
                placeholder='Product description'
                name='description'
                value={updateForm.description}
                onChange={handleChange}
              />
              <Form.Input
                required
                label='Set product price'
                type='number'
                placeholder='Price'
                name='price'
                value={updateForm.price}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group inline>
              <label>Shipped or Emailed?</label>
              <Form.Field
                control={Radio}
                label='Shipped'
                value='true'
                name='shipped'
                checked={updateForm.shipped === true}
                onChange={handleRadioButton}
              />
              <Form.Field
                control={Radio}
                label='Emailed'
                value='false'
                name='shipped'
                checked={updateForm.shipped === false}
                onChange={handleRadioButton}
              />
            </Form.Group>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            color='teal'
            content='Update'
            type='submit'
            onClick={handleSubmit}
            disabled={isUpdating}
            loading={isUpdating}
          />
        </Modal.Actions>
      </Modal>
    </>
  );
};

export default EditProduct;
