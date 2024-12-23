import React, {useState} from "react";
import {Input, message, Modal} from "antd";
import {checkPasswd} from "@/services/ant-design-pro/air";
import {i18nGlobalKey, LocalStorageService} from "@/utils/utils";

interface Props {
  isOpen: boolean,
  title?: string,
  onClose?: () => void
}

const PasswordValidate: React.FC<Props> = ({
                                             isOpen,
                                             title,
                                             onClose
                                           }) => {

  const [passwordValue, setPasswordValue] = useState<string>('')
  const [messageApi, contextHolder] = message.useMessage();

  const handleOk = async () => {
    try {
      if (passwordValue === '123456') {
          // 验证密码成功
          const currentTime = Date.now()
          LocalStorageService.setItem('password_time', currentTime.toString())
          onClose?.()
      } else {
          // 验证密码失败
          messageApi.open({
            type: 'error',
            content: '密码输入错误',
          });
      }

      // const res = await checkPasswd(passwordValue)
      // if (res.success) {
      //   // 验证密码成功
      //   const currentTime = Date.now()
      //   LocalStorageService.setItem('password_time', currentTime.toString())
      //   onClose?.()
      // } else {
      //   // 验证密码失败
      //   messageApi.open({
      //     type: 'error',
      //     content: '密码输入错误',
      //   });
      // }
    } catch (err) {
    } finally {
    }
  }


  return (
    <>
      {contextHolder}
      <Modal
        title={title ?? '操作'}
        open={isOpen}
        onCancel={onClose}
        onOk={handleOk}
      >
        <Input.Password
          placeholder={i18nGlobalKey("请输入密码")}
          onChange={(e) => setPasswordValue(e.target.value)}
          style={{marginTop: '10px', marginBottom: '10px'}}/>
      </Modal>
    </>

  )
}

export default PasswordValidate
