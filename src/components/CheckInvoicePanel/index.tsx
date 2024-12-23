import React, {useEffect, useState} from "react";
import {Divider, Modal, Space} from "antd";

interface Props {
  open: any
  errorData: any,
  handleOk: () => void,
  handleCancel: () => void,
}

const CheckInvoicePanel: React.FC<Props> = ({open, errorData, handleOk, handleCancel}) => {

  return (
    <>
      <Modal
        open={open}
        title={'反馈信息'}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Space align={'start'}>
          <div style={{ minWidth: 200 }}>
            <div style={{ fontWeight: 'bold' }}>申请信息</div>
            {
              errorData?.apply?.map((item) => (
                <div key={item} style={{  color: item?.e ? '#f50' : undefined, marginBottom: 6 }}>
                  {item?.k}: {item?.v}
                </div>
              ))
            }
          </div>

          <Divider type={'vertical'} style={{ height: 250 }} />

          <div style={{ minWidth: 200 }}>
            <div style={{ fontWeight: 'bold' }}>录入信息</div>
            {
              errorData?.enter?.map((item) => (
                <div key={item} style={{  color: item?.e ? '#f50' : undefined, marginBottom: 6 }}>
                  {item?.k}: {item?.v}
                </div>
              ))
            }
          </div>
        </Space>
      </Modal>
    </>
  )

}

export  default  CheckInvoicePanel
