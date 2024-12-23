import React, { useState, useEffect } from "react";
import { getStoreFloorImgList, getDeviceTemplateInfo, getDeviceInfo, createOrUpdateDevice, getReportList } from "@/services/ant-design-pro/system"
import { Form, Button, Space, Card, Select, Modal, Input, Image, QRCode } from 'antd';
import { differenceBy, isEmpty } from 'lodash'
import { PlusOutlined, QrcodeOutlined } from "@ant-design/icons";
import { getFileUrlListByIds } from "@/services/ant-design-pro/api";
import SubmitButton from "@/components/Buttons/SubmitButton";
import MarkImage from "./MarkImage";
import UploadFiles from "@/components/UploadFiles";
import { allowFileTypes } from "@/components/UploadFiles";
import { produce } from "immer";

interface ItemListProps {
  actionRef: any,
  success: (text: string) => void
  error: (text: string) => void
  currentItem: any
  handleCloseDevice: (type) => void
}

const DeviceManagement: React.FC<ItemListProps> = ({
  actionRef,
  success,
  error,
  currentItem,
  handleCloseDevice
}) => {
  const [initDevice, setInitDevice] = useState<{
    floor_type: string,
    device_type_list: [],
  }>({
    floor_type: '',
    device_type_list: []
  })

  const [form] = Form.useForm()
  const [storeFloor, setStoreFloor] = useState<any>([])
  const [floorImg, setFloorImg] = useState<any>({})
  const [currentImgId, setCurrentImgId] = useState([])
  const [currentImg, setCurrentImg] = useState([])
  const [deviceList, setDeviceList] = useState([])
  const [currentIndex, setCurrentIndex] = useState<string>('')
  const [allFloor, setAllFloor] = useState([])
  const [floorList, setFloorList] = useState([])
  const [addFloor, setAddFloor] = useState(false)
  const [floor, setFloor] = useState('')
  // const [deviceInfo, setDeviceInfo] = useState({})
  const [showUpload, setShowUpload] = useState(false)
  const [showImg, setShowImg] = useState(false)
  const [showCode, setShowCode] = useState(false)
  const [code, setCode] = useState('')
  const [reportList, setReportList] = useState([])
  const [reportId, setReportId] = useState()
  const [cell, setCell] = useState([])
  const [deviceNameList, setDeviceNameList] = useState<{ device_name: string }[]>([])

  const handleFinish = (values) => {
    let floorImgList = {}
    if (!isEmpty(floorImg)) {
      Object.keys(floorImg).map(item => {
        floorImgList[item] = floorImg[item].floor_img
      })
    }
    let device_list = {}
    values.floors.map(item => {
      device_list[item.floor_type] = {}
      item.device_type_list.map(device => {
        device_list[item.floor_type][device.device_type] = device.device_list ? device.device_list : []
      })
    })

    const params = {
      store_id: currentItem.id,
      report_id: reportId,
      floor_img_map: floorImgList,
      device_list: device_list
    }
    createOrUpdateDevice(params).then(res => {
      if (res.success) {
        handleCloseDevice('create')
        success('操作成功')
        actionRef.current.reload()
        return
      }
      error(res.message)
    })
  }

  const handleAddCell = (node) => {
    setCell(node)
  }

  const handleShowAddFloor = () => {
    setAddFloor(true)
    const formatFloor = differenceBy(allFloor, storeFloor, 'value')
    setFloorList(formatFloor)
  }

  const handleCloseAddFloor = () => {
    setAddFloor(false)
  }

  const handleOK = () => {
    let data = form.getFieldValue('floors')
    data.push({
      floor_type: floor,
      device_type_list: initDevice.device_type_list
    })
    setFloorImg(pre => {
      return {
        ...pre,
        [floor]: {
          floor_img: '',
          floor_img_original: '',
        }
      }
    })
    form.setFieldsValue({
      floors: data
    })
    setAddFloor(false)
  }

  const handleDelFloor = (item) => {
    let data = form.getFieldValue('floors')
    data = data.filter((floor, index) => item !== index)
    form.setFieldsValue({
      floors: data
    })
  }

  const handleUpload = (index: string) => {
    setCurrentIndex(index)
    setShowUpload(true)
    if (isEmpty(floorImg)) {
      return
    }
    let imgObj: any = Object.values(floorImg)[index]
    if (!imgObj?.floor_img) {
      setCurrentImgId(
        produce((draft) => {
          draft[index] = ''
        })
      )
      return
    }
    if (currentImg[index]) {
      return
    }
    setCurrentImgId(
      produce((draft) => {
        draft[index] = imgObj?.floor_img
      })
    )
  }

  const handleChangeUpload = (e) => {
    setCurrentImgId(
      produce((draft) => {
        draft[currentIndex] = e
      })
    )
    getFileUrlListByIds({ file_ids: e }).then(res => {
      if (res.success) {
        setCurrentImg(
          produce((draft) => {
            draft[currentIndex] = res.data[0].url
          })
        )
      }
    })
  }

  const handleImg = (index: string) => {
    setCurrentIndex(index)
    let device_list = {}
    form.getFieldValue('floors').map(item => {
      device_list[item.floor_type] = {}
      item.device_type_list.map(device => {
        device_list[item.floor_type][device.device_type] = device.device_list ? device.device_list : []
      })
    })
    let device_name_list: { device_name: string }[] = []
    deviceList?.map(device => {
      // console.log('------------>', floorImg, Object.keys(floorImg)[index], device_list[Object.keys(floorImg)[index]]);
      if (device_list[Object.keys(floorImg)[index]][device]) {
        device_list[Object.keys(floorImg)[index]][device].map(item => {
          device_name_list.push(item)
        });
      }
    })
    setDeviceNameList(device_name_list)

    setShowImg(true)
    if (isEmpty(floorImg)) {
      return
    }
    let imgObj: any = Object.values(floorImg)[index]
    if (currentImg[index]) {
      return
    }
    if (imgObj?.floor_img_original === '') {
      setCurrentImg(
        produce((draft) => {
          draft[index] = ''
        })
      )
      return
    }

    setCurrentImg(
      produce((draft) => {
        draft[index] = imgObj?.floor_img_original
      })
    )
    setFloor(Object.keys(floorImg)[index])
  }

  const handleDeleteDevice = (floor, device) => {
    form.getFieldValue('floors')[floor].device_type_list[device].device_list.map((item, index) => {
      let nameList = item.device_name.split('-')
      item.device_name = `${nameList[0]}-${nameList[1]}-${index + 1}`
      return item
    })
  }

  useEffect(() => {
    const init = async () => {
      let init_device_type_list: any = {
        floor_type: "",
        device_type_list: [],
      }
      let data: any = []
      const StoreFloorImgLisResult = await getStoreFloorImgList({ store_id: currentItem.id })
      const DeviceTemplateInfoResult = await getDeviceTemplateInfo()
      const DeviceInfoResult = await getDeviceInfo({ store_id: currentItem.id, report_id: reportId })
      if (DeviceInfoResult.success && DeviceTemplateInfoResult.success) {
        setStoreFloor(Object.keys(StoreFloorImgLisResult.data).map(item => {
          return {
            value: item,
            label: item
          }
        }))
        setFloorImg(StoreFloorImgLisResult.data)
        setDeviceList(DeviceTemplateInfoResult.data.device_type_list)
        setAllFloor(DeviceTemplateInfoResult.data.floor_list.map(item => {
          return {
            value: item,
            label: item
          }
        }))

        // setDeviceInfo(DeviceInfoResult.data)
        Object.keys(DeviceInfoResult.data).map((floor, index) => {
          let floor_tmp: any = {
            floor_type: floor,
            device_type_list: []
          }

          DeviceTemplateInfoResult.data.device_type_list.map(device => {
            let device_tmp = {
              device_type: device,
              device_list: DeviceInfoResult.data[floor][device]
            }
            floor_tmp.device_type_list.push(device_tmp)
            // data[index][device] = isEmpty(DeviceInfoResult.data[floor][device]) ? [] : DeviceInfoResult.data[floor][device]
          })

          data.push(floor_tmp)
        })

        DeviceTemplateInfoResult.data.device_type_list.map(device => {
          init_device_type_list.device_type_list.push({
            device_type: device,
            device_list: []
          })
        })
      }
      setInitDevice(init_device_type_list)
      // setDeviceManagement(data)
      form.setFieldsValue({
        floors: data
      })
    }
    init()
  }, [reportId])

  useEffect(() => {
    getReportList({ store_id: currentItem.id }).then(res => {
      if (res.success) {
        setReportList(res.data.list.map(item => {
          return {
            value: item.id,
            label: item.report_no
          }
        }))
      }
    })
  }, [])

  return (
    <>
      <Form
        form={form}
        // labelCol={{ span: 4 }}
        // wrapperCol={{ span: 16 }}
        style={{ maxWidth: 800 }}
        onFinish={handleFinish}
      >
        <Form.Item>
          <Select
            placeholder="请选择报告编号"
            options={reportList}
            style={{ width: 200 }}
            onChange={e => setReportId(e)}
            showSearch
            filterOption={(input, option: any) => (option?.label ?? '').includes(input)}
          />
        </Form.Item>
        <Form.List name="floors">
          {(floorFields, floorOperations) => (
            <>
              {floorFields.map(({ key, name, ...restField }, index) => (
                <Card
                  key={`floor-${name}`}
                  title={form.getFieldValue(['floors', name, 'floor_type']) || 'Floor Type'}
                  extra={
                    <Space>
                      <Button type="primary" onClick={() => handleUpload(name)}>图片上传</Button>
                      <Button onClick={() => handleImg(name)}>显示图纸</Button>
                      <Button danger onClick={() => handleDelFloor(name)}>删除</Button>
                    </Space>
                  }
                  style={{ marginBottom: 20 }}
                >
                  <Form.List name={[name, 'device_type_list']}>
                    {(deviceTypeFields, deviceTypeOperations) => (
                      <>
                        {deviceTypeFields.map((deviceTypeField, deviceTypeIndex) => (
                          <div key={`device-${deviceTypeIndex}`}>
                            <Form.Item
                              {...deviceTypeField}
                              name={[deviceTypeField.name, 'device_type']}
                              label="设备类型"
                              noStyle
                              fieldKey={[deviceTypeIndex, 'device_type']}
                            >
                              <Input placeholder="请输入设备类型" variant='borderless' readOnly style={{ fontSize: 20 }} />
                            </Form.Item>

                            <Form.List name={[deviceTypeField.name, 'device_list']}>
                              {(deviceFields, { add: addDevice, remove: removeDevice }) => (
                                <div style={{ display: 'flex', flexDirection: 'column', rowGap: 16 }}>
                                  <Button
                                    type="primary"
                                    onClick={() => {
                                      const floor = form.getFieldValue(['floors', name, 'floor_type'])
                                      const device = form.getFieldValue(['floors', name, 'device_type_list', deviceTypeField.name, 'device_type'])
                                      const number = deviceFields[deviceFields.length - 1] ? deviceFields[deviceFields.length - 1].name + 2 : 1
                                      addDevice({
                                        device_name: `${device}-${floor}-${number}`,
                                        remark: ''
                                      })
                                    }}
                                    icon={<PlusOutlined />}
                                    style={{ width: 200, marginBottom: 20 }}
                                  >
                                    添加设备
                                  </Button>
                                  {deviceFields.map((field, deviceIndex) => (
                                    <Space key={deviceIndex} style={{ position: 'relative' }}>
                                      <Form.Item
                                        // {...field}
                                        name={[field.name, 'device_name']}
                                        label="设备名称"
                                        fieldKey={[deviceIndex, 'device_name']}
                                      >
                                        <Input placeholder="请输入设备名称" />
                                      </Form.Item>
                                      <Form.Item
                                        // {...field}
                                        name={[field.name, 'remark']}
                                        label="备注"
                                        fieldKey={[deviceIndex, 'remark']}
                                      >
                                        <Input placeholder="请输入备注" />
                                      </Form.Item>

                                      <Form.Item
                                        // {...field}
                                        name={[field.name, 'device_code']}
                                        label=" "
                                        colon={false}
                                        fieldKey={[deviceIndex, 'device_code']}
                                      >
                                        {
                                          form.getFieldValue(['floors', name, 'device_type_list', deviceTypeIndex, 'device_list', deviceIndex, 'device_code']) &&
                                          <QrcodeOutlined
                                            style={{ fontSize: 20, cursor: 'pointer' }}
                                            onClick={() => {
                                              setShowCode(true)
                                              setCode(form.getFieldValue(['floors', name, 'device_type_list', deviceTypeIndex, 'device_list', deviceIndex, 'device_code']))
                                            }}
                                          />
                                        }
                                      </Form.Item>

                                      <Button
                                        danger
                                        onClick={() => {
                                          removeDevice(deviceIndex)
                                          handleDeleteDevice(name, deviceTypeField.name)
                                        }}
                                        style={{ position: 'absolute', top: 0, right: 0 }}
                                      >
                                        删除
                                      </Button>
                                    </Space>
                                  ))}
                                </div>
                              )}
                            </Form.List>
                          </div>
                        ))}
                      </>
                    )}
                  </Form.List>
                </Card>
              ))}
              <Button
                type="primary"
                block
                style={{ marginTop: 20 }}
                onClick={handleShowAddFloor}>
                添加
              </Button>
            </>
          )}
        </Form.List>

        <Form.Item style={{ marginTop: 30 }}>
          <Space>
            <SubmitButton type="primary" form={form}>提交</SubmitButton>
            <Button danger onClick={() => handleCloseDevice('')}>取消</Button>
          </Space>
        </Form.Item>
      </Form >

      <Modal
        open={addFloor}
        onCancel={handleCloseAddFloor}
        title="选择楼层"
        onOk={handleOK}
        destroyOnClose={true}
      >
        <Select style={{ width: 200 }} options={floorList} placeholder="请选择楼层" onChange={(e) => setFloor(e)} />
      </Modal>

      <Modal
        open={showUpload}
        onCancel={() => setShowUpload(false)}
        title="上传图片"
        onOk={() => setShowUpload(false)}
        destroyOnClose={true}
      >
        <UploadFiles allowedTypes={allowFileTypes.images} showDownloadIcon value={currentImgId[currentIndex]} fileLength={1} onChange={handleChangeUpload} />
      </Modal>

      <Modal
        open={showImg}
        onCancel={() => setShowImg(false)}
        title={<h3>图纸-{floor}</h3>}
        onOk={() => setShowImg(false)}
        destroyOnClose={true}
        width={1000}
        style={{ top: '5%' }}
      >
        <MarkImage
          currentImg={currentImg}
          handleAddCell={handleAddCell}
          deviceNameList={deviceNameList}
          currentIndex={currentIndex}
        />
      </Modal>

      <Modal
        open={showCode}
        footer={null}
        onCancel={() => setShowCode(false)}
        destroyOnClose={true}
      >
        <QRCode value={code} size={400} />
      </Modal>
    </>
  )
}

export default DeviceManagement