import mc from "merge-change";
import BaseState from "@src/services/store/base";
import services from '@src/services';

class SessionState extends BaseState {

  defaultState() {
    return {
      user: {},
      token: null, // Опционально, если используется в http.js
      wait: true,
      exists: false,
      kind: 'default'
    };
  }

  async clear(logoutRequest = true, description = 'Сброс сессии') {
    try {
      if (logoutRequest) {
        if (this.currentState().kind === 'keycloak') {
          await services.keycloak.logout();
        } else {
          await services.api.get('auth').logout();
        }
      }
    } catch (e) {

    }
    // if (services.env.IS_WEB) {
    //   localStorage.removeItem('token');
    // }
    this.resetState({wait: false}, description);
    services.api.setHeader(this.config.tokenHeader, undefined);
  }

  /**
   * Восстановление информации об аккаунте по токену из localStorage
   * @return {Promise<Boolean>}
   */
  async remind() {
    let result = false;
    const token = services.env.IS_WEB ? localStorage.getItem('token') : undefined;
    if (token) {
      // Только для установки токена в http
      await this.save({
        token,
        wait: true,
        exists: false
      }, 'Установка токена из localStore');
      try {
        // Пробуем авторизоваться имеющемся токеном (даже если он JWT)
        const response = await services.api.get('auth').current({});
        await this.save({
          token,
          user: response.data.result,
          wait: false,
          exists: true,
          kind: 'default'
        }, 'Установка данных сессии от сервера');
        result = true;
      } catch (e) {
        await this.clear(false, 'Сброс сессии из-за ответа сервера');
      }
    } else {
      await this.clear(false, 'Сброс сессии из-за отсутствия токена');
    }
    return result;
  }

  /**
   * Восстановление информации об аккаунте или вход через keycloak
   * @return {Promise<Boolean>}
   */
  async remindKeycloak() {
    let result = false;
    try {
      const token = services.env.IS_WEB ? localStorage.getItem('token') : undefined;
      const current = await services.keycloak.login({token});
      await this.save({
        token: current.token,
        user: current.user,
        wait: false,
        exists: true,
        kind: 'keycloak'
      }, 'Установка данных сессии от сервера');

      // Обработка обновления токена
      services.keycloak.onRefreshToken((token) => {
        this.save({token: token, exists: !!token}, 'Обновлен токен');
      });
      result = true;
    } catch (e) {
      await this.clear(false, 'Сброс сессии из-за ответа сервера');
    }
    return result;
  }

  /**
   * Сохранение состояния сессии
   * @param data
   * @param description
   * @return {Promise<void>}
   */
  async save(data, description = 'Установка сессии') {
    if (services.env.IS_WEB) {
      localStorage.setItem('token', data.token);
    }
    this.updateState(mc.patch({exists: true}, data), description);
    services.api.setHeader(this.config.tokenHeader, data.token);
  }
}

export default SessionState;
