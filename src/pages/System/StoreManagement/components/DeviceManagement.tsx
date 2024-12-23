import BaseContainer, { ModalType } from "@/components/Container"
import BaseFormList from "@/components/FormList"
import { Button, Form, Modal, Select, Space, message } from "antd"
import React, { useEffect, useState } from "react"
import FormListFloors from "./FormListFloors"
import { getDeviceInfo, getDeviceTemplateInfo, getReportList, getStoreFloorImgList, createOrUpdateDevice } from "@/services/ant-design-pro/system"
import { produce } from "immer"
import { cloneDeep, differenceBy, forEach, isEmpty } from "lodash"
import SubmitButton from "@/components/Buttons/SubmitButton"
import UploadFiles, { allowFileTypes } from "@/components/UploadFiles"
import { getFileUrlListByIds } from "@/services/ant-design-pro/api"
import MarkImage from "./MarkImage"


interface DeviceManagementProps {
  visible: boolean
  onValueChange: (path: string, value: any) => void
  currentItem
  onClose: (text: string) => void
  actionRef: any
}

const initData = {
  currentItem: {},
  reportId: '',
  floor: '',
  initDevice: [],
  allFloor: [],
  storeFloor: [],
  floorImg: {},
  curFloorImg: {},
  device_list: [],
  cell: [],
  cellList: {},
  imageWidth: 0,
  imageHeight: 0,
}

const options = {
  reportList: [],
  floorList: []
}

