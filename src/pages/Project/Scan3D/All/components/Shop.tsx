import React, { useState } from "react"
import { ProCard } from '@ant-design/pro-components';
import { Button, Modal } from "antd";
import Share from "./Share";
import '../index.css'
import { EditOutlined, ShareAltOutlined } from "@ant-design/icons";

interface ItemListProps {
  shopMessage: any
  editScan: (item) => void
  showVideo: (shopVideo) => void
  showMap: (item) => void
}

/**
 * 3DScan 组件左边店铺
 * @constructor
 */

const shops: React.FC<ItemListProps> = ({
  shopMessage,
  editScan,
  showVideo,
  showMap
}) => {
  // 获取Scan id
  const { id } = shopMessage

  // 鼠标移入
  const [active, setActive] = useState(false)
  // 是否显示分享图层
  const [shouShareModel, setShowShareModel] = useState(false)
  // 鼠标移入
  const onMouseEnter = (item) => {
    setActive(true)
    showMap(item)
  }
  // 鼠标离开
  const onMouseLeave = () => {
    setActive(false)
  }
  // 打开分享弹窗
  const onShowShareModel = () => {
    setShowShareModel(true)
  }

  // 关闭分享弹窗
  const onCloseShareModel = () => {
    setShowShareModel(false)
  }

  return (
    <ProCard
      hoverable
      bordered
      className="shop-item-card"
      onMouseEnter={() => onMouseEnter(shopMessage)}
      onMouseLeave={onMouseLeave}
    >
      <div
        style={{
          height: '200px',
          backgroundImage: `url(${shopMessage?.bg_file_url_thumb})`,
          backgroundColor: "#414A48",
          borderRadius: "5px",
          position: "relative"
        }}
        onClick={() => showVideo(shopMessage.url)}
      >
        <div className={active ? "shop-item-mask" : ''} />
        <div className={active ? "shop-item-icon" : ''} />
      </div>
      <div className="shop-bottom">
        <div className="shop-name">{shopMessage?.store_name_cn}</div>
        <div className="shop-btn">
          <ShareAltOutlined style={{ fontSize: 18 }} onClick={onShowShareModel} />
          <EditOutlined style={{ fontSize: 18 }} onClick={() => editScan(shopMessage)} />
        </div>
      </div>

      <Modal
        open={shouShareModel}
        footer={null}
        width={800}
        onCancel={onCloseShareModel}
        destroyOnClose
        maskClosable={false}
      >
        <Share onCloseShareModel={onCloseShareModel} scanId={id} />
      </Modal>

    </ProCard>
  )
}

export default shops