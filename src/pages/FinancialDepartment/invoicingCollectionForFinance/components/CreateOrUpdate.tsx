import React, { useEffect, useState, RefObject } from "react"
import { ActionType } from '@ant-design/pro-components';
import { Button, Form, Input, InputNumber, Select, Space, Table } from "antd";
import GkUpload from "@/components/UploadImage/GkUpload";
import { isEmpty } from "lodash";
import { createOrUpdateFinanceCollAlone } from "@/services/ant-design-pro/maintenanceDepartment";
import { getCompanyList } from "@/services/ant-design-pro/quotation";
import { getFileUrlById } from "@/services/ant-design-pro/financialReimbursement";

const subType = [
  { value: '*建筑服务*维护维修服务', label: '*建筑服务*维护维修服务' },
  { value: '*现代服务*其他服务费', label: '*现代服务*其他服务费' },
  { value: '*信息技术服务*信息系统服务', label: '*信息技术服务*信息系统服务' },
  { value: '*建筑服务*机电工程', label: '*建筑服务*机电工程' },
  { value: '*建筑服务*安装工程', label: '*建筑服务*安装工程' }
]

interface ItemListProps {
  actionRef: RefObject<ActionType>;
  success: (text: string) => void
  error: (text: string) => void
  currentItem: {}
  handleCloseCreateOrUpdate: () => void
}

