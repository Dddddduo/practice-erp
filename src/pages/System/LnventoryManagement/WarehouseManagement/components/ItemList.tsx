import React, {useEffect, useState} from "react"
import {ParamsType, ProColumns, ProTable} from "@ant-design/pro-components";
import {FormattedMessage, useIntl} from '@umijs/max';
import {Button, Drawer} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import AddSystem from "./AddSystem";
import {getStateMap, setStateMap} from "@/utils/utils";
import {useLocation} from "@@/exports";

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
  actionRef: any
  success: (text: string) => void
  error: (text: string) => void
}

const ItemList: React.FC<ItemListProps> = ({
                                             onListData,
                                             actionRef,
                                             success,
                                             error
                                           }) => {

  const intl = useIntl()
  // 新增或者编辑抽屉
  const [showDetailDrawer, setShowDetailDrawer] = useState(false)

  const [currentMsg, setCurrentMsg] = useState()

  const [title, setTitle] = useState('')
  const [columnsStateMap, setColumnsStateMap] = useState({});
  const location = useLocation();
  const currentPath = location.pathname;
  const pathname = currentPath.split('/')[currentPath.split('/').length - 1]

  const columns: ProColumns<API.WarehouseManagement>[] = [

    {
      title: (
        <FormattedMessage
          id="WarehouseManagement.field.id"
          defaultMessage="ID"
        />
      ),
      dataIndex: 'id',
      search: false
    },
    {
      title: (
        <FormattedMessage
          id="WarehouseManagement.field.cn_name"
          defaultMessage="仓库名称"
        />
      ),
      dataIndex: 'cn_name',
      search: false
    },
    {
      title: (
        <FormattedMessage
          id="WarehouseManagement.field.en_name"
          defaultMessage="仓库英文名称"
        />
      ),
      dataIndex: 'en_name',
      search: false
    },
    {
      title: (
        <FormattedMessage
          id="WarehouseManagement.field.remark"
          defaultMessage="描述"
        />
      ),
      dataIndex: 'remark',
      search: false
    },
    {
      title: (
        <FormattedMessage
          id="WarehouseManagement.field.operate"
          defaultMessage="操作"
        />
      ),
      dataIndex: 'operate',
      search: false,
      render: (dom, entity) => {
        return (
          <>
            <Button type="primary" onClick={() => openDetailDarwer(entity)}>修改</Button>
          </>
        )
      }
    },

  ]
  const openDetailDarwer = (e) => {
    setCurrentMsg(e)
    setShowDetailDrawer(true)
    setTitle('编辑仓库')
  }

  const handleClose = () => {
    setCurrentMsg(undefined)
    setShowDetailDrawer(false)
    setTitle('')
  }
  useEffect(() => {
    setColumnsStateMap(getStateMap(pathname))
  }, []);

  return (
    <>
      <ProTable<API.WarehouseManagement, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'WarehouseManagement.table.title',
          defaultMessage: 'table list',
        })}
        actionRef={actionRef}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setShowDetailDrawer(true)
              setTitle('添加仓库');
            }}
          >
            <PlusOutlined/>
            <FormattedMessage id="pages.searchTable.new" defaultMessage="New"/>


          </Button>,
        ]}

        columns={columns}
        request={onListData}
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
        title={title}
        open={showDetailDrawer}
        onClose={handleClose}
        destroyOnClose={true}
      >
        <AddSystem
          handleClose={handleClose}
          currentMsg={currentMsg}
          actionRef={actionRef}
          success={success}
          error={error}
        />
      </Drawer>
    </>
  )
}

export default ItemList
