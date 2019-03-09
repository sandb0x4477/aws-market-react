import React, { useState } from 'react';
import { Divider, Grid } from 'semantic-ui-react';

import MarketHeader from '../components/MarketList/MarketHeader';
import MarketList from '../components/MarketList/MarketList';
import Search from '../components/MarketList/Search';

const HomePage = () => {
  const [searchResult, setSearchResult] = useState([]);

  const handleSearchResult = data => {
    setSearchResult(data);
  };

  const handleCloseIcon = () => {
    setSearchResult([]);
  };

  return (
    <>
      <Grid stackable>
        <Grid.Row columns={2}>
          <Grid.Column>
            <MarketHeader />
          </Grid.Column>
          <Grid.Column>
            <Search onSearch={handleSearchResult} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Divider />
      <MarketList searchResult={searchResult} onCloseIcon={handleCloseIcon} />
    </>
  );
};

export default HomePage;
