import React, {useEffect, useState} from "react"
import {ParamsType, ProColumns, ProTable} from "@ant-design/pro-components"
import {FormattedMessage, useIntl} from "@umijs/max"
import {Button, Drawer,} from "antd";
import Addsystem from "./Addsystem";
import {PlusOutlined} from "@ant-design/icons";
import {useLocation} from "@@/exports";
import {getStateMap, setStateMap} from "@/utils/utils";

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

  const [columnsStateMap, setColumnsStateMap] = useState({});
  const location = useLocation();
  const currentPath = location.pathname;
  const pathname = currentPath.split('/')[currentPath.split('/').length - 1]
  const [title, setTitle] = useState('')


  const columns: ProColumns<API.SupplierManagement>[] = [
    {
      title: (
        <FormattedMessage
          id="SupplierManagement.field.id"
          defaultMessage="ID"
        />
      ),
      dataIndex: 'id',
      search: false,
    },
    {
      title: (
        <FormattedMessage
          id="SupplierManagement.field.vendor_name"
          defaultMessage="供应商名称"
        />
      ),
      dataIndex: 'vendor_name',
    },
    {
      title: (
        <FormattedMessage
          id="SupplierManagement.field.status"
          defaultMessage="状态"
        />
      ),
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: type?.reduce((acc, item) => {
        acc[`${item.value}`] = {text: item.label};
        return acc;
      }, {}),
      fieldProps: {
        showSearch: true
      },

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
          id="SupplierManagement.field.wxzl"
          defaultMessage="维修质量"
        />
      ),
      dataIndex: 'wxzl',
      search: false,
      align: 'center',
      render: (dom, entity) => {
        // return Number(entity.toFixed(2));
        return (
          <div>
            {Number(entity.wxzl).toFixed(2)}
          </div>
        )

      }
    },
    {
      title: (
        <FormattedMessage
          id="SupplierManagement.field.wxsd"
          defaultMessage="维修速度"
        />
      ),
      dataIndex: 'wxsd',
      search: false,
      align: 'center',
      render: (dom, entity) => {
        // return Number(entity.toFixed(2));
        return (
          <div>
            {Number(entity.wxsd).toFixed(2)}
          </div>
        )

      }
    },
    {
      title: (
        <FormattedMessage
          id="SupplierManagement.field.fwtd"
          defaultMessage="服务态度"
        />
      ),
      dataIndex: 'fwtd',
      search: false,
      align: 'center',
      render: (dom, entity) => {
        // return Number(entity.toFixed(2));
        return (
          <div>
            {Number(entity.fwtd).toFixed(2)}
          </div>
        )

      }
    },
    {
      title: (
        <FormattedMessage
          id="SupplierManagement.field.smzsd"
          defaultMessage="准时上门"
        />
      ),
      dataIndex: 'smzsd',
      search: false,
      align: 'center',
      render: (dom, entity) => {
        // return Number(entity.toFixed(2));
        return (
          <div>
            {Number(entity.smzsd).toFixed(2)}
          </div>
        )

      }
    },
    {
      title: (
        <FormattedMessage
          id="SupplierManagement.field.yryb"
          defaultMessage="仪容仪表"
        />
      ),
      dataIndex: 'yryb',
      search: false,
      align: 'center',
      render: (dom, entity) => {
        // return Number(entity.toFixed(2));
        return (
          <div>
            {Number(entity.yryb).toFixed(2)}
          </div>
        )

      }
    },
    {
      title: (
        <FormattedMessage
          id="SupplierManagement.field.average"
          defaultMessage="平均分"
        />
      ),
      dataIndex: 'average',
      search: false,
      align: 'center',
      render: (dom: any, entity) => {
        return (
          <>
            <div>
              {Number(entity.wxzl + entity.wxsd + entity.fwtd + entity.smzsd + entity.yryb / 5).toFixed(2)}
            </div>
          </>

        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="SupplierManagement.field.create_at"
          defaultMessage="创建时间"
        />
      ),
      dataIndex: 'create_at',
      search: false,
    },
    {
      title: (
        <FormattedMessage
          id="SupplierManagement.field.update_at"
          defaultMessage="更新时间"
        />
      ),
      dataIndex: 'update_at',
      search: false,
    },
    {
      title: (
        <FormattedMessage
          id="SupplierManagement.field.operate"
          defaultMessage="操作"
        />
      ),
      dataIndex: 'operate',
      search: false,
      render: (dom: any, entity) => {
        return (
          <div>
            <Button type="primary"
                    onClick={() => openDetailDarwer(entity)}
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
    setTitle('修改供应商')
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
      <ProTable<API.SupplierManagement, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'SupplierManagement.table.title',
          defaultMessage: 'table list',
        })}

        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setShowDetailDrawer(true)
              setTitle('增加供应商')
            }}
          >
            <PlusOutlined/>
            <FormattedMessage id="pages.searchTable.new" defaultMessage="New"/>


          </Button>,
        ]}

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
