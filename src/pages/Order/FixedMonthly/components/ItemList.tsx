import React, { useEffect, useState, RefObject } from "react"
import { ParamsType, ProColumns, ProTable, ActionType } from '@ant-design/pro-components';
import {FormattedMessage, useIntl, useLocation} from "@@/exports";
import { getMarketList, getShopList } from "@/services/ant-design-pro/report";
import { isEmpty, isUndefined, uniq } from "lodash";
import { SearchType } from "..";
import { Button, Tag, Modal, Drawer, Form, Space, Popconfirm } from 'antd'
import { PlusOutlined, ShoppingCartOutlined, ContainerOutlined } from "@ant-design/icons";
import { getQuoFixedAreaManagerListAll, delQuoFixed, mergeQuoFixed } from "@/services/ant-design-pro/fixedMonthly";
import {getStateMap, LocalStorageService, setStateMap} from "@/utils/utils";
import Car from "./Car";
import CreateOrUpdate from "./CreateOrUpdate";

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
  searchData: [],
  onSearchSelectedChild: (type: string, field: string, data: []) => void;
  actionRef: RefObject<ActionType>;
  success: (text: string) => void
  error: (text: string) => void
}


// 1 - 12(SMCP)
const GUCCI_TYPE = [
  {
    value: 'fit-out',
    label: '内装'
  },
  {
    value: 'E-M',
    label: '机电'
  },
  {
    value: 'AC-sterile',
    label: '空调消毒'
  }
];

// 2
const DIOR_TYPE = [
  {
    value: 'fix',
    label: '固定'
  }
]

// 3 - 5(YSL) - 12(SMCP)
const FENDI_TYPE = [
  {
    value: 'E-M',
    label: '机电'
  },
  {
    value: 'fit-out-E-M',
    label: '内装+机电'
  }
];

// 4
const BV_TYPE = [
  {
    value: 'lighting',
    label: '灯具',
  },
  {
    value: 'E-M',
    label: '空调',
  },
  {
    value: 'fit-out',
    label: '内装',
  },
]


// 9
const MO_TYPE = [
  {
    value: 'E-M',
    label: '空调'
  },
  {
    value: 'F-Cost',
    label: '消防'
  }
];



