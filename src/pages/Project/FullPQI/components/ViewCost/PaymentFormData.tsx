import SubmitButton from "@/components/Buttons/SubmitButton"
import {StringDatePicker} from "@/components/StringDatePickers"
import UploadFiles from "@/components/UploadFiles"
import {CurrentItemParams, FormValues, ItemAlpply} from "@/viewModel/PQI/useViewCost"
import {Button, Form, FormInstance, Input, message, Select, Space, Table} from "antd"
import React, {useEffect, useRef, useState} from "react"
import {getCompanyList} from "@/services/ant-design-pro/quotation";
import {getPqiInvoiceInfo} from "@/services/ant-design-pro/project";
import AddInvoiceModal from "@/components/AddInvoiceModal";
import {ActionType} from "@ant-design/pro-components";
import {createInvoice, deleteInvoice} from "@/services/ant-design-pro/pqi";
import DeleteButton from "@/components/Buttons/DeleteButton";
import BaseContainer, {ModalType} from "@/components/Container";

interface PaymentFormDataParams {
  form: FormInstance
  open: boolean
  formUpload:any
  invoiceInfo?: any
  currentItem: CurrentItemParams
  onClosePayment: () => void
  onInvoicePqiCostEstimate: (values: FormValues) => void
  onUploadFile: (file_id: string) => void
  showSubmitBtn: boolean
  handleChangeCompany: (companyDetail: {value: number, label: string}) => void
  itemApply: ItemAlpply,
  type?: string

  handleCreateInvoice: (values: any) => void,
  handleEditorInvoice: (values: any) => void
}

