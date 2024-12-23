import React, {useEffect, useState} from 'react'
import {Form, Input, Button, Space, DatePicker, Table, Select, Modal, Image, message, RowProps} from "antd"
import type {SelectProps} from 'antd';
import Opinion from './Opinion';
import {
  BarsOutlined,
  RotateLeftOutlined,
  RotateRightOutlined
} from '@ant-design/icons';
import {
  approveReim,
  updateQuotationProfitRate,
  getCalcProfitReimList,
  rotateImage
} from '@/services/ant-design-pro/quotation';
import CreateReim from "@/pages/Order/Quotation/components/CreateReim";
import BaseContainer, {ModalType} from '@/components/Container';
import Payment from './Payment';
import {isEmpty} from "lodash";
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {DragSortTable} from "@ant-design/pro-components";
import {updateKpiTableItemIds} from "@/services/ant-design-pro/kpi";
import {produce} from "immer";

interface ItemListProps {
  reim: any
  currentItem
  success: (text: string) => void
  error: (text: string) => void
  actionRef: any
  onCloseDetail: () => void
  getData: () => void
  unit: any
}

const Reim: React.FC<ItemListProps> = ({
                                         reim,
                                         currentItem,
                                         success,
                                         error,
                                         actionRef,
                                         onCloseDetail,
                                         getData,
                                         unit
                                       }) => {
  const [form] = Form.useForm()
  const [reimDetailList, setReimDetailList] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [itemId, setItemId] = useState(0)
  const [signFileList, setSignFileList] = useState([{file_url_enough: '', file_id: 0, rotate: 0}])
  const [billFileList, setBillFileList] = useState([{file_url_enough: '', file_id: 0, rotate: 0}])
  const [addReimVisible, setAddReimVisible] = useState(false)
  const [orderId, setOrderId] = useState(0)
  const [orderSupplierId, setOrderSupplierId] = useState(0)
  const [openPayment, setOpenPayment] = useState(false)
  const [loading, setLoading] = useState(true)

  // 处理单位
  const optionsMaps: SelectProps['options'] = unit.map((item: any) => {
    return {
      value: item.key,
      label: item.value,
    };
  });

  const pass = (item) => {
    const params = {
      status: 'agree_submit',
      reim_id: item.reim_id,
      remark: ''
    }
    approveReim(params).then(res => {
      if (res.success) {
        onCloseDetail()
        actionRef.current.reload()
        success('操作成功')
        return
      }
      error(res.message)
    })
  }

  const openModal = (item) => {
    setItemId(item.reim_id)
    setShowModal(true)
  }

  const onCloseModal = () => {
    setShowModal(false)
  }

  const reloadProfit = async () => {
    console.log(currentItem.order_supplier_id);
    await updateQuotationProfitRate({supplier_order_id: currentItem.order_supplier_id})
    await getCalcProfitReimList({supplier_order_id: currentItem.order_supplier_id})
  }

  const columns: any = [
    {
      title: '排序',
      dataIndex: 'sort',
      width: 60,
      className: 'drag-visible',
    },
    {
      title: '搜索',
      dataIndex: 'search',
      align: 'center',
      render: (dom, entity) => {
        return (
          <>
            <a href={`https://search.jd.com/Search?keyword=${entity.detail}&enc=utf-8`} target='_blank'
               style={{marginRight: 10}} rel="noreferrer">京东</a>
            <a href={`https://s.taobao.com/search?q=${entity.detail}`} target='_blank' rel="noreferrer">淘宝</a>
          </>
        )
      },
    },
    {
      title: '明细',
      dataIndex: 'detail',
      render: (dom, entity) => {
        return (
          <Input readOnly style={{width: 150}} defaultValue={dom}/>
        )
      },
    },
    {
      title: '数量',
      dataIndex: 'num',
      render: (dom, entity) => {
        return (
          <Input readOnly style={{width: 180}} defaultValue={dom} addonAfter={
            <Select disabled style={{width: 80}} defaultValue={entity.unit} options={optionsMaps}></Select>
          }/>
        )
      }
    },
    {
      title: '单价',
      dataIndex: 'price',
      render: (dom, entity) => {
        return (
          <Input readOnly style={{width: 120}} defaultValue={dom}/>
        )
      }
    },
    {
      title: '小计',
      dataIndex: 'total_price',
      render: (dom) => {
        return (
          <Input style={{width: 120}} readOnly value={dom}/>
        )
      }
    },
    {
      title: '备注',
      dataIndex: 'remark',
      render: (dom, entity) => {
        return (
          <Input.TextArea readOnly rows={1} defaultValue={dom}/>
        )
      }
    },
    {
      title: '合作工人',
      dataIndex: 'worker_name',
      render: (dom, entity) => {
        return (
          <Input.TextArea readOnly rows={1} defaultValue={dom}/>
        )
      }
    },
    {
      title: '费用类别',
      dataIndex: 'reim_type',
      render: (dom, entity) => {
        return (
          <Input readOnly style={{width: 150}} defaultValue={entity.detail}/>
        )
      }
    },
  ]

  useEffect(() => {
    setOrderId(currentItem?.order_id ?? 0)
    setOrderSupplierId(currentItem?.order_supplier_id ?? 0)
  }, [])

  useEffect(() => {
    if (reim) {
      setReimDetailList(reim.reim_list.map(item => {
        item.key = item.reim_id
        return [item]
      }))
      let signList = []
      let billList = []
      reim.reim_list.map(item => {
        if (item.sign_img_list) {
          item.sign_img_list.map(item => {
            item.rotate = 0
            signList.push(item)
          })
          item.bill_img_list.map(item => {
            item.rotate = 0
            billList.push(item)
          })
        }
      })
      setSignFileList(signList)
      setBillFileList(billList)

      form.setFieldsValue({
        reim_no: reim.reim_list.length > 0 ? reim.reim_list.map(item => item.reim_no).join(' | ') : '',
        city: reim.city_cn ?? '',
        market: reim.market_cn ?? '',
        brand: reim.brand_en ?? '',
        store: reim.store_cn ?? '',
        worker_price: reim.reim_worker_price ?? 0,
        leader_price: reim.reim_leader_price ?? 0,
        subTotal: reim.reim_total_price ?? 0,
      })
      setLoading(false)
    }
  }, [reim])

  const addReim = () => {
    setAddReimVisible(true)
  }

  const onDownload = (src: string) => {
    fetch(src)
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.download = 'image.png';
        document.body.appendChild(link);
        link.click();
        URL.revokeObjectURL(url);
        link.remove();
      });
  };

  const onRotateImage = (type: string, index: number, direction: string) => {
    console.log(type, index, direction);
    let fileId = 0
    if (type === 'sign') {
      fileId = signFileList[index].file_id
      signFileList[index].rotate = 90
      const newList = signFileList.map((row) => {
        if (row.file_id === signFileList[index].file_id) {
          row.rotate = typeof row.rotate === 'undefined' ? (direction === 'left' ? -90 : 90) : (direction === 'left' ? row.rotate - 90 : row.rotate + 90)
        }

        return row;
      })
      setSignFileList(newList);
    }

    if (type === 'bill') {
      fileId = billFileList[index].file_id
    }

    rotateImage({file_id: fileId, direction: direction}).then(result => {
      console.log('resultltltlt', result)
    })
    //const result = await rotateImage({file_id: fileId, direction: direction})
  }

  const handleClosePayment = () => {
    setOpenPayment(false)
  }

  const handleDragSortEnd = (
    beforeIndex: number,
    afterIndex: number,
    newDataSource: any,
    data: any,
  ) => {
    const formatData: any = reimDetailList.map((item: { reim_id: number, reim_detail_list: [] }[]) => {
      const format = item.filter(i => i.reim_id === data.reim_id)
      if (!isEmpty(format)) {
        format[0].reim_detail_list = newDataSource
        return format
      }
      return item
    })
    setReimDetailList(formatData)
  };

  // @ts-ignore
  // @ts-ignore
  // @ts-ignore
  return (
    <>
      <Form
        form={form}
        labelCol={{span: 4}}
        wrapperCol={{span: 20}}
        style={{maxWidth: '100%'}}
      >
        <Form.Item label="报销单编号" name="reim_no">
          <Input readOnly/>
        </Form.Item>

        <Form.Item label="城市" name="city">
          <Input readOnly/>
        </Form.Item>

        <Form.Item label="商场" name="market">
          <Input readOnly/>
        </Form.Item>

        <Form.Item label="品牌" name="brand">
          <Input readOnly/>
        </Form.Item>

        <Form.Item label="店铺" name="store">
          <Input readOnly/>
        </Form.Item>

        <Form.Item label=" " colon={false}>
          <Button
            disabled={isEmpty(reimDetailList)}
            loading={loading}
            type='primary'
            onClick={() => setOpenPayment(true)}
          >
            申请付款
          </Button>
        </Form.Item>

        <Form.Item label="明细" name="reim_detail_list">
          <>
            {
              reimDetailList.map((item: any) => {
                return (
                  <div key={item[0].key}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <span style={{fontWeight: 700}}>{item[0].leader} - {item[0].ma_remark}</span>
                      <Space>
                        {
                          item[0].reim_status === 'wait' &&
                          <>
                            <Button type='primary' onClick={() => openModal(item[0])} danger>驳回</Button>
                            <Button type='primary' onClick={() => pass(item[0])}>通过</Button>
                          </>
                        }
                        {
                          item[0].reim_status === 'agree' &&
                          <Button type='primary' onClick={() => openModal(item[0])}>重新驳回</Button>
                        }
                        {
                          item[0].reim_status === 'reject' &&
                          <Button type='primary' onClick={() => pass(item[0])}>重新通过</Button>
                        }
                      </Space>
                    </div>
                    <DragSortTable
                      columns={columns}
                      scroll={{x: 'max-content'}}
                      dataSource={item[0].reim_detail_list}
                      pagination={false}
                      rowKey="reim_detail_id"
                      search={false}
                      dragSortKey="sort"
                      onDragSortEnd={
                        (
                          beforeIndex,
                          afterIndex,
                          newDataSource
                        ) => handleDragSortEnd(
                          beforeIndex,
                          afterIndex,
                          newDataSource,
                          item[0]
                        )}
                      options={false}
                    />
                  </div>
                )
              })
            }
          </>
        </Form.Item>

        {
          reim?.reim_list.length > 0 &&
          <>
            <Form.Item label="工人费用" name="worker_price">
              <Input readOnly/>
            </Form.Item>

            <Form.Item label="负责人费用" name="leader_price">
              <Input readOnly/>
            </Form.Item>
          </>
        }

        <Form.Item label="Sub-Total" name="subTotal">
          <Input readOnly/>
        </Form.Item>

        <Form.Item label="完工时间(PDF)" name="completion_at">
          <DatePicker/>
        </Form.Item>

        <Form.Item label="签收单" name="sign">
          <Image.PreviewGroup
            preview={{
              onChange: (current, prev) => console.log(`current index: ${current}, prev index: ${prev}`),
            }}
          >
            {
              signFileList.map((item, index) => (
                <Image width={100} src={item.file_url_enough} style={{marginRight: '10px'}}/>
              ))
            }
          </Image.PreviewGroup>
        </Form.Item>

        <Form.Item label="发票或收据" name="receipt">
          <Image.PreviewGroup
            preview={{
              onChange: (current, prev) => console.log(`current index: ${current}, prev index: ${prev}`),
            }}
          >
            {
              billFileList.map((item, index) => (
                <Image width={100} src={item.file_url_enough} style={{marginRight: '10px'}}/>
              ))
            }
          </Image.PreviewGroup>
        </Form.Item>

        <Form.Item label=' ' colon={false}>
          <Space style={{marginTop: 20}}>
            <Button type="primary" onClick={addReim}>新增报销</Button>
            <Button type="primary" onClick={reloadProfit}>刷新利润率</Button>
          </Space>
        </Form.Item>
      </Form>

      {
        addReimVisible &&
        <CreateReim
          orderId={orderId}
          orderSupplierId={orderSupplierId}
          currentItem={currentItem}
          getData={getData}
        />
      }
      <Modal
        open={showModal}
        onCancel={onCloseModal}
        destroyOnClose={true}
        title="意见"
        footer={null}
      >
        <Opinion
          onCloseModal={onCloseModal}
          itemId={itemId}
        />
      </Modal>

      {
        openPayment &&
        <BaseContainer
          type={ModalType.Drawer}
          open={openPayment}
          title="开票收款"
          destroyOnClose={true}
          maskClosable={false}
          width={800}
          onClose={handleClosePayment}
        >
          <Payment
            handleClosePayment={handleClosePayment}
            orderId={orderId}
            orderSupplierId={orderSupplierId}
            reimDetailList={reimDetailList}
            currentItem={currentItem}
          />
        </BaseContainer>
      }
    </>
  )
}

export default Reim
