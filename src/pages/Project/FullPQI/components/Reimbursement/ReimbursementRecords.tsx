import React, {useState, useEffect} from 'react';
import {Button, Space, Modal, Table, Drawer, Card, message, Typography,} from 'antd';
import PayoutDetails from './PayoutDetails';
import {delPayment, getFinanceReimInfoBatch} from '@/services/ant-design-pro/project';
import {ExclamationCircleFilled, EyeOutlined} from '@ant-design/icons';
import Annex from './Annex';
import {isEmpty} from "lodash";

interface ItemListProps {
  currentMsg: any
}

const ReimbursementRecords: React.FC<ItemListProps> = ({
                                                         currentMsg,
                                                       }) => {
  const {Text} = Typography;
  const {confirm} = Modal;
  const [reimInfo, setReimInfo] = useState([])
  const [showDetailDrawer, setShowDetailDrawer] = useState(false)
  const [currentItem, setCurrentItem] = useState({})
  const [showAnnex, setShowAnnex] = useState(false)

  const showDeleteConfirm = (item) => {
    confirm({
      title: '提示',
      icon: <ExclamationCircleFilled/>,
      content: '此操作会永久删除该记录，是否继续？',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          const res = await delPayment({payment_id: item?.id})
          if (res?.success) {
            message.success("删除成功")
            await initData()
            return
          }
          message.error(res?.message)
        } catch (err) {
          console.log(err)
        }
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
      title: '审批人',
      dataIndex: 'approver_name_cn',
      align: 'center',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      align: 'center',
      render: (dom, row) => <Text
        style={{width: 50}}
        ellipsis={{tooltip: row.remark}}
      >
        {row.remark}
      </Text>
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
      render: (dom, row) => <Text
        style={{width: 50}}
        ellipsis={{tooltip: row.remark}}
      >
        {row.remark}
      </Text>
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
          <EyeOutlined style={{fontSize: 18}} onClick={() => {
            setCurrentItem(entity)
            setShowAnnex(true)
          }}/>
        )
      }
    },
    {
      title: '操作',
      dataIndex: 'operate',
      align: 'center',
      render: (dom, entity) => (
        <Space>
          <Button
            onClick={() => {
              setShowDetailDrawer(true)
              setCurrentItem(entity)
            }}
            type="primary"
            disabled={entity?.disabled}
          >
            修改
          </Button>

          <Button
            danger
            onClick={() => showDeleteConfirm(entity)}
            disabled={entity?.disabled}
          >
            删除
          </Button>
        </Space>
      )
    },
  ]

  const paymentListColumns: any = [
    {
      title: '金额',
      dataIndex: 'amount',
      align: 'center',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      align: 'center',
      render: (dom, row) => <Text
        style={{width: 50}}
        ellipsis={{tooltip: row.remark}}
      >
        {row.remark}
      </Text>
    },
    {
      title: '打款时间',
      dataIndex: 'pay_at',
      align: 'center',
      // render: (dom, row) => <>{dayjs(row.pay_at).format('YYYY-MM-DD')}</>
    },
    {
      title: '附件',
      dataIndex: 'file_ids',
      align: 'center',
      render: (dom, entity) => {
        return (
          <EyeOutlined style={{fontSize: 18}} onClick={() => {
            setCurrentItem(entity)
            setShowAnnex(true)
          }}/>
        )
      }
    },
  ]

  const handleDrawe = async () => {
    setShowDetailDrawer(false)
    setCurrentItem({})
  }

  const handleCloseAnnex = () => {
    setShowAnnex(false)
    setCurrentItem({})
  }
  const initData = async () => {
    const res = await getFinanceReimInfoBatch({
      trd_id: currentMsg.id,
      trd_type: "pqi_alone_reim"
    })
    if (res.success) {
      setReimInfo(res.data.list)
    }
  }

  useEffect(() => {
    initData().then()
  }, [])

  return (
    <>
      {
        reimInfo.map((item: any, index) => {
          console.log(item?.reim_detail)
          return (
            <Card
              key={index}
              style={{marginBottom: 20}}
              hoverable
            >
              <Table
                columns={reimListColumns}
                dataSource={[item.reim_list]}
                pagination={false}
                title={() => (<div>申请详情</div>)}
              />
              <Table
                columns={reimDetailColumns}
                dataSource={[{...item.reim_detail, disabled: !isEmpty(item.payment_list)}]}
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
          handleDrawe={handleDrawe}
          initData={initData}
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
