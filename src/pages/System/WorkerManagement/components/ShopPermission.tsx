
import React, { useState, useEffect } from 'react';
import { Select, Checkbox, Button, Form, message, Space, Divider } from 'antd';
import { getBrandList, getCityList, getMarketList, getShopList } from '@/services/ant-design-pro/report';
import { useIntl } from "@umijs/max";
import { assignWorkerPermissions, getAssignWorkerPermissions } from '@/services/ant-design-pro/system';
import { difference, isEmpty, uniq } from 'lodash';

// 定义接口类型
interface WorkerInfo {
  worker_id: number;
  worker_name: string;
}

interface City {
  city_id: number;
  city_name: string;
}

interface Brand {
  brand_id: number;
  brand_name: string;
}

interface Market {
  market_id: number;
  market_name: string;
}

interface Store {
  store_id: number;
  store_name: string;
}

interface Props {
  workerInfo: WorkerInfo; // 从外部传入的工人信息
  handleShopPermissionClose: () => void
  actionRef: any
}




const { Option } = Select;

const ShopPermission: React.FC<Props> = ({
  workerInfo,
  handleShopPermissionClose,
  actionRef
}) => {
  const [form] = Form.useForm()
  const [allShop, setAllShop] = useState<Store[]>([])
  const [checkedShop, setCheckedShop] = useState<number[]>([])
  const [cities, setCities] = useState<City[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [cityId, setCityId] = useState<number>(0)
  const [brandId, setBrandId] = useState<number>(0)
  const [selectIds, setSelectIds] = useState<number[]>([])

  useEffect(() => {
    getCityList().then(res => {
      if (res.success) {
        setCities(res.data.map(item => {
          return {
            city_id: item.id,
            city_name: item.city_cn,
          }
        }))
      }
    })
    getBrandList().then(res => {
      if (res.success) {
        setBrands(res.data.map(item => {
          return {
            brand_id: item.id,
            brand_name: item.brand_en
          }
        }))
      }
    })
    getShopList({
      city_id: '',
      market_id: '',
      brand_id: '',
    }).then(res => {
      if (res.success) {
        setAllShop(res.data.map(item => {
          return {
            store_id: item.id,
            store_name: item.name_cn,
          }
        }))
      }
    })
    getAssignWorkerPermissions(workerInfo.worker_id).then(res => {
      if (res.success) {
        setSelectIds(res.data.map(item => item.store_id))
        if (!isEmpty(res.data)) {
          getMarketList({ city_id: res.data[0].shop_endpoint.city_id }).then(marketRes => {
            if (marketRes.success) {
              setMarkets(marketRes.data.map(item => {
                return {
                  market_id: item.id,
                  market_name: item.market_cn,
                }
              }))
            }
          })
          setCityId(res.data[0].shop_endpoint.city_id)
          setBrandId(res.data[0].shop_endpoint.brand_id)
          getShopList({
            city_id: res.data[0].shop_endpoint.city_id,
            market_id: res.data[0].shop_endpoint.market_id,
            brand_id: res.data[0].shop_endpoint.brand_id,
          }).then(shopRes => {
            if (shopRes.success) {
              setStores(shopRes.data.map(item => {
                return {
                  store_id: item.id,
                  store_name: item.name_cn,
                }
              }))
            }
          })
          setCheckedShop(res.data.map(item => item.store_id))

          form.setFieldsValue({
            city: res.data[0].shop_endpoint.city_id,
            brand: res.data[0].shop_endpoint.brand_id,
            market: res.data[0].shop_endpoint.market_id,
            shop: res.data.map(item => item.store_id)
          })
        }
      }
    })


    const initData = async () => {
      // const cityRes = await getCityList()
      // if (cityRes.success) {
      //   setCities(cityRes.data.map(item => {
      //     return {
      //       city_id: item.id,
      //       city_name: item.city_cn,
      //     }
      //   }))
      // }
      // const brandRes = await getBrandList()
      // if (brandRes.success) {
      //   setBrands(brandRes.data.map(item => {
      //     return {
      //       brand_id: item.id,
      //       brand_name: item.brand_en
      //     }
      //   }))
      // }

      // const storeRes = await getShopList()
      // if (storeRes.success) {
      //   setAllShop(storeRes.data.map(item => {
      //     return {
      //       store_id: item.id,
      //       store_name: item.name_cn,
      //     }
      //   }))
      // }

      let permissionsRes = await getAssignWorkerPermissions(workerInfo.worker_id)
      if (permissionsRes.success) {
        if (!isEmpty(permissionsRes.data)) {
          const marketRes = await getMarketList({ city_id: permissionsRes.data[0].shop_endpoint.city_id })
          if (marketRes.success) {
            setMarkets(marketRes.data.map(item => {
              return {
                market_id: item.id,
                market_name: item.market_cn,
              }
            }))
          }
          setCityId(permissionsRes.data[0].shop_endpoint.city_id)
          setBrandId(permissionsRes.data[0].shop_endpoint.brand_id)
          const shopRes = await getShopList({
            city_id: permissionsRes.data[0].shop_endpoint.city_id,
            market_id: permissionsRes.data[0].shop_endpoint.market_id,
            brand_id: permissionsRes.data[0].shop_endpoint.brand_id,
          })
          if (shopRes.success) {
            setStores(shopRes.data.map(item => {
              return {
                store_id: item.id,
                store_name: item.name_cn,
              }
            }))
          }

          form.setFieldsValue({
            city: permissionsRes.data[0].shop_endpoint.city_id,
            brand: permissionsRes.data[0].shop_endpoint.brand_id,
            market: permissionsRes.data[0].shop_endpoint.market_id,
            shop: permissionsRes.data.map(item => item.store_id)
          })
        }
      }
    }

    // initData()
  }, []);

  const handleCityChange = (city_id: number) => {
    setCityId(city_id)
    form.setFieldsValue({
      brand: undefined,
      market: undefined,
      shop: undefined,
    })
    // 根据选择的城市获取商场列表
    getMarketList({ city_id }).then(res => {
      if (res.success) {
        setMarkets(res.data.map(item => {
          return {
            market_id: item.id,
            market_name: item.market_cn,
          }
        }))
      }
    });
    getShopList({ city_id }).then(res => {
      if (res.success) {
        setStores(res.data.map(item => {
          return {
            store_id: item.id,
            store_name: item.name_cn,
          }
        }))
        form.setFieldsValue({
          shop: selectIds
        })
      }
    });
  };

  const handleBrandChange = (brand_id: number) => {
    setBrandId(brand_id)
    form.setFieldsValue({
      market: undefined
    })
    getShopList({ brand_id, city_id: cityId }).then(res => {
      if (res.success) {
        setStores(res.data.map(item => {
          return {
            store_id: item.id,
            store_name: item.name_cn,
          }
        }))
        form.setFieldsValue({
          shop: selectIds
        })
      }
    });
  }

  const handleMarketChange = (market_id: number) => {
    // form.setFieldsValue({ shop: undefined })
    // 根据选择的商场获取店铺列表
    getShopList({ city_id: cityId, market_id, brand_id: brandId }).then(res => {
      if (res.success) {
        setStores(res.data.map(item => {
          return {
            store_id: item.id,
            store_name: item.name_cn,
          }
        }))
        form.setFieldsValue({
          shop: selectIds
        })
      }
    });
  };

  const onStoreChange = (checkedValues: number[]) => {
    let checked = checkedValues
    let notChecked = difference(stores.map(item => item.store_id), checkedValues)
    let allChecked = [...checkedShop, ...checked]
    const uniqChecked = uniq(allChecked)
    const formatChecked = difference(uniqChecked, notChecked)
    setCheckedShop(formatChecked)
  };

  const handleSubmit = async () => {
    // 提交选择
    const result = await assignWorkerPermissions({ worker_uid: workerInfo.worker_id, store_id_list: checkedShop });
    if (result.success) {
      handleShopPermissionClose()
      actionRef.current.reload()
      message.success('提交成功');
    } else {
      message.error(result.message);
    }
  };

  return (
    <div>
      {/* <h2 style={{ marginBottom: 30 }}>{workerInfo.worker_name}</h2> */}
      <Form
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 800 }}
      >
        <Form.Item label="城市" name="city">
          <Select placeholder="选择城市" onChange={handleCityChange}>
            {cities.map(city => (
              <Option key={city.city_id} value={city.city_id}>{city.city_name}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="品牌" name="brand">
          <Select placeholder="选择品牌" onChange={handleBrandChange} allowClear>
            {brands.map(brand => (
              <Option key={brand.brand_id} value={brand.brand_id}>{brand.brand_name}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="商场" name="market">
          <Select placeholder="选择商场" onChange={handleMarketChange} allowClear>
            {markets.map(market => (
              <Option key={market.market_id} value={market.market_id}>{market.market_name}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="店铺" name="shop">
          <Checkbox.Group options={stores.map(store => ({ label: store.store_name, value: store.store_id }))} onChange={onStoreChange} />
        </Form.Item>

        <Divider />

        <Form.Item label="已选" name="checked">
          {/* {
            checkedShop.map(item => {
              return (<span style={{ marginRight: 10 }}>{item}</span>)
            })
            // checkedShop.map(item => (
            //   <span style={{ marginRight: 10 }}>{item.store_name}</span>
            // ))
          } */}
          {
            !isEmpty(allShop) &&
            allShop.map(shop => {
              return (
                <>
                  {
                    checkedShop.map(item => {
                      if (shop.store_id === item) {
                        return (<span style={{ marginRight: 10 }}>{shop.store_name}</span>)
                      }
                    })
                  }
                </>
              )

            })
          }
        </Form.Item>

        <Form.Item label=" " colon={false}>
          <Space>
            <Button type="primary" onClick={handleSubmit}>提交</Button>
            <Button danger onClick={handleShopPermissionClose}>取消</Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ShopPermission;
