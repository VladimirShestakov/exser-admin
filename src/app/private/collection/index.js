import React, {Fragment, useMemo} from 'react';
import {Route, Switch, Link} from 'react-router-dom';
import LayoutPage from '@src/components/layouts/layout-page';
import LayoutContent from '@src/components/layouts/layout-content';
import useInit from '@src/utils/hooks/use-init';

import {Typography, Space} from 'antd';

import services from "@src/services";
import UniversalList from "@src/containers/universal-list";
const {Title, Text} = Typography;

function CollectionPart(props) {
  let {name, meta} = props;

  useInit(async () => {
    // Динамическое создание endpoint к апи
    services.api.createEndpoint({name, proto: 'crud', url: meta.api});
    // Динамическое создание состояния для товаров
    services.store.createState({name, proto: 'crudList', apiEndpoint: name});
    // Инициализация параметров для начальной выборки по ним
    await services.store.get(name).initParams({
      fields: meta.params.fields //'items(*,maidIn(*)),count'
    });
  }, []);

  return (
    <LayoutContent>
      <Space direction="vertical">
        <Title>{meta.title}</Title>
      </Space>
      <UniversalList name={name} meta={meta}/>
    </LayoutContent>
  );
}

export default React.memo(CollectionPart);
