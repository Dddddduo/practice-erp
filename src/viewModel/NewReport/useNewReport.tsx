import {useEffect, useState} from "react";
import {getReportTeamList, getTeamDetailByUid, updateStepSync} from "@/services/ant-design-pro/report";
import StepList from "@/pages/Order/Report/components/new_model/components/stepList";
import {isEmpty} from "lodash";
import {message} from "antd";

export  const useNewReport = (params) => {
  const [teamList, setTeamList] = useState([])
  const [reportDetailList, setReportDetailList] = useState([])
  const [selectedTeam, setSelectedTeam] = useState({
    key: 0,
    label: '团队'
  })
  const [showSign, setShowSign] = useState(false)

  const [messageApi, contextHolder] = message.useMessage();

  const handleCloseSign = (open: any) => {
    setShowSign(open)
  }

  const success = (text: string) => {
    messageApi.open({
      type: 'success',
      content: text,
    });
  };

  const error = (text: string) => {
    messageApi.open({
      type: 'error',
      content: text,
    });
  };

    // 处理值更新
  const handleValueChange = (itemIndex: any, stepIndex: any,  key: any, value: any) => {
    let newList = [...reportDetailList]

    if (key === 'desc') {
      newList[itemIndex].step_list[stepIndex].desc = value
    }

    if (key === 'image_list') {
      newList[itemIndex].step_list[stepIndex].image_list = value
    }

    if (key === 'image_before') {
      newList[itemIndex].step_list[stepIndex].image_before = value
    }

    if (key === 'image_after') {
      newList[itemIndex].step_list[stepIndex].image_after = value
    }

    if (key === 'video_list') {
      newList[itemIndex].step_list[stepIndex].video_list = value
    }

    if (key === 'video_before') {
      newList[itemIndex].step_list[stepIndex].video_before = value
    }

    if (key === 'video_after') {
      newList[itemIndex].step_list[stepIndex].video_after = value
    }

    setReportDetailList(newList)
  }

  // 导出手风琴的数据
  const exportCollapse = (listData: any, currentTeam: any) => {
   return  listData.map((item, index) => {
      return {
        key: index,
        label: item.detail_title,
        children: <StepList
          reportDetailList={reportDetailList}
          itemIndex={index}
          disabled={currentTeam.key !== 0}
          handleChange={(itemIndex, stepIndex, key, value) => handleValueChange(itemIndex, stepIndex, key, value)}
          handleUpdateStep={(itemIndex, stepIndex) => handleUpdateStep(itemIndex, stepIndex)}
        />
      }
    })
  }

  // 获取步骤列表
  const fetchProcessList = async (uid: any) => {
    const res = await getTeamDetailByUid({
      report_id: params?.report_id ?? 0,
      worker_uid: uid,
    });

    if (res.success) {
      const newList = Object.keys(res?.data).map(key => {
        return {
          ...res?.data[key],
        }
      })
      setReportDetailList(newList)
    }
  }

  // 仅更新步骤
  const handleUpdateStep = async (itemIndex: any, stepIndex: any) => {

    const values = reportDetailList[itemIndex].step_list[stepIndex]

    const params = {
      desc: values?.desc ?? '',
      image_list: values?.image_list ?? '',
      image_before: values?.image_before ?? '',
      image_after: values?.image_after ?? '',
      video_list: values?.video_list ?? '',
      video_before: values?.video_before ?? '',
      video_after: values?.video_after ?? '',
      report_detail_step_id: values?.report_detail_step_id ?? 0
    };

    const res = await updateStepSync(params)

    if (res.success) {
      success('修改更新')
      fetchProcessList(selectedTeam?.key ?? 0)
    } else {
      error('修改失败')
    }
  }

  // 获取团队列表
  const fetchTeamList = async () => {
    const res = await getReportTeamList({
      report_id: params?.report_id ?? 0
    });

    if (res.success) {
      const newList = Object.keys(res?.data).map(key => {
        return {
          label: key,
          key: res?.data[key],
        }
      });
      setTeamList(newList)
      setSelectedTeam(newList[0])
      fetchProcessList(newList[0]?.key ?? 0)
    }
  }


  // 处理切换团队
  const handleChangeTab = (uid: any) => {
    console.log(uid)
    const filterTeam = teamList.filter(item => uid === item.key)

    if (!isEmpty(filterTeam)) {
      setSelectedTeam(filterTeam[0])

      fetchProcessList(filterTeam[0].key ?? 0)
    }
  }

  // 签单同步

  useEffect(() => {
    fetchTeamList()
  }, []);

  useEffect(() => {
    exportCollapse(reportDetailList, selectedTeam)
  }, [reportDetailList]);

  return {
    teamList,
    reportDetailList,
    selectedTeam,
    contextHolder,
    showSign,
    handleChangeTab,
    exportCollapse,
    handleCloseSign,
  }
}
