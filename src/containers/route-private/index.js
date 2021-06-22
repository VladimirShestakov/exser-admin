import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route } from 'react-router-dom';
import useSelectorMap from '@src/utils/hooks/use-selector-map';
import useInit from '@src/utils/hooks/use-init';
import services from "@src/services";
import LayoutPage from '@src/components/layouts/layout-page';
import LayoutContent from '@src/components/layouts/layout-content';

function RoutePrivate(props) {
  // Компонент для рендера и параметры роута
  const { component: Component, ...routeProps } = props;

  // Сессия из состояния
  const select = useSelectorMap(state => ({
    session: state.session,
  }));

  useInit(async () => {
    // Вызывается один раз (даже если есть сессия в целях её актуализации)
    await services.store.session.remind();
    //await services.store.session.remindKeycloak();
  });

  // Что рендерить роуту в зависимости от состояния сессии
  routeProps.render = useCallback(props => {
    if (select.session.exists) {
      // Есть доступ
      return <Component {...props} />;
    } else {
      if (!select.session.wait) {
        return <Redirect to={{ pathname: routeProps.failPath, state: { from: props.location } }} />;
      }
      return (
        <LayoutPage footer={"Longevity 2021 Created by YLab"}>
          <LayoutContent theme="short">
              Checking session...
          </LayoutContent>
        </LayoutPage>
      );
    }
  }, [select, Component]);

  return <Route {...routeProps} />;
}

RoutePrivate.propTypes = {
  component: PropTypes.any.isRequired,
  failPath: PropTypes.string,
};

RoutePrivate.defaultProps = {
  failPath: '/login',
};

export default React.memo(RoutePrivate);
