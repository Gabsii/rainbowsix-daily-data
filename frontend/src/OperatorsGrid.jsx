import React, { useContext, useMemo } from 'react';
import { Button, Flex, Grid } from '@chakra-ui/core';
import SingleOperator from './SingleOperator';
import StatsContext from './utils/StatsContext';

const OperatorsGrid = ({type}) => {

  const { data, reference } = useContext(StatsContext);

  const operators = useMemo(() => ( data ? data[type] : null), [data, type])
  const operatorsReference = useMemo(() => ( reference ? reference[type] : null), [reference, type])

  if(!operators || !reference) {
    console.log("no data");
    return (<div>Loading...</div>)
  }

  return (
    <div>
      <Flex align="center" justify="center" mt={10}>
        <Button isActive>Yesterday</Button>
        <Button>Last Week</Button>
        <Button>Last Month</Button>
      </Flex>
      <Grid templateColumns={{xs: "repeat(1, 1fr)", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(4, 1fr)"}} gap={10} p={25}>
        { operators.map((operator, index) => (
          <SingleOperator 
          operator={operator} 
          reference={correctReference(operator.name, operatorsReference)}
          key={index} />
          )
          )}
      </Grid>
    </div>
  );
}

const correctReference = (name, referenceArray) => { 
  return referenceArray.filter(ref => ref.name === name)[0]
}

OperatorsGrid.whyDidYouRender = true;

export default OperatorsGrid;