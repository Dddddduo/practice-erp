import React from 'react';
import { Button, Modal } from 'antd';
import { ButtonProps } from 'antd/lib/button';
import { ExclamationCircleOutlined } from '@ant-design/icons';


interface DeleteButtonProps extends ButtonProps {
  title?: string;
  desc?: string;
  okText?: string;
  cancelText?: string;
  onConfirm: () => void;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({
  title = '确认删除？',
  desc = '此操作不可逆，请确认是否继续。',
  okText = '确认',
  cancelText = '取消',
  onConfirm,
  ...buttonProps
}) => {
  const showModal = () => {
    Modal.confirm({
      title: title,
      icon: <ExclamationCircleOutlined />,
      content: desc,
      okText: okText,
      okType: 'danger',
      cancelText: cancelText,
      onOk() {
        onConfirm();
      },
    });
  };

  return <Button {...buttonProps} onClick={showModal} />;
};

export default DeleteButton;
