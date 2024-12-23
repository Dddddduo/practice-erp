import React, { useState, RefObject, useEffect } from "react"
import { Button, Drawer, Space } from 'antd'
import { ParamsType, ProColumns, ProTable, ActionType } from '@ant-design/pro-components';
import {FormattedMessage, useIntl, useLocation} from "@@/exports";
import { PlusOutlined } from "@ant-design/icons";
import CreateOrUpdate from "./CreateOrUpdate";
import { getShopList } from '@/services/ant-design-pro/simCard';
import { isEmpty } from "lodash";
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
  const [showCreateOrUpdate, setShowCreateOrUpdate] = useState(false)
  const [currentItem, setCurrentItem] = useState({})
  const [title, setTitle] = useState('')
  const [shopList, setShopList] = useState([])
  const [columnsStateMap, setColumnsStateMap] = useState({});
  const location = useLocation();
  const currentPath = location.pathname;
  const pathname = currentPath.split('/')[currentPath.split('/').length - 1]


  const fetchShopList = async () => {
    let shopList: any = []
    var res = await getShopList()

    if (res.success && !isEmpty(res.data)) {
      res.data.forEach(item => {
        shopList.push(
          { label: item.name_cn, value: item.id },
        )
      })
    }
    setShopList(shopList)

    return shopList
  };


  const columns: ProColumns<API.MenusListParams>[] = [
    {
      title: (
        <FormattedMessage
          id="simcard.field.id"
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
          id="simcard.field.name"
          defaultMessage="名称"
        />
      ),
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: (
        <FormattedMessage
          id="simcard.field.shopId"
          defaultMessage="店铺id"
        />
      ),
      dataIndex: 'shop_id',
      search: false,
      align: 'center',
    },
    {
      title: (
        <FormattedMessage
          id="simcard.field.shopName"
          defaultMessage="店铺名称"
        />
      ),
      dataIndex: 'shop',
      align: 'center',
      valueType: 'select',
      fieldProps: {
        showSearch: true,
        options: shopList
      },
      render: (dom, entity, index) => (
        <div>{entity?.shop.name ?? ''}</div>
      )
    },
    {
      title: (
        <FormattedMessage
          id="simcard.field.realTopic"
          defaultMessage="Client Id"
        />
      ),
      dataIndex: 'real_topic',
      align: 'center',
    },
    {
      title: (
        <FormattedMessage
          id="simcard.field.floor"
          defaultMessage="楼层"
        />
      ),
      dataIndex: 'floor',
      search: false,
      align: 'center',
    },
    {
      title: (
        <FormattedMessage
          id="simcard.field.floor"
          defaultMessage="时间"
        />
      ),
      dataIndex: 'time',
      valueType: 'dateRange',
      hideInTable: true,
      align: 'center',
    },
    {
      title: (
        <FormattedMessage
          id="simcard.field.action"
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
            setTitle('修改设备')
          }}>修改</Button>
        </Space>
      )
    },
  ]

  const handleCloseCreateOrUpdate = () => {
    setCurrentItem({})
    setShowCreateOrUpdate(false)
  }

  useEffect(() => {
    setColumnsStateMap(getStateMap(pathname))
    fetchShopList()
  }, [])

  return (
    <>
      <ProTable<API.MenusListParams, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'simcard.table.title',
          defaultMessage: 'table list',
        })}
        actionRef={actionRef}
        scroll={{ x: 'max-content' }}
        rowKey="id"
        search={{
          labelWidth: 120,
          // span: 6,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setShowCreateOrUpdate(true)
              setTitle('创建设备')
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
        width={600}
        destroyOnClose={true}
        open={showCreateOrUpdate}
        onClose={handleCloseCreateOrUpdate}
        title={title}
        maskClosable={false}
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
