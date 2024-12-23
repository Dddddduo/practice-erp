import React, {RefObject, useEffect, useState} from "react"
import type {ActionType, ParamsType} from "@ant-design/pro-components";
import {Modal, Table} from "antd";
import {getPaymentList} from "@/services/ant-design-pro/financialReimbursement";
import {EyeOutlined} from "@ant-design/icons";
import UploadFiles from "@/components/UploadFiles";

interface ItemListProps {
  actionRef: RefObject<ActionType>;
  success: (text: string) => void
  error: (text: string) => void
  currentItem: {
    id: number
  }
  handleCloseDetail: () => void
}

const Detail: React.FC<ItemListProps> = ({
                                           actionRef,
                                           success,
                                           error,
                                           currentItem,
                                           handleCloseDetail,
                                         }) => {

  const [baseData, setBaseData] = useState([])
  const [file, setFile] = useState('')
  const [openFile, setOpenFile] = useState(false)

  const columns = [
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
      title: '打款时间',
      dataIndex: 'pay_at',
      align: 'center',
    },
    {
      title: '附件',
      dataIndex: 'file_ids',
      align: 'center',
      render: (dom, entity) => (
        <>
          {
            dom ? <EyeOutlined style={{cursor: 'pointer'}} onClick={() => {
              setFile(entity?.file_ids)
              setOpenFile(true)
            }}/> : <></>
          }
        </>
      )
    },
  ]

  useEffect(() => {
    console.log(currentItem);

    getPaymentList({detail_id: currentItem.id}).then(res => {
      if (res.success) {
        setBaseData(res.data)
      }
    })
  }, [])

  return (
    <>
      <Table
        dataSource={baseData}
        columns={columns}
        pagination={false}
      />

      <Modal
        open={openFile}
        width={1000}
        destroyOnClose={true}
        title="附件"
        footer={null}
        onCancel={() => {
          setOpenFile(false)
          setFile('')
        }}
      >
        <UploadFiles
          value={file}
          disabled={true}
          fileLength={file.split(',').length}
        />
      </Modal>
    </>
  )
}

export default Detail
