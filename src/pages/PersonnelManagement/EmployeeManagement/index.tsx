import { ActionType, PageContainer, ProColumns, ProTable } from "@ant-design/pro-components";
import { Button, Drawer, Modal, Space, Table, Tabs, message } from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react"
import { getEmployeeListPage, delEmployee, exportEmployeeTmpl, exportEmployee, importEmployee, departmentList, tmpToken } from "@/services/ant-design-pro/system";
import Reassignment from "./components/Reassignment";
import DeleteButton from "@/components/Buttons/DeleteButton";
import Dimission from "./components/Dimission";
import DownloadButton from "@/components/Buttons/DownloadButton";
import UploadFiles from "@/components/UploadFiles";
import copy from "copy-to-clipboard";
import CreateOrUpdate from "./components/CreateOrUpdate";
import {getProbationEndEmployeeList} from "@/services/ant-design-pro/kpi";
import {getStateMap, setStateMap} from "@/utils/utils";
import {useLocation} from "@@/exports";
import {getEmployeeNum} from "@/services/ant-design-pro/personnelManagement";
import {isEmpty} from "lodash";

const EmployeeManagement: React.FC = () => {
  const [status, setStatus] = useState('在职')
  const [shwoReassignment, setShwoReassignment] = useState(false)
  const [showLogs, setShowLogs] = useState(false)
  const [showDimission, setShowDimission] = useState(false)
  const [showUpload, setShowUpload] = useState(false)
  const [fileId, setFileId] = useState('')
  const [department, setDepartment] = useState([])
  const [currentItem, setCurrentItem] = useState<any>({})
  const [showEmployeeEnd, setShowEmployeeEnd] = useState(false)
  const [probationEndEmployeeList, setProbationEndEmployeeList] = useState([])
  // 配置Message
  const [messageApi, contextHolder] = message.useMessage();
  const [employeeCount, setEmployeeCount] = useState([])

  // 成功Message
  const success = (text: string) => {
    messageApi.open({
      type: 'success',
      content: text,
    });
  };
  // 失败Message
  const error = (text: string) => {
    messageApi.open({
      type: 'error',
      content: text,
    });
  };
  // 表格的引入
  const actionRef = useRef<ActionType>();
  // 选中项
  const [selectedRowsState, setSelectedRows] = useState<API.RuleListItem[]>([]);
  // 是否显示添加
  const [showCreateDrawer, setShowCreateDrawer] = useState(false)
  // 员工ID
  const [employeeId, setEmployeeId] = useState(0)
  // 组件标题
  const [componentTitle, setComponentTitle] = useState('')
  const [columnsStateMap, setColumnsStateMap] = useState({});
  const location = useLocation();
  const currentPath = location.pathname;
  const pathname = currentPath.split('/')[currentPath.split('/').length - 1]

  const handleFetchListData = useCallback(async ({ current, pageSize, ...params }) => {
    console.log('handleFetchListData:params:', params);

    const retData = {
      success: false,
      total: 0,
      data: []
    };
    const customParams = {
      page: current,
      page_size: pageSize,
      status: params['status'] ?? status,
      department_id: params['department_name'] ? params['department_name'][params['department_name'].length - 1] : '',
      full_status: params['full_status'] ?? '',
      keyword: params['name'] ?? '',
      mobile: params['mobile'] ?? '',
    };

    try {
      const response = await getEmployeeListPage(customParams);
      const data = response.data;
      // console.log(data)
      data.data.map(item => {
        item.children_list = item.children
        item.children = null
        item.key = item.id
        return item
      })

      retData.success = true;
      retData.total = data.total;
      retData.data = data.data ?? [];

    } catch (error) {
      message.error('数据请求异常');
    }
    return retData;
  }, [])

  const handleUploadOk = () => {
    importEmployee({ file_id: fileId }).then(res => {
      if (res.success) {
        actionRef.current?.reload()
        setShowUpload(false)
        success('上传成功')
        return
      }
      error(res.message)
    })
  }

  const handleBatchDel = () => {
    delEmployee({ id: selectedRowsState.map(item => item.id) }).then(res => {
      if (res.success) {
        actionRef.current?.reload()
        success('删除成功')
        setSelectedRows([])
        return
      }
      error(res.message)
    })
  }

  const handleCopy = (row) => {
    tmpToken({ id: row.id }).then(res => {
      if (res.success) {
        const href = `/update?id=${row.id}&token=${res.data}`;
        copy(window.location.origin + href)
        success('复制成功')
        return
      }
      error(res.message)
    })
  }

  const columns: ProColumns<API.EmployeeManagementParams>[] = [
    {
      title: "序号",
      dataIndex: "index",
      align: 'center',
      search: false,
      render: (cur, row, index) => <>{index + 1}</>
    },
    {
      title: "姓名",
      dataIndex: "name",
      align: 'center',
      search: {
        title: '姓名/工号',
      },
    },
    {
      title: "工号",
      dataIndex: "job_no",
      align: 'center',
      search: false,
    },
    {
      title: "手机号",
      dataIndex: "mobile",
      align: 'center',
      hideInTable: true,
    },
    {
      title: "部门",
      dataIndex: "department_name",
      align: 'center',
      valueType: 'select',
      fieldProps: {
        mode: 'multiple',
        options: department,
      },
      render: (cur, row) => <>{cur}</>
    },
    {
      title: "职位",
      dataIndex: "post",
      align: 'center',
      search: false,
    },
    {
      title: "入职时间",
      dataIndex: "entry_at",
      align: 'center',
      search: false,
      render: (cur, row) => {
        let formatTime: any = ''
        if (row.entry_at) {
          formatTime = row.entry_at.split(' ')
        }
        return (
          <>{formatTime[0]}</>
        )
      }
    },
    {
      title: "离职时间",
      dataIndex: "resignation_date",
      align: 'center',
      search: false,
      render: (cur, row) => {
        let formatTime: any = ''
        if (row?.resignation_date) {
          formatTime = row.resignation_date.split(' ')
        }
        return (
          <>{formatTime[0]}</>
        )
      }
    },
    {
      title: "在职状态",
      dataIndex: "status",
      align: 'center',
      search: false,
    },
    {
      title: "转正状态",
      dataIndex: "full_status",
      align: 'center',
      valueType: 'select',
      fieldProps: {
        options: [
          { value: '已转正', label: '已转正' },
          { value: '未转正', label: '未转正' },
        ]
      }
    },
    {
      title: "操作",
      dataIndex: "action",
      align: 'center',
      search: false,
      render: (cur, row) => (
        <Space>
          <Button type="primary" onClick={() => {
            setCurrentItem(row)
            setShowLogs(true)
          }}>异动记录</Button>
          <Button
            type="primary"
            onClick={() => {
              setShowCreateDrawer(true)
              setEmployeeId(row.id)
              setComponentTitle('编辑员工')
            }}
          >
            编辑
          </Button>
          <Button type="primary" onClick={() => handleCopy(row)}>复制链接</Button>
          <Button
            type="primary"
            onClick={() => {
              setShwoReassignment(true)
              setCurrentItem(row)
            }}
          >
            调岗
          </Button>
          {/* <Button type="primary" style={{ backgroundColor: 'green' }}>调薪</Button> */}
          {
            status === '在职' &&
            <Button type="primary" danger onClick={() => {
              setShowDimission(true)
              setCurrentItem(row)
            }}>离职</Button>
          }
          <DeleteButton type="primary" danger onConfirm={() => handleDelete(row)} >删除</DeleteButton>
        </Space>
      )
    },
  ]

  const LogColumns: any = [
    {
      title: '异动详情',
      dataIndex: "content",
      align: "center",
    },
    {
      title: '异动时间',
      dataIndex: "create_at",
      align: "center",
    },
  ]

  const handleDelete = (row) => {
    delEmployee({ id: row.id }).then(res => {
      if (res.success) {
        actionRef.current?.reload()
        success('删除成功')
        return
      }
      error(res.message)
    })
  }

  const handleCloseReassignment = () => {
    setShwoReassignment(false)
    setCurrentItem({})
  }

  const handleCloseDimission = () => {
    setShowDimission(false)
    setCurrentItem({})
  }

  const getEmployeeCount = async () => {
    try {
       const res = await getEmployeeNum()
      if(!res.success) {
        return
      }
      setEmployeeCount(res.data)
    }catch (err) {
    }
  }

  useEffect(() => {
    setColumnsStateMap(getStateMap(pathname))
    getEmployeeCount()
    departmentList({ tree: true }).then(res => {
      if (res.success) {
        setDepartment(res.data)
      }
    })
    getProbationEndEmployeeList().then(res => {
      if (res.success && !isEmpty(res.data)) {
        const updatedList = res.data.map(item => ({
          name: item.name,
          id: item.id,
          probation_period_end_day: item.probation_period_end_day,
          end_diff: item.end_diff,
        }));

        // @ts-ignore
        setProbationEndEmployeeList(updatedList)
        setShowEmployeeEnd(true)
      }
    })
  }, [])

  return (
    <>
      <PageContainer>
        {contextHolder}
        <ProTable<API.EmployeeManagementParams, API.PageParams>
          // headerTitle={intl.formatMessage({
          //   id: 'employeeManagement.table.title',
          //   defaultMessage: 'table list',
          // })}
          headerTitle={
            <Tabs
              items={[{ key: '在职', label: `在职 ${employeeCount.length > 1 ? employeeCount[0]?.num : ''}` }, { key: '离职', label: `离职 ${employeeCount.length > 0 ? employeeCount[1]?.num : ''}` }]}
              onChange={(e) => setStatus(e)}
            />
          }
          scroll={{ x: 'max-content' }}
          params={{ status }}
          toolBarRender={() => [
            <Button
              type="primary"
              key={"addKey"}
              onClick={() => {
                setShowCreateDrawer(true)
                setEmployeeId(0)
                setComponentTitle('新增员工')
              }}
            >
              新增
            </Button>,
            <DownloadButton
              type="primary"
              key="download"
              onDownload={() => exportEmployeeTmpl({ data: {} })} fileName={'模板.xlsx'}
            >
              模板
            </DownloadButton>,
            <DownloadButton
              type="primary"
              key="download"
              onDownload={() => exportEmployee({ data: {} })}
              fileName={'员工信息.xlsx'}
            >
              导出
            </DownloadButton>,
            <Button
              type="primary"
              key={"exportBtn"}
              onClick={() => setShowUpload(true)}
            >
              导入
            </Button>,
            <DeleteButton
              type="primary"
              danger
              key={"deleteBtn"}
              onConfirm={handleBatchDel}
              disabled={!(selectedRowsState.length > 0)}
            >
              批量删除
            </DeleteButton>,
          ]}
          columnEmptyText={false}
          actionRef={actionRef}
          columns={columns}
          request={handleFetchListData}
          rowSelection={{
            onChange: (_, selectedRows) => setSelectedRows(selectedRows)
          }}
          columnsState={{
            value: columnsStateMap,
            onChange: (newState) => {
              setColumnsStateMap(newState)
              setStateMap(pathname, newState)
            }
          }}
        />
      </PageContainer>

      <Modal
        width={600}
        title="异动记录"
        open={showLogs}
        onCancel={() => setShowLogs(false)}
        destroyOnClose={true}
        footer={null}
      >
        <Table
          columns={LogColumns}
          dataSource={currentItem.logs}
        />
      </Modal>

      <Modal
        width={600}
        title="调岗"
        open={shwoReassignment}
        onCancel={handleCloseReassignment}
        destroyOnClose={true}
        footer={null}
      >
        <Reassignment
          currentItem={currentItem}
          handleCloseReassignment={handleCloseReassignment}
          success={success}
          error={error}
          actionRef={actionRef}
        />
      </Modal>

      <Drawer
        width={800}
        title="离职"
        open={showDimission}
        onClose={handleCloseDimission}
        destroyOnClose={true}
      >
        <Dimission
          currentItem={currentItem}
          handleCloseDimission={handleCloseDimission}
          success={success}
          error={error}
          actionRef={actionRef}
        />
      </Drawer>

      <Modal
        // width={600}
        title="上传"
        open={showUpload}
        onCancel={() => setShowUpload(false)}
        destroyOnClose={true}
        onOk={handleUploadOk}
      >
        <UploadFiles fileLength={1} onChange={(file_id) => setFileId(file_id)} />
      </Modal>

      <Modal
        title={""}
        open={showEmployeeEnd}
        onCancel={() => setShowEmployeeEnd(false)}
        onOk={() => setShowEmployeeEnd(false)}
        destroyOnClose={true}
        maskClosable={false}
      >
        {
          probationEndEmployeeList.map((item: any) => (
            <div>{item.name} 距离试用截至日期（{item.probation_period_end_day}）还剩：{item.end_diff}天</div>
          ))
        }
      </Modal>

      <Drawer
        width={1500}
        title={componentTitle}
        open={showCreateDrawer}
        onClose={() => {
          setShowCreateDrawer(false)
        }}
        destroyOnClose={true}
        maskClosable={false}
      >
        <CreateOrUpdate
          eID={employeeId}
          success={success}
          error={error}
          actionRef={actionRef}
          handleCloseCreateOrUpdate={() => { setShowCreateDrawer(false) }}
        />
      </Drawer>
    </>
  )
}

export default EmployeeManagement
