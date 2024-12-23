import React, {useState} from 'react';
import {Button, FormInstance, Modal} from 'antd';
import {ButtonProps} from 'antd/lib/button';

interface SubmitButtonProps extends ButtonProps {
  buttonProps?: ButtonProps; // 使用buttonProps包含所有Button的props
  form?: FormInstance<any>; // 让form成为可选属性
  confirmTitle?: string;
  confirmDesc?: string;
  onConfirm?: () => Promise<any> | void;  // 确保onConfirm是一个返回Promise的异步函数
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
                                                     form,
                                                     confirmTitle = '确认提交？',
                                                     confirmDesc = '请确认信息填写无误后提交。',
                                                     onConfirm,
                                                     children,
                                                     ...buttonProps
                                                   }) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!onConfirm) return;

    try {
      setLoading(true);
      await onConfirm();
    } catch (error) {
      console.error('Error during confirmation:', error);
    } finally {
      setLoading(false);
    }

    return
  };

  const handleFormSubmit = async (form: FormInstance) => {
    try {
      setLoading(true);
      form.submit();
    } finally {
      setLoading(false);
    }
    return
  }

  const showModal = () => {
    Modal.confirm({
      title: confirmTitle,
      content: confirmDesc,
      onOk: async () => {
        if (form) {
          return handleFormSubmit(form)
        }

        return handleConfirm();
      },
    });
  };

  return (
    <Button
      {...buttonProps}
      loading={loading}
      onClick={showModal}
      disabled={loading || buttonProps?.disabled}
    >
      {children}
    </Button>
  );
};

export default SubmitButton;
