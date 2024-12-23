import React, {useEffect, useState} from "react"
import {Button, Form, Input, Select, InputNumber, Radio, Space} from 'antd';
import {getAllWorkerList, managerList, AddMan, UpdateMan, getWorkerInfo} from "@/services/ant-design-pro/system";
import {SelectProps} from "antd";
import {isEmpty} from "lodash";

interface ItemListProps {

  handleClose: () => void
  currentMsg: any
  actionRef
  success: (text: string) => void
  error: (text: string) => void
}

const AddSystem: React.FC<ItemListProps> = ({
                                              handleClose,
                                              currentMsg,
                                              actionRef,
                                              success,
                                              error
                                            }) => {
  const [form] = Form.useForm()
  const [allWorkerList, setAllWorkerList] = useState([''])
  const [mmanagerList, setManagerList] = useState([''])

  const handleFinish = (values) => {
    console.log(values);
    console.log('currentMsg', currentMsg)
    let params
    if (isEmpty(currentMsg)) {
      params = {
        name: values.name ?? '',
        mobile: values.mobile ?? '',
        type: values.type ?? '',
        status: 0,
        worker_name: values.name ?? '',
        worker_mobile: values.mobile ?? '',
        manager_ids: values.manager_ids ?? '',
        principal_ids: values.principal_ids ?? '',
        worker_role_code: values.type ?? '',
      }
      AddMan(params).then((res) => {
        console.log(res)
        if (res.success) {
          handleClose()
          actionRef.current.reload()
          success('添加成功')
          return
        }
        error(res.message)
      })
      return
    }
    params = {
      id: currentMsg.worker_id ?? '',
      name: values.name ?? '',
      mobile: values.mobile ?? '',
      type: values.type ?? '',
      status: 0,
      certificate_list: [],
      manager_ids: values.manager_ids ?? '',
      principal_ids: values.principal_ids ?? '',
      worker_id: currentMsg.worker_id ?? '',
      worker_mobile: values.mobile ?? '',
      worker_name: values.name ?? '',
      worker_role_code: values.type ?? '',
      worker_role: currentMsg.worker_role ?? '',
      worker_score_list: currentMsg.worker_score_list ?? '',
      worker_status: currentMsg.worker_status ?? '',
    }
    UpdateMan(params).then((res) => {
      console.log(res)
      if (res.success) {
        handleClose()
        actionRef.current.reload()
        success('编辑成功')
        return
      }
      error(res.message)
    })

  }
  const optionsallWorkerList: SelectProps['options'] = allWorkerList.map((item) => {
    return {
      value: item.worker_id,
      label: item.worker,
    };
  });
  const optionsmanagerList: SelectProps['options'] = mmanagerList.map((item) => {
    return {
      value: item.id,
      label: item.name
    }
  })
  useEffect(() => {
    getAllWorkerList().then(res => {
      setAllWorkerList(res.data)
    })
    managerList().then(res => {
      setManagerList(res.data)
    })
    if (isEmpty(currentMsg)) {
      return
    }
    console.log('currentMsgxxxxx', currentMsg);
    getWorkerInfo({worker_id: currentMsg.worker_id}).then(res => {
      if (res.success) {
        form.setFieldsValue({
          name: res.data.worker_name ?? '',
          mobile: res.data.worker_mobile ?? '',
          type: res.data.worker_role_code ?? 0,

          principal_ids: res.data.worker_p_list ? res.data.worker_p_list.map(item => item.worker_pid) : [],
          manager_ids: res.data.manager_p_list ? res.data.manager_p_list.map(item => item.manager_pid) : [],

          // principal_ids: [697],
          // manager_ids: [1]
        })

      }
    })
    }, [])
    return (
        <Form
            form={form}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            onFinish={handleFinish}
        >
            <Form.Item label="姓名" name="name">
                <Input />
            </Form.Item>
            <Form.Item label="电话" name="mobile">
                <Input disabled={currentMsg?.worker_mobile} />
            </Form.Item>
            <Form.Item label="工种类别" name="type">
                <Radio.Group name="radiogroup">
                    <Radio value={0}>兼职</Radio>
                    <Radio value={1}>全职</Radio>
                </Radio.Group>
            </Form.Item>
            <Form.Item label="施工负责人" name="principal_ids">
                <Select
                  options={optionsallWorkerList}
                  mode="multiple"
                  showSearch
                  filterOption={(input, option) => (option?.label ?? '').includes(input)}
                ></Select>
            </Form.Item>
            <Form.Item label="选择系统管理员" name="manager_ids">
                <Select
                  options={optionsmanagerList}
                  mode="multiple"
                  showSearch
                  filterOption={(input, option) => (option?.label ?? '').includes(input)}
                ></Select>
            </Form.Item>
            <Form.Item label=" " colon={false}>
                <Space>
                    <Button type="primary" danger ghost onClick={handleClose}>取消</Button>
                    <Button type="primary" htmlType='submit'>提交</Button>
                </Space>
            </Form.Item>
        </Form>
    )
}
export default AddSystem
