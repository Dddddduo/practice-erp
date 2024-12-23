import React, {ReactElement, useEffect, useState} from "react";
import {isEmpty, map} from "lodash";
import {Form, Button, Input, message, Tag, Modal} from "antd";
import GkUpload from "@/components/UploadImage/GkUpload";
import {updateStepSync} from "@/services/ant-design-pro/report";
import {PictureOutlined, YoutubeOutlined} from "@ant-design/icons";
import EditStep from "@/pages/Order/Report/components/EditStep";
import UploadFiles from "@/components/UploadFiles";


interface TeamStepProps {
  step: { [key: string]: any };
  no: number
  selectedTab: number
}

const TeamStep: React.FC<TeamStepProps> = ({step, no, selectedTab = 0}) => {
  const [form] = Form.useForm();
  const [openChangeModal, setOpenChangeModal] = useState(false)
  const [currentType, setCurrentType] = useState<string>('')
  console.log(" --- <TeamStep /> --- ", step, no, selectedTab);

  const handleChangeSubmit = (value) => {
    console.log("value:", value)
  }

  const onFinish = (values: any) => {
    console.log('onFinish:source', values);
    const result = {
      desc: values?.desc ?? '',
      image_list: values?.image_list_url ?? '',
      image_before: values?.image_before_url ?? '',
      image_after: values?.image_after_url ?? '',
      video_list: values?.video_list_url ?? '',
      video_before: values?.video_before_url ?? '',
      video_after: values?.video_after_url ?? '',
      report_detail_step_id: step?.report_detail_step_id ?? 0
    };

    const hide = message.loading('数据同步中')
    updateStepSync(result).then(response => {
      if (response.success) {
        hide();
        message.info('提交成功');
        return;
      }
      hide();
      message.error('提交失败!')
    });
  };

  const handleChangeClick = (type) => {
    setOpenChangeModal(true)
    setCurrentType(type)
  }

  const handleCloseModal = () => {
    setOpenChangeModal(false)
  }

  useEffect(() => {

    const formValues = {
      desc: step?.desc ?? '',
      image_list_url: isEmpty(step?.image_list_url) ? '' : map(step.image_list_url, 'file_id').join(','),
      image_before_url: isEmpty(step?.image_before_url) ? '' : map(step.image_before_url, 'file_id').join(','),
      image_after_url: isEmpty(step?.image_after_url) ? '' : map(step.image_after_url, 'file_id').join(','),
      video_list_url: isEmpty(step?.video_list_url) ? '' : map(step.video_list_url, 'file_id').join(','),
      video_before_url: isEmpty(step?.video_before_url) ? '' : map(step.video_before_url, 'file_id').join(','),
      video_after_url: isEmpty(step?.video_after_url) ? '' : map(step.video_after_url, 'file_id').join(','),
    }

    console.log("formValues:", formValues)
    form.setFieldsValue(formValues);
  }, [])

  let nodeImageList: ReactElement | null = null;
  let nodeVideoList: ReactElement | null = null;

  if ('list' === step.image_type) {
    let len = 1;
    if (!isEmpty(step?.image_limit_max)) {
      len = parseInt(step?.image_limit_max);
    }

    // rules={[{ required: true }]} getValueFromEvent={getFile}
    nodeImageList = (
      <div>
        <div style={{textAlign: "left", marginBottom: 16}}>
          <Tag icon={<PictureOutlined/>} color="blue">image</Tag>
        </div>
        {
          selectedTab <= 0 &&
          <Button type="primary" danger onClick={() => handleChangeClick('image_list')}>更改此项</Button>
        }
        <Form.Item name="image_list_url">
          <UploadFiles fileLength={len}/>
        </Form.Item>
      </div>

    );
  } else if ('before_after' === step.image_type) {
    nodeImageList = (
      <div>
        <div style={{textAlign: "center"}}>
          <Tag icon={<PictureOutlined/>} color="blue">image</Tag>
        </div>
        <div style={{float: "left"}}>
          {
            selectedTab <= 0 &&
            <Button type="primary" danger onClick={() => handleChangeClick('image_before')}>更改此项</Button>
          }
          <h3 style={{textAlign: "center"}}>Before</h3>
          <Form.Item name="image_before_url">
            <UploadFiles fileLength={1}/>
          </Form.Item>
        </div>
        <div style={{float: "right"}}>
          {
            selectedTab <= 0 &&
            <Button type="primary" danger onClick={() => handleChangeClick('image_after')}>更改此项</Button>
          }
          <h3 style={{textAlign: "center"}}>After</h3>
          <Form.Item name="image_after_url">
            <UploadFiles fileLength={1}/>
          </Form.Item>
        </div>
        <div style={{clear: "both"}}></div>
      </div>
    );
  }

  if ('list' === step.video_type) {
    let len = 1;
    if (!isEmpty(step?.video_limit_max)) {
      len = parseInt(step?.video_limit_max);
    }
    nodeVideoList = (
      <div>
        <div style={{textAlign: "left", marginBottom: 16}}>
          <Tag icon={<YoutubeOutlined/>} color="red">video</Tag>
        </div>
        {
          selectedTab <= 0 &&
          <Button type="primary" danger onClick={() => handleChangeClick('video_list')}>更改此项</Button>
        }
        <Form.Item name="video_list_url">
          <UploadFiles fileLength={len}/>
        </Form.Item>
      </div>

    );
  } else if ('before_after' === step.video_type) {
    nodeVideoList = (
      <div>
        <div style={{textAlign: "center"}}>
          <Tag icon={<YoutubeOutlined/>} color="red">video</Tag>
        </div>
        <div style={{float: "left"}}>
          {
            selectedTab <= 0 &&
            <Button type="primary" danger onClick={() => handleChangeClick('video_before')}>更改此项</Button>
          }
          <h3 style={{textAlign: "center"}}>Before</h3>
          <Form.Item name="video_before_url">
            <UploadFiles fileLength={1}/>
          </Form.Item>
        </div>
        <div style={{float: "right"}}>
          {
            selectedTab <= 0 &&
            <Button type="primary" danger onClick={() => handleChangeClick('video_after')}>更改此项</Button>
          }
          <h3 style={{textAlign: "center"}}>After</h3>
          <Form.Item name="video_after_url">
            <UploadFiles fileLength={1}/>
          </Form.Item>
        </div>
        <div style={{clear: "both"}}></div>
      </div>
    );
  }


  let notice = '';
  if (!isEmpty(step?.notice)) {
    notice = `(${step?.notice})`;
  }

  const handleTopChange = (type, showFiles) => {
    const newType = type + '_url'
    form.setFieldValue(newType, showFiles)
  }

  return (
    <>
      <div>
        <Form form={form} name={`control-ref-${step.report_detail_step_id}`} onFinish={onFinish}>
          <h3>{no},{step?.title ?? ''} </h3>
          <p style={{color: "red"}}>{notice}</p>

          {!isEmpty(nodeImageList) && nodeImageList}
          {!isEmpty(nodeVideoList) && nodeVideoList}
          <Form.Item name="desc">
            <Input/>
          </Form.Item>
          <div style={{height: 8}}></div>
          <Button type="primary" htmlType="submit">仅更新此步骤</Button>
          <div style={{height: 8}}></div>
          <hr/>
        </Form>
      </div>
      <EditStep visible={openChangeModal} onTopChange={handleTopChange} onClose={handleCloseModal} type={currentType}
                stepInfo={step} onSubmit={handleChangeSubmit}/>
    </>
  );
}

export default TeamStep;
