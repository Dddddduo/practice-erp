import React, {useEffect, useState} from 'react';
import {Typography, Tabs, CollapseProps, Collapse, message, Button, Modal} from 'antd';
import {isEmpty, sortBy} from "lodash";


import TeamStep from "@/pages/Order/Report/components/TeamStep";
import {
  getACReportFloorList,
  getACReportSomeOneCountListByDeviceName,
  updateReportSign
} from "@/services/ant-design-pro/report";
import {getSameAppoSignList} from "@/services/ant-design-pro/orderList";
import UploadFiles from "@/components/UploadFiles";

type TabKey = string | string[];


interface TemplateListProps {
  lockStatus: boolean;
  itemUsers: { [key: string]: number };
  onTabClick: (key: TabKey) => void;
  teamDetailList: { [key: string]: any };
  selectedRow: API.ReportListItem;
  selectedTab: number;
  appoTaskId: number;
}


const TemplateList: React.FC<TemplateListProps> = ({
                                                     lockStatus,
                                                     itemUsers,
                                                     onTabClick,
                                                     teamDetailList,
                                                     selectedRow,
                                                     selectedTab,
                                                     appoTaskId
                                                   }) => {
  const [floor, setFloor] = useState<{ [key: string]: string }[]>([]);
  const [acInfo, setAcInfo] = useState<{ [key: string]: string }>({});
  const [showSignBtn, setShowSignBtn] = useState<boolean>(true)
  const [signList, setSignList] = useState<any>()
  const [showSignModal, setShowSignModal] = useState<boolean>(false)

  const lockStr = lockStatus ? '已锁定' : '未锁定';

  const handleItemsChange = async (key: TabKey) => {

    if (isEmpty(key)) {
      return;
    }

    const index = parseInt(key[0]);

    if (2 !== index) {
      return;
    }

    console.log('handleItemsChange:', selectedRow);


    const reportId = selectedRow.id;

    try {
      const floorList = await getACReportFloorList({
        report_id: reportId
      });

      if (!floorList.success) {
        return;
      }

      const floorData = floorList.data[0];

      const acReportParams = {
        report_id: reportId,
        worker_uid: selectedTab < 0 ? 0 : selectedTab,
        floor_type: floorData,
        data_group_type: 'device_name'
      };

      console.log('acReportParams:', acReportParams);
      const result = await getACReportSomeOneCountListByDeviceName(acReportParams);

      if (!result.success) {
        return;
      }

      setFloor(floorList.data);
      setAcInfo(result.data);
    } catch (error) {
      message.error((error as Error).message)
    }

  };

  const changeCurrentFloor = async (val) => {
    const acReportParams = {
      report_id: selectedRow.id,
      worker_uid: selectedTab < 0 ? 0 : selectedTab,
      floor_type: floor[val],
      data_group_type: 'device_name'
    };

    const result = await getACReportSomeOneCountListByDeviceName(acReportParams);

    if (!result.success) {
      return [];
    }

    setAcInfo(result.data);
  }


  const createTabs = (itemUsers: { [key: string]: number }, teamItems: CollapseProps['items']) => {
    if (isEmpty(itemUsers)) {
      return [];
    }

    let tabs: any = []

    tabs = Object.entries(itemUsers).map(([label, key]) => {
      return {
        key: key.toString(),
        label: label,
        children: (
          <Collapse key={key} items={teamItems} onChange={handleItemsChange}/>),
      };
    });

    // 使用 sortBy 方法进行排序
    tabs = sortBy(tabs, function (item) {
      // 将 label 是 '团队' 的项排到最前面
      return item.label !== '团队';
    })

    return tabs
  }

  const createTeamDetailList = (dataItem: any, floorInfo: { [key: string]: any }[] = []): CollapseProps['items'] => {

    if (isEmpty(dataItem)) {
      return [];
    }

    const nameKeys = Object.keys(dataItem);
    // const values = Object.values(dataItem);
    return nameKeys.map((item, index) => {
      const defaultNode = <div>暂无数据</div>
      let stepList = null;
      let items = dataItem[item] ?? [];
      if (!isEmpty(items) && !isEmpty(items['step_list'])) {
        stepList = items['step_list'];
      }

      let render = {
        key: index,
        label: `${item} - ${dataItem[item]['step_list_percent']}`,
        children: null === stepList ? defaultNode : Object.entries(stepList).map(([k, value]) => {
          return <TeamStep selectedTab={selectedTab} key={`${index}_${k}`} step={value} no={parseInt(k) + 1}/>;
        }),
      };

      if ('空调维保：设备维保' === item) {
        console.log('acInfoacInfoacInfoacInfoacInfo', acInfo);
        const teamItems = Object.entries(acInfo).map(([idx]) => {
          const ac = acInfo[idx] ?? null;
          console.log('hhhh:', ac);
          return {
            key: idx,
            label: `${idx} - ${ac['step_list_percent']}`,
            children: isEmpty(ac?.step_list) ? defaultNode : Object.entries(ac.step_list).map(([k, v]) => {
              console.log("'空调维保：设备维保:", k, v);
              return <TeamStep selectedTab={selectedTab} key={`${idx}_${k}`} step={v} no={parseInt(k) + 1}/>;
            }),
          };
        });

        console.log('teamItems:', teamItems, floorInfo);

        const floorItems = floorInfo.map((item, idx) => {
          return {
            key: idx.toString(),
            label: item,
            children: (<Collapse key={idx} items={teamItems} onChange={item => console.log(item, idx)}/>),
          };
        })

        // @ts-ignore
        render = {
          ...render,
          // onChange: handleTeamDetailClick onTabClick={}
          children: (
            <Tabs key={"device_tabs"} defaultActiveKey="0" items={floorItems} onChange={(val) => changeCurrentFloor(val)}/>
          ),
        }
      }

      return render;
    });
  }

  // tab对应的步骤列表
  const teamItems = createTeamDetailList(teamDetailList, floor);
  // tab切换组件
  const tabsItems = createTabs(itemUsers, teamItems);

  // 当 acInfo 改变时，重新计算 teamItems
  useEffect(() => {
    createTeamDetailList(acInfo, floor); // 假设这是基于 acInfo 和 floor 重新计算的
  }, [acInfo]); // 依赖于 acInfo 的变化

  useEffect(() => {
    setShowSignBtn( selectedTab <= 0)
  }, [selectedTab])

  const setSignShow = () => {
    setShowSignModal(true)
    getSameAppoSignList({ appo_task_id: appoTaskId }).then(res => {
      if (res.success && res.data[0]) {
        setSignList(res.data[0]['sign_ids'])
        return
      }
      message.error(res.message)
    })
  }

  const changeUploadSign = (val: any) => {
    setSignList(val)
  }

  const syncReportSigns = () => {
    updateReportSign({report_id: selectedRow.id, image_list: signList}).then((res) => {
      if (res.success) {
        message.success('签单同步成功')
      }
    })
  }

  return (
    <>
      <Tabs defaultActiveKey="1" items={tabsItems} onTabClick={val => onTabClick(val)}/>
      {
        showSignBtn && <Button type={"primary"} onClick={() => setSignShow()} style={{marginTop: '20px'}}>签单同步</Button>
      }

      <Modal
        title="同步签单"
        centered
        open={showSignModal}
        onOk={() => syncReportSigns()}
        onCancel={() => setShowSignModal(false)}
        width={1000}
      >
        <UploadFiles  value={signList} onChange={(val) => changeUploadSign(val)} allowedTypes={['*']} fileLength={10} showDownloadIcon={false}/>
      </Modal>
    </>
  );
}

export default TemplateList;
