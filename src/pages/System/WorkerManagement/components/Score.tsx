import { Button, DatePicker, Form, Input, Select, Space } from "antd"
import React, { useEffect, useRef, useState } from "react"
import * as echarts from 'echarts';
import { getWorkerScoreInfo } from "@/services/ant-design-pro/system";
import { getBrandList, getShopList } from "@/services/ant-design-pro/report";
import dayjs from "dayjs";

interface Props {
  currentItem: any
}

interface Select {
  value: number;
  label: string;
}

const Score: React.FC<Props> = ({
  currentItem,
}) => {
  const [form] = Form.useForm()
  const chartRef: any = useRef(null)
  const [score, setScore] = useState([0, 0, 0, 0, 0])
  const [brandList, setBrandList] = useState<Select[]>([])
  const [storeList, setStoreList] = useState<Select[]>([])

  const handleFinish = (values) => {
    let start = '', end = ''
    if (values.time) {
      start = dayjs(values.time[0]).format('YYYY-MM-DD')
      end = dayjs(values.time[1]).format('YYYY-MM-DD')
    }
    const params = {
      worker_id: currentItem.worker_id,
      brand_id: values.brand ?? '',
      store_id: values.store ?? '',
      select_date: (start && start) ? [start, end] : [],
      start_at: start,
      end_at: end,
    }
    getWorkerScoreInfo(params).then(res => {
      if (res.success) {
        form.setFieldsValue({ num: res.data.count })
        setScore([
          res.data.wxzl,
          res.data.wxsd,
          res.data.fwtd,
          res.data.smzsd,
          res.data.yryb,
        ])
      }
    })
  }

  const handleChangeBrand = (brand_id) => {
    form.setFieldsValue({ store: undefined })
    getShopList({ brand_id }).then(res => {
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

  useEffect(() => {
    console.log(currentItem);

    form.setFieldsValue({
      name: currentItem.worker_name ?? '',
      num: 0
    })
    getBrandList().then(res => {
      if (res.success) {
        setBrandList(res.data.map(item => {
          return {
            value: item.id,
            label: item.brand_en
          }
        }))
      }
    })
  }, [])

  useEffect(() => {
    const chart = echarts.getInstanceByDom(chartRef.current);
    if (chart) {
      // 销毁现有实例
      chart.dispose();
    }
    const Chart = echarts.init(chartRef.current);
    const option = {
      // title: {
      //   text: 'Maintenance Rating',
      //   left: 'center'
      // },
      // legend: {
      //   data: ['Allocated Budget', 'Actual Spending']
      // },
      radar: {
        // shape: 'circle',
        indicator: [
          { name: '维修质量', max: 5 },
          { name: '维修速度', max: 5 },
          { name: '服务态度', max: 5 },
          { name: '准时上门', max: 5 },
          { name: '仪容仪表', max: 5 },
        ]
      },
      series: [
        {
          name: 'Budget vs spending',
          type: 'radar',
          data: [
            {
              value: score,
              name: 'Allocated Budget'
            },
            // {
            //   value: [5000, 14000, 28000, 26000, 42000],
            //   name: 'Actual Spending'
            // }
          ]
        }
      ]
    };
    Chart.setOption(option)
  }, [score])

  return (
    <Form
      form={form}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 17 }}
      style={{ maxWidth: 800 }}
      onFinish={handleFinish}
    >
      <Form.Item name="brand" label="品牌">
        <Select options={brandList} allowClear placeholder="请选择品牌" onChange={handleChangeBrand} />
      </Form.Item>

      <Form.Item name="store" label="店铺">
        <Select options={storeList} allowClear placeholder="请选择店铺" />
      </Form.Item>

      <Form.Item name="time" label="时间">
        <DatePicker.RangePicker />
      </Form.Item>

      <Form.Item label=" " colon={false}>
        <Button type="primary" htmlType="submit">查询</Button>
      </Form.Item>

      <Form.Item name="name" label="姓名">
        <Input readOnly bordered={false} />
      </Form.Item>

      <Form.Item name="num" label="维修订单数">
        <Input readOnly bordered={false} />
      </Form.Item>

      <Form.Item name="score" label="工人评分">
        <div ref={chartRef} style={{ width: 500, height: 400 }}></div>
      </Form.Item>
    </Form>
  )
}

export default Score