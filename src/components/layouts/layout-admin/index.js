import React from 'react';
import PropTypes from 'prop-types';
import './style.less';
import themes from '@src/utils/themes';

import {Layout} from 'antd';
const {Sider} = Layout;

function LayoutAdmin(props) {
  return (
    <Layout className={themes('LayoutAdmin', props.theme)}>
      <Sider className="LayoutAdmin__sider" width={250}>{props.sider}</Sider>
      <Layout className="LayoutAdmin__center">
        {props.header && <Layout.Header className="LayoutAdmin__header">{props.header}</Layout.Header>}
        <Layout.Content className="LayoutAdmin__content">{props.children || props.content}</Layout.Content>
        {props.footer && <Layout.Footer className="LayoutAdmin__footer">{props.footer}</Layout.Footer>}
      </Layout>
    </Layout>
  );
}

LayoutAdmin.propTypes = {
  header: PropTypes.node,
  sider: PropTypes.node,
  content: PropTypes.node,
  footer: PropTypes.node,
  children: PropTypes.node,
  theme: PropTypes.oneOfType([PropTypes.string, PropTypes.array]), // можно передать несколько тем через пробел или массивом
};

LayoutAdmin.defaultProps = {
  theme: '',
};

export default React.memo(LayoutAdmin);
