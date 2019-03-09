import React, { useState } from 'react';
import { Form, Icon } from 'semantic-ui-react';
import { API, graphqlOperation } from 'aws-amplify';

import { searchMarkets } from '../../graphql/queries';

const Search = ({ onSearch }) => {
  const [searchTerms, setSearchTerms] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event, input) => {
    setSearchTerms(input.value);
  };

  const handleClear = () => {
    setSearchTerms('');
  };

  const handleSearch = async event => {
    event.preventDefault();
    if (searchTerms === '') {
      return;
    }
    console.log(searchTerms);
    setLoading(true);
    try {
      const result = await API.graphql(
        graphqlOperation(searchMarkets, {
          filter: {
            or: [
              { name: { match: searchTerms } },
              { owner: { match: searchTerms } },
              { tags: { match: searchTerms } }
            ]
          },
          sort: {
            field: 'createdAt',
            direction: 'desc'
          }
        })
      );
      console.log('result:', result.data.searchMarkets.items);
      setLoading(false);
      setSearchTerms('');
      onSearch(result.data.searchMarkets.items);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form onSubmit={handleSearch}>
      <Form.Group>
        <Form.Input
          iconPosition='left'
          icon={
            <Icon name='close' link onClick={handleClear} className='search-clear-icon' />
          }
          placeholder='Search...'
          name='search'
          value={searchTerms}
          onChange={handleChange}
          className='search-column'
          size='mini'
          action={{ icon: 'search', color: 'teal', loading }}
        />
      </Form.Group>
    </Form>
  );
};

export default Search;
