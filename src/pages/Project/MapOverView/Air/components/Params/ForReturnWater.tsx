import { Card, Progress, Typography } from "antd"
import React, { useEffect, useState } from "react"


interface ItemListProps {
  params: any
}

const ForReturnWater: React.FC<ItemListProps> = ({
  params
}) => {
  const [list, setList] = useState([])

  useEffect(() => {
    if (params) {
      setList(params.list)
    }

    // console.log('供回水参数再刷新 <------------------------');

  }, [params])

  return (
    <>
      <Typography.Title level={4}>供回水参数</Typography.Title>
      <div style={{ height: 'auto', maxHeight: 750, overflow: 'auto' }}>
        {
          list.map((item: any, index) => {
            return (
              <div key={index} style={{ width: "100%", display: 'flex', flexWrap: 'wrap', justifyContent: "space-around" }}>
                <Card
                  bordered={false}
                  hoverable
                  style={{
                    width: '40%',
                    height: 400,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginBottom: 50,
                    backgroundColor: '#f9f9f9',
                  }}
                >
                  <Progress
                    size={300}
                    format={(percent) => percent + '℃'}
                    type="dashboard"
                    percent={item[0].value}
                    strokeColor={item[0].value >= 30 ? 'red' : 'rgb(0, 0, 255)'}
                  />
                  <div style={{ textAlign: 'center' }}>供水流量: {item[2].value}{item[2].unit}</div>
                </Card>

                <Card
                  bordered={false}
                  hoverable
                  style={{
                    width: '40%',
                    height: 400,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginBottom: 50,
                    backgroundColor: '#f9f9f9',
                  }}
                >
                  <Progress
                    size={300}
                    format={(percent) => percent + '℃'}
                    type="dashboard"
                    percent={item[1].value}
                    strokeColor={item[1].value >= 30 ? 'red' : 'rgb(0, 0, 255)'}
                  />
                </Card>
              </div>
            )
          })
        }
      </div>
    </>
  )
}

export default ForReturnWater