import GkUpload from "@/components/UploadImage/GkUpload"
import React, { useEffect } from "react"


interface ItemListProps {
  currentItem: {
    file_ids: string
  }
}

const Annex: React.FC<ItemListProps> = ({
  currentItem
}) => {

  useEffect(() => {
    console.log(currentItem);

  }, [])

  return (
    <>
      {
        currentItem.file_ids !== "" &&
        <GkUpload />
      }
    </>
  )
}

export default Annex