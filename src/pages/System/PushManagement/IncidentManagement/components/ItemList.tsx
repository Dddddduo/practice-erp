import React, {useState, RefObject, useEffect} from "react";
import { ParamsType, ProColumns, ProTable, ActionType } from '@ant-design/pro-components';
import {FormattedMessage, useIntl, useLocation} from "@@/exports";
import { Button, Drawer, Modal, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import CreateOrUpdate from "./CreateOrUpdate";
import { deleteIncident } from "@/services/ant-design-pro/pushManagement";
import IncidentBindUser from "./IncidentBindUser";
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
  onListData: HandleListDataFunc;
  success: (text: string) => void
  error: (text: any) => void
  events
  methods
}

const ItemList: React.FC<ItemListProps> = ({
  actionRef,
  onListData,
  success,
  error,
  events,
  methods
}) => {
  const intl = useIntl();
  const [columnsStateMap, setColumnsStateMap] = useState({});
  const location = useLocation();
  const currentPath = location.pathname;
  const pathname = currentPath.split('/')[currentPath.split('/').length - 1]

  // 右侧弹出区域控制
  const [showDetail, setShowDetail] = useState<boolean>(false);
  // 获取当前数据
  const [currentMsg, setCurrentMsg] = useState()
  const [shouBindModel, setShowBindModal] = useState(false)
  const [eventId, setEventId] = useState()
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const addMsg = () => {
    setShowDetail(true)
  }

  const updateMsg = (e) => {
    console.log(e);
    setShowDetail(true)
    setCurrentMsg(e)
  }

  const openDeleteModal = (id) => {
    setEventId(id)
    setShowDeleteModal(true)
  }

  const deleteMsg = async () => {
    // console.log(id);
    const res = await deleteIncident(eventId)
    if (!res.success) {
      error(res.message)
      return
    }
    actionRef.current?.reload()
    success('删除成功')
  }

  const bindUser = (e) => {
    setCurrentMsg(e)
    setShowBindModal(true)
  }

  const onCloseBindModel = () => {
    setShowBindModal(false)
  }

  const handleDrawerStateClean = () => {
    setShowDetail(false)
    setCurrentMsg(undefined)
  }

  const columns: ProColumns[] = [
    {
      title: (
        <FormattedMessage
          id="incident.field.id"
          defaultMessage="ID"
        />
      ),
      dataIndex: 'id',
      search: false
    },
    {
      title: (
        <FormattedMessage
          id="incident.field.name"
          defaultMessage="名称"
        />
      ),
      dataIndex: 'name',
    },
    {
      title: (
        <FormattedMessage
          id="incident.field.type"
          defaultMessage="类型"
        />
      ),
      dataIndex: 'type',
      search: false,
      render: (dom: any) => {
        return (
          <>{dom?.name}</>
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="incident.field.method"
          defaultMessage="推送方式"
        />
      ),
      dataIndex: 'method',
      search: false,
      render: (dom: any) => {
        return (
          <>{dom?.name}</>
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="incident.field.shop"
          defaultMessage="店铺"
        />
      ),
      dataIndex: 'shop',
      search: false,
      render: (dom: any, entity) => {
        return (
          <div>{dom?.name}</div>
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="incident.field.created_at"
          defaultMessage="创建时间"
        />
      ),
      dataIndex: 'created_at',
      search: false
    },
    {
      title: (
        <FormattedMessage
          id="incident.field.updated_at"
          defaultMessage="修改时间"
        />
      ),
      dataIndex: 'updated_at',
      search: false
    },
    {
      title: (
        <FormattedMessage
          id="incident.field.operate"
          defaultMessage="操作"
        />
      ),
      valueType: 'option',
      search: false,
      render: (dom, entity) => {
        return [
          // 第一个按钮
          <Button type="primary" key="update" onClick={() => updateMsg(entity)}>
            <FormattedMessage id="incident.button.update" defaultMessage="Update" />
          </Button>,
          // 第二个按钮
          <Button type="primary" key="delete" onClick={() => openDeleteModal(entity.id)}>
            <FormattedMessage id="incident.button.delete" defaultMessage="Delete" />
          </Button>,
          // 第三个按钮
          <Button type="primary" key="bind" onClick={() => bindUser(entity)}>
            <FormattedMessage id="incident.button.bind" defaultMessage="Bind" />
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
          id: 'incident.table.title',
          defaultMessage: 'table list',
        })}
        actionRef={actionRef}
        scroll={{ x: 'max-content' }}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="add"
            onClick={() => addMsg()}
          >
            <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          </Button>,
        ]}
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

      <Drawer
        width={600}
        closable={false}
        destroyOnClose={true}
        open={showDetail}
        onClose={handleDrawerStateClean}
      >
        <CreateOrUpdate
          actionRef={actionRef}
          currentMsg={currentMsg}
          onDrawerStateClean={handleDrawerStateClean}
          events={events}
          methods={methods}
          success={success}
          error={error}
        />
      </Drawer>

      <Modal
        open={shouBindModel}
        onCancel={onCloseBindModel}
        destroyOnClose
        footer={null}
        maskClosable={false}
      >
        <IncidentBindUser
          onCloseBindModel={onCloseBindModel}
          currentMsg={currentMsg}
          actionRef={actionRef}
          success={success}
          error={error}
        />
      </Modal>

      <Modal
        open={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        destroyOnClose
        onOk={deleteMsg}
      >
        <Typography.Title level={3}>确定要删除吗？</Typography.Title>
      </Modal>
    </>
  )
}

export default ItemList
