import React from "react";
import { Stack, Heading, Flex, Avatar } from "@chakra-ui/core";
import avatar from './avatar.png';


const Header = props => {

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding="1.5rem"
      bg="brand.700"
      color="white"
      {...props}
    >
      <Flex align="center" mr={5}>
        <Heading as="h1" size="lg">
          R6 Daily Data
        </Heading>
      </Flex>
      <Stack align="center" flexDir="row">
        <Heading as="h2" size="md" mr={15}>TheGreatGabsii</Heading>
        <Avatar size="lg" name="TheGreatGabsii" src={avatar} />
      </Stack>
    </Flex>
  );
};

export default Header;