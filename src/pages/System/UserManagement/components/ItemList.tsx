import {FormattedMessage, useIntl, useLocation} from '@@/exports';
import { PlusOutlined } from '@ant-design/icons';
import { ActionType, ParamsType, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, Modal, Tag } from 'antd';
import React, {RefObject, useEffect, useState} from 'react';
import EmailManagement from './EmailManagement';
import DeleteButton from '@/components/Buttons/DeleteButton';
import { updateState } from '@/services/ant-design-pro/user';
import {getStateMap, setStateMap} from "@/utils/utils";

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

type HandleListDataFunc = (
  params: HandleListDataParams,
  sort: ParamsType,
) => Promise<HandleListDataReturnType>;

interface ItemListProps {
  actionRef: RefObject<ActionType>;
  onListData: HandleListDataFunc;
  roleList: { value: number; label: string }[];
  updateMsg: (entity: API.UserManagement) => void;
  disableUser: (entity: API.UserManagement) => void;
  resetPassword: (entity: API.UserManagement) => void;
  synchronous: (entity: API.UserManagement) => void;
  success: (text) => void
  error: (text) => void
}

const ItemList: React.FC<ItemListProps> = ({
  actionRef,
  onListData,
  roleList,
  updateMsg,
  disableUser,
  resetPassword,
  synchronous,
  success,
  error
}) => {
  const intl = useIntl();
  const [showEmailManagement, setShowEmailManagement] = useState(false)
  const [currentItem, setCurrentItem] = useState({})

  const [columnsStateMap, setColumnsStateMap] = useState({});
  const location = useLocation();
  const currentPath = location.pathname;
  const pathname = currentPath.split('/')[currentPath.split('/').length - 1]

  const columns: ProColumns<API.UserListItem>[] = [
    {
      title: <FormattedMessage id="user.field.id" defaultMessage="用户ID" />,
      dataIndex: 'user_id',
      align: "center",
      search: false,
    },
    {
      title: <FormattedMessage id="user.field.name" defaultMessage="姓名" />,
      dataIndex: 'username',
      align: "center",
    },
    {
      title: <FormattedMessage id="user.field.username_en" defaultMessage="英文名" />,
      dataIndex: 'username_en',
      align: "center",
      search: false,
    },
    {
      title: <FormattedMessage id="user.table.role" defaultMessage="角色" />,
      dataIndex: 'user_role',
      align: "center",
      valueType: 'select',
      valueEnum: roleList.reduce((acc, item) => {
        acc[`${item.value}`] = item.label;
        return acc;
      }, {}),
      fieldProps: {
        showSearch: true
      },

    },
    {
      title: <FormattedMessage id="user.table.gender" defaultMessage="性别" />,
      dataIndex: 'gender',
      align: "center",
      search: false,
      render: (entity) => {
        return <div>{entity === '1' ? '男' : '女'}</div>;
      },
    },
    {
      title: <FormattedMessage id="user.table.posts" defaultMessage="职位" />,
      dataIndex: 'position_en',
      align: "center",
      search: false,
    },
    {
      title: <FormattedMessage id="user.table.phone" defaultMessage="手机号" />,
      dataIndex: 'tel',
      align: "center",
      search: false,
    },
    {
      title: <FormattedMessage id="user.table.mailbox" defaultMessage="邮箱" />,
      dataIndex: 'email',
      align: "center",
      search: false,
    },
    {
      title: <FormattedMessage id="user.table.mail" defaultMessage="是否接收邮件" />,
      dataIndex: 'is_email_receive',
      align: "center",
      search: false,
      render: (entity) => {
        return <div>{entity === 0 ? '否' : '是'}</div>;
      },
    },
    {
      title: <FormattedMessage id="user.table.idCard" defaultMessage="身份证号" />,
      dataIndex: 'id_number',
      align: "center",
      search: false,
    },
    {
      title: <FormattedMessage id="user.table.address" defaultMessage="地址" />,
      dataIndex: 'address',
      align: "center",
      search: false,
    },
    {
      title: <FormattedMessage id="user.table.department" defaultMessage="部门" />,
      dataIndex: 'department',
      align: "center",
      formItemProps: {
        label: '员工部门',
      },
    },
    {
      title: <FormattedMessage id="user.table.Onboarding" defaultMessage="入职日期" />,
      dataIndex: 'hire_date',
      align: "center",
      search: false,
      sorter: true,
    },
    {
      title: <FormattedMessage id="user.table.contract" defaultMessage="合同到期" />,
      dataIndex: 'due_date',
      align: "center",
      search: false,
      sorter: true,
    },
    {
      title: <FormattedMessage id="user.table.state" defaultMessage="状态" />,
      dataIndex: 'user_state',
      align: "center",
      search: false,
      render: (entity) => {
        return (
          <Tag color={entity === 1 ? 'green' : 'magenta'}>{entity === 1 ? '正常' : '禁用'}</Tag>
        );
      },
    },
    {
      title: "同步状态",
      dataIndex: 'synchronization',
      align: "center",
      search: false,
      render: (_, entity) => {
        return (
          <>
            {
              entity?.qy_wx_code ?
                <Tag
                  color='green'
                  style={{
                    cursor: 'pointer'
                  }}
                  onClick={() => synchronous(entity)}
                >
                  {entity?.qy_wx_code}
                </Tag> :
                <Tag
                  color='red'
                  style={{
                    cursor: 'pointer'
                  }}
                  onClick={() => synchronous(entity)}
                >
                  未同步
                </Tag>
            }
          </>
          // <Tag color={entity === 1 ? 'green' : 'magenta'}>{entity === 1 ? '正常' : '禁用'}</Tag>
        );
      },
    },
    {
      title: <FormattedMessage id="user.table.operate" defaultMessage="操作" />,
      search: false,
      valueType: 'option',
      align: "center",
      render: (_, entity) => {
        return [
          // 第一个按钮
          <Button type="primary" key="update" onClick={() => updateMsg(entity)}>
            <FormattedMessage id="user.button.update" defaultMessage="Update" />
          </Button>,
          // 第二个按钮
          <>
            {
              entity?.user_state ?
                <DeleteButton
                  danger
                  title={`确认要禁用${entity.username}吗？`}
                  desc={'是否继续？'}
                  onConfirm={() => handleUpdateState(entity)}
                >
                  <FormattedMessage id="user.button.disable" defaultMessage="Disable" />
                </DeleteButton> :
                <DeleteButton
                  title={`确认要启用${entity.username}吗？`}
                  style={{ border: '1px solid green', color: 'green' }}
                  desc={'是否继续？'}
                  onConfirm={() => handleUpdateState(entity)}
                >
                  <FormattedMessage id="user.button.undisable" defaultMessage="unDisable" />
                </DeleteButton>
            }
            {/* <Button key="disable" onClick={() => disableUser(entity)}>
              {entity?.user_state ? (
                <FormattedMessage id="user.button.disable" defaultMessage="Disable" />
              ) : (
                <FormattedMessage id="user.button.undisable" defaultMessage="unDisable" />
              )}
            </Button> */}
          </>
          ,
          // 第三个按钮
          <Button type="primary" key="reset" onClick={() => resetPassword(entity)}>
            <FormattedMessage id="user.button.reset" defaultMessage="Reset" />
          </Button>,
          // 第四个按钮
          <Button key="synchronous" type="primary" onClick={() => {
            setShowEmailManagement(true)
            setCurrentItem(entity)
          }}>
            <FormattedMessage id="user.button.emailManagement" defaultMessage="Email Management" />
          </Button>,
          // 第五个按钮
          // <Button key="synchronous" type="primary" ghost onClick={() => synchronous(entity)}>
          //   {!entity?.qy_wx_code && (
          //     <FormattedMessage id="user.button.synchronous" defaultMessage="Synchronous" />
          //   )}
          //   {entity?.qy_wx_code}
          // </Button>,

        ];
      },
    },
  ];

  const handleUpdateState = (entity) => {
    updateState({ user_id: entity.user_id ?? '', user_state: entity.user_state ? false : true }).then((res) => {
      if (res.success) {
        if (actionRef.current) {
          actionRef.current.reload();
          success('处理成功')
          return
        }
        return
      }
      error(res.message)
    });
  }

  const handleCloseEmailManagement = () => {
    setCurrentItem({})
    setShowEmailManagement(false)
  }

  useEffect(() => {
    setColumnsStateMap(getStateMap(pathname))
  }, []);

  return (
    <>
      <ProTable<API.UserListItem, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'user.table.title',
          defaultMessage: 'table list',
        })}
        actionRef={actionRef}
        scroll={{ x: 'max-content' }}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => updateMsg({})}
          >
            <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          </Button>,
        ]}
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

      <Modal
        width={600}
        open={showEmailManagement}
        onCancel={handleCloseEmailManagement}
        destroyOnClose={true}
        footer={null}
        title="邮箱管理"
      >
        <EmailManagement
          handleCloseEmailManagement={handleCloseEmailManagement}
          currentItem={currentItem}
          success={success}
          error={error}
          actionRef={actionRef}
        />
      </Modal>
    </>
  );
};
export default ItemList;
