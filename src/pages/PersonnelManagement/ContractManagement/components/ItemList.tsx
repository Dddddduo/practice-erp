import React, { useEffect, useState } from "react"
import { ProTable, ParamsType, ProColumns } from "@ant-design/pro-components"
import { PlusOutlined, UploadOutlined } from "@ant-design/icons"
import { Button, Drawer, Space, Popconfirm, message, Modal, Upload, UploadProps, Form, Typography } from "antd"
import { useIntl, FormattedMessage } from "@umijs/max"
import AddContract from "./AddContract"
import Detail from "./Detail"
import { deletecontract, departmentAll, userAll } from "@/services/ant-design-pro/system"
import { contractManagementPermission } from "@/services/ant-design-pro/system";
import Permission from "./Permission"
import {getStateMap, LocalStorageService, setStateMap} from "@/utils/utils"
import '../../../ContractManagement/style.less'
import {useLocation} from "@@/exports";


type HandleListDataParams = {
  current: number;
  pageSize: number;
  [key: string]: any;
};

type HandleListDataReturnType = {
  success: boolean;
  total: number;
  data: any[]; // 可以根据需要进一步指定数组的类型
};

type HandleListDataFunc = (params: HandleListDataParams, sort: ParamsType) => Promise<HandleListDataReturnType>;

interface ItemListProps {
  onListData: HandleListDataFunc;
  actionRef
  success,
  error
}

