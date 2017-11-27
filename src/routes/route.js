import React from 'react';
import {
  Router,
  Route,
  // Link,
} from 'react-router-dom';
import { NavBar, Icon, Tabs, Badge } from 'antd-mobile';
import { spring, AnimatedSwitch } from 'react-router-transition';
import createBrowserHistory from 'history/createBrowserHistory';
import { asyncComponent } from '../utils/asyncComponent';

const history = createBrowserHistory();

// import { syncHistoryWithStore } from 'react-router-redux';
// import { useScroll } from 'react-router-scroll';
// import store from '../core/store';
// const history = syncHistoryWithStore(browserHistory, store);

// const Index = asyncComponent(() => import('../components/containers/index/Index'));
// const List = asyncComponent(() => import('../components/containers/list/List'));
const ListA = asyncComponent(() => import('../components/containers/list/ListA'));
const ListB = asyncComponent(() => import('../components/containers/list/ListB'));
const ListC = asyncComponent(() => import('../components/containers/list/ListC'));

const tabs = [
  { title: <Badge text={'3'} onClick={(e) => { e.stopPropagation(); history.push('/list-a'); }}>List A</Badge> },
  { title: <Badge text={'今日(20)'} onClick={(e) => { e.stopPropagation(); history.push('/list-b'); }}>List B</Badge> },
  { title: <Badge dot onClick={(e) => { e.stopPropagation(); history.push('/list-c'); }}>List C</Badge> },
];

function mapStyles(styles) {
  return {
    opacity: styles.opacity,
    transform: `scale(${styles.scale})`,
  };
}

// wrap the `spring` helper to use a bouncy config
function bounce(val) {
  return spring(val, {
    stiffness: 330,
    damping: 22,
  });
}

// child matches will...
const bounceTransition = {
  // start in a transparent, upscaled state
  atEnter: {
    opacity: 0,
    scale: 1.2,
  },
  // leave in a transparent, downscaled state
  atLeave: {
    opacity: bounce(0),
    scale: bounce(0.8),
  },
  // and rest at an opaque, normally-scaled state
  atActive: {
    opacity: bounce(1),
    scale: bounce(1),
  },
};

const routes = (
  <Router history={history} key={Math.random()}>
    <div>
      <NavBar
        mode="dark"
        leftContent="Back"
        rightContent={[
          <Icon key="0" type="search" style={{ marginRight: '16px' }} />,
          <Icon key="1" type="ellipsis" />,
        ]}
      >NavBar</NavBar>
      <Tabs
        tabs={tabs}
        initialPage={0}
        onChange={(tab, index) => { console.log('onChange', index, tab); }}
        onTabClick={(tab, index) => { console.log('onTabClick', index, tab); }}
      />
      <AnimatedSwitch
        atEnter={bounceTransition.atEnter}
        atLeave={bounceTransition.atLeave}
        atActive={bounceTransition.atActive}
        mapStyles={mapStyles}
        className="switch-wrapper"
      >
        <Route path="/list-a" component={ListA} />
        <Route path="/list-b" component={ListB} />
        <Route path="/list-c" component={ListC} />
      </AnimatedSwitch>
    </div>
  </Router>
);

export default routes;
