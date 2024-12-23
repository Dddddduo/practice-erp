import GkUpload from "@/components/UploadImage/GkUpload"
import React, {useEffect} from "react"
import UploadFiles from "@/components/UploadFiles";


interface ItemListProps {
  currentItem: {
    file_ids: string
  }
}

const Annex: React.FC<ItemListProps> = ({
                                          currentItem
                                        }) => {
  return (
    <>
      {
        currentItem.file_ids !== "" &&
        <UploadFiles
          value={currentItem.file_ids}
          disabled={true}
          fileLength={currentItem?.file_ids ? currentItem.file_ids.split(',').length : 0}
        />
      }
    </>
  )
}

export default Annex
