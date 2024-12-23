import React, { useEffect, useState, RefObject } from "react"
import { ActionType } from '@ant-design/pro-components';
import { Button, Space, Form, Input, Select } from "antd";
import type { SelectProps } from 'antd';
import { getMarketList, getShopList } from "@/services/ant-design-pro/report";
import { SearchType } from "..";
import { getQuoFixedAreaManagerListAll, createOrUpdateQuoFixed } from "@/services/ant-design-pro/fixedMonthly";

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

// 3 - 5(YSL)
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

interface ItemListProps {
  actionRef: RefObject<ActionType>;
  success: (text: string) => void
  error: (text: string) => void
  currentItem: any
  searchData: {
    brands: any
    cities: any
    markets: any
    manager: any
    stores: any
    type: any
  }
  onSearchSelectedChild: (type: string, field: string, data: []) => void;
  handleCloseDetail: () => void
}

const CreateOrUpdate: React.FC<ItemListProps> = ({
  currentItem,
  actionRef,
  success,
  error,
  searchData,
  onSearchSelectedChild,
  handleCloseDetail
}) => {

  const [form] = Form.useForm()
  const [brandId, setBrandId] = useState()
  const [cityId, setCityId] = useState()
  const [marketId, setMarketId] = useState()
  const [changeType, setChangeType] = useState([])

  const handleFinish = (values) => {
    const params = {
      quo_fixed_id: currentItem ? currentItem.quo_fixed_id : '',
      shop_name: currentItem ? currentItem.shop_name_cn : '',
      brand_id: values.brand ?? '',
      city_id: values.city ?? '',
      market_id: values.city ?? '',
      type: values.type ?? '',
      shop_id: currentItem ? currentItem.shop_id : values.store ?? '',
      monthly_amount: values.monthly_amount ?? '',
      quarterly_amount: values.quarterly_amount ?? '',
      cycle: values.cycle ?? '',
      remark: values.remark ?? '',
      area_manager: values.manager ?? ''
    }
    createOrUpdateQuoFixed(params).then(res => {
      if (res.success) {
        handleCloseDetail()
        actionRef?.current?.reload()
        success('操作成功')
        return
      }
      error(res.message)
    })
  }

  const optionsBrand: SelectProps['options'] = searchData.brands.map((item: any) => {
    return {
      value: item.id,
      label: item.brand_en,
    };
  });

  const optionsCities: SelectProps['options'] = searchData.cities.map((item: any) => {
    return {
      value: item.id,
      label: item.city_cn,
    };
  });

  const optionsMarket: SelectProps['options'] = searchData.markets.map((item: any) => {
    return {
      value: item.id,
      label: item.market_cn,
    };
  });

  const optionsStore: SelectProps['options'] = searchData.stores.map((item: any) => {
    return {
      value: item.id,
      label: item.name_cn,
    };
  });

  // const optionsType: SelectProps['options'] = searchData.type.map((item: any) => {
  //   return {
  //     value: item.type,
  //     label: item.name,
  //   };
  // });

  const handleChangeType = (brand_id: any) => {
    console.log('打印brand_id', brand_id)
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
  }

  const handleChangeBrand = (e) => {
    setBrandId(e)
    form.setFieldsValue({ store: undefined, manager: undefined, type: undefined })
    const params = {
      brand_id: e,
      city_id: cityId ?? '',
      market_id: marketId ?? ''
    }
    getShopList(params).then(res => {
      onSearchSelectedChild(SearchType.LoadData, 'stores', res.data);
    })
    getQuoFixedAreaManagerListAll({ brand_id: e }).then(res => {
      const formatData = res.data.map((item) => {
        return { value: item, label: item }
      })
      onSearchSelectedChild(SearchType.LoadData, 'manager', formatData);
    })
    handleChangeType(e)
  }

  const handleChangeCity = (e) => {
    setCityId(e)
    form.setFieldsValue({ store: undefined, market: undefined })
    getMarketList({ city_id: e }).then(res => {
      onSearchSelectedChild(SearchType.LoadData, 'markets', res.data);
    })
  }

  const handleChangeMarket = (e) => {
    setMarketId(e)
    form.setFieldsValue({ store: undefined })
    const params = {
      brand_id: brandId ?? '',
      city_id: cityId ?? '',
      market_id: e
    }
    getShopList(params).then(res => {
      onSearchSelectedChild(SearchType.LoadData, 'stores', res.data);
    })
  }

  useEffect(() => {
    console.log(currentItem);
    if (!currentItem) {
      return
    }

    handleChangeType(currentItem.brand_id ?? 0)

    form.setFieldsValue({
      brand: currentItem.brand_id ?? '',
      city: currentItem.city_id ?? '',
      market: currentItem.market_id ?? '',
      store: currentItem.shop_name_cn ?? '',
      type: currentItem.type ?? '',
      monthly_amount: currentItem.monthly_amount ?? '',
      quarterly_amount: currentItem.quarterly_amount ?? '',
      cycle: currentItem.cycle ?? '',
      remark: currentItem.remark ?? '',
      manager: currentItem.area_manager ?? '',
    })
  }, [])

  return (
    <Form
      form={form}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      onFinish={handleFinish}
    >
      <Form.Item label="品牌" name="brand">
        <Select placeholder="请选择" options={optionsBrand} onChange={handleChangeBrand} allowClear />
      </Form.Item>
      {
        !currentItem &&
        <>
          <Form.Item label="城市" name="city">
            <Select placeholder="请选择" options={optionsCities} onChange={handleChangeCity} allowClear />
          </Form.Item>
          <Form.Item label="商场" name="market">
            <Select placeholder="请选择" options={optionsMarket} onChange={handleChangeMarket} allowClear />
          </Form.Item>
        </>
      }

      <Form.Item label="店铺" name="store">
        {
          currentItem ?
            <Input readOnly bordered={false} /> :
            <Select placeholder="请选择" options={optionsStore} allowClear />
        }
      </Form.Item>

      <Form.Item label="类型" name="type">
        <Select placeholder="请选择" options={changeType} allowClear />
      </Form.Item>

      <Form.Item label="单月费用" name="monthly_amount">
        <Input />
      </Form.Item>
      <Form.Item label="季度费用  " name="quarterly_amount">
        <Input />
      </Form.Item>
      <Form.Item label="收取月份" name="cycle">
        <Input />
      </Form.Item>
      <Form.Item label="备注" name="remark">
        <Input />
      </Form.Item>
      <Form.Item label="管理员" name="manager">
        <Select placeholder="请选择" options={searchData.manager} allowClear />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">确定</Button>
          <Button type="primary" danger onClick={handleCloseDetail}>取消</Button>
        </Space>
      </Form.Item>
    </Form>
  )
}

export default CreateOrUpdate
