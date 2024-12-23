import React, { useEffect, useRef, useState } from "react"
import { getMachineInfo, getFloors } from "@/services/ant-design-pro/air";
import { useLocation } from "umi";
import { Carousel, Image, Select, Typography } from 'antd';
import Overview from "./components/Overview";
import { ProCard } from "@ant-design/pro-components";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const online = '/air-condition/machine_online.png'
const offline = '/air-condition/machine_offline.png'

// storeID 1193

interface FloorItem {
  floor: string;
  image_width: number;
  image_height: number;
  value: string;
  label: string;
}

const Air: React.FC = () => {
  // 根据参数名称获取具体的路由参数
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const storeId = queryParams.get('store_id');
  const city: any = queryParams.get('city_cn');

  // 定时器id
  const timerId: any = useRef<NodeJS.Timer>();
  // 当前楼层
  const [floor, setFloor] = useState('1F')
  const [floorList, setFloorList] = useState<FloorItem[]>([])
  const [floorDetail, setFloorDetail] = useState<FloorItem | {}>({})
  // 机器数据
  const [infoDetail, setInfoDetail] = useState({})
  // 报警列表
  const [warningList, setWarningList] = useState<string[]>([])


  const getNewDetail = (storeId: string | null, floor: string) => {
    const params = { store_id: storeId, floor, }

    timerId.current = setInterval(() => {
      getMachineInfo(params).then(res => {
        if (res.success) {
          // console.log('获取直接数据 <------------ ✅✅✅', res.data)
          setInfoDetail(res.data)
          handleWarningList(res.data)
        }
      })
    }, 3000)

  }

  // 拼装报警数据
  const handleWarningList = (data: any) => {
    let formatList: any = []

    Object.keys(data).forEach(key => {
      formatList = formatList.concat(data[key].warning)
    });

    setWarningList(formatList)
  }

  // 切换楼层
  const handleChangeFloor = (e: string) => {
    setFloor(e)
    if (timerId) clearInterval(timerId.current); // 清除定时器

    getNewDetail(storeId, e)

    const currentFloor = floorList.find((item: FloorItem) => item.floor === e)

    setFloorDetail(currentFloor)
  }

  useEffect(() => {
    const params = {
      store_id: storeId
    }

    getFloors(params).then((res) => {

      const formatFloor: any = []

      if (res.success && res.data != null) {
        res.data.map((item: FloorItem) => {
          // 添加value和label属性，以适应Select组件数据结构
          item['value'] = item.floor
          item['label'] = item.floor
          formatFloor.push(item)
        })
        setFloorList(formatFloor)
      }

      // 筛选楼层详情
      const currentFloor = formatFloor.find((item: FloorItem) => item.floor === floor)
      // 设置楼层详情
      setFloorDetail(currentFloor)
      // 获取空调数据
      getNewDetail(storeId, floor)
    })

    // 如果组件被卸载时存在定时器，则清除这个定时器
    return () => {
      if (timerId) clearInterval(timerId.current);
    }

  }, [])
  return (
    <ProCard
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Image preview={false} src={online} width={20} style={{ marginTop: -5 }} />
          {warningList.length > 0 && <ExclamationCircleOutlined
            style={{
              color: "red",
              width: 20,
              position: 'absolute',
              left: '3.3vw',
            }}
          />}
          <Carousel
            fade={true}
            autoplay
            dots={false}
            autoplaySpeed={3000}
            style={{
              width: '40vw',
              height: 30,
              marginLeft: '0.5vw',
              color: '#f55',
              border: '1px solid #ccc',
              borderRadius: '1vw',
              textAlign: "center",
              overflow: 'hidden',
            }}
          >
            {
              warningList.map((warning, index) => (
                <div key={index}>
                  <Typography.Text
                    ellipsis={{ tooltip: warning }}
                    style={{
                      width: '30vw',
                      height: 30,
                      color: '#f55',
                      overflow: 'hidden',
                      margin: '0 auto',
                      fontSize: 16
                    }}
                  >
                    {warning}
                  </Typography.Text>
                </div>
              ))
            }
          </Carousel>
        </div>
      }
      split='vertical'
      headerBordered
      extra={
        <Select
          value={floor}
          options={floorList}
          style={{ width: 100 }}
          onChange={(e) => handleChangeFloor(e)}
        />
      }
    >
      <Overview
        airDetail={infoDetail}
        city={city}
        floor={floor}
        floorDetail={floorDetail}
      />
    </ProCard>
  )
}

export default Air