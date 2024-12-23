import React, { useState, useEffect } from 'react';
import { Modal, Checkbox, Button, message, Space } from 'antd';
import UploadFiles from "@/components/UploadFiles";
import { difference, filter, flatMap, includes, isEmpty, isUndefined, map, union } from "lodash";
import { detailsByStep } from "@/services/ant-design-pro/report";
import { deepCopy } from "ali-oss/lib/common/utils/deepCopy";

// 步骤信息和文件类型定义
interface StepInfo {
  worker_uid: number;
  image_list: string;
  image_before: string;
  image_after: string;
  video_list: string;
  video_before: string;
  video_after: string;
}

interface FileManagementModalProps {
  visible: boolean;
  onClose: () => void;
  stepInfo: { [key: string]: any };
  type: 'image_list' | 'image_before' | 'image_after' | 'video_list' | 'video_before' | 'video_after';
  onTopChange: (type: string, files) => void;
}

const EditStep: React.FC<FileManagementModalProps> = ({ visible, onClose, stepInfo, type, onTopChange }) => {
  const [stepState, setStepState] = useState<{ [key: string]: any }[]>([])
  const [topState, setTopState] = useState<string>('');

  useEffect(() => {
    console.log("stepInfo", stepInfo)


    if (!visible) {
      return;
    }



    let reportDetailStepId = 0
    if (isEmpty(stepInfo)) {
      return
    }

    reportDetailStepId = stepInfo?.report_detail_step_id
    if (isUndefined(reportDetailStepId) || reportDetailStepId <= 0) {
      reportDetailStepId = stepInfo?.id
    }

    if (isUndefined(reportDetailStepId) || reportDetailStepId <= 0) {
      return
    }

    const stateStruct = {
      worker_name: '',
      file_list: []
    };

    detailsByStep(reportDetailStepId).then(result => {
      if (!result.success) {
        message.error("数据获取失败！")
        return
      }

      const data = result.data
      if (isEmpty(data)) {
        return
      }

      // 设置团队数据
      let topState = '';
      console.log(data)
      data.forEach(info => {
        if (0 === info.detail.worker_uid) {
          topState = info[type] // type会是image_list , image_before ....
        }
      })

      // 设置工人数据
      let workers = []
      data.forEach(info => {
        if (0 !== info.detail.worker_uid) {

          // 这里是 workerName和file_list
          const tmpState = {
            ...stateStruct
          }

          tmpState.worker_name = info.detail?.worker?.name ?? ''

          console.log("aabbcc:", info[type])


          // 每张图片会有一个 checkbox （待验证）
          if ("" !== info[type]) {
            tmpState.file_list = info[type].split(',').map(item => {
              return {
                file_id: item,
                select_state: includes(topState.split(','), item)
              }
            })
          }

          workers.push(tmpState)
        }
      })

      console.log('打印workers', workers)


      setTopState(topState);
      setStepState(workers)
    })

  }, [stepInfo, type]);

  // 处理文件选择
  const handleSelectFile = (row, col) => {
    let step = deepCopy(stepState)
    console.log("ttt", row, col, step)
    step[row]['file_list'][col].select_state = !step[row]['file_list'][col].select_state
    const topArr = topState.split(',')
    const result = flatMap(step, item => item.file_list);
    const selectedFileIds = map(filter(result, { 'select_state': true }), 'file_id');
    const fullIds = flatMap(result, item => item.file_id);
    console.log("fullIds", fullIds, selectedFileIds)
    const top = difference(topArr, fullIds)
    const newTop = union(selectedFileIds, top).join(',')
    setStepState(step)
    setTopState(newTop)

    // console.log('onTopChange', type, newTop)

    onTopChange(type, newTop)
  };

  return (
    <Modal
      title="编辑步骤"
      width="50%"
      footer={null}
      destroyOnClose={true}
      open={visible}
      onCancel={onClose}
    >
      <div>
        <h3>顶部文件展示</h3>
        <UploadFiles value={topState} fileLength={"" === topState ? 0 : topState.split(',').length} />
      </div>
      <div>
        {stepState.map((item, index) => (
          <div key={index}>
            <div>Worker {item.worker_name}:</div>
            {!isEmpty(item.file_list) && item.file_list.map((selectItem, idx) => (
              <Space key={selectItem.file_id}>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                  <Checkbox
                    onChange={e => handleSelectFile(index, idx)}
                    checked={selectItem.select_state}
                  />
                  <UploadFiles fileLength={1} value={selectItem.file_id} />
                </div>
              </Space>
            ))}
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default EditStep;
