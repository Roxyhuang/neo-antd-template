import React from 'react';
import { NavBar, Icon } from 'antd-mobile';
import CSSModules from 'react-css-modules';
import s from './list.less';

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
    };
  }

  componentDidMount() {
    // TODO
  }

  render() {
    return (
      <div>
        <NavBar
          mode="light"
          className="am-navbar-title"
          icon={<Icon type="left" />}
          onLeftClick={() => console.log('onLeftClick')}
          rightContent={[
            <Icon key="0" type="search" style={{ marginRight: '16px' }} />,
            <Icon key="1" type="ellipsis" />,
          ]}
        >NavBar</NavBar>
        <div styleName="test">123</div>
        <p className="test">Hello World1Hello World1</p>
        <p className="test">Hello World1Hello World1</p>
        <div onClick={() => { this.props.history.push('/list-a'); }}>ListA</div>
        <div onClick={() => { this.props.history.push('/list-b'); }}>ListB</div>
        <div onClick={() => { this.props.history.push('/list-c'); }}>ListC</div>

      </div>

    );
  }
}

export default CSSModules(Index, s);
