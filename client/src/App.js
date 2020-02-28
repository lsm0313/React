import React, { Component } from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import { home } from './home';
import {adminView} from './adminView';
import {userView} from './userView';
import {NotFound} from './NotFound';
import {searchResult} from './searchResult';
import {DetailsWorkStatus} from './DetailsWorkStatus';
import {WorkStatus} from './WorkStatus';

class App extends Component {
  render() {
    return (
      <div>
        <Router>
          <Switch>
            <Route exact path="/" component={home}/>
            <Route path="/adminView" component={adminView}/>
            <Route path="/userView" component={userView}/>
            <Route path="/searchResult" component={searchResult}/>
            <Route path="/DetailsWorkStatus" component={DetailsWorkStatus}/>
            <Route path="/WorkStatus" component={WorkStatus}/>
            <Route path="" component={NotFound} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;