import React, {useEffect, useState, RefObject} from 'react'
import {
  Form,
  Typography,
  Input,
  DatePicker,
  Radio,
  Space,
  Button,
  Table,
  Select,
  Modal,
  List,
  Popconfirm,
  message
} from 'antd'
import type {RadioChangeEvent, SelectProps} from 'antd';
import {ActionType} from '@ant-design/pro-components';
import {PlusOutlined, DeleteFilled} from "@ant-design/icons";
import dayjs from 'dayjs';
import * as math from 'mathjs'
import GkUpload from '@/components/UploadImage/GkUpload';
import {
  getQtyMapList,
  updateReim,
  applyDeleteReim,
  getSameReimList,
  createOrUpdate
} from '@/services/ant-design-pro/reimbursement';
import {isEmpty, isUndefined} from 'lodash';
import TransferOrder from "@/pages/Order/Reimbursement/components/TransferOrder";

interface ItemListProps {
  currentReimMessage: API.ReimbursementListItem
  workerList: any
  actionRef: RefObject<ActionType>;
  onCloseReimDetailDrawer: () => void
  success: (text: string) => void
  error: (text: string) => void
}

/**
 * 报销单-报销单详情
 * @constructor
 */
const ReimOrderDetail: React.FC<ItemListProps> = ({
                                                    currentReimMessage,
                                                    workerList,
                                                    actionRef,
                                                    onCloseReimDetailDrawer,
                                                    success,
                                                    error
                                                  }) => {
  const [form] = Form.useForm();
  const [sameReimList, setSameReimList] = useState([])
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isFinish, setIsFinish] = useState(0)
  const [unit, setUnit] = useState([])
  const [feeTypeList, setfeeTypeList] = useState([
    {
      label: '人工费',
      value: 'labor_cost'
    },
    {
      label: '材料费',
      value: 'material_fee'
    }
  ])
  const [feeType, setFeeType] = useState('')
  const [reimDetailList, setReimDetailList] = useState(currentReimMessage?.reim_detail_list)
  const [approveRemark, setApproveRemark] = useState('')
  const [num, setNum] = useState(0)
  const [price, setPrice] = useState(0)
  const [typeList, setTypeList] = useState([])
  const [messageApi, contextHolder] = message.useMessage();
  const [showTransferOrder, setShowTransferOrder] = useState(false)

  const getImageList = (fileList) => {
    let itemFile: any = []
    let itemId: any = []
    fileList.map(item => {
      if (item.status === '' || item.status === 'done') {
        itemId.push(item.id)

        let tmp: any = {
          file: item.id,
          fileId: item.id,
          id: item.id,
          status: 'success',
          uid: item.id,
          thumb_url: item.response ? `${item.response?.url}?x-oss-process=image/resize,w_200,h_200,m_mfit,limit_1` : item?.url,
          url: item.response ? `${item.response?.url}?x-oss-process=image/resize,w_1000,h_1000,m_mfit,limit_1` : item?.url,
        }
        if (!item.response) {
          tmp.original_name = ''
        }
        itemFile.push(tmp)
      }
    })

    // if (itemId.length > 0) {
    //   itemId =
    // } else {
    //
    // }
    return {
      itemFile,
      itemId: itemId.join(',')
    }
  }

  // 提交
  const handleFinish = (values) => {
    console.log(values);

    if (values.create_at) {
      values.create_at = dayjs(values.create_at.$d).format('YYYY-MM-DD')
    }
    if (values.completed_at) {
      values.completed_at = dayjs(values.completed_at.$d).format('YYYY-MM-DD')
    }

    console.log('打印', currentReimMessage)

    const currentParams = {
      ...currentReimMessage,
      sign_ids: getImageList(values.sign_file_list).itemId ?? '',
      bill_ids: getImageList(values.bill_file_list).itemId ??  '',
      ma_remark: values.ma_remark ?? '',
      bill_file_list: getImageList(values.bill_file_list).itemFile ?? [],
      reim_detail_list: reimDetailList ?? [],
      sign_file_list: getImageList(values.sign_file_list).itemFile ?? [],
      approve_remark: values?.approve_remark ?? '',
      create_at: values.create_at ?? '',
      completed_at: values.completed_at ?? '',
      reim_id: currentReimMessage.id ?? '',
    }
    console.log(currentParams);

    createOrUpdate(currentParams).then((res: any) => {
      if (res.success) {
        onCloseReimDetailDrawer()
        actionRef.current?.reload()
        success('修改成功')
        return
      }
      error(res.message)
    })
  }

  // 修改是否完工
  const onChangeFinish = (e: RadioChangeEvent) => {
    setIsFinish(e.target.value)
  }

  // 获取数量单位
  const getQtyMap = async () => {
    const res = await getQtyMapList()
    setUnit(res.data)
  }

  // 处理单位
  const optionsMaps: SelectProps['options'] = unit.map((item: any) => {
    return {
      value: item.key,
      label: item.value,
    };
  });
  // 处理工人
  const optionsWorkers: SelectProps['options'] = workerList.map((item: any) => {
    return {
      value: item.worker_id,
      label: item.name
    }
  })

  // 切换费用类型
  const updateFee = (e, value) => {
    const fee_list: any = reimDetailList?.map(item => {
      if (item.reim_detail_id === value.reim_detail_id) {
        setFeeType(e)
        item.reim_type = e
        return item
      }
    })
    setTypeList(fee_list)
  }

  // 添加新项
  const handleAddReim = () => {
    const newReim = {
      key: parseInt((Math.random() * 1000).toString()),
      reim_detail_id: parseInt((Math.random() * 1000).toString()),
      detail: '',
      num: '',
      price: '',
      total_price: '',
      unit: "项",
      reim_type: '',
      remark: '',
      worker: '',
      worker_mobile: '',
      worker_name: '',
      worker_uid: 0
    }
    if (isUndefined(reimDetailList)) {
      setReimDetailList([newReim])
      return
    }
    setReimDetailList([...reimDetailList, newReim])
    // const detail_list = currentReimMessage?.reim_detail_list ?? []
    // const mergeData = detail_list.length > 0 ? detail_list : [newReim]
    // setReimDetailList(preState => {
    //   return [
    //     ...preState,
    //     ...mergeData
    //   ]
    // })
  }

  // 删除一项
  const handleDeleteRiem = (id) => {
    const newReim = reimDetailList?.filter(item => item.reim_detail_id !== id)
    setReimDetailList(newReim)
  }

  const handleInput = (e, dom) => {
    reimDetailList?.map(item => {
      if (item.reim_detail_id === dom.reim_detail_id) {
        item.detail = e.target.value
        return item
      }
    })
  }

  const handleInputNum = (e, dom) => {
    reimDetailList?.map(item => {
      if (item.reim_detail_id === dom.reim_detail_id) {
        setNum(e.target.value)
        item.num = e.target.value
        item.total_price = Number(item.num) * Number(item.price)
        return item
      }
    })
  }

  const handlInputPirce = (e, dom) => {
    reimDetailList?.map(item => {
      if (item.reim_detail_id === dom.reim_detail_id) {
        setPrice(e.target.value)
        item.price = e.target.value
        item.total_price = Number(item.num) * Number(item.price)
        return item
      }
    })
  }

  const handlInputRemark = (e, dom) => {
    reimDetailList?.map(item => {
      if (item.reim_detail_id === dom.reim_detail_id) {
        item.remark = e.target.value
        return item
      }
    })
  }

  const handlChangeWorker = (e, dom) => {
    console.log(e, dom, optionsWorkers);

  }

  const columns = [
    {
      title: '明细',
      dataIndex: 'detail',
      render: (dom, entity) => {
        return (
          currentReimMessage.back_id ?
            <Input readOnly style={{width: 150}} defaultValue={dom}/> :
            <Input style={{width: 150}} defaultValue={dom} onInput={(e) => handleInput(e, entity)}/>
        )
      },
    },
    {
      title: '数量',
      dataIndex: 'num',
      render: (dom, entity) => {
        return (
          currentReimMessage.back_id ?
            <Input readOnly style={{width: 180}} defaultValue={dom} addonAfter={
              <Select style={{width: 80}} defaultValue={entity.unit} options={optionsMaps}/>
            }/> :
            <Input style={{width: 180}} defaultValue={dom} onInput={(e) => handleInputNum(e, entity)} addonAfter={
              <Select style={{width: 80}} defaultValue={entity.unit} options={optionsMaps}/>
            }/>
        )
      }
    },
    {
      title: '单价',
      dataIndex: 'price',
      render: (dom, entity) => {
        return (
          currentReimMessage.back_id ?
            <Input readOnly style={{width: 120}} defaultValue={dom}/> :
            <Input style={{width: 120}} defaultValue={dom} onInput={(e) => {
              handlInputPirce(e, entity)
            }}/>
        )
      }
    },
    {
      title: '小计',
      dataIndex: 'total_price',
      render: (dom) => {
        return (
          currentReimMessage.back_id ?
            <Input style={{width: 120}} readOnly value={dom}/> :
            <Input style={{width: 120}} disabled value={dom}/>
        )
      }
    },
    {
      title: '备注',
      dataIndex: 'remark',
      render: (dom, entity) => {
        return (
          currentReimMessage.back_id ?
            <Input.TextArea readOnly rows={1} defaultValue={dom}/> :
            <Input.TextArea rows={1} defaultValue={dom} onInput={(e) => handlInputRemark(e, entity)}/>
        )
      }
    },
    {
      title: '合作工人',
      dataIndex: 'worker_uid',
      render: (dom, entity) => {
        return (
          currentReimMessage.back_id ?
            <Input.TextArea readOnly rows={1} defaultValue={dom}/> :
            <Select placeholder="请选择" style={{width: 150}} defaultValue={dom} options={optionsWorkers}
                    onChange={(e) => handlChangeWorker(e, entity)}></Select>
        )
      }
    },
    {
      title: '费用类别',
      dataIndex: 'reim_type',
      render: (dom, entity) => {
        return (
          currentReimMessage.back_id ?
            <div>{entity.detail}</div> :
            (entity.detail === '企业滴滴' || entity.detail === '企业货拉拉') ?
              <Input readOnly style={{width: 150}} defaultValue={entity.detail}/> :
              <Select placeholder="请选择" allowClear style={{width: 150}} defaultValue={dom} options={feeTypeList}
                      onChange={(e) => updateFee(e, entity)}/>
        )
      }
    },
    {
      render: (dom, entity) => {
        return (
          <DeleteFilled style={{cursor: 'pointer'}} onClick={() => handleDeleteRiem(entity.reim_detail_id)}/>
        )
      }
    }
  ]

  // 审核意见输入
  const inputApproveRemark = (e) => {
    setApproveRemark(e.target.value)
  }

  // 报销单的操作
  const reimOperation = async (type) => {
    const statusParams = {
      status: type ?? '',
      reim_id: currentReimMessage.id ?? '',
      remark: approveRemark ?? ''
    }
    const res = await updateReim(statusParams)
    if (res.success) {
      onCloseReimDetailDrawer()
      actionRef?.current?.reload();
    }
  }

  // 删除报销单|订单
  const applyDelete = (deleteOrder: number) => {
    applyDeleteReim({reim_id: currentReimMessage.id, del_order: deleteOrder}).then(res => {
      if (res.success) {
        messageApi.open({
          type: 'success',
          content: '删除成功',
        })
        setShowDeleteModal(false)
        onCloseReimDetailDrawer()
        actionRef?.current?.reload()
      }
    })
  }

  const transferOrder = () => {
    setShowTransferOrder(true)
  }

  useEffect(() => {
    getQtyMap()
    getSameReimList({reim_id: currentReimMessage.id}).then(res => {
      setSameReimList(res.data.same_list)
    })
  }, [])

  useEffect(() => {
    let signImages: any = []
    let billImages: any = []
    if (currentReimMessage && currentReimMessage?.sign_file_list && currentReimMessage?.sign_file_list[0].id) {
      // eslint-disable-next-line guard-for-in
      for (const item in currentReimMessage?.sign_file_list) {
        signImages.push(
          {
            id: currentReimMessage?.sign_file_list[item]?.id ?? '',
            uid: currentReimMessage?.sign_file_list[item]?.uid ?? '',
            file_id: currentReimMessage?.sign_file_list[item]?.file_id ?? '',
            name: currentReimMessage?.sign_file_list[item]?.name ?? '',
            url: currentReimMessage?.sign_file_list[item]?.file_url_thumb ?? '',
            original_file_name: currentReimMessage?.sign_file_list[item]?.file_url_enough ?? '',
            status: 'done'
          }
        )
      }
    }

    if (currentReimMessage && currentReimMessage?.bill_file_list && currentReimMessage?.bill_file_list[0].id) {
      for (const item in currentReimMessage?.bill_file_list) {
        billImages.push(
          {
            id: currentReimMessage?.bill_file_list[item]?.id ?? '',
            uid: currentReimMessage?.bill_file_list[item]?.uid ?? '',
            file_id: currentReimMessage?.bill_file_list[item]?.file_id ?? '',
            name: currentReimMessage?.bill_file_list[item]?.name ?? '',
            url: currentReimMessage?.bill_file_list[item]?.file_url_thumb ?? '',
            original_file_name: currentReimMessage?.bill_file_list[item]?.file_url_enough ?? '',
            status: 'done'
          }
        )
      }
    }

    currentReimMessage.sub_total = 0.00
    currentReimMessage.leader_price = 0.00
    currentReimMessage.worker_price = 0.00
    for (const data in reimDetailList) {
      currentReimMessage.sub_total = math
        .chain(Number(currentReimMessage.sub_total))
        .add(Number(reimDetailList[data].total_price))
        .round(2)
        .done()
      console.log(reimDetailList);

      if (reimDetailList[data].reim_type === 'labor_cost') {
        currentReimMessage.worker_price = math
          .chain(Number(currentReimMessage.worker_price))
          .add(Number(reimDetailList[data].total_price))
          .round(2)
          .done()
      }
    }
    currentReimMessage.leader_price = math.chain(Number(currentReimMessage.sub_total)).subtract(Number(currentReimMessage.worker_price)).round(2).done()
    console.log(currentReimMessage, currentReimMessage.leader_price);


    reimDetailList?.map(item => {
      item.total_price = Number(item.num) * Number(item.price)
      return item
    })
    // @ts-ignore
    setIsFinish(currentReimMessage.is_completed ?? 0)

    form.setFieldsValue({
      reim_no: currentReimMessage?.reim_no ?? '',
      create_at: dayjs(currentReimMessage?.create_at, 'YYYY-MM-DD') ?? '',
      is_completed: currentReimMessage?.is_completed ?? 0,
      completed_at: currentReimMessage?.completed_at !== '' ? dayjs(currentReimMessage?.completed_at, 'YYYY-MM-DD') : '',
      brand_en: currentReimMessage?.brand_en ?? '',
      city_cn: currentReimMessage?.city_cn ?? '',
      market_cn: currentReimMessage?.market_cn ?? '',
      store_cn: currentReimMessage?.store_cn ?? '',
      ma_type_cn: currentReimMessage?.ma_type_cn ?? '',
      ma_remark: currentReimMessage?.ma_remark ?? '',
      worker_price: currentReimMessage?.worker_price ?? '',
      leader_price: currentReimMessage?.leader_price ?? '',
      sub_total: currentReimMessage?.sub_total ?? '',
      remark: currentReimMessage?.remark ?? '',
      approve_remark: currentReimMessage?.approve_remark ?? '',
      pre_quote_status: currentReimMessage?.pre_quote_status === 1 ? '是' : '否' ?? '',
      sign_file_list: signImages ?? [],
      bill_file_list: billImages ?? [],
      reim_detail_list: reimDetailList ?? [],
    })
  }, [currentReimMessage, reimDetailList, feeType, num, price, typeList])

  return (
    <>
      {contextHolder}
      <Form
        form={form}
        name="user_id"
        labelCol={{span: 6}}
        wrapperCol={{span: 16}}
        style={{maxWidth: 800}}
        onFinish={handleFinish}
      >
        <Form.Item label="报销单编号" name="reim_no">
          <Input readOnly/>
        </Form.Item>

        {
          sameReimList.length > 1 &&
          <Form.Item label="相似报销单编号">
            <List
              dataSource={sameReimList}
              renderItem={(item: any) => (
                <List.Item>
                  <a href={`/order/reimbursement?reim_no=${item.reim_no}`}>{item.reim_no}</a>
                </List.Item>
              )}
            />
          </Form.Item>
        }

        <Form.Item label="申请日期" name="create_at">
          <DatePicker/>
        </Form.Item>

        <Form.Item label="是否完工" name="is_completed">
          <Radio.Group onChange={onChangeFinish} defaultValue={isFinish}>
            <Radio value={1}>是</Radio>
            <Radio value={0}>否</Radio>
          </Radio.Group>
        </Form.Item>

        {
          isFinish === 1 &&
          <Form.Item label="完工日期" name="completed_at">
            <DatePicker/>
          </Form.Item>
        }

        <Form.Item label="品牌" name="brand_en">
          <Input readOnly/>
        </Form.Item>

        <Form.Item label="城市" name="city_cn">
          <Input readOnly/>
        </Form.Item>

        <Form.Item label="商场" name="market_cn">
          <Input readOnly/>
        </Form.Item>

        <Form.Item label="店铺" name="store_cn">
          <Input readOnly/>
        </Form.Item>

        <Form.Item label="工作类型" name="ma_type_cn">
          <Input readOnly/>
        </Form.Item>

        <Form.Item label="工作内容" name="ma_remark">
          <Input/>
        </Form.Item>

        <Form.Item label="明细" name="reim_detail_list">
          <>
            <Table
              columns={columns}
              scroll={{x: 'max-content'}}
              dataSource={reimDetailList}
              pagination={false}
            />
            {
              currentReimMessage?.back_id ?
                <template></template> :
                <Button type="primary" onClick={handleAddReim}>
                  <PlusOutlined/>
                  添加新项
                </Button>
            }
          </>
        </Form.Item>

        {
          feeType === 'labor_cost' &&
          <Form.Item label="工人费用" name="worker_price">
            <Input readOnly/>
          </Form.Item>
        }


        <Form.Item label="负责人费用" name="leader_price">
          <Input readOnly/>
        </Form.Item>

        <Form.Item label="总费用" name="sub_total">
          <Input readOnly/>
        </Form.Item>

        <Form.Item label="签收单" name="sign_file_list">
          <GkUpload/>
        </Form.Item>

        <Form.Item label="发票或收据(可选)" name="bill_file_list">
          <GkUpload/>
        </Form.Item>

        <Form.Item label="备注" name="remark">
          <Input.TextArea readOnly/>
        </Form.Item>

        <Form.Item label="审核意见" name="approve_remark">
          {
            currentReimMessage?.back_id ? <Input.TextArea readOnly/> : <Input.TextArea onChange={inputApproveRemark}/>
          }
        </Form.Item>

        <Form.Item label="是否预报价" name="pre_quote_status">
          <Input readOnly bordered={false}/>
        </Form.Item>

        {
          !currentReimMessage?.back_id &&
          <Form.Item>
            <Space>
              {
                currentReimMessage.status === 'create' &&
                <Button type="primary" onClick={() => reimOperation('reject_submit')}>
                  驳回
                </Button>
              }
              {
                currentReimMessage.status === 'create' &&
                <Button type="primary" onClick={() => reimOperation('agree_submit')}>
                  通过
                </Button>
              }
              {
                currentReimMessage.status === 'agree_submit' &&
                <Button type="primary" onClick={() => reimOperation('reject_submit')}>
                  重新驳回
                </Button>
              }
              {
                currentReimMessage.status === 'reject_submit' &&
                <Button type="primary" onClick={() => reimOperation('agree_submit')}>
                  重新通过
                </Button>
              }
              <Button onClick={transferOrder}>
                转单
              </Button>
              <Button type="primary" htmlType="submit">
                修改
              </Button>
              <Button type="primary" danger onClick={() => {
                setShowDeleteModal(true)
              }}>
                申请删除
              </Button>
              <Button onClick={onCloseReimDetailDrawer}>取消</Button>
            </Space>
          </Form.Item>
        }
      </Form>

      <Modal
        open={showTransferOrder}
        onCancel={() => setShowTransferOrder(false)}
        destroyOnClose
        title={'报销单转移'}
        footer={null}
      >
        <TransferOrder
          fromReimId={currentReimMessage?.id ?? 0}
          handleClose={() => {
            setShowTransferOrder(false)
          }}
          actionRef={actionRef}
        />
      </Modal>

      <Modal
        open={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        destroyOnClose
        footer={[
          <Button key="submit" type="default" onClick={() => setShowDeleteModal(false)}>取消</Button>,
          <Popconfirm
            title="确定仅删除报销单?"
            onConfirm={() => applyDelete(0)}
            okText="确认"
            cancelText="取消"
          >
            <Button type="primary">仅删除报销单</Button>
          </Popconfirm>,
          <Popconfirm
            title="确定删除报销单和订单?"
            onConfirm={() => applyDelete(1)}
            okText="确认"
            cancelText="取消"
          >
            <Button type="primary">删除报销单和订单</Button>
          </Popconfirm>,
        ]}
      >
        <Typography.Title level={3}>确定要申请删除吗？</Typography.Title>
      </Modal>
    </>
  )
}

export default ReimOrderDetail
