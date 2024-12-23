import React, { useState, useEffect } from "react"
import AMapLoader from "@amap/amap-jsapi-loader"
import "../index.css"
interface ItemListProps {
  currentMsg: any
}


/**
 * 3DScan 组件右边地图
 * @constructor
 */

const Map: React.FC<ItemListProps> = ({
  currentMsg
}) => {
  let map
  useEffect(() => {
    const {store_lon, store_lat} = currentMsg
    AMapLoader.load({
      key: "a8d7a44e1e46e10a36619b0d42437213", // 申请好的Web端开发者Key，首次调用 load 时必填
      version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
      // plugins: [], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
    })
      .then((AMap) => {
        map = new AMap.Map("container", {
          // 设置地图容器id
          viewMode: "2D", // 是否为3D地图模式
          zoom: 15, // 初始化地图级别
          center: [store_lon, store_lat], // 初始化地图中心点位置
        });
          // 创建一个 Marker 实例：
        const marker = new AMap.Marker({
          position: new AMap.LngLat(store_lon, store_lat),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
        });

        // 将创建的点标记添加到已有的地图实例：
        map?.add(marker);
      })
      .catch((e) => {
        console.log(e);
      });
    return () => {
      map?.destroy();
    };
  }, [currentMsg]);

  return (
    <div>
      <div id="container" style={{ height: "250px" }}></div>
      <div style={{marginTop: "20px"}}>
        <ul className="tips-ul">
          <li className="tips-li">
            <div className="tips-title">项目名称：</div>
            <div className="tips-msg">{currentMsg?.store_name_cn}</div>
          </li>
          <li className="tips-li">
            <div className="tips-title">项目地址：</div>
            <div className="tips-msg">{currentMsg?.store_addr_cn}</div>
          </li>
          <li className="tips-li">
            <div className="tips-title">项目面积：</div>
            <div className="tips-msg">{currentMsg?.store_area}㎡</div>
          </li>
          <li className="tips-li">
            <div className="tips-title">完工日期：</div>
            <div className="tips-msg">{currentMsg?.completed_at}</div>
          </li>
          <li className="tips-li">
            <div className="tips-title">拍摄日期：</div>
            <div className="tips-msg">{currentMsg?.scan_at}</div>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Map
