import Keycloak from 'keycloak-js';

/**
 * Сервис спецификаций
 * На текущий момент инкассирует настройку библиотеки ajv для валидации по JSONSchema
 */
class KeycloakService {
  async init(config) {
    this.config = config;
    this.kc = Keycloak(this.config);
    this.kc.onTokenExpired = async () => {
      try {
        await this.kc.updateToken(30);
      } catch (e) {
      }
      for (const callbacks of this.onRefreshTokenListens) {
        callbacks(this.kc.token);
      }
    };
    this.onRefreshTokenListens = [];
    return this;
  }

  async login({token}) {
    await this.kc.init({
      onLoad: 'login-required'/*'check-sso'*/,
      checkLoginIframe: true,
      token
    });
    return {
      token: this.kc.token,
      user: await this.kc.loadUserInfo()
    };
  }

  async logout() {
    return this.kc.logout({});
  }

  onRefreshToken(callback) {
    this.onRefreshTokenListens.push(callback);
  }
}

export default KeycloakService;
