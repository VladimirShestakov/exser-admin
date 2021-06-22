import React, { Fragment, useCallback } from 'react';
import LayoutPage from '@src/components/layouts/layout-page';
import LayoutContent from '@src/components/layouts/layout-content';
import FormLogin from '@src/components/forms/form-login';
import useSelectorMap from '@src/utils/hooks/use-selector-map';
import services from '@src/services';

function Login() {
  const select = useSelectorMap(state => ({
    formLogin: state.formLogin,
  }));

  const callbacks = {
    onChangeForm: useCallback(async data => {
      await services.store.formLogin.change(data);
    }, []),
    onSubmitForm: useCallback(async data => {
      await services.store.formLogin.submit(data);
      // @todo перейти на страницу, с которой был редирект или по умочланию в приватный раздел
      services.navigation.goPrivate();
    }, []),
  };

  return (
    <LayoutPage footer={"Longevity 2021 Created by YLab"}>
      <LayoutContent theme="short">
        <Fragment>
          <h1>Вход</h1>
          <FormLogin
            data={select.formLogin.data}
            errors={select.formLogin.errors}
            wait={select.formLogin.wait}
            onChange={callbacks.onChangeForm}
            onSubmit={callbacks.onSubmitForm}
          />
        </Fragment>
      </LayoutContent>
    </LayoutPage>
  );
}

export default React.memo(Login);
