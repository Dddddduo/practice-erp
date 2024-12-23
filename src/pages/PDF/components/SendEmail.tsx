import { Button, DatePicker, Divider, Form, Input, Popconfirm, Select, Space, Tag } from "antd"
import React, { useEffect, useRef, useState } from "react"
import type { CustomTagProps } from 'rc-select/lib/BaseSelect';
import { createPdfFile, getFileOssUrl, emailPreview, sendEmail, emailHistory } from "@/services/ant-design-pro/pdf";
import dayjs from "dayjs";
import { LocalStorageService } from "@/utils/utils";

interface ItemListProps {
  handleCloseSendEmail: () => void
  success: (text: string) => void
  error: (text: string) => void
  appoTaskId: string
  contactPersonType: string
  companyId: string
  params: {
    brand_en: string
    store_cn: string
    type: string
    leader_name: string
    leader_mobile: string
  }
}

const SendEmail: React.FC<ItemListProps> = ({
  handleCloseSendEmail,
  success,
  error,
  appoTaskId,
  contactPersonType,
  companyId,
  params
}) => {
  const { RangePicker } = DatePicker;

  const [previewHtml, setPreviewHtml] = useState('')

  const [form] = Form.useForm()
  const [loadingDownload, setLoadingDownload] = useState<boolean[]>([]);
  const timerId = useRef<NodeJS.Timer>();
  const [fileUrl, setFileUrl] = useState("")
  const [fileName, setFileName] = useState("")
  const [fileSuffix, setFileSuffix] = useState("")
  const [annex, setAnnex] = useState('')
  const [emailList, setEmailList] = useState([])

  const sendEmails = () => {
    const formData = form.getFieldsValue()
    let starTime, endTime
    if (form.getFieldsValue().time) {
      starTime = dayjs(form.getFieldsValue().time[0]).format('YYYY-MM-DD HH:mm')
      endTime = dayjs(form.getFieldsValue().time[1]).format('YYYY-MM-DD HH:mm')
    }
    const params = {
      an_appo_task_id: appoTaskId ?? 0,
      title: formData.title ?? '',
      respectful: formData.dear ?? '',
      contacts: formData.tel ?? '',
      date: (starTime && endTime) ? (starTime + ' 至 ' + endTime) : '',
      personnel: formData.total ?? '',
      content: formData.content ?? '',
      notes: formData.remark ?? '',
      oss_path: fileUrl ?? '',
      file_name: formData.fileName ?? '',
      recipient_email: (formData.email && formData.email.length > 0) ? formData.email[0] : '',
      inscribe: formData.inscribed ?? '',
      inscriber: formData.inscribed_name ?? '',
    }
    sendEmail(params).then(res => {
      if (res.success) {
        handleCloseSendEmail()
        success("发送成功")
        return
      }
      error(res.message)
    })
  }

  const createPDF = (index) => {
    setLoadingDownload((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });
    createPdfFile(
      {
        'pdf_type': 'worker_construction_report',
        pdf_info: {
          appo_task_id: appoTaskId,
          contact_person_type: contactPersonType,
          company_id: companyId
        }
      }).then(res => {
        if (res.success) {
          timerId.current = setInterval(async () => {
            getFileOssUrl({ download_token: res.data }).then(ossResult => {
              if (ossResult.success && ossResult.data) {
                setFileUrl(ossResult.data)
                const path = ossResult.data.split('/')
                const file_name = path[path.length - 1]
                setFileName(file_name)
                const tmp = file_name.split('.')
                setFileSuffix(tmp[tmp.length - 1])
                setLoadingDownload((prevLoadings) => {
                  const newLoadings = [...prevLoadings];
                  newLoadings[index] = false;
                  return newLoadings;
                });
                clearInterval(timerId.current)
              }
            })
          }, 1000)
        }
      })
  }

  const previewEmail = () => {
    // 
    const data = form.getFieldsValue()
    let starTime = '', endTime = ''
    if (form.getFieldsValue().time) {
      starTime = dayjs(form.getFieldsValue().time[0]).format('YYYY-MM-DD HH:mm')
      endTime = dayjs(form.getFieldsValue().time[1]).format('YYYY-MM-DD HH:mm')
    }

    const params = {
      an_appo_task_id: appoTaskId ?? 0,
      title: data.title ?? '',
      respectful: data.dear ?? '',
      contacts: data.tel ?? '',
      date: (starTime && endTime) ? (starTime + ' 至 ' + endTime) : '',
      personnel: data.total ?? '',
      content: data.content ?? '',
      notes: data.remark ?? '',
      oss_path: fileUrl ?? '',
      file_name: data.fileName ?? '',
      recipient_email: (data.email && data.email.length > 0) ? data.email[0] : '',
      inscribe: data.inscribed ?? '',
      inscriber: data.inscribed_name ?? '',
    }

    emailPreview(params).then(res => {
      if (res.success) {
        // console.log(res.data);
        setPreviewHtml(res.data)
        success('成功')
        return
      }
      error(res.message)
    })
  }

  const tagRender = (props: CustomTagProps) => {
    const { label, value, closable, onClose } = props;
    const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
      event.preventDefault();
      event.stopPropagation();
    };
    return (
      <Tag
        color='blue'
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{ marginRight: 3 }}
      >
        {label}
      </Tag>
    );
  };

  const filterOption = (input: string, option?: { label: string; value: string }) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  useEffect(() => {
    const user = LocalStorageService.getItem('loginInfo')
    const user_name_en = user.currentUser.username_en
    form.setFieldsValue({
      title: `${params.brand_en}-${params.store_cn}-${params.type}-人员信息`,
      tel: `${params.leader_name} ${params.leader_mobile}`,
      remark: "烦请贵店铺安排办理施工手续，并安排保安，谢谢。",
      fileName: `${params.brand_en}-${params.store_cn}-${params.type}-人员信息`,
      inscribed_name: user_name_en ?? '',
      inscribed: 'Yours Sincerely,',
    })
    setAnnex(`${params.brand_en}-${params.store_cn}-${params.type}-人员信息`)
    emailHistory({ email: '' }).then(res => {
      if (res.success) {
        setEmailList(res.data.map((item, index) => {
          return {
            value: item.recipient_email,
            label: item.recipient_email
          }
        }))
      }
    })
    return () => {
      if (timerId) clearInterval(timerId.current)
    }
  }, [])

  return (
    <>
      <Form
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 800, marginTop: 30 }}
        form={form}
      >
        <Form.Item label="标题" name="title">
          <Input placeholder="请输入标题" />
        </Form.Item>

        <Form.Item label="Dear" colon={false} name="dear">
          <Input placeholder="请输入称谓" />
        </Form.Item>

        <Form.Item label="施工日期" name="time">
          <RangePicker
            style={{ width: 500 }}
            showTime={{ format: 'HH:mm' }}
            format="YYYY-MM-DD HH:mm"
            minuteStep={30}
          />
        </Form.Item>

        <Form.Item label="施工人数" name="total">
          <Input placeholder="请输入施工人数" />
        </Form.Item>

        <Form.Item label="负责人联系方式" name="tel">
          <Input placeholder="请输入联系方式" />
        </Form.Item>

        <Form.Item label="施工内容" name="content">
          <Input placeholder="请输入施工内容" />
        </Form.Item>

        <Form.Item label="收件人邮箱" name="email" rules={[{ required: true }]}>
          <Select
            allowClear
            mode="tags"
            placeholder="请搜索收件人邮箱"
            tagRender={tagRender}
            showSearch
            options={emailList}
            filterOption={filterOption}
          />
        </Form.Item>

        <Form.Item label="备注" name="remark">
          <Input.TextArea placeholder="请输入备注" />
        </Form.Item>

        <Form.Item label="落款" name="inscribed">
          <Input placeholder="请输入落款" />
        </Form.Item>

        <Form.Item label="落款人" name="inscribed_name">
          <Input placeholder="请输入落款人" />
        </Form.Item>

        <Divider />

        <Form.Item label=" " colon={false} name="fileName">
          <Space style={{ display: 'flex', flexWrap: 'wrap' }}>
            <Button type="primary" loading={loadingDownload[1]} onClick={() => createPDF(1)}>生成PDF附件</Button>
            <Input value={annex} placeholder="请输入附件名" onInput={(e) => setAnnex(e.target.value)} style={{ width: 360, marginRight: 20 }} />
            <div>
              {
                fileUrl &&
                <a href={fileUrl} target="_blank">{annex ? `${annex}.${fileSuffix}` : fileName}</a>
              }
            </div>
          </Space>
        </Form.Item>

        <Divider />

        <Form.Item label=" " colon={false} >
          <Space>
            <Button type="primary" onClick={previewEmail}>预览邮件内容</Button>
            <Popconfirm
              title="请确认发送邮件"
              description="请确认预览内容是否正确，以及附件已生成"
              onConfirm={sendEmails}
              okText="发送"
              cancelText="取消"
            >
              <Button type="primary">发送邮件</Button>
            </Popconfirm>

            <Button danger onClick={handleCloseSendEmail}>取消</Button>
          </Space>
        </Form.Item>
      </Form>

      {
        previewHtml &&
        <div style={{ marginTop: 30, maxWidth: 800 }} dangerouslySetInnerHTML={{ __html: previewHtml }}></div>
      }
    </>
  )
}

export default SendEmail