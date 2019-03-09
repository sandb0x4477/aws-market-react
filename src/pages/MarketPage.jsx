import React, { useState, useEffect } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { Link } from 'react-router-dom';
import { Menu, Header, Icon } from 'semantic-ui-react';

import { getMarket } from '../graphql/queries';
import Loading from '../components/Loading';
import NewProduct from '../components/Product/NewProduct';
import Product from '../components/Product/Product';

const MarketPage = props => {
  const [market, setMarket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeItem, setActiveItem] = useState('products');
  const [isMarketOwner, setIsMarketOwner] = useState(false);

  useEffect(() => {
    loadMarket();
  }, []);

  const loadMarket = async () => {
    const input = {
      id: props.marketId
    };
    try {
      const result = await API.graphql(graphqlOperation(getMarket, input));
      console.log('result:', result);
      setMarket(result.data.getMarket);
      setLoading(false);
      checkMarketOwner(result.data.getMarket);
    } catch (error) {
      console.log(error);
    }
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
      {/* <Button labelPosition='left' icon='left chevron' content='Back' as={Link} to='/' /> */}
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

      {activeItem === 'products' &&
        market.products.items.map(product => <Product product={product} />)}
      {activeItem === 'Add Product' && (
        <NewProduct user={props.user} marketId={props.marketId} />
      )}
    </>
  );
};

export default MarketPage;
