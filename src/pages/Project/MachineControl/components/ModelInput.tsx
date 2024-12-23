import React,{ useState , useRef , useEffect } from 'react';
import { Input, InputProps, message , Modal } from 'antd';
import PasswordValidate from '@/pages/Project/MachineControl/components/PasswordValidate';
import {i18nGlobalKey, passwordExpire} from "@/utils/utils";
import {LoadingOutlined} from "@ant-design/icons";
import {changeOperation} from "@/services/ant-design-pro/air";
import {ComponentChangeValue} from "@/utils/machine_control_service";
//@ts-ignore
interface Props extends InputProps {
  inputProps?: InputProps,
  title?: string,
  httpParams: {
    type: string,
    machine: string,
    floor: string,
    store_id: number,
  },
  value: string,
  valueKey: string,
  unit: string,
  rule: number[],
  onChange: (arg: ComponentChangeValue) => void
}
const ModelInput:React.FC<Props> = ({title, unit, value, valueKey, onChange, httpParams, ...inputProps}) => {
  const [inputValue, setInputValue] = useState<string>('')

  const [messageApi, contextHolder] = message.useMessage()

  const [isOpenInput, setIsOpenInput] = useState<boolean>(false)

  const [isOpenValidate, setIsOpenValidate] = useState<boolean>(false)

  const [loading, setLoading] = useState<boolean>(false)

  const timer = useRef(null)

  const errorToast = (message: string) => {
    messageApi.open({
      type: 'error',
      content: message,
    });
  };

  const handleSubmit = async () => {
    try {
      // todo 1. 先验证输入值是否有效
      if (inputValue === null) {
        return
      }

      setLoading(true)

      console.log('inputValue', inputValue)

      // todo 2.请求http
      const params = {
        ...httpParams,
        value: inputValue
      }

      const res = await changeOperation(params)

      if (res.success) {
        onChange({
          key: valueKey,
          value: inputValue,
        })

        if (timer.current === null) {
          //@ts-ignore
          timer.current = setTimeout(function () {

            setLoading(false)

            onChange({
              key: 'isActive',
              value: false,
            })

            if (timer.current) {
              clearTimeout(timer.current)
              timer.current = null
            }
          }, 5000)
        }
      } else {
        errorToast(res.message)
        setLoading(false)

        onChange({
          key: 'isActive',
          value: false,
        })
      }
    } catch (err) {
      errorToast((err as Error).message)
      setLoading(false)

      onChange({
        key: 'isActive',
        value: false,
      })
    } finally {
      setIsOpenInput(false)
    }
  }

  const handleOpenInputModal = () => {
    // todo 1.验证密码是否过期
    if (passwordExpire()) {
      setIsOpenValidate(true)
      return
    }
    setIsOpenInput(true)
  }

  useEffect(() => {
    setInputValue(value)
  }, [value]);

  return (
    <div>
      {contextHolder}
      <div
        style={{
          backgroundColor: loading ? '#F0EFEF' : 'white',
          width: 72,
          height: 24,
          borderRadius: 4,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'black',
        }}
        onClick={() => {
          if (!loading) {
            handleOpenInputModal()
          }
        }}
      >
        <div>{value}</div>
        {/*<div>{unit}</div>*/}
        {
          loading && <LoadingOutlined/>
        }
      </div>

      <Modal
        title={title ?? '操作'}
        open={isOpenInput}
        onCancel={() => setIsOpenInput(false)}
        onOk={handleSubmit}
      >
        <Input
          {...inputProps}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <div style={{color: 'red', marginTop: 4, fontSize: 14}}>{i18nGlobalKey("验证规则")}</div>
      </Modal>

      <PasswordValidate
        isOpen={isOpenValidate}
        title={i18nGlobalKey("验证密码")}
        onClose={() => setIsOpenValidate(false)}
      />
    </div>
  )
};
export default ModelInput;
