import React, { useEffect, useState } from "react";
import { Button, Form, Input, message, Select, SelectProps, Space, Table } from "antd";
import { getQtyMapList, createOrUpdateReim } from "@/services/ant-design-pro/reimbursement";
import { PlusOutlined } from "@ant-design/icons";
import UploadFiles from "@/components/UploadFiles";
import { generateUniqueId } from "@/utils/utils";
import * as math from 'mathjs';
import { isEmpty } from "lodash";
import { invoiceOcr } from "@/services/ant-design-pro/financialReimbursement";
import { StringDatePicker } from "@/components/StringDatePickers";
import SubmitButton from "@/components/Buttons/SubmitButton";

interface Props {
  orderId: number
  orderSupplierId: number
  getData: () => void
}

interface ItemDetailList {
  id: any
  detail: string
  num: number
  unit: string
  remark: string
  price: number
  total_price: number
}

const CreateReim: React.FC<Props> = ({
  orderId,
  orderSupplierId,
  getData
}) => {
  const [form] = Form.useForm()
  const [units, setUnits] = useState([])
  const [reimDetailList, setReimDetailList] = useState<ItemDetailList[]>([])
  const [signFileIds, setSignFileIds] = useState('')
  const [billFileIds, setBillFileIds] = useState('')

  const onSubmit = async (values) => {
    try {
      const result = await createOrUpdateReim({
        ma_remark: values?.ma_remark ?? '',
        remark: values?.remark ?? '',
        sign_ids: signFileIds,
        bill_ids: billFileIds,
        order_supplier_id: orderSupplierId,
        order_id: orderId,
        reim_detail_list: reimDetailList,
      })
      if (result.success) {
        message.success('保存成功')
        getData()
        return
      }
      message.success('保存失败')
    } catch (error) {
      message.success('保存异常')
    }

  };

  // 获取数量单位
  const getQtyMap = async () => {
    const res = await getQtyMapList()
    const optionMaps: SelectProps['options'] = res.data.map((item: any) => {
      return {
        value: item.value,
        label: item.value,
      };
    });
    // @ts-ignore
    setUnits(optionMaps)
  }

  useEffect(() => {
    getQtyMap()
  }, [])

  const handleInputNum = (e, dom) => {
    console.log('eie9e9ee9e9e9e', e)
    let totalPrice = 0
    const newReimDetailList = reimDetailList?.map(item => {
      if (item.id === dom.id) {
        item.num = e.target.value
        item.total_price = math.chain(item.price).multiply(item.num).round(2).done()
      }
      totalPrice = math.chain(totalPrice).add(item.total_price).round(2).done()
      return item
    })
    setReimDetailList(newReimDetailList)
    form.setFieldsValue({
      per_sub_total: totalPrice
    })
  }

  // 修改单位
  const handleChangeUnit = (e, dom) => {
    const newReimDetailList = reimDetailList.map((item) => {
      if (item.id === dom.id) {
        item.unit = e
      }
      return item
    })

    setReimDetailList(newReimDetailList)
  }

  const handleAddReim = () => {
    setReimDetailList([
      ...reimDetailList,
      {
        id: generateUniqueId(),
        detail: '',
        num: 0,
        unit: '',
        remark: '',
        price: 0,
        total_price: 0
      }
    ])
  }

  // 上传
  const handleUpload = async (file_id, type) => {
    console.log('e, typee, typee, type', file_id, type)
    if (type === 'sign') {
      setSignFileIds(file_id)
    }
    if (type === 'bill') {
      setBillFileIds(file_id)
    }
  }

  const handleInput = (e, dom) => {
    const newReimDetailList = reimDetailList.map((item) => {
      if (item.id === dom.id) {
        item.detail = e.target.value
      }
      return item
    })
    setReimDetailList(newReimDetailList)
  }

  const handleInputPrice = (e, dom) => {
    let totalPrice = 0
    const newReimDetailList = reimDetailList.map((item) => {
      if (item.id === dom.id) {
        item.price = e.target.value
        item.total_price = math.chain(item.price).multiply(item.num).round(2).done()
      }
      totalPrice = math.chain(totalPrice).add(item.total_price).round(2).done()
      return item
    })
    setReimDetailList(newReimDetailList)
    form.setFieldsValue({
      per_sub_total: totalPrice
    })
  }

  // 表格
  const Columns = [
    {
      title: "明细",
      dataIndex: "detail",
      key: "detail",
      render: (dom, entity) => {
        return (
          <Input.TextArea rows={1} style={{ width: 150 }} defaultValue={dom} onInput={(e) => handleInput(e, entity)} />
        )
      },
    },
    {
      title: '数量',
      dataIndex: 'num',
      align: 'center',
      render: (dom, entity) => {
        return (
          <Input style={{ width: 140 }} defaultValue={dom} onInput={(e) => handleInputNum(e, entity)} addonAfter={
            <Select style={{ width: 60 }} defaultValue={entity.unit} options={units} onChange={(e) => handleChangeUnit(e, entity)} />
          } />
        )
      }
    },
    {
      title: '单价',
      dataIndex: 'price',
      render: (dom, entity) => {
        return (
          <Input style={{ width: 120 }} defaultValue={dom} onInput={(e) => handleInputPrice(e, entity)} />
        )
      }
    },
    {
      title: '小计',
      dataIndex: 'total_price',
      render: (dom) => {
        return (
          <Input style={{ width: 120 }} readOnly value={dom} defaultValue={dom} />
        )
      }
    },
    {
      title: '备注',
      dataIndex: 'remark',
      render: (dom) => {
        return (
          <Input.TextArea rows={1} defaultValue={dom} />
        )
      }
    },
  ]

  // @ts-ignore
  // @ts-ignore
  return (
    <>
      <Form
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        style={{ maxWidth: 600 }}
        onFinish={onSubmit}
      >
        <Form.Item label="报销明细">
          <Table
            columns={Columns}
            dataSource={reimDetailList}
            scroll={{ x: 'max-content' }}
            pagination={false}
          />
          <Button type="primary" onClick={handleAddReim}>
            <PlusOutlined />
            添加新项
          </Button>
        </Form.Item>

        <Form.Item label="per-sub-total" name="per_sub_total">
          <Input readOnly />
        </Form.Item>

        <Form.Item label="自建签收单" name="sign">
          <UploadFiles value={signFileIds} fileLength={8} onChange={(e) => handleUpload(e, 'sign')} />
        </Form.Item>

        <Form.Item label="自建发票或收据" name="bill">
          <UploadFiles value={billFileIds} fileLength={8} onChange={(e) => handleUpload(e, 'bill')} />
        </Form.Item>

        <Form.Item label="工作描述" name="ma_remark">
          <Input.TextArea />
        </Form.Item>

        <Form.Item label="备注" name="remark">
          <Input />
        </Form.Item>

        <Form.Item label=' ' colon={false}>
          <SubmitButton type="primary" form={form}>保存</SubmitButton>
        </Form.Item>
      </Form>
    </>
  )
}

export default CreateReim
