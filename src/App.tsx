import React from 'react';

import Emails from "components/emails";
import Search from "components/search";
import { Provider } from "context";

import './App.css';

function App() {
  return (
    <Provider>
      <div className="container">
        <div className="contents">
          <div className="search__wrapper">
            <Search />
          </div>
          <div className="emails__wrapper">
            <Emails />
          </div>
        </div>
      </div>
    </Provider>
  );
}

export default App;
