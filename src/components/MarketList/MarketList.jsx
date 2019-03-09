import React from 'react';
import { Connect } from 'aws-amplify-react';
import { graphqlOperation } from 'aws-amplify';
import { Card, Container, Header, Icon } from 'semantic-ui-react';

// import { listMarkets } from '../../graphql/queries';
import { onCreateMarket } from '../../graphql/subscriptions';
import Error from '../Error';
import Loading from '../Loading';
import MarketListCard from './MarketListCard';

const listMarkets = `query ListMarkets(
  $filter: ModelMarketFilterInput
  $limit: Int
  $nextToken: String
) {
  listMarkets(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
        }
        nextToken
      }
      tags
      owner
      createdAt
    }
    nextToken
  }
}
`;

const MarketList = ({ searchResult, onCloseIcon }) => {
  const onNewMarket = (prevQuery, newData) => {
    let updatedQuery = { ...prevQuery };
    const updatedMarketList = [newData.onCreateMarket, ...prevQuery.listMarkets.items];
    updatedQuery.listMarkets.items = updatedMarketList;

    return updatedQuery;
  };

  return (
    <Connect
      query={graphqlOperation(listMarkets)}
      subscription={graphqlOperation(onCreateMarket)}
      onSubscriptionMsg={onNewMarket}>
      {({ data, loading, errors }) => {
        if (errors > 0) return <Error errors={errors} />;
        if (loading || !data.listMarkets) return <Loading inverted={true} />;
        const markets = searchResult.length > 0 ? searchResult : data.listMarkets.items;
        console.log('markets:', markets);

        return (
          <Container className='container-center'>
            {searchResult.length > 0 && (
              <Header as='h4' color='teal'>
                <Icon name='search' />
                <Header.Content>Found {searchResult.length} results</Header.Content>
                <Icon link name='close' onClick={onCloseIcon} />
              </Header>
            )}
            <Card.Group doubling={true} centered={true}>
              {markets.map(market => (
                <MarketListCard key={market.id} market={market} />
              ))}
            </Card.Group>
          </Container>
        );
      }}
    </Connect>
  );
};

export default MarketList;
