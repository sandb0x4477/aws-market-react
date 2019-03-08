import React from 'react';
import { Connect } from 'aws-amplify-react';
import { graphqlOperation } from 'aws-amplify';
import { Card, Container } from 'semantic-ui-react';

import { listMarkets } from '../graphql/queries';
import { onCreateMarket } from '../graphql/subscriptions';
import Error from './Error';
import Loading from './Loading';
import MarketListCard from './MarketList/MarketListCard';

const MarketList = () => {
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
        const markets = data.listMarkets.items;

        return (
          <Container className='container-center'>
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
