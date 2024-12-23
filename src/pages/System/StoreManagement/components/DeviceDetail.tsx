import UploadFiles from '@/components/UploadFiles';
import {
  getStoreDeviceByDeviceName,
  updateStoreDeviceDetailById,
} from '@/services/ant-design-pro/air';
import { Button, DatePicker, Form, Input, message, Radio } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

const DeviceDetail = ({ deviceItem }) => {
  const [detailForm] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [nameplate, setNameplate] = useState<string>('');

  useEffect(() => {
    console.log('deviceId....', deviceItem);
    getStoreDeviceByDeviceName({
      device_name: deviceItem.device_name,
      store_id: deviceItem.store_id,
    }).then((res: any) => {
      console.log('skdflsalfslfasfsf', res);
      if (res.data) {
        detailForm.setFieldsValue(res.data);
        if (
          dayjs(res.data.production_at).isValid() &&
          res.data.production_at !== '0000-00-00 00:00:00'
        ) {
          detailForm.setFieldValue('production_at', dayjs(res.data.production_at));
        } else {
          detailForm.setFieldValue('production_at', null);
        }
      } else {
        detailForm.setFieldsValue(deviceItem);
        if (
          dayjs(deviceItem.production_at).isValid() &&
          deviceItem.production_at !== '0000-00-00 00:00:00'
        ) {
          detailForm.setFieldValue('production_at', dayjs(deviceItem.production_at));
        } else {
          detailForm.setFieldValue('production_at', null);
        }
      }
    });
  }, []);

  const handleSubmit = (values: any) => {
    console.log('handleSubmit', values);
    let formData = values;
    formData.production_at = dayjs(values.production_at).isValid()
      ? dayjs(values.production_at).format('YYYY-MM-DD')
      : null;
    formData.device_id = deviceItem.id;
    formData.nameplate = nameplate;
    updateStoreDeviceDetailById(formData).then((res: any) => {
      if (res.success) {
        messageApi.open({
          type: 'success',
          content: '提交成功',
        });
      }
    });
  };

  const updateNameplate = (e) => {
    setNameplate(e);
  };

  return (
    <>
      {contextHolder}
      <Form
        form={detailForm}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
        onFinish={handleSubmit}
      >
        <Form.Item name="device_name" label={'设备名称'}>
          <Input readOnly />
        </Form.Item>

        <Form.Item name="device_type" label={'设备类型'}>
          <Input readOnly />
        </Form.Item>

        <Form.Item name="brand_model" label={'品牌型号'}>
          <Input />
        </Form.Item>

        {(deviceItem.device_type === 'AHU' || deviceItem.device_type === 'FCU') && (
          <>
            <Form.Item name="air_volume" label={'风量m3/h'}>
              <Input />
            </Form.Item>
            <Form.Item name="pipeline_num" label={'管制'}>
              <Radio.Group>
                <Radio value={2}>两管制</Radio>
                <Radio value={4}>四管制</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item name="motor_power" label={'电机功率'}>
              <Input />
            </Form.Item>
          </>
        )}

        <Form.Item name="cooling_capacity" label={'制冷量(kW)'}>
          <Input />
        </Form.Item>

        <Form.Item name="heating_capacity" label={'制热量(kW)'}>
          <Input />
        </Form.Item>

        <Form.Item name="cooling_power" label={'制冷功率(kW)'}>
          <Input />
        </Form.Item>

        <Form.Item name="heating_power" label={'制热功率(kW)'}>
          <Input />
        </Form.Item>

        <Form.Item name="production_at" label="生产日期">
          <DatePicker />
        </Form.Item>

        <Form.Item name="nameplate" label="铭牌照片">
          <UploadFiles
            value={nameplate}
            onChange={updateNameplate}
            fileLength={10}
            allowedTypes={['*']}
            showDownloadIcon={false}
          />
        </Form.Item>

        <Form.Item name="remark" label={'备注'}>
          <Input.TextArea />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default DeviceDetail;
