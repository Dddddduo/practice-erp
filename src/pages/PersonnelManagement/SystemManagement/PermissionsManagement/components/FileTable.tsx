import { ProColumns, ProTable } from "@ant-design/pro-components";
import { useIntl } from "@umijs/max";
import { Button, Checkbox, Drawer, Form, List, Modal, Space } from "antd";
import React, {useEffect, useState} from "react"
import PermissionBinding from "../../DocumentList/components/PermissionBinding";
import { storeUpdatePermission } from "@/services/ant-design-pro/system"
import {getStateMap, setStateMap} from "@/utils/utils";
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

const FileTable: React.FC<ItemListProps> = ({
  onListData,
  actionRef,
  success,
  error,
}) => {
  const [form] = Form.useForm()
  const intl = useIntl()
  const [showBind, setShowBind] = useState(false)
  const [folder, setFolder]: any = useState()
  const [change, setChange] = useState(false)

  const [columnsStateMap, setColumnsStateMap] = useState({});
  const location = useLocation();
  const currentPath = location.pathname;
  const pathname = currentPath.split('/')[currentPath.split('/').length - 1]

  const columns: ProColumns<API.FileTableParams>[] = [
    {
      title: "ID",
      search: false,
      align: 'center',
      dataIndex: 'id',
    },
    {
      title: "Pid",
      search: false,
      align: 'center',
      dataIndex: 'parent_id',
    },
    {
      title: "文件夹名",
      align: 'center',
      dataIndex: 'name',
    },
    {
      title: "路径",
      search: false,
      align: 'center',
      dataIndex: 'path',
    },
    {
      title: "创建时间",
      search: false,
      align: 'center',
      dataIndex: 'created_at',
    },
    {
      title: "修改时间",
      search: false,
      align: 'center',
      dataIndex: 'updated_at',
    },
    {
      title: "操作",
      search: false,
      align: 'center',
      dataIndex: '',
      render: (dom, entity) => (
        <Space>
          <Button type="primary" onClick={() => {
            console.log(entity);
            setFolder(entity)
            setShowBind(true)
          }}>分配</Button>
        </Space>
      )
    },
  ]

  const handleCloseBind = () => {
    setShowBind(false)
  }

  const handleSubmit = (item, record) => {
    const params = {
      user_ids: [item.user_id] ?? [],
      // department_ids: values.department ?? [],
      can_view: item.download_permission ?? 1,
      can_upload: item.upload_permission ?? 1
    }
    storeUpdatePermission(params, record.id).then(res => {
      if (res.success) {
        actionRef.current.reload()
        success('绑定成功')
        return
      }
      error(res.message)
    })
  }

  useEffect(() => {
    setColumnsStateMap(getStateMap(pathname))
  }, []);

  return (
    <>
      <ProTable<API.FileTableParams, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'fileTable.table.title',
          defaultMessage: 'table list',
        })}
        actionRef={actionRef}
        scroll={{ x: 'max-content' }}
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <>
          </>
        ]}
        columnEmptyText={false}
        form={{
          form
        }}
        // expandable={{
        //   expandedRowRender: (record) => expandableList(record),
        // }}
        request={onListData}
        columns={columns}
        columnsState={{
          value: columnsStateMap,
          onChange: (newState) => {
            setColumnsStateMap(newState)
            setStateMap(pathname, newState)
          }
        }}
      />

      <Drawer
        width={800}
        open={showBind}
        destroyOnClose={true}
        onClose={handleCloseBind}
        footer={null}
        title="权限分配"
      >
        <PermissionBinding
          folder={folder}
          handleCloseBind={handleCloseBind}
          success={success}
          error={error}
        // currentItem={currentItem}
        // openFileZip={openFileZip}
        // isUpload={isUpload}
        />
      </Drawer>
    </>
  )
}

export default FileTable
