import React, { useState } from 'react';
import { Icon, Button, Modal, Form, Message, Dropdown } from 'semantic-ui-react';
import { API, graphqlOperation } from 'aws-amplify';

import { createMarket } from '../graphql/mutations';

const optionsTags = [
  { key: 'art', text: 'Art', value: 'art' },
  { key: 'technology', text: 'Technology', value: 'technology' },
  { key: 'electronics', text: 'Electronics', value: 'electronics' },
  { key: 'sport', text: 'Sport', value: 'sport' },
  { key: 'garment', text: 'Garment', value: 'garment' }
];

const NewMarketModal = ({ showModal, closeModal, username }) => {
  const [name, setName] = useState('');
  const [tags, setTags] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNameChange = (event, input) => {
    setName(input.value);
  };

  const handleTagsChange = (event, input) => {
    setTags(input.value);
  };

  const handleSubmit = async () => {
    if (name.length > 3) {
      const input = {
        name,
        owner: username,
        tags
      };
      try {
        setLoading(true);
        const result = await API.graphql(graphqlOperation(createMarket, { input }));
        console.log('result:', result);
        setName('');
        setTags([]);
        setLoading(false);
        closeModal();
      } catch (error) {
        console.log(error.message);
        setError('Error adding New Market');
        setLoading(false);
      }
    } else {
      setError('Add a Market Name..., Min 4 charaters...');
    }
  };

  return (
    <Modal centered={false} open={showModal} onClose={closeModal}>
      <Modal.Header style={{ color: 'teal' }}>Create New Market Place</Modal.Header>
      <Modal.Content>
        <Form error>
          <Form.Field>
            <Form.Input
              label='Name of your Market Place'
              type='text'
              placeholder="e.g. Tom's Toys"
              value={name}
              name='name'
              onChange={handleNameChange}
            />
            {error && <Message error content={error} />}
          </Form.Field>
          <Form.Field>
            <Dropdown
              placeholder='Tags'
              fluid
              multiple
              selection
              options={optionsTags}
              name='tags'
              onChange={handleTagsChange}
            />
          </Form.Field>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={closeModal}>
          <Icon name='remove' /> Cancel
        </Button>
        <Button color='teal' onClick={handleSubmit} loading={loading}>
          <Icon name='checkmark' /> Submit
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default NewMarketModal;
