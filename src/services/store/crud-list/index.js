import mc from "merge-change";
import BaseState from "@src/services/store/base";
import services from '@src/services';

/**
 * Модуль спика с параметрами и методами добавления, удаления, редактирования элемента в списке.
 * Принцип работы: меняются параметры выборки (фильтры, сортировка...) -> меняется список.
 */
class CRUDListState extends BaseState {

  constructor(config) {
    super(config);
    this.validator = services.spec.createValidator(this.schemaParams());
    this.api = services.api.get(this.config.apiEndpoint);
    this.temporyIds = 0;
  }

  /**
   * Конфигурация по умолчанию
   * @return {Object}
   */
  defaultConfig() {
    return mc.patch(super.defaultState(), {
      apiEndpoint: 'crud' // абстрактный endpoint
    });
  }

  /**
   * Начальное состояние
   * @return {Object}
   */
  defaultState() {
    return {
      items: [],
      count: 0,
      params: {
        limit: 20,
        page: 1,
        sort: {'date': 'asc'},
        fields: `items(*), count`,
        filter: {
          query: undefined, // поиск по строке
        }
      },
      wait: false,
      errors: null,
      changes: false
    };
  }

  /**
   * Описание используемых параметров в location (URL) после ?
   * Правила преобразования
   * @return {Object}
   */
  schemaParams() {
    return {
      type: 'object',
      properties: {
        limit: {type: 'integer', minimum: 1},
        page: {type: 'integer', minimum: 1},
        sort: {type: 'object', additionalProperties: {enum: ['asc', 'desc']}},
        filter: {
          type: 'object',
          properties: {
            query: {type: 'string'}
          },
          additionalProperties: {type: 'string'}
        }
      }
    };
  }

  /**
   * Инициализация параметров и данных
   * К начальным параметрам сливаются сохраненные из location.search и переданные в params
   * @param params {Object} Новые параметры. Переопределяют начальные и сохраненные параметры
   * @returns {Promise}
   */
  async initParams(params = {}) {
    // В основе начальные параметры
    const defaultParams = this.defaultState().params;
    // Параметры из URL (query string)
    const queryParams = this.validateParams(services.navigation.getSearchParams()[this.config.name]);
    // Сливаем все параметры
    const newParams = mc.merge(defaultParams, queryParams, params);
    // Установка параметров и загрузка данных по ним
    return this.setParams(newParams, {merge: false, remember: false, load: true});
  }

  /**
   * Сброс состояния
   * @param params {Object} Новые параметры. Переопределяют начальные параметры
   * @param options {Object} Опции, влияющие на логику смены параметров и загрузки новых данных
   *   remember {Boolean|'replace'|'push'} Сохранить параметры в location.search. Способ добавления истории адресов
   *   load {Boolean} Загружать данные по новым параметрам
   *   clear {Boolean} Сбросить текущие данные
   * @returns {Promise}
   */
  async resetParams(params = {}, options = {}) {
    return this.setParams(
      // мержим параметры с начальными
      mc.merge(this.defaultState().params, params),
      // мержить параметры с текущими и загружать данные не надо, но надо сбросить данные
      mc.merge({merge: false, remember: 'replace', load: false, clear: true}, options)
    );
  }

