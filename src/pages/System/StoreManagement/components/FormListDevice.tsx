import DeleteButton from "@/components/Buttons/DeleteButton"
import BaseFormList from "@/components/FormList"
import { QrcodeOutlined } from "@ant-design/icons"
import { Button, Divider, Form, Input, Modal, QRCode, Space } from "antd"
import { useEffect, useState } from "react"
import DeviceDetail from "@/pages/System/StoreManagement/components/DeviceDetail";

const FormListItem: React.FC<any> = ({ currentItem, floorName, deviceName, restField, name, remove, add, index }) => {
  const [showCode, setShowCode] = useState(false)
  const [code, setCode] = useState('')
  const [showDetail, setShowDetail] = useState<boolean>(false)
  const [deviceItem, setDeviceItem] = useState<object>({})
  const editDevice = (currentItem: any) => {
    console.log('ccccccc', currentItem)
    setShowDetail(true)
    setDeviceItem(currentItem)
  }

  return (
    <>
      <Space key={index} style={{ width: '100%', position: 'relative' }}>
        <Form.Item
          {...restField}
          name={[name, 'device_name']}
          label="设备名称"
          fieldKey={[index, 'device_name']}
        >
          <Input placeholder="请输入设备名称" />
        </Form.Item>
        <Form.Item
          {...restField}
          name={[name, 'remark']}
          label="备注"
          fieldKey={[index, 'remark']}
        >
          <Input placeholder="请输入备注" />
        </Form.Item>

        <Form.Item
          {...restField}
          name={[name, 'device_code']}
          label=" "
          colon={false}
        >
          {
            (
              currentItem?.deviceData &&
              currentItem?.deviceData[floorName]?.device_type_list &&
              currentItem?.deviceData[floorName]?.device_type_list[deviceName]?.device_list &&
              currentItem?.deviceData[floorName]?.device_type_list[deviceName]?.device_list[name]?.device_code
            ) &&
            <QrcodeOutlined
              style={{ fontSize: 20, cursor: 'pointer' }}
              onClick={() => {
                setShowCode(true)
                setCode(currentItem?.deviceData[floorName]?.device_type_list[deviceName]?.device_list[name]?.device_code)
              }}
            />
          }
        </Form.Item>

        {
          currentItem && currentItem?.deviceData[floorName] && currentItem?.deviceData[floorName]?.device_type_list[deviceName] &&
          currentItem?.deviceData[floorName]?.device_type_list[deviceName]?.device_list[name] &&
          currentItem?.deviceData[floorName]?.device_type_list[deviceName]?.device_list[name]['id']
          && <Form.Item>
            <Button type="primary" onClick={() => editDevice(currentItem?.deviceData[floorName]?.device_type_list[deviceName]?.device_list[name])}>编辑设备</Button>
          </Form.Item>
        }

        <DeleteButton
          danger
          onConfirm={() => {
            remove(index)
          }}
          style={{ position: 'absolute', top: 0, right: 0 }}
        >
          删除
        </DeleteButton>
      </Space>

      <Modal
        open={showCode}
        footer={null}
        onCancel={() => setShowCode(false)}
        destroyOnClose={true}
      >
        <QRCode value={code} size={400} />
      </Modal>
      <Modal
        open={showDetail}
        footer={null}
        onCancel={() => setShowDetail(false)}
        destroyOnClose={true}
      >
        <DeviceDetail deviceItem={deviceItem} />
      </Modal>
    </>
  )
}

interface FormListDeviceProps {
  currentItem: any
  floorName: string
  restField
  index
  name: string
  remove: (name: number) => void
  add: () => void
}

const FormListDevice: React.FC<FormListDeviceProps> = ({
  currentItem,
  restField,
  index,
  name,
  remove,
  add,
  floorName
}) => {

  return (
    <>
      <Form.Item
        {...restField}
        name={[name, 'device_type']}
        label="设备类型"
        noStyle
      >
        <Input placeholder="请输入设备类型" variant='borderless' readOnly style={{ fontSize: 20 }} />
      </Form.Item>

      <BaseFormList
        key="device_list"
        listName={[name, "device_list"]}
        addButton={<Button type="link">添加设备</Button>}
        addStruct={{
          device_name: '',
          remark: '',
          device_code: '',
        }}
        disableRemoveLast={false}
      >
        <FormListItem key="device_list" currentItem={currentItem} floorName={floorName} deviceName={name} />
      </BaseFormList>
      <Divider />
    </>
  )
}

export default FormListDevice
