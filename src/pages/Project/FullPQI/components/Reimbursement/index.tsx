import CaptureRecords from "./CaptureRecords"
import Invoicing from "./Invoicing"
import PaymentEntry from "./PaymentEntry"
import ReimbursementRecords from "./ReimbursementRecords"
import { Divider } from 'antd'
import {useEffect} from "react";

interface ItemListProps {
  actionRef,
  success: (text: string) => void,
  error: (text: string) => void
  handleClose
  currentMsg
  type: string
  currentItem: {
    id: number
  }
  handleCloseInvoicing: () => void
  handlereimbursement: () => void
}


const Reimbursement: React.FC<ItemListProps> = ({
                                                  handleClose,
                                                  currentMsg,
                                                  actionRef,
                                                  success,
                                                  error,
                                                  type,
                                                  currentItem,
                                                  handleCloseInvoicing,
                                                  handlereimbursement
                                                }) => {

  useEffect(() => {

  }, []);
  return (
    <>
      {
        type === 'reimbursement' &&
        <>
          <PaymentEntry
            handleClose={handleClose}
            currentItem={currentMsg}
            actionRef={actionRef}
            success={success}
            error={error}
            handlereimbursement={handlereimbursement}
          />

          <Divider orientation="left">报销记录</Divider>

          <ReimbursementRecords
            handleClose={handleClose}
            currentMsg={currentMsg}
            actionRef={actionRef}
            success={success}
            error={error}
          />
        </>
      }
      {
        type === 'invoicing' &&
        <>
          <Invoicing
            currentMsg={currentMsg}
            currentItem={currentItem}
            handleCloseInvoicing={handleCloseInvoicing}
          />

          <Divider orientation="left">请款记录</Divider>

          <CaptureRecords
            currentMsg={currentMsg}
            currentItem={currentItem}
          />
        </>
      }
    </>

  )
}

export default Reimbursement
