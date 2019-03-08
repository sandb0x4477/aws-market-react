import React, { Component } from 'react';
import { Divider, Grid } from 'semantic-ui-react';

import MarketHeader from '../components/MarketHeader';
import MarketList from '../components/MarketList';
import Search from '../components/Search';

class HomePage extends Component {
  state = {};

  render() {
    return (
      <>
        <Grid stackable>
          <Grid.Row columns={2}>
            <Grid.Column>
              <MarketHeader />
            </Grid.Column>
            <Grid.Column>
              <Search />
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Divider />
        <MarketList />
      </>
    );
  }
}

export default HomePage;
