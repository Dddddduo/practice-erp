import React, {useEffect, useState} from "react";
import {ParamsType, ProColumns, ProTable} from "@ant-design/pro-components";
import {FormattedMessage, useIntl} from "@umijs/max";
import {Button, Drawer, Space, Tag} from "antd";
import {getBrandList} from "@/services/ant-design-pro/report";
import {PlusOutlined} from "@ant-design/icons";
import AddSystem from "./AddSystem";
import {categoryAll, warehouseAll} from "@/services/ant-design-pro/system";
import {useLocation} from "@@/exports";
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
  actionRef
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
  // 品牌下拉框
  const [brandList, setBrandList]: any = useState([])
  const [category, setCategory]: any = useState([])
  const [warehouse, setWarehouse]: any = useState([])
  // 新增或者编辑抽屉
  const [showDetailDrawer, setShowDetailDrawer] = useState(false)
  const [currentMsg, setCurrentMsg] = useState()

  const [columnsStateMap, setColumnsStateMap] = useState({});
  const location = useLocation();
  const currentPath = location.pathname;
  const pathname = currentPath.split('/')[currentPath.split('/').length - 1]

  const columns: ProColumns<API.LnventoryRequisition>[] = [
    {
      title: (
        <FormattedMessage
          id="LnventoryRequisition.field.id"
          defaultMessage="序号"
        />
      ),
      dataIndex: 'id',
      search: false
    },
    {
      title: (
        <FormattedMessage
          id="LnventoryRequisition.field.no"
          defaultMessage="产品编码2233"
        />
      ),
      dataIndex: 'no',
      render: (dom, entity) => {
        return (<div>{entity.category.no}</div>)
      }
    },
    {
      title: (
        <FormattedMessage
          id="LnventoryRequisition.field.products"
          defaultMessage="产品中/英文名称"
        />
      ),
      dataIndex: 'products',
      render: (dom, entity) => {
        return (
          <div>{entity.category.cn_name} / {entity.category.en_name}</div>
        )
      }
    },
    {
      title: <FormattedMessage id="LnventoryRequisition.field.created_at" defaultMessage="操作时间"/>,
      dataIndex: 'created_at',
      valueType: 'dateRange',
      // hideInTable: true, // 在表格中隐藏
    },

    {
      title: (
        <FormattedMessage
          id="LnventoryRequisition.field.warehouse"
          defaultMessage="仓库中/英文名称"
        />
      ),
      dataIndex: 'warehouse',
      valueType: 'select',
      fieldProps: {
        showSearch: true
      },

      render: (dom, entity) => {
        return (
          <div>
            {
              entity.warehouse &&
              <div>{entity.warehouse.cn_name} / {entity.warehouse.en_name}</div>
            }
          </div>
        )
      },
      valueEnum: warehouse?.reduce((acc, item) => {
        acc[`${item.id}`] = {text: item.cn_name + ' / ' + item.en_name};
        return acc;
      }, {}),
    },
    {
      title: (
        <FormattedMessage
          id="LnventoryRequisition.field.buying"
          defaultMessage="采购方/供应方"
        />
      ),
      dataIndex: 'buying',
      search: false,
      render: (dom, entity) => {
        return (
          <div>{entity.op_name} / {entity.op_mobile}</div>
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="LnventoryRequisition.field.inventory.total_num"
          defaultMessage="当前库存数量"
        />
      ),
      dataIndex: 'total_num',
      search: false,
      render: (dom, entity) => {
        return (<div>{entity.inventory.total_num}</div>)
      }
    },
    {
      title: (
        <FormattedMessage
          id="LnventoryRequisition.field.apply_status"
          defaultMessage="申请状态"
        />
      ),
      dataIndex: 'apply_status',
      search: false,
      render: (dom, entity) => {
        return (
          <>
            {
              dom === 'agree' && <Tag color="blue">同意</Tag>
            }
            {
              dom === 'refuse' && <Tag color="red"></Tag>
            }
            {
              dom !== 'agree' && dom !== 'refuse' && <Tag color="blue">申请中</Tag>
            }
          </>
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="LnventoryRequisition.field.lend_status"
          defaultMessage="出库状态"
        />
      ),
      dataIndex: 'lend_status',
      search: false,
      render: (dom, entity) => {
        return (
          <>
            {
              dom === 'lend' && Date.parse(entity.end) < Date.parse(new Date()) &&
              <Tag color="red">超期未归还</Tag>
            }
            {
              dom === 'lend' &&
              <Tag color="blue">未归还</Tag>
            }
            {
              dom === 'return' &&
              <Tag color="green">已归还</Tag>
            }
            <div></div>
          </>
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="LnventoryRequisition.field.brand"
          defaultMessage="品牌"
        />
      ),
      dataIndex: 'brand',
      valueType: 'select',
      fieldProps: {
        showSearch: true
      },

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
          id="LnventoryRequisition.field.num"
          defaultMessage="操作数量"
        />
      ),
      dataIndex: 'num',
      search: false
    },
    {
      title: (
        <FormattedMessage
          id="LnventoryRequisition.field.username"
          defaultMessage="申请人"
        />
      ),
      dataIndex: 'username',
      valueType: 'select',
      fieldProps: {
        showSearch: true
      },

      render: (dom, entity) => {
        return (<div>{entity.user.username}</div>)
      }
    },
    {
      title: (
        <FormattedMessage
          id="LnventoryRequisition.field.typeOperation"
          defaultMessage="操作类型"
        />
      ),
      dataIndex: 'typeOperation',
      valueType: 'select',
      hideInTable: true,
      fieldProps: {
        showSearch: true
      },

    },

    {
      title: (
        <FormattedMessage
          id="LnventoryRequisition.field.remark"
          defaultMessage="备注"
        />
      ),
      dataIndex: 'remark',
      search: false,
    },
    {
      title: (
        <FormattedMessage
          id="LnventoryRequisition.field.operate"
          defaultMessage="操作"
        />
      ),
      dataIndex: 'operate',
      search: false,
      render: (dom, entity) => {
        return (
          <>
            {
              entity.apply_status === 'create' &&
              <Space>
                <Button type="primary">同意</Button>
                <Button type="primary"></Button>
              </Space>
            }
            {
              (entity.apply_status === 'agree' && entity.lend_status !== 'lend') &&
              <Button type="primary">出库</Button>
            }
            {
              entity.lend_status === 'lend' &&
              <Button>归还</Button>
            }
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
    categoryAll().then(res => {
      setCategory(res.data)
    })
    warehouseAll().then(res => {
      setWarehouse(res.data)
    })

  }, [])

  return (
    <>
      <ProTable<API.LnventoryRequisition, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'LnventoryRequisition.table.title',
          defaultMessage: 'table list',
        })}
        search={{
          labelWidth: 120,
        }}
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
            <PlusOutlined/> <FormattedMessage id="pages.searchTable.new" defaultMessage="New"/>
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
        title="申请"
        open={showDetailDrawer}
        onClose={handleClose}
        destroyOnClose={true}
      >
        <AddSystem
          brandList={brandList}
          category={category}
          warehouse={warehouse}
          handleClose={handleClose}
          actionRef={actionRef}
          success={success}
          error={error}
        />
      </Drawer>

    </>
  )
}
export default ItemList
