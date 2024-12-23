import { changeOperation } from '@/services/ant-design-pro/air';
import { i18nGlobalKey, passwordExpire } from '@/utils/utils';
import { message, Select } from 'antd';
import { SelectProps } from 'antd/lib';
import React, { useRef, useState } from 'react';
import PasswordValidate from '../PasswordValidate';

interface Props extends SelectProps {
  selectProps?: SelectProps;
  onChange: (path: string, value: any) => void;
  value: string;
  valueKey: string;
  width?: number | null | undefined;
  options: [];
  httpParams: {
    type: string;
    machine: string;
    floor: string;
    store_id: number;
  };
}

const NewSelect: React.FC<Props> = ({
  onChange,
  value,
  valueKey,
  width,
  httpParams,
  options,
  ...selectProps
}) => {
  const [messageApi, contextHolder] = message.useMessage();

  const [isOpenValidate, setIsOpenValidate] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);

  const timer = useRef<any>(null);

  const errorToast = (message: string) => {
    messageApi.open({
      type: 'error',
      content: message,
    });
  };

  const handleChange = async (value: string) => {
    console.log(`selected ${value}`);

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
        value: value,
      };

      const res = await changeOperation(params);

      if (res.success) {
        onChange(valueKey, value);

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

  const filterOption = (input: string, option?: { label: string; value: string }) => {
    return (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
  };
  return (
    <div>
      {contextHolder}
      <Select
        {...selectProps}
        value={value}
        loading={loading}
        disabled={loading}
        onChange={handleChange}
        //@ts-ignore
        filterOption={filterOption}
        options={options}
        style={{ width: width ?? 120 }}
      ></Select>

      <PasswordValidate
        isOpen={isOpenValidate}
        title={i18nGlobalKey('验证密码')}
        onClose={() => setIsOpenValidate(false)}
      />
    </div>
  );
};

export default NewSelect;
