import React, { useState, useEffect } from 'react';
import {EyeOutlined} from "@ant-design/icons";
import {Card, message, Table} from "antd";
import {getFinanceCollInfoBatch} from "@/services/ant-design-pro/aggregateQuotes";

interface PaymentRequestRecordProps {
  currentItem: any
}

const PaymentRequestRecord: React.FC<PaymentRequestRecordProps> = () => {

  const [collInfo, setCollInfo] = useState([])

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
          <EyeOutlined style={{ fontSize: 18 }} onClick={() => {
            // setShowAnnex(true)
            // setCurrent(entity)
          }} />
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
          <EyeOutlined style={{ fontSize: 18 }} onClick={() => {
            // setShowAnnex(true)
            // setCurrent(entity)
          }} />
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
          <EyeOutlined style={{ fontSize: 18 }} onClick={() => {
            // setShowAnnex(true)
            // setCurrent(entity)
          }} />
        )
      }
    },
  ]

  useEffect(() => {
    const params = {
      // trd_id: currentMsg.id,
      // trd_sub_id: currentItem.id,
      // trd_type: "pqi_coll",
    }

    const loadData = async () => {
      const hide = message.loading('loading');
      try {
        const result =  await getFinanceCollInfoBatch(params);
        if (result.success) {
          setCollInfo(result.data)
          return
        }

        message.error("Loading error.");
      } catch (err) {
        message.error("Loading error: " + (err as Error).message);
      } finally {
        hide();
      }
    }

    loadData().catch(console.log)

    // const result = await getFinanceCollInfoBatch
    // getFinanceCollInfoBatch(params).then(res => {
    //   if (res.success) {
    //     setCollInfo(res.data)
    //   }
    // })
  }, [])

  return (
    <>
      {
        collInfo.map((item: any, index) => {
          return (
            <Card key={index} style={{ marginBottom: 20 }} bordered={true}>
              <Table
                dataSource={[]}
                columns={collListColumns}
                title={() => (<div>申请详情</div>)}
                scroll={{ x: 'max-content' }}
                pagination={false}
              />
              <Table
                dataSource={[item.coll_detail]}
                columns={collDetailColumns}
                title={() => (<div>请款明细</div>)}
                scroll={{ x: 'max-content' }}
                pagination={false}
              />
              <Table
                dataSource={[]}
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
    </>
  )
}
export default PaymentRequestRecord
