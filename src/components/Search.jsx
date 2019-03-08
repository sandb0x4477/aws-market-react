import React, { useState } from 'react';
import { Form } from 'semantic-ui-react';

const Search = () => {
  const [searchTerms, setSearchTerms] = useState('');

  const handleChange = (event, input) => {
    setSearchTerms(input.value);
  };

  const handleSearch = () => {
    console.log(searchTerms);
  };

  return (
    <Form onSubmit={handleSearch}>
      <Form.Group>
        <Form.Input
          placeholder='Search...'
          name='search'
          value={searchTerms}
          onChange={handleChange}
          className='search-column'
          size='mini'
          action={{ icon: 'search', color: 'teal' }}
        />
      </Form.Group>
    </Form>
  );
};

export default Search;
