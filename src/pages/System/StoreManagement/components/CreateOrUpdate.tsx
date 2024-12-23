import React, {useState, useEffect} from "react";
import {Form, Button, Space, Select, Input, InputNumber, Card} from 'antd';
import GkUpload from "@/components/UploadImage/GkUpload";
import {PlusCircleOutlined, MinusCircleOutlined} from "@ant-design/icons";
import {getMarketList} from "@/services/ant-design-pro/report";
import {isEmpty} from "lodash";
import {createOrUpdateStore, getStoreInfo} from "@/services/ant-design-pro/system";

interface ItemListProps {
  actionRef: any,
  success: (text: string) => void
  error: (text: string) => void
  currentItem: any
  handleCloseCreateOrUpdate: () => void
  brandList: any
  cityList: any
  manager: any
}

const CreateOrUpdate: React.FC<ItemListProps> = ({
                                                   actionRef,
                                                   success,
                                                   error,
                                                   currentItem,
                                                   handleCloseCreateOrUpdate,
                                                   brandList,
                                                   cityList,
                                                   manager,
                                                 }) => {
  const [form] = Form.useForm()
  const [brandId, setBrandId] = useState()
  const [market, setMarket] = useState([])

  const handleFinish = (values: any) => {
    let store_img_list: any = [{
      file_url_original: '',
      file_url_thumb: '',
      img_id: '',
      remark: '',
      title: '',
    }]
    if (!isEmpty(values.img[0].img)) {
      values.img.map((item, index) => {
        item.img.map(img => {
          console.log(img)
          store_img_list[index] = {
            file_url_original: '',
            file_url_thumb: '',
            img_id: '',
            remark: '',
            title: '',
          }
          store_img_list[index].img_id = img.id
          store_img_list[index].title = item.title
          store_img_list[index].remark = item.remark
          store_img_list[index].file_url_original = img.url ? img.url : img.response.url
          store_img_list[index].file_url_thumb = img.url ? img.url : img.response.url
        })
      })
    }
    const params = {
      store_id: isEmpty(currentItem) ? undefined : currentItem.id,
      brand_id: values.brand ?? '',
      city_id: values.city ?? '',
      market_id: values.market ?? '',
      store_name_cn: values.store_cn ?? '',
      store_name_en: values.store_en ?? '',
      store_name_short: values.abbreviation ?? '',
      store_name_abbreviate: values.no ?? '',
      store_addr_cn: values.address_cn ?? '',
      store_addr_en: values.address_en ?? '',
      manager_ids: values.manager ?? [],
      supplier_uids: values.manager ? values.manager.join(',') : '',
      other_info: {
        area: values.area ?? '',
        vendor: values.equipmentVendors ?? '',
        consultant: values.equipmentConsultant ?? '',
        an_equipment_ids: values.equipmentImage ? values.equipmentImage.map(item => item.id).join(',') : '',
        an_floor_plans_ids: values.layout ? values.layout.map(item => item.id).join(',') : ''
      },
      equipment_pic: {
        id: values.equipmentImage ? values.equipmentImage[0].id : '',
        name: values.equipmentImage ? values.equipmentImage[0].name : '',
        url: values.equipmentImage ? values.equipmentImage[0].url ? values.equipmentImage[0].url : values.equipmentImage[0].response.url : ''
      },
      store_img_list: store_img_list
    }
    createOrUpdateStore(params).then(res => {
      if (res.success) {
        handleCloseCreateOrUpdate()
        actionRef.current.reload()
        success('操作成功')
        return
      }
      error(res.message)
    })
  }

  const handleFormValueChange = (changeValue, allValues) => {
    setBrandId(allValues.brand || 0)
    if (changeValue.brand) {
      form.setFieldsValue({market: undefined})
    }
    if (changeValue.city) {
      form.setFieldsValue({market: undefined})
      getMarketList({city_id: allValues.city}).then(res => {
        if (res.success) {
          setMarket(res.data.map(item => {
            return {
              value: item.id,
              label: item.market_cn
            }
          }))
        }
      })
    }
  }

  useEffect(() => {
    console.log(currentItem)
    if (isEmpty(currentItem)) {
      form.setFieldsValue({
        img: [{}]
      })
      return
    }

    getStoreInfo({store_id: currentItem.id}).then(res => {
      if (res.success) {
        setBrandId(res.data.brand_id)
        getMarketList({city_id: res.data.city_id}).then(res => {
          if (res.success) {
            setMarket(res.data.map(item => {
              return {
                value: item.id,
                label: item.market_cn
              }
            }))
          }
        })
        let storeImg: any = [{}]
        let equipmentImage: any = []
        let layout: any = []
        if (!isEmpty(res.data.store_img_list)) {
          res.data.store_img_list.map((item, index) => {
            storeImg[index] = {}
            storeImg[index].img = []
            storeImg[index].img[0] = {}
            storeImg[index].img[0].url = item.file_url_thumb
            storeImg[index].img[0].id = item.img_id
            storeImg[index].title = item.title
            storeImg[index].remark = item.remark
          })
        }
        if (!isEmpty(res.data.other_info && res.data.other_info.an_equipment_file_list)) {
          res.data.other_info.an_equipment_file_list.map(item => {
            let formatData = {
              url: item.file_url_thumb,
              ...item
            }
            equipmentImage.push(formatData)
          })
        }
        if (!isEmpty(res.data.other_info && res.data.other_info.floor_plans_file_list)) {
          res.data.other_info.floor_plans_file_list.map(item => {
            let formatData = {
              url: item.file_url_thumb,
              ...item
            }
            layout.push(formatData)
          })
        }

        let manager_list = []
        if (!isEmpty(res.data.manager_list)) {
          res.data.manager_list.forEach(item => {
            if (item.uid !== 0) {
              manager_list.push(item.uid)
            }
          })
        }

        form.setFieldsValue({
          brand: res.data.brand_id ?? '',
          city: res.data.city_id ?? '',
          market: res.data.market_id ?? '',
          store_cn: res.data.store_name_cn ?? '',
          store_en: res.data.store_name_en ?? '',
          abbreviation: res.data.store_name_short ?? '',
          no: res.data.store_name_abbreviate ?? '',
          address_cn: res.data.store_addr_cn ?? '',
          address_en: res.data.store_addr_en ?? '',
          manager: manager_list ?? [],
          area: res.data.other_info ? res.data.other_info.size : 0,
          equipmentVendors: res.data.other_info ? res.data.other_info.vendor : '',
          equipmentConsultant: res.data.other_info ? res.data.other_info.consultant : '',
          img: storeImg ?? [{}],
          equipmentImage: equipmentImage ?? [],
          layout: layout ?? [],
        })
      }
    })
  }, [])

  // Filter `option.label` match the user type `input`
  const filterOption = (input: string, option?: { label: string; value: string }) => {
    return (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
  }

  return (
    <Form
      form={form}
      labelCol={{span: 4}}
      wrapperCol={{span: 16}}
      style={{maxWidth: 800}}
      onFinish={handleFinish}
      onValuesChange={handleFormValueChange}
    >
      <Form.Item name="brand" label="品牌">
        <Select options={brandList} allowClear showSearch/>
      </Form.Item>

      <Form.Item name="city" label="城市">
        <Select options={cityList} allowClear showSearch filterOption={filterOption}/>
      </Form.Item>

      <Form.Item name="market" label="商场">
        <Select options={market} allowClear showSearch filterOption={filterOption}/>
      </Form.Item>

      <Form.Item name="store_cn" label="店铺名" rules={[{required: true}]}>
        <Input/>
      </Form.Item>

      <Form.Item name="store_en" label="英文名称">
        <Input/>
      </Form.Item>

      <Form.Item name="abbreviation" label="缩写">
        <Input/>
      </Form.Item>

      <Form.Item name="no" label="编号">
        <Input/>
      </Form.Item>

      <Form.Item name="address_cn" label="地址">
        <Input/>
      </Form.Item>

      <Form.Item name="address_en" label="英文地址">
        <Input/>
      </Form.Item>

      <Form.Item name="manager" label="负责人">
        <Select options={manager} allowClear mode="multiple" showSearch filterOption={filterOption}/>
      </Form.Item>

      <Form.Item name="area" label="店铺面积">
        <InputNumber style={{width: 300}} min={0} defaultValue={0}/>
      </Form.Item>

      {
        brandId === 1 &&
        <>
          <Form.Item name="equipmentVendors" label="设备供应商">
            <Input/>
          </Form.Item>

          <Form.Item name="equipmentConsultant" label="设备顾问">
            <Input/>
          </Form.Item>
        </>
      }

      <Form.Item name="store_img" label="店铺图片">
        <Form.List name="img">
          {(fields, {add, remove}) => (
            <>
              {fields.map(({key, name, ...restField}) => (
                <Card>
                  <Form.Item
                    {...restField}
                    name={[name, 'img']}
                  >
                    <GkUpload fileLength={1}/>
                  </Form.Item>
                  <div
                    style={{
                      width: 80,
                      position: 'relative',
                      top: -100,
                      left: 350,
                      display: 'flex',
                      justifyContent: 'space-around'
                    }}>
                    <PlusCircleOutlined
                      style={{fontSize: 30, cursor: 'pointer'}}
                      onClick={() => add()}
                    />
                    {
                      name !== 0 &&
                      <MinusCircleOutlined
                        style={{fontSize: 30, cursor: 'pointer'}}
                        onClick={() => remove(name)}
                      />
                    }
                  </div>
                  <Form.Item
                    {...restField}
                    name={[name, 'title']}
                  >
                    <Input placeholder="请输入图片标题"/>
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, 'remark']}
                  >
                    <Input.TextArea placeholder="图片介绍"/>
                  </Form.Item>
                </Card>
              ))}
            </>
          )}
        </Form.List>
      </Form.Item>

      {
        brandId === 1 &&
        <>
          <Form.Item name="equipmentImage" label="设备表图片">
            <GkUpload fileLength={1}/>
          </Form.Item>

          <Form.Item name="layout" label="布局图">
            <GkUpload/>
          </Form.Item>
        </>
      }

      <Form.Item label=" " colon={false}>
        <Space>
          <Button type="primary" htmlType="submit">提交</Button>
          <Button danger onClick={handleCloseCreateOrUpdate}>取消</Button>
        </Space>
      </Form.Item>

    </Form>
  )
}

export default CreateOrUpdate
