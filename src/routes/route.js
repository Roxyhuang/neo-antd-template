import React from 'react';
import {
  Router,
  Route,
  // Link,
} from 'react-router-dom';
import { spring, AnimatedSwitch } from 'react-router-transition';
import createBrowserHistory from 'history/createBrowserHistory';
import { asyncComponent } from '../utils/asyncComponent';
import Layout from '../components/containers/layout/Layout';

const history = createBrowserHistory();

// import { syncHistoryWithStore } from 'react-router-redux';
// import { useScroll } from 'react-router-scroll';
// import store from '../core/store';
// const history = syncHistoryWithStore(browserHistory, store);

const ListA = asyncComponent(() => import('../components/containers/list/ListA'));
const ListB = asyncComponent(() => import('../components/containers/list/ListB'));
const ListC = asyncComponent(() => import('../components/containers/list/ListC'));

function mapStyles(styles) {
  return {
    transform: `translate(${styles.scale}%)`,
    'overflow-x': 'hidden',
    position: 'absolute',
  };
}

// wrap the `spring` helper to use a bouncy config
function bounce(val) {
  return spring(val, {
    stiffness: 180,
    damping: 22,
  });
}

// child matches will...
const bounceTransition = {
  atEnter: {
    scale: 300,
  },
  atLeave: {
  },
  atActive: {
    scale: bounce(0),
  },
};

const routes = (
  <Router history={history} key={Math.random()}>
    <Layout history={history}>
      <AnimatedSwitch
        atEnter={bounceTransition.atEnter}
        atLeave={bounceTransition.atLeave}
        atActive={bounceTransition.atActive}
        mapStyles={mapStyles}
        className="switch-wrapper"
      >
        <Route exact path="/" component={ListA} />
        <Route path="/list-b" component={ListB} />
        <Route path="/list-c" component={ListC} />
      </AnimatedSwitch>
    </Layout>
  </Router>
);

export default routes;
