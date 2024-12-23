import { Form, Input, Select, Radio, Button, DatePicker, Upload, Space } from "antd"
import React, { useEffect, useState } from "react";
import type { RadioChangeEvent, SelectProps } from 'antd';
import { SearchType } from "..";
import { getMarketList, getShopList, getMaCateList } from "@/services/ant-design-pro/report";
import { getCompanyList, getClassTypeListOutSide, uploadQuo, getBrandContactsList } from "@/services/ant-design-pro/quotation";
import dayjs from "dayjs";

interface ItemListProps {
  brandList: any
  searchData: {
    markets: any
    cities: any
    shops: any
    maType: any
    secondQuotationType: any
    maCates: any
  }
  onSearchSelectedChild: (type: string, field: string, data: []) => void;
  success: (text: any) => void
  error: (text: any) => void
  onCloseCreateSpecialOffers: () => void
  actionRef: any
  currentItem
}

const CreateSpecialOffers: React.FC<ItemListProps> = ({
  brandList,
  searchData,
  onSearchSelectedChild,
  success,
  error,
  onCloseCreateSpecialOffers,
  actionRef,
  currentItem
}) => {

  const [form] = Form.useForm()
  const [brandId, setBrandId] = useState(0)
  const [cityId, setCityId] = useState(0)
  const [marketId, setMarketId] = useState(0)
  const [companyList, setCompanyList] = useState([])
  const [classType, setClassType] = useState()
  const [subTotal, setSubTotal] = useState()
  const [rate, setRate]: any = useState()
  const [tax, setTax]: any = useState()
  const [totalAmount, setTotalAmount]: any = useState()
  let shopData: [] = []

  const handleFinish = (values) => {
    let class_type_plus
    if (values.completion_at) {
      values.completion_at = dayjs(values.completion_at).format('YYYY-MM')
    }
    if (values.secondClassType) {
      class_type_plus = optionsClassType?.find(item => item.value === values.secondClassType)
    }
    let vat_type
    if (values.rate && values.rate === 9) {
      vat_type = 2
    } else if (values.rate && values.rate === 6) {
      vat_type = 1
    } else if (values.rate && values.rate === 0) {
      vat_type = 0
    }
    let ma_item_list: any = [{ location: "" }]
    if (values.desc) {
      ma_item_list[0].prob_desc = values.desc
      ma_item_list[0].ma_cate_id = values['maType']
    }
    ma_item_list.push()
    const params = {
      appo_at: "",
      brand_id: values['brand'] ?? '',
      city_id: values['city'] ?? '',
      market_id: values['market'] ?? '',
      store_id: values['store'] ?? '',
      shop_contact_id: values['contact'] ?? '',
      class_type: values['classType'] ?? '',
      class_type_plus: class_type_plus ? class_type_plus.label : '',
      company_id: values['company'] ?? '',
      completion_at: values['completion_at'] ?? '',
      cost_type: 0,
      ma_item_list: ma_item_list,
      ma_type: values['maCates'] ?? '',
      ma_cate_id: values['maType'] ?? '',
      job_content: '',
      receipts: values['annex'] ?? [],
      prob_desc: values['desc'] ?? '',
      remark: values['remark'] ?? '',
      pre_total_price: values['subTotal'] ?? '',
      profit: values['profit_price'] ?? '',
      profit_price: values['profit_price'] ?? '',
      profit_rate: rate ? rate.toString() : '',
      service_rate: 0,
      tax_rate: values['rate'] ?? '',
      vat: values['tax'] ?? '',
      profit_rate_value: Number(values['profit_price']) ?? '',
      sub_total: values['subTotal'] ?? '',
      total_price: values['total_amount'] ?? '',
      total_amount: values['total_amount'] ?? '',
      vat_type: vat_type ?? '',
      status: 2,
      shop_id: ''
    }
    uploadQuo(params).then(res => {
      console.log(res);
      if (!res.success) {
        error(res.message)
        return
      }
      onCloseCreateSpecialOffers()
      actionRef.current.reload()
      success('保存成功')
    })
  }

  const optionsCity: SelectProps['options'] = searchData.cities.map((item: any) => {
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

  const optionsStore: SelectProps['options'] = searchData.shops.map((item: any) => {
    return {
      value: item.id,
      label: item.name_cn,
    };
  });

  const optionsCompany: SelectProps['options'] = companyList.map((item: any) => {
    return {
      value: item.id,
      label: item.company_en === '' ? item.company_cn : item.company_en,
    };
  });

  const optionsMaType: SelectProps['options'] = searchData.maType.map((item: any) => {
    return {
      value: item.id,
      label: item.cn_name === '' ? item.en_name : item.cn_name,
    };
  });

  const optionsClassType: SelectProps['options'] = searchData.secondQuotationType.map((item: any) => {
    return {
      value: item.id,
      label: item.class_type_plus !== '' ? item.class_type_plus : item.id,
    };
  });

  const optionsContacts: SelectProps['options'] = searchData.contactsList.map((item: any) => {
    return {
      value: item.id,
      label: item.contact_user,
    };
  });

  const handleChangeBrands = async (e) => {
    setBrandId(e)
    const shopParams = {
      brand_id: e,
      city_id: cityId,
      market_id: marketId
    }
    form.setFieldsValue({ store: undefined, contact: undefined })
    const shopResponse = await getShopList(shopParams);
    shopData = shopResponse.data;
    onSearchSelectedChild(SearchType.LoadData, 'shops', shopData);

    const contactsListResponse = await getBrandContactsList({ brand_id: e })
    onSearchSelectedChild(SearchType.LoadData, 'contactsList', contactsListResponse.data);
  }

  const handleChangeCity = async (e) => {
    setCityId(e)
    form.setFieldsValue({ market: undefined, store: undefined })
    const marketResponse = await getMarketList({ city_id: e });
    onSearchSelectedChild(SearchType.LoadData, 'markets', marketResponse.data);

  }
  const handleChangeMarket = async (e) => {
    setMarketId(e)
    const shopParams = {
      brand_id: brandId,
      city_id: cityId,
      market_id: e
    }
    form.setFieldsValue({ store: undefined })
    const shopResponse = await getShopList(shopParams);
    shopData = shopResponse.data;
    onSearchSelectedChild(SearchType.LoadData, 'shops', shopData);
  }

  const handleChangeMaCate = async (e) => {
    console.log(e);
    const maTypeReponse = await getMaCateList({ p_type: e })
    form.setFieldsValue({ maType: undefined })
    onSearchSelectedChild(SearchType.LoadData, 'maType', maTypeReponse.data);
  }

  const handleChangeRadio = async (e) => {
    setClassType(e.target.value)
    const classType = await getClassTypeListOutSide({ class_type: e.target.value })
    onSearchSelectedChild(SearchType.LoadData, 'secondQuotationType', classType.data);
  }

  const handleChangeRate = (e) => {
    setRate((e.target.value / 100))
    if (subTotal) {
      const total = Number(subTotal) * Number(e.target.value / 100)
      setTax(total)
      setTotalAmount(Number(total) + Number(subTotal))
    }
  }

  const handleInputSubTotal = (e) => {
    setSubTotal(e.target.value)
    if (rate) {
      const total = Number(e.target.value) * Number(rate)
      setTax(total)
      setTotalAmount(Number(e.target.value) + Number(total))
    }
  }

  useEffect(() => {
    getCompanyList().then(res => {
      setCompanyList(res.data)
    })
    form.setFieldsValue({
      tax: tax ?? '',
      total_amount: totalAmount ?? ''
    })
    console.log(currentItem);

    if (currentItem) {
      setClassType(currentItem.class_type)
      getClassTypeListOutSide({ class_type: currentItem.class_type }).then(res => {
        if (res.success) {
          onSearchSelectedChild(SearchType.LoadData, 'secondQuotationType', res.data);
        }
      })
      form.setFieldsValue({
        brand: currentItem.brand_id ?? '',
        city: currentItem.city_id ?? '',
        market: currentItem.market_id ?? '',
        store: currentItem.store_id ?? '',
        contact: currentItem.contact_user ?? '',
        company: currentItem.company_id ?? '',
        subTotal: currentItem.total_price_excl_tax ?? '',
        tax: currentItem.tax_rate ?? '',
        total_amount: currentItem.total_price ?? '',
        profit_price: currentItem.profit_price ?? '',
        remark: currentItem.remark ?? '',
        classType: currentItem.class_type ?? '',
        secondClassType: currentItem.class_type_id ?? '',
        completion_at: dayjs(currentItem.completion_at, 'YYYY-MM') ?? ''
      })
    }
  }, [subTotal, rate])

  return (
    <>
      <Form
        form={form}
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 800 }}
        onFinish={handleFinish}
      >
        <Form.Item label="品牌" name="brand">
          {
            currentItem ?
              <Select disabled placeholder="请选择品牌" allowClear options={brandList} onChange={handleChangeBrands} /> :
              <Select placeholder="请选择品牌" allowClear options={brandList} onChange={handleChangeBrands} />
          }
        </Form.Item>

        <Form.Item label="城市" name="city">
          {
            currentItem ?
              <Select disabled placeholder="请选择城市" allowClear options={optionsCity} onChange={handleChangeCity} /> :
              <Select placeholder="请选择城市" allowClear options={optionsCity} onChange={handleChangeCity} />
          }
        </Form.Item>

        <Form.Item label="商场" name="market">
          {
            currentItem ?
              <Select disabled placeholder="请选择商场" allowClear options={optionsMarket} onChange={handleChangeMarket} /> :
              <Select placeholder="请选择商场" allowClear options={optionsMarket} onChange={handleChangeMarket} />
          }
        </Form.Item>

        <Form.Item label="店铺" name="store">
          {
            currentItem ?
              <Select disabled placeholder="请选择店铺" allowClear options={optionsStore} /> :
              <Select placeholder="请选择店铺" allowClear options={optionsStore} />
          }
        </Form.Item>

        <Form.Item label="客户联系人" name="contact">
          {
            currentItem ?
              <Select disabled placeholder="请选择客户联系人" allowClear options={optionsContacts} /> :
              <Select placeholder="请选择客户联系人" allowClear options={optionsContacts} />
          }
        </Form.Item>

        <Form.Item label="公司" name="company">
          {
            currentItem ?
              <Select disabled placeholder="请选择公司" allowClear options={optionsCompany} /> :
              <Select placeholder="请选择公司" allowClear options={optionsCompany} />
          }
        </Form.Item>

        {
          !currentItem &&
          <>
            <Form.Item label="维修类型" name="maCates">
              <Select placeholder="请选择维修类型" allowClear options={searchData.maCates} onChange={handleChangeMaCate} />
            </Form.Item>

            <Form.Item label="维修项目" name="maType">
              <Select placeholder="请选择维修项目" allowClear options={optionsMaType} />
            </Form.Item>

            <Form.Item label="问题描述" name="desc">
              <Input.TextArea placeholder="请输入问题描述" />
            </Form.Item>
          </>
        }

        <Form.Item label="Sub-Total" name="subTotal">
          <Input onInput={handleInputSubTotal} />
        </Form.Item>

        <Form.Item label="税率" name="rate">
          <Radio.Group onChange={handleChangeRate}>
            <Radio value={9}>9% VAT</Radio>
            <Radio value={6}>6% VAT</Radio>
            <Radio value={0}>无</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label=" " name="tax">
          <Input value={setTax} disabled />
        </Form.Item>

        <Form.Item label="TOTAL AMOUNT" name="total_amount">
          <Input disabled />
        </Form.Item>

        <Form.Item label="利润" name="profit_price">
          <Input />
        </Form.Item>

        <Form.Item label="附件" name="annex">
          <Upload>
            <Button type="primary">点击上传</Button>
          </Upload>
        </Form.Item>

        <Form.Item label="备注" name="remark">
          <Input.TextArea />
        </Form.Item>

        <Form.Item label="是否月结" name="classType">
          <Radio.Group buttonStyle="solid" onChange={handleChangeRadio}>
            <Radio.Button value='monthly'>月结</Radio.Button>
            <Radio.Button value='not_monthly'>单结</Radio.Button>
            <Radio.Button value='fix'>固定</Radio.Button>
            <Radio.Button value='other'>other</Radio.Button>
          </Radio.Group>
        </Form.Item>

        {
          (classType === 'monthly' || classType === 'fix') &&
          <Form.Item label="分类" name="secondClassType">
            <Select placeholder="请选择分类" allowClear options={optionsClassType} />
          </Form.Item>
        }

        <Form.Item label="申报日期" name="completion_at">
          <DatePicker picker="month" />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">保存</Button>
            <Button onClick={() => onCloseCreateSpecialOffers()}>返回</Button>
          </Space>
        </Form.Item>
      </Form>
    </>
  )
}

export default CreateSpecialOffers
