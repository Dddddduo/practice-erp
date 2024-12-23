import {ParamsType, ProColumns, ProTable} from "@ant-design/pro-components"
import {FormattedMessage, useIntl} from "@umijs/max";
import {Button, Drawer} from "antd";
import React, {useEffect, useState} from "react";
import {PlusOutlined} from "@ant-design/icons";
import Addsystem from "./Addsystem";
import {getStateMap, setStateMap} from "@/utils/utils";
import {useLocation} from "@@/exports";

const type = [
  {
    value: 'able',
    label: '启用'
  },
  {
    value: 'disable',
    label: '禁用'
  },
]

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
  actionRef
  success,
  error
}


const ItemList: React.FC<ItemListProps> = ({
                                             onListData,
                                             actionRef,
                                             success,
                                             error
                                           }) => {

  const intl = useIntl()

  // 抽屉
  const [showDetailDrawer, setShowDetailDrawer] = useState(false)
  const [currentMsg, setCurrentMsg] = useState()

  const [title, setTitle] = useState('')
  const [columnsStateMap, setColumnsStateMap] = useState({});
  const location = useLocation();
  const currentPath = location.pathname;
  const pathname = currentPath.split('/')[currentPath.split('/').length - 1]


  const columns: ProColumns<API.VendorAccount>[] = [
    {
      title: (
        <FormattedMessage
          id="vendorAccount.field.id"
          defaultMessage="ID"
        />
      ),
      dataIndex: 'id',
      search: false,
    },
    {
      title: (
        <FormattedMessage
          id="vendorAccount.field.username"
          defaultMessage="账号"
        />
      ),
      dataIndex: 'username',
    },
    {
      title: (
        <FormattedMessage
          id="vendorAccount.field.other_vendor_name"
          defaultMessage="供应商名称"
        />
      ),
      dataIndex: 'other_vendor_name',
    },
    {
      title: (
        <FormattedMessage
          id="vendorAccount.field.status"
          defaultMessage="状态"
        />
      ),
      dataIndex: 'status',
      valueEnum: type?.reduce((acc, item) => {
        acc[`${item.value}`] = {text: item.label};
        return acc;
      }, {}),
      render: (dom: any, entity) => {
        return (
          <div>

            {
              entity.status === 'able' ? '启用' : '禁用'
            }

          </div>
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="vendorAccount.field.create_at"
          defaultMessage="创建时间"
        />
      ),
      dataIndex: 'create_at',
      search: false
    },
    {
      title: (
        <FormattedMessage
          id="vendorAccount.field.update_at"
          defaultMessage="更新时间"
        />
      ),
      dataIndex: 'update_at',
      search: false
    },
    {
      title: (
        <FormattedMessage
          id="vendorAccount.field.operate"
          defaultMessage="操作"
        />
      ),
      dataIndex: 'operate',
      search: false,
      render: (dom: any, entity) => {
        return (
          <div>
            <Button type="primary"
                    onClick={() => {
                      openDetailDarwer(entity)
                    }}
            >
              编辑
            </Button>
          </div>
        )
      }
    },
  ]
  const openDetailDarwer = (e) => {
    setCurrentMsg(e)
    setShowDetailDrawer(true)
    setTitle('修改供应商账号')
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
      <ProTable<API.VendorAccount, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'VendorAccount.table.title',
          defaultMessage: 'table list',
        })}

        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setShowDetailDrawer(true)
              setTitle('增加供应商账号')
            }}
          >
            <PlusOutlined/>
            <FormattedMessage id="pages.searchTable.new" defaultMessage="New"/>


          </Button>,
        ]}
        columnEmptyText

        scroll={{x: 'max-content'}}
        actionRef={actionRef}
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
        <Addsystem
          handleClose={handleClose}
          actionRef={actionRef}
          currentMsg={currentMsg}
          success={success}
          error={error}
        />
      </Drawer>
    </>
  )
}
export default ItemList
