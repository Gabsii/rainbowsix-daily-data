import { Flex, Image, Text, Link } from '@chakra-ui/core';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';


const SingleOperator = ({operator, reference}) => {
  const name = slugify(operator.name);
  let performanceBackground = "gray.400";
  let performance = 0;

  if(operator && !!operator.time && reference ){
    const gradientSlope = Math.atan((reference.kd - operator.kd)/(reference.winrate - operator.winrate))
    const deltaTime = getPlaytime(reference) - getPlaytime(operator);

    performance = deltaTime > 0 ? gradientSlope / deltaTime : 0;
  }
  
  if(operator.time && performance > 0){
    performanceBackground = "green.500"
  } else if (performance < 0) {
    performanceBackground = "red.600" 
  }

  return (
    <Link color="black" as={RouterLink} to={`/operator/${name}`} isDisabled={!operator.time}>
      <Flex 
        bg={performanceBackground} 
        rounded={3}
        boxShadow="lg"
        alignItems="center" 
        flexDir="column">
        <Image 
          src={operator.images.badge} 
          fallbackSrc="https://via.placeholder.com/150" 
          htmlHeight={128} 
          htmlWidth={128} 
          alignSelf="center"
          style={operator.time ? {} : {filter: 'grayscale(1)'}}
          alt={operator.name}/>
        <Text textAlign="center">
          {`${operator.name} | ${parseInt(Math.round(performance * 100))}%`}
        </Text>
      </Flex>
    </Link>
  )
}

function getPlaytime(operator){
  const time = operator.time.split('h');
  const hours = parseInt(time[0]);
  const minutes = parseFloat(time[1].replace('m','') / 60);

  return hours + minutes;
}

// borrowed from https://gist.github.com/codeguy/6684588#gistcomment-3243980
function slugify(text) {
  return text
    .toString()                     // Cast to string
    .toLowerCase()                  // Convert the string to lowercase letters
    .normalize('NFKC')              // The normalize() method returns the Unicode Normalization Form of a given string.
    .trim()                         // Remove whitespace from both sides of a string
    .replace(/ø|Ø/, 'o')            // Nøkk exception
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-');        // Replace multiple - with single -
}

export default SingleOperator;