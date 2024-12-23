import {Button, DatePicker, Form, Input, message, Select, SelectProps, Space} from "antd";
import React, {RefObject, useEffect, useState} from "react";
import {createOrder, getCompanyList, getMaCateLv0List, getMaCateLv1List} from "@/services/ant-design-pro/orderList";
import {getMarketList, getShopList} from "@/services/ant-design-pro/report";
import {ActionType} from "@ant-design/pro-components";
import dayjs from "dayjs";

interface CreateOrderProps {
  brandList
  cityList
  closeOrderDetail: () => void
  actionRef: RefObject<ActionType>
}

const CreateOrder: React.FC<CreateOrderProps> = ({
                                                   brandList,
                                                   cityList,
                                                   closeOrderDetail,
                                                   actionRef
                                                 }) =>  {
  const [form] = Form.useForm();
  const [currentBrandId, setCurrentBrandId] = useState<number>(0)
  const [currentCityId, setCurrentCityId] = useState<number>(0)
  const [currentMarketId, setCurrentMarketId] = useState<number>(0)
  const [markerList, setMarketList]: any = useState()
  const [shopList, setShopList]: any = useState()
  const [companyList, setCompanyList]: any = useState()
  const [maTypeList, setMaTypeList]: any = useState([])
  const [maItemList, setMaItemList]: any = useState([])
  const [maCateList, setMaCateList]: any = useState([])
  const [maType, setMaType] = useState('')
  const [messageApi, contextHolder] = message.useMessage()

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
    console.log('valauauueueueues', values)
    console.log('ddddddddddd', dayjs(values.appo_at).format('YYYY-MM-DD'))
    const params = {
      store_id: getIdByName(values.shop).shop_id || values.shop,
      company_id: getIdByName(values.company).company_id || values.company,
      ma_type: maType,
      ma_item_list: maItemList
    }
    createOrder(params).then(res => {
      if (res.success) {
        messageApi.success('创建成功')
        closeOrderDetail()
        actionRef?.current?.reload();
      } else {
        messageApi.error(res.message)
      }
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

  const handleChangeMaType = (value) => {
    setMaType(value)

    getMaCateLv1List({p_type: value}).then((res) => {
      console.log('reeeeeeee', res)
      if (res.success) {
        let result: any = []
        for (const item of res.data) {
          result.push({
            value: item.id,
            label: item.cn_name
          })
        }
        setMaCateList(result)
      }
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

  const handleChangeMaCateId = (e, item, index) => {
    const newItemList = [...maItemList];
    newItemList[index] = {...newItemList[index], ma_cate_id: e};
    setMaItemList(newItemList)
  }

  const handleInputProDesc = (e, index) => {
    const newItemList = [...maItemList];
    newItemList[index] = {...newItemList[index], prob_desc: e.target.value};
    setMaItemList(newItemList)
  }

  const handleInputLocation = (e, index) => {
    const newItemList = [...maItemList];
    newItemList[index] = {...newItemList[index], location: e.target.value};
    setMaItemList(newItemList)
  }

  const changeAppoAt = (e) => {
    console.log('eeeeeeeeeeeeeee', e)
  }

  // @ts-ignore
  useEffect(async () => {
    getCompanies()
    const maTypeResults = await getMaCateLv0List()
    console.log('maTypeResultsmaTypeResults', maTypeResults)
    if (maTypeResults.success) {
      let data:any = []
      // eslint-disable-next-line guard-for-in
      for (const item in maTypeResults.data) {
        data.push({
          value: item,
          label: maTypeResults.data[item]
        })
      }
      setMaTypeList(data)
    }
    setMaItemList([{
      prob_desc: '',
      ma_cate_id: '',
      location: '',
      file_ids: ''
    }])

  }, [])

  // @ts-ignore
  return (
    <>
      {contextHolder}
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
          />
        </Form.Item>

        <Form.Item label="城市" name="city">
          <Select
            placeholder="请选择城市"
            options={optionsCity}
            onChange={handleChangeCity}
            allowClear
            showSearch
            filterOption={(input, option) => (option?.label ?? '').includes(input)}
          />
        </Form.Item>

        <Form.Item label="商场" name="market">
          <Select
            placeholder="请选择商场"
            options={optionsMarket}
            onChange={handleChangeMarket}
            allowClear
            showSearch
            filterOption={(input, option) => (option?.label ?? '').includes(input)}
          />
        </Form.Item>

        <Form.Item label="店铺" name="shop">
          <Select
            placeholder="请选择店铺"
            options={optionsShop}
            allowClear
            showSearch
            filterOption={(input, option) => (option?.label ?? '').includes(input)}
            rules={[{ required: true, message: 'Please input your store!' }]}
          />
        </Form.Item>

        <Form.Item label="公司" name="company">
          <Select
            placeholder="请选择公司"
            options={optionsCompany}
            allowClear
            showSearch
            filterOption={(input, option) => (option?.label ?? '').includes(input)}
          />
        </Form.Item>

        <Form.Item label={"维修类型"} name={"ma_type"}>
          <Select
            placeholder="请选择维修类型"
            options={maTypeList}
            onChange={handleChangeMaType}
            allowClear
            showSearch
            filterOption={(input, option) => (option?.label ?? '').includes(input)}
          />
        </Form.Item>

        {
          maType === 'not_urgent' &&
          <Form.Item label={"预约日期"} name={"appo_at"}>
            <DatePicker onChange={changeAppoAt} format={"YYYY-MM-DD"} />
          </Form.Item>
        }


        {maItemList && maItemList.map((item, index) => (
          <>
            <Form.Item label={"维修项目"}>
              <Select
                value={item.ma_cate_id}
                options={maCateList}
                onChange={(e) => handleChangeMaCateId(e, item, index)}
                allowClear
                showSearch
                filterOption={(input, option) => (option?.label ?? '').includes(input)}
              />
            </Form.Item>

            <Form.Item label={"问题描述"}>
              <Input.TextArea value={item.prob_desc} onInput={(e) => handleInputProDesc(e, index)} />
            </Form.Item>

            <Form.Item label={"报修区域"}>
              <Input value={item.location}  onInput={(e) => handleInputLocation(e, index)} />
            </Form.Item>
          </>
        ))}

        <Form.Item>
          <Space style={{
            position: 'relative',
            left: 400,
            top: 20
          }}>
            <Button type='primary' htmlType='submit'>保存</Button>
            <Button onClick={closeOrderDetail}>取消</Button>
          </Space>
        </Form.Item>
      </Form>
    </>
  )
}

export default CreateOrder
