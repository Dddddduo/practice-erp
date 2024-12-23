import { Button, DatePicker, Form, Input, Radio, Select, Space, Switch } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { SearchType } from "..";
import { getShopList } from "@/services/ant-design-pro/report";
import dayjs from "dayjs";
import { leakageReportStoreUpdate } from "@/services/ant-design-pro/project";
import { isEmpty } from "lodash";
import { getWaterLeakageRecordByQuoId } from "@/services/ant-design-pro/quotation";
import {StringDatePicker} from "@/components/StringDatePickers";
import SubmitButton from "@/components/Buttons/SubmitButton";

interface Props {
  actionRef,
  success: (text: string) => void,
  error: (text: string) => void
  handleCloseCreateOrUpdate: () => void
  searchDataState: any
  handleSearchSelectedChild: (type: string, field: string, data: []) => void;
  currentItem: any
}

const ResponsibleList = [
  {
    value: '商场',
    label: '商场',
  },
  {
    value: '第三方店铺',
    label: '第三方店铺',
  },
  {
    value: '品牌方',
    label: '品牌方',
  },
  {
    value: '置安',
    label: '置安',
  },
  {
    value: '其它',
    label: '其它',
  },
]

const Area = [
  {
    value: '卖场',
    label: '卖场',
  },
  {
    value: '后仓',
    label: '后仓',
  },
  {
    value: '外仓',
    label: '外仓',
  },
  {
    value: '办公室',
    label: '办公室',
  },
  {
    value: '其它',
    label: '其它',
  },
]

const LeakList = [
  {
    value: '内装漏水',
    label: '内装漏水',
  },
  {
    value: '空调漏水',
    label: '空调漏水',
  },
  {
    value: '消防漏水',
    label: '消防漏水',
  },
  {
    value: '防水漏水',
    label: '防水漏水',
  },
  {
    value: '其他原因',
    label: '其他原因',
  },
]

const Cause = {
  '内装漏水': [
    {
      value: '墙壁裂缝',
      label: '墙壁裂缝',
    },
    {
      value: '地面下沉或变形',
      label: '地面下沉或变形',
    },
    {
      value: '管道堵塞',
      label: '管道堵塞',
    },
    {
      value: '水龙头损坏',
      label: '水龙头损坏',
    },
    {
      value: '水槽堵塞',
      label: '水槽堵塞',
    },
    {
      value: '排水管堵塞',
      label: '排水管堵塞',
    },
    {
      value: '地漏堵塞',
      label: '地漏堵塞',
    },
    {
      value: '排水坡度不足',
      label: '排水坡度不足',
    },
    {
      value: '窗户密封不严',
      label: '窗户密封不严',
    },
    {
      value: '水管接头松动',
      label: '水管接头松动',
    },
    {
      value: '其他原因',
      label: '其他原因',
    },
  ],
  '空调漏水': [
    {
      value: '排水泵损坏',
      label: '排水泵损坏',
    },
    {
      value: '水箱漏水',
      label: '水箱漏水',
    },
    {
      value: '接水盘堵塞',
      label: '接水盘堵塞',
    },
    {
      value: '接水盘生锈',
      label: '接水盘生锈',
    },
    {
      value: '排水管堵塞',
      label: '排水管堵塞',
    },
    {
      value: '排水管老化',
      label: '排水管老化',
    },
    {
      value: '排水坡度不足',
      label: '排水坡度不足',
    },
    {
      value: '管道连接件老化&损坏',
      label: '管道连接件老化&损坏',
    },
    {
      value: '阀门故障',
      label: '阀门故障',
    },
    {
      value: '其他原因',
      label: '其他原因',
    },
  ],
  '消防漏水': [
    {
      value: '管道老化',
      label: '管道老化',
    },
    {
      value: '管道破裂',
      label: '管道破裂',
    },
    {
      value: '管道接头松动',
      label: '管道接头松动',
    },
    {
      value: '管道变形',
      label: '管道变形',
    },
    {
      value: '阀门故障',
      label: '阀门故障',
    },
    {
      value: '管道腐蚀',
      label: '管道腐蚀',
    },
    {
      value: '其他原因',
      label: '其他原因',
    },
  ],
  '防水漏水': [
    {
      value: '屋顶',
      label: '屋顶',
    },
    {
      value: '橱窗',
      label: '橱窗',
    },
    {
      value: '外墙',
      label: '外墙',
    },
    {
      value: '其他原因',
      label: '其他原因',
    },
  ],
}

