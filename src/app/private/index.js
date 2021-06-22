import React, {useMemo} from 'react';
import {Route, Switch, Redirect} from 'react-router-dom';
import CollectionPart from "@src/app/private/collection";
import LayoutAdmin from "@src/components/layouts/layout-admin";
import SideMenuContainer from "@src/containers/side-menu";
import useSelectorMap from "@src/utils/hooks/use-selector-map";
import PropTypes from "prop-types";

function Private(props) {

  let parentPath = props.match.path.replace(/\/+$/, '');

  const select = useSelectorMap(state => ({
    meta: state.meta.data,
    wait: state.meta.wait,
  }));

  const routers = useMemo(()=>{
    const names = Object.keys(select.meta);
    let redirect = null;
    let result = [];
    for (const name of names){
      const meta = select.meta[name];
      const routePath = parentPath + meta.route;
      result.push(
        <Route key={name} path={routePath} component={() => <CollectionPart name={name} meta={meta}/>}/>
      );
      if (!redirect) redirect = routePath;
    }
    if (redirect) result.push(<Redirect key="redirect" to={redirect}/>);
    return result;
  },[select.meta, parentPath, props.location]);


  return (
    <LayoutAdmin sider={<SideMenuContainer location={props.location}/>} header={''}>
      <Switch>
        {routers}
      </Switch>
    </LayoutAdmin>
  );
}

Private.propTypes = {
  // Свойства от роутера
  match: PropTypes.object,
  location: PropTypes.object,
};

export default React.memo(Private);



