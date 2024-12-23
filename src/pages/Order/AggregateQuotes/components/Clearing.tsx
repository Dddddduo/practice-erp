import React, {useEffect, useState} from 'react'
import {getCompanyList, getFinanceCollInfoBatch} from '@/services/ant-design-pro/aggregateQuotes'
import {getWorkerList} from '@/services/ant-design-pro/report'
import {isEmpty} from "lodash";
import {Card, Drawer, message, Table} from "antd";
import {EyeOutlined} from "@ant-design/icons";
import Annex from "@/pages/Project/FullPQI/components/FinalAccount/Annex";


interface ItemListProps {
  handleCloseClearing: () => void
  current
  success: (text: string) => void
  error: (text: string) => void
}

const Clearing: React.FC<ItemListProps> = ({
                                             handleCloseClearing,
                                             current,
                                             success,
                                             error
                                           }) => {

  const [collInfo, setCollInfo] = useState([])
  const [showAnnex, setShowAnnex] = useState(false)
  const [currentData, setCurrentData] = useState({})

  const collListColumns: any = [
    {
      title: '类型',
      dataIndex: "type",
      align: 'center',
      render: (dom, entity) => (
        <div>汇总报价</div>
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
            setShowAnnex(true)
            setCurrentData(entity)
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
            setShowAnnex(true)
            setCurrentData(entity)
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
            setShowAnnex(true)
            setCurrentData(entity)
          }} />
        )
      }
    },
  ]

  const handleCloseAnnex = () => {
    setShowAnnex(false)
    setCurrentData({})
  }

  useEffect(() => {

    if (isEmpty(current)) {
      return;
    }

    const params = {
      trd_id: current?.quo_merge_id ?? 0,
      trd_type: 'from_quo',
    }

    const hide = message.loading('loading...');
    try {
      getFinanceCollInfoBatch(params).then(res => {
        if (!res.success) {
          message.error('获取数据失败');
          return
        }
        setCollInfo(res.data)
        console.log("getFinanceCollInfoBatch", res.data)
      })
    } catch (err) {
      message.error('获取数据异常：' + (err as Error).message);
    } finally {
      hide();
    }

  }, [current])

  return (
    <>
      {
        collInfo.map((item: any, index) => {
          return (
            <Card key={index} style={{ marginBottom: 20 }} bordered={true}>
              <Table
                dataSource={[item.coll_list]}
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
                dataSource={isEmpty(item.invoice_list) ? [] : item.invoice_list}
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
        width={"60%"}
        open={showAnnex}
        onClose={handleCloseAnnex}
        destroyOnClose={true}
        title="附件"
      >
        <Annex
          currentItem={current}
        />
      </Drawer>
    </>
  )
}

export default Clearing
