import React from 'react';
import { Box, Button } from "@chakra-ui/core";
import { useHistory } from 'react-router-dom';

import Header from '../Header';

function Operator() {
  const history = useHistory();

  console.log(history);
  return (
    <>
      <Header>
        Hello
      </Header>
      <Box as="main">
        <Button color="black" onClick={() => history.goBack() } >Go Back</Button>
        <Box>
        what is up 
        </Box>
      </Box>
    </>
  );
}

export default Operator;