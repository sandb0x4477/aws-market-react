import React from 'react';
import { Link } from 'react-router-dom';

import { Card, Icon, Label, Grid } from 'semantic-ui-react';

const MarketListCard = ({ market }) => {
  console.log('market:', market);
  return (
    <Card>
      <Card.Content>
        <Grid columns='equal'>
          <Grid.Row>
            <Grid.Column>
              <Card.Header as={Link} to={`/markets/${market.id}`}>
                {market.name}
              </Card.Header>
            </Grid.Column>
            <Grid.Column textAlign='right'>
              <Label color='teal'>
                <Icon name='dolly flatbed' />
                {market.products.items.length || '0'}
              </Label>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Card.Meta>
          <span>by {market.owner}</span>
        </Card.Meta>
      </Card.Content>
      <Card.Content extra>
        <Label.Group>
          {market.tags &&
            market.tags.map(tag => (
              <Label key={tag}>
                <Icon name='tag' /> {tag}
              </Label>
            ))}
        </Label.Group>
      </Card.Content>
    </Card>
  );
};

export default MarketListCard;
