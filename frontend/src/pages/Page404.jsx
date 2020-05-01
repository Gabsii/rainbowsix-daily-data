import React from 'react';
import { Box } from "@chakra-ui/core";

import Header from '../Header';

function Page404() {
  return (
    <>
      <Header>
        Hello
      </Header>
      <Box as="main">
        Oy mate what are you doing? You are out of your reach mate!
      </Box>
    </>
  );
}

export default Page404;