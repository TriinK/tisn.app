import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';

import { UserProvider } from '../UserProvider/UserProvider';

import Navigation from '../Navigation/Navigation';

const App = () => {
  return (
    <BrowserRouter>
      <UserProvider>
        <CssBaseline />
        <Navigation />
      </UserProvider>
    </BrowserRouter>
  );
};

export default App;