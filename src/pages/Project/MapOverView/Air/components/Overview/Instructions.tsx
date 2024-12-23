import { Card, Image } from "antd"
import React from "react"

interface ItemListProps { }

const songfeng = '/air-condition/air-songfeng.png'
const huifeng = '/air-condition/air-huifeng.png'
const running = '/air-condition/running_btn.png'
const stop = '/air-condition/stop_btn.png'
const warning = '/air-condition/warning_btn.png'
const waterLeakage = '/air-condition/air-condition-water-leakage.png'
const iaq = '/air-condition/iaq.png'
const iaqw = '/air-condition/iaq-w.png'
const iaqe = '/air-condition/iaq-e.png'

const Instructions: React.FC<ItemListProps> = () => {
  return (
    <Card title="指示灯说明">
      <div style={{ display: 'flex', flexWrap: "wrap" }}>
        <div style={{ width: "50%", display: 'flex', alignItems: 'center', marginBottom: 20 }}>
          <Image preview={false} src={songfeng} width={30} />
          <div style={{ marginLeft: 5 }}>送风口</div>
        </div>

        <div style={{ width: "50%", display: 'flex', alignItems: 'center', marginBottom: 20 }}>
          <Image preview={false} src={huifeng} width={30} />
          <div style={{ marginLeft: 5 }}>回风口</div>
        </div>

        <div style={{ width: "50%", display: 'flex', alignItems: 'center', marginBottom: 20 }}>
          <Image preview={false} src={running} width={30} />
          <div style={{ marginLeft: 5 }}>启动</div>
        </div>

        <div style={{ width: "50%", display: 'flex', alignItems: 'center', marginBottom: 20 }}>
          <Image preview={false} src={stop} width={30} />
          <div style={{ marginLeft: 5 }}>停止</div>
        </div>

        <div style={{ width: "50%", display: 'flex', alignItems: 'center', marginBottom: 20 }}>
          <Image preview={false} src={warning} width={20} style={{ marginLeft: 5 }} />
          <div style={{ marginLeft: 15 }}>报警</div>
        </div>

        <div style={{ width: "50%", display: 'flex', alignItems: 'center', marginBottom: 20 }}>
          <Image preview={false} src={waterLeakage} width={20} style={{ marginLeft: 5 }} />
          <div style={{ marginLeft: 15 }}>漏水报警</div>
        </div>

        <div style={{ width: "50%", display: 'flex', alignItems: 'center', marginBottom: 20 }}>
          <Image preview={false} src={iaq} width={20} style={{ marginLeft: 5 }} />
          <div style={{ marginLeft: 15 }}>空气优</div>
        </div>

        <div style={{ width: "50%", display: 'flex', alignItems: 'center', marginBottom: 20 }}>
          <Image preview={false} src={iaqw} width={20} style={{ marginLeft: 5 }} />
          <div style={{ marginLeft: 15 }}>空气良</div>
        </div>

        <div style={{ width: "50%", display: 'flex', alignItems: 'center', marginBottom: 20 }}>
          <Image preview={false} src={iaqe} width={20} style={{ marginLeft: 5 }} />
          <div style={{ marginLeft: 15 }}>空气差</div>
        </div>

      </div>
    </Card>
  )
}

export default Instructions