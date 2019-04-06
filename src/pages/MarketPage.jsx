import React, { Component } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { Link } from 'react-router-dom';
import { Menu, Header, Icon, Card, Segment } from 'semantic-ui-react';
//  prettier-ignore
import { onDeleteProduct, onCreateProduct, onUpdateProduct } from '../graphql/subscriptions';

import Loading from '../components/Loading';
import NewProduct from '../components/Product/NewProduct';
import Product from '../components/Product/Product';

//#region GetMarket
const getMarket = `query GetMarket($id: ID!) {
  getMarket(id: $id) {
    id
    name
    products {
      items {
        id
        description
        price
        shipped
        owner
        createdAt
        file {
          bucket
          region
          key
        }
      }
      nextToken
    }
    tags
    owner
    createdAt
  }
}
`;
//#endregion

export default class MarketPage extends Component {
  state = {
    market: null,
    loading: false,
    activeItem: 'products',
    isMarketOwner: false
  };

  componentDidMount() {
    this.loadMarket();
    this.createProductListener = API.graphql(graphqlOperation(onCreateProduct)).subscribe(
      {
        next: productData => {
          const createdProduct = productData.value.data.onCreateProduct;
          const prevProducts = this.state.market.products.items.filter(
            item => item.id !== createdProduct.id
          );
          const updatedProducts = [createdProduct, ...prevProducts];
          const market = { ...this.state.market };
          market.products.items = updatedProducts;
          this.setState({ market });
        }
      }
    );
    this.updateProductListener = API.graphql(graphqlOperation(onUpdateProduct)).subscribe(
      {
        next: productData => {
          const updatedProduct = productData.value.data.onUpdateProduct;
          const updatedProductIndex = this.state.market.products.items.findIndex(
            item => item.id === updatedProduct.id
          );
          const updatedProducts = [
            ...this.state.market.products.items.slice(0, updatedProductIndex),
            updatedProduct,
            ...this.state.market.products.items.slice(updatedProductIndex + 1)
          ];
          const market = { ...this.state.market };
          market.products.items = updatedProducts;
          this.setState({ market });
        }
      }
    );
    this.deleteProductListener = API.graphql(graphqlOperation(onDeleteProduct)).subscribe(
      {
        next: productData => {
          const deletedProduct = productData.value.data.onDeleteProduct;
          const updatedProducts = this.state.market.products.items.filter(
            item => item.id !== deletedProduct.id
          );
          const market = { ...this.state.market };
          market.products.items = updatedProducts;
          this.setState({ market });
        }
      }
    );
  }

  componentWillUnmount() {
    this.createProductListener.unsubscribe();
    this.updateProductListener.unsubscribe();
    this.deleteProductListener.unsubscribe();
  }

  loadMarket = async () => {
    // console.log('Fetching data....');
    const input = {
      id: this.props.marketId
    };
    try {
      const result = await API.graphql(graphqlOperation(getMarket, input));
      this.setState({ market: result.data.getMarket, isLoading: false }, () => {
        this.checkMarketOwner();
        this.checkEmailVerified();
      });
    } catch (error) {
      console.log(error);
    }
  };

  checkMarketOwner = () => {
    const { user } = this.props;
    const { owner } = this.state.market;
    if (user && owner) {
      this.setState({ isMarketOwner: owner === user.username });
    }
  };

  checkEmailVerified = () => {
    const { userAttributes } = this.props;
    if (userAttributes) {
      this.setState({ isEmailVerified: userAttributes.email_verified });
    }
  };

  handleTabClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    const { loading, market, activeItem, isMarketOwner } = this.state;
    const { user, marketId, userAttributes } = this.props;

    if (loading || !market) return <Loading inverted={true} />;

    return (
      <>
        <Link to='/'>Back to Makets List</Link>
        <Header as='h3' color='teal'>
          <Icon name='dolly flatbed' />
          <Header.Content>
            {market.name} by {market.owner}
          </Header.Content>
        </Header>
        <Menu tabular attached='top' fluid>
          {isMarketOwner && (
            <Menu.Item
              name='Add Product'
              active={activeItem === 'Add Product'}
              onClick={this.handleTabClick}>
              <Icon name='add' />
              Add Product
            </Menu.Item>
          )}
          <Menu.Item
            name='products'
            active={activeItem === 'products'}
            onClick={this.handleTabClick}>
            <Icon name='th' />
            Products ({market.products.items.length})
          </Menu.Item>
        </Menu>

        {activeItem === 'products' && (
          <Segment attached='bottom'>
            <Card.Group doubling={true} centered={true}>
              {market.products.items.map(product => (
                <Product
                  product={product}
                  key={product.id}
                  user={user}
                  userAttributes={userAttributes}
                />
              ))}
            </Card.Group>
          </Segment>
        )}

        {activeItem === 'Add Product' && <NewProduct user={user} marketId={marketId} />}
      </>
    );
  }
}
