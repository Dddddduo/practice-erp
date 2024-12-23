import React, { useEffect, useState } from 'react'
import AMapLoader from "@amap/amap-jsapi-loader"
import { getStoreMergeData, getStoreList, getAreaMergeData } from '@/services/ant-design-pro/air'
import ItemList from './components/ItemList'

const data = [
  {
    "lnglat": ["121.502021", "31.236814"],
    "building": "国金中心",
    "market_id": 9,
    "city": "上海",
    "city_id": 1,
    "district": "浦东新区",
    "district_code": "310115",
    "alarm_status": false,
    'color': 'red',
  },
  {
    "lnglat": ["116.479027", "39.910227"],
    "building": "skp",
    "market_id": 13,
    "city": "北京",
    "city_id": 2,
    "district": "朝阳区",
    "district_code": "110105",
    "alarm_status": false,
    'color': 'blue',
  }
]
const MapOverview: React.FC = () => {
  const [showShopList, setShowShopList] = useState(false)
  const [center, setCenter]: any = useState([121.472644, 31.231706])
  const [zoom, setZoom] = useState(5)
  const [city, setCity] = useState('')
  const [areaMergeData, setAreaMergeData] = useState({
    energy_consumption: { k: "能耗", v: "23256.42", unit: "kW·h", desc: "当前区域内所有店铺今日耗电量汇总" },
    outdoor_temperature: { k: "环境", v: "12", unit: "℃", desc: "当前区域室外环境温度均值" },
    room_co2: { k: "CO₂", v: "780.00", unit: "ppm", desc: "当前区域内所有店铺室内CO₂均值" },
    room_humidity: { k: "湿度", v: 0, unit: "%", desc: "当前区域内所有店铺室内湿度均值" },
    room_temperature: { k: "室温", v: 0, unit: "℃", desc: "当前区域内所有店铺室内温度均值" },
    weather: { k: "天气", v: "多云", unit: "", desc: "当前区域室外环境天气情况" }
  })
  const [shopDetail, setDetail] = useState([
    {
      ac_control_button: true,
      brand_cn: "其他",
      brand_en: "Others",
      brand_id: 20,
      city_cn: "上海",
      city_en: "Shanghai",
      city_id: 1,
      district_cn: "静安区",
      district_code: "310106",
      electricity_consumption: "",
      iot_device_button: true,
      lat: "31.234953",
      lng: "121.453735",
      market_cn: "上海置安20F办公室",
      market_en: "",
      market_id: 181,
      room_co2: "1651",
      room_humidity: "50",
      room_temperature: "20",
      store_addr_cn: "",
      store_addr_en: "",
      store_id: 1114,
      store_name_cn: "置安24A",
      store_name_en: "",
    },
    {
      ac_control_button: true,
      brand_cn: "其他",
      brand_en: "Others",
      brand_id: 20,
      city_cn: "上海",
      city_en: "Shanghai",
      city_id: 1,
      district_cn: "静安区",
      district_code: "310106",
      electricity_consumption: "",
      iot_device_button: true,
      lat: "31.234953",
      lng: "121.453735",
      market_cn: "上海置安20F办公室",
      market_en: "",
      market_id: 181,
      room_co2: "",
      room_humidity: "",
      room_temperature: "",
      store_addr_cn: "",
      store_addr_en: "",
      store_id: 1193,
      store_name_cn: "上海恒隆广场",
      store_name_en: "",
    }
  ])

  const reset = () => {
    setShowShopList(false)
    setZoom(5)
    setCenter([121.472644, 31.231706])
  }

  let map

  useEffect(() => {
    AMapLoader.load({
      key: "a8d7a44e1e46e10a36619b0d42437213", // 申请好的Web端开发者Key，首次调用 load 时必填
      version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
      // plugins: [], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
    })
      .then((AMap) => {
        map = new AMap.Map("container", {
          // 设置地图容器id
          viewMode: "2D", // 是否为3D地图模式
          zoom: zoom, // 初始化地图级别
          center: center, // 初始化地图中心点位置
        });
        // 创建一个 Marker 实例：
        data.map(item => {
          //设置圆形标记位置
          const center = new AMap.LngLat(item.lnglat[0], item.lnglat[1]);
          //设置圆的半径大小
          const radius = 10 //单位:px
          const circleMarker = new AMap.CircleMarker({
            center: center, //圆心
            radius: radius, //半径
            strokeColor: item.color, //轮廓线颜色
            strokeWeight: 2, //轮廓线宽度
            strokeOpacity: 0.5, //轮廓线透明度
            fillColor: item.color, //多边形填充颜色
            fillOpacity: 0.5, //多边形填充透明度
            zIndex: 10, //多边形覆盖物的叠加顺序
            cursor: "pointer", //鼠标悬停时的鼠标样式
          });
          //圆形 circleMarker 对象添加到 Map
          map.add(circleMarker);
          //将覆盖物调整到合适视野
          // map.setFitView([circleMarker]);

          circleMarker.on('click', () => {
            setShowShopList(true)
            setCenter([item.lnglat[0], item.lnglat[1]])
            setCity(item.city)
            setZoom(15)
            // getStoreList({ city_id: item.city_id }).then(res => {
            //   console.log(res);
            //   const marker = new AMap.Marker({
            //     position: new AMap.LngLat(res.data.lat, res.data.lng),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
            //   });
            //   map?.add(marker);
            // })
            // getAreaMergeData({ city_id: item.city_id }).then(res => {
            //   console.log(res);

            // })
          })

          // 定义动态发散效果
          function animate() {
            let radius = 0; // 初始半径
            let opacity = 0.6; // 初始透明度
            let maxRadius = 15; // 最大半径

            setInterval(function () {
              radius += 1; // 每次增加的半径值
              opacity -= 0.02; // 每次减小的透明度值

              // 达到最大半径后重置半径和透明度
              if (radius > maxRadius) {
                radius = 0;
                opacity = 0.6;
              }

              circleMarker.setRadius(radius);
              circleMarker.setOptions({
                strokeOpacity: opacity,
                fillOpacity: opacity
              });
            }, 40); // 动画间隔时间（毫秒）
          }

          // 启动动态发散效果
          if (item.color === 'red') {
            animate();
          }

          // const marker = new AMap.Marker({
          //   position: new AMap.LngLat(item.lnglat[0], item.lnglat[1]),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
          // });
          // map?.add(marker);
          // marker.on('click', () => {
          //   setCenter([item.lnglat[0], item.lnglat[1]])
          //   setZoom(15)
          //   // getStoreList({ city_id: item.city_id }).then(res => {
          //   //   console.log(res);
          //   //   const marker = new AMap.Marker({
          //   //     position: new AMap.LngLat(res.data.lat, res.data.lng),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
          //   //   });
          //   //   map?.add(marker);
          //   // })
          //   // getAreaMergeData({ city_id: item.city_id }).then(res => {
          //   //   console.log(res);

          //   // })
          // })
          // 监听地图缩放事件
          map.on('zoomchange', () => {
            const zoomLevel = map.getZoom(); // 获取当前地图缩放级别
            // 在这里执行您的自定义逻辑
            setZoom(zoomLevel)
          });
        })
      })
      .catch((e) => {
        console.log(e);
      });

    // getStoreMergeData().then(res => {
    //   console.log(res.data);

    // })
  }, [center]);

  return (
    <>
      <div id="container" style={{ width: '83vw', height: '88vh' }}></div>
      {
        showShopList &&
        <ItemList
          areaMergeData={areaMergeData}
          shopDetail={shopDetail}
          reset={reset}
          city={city}
        />
      }
    </>
  )
}

export default MapOverview