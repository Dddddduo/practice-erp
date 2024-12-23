import React from "react";
import {useNewReport} from "@/viewModel/NewReport/useNewReport";
import {Button, Collapse, Modal, Tabs} from "antd";
import {isEmpty} from "lodash";
import SignSync from "@/pages/Order/Report/components/new_model/components/signSync";

interface Props {
  params: {
    report_id: any,
    report_tid: any,
    sign_value: any,
  }
}

const newTemplateList: React.FC<Props> = (params) => {

  const {
    teamList,
    reportDetailList,
    selectedTeam,
    contextHolder,
    showSign,
    handleChangeTab,
    exportCollapse,
    handleCloseSign,
  } = useNewReport(params.params)

  return (
    <>
      {contextHolder}
      <Tabs items={teamList} onChange={(key) => handleChangeTab(key)}/>
      <Collapse items={exportCollapse(reportDetailList, selectedTeam)}/>
      {
        selectedTeam.key === 0 && <div style={{ marginTop: 12 }}><Button type={'primary'} disabled={isEmpty(reportDetailList)} onClick={() => handleCloseSign(true)}>签单同步</Button></div>
      }

      <Modal
        title="同步签单"
        width="50%"
        footer={null}
        destroyOnClose={true}
        open={showSign}
        onCancel={() => {
          handleCloseSign(false)
        }}
      >
        <SignSync sign_value={params.params?.sign_value} report_id={params.params?.report_id}  report_tid={params.params?.report_tid}/>
      </Modal>
    </>
  )
}

export default  newTemplateList
