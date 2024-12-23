import React, { useEffect } from "react"
import { ProCard } from "@ant-design/pro-components"
import ForReturnWater from "./ForReturnWater"
import ParamsSetting from "./ParamsSetting"

interface ItemListProps {
  airDetail: any
  tourOpen: boolean,
  handleCloseOpen: () => void
}

const Params: React.FC<ItemListProps> = ({
  airDetail,
  tourOpen,
  handleCloseOpen,
}) => {

  useEffect(() => {
    console.log(airDetail?.params);

  }, [airDetail])

  return (
    <ProCard
      split='vertical'
      headerBordered
    >
      <ProCard colSpan="70%">
        <div style={{ height: 800 }}>
          {/* 左侧圆形数据 */}
          <ForReturnWater
            params={airDetail?.params}
          />
        </div>
      </ProCard>

      <ProCard>
        <div style={{ height: 800 }} >
          {/* 右侧设置 */}
          <ParamsSetting
            params={airDetail?.params}
            tourOpen={tourOpen}
            handleCloseOpen={handleCloseOpen}
          />
        </div>
      </ProCard>
    </ProCard>
  )
}

export default Params