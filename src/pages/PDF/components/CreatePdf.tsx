import { getCompanyList, getMaCateLv0List, getMaCateLv1List } from "@/services/ant-design-pro/orderList"
import { reuseConstructionInfo } from "@/services/ant-design-pro/pdf"
import { getBrandList, getCityList, getMarketList, getShopList } from "@/services/ant-design-pro/report"
import { Button, Form, Input, Select, Space } from "antd"
import React, { useEffect, useState } from "react"

interface Select {
  value: any,
  label: string
}

interface Props {
  appoTaskId: string
  success: (text: string) => void
  error: (text: string) => void
  handleCloseCreatePdf: () => void
}

const CreatePdf: React.FC<Props> = ({
  appoTaskId,
  handleCloseCreatePdf,
  success,
  error,
}) => {
  const [form] = Form.useForm()
  const [brandId, setBrandId] = useState<number>(0)
  const [cityId, setCityId] = useState<number>(0)
  const [marketId, setMarketId] = useState<number>(0)
  const [brandList, setBrandList] = useState<Select[]>([])
  const [cityList, setCityList] = useState<Select[]>([])
  const [marketList, setMarketList] = useState<Select[]>([])
  const [storeList, setStoreList] = useState<Select[]>([])
  const [companyList, setCompanyList] = useState<Select[]>([])
  const [typeList, setTypeList] = useState<Select[]>([])
  const [projectList, setProjectList] = useState<Select[]>([])

  const handleFinish = (values: any) => {
    const params = {
      from_appo_task_id: parseInt(appoTaskId),
      store_id: values.store ?? '',
      ma_type: values.type ?? '',
      company_id: values.company ?? '',
      appo_at: '',
      ma_item_list: [
        {
          ma_cate_id: values.project ?? '',
          location: '',
          prob_desc: values.description ?? '',
          file_ids: "",
          appo_task_list: [
            {
              ma_start_at: '',
              ma_end_at: '',
              worker_ids: '',
              submit_remark: "",
            }
          ]
        }
      ]
    }
    reuseConstructionInfo(params).then(res => {
      if (res.success) {
        handleCloseCreatePdf()
        success('操作成功')
        return
      }
      error(res.message)
    })
  }

  const handleChangeBrand = (brand_id) => {
    setBrandId(brand_id)
    form.setFieldsValue({ store: undefined })
    getShopList({ brand_id, city_id: cityId, market_id: marketId }).then(res => {
      if (res.success) {
        setStoreList(res.data.map(item => {
          return {
            value: item.id,
            label: item.name_cn
          }
        }))
      }
    })
  }

  const handleChangeCity = (city_id) => {
    setCityId(city_id)
    form.setFieldsValue({
      market: undefined,
      store: undefined
    })
    getMarketList({ city_id }).then(res => {
      if (res.success) {
        setMarketList(res.data.map(item => {
          return {
            value: item.id,
            label: item.market_cn
          }
        }))
      }
    })
    getShopList({ brand_id: brandId, city_id, market_id: marketId }).then(res => {
      if (res.success) {
        setStoreList(res.data.map(item => {
          return {
            value: item.id,
            label: item.name_cn
          }
        }))
      }
    })
  }

  const handleChangeMarket = (market_id) => {
    setMarketId(market_id)
    form.setFieldsValue({ store: undefined })
    getShopList({ brand_id: brandId, city_id: cityId, market_id }).then(res => {
      if (res.success) {
        setStoreList(res.data.map(item => {
          return {
            value: item.id,
            label: item.name_cn
          }
        }))
      }
    })
  }

  const handleChangeType = (type) => {
    form.setFieldsValue({ project: undefined })
    getMaCateLv1List({ p_type: type }).then(res => {
      if (res.success) {
        setProjectList(res.data.map(item => {
          return {
            value: item.id,
            label: item.cn_name,
          }
        }))
      }
    })
  }

  useEffect(() => {
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
            label: item.city_cn
          }
        }))
      }
    })
    getCompanyList().then(res => {
      if (res.success) {
        setCompanyList(res.data.map(item => {
          return {
            value: item.id,
            label: item.company_en ? item.company_en : item.company_cn
          }
        }))
      }
    })
    getMaCateLv0List().then(res => {
      if (res.success) {
        setTypeList(Object.keys(res.data).map(key => {
          return {
            value: key,
            label: res.data[key]
          }
        }))
      }
    })
  }, [])

  return (
    <Form
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 800, marginTop: 30 }}
      form={form}
      onFinish={handleFinish}
    >
      <Form.Item name="brand" label="品牌">
        <Select
          allowClear
          placeholder="请选择"
          options={brandList}
          onChange={handleChangeBrand}
          showSearch
          filterOption={(input, option) => (option?.label ?? '').includes(input)}
        />
      </Form.Item>

      <Form.Item name="city" label="城市">
        <Select
          allowClear
          placeholder="请选择"
          options={cityList}
          onChange={handleChangeCity}
          showSearch
          filterOption={(input, option) => (option?.label ?? '').includes(input)}
        />
      </Form.Item>

      <Form.Item name="market" label="商场">
        <Select
          allowClear
          placeholder="请选择"
          options={marketList}
          onChange={handleChangeMarket}
          showSearch
          filterOption={(input, option) => (option?.label ?? '').includes(input)}
        />
      </Form.Item>

      <Form.Item name="store" label="店铺" rules={[{ required: true }]}>
        <Select
          allowClear
          placeholder="请选择"
          options={storeList}
          showSearch
          filterOption={(input, option) => (option?.label ?? '').includes(input)}
        />
      </Form.Item>

      <Form.Item name="company" label="公司">
        <Select
          allowClear
          placeholder="请选择"
          options={companyList}
          showSearch
          filterOption={(input, option) => (option?.label ?? '').includes(input)}
        />
      </Form.Item>

      <Form.Item name="type" label="维修类型">
        <Select
          allowClear
          placeholder="请选择"
          options={typeList}
          onChange={handleChangeType}
          showSearch
          filterOption={(input, option) => (option?.label ?? '').includes(input)}
        />
      </Form.Item>

      <Form.Item name="project" label="维修项目">
        <Select
          allowClear
          placeholder="请选择"
          options={projectList}
          showSearch
          filterOption={(input, option) => (option?.label ?? '').includes(input)}
        />
      </Form.Item>

      <Form.Item name="description" label="问题描述">
        <Input />
      </Form.Item>

      <Form.Item label=" " colon={false}>
        <Space>
          <Button type="primary" htmlType="submit">提交</Button>
          <Button danger>取消</Button>
        </Space>
      </Form.Item>
    </Form>
  )
}

export default CreatePdf