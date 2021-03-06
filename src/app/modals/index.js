import React, { useCallback } from 'react';
import * as modals from './export.js';
import useSelectorMap from '@src/utils/hooks/use-selector-map';
import services from "@src/services";

function Modals() {
  const select = useSelectorMap(state => ({
    modals: state.modals,
  }));

  const callbacks = {
    /**
     * Выбор компонента окна, если нужно показывать
     * @returns {null|*}
     */
    getModal: useCallback(() => {
      const props = {
        ...select.modals?.params,
        close: result => {
          return services.store.modals.close(result);
        },
      };
      if (select.modals?.show) {
        if (modals[select.modals?.name]) {
          const Component = modals[select.modals?.name];
          return <Component {...props} />;
        }
      } else {
        return null;
      }
    }, [select]),
  };

  return callbacks.getModal();
}

export default React.memo(Modals);
