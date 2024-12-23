import React, {useEffect, useState} from "react"
import {ParamsType, ProColumns, ProTable} from "@ant-design/pro-components"
import {FormattedMessage, useIntl} from "@umijs/max"
import {Button, Drawer, Popconfirm, Space} from "antd"
import {PlusOutlined} from "@ant-design/icons"
import Addsystem from "./Addsystem"
import {maintManagersDel} from "@/services/ant-design-pro/system"
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

const ItemList: React.FC<ItemListProps> = ({
                                             onListData,
                                             actionRef,
                                             success,
                                             error,
                                           }) => {
  const intl = useIntl()

  const [showDetailDrawer, setShowDetailDrawer] = useState(false)
  const [currentMsg, setCurrentMsg] = useState()
  const [title, setTitle] = useState('')
  const [columnsStateMap, setColumnsStateMap] = useState({});
  const location = useLocation();
  const currentPath = location.pathname;
  const pathname = currentPath.split('/')[currentPath.split('/').length - 1]

  const columns: ProColumns<API.ConstructionHead>[] = [
    {
      title: (
        <FormattedMessage
          id="constructionHead.field.id"
          defaultMessage="ID"
        />
      ),
      dataIndex: 'id',
      search: false,
      align: "center"
    },
    {
      title: (
        <FormattedMessage
          id="constructionHead.field.username"
          defaultMessage="姓名"
        />
      ),
      dataIndex: 'username',
      align: "center",
      search: {
        title: null
      }
    },
    {
      title: (
        <FormattedMessage
          id="constructionHead.field.tel"
          defaultMessage="手机号"
        />
      ),
      dataIndex: 'tel',
      search: false,
      align: "center"
    },
    {
      title: (
        <FormattedMessage
          id="constructionHead.field.id_number"
          defaultMessage="身份证号"
        />
      ),
      dataIndex: 'id_number',
      search: false,
      align: "center"
    },
    {
      title: (
        <FormattedMessage
          id="constructionHead.field.operate"
          defaultMessage="操作"
        />
      ),
      dataIndex: 'operate',
      search: false,
      align: "center",
      render: (dom: any, entity) => {
        return (
          <Space>
            <Button type="primary"
                    onClick={() => {
                      openDetailDrawer(entity)
                      setTitle('修改负责人')
                    }}
            >
              编辑
            </Button>
            <Popconfirm
              title="警告"
              description="确定要删除吗"
              okText="确定"
              cancelText="取消"
              onConfirm={() => {
                handleConfirm(entity)
              }}
            >
              <Button type="primary" danger>
                删除
              </Button>
            </Popconfirm>
          </Space>
        )
      }
    }
  ]
  const handleConfirm = (e) => {
    maintManagersDel({id: e.id}).then((res) => {
      if (res.success) {
        actionRef?.current.reload()
        success('删除成功')
        return
      }
      error(res.message)
    })
  }
  const openDetailDrawer = (e) => {
    setCurrentMsg(e)
    setShowDetailDrawer(true)
  }
  const handleClose = () => {
    setCurrentMsg(undefined)
    setShowDetailDrawer(false)
  }

  useEffect(() => {
    setColumnsStateMap(getStateMap(pathname))
  }, []);

  return (
    <>
      <ProTable<API.ConstructionHead, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'ConstructionHead.table.title',
          defaultMessage: 'table list',
        })}

        toolBarRender={() => [
          <>
            <Button
              type="primary"
              key="primary"
              onClick={() => {
                setShowDetailDrawer(true)
                setTitle('添加负责人')
              }}
            >
              <PlusOutlined/>
              <FormattedMessage id="pages.searchTable.new" defaultMessage="New"/>
            </Button>
          </>
        ]}
        columnEmptyText={false}
        scroll={{x: 'max-content'}}
        actionRef={actionRef}
        columns={columns}
        request={onListData}
        columnsState={{
          value: columnsStateMap,
          onChange: (newState) => {
            setColumnsStateMap(newState)
            setStateMap(pathname, newState)
          }
        }}
      />
      <Drawer
        width={600}
        title={title}
        open={showDetailDrawer}
        onClose={handleClose}
        destroyOnClose={true}
      >
        <Addsystem
          handleClose={handleClose}
          actionRef={actionRef}
          success={success}
          error={error}
          currentMsg={currentMsg}
        />
      </Drawer>
    </>
  )
}
export default ItemList
