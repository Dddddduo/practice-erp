import React from "react";
import {BaseDataParams, OpenDataParams} from "@/viewModel/System/DeviceManagement/useViewSimManagement";
import BaseContainer, {ModalType} from "@/components/Container";
import FormData from './FormData'

interface SimDetailParams {
  form,
  baseData: BaseDataParams
  openData: OpenDataParams
  handleCloseDrawer: () => void
  handleFinishForm: () => void
  handleChangeStatus: (e: any) => void
}

const SimDetail: React.FC<SimDetailParams> = ({
                                                form,
                                                baseData,
                                                openData,
                                                handleCloseDrawer,
                                                handleFinishForm,
                                                handleChangeStatus,
                                              }) => {
  return (
    <BaseContainer
      type={ModalType.Drawer}
      title={baseData?.title}
      open={openData?.detail}
      width={800}
      onClose={handleCloseDrawer}
    >
      <FormData
        form={form}
        baseData={baseData}
        handleFinishForm={handleFinishForm}
        handleChangeStatus={handleChangeStatus}
      />
    </BaseContainer>
  )
}

export default SimDetail
