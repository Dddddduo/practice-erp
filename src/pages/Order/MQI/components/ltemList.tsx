import React, { useEffect, useState } from "react"
import { ParamsType } from "@ant-design/pro-components";
import { FormattedMessage, useIntl } from '@umijs/max';
import { ProColumns, ProTable } from "@ant-design/pro-components";
import { Button, Form } from "antd";
import { getBrandList, getCityList, getShopList, getMarketList } from "@/services/ant-design-pro/report";
import { getClassTypeListOutSide } from "@/services/ant-design-pro/quotation";
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
  actionRef: any
}
const ItemList: React.FC<ItemListProps> = ({ onListData, actionRef }) => {
  const [form] = Form.useForm()
  const intl = useIntl()
  const [brandList, setBrandList]: any = useState([])
  const [cityList, setCityList]: any = useState([])
  const [marketList, setMarketList]: any = useState([])
  const [storeList, setStoreList]: any = useState([])
  const [typeLv1, setTypeLv1]: any = useState([
    {
      value: 'monthly',
      label: '月结',
    },
    {
      value: 'not_monthly',
      label: '单结',
    },
    {
      value: 'fix',
      label: '固定',
    },
    {
      value: 'other',
      label: '其他',
    },
    {
      value: 'mqi',
      label: '成本入mqi',
    },
  ])
  const [typeLv2, setTypeLv2]: any = useState([])

  const [columnsStateMap, setColumnsStateMap] = useState({});
  const location = useLocation();
  const currentPath = location.pathname;
  const pathname = currentPath.split('/')[currentPath.split('/').length - 1]

  const columns: ProColumns<API.WorkerProfitStatisParams>[] = [
    {
      title: '序号',
      dataIndex: 'id',
      search: false,
      render: (cur, row, index) => {
        return (
          <>{index + 1}</>
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="MQI.field.monthly_month"
          defaultMessage="月份"
        />
      ),
      dataIndex: 'monthly_month',
      search: false
    },
    {
      title: (
        <FormattedMessage
          id="MQI.field.last_completed_at"
          defaultMessage="完工日期"
        />
      ),
      dataIndex: 'last_completed_at',
      search: false
    },
    {
      title: (
        <FormattedMessage
          id="MQI.field.ma_type_cn"
          defaultMessage="维修类目"
        />
      ),
      dataIndex: 'ma_type_cn',
      search: false
    },
    {
      title: (
        <FormattedMessage
          id="MQI.field.ma_cate_cn"
          defaultMessage="维修项目"
        />
      ),
      dataIndex: 'ma_cate_cn',
      search: false
    },
    {
      title: (
        <FormattedMessage
          id="MQI.field.store_name_cn"
          defaultMessage="地址"
        />
      ),
      dataIndex: 'store_name_cn',
      search: false
    },
    {
      title: (
        <FormattedMessage
          id="MQI.field.work_desc"
          defaultMessage="工作内容"
        />
      ),
      dataIndex: 'work_desc',
      search: false
    },
    {
      title: (
        <FormattedMessage
          id="MQI.field.quo_no"
          defaultMessage="报价单编号"
        />
      ),
      dataIndex: 'quo_no',
    },
    {
      title: (
        <FormattedMessage
          id="MQI.field.orders"
          defaultMessage="订单编号"
        />
      ),
      hideInTable: true,
      dataIndex: 'orders',
    },
    {
      title: (
        <FormattedMessage
          id="MQI.field.brand_en"
          defaultMessage="品牌"
        />
      ),
      dataIndex: 'brand_en',
      valueType: 'select',
      fieldProps: {
        showSearch: true,
        options: brandList,
        onChange: (value, content) => {
          form.setFieldsValue({ store: undefined })
        }
      },
    },
    {
      title: '城市',
      dataIndex: 'city',
      hideInTable: true,
      valueType: 'select',
      fieldProps: {
        options: cityList,
        onChange: (value, content) => {
          form.setFieldsValue({ store: undefined, market: undefined })
        }
      },
    },
    {
      title: '商场',
      dataIndex: 'market',
      hideInTable: true,
      valueType: 'select',
      fieldProps: {
        options: marketList,
        onChange: (value, content) => {
          form.setFieldsValue({ store: undefined })
        }
      },
    },
    {
      title: '店铺',
      dataIndex: 'store',
      hideInTable: true,
      valueType: 'select',
      fieldProps: {
        options: storeList,
      },
    },
    {
      title: '申报日期',
      dataIndex: 'declare',
      hideInTable: true,
      valueType: 'dateRange',
    },
    {
      title: '创建报价',
      dataIndex: 'create',
      hideInTable: true,
      valueType: 'dateRange',
    },
    {
      title: '报价分类',
      dataIndex: 'typeLv1',
      hideInTable: true,
      valueType: 'select',
      fieldProps: {
        options: typeLv1,
      },
    },
    {
      title: '二级分类',
      dataIndex: 'typeLv2',
      hideInTable: true,
      valueType: 'select',
      fieldProps: {
        options: typeLv2,
      },
    },
    {
      title: (
        <FormattedMessage
          id="MQI.field.appendix_no"
          defaultMessage="第三方编号"
        />
      ),
      dataIndex: 'appendix_no',
      search: false
    },

    {
      title: (
        <FormattedMessage
          id="MQI.field.ex_tax_price"
          defaultMessage="税前总价"
        />
      ),
      dataIndex: 'ex_tax_price',
      search: false
    },
    {
      title: (
        <FormattedMessage
          id="MQI.field.tax_price"
          defaultMessage="税金"
        />
      ),
      dataIndex: 'tax_price',
      search: false
    },
    {
      title: (
        <FormattedMessage
          id="MQI.field.in_tax_price"
          defaultMessage="税后总价"
        />
      ),
      dataIndex: 'in_tax_price',
      search: false
    },
    {
      title: (
        <FormattedMessage
          id="MQI.field.total_cost"
          defaultMessage="成本"
        />
      ),
      dataIndex: 'total_cost',
      search: false
    },
    {
      title: (
        <FormattedMessage
          id="MQI.field.profit_price"
          defaultMessage="利润"
        />
      ),
      dataIndex: 'profit_price',
      search: false
    },
    {
      title: (
        <FormattedMessage
          id="MQI.field.profit_rate"
          defaultMessage="利润率"
        />
      ),
      dataIndex: 'profit_rate',
      search: false
    },
    {
      title: (
        <FormattedMessage
          id="MQI.field.leader"
          defaultMessage="负责人"
        />
      ),
      dataIndex: 'leader',
      search: false
    },
    {
      title: (
        <FormattedMessage
          id="MQI.field.store_contact_user"
          defaultMessage="客户联系人"
        />
      ),
      dataIndex: 'store_contact_user',
      search: false
    },
    {
      title: (
        <FormattedMessage
          id="MQI.field.boss"
          defaultMessage="boss"
        />
      ),
      dataIndex: 'boss',
      search: false
    },
  ]

  const initData = () => {
    getBrandList().then(res => {
      if (res.success) {
        setBrandList(res.data.map(item => {
          return {
            value: item.id,
            label: item.brand_en,
          }
        }))
      }
    })
    getCityList().then(res => {
      if (res.success) {
        setCityList(res.data.map(item => {
          return {
            value: item.id,
            label: item.city_cn,
          }
        }))
      }
    })
  }

  const handleSearchValuesChange = async (changedValues, allValues) => {
    // 获取店铺参数
    const shopParams: { city_id: string | number, brand_id: string | number, market_id: string | number } = {
      city_id: allValues['city'] ? allValues['city'] : '',
      brand_id: allValues['brand_en'] ? allValues['brand_en'] : '',
      market_id: allValues['city'] ? allValues['market'] : '',
    };
    if ('' !== shopParams['city_id'] || '' !== shopParams['brand_id'] || '' !== shopParams['market_id']) {
      const shopResponse = await getShopList(shopParams);
      setStoreList(shopResponse.data.map(item => {
        return {
          value: item.id,
          label: item.name_cn,
        }
      }))
    } else {
      setStoreList([])
    }
    if ('city' in changedValues) {
      const marketResponse = await getMarketList({ city_id: changedValues.city });
      setMarketList(marketResponse.data.map(item => {
        return {
          value: item.id,
          label: item.market_cn
        }
      }))
    }
    if (!allValues['city']) {
      setMarketList([])
    }
    if ('typeLv1' in changedValues) {
      form.setFieldsValue({ typeLv2: undefined })
      getClassTypeListOutSide({ class_type: changedValues.typeLv1 }).then(res => {
        if (res.success) {
          setTypeLv2(res.data.map(item => {
            return {
              value: item.id,
              label: item.class_type_plus,
            }
          }))
        }
      })
    }
    if (!allValues['typeLv1']) {
      setTypeLv2([])
    }
  }

  useEffect(() => {
    setColumnsStateMap(getStateMap(pathname))
    initData()
  }, [])

  return (
    <>
      <ProTable<API.WorkerProfitStatisParams, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'MQI.table.title',
          defaultMessage: 'table list',
        })}
        actionRef={actionRef}
        scroll={{ x: 'max-content' }}
        toolbar={{
          actions: [
            <Button type="primary">
              导出
            </Button>,
          ],
        }}
        form={{
          form,
          onValuesChange: handleSearchValuesChange
        }}
        columnEmptyText={false}
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
  )
}

export default ItemList
