import React, { useEffect, useRef, useState } from 'react';
import { message, Switch } from 'antd';
import { SwitchProps } from 'antd/lib';
import PasswordValidate from '../PasswordValidate';
import { i18nGlobalKey, passwordExpire } from '@/utils/utils';
import { changeOperation } from '@/services/ant-design-pro/air';
import { ComponentChangeValue } from '@/utils/machine_control_service';

// @ts-ignore
interface Props extends SwitchProps {
  switchProps?: SwitchProps;
  value: boolean;
  valueKey: string;
  onChange: (path: string, value: any) => void;
  closeText?: string | null | undefined;
  openText?: string | null | undefined;
  httpParams?: {
    type: string;
    machine: string;
    floor: string;
    store_id: number;
  };
}

const NewSwitch: React.FC<Props> = ({
  value,
  valueKey,
  onChange,
  closeText,
  openText,
  httpParams,
  ...switchProps
}) => {
  const [messageApi, contextHolder] = message.useMessage();

  const [isOpenValidate, setIsOpenValidate] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);

  const timer = useRef<NodeJS.Timeout | null>(null);

  const errorToast = (message: string) => {
    messageApi.open({
      type: 'error',
      content: message,
    }).then(r => {
      console.log("errorToast:r:", r);
    });
  };


  const handleChange = async (checked: boolean) => {

    console.log('switch checked----', checked);

    try {
      // todo 1.验证密码是否过期
      if (passwordExpire()) {
        setIsOpenValidate(true);
        return;
      }

      setLoading(true);

      // todo 2.请求http
      const params = {
        ...httpParams,
        value: checked ? 1 : 0,
      };

      const res = await changeOperation(params);

        onChange(valueKey, checked);
      console.log('valueKey----checked', valueKey, checked);
      if (res.success) {

        if (timer.current === null) {
          timer.current = setTimeout(function () {
            setLoading(false);

            if (timer.current) {
              clearTimeout(timer.current);
              timer.current = null;
            }
          }, 5000);
        }
      } else {
        errorToast(res.message);
        setLoading(false);

      }
    } catch (err) {
      errorToast((err as Error).message);
      setLoading(false);

    }
  };

  useEffect(() => {
    // return函数：组件销毁和依赖的参数改变
    return () => {
      setLoading(false);

      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
      }
    };
  }, []);

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
        <div style={{ color: '#888888' }}>{closeText ?? ''}</div>
        <Switch
          {...switchProps}
          loading={loading}
          disabled={loading}
          checked={value}
          onChange={handleChange}
          style={{ margin: '0 6px' }}
        />
        <div style={{ color: value ? '#F4AE86' : '#888888' }}>{openText ?? ''}</div>
      </div>

      <PasswordValidate
        isOpen={isOpenValidate}
        title={i18nGlobalKey('验证密码')}
        onClose={() => setIsOpenValidate(false)}
      />
    </>
  );
};

export default NewSwitch;
