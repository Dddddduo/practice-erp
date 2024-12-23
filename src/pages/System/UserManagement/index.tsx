// 用户管理组件
import ItemList from './components/ItemList';
import { getList, getRoleList, synchronousData, updateState } from '@/services/ant-design-pro/user';
import { WarningTwoTone } from '@ant-design/icons';
import type { ActionType } from '@ant-design/pro-components';
import { Drawer, message, Modal } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import UpdatePassword from './components/UpdatePassword';
import UpdateUserMessage from './components/UpdateUserMessage';
// import { FormattedMessage, useIntl } from '@umijs/max';
import { PageContainer } from '@ant-design/pro-components';
import { isEmpty } from 'lodash';

const UserManagement: React.FC = () => {
  // 表格实体的引用
  const actionRef = useRef<ActionType>();

  // 当前选中行
  const [currentRow, setCurrentRow] = useState<API.UserManagement>({});

  // 右侧弹出
  const [showDetail, setShowDetail] = useState<boolean>(false);

  // 部门列表
  const [roleList, setRoleList] = useState<{ id: number; name: string }[]>([]);

  // 启用/禁用弹出框
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // 修改密码弹出框
  const [passwordModal, setPasswordModal] = useState<boolean>(false);

  const [title, setTitle] = useState('')

  // 配置Message
  const [messageApi, contextHolder] = message.useMessage();

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

  // 获取用户数据
  const handleFetchListData = useCallback(async ({ current, pageSize, ...parmars }) => {
    const retData = {
      success: false,
      total: 0,
      data: [],
    };
    // 配置参数
    const customParams = {
      page: current,
      page_size: pageSize,
      keyword: parmars['username'] ?? '',
      department: parmars['department'] ?? '',
      roleIds: parmars['user_role'] ?? '',
    };
    try {
      const res = await getList(customParams);
      if (!res.success) {
        return retData;
      }
      retData.success = true;
      retData.total = res.data.lastIndex + 1;
      retData.data = res.data;
    } catch (error) {
      message.error('数据请求异常');
    }
    return retData;
  }, []);

  // 获取角色列表
  const handlerRoleList = async () => {
    const res = await getRoleList({ data: {} });
    if (!res.success) {
      return;
    }
    setRoleList(res.data.map(item => {
      return {
        value: item.id,
        label: item.name,
      }
    }));
  };

  /**
   * 点击修改按钮触发
   *
   * @param record
   */
  const handleUpdate = useCallback(async (record: API.UserManagement) => {
    // console.log('handleUpdate:', record);
    if (isEmpty(record)) {
      setTitle('添加用户')
    } else {
      setTitle('修改用户')
    }
    setCurrentRow(record);
    setShowDetail(true);
  }, []);

  /**
   * 点击禁用/启用按钮触发
   *
   * @param record
   */
  const handleDisable = useCallback(async (record: API.UserManagement) => {
    setCurrentRow(record);
    setIsModalOpen(true);
  }, []);

  const handleDrawerStateClean = () => {
    setCurrentRow({});
    setShowDetail(false);
  };

  // 点击重置密码按钮
  const handleResetPassword = useCallback(async (record: API.UserManagement) => {
    setCurrentRow(record);
    setPasswordModal(true);
  }, []);

  // 重置密码弹框点击确定
  const handlePasswordOk = () => {
    setPasswordModal(false);
  };

  const synchronous = useCallback(async (record: API.UserManagement) => {
    // setCurrentRow(record);
    console.log(record);
    await synchronousData(record.user_id).then((res) => {
      // console.log(res);
      if (res.success) {
        if (actionRef.current) {
          success('同步成功！');
          actionRef.current.reload();
        }
      } else {
        error('同步失败！');
      }
    });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await handlerRoleList();
    };

    fetchData().then((r) => {
      console.log(r);
    });
  }, []);
  return (
    <PageContainer>
      {contextHolder}
      {/* 表格 */}
      <ItemList
        actionRef={actionRef}
        onListData={handleFetchListData}
        roleList={roleList}
        updateMsg={handleUpdate}
        disableUser={handleDisable}
        resetPassword={handleResetPassword}
        synchronous={synchronous}
        success={success}
        error={error}

      />
      {/* 修改用户数据 */}
      <Drawer
        width={600}
        onClose={handleDrawerStateClean}
        destroyOnClose={true}
        closable={false}
        open={showDetail}
        title={title}
      >
        <UpdateUserMessage
          selectedRow={currentRow}
          roleList={roleList}
          actionRef={actionRef}
          onOk={handleDrawerStateClean}
          success={success}
          error={error}
        />
      </Drawer>

      {/* 修改密码弹窗 */}
      <Modal
        width={600}
        open={passwordModal}
        onOk={handlePasswordOk}
        onCancel={() => setPasswordModal(false)}
        destroyOnClose
        footer=""
      >
        <UpdatePassword
          selectedRow={currentRow}
          onQuite={handlePasswordOk}
          success={success}
          error={error}
          actionRef={actionRef}
        />
      </Modal>
    </PageContainer>
  );
};

export default UserManagement;
