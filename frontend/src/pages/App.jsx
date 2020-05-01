import React, { useEffect, useContext } from 'react';
import { Box, Tabs, TabList, TabPanels, Tab, TabPanel} from "@chakra-ui/core";

import Header from '../Header';
import General from '../General';
import OperatorsGrid from '../OperatorsGrid';
import StatsContext from '../utils/StatsContext';
import getTodayData from '../utils/getTodayData';

function App() {
    const { referenceType, setData, setReference } = useContext(StatsContext);

    useEffect(() => {
      async function fetchData() {
        const operatorData = await getTodayData(referenceType);
        setData(operatorData.data);
        setReference(operatorData.reference);
      }
      fetchData();
    }, [referenceType, setData, setReference]);

  return (
    <>
      <Header>
        Hello
      </Header>
      <Box as="main">
      {/* TODO: set defaultIndex via history state */}
      <Tabs isFitted defaultIndex={1}>
        <TabList>
          <Tab
            color="black" 
            textDecor="none" 
            to="#">
              General
          </Tab>
          <Tab 
            color="black" 
            textDecor="none" 
            to="#attackers">
              Attackers
          </Tab>
          <Tab 
            color="black" 
            textDecor="none" 
            to="#defenders">
              Defenders
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <General />
          </TabPanel>
          <TabPanel>
            <OperatorsGrid type="attackers"/>
          </TabPanel>
          <TabPanel>
            <OperatorsGrid type="defenders"/>
          </TabPanel>
        </TabPanels>
      </Tabs>
      </Box>
    </>
  );
}

App.whyDidYouRender = true;

export default App;