const ItemList: React.FC<ItemListProps> = ({
  onListData,
  actionRef,
  success,
  error
}) => {
  const { Text } = Typography;
  const [form] = Form.useForm()
  const [tableScrollY, setTableScrollY] = useState(300); // 初始高度值

  const intl = useIntl()
  // 新增 编辑
  const [showDetailDrawer, setShowDetailDrawer] = useState(false)
  // 详情
  const [showAddDrawer, setShowAddDrawer] = useState(false)
  const [currentMsg, setCurrentMsg] = useState<any>()
  const [title, setTitle] = useState('')

  const [selectedItems, setSelectedItems] = useState<any>([]);

  const [permissions, setPermissions] = useState<any>({})

  // 权限
  const [showPermissions, setShowPermissions] = useState(false)

  const [showUpload, setShowUpload] = useState(false)

  const [token, setToken] = useState('')

  const [department, setDepartment] = useState([])

  const [user, setUser] = useState([])
  const [columnsStateMap, setColumnsStateMap] = useState({});
  const location = useLocation();
  const currentPath = location.pathname;
  const pathname = currentPath.split('/')[currentPath.split('/').length - 1]

  const columns: ProColumns<API.ContractManagement>[] = [
    {
      title: (
        <FormattedMessage
          id="contractManagement.field.id"
          defaultMessage="序号"
        />
      ),
      dataIndex: 'id',
      search: false,
      align: "center"
    },
    {
      title: (
        <FormattedMessage
          id="contractManagement.field.number"
          defaultMessage="合同编号"
        />
      ),
      dataIndex: 'number',
      // search: false,
      align: "center",
      render: (dom, entity) => {
        return (
          <a onClick={() => {
            setCurrentMsg(entity)
            setShowAddDrawer(true)
          }}>{entity.number}</a>
        )
      },
    },
    {
      title: (
        <FormattedMessage
          id="contractManagement.field.name"
          defaultMessage="合同名称"
        />
      ),
      dataIndex: 'name',
      align: "center"
    },
    {
      title: (
        <FormattedMessage
          id="contractManagement.field.department_name"
          defaultMessage="部门"
        />
      ),
      dataIndex: 'department_name',
      align: "center",
      valueType: 'select',
      fieldProps: {
        options: department,
        showSearch: true,
        onChange: (e, a) => {
          form.setFieldsValue({
            department_head_name: undefined
          })
          userAll({ department_id: e }).then(res => {
            setUser(res.data.map((item: any) => {
              return {
                value: item.id,
                label: item.username,
              }
            }))
          })
        }
      },
    },
    {
      title: (
        <FormattedMessage
          id="contractManagement.field.department_head_name"
          defaultMessage="负责人"
        />
      ),
      dataIndex: 'department_head_name',
      align: "center",
      valueType: 'select',
      fieldProps: {
        options: user,
        showSearch: true,
      },
    },
    {
      title: (
        <FormattedMessage
          id="contractManagement.field.company_a"
          defaultMessage="甲方公司"
        />
      ),
      dataIndex: 'company_a',
      align: "center"
    },
    {
      title: (
        <FormattedMessage
          id="contractManagement.field.company_b"
          defaultMessage="乙方公司"
        />
      ),
      dataIndex: 'company_b',
      align: "center"
    },
    {
      title: (
        <FormattedMessage
          id="contractManagement.field.company_c"
          defaultMessage="丙方公司"
        />
      ),
      dataIndex: 'company_c',
      align: "center"
    },
    {
      title: (
        <FormattedMessage
          id="contractManagement.field.company_d"
          defaultMessage="丁方公司"
        />
      ),
      dataIndex: 'company_d',
      align: "center"
    },
    {
      title: (
        <FormattedMessage
          id="contractManagement.field.start_date"
          defaultMessage="合同开始日期"
        />
      ),
      // title: '自定义标题',
      dataIndex: 'start_date',
      align: "center",
      valueType: 'date',
      // search: {
      //     title: 合同开始结束时间
      // },
      render: (_, entity) => (
        <>{entity.start_date}</>
      )
    },
    {
      title: (
        <FormattedMessage
          id="contractManagement.field.end_date"
          defaultMessage="合同结束日期"
        />
      ),
      dataIndex: 'end_date',
      align: "center",
      valueType: 'date',
      render: (_, entity) => (
        <>{entity.end_date}</>
      )
    },
    {
      title: (
        <FormattedMessage
          id="contractManagement.field.price"
          defaultMessage="合同金额"
        />
      ),
      dataIndex: 'price',
      search: false,
      align: "center"
    },
    {
      title: (
        <FormattedMessage
          id="contractManagement.field.signing_date"
          defaultMessage="合同签订日期"
        />
      ),
      dataIndex: 'signing_date',
      align: "center",
      valueType: 'date',
      render: (_, entity) => (
        <>{entity.signing_date}</>
      )
    },
    {
      title: (
        <FormattedMessage
          id="contractManagement.field.notes"
          defaultMessage="备注"
        />
      ),
      dataIndex: 'notes',
      search: false,
      align: "center",
      width: 200,
      render: (cur, row) => {
        return (
          <Text
            style={{ width: 200 }}
            ellipsis={{ tooltip: cur }}
          >
            {cur}
          </Text>
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="contractManagement.field.path"
          defaultMessage="坚果云链接"
        />
      ),
      dataIndex: 'path',
      search: false,
      align: "center",
      render: (dom: any, entity) => {
        return (
          <Button target="primary"
            onClick={() => handleCopy(entity)}
          >复制</Button>
        )
      },
    },
    {

      title: (
        <FormattedMessage
          id="contractManagement.field.operation"
          defaultMessage="操作"
        />
      ),
      dataIndex: 'operation',
      search: false,
      // fixed: "right",
      align: "center",
      hideInTable: !permissions.updateStates || !permissions.allocationStates,
      render: (dom: any, entity) => {
        return (
          <Space>
            {
              permissions.updateStates &&
              <Button type="primary" onClick={() => openDetailDrawer(entity)}>编辑</Button>
            }

            {
              permissions.allocationStates &&
              <Button type="primary" onClick={() => openPermissionsDrawer(entity)}>分配</Button>
            }
          </Space >
        )
      }
    }
  ]

  const clearSelectedItems = () => {
    setSelectedItems([])
  }
  // 删除
  const handleDelete = (entity) => {

    if (selectedItems.length === 0) {
      message.warning("请先选择要删除的项");
      return;
    }

    const selectedIds = selectedItems.map((item: any) => item.id);
    console.log(selectedIds);

    // 调用删除接口或其他删除逻辑，传递选中的ID数组
    deletecontract({ ids: selectedIds }).then(res => {
      if (res.success) {
        actionRef.current?.reload();
        message.success('删除成功');
        // setSelectedItems([]); // 更新 selectedItems 状态
        clearSelectedItems()
      } else {
        message.error(res.message);
      }
    });
  }

  //   新增 编辑
  const openDetailDrawer = (e) => {
    setCurrentMsg(e)
    setShowDetailDrawer(true)
    setTitle('编辑')
  }

  const handleClose = () => {
    setCurrentMsg(undefined)
    setShowDetailDrawer(false)
  }

  // 详情
  const handleDetail = () => {
    setCurrentMsg(undefined)
    setShowAddDrawer(false)
  }

  // 权限管理
  const handlePermissions = () => {
    setCurrentMsg(undefined)
    setShowPermissions(false)
  }

  const openPermissionsDrawer = (value) => {
    setCurrentMsg(value)
    setShowPermissions(true)
  }

  // 复制
  const handleCopy = (e) => {

    const url = e.path;

    navigator.clipboard.writeText(url)
      .then(() => {
        success('复制成功');
      })
      .catch((error) => {
        console.error('复制失败:', error);
      });
  }

  const props = {
    name: 'excel_file',
    action: '/prod-api/an/gpt-contracts-import',
    headers: {
      Authorization: 'Bearer ' + token,
    },
    showUploadList: false,
    onChange(info) {
      console.log(info);

      // if (info.file.status !== 'uploading') {
      //   console.log(info.file, info.fileList);
      // }
      if (info.file.status === 'done') {
        //  info.file.response.url
        if (info.file.response && 0 === info.file.response.data.code) {
          message.success(`${info.file.name} 上传成功`);
          actionRef.current.reload()
        } else {
          message.error(info.file.response && info.file.response.msg)
        }
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 上传失败`);
      }
    },
  };

  const rowClassName = (record) => {
    if (record.color) {
      return 'record-' + record.color; // 需要高亮显示的行使用  类名
    }
    return '';
  };

  useEffect(() => {
    setColumnsStateMap(getStateMap(pathname))
    const { accessToken } = LocalStorageService.getItem('loginInfo')
    setToken(accessToken)

    contractManagementPermission().then(res => {
      if (res.success) {
        setPermissions(res.data)
      }
    })

    departmentAll().then(res => {
      setDepartment(res.data.map((item: any) => {
        return {
          value: item.id,
          label: item.name
        }
      }))
    })

    // const handleResize = () => {
    //   // 计算并设置表格高度，以适应屏幕
    //   const newHeight = window.innerHeight - 350; // 假设顶部和底部占用了100px
    //   setTableScrollY(newHeight);
    // };

    // window.addEventListener('resize', handleResize);
    // handleResize(); // 初始化时执行一次

    // return () => window.removeEventListener('resize', handleResize);

  }, [])

  return (
    <>
      <ProTable<API.ContractManagement, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'contractManagement.table.title',
          defaultMessage: 'table list',
        })}
        rowClassName={rowClassName}
        toolBarRender={() => [
          <>
            <Upload {...props}>
              <Button
                type="primary"
                icon={<UploadOutlined />}
              >
                Excel导入
              </Button>
            </Upload>
            <Button
              type="primary"
              onClick={() => {
                window.open('https://zhian-erp-files.oss-cn-shanghai.aliyuncs.com/images/2eb999b00bad1797.xlsx')
              }}
            >
              Excel模板
            </Button>
            {
              permissions.storeStatus &&
              <Button
                type="primary"
                onClick={() => {
                  setShowDetailDrawer(true)
                  setTitle('新增')
                }}
              >
                <PlusOutlined />
                <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
              </Button>
            }
            <Button
              type="primary"
              onClick={() => setShowPermissions(true)}
              disabled={selectedItems.length === 0}
            >
              批量分配
            </Button>
            {
              permissions.deleteStatus &&
              // <Button type="primary" danger onClick={handleDelete} disabled={selectedItems.length === 0}>删除</Button>
              <Popconfirm
                title="警告"
                description="确定要删除吗"
                okText="确定"
                cancelText="取消"
                onConfirm={handleDelete}

              >
                <Button type="primary" danger disabled={selectedItems.length === 0}>
                  删除
                </Button>
              </Popconfirm>
            }
          </>
        ]}
        search={{
          labelWidth: 120,
        }}
        rowSelection={
          !permissions.deleteStatus ? false :
            {
              selectedRowKeys: selectedItems.map((item: any) => item.key),
              onChange: (selectedRowKeys, selectedRows) => {
                setSelectedItems(selectedRows);
              },
            }
        }
        columnEmptyText={false}
        scroll={{ x: 'max-content' }}
        actionRef={actionRef}
        columns={columns}
        request={onListData}
        form={{
          form,
        }}
        columnsState={{
          value: columnsStateMap,
          onChange: (newState) => {
            setColumnsStateMap(newState)
            setStateMap(pathname, newState)
          }
        }}
      />

      {/* 新增 编辑 */}
      <Drawer
        width={800}
        title={title}
        open={showDetailDrawer}
        onClose={handleClose}
        destroyOnClose={true}
      >
        <AddContract
          handleClose={handleClose}
          actionRef={actionRef}
          success={success}
          error={error}
          currentMsg={currentMsg}
        />
      </Drawer>

      {/* 详情 */}
      <Drawer
        width={650}
        open={showAddDrawer}
        onClose={handleDetail}
        destroyOnClose={true}
      >
        <Detail
          currentMsg={currentMsg}
        />
      </Drawer>
      {/* 权限管理 */}
      <Drawer
        width={600}
        open={showPermissions}
        onClose={handlePermissions}
        destroyOnClose={true}
      >
        <Permission
          handlePermissions={handlePermissions}
          actionRef={actionRef}
          success={success}
          error={error}
          currentMsg={currentMsg}
          selectedItems={selectedItems}
          clearSelectedItems={clearSelectedItems}
        />
      </Drawer>

      <Modal
        width={400}
        open={showUpload}
        title="Excel上传"
        onCancel={() => setShowUpload(false)}
      >
        <Upload>
          <Button icon={<UploadOutlined />}></Button>
        </Upload>
      </Modal>
    </>
  )
}
export default ItemList
