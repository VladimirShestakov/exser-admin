/**
 * Точка запуска приложения в браузере.
 * Выполняется монтирование приложения к корневому тегу для программного изменения его DOM.
 * Если браузером загружается результаты серверного рендера, то используется режим hydrate для
 * предотвращения начального перерендера, а также инициализируется состояние, переданное сервером.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {Router} from 'react-router-dom';
import configDefault from 'config.js';
import services from '@src/services';
import App from '@src/app';
import mc from 'merge-change';

export async function start(tagId = 'app', config = {}) {
  config = mc.merge(configDefault, config);
  console.log(config);
  let render = ReactDOM.render;

  // Инициализация менеджера сервисов
  // Через него получаем сервисы api, navigation, store и другие
  // При первом обращении к ним, они будут автоматически инициализированы с учётом конфигурации
  await services.init(config);

  // Если есть подготовленные данные от SSR
  if (services.ssr.hasPreloadState()) {
    // Получаем всё состояние, с которым рендерился HTML на сервере и передаём его в сервис store через конфиг
    services.configure({
      store: {
        preloadedState: await services.ssr.getPreloadState(),
      },
    });
    render = ReactDOM.hydrate;
  }

  render(
    <Provider store={services.store.redux}>
      <Router history={services.navigation.history}>
        <App/>
      </Router>
    </Provider>,
    document.getElementById(tagId),
  );
}




