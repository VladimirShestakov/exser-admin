import escape from './escape.js';

/**
 * Поиска активного пункта меню с учётом вложенности
 * @param items Список путей. Пути с вложенными url должны идти после родительских url
 * @param url {String} Сверяемый url
 * @param [result] {Object} Результат для рекурсивного обхода
 * @returns {*}
 */
function detectActiveKeys(items, url, result = {detect: false, select: [], expand:[]}){
  if (items) {
    if (items) {
      const keys = Object.keys(items);
      result.detect = false;
      for (const key of keys) {
        const item = items[key];
        if (item.kind === 'group') {
          const detectChild = detectActiveKeys(item.items, url, result);
          if (detectChild.detect) {
            result.expand.push(key);
          }
        } else {
          const active = new RegExp(`^${escape.regex(item.url + '/')}`).test(url + '/');
          if (active) {
            result.select.push(key);
            result.detect = true;
          }
        }
      }
    }
  }
  return result;
}

export default detectActiveKeys;
