import React, { RefObject, useEffect, useState } from "react"
import type { ActionType, ParamsType } from "@ant-design/pro-components";
import { ProTable, ProColumns } from "@ant-design/pro-components";
import { useIntl, FormattedMessage } from "@umijs/max";
import { Button, Space, Tag, Form, Drawer } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import CreateOrEdit from "./CreateOrEdit";
import KpiModal from "@/pages/PersonnelManagement/Performance/KPIAppraisalProject/components/KpiModal";
import {getStateMap, handleParseStateChange, setStateMap} from "@/utils/utils";
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
  actionRef: RefObject<ActionType>;
  success: (text: string) => void
  error: (text: string) => void
}

const ItemList: React.FC<ItemListProps> = ({
  actionRef,
  onListData,
  success,
  error
}) => {
  const [form] = Form.useForm()
  const intl = useIntl()
  const [showCreateOrEdit, setShowCreateOrEdit] = useState(false)
  const [currentItem, setCurrentItem] = useState({})
  const [title, setTitle] = useState('')
  const [columnsStateMap, setColumnsStateMap] = useState({});
  const location = useLocation();
  const currentPath = location.pathname;
  const pathname = currentPath.split('/')[currentPath.split('/').length - 1]

  const columns: ProColumns<API.KpiWorkerParams>[] = [
    {
      title: (
        <FormattedMessage
          id="kpiWorker.field.id"
          defaultMessage="ID"
        />
      ),
      dataIndex: 'id',
      search: false,
      align: 'center',
      render: (dom, entity, index) => {
        return (
          <div>{index + 1}</div>
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="kpiWorker.field.assessmentProject"
          defaultMessage="考核项目"
        />
      ),
      dataIndex: 'item',
      align: 'center',
    },
    {
      title: (
        <FormattedMessage
          id="kpiWorker.field.score"
          defaultMessage="分数"
        />
      ),
      dataIndex: 'score',
      search: false,
      align: 'center',
    },
    {
      title: (
        <FormattedMessage
          id="kpiWorker.field.metric"
          defaultMessage="细分指标"
        />
      ),
      dataIndex: 'info',
      search: false,
      align: 'center',
      render: (dom, entity) => (
        <>
          {
            entity.info.map((item, index) => {
              return (
                <div key={index}>
                  <span style={{ marginRight: 20 }}>{item.score_index}</span>
                  <span style={{ marginRight: 10 }}>{item.rate}%</span>
                  <span>{item.content}</span>
                </div>
              )
            })
          }
        </>
      )
    },
    {
      title: (
        <FormattedMessage
          id="kpiWorker.field.remark"
          defaultMessage="备注"
        />
      ),
      dataIndex: 'remark',
      align: 'center',
    },
    {
      title: (
        <FormattedMessage
          id="kpiWorker.field.action"
          defaultMessage="操作"
        />
      ),
      dataIndex: 'action',
      search: false,
      align: 'center',
      render: (dom, entity) => {
        return (
          <Button type="primary" onClick={() => {
            setCurrentItem(entity)
            setTitle('编辑')
            setShowCreateOrEdit(true)
          }}>编辑</Button>
        )
      }
    },
  ]

  const handleCloseCreateOrEdit = () => {
    setCurrentItem({})
    setTitle('')
    setShowCreateOrEdit(false)
    actionRef.current?.reload()
  }

  const handleValueChange: any = (path: string, value: any) => {
    const newData = handleParseStateChange(currentItem, path, value)
    setCurrentItem(newData)
  };

  const changeCurrentRecord = (data) => {
    setCurrentItem(data)
  }

  useEffect(() => {
    setColumnsStateMap(getStateMap(pathname))
  }, []);

  return (
    <>
      <ProTable<API.KpiWorkerParams, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'kpiWorker.table.title',
          defaultMessage: 'table list',
        })}
        actionRef={actionRef}
        scroll={{ x: 'max-content' }}
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setTitle('新增')
              setShowCreateOrEdit(true);
            }}
            icon={<PlusOutlined />}
          >
            <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          </Button>,
        ]}
        columnEmptyText={false}
        form={{
          form
        }}
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

      <KpiModal
        visible={showCreateOrEdit}
        currentRecord={{...currentItem, type: "fm"}}
        onValueChange={handleValueChange}
        onClose={() => {
          setShowCreateOrEdit(false)
          setCurrentItem({})
        }}
        changeCurrentRecord={changeCurrentRecord}
        actionRef={actionRef}
      />

      {/*<Drawer*/}
      {/*  width={1000}*/}
      {/*  open={showCreateOrEdit}*/}
      {/*  onClose={handleCloseCreateOrEdit}*/}
      {/*  destroyOnClose={true}*/}
      {/*  title={title}*/}
      {/*>*/}
      {/*  <CreateOrEdit*/}
      {/*    success={success}*/}
      {/*    error={error}*/}
      {/*    handleCloseCreateOrEdit={handleCloseCreateOrEdit}*/}
      {/*    actionRef={actionRef}*/}
      {/*    currentItem={currentItem}*/}
      {/*  />*/}
      {/*</Drawer>*/}
    </>
  )
}

export default ItemList
