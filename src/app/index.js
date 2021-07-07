import 'antd/dist/antd.css';
import React, { Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import RoutePrivate from '@src/containers/route-private';
import Modals from '@src/app/modals';
import Login from '@src/app/login';
import Private from '@src/app/private';
import NotFound from '@src/app/not-found';
import useInit from "@src/utils/hooks/use-init";
import services from "@src/services";

function App() {

  useInit(async ()=>{
    await services.store.get('meta').load();
  });

  return (
    <Fragment>
      <Helmet>
        <title>Admin</title>
      </Helmet>
      <Switch>
        <Route path="/login" component={Login} />
        <RoutePrivate path="/" failpath="/login" component={Private} />
        <Route component={NotFound} />
      </Switch>
      <Modals />
    </Fragment>
  );
}

export default React.memo(App);
