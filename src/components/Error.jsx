import React from 'react';
import { Segment } from 'semantic-ui-react';

const Error = ({ errors }) => (
  <div>
    {errors &&
      errors.map(({ message }, i) => (
        <Segment inverted color='red' key={i}>
          {message}
        </Segment>
      ))}
  </div>
);

export default Error;