  /**
   * Установка новых параметров и загрузка данных по ним
   * @param params {Object} Новые параметры. Переопределяют текущие если merge или полностью заменяют их
   * @param options {Object} Опции, влияющие на логику смены параметров и загрузки новых данных
   *  remember {Boolean|'replace'|'push'} Сохранить параметры в location.search. Способ добавления истории адресов
   *  load {Boolean} Загружать данные по новым параметрам
   *  clear {Boolean} Сбросить текущие данные
   *  merge {Boolean} Объединять новые параметры с текущим. Иначе полная замена на новые.
   * @returns {Promise}
   */
  async setParams(params = {}, options = {},) {
    options = mc.merge({merge: true, load: true, clear: false, remember: 'replace'}, options);
    try {
      // 1. ПАРАМЕТРЫ
      // Новые параметры (нужно ли учитывать текущие?)
      let newParams = options.merge ? mc.merge(this.currentState().params, params) : params;
      if (options.clear) {
        // Сброс текущих данных, установка новых параметров
        // Если данные будут загружаться, то установка состояние ожидания
        this.resetState({
          params: newParams,
          wait: options.load
        }, 'Сброс текущих данных, установка параметров и статус ожидания');
      } else {
        // Сброс только ошибок, установка новых параметров
        // Если данные будут загружаться, то установка состояние ожидания
        this.updateState({
          wait: options.load,
          params: newParams,
          errors: null
        }, 'Установка параметров и статуса ожидания');
      }
      //  Сохранить параметры в location.search
      if (options.remember) {
        services.navigation.setSearchParams({[this.config.name]: newParams}, options.remember === 'push');
      }

      // 2. ДАННЫЕ
      // Загрузка данные по новым параметрам
      if (options.load) {
        // Параметры для API запроса (конвертация из всех параметров состояния с учётом новых)
        const apiParams = this.apiParams(newParams);
        // Выборка данных из АПИ
        const response = await this.api.findMany(apiParams);
        // Установка полученных данных в состояние
        const result = response.data.result;
        this.updateState(mc.patch(result, {
          wait: false,
          errors: null,
          changes: false
        }), 'Список загружен');
      }
      return true;
    } catch (e) {
      if (e.response?.data?.error?.data) {
        this.updateState({
          wait: false,
          errors: e.response.data.error.data.issues
        }, 'Ошибка от сервера');
      } else {
        throw e;
      }
    }
  }

  /**
   * Проверка параметров по схеме
   * Если есть ошибки, то возвращаются параметры по умолчанию
   * @param params {Object}
   * @return {Object} Корректные параметры
   */
  validateParams(params) {
    if (!this.validator(params)) {
      params = this.defaultState().params;
    }
    return params;
  }

  /**
   * Параметры для АПИ запроса выборки данных
   * @param params {Object} Исходные параметры из состояния
   * @return {Object} Подготовленные для запроса параметры
   */
  apiParams(params) {
    return {
      limit: params.limit,
      skip: (params.page - 1) * params.limit,
      fields: params.fields.replace(/\s/g, ''),
      sort: params.sort,
      filter: params.filter,
    };
  }

  async addItem(item) {
    item = mc.merge(item, {
      _id: --this.temporyIds,
      _new: true
    });
    const items = [item, ...this.currentState().items];
    const count = this.currentState().count + 1;
    const limit = this.currentState().params.limit + 1;
    this.updateState({items, count, params: {limit}, changes: true}, 'Добавление запись в список');
  }

  async changeItem(id, patch) {
    const items = this.currentState().items.map(item => {
      if (item._id === id) {
        return mc.merge(item, patch, {_changed: true});
      }
      return item;
    });
    this.updateState({items, changes: true}, 'Изменение записи ' + id);
  }

  async deleteItem(id) {
    const items = [...this.currentState().items];
    const itemIndex = items.findIndex(item => item._id === id);
    if (itemIndex !== -1) {
      let count = this.currentState().count;
      let limit = this.currentState().params.limit;
      if (items[itemIndex]._new) {
        items.splice(itemIndex, 1);
        count--;
        limit--;
      } else {
        items[itemIndex] = mc.merge(items[itemIndex], {
          _deleted: !items[itemIndex]._deleted,
          _changed: true
        });
      }
      this.updateState({items, count, params: {limit}, changes: true}, 'Удаление записи ' + id);
    }
  }

  async saveAllItem() {
    const currentItems = this.currentState().items;
    const items = [];
    let count = this.currentState().count;
    let limit = this.currentState().params.limit;
    let changes = false;
    for (const item of currentItems) {
      try {
        if (item._new) {
          // создание
          const response = await this.api.create({
            data: mc.merge(item, {$unset: ['_id', '_new', '_changed', '_error']}),
          });
          items.push(response.data.result);
        } else if (item._changed) {
          if (item._deleted) {
            // Удаление
            await this.api.delete({id: item._id});
            count--;
            limit--;
          } else {
            // Сохранение
            const response = await this.api.update({
              id: item._id,
              data: mc.merge(item, {$unset: ['_new', '_changed', '_error']}),
            });
            items.push(response.data.result);
          }
        } else {
          // Нет изменений
          items.push(item);
        }
      } catch (e) {
        if (e.response && e.response.data && e.response.data.error) {
          items.push(mc.merge(item, {_error: e.response.data.error.data.issues}));
        } else {
          throw e;
        }
        changes = true;
      }
    }
    this.updateState({items, count, params: {limit}, changes}, 'Сохранены изменения');
  }
}

export default CRUDListState;
