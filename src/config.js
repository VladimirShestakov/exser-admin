const isWeb = process.env.TARGET === 'web';
const isProduction = process.env.NODE_ENV === 'production';

let config = {
  // Сервис с методами API
  api: {
    default: {
      // Обычно хост на апи относительный и используется прокси для устранения CORS
      baseURL: isWeb ? '' : 'http://localhost:8140',
      //headers: {},
      //auth:{} base auth
    },
    // Прокси на апи, если режим разработки или ssr без nginx
    proxy: {
      '/api/**': {
        target: 'http://localhost:8140', //'http://example.front.ylab.io',
        secure: false,
        changeOrigin: true,
      },
      '/auth/**': {
        target: 'https://keycloak.dev.longevityplan.com', //'http://example.front.ylab.io',
        secure: false,
        changeOrigin: true,
      }
    },
    // Настройки для конкретных модулей api по их названиям
    endpoints:{
      auth: {

      },
      ssr: {
        baseURL: ''
      }
    }
  },

  keycloak: {
    url: "http://localhost:8031/auth",
    realm: "LongevityTest",
    clientId: "logevity-test-client"
  },

  // Сервис состояний и действий (redux)
  store: {
    log: isWeb && !isProduction, // false,
    preloadState: {},
    // Настройки для конкретных модулей состояния по их названиям
    states: {
      session: {
        tokenHeader: 'X-Token'
      },
      articles: {},
      // Абстрактные модули состояния отключены
      base: {
        disabled: true
      },
      crudList: {
        disabled: true
      }
    }
  },

  // Сервис навигации
  navigation: {
    basename: '/admin/', // /admin/ // если фронт доступен по вложенному пути
    type: isWeb ? 'browser' : 'memory',
  },

  // HTTP сервер при разработки (локальный для горячего обновления фронта)
  devServer: {
    port: 8031,
  },

  // HTTP сервер для рендера
  renderServer: {
    host: 'localhost',
    port: 8132,
    preloadState: true,
  },

  // Сервис рендера на сервере
  // Также используется на клиенте для учёта результатов серверного рендера
  ssr: {
    maxDepth: 10
  }
};

module.exports = config;
