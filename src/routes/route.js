import React from 'react';
import {
  Router,
  Route,
} from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import { asyncComponent } from '../utils/asyncComponent';

const history = createBrowserHistory();

// import { syncHistoryWithStore } from 'react-router-redux';
// import { useScroll } from 'react-router-scroll';
// import store from '../core/store';
// const history = syncHistoryWithStore(browserHistory, store);

// const Index = asyncComponent(() => import('../components/containers/index/Index'));
const List = asyncComponent(() => import('../components/containers/list/List'));

const routes = (
  <Router history={history} key={Math.random()}>
    <div>
      <Route path="/" component={List} />
      <Route path="/list" component={List} />
    </div>
  </Router>
);

export default routes;
