import React, { RefObject, useEffect, useState } from "react";
import type { ActionType } from "@ant-design/pro-components";
import { Form, Input, Select, Switch, Space, Button, DatePicker } from "antd";
import { isEmpty } from "lodash";
import {getShopList, createOrUpdateDevice, getSimCard, simCardAll} from '@/services/ant-design-pro/simCard';
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { debounce } from 'lodash';

interface ItemListProps {
  actionRef: RefObject<ActionType>;
  success: (text: string) => void
  error: (text: string) => void
  handleCloseCreateOrUpdate: () => void
  currentItem: any
}

const { TextArea } = Input;

const CreateOrUpdate: React.FC<ItemListProps> = ({
  actionRef,
  success,
  error,
  handleCloseCreateOrUpdate,
  currentItem,
}) => {
  const [form] = Form.useForm()
  const [shopOptions, setShopOptions] = useState<{ value: string, label: any }[]>([])
  const { RangePicker } = DatePicker;
  const dateFormat = 'YYYY-MM-DD';
  const [simList, setSimList] = useState([])

  const handleFinish = async (values) => {
    let sim_card_details: any = []

    if (!isEmpty(values.sim_card_details)) {
      values.sim_card_details.forEach(item => {

        let data = {
          id: item.id ?? 0,
          operator: item.operator,
          supplier: item.supplier,
          status: 1,
          valid_period_start: !isEmpty(item.time) ? dayjs(item.time[0]).format(dateFormat) : '',
          valid_period_end: !isEmpty(item.time) ? dayjs(item.time[1]).format(dateFormat) : '',
        }

        if (item.status) {
          data.status = 1
        } else {
          data.status = 0
        }

        sim_card_details.push(data)
      })
    }

    let params = {
      name: values.name ?? '',
      shop_id: values.shop_id ?? '',
      real_topic: values.real_topic ?? '',
      floor: values.floor ?? '',
      floor_cn: values.floor_cn ?? '',
      info: values.info ?? '',
      ver: values.ver ?? '',
      remark: values.remark ?? '',
      status: 1,
      sim_card_id: values?.sim_card_details ?? ''
    }

    if (values.status) {
      params.status = 1
    } else {
      params.status = 0
    }

    if (isEmpty(currentItem)) {
      createOrUpdateDevice(params).then(res => {
        console.log('打印数据返回', res);
        if (res.success) {
          handleCloseCreateOrUpdate()
          actionRef.current?.reload()
          success('添加成功')
          return
        }
        error(res.message)
      })

      return
    }

    params = {
      ...params,
      id: currentItem.id
    }

    console.log('打印最终的数据✅✅2222', params);

    createOrUpdateDevice(params).then(res => {

      console.log('修改设备❌');

      if (res.success) {
        handleCloseCreateOrUpdate()
        actionRef.current?.reload()
        success('修改成功')
        return
      }
      error(res.message)
    })
  }

  const debouncedHandleSubmit = debounce(handleFinish, 500);

  useEffect(() => {
    getShopList().then(res => {
      if (res.success && !isEmpty(res.data)) {
        let shopList: any = []
        res.data.forEach(item => {
          shopList.push(
            { label: item.name_cn, value: item.id },
          )
        })
        setShopOptions(shopList)
      }
    })
    simCardAll().then(res => {
      if (res.success) {
        setSimList(res.data.map(item => {
          return {
            value: item.id ?? 0,
            label: item.full_name ?? ''
          }
        }))
      }
    })

    if (!isEmpty(currentItem) && currentItem.id) {

      getSimCard(currentItem.id).then(res => {
        if (res.success) {

          let sim_card_details: any = []

          let fieldsValue = {
            name: res.data.center_control.name ?? '',
            shop_id: res.data.center_control.shop_id ?? '',
            status: res.data.center_control.status == 1 ?? '',
            real_topic: res.data.center_control.real_topic ?? '',
            floor: res.data.center_control.floor ?? '',
            floor_cn: res.data.center_control.floor_cn ?? '',
            info: res.data.center_control.info ?? '',
            ver: res.data.center_control.ver ?? '',
            remark: res.data.center_control.remark ?? '',
            sim_card_details: res.data.center_control?.sim_card_id ?? ''
          }

          if (!isEmpty(res.data.sim_card_details)) {
            res.data.sim_card_details.forEach(item => {
              sim_card_details.push({
                id: item.id,
                operator: item.operator,
                supplier: item.supplier,
                time: [dayjs(item.valid_period_start, dateFormat), dayjs(item.valid_period_end, dateFormat)],
                status: item.status == 1
              })
            })
          }

          form.setFieldsValue(fieldsValue)
        }
      })
    }
  }, [])

  return (
    <Form
      form={form}
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 15 }}
      style={{ maxWidth: 600 }}
      onFinish={debouncedHandleSubmit}
      layout={'horizontal'}
    >
      <Form.Item label="名称" name="name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item label="店铺" name="shop_id" rules={[{ required: true }]}>
        <Select
          options={shopOptions}
        />
      </Form.Item>

      <Form.Item label="状态" name="status">
        <Switch
          checkedChildren='开'
          unCheckedChildren='关'
        />
      </Form.Item>

      <Form.Item label="Client Id" name="real_topic" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item label="楼层" name="floor">
        <Input />
      </Form.Item>

      <Form.Item label="楼层中文" name="floor_cn">
        <Input />
      </Form.Item>

      <Form.Item label="额外信息" name="info" >
        <Input />
      </Form.Item>

      <Form.Item label="版本信息" name="ver" >
        <Input />
      </Form.Item>

      <Form.Item label="备注" name="remark">
        <TextArea rows={4} />
      </Form.Item>

      <Form.Item label="4G卡" name="sim_card_details">
        {/*<Form.List*/}
        {/*  name="sim_card_details"*/}
        {/*>*/}
        {/*  {(fields, { add, remove }) => (*/}
        {/*    <>*/}
        {/*      {fields.map(({ key, name, ...restField }) => (*/}
        {/*        <div key={key}>*/}
        {/*          <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">*/}
        {/*            <Form.Item*/}
        {/*              {...restField}*/}
        {/*              name={[name, 'operator']}*/}
        {/*            >*/}
        {/*              <Input placeholder="运营商名称" />*/}
        {/*            </Form.Item>*/}
        {/*            <Form.Item*/}
        {/*              {...restField}*/}
        {/*              name={[name, 'supplier']}*/}
        {/*            >*/}
        {/*              <Input placeholder="供应商名称" />*/}
        {/*            </Form.Item>*/}
        {/*          </Space>*/}

        {/*          <Space>*/}
        {/*            <Form.Item*/}
        {/*              {...restField}*/}
        {/*              name={[name, 'time']}*/}
        {/*            >*/}
        {/*              <RangePicker />*/}
        {/*            </Form.Item>*/}
        {/*            <Form.Item*/}
        {/*              {...restField}*/}
        {/*              name={[name, 'status']}*/}
        {/*            >*/}
        {/*              <Switch*/}
        {/*                checkedChildren='开'*/}
        {/*                unCheckedChildren='关'*/}
        {/*              />*/}
        {/*            </Form.Item>*/}

        {/*            <Form.Item>*/}
        {/*              <MinusCircleOutlined onClick={() => remove(name)} />*/}
        {/*            </Form.Item>*/}
        {/*          </Space>*/}
        {/*        </div>*/}
        {/*      ))}*/}
        {/*      <Form.Item>*/}
        {/*        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>*/}
        {/*          添加卡详情*/}
        {/*        </Button>*/}
        {/*      </Form.Item>*/}
        {/*    </>*/}
        {/*  )}*/}
        {/*</Form.List>*/}
        <Select
          options={simList}
          allowClear
          showSearch
          filterOption={(input, option) => (option?.label ?? '').includes(input)}
          filterSort={(optionA, optionB) =>
            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
          }
        />
      </Form.Item>

      <Form.Item label=" " colon={false}>
        <Space>
          <Button type="primary" htmlType="submit">提交</Button>
          <Button danger onClick={handleCloseCreateOrUpdate}>取消</Button>
        </Space>
      </Form.Item>
    </Form >
  )
}

export default CreateOrUpdate
