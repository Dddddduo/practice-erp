import React, { useEffect, useRef, useState } from 'react';
import { message, TimePicker } from 'antd';
import PasswordValidate from '../PasswordValidate';
import { i18nGlobalKey } from '@/utils/utils';
import dayjs from 'dayjs';
import {changeOperation} from "@/services/ant-design-pro/air";

interface Props {
  index: number;
  value: string[];
  valueKey: string;
  httpParams?: {
    type: string;
    machine: string;
    floor: string;
    store_id: number;
  };
  onChange: (path: string, value: any) => void;
}

const LightTimePicker: React.FC<Props> = ({
  index,
  value,
  valueKey,
  httpParams,
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const errorToast = (message: string) => {
    messageApi.open({
      type: 'error',
      content: message,
    });
  };

  const [isOpenValidate, setIsOpenValidate] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);

  const path = `lightingData:data:${index}`;

  const handleAcOperation = async (value: any) => {
    const params = {
      ...httpParams,
      value,
    }

    const res = await changeOperation(params);
    console.log('res--res', res);
    if(res.code !== 0){
      errorToast(res.message);
    }
  };
  return (
    <>
      {contextHolder}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <TimePicker.RangePicker
          format="HH:mm"
          style={{ width: 150 }}
          value={[dayjs(value[0], 'HH:mm'), dayjs(value[1], 'HH:mm')]}
          onChange={(times, a) => {
            console.log('onChange:', times, a, path);
            // handleFullValueChange(path, times);
            // handleAcOperation(a.join(',')).then(console.log);
          }}
          onOpenChange={(isBegin) => {
            console.log('onOpen:', isBegin);
            // handleFullValueChange(path, null, isBegin);
          }}
        />
      </div>

      <PasswordValidate
        isOpen={isOpenValidate}
        title={i18nGlobalKey('验证密码')}
        onClose={() => setIsOpenValidate(false)}
      />
    </>
  );
};

export default LightTimePicker;
