import {Form, Select, Input, Button, Space, InputNumber, message, Modal} from "antd"
import {
  getCompanyList,
  getCustomerInvoiceInfo,
  createOrUpdateFinanceCollAlone
} from "@/services/ant-design-pro/quotation"
import React, {useState, useEffect} from 'react'
import GkUpload from "@/components/UploadImage/GkUpload"
import AddInvoiceModal from "@/components/AddInvoiceModal";
import {getUserButtons} from "@/services/ant-design-pro/user";
import {isEmpty} from "lodash";
import UploadFiles from "@/components/UploadFiles";

const subType = [
  {value: '*建筑服务*维护维修服务', label: '*建筑服务*维护维修服务'},
  {value: '*现代服务*其他服务费', label: '*现代服务*其他服务费'},
  {value: '*信息技术服务*信息系统服务', label: '*信息技术服务*信息系统服务'},
  {value: '*建筑服务*机电工程', label: '*建筑服务*机电工程'},
  {value: '*建筑服务*安装工程', label: '*建筑服务*安装工程'}
]

interface ItemListProps {
  currentMsg: {
    brand_id: number
    id: number
  }
  currentItem: {
    id: number
    tax_rate: string
  }
  handleCloseInvoicing: () => void
  success: (text: string) => void
  error: (text: string) => void
  editData: any
}

