
import React, { useEffect, useState } from "react"
import { Modal, Input, message } from 'antd';
import { checkPasswd } from "@/services/ant-design-pro/air";
import { LocalStorageService } from '@/utils/utils';

interface ItemListProps {
    open: boolean,
    successCallback: () => void
    cancelCallback: () => void
}

const PasswordDialog: React.FC<ItemListProps> = ({
    open,
    successCallback,
    cancelCallback,
}) => {

    const [input, setInput] = useState('')
    const [messageApi, contextHolder] = message.useMessage();

    const handleOk = async () => {
        // 验证密码
        const res = await checkPasswd(input)
        console.log('验证密码', res);
        if (res.success) {
            // 验证密码成功
            const currentTime = Date.now()
            LocalStorageService.setItem('password_time', currentTime.toString())

            successCallback()
        } else {
            // 验证密码失败
            errorToast()
        }
    }


    const errorToast = () => {
        messageApi.open({
            type: 'error',
            content: '密码输入错误',
        });
    };

    const inputChange = (e: any) => {
        console.log('打印输入内容', e.target.value);
        setInput(e.target.value)
    }


    useEffect(() => {
        console.log('PasswordDialog页面，需要实时请求 <-----------------------------------------');

    }, [])

    return (
        <>
            {
                open && <Modal title="请输入密码" open={open} onOk={handleOk} onCancel={cancelCallback}>
                    <Input.Password placeholder="请输入密码" onChange={(e) => inputChange(e)} style={{ marginTop: '10px', marginBottom: '10px' }} />
                </Modal>
            }
        </>
    )
}

export default PasswordDialog