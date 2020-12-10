import React from 'react';
import Alert from '@material-ui/lab/Alert';

const Error = ({ error }) => {
  return <Alert severity='error'>{error}</Alert>;
};

export default Error;