const CreateOrUpdate: React.FC<Props> = ({
  actionRef,
  success,
  error,
  handleCloseCreateOrUpdate,
  searchDataState,
  handleSearchSelectedChild,
  currentItem,
}) => {
  const [form] = Form.useForm()
  const [responsible, setResponsible] = useState('')
  const [area, setArea] = useState('')
  const [leak, setLeak] = useState('')
  const [cause, setCause] = useState('')
  const [product, setProduct] = useState(0)
  const [decor, setDecor] = useState(0)
  const [workerId, setWorkerId] = useState(undefined)

  const handleFinish = (values: any) => {
    let params = {
      brand_id: values.brand ?? '',
      city_id: values.city ?? '',
      worker_uid: values.worker ?? '',
      store_id: values.shop ?? '',
      quo_id: currentItem.quo_id ?? 0,
      report_at: values.report_at ? dayjs(values.report_at).format('YYYY-MM-DD') : '',
      report_content: values.report_content ?? '',
      area: values.area ?? '',
      area_other: values.area_other ?? '',
      cause: cause !== '其他原因' ? values?.cause : values?.other_cause,
      solution: values.solution ?? '',
      analysis: values.analysis ?? '',
      statue: values.statue ?? '',
      estimated_repair_time: values.estimated_repair_time ?? '',
      responsible_party: values.responsible_party ?? '',
      responsible_party_other: values.responsible_party_other ?? '',
      leak_type: values.leak_type ?? '',
      leak_type_other: values.leak_type_other ?? '',
      is_product_damage: values.is_product_damage ?? '',
      is_decor_damage: values.is_decor_damage ?? '',
      remark: values.remark ?? ''
    }
    if (!isEmpty(currentItem)) {
      params = {
        id: currentItem.id,
        ...params
      }
    }
    leakageReportStoreUpdate(params).then(res => {
      if (res.success) {
        handleCloseCreateOrUpdate()
        actionRef.current.reload()
        success('操作成功')
        return
      }
      error(res.message)
    })
  }

  const handleValuesChange = async (value, allValues) => {

    console.log(value, allValues)


    let shopData: [] = [];
    const shopParams: { city_id: string | number, brand_id: string | number } = {
      city_id: allValues['city'] ?? '',
      brand_id: allValues['brand'] ?? '',
    };
    // 品牌、城市、商场切换
    if ('brand' in value || 'city' in value) {
      form.setFieldsValue({ shop: undefined })
      const shopResponse = await getShopList(shopParams);
      shopData = shopResponse.data.map(item => {
        return {
          value: item.id,
          label: item.name_cn
        }
      })
      handleSearchSelectedChild(SearchType.LoadData, 'shops', shopData);
    }
  }

  const handleChangeProductDamage = (value) => {
    setProduct(value.target.value)
  }
  const handleDecorDamage = (value) => {
    setDecor(value.target.value)
  }

  const handleToWorkerManagement = () => {
    window.open('/system/workerManagement', '_blank')
  }

  // @ts-ignore
  useEffect(() => {
    form.setFieldsValue({
      is_product_damage: 0,
      is_decor_damage: 0
    })
    if (isEmpty(currentItem)) {
      return
    }

    getShopList({ city_id: currentItem.city_id, brand_id: currentItem.brand_id }).then(res => {
      if (res.success) {
        const shopData = res.data.map(item => {
          return {
            value: item.id,
            label: item.name_cn
          }
        })
        handleSearchSelectedChild(SearchType.LoadData, 'shops', shopData);
      }
    })
    setResponsible(currentItem.responsible_party)
    setArea(currentItem.area)
    setLeak(currentItem.leak_type)
    form.setFieldsValue({
      quo: currentItem.quo_id ?? '',
      quo_no: currentItem.quo_no ?? '',
      brand: currentItem.brand_id ?? '',
      city: currentItem.city_id ?? '',
      shop: currentItem.store_id ?? '',
      worker: currentItem.worker_uid ?? '',
      report_content: currentItem.report_content ?? '',
      report_at: currentItem.report_at ? dayjs(currentItem.report_at, 'YYYY-MM-DD') : '',
      area: currentItem.area ?? '',
      area_other: currentItem.area_other ?? '',
      cause: currentItem.cause ?? '',
      solution: currentItem.solution ?? '',
      analysis: currentItem.analysis ?? '',
      statue: currentItem.statue ?? '',
      estimated_repair_time: currentItem.estimated_repair_time ?? '',
      responsible_party_other: currentItem.responsible_party_other ?? '',
      responsible_party: currentItem.responsible_party ?? '',
      leak_type_other: currentItem.leak_type_other ?? '',
      leak_type: currentItem.leak_type ?? '',
      is_product_damage: currentItem.is_product_damage ?? 0,
      is_decor_damage: currentItem.is_decor_damage ?? 0,
      remark: currentItem.remark ?? '',
    })
    setWorkerId(currentItem.worker_uid ?? undefined)
  }, [])

  return (
    <Form
      form={form}
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 800 }}
      onFinish={handleFinish}
      onValuesChange={handleValuesChange}
    >
      {
        currentItem.quo_no &&
        <Form.Item name="quo_no" label="报价单">
          <Input disabled />
        </Form.Item>
      }

      <Form.Item name="brand" label="品牌" rules={[{ required: true }]}>
        <Select
          options={searchDataState.brands}
          allowClear
          showSearch
          filterOption={(input, option) => (option?.label ?? '').includes(input)}
        />
      </Form.Item>

      <Form.Item name="city" label="城市" rules={[{ required: true }]}>
        <Select
          options={searchDataState.cities}
          allowClear
          showSearch
          filterOption={(input, option) => (option?.label ?? '').includes(input)}
        />
      </Form.Item>

      <Form.Item name="shop" label="店铺" rules={[{ required: true }]}>
        <Select
          options={searchDataState.shops}
          allowClear
          showSearch
          filterOption={(input, option) => (option?.label ?? '').includes(input)}
        />
      </Form.Item>

      <Form.Item name="worker" label="工人" rules={[{ required: true }]}>
        <Select
          options={searchDataState.workers}
          value={workerId}
          allowClear
          showSearch
          filterOption={(input, option) => (option?.label ?? '').includes(input)}
        />
      </Form.Item>

      <Form.Item label=" " colon={false}>
        <Button type="primary" onClick={handleToWorkerManagement}>添加工人</Button>
      </Form.Item>

      <Form.Item name="responsible_party" label="责任方" rules={[{ required: true }]}>
        <Select
          options={ResponsibleList}
          allowClear
          showSearch
          filterOption={(input, option) => (option?.label ?? '').includes(input)}
          onChange={(value) => setResponsible(value)}
        />
      </Form.Item>

      {
        responsible === '其它' &&
        <Form.Item name="responsible_party_other" label="责任方（其它）" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      }

      <Form.Item name="report_content" label="报修内容" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item name="report_at" label="报修时间" rules={[{ required: true }]}>
        <DatePicker style={{ width: 200 }} />
      </Form.Item>

      <Form.Item name="area" label="区域" rules={[{ required: true }]}>
        <Select
          options={Area}
          allowClear
          showSearch
          filterOption={(input, option) => (option?.label ?? '').includes(input)}
          onChange={(value) => setArea(value)}
        />
      </Form.Item>

      {
        area === '其它' &&
        <Form.Item name="area_other" label="区域（其它）" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      }

      <Form.Item name="leak_type" label="漏水类型" rules={[{ required: true }]}>
        <Select
          options={LeakList}
          allowClear
          showSearch
          filterOption={(input, option) => (option?.label ?? '').includes(input)}
          onChange={(value) => {
            setLeak(value)
            form.setFieldsValue({cause: undefined})
          }}
        />
      </Form.Item>

      {
        leak === '其它' &&
        <Form.Item name="leak_type_other" label="漏水类型（其它）" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      }

      <Form.Item name="is_product_damage" label="是否有商品损失">
        <Radio.Group value={product} onChange={handleChangeProductDamage}>
          <Radio value={0}>否</Radio>
          <Radio value={1}>是</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item name="is_decor_damage" label="是否有装修损失">
        <Radio.Group value={decor} onChange={handleDecorDamage}>
          <Radio value={0}>否</Radio>
          <Radio value={1}>是</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item name="cause" label="问题" rules={[{ required: true }]}>
        {
          leak === '其他原因' ?
            <Input /> :
            <Select
              options={Cause[leak]}
              allowClear
              showSearch
              filterOption={(input, option) => (option?.label ?? '').includes(input)}
              onChange={(value) => setCause(value)}
            />
        }
      </Form.Item>

      {
        (leak !== '其他原因' && cause === '其他原因') &&
        <Form.Item name="other_cause" label="其他问题" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      }

      <Form.Item name="solution" label="解决方案" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item name="analysis" label="分析" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item name="statue" label="状态" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item name="estimated_repair_time" label="完工时间">
        <StringDatePicker />
      </Form.Item>

      <Form.Item name="remark" label="备注">
        <Input.TextArea />
      </Form.Item>

      <Form.Item label=" " colon={false}>
        <Space>
          <SubmitButton type="primary" form={form}>提交</SubmitButton>
          <Button danger onClick={handleCloseCreateOrUpdate}>取消</Button>
        </Space>
      </Form.Item>
    </Form >
  )
}

export default CreateOrUpdate
