import mc from "merge-change";
import listToTree from "@src/utils/list-to-tree";
import BaseState from "@src/services/store/base";
import services from '@src/services';

class CategoriesState extends BaseState{

  defaultState() {
    return {
      items: [],
      roots: [],
      wait: false,
      errors: null,
    };
  }

  /**
   * Загрузка списка из апи
   * @param params Параметры запроса
   * @returns {Promise<*>}
   */
  async load(params) {
    this.updateState({wait: true, errors: null}, 'Статус ожидания');
    try {
      const response = await services.api.get('categories').findMany(params);
      const result = response.data.result;
      this.updateState(mc.patch(result, {roots: listToTree(result.items), wait: false, errors: null}), 'Категории загружены');
      return result;
    } catch (e) {
      if (e.response?.data?.error?.data) {
        this.updateState({wait: false, errors: e.response.data.error.data.issues}, 'Ошибка от сервера');
      } else {
        throw e;
      }
    }
  }
}

export default CategoriesState;
