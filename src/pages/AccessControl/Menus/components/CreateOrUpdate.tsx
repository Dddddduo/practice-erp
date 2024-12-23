import React, { RefObject, useEffect, useState } from "react";
import type { ActionType } from "@ant-design/pro-components";
import { FormattedMessage, useIntl } from "@@/exports";
import { Button, Form, Input, InputNumber, TreeSelect, Space } from "antd";
import { isEmpty } from "lodash";
import { showMenu, createMenu, updateMenu, fullMenus } from "@/services/ant-design-pro/accessControl";

interface ItemListProps {
  actionRef: RefObject<ActionType>;
  success: (text: string) => void
  error: (text: string) => void
  handleCloseCreateOrUpdate: () => void
  currentItem: {
    id: number
  }
}

const CreateOrUpdate: React.FC<ItemListProps> = ({
  actionRef,
  success,
  error,
  handleCloseCreateOrUpdate,
  currentItem,
}) => {
  const intl = useIntl()
  const [form] = Form.useForm()
  const [menus, setMenus] = useState([])

  const handleFinish = (values) => {
    console.log(values);

    let params = {
      name: values.name ?? '',
      icon: values.icon ?? '',
      pid: values.pid ?? 0,
      sort_by: values.sort_by ?? '',
      path: values.path ?? '',
    }
    if (isEmpty(currentItem)) {
      createMenu(params).then(res => {
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
    updateMenu(params).then(res => {
      if (res.success) {
        handleCloseCreateOrUpdate()
        actionRef.current?.reload()
        success('修改成功')
        return
      }
      error(res.message)
    })
  }

  useEffect(() => {
    fullMenus().then(res => {
      if (res.success) {
        if (res.data[0].name !== '顶级菜单') {
          res.data.unshift({
            id: 0,
            name: '顶级菜单',
            children: []
          })
        }
        res.data.map(item => {
          item.title = item.name
          item.value = item.id
          item.children.map(data => {
            data.title = data.name
            data.value = data.id
            data.children.map(value => {
              value.title = value.name
              value.value = value.id
            })
            return data
          })
          return item
        })
        setMenus(res.data)
      }
    })
    if (isEmpty(currentItem)) {
      return
    }
    showMenu(currentItem.id).then(res => {
      if (res.success) {
        console.log(res.data);

        form.setFieldsValue({
          name: res.data?.name ?? '',
          icon: res.data?.icon ?? '',
          pid: res.data.pid ?? '',
          path: res.data.path ?? '',
          level: res.data.level ?? '',
          sort_by: res.data?.sort_by ?? '',
        })
      }
    })
  }, [])

  return (
    <Form
      form={form}
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 15 }}
      style={{ maxWidth: 600 }}
      onFinish={handleFinish}
    >
      <Form.Item label="名称" name="name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item label="图标" name="icon">
        <Input />
      </Form.Item>

      <Form.Item label="上级菜单" name="pid" rules={[{ required: true }]}>
        <TreeSelect treeData={menus} />
      </Form.Item>

      <Form.Item label="路径" name="path" rules={[{ required: true }]}>
        <Input placeholder="示例：/父级/当前" />
      </Form.Item>

      {/* <Form.Item label=" " name="level" rules={[{ required: true }]}>
        <TreeSelect treeData={pidData} />
      </Form.Item> */}

      <Form.Item label="排序值" name="sort_by" rules={[{ required: true }]}>
        <InputNumber min={1} style={{ width: 345 }} placeholder="0~100" />
      </Form.Item>

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