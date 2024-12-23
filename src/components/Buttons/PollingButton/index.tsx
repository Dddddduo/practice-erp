import React, {useState, useEffect} from 'react';
import {Button} from 'antd';
import {ButtonProps} from 'antd/lib/button';

// 定义Props的类型
interface PollingButtonProps extends ButtonProps {
  requestHandle: (beforeResult: any) => Promise<void>;
  beforeRequest?: () => any
  buttonText?: string;
  maxPollingTime?: number; // 以秒为单位
  pollingInterval?: number; // 以秒为单位
  stopPolling?: boolean; // 控制轮询停止的外部参数
  changeOutStatus: () => void; // 更新外面的清除定时器的状态
}

/**
 * 轮询组件
 *
 * @param requestHandle
 * @param beforeRequest
 * @param buttonText
 * @param maxPollingTime
 * @param pollingInterval
 * @param stopPolling
 * @param changeOutStatus
 * @param buttonProps
 * @constructor
 */
const PollingButton: React.FC<PollingButtonProps> = ({
                                                       requestHandle,
                                                       beforeRequest,
                                                       buttonText = 'Download',
                                                       maxPollingTime = 30, // 默认30秒
                                                       pollingInterval = 2, // 默认3秒
                                                       stopPolling = false,
                                                       changeOutStatus,
                                                       ...buttonProps
                                                     }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  const stopPollingAndLoading = () => {
    setIsLoading(false);
    if (timer) clearTimeout(timer);
  };

  const handleButtonClick = async () => {
    changeOutStatus()
    setIsLoading(true);
    let beforeResult = {}
    if (beforeRequest) {
      beforeResult = await beforeRequest();
    }

    const startTime = Date.now();
    const poll = async () => {
      await requestHandle(beforeResult);
      console.log("handle:requestHandle")
      if (Date.now() - startTime >= maxPollingTime * 1000) {
        stopPollingAndLoading();
      } else {
        setTimer(setTimeout(poll, pollingInterval * 1000));
      }
    };

    await poll();
  };

  useEffect(() => {
    console.log("stopPolling", stopPolling)
    if (stopPolling) {
      stopPollingAndLoading();
    }

    // 组件卸载时清除定时器
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [stopPolling, timer]);

  return (
    <Button {...buttonProps} onClick={handleButtonClick} loading={isLoading} disabled={isLoading}>
      {buttonText}
    </Button>
  );
};

export default PollingButton;
