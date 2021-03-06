/**
 * Простой редьсер
 * Срабатывает, если action.type соответствует названию редьсера
 * Единственное действие редьюсера - заменить состояние на action.payload
 * За немутабельное обновление должен отвечать метод, передающее action.payload
 * @param name {String} Название редьсера
 * @param defaultState {Object} Начальное состояние
 * @return {Function}
 */
export default function reducerSimple(name, defaultState) {
  return (state = defaultState, action) => {
    if (action.type === name) {
      return action.payload;
    }
    return state;
  };
}
