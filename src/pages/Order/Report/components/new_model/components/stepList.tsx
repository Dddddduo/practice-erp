import React, {useState} from "react";
import {Button, Divider, Input, Modal, Tag} from "antd";
import UploadFiles from "@/components/UploadFiles";
import EditTeamFile from "@/pages/Order/Report/components/new_model/components/editTeamFile";

interface Props {
  reportDetailList: any,
  itemIndex: any,
  disabled: any,
  handleChange: (itemIndex: any, stepIndex: any, key: any, value: any) => void,
  handleUpdateStep: (itemIndex: any, stepIndex: any) => void
}

const StepList: React.FC<Props> = ({
                                     reportDetailList,
                                     itemIndex,
                                     disabled,
                                     handleChange,
                                     handleUpdateStep,
                                   }) => {

  const [showEditModel, setShowEditModel] = useState({
    reportDetailStepId: 0,
    stepIndex: 0,
    type: '',
    show: false,
  })

  const handleValueChange = (stepIndex: any, key: any, value: any) => {
    handleChange(itemIndex, stepIndex, key, value)
  }

  // 前后类型Card
  const baCard = (title: any, value: any, reportDetailStepId: any, stepIndex: any, type: any) => {
    return (
      <div>
        <Button
          type="primary"
          danger
          disabled={disabled}
          onClick={() => {
            const arg = {
              reportDetailStepId: reportDetailStepId,
              stepIndex: stepIndex,
              type: type,
              show: true,
            }

            setShowEditModel(arg)
          }}
        >更改此项</Button>

        <div style={{fontSize: 18, fontWeight: 'bold'}}>{title}</div>
        <UploadFiles value={value} disabled={true} fileLength={1}/>
      </div>
    )
  }

  // 类型判断
  const fileType = (item: any, index: any, stepListLength: any) => {
    return (
      <div>
        {/* 图片类型 */}
        {
          item?.image_type !== '' && <Tag color="blue" style={{margin: '12px 0'}}>image</Tag>
        }

        {/* 视频类型 */}
        {
          item?.video_type !== '' && <Tag color="red" style={{margin: '12px 0'}}>video</Tag>
        }

        {/* 图片render */}
        {
          item?.image_type === 'list' &&
          <div>

            <div style={{marginBottom: 12}}>
              <Button
                type="primary"
                danger
                disabled={disabled}
                onClick={() => {
                  const arg = {
                    reportDetailStepId: item?.report_detail_step_id ?? 0,
                    stepIndex: index,
                    type: 'image_list',
                    show: true,
                  }

                  setShowEditModel(arg)
                }}
              >更改此项</Button>
            </div>
            {
              item?.image_list !== '' ?
                <UploadFiles
                  value={item?.image_list}
                  disabled={true}
                  fileLength={item?.image_list.split(',').length}
                /> :
                <div style={{marginBottom: 12, color: "gray"}}>暂无上传图片</div>
            }
          </div>
        }

        {
          item?.image_type === 'before_after' &&
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            {baCard('Before', item.image_before, item?.report_detail_step_id ?? 0, index, 'image_before')}

            {baCard('After', item.image_after, item?.report_detail_step_id ?? 0, index, 'image_after')}
          </div>
        }

        {
          item?.image_type === 'before' && baCard('Before', item.image_before, item?.report_detail_step_id ?? 0, index, 'image_before')
        }

        {
          item?.image_type === 'after' && baCard('After', item.image_after, item?.report_detail_step_id ?? 0, index, 'image_after')
        }

        {/* 视频render */}
        {
          item?.video_type === 'list' &&
          <div>
            {
              item?.video_list !== '' ?
                <UploadFiles
                  value={item?.video_list}
                  disabled={true}
                  fileLength={item?.video_list.split(',').length}
                /> :
                <div style={{marginBottom: 12, color: "gray"}}>暂无上传视频</div>
            }
          </div>
        }

        {
          item?.video_type === 'before_after' &&
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            {baCard('Before', item.video_before, item?.report_detail_step_id ?? 0, index, 'video_before')}

            {baCard('After', item.video_after, item?.report_detail_step_id ?? 0, index, 'video_after')}
          </div>
        }

        {
          item?.video_type === 'before' && baCard('Before', item.video_before, item?.report_detail_step_id ?? 0, index, 'video_before')
        }

        {
          item?.video_type === 'after' && baCard('After', item.video_after, item?.report_detail_step_id ?? 0, index, 'video_after')
        }

        <Input value={item?.desc}
               disabled={disabled}
               onChange={(v) => handleValueChange(index, 'desc', v.target.value)}
               style={{marginBottom: 24}}
        />

        <div>
          <Button type="primary" disabled={disabled}
                  onClick={() => handleUpdateStep(itemIndex, index)}>仅更新此步骤</Button>
        </div>

        {
          index !== stepListLength - 1 && <Divider/>
        }
      </div>
    )
  }

  const stepCard = (item: any, index: any, stepListLength: any) => {
    return (
      <div>
        <div style={{fontSize: 16, fontWeight: 'bold'}}>{index + 1}. {item.title}</div>
        <div style={{color: 'red'}}>{item.notice === '' ? '' : '(' + item.notice + ')'}</div>
        {fileType(item, index, stepListLength)}
      </div>
    )
  }

  return (
    <>
      {
        reportDetailList[itemIndex].step_list.map((item, index) => {
          return stepCard(item, index, reportDetailList[itemIndex].step_list.length)
        })
      }

      <Modal
        title="编辑步骤"
        width="50%"
        footer={null}
        destroyOnClose={true}
        open={showEditModel?.show}
        onCancel={() => {
          setShowEditModel({})
        }}
      >
        <EditTeamFile
          stepIndex={showEditModel.stepIndex}
          reportDetailStepId={showEditModel.reportDetailStepId}
          type={showEditModel.type}
          handleChange={(stepIndex, type, value) => {
            handleValueChange(stepIndex, type, value)
          }}
        />
      </Modal>
    </>
  )
}

export default StepList
