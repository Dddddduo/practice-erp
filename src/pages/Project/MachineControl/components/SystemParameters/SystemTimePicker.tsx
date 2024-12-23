import PasswordValidate from '@/pages/Project/MachineControl/components/PasswordValidate';
import { i18nGlobalKey } from '@/utils/utils';
import { message, TimePicker } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';

interface Props {
  index: number;
  // value: string[];
  // valueKey: string;
  onChange: any;
  httpParams?: {
    type: string;
    machine: string;
    floor: string;
    store_id: number;
  };
  // lock: (path: string, isBegin: boolean, type: string, value: any) => void;
  // OnChange: (path: string, value: any) => void;
  baseData: any;
  handleFullValueChange: (path: string, value: any, isPause?: boolean) => void;
}

const SystemTimePicker: React.FC<Props> = ({
  index,
  // value,
  // valueKey,
  onChange,
  handleFullValueChange,
  httpParams,
  // lock,
  // OnChange,
  baseData,
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [isOpenValidate, setIsOpenValidate] = useState<boolean>(false);
  const errorToast = (message: string) => {
    messageApi.open({
      type: 'error',
      content: message,
    });
  };
  const path = `setting:systemParameters:machineStartTimeList:timeValue:${index}`;

  // const handleAcOperation = async (value: any) => {
  //   try {
  //
  //     const params = {
  //       ...httpParams,
  //       value,
  //     }
  //
  //     const res = await changeOperation(params);
  //     console.log('res--res', res);
  //     if(res.code !== 0){
  //       errorToast(res.message);
  //     }
  //   } catch (error: any) {
  //     console.log(error)
  //   }
  //
  // };

  useEffect(() => {}, []);
  return (
    <>
      {contextHolder}
      <div
        style={{
          display: 'flex',
          justifyContent: 'left',
          alignItems: 'center',
        }}
      >
        <TimePicker.RangePicker
          format="HH:mm"
          style={{ width: 160 }}
          value={[dayjs(baseData[0], 'HH:mm'), dayjs(baseData[1], 'HH:mm')]}
          onChange={(times, a) => {
            // console.log('onChange:', times, a, path);
            // handleFullValueChange(path, times);
            // handleAcOperation(a.join(',')).then(console.log);
            handleFullValueChange(path, times);
            console.log('path--99', path);
          }}
          onOpenChange={(isBegin) => {
            console.log('onOpenChange:', isBegin);
            handleFullValueChange(path, null, isBegin);
          }}
        />

        <PasswordValidate
          isOpen={isOpenValidate}
          title={i18nGlobalKey('验证密码')}
          onClose={() => setIsOpenValidate(false)}
        />
      </div>
    </>
  );
};

export default SystemTimePicker;
