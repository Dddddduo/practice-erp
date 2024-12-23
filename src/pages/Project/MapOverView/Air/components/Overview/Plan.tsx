import { Modal, Popover, Tooltip } from "antd"
import React, { useEffect, useRef, useState } from "react"
import { isEmpty, max, min } from "lodash"
import Vrv from "../AirDetail/Vrv"
import Fcu from "../AirDetail/Fcu"
import Ahu from "../AirDetail/Ahu"
import AhuVrv from "../AirDetail/AhuVrv"
import Intro from "./Intro"
import IaqBox from "./IaqBox"
import { CloseCircleOutlined } from '@ant-design/icons';

interface ItemListProps {
  airDetail: any
  floorDetail: any
  floor: any
}

const Plan: React.FC<ItemListProps> = ({
  airDetail,
  floorDetail,
  floor
}) => {
  const [showVrv, setShowVrv] = useState(false)
  const [showAhu, setShowAhu] = useState(false)
  const [showFcu, setShowFcu] = useState(false)
  const [showAV, setShowAV] = useState(false)
  const [acList, setAcList] = useState<any>([])

  const [type, setType] = useState('')
  const iconSize = 40

  const [detail, setDetail] = useState<any>()
  const [groupData, setGroupData] = useState({})
  const [ehData, setEhData] = useState({})

  const [showIaq, setShowIaq] = useState(false)

  const [showDeviceId, setShowDeviceId] = useState(0)

  const width = useRef<any>()

  // 计算图片
  const calcImage = (c_w, c_h, i_w, i_h) => {
    let β: number = 0
    if (c_w / i_w <= c_h / i_h) {
      β = c_w / i_w;
    } else {
      β = c_h / i_h;
    }
    return {
      β: β,
      d_x: (c_w - i_w * β) / 2,
      d_y: (c_h - i_h * β) / 2
    }
  }

  // 计算点位
  const calcShape = (shapes, result) => {
    const { β, d_x, d_y } = result
    let x: number[] = []
    let y: number[] = []
    shapes.map((shape: number) => {
      x.push(shape[0])
      y.push(shape[1])
    })
    return {
      x: (max(x) * β - min(x) * β) / 2 + min(x) * β + d_x - iconSize / 2,
      y: (max(y) * β - min(y) * β) / 2 + min(y) * β + d_y - iconSize / 2
    }
  }

  const findSingleGroup = (item: any) => {

    setDetail(item)
    if (!isEmpty(item.group_id) && Number(item.group_id) > 0) {
      acList.map((ac) => {
        if (ac.group_id == item.group_id && ac.device_type == 'eh') {
          console.log('eh的', ac.name, ac.group_id);
          setEhData(ac)
        }
      })
    }
  }

  const findGroup = (item: any) => {

    let group = {}

    if (!isEmpty(item.group_id) && Number(item.group_id) > 0) {
      acList.map((ac) => {
        if (ac.group_id == item.group_id && ac.device_type == 'eh') {
          console.log('eh的', ac.name, ac.group_id);
          setEhData(ac)
        }

        if (ac.group_id == item.group_id && ac.device_type == 'ahu') {
          console.log('ahu的', ac.name, ac.group_id);
          group[ac.name] = ac
        }

        if (ac.group_id == item.group_id && ac.device_type == 'vrv') {
          console.log('vrv的', ac.name, ac.group_id);
          group[ac.name] = ac
        }

      })

      console.log('打印拼接好的group数据 <-------', group)
      setGroupData(group)
    }
  }

  const handleShowInfo = (item) => {
    setShowDeviceId(0)


    if (item.device_type != 'iaq') {
      setShowDeviceId(item.device_id)
    }


    if (item.group_type !== 'ahuvrv' && item.device_type === 'vrv') {
      setType('vrv')
      findSingleGroup(item)
    }

    if (item.group_type !== 'ahuvrv' && item.device_type === 'ahu') {
      setType('ahu')
      findSingleGroup(item)
    }

    if (item.group_type !== 'ahuvrv' && item.device_type === 'fcu') {
      setType('fcu')
      findSingleGroup(item)
    }

    if (item.group_type !== 'ahuvrv' && item.device_type === 'tank') {
      setType('tank')
      findSingleGroup(item)
    }

    if (item.device_type === 'iaq') {
      setShowIaq(true)
      setDetail(item)
    }

    if (item.group_type === 'ahuvrv') {
      setType('ahuvrv')
      findGroup(item)
    }

  }

  // 点击显示详情
  const handleGoDetail = () => {
    setShowDeviceId(0)
    if (type === 'vrv') {
      setShowVrv(true)
    }
    if (type === 'ahu') {
      setShowAhu(true)
    }
    if (type === 'fcu') {
      setShowFcu(true)
    }
    if (type === 'ahuvrv') {
      setShowAV(true)
    }
  }



  const handleIcon = (item: any): string => {
    let iconpath = ''
    if (item['device_type'] == 'iaq') {
      if (item['状态']['value'] == '优') {
        iconpath = '/air-condition/iaq.png';
      } else if (item['状态']['value'] == '良') {
        iconpath = '/air-condition/iaq-w.png';
      } else if (item['状态']['value'] == '差') {
        iconpath = '/air-condition/iaq-e.png';
      }
    } else {
      if (item['status']['warning'] == 'water_lacking') {
        iconpath = '/air-condition/air-condition-water-leakage.png';
      } else if (item['status']['warning'] == 'warning') {
        iconpath = '/air-condition/warning_btn.png';
      } else if (item['status']['desc'] == 'stop') {
        iconpath = '/air-condition/stop_btn.png';
      } else if (item['status']['desc'] == 'running') {
        iconpath = '/air-condition/running_btn.png';
      }
    }
    return iconpath;
  }

  useEffect(() => {
    if (floorDetail && !isEmpty(airDetail)) {

      let centerPointList: any = []

      const calc = () => {
        const result = calcImage(width?.current?.offsetWidth, width?.current?.offsetHeight, floorDetail.image_width, floorDetail.image_height)

        airDetail.map((item: any) => {
          if (item.device_location) {
            const centerPoint = calcShape(JSON.parse(item.device_location), result)

            centerPointList.push({
              ...item,
              x: centerPoint.x,
              y: centerPoint.y,
              showDetail: false
            })
          } else {
            centerPointList.push({
              ...item,
              x: 0,
              y: 0,
              showDetail: false
            })
          }
        })
      }

      calc()
      setAcList(centerPointList)
    }


  }, [airDetail, floorDetail])

  return (
    <>
      <div
        ref={width}
        style={{
          backgroundImage: `url(/air-condition/1193_${floorDetail?.floor}.png)`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          width: '100%',
          height: '100%',
          position: 'relative'
        }}
      >
        {
          acList.map((item: any) => {
            if (item.x === 0) {
              return <div key={item.name}></div>
            } else {
              return (
                <Popover
                  key={item.name}
                  title={
                    <div style={{
                      textAlign: 'start'
                    }}>
                      <CloseCircleOutlined style={{ fontSize: '20px' }} onClick={() => setShowDeviceId(0)} />
                    </div>
                  }
                  content=
                  {
                    <Intro detail={detail}
                      group={groupData}
                      type={type}
                      onTapDetail={handleGoDetail}
                    />
                  }
                  trigger="click"
                  open={item.device_id == showDeviceId}
                  onOpenChange={(_) => handleShowInfo(item)}
                  placement="rightTop"
                >
                  <Tooltip
                    placement={item.device_position === 'up' ? 'top' : (item.device_position === 'down' ? 'bottom' : (item.device_position === 'left' ? 'left' : 'right'))}
                    title={item.name}
                    open={true}
                    trigger="click"
                    zIndex={1}
                    autoAdjustOverflow={false}
                  >
                    <img
                      style={{ width: iconSize, position: 'absolute', left: item.x, top: item.y }}
                      src={handleIcon(item)}
                    />
                  </Tooltip>
                </Popover>

              )
            }

          })
        }
      </div>

      <Modal
        width='90vw'
        open={showVrv}
        onCancel={() => {
          setShowVrv(false)
          setDetail({})
        }}
        footer={null}
        style={{ top: 20 }}
        destroyOnClose={true}
      >
        <Vrv
          detail={detail}
          airDetail={airDetail}
          floor={floor}
        />
      </Modal>

      <Modal
        width='90vw'
        open={showAhu}
        onCancel={() => {
          setShowAhu(false)
          if (!isEmpty(ehData)) {
            setEhData({})
          }
        }}
        footer={null}
        style={{ top: 20 }}
        destroyOnClose={true}
      >
        <Ahu
          detail={detail}
          airDetail={airDetail}
          ehData={ehData}
          floor={floor}
        />
      </Modal>

      <Modal
        width='90vw'
        open={showFcu}
        onCancel={() => {
          if (!isEmpty(ehData)) {
            setEhData({})
          }
          setShowFcu(false)
        }}
        footer={null}
        style={{ top: 20 }}
        destroyOnClose={true}
      >
        <Fcu
          detail={detail}
          airDetail={airDetail}
          ehData={ehData}
          floor={floor}
        />
      </Modal>

      <Modal
        width='90vw'
        open={showAV}
        onCancel={() => {
          if (!isEmpty(ehData)) {
            setEhData({})
          }
          setShowAV(false)
        }}
        footer={null}
        style={{ top: 20 }}
        destroyOnClose={true}
      >
        <AhuVrv
          groupData={groupData}
          airDetail={airDetail}
          ehData={ehData}
          floor={floor}
        />
      </Modal>

      <Modal
        width='90vw'
        open={showIaq}
        onCancel={() => {
          setShowIaq(false)
        }}
        footer={null}
        style={{ top: 20 }}
        destroyOnClose={true}
      >
        <IaqBox detail={detail} />
      </Modal>
    </>
  )
}

export default Plan
