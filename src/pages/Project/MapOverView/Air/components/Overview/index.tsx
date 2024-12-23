import { ProCard } from "@ant-design/pro-components"
import Plan from "./Plan"
import Weather from "./Weather"
import Instructions from "./Instructions"
import React, { useEffect, useState } from "react"
import { Button, Card, Modal } from "antd"
import Params from "../Params"
import Electric from "./Electric"
import Lamp from "./Lamp"
import WaterTank from "../WaterTank"
import { isEmpty } from "lodash"
import { Popconfirm } from 'antd';
import { QuestionCircleOutlined, CloseOutlined } from '@ant-design/icons';

interface ItemListProps {
  floorDetail: any
  airDetail: any,
  city: string
  floor: string
}

const Overview: React.FC<ItemListProps> = ({
  floorDetail,
  airDetail,
  city,
  floor
}) => {
  const [showParams, setShowParams] = useState(false)
  const [showElectricEnergy, setShowElectricEnergy] = useState(false)
  const [showLamp, setShowLamp] = useState(false)
  const [showWaterTank, setShowWaterTank] = useState(false)
  const [formatAir, setFormatAir] = useState<any>([])

  const [paramOpen, setParamOpen] = useState<boolean>(false);
  const [lampOpen, setLampOpen] = useState<boolean>(false);
  const [waterOpen, setWaterOpen] = useState<boolean>(false);


  useEffect(() => {
    if (!isEmpty(airDetail) && !isEmpty(airDetail[floor]) && !isEmpty(airDetail[floor].ac_list)) {

      for (const key in airDetail[floor].ac_list) {
        airDetail[floor].ac_list[key].name = key // 为每个机器里面添加一个name
      }

      setFormatAir(Object.values(airDetail[floor].ac_list))
    }
  }, [airDetail, floorDetail])

  return (
    <>
      <ProCard
        split='vertical'
        headerBordered
      >
        {/* 平面图 */}
        <ProCard colSpan="80%">
          <div style={{ height: 800 }}>
            <Plan
              airDetail={formatAir}
              floorDetail={floorDetail}
              floor={floor}
            />
          </div>
        </ProCard>

        {/* 右边操作 */}
        <ProCard>
          <div style={{ height: 800 }}>
            <Card style={{ marginBottom: 20 }}>
              <div>
                <Button
                  type="primary"
                  style={{ margin: 5 }}
                  onClick={() => setShowParams(true)}
                >
                  系统参数
                </Button>
                <Button
                  type="primary"
                  style={{ margin: 5 }}
                  onClick={() => setShowElectricEnergy(true)}
                >
                  电能数据
                </Button>
                <Button
                  type="primary"
                  style={{ margin: 5 }}
                  onClick={() => setShowLamp(true)}
                >
                  照明操作
                </Button>
                <Button
                  type="primary"
                  style={{ margin: 5 }}
                  onClick={() => setShowWaterTank(true)}
                >
                  水箱检测
                </Button>
              </div>
            </Card>

            {/* 天气 */}
            <Weather city={city} />

            {/* 说明 */}
            <Instructions />
          </div>
        </ProCard>
      </ProCard>

      <Modal
        width='90vw'
        open={showParams}
        onCancel={() => setShowParams(false)}
        closeIcon={<div style={{ marginTop: '4px' }}><CloseOutlined /></div>}
        footer={null}
        style={{ top: 20 }}
        destroyOnClose={true}
        title={
          <div style={{ display: 'flex', justifyContent: 'end', marginRight: '30px' }}>
            <div style={{ fontSize: '16px', fontWeight: 'bold', marginRight: '6px' }}>帮助</div>
            <Popconfirm
              title="教程"
              description="是否开启引导教程?"
              onConfirm={() => setParamOpen(true)}
              okText="开始"
              cancelText="取消"
            >
              <QuestionCircleOutlined style={{ fontSize: '18px' }} />
            </Popconfirm>
          </div>
        }
      >
        <Params airDetail={airDetail[floor]} tourOpen={paramOpen} handleCloseOpen={() => setParamOpen(false)} />
      </Modal>

      <Modal
        width='90vw'
        open={showElectricEnergy}
        onCancel={() => setShowElectricEnergy(false)}
        footer={null}
        style={{ top: 20 }}
        destroyOnClose={true}
      >
        {
          !isEmpty(airDetail) && !isEmpty(airDetail[floor]) && !isEmpty(airDetail[floor].ac_list) && <Electric acList={airDetail[floor].ac_list} />
        }
      </Modal>

      <Modal
        width='90vw'
        open={showLamp}
        onCancel={() => setShowLamp(false)}
        closeIcon={<div style={{ marginTop: '4px' }}><CloseOutlined /></div>}
        footer={null}
        style={{ top: 20 }}
        destroyOnClose={true}
        title={
          <div style={{ display: 'flex', justifyContent: 'end', marginRight: '30px' }}>
            <div style={{ fontSize: '16px', fontWeight: 'bold', marginRight: '6px' }}>帮助</div>
            <Popconfirm
              title="教程"
              description="是否开启引导教程?"
              onConfirm={() => setLampOpen(true)}
              okText="开始"
              cancelText="取消"
            >
              <QuestionCircleOutlined style={{ fontSize: '18px' }} />
            </Popconfirm>
          </div>
        }
      >
        {
          !isEmpty(airDetail) && !isEmpty(airDetail[floor]) && !isEmpty(airDetail[floor].ac_list) && <Lamp acList={airDetail[floor].ac_list} tourOpen={lampOpen} handleCloseOpen={() => setLampOpen(false)} floor={floor} />
        }
      </Modal>

      <Modal
        width='90vw'
        open={showWaterTank}
        onCancel={() => setShowWaterTank(false)}
        closeIcon={<div style={{ marginTop: '4px' }}><CloseOutlined /></div>}
        footer={null}
        style={{ top: 20 }}
        destroyOnClose={true}
        title={
          <div style={{ display: 'flex', justifyContent: 'end', marginRight: '30px' }}>
            <div style={{ fontSize: '16px', fontWeight: 'bold', marginRight: '6px' }}>帮助</div>
            <Popconfirm
              title="教程"
              description="是否开启引导教程?"
              onConfirm={() => setWaterOpen(true)}
              okText="开始"
              cancelText="取消"
            >
              <QuestionCircleOutlined style={{ fontSize: '18px' }} />
            </Popconfirm>
          </div>
        }
      >
        {
          !isEmpty(airDetail) && !isEmpty(airDetail[floor]) && !isEmpty(airDetail[floor].ac_list) && <WaterTank acList={airDetail[floor].ac_list} tourOpen={waterOpen} handleCloseOpen={() => setWaterOpen(false)} />
        }
      </Modal>
    </>
  )
}

export default Overview