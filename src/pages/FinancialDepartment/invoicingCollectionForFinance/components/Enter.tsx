import {Button, Card, DatePicker, Form, Input, message, Select, Space, Table} from "antd"
import {StringNullableChain, isEmpty, flatMap, map} from "lodash"
import React, {useEffect, useState} from "react"
import {getCompanyList, getCustomerInvoiceInfo} from "@/services/ant-design-pro/quotation"
import GkUpload from "@/components/UploadImage/GkUpload"
import {EyeOutlined} from "@ant-design/icons"
import {
  checkIncome,
  checkInfo,
  collectionOcr,
  createOrUpdateIncome,
  createOrUpdateInvoice,
  invoiceOcr
} from "@/services/ant-design-pro/financialReimbursement"
import dayjs from "dayjs"
import UploadFiles from "@/components/UploadFiles";
import {getFileUrlById} from "@/services/ant-design-pro/system";
import {getFileUrlByIds} from "@/services/ant-design-pro/project";
import {bcMath} from "@/utils/utils";
import SubmitButton from "@/components/Buttons/SubmitButton";
import {produce} from "immer";
import CheckInvoicePanel from "@/components/CheckInvoicePanel";

interface ItemListProps {
  success: (text: string) => void
  error: (text: string) => void
  selectedRowsState: any
  handleCloseEnter: () => void
  title: string
  actionRef: any
  currentItem?: any
}

