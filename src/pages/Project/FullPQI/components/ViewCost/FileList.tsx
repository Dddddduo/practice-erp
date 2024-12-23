import React from "react";
import UploadFiles from "@/components/UploadFiles";

interface FileListParams {
  currentItem: any
}

const FileList: React.FC<FileListParams> = ({
                                              currentItem,
                                            }) => {
  console.log(currentItem)
  return (
    <UploadFiles
      value={currentItem?.payment_file_ids}
      disabled={true}
      fileLength={currentItem?.payment_file_ids?.split(',')?.length}
    />
  )
}

export default FileList
