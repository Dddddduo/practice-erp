import React, { useState, useEffect } from 'react';
import { isEmpty } from "lodash";
import BaseContainer, { ModalType } from '@/components/Container';
import { addSortKey } from '@/components/Table/DragTable';
import FormBaseData from './FormData';


// 组件属性类型定义
interface KpiModalProps {
  visible: boolean
  currentRecord,
  onValueChange: (path: string, value: any) => void
  onClose: () => void
  changeCurrentRecord: (data) => void
  actionRef: any
}

const KpiModal: React.FC<KpiModalProps> = ({
  currentRecord,
  onValueChange,
  visible,
  onClose,
  changeCurrentRecord,
  actionRef,
}) => {
  useEffect(() => {
    if (visible) {
      if (isEmpty(currentRecord?.info)) {
        currentRecord = {
          info: [{
            score_index: '',
            rate: 1,
            content: ''
          }]
        }
      }

      if (currentRecord) {
        currentRecord.info = addSortKey(currentRecord?.info)
      }
      changeCurrentRecord({ baseData: currentRecord })
    }

  }, [visible])

  return (
    <>
      <BaseContainer
        type={ModalType.Modal}
        title={isEmpty(currentRecord) ? '新增绩效考核' : '修改绩效考核'}
        open={visible}
        onCancel={onClose}
        width="90%"
        style={{ top: 30 }}
        destroyOnClose={true}
        maskClosable={false}
      >
        <FormBaseData
          currentRecord={{ ...currentRecord?.baseData, type: currentRecord.type }}
          onValueChange={onValueChange}
          onClose={onClose}
          actionRef={actionRef}
        />
      </BaseContainer>
    </>
  )
};

export default KpiModal;