const CreateOrUpdate: React.FC<ItemListProps> = ({
  currentItem,
  handleCloseCreateOrUpdate,
  actionRef,
  success,
  error,
}) => {
  const [form] = Form.useForm()

  const [type, setType] = useState('')
  const [companyList, setCompanyList] = useState([])

  const [baseData, setBaseData] = useState<any>([{
    key: 1,
    coll_type: '',
    seller_company_id: '',
    company_name: '',
    address: '',
    mobile: '',
    amount: '',
    tax_no: '',
    bank_name: '',
    bank_no: '',
    fileList: [],
    file_ids: '',
    remark: '',
    trd_id: 0,
  }])

  const handleFinish = (values) => {
    let fileDetail: any = []
    values.table.map(item => {
      if (item.fileList.length > 0) {
        item.fileList.map(file => {
          getFileUrlById({ file_id: file.id }).then(res => {
            if (res.success) {
              fileDetail.push({
                file: res.data.file_id,
                fileId: res.data.file_id,
                id: res.data.id,
                status: 'success',
                uid: res.data.uid,
                thumb_url: res.data.file_url_thumb,
                url: res.data.file_url_enough
              })
              item.fileList = fileDetail
              item.file_ids = item.fileList.map(k => k.id).join(',')
              return item
            }
            return item
          })
          return item
        })
      }
    })
    const params = {
      department: '',
      detail_list: values.table ?? [],
      remark: values.remark ?? '',
      tax_rate: 9,
      status: type ?? ''
    }
    if (type === 'submit') {
      console.log(params);
      createOrUpdateFinanceCollAlone(params).then(res => {
        if (res.success) {
          handleCloseCreateOrUpdate()
          actionRef.current?.reload()
          success('处理成功')
          return
        }
        error(res.message)
      })
    }
  }

  const columns = [
    {
      title: '类型',
      dataIndex: 'coll_type',
      align: 'center',
      render: (dom, entity) => {
        return (
          <Select
            options={subType}
            style={{ width: 180 }}
            onChange={(e) => handleChange(e, entity, 'coll_type', 'select')}
            placeholder="请选择"
            defaultValue={entity.coll_type}
          />
        )
      }
    },
    {
      title: '销售方公司',
      dataIndex: 'seller_company_id',
      align: 'center',
      render: (dom, entity) => {
        return (
          <Select
            options={companyList}
            style={{ width: 180 }}
            onChange={(e) => handleChange(e, entity, 'seller_company_id', 'select')}
            placeholder="请选择"
            defaultValue={entity.seller_company_id}
          />
        )
      }
    },
    {
      title: '公司',
      dataIndex: 'company_name',
      align: 'center',
      render: (dom, entity) => {
        return (
          <Input
            defaultValue={entity.company_name}
            onChange={(e) => handleChange(e, entity, 'company_name', 'input')}
          />
        )
      }
    },
    {
      title: '地址',
      dataIndex: 'address',
      align: 'center',
      render: (dom, entity) => {
        return (
          <Input
            defaultValue={entity.address}
            onChange={(e) => handleChange(e, entity, 'address', 'input')}
          />
        )
      }
    },
    {
      title: '电话',
      dataIndex: 'mobile',
      align: 'center',
      render: (dom, entity) => {
        return (
          <Input defaultValue={entity.mobile} onChange={(e) => handleChange(e, entity, 'mobile', 'input')} />
        )
      }
    },
    {
      title: '金额',
      dataIndex: 'amount',
      align: 'center',
      render: (dom, entity) => {
        return (
          <InputNumber defaultValue={entity.amount || 0} min={0} onChange={(e) => handleChange(e, entity, 'amount', 'select')} />
        )
      }
    },
    {
      title: '税号',
      dataIndex: 'tax_no',
      align: 'center',
      render: (dom, entity) => {
        return (
          <Input defaultValue={entity.tax_no} onChange={(e) => handleChange(e, entity, 'tax_no', 'input')} />
        )
      }
    },
    {
      title: '银行',
      dataIndex: 'bank_name',
      align: 'center',
      render: (dom, entity) => {
        return (
          <Input defaultValue={entity.bank_name} onChange={(e) => handleChange(e, entity, 'bank_name', 'input')} />
        )
      }
    },
    {
      title: '卡号',
      dataIndex: 'bank_no',
      align: 'center',
      render: (dom, entity) => {
        return (
          <Input defaultValue={entity.bank_no} onChange={(e) => handleChange(e, entity, 'bank_no', 'input')} />
        )
      }
    },
    {
      title: '打款明细',
      dataIndex: 'fileList',
      align: 'center',
      render: (dom, entity) => {
        return (
          <GkUpload value={entity.fileList} onChange={(e) => handleChange(e, entity, 'fileList', 'image')} />
        )
      }
    },
    {
      title: '备注',
      dataIndex: 'remark',
      align: 'center',
      render: (dom, entity) => {
        return (
          <Input.TextArea defaultValue={entity.remark} onChange={(e) => handleChange(e, entity, 'remark', 'input')} />
        )
      }
    },
  ]

  const handleChange = (e, entity, cur, type) => {
    const format = baseData.map(item => {
      if (item.key === entity.key) {
        if (type === 'select') {
          entity[cur] = e
          return item
        }
        if (type === 'input') {
          entity[cur] = e.target.value
          return item
        }
        if (type === 'image') {
          if (isEmpty(e)) {
            console.log(entity[cur]);
            entity[cur] = []
            return entity
          }
          entity[cur] = e
          return item
        }
        return item
      }
      return item
    })
    setBaseData(format)
  }

  useEffect(() => {
    if (!isEmpty(currentItem)) {
      console.log(currentItem.detail_list);

      setBaseData(currentItem.detail_list)
      console.log(baseData);

      form.setFieldsValue({
        remark: currentItem.remark ?? ''
      })
    }
    getCompanyList().then(res => {
      if (res.success) {
        setCompanyList(res.data.map(item => {
          return {
            value: item.id,
            label: item.company_cn
          }
        }))
      }
    })
    form.setFieldsValue({
      table: baseData ?? []
    })
  }, [baseData])

  return (
    <Form
      form={form}
      style={{ maxWidth: 1000 }}
      onFinish={handleFinish}
    >
      <Form.Item name="table">
        <Table
          columns={columns}
          dataSource={baseData}
          scroll={{ x: 'max-content' }}
          pagination={false}
        />
      </Form.Item>

      <Form.Item name="remark" label="备注">
        <Input.TextArea />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" onClick={() => setType('submit')}>提交</Button>
          <Button htmlType="submit" onClick={() => setType('tmp_save')}>暂存</Button>
        </Space>
      </Form.Item>
    </Form>
  )
}

export default CreateOrUpdate