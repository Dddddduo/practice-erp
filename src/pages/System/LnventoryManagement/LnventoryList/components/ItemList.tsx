import React, {useEffect, useState,} from "react"
import {ParamsType, ProColumns, ProTable} from "@ant-design/pro-components";
import {FormattedMessage, useIntl} from '@umijs/max';
import {getBrandList} from "@/services/ant-design-pro/report";
import {Button, Drawer} from "antd";
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
  // 品牌下拉框
  const [brandList, setBrandList]: any = useState([])
  const [columnsStateMap, setColumnsStateMap] = useState({});
  const location = useLocation();
  const currentPath = location.pathname;
  const pathname = currentPath.split('/')[currentPath.split('/').length - 1]

  const columns: ProColumns<API.LnventoryList>[] = [
    {
      title: (
        <FormattedMessage
          id="lnventoryList.field.id"
          defaultMessage="序号"
        />
      ),
      dataIndex: 'id',
      search: false
    },
    {
      title: (
        <FormattedMessage
          id="lnventoryList.field.no"
          defaultMessage="产品编码"
        />
      ),
      dataIndex: 'no',
      render: (dom, entity) => {
        return (<div><a onClick={() => openDetailDarwer(entity)}>{entity.category.no}</a></div>)
      }
    },
    {
      title: (
        <FormattedMessage
          id="lnventoryList.field.productName"
          defaultMessage="产品名称"
        />
      ),
      dataIndex: 'productName',
      render: (dom, entity) => {
        return (
          <div>{entity.category.cn_name} / {entity.category.en_name}</div>
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="lnventoryList.field.warehouse"
          defaultMessage="仓库中/英文名称"
        />
      ),
      dataIndex: 'warehouse',
      search: false,
      render: (dom, entity) => {
        // console.log(entity)
        return (
          <div>
            {
              entity.warehouse &&
              <div>{entity.warehouse.cn_name} / {entity.warehouse.en_name}</div>
            }
          </div>
          //
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="lnventoryList.field.total_num"
          defaultMessage="库存数量"
        />
      ),
      dataIndex: 'total_num',
      search: false
    },
    {
      title: (
        <FormattedMessage
          id="lnventoryList.field.unit"
          defaultMessage="单位"
        />
      ),
      dataIndex: 'unit',
      search: false,
      render: (dom, entity) => {
        return (<div>{entity.category.unit}</div>)
      }
    },
    {
      title: (
        <FormattedMessage
          id="lnventoryList.field.brand"
          defaultMessage="品牌"
        />
      ),
      dataIndex: 'brand',
      render: (dom, entity) => {
        return (<div>{entity.category.brand.brand}</div>)
      },
      valueEnum: brandList?.reduce((acc, item) => {
        acc[`${item.id}`] = {text: item.brand_en};
        return acc;
      }, {}),
    },
    {
      title: (
        <FormattedMessage
          id="lnventoryList.field.operate"
          defaultMessage="操作"
        />
      ),
      dataIndex: 'operate',
      search: false,
      render: (dom, entity) => {
        return (
          <>
            <a type="primary" onClick={() => openDetailDarwer(entity)}>出/入库</a>
          </>
        )
      }
    },
  ]
  useEffect(() => {
    setColumnsStateMap(getStateMap(pathname))
    getBrandList().then(res => {
      setBrandList(Object.keys(res.data).map(key => res.data[key]))
    })
  }, [])

  const openDetailDarwer = (e) => {
    setCurrentMsg(e)
    setShowDetailDrawer(true)
  }

  const handleClose = () => {
    setCurrentMsg(undefined)
    setShowDetailDrawer(false)
  }

  return (
    <>
      <ProTable<API.LnventoryList, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'LnventoryList.table.title',
          defaultMessage: 'table list',
        })}
        scroll={{x: 'max-content'}}
        actionRef={actionRef}
        toolBarRender={() => [
          <Button
            type="primary"
            key="add"
            onClick={() => {
              setShowDetailDrawer(true);
            }}
          >
            出/入库
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
