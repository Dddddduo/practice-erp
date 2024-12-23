import React, { useEffect, useState, RefObject } from "react"
import { Button, Tag, Modal, Drawer, Form, Popconfirm, Space } from 'antd'
import { ParamsType, ProColumns, ProTable, ActionType } from '@ant-design/pro-components';
import {FormattedMessage, useIntl, useLocation} from "@@/exports";
import { PlusOutlined, ClusterOutlined, SwapOutlined } from "@ant-design/icons";
import { fullMenus, deleteMenu } from "@/services/ant-design-pro/accessControl";
import Bind from "./Bind";
import CreateOrUpdate from "./CreateOrUpdate";
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
  onListData: HandleListDataFunc;
  actionRef: RefObject<ActionType>;
  success: (text: string) => void
  error: (text: string) => void
}


const ItemList: React.FC<ItemListProps> = ({
  onListData,
  actionRef,
  success,
  error,
}) => {
  const intl = useIntl()
  const [showBind, setShowBind] = useState(false)
  const [showCreateOrUpdate, setShowCreateOrUpdate] = useState(false)
  const [currentItem, setCurrentItem] = useState({})
  const [title, setTitle] = useState('')
  const [menus, setMenus] = useState([])

  const [columnsStateMap, setColumnsStateMap] = useState({});
  const location = useLocation();
  const currentPath = location.pathname;
  const pathname = currentPath.split('/')[currentPath.split('/').length - 1]

  const columns: ProColumns<API.MenusListParams>[] = [
    {
      title: (
        <FormattedMessage
          id="menus.field.id"
          defaultMessage="序号"
        />
      ),
      dataIndex: 'id',
      search: false,
      align: 'center',
      render: (dom, entity, index) => (
        <div>{index + 1}</div>
      )
    },
    {
      title: (
        <FormattedMessage
          id="menus.field.name"
          defaultMessage="名称"
        />
      ),
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: (
        <FormattedMessage
          id="menus.field.icon"
          defaultMessage="图标"
        />
      ),
      dataIndex: 'icon',
      search: false,
      align: 'center',
    },
    {
      title: (
        <FormattedMessage
          id="menus.field.pid"
          defaultMessage="上级菜单"
        />
      ),
      dataIndex: 'pid',
      search: false,
      align: 'center',
    },
    {
      title: (
        <FormattedMessage
          id="menus.field.level"
          defaultMessage="级别"
        />
      ),
      dataIndex: 'level',
      search: false,
      align: 'center',
    },
    {
      title: (
        <FormattedMessage
          id="menus.field.sort_by"
          defaultMessage="排序值"
        />
      ),
      dataIndex: 'sort_by',
      search: false,
      align: 'center',
    },
    {
      title: (
        <FormattedMessage
          id="menus.field.action"
          defaultMessage="操作"
        />
      ),
      dataIndex: 'action',
      search: false,
      align: 'center',
      render: (dom, entity) => (
        <Space>
          <Button type="primary" onClick={() => {
            setCurrentItem(entity)

            setShowCreateOrUpdate(true)
            setTitle('修改')
          }}>修改</Button>
          <Popconfirm
            title="删除"
            description="您确定要删除吗？"
            onConfirm={() => handleDelete(entity)}
          >
            <Button danger>删除</Button>
          </Popconfirm>
        </Space>
      )
    },
  ]

  const handleDelete = (entity) => {
    deleteMenu(entity.id).then(res => {
      if (res.success) {
        actionRef.current?.reload()
        success('删除成功')
        return
      }
      error(res.message)
    })
  }

  const handleCloseBind = () => {
    setShowBind(false)
  }

  const handleCloseCreateOrUpdate = () => {
    setCurrentItem({})
    setShowCreateOrUpdate(false)
  }

  useEffect(() => {
    setColumnsStateMap(getStateMap(pathname))

    fullMenus().then(res => {
      if (res.success) {
        res.data.unshift({
          id: 0,
          name: '顶级菜单',
          children: []
        })
        setMenus(res.data)
      }
    })
  }, [])

  return (
    <>
      <ProTable<API.MenusListParams, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'menus.table.title',
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
            key="primary"
            icon={<ClusterOutlined />}
            onClick={() => {
              setShowBind(true);
            }}
          >
            <FormattedMessage id="pages.searchTable.bind" defaultMessage="Bind" />
          </Button>,

          <Button
            type="primary"
            key="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setShowCreateOrUpdate(true)
              setTitle('创建')
            }}
          >
            <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          </Button>,
        ]}
        columnEmptyText={false}
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
        width={1200}
        destroyOnClose={true}
        open={showBind}
        onClose={handleCloseBind}
        title={
          <div>
            用户
            <SwapOutlined style={{ margin: '0 10px' }} />
            菜单
          </div>
        }
      >
        <Bind
          actionRef={actionRef}
          success={success}
          error={error}
          handleCloseBind={handleCloseBind}
        />
      </Drawer>

      <Drawer
        width={600}
        destroyOnClose={true}
        open={showCreateOrUpdate}
        onClose={handleCloseCreateOrUpdate}
        title={title}
      >
        <CreateOrUpdate
          actionRef={actionRef}
          success={success}
          error={error}
          handleCloseCreateOrUpdate={handleCloseCreateOrUpdate}
          currentItem={currentItem}
          menus={menus}
        />
      </Drawer>
    </>
  )
}

export default ItemList