const PaymentFormData: React.FC<PaymentFormDataParams> = ({
                                                            form,
                                                            open,
                                                            formUpload,
                                                            invoiceInfo,
                                                            currentItem,
                                                            onClosePayment,
                                                            onInvoicePqiCostEstimate,
                                                            onUploadFile,
                                                            showSubmitBtn,
                                                            handleChangeCompany,
                                                            itemApply,
                                                            type,

                                                            handleCreateInvoice,
                                                            handleEditorInvoice
                                                          }) => {
  const tableRef = useRef<ActionType>();
  const [companyList, setCompanyList] = useState([])
  const [showCreateCompany, setShowCreateCompany] = useState(false)
  const [companyInfo, setCompanyInfo] = useState([])
  const [reloadPage, setReloadPage] = useState(false);

  const [editorInvoice, setEditorInvoice] = useState(false)
  const [editorForm] = Form.useForm()

  const handleChangeCompanyItem = (e: number) => {
    const companyDetail: any = companyInfo.find((item: { value: number }) => item.value === e)
    form.setFieldsValue({
      seller_register_num: companyDetail?.code ?? '',
      bank: companyDetail?.bank_name ?? '',
      bank_no: companyDetail?.bank_no ?? '',
    })
    console.log(companyDetail)
    handleChangeCompany(companyDetail)
  }

  const handleCloseCreateCompany = (reload: boolean) => {
    setShowCreateCompany(false)
    if (reload) {
      setReloadPage(prevState => {
        return !prevState
      })
    }
  }

  useEffect(() => {
    try {
      getCompanyList().then((res) => {
        if (res.success) {
          setCompanyList(
            res.data.map((item: { id: number; company_cn: string }) => {
              return {
                value: item.id,
                label: item.company_cn,
              };
            }),
          );
        }
      });
    } catch (err) {
      console.log(err);
    }
    try {
      getPqiInvoiceInfo({ brand_id: 1 }).then((res) => {
        if (res.success) {
          setCompanyInfo(
            res.data.map((item: { id: string; brand: string }) => {
              return {
                ...item,
                value: item.id,
                label: (item.brand === '第三方公司（做可选项）' ? '' : item.brand ) + ' ' + (item.name ?? ''),
              };
            }),
          );
        }
      });
    } catch (err) {
      console.log(err);
    }


    // try {
    //
    // }
  }, [reloadPage]);
  const formItemLayout = {
    labelCol: { span: 12 },
    wrapperCol: { span: 18 },
  };
/* 发票信息 */
  const DeleteInvoice = (file_id: number) => {
    const params = {
      id: file_id
    }
    deleteInvoice(params).then((res) => {
      if (res.success) {
        message.success('删除成功')
        tableRef.current?.reload()
        onClosePayment()
      }
    })
  }
  const [ recordId, setRecordId ] = useState(0)
  const columns = [
    {
      title: '项目名称',
      dataIndex: 'commodity_name',
      align: 'center',
    },
    {
      title: '发票号',
      dataIndex: 'invoice_num',
      align: 'center',
    },
    {
      title: '含税金额',
      dataIndex: 'amount_in_figuers',
      align: 'center',
    },
    {
      title: '税额',
      dataIndex: 'total_tax',
      align: 'center',
    },
    {
      title: '税率',
      dataIndex: 'tax_rate',
      align: 'center',
    },
    {
      title: '不含税金额',
      dataIndex: 'total_amount',
      align: 'center',
    },
    {
      title: '收款公司税号',
      dataIndex: 'seller_register_num',
      align: 'center',
    },
    {
      title: '收款公司',
      dataIndex: 'seller_name',
      align: 'center',
    },
    {
      title: '打款公司税号',
      dataIndex: 'purchaser_register_num',
      align: 'center',
    },
    {
      title: '打款公司',
      dataIndex: 'purchaser_name',
      align: 'center',
    },
    {
      title: '开票时间',
      dataIndex: 'invoice_date',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
      align: 'center',
      width: '10vw',
      render: (_: any, record: any) => {
        // console.log('record--record',record)
        return (
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <Button size={'small'} type={'primary'}
            onClick={() => {
              setEditorInvoice(true)
              console.log('record--record修改',record)
              editorForm.setFieldsValue({
                t_commodity_name: record.commodity_name,
                t_purchaser_name: record.purchaser_name,
                t_purchaser_register_num: record.purchaser_register_num,
                t_seller_name: record.seller_name,
                t_seller_register_num: record.seller_register_num,
                t_amount_in_figuers: record.amount_in_figuers,
                t_total_amount: record.total_amount,
                t_total_tax: record.total_tax,
                t_tax_rate: record.tax_rate,
                t_invoice_num: record.invoice_num,
                t_invoice_date: record.invoice_date,
                t_id: record.id
              });
              setRecordId(record.id)
            }}>
              修改
            </Button>
            <DeleteButton
              type="primary"
              danger
              size={'small'}
              onConfirm={() => DeleteInvoice(record.id)}
            >
              删除
            </DeleteButton>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      {type === 'apply' ? (
        <Form
          form={form}
          {...formItemLayout}
          style={{ width: 450 }}
          onFinish={(values) => {
            onInvoicePqiCostEstimate(values)
            tableRef.current?.reload()
          }}
        >
          <Form.Item label="打款公司" name="company" rules={[{ required: true }]}>
            <Select
              options={companyList}
              allowClear
              showSearch
              placeholder="请选择"
              filterOption={(inputValue: string, option: any) =>
                option?.label.toLowerCase().includes(inputValue.toLowerCase())
              }
            />
          </Form.Item>

          <Form.Item label="收款公司" name="seller_name" required={true}>
            <Select
              value={itemApply?.coll_company_id}
              style={{ flex: 1 }}
              showSearch
              options={companyInfo}
              allowClear
              placeholder="请选择"
              filterOption={(inputValue: string, option: any) =>
                option?.label.toLowerCase().includes(inputValue.toLowerCase())
              }
              onChange={handleChangeCompanyItem}
            />
          </Form.Item>

          <Form.Item label=" " colon={false}>
            <Button
              type="primary"
              style={{ marginLeft: '8px' }}
              onClick={() => setShowCreateCompany(true)}
            >
              添加收款公司
            </Button>
          </Form.Item>

          <Form.Item label="总金额(含税)" name="in_amount" rules={[{ required: true }]}>
            <Input readOnly />
          </Form.Item>

          <Form.Item label="开户行" name="bank" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="银行账户" name="bank_no" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="金额(不含税)" name="ex_amount">
            <Input readOnly />
          </Form.Item>

          <Form.Item label="税额" name="tax_amount">
            <Input readOnly />
          </Form.Item>

          <Form.Item label="税率" name="tax_rate">
            <Input readOnly />
          </Form.Item>

          <Form.Item label="税号" name="seller_register_num">
            <Input />
          </Form.Item>

          {/*<Form.Item label="发票号" name="invoice_num">*/}
          {/*  <Input />*/}
          {/*</Form.Item>*/}

          {/*<Form.Item label="开票时间" name="invoice_date">*/}
          {/*  <StringDatePicker />*/}
          {/*</Form.Item>*/}

          <Form.Item label="合同/报价（盖章）" name="stamp_files">
            <UploadFiles />
          </Form.Item>

          <Form.Item label="报价（无章）" name="no_stamp_files">
            <UploadFiles />
          </Form.Item>

          <Form.Item label="备注" name="remark">
            <Input.TextArea />
          </Form.Item>

          <Form.Item label=" " colon={false}>
            <Space>
              {showSubmitBtn && !currentItem?.payment_at && (
                <SubmitButton form={form} type="primary">
                  提交
                </SubmitButton>
              )}
              <Button danger onClick={onClosePayment}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      ) : (
        type === 'upload' && (
          <Form
            form={formUpload}
            {...formItemLayout}
            style={{ width: 450 }}
            onFinish={(values) => {
              handleCreateInvoice(values);
              tableRef.current?.reload();
            }}
          >
            <Form.Item label="项目名称" name="t_commodity_name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label="打款公司" name="t_purchaser_name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item
              label="打款公司税号"
              name="t_purchaser_register_num"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="收款公司" name="t_seller_name" required={true}>
              <Input />
            </Form.Item>
            <Form.Item
              label="收款公司税号"
              name="t_seller_register_num"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="总金额(含税)" name="t_amount_in_figuers" rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Form.Item label="金额(不含税)" name="t_total_amount">
              <Input />
            </Form.Item>

            <Form.Item label="税额" name="t_total_tax">
              <Input />
            </Form.Item>

            <Form.Item label="税率" name="t_tax_rate">
              <Input />
            </Form.Item>

            <Form.Item label="发票号" name="t_invoice_num">
              <Input />
            </Form.Item>

            <Form.Item label="开票时间" name="t_invoice_date">
              <StringDatePicker />
            </Form.Item>

            <Form.Item label="上传发票" name="files">
              <UploadFiles  onChange={onUploadFile} />
            </Form.Item>

            <Form.Item label=" " colon={false}>
              <Space>
                  <SubmitButton form={formUpload} type="primary">
                    提交
                  </SubmitButton>
              </Space>
            </Form.Item>
          </Form>
        )
      )}
      {showCreateCompany && (
        <AddInvoiceModal
          visible={showCreateCompany}
          onClose={handleCloseCreateCompany}
          type="payment"
        />
      )}
      {type === 'invoiceInfo' && (
        <div>
          <h3 style={{gap: '10px', display: 'flex', marginBottom: '10px'}}>开票记录</h3>
          <Table
            actionRef={tableRef}
            style={{ width: '150%' }}
            columns={columns}
            scroll={{ x: 1500 }}
            dataSource={invoiceInfo ? invoiceInfo : []}
            rowKey="id"
            pagination={false}
            bordered={true}
            size="small"
          />
        </div>
      )}
      <BaseContainer
        type={ModalType.Modal}
        width={800}
        open={editorInvoice}
        destroyOnClose={true}
        title="开票记录"
        onCancel={() => setEditorInvoice(false)}
      >
        <Form
          form={editorForm}
          {...formItemLayout}
          style={{ width: 450 }}
          onFinish={async (values) => {
            const res = {
              ...values,
              id: recordId
            }
            console.log('res--res--',res)
            handleEditorInvoice(res)
          }}
        >
          <Form.Item label="项目名称" name="t_commodity_name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="打款公司" name="t_purchaser_name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="打款公司税号"
            name="t_purchaser_register_num"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="收款公司" name="t_seller_name" required={true}>
            <Input />
          </Form.Item>
          <Form.Item
            label="收款公司税号"
            name="t_seller_register_num"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="总金额(含税)" name="t_amount_in_figuers" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="金额(不含税)" name="t_total_amount">
            <Input />
          </Form.Item>

          <Form.Item label="税额" name="t_total_tax">
            <Input />
          </Form.Item>

          <Form.Item label="税率" name="t_tax_rate">
            <Input />
          </Form.Item>

          <Form.Item label="发票号" name="t_invoice_num">
            <Input />
          </Form.Item>

          <Form.Item label="开票时间" name="t_invoice_date">
            <StringDatePicker />
          </Form.Item>


          <Form.Item label=" " colon={false}>
            <Space>
                <SubmitButton form={editorForm} type="primary">
                  提交
                </SubmitButton>
            </Space>
          </Form.Item>
        </Form>
      </BaseContainer>
    </div>
  );
}

export default PaymentFormData