const Enter: React.FC<ItemListProps> = ({
                                          success,
                                          error,
                                          selectedRowsState,
                                          handleCloseEnter,
                                          title,
                                          actionRef,
                                        }) => {
  const [form] = Form.useForm()
  const [baseData, setBaseData] = useState([])
  const [messageApi, contextHolder] = message.useMessage();
  const [companyList, setCompanyList] = useState<any>()
  const [showCheckInvoicePanel, setShowCheckInvoicePanel] = useState(false)
  const [saveValue, setSaveValue] = useState<any>()
  const [checkData, setCheckData] = useState<any>([])
  const [unmatchingCompany, setUnmatchingCompany] = useState('')

  const loading = (key, content) => {
    messageApi.open({
      key,
      type: 'loading',
      content: content,
    });
  }
  const successApi = (key, content) => {
    messageApi.open({
      key,
      type: 'success',
      content: content,
    });
  }

  const handleFinish = async (values) => {
    setSaveValue(values);

    if (title === '开票录入') {
      const list = selectedRowsState[0].detail_list.map((item) => {
        return item.id;
      });

      let amount = '0.00';

      selectedRowsState[0].detail_list.map((item: any) => {
        amount = bcMath.add(parseFloat(amount), item.amount);
      });
      /* 校验参数 */
      const checkParams = {
        detail_id_list: list,
        // orc识别信息
        seller_name: values?.seller_name ?? '',
        purchaser_name: values?.purchaser_name ?? '',
        amount_in_figuers: values?.amount_in_figuers
          ? bcMath.fixedNum(values?.amount_in_figuers)
          : '',
        total_amount: values?.total_amount ? bcMath.fixedNum(values?.total_amount) : '',
        total_tax: values?.total_tax ? bcMath.fixedNum(values?.total_tax) : '',
        tax_rate: values?.tax_rate ? bcMath.fixedNum(values?.tax_rate) : '',
      };
      console.log('开票录入--校验参数', checkParams);
      /* 提交参数 */
      const submitParams = {
        department: '',
        detail_id_list: list,
        invoice_list: [
          {
            tax_rate: values?.tax_rate ?? '',
            amount: amount ?? '',
            invoice_no: values.no ?? '',
            file_ids: values?.annex ?? '',
            invoice_at: values.time ? dayjs(values.time).format('YYYY-MM-DD') : '',
            remark: values.remark ?? '',
          },
        ],
        // orc识别信息
        seller_name: values?.seller_name ?? '',
        purchaser_name: values?.purchaser_name ?? '',
        amount_in_figuers: values?.amount_in_figuers ?? '',
        total_amount: values?.total_amount ?? '',
        total_tax: values?.total_tax ?? '',
        tax_rate: values?.tax_rate ?? '',
        invoice_no: values?.no ?? '',
      };
      console.log('开票录入--提交参数', submitParams);
      try {
        const checkRes = await checkInfo(checkParams);
        console.log('开票录入--校验结果', checkRes);
        if (checkRes.message === 'error') {
          console.log('开票录入--校验结果不一致', checkRes);
          setCheckData(checkRes.data);
          setShowCheckInvoicePanel(true);
          if ('check' in values) {
            const submitRes = await createOrUpdateInvoice(submitParams);
            if (submitRes.success) {
              success('操作成功');
              setShowCheckInvoicePanel(false);
              handleCloseEnter();
              actionRef?.current?.reload();
              return;
            }
            error(submitRes.message);
          }
          return;
        } else if (checkRes.message === 'success') {
          console.log('开票录入--校验结果一致', checkRes);
          setCheckData([]);
          setShowCheckInvoicePanel(false);
        }
        const submitRes = await createOrUpdateInvoice(submitParams);
        if (submitRes.success) {
          success('操作成功');
          setShowCheckInvoicePanel(false);
          handleCloseEnter();
          actionRef?.current?.reload();
          return;
        }
      } catch (err) {
        console.log('校验错误', err);
      }
    }

    const ids = flatMap(selectedRowsState, (item) => map(item.detail_list, 'id'));
    if (title === '收款录入') {
      let amount = '0.00';

      selectedRowsState[0].detail_list.map((item: any) => {
        amount = bcMath.add(parseFloat(amount), item.amount);
      });
      /* 校验参数 */
      const checkParams = {
        detail_id_list: ids,
        // orc识别信息
        amount: values?.amount ? bcMath.fixedNum(values?.amount) : '',
        company_id: values?.company ?? '',
      };
      console.log('收款录入--校验参数', checkParams);
      /* 提交参数 */
      const submitParams = {
        department: '',
        detail_id_list: ids,
        income_list: [
          {
            amount: values?.amount ?? '',
            file_ids: values?.annex ?? '',
            income_at: values.time ? dayjs(values.time).format('YYYY-MM-DD') : '',
            remark: values.remark ?? '',
          },
        ],
        // orc识别信息
        amount: values?.amount ?? '',
        company_id: values?.company ?? '',
      };
      console.log('收款录入--提交参数', submitParams);
      try {
        const checkRes = await checkIncome(checkParams);
        console.log('收款录入--校验结果', checkRes);
        if (checkRes.message === 'error') {
          console.log('收款录入--校验结果不一致', checkRes);
          setCheckData(checkRes.data);
          setShowCheckInvoicePanel(true);
          if ('check' in values) {
            const submitRes = await createOrUpdateIncome(submitParams);
            if (submitRes.success) {
              success('操作成功');
              setShowCheckInvoicePanel(false);
              handleCloseEnter();
              actionRef?.current?.reload();
              return;
            }
            error(submitRes.message);
          }
          return;
        } else if (checkRes.message === 'success') {
          console.log('收款录入--校验结果一致', checkRes);
          setCheckData([]);
          setShowCheckInvoicePanel(false);
        }
        const submitRes = await createOrUpdateIncome(submitParams);
        if (submitRes.success) {
          success('操作成功');
          setShowCheckInvoicePanel(false);
          handleCloseEnter();
          actionRef?.current?.reload();
          return;
        }
      } catch (err) {
        console.log('校验错误', err);
      }
    }
  };

  const handleUpload = (value) => {
    let params: { [key: string]: any } = {}
    if (title === '开票录入') {
      params = {
        // 原来的代码：file_id: value ? value[value.length - 1].file_id : '',
        file_id: value.split(',').length > 0 ? value.split(',')[value.split(',').length - 1] : '',
        file_type: 'pdf',
      }
      if ("" !== params.file_id) {
        let suffix = ''
        getFileUrlByIds({file_ids: params.file_id}).then(urlData => {
          if (urlData.success) {
            suffix = urlData.data[0].url.split('.')[urlData.data[0].url.split('.').length - 1]
            console.log(suffix)
            if (suffix === 'pdf' || suffix === 'PDF') {
              try {
                loading('开票录入', '获取数据中...')
                invoiceOcr(params).then(res => {
                  if (res.success) {

                    form.setFieldsValue({
                      no: res.data.invoice_num ?? '',
                      tax_rate: Number(res.data.tax_rate).toFixed(2), // 保留2位小数
                      time: "" !== res.data.invoice_date && dayjs(res.data.invoice_date),

                      // 新加
                      seller_name: res.data?.seller_name ?? '',
                      purchaser_name: res.data?.purchaser_name ?? '',
                      amount_in_figuers: res.data?.amount_in_figuers ?? '',
                      total_amount: res.data?.total_amount ?? '',
                      total_tax: res.data?.total_tax ?? '',

                    })
                    successApi('开票录入', '获取数据成功')
                    return
                  }
                  message.error(res.message)
                })
              } catch (err) {
                message.error('获取数据异常')
              }
            }
          }
        })
      }
      return
    } else {
      params = {
        // 原来的代码：file_id: value ? value[value.length - 1].file_id : '',
        file_id: value.split(',').length > 0 ? value.split(',')[value.split(',').length - 1] : '',
        file_type: 'img',
        other: true
      }
      if ("" !== params.file_id) {
        try {
          loading('收款录入', '获取数据中...')
          collectionOcr(params).then(res => {
            if (res.success) {
              form.setFieldsValue({
                amount: "" !== res.data.small && res.data.small,
                time: "" !== res.data.invoice_date && dayjs(res.data.invoice_date),
                company:res.data.company ? res.data.company : undefined
              })
              if (!res.data.company) {
                setUnmatchingCompany(res.data.company_name?.words)
              }
              successApi('收款录入', '获取数据成功')
              return
            }
            message.error(res.message)
          })
        } catch (err) {
          message.error('获取数据异常')
        }
      }
    }
  }

  const columns: any = [
    {
      title: "公司",
      dataIndex: "company_name",
      align: 'center',
    },
    {
      title: "税号",
      dataIndex: "tax_no",
      align: 'center',
    },
    {
      title: "地址",
      dataIndex: "address",
      align: 'center',
    },
    {
      title: "手机号",
      dataIndex: "mobile",
      align: 'center',
    },
    {
      title: "银行",
      dataIndex: "bank_name",
      align: 'center',
    },
    {
      title: "卡号",
      dataIndex: "bank_no",
      align: 'center',
    },
    {
      title: "金额",
      dataIndex: "amount",
      align: 'center',
    },
    {
      title: "备注",
      dataIndex: "remark",
      align: 'center',
    },
    {
      title: "请款时间",
      dataIndex: "create_at",
      align: 'center',
    },
    {
      title: "附件",
      dataIndex: "file_ids",
      align: 'center',
      render: () => {
        return (
          <EyeOutlined/>
        )
      }
    },
  ]

  useEffect(() => {
    const details: any = []
    let amount = '0.00'
    selectedRowsState.map(item => {
      item.detail_list.map(data => {
        amount = bcMath.add(parseFloat(amount), data.amount)
        const formatData = {
          ...data,
          key: data.id
        }
        details.push(formatData)
      })
    })
    setBaseData(details)
    form.setFieldsValue({
      amount: amount
    })

    // getCompanyList().then(res => {
    //   if (res.success) {
    //     const list = res.data.map(item => {
    //       return {
    //         value: item.id,
    //         label: item.company_cn
    //       }
    //     })
    //     setCompanyList(list)
    //   }
    // })

    getCustomerInvoiceInfo({}).then(res => {
      if (res.success) {
        setCompanyList(res.data.map(item => {
          return {
            ...item,
            value: item.id,
            label: item.name
          }
        }))
      }
    })

  }, [])

  return (
    <>
      {contextHolder}
      <Card title={title} style={{marginBottom: 30}}>
        <Form
          labelCol={{span: 4}}
          wrapperCol={{span: 15}}
          style={{maxWidth: 800}}
          form={form}
          onFinish={handleFinish}
        >
          {
            title === '开票录入' &&
            <Form.Item label="销售方" name="seller_name">
              <Input/>
            </Form.Item>
          }

          {
            title === '开票录入' &&
            <Form.Item label="购买方" name="purchaser_name">
              <Input/>
            </Form.Item>
          }

          {
            title === '开票录入' &&
            <Form.Item label="发票号" name="no" rules={[{required: true}]}>
              <Input/>
            </Form.Item>
          }

          {
            title === '开票录入' &&
            <Form.Item label="含税金额" name="amount_in_figuers">
              <Input />
            </Form.Item>
          }

          {
            title === '开票录入' &&
            <Form.Item label="不含税金额" name="total_amount">
              <Input />
            </Form.Item>
          }

          {
            title === '开票录入' &&
            <Form.Item label="税额" name="total_tax">
              <Input />
            </Form.Item>
          }

          {
            title === '开票录入' &&
            <Form.Item label="税率" name="tax_rate"  rules={[{required: true}]}>
              <Input />
            </Form.Item>
          }

          {
            title === '收款录入' &&
            <Form.Item label="付款公司" name="company" required={true}>
              <Select
                showSearch
                options={companyList}
                style={{ width: 300 }}
                filterOption={(input, option) => (option?.label ?? '').includes(input)}
              />
            </Form.Item>
          }

          {/* 如果未识别，将显示公司名称 */}
          {
            title === '收款录入' && unmatchingCompany &&
            <Form.Item label="未匹配的公司" name="company">
              <div>{unmatchingCompany}</div>
            </Form.Item>
          }

          {
            title === '收款录入' &&
            <Form.Item label="金额" name="amount">
              <Input style={{ width: 150}} />
            </Form.Item>
          }

          <Form.Item label="附件" name="annex">
            <UploadFiles onChange={handleUpload}/>
          </Form.Item>

          <Form.Item label={title === '开票录入' ? '开票时间' : '收款时间'} name="time" required={true}>
            <DatePicker/>
          </Form.Item>

          <Form.Item label="备注" name="remark">
            <Input.TextArea/>
          </Form.Item>

          <Form.Item label=" " colon={false}>
            <Space>
              <SubmitButton type="primary" form={form}>提交</SubmitButton>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Card title="申请详情">
        <Table
          // dataSource={isEmpty(currentItem) ? selectedRowsState.detail_list : [currentItem]}
          dataSource={baseData}
          columns={columns}
          scroll={{x: 'max-content'}}
          pagination={title === '收款录入'}
        />
      </Card>

      <CheckInvoicePanel
       errorData={
         checkData
       }
       handleCancel={() => {
         setShowCheckInvoicePanel(false)
       }}
       handleOk={() => {
         let newValue: any = {
           ...saveValue,
           check: false
         }

         handleFinish(newValue)
       }}
       open={showCheckInvoicePanel}
      />
    </>
  )
}

export default Enter
