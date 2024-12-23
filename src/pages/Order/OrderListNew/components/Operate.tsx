import React, { RefObject, useState } from 'react'
import { Typography, Table, Tag, Modal, Drawer } from 'antd'
import Assign from './Assign'
import { ActionType } from '@ant-design/pro-components';
import { getAppoTaskSubmitInfo, getNodeList } from '@/services/ant-design-pro/orderList';
import { isUndefined } from 'lodash';
import WorkerSelect from './WorkerSelect';
import AllReport from './AllReport';

interface ItemListProps {
  currentOrder: any
  workerList: any
  actionRef: RefObject<ActionType>;
}

const Operate: React.FC<ItemListProps> = ({
  currentOrder,
  workerList,
  actionRef,
}) => {

  const [showAssign, setShowAssign] = useState(false)
  const [workerVisible, setWorkerVisible] = useState(false)
  const [workerRepairInfo, setWorkerRepairInfo]: any = useState({})
  const [allVisible, setAllVisible] = useState(false)
  const [completedReports, setCompletedReports]: any = useState()

  const columns: any = [
    {
      title: '报修类型',
      dataIndex: 'ma_type_cn',
    },
    {
      title: '报修时间',
      dataIndex: 'submit_at',
      render: (dom) => {
        return (
          <div style={{ width: 80, textAlign: 'center' }}>
            {dom}
          </div>
        )
      }
    },
    {
      title: '问题描述',
      dataIndex: 'ma_prob_desc',
      render: (dom, entity) => {
        return (
          <div>
            {entity?.details?.ma_prob_desc}
          </div>
        )
      }
    },
    {
      title: '加派施工负责人',
      dataIndex: 'assign',
      render: (dom, entity) => {
        return (
          dom && dom.worker_id &&
          <Tag color='red' style={{ cursor: 'pointer' }} onClick={openAssignModal}>追加指派施工负责人</Tag>
        )
      }
    },
    {
      title: '施工负责人回填信息',
      dataIndex: 'construction',
      render: (dom, entity) => {
        return (
          dom && dom.value &&
          <Tag color={dom?.color} style={{ cursor: 'pointer' }} onClick={() => showPersons(dom.appo_task_id)}>{dom.value}</Tag>
        )
      }
    },
    {
      title: '维修完工报告',
      dataIndex: 'report',
      render: (dom, entity) => {
        return (
          dom && dom.value &&
          <Tag color={dom?.color} style={{ cursor: 'pointer' }}>{dom.value}</Tag>
        )
      }
    },
    {
      title: '完整流程',
      dataIndex: '',
      render: (dom, entity) => {
        return (
          <Tag color='green' style={{ cursor: 'pointer' }} onClick={() => showAll(entity.ma_item_id, entity.construction.appo_task_id)}>查看全部</Tag>
        )
      }
    },
  ]

  const openAssignModal = () => {
    setShowAssign(true)
  }

  const closeAssignModal = () => {
    setShowAssign(false)
  }

  const showPersons = (appo_task_id) => {
    if (isUndefined(appo_task_id)) {
      return
    }
    getAppoTaskSubmitInfo({ appo_task_id }).then(res => {
      setWorkerRepairInfo({})
      if (res.data && res.data.status && res.data.status !== 'appointed') {
        setWorkerVisible(true)
        setWorkerRepairInfo({ ...res.data, appo_task_id })
      }
    })
  }

  const closeWorkerModal = () => {
    setWorkerVisible(false)
  }

  const showAll = (ma_item_id, appo_task_id) => {
    getNodeList({ ma_item_id, appo_task_id }).then(res => {
      if (res.success) {
        setCompletedReports(res.data)
        setAllVisible(true)
      }
    })
  }

  return (
    <>
      <Typography.Title level={3}>操作</Typography.Title>
      <Table
        style={{ marginTop: 30 }}
        columns={columns}
        dataSource={[currentOrder]}
        scroll={{ x: 'max-content' }}
        pagination={false}
      />
      <Modal
        open={showAssign}
        onCancel={closeAssignModal}
        width={600}
        footer={null}
        destroyOnClose={true}
      >
        <Assign
          workerList={workerList}
          actionRef={actionRef}
          closeAssignModal={closeAssignModal}
          currentAssign={currentOrder}
        />
      </Modal>

      <Modal
        open={workerVisible}
        onCancel={closeWorkerModal}
        width={600}
        footer={null}
        destroyOnClose={true}
      >
        <WorkerSelect
          workerRepairInfo={workerRepairInfo}
          closeWorkerModal={closeWorkerModal}
        />
      </Modal>

      <Drawer
        open={allVisible}
        onClose={() => setAllVisible(false)}
        width={600}
        closable={false}
        destroyOnClose={true}
      >
        <AllReport
          completedReports={completedReports}
        />
      </Drawer>
    </>
  )
}

export default Operate