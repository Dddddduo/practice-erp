import { Card, Image } from "antd"
import React, { useEffect, useState } from "react"
import { getWeather } from "@/services/ant-design-pro/air"
import { isEmpty } from "lodash"

interface ItemListProps {
  city: string
}

const Weather: React.FC<ItemListProps> = ({
  city
}) => {
  const [weather, setWeather]: any = useState({})
  const [today, setToday] = useState('')

  useEffect(() => {

    getWeather({ city_cn: city }).then(res => {
      console.log('打印City数据<-------------------------', res.data);

      if (res.success && !isEmpty(res.data)) {
        setWeather(res.data.today)
      }
    })

    const date = new Date()
    const month = date.getMonth() + 1
    const day = date.getDate()
    setToday(month + '-' + day)
  }, [city])

  return (
    <Card
      title={<div>今天{today}</div>}
      style={{ marginBottom: 20 }}
      extra={!isEmpty(weather) && <Image preview={false} src={`/weather/${isEmpty(weather) ? '' : weather.img}.png`} width={40} />}
    >
      <div>
        <div style={{ textAlign: 'center' }}>
          {isEmpty(weather) ? '' : weather.city}
        </div>

        <div style={{ textAlign: 'center', fontSize: 36, margin: '10px 0' }}>
          {isEmpty(weather) ? '' : weather.temp}℃
        </div>

        <div style={{ textAlign: 'center', marginBottom: 10 }}>
          {isEmpty(weather) ? '' : weather.weather}
        </div>

        <div style={{ textAlign: 'center', marginBottom: 10 }}>
          {isEmpty(weather) ? '' : weather.winddirect + weather.windpower}
        </div>

        <div style={{ textAlign: 'center' }}>
          湿度{isEmpty(weather) ? '' : weather.humidity}%
        </div>
      </div>
    </Card>
  )
}

export default Weather