const DeviceManagement: React.FC<DeviceManagementProps> = ({
  visible,
  onValueChange,
  currentItem,
  onClose,
  actionRef
}) => {
  const [form] = Form.useForm()

  const [baseData, setBaseData] = useState<any>({})
  const [selectData, setSelectData] = useState<any>({})

  const [open, setOpen] = useState({
    addFloor: false,
    uploadFile: false,
    showImg: false
  })

  const transformJson = (initialJson) => {
    const transformedJson = {};
    let allCell: any = []

    if (!isEmpty(baseData.cellList)) {
      forEach(baseData.cellList, (item) => {
        allCell.push(...item)
      })
    }

    initialJson.forEach(floorData => {
      const floorType = floorData.floor_type;
      transformedJson[floorType] = {};

      floorData.device_type_list.forEach(deviceTypeData => {
        const deviceType = deviceTypeData.device_type;
        if (!isEmpty(deviceTypeData.device_list)) {
          let newData = cloneDeep(deviceTypeData?.device_list)
          const formatData = newData?.map(dev => {
            allCell?.forEach((item) => {
              if ((dev.device_name === item.attrs?.label?.text) || (dev.device_name === item.attrs?.text?.text)) {
                dev.device_location = {
                  im_w: baseData.imageWidth,
                  im_h: baseData.imageHeight,
                  location_x: item.position.x,
                  location_y: item.position.y,
                }
              }
            })
            return dev
          })
          transformedJson[floorType][deviceType] = formatData
        }
      });
    });

    return transformedJson;
  }

  const handleFinish = (values) => {
    let floorImgList = {}
    if (!isEmpty(baseData.floorImg)) {
      Object.keys(baseData.floorImg).map(item => {
        floorImgList[item] = baseData.floorImg[item].floor_img
      })
    }
    let newJson = transformJson(values.deviceData)
    const params = {
      store_id: currentItem.id,
      report_id: baseData.reportId,
      floor_img_map: floorImgList,
      device_list: newJson
    }
    createOrUpdateDevice(params).then(res => {
      if (res.success) {
        onClose('create')
        message.success('操作成功')
        actionRef.current.reload()
        return
      }
      message.error(res.message)
    })
  }

  const handleShowAddFloor = () => {
    setOpen(
      produce((draft) => {
        draft.addFloor = true
      })
    )

    const formatFloor = differenceBy(baseData?.allFloor, baseData?.currentItem?.deviceData?.map(item => {
      return {
        value: item.floor_type,
        label: item.floor_type
      }
    }), 'value')

    setSelectData(
      produce((draft: any) => {
        draft.floorList = formatFloor
      })
    )
  }

  const handleOK = () => {
    // onValueChange('deviceData', [
    //   ...baseData.currentItem.deviceData,
    //   {
    //     floor_type: baseData.floor,
    //     device_type_list: baseData.initDevice.device_type_list
    //   }
    // ])
    if (!baseData.floor) {
      message.error('请选择楼层')
      return
    }
    setBaseData(
      produce((draft: any) => {
        draft.currentItem.deviceData.push({
          floor_type: baseData.floor,
          device_type_list: baseData.initDevice.device_type_list
        })
        isEmpty(draft.floorImg[baseData?.floor]) ? draft.floorImg[baseData?.floor] = {} : null
        draft.floorImg[baseData?.floor]['floor_img'] = ''
        draft.floorImg[baseData?.floor]['floor_img_original'] = ''
        draft.floor = ''
      })
    )
    form.setFieldsValue({
      deviceData: [
        ...baseData.currentItem.deviceData,
        {
          floor_type: baseData.floor,
          device_type_list: baseData.initDevice.device_type_list
        }
      ]
    })
    setOpen(
      produce((draft) => {
        draft.addFloor = false
      })
    )
  }

  const url2Base64 = (url, type = 'image/jpeg') => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      const canvas = document.createElement('canvas');
      img.crossOrigin = '*';
      img.onload = function () {
        const width = img.width, height = img.height;
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, width, height);
        const base64 = canvas.toDataURL(type);
        resolve(base64);
      };
      img.onerror = function () {
        reject(new Error('message'));
      };
      img.src = url;
    });
  }

  const handleOpenUpload = (floor: string, type: string) => {
    const file = baseData.floorImg[floor]
    if (type === 'upload') {
      setOpen(
        produce((draft) => {
          draft.uploadFile = true
        })
      )
    } else {
      const device = baseData.currentItem.deviceData?.find((item) => item.floor_type === floor).device_type_list
      let deviceList: any = []
      device?.map(item => {
        if (item.device_list) {
          item.device_list.map(device => {
            deviceList.push(device)
          })
        }
      })
      setBaseData(
        produce((draft: any) => {
          draft.device_list = deviceList
        })
      )
      setOpen(
        produce((draft) => {
          draft.showImg = true
        })
      )
    }

    setBaseData(
      produce((draft: any) => {
        draft.floor = floor
      })
    )
    if (baseData.curFloorImg[floor] && baseData.curFloorImg[floor].id) {
      return
    }
    if (file) {
      // const baseUrl = await url2Base64(file.floor_img_original)
      setBaseData(
        produce((draft: any) => {
          draft.curFloorImg[floor] = {
            id: file.floor_img,
            url: file.floor_img_original
          }
        })
      )
    }
  }

  const handleUploadFile = (fileId) => {
    getFileUrlListByIds({ file_ids: fileId }).then(res => {
      if (res.success) {
        setBaseData(
          produce((draft: any) => {
            draft.curFloorImg[baseData?.floor] = {
              id: fileId,
              url: res.data[0].url
            }
            draft.floorImg[baseData?.floor] = {
              floor_img: fileId,
              floor_img_original: res.data[0].url
            }
          })
        )
      }
    })
  }

  const handleAddCell = (node, width, height) => {
    setBaseData(
      produce((draft: any) => {
        draft.cellList[baseData.floor] = []
        draft.cellList[baseData.floor] = node
        draft.imageWidth = width
        draft.imageHeight = height
      })
    )
  }

  const init = async () => {
    let init_device_type_list: any = {
      floor_type: "",
      device_type_list: [],
    }
    let data: any = []
    const StoreFloorImgLisResult = await getStoreFloorImgList({ store_id: currentItem.id })
    const DeviceTemplateInfoResult = await getDeviceTemplateInfo()
    const DeviceInfoResult = await getDeviceInfo({ store_id: currentItem.id, report_id: baseData.reportId })
    if (DeviceInfoResult.success && DeviceTemplateInfoResult.success) {
      // setStoreFloor()
      setBaseData(
        produce((draft: any) => {
          draft.storeFloor = Object.keys(StoreFloorImgLisResult.data).map(item => {
            return {
              value: item,
              label: item
            }
          })
          draft.allFloor = DeviceTemplateInfoResult.data.floor_list.map(item => {
            return {
              value: item,
              label: item
            }
          })
          draft.floorImg = isEmpty(StoreFloorImgLisResult.data) ? {} : StoreFloorImgLisResult.data
        })
      )
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
    setBaseData(
      produce((draft: any) => {
        draft.initDevice = init_device_type_list
        draft.currentItem.deviceData = data
      })
    )
    // console.log(data);
    // onValueChange('deviceData', data)
    form.setFieldsValue({
      deviceData: data
    })
  }

  useEffect(() => {
    setBaseData({ ...initData })
    setSelectData({ ...options })

    if (visible) {
      init()
    }
  }, [baseData.reportId, visible])

  useEffect(() => {
    setBaseData(
      produce((draft: any) => {
        draft.currentItem = currentItem
      })
    )
    getReportList({ store_id: currentItem.id }).then(res => {
      if (res.success) {
        setSelectData(
          produce((draft: any) => {
            draft.reportList = res.data.list.map(item => {
              return {
                value: item.id,
                label: item.report_no
              }
            })
          })
        )
      }
    })
  }, [currentItem])

  return (
    <BaseContainer
      type={ModalType.Drawer}
      open={visible}
      width="55%"
      title="设备管理"
      onCancel={() => onClose('')}
      destroyOnClose={true}
    >
      <Form
        form={form}
        onValuesChange={(changedValues, value) => onValueChange('deviceData', value)}
        onFinish={handleFinish}
      >
        <Form.Item>
          <Select
            placeholder="请选择报告编号"
            options={selectData.reportList}
            style={{ width: 200 }}
            onChange={e => {
              setBaseData(
                produce((draft: any) => {
                  draft.reportId = e
                })
              )
            }}
            allowClear
            showSearch
            filterOption={(input, option: any) => (option?.label ?? '').includes(input)}
          />
        </Form.Item>
        <Form.Item>
          <BaseFormList
            key="deviceData"
            listName="deviceData"
            addButton={<Button type="primary" block onClick={handleShowAddFloor}>添加楼层</Button>}
            addStruct={{}}
            disableRemoveLast={false}
          >
            <FormListFloors key="device_type_list" currentItem={baseData.currentItem} handleOpenUpload={handleOpenUpload} />
          </BaseFormList>
        </Form.Item>

        <Form.Item>
          <Space>
            <SubmitButton type="primary" form={form}>提交</SubmitButton>
            <Button danger onClick={() => onClose('')}>取消</Button>
          </Space>
        </Form.Item>
      </Form>

      <Modal
        open={open.addFloor}
        onCancel={() => {
          setOpen(
            produce((draft) => {
              draft.addFloor = false
            })
          )
        }}
        title="选择楼层"
        onOk={handleOK}
        destroyOnClose={true}
      >
        <Select
          style={{ width: 200 }}
          options={selectData.floorList}
          placeholder="请选择楼层"
          onChange={(e) => {
            setBaseData(
              produce((draft: any) => {
                draft.floor = e
              })
            )
          }}
        />
      </Modal>

      <Modal
        open={open.uploadFile}
        onCancel={() => {
          setOpen(
            produce((draft) => {
              draft.uploadFile = false
            })
          )
        }}
        title="上传图片"
        onOk={() => {
          setOpen(
            produce((draft) => {
              draft.uploadFile = false
            })
          )
        }}
        destroyOnClose={true}
      >
        <UploadFiles
          allowedTypes={allowFileTypes.images}
          showDownloadIcon
          // value={baseData?.curFloorImg[baseData?.floor] ? baseData?.curFloorImg[baseData?.floor]?.id : ''}
          value={isEmpty(baseData?.curFloorImg) ? '' : baseData?.curFloorImg[baseData?.floor]?.id}
          fileLength={1}
          onChange={handleUploadFile}
        />
      </Modal>

      <Modal
        open={open.showImg}
        width={'1800px'}
        style={{ top: 30, maxWidth: '1800px', width: '100%' }}
        onCancel={() => {
          setOpen(
            produce((draft) => {
              draft.showImg = false
            })
          )
        }}
        title={<h3>图纸-{baseData.floor}</h3>}
        footer={() => {
          return (
            <Button type='primary' onClick={() => {
              setOpen(
                produce((draft) => {
                  draft.showImg = false
                })
              )
            }}>完成</Button>
          )
        }}
        destroyOnClose={true}
        maskClosable={false}
      >
        <MarkImage
          currentImg={isEmpty(baseData.curFloorImg) ? null : baseData?.curFloorImg[baseData?.floor]?.url}
          handleAddCell={handleAddCell}
          deviceNameList={baseData.device_list}
          cell={baseData.cellList}
          floor={baseData.floor}
        />
      </Modal>
    </BaseContainer>
  )
}

export default DeviceManagement
