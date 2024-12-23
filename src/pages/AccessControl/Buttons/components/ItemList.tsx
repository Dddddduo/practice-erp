import React, {useState, RefObject, useEffect} from "react"
import { Button, Drawer, Popconfirm, Space, Tooltip } from 'antd'
import { ParamsType, ProColumns, ProTable, ActionType } from '@ant-design/pro-components';
import {FormattedMessage, useIntl, useLocation} from "@@/exports";
import { PlusOutlined, SwapOutlined } from "@ant-design/icons";
import { deleteButton } from "@/services/ant-design-pro/accessControl";
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
  const [btnId, setBtnId] = useState<any>(0)

  const [columnsStateMap, setColumnsStateMap] = useState({});
  const location = useLocation();
  const currentPath = location.pathname;
  const pathname = currentPath.split('/')[currentPath.split('/').length - 1]

  const handleDelete = (entity) => {
    deleteButton(entity.id).then(res => {
      if (res.success) {
        actionRef.current?.reload()
        success('删除成功')
        return
      }
      error(res.message)
    })
  }

  const handleRemarkText = (text: string): string => {
    if (text.length > 20) {
      return text.substring(0, 20) + '...';
    } else {
      return text
    }

  }

  const columns: ProColumns<API.MenusListParams>[] = [
    {
      title: (
        <FormattedMessage
          id="buttons.field.id"
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
          id="buttons.field.name"
          defaultMessage="名称"
        />
      ),
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: (
        <FormattedMessage
          id="buttons.field.module"
          defaultMessage="模块"
        />
      ),
      dataIndex: 'module',
      align: 'center',
    },
    {
      title: (
        <FormattedMessage
          id="buttons.field.remark"
          defaultMessage="备注"
        />
      ),
      dataIndex: 'remark',
      search: false,
      align: 'center',
      render: (dom, entity, index) => (
        <Tooltip title={entity.remark}>
          <span>{entity.remark ? handleRemarkText(entity.remark) : ''}</span>
        </Tooltip>
      )
    },
    {
      title: (
        <FormattedMessage
          id="buttons.field.pos"
          defaultMessage="位置"
        />
      ),
      dataIndex: 'pos',
      search: false,
      align: 'center',
    },
    {
      title: (
        <FormattedMessage
          id="buttons.field.created_at"
          defaultMessage="创建时间"
        />
      ),
      dataIndex: 'created_at',
      search: false,
      align: 'center',
    },
    {
      title: (
        <FormattedMessage
          id="buttons.field.action"
          defaultMessage="操作"
        />
      ),
      dataIndex: 'action',
      search: false,
      align: 'center',
      fixed: 'right',
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
          <Button type="primary" onClick={() => {
            console.log('实体', entity)
            setShowBind(true);
            setBtnId(entity.id)
          }}>绑定用户</Button>
        </Space>
      )
    },
  ]

  const handleCloseBind = () => {
    setShowBind(false)
  }

  const handleCloseCreateOrUpdate = () => {
    setCurrentItem({})
    setShowCreateOrUpdate(false)
  }

  useEffect(() => {
    setColumnsStateMap(getStateMap(pathname))
  }, []);

  return (
    <>
      <ProTable<API.MenusListParams, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'buttons.table.title',
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
            按钮
          </div>
        }
      >
        <Bind
          actionRef={actionRef}
          success={success}
          error={error}
          handleCloseBind={handleCloseBind}
          btnId={btnId}
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
        />
      </Drawer>
    </>
  )
}

export default ItemList
