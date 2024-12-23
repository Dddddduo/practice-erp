import React, {useEffect, useState} from "react";
import {FormattedMessage, useIntl} from '@umijs/max';
import {Button, Drawer} from 'antd';
import {ParamsType, ProColumns, ProTable} from "@ant-design/pro-components";
import {PlusOutlined} from "@ant-design/icons";
import AddSystem from "./AddSystem";
// 品牌
// 城市
import {getBrandList, getCityList} from "@/services/ant-design-pro/report";
import {getStateMap, setStateMap} from "@/utils/utils";
import {useLocation} from "@@/exports";


const type = [
  {
    value: 'y',
    label: '启用'
  },
  {
    value: 'n',
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
  actionRef: any,
  success: (text: string) => void
  error: (text: string) => void
}


const ItemList: React.FC<ItemListProps> = ({
                                             onListData,
                                             actionRef,
                                             success,
                                             error
                                           }) => {


  const intl = useIntl();
  // 品牌
  const [brandList, setBrandList]: any = useState([])
  // 城市
  const [cityList, setcityList]: any = useState([])

  const [columnsStateMap, setColumnsStateMap] = useState({});
  const location = useLocation();
  const currentPath = location.pathname;
  const pathname = currentPath.split('/')[currentPath.split('/').length - 1]


  // 新增或者编辑抽屉
  const [showDetailDrawer, setShowDetailDrawer] = useState(false)
  const [typeList, settypeList]: any = useState([])
  const [currentMsg, setCurrentMsg] = useState()


  const columns: ProColumns<API.StoreAccountManagement>[] = [

    {
      title: (
        <FormattedMessage
          id="storeAccountManagement.field.usnername"
          defaultMessage="姓名"
        />
      ),
      dataIndex: 'usnername',
    },
    {
      title: (
        <FormattedMessage
          id="storeAccountManagement.field.mobile"
          defaultMessage="联系电话"
        />
      ),
      dataIndex: 'mobile',
      search: false,
    },
    {
      title: (
        <FormattedMessage
          id="storeAccountManagement.field.email"
          defaultMessage="邮箱"
        />
      ),
      dataIndex: 'email',
      search: false,
    },
    {
      title: (
        <FormattedMessage
          id="storeAccountManagement.field.store_list_str_cn"
          defaultMessage="店铺名"
        />
      ),
      dataIndex: 'store_list_str_cn',
      // align: 'center',
      search: false,
      render: (dom, entity) => {
        return (<div style={{width: 300}}>{dom}</div>)
      }
    },
    // brand_list_str_en
    {
      title: (
        <FormattedMessage
          id="storeAccountManagement.field.brand_list_str_en"
          defaultMessage="品牌"
        />
      ),
      dataIndex: 'brand_list_str_en',
      hideInTable: true,
      valueType: 'select',
      valueEnum: brandList?.reduce((acc, item) => {
        acc[`${item.id}`] = {text: item.brand_en};
        return acc;
      }, {}),
      fieldProps: {
        showSearch: true
      },

    },
    {
      title: (
        <FormattedMessage
          id="storeAccountManagement.field.status"
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

      render: (dom, entity) => {
        return (
          <div>
            {
              entity.status === 'y' ? '启用' : '禁用'
            }
          </div>
        )
      },
    },
    {
      title: (
        <FormattedMessage
          id="storeAccountManagement.field.operate"
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
  }

  const handleClose = () => {
    setCurrentMsg(undefined)
    setShowDetailDrawer(false)
  }


  useEffect(() => {
    setColumnsStateMap(getStateMap(pathname))
    getBrandList().then(res => {
      setBrandList(Object.keys(res.data).map(key => res.data[key]))
    })
    getCityList().then(res => {
      setcityList(res.data)
      console.log(res.data)
    })

  }, [])


  return (
    <>
      <>
        <ProTable<API.StoreAccountManagement, API.PageParams>
          headerTitle={intl.formatMessage({
            id: 'StoreAccountManagement.table.title',
            defaultMessage: 'table list',
          })}
          scroll={{x: 'max-content'}}
          actionRef={actionRef}
          toolBarRender={() => [
            <Button
              type="primary"
              key="primary"
              onClick={() => {
                setShowDetailDrawer(true);
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
      </>
      <Drawer
        width={600}
        open={showDetailDrawer}
        onClose={handleClose}
        destroyOnClose={true}
      >
        <AddSystem
          brandList={brandList}
          cityList={cityList}
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
