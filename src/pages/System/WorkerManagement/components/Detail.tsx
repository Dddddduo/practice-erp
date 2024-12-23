import { Form, Image, Input, Space } from "antd";
import React, { useState, useEffect, useRef } from "react";
import { getWorkerInfo } from "@/services/ant-design-pro/system";
import { isEmpty, isObject } from "lodash";
import { IdcardOutlined } from "@ant-design/icons";
import * as echarts from 'echarts';

interface Props {
  currentItem: any
}

const Detail: React.FC<Props> = ({
  currentItem,
}) => {
  const [form] = Form.useForm()
  const chartRef: any = useRef(null)
  const [idCard, setIdCard] = useState<{ url: string }[]>([])
  const [healthReport, setHealthReport] = useState<{ url: string }[]>([])
  const [pass, setPass] = useState<{ url: string }[]>([])
  const [electricianCertificate, setElectricianCertificate] = useState<{ url: string }[]>([])
  const [refrigerationCertificate, setRefrigerationCertificate] = useState<{ url: string }[]>([])
  const [highAltitudeCertificate, setHighAltitudeCertificate] = useState<{ url: string }[]>([])
  const [welderCertificate, setWelderCertificate] = useState<{ url: string }[]>([])
  const [other, setOther] = useState([])
  const [policy, setPolicy] = useState([])

  useEffect(() => {
    console.log(currentItem);

    getWorkerInfo({ worker_id: currentItem.worker_id }).then(res => {
      if (res.success) {
        form.setFieldsValue({
          name: res.data.worker_name ?? '',
          num: res.data.worker_score_list.count ?? 0,
          id_no: res.data?.certificate_list?.id_card?.id_card_no ?? 0,
        })
        let policy: any = []
        let rate = [
          res.data.worker_score_list.wxzl,
          res.data.worker_score_list.wxsd,
          res.data.worker_score_list.fwtd,
          res.data.worker_score_list.smzsd,
          res.data.worker_score_list.yryb,
        ]
        if (res.data?.certificate_list?.policy) {
          Object.values(res.data?.certificate_list?.policy).map(item => {
            if (isObject(item)) {
              policy.push(item)
            }
          })
        }

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
                  value: rate,
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

        setPolicy(policy)
        setOther(res.data?.certificate_list?.other_list?.other_list)
        // setPolicy(Object.values(res.data.policy))
        setIdCard([res.data?.certificate_list?.id_card?.img_id_card_front, res.data?.certificate_list?.id_card?.img_id_card_back])
        setHealthReport([res.data?.certificate_list?.health_report?.img_health_qrcode, res.data?.certificate_list?.health_report?.img_travel_qrcode])
        setPass([res.data?.certificate_list?.health_report?.img_nucleic_acid_report, res.data?.certificate_list?.pass?.pass_card])
        setElectricianCertificate([res.data?.certificate_list?.electrician_certificate?.img_front, res.data?.certificate_list?.electrician_certificate?.img_back])
        setRefrigerationCertificate([res.data?.certificate_list?.refrigeration_certificate?.img_front, res.data?.certificate_list?.refrigeration_certificate?.img_back])
        setHighAltitudeCertificate([res.data?.certificate_list?.high_altitude_certificate?.img_front, res.data?.certificate_list?.high_altitude_certificate?.img_back])
        setWelderCertificate([res.data?.certificate_list?.welder_certificate?.img_front, res.data?.certificate_list?.welder_certificate?.img_back])
      }
    })

  }, [])

  return (
    <Form
      form={form}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 20 }}
      style={{ maxWidth: 600 }}
    >
      <Form.Item name="name" label="姓名">
        <Input readOnly bordered={false} />
      </Form.Item>

      <Form.Item name="num" label="维修订单数">
        <Input readOnly bordered={false} />
      </Form.Item>

      <Form.Item name="score" label="工人评分">
        <div ref={chartRef} style={{ width: 500, height: 400 }}></div>
      </Form.Item>

      <Form.Item name="id_no" label="身份证号">
        <Input readOnly bordered={false} />
      </Form.Item>

      <Form.Item name="id_card" label="身份证">
        <Space>
          {
            (!isEmpty(idCard) ? idCard[0]?.url : '') ?
              <Image src={!isEmpty(idCard) ? idCard[0]?.url : ''} width={200} /> :
              <IdcardOutlined style={{ fontSize: 50 }} />
          }
          {
            (!isEmpty(idCard) ? idCard[1]?.url : '') ?
              <Image src={!isEmpty(idCard) ? idCard[1]?.url : ''} width={200} /> :
              <IdcardOutlined style={{ fontSize: 50 }} />
          }
        </Space>
      </Form.Item>

      <Form.Item name="health_report" label="健康码">
        <Space>
          {
            (!isEmpty(healthReport) ? healthReport[0]?.url : '') ?
              <Image src={!isEmpty(healthReport) ? healthReport[0]?.url : ''} width={200} /> :
              <IdcardOutlined style={{ fontSize: 50 }} />
          }
          {
            (!isEmpty(healthReport) ? healthReport[1]?.url : '') ?
              <Image src={!isEmpty(healthReport) ? healthReport[1]?.url : ''} width={200} /> :
              <IdcardOutlined style={{ fontSize: 50 }} />
          }
        </Space>
      </Form.Item>

      <Form.Item name="pass" label="核酸检测/通行证">
        <Space>
          {
            (!isEmpty(pass) ? pass[0]?.url : '') ?
              <Image src={!isEmpty(pass) ? pass[0]?.url : ''} width={200} /> :
              <IdcardOutlined style={{ fontSize: 50 }} />
          }
          {
            (!isEmpty(pass) ? pass[1]?.url : '') ?
              <Image src={!isEmpty(pass) ? pass[1]?.url : ''} width={200} /> :
              <IdcardOutlined style={{ fontSize: 50 }} />
          }
        </Space>
      </Form.Item>

      <Form.Item name="electrician_certificate" label="电工证">
        <Space>
          {
            (!isEmpty(electricianCertificate) ? electricianCertificate[0]?.url : '') ?
              <Image src={!isEmpty(electricianCertificate) ? electricianCertificate[0]?.url : ''} width={200} /> :
              <IdcardOutlined style={{ fontSize: 50 }} />
          }
          {
            (!isEmpty(electricianCertificate) ? electricianCertificate[1]?.url : '') ?
              <Image src={!isEmpty(electricianCertificate) ? electricianCertificate[1]?.url : ''} width={200} /> :
              <IdcardOutlined style={{ fontSize: 50 }} />
          }
        </Space>
      </Form.Item>

      <Form.Item name="refrigeration_certificate" label="制冷证">
        <Space>
          {
            (!isEmpty(refrigerationCertificate) ? refrigerationCertificate[0]?.url : '') ?
              <Image src={!isEmpty(refrigerationCertificate) ? refrigerationCertificate[0]?.url : ''} width={200} /> :
              <IdcardOutlined style={{ fontSize: 50 }} />
          }
          {
            (!isEmpty(refrigerationCertificate) ? refrigerationCertificate[1]?.url : '') ?
              <Image src={!isEmpty(refrigerationCertificate) ? refrigerationCertificate[1]?.url : ''} width={200} /> :
              <IdcardOutlined style={{ fontSize: 50 }} />
          }
        </Space>
      </Form.Item>

      <Form.Item name="high_altitude_certificate" label="高空证">
        <Space>
          {
            (!isEmpty(highAltitudeCertificate) ? highAltitudeCertificate[0]?.url : '') ?
              <Image src={!isEmpty(highAltitudeCertificate) ? highAltitudeCertificate[0]?.url : ''} width={200} /> :
              <IdcardOutlined style={{ fontSize: 50 }} />
          }
          {
            (!isEmpty(highAltitudeCertificate) ? highAltitudeCertificate[1]?.url : '') ?
              <Image src={!isEmpty(highAltitudeCertificate) ? highAltitudeCertificate[1]?.url : ''} width={200} /> :
              <IdcardOutlined style={{ fontSize: 50 }} />
          }
        </Space>
      </Form.Item>

      <Form.Item name="welder_certificate" label="焊工证">
        <Space>
          {
            (!isEmpty(welderCertificate) ? welderCertificate[0]?.url : '') ?
              <Image src={!isEmpty(welderCertificate) ? welderCertificate[0]?.url : ''} width={200} /> :
              <IdcardOutlined style={{ fontSize: 50 }} />
          }
          {
            (!isEmpty(welderCertificate) ? welderCertificate[1]?.url : '') ?
              <Image src={!isEmpty(welderCertificate) ? welderCertificate[1]?.url : ''} width={200} /> :
              <IdcardOutlined style={{ fontSize: 50 }} />
          }
        </Space>
      </Form.Item>

      {
        !isEmpty(other) &&
        other.map((item: any, index) => {
          return (
            <Form.Item key={index} name="other_list" label="其他证件">
              <Space>
                {
                  (!isEmpty(item) ? item?.img_front?.url : '') ?
                    <Image src={!isEmpty(item) ? item?.img_front?.url : ''} width={200} /> :
                    <IdcardOutlined style={{ fontSize: 50 }} />
                }
                {
                  (!isEmpty(item) ? item?.img_back?.url : '') ?
                    <Image src={!isEmpty(item) ? item?.img_back?.url : ''} width={200} /> :
                    <IdcardOutlined style={{ fontSize: 50 }} />
                }
              </Space>
            </Form.Item>
          )
        })
      }

      <Form.Item name="policy" label="保险单">
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {
            !isEmpty(policy) &&
            policy.map((item: any, index) => {
              return (
                <div key={index} style={{ marginRight: 8, marginBottom: 10 }}>
                  {
                    (!isEmpty(item) ? item.url : '') ?
                      <Image src={!isEmpty(item) ? item.url : ''} width={200} /> :
                      <IdcardOutlined style={{ fontSize: 50 }} />
                  }
                </div>
              )
            })
          }
        </div>
      </Form.Item>

      <Form.Item name="bank_name" label="银行名称">
        <Input readOnly bordered={false} />
      </Form.Item>

      <Form.Item name="bank" label="开户行名称">
        <Input readOnly bordered={false} />
      </Form.Item>

      <Form.Item name="bank_no" label="银行卡号">
        <Input readOnly bordered={false} />
      </Form.Item>

      <Form.Item name="bank_card" label="银行卡">

      </Form.Item>
    </Form>
  )
}

export default Detail