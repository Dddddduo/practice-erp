import React, { useEffect, useState, RefObject } from "react"
import { Typography, Form, Input, Select, Button, DatePicker, Card } from "antd"
import { PlusCircleTwoTone, DeleteTwoTone, SwapOutlined } from "@ant-design/icons";
import type { SelectProps } from 'antd';
import { getReportInfo, getOptions } from "@/services/ant-design-pro/orderList"
import { getTplList } from "@/services/ant-design-pro/report"
import { isUndefined } from "lodash"
import GkUpload from "@/components/UploadImage/GkUpload"
import dayjs from "dayjs"

const TPL_MAPPINGS = {
  1: {
    detailType: 'Before_After',
    desc: 'input'
  },
  2: {
    detailType: 'Before_After',
    desc: 'select'
  },
  3: {
    detailType: 'Before_After',
    desc: 'select'
  },
  4: {
    detailType: 'Before_After',
    desc: 'input'
  },
  5: {
    detailType: 'list',
    desc: 'input'
  },
  6: {
    detailType: 'once',
    desc: 'input'
  },
  7: {
    detailType: 'Before_After',
    desc: 'select'
  },
  8: {
    detailType: 'Before_After',
    desc: 'select'
  },
}

interface ItemListProps {
  currentReport: any
  closeReportDetail: () => void
}

