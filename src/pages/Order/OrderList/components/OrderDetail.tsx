import React, { useEffect, useState, RefObject } from 'react'
import { Typography, Form, Select, Button, Space } from 'antd'
import type { SelectProps } from 'antd';
import { getMarketList, getShopList } from "@/services/ant-design-pro/report";
import { getCompanyList, updateOrder } from '@/services/ant-design-pro/orderList';
import { ActionType } from '@ant-design/pro-components';

interface ItemListProps {
  currentOrder: any
  brandList
  cityList
  closeOrderDetail: () => void
  actionRef: RefObject<ActionType>;
}

const OrderDetail: React.FC<ItemListProps> = ({
  currentOrder,
  brandList,
  cityList,
  closeOrderDetail,
  actionRef
}) => {
  const [form] = Form.useForm();
  const [currentBrandId, setCurrentBrandId] = useState<number>(0)
  const [currentCityId, setCurrentCityId] = useState<number>(0)
  const [currentMarketId, setCurrentMarketId] = useState<number>(0)
  const [markerList, setMarketList]: any = useState()
  const [shopList, setShopList]: any = useState()
  const [companyList, setCompanyList]: any = useState()


  const getIdByName = (name) => {
    const brandId = optionsBrand?.find(item => item.label === name)
    const cityId = optionsCity?.find(item => item.label === name)
    const marketId = optionsMarket?.find(item => item.label === name)
    const shopId = optionsShop?.find(item => item.label === name)
    const companyId = optionsCompany?.find(item => item.label === name)
    return {
      brand_id: brandId ? brandId.value : undefined,
      city_id: cityId ? cityId.value : undefined,
      market_id: marketId ? marketId.value : undefined,
      shop_id: shopId ? shopId.value : undefined,
      company_id: companyId ? companyId.value : undefined,
    }
  }

  const handleFinish = (values) => {
    const params = {
      order_id: currentOrder?.order_id,
      brand_id: getIdByName(values.brand).brand_id || values.brand,
      city_id: getIdByName(values.city).city_id || values.city,
      market_id: getIdByName(values.market).market_id || values.market,
      store_id: getIdByName(values.shop).shop_id || values.shop,
      company_id: getIdByName(values.company).company_id || values.company,
    }
    updateOrder(params).then(res => {
      closeOrderDetail()
      actionRef?.current?.reload();
    })
  }

  const handleChangeBrand = async (value) => {
    setCurrentBrandId(value)
    form.setFieldsValue({
      shop: undefined
    })
    getShopList({ brand_id: value, city_id: currentCityId, market_id: currentMarketId }).then(res => {
      setShopList(res.data)
    })
  }


  const getCompanies = () => {
    getCompanyList().then(res => {
      setCompanyList(res.data)
    })
  }

  const handleChangeCity = async (value) => {
    form.setFieldsValue({
      market: undefined,
      shop: undefined
    })
    setCurrentCityId(value)
    const marketResponse = await getMarketList({ city_id: value });
    setMarketList(marketResponse.data)
    getShopList({ brand_id: currentBrandId, city_id: value, market_id: '' }).then(res => {
      setShopList(res.data)
    })
  }

  const handleChangeMarket = (value) => {
    setCurrentMarketId(value)
    form.setFieldsValue({
      shop: undefined
    })
    getShopList({ brand_id: currentBrandId, city_id: currentCityId, market_id: value }).then(res => {
      setShopList(res.data)
    })
  }

  const optionsBrand: SelectProps['options'] = brandList.map((item: any) => {
    return {
      value: item.id,
      label: item.brand_en,
    };
  });

  const optionsCity: SelectProps['options'] = cityList.map((item: any) => {
    return {
      value: item.id,
      label: item.city_cn,
    };
  });

  const optionsMarket: SelectProps['options'] = markerList?.map((item: any) => {
    return {
      value: item.id,
      label: item.market_cn,
    };
  });

  const optionsShop: SelectProps['options'] = shopList?.map((item: any) => {
    return {
      value: item.id,
      label: item.name_cn,
    };
  });

  const optionsCompany: SelectProps['options'] = companyList?.map((item: any) => {
    return {
      value: item.id,
      label: item.company_en || item.company_cn,
    };
  });

  useEffect(() => {
    const initSelect = async () => {
      if (currentOrder.market_cn) {
        const params: any = {
          city_id: getIdByName(currentOrder.city_cn).city_id
        }
        const marketResponse = await getMarketList(params);
        setMarketList(marketResponse.data)
      }
      if (currentOrder.store_id) {
        const params: any = {
          brand_id: currentOrder.brand_id,
          city_id: currentOrder.city_id,
          market_id: currentOrder.market_id
        }
        getShopList(params).then(res => {
          setShopList(res.data)
        })
      }
    }

    if (currentOrder) {
      setCurrentBrandId(currentOrder.brand_id)
      setCurrentCityId(currentOrder.city_id)
      setCurrentMarketId(currentOrder.market_id)
      initSelect()
      form.setFieldsValue({
        brand: currentOrder?.brand_id,
        city: currentOrder?.city_id,
        market: currentOrder?.market_id,
        shop: currentOrder?.store_id,
        company: currentOrder?.company_en
      })
    }

    getCompanies()


  }, [currentOrder])

  return (
    <>
      <Typography.Title level={3}>更新订单</Typography.Title>
      <Form
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600, marginTop: 50 }}
        onFinish={handleFinish}
      // initialValues={}
      >
        <Form.Item label="品牌" name="brand">
          <Select
            placeholder="请选择品牌"
            options={optionsBrand}
            onChange={handleChangeBrand}
            allowClear
            showSearch
            filterOption={(input, option) => (option?.label ?? '').includes(input)}
          ></Select>
        </Form.Item>

        <Form.Item label="城市" name="city">
          <Select
            placeholder="请选择城市"
            options={optionsCity}
            onChange={handleChangeCity}
            allowClear
            showSearch
            filterOption={(input, option) => (option?.label ?? '').includes(input)}
          ></Select>
        </Form.Item>

        <Form.Item label="商场" name="market">
          <Select
            placeholder="请选择商场"
            options={optionsMarket}
            onChange={handleChangeMarket}
            allowClear
            showSearch
            filterOption={(input, option) => (option?.label ?? '').includes(input)}
          ></Select>
        </Form.Item>

        <Form.Item label="店铺" name="shop">
          <Select
            placeholder="请选择店铺"
            options={optionsShop}
            allowClear
            showSearch
            filterOption={(input, option) => (option?.label ?? '').includes(input)}
          ></Select>
        </Form.Item>

        <Form.Item label="公司" name="company">
          <Select
            placeholder="请选择公司"
            options={optionsCompany}
            allowClear
            showSearch
            filterOption={(input, option) => (option?.label ?? '').includes(input)}
          ></Select>
        </Form.Item>

        <Form.Item>
          <Space style={{
            position: 'relative',
            left: 400,
            top: 20
          }}>
            <Button type='primary' htmlType='submit'>更新</Button>
            <Button onClick={closeOrderDetail}>取消</Button>
          </Space>
        </Form.Item>
      </Form>
    </>
  )
}

export default OrderDetail