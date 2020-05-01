import './utils/wdyr';

import React, { useState, useMemo } from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import 'normalize.css';
import { ThemeProvider } from "@chakra-ui/core";
import { theme } from "@chakra-ui/core";

import StatsContext from './utils/StatsContext';
import App from './pages/App';
import Operators from './pages/Operator';
import Page404 from './pages/Page404';
import { YESTERDAY } from './constants';

import * as serviceWorker from './serviceWorker';

// Let's say you want to add custom colors
const customTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    brand: {
      900: "#1a365d",
      800: "#153e75",
      700: "#2a69ac",
    },
  },
};

const Index = () => {
  const [data, setData] = useState(null);
  const [reference, setReference] = useState(null);
  const [referenceType, setReferenceType] = useState(YESTERDAY);

  const providerValue = useMemo(() => ({
      data, 
      setData, 
      reference, 
      setReference,
      referenceType,
      setReferenceType,
    }), [
      data, 
      setData, 
      reference, 
      setReference,
      referenceType,
      setReferenceType,
    ]);

  return (
    <React.StrictMode>
    <ThemeProvider theme={customTheme}>
      <StatsContext.Provider value={providerValue}>
        <Router>
          <Switch>
            <Route exact path="/" component={App}/>
            <Route path="/operator/" component={Operators}/>
            <Route path="*" component={Page404} />
          </Switch>
        </Router>
      </StatsContext.Provider>
    </ThemeProvider>
  </React.StrictMode>
  );
}


ReactDOM.render(
  <Index />,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
