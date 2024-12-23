import React, { useEffect, useState } from "react"
import { Form, Input, Space, Button, DatePicker, Select, Radio, Divider, Tooltip } from "antd"
import {
  addcontract,
  contractsPermissions,
  departmentAll,
  assignDeptContract,
  contractsDeptPermissions
} from "@/services/ant-design-pro/system"
import { message } from "antd"
import { LocalStorageService } from "@/utils/utils"
import { isEmpty } from "lodash"
import { userList } from "@/services/ant-design-pro/personnelManagement"
import { QuestionCircleOutlined } from "@ant-design/icons"

interface ItemListProps {
  handlePermissions: () => void
  actionRef
  success,
  error
  currentMsg,
  selectedItems,
  clearSelectedItems
}
const Permission: React.FC<ItemListProps> = ({
  handlePermissions,
  actionRef,
  success,
  error,
  currentMsg,
  selectedItems,
  clearSelectedItems
}) => {

  const [form] = Form.useForm()

  const [user, setUser] = useState()
  const [departmentList, setDepartmentList] = useState([])
  const [type, setType] = useState('')

  const handleFinish = (values) => {
    let params
    if (type === 'user') {
      params = {
        user_ids: values?.name ?? [],
        contract_ids: isEmpty(currentMsg) ? selectedItems.map(item => item.id) : [currentMsg?.id],
        read_status: 1,
      }
      addcontract(params).then(res => {
        if (res.success) {
          handlePermissions()
          actionRef.current.reload()
          message.success('分配成功')
          clearSelectedItems()
          return
        }
        message.error(res.message)
      })
      return
    }
    params = {
      dept_ids: values.department ?? [],
      contract_ids: isEmpty(currentMsg) ? selectedItems.map(item => item.id) : [currentMsg?.id],
      read_status: 1,
    }
    assignDeptContract(params).then(res => {
      if (res.success) {
        handlePermissions()
        actionRef.current.reload()
        message.success('分配成功')
        clearSelectedItems()
        return
      }
      message.error(res.message)
    })
  }


  useEffect(() => {
    // const { currentUser } = LocalStorageService.getItem('loginInfo')
    userList().then(res => {
      if (res.success) {
        // const formatData = res.data.filter(item => item.value !== currentUser.id)
        setUser(res.data)
      }
    })
    departmentAll().then(res => {
      if (res.success) {
        setDepartmentList(res.data.map(item => {
          return {
            value: item.id,
            label: item.name
          }
        }))
      }
    })
    if (!isEmpty(currentMsg)) {
      contractsPermissions({ contract_id: currentMsg?.id }).then(res => {
        if (res.success) {
          form.setFieldsValue({
            name: res.data.map(item => item.user_id)
          })
          return
        }
        message.error(res.message)
      })
      contractsDeptPermissions({ contract_id: currentMsg?.id }).then(res => {
        if (res.success) {
          form.setFieldsValue({
            department: res.data.map(item => item.dept_id)
          })
          return
        }
        message.error(res.message)
      })
    }
  }, [])

  return (
    <Form
      form={form}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      onFinish={handleFinish}
    >
      <Form.Item
        label={
          <div>
            部门
            <Tooltip placement="bottom" title={'给选中的部门下所有的用户分配相应的权限'}>
              <QuestionCircleOutlined style={{ cursor: 'pointer' }} />
            </Tooltip>
          </div>
        }
        name="department"
      >
        <Select options={departmentList} mode="multiple" showSearch
          filterOption={(inputValue, option: any) =>
            option.label.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1
          }
        />
      </Form.Item>

      <Form.Item label=' ' colon={false} style={{ marginBottom: 50 }}>
        <Space>
          <Button type="primary" htmlType='submit' onClick={() => setType('department')}>提交</Button>
          <Button type="primary" danger ghost onClick={handlePermissions}>取消</Button>
        </Space>
      </Form.Item>

      <Divider />

      <Form.Item
        label={
          <div>
            用户
            <Tooltip placement="bottom" title={'给选中的用户分配相应的权限'}>
              <QuestionCircleOutlined style={{ cursor: 'pointer' }} />
            </Tooltip>
          </div>
        }
        name='name'
        style={{ marginTop: 50 }}
      >
        <Select options={user} mode="multiple" showSearch
          filterOption={(inputValue, option: any) =>
            option.label.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1
          }
        />
      </Form.Item >

      {/* <Form.Item label='是否可见' name='read_status' initialValue="1">
                <Radio.Group>
                    <Radio value="1">可见</Radio>
                    <Radio value="2">不可见</Radio>
                </Radio.Group>
            </Form.Item> */}

      <Form.Item label=' ' colon={false} >
        <Space>
          <Button type="primary" htmlType='submit' onClick={() => setType('user')}>提交</Button>
          <Button type="primary" danger ghost onClick={handlePermissions}>取消</Button>
        </Space>
      </Form.Item >


    </Form >
  )
}
export default Permission
