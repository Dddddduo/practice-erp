import {useViewSimManagement} from "@/viewModel/System/DeviceManagement/useViewSimManagement";
import {PageContainer, ProColumns, ProTable} from "@ant-design/pro-components";
import {Button, Space, Tag} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {FormattedMessage, useIntl} from "@@/exports";
import {setStateMap} from "@/utils/utils";
import React from "react";
import SimDetail from "@/pages/System/DeviceManagement/SimManagement/components/SimDetail";

const SimManagement = () => {
  const intl = useIntl()
  const {
    form,
    actionRef,
    contextHolder,
    handleFetchListData,
    columnsStateMap,
    pathname,
    baseData,
    openData,
    success,
    error,
    setColumnsStateMap,
    handleCreateOrUpdate,
    handleCloseDrawer,
    handleFinishForm,
    handleChangeStatus,
  } = useViewSimManagement(intl)

  const statusMap = {
    0: {
      title: '停用',
      color: 'red'
    },
    1: {
      title: '启用',
      color: 'green'
    },
  }

  const columns: ProColumns<API.SimParams>[] = [
    {
      title: '序号',
      dataIndex: 'id',
      search: false,
      align: 'center',
      render: (dom, entity, index) => (
        <div>{index + 1}</div>
      )
    },
    {
      title: '卡号',
      dataIndex: 'card_no',
      align: 'center',
    },
    {
      title: 'ICC ID',
      dataIndex: 'icc_id',
      align: 'center',
    },
    {
      title: '运营商名称',
      dataIndex: 'operator_name',
      search: false,
      align: 'center',
    },
    {
      title: '供应商名称',
      dataIndex: 'vendor_name',
      search: false,
      align: 'center',
    },
    {
      title: '启用状态',
      dataIndex: 'status',
      search: false,
      align: 'center',
      render: (dom, entity, index) => (
        <Tag
          color={statusMap[entity?.status].color}
        >
          {statusMap[entity?.status].title}
        </Tag>
      )
    },
    {
      title: '剩余流量',
      dataIndex: 'threshold',
      search: false,
      align: 'center',
      render: (dom, entity, index) => (<>{dom}MB</>)
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      search: false,
      align: 'center',
    },
    {
      title: '有效开始',
      dataIndex: 'start_at',
      search: false,
      align: 'center',
    },
    {
      title: '有效结束',
      dataIndex: 'end_at',
      search: false,
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'action',
      search: false,
      align: 'center',
      render: (dom, entity, index) => (
        <Space>
          <Button type="primary" onClick={() => handleCreateOrUpdate(entity, 'update')}>修改</Button>
        </Space>
      )
    },
  ]

  return (
    <PageContainer>
      {contextHolder}
      <ProTable<API.SimParams, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'simManagement.table.title',
          defaultMessage: 'table list',
        })}
        actionRef={actionRef}
        scroll={{ x: 'max-content' }}
        rowKey="id"
        search={{
          labelWidth: 120,
          // span: 6,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            icon={<PlusOutlined />}
            onClick={() => handleCreateOrUpdate(null, 'create')}
          >
            <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          </Button>,
        ]}
        columnEmptyText={false}
        request={handleFetchListData}
        columns={columns}
        columnsState={{
          value: columnsStateMap,
          onChange: (newState) => {
            setColumnsStateMap(newState)
            setStateMap(pathname, newState)
          }
        }}
      />

      {
        openData?.detail &&
        <SimDetail
          form={form}
          baseData={baseData}
          openData={openData}
          handleCloseDrawer={handleCloseDrawer}
          handleFinishForm={handleFinishForm}
          handleChangeStatus={handleChangeStatus}
        />
      }
    </PageContainer>
  )
}

export default SimManagement
