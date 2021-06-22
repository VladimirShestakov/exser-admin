import React, {useCallback} from 'react';
import useSelectorMap from '@src/utils/hooks/use-selector-map';

import {Button, Input, Space, Table, Tag} from 'antd';
import services from "@src/services";

const {Column, ColumnGroup} = Table;

function UniversalList(props) {

  const name = props.name;
  const select = useSelectorMap(state => ({
    items: state[name]?.items || [],
    wait: state[name]?.wait,
    changes: state[name]?.changes,
    limit: state[name]?.params.limit || 0,
    page: state[name]?.params.page || 1,
    count: state[name]?.count || 0,
    meta: state.meta.data[name],
    metaAll: state.meta.data
  }));

  const callbacks = {
    onChange: useCallback((page, limit) => {
      services.store.get(name).setParams({page, limit});
    }, [name]),
    onAdd: useCallback(() => {
      services.store.get(name).addItem(select.meta.example);
    }, [select.meta]),
    onSave: useCallback(() => {
      services.store.get(name).saveAllItem();
    }, [select.meta])
  };

  const renders = {

    actionsMain: useCallback(() => {
      // if (select.meta.actionsMain) {
      //   let result = [];
      //   for (const actionItem of select.meta.actionsMain) {
      //     if (select.metaAll[actionItem.name]) {
      //       const onClick = () => {
      //         services.navigation.push(select.metaAll[actionItem.name].route);
      //       };
      //       result.push(
      //         <Button key={actionItem.name} onClick={onClick} type="primary"
      //           style={{marginBottom: 16}}>
      //           {select.metaAll[actionItem.name].title}
      //         </Button>
      //       );
      //     }
      //   }
      //   return result;
      // }
      return (
        <>
          {select.meta.example &&
          <Button onClick={callbacks.onAdd} type="primary" style={{marginBottom: 16}}>
            Добавить
          </Button>
          }
          {select.changes &&
          <Button onClick={callbacks.onSave} type="secondary"
            style={{marginBottom: 16, marginLeft: 16}}>
            Сохранить
          </Button>
          }
        </>
      );
    }, [select.meta, select.changes]),

    columns: useCallback(() => {
      let result = [];
      if (select.meta.columns) {
        const columnsKeys = Object.keys(select.meta.columns);
        for (const columnKey of columnsKeys) {
          const col = select.meta.columns[columnKey];
          const out = (value, item) => {
            const onChange = (e) => {
              services.store.get(name).changeItem(item._id, {$set: {[col.field]: e.target.value}});
            };
            return <Input value={value} onChange={onChange}/>;
            // if (col.wrap) {
            //   return <span style={{'wordBreak': 'break-all'}}>{value}</span>;
            // } else {
            //   return value;
            // }
          };
          result.push(
            <Column className="colError" title={col.title} dataIndex={col.field.split('.')}
              key={columnKey} render={out}/>
          );
        }
        result.push(
          <Column
            title=""
            key="action"
            width={60}
            render={(value, item) => {
              const onDelete = () => {
                services.store.get(name).deleteItem(item._id);
              };
              return (
                <Space size="middle">
                  <a onClick={onDelete}>{item._deleted ? 'Restore' : 'Delete'}</a>
                </Space>
              );
            }}
          />
        );
      }
      return result;
    }, [select.meta])
  };

  return (
    <div style={{margin: '20px 0'}}>
      {renders.actionsMain()}
      <Table
        dataSource={select.items}
        xScroll={"scroll"}
        size="small"
        bordered={true}
        scroll={{x: true}}
        pagination={{
          position: ['bottomRight'],
          total: select.count,
          current: select.page,
          pageSize: select.limit,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: total => `Всего ${total}`,
          onChange: callbacks.onChange
        }}
        loading={select.wait}
        rowKey={'_id'}
        rowClassName={(row) => row._deleted ? 'deleted-row' : (row._new ? 'new-row' : (row._changed ? 'changed-row' : ''))}
      >
        {renders.columns()}
      </Table>
    </div>
  );
}

export default React.memo(UniversalList);