const Invoicing: React.FC<ItemListProps> = ({
                                              currentMsg,
                                              currentItem,
                                              handleCloseInvoicing,
                                              success,
                                              error,
                                              editData,
                                            }) => {

  const [form] = Form.useForm()
  const [type, setType] = useState('')
  const [companyList, setCompanyList] = useState([])
  const [companyInfo, setCompanyInfo] = useState([])
  const [companyName, setCompanyName] = useState("")
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [reloadPage, setReloadPage] = useState(false);
  const [showSaveBtn, setShowSaveBtn] = useState(false)
  const handleFinish = (values) => {
    console.log('values.detail', values.detail)

    // let files = []
    // if (values.detail && values.detail.length > 0) {
    //   values.detail.map(item => {
    //     const formatFile = {
    //       file: item.file_id,
    //       fileId: item.file_id,
    //       id: item.file_id,
    //       status: 'success',
    //       uid: item.uid,
    //       url: item.response.url + '?x-oss-process=image/resize,w_200,h_200,m_mfit,limit_1',
    //       thumb_url: item.response.url + '?x-oss-process=image/resize,w_1000,h_1000,m_mfit,limit_1',
    //     }
    //     files.push(formatFile)
    //   })
    // }

    if (!companyName) {
      message.error('请选择公司！')
      return
    }

    const params = {
      trd_id: currentMsg.id ?? '',
      trd_sub_id: currentItem.id ?? "",
      tax_rate: currentMsg?.tax_rate ?? '',
      type: "pqi_coll",
      status: type,
      remark: values.remark ?? '',
      department: '设施维护部',
      detail_list: [{
        address: values.address ?? '',
        amount: values.money ?? '',
        bank_name: values.bank ?? '',
        bank_no: values.bank_no ?? '',
        coll_type: values.type ?? '',
        company_id: values.companyInfo ?? '',
        company_name: companyName ?? '',
        mobile: values.tel ?? '',
        seller_company_id: values.company ?? '',
        tax_no: values.code ?? '',
        trd_id: currentMsg.id ?? '',
        // fileList: files ?? [],
        file_ids: values.detail ?? "",
      }]
    }

    if (!isEmpty(editData)) {
      params.id = editData.id
    }

    createOrUpdateFinanceCollAlone(params).then(res => {
      if (res.success) {
        handleCloseInvoicing()
        message.success('操作成功')
        return
      }
      message.error(res.message)
    })
  }

  const handleChangeCompany = (e) => {
    const companyDetail: any = companyInfo.find(item => item.id === e)
    setCompanyName(companyDetail.name)
    form.setFieldsValue({
      address: companyDetail?.address ?? '',
      tel: companyDetail?.tel ?? '',
      code: companyDetail?.code ?? '',
      bank: companyDetail?.bank_name ?? '',
      bank_no: companyDetail?.bank_no ?? '',
    })
  }

  useEffect(() => {

    getCompanyList().then(res => {
      if (res.success) {
        setCompanyList(res.data.map(item => {
          return {
            value: item.id,
            label: item.company_cn,
          }
        }))
      }
    })
    getCustomerInvoiceInfo({brand_id: currentMsg.brand_id}).then(res => {
      if (res.success) {
        setCompanyInfo(res.data.map(item => {
          return {
            ...item,
            value: item.id,
            label: item.name
          }
        }))
      }
    })
    form.setFieldsValue({
      money: currentItem.price ?? '',
      remark: `工程名称：\n工程地址：`
    })
  }, [reloadPage])

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = (reload: boolean = false) => {
    setIsModalVisible(false);
    if (reload) {
      setReloadPage(prevState => {
        return !prevState
      })
    }
  };

  useEffect(() => {
    getUserButtons({module: 'fullPQI-js-collection', pos: 'submit'}).then(r => {
      if (r.success) {
        if (r.data.length > 0 && r?.data[0].name === 'pqiJSBillingCollectionSaveBtn') {
          setShowSaveBtn(true)
        }
      }
    })
  }, []);

  useEffect(() => {
    if (editData && companyInfo) {
      let companyInfoId: any = companyInfo.filter((item) => editData?.company_name === item.name)

      if (!isEmpty(companyInfoId)) {
        setCompanyName(companyInfoId[0].name)
        companyInfoId = companyInfoId[0].id
      } else {
        companyInfoId = undefined
      }


      form.setFieldsValue({
        type: editData?.coll_type,
        company: editData?.seller_company_id,
        companyInfo: companyInfoId,
        address: editData?.address,
        tel: editData?.mobile,
        money: editData?.excl_amount,
        code: editData?.tax_no,
        bank: editData?.bank_name,
        bank_no: editData?.bank_no,
        detail: editData?.file_ids,
        remark: editData?.remark,
      })
    }

  }, [editData, companyInfo]);

  return (
    <>
      <Form
        form={form}
        labelCol={{span: 5}}
        wrapperCol={{span: 15}}
        style={{maxWidth: 1200}}
        onFinish={handleFinish}
      >
        <Form.Item label="类型" name="type" rules={[{required: true}]}>
          <Select options={subType} allowClear placeholder="请选择"/>
        </Form.Item>

        <Form.Item label="销售方公司" name="company" rules={[{required: true}]}>
          <Select
            options={companyList}
            allowClear
            showSearch
            placeholder="请选择"
            filterOption={(inputValue, option) => option?.label.toLowerCase().includes(inputValue.toLowerCase())}
          />
        </Form.Item>

        <Form.Item label="公司" name="companyInfo">
          <Select
            style={{flex: 1}}
            showSearch
            options={companyInfo}
            allowClear
            placeholder="请选择"
            filterOption={(inputValue, option) => option?.label.toLowerCase().includes(inputValue.toLowerCase())}
            onChange={handleChangeCompany}
          />
        </Form.Item>

        <Form.Item label=" " colon={false}>
          <Button type="primary" style={{marginLeft: '8px'}} onClick={showModal}>
            添加公司
          </Button>
        </Form.Item>


        <Form.Item label="地址" name="address" rules={[{required: true}]}>
          <Input readOnly/>
        </Form.Item>

        <Form.Item label="电话" name="tel" rules={[{required: true}]}>
          <Input readOnly/>
        </Form.Item>

        <Form.Item label="金额" name="money" rules={[{required: true}]}>
          <InputNumber style={{width: 300}}/>
        </Form.Item>

        <Form.Item label="税号" name="code" rules={[{required: true}]}>
          <Input readOnly/>
        </Form.Item>

        <Form.Item label="银行" name="bank" rules={[{required: true}]}>
          <Input readOnly/>
        </Form.Item>

        <Form.Item label="卡号" name="bank_no" rules={[{required: true}]}>
          <Input readOnly/>
        </Form.Item>

        <Form.Item label="附件" name="detail">
          {/*<GkUpload/>*/}
          <UploadFiles />
        </Form.Item>

        <Form.Item label="备注" name="remark">
          <Input.TextArea/>
        </Form.Item>

        {
          showSaveBtn &&
          <Form.Item label=" " colon={false}>
            <Space>
              <Button type="primary" htmlType="submit" onClick={() => setType('submit')}>提交</Button>
              <Button htmlType="submit" onClick={() => setType('tmp_save')}>暂存</Button>
            </Space>
          </Form.Item>
        }

      </Form>
      <AddInvoiceModal
        visible={isModalVisible}
        onClose={handleCancel}
        type="invoicing"
      />
    </>
  )
}

export default Invoicing