const ItemList: React.FC<ItemListProps> = ({
  actionRef,
  onListData,
  searchData,
  onSearchSelectedChild,
  success,
  error
}) => {

  const intl = useIntl()
  const [form] = Form.useForm()
  const [brandId, setBrandId]: number = useState()
  const [type, setType]: string = useState('')
  const [showCar, setShowCar] = useState(false)
  const [showDetail, setShowDetail] = useState(false)
  const [currentItem, setCurrentItem] = useState()
  const [title, setTitle] = useState('')
  const [catList, setCarList] = useState(LocalStorageService.getItem('fixedMonthlyCar') || [])
  // 选中项
  const [selectedRowsState, setSelectedRows] = useState<API.RuleListItem[]>([]);
  const [columnsStateMap, setColumnsStateMap] = useState({});
  const location = useLocation();
  const currentPath = location.pathname;
  const pathname = currentPath.split('/')[currentPath.split('/').length - 1]
  const [changeType, setChangeType] = useState([])
  const [hideInSearch, setHideInSearch] = useState(false)
  /**
   * 处理表格行选中
   * @param _
   * @param selectedRows
   */
  const handleRowSelection = (_, selectedRows) => {
    setSelectedRows(selectedRows);
  }

  const handleSearchValuesChange = async (changedValues, allValues) => {
    // 获取店铺参数
    const shopParams: { city_id: string | number, brand_id: string | number, market_id: string | number } = {
      city_id: allValues['city_cn'] ?? '',
      brand_id: allValues['brand_en'] ?? '',
      market_id: allValues['market_cn'] ?? '',
    };

    if ('city_name_cn' in changedValues) {
      const marketResponse = await getMarketList({ city_id: changedValues.city_name_cn });
      onSearchSelectedChild(SearchType.LoadData, 'markets', marketResponse.data);
    }
    if ('brand' in changedValues) {
      setBrandId(changedValues.brand)
      const managerResponse = await getQuoFixedAreaManagerListAll({ brand_id: changedValues.brand })
      const formatData = managerResponse.data.map((item) => {
        return { value: item, label: item }
      })
      onSearchSelectedChild(SearchType.LoadData, 'manager', formatData);
    }

    if ('type' in changedValues) {
      setType(changedValues.type)
    }
  }

  const handleConfirm = (entity) => {
    console.log(entity);
    delQuoFixed({ quo_fixed_id: entity.quo_fixed_id }).then(res => {
      if (res.success) {
        actionRef?.current.reload()
        success('删除成功')
        return
      }
      error(res.message)
    })
  }

  const summaryMonthly = () => {
    if (isUndefined(brandId)) {
      error('请选择品牌')
      return
    }
    const params = {
      brand_id: brandId,
      quo_merge_id: '',
      title_info: '',
      type: type,
      shop_ids_arr: selectedRowsState.map((item: any) => item.shop_id) ?? []
    }
    mergeQuoFixed(params).then(res => {
      if (res.success) {
        window.open(`/quotation-summary-pdf?merge_quo_id=${res.data.STORE}&brand_id=${brandId}&type=fixed`)
      }
    })
  }

  const addCar = () => {
    setCarList(uniq([...catList, ...selectedRowsState]))
    // setSelectedRows([])
    actionRef.current?.clearSelected()
    LocalStorageService.setItem('fixedMonthlyCar', uniq([...catList, ...selectedRowsState]))
  }

  const handleCloseCar = () => {
    setShowCar(false)
  }

  const update = (entity) => {
    console.log('打印items数据', entity)
    setCurrentItem(entity)
    setShowDetail(true)
    setTitle('修改店铺月结数据')
  }

  const handleCloseDetail = () => {
    setCurrentItem(undefined)
    setTitle('')
    setShowDetail(false)
  }

  const handleChangeType = (brand_id: any) => {
    if (brand_id === 1) {
      setChangeType(GUCCI_TYPE)
    }
    if (brand_id === 3 || brand_id === 5 || brand_id === 12) {
      setChangeType(FENDI_TYPE)
    }
    if (brand_id === 9) {
      setChangeType(MO_TYPE)
    }
    if (brand_id === 2) {
      setChangeType(DIOR_TYPE)
    }
    if (brand_id === 4) {
      setChangeType(BV_TYPE)
    }

    if (brand_id === 2 || brand_id === 12) {
      setHideInSearch(true)
    } else {
      setHideInSearch(false)
    }
  }

  const columns: ProColumns<API.FixedMonthlyParams>[] = [
    {
      title: (
        <FormattedMessage
          id="fixedMonthly.field.quo_fixed_id"
          defaultMessage="序号"
        />
      ),
      dataIndex: 'quo_fixed_id',
      search: false
    },
    {
      title: (
        <FormattedMessage
          id="fixedMonthly.field.shop_name_cn"
          defaultMessage="店铺名"
        />
      ),
      dataIndex: 'shop_name_cn',
      search: false
    },
    {
      title: (
        <FormattedMessage
          id="fixedMonthly.field.shop_name_en"
          defaultMessage="英文名"
        />
      ),
      dataIndex: 'shop_name_en',
      search: false
    },
    {
      title: (
        <FormattedMessage
          id="fixedMonthly.field.shop_no"
          defaultMessage="店铺编号"
        />
      ),
      dataIndex: 'shop_no',
      search: false
    },
    {
      title: (
        <FormattedMessage
          id="fixedMonthly.field.city_name_cn"
          defaultMessage="城市"
        />
      ),
      dataIndex: 'city_name_cn',
      valueType: 'select',
      valueEnum: searchData.cities.reduce((acc, item) => {
        acc[`${item.id}`] = { text: item.city_cn };
        return acc;
      }, {}),
      fieldProps: {
        showSearch: true,
        onChange: (key, option) => {
          form.setFieldsValue({ market_name_cn: undefined });
          if (isEmpty(key) && isEmpty(option)) {
            onSearchSelectedChild(SearchType.DeleteData, 'markets', []);
          }
        },
        options: []
      },
    },
    {
      title: (
        <FormattedMessage
          id="fixedMonthly.field.market_name_cn"
          defaultMessage="商场"
        />
      ),
      dataIndex: 'market_name_cn',
      valueType: 'select',
      valueEnum: searchData.markets?.reduce((acc, item) => {
        acc[`${item.id}`] = { text: item.market_cn };
        return acc;
      }, {}),
      fieldProps: {
        showSearch: true
      },
    },
    {
      title: (
        <FormattedMessage
          id="fixedMonthly.field.brand"
          defaultMessage="品牌"
        />
      ),
      dataIndex: 'brand',
      hideInTable: true,
      valueType: 'select',
      // valueEnum: searchData.brands?.reduce((acc, item) => {
      //   acc[`${item.id}`] = { text: item.brand_en };
      //   return acc;
      // }, {}),
      fieldProps: {
        options: [
          ...searchData.brands?.map(item => ({
            value: item.id,
            label: item.brand_en
          }))
        ],
        showSearch: true,
        onChange: (key, option) => {
          form.setFieldsValue({ administrator: undefined, type: undefined });

          if (isEmpty(key) && isEmpty(option)) {
            onSearchSelectedChild(SearchType.DeleteData, 'manager', []);
          }
          console.log('key', key, 'option', option)
          // 更换类型
          handleChangeType(key)
        },
      },
    },
    {
      title: (
        <FormattedMessage
          id="fixedMonthly.field.type"
          defaultMessage="类型"
        />
      ),
      dataIndex: 'type',
      hideInTable: true,
      hideInSearch: hideInSearch,
      valueType: 'select',
      // valueEnum: searchData.type?.reduce((acc, item) => {
      //   acc[`${item.type}`] = { text: item.name };
      //   return acc;
      // }, {}),
      fieldProps: {
        showSearch: true,
        options: changeType
      },
    },
    {
      title: (
        <FormattedMessage
          id="fixedMonthly.field.monthly_amount"
          defaultMessage="月结费用"
        />
      ),
      dataIndex: 'monthly_amount',
      search: false
    },
    {
      title: (
        <FormattedMessage
          id="fixedMonthly.field.quarterly_amount"
          defaultMessage="季度费用"
        />
      ),
      dataIndex: 'quarterly_amount',
      search: false
    },
    {
      title: (
        <FormattedMessage
          id="fixedMonthly.field.cycle"
          defaultMessage="服务月份"
        />
      ),
      dataIndex: 'cycle',
      search: false
    },
    {
      title: (
        <FormattedMessage
          id="fixedMonthly.field.area_manager"
          defaultMessage="管理员"
        />
      ),
      dataIndex: 'area_manager',
      valueType: 'select',
      hideInSearch: hideInSearch,
      fieldProps: {
        showSearch: true,
        mode: 'multiple',
        options: searchData.manager
      }
    },
    {
      title: (
        <FormattedMessage
          id="fixedMonthly.field.operate"
          defaultMessage="操作"
        />
      ),
      dataIndex: 'operate',
      search: false,
      render: (dom, entity) => {
        return (
          <Space>
            <Button type="primary" onClick={() => update(entity)}>修改</Button>
            <Popconfirm
              title="警告"
              description="确定要删除吗?"
              onConfirm={() => handleConfirm(entity)}
              okText="确定"
              cancelText="取消"
            >
              <Button type="primary" danger>删除</Button>
            </Popconfirm>
          </Space>
        )
      }
    },
  ]

  useEffect(() => {

    console.log('searchData', searchData)

  if (!isEmpty(searchData.brands)) {
    console.log('查看数据xxxxx', searchData.brands?.reduce((acc, item) => {
      acc[`${item.id}`] = { text: item.brand_en };
      return acc;
    }, {}),)
  }

    setColumnsStateMap(getStateMap(pathname))
  }, [searchData])


  return (
    <>
      <ProTable<API.FixedMonthlyParams, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'fixedMonthly.table.title',
          defaultMessage: 'table list',
        })}
        actionRef={actionRef}
        scroll={{ x: 'max-content' }}
        search={{
          labelWidth: 120,
        }}
        request={onListData}
        columns={columns}
        rowSelection={{
          onChange: handleRowSelection
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            icon={<ContainerOutlined />}
            onClick={() => {
              setShowCar(true);
            }}
          >
            <FormattedMessage id="pages.searchTable.showCar" defaultMessage="ShowCar" />
            <span style={{ color: 'red', marginLeft: 5 }}>
              {
                !catList ||
                  catList.length < 1 ?
                  '' :
                  catList.length
              }
            </span>
          </Button>,
          <Button
            type="primary"
            key="primary"
            disabled={selectedRowsState.length < 1}
            icon={<ShoppingCartOutlined />}
            onClick={addCar}
          >
            <FormattedMessage id="pages.searchTable.addCar" defaultMessage="AddCar" />
          </Button>,
          <Button
            type="primary"
            key="primary"
            disabled={selectedRowsState.length < 1}
            icon={<PlusOutlined />}
            onClick={summaryMonthly}
          >
            <FormattedMessage id="pages.searchTable.summary" defaultMessage="Summary" />
          </Button>,
          <Button
            type="primary"
            key="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setShowDetail(true)
              setTitle('新增店铺月结数据')
            }}
          >
            <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          </Button>,
        ]}
        form={{
          form,
          onValuesChange: handleSearchValuesChange
        }}
        columnsState={{
          value: columnsStateMap,
          onChange: (newState) => {
            setColumnsStateMap(newState)
            setStateMap(pathname, newState)
          }
        }}
      />

      <Modal
        width={800}
        open={showCar}
        onCancel={handleCloseCar}
        footer={null}
        destroyOnClose={true}
        title="待汇总店铺"
      >
        <Car
          actionRef={actionRef}
          success={success}
          error={error}
          handleCloseCar={handleCloseCar}
          brandId={brandId}
          type={type}
          catList={catList}
          setCarList={setCarList}
        />
      </Modal>

      <Drawer
        open={showDetail}
        onClose={handleCloseDetail}
        width={600}
        destroyOnClose={true}
        title={title}
      >
        <CreateOrUpdate
          actionRef={actionRef}
          success={success}
          error={error}
          currentItem={currentItem}
          searchData={searchData}
          onSearchSelectedChild={onSearchSelectedChild}
          handleCloseDetail={handleCloseDetail}
        />
      </Drawer>
    </>
  )
}

export default ItemList
