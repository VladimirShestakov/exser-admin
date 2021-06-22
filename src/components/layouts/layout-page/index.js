import React from 'react';
import PropTypes from 'prop-types';
import './style.less';
import themes from '@src/utils/themes';

import {Layout} from 'antd';

function LayoutPage(props) {
  return (
    <Layout className={themes('LayoutPage', props.theme)}>
      {props.header && <Layout.Header className="LayoutPage__header">{props.header}</Layout.Header>}
      <Layout.Content className="LayoutPage__content">{props.children || props.content}</Layout.Content>
      {props.footer && <Layout.Footer className="LayoutPage__footer">{props.footer}</Layout.Footer>}
    </Layout>
  );
}

LayoutPage.propTypes = {
  header: PropTypes.node,
  content: PropTypes.node,
  footer: PropTypes.node,
  children: PropTypes.node,
  theme: PropTypes.oneOfType([PropTypes.string, PropTypes.array]), // можно передать несколько тем через пробел или массивом
};

LayoutPage.defaultProps = {
  theme: '',
};

export default React.memo(LayoutPage);
