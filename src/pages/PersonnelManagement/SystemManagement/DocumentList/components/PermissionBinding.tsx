import { Button, Checkbox, Form, Modal, Radio, Select, Space, Table, Tooltip, message } from "antd"
import { useEffect, useState } from "react"
import { departmentAll, folderDelete, folderPermissions, storeUpdatePermission } from "@/services/ant-design-pro/system"
import { LocalStorageService } from "@/utils/utils"
import { folders } from "@/services/ant-design-pro/system"
import { DeleteOutlined, ExclamationCircleFilled, QuestionCircleOutlined } from "@ant-design/icons"
import { userList } from "@/services/ant-design-pro/personnelManagement"

interface ItemListProps {
  folder: {
    id: number
  }
  currentItem: any
  handleCloseBind: () => void
  success: (text: string) => void
  error: (text: string) => void
  openFileZip: any
  isUpload: boolean
}

const PermissionBinding: React.FC<ItemListProps> = ({
  folder,
  currentItem,
  handleCloseBind,
  success,
  error,
  openFileZip,
  isUpload
}) => {
  const [user, setUser] = useState([])
  const [form] = Form.useForm()
  const [departmentList, setDepartmentList] = useState([])
  const [departments, setDepartments]: any = useState([])
  const [users, setUsers]: any = useState([])
  const { confirm } = Modal;

  const handleFinish = (values) => {
    const params = {
      user_ids: values.user ?? [],
      department_ids: values.department ?? [],
      can_view: values.isDownload ?? 1,
      can_upload: values.isUpload ?? 1
    }
    storeUpdatePermission(params, folder.id).then(res => {
      if (res.success) {
        handleCloseBind()
        if (openFileZip && folder) {
          openFileZip(folder, 'update')
        }
        success('操作成功')
        return
      }
      error(res.message)
    })
  }

  const handleCheckbox = (e, entity, cur) => {
    console.log(entity);
    if (entity.type === 'user') {
      const formatUsers = users.map((item: any) => {
        if (item.id === entity.id) {
          item[cur] = e.target.checked
          return item
        }
        return item
      })
      setUsers(formatUsers)
    } else {
      const formatDepartments = departments.map((item: any) => {
        if (item.id === entity.id) {
          item[cur] = e.target.checked
          return item
        }
        return item
      })
      setDepartments(formatDepartments)
    }

    const params = {
      user_id: entity.type === 'user' ? entity.id : 0,
      department_id: entity.type === 'department' ? entity.id : 0,
      can_view: entity.can_view ? 1 : 0,
      can_upload: entity.can_upload ? 1 : 0,
    }
    const hide = message.loading('正在添加');
    try {
      folders(params, folder.id).then(res => {
        hide();
        if (res.success) {
          success('修改成功')
          return
        }
        error(res.message)
      })
    } catch (error) {
      hide();
    }
  }

  const handleDelete = (entity) => {
    confirm({
      title: '你确认要删除吗？',
      icon: <ExclamationCircleFilled />,
      onOk() {
        folderDelete(entity.permission_id).then(res => {
          if (res.success) {
            handleCloseBind()
            success('删除成功')
            return
          }
          error(res.message)
        })
      },
    });
  }

  const columns: any = [
    {
      title: "序号",
      dataIndex: "",
      align: 'center',
      render: (_, entity, index) => (
        <div>{index + 1}</div>
      )
    },
    {
      title: "名称",
      dataIndex: "name",
      align: 'center',
    },
    {
      title: "是否可见",
      dataIndex: "can_view",
      align: 'center',
      render: (dom, entity) => {
        return (
          <div>
            <Checkbox checked={dom ? true : false} onChange={(e) => handleCheckbox(e, entity, 'can_view')} />
          </div>
        )
      }
    },
    {
      title: "是否可上传",
      dataIndex: "can_upload",
      align: 'center',
      render: (dom, entity) => {
        return (
          <div>
            <Checkbox checked={dom ? true : false} onChange={(e) => handleCheckbox(e, entity, 'can_upload')} />
          </div>
        )
      }
    },
    {
      title: "操作",
      dataIndex: "",
      align: 'center',
      render: (dom, entity) => {
        return (
          <div>
            <DeleteOutlined
              style={{ fontSize: 18, color: 'red', cursor: "pointer" }}
              onClick={() => handleDelete(entity)}
            />
          </div>
        )
      }
    },
  ]

  useEffect(() => {
    const { currentUser } = LocalStorageService.getItem('loginInfo')
    userList().then(res => {
      if (res.success) {
        const formatData = res.data.filter(item => item.value !== currentUser.id)
        setUser(formatData)
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
    folderPermissions(folder.id).then(res => {
      if (res.success) {
        setDepartments(res.data.departments.map(item => {
          item.type = 'department'
          return item
        }))
        setUsers(res.data.users.map(item => {
          item.type = 'user'
          return item
        }))
      }
    })
  }, [])

  return (
    <>
      <Form
        form={form}
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        style={{ maxWidth: 800, marginTop: 30 }}
        onFinish={handleFinish}
      >
        <Form.Item label={
          <div>
            用户
            <Tooltip placement="bottom" title={'给选中的用户分配相应的权限'}>
              <QuestionCircleOutlined style={{ cursor: 'pointer' }} />
            </Tooltip>
          </div>
        } name='user'>
          <Select
            showSearch
            options={user}
            mode="multiple"
            filterOption={(input, option: any) => (option?.label ?? '').includes(input)}
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
            }
          />
        </Form.Item>

        <Form.Item label={
          <div>
            部门
            <Tooltip placement="bottom" title={'给选中的部门下所有的用户分配相应的权限'}>
              <QuestionCircleOutlined style={{ cursor: 'pointer' }} />
            </Tooltip>
          </div>
        } name="department">
          <Select options={departmentList} mode="multiple" showSearch
            filterOption={(inputValue, option: any) =>
              option.label.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1
            }
          />
        </Form.Item>

        <Form.Item label="是否可见" name="isDownload">
          <Radio.Group defaultValue={1}>
            <Radio value={1}>可见</Radio>
            <Radio value={0}>不可见</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="是否可上传" name='isUpload'>
          <Radio.Group defaultValue={1}>
            <Radio value={1}>可上传</Radio>
            <Radio value={0}>不可上传</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label=" " colon={false}>
          <Space>
            <Button type='primary' htmlType="submit">确定</Button>
            <Button danger onClick={handleCloseBind}>取消</Button>
          </Space>
        </Form.Item>
      </Form>

      <Table
        title={() => <div>部门</div>}
        dataSource={departments}
        columns={columns}
        pagination={false}
      />

      <Table
        title={() => <div>用户</div>}
        dataSource={users}
        columns={columns}
        pagination={false}
      />
    </>
  )
}

export default PermissionBinding