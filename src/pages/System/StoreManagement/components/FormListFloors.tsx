import BaseFormList from "@/components/FormList"
import { Button, Card, Form, Input, Space } from "antd"
import React, { useEffect } from "react"
import FormListDevice from "./FormListDevice"
import DeleteButton from "@/components/Buttons/DeleteButton"

interface FormListFloorsProps {
  currentItem: any
  restField
  index
  name: number
  remove: (name: number) => void
  add: () => void
  handleOpenUpload: (floor: string, type: string) => void
}

const FormListFloors: React.FC<FormListFloorsProps> = ({
  currentItem,
  handleOpenUpload,
  restField,
  name,
  remove,
  add,
  index
}) => {

  return (
    <Card
      key={`floor-${name}`}
      title={currentItem?.deviceData ? currentItem?.deviceData[name]?.floor_type : ''}
      extra={
        <Space>
          <Button type="primary" onClick={() => {
            handleOpenUpload(currentItem?.deviceData ? currentItem?.deviceData[name]?.floor_type : '', 'upload')
          }}>图片上传</Button>
          <Button onClick={() => {
            handleOpenUpload(currentItem?.deviceData ? currentItem?.deviceData[name]?.floor_type : '', 'show')
          }}>显示图纸</Button>
          <DeleteButton danger onConfirm={() => remove(name)}>删除</DeleteButton>
        </Space>
      }
      style={{ marginBottom: 20 }}
    >
      <BaseFormList
        key="device_type_list"
        listName={[name, "device_type_list"]}
        // addButton={<Button type="dashed" onClick={() => {
        //   console.log(currentItem);

        // }}>添加设备</Button>}
        addStruct={{}}
      >
        <FormListDevice key="device_list" currentItem={currentItem} floorName={name} />
      </BaseFormList>
    </Card>
  )
}

export default FormListFloors