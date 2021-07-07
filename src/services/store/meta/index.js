import BaseState from "@src/services/store/base";
import services from "@src/services";
import mc from "merge-change";
import annotation from "../../../../annotation";

class MetaState extends BaseState {

  defaultState() {
    return mc.merge(annotation, {
      wait: false,
      errors: null,
    });
  }

  async load() {
    console.log('load meta');
    //@todo Загрузка аннотации
  }

  /**
   * Изменение полей формы
   * @param data
   */
  change(data) {
    this.updateState({data}, 'Редактирование аннотации');
  }
}

export default MetaState;
