import Process from "./Process"
import { Button, Form, Input, Select, Space } from 'antd';
import { DatePicker } from "antd";
import { getInitData, createOrUpdat, switchCheckStatus } from "@/services/ant-design-pro/project";
import { useEffect, useState } from "react";
import type { SelectProps } from 'antd';
import { Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import GkUpload from "@/components/UploadImage/GkUpload";
import dayjs from "dayjs";

interface ItemListProps {
    handleClose,
    actionRef,
    currentMsg,
    currentItem,
    getList: () => void
    success: (text: string) => void,
    error: (text: string) => void
}

const type = [
    {
        value: 'high',
        label: '高'
    },
    {
        value: 'middle',
        label: '中'
    },
    {
        value: 'low',
        label: '低'
    }
]

const Stage: React.FC<ItemListProps> = ({
    handleClose,
    actionRef,
    currentMsg,
    currentItem,
    getList,
    success,
    error
}) => {

    const [form] = Form.useForm()
    const { RangePicker } = DatePicker;
    const [initData, setInitData]: any = useState([])

    const handleFinsh = (values) => {
        const fileIds = values.upload.map(item => item.id)
        let params
        if (values.created) {
            values.start_at = dayjs(values.created[0].$d).format('YYYY-MM-DD')
            values.end_at = dayjs(values.created[1].$d).format('YYYY-MM-DD')
        }

        if (currentItem) {
            params = {
                process_type: values?.process_type ?? '',
                process_desc: values?.process_desc ?? '',
                degree: values?.degree ?? '',
                start_at: values?.start_at ?? '',
                end_at: values?.end_at ?? '',
                project_process_id: currentMsg?.id ?? '',
                project_process_detail_id: currentItem?.id ?? '',
                process_file_ids: fileIds.join(','),
                check_uids: '1',
                process: 1,
            }
        } else {
            params = {
                process_type: values?.process_type ?? '',
                process_desc: values?.process_desc ?? '',
                degree: values?.degree ?? '',
                start_at: values?.start_at ?? '',
                end_at: values?.end_at ?? '',
                project_process_id: currentMsg?.id ?? '',
                project_process_detail_id: '',
                process_file_ids: fileIds.join(','),
                check_uids: '1',
                process: 1,
            }
        }
        createOrUpdat(params).then((res) => {
            console.log(res)
            if (res.success) {
                handleClose()
                getList()
            }
        })
    }

    const optiongetInitData: SelectProps['options'] = initData.map((item) => {
        return {
            value: item.user_id,
            label: item.username + item.username_en,
        };
    });

    const handleAction = (type) => {
        switchCheckStatus({ project_process_detail_id: currentItem.id, status: type }).then(res => {
            console.log(res);
            if (res.success) {
                handleClose()
                success('审批成功！')
                return
            }
            error(res.message)
        })
    }

    useEffect(() => {
        getInitData().then(res => {
            setInitData(res.data.users)
        })
        console.log(currentItem);
        if (!currentItem) {
            return
        }
        form.setFieldsValue({
            process_type: currentItem?.process_type ?? '',
            process_desc: currentItem?.process_desc ?? '',
            degree: currentItem?.degree ?? '',
            username: currentItem?.check_user_id_arr ?? [],
            project_process_id: currentItem?.id ?? '',
            project_process_detail_id: currentItem?.data ?? '',
            upload: currentItem?.process_file_list ?? [],
            created: [dayjs(currentItem?.start_at, 'YYYY-MM-DD'), dayjs(currentItem?.end_at, 'YYYY-MM-DD')] ?? []
        })
    }, [])

    return (
        <Form
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 14 }}
            style={{ maxWidth: 600 }}
            form={form}
            onFinish={handleFinsh}
        >
            <Form.Item label="节点" name="process_type">
                <Input></Input>
            </Form.Item>
            <Form.Item label="描述" name="process_desc">
                <Input.TextArea></Input.TextArea>
            </Form.Item>
            <Form.Item label="重要程度" name="degree">
                <Select placeholder="请选择类型" options={type} />
            </Form.Item>
            <Form.Item label="上传附件" name="upload">
                {/* <Upload onChange={handleUpload}>
                    <Button>➕</Button>
                </Upload> */}
                <GkUpload />
            </Form.Item>
            <Form.Item label="使用时间" name="created">
                <RangePicker />
            </Form.Item>
            <Form.Item label="负责人" name="username">
                <Select placeholder="请选择类型" mode="multiple" options={optiongetInitData} allowClear />
            </Form.Item>
            <Form.Item>
                <Button style={{ marginLeft: 180 }} htmlType='submit'>保存计划</Button>
            </Form.Item>
            {
                currentItem &&
                <Form.Item >
                    <Button type="primary" style={{ marginLeft: 150 }} onClick={() => handleAction('checked')}>通过</Button>
                    <Button danger ghost style={{ marginLeft: 30 }} onClick={() => handleAction('checkoud out')}>拒绝</Button>
                </Form.Item>
            }
        </Form>
    )
}
export default Stage