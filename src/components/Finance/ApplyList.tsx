import React, {FC, useState} from "react";
import {EyeOutlined} from "@ant-design/icons";
import {Button, Card, Drawer, Modal, Table, Tag} from "antd";
import Annex from "@/pages/Project/FullPQI/components/FinalAccount/Annex";

interface ApplyListProps {
  records: {[key: string]: any}
  invoice: React.ReactElement
  handleEditData: (values) => any
  showEdit?: boolean
}


export const ApplyList: FC<ApplyListProps> = ({records, invoice, handleEditData, showEdit = true}) => {
  const [showAnnex, setShowAnnex] = useState(false)
  const [current, setCurrent] = useState({})
  const [showEditModel, setShowEditModel] = useState<any>()

  const collListColumns: any = [
    {
      title: '类型',
      dataIndex: "type",
      align: 'center',
      render: (dom, entity) => (
        <>
          {
            dom === 'pqi_coll' &&
            <div>PQI请款</div>
          }
        </>
      )
    },
    {
      title: '申请人',
      dataIndex: "user_name",
      align: 'center',
    },
    {
      title: '审批人',
      dataIndex: "approver_name",
      align: 'center',
    },
    {
      title: '备注',
      dataIndex: "remark",
      align: 'center',
    },
    {
      title: '请款时间',
      dataIndex: "create_at",
      align: 'center',
    },
  ]

  const collDetailColumns: any = [
    {
      title: "公司",
      dataIndex: "company_name",
      align: "center",
      width: 200,
    },
    {
      title: "税号",
      dataIndex: "tax_no",
      align: "center",
      width: 200,
    },
    {
      title: "地址",
      dataIndex: "address",
      align: "center",
      width: 200,
    },
    {
      title: "手机号",
      dataIndex: "mobile",
      align: "center",
    },
    {
      title: "银行",
      dataIndex: "bank_name",
      align: "center",
      width: 200,
    },
    {
      title: "卡号",
      dataIndex: "bank_no",
      align: "center",
      width: 200,
    },
    {
      title: "金额",
      dataIndex: "amount",
      align: "center",
    },
    {
      title: "备注",
      dataIndex: "remark",
      align: "center",
    },
    {
      title: "请款时间",
      dataIndex: "create_at",
      align: "center",
    },
    {
      title: "附件",
      dataIndex: "",
      align: "center",
      width: 100,
      render: (dom, entity) => {
        return (
          <EyeOutlined style={{fontSize: 18}} onClick={() => {
            setShowAnnex(true)
            setCurrent(entity)
          }}/>
        )
      }
    },
  ]

  const invoiceListColumns: any = [
    {
      title: '发票号',
      dataIndex: "invoice_no",
      align: 'center',
    },
    {
      title: '备注',
      dataIndex: "remark",
      align: 'center',
    },
    {
      title: '开票时间',
      dataIndex: "invoice_at",
      align: 'center',
    },
    {
      title: '附件',
      dataIndex: "file_ids",
      align: 'center',
      render: (dom, entity) => {
        return (
          <EyeOutlined style={{fontSize: 18}} onClick={() => {
            setShowAnnex(true)
            setCurrent(entity)
          }}/>
        )
      }
    },
  ]

  const incomeListColumns: any = [
    {
      title: '公司',
      dataIndex: 'company_cn',
      align: 'center',
    },
    {
      title: '金额',
      dataIndex: 'amount',
      align: 'center',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      align: 'center',
    },
    {
      title: '收款时间',
      dataIndex: 'income_at',
      align: 'center',
    },
    {
      title: '附件',
      dataIndex: 'file_ids',
      align: 'center',
      render: (dom, entity) => {
        return (
          <EyeOutlined style={{fontSize: 18}} onClick={() => {
            setShowAnnex(true)
            setCurrent(entity)
          }}/>
        )
      }
    },
  ]

  // const handleCloseAnnex = () => {
  //   setShowAnnex(false)
  //   setCurrent({})
  // }

  const getStatusTxt = (status: any) => {
    if (status === 'submit') {
      return <Tag color="green">待审核</Tag>
    } else if (status === 'tmp_save') {
      return  <Tag color="blue">待提交</Tag>
    } else if (status === 'reject') {
      return <Tag color="red">已驳回</Tag>
    } else {
      return <Tag color="green">已同意</Tag>
    }
  }

  const handleCloseAnnex = () => {
    setShowAnnex(false)
    setCurrent({})
  }

  const handelClose = () => {
    setShowEditModel(false);
  }

  return (
    <>
      {
        records && records.map((item: any, index) => {
          return (
            <Card key={index} style={{marginBottom: 20}} bordered={true}>
              <div style={{display: "flex", justifyContent: 'space-between', alignItems: 'center'}}>
                {
                  (item?.coll_list?.status === 'submit' || item?.coll_list?.status === 'tmp_save' || item?.coll_list?.status === 'reject') && showEdit ?
                    <Button type="primary"
                            onClick={() => {
                              setShowEditModel(true);
                              handleEditData({
                                ...item?.coll_list,
                                ...item?.coll_detail,
                                id: item?.coll_list?.id,
                                remark: item?.coll_list?.remark,
                                file_ids: item?.coll_detail?.file_ids,
                              });
                            }}
                    >修改</Button> : <br/>
                }
                <div style={{fontSize: 16, fontWeight: 'bold'}}>{getStatusTxt(item?.coll_list?.status)}</div>
              </div>
              <Table
                dataSource={[item.coll_list]}
                columns={collListColumns}
                title={() => (<div>申请详情</div>)}
                scroll={{x: 'max-content'}}
                pagination={false}
              />
              <Table
                dataSource={[item.coll_detail]}
                columns={collDetailColumns}
                title={() => (<div>请款明细</div>)}
                scroll={{x: 'max-content'}}
                pagination={false}
              />
              <Table
                dataSource={item.invoice_list}
                columns={invoiceListColumns}
                title={() => (<div>开票记录</div>)}
                pagination={false}
              />
              <Table
                dataSource={item.income_list}
                columns={incomeListColumns}
                title={() => (<div>收款记录</div>)}
                pagination={false}
              />
            </Card>
          )
        })
      }
      <Drawer
        width={1000}
        open={showAnnex}
        onClose={handleCloseAnnex}
        destroyOnClose={true}
        title="附件"
      >
        <Annex
          currentItem={current}
        />
      </Drawer>

      <Modal
        width={1000}
        open={showEditModel}
        onCancel={handelClose}
        destroyOnClose={true}
        footer={false}
        title="修改开票收款"
      >
        {invoice}
        {/*<ApplyInvoice formInstance={} handleFinish={} dataSource={} onChangeCompany={} />*/}
        {/*<Invoicing*/}
        {/*  currentMsg={currentMsg}*/}
        {/*  currentItem={currentItem}*/}
        {/*  handleCloseInvoicing={handelClose}*/}
        {/*  success={() => {*/}
        {/*  }}*/}
        {/*  error={() => {*/}
        {/*  }}*/}
        {/*  editData={editData}*/}
        {/*/>*/}
      </Modal>
    </>
  );
}
