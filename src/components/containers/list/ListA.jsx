import React from 'react';
import CSSModules from 'react-css-modules';
import s from './list.less';

class ListA extends React.Component {
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
        <div>A</div>
      </div>

    );
  }
}

export default CSSModules(ListA, s);
