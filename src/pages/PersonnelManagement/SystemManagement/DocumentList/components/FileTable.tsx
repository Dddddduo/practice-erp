import { ProColumns, ProTable } from "@ant-design/pro-components";
import { useIntl } from "@umijs/max";
import { Button, Form, Modal, Space } from "antd";
import React, { useState } from "react"
import PermissionBinding from "./PermissionBinding";


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
      dataIndex: 'pid',
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

  const reloadTable = () => {
    actionRef.current.reload()
  }

  return (
    <>
      <ProTable<API.FileTableParams, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'fileTable.table.title',
          defaultMessage: 'table list',
        })}
        style={{ marginTop: 50 }}
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
        request={onListData}
        columns={columns}
      />

      <Modal
        width={600}
        open={showBind}
        destroyOnClose={true}
        onCancel={handleCloseBind}
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
      </Modal>
    </>
  )
}

export default FileTable