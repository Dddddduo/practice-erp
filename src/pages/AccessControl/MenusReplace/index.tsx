import BaseContainer, { ModalType } from '@/components/Container';
import MenuBindUsers from '@/pages/AccessControl/MenusReplace/components/MenuBindUsers';
import UserBindMenus from '@/pages/AccessControl/MenusReplace/components/UserBindMenus';
import { useMenusReplace } from '@/viewModel/AccessControl/useMenusReplace';
import { FormattedMessage, useIntl } from '@@/exports';
import { ClusterOutlined, PlusOutlined, SwapOutlined } from '@ant-design/icons';
import { PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import {Button, Divider, Popconfirm, Space} from 'antd';
import React from 'react';
import CreateOrUpdate from "@/pages/AccessControl/MenusReplace/components/CreateOrUpdate";
import {setStateMap} from "@/utils/utils";

const MenusReplace: React.FC = () => {
  const intl = useIntl();
  const {
    form,
    actionRef,
    contextHolder,
    success,
    error,
    fetchListData,
    modalStatus,
    openModal,
    closeModal,
    bindData,
    handleChangeTop,
    handleCheck,
    submitBind,
    onLevel1Change,
    onLevel2Change,
    onLevel3Change,
    onUserChange,
    onSubmit,
    getCurrent,
    handleDelete,
    formData,
    onChangeColumnsStateMap,
    handleFinished
  } = useMenusReplace();
  const columns: ProColumns<API.MenusListParams>[] = [
    {
      title: <FormattedMessage id="menus.field.id" defaultMessage="序号" />,
      dataIndex: 'id',
      search: false,
      align: 'center',
      render: (dom, entity, index) => <div>{index + 1}</div>,
    },
    {
      title: <FormattedMessage id="menus.field.name" defaultMessage="名称" />,
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: <FormattedMessage id="menus.field.icon" defaultMessage="图标" />,
      dataIndex: 'icon',
      search: false,
      align: 'center',
    },
    {
      title: <FormattedMessage id="menus.field.pid" defaultMessage="上级菜单" />,
      dataIndex: 'pid',
      search: false,
      align: 'center',
    },
    {
      title: <FormattedMessage id="menus.field.level" defaultMessage="级别" />,
      dataIndex: 'level',
      search: false,
      align: 'center',
    },
    {
      title: <FormattedMessage id="menus.field.sort_by" defaultMessage="排序值" />,
      dataIndex: 'sort_by',
      search: false,
      align: 'center',
    },
    {
      title: <FormattedMessage id="menus.field.action" defaultMessage="操作" />,
      dataIndex: 'action',
      search: false,
      align: 'center',
      render: (dom,entity) => (
        <Space>
          <Button
            type="primary"
            onClick={() => {
              openModal({
                title: '修改',
                type: 'update',
              });
              getCurrent(entity)
              console.log('修改时拿到的当前项数据', entity)
            }}
          >
            修改
          </Button>
          <Popconfirm title="删除" description="您确定要删除吗？" onConfirm={() => handleDelete(entity)}>
            <Button danger>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  // console.log('bindData.userBindMenus.treeData', bindData.userBindMenus.treeData);
  return (
    <PageContainer>
      {contextHolder}
      <ProTable<API.MenusListParams, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'menus.table.title',
          defaultMessage: 'table list',
        })}
        rowKey={'id'}
        actionRef={actionRef}
        scroll={{ x: 'max-content' }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            icon={<ClusterOutlined />}
            onClick={() => {
              openModal({
                title: (
                  <div>
                    用户
                    <SwapOutlined style={{ margin: '0 10px' }} />
                    菜单
                  </div>
                ),
                type: 'bind',
              });
            }}
          >
            <FormattedMessage id="pages.searchTable.bind" defaultMessage="Bind" />
          </Button>,
          <Button
            type="primary"
            key="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              openModal({
                title: '创建',
                type: 'create',
              });
            }}
          >
            <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          </Button>,
        ]}
        columns={columns}
        request={fetchListData}
        columnsState={{
          value:formData.columnsStateMap,
          onChange: (newState) => {
            onChangeColumnsStateMap(newState);
          },
        }}
      ></ProTable>

      <BaseContainer
        width={modalStatus.type === 'bind' ? '1200px' : '600px'}
        title={modalStatus.title}
        type={ModalType.Drawer}
        open={modalStatus.visible}
        onCancel={closeModal}
        destroyOnClose={true}
      >
        {modalStatus.type === 'bind' ? (
          <>
            <UserBindMenus
              userList={bindData.userBindMenus.userList}
              treeData={bindData.userBindMenus.treeData}
              handleChange={handleChangeTop}
              handleCheck={handleCheck}
              submitBind={submitBind}
              checkedKeys={bindData.userBindMenus.checkedKeys}
              hrefCheckedKeys={bindData.userBindMenus.hrefCheckedKeys}
            />
            <Divider />
            <MenuBindUsers
              userList={bindData.menuBindUsers.userList}
              options={bindData.menuBindUsers.options}
              selectedLevel1={bindData.menuBindUsers.selectedLevel1}
              selectedLevel2={bindData.menuBindUsers.selectedLevel2}
              selectedLevel3={bindData.menuBindUsers.selectedLevel3}
              userIds={bindData.menuBindUsers.userIds}
              onLevel1Change={onLevel1Change}
              onLevel2Change={onLevel2Change}
              onLevel3Change={onLevel3Change}
              onUserChange={onUserChange}
              onSubmit={onSubmit}
            />
          </>
        ) : (
          <CreateOrUpdate formData={formData} handleFinished={handleFinished} form={form} closeModal={closeModal} />
        )}
      </BaseContainer>
    </PageContainer>
  );
};

export default MenusReplace;
