import React from 'react';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import { Button, Menu, Icon, Segment, Card } from 'semantic-ui-react';
import OrderCard from '../components/Profile/OrderCard';

//#region getUser
const getUser = `query GetUser($id: ID!) {
  getUser(id: $id) {
    id
    username
    email
    registered
    orders(sortDirection: DESC, limit: 999) {
      items {
        id
        createdAt
        product {
          id
          owner
          price
          createdAt
          description
        }
        shippingAddress {
          city
          country
          address_line1
          address_state
          address_zip
        }
      }
      nextToken
    }
  }
}
`;
//#endregion

class ProfilePage extends React.Component {
  state = {
    email: this.props.userAttributes && this.props.userAttributes.email,
    emailDialog: false,
    verificationCode: '',
    verificationForm: false,
    orders: [],
    activeItem: 'orders'
  };

  componentDidMount() {
    if (this.props.userAttributes) {
      this.getUserOrders(this.props.userAttributes.sub);
    }
  }

  getUserOrders = async userId => {
    const input = { id: userId };
    const result = await API.graphql(graphqlOperation(getUser, input));
    this.setState({ orders: result.data.getUser.orders.items });
  };

  handleTabClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    const { activeItem, orders } = this.state;
    return (
      <>
        <Menu tabular attached='top' fluid>
          <Menu.Item
            name='profile'
            active={activeItem === 'profile'}
            onClick={this.handleTabClick}>
            <Icon name='user' />
            Profile
          </Menu.Item>
          <Menu.Item
            name='orders'
            active={activeItem === 'orders'}
            onClick={this.handleTabClick}>
            <Icon name='th' />
            Orders
          </Menu.Item>
        </Menu>

        {activeItem === 'profile' && (
          <Segment attached='bottom'>
            <Card.Group doubling={true} centered={true}>
              {/* {market.products.items.map(product => (
                <Product

                  key={product.id}
                  user={user}
                  userAttributes={userAttributes}
                />
              ))} */}
            </Card.Group>
          </Segment>
        )}

        {activeItem === 'orders' && (
          <Segment attached='bottom'>
            <Card.Group doubling={true} centered={true}>
              {orders.map(order => (
                <OrderCard key={order.id} order={order} />
              ))}
            </Card.Group>
          </Segment>
        )}
      </>
    );
  }
}

export default ProfilePage;
