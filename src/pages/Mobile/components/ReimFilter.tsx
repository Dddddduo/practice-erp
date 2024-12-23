import React, { useEffect, useState } from "react"
import { Picker, Space, Button } from "antd-mobile"
import { getBrandList, getCityList, getMarketList, getShopList } from "@/services/ant-design-pro/report"


interface ItemListProps {
  closeFilterPopup: (params: any) => void
  reimParams: any
}

const ReimFilter: React.FC<ItemListProps> = ({
  closeFilterPopup,
  reimParams
}) => {
  const [params, setParams]: any = useState({
    brandId: reimParams['brandId'] ?? '',
    cityId: reimParams['cityId'] ?? '',
    marketId: reimParams['marketId'] ?? '',
    shopId: reimParams['storeId'] ?? '',
    reimStatus: reimParams['reimStatus'] ?? ''
  })
  const [brandId, setBrandId]: any = useState(0)
  const [brand, setBrand]: any = useState([])
  const [cityId, setCityId]: any = useState(0)
  const [city, setCity]: any = useState([])
  const [market, setMarket]: any = useState([])
  const [shop, setShop]: any = useState([])
  const status: any = [
    [
      {
        value: 'wait',
        label: '待审批'
      },
      {
        value: 'agree',
        label: '已通过'
      },
      {
        value: 'reject',
        label: '已驳回'
      },
      {
        value: 'paid',
        label: '已打款'
      },
    ]
  ]

  const submit = () => {
    closeFilterPopup(params)
  }

  const reset = () => {
    const resetParams = {
      brandId: '',
      cityId: '',
      marketId: '',
      shopId: '',
      reimStatus: ''
    }
    console.log(resetParams);
    
    closeFilterPopup(resetParams)
  }

  const getBrands = async () => {
    const res = await getBrandList()
    setBrand(Object.keys(res.data).map(key => res.data[key]))
  }

  const getCity = async () => {
    const res = await getCityList()
    setCity(res.data)
  }

  const onConfirmCity = async (e) => {
    setCityId(e[0])
    setParams({ ...params, cityId: e[0] })
    const res = await getMarketList({ city_id: e[0] })
    setMarket(res.data)
  }

  const onConfirmMarket = async (e) => {
    setParams({ ...params, marketId: e[0] })
    const param = {
      brand_id: brandId,
      city_id: cityId,
      market_id: e[0]
    }
    const res = await getShopList(param)
    setShop(res.data)
  }

  const optionsBrands = brand.map((item) => {
    return {
      value: item.id,
      label: item.brand_en,
    };
  });

  const optionsCities = city.map((item) => {
    return {
      value: item.id,
      label: item.city_cn,
    };
  });

  const optionsMarket = market.map((item) => {
    return {
      value: item.id,
      label: item.market_cn,
    };
  });

  const optionsShop = shop.map((item) => {
    return {
      value: item.id,
      label: item.name_cn,
    };
  });

  useEffect(() => {
    console.log(params);

    const getMessage = async () => {
      await getBrands()
      await getCity()
    }
    getMessage()
  }, [])

  return (
    <div style={{
      height: '100vh',
      padding: 10,
      display: 'flex',
      flexDirection: 'column',
      position: 'relative'
    }}>

      <Picker defaultValue={[reimParams['reimStatus']]} columns={status} onConfirm={(e) => {
        setParams({ ...params, reimStatus: e[0] })
      }}>
        {(items, { open }) => {
          return (
            <Space align='center'>
              <Button color="primary" onClick={open} style={{ margin: 10 }}>选择类型</Button>
              {items.every(item => item === null)
                ? '未选择'
                : items.map(item => item?.label ?? '未选择').join(' - ')}
            </Space>
          )
        }}
      </Picker>

      <Picker defaultValue={[Number(reimParams['brandId'])]} columns={[optionsBrands]} onConfirm={(e) => {
        console.log('*******', reimParams['brandId']);
        
        setBrandId(e[0])
        setParams({ ...params, brandId: e[0] })
      }}>
        {(items, { open }) => {
          return (
            <Space align='center'>
              <Button color="primary" onClick={open} style={{ margin: 10 }}>选择品牌</Button>
              {items.every(item => item === null)
                ? '未选择'
                : items.map(item => item?.label ?? '未选择').join(' - ')}
            </Space>
          )
        }}
      </Picker>

      <Picker defaultValue={[reimParams['cityId']]} columns={[optionsCities]} onConfirm={onConfirmCity}>
        {(items, { open }) => {
          return (
            <Space align='center'>
              <Button color="primary" onClick={open} style={{ margin: 10 }}>选择城市</Button>
              {
                items.every(item => item === null)
                  ? '未选择'
                  : items.map(item => item?.label ?? '未选择').join(' - ')
              }
            </Space>
          )
        }}
      </Picker>

      <Picker defaultValue={[reimParams['marketId']]} columns={[optionsMarket]} onConfirm={onConfirmMarket}>
        {(items, { open }) => {
          return (
            <Space align='center'>
              <Button color="primary" onClick={open} style={{ margin: 10 }}>选择商场</Button>
              {
                items.every(item => item === null)
                  ? '未选择'
                  : items.map(item => item?.label ?? '未选择').join(' - ')
              }
            </Space>
          )
        }}
      </Picker>

      <Picker defaultValue={[reimParams['storeId']]} columns={[optionsShop]} onConfirm={(e) => {
        setParams({ ...params, shopId: e[0] })
      }}>
        {(items, { open }) => {
          return (
            <Space align='center'>
              <Button color="primary" onClick={open} style={{ margin: 10 }}>选择店铺</Button>
              {
                items.every(item => item === null)
                  ? '未选择'
                  : items.map(item => item?.label ?? '未选择').join(' - ')
              }
            </Space>
          )
        }}
      </Picker>

      <Button color="primary" style={{ position: 'absolute', bottom: 10 }} onClick={submit}>完成</Button>
      <Button color="primary" style={{ position: 'absolute', bottom: 10, left: 80 }} onClick={reset}>重置</Button>
      <Button color="primary" style={{ position: 'absolute', bottom: 10, left: 150 }} onClick={() => closeFilterPopup(reimParams)}>取消</Button>
    </div>
  )
}

export default ReimFilter