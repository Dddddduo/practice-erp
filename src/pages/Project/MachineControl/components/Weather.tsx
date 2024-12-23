import React, {useEffect, useState} from "react";
import {produce} from "immer";
import {getWeather} from "@/services/ant-design-pro/air";
import {i18nGlobalKey} from "@/utils/utils";

const Weather:React.FC = () => {

  const [weatherData, setWeatherData] = useState({
    mouth: '01',
    day: '01',
    time: '00:00:00',
    weather: {
      img:'',
      temp:'',
      weather:'',
      winddirect:'',
      windpower:'',
      humidity:''
    },
  })

  const getTime = () => {
    // 创建一个新的日期对象，表示当前时间
    let now = new Date();

    // 获取当前月份（注意，getMonth 返回的是 0 到 11，所以要加 1）
    let mouth = now.getMonth() + 1;

    let day = now.getDate();

    // 获取当前小时（24 小时制）
    let hour = now.getHours();

    // 获取当前分钟
    let minutes = now.getMinutes() >= 10 ? now.getMinutes().toString() : '0' + now.getMinutes().toString();

    // 获取当前秒数
    let second = now.getSeconds() >= 10 ? now.getSeconds().toString() : '0' + now.getSeconds().toString();

    setWeatherData(produce(draft => {
      draft.mouth = mouth < 10 ? ('0' + mouth.toString()) : mouth.toString()
      draft.day = day < 10 ? ('0' + day.toString()) : day.toString()
      draft.time = hour + ':' + minutes + ':' + second
    }))
  }

  const fetchWeatherData = async () => {
    const res = await getWeather({
      store_id: 1193
    })
    // console.log('fetchWeatherData',res);
    if (res.success) {
      setWeatherData(produce(draft => {
        draft.weather = res.data
      }))
    }
  }

  useEffect(() => {
    fetchWeatherData().then(console.log)

    const timer = setInterval(() => {
      getTime()
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, []);

  return (
    <>
      <div className={'text-center'}>{weatherData.mouth} / {weatherData.day} {weatherData.time}</div>

      <div className={'flex justify-center items-center bg-white rounded-2xl'} style={{ height: 60, marginTop: 30 }}>
        <img src={`/image/air/${weatherData.weather?.img ?? 3}.png`} alt="" width={'60'} className={'mr-4'} style={{ transform: `translateY(-15px)` }}/>
        <div className={'text-large'}>{weatherData.weather?.temp ?? 0}℃</div>
      </div>

      <div className={'mt-4 text-label text-center'}>
        {i18nGlobalKey(weatherData.weather?.weather ?? '晴')}&nbsp;
        {i18nGlobalKey(weatherData.weather?.winddirect ?? '东北')}&nbsp;
        {weatherData.weather?.windpower ?? '≤3'}&nbsp;
        {weatherData.weather?.humidity ?? '56'}%
      </div>
    </>
  )
}

export default Weather;
