import React, { Component } from 'react';
import PropTypes from 'prop-types';
import themes from '@src/utils/themes';

import './style.less';

class LayoutContent extends Component {
  static propTypes = {
    children: PropTypes.node,
    theme: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  };

  static defaultProps = {
    theme: ['default'],
  };

  render() {
    const { children, theme } = this.props;
    return <div className={themes('LayoutContent', theme)}>{children}</div>;
  }
}

export default LayoutContent;
