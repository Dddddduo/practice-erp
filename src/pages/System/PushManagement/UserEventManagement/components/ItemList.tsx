import React, {useState, RefObject, useEffect} from "react"
import { ParamsType, ProColumns, ProTable, ActionType } from '@ant-design/pro-components';
import { Button, Modal } from "antd";
import {FormattedMessage, useIntl, useLocation} from "@@/exports";
import UserBindEvent from "./UserBindEvent";
import {getStateMap, setStateMap} from "@/utils/utils";


type HandleListDataParams = {
  current: number;
  pageSize: number;
  [key: string]: any;
};

type HandleListDataReturnType = {
  success: boolean;
  total: number;
  data: any[]; // 可以根据需要进一步指定数组的类型
};

type HandleListDataFunc = (params: HandleListDataParams, sort: ParamsType) => Promise<HandleListDataReturnType>;

interface ItemListProps {
  actionRef: RefObject<ActionType>;
  onListData: HandleListDataFunc
  success,
  error
}

const ItemList: React.FC<ItemListProps> = ({
  actionRef,
  onListData,
  success,
  error
}) => {

  const intl = useIntl();

  // 获取当前数据
  const [currentMsg, setCurrentMsg] = useState()

  const [showBindModal, setShowBindModal] = useState(false)

  const [columnsStateMap, setColumnsStateMap] = useState({});
  const location = useLocation();
  const currentPath = location.pathname;
  const pathname = currentPath.split('/')[currentPath.split('/').length - 1]

  const bindEvent = (e) => {
    setCurrentMsg(e)
    setShowBindModal(true)
  }

  const onCloseBindModel = () => {
    setShowBindModal(false)
  }

  const columns: ProColumns[] = [
    {
      title: (
        <FormattedMessage
          id="userEvent.field.id"
          defaultMessage="ID"
        />
      ),
      dataIndex: 'id',
      search: false
    },
    {
      title: (
        <FormattedMessage
          id="userEvent.field.username"
          defaultMessage="用户"
        />
      ),
      dataIndex: 'username',
    },
    {
      title: (
        <FormattedMessage
          id="userEvent.field.username_en"
          defaultMessage="英文名"
        />
      ),
      dataIndex: 'username_en',
      search: false
    },
    {
      title: (
        <FormattedMessage
          id="userEvent.field.operate"
          defaultMessage="操作"
        />
      ),
      valueType: 'option',
      search: false,
      render: (dom, entity) => {
        return [
          <Button type="primary" key="bind" onClick={() => bindEvent(entity)}>
            <FormattedMessage id="userEvent.field.bind" defaultMessage="Bind" />
          </Button>,
        ]
      }
    },
  ]

  useEffect(() => {
    setColumnsStateMap(getStateMap(pathname))
  }, []);

  return (
    <>
      <ProTable
        headerTitle={intl.formatMessage({
          id: 'userEvent.table.title',
          defaultMessage: 'table list',
        })}
        actionRef={actionRef}
        scroll={{ x: 'max-content' }}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        request={onListData}
        columns={columns}
        columnsState={{
          value: columnsStateMap,
          onChange: (newState) => {
            setColumnsStateMap(newState)
            setStateMap(pathname, newState)
          }
        }}
      />
      <Modal
        open={showBindModal}
        onCancel={onCloseBindModel}
        destroyOnClose
        footer={null}
        maskClosable={false}
      >
        <UserBindEvent
          actionRef={actionRef}
          onCloseBindModel={onCloseBindModel}
          currentMsg={currentMsg}
          success={success}
          error={error}
        />
      </Modal>
    </>
  )
}

export default ItemList