const ReportDetail: React.FC<ItemListProps> = ({
  currentReport,
  closeReportDetail
}) => {
  const [form] = Form.useForm();
  const [reportDetail, setReportDetail]: any = useState()
  const [reportAtList, setReportAtList]: any = useState([{ date: '' }])
  const [tpList, setTpLsit]: any = useState([])
  const [tp, setTp] = useState()
  const [options, setOptions]: any = useState()
  const [detail, setDetail] = useState([])

  const handleFinish = (values) => {
    console.log(values);

  }

  const optionsTpList: SelectProps['options'] = tpList.map((item: any) => {
    return {
      value: item.id,
      label: item.title
    }
  })

  const optionsDescMap: SelectProps['options'] = options?.descMap[`temp${tp}`]?.map((item: any, index) => {
    return {
      value: index,
      label: item.cn
    }
  })

  const addReportAtList = () => {
    setReportAtList([...reportAtList, { date: '' }])
  }

  const delReportAtList = (index) => {
    const deleteData = [...reportAtList]
    deleteData.splice(index, 1)
    setReportAtList(deleteData)
  }


  useEffect(() => {
    console.log(currentReport);

    let params
    let signImages: any = []
    if (isUndefined(currentReport.report_id)) {
      params = {
        ma_item_id: currentReport.ma_item_id,
        appo_task_id: currentReport.appo_task_id,
        supplier_order_id: currentReport.order_supplier_id
      }
    } else {
      params = {
        report_id: currentReport.report_id,
        supplier_order_id: currentReport.order_supplier_id
      }
    }

    getOptions().then(res => {
      console.log(res.data);
      setOptions(res.data)
    })

    getReportInfo(params).then(res => {
      setReportDetail(res.data)
      setTp(res.data.report_tid)
      if (res.data.report_at_list.length > 0) {
        setReportAtList(res.data.report_at_list)
      }
      setDetail(res.data.detail)

      if (res.data && res.data?.sign_file_list && res.data?.sign_file_list.length > 0) {
        for (const item in res.data?.sign_file_list) {
          signImages.push(
            {
              id: res.data?.sign_file_list[item]?.id ?? '',
              uid: res.data?.sign_file_list[item]?.uid ?? '',
              file_id: res.data?.sign_file_list[item]?.file_id ?? '',
              name: res.data?.sign_file_list[item]?.name ?? '',
              url: res.data?.sign_file_list[item]?.file_url_thumb ?? '',
              original_file_name: res.data?.sign_file_list[item]?.file_url_enough ?? ''
            }
          )
        }
      }
      form.setFieldsValue({
        report_no: res.data.report_no ?? '',
        brand_en: res.data.brand_en ?? '',
        ma_type_cn: res.data.ma_type_cn ?? '',
        city_cn: res.data.city_cn ?? '',
        market_cn: res.data.market_cn ?? '',
        store_cn: res.data.store_cn ?? '',
        company_en: res.data.company_en ?? '',
        ma_cate_cn: res.data.ma_cate_cn ?? '',
        completed_at: dayjs(res.data.completed_at, 'YYYY-MM-DD') ?? '',
        report_title: res.data.report_title ?? '',
        sign_file_list: signImages ?? [],
        report_tid: res.data.report_tid ?? '',
        report_at_list: res.data.report_at_list ?? []
      })
    })

    getTplList().then(res => {
      setTpLsit(res.data)
    })
  }, [])
  return (
    <>
      <Form
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 18 }}
        style={{ maxWidth: 600 }}
        onFinish={handleFinish}
      >
        {
          currentReport.report_id &&
          <Form.Item label="编号" name="report_no" rules={[{ required: true }]}>
            <Input readOnly bordered={false}></Input>
          </Form.Item>
        }


        <Form.Item label="品牌" name="brand_en" rules={[{ required: true }]}>
          <Input readOnly bordered={false}></Input>
        </Form.Item>

        <Form.Item label="工作" name="ma_type_cn" rules={[{ required: true }]}>
          <Input readOnly bordered={false}></Input>
        </Form.Item>

        <Form.Item label="城市" name="city_cn" rules={[{ required: true }]}>
          <Input readOnly bordered={false}></Input>
        </Form.Item>

        <Form.Item label="商场" name="market_cn" rules={[{ required: true }]}>
          <Input readOnly bordered={false}></Input>
        </Form.Item>

        <Form.Item label="店铺" name="store_cn" rules={[{ required: true }]}>
          <Input readOnly bordered={false}></Input>
        </Form.Item>

        <Form.Item label="公司" name="company_en" rules={[{ required: true }]}>
          <Input readOnly bordered={false}></Input>
        </Form.Item>

        <Form.Item label="工作类型" name="ma_cate_cn" rules={[{ required: true }]}>
          <Input readOnly bordered={false}></Input>
        </Form.Item>

        <Form.Item label="完工日期" name="completed_at">
          <DatePicker></DatePicker>
        </Form.Item>

        <Form.Item label="标题" name="report_title">
          <Input.TextArea placeholder="0~100个字符"></Input.TextArea>
        </Form.Item>

        <Form.Item label="签收单" name="sign_file_list">
          <GkUpload />
        </Form.Item>

        <Form.Item label="签单同步" name="ma_cate_cn">
          <Button type="primary" ghost>签单同步</Button>
        </Form.Item>

        <Form.Item label="选择模板" name="report_tid">
          <Select options={optionsTpList} onChange={(e) => setTp(e)}></Select>
        </Form.Item>

        {
          reportDetail?.report_tid === 9 &&
          <Form.Item label="报告时间" name="report_at_list">
            {
              reportAtList.map((item, index) => {
                return (
                  <div key={index} style={{ marginBottom: 10 }}>
                    <DatePicker defaultValue={item.date}></DatePicker>
                    <PlusCircleTwoTone style={{ marginLeft: 10, cursor: 'pointer', fontSize: 20 }} onClick={addReportAtList} />
                    {
                      index > 0 &&
                      <DeleteTwoTone twoToneColor="#f00" style={{ marginLeft: 10, cursor: 'pointer', fontSize: 20 }} onClick={() => delReportAtList(index)} />
                    }
                  </div>
                )
              })
            }
          </Form.Item>
        }

        {
          reportDetail?.report_tid === 9 &&
          <Form.Item label="设备表">
            <GkUpload />
          </Form.Item>
        }

        {
          reportDetail?.report_tid === 9 &&
          <Form.Item label="布局图">
            <GkUpload />
          </Form.Item>
        }

        <Form.Item label="明细">
          <>
            {
              Object.entries(TPL_MAPPINGS).map(([key, value]) => (
                <div>
                  {
                    Number(tp) === Number(key) &&
                    value.detailType === 'Before_After' &&
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <GkUpload fileLength={1}/>
                      <SwapOutlined style={{ cursor: 'pointer', fontSize: 20 }} />
                      <GkUpload fileLength={1}/>
                    </div>
                  }
                  {
                    Number(tp) === Number(key) &&
                    value.detailType === 'list' &&
                    <>
                      <GkUpload />
                    </>
                  }
                  {
                    Number(tp) === Number(key) &&
                    value.detailType === 'once' &&
                    <>
                      <GkUpload fileLength={1} />
                    </>
                  }
                  {
                    Number(tp) === Number(key) &&
                    value.desc === 'input' &&
                    <>
                      <Input style={{ width: 300 }} />
                      <PlusCircleTwoTone twoToneColor="#0c0" style={{ marginLeft: 10, cursor: 'pointer', fontSize: 20 }}/>
                      <SwapOutlined style={{ marginLeft: 10, cursor: 'pointer', fontSize: 20 }} />
                      < DeleteTwoTone twoToneColor="#f00" style={{ marginLeft: 10, cursor: 'pointer', fontSize: 20 }} />
                    </>
                  }
                  {
                    Number(tp) === Number(key) &&
                    value.desc === 'select' &&
                    <>
                      <Select options={optionsDescMap} style={{ width: 300 }} />
                      <PlusCircleTwoTone twoToneColor="#0c0" style={{ marginLeft: 10, cursor: 'pointer', fontSize: 20 }}/>
                      <SwapOutlined style={{ marginLeft: 10, cursor: 'pointer', fontSize: 20 }} />
                      < DeleteTwoTone twoToneColor="#f00" style={{ marginLeft: 10, cursor: 'pointer', fontSize: 20 }} />
                    </>
                  }

                </div>
              ))
            }

          </>
        </Form.Item>

        <Form.Item>
          {
            reportDetail &&
            <>
              <Button type="primary" style={{ margin: 5 }} htmlType="submit">保存</Button>
              <Button type="primary" style={{ margin: 5 }}>预览</Button>
              {
                currentReport.report_id &&
                (reportDetail.status === 'worker_submit' || reportDetail.status === 'manager_reject') &&
                <Button type="primary" style={{ margin: 5 }}>通过</Button>
              }
              {
                currentReport.report_id &&
                (reportDetail.status === 'worker_submit' || reportDetail.status === 'manager_agree') &&
                <Button type="primary" danger style={{ margin: 5 }}>拒绝</Button>
              }
              <Button onClick={() => closeReportDetail} style={{ margin: 5 }}>返回</Button>
            </>
          }
        </Form.Item>
      </Form>
    </>
  )
}

export default ReportDetail