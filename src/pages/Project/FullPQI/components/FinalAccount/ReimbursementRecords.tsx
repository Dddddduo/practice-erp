import React, { useState, useReducer, useEffect } from 'react';
import { Button, Space, Modal, Table, Drawer, Card, } from 'antd';
import PayoutDetails from './PayoutDetails';
import { delPayment, getFinanceReimInfoBatch } from '@/services/ant-design-pro/project';
import { ExclamationCircleFilled, EyeOutlined } from '@ant-design/icons';
import Annex from './Annex';

interface ItemListProps {
  currentMsg: {
    id: number
  }
  success: (text: string) => void
  error: (text: string) => void
}

const ReimbursementRecords: React.FC<ItemListProps> = ({
  currentMsg,
  success,
  error,
}) => {
  const { confirm } = Modal;
  const [reimInfo, setReimInfo] = useState([])
  const [showDetailDrawer, setShowDetailDrawer] = useState(false)
  const [currentItem, setCurrentItem] = useState({})
  const [showAnnex, setShowAnnex] = useState(false)

  const showDeleteConfirm = () => {
    confirm({
      title: '提示',
      icon: <ExclamationCircleFilled />,
      content: '此操作会永久删除该记录，是否继续？',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        // delPayment({})
        console.log(currentMsg);

        success("删除成功")
      },
    });
  };

  const reimListColumns: any = [
    {
      title: '类型',
      dataIndex: 'type',
      align: 'center',
      render: (dom, entity) => {
        return (
          <>
            {
              dom === 'pqi_alone_reim' &&
              <div>项目部-单独报销</div>
            }
          </>
        )
      }
    },
    {
      title: '申请人',
      dataIndex: 'create_name_cn',
      align: 'center',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      align: 'center',
    },
    {
      title: '报销时间',
      dataIndex: 'update_at',
      align: 'center',
    }
  ]

  const reimDetailColumns: any = [
    {
      title: '类型',
      dataIndex: 'reim_type',
      align: 'center',
    },
    {
      title: '账号',
      dataIndex: 'name_cn',
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
      title: '报销时间',
      dataIndex: 'create_at',
      align: 'center',
    },
    {
      title: '附件',
      dataIndex: 'annex',
      align: 'center',
      render: (dom, entity) => {
        return (
          <EyeOutlined style={{ fontSize: 18 }} onClick={() => {
            setShowAnnex(true)
            setCurrentItem(entity)
          }} />
        )
      }
    },
    {
      title: '操作',
      dataIndex: 'operate',
      align: 'center',
      render: (dom, entity) => (
        <Space>
          <Button onClick={() => {
            setShowDetailDrawer(true)
            setCurrentItem(entity)
          }} type="primary">修改</Button>

          <Button danger onClick={showDeleteConfirm}>删除</Button>
        </Space>
      )
    },
  ]

  const paymentListColumns: any = [
    {
      title: '金额',
      dataIndex: 'avv',
      align: 'center',
    },
    {
      title: '备注',
      dataIndex: 'avv',
      align: 'center',
    },
    {
      title: '打款时间',
      dataIndex: 'avv',
      align: 'center',
    },
    {
      title: '附件',
      dataIndex: 'avv',
      align: 'center',
    },
  ]

  const handleDrawe = () => {
    setShowDetailDrawer(false)
    setCurrentItem({})
  }

  const handleCloseAnnex = () => {
    setShowAnnex(false)
    setCurrentItem({})
  }

  useEffect(() => {
    getFinanceReimInfoBatch({
      trd_id: currentMsg.id,
      trd_type: "pqi_alone_reim"
    }).then(res => {
      if (res.success) {
        setReimInfo(res.data.list)
      }
    })
  }, [])

  return (
    <>
      {
        reimInfo.map((item: any, index) => {
          return (
            <Card key={index} style={{ marginBottom: 20 }} bordered={true}>
              <Table
                columns={reimListColumns}
                dataSource={[item.reim_list]}
                pagination={false}
                title={() => (<div>申请详情</div>)}
              />
              <Table
                columns={reimDetailColumns}
                dataSource={[item.reim_detail]}
                pagination={false}
                title={() => (<div>收款明细</div>)}
              />
              <Table
                columns={paymentListColumns}
                dataSource={item.payment_list}
                pagination={false}
                title={() => (<div>打款记录</div>)}
              />
            </Card>
          )
        })
      }

      <Drawer
        width={1000}
        open={showDetailDrawer}
        onClose={handleDrawe}
        destroyOnClose={true}
      >
        <PayoutDetails
          currentItem={currentItem}
        />
      </Drawer>

      <Drawer
        width={1000}
        open={showAnnex}
        onClose={handleCloseAnnex}
        destroyOnClose={true}
        title="附件"
      >
        <Annex
          currentItem={currentItem}
        />
      </Drawer>
    </>
  )
}
export default ReimbursementRecords
