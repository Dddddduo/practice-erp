import './index.css'
import React, { useState, useEffect, useReducer } from "react"
import { getScanList } from "@/services/ant-design-pro/project";
import { PageContainer, ProCard } from '@ant-design/pro-components';
import Shops from "./components/Shop";
import Map from "./components/Map"
import AddEdit from './components/AddEdit';
import { Button, Modal, ConfigProvider, Drawer, message } from 'antd';



/**
 * 3DScan 组件主体
 * @constructor
 */
const Scan: React.FC = () => {
  // const [responsive, setResponsive] = useState(false);
  // 3D SCan列表
  const [scanList, setScanList] = useState([])
  // 视频
  const [video, setVideo] = useState('')
  // 视频弹窗
  const [shouVideoModel, setShowVideoModel] = useState(false)
  // 鼠标移入的当前值
  const [currentMsg, setCurrentMsg] = useState({})
  // 新增或者编辑抽屉
  const [showDrawer, setShowDrawer] = useState(false)
  // 配置Message
  const [messageApi, contextHolder] = message.useMessage();
  // 成功Message
  const success = (text: string) => {
    messageApi.open({
      type: 'success',
      content: text,
    });
  };

  // 失败Message
  const error = (text: string) => {
    messageApi.open({
      type: 'error',
      content: text,
    });
  };


  const fetchInitData = async ({ current, pageSize, ...parmars }) => {
    // 配置参数
    const customParams = {
      page: current,
      pageSize: pageSize,
    };
    const res = await getScanList(customParams)
    console.log(res.data);
    setScanList(res.data.list)
    setCurrentMsg(res.data.list[0])
  }

  // 编辑按钮
  const editScan = (item) => {
    console.log(item);
    setShowDrawer(true)
    setCurrentMsg(item)
  }

  // 点击显示视频
  const showVideo = (video) => {
    console.log(video);
    setVideo(video)
    setShowVideoModel(true)
  }

  // 展示地图
  const showMap = (mapCenter) => {
    setCurrentMsg(mapCenter)
  }



  const handleClose = () => {
    setShowDrawer(false)
  }

  const addScan = () => {
    setShowDrawer(true)
    setCurrentMsg('')
  }

  useEffect(() => {
    const fetchData = async () => {
      const param = {
        current: 1,
        pageSize: 20
      }
      await fetchInitData(param)
    }
    fetchData()
  }, [])

  return (
    <PageContainer>
      {contextHolder}
      <ProCard
        title="3D Scan"
        // split={responsive ? 'horizontal' : 'vertical'}
        bordered
        boxShadow
        headerBordered
        style={{ position: 'relative' }}
      >
        <Button type='primary' className='addBtn' onClick={addScan}>新增</Button>
        <ProCard colSpan="65%">
          <div style={{ height: 460, overflow: "auto" }} className="scan_left">
            {scanList.map((item: any) => {
              return (
                <Shops
                  key={item.id}
                  shopMessage={item}
                  editScan={editScan}
                  showVideo={showVideo}
                  showMap={showMap}
                />
              )
            })}
          </div>
        </ProCard>
        <ProCard>
          <Map currentMsg={currentMsg}></Map>
        </ProCard>
      </ProCard>

      <ConfigProvider
        theme={{
          components: {
            Modal: {
              contentBg: 'transparent'
            },
          },
        }}
      >
        <Modal
          open={shouVideoModel}
          footer={null}
          width={1000}
          onCancel={() => setShowVideoModel(false)}
          destroyOnClose
          maskClosable={false}
        >
          <iframe
            id="iframe"
            src={video}
            style={{ width: "100%", height: '650px' }}
            allowfullscreen="true"
          />
        </Modal>
      </ConfigProvider>
      <Drawer
        width={600}
        closable={false}
        destroyOnClose={true}
        open={showDrawer}
        onClose={handleClose}
      >
        <AddEdit
          currentMsg={currentMsg}
          onClose={handleClose}
          fetchInitData={fetchInitData}
          success={success}
          error={error}
        />
      </Drawer>
    </PageContainer>
  )
}

export default Scan