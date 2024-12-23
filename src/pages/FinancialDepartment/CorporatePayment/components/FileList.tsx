import React from "react";
import { BaseData } from "@/viewModel/FinancialDepartment/useCorporatePayment"
import UploadFiles from "@/components/UploadFiles";

interface FileListParams {
  baseData: BaseData
}

const FileList: React.FC<FileListParams> = ({
                                baseData
                              }) => {
  const {currentRow, type} = baseData
  return (
    <>
      {
        type === '申请附件' ?
          <UploadFiles
            value={currentRow.file_ids}
            disabled={true}
            fileLength={currentRow.file_ids.length}
          /> :
          <UploadFiles
            value={currentRow.payment_file_ids}
            disabled={true}
            fileLength={currentRow.file_ids.length}
          />
      }
    </>
  )
}

export default FileList
