import React, { useState, useEffect } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { Link } from 'react-router-dom';
import { Menu, Header, Icon, Card, Segment } from 'semantic-ui-react';

// import { getMarket } from '../graphql/queries';
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

const MarketPage = props => {
  const [market, setMarket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeItem, setActiveItem] = useState('products');
  const [isMarketOwner, setIsMarketOwner] = useState(false);

  console.log('Rendering....', market);

  useEffect(() => {
    // console.log('market:', market);
    loadMarket();
    // productListener(market);
  }, []);

  useEffect(() => {
    return () => {
      console.log('Unmount...');
    };
  }, []);

  const loadMarket = async () => {
    console.log('Fetching data....');
    const input = {
      id: props.marketId
    };
    try {
      const result = await API.graphql(graphqlOperation(getMarket, input));
      // console.log('result:', result);
      setMarket(result.data.getMarket);
      // console.log('products:', market);
      setLoading(false);
      checkMarketOwner(result.data.getMarket);
      // checkMarketOwner();
      productListener(result.data.getMarket);
    } catch (error) {
      console.log(error);
    }
  };

  const productListener = data => {
    console.log('MarketProducts:', data.products.items);
    API.graphql(graphqlOperation(onCreateProduct)).subscribe({
      next: productData => {
        const createdProduct = productData.value.data.onCreateProduct;
        // console.log('createdProduct:', createdProduct);

        // const prevProducts = market.products.item.filter(
        //   item => item.id !== createdProduct.id
        // );
        // const updatedProducts = [createdProduct, ...prevProducts];
        // const updatedMarket = [createdProduct, ...market];
        // setMarket(updatedMarket);
      }
    });
  };

  const checkMarketOwner = market => {
    const { user } = props;
    const { owner } = market;
    if (user || owner) {
      setIsMarketOwner(owner === user.username);
    }
  };

  const handleTabClick = (e, { name }) => setActiveItem(name);

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
            onClick={handleTabClick}>
            <Icon name='add' />
            Add Product
          </Menu.Item>
        )}
        <Menu.Item
          name='products'
          active={activeItem === 'products'}
          onClick={handleTabClick}>
          <Icon name='th' />
          Products ({market.products.items.length})
        </Menu.Item>
      </Menu>

      {activeItem === 'products' && (
        <Segment attached='bottom'>
          <Card.Group doubling={true} centered={true}>
            {market.products.items.map(product => (
              <Product product={product} key={product.id} user={props.user} />
            ))}
          </Card.Group>
        </Segment>
      )}

      {activeItem === 'Add Product' && (
        <NewProduct user={props.user} marketId={props.marketId} />
      )}
    </>
  );
};

export default MarketPage;
