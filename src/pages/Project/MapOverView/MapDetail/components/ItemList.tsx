import React, { useEffect, useState } from 'react'
import '../index.css'
import { Tabs, List, Button, Card, Image } from 'antd'
import { history } from '@umijs/max';

interface ItemListProps {
  areaMergeData: any
  shopDetail: any
  reset: () => void
  city: string
}
// const list = ['综合', '3D Scan', '空调控制', '电器监控', '数据对比']
const list: any = [{
  id: 1,
  name: '综合'
}, {
  id: 2,
  name: '3D Scan'
}, {
  id: 3,
  name: '空调控制'
}, {
  id: 4,
  name: '电器监控'
}, {
  id: 5,
  name: '数据对比'
}]
const ItemList: React.FC<ItemListProps> = ({
  areaMergeData,
  shopDetail,
  reset,
  city
}) => {
  const [tabId, setTabId] = useState()
  const handleChange = (e) => {
    setTabId(e)
  }

  const toAirDetail = (item) => {
    console.log(item);
    history.push(`/project/mapOverview/air?store_id=${item.store_id}&city_cn=${item.city_cn}`)
  }

  return (
    <div className='list'>
      <div className='list-title'>
        <div>{city}</div>
        <div style={{ fontSize: 18 }}>
          {
            shopDetail.length
          }家
        </div>

        <div>
          <Button ghost onClick={reset}>重置</Button>
        </div>
      </div>
      <div>
        <div className='item-detail'>
          {
            Object.values(areaMergeData).map((item: any) => {
              return (
                <div style={{ width: '50%' }}>{item.k}： {item.v}{item.unit}</div>
              )
            })
          }
        </div>
        <div>
          <Tabs
            onChange={handleChange}
            centered
            destroyInactiveTabPane={true}
            items={list.map((item, index) => {
              return {
                label: item.name,
                key: item.id,
                children:
                  <List
                    style={{ paddingLeft: 15, paddingRight: 15 }}
                    dataSource={shopDetail}
                    renderItem={(item: any) => (
                      <List.Item>
                        <Card
                          title={item.store_name_cn}
                          hoverable
                          size='small'
                          style={{ width: '100%', backgroundColor: 'gray' }}
                          extra={
                            <div>
                              <Button ghost style={{ marginRight: 5 }} size="small">设备监控</Button>
                              {
                                tabId === 3 &&
                                <Button ghost style={{ marginRight: 5 }} size="small" onClick={() => toAirDetail(item)}>空调控制</Button>
                              }
                            </div>
                          }
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ width: "60%" }}>
                              <div>
                                <span style={{ marginRight: 15 }}>CO2: {item.room_co2}</span>
                              </div>
                              <div>
                                <span style={{ marginRight: 15 }}>温度: {item.room_temperature}</span>
                              </div>
                              <div>
                                <span style={{ marginRight: 15 }}>湿度: {item.room_humidity}</span>
                              </div>
                            </div>

                            <div>
                              <Image width={60} src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" />
                            </div>
                          </div>
                        </Card>
                        {/* <div className='shop-list'>
                          <div className='shop-item'>
                            <div style={{ fontSize: 18 }}>
                              {item.store_name_cn}
                            </div>
                            <div>
                              <span style={{ marginRight: 15 }}>CO2: {item.room_co2}</span>
                              <span style={{ marginRight: 15 }}>温度: {item.room_temperature}</span>
                              <span style={{ marginRight: 15 }}>湿度: {item.room_humidity}</span>
                            </div>
                            <div>
                              <Button ghost style={{ marginRight: 5 }} size="small">设备监控</Button>
                              {
                                tabId === 3 &&
                                <Button ghost style={{ marginRight: 5 }} size="small" onClick={() => toAirDetail(item)}>空调控制</Button>
                              }

                            </div>
                          </div>
                        </div> */}
                      </List.Item>
                    )}
                  />,
              };
            })}
          />
        </div>
      </div>
    </div>
  )
}

export default ItemList