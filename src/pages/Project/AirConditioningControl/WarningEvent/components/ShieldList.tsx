import React, { useEffect, useState } from "react"
import { Button, Space, Table, Modal } from "antd"
import { indexShield, removeShield } from "@/services/ant-design-pro/project"
import { ExclamationCircleFilled } from "@ant-design/icons"

interface ItemListProps {
  success: (text: string) => void
  error: (text: string) => void
}

const ShieldList: React.FC<ItemListProps> = ({
  success,
  error,
}) => {
  const { confirm } = Modal;
  const [current, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [shield, setShield] = useState([])

  const init = () => {
    indexShield().then(res => {
      if (res.success) {
        const response = res.data.data.map(item => {
          return {
            ...item,
            key: item.id
          }
        })
        setShield(response)
        return
      }
      error(res.message)
    })
  }

  const showDeleteConfirm = (id: number) => {
    confirm({
      title: '提示',
      icon: <ExclamationCircleFilled />,
      content: '确定要解除此屏蔽词吗？',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        removeShield(id).then(res => {
          if (res.success) {
            success('解除成功')
            init()
            return
          }
          error(res.message)
        })
      },
    });
  };

  const columns: any = [
    {
      title: 'ID',
      dataIndex: "id",
      align: 'center',
    },
    {
      title: '故障',
      dataIndex: "keyword",
      align: 'center',
    },
    {
      title: '操作人',
      dataIndex: "user_name",
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: "",
      align: 'center',
      render: (dom, entity) => (
        <Space>
          <Button type="primary" onClick={() => showDeleteConfirm(entity.id)}>解除</Button>
        </Space>
      )
    },
  ]

  useEffect(() => {
    init()
  }, [])

  return (
    <Table
      dataSource={shield}
      columns={columns}
    />
  )
}

export default ShieldList