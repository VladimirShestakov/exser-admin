import React, {useCallback, useMemo} from 'react';
import useSelectorMap from '@src/utils/hooks/use-selector-map';
import mc from 'merge-change';
import services from "@src/services";
import {Menu} from 'antd';
import * as icons from '@ant-design/icons';
import PropTypes from "prop-types";
import detectActiveKeys from "@src/utils/detect-active-keys";

function SideMenuContainer(props) {

  const {pathname} = props.location;

  const select = useSelectorMap(state => ({
    menu: state.meta.menu,
    data: state.meta.data,
    wait: state.meta.wait,
  }));

  const renderItems = useCallback((items) => {
    let result = [];
    if (items) {
      const keys = Object.keys(items);
      for (const key of keys) {
        const item = items[key];
        const Icon = icons[item.icon] ? React.createElement(icons[item.icon]) : null;
        if (item.kind === 'group') {
          result.push(
            <Menu.SubMenu key={key} icon={Icon} title={item.title}>{renderItems(item.items)}</Menu.SubMenu>
          );
        } else {
          result.push(
            <Menu.Item key={key} icon={Icon}>{item.title}</Menu.Item>
          );
        }
      }
    }
    return result;
  }, [select.menu, pathname]);

  const active = useMemo(() => detectActiveKeys(select.menu.items, pathname), [select.menu, pathname]);

  const onClick = useCallback((info) => {
    if (info.key === 'exit'){
      services.store.session.clear();
    } else {
      const keyPath = info.keyPath.reverse().join('.items.');
      const itemInfo = mc.utils.get(select.menu.items, keyPath);
      if (itemInfo) {
        if (itemInfo.url) {
          services.navigation.push(itemInfo.url);
        }
      }
    }
  }, [select.menu]);

  return (
    <Menu
      theme={"dark"}
      onClick={onClick}
      defaultOpenKeys={active.expand}
      selectedKeys={active.select}
      mode="inline"
    >{renderItems(select.menu.items)}
      <Menu.Item key="exit">Выход</Menu.Item>
    </Menu>
  );
}

SideMenuContainer.propTypes = {
  // Свойства от роутера
  location: PropTypes.object,
};

export default React.memo(SideMenuContainer);
