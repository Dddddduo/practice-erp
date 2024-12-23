import React, { RefObject, useEffect, useState } from "react"
import type { ActionType, ParamsType } from "@ant-design/pro-components";
import { Input, Table, Select, InputNumber, Button, Form, Space } from "antd";
import GkUpload from "@/components/UploadImage/GkUpload";
import { PlusCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import { getWorkerList } from "@/services/ant-design-pro/report";
import { getUserList } from "@/services/ant-design-pro/pushManagement";
import { isEmpty } from "lodash";
import { createOrUpdateFinanceReimAlone, getFileUrlById } from "@/services/ant-design-pro/financialReimbursement";

interface ItemListProps {
  actionRef: RefObject<ActionType>;
  success: (text: string) => void
  error: (text: string) => void
  currentItem: {
    remark: string
    detail_list: {
      showPlatsPeople: boolean
      action: string
      plat: string
      platsType: string
    }[]
  }
  subType: { value: string, label: string }
  plats: { value: string, label: string }
  handleCloseReimDetail: () => void
}

const coll_channel = [
  {
    value: '公',
    label: '公'
  },
  {
    value: '私',
    label: '私'
  },
]

const ReimDetail: React.FC<ItemListProps> = ({
  actionRef,
  success,
  error,
  currentItem,
  subType,
  plats,
  handleCloseReimDetail
}) => {
  const [form] = Form.useForm()
  const [baseData, setBaseData] = useState<any>([{
    key: 1,
    reim_type: "",
    coll_channel: '',
    bank_name: '',
    bank_no: '',
    description: '',
    plat: '',
    uid: '',
    amount: '',
    fileList: [],
    file_ids: '',
    remark: '',
    action: !isEmpty(currentItem) ? 'show' : 'add',
    platsType: "",
    showPlatsPeople: false,
  }])
  const [type, setType] = useState('')
  const [workerList, setWorkerList] = useState([])

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
    console.log(values);

    const params = {
      department: '项目部',
      detail_list: values.table ?? [],
      remark: values.remark ?? '',
      status: type
    }
    console.log(params);

    createOrUpdateFinanceReimAlone(params).then(res => {
      if (res.success) {
        handleCloseReimDetail()
        actionRef.current?.reload()
        success('操作成功')
      }
    })
  }

  const columns = [
    {
      title: "类型",
      dataIndex: 'reim_type',
      align: 'center',
      render: (dom, entity) => (
        <Select
          style={{ width: 150 }}
          options={subType}
          placeholder="请选择"
          allowClear
          disabled={isEmpty(currentItem) ? false : true}
          defaultValue={entity.reim_type}
          onChange={(e) => handleChange(e, entity, 'reim_type', 'select')}
        />
      )
    },
    {
      title: "收款类型",
      dataIndex: 'coll_channel',
      align: 'center',
      render: (dom, entity) => (
        <Select
          style={{ width: 150 }}
          options={coll_channel}
          placeholder="请选择"
          allowClear
          disabled={isEmpty(currentItem) ? false : true}
          onChange={(e) => handleChange(e, entity, 'coll_channel', 'select')}
          defaultValue={entity.coll_channel}
        />
      )
    },
    {
      title: "开户行名称",
      dataIndex: 'bank_name',
      align: 'center',
      render: (dom, entity) => (
        <Input
          style={{ width: 150 }}
          disabled={isEmpty(currentItem) ? false : true}
          onChange={(e) => handleChange(e, entity, 'bank_name', 'input')}
          defaultValue={entity.bank_name}
        />
      )
    },
    {
      title: "银行账户",
      dataIndex: 'bank_no',
      align: 'center',
      render: (dom, entity) => (
        <Input
          style={{ width: 150 }}
          disabled={isEmpty(currentItem) ? false : true}
          onChange={(e) => handleChange(e, entity, 'bank_no', 'input')}
          defaultValue={entity.bank_no}
        />
      )
    },
    {
      title: "用途描述",
      dataIndex: 'description',
      align: 'center',
      render: (dom, entity) => (
        <Input.TextArea
          style={{ width: 150 }}
          disabled={isEmpty(currentItem) ? false : true}
          onChange={(e) => handleChange(e, entity, 'description', 'input')}
          defaultValue={entity.description}
        />
      )
    },
    {
      title: "收款名称",
      dataIndex: 'plat',
      align: 'center',
      render: (dom, entity) => (
        <div>
          <Select
            style={{ width: 150, marginRight: 10 }}
            allowClear
            options={plats}
            disabled={isEmpty(currentItem) ? false : true}
            onChange={(e) => handleChangePlats(e, entity)}
            placeholder="请选择"
            defaultValue={entity.plat}
          />
          {
            entity.showPlatsPeople &&
            <>
              {
                entity.platsType === 'type' ?
                  <Input style={{ width: 150 }} /> :
                  <Select
                    style={{ width: 150 }}
                    placeholder="请选择"
                    options={workerList}
                    disabled={isEmpty(currentItem) ? false : true}
                    allowClear
                    onChange={(e) => handleChange(e, entity, 'uid', 'select')}
                    defaultValue={entity.uid}
                  />
              }
            </>
          }
        </div>
      )
    },
    {
      title: "金额",
      dataIndex: 'amount',
      align: 'center',
      render: (dom, entity) => (
        <InputNumber
          min={0}
          defaultValue={entity.amount ?? 1}
          disabled={isEmpty(currentItem) ? false : true}
          style={{ width: 100 }}
          onChange={(e) => handleChange(e, entity, 'amount', 'select')}
        />
      )
    },
    {
      title: "打款明细",
      dataIndex: 'fileList',
      align: 'center',
      render: (dom, entity) => (
        <GkUpload value={entity.fileList} onChange={(e) => handleChange(e, entity, 'fileList', 'image')} />
      )
    },
    {
      title: "备注",
      dataIndex: 'remark',
      align: 'center',
      render: (dom, entity) => (
        <Input.TextArea
          style={{ width: 100 }}
          disabled={isEmpty(currentItem) ? false : true}
          onChange={(e) => handleChange(e, entity, 'remark', 'input')}
          defaultValue={entity.remark}
        />
      )
    },
    {
      title: "操作",
      dataIndex: 'action',
      align: 'center',
      render: (dom, entity, index) => {
        return (
          <>
            {
              entity.action === 'show' ?
                <Button>查看</Button> :
                <>
                  <PlusCircleOutlined style={{ fontSize: 20, cursor: 'pointer', marginRight: 5 }} onClick={addData} />
                  {
                    baseData.length > 1 &&
                    <DeleteOutlined style={{ fontSize: 20, cursor: 'pointer' }} onClick={() => removeData(entity)} />
                  }
                </>
            }
          </>
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
          // let format: any = []

          // e.map(value => {
          //   console.log(value);

          //   getFileUrlById({ file_id: value.id }).then(res => {
          //     console.log(res.data);
          //     format.push({
          //       file: res.data.file_id,
          //       fileId: res.data.file_id,
          //       id: res.data.id,
          //       status: 'success',
          //       uid: res.data.uid,
          //       thumb_url: res.data.file_url_thumb,
          //       url: res.data.file_url_enough
          //     })
          //   })
          // })
          // console.log(format);
          return item
        }
        return item
      }
      return item
    })
    setBaseData(format)
  }

  const addData = () => {
    const newData = {
      key: baseData[baseData.length - 1].key + 1,
      reim_type: "",
      coll_channel: '',
      bank_name: '',
      bank_no: '',
      description: '',
      plat: '',
      uid: '',
      amount: '',
      fileList: "",
      remark: '',
      action: !isEmpty(currentItem) ? 'show' : 'add',
      platsType: "",
      showPlatsPeople: false,
    }
    setBaseData(preState => {
      return [
        ...preState,
        newData
      ]
    })
  }

  const removeData = (entity) => {
    setBaseData(baseData.filter(item => item.key !== entity.key))
  }

  const handleChangePlats = (e, entity) => {
    const format = baseData.map(item => {
      if (item.key === entity.key) {
        item.plat = e
        if (!e) {
          item.showPlatsPeople = false
          return item
        }
        item.showPlatsPeople = true
        if (e === 'other') {
          item.platsType = 'type'
          return item
        }
        if (e === 'worker' || e === 'supplier') {
          item.platsType = 'select'
          return item
        }
        return item
      }
      return item
    })
    setBaseData(format)
    setWorkerList([])
    console.log(e);

    if (e === 'worker') {
      getWorkerList().then(res => {
        if (res.success) {
          const format = res.data.map(item => {
            return {
              value: item.worker_id,
              label: item.name
            }
          })
          setWorkerList(format)
        }
      })
    }
    if (e === 'supplier') {
      getUserList().then(res => {
        if (res.success) {
          const format = res.data.map(item => {
            return {
              value: item.uid,
              label: item.name_cn
            }
          })
          setWorkerList(format)
        }
      })
    }
    // if (e === 'other') {
    //   setPlatsType('type')
    //   return
    // }
    // setPlatsType('select')
  }

  useEffect(() => {
    console.log(currentItem);
    if (!isEmpty(currentItem)) {
      currentItem.detail_list.map(item => {
        item.showPlatsPeople = true
        item.action = 'show'
        if (item.plat === 'other') {
          item.platsType = 'type'
          return item
        }
        if (item.plat === 'worker') {
          getWorkerList().then(res => {
            if (res.success) {
              const format = res.data.map(item => {
                return {
                  value: item.worker_id,
                  label: item.name
                }
              })
              setWorkerList(format)
            }
          })
          return
        }
        if (item.plat === 'supplier') {
          getUserList().then(res => {
            if (res.success) {
              const format = res.data.map(item => {
                return {
                  value: item.uid,
                  label: item.name_cn
                }
              })
              setWorkerList(format)
            }
          })
          return
        }
      })
      setBaseData(currentItem.detail_list)
      form.setFieldsValue({
        remark: currentItem.remark
      })
      return
    }
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
      <Form.Item name='table'>
        <Table
          columns={columns}
          dataSource={baseData}
          scroll={{ x: 'max-content' }}
          pagination={false}
        />
      </Form.Item>
      <Form.Item label="备注" name="remark">
        <Input.TextArea
          disabled={isEmpty(currentItem) ? false : true}
        />
      </Form.Item>

      {/* <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" onClick={() => setType('submit')}>提交</Button>
          <Button type="primary" ghost htmlType="submit" onClick={() => setType('tmp_save')}>暂存</Button>
        </Space>
      </Form.Item> */}
    </Form>

  )
}

export default ReimDetail