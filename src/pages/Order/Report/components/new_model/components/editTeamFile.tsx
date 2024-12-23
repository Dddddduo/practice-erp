import React, {useEffect, useState} from "react";
import {detailsByStep} from "@/services/ant-design-pro/report";
import {produce} from "immer";
import {includes} from "lodash";
import UploadFiles from "@/components/UploadFiles";
import {Checkbox, Space} from "antd";

interface Props {
  reportDetailStepId: any,
  stepIndex: any,
  type: any,
  handleChange: (stepIndex: any, type: any, value: any) => void
}


const EditTeamFile:React.FC<Props> = ({
                                        reportDetailStepId,
                                        stepIndex,
                                        type,
                                        handleChange,
                                      }) => {
  const [editData, setEditData] = useState({
    teamFileList: '',
    workerList: []
  })
  const [originData, setOriginData] = useState([])

  const getDataByStepId = async () => {
    console.log('params', reportDetailStepId, stepIndex, type)

    const res = await detailsByStep(reportDetailStepId)

    if (!res.success) return

    setOriginData(res.data)

    // 设置团队数据
    let teamFileList = ''
    res.data?.forEach(info => {
      if (0 === info.detail.worker_uid) {
        teamFileList = info[type]
      }
    })

    // 设置个人数据
    let workerList = []
    res.data?.forEach(info => {
      if (0 !== info.detail.worker_uid) {

        const tmpState = {
          worker_name: '',
          file_list: []
        }

        tmpState.worker_name = info.detail?.worker?.name ?? ''

        if ("" !== info[type]) {
          tmpState.file_list = info[type].split(',').map(item => {
            return {
              file_id: item,
              select_state: includes(teamFileList.split(','), item)
            }
          })
        }

        workerList.push(tmpState)
      }
    })

    setEditData(produce(draft => {
      draft.teamFileList = teamFileList
      draft.workerList = workerList
    }))
  }

  const handleValueChange = (fileId: any, i: any, j: any) => {
    console.log(fileId, i, j)
    // 先将checkbox的勾选掉
    setEditData(produce(draft => {
      draft.workerList[i].file_list[j].select_state = !draft.workerList[i].file_list[j].select_state
    }))

    // 再将当前页面的团队id更新掉
    let teamFileList = editData.teamFileList.split(',')
    console.log(teamFileList)
    const index = teamFileList.indexOf(fileId);

    if (index > -1) {
      // 包含则移除
      teamFileList.splice(index, 1);
    } else {
      // 不包含则添加
      teamFileList.push(fileId);
    }

    setEditData(produce(draft => {
      draft.teamFileList = teamFileList.join(',')
    }))

    // 再将外层大state的数据更新掉
    handleChange(stepIndex, type, teamFileList.join(','))
  }

  const handleTeamsChange = (fileIds: any) => {

    console.log('新fileIds', fileIds)

    // 清洗个人数据
    let workerList = []
    originData?.forEach(info => {
      if (0 !== info.detail.worker_uid) {

        const tmpState = {
          worker_name: '',
          file_list: []
        }

        tmpState.worker_name = info.detail?.worker?.name ?? ''

        if ("" !== info[type]) {
          tmpState.file_list = info[type].split(',').map(item => {
            return {
              file_id: item,
              select_state: includes(fileIds.split(','), item)
            }
          })
        }

        workerList.push(tmpState)
      }
    })

    setEditData(produce(draft => {
      draft.teamFileList = fileIds
      draft.workerList = workerList
    }))

    // 再将外层大state的数据更新掉
    handleChange(stepIndex, type, fileIds)
  }

  useEffect(() => {
    getDataByStepId()
  }, []);

  return (
    <>
      <div>
        <UploadFiles value={editData.teamFileList} onChange={(e) => {
          handleTeamsChange(e)
        }} fileLength={ !['image_list', 'video_list'].includes(type) ? 1 : 999}/>
      </div>

      <div>
        {
          editData?.workerList?.map((item, i) => {
            return (
              <>
                <div>
                  {item?.worker_name}:
                </div>
                {
                  item?.file_list.map((file, j) => {
                    return <Space key={file}>
                      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <Checkbox checked={file?.select_state} onChange={() => {
                          handleValueChange(file?.file_id, i, j)
                        }}/>
                        <UploadFiles value={file?.file_id} fileLength={1} disabled={true}/>
                      </div>
                    </Space>
                  })
                }
              </>
            )
          })
        }
      </div>
    </>
  )
}

export default EditTeamFile
