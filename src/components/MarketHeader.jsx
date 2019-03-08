import React from 'react';
import { Icon, Header } from 'semantic-ui-react';

const MarketHeader = () => {
  return (
    <>
      <Header as='h2' color='teal'>
        <Icon name='folder outline' />
        <Header.Content>Markets</Header.Content>
      </Header>
    </>
  );
};

export default MarketHeader;
