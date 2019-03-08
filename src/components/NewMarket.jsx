import React from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { createMarket } from '../graphql/mutations';
// prettier-ignore
import { Header, Icon, Segment, Button, Modal, Form, Message, Dropdown, Grid, Container } from 'semantic-ui-react';

import { UserContext } from '../App';

const optionsTags = [
  { key: 'art', text: 'Art', value: 'art' },
  { key: 'technology', text: 'Technology', value: 'technology' },
  { key: 'electronics', text: 'Electronics', value: 'electronics' },
  { key: 'sport', text: 'Sport', value: 'sport' },
  { key: 'garment', text: 'Garment', value: 'garment' }
];

class NewMarket extends React.Component {
  state = {
    modal: false,
    name: '',
    tags: [],
    error: '',
    search: ''
  };

  openModal = () => this.setState({ modal: true, error: '' });
  closeModal = () => this.setState({ modal: false });

  handleChange = (event, input) => {
    this.setState({ [input.name]: input.value });
  };

  handleSearch = event => {
    const { search } = this.state;
    event.preventDefault();
    console.log('search:', search);
    this.setState({ search: '' });
  };

  handleSubmit = async user => {
    const { name, tags } = this.state;
    if (name.length > 3) {
      const input = {
        name,
        owner: user.username,
        tags
      };
      const result = await API.graphql(graphqlOperation(createMarket, { input }));
      console.log('result:', result);
      this.setState({ name: '', tags: [] });
      this.closeModal();
    } else {
      console.log('Add a Market Name..., Min 4 charaters...');
      this.setState({
        error: 'Add a Market Name..., Min 4 charaters...'
      });
    }
  };

  render() {
    const { modal, name, error, search } = this.state;
    return (
      <UserContext.Consumer>
        {({ user }) => (
          <>
            <Segment textAlign='center'>
              <Header as='h3' icon textAlign='center' color='blue'>
                <Icon name='add circle' link onClick={this.openModal} />
                <Header.Content>Create Your MarketPlace</Header.Content>
              </Header>
            </Segment>

            <Container className='container-center'>
              <Grid centered>
                <Form onSubmit={this.handleSearch}>
                  <Form.Group>
                    <Form.Input
                      iconPosition='left'
                      icon='search'
                      placeholder='Search...'
                      name='search'
                      value={search}
                      onChange={this.handleChange}
                    />
                    <Form.Button content='Search' />
                  </Form.Group>
                </Form>
              </Grid>
            </Container>

            {/* Add Market Modal */}
            <Modal centered={false} open={modal} onClose={this.closeModal}>
              <Modal.Header>Create New MarketPlace</Modal.Header>
              <Modal.Content>
                <Form error>
                  <Form.Field>
                    <Form.Input
                      label='Name of your MarketPlace'
                      type='text'
                      placeholder="e.g. Tom's Toys"
                      value={name}
                      name='name'
                      onChange={this.handleChange}
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
                      onChange={this.handleChange}
                    />
                  </Form.Field>
                </Form>
              </Modal.Content>
              <Modal.Actions>
                <Button onClick={this.closeModal}>
                  <Icon name='remove' /> Cancel
                </Button>
                <Button color='blue' onClick={() => this.handleSubmit(user)}>
                  <Icon name='checkmark' /> Submit
                </Button>
              </Modal.Actions>
            </Modal>
          </>
        )}
      </UserContext.Consumer>
    );
  }
}

export default NewMarket;
