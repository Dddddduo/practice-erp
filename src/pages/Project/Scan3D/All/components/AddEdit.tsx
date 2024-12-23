import React, { useEffect, useState, useReducer } from "react"
import type { SelectProps } from 'antd';
import { Button, DatePicker, Form, Input, Select, Radio, Typography, Space } from 'antd';
import { getMarketList, getShopList, getCityList, getBrandList, } from "@/services/ant-design-pro/report";
import GkUpload from "@/components/UploadImage/GkUpload";
import { createOrUpdate } from "@/services/ant-design-pro/project";
import dayjs from "dayjs";
import { isEmpty } from "lodash";

interface ItemListProps {
  selectDataState: {
    brands: [{ id: '', brand_en: '' }],
    cities: [{ id: '', city_cn: '' }],
    markets: [{ id: '', market_cn: '' }],
    shops: [{ id: '', name_cn: '' }],
  }
  handleSelectedChild: (type: string, field: string, data: []) => void;
  currentMsg: API.ScanCurrentMessage
  onClose: () => void
  fetchInitData: ({ current, pageSize }) => void
  success: (text: string) => void
  error: (text: string) => void
}
export enum SelectType {
  LoadData = 'LOAD_DATA',
  DeleteData = 'DELETE_DATA'
}

// 初始状态
const initialSearchForm = {
  brands: [],
  cities: [],
  shops: [],
  markets: [],
}

// reducer 函数
function searchFormReducer(state, action) {
  const { field, data } = action.payload;
  if (isEmpty(field)) {
    return state;
  }

  switch (action.type) {
    case SelectType.LoadData:
      return { ...state, [field]: [...Array.from(data)] };
    case SelectType.DeleteData:
      return { ...state, [field]: [] };
    // case UPDATE_EMAIL:
    //   return { ...state, profile: { ...state.profile, email: action.payload } };
    // case UPDATE_ADDRESS:
    //   // payload 应该是一个对象，包含 street, city 和 zip
    //   return { ...state, profile: { ...state.profile, address: { ...state.profile.address, ...action.payload } } };
    default:
      return state;
  }
}

/**
 * 3DScan 新增或者编辑组件
 * @constructor
 */
const AddEdit: React.FC<ItemListProps> = ({
  currentMsg,
  onClose,
  fetchInitData,
  success,
  error
}) => {

  const [selectDataState, dispatchSelectData] = useReducer(searchFormReducer, initialSearchForm);
  const [brandId, setBrandId] = useState(0)
  const [cityId, setCityId] = useState(0)
  const [marketId, setMarketId] = useState(0)
  const [value, setValue] = useState(1);
  const [imageList, setImageList] = useState<Array<any>>([])
  const [form] = Form.useForm();

  let shopData: [] = []

  const fetchSearchInitData = async () => {
    console.log("fetchSearchInitData:::: fetchSearchInitData");

    const brandResponse = await getBrandList();
    if (brandResponse.success) {
      dispatchSelectData({
        type: SelectType.LoadData,
        payload: {
          field: 'brands',
          data: Object.keys(brandResponse.data).map(key => brandResponse.data[key])
        }
      });
    }

    const cityResponse = await getCityList();
    if (cityResponse.success) {
      dispatchSelectData({
        type: SelectType.LoadData,
        payload: {
          field: 'cities',
          data: cityResponse.data
        }
      });
    }
  }

  const handleSelectedChild = (type: string, field: string, data: []) => {
    dispatchSelectData({
      type,
      payload: {
        field,
        data
      }
    });
  }

  const optionsBrands: SelectProps['options'] = selectDataState?.brands.map((item) => {
    return {
      value: item.id,
      label: item.brand_en,
    };
  });

  const optionsCities: SelectProps['options'] = selectDataState?.cities.map((item) => {
    return {
      value: item.id,
      label: item.city_cn,
    };
  });

  const optionsMarket: SelectProps['options'] = selectDataState?.markets.map((item) => {
    return {
      value: item.id,
      label: item.market_cn,
    };
  });

  const optionsShop: SelectProps['options'] = selectDataState?.shops.map((item) => {
    return {
      value: item.id,
      label: item.name_cn,
    };
  });

  const handleFinish = (values) => {
    console.log(values);
    const scan_at = values.scan_at
    const completed_at = values.completed_at
    const format_scan_at = `${scan_at.$y}-${scan_at.$M + 1}-${scan_at.$D} ${scan_at.$H}:${scan_at.$m}:${scan_at.$s}`
    const format_completed_at = `${completed_at.$y}-${completed_at.$M + 1}-${completed_at.$D} ${completed_at.$H}:${completed_at.$m}:${completed_at.$s}`

    const customParams = {
      url: values.url,
      bg_url: values.bg_file_url_thumb[0].url || values.bg_file_url_thumb[0].response.url,
      brand_id: values.brand?.value ?? values.brand,
      city_id: values.city?.value ?? values.city,
      market_id: values.market?.value ?? values.market,
      completed_at: format_completed_at,
      scan_at: format_scan_at,
      store_area: values.area,
      store_id: values.shop?.value ?? values.shop,
      cover_img_id: values.bg_file_url_thumb[0].id,
      remark: '',
      scan_id: currentMsg?.id,
      status: values.status === 1 ? 'y' : 'n'
    }
    createOrUpdate(customParams).then(res => {
      if (res.success) {
        onClose()
        success('处理成功')
        return
      }
      error(res.message)
    })
    // console.log(res);
    const param = {
      current: 1,
      pageSize: 20
    }
    fetchInitData(param)
  }

  const handleChangeBrands = async (e) => {
    setBrandId(e)
    const shopParams = {
      brand_id: e,
      city_id: cityId,
      market_id: marketId
    }
    form.setFieldsValue({ store: undefined })
    const shopResponse = await getShopList(shopParams);
    shopData = shopResponse.data;
    handleSelectedChild(SelectType.LoadData, 'shops', shopData);
  }

  const handleChangeCity = async (e) => {
    setCityId(e)
    form.setFieldsValue({ market: undefined, store: undefined })
    const marketResponse = await getMarketList({ city_id: e });
    handleSelectedChild(SelectType.LoadData, 'markets', marketResponse.data);
  }
  const handleChangeMarket = async (e) => {
    setMarketId(e)
    const shopParams = {
      brand_id: brandId,
      city_id: cityId,
      market_id: e
    }
    form.setFieldsValue({ store: undefined })
    const shopResponse = await getShopList(shopParams);
    shopData = shopResponse.data;
    handleSelectedChild(SelectType.LoadData, 'shops', shopData);
  }

  const handleFieldsChange = (info) => {
    if (info[0].name[0] === "brand" || info[0].name[0] === "market") {
      form.setFieldsValue({ shop: undefined });
      handleSelectedChild(SelectType.DeleteData, 'shops', [])
    }
    if (info[0].name[0] === "city") {
      form.setFieldsValue({ market: undefined });
      form.setFieldsValue({ shop: undefined });
      handleSelectedChild(SelectType.DeleteData, 'markets', [])
      handleSelectedChild(SelectType.DeleteData, 'shops', [])
    }
  }

  const handleChangeRadio = (e) => {
    setValue(e.target.value);
  }

  const handleUpload = (info) => {
    console.log(info);
  }


  useEffect(() => {
    fetchSearchInitData();
    if (!currentMsg) {
      return
    }
    let image = [{
      id: currentMsg?.bg_file_id ?? -1,
      uid: currentMsg?.bg_file_id ?? -1,
      file_id: currentMsg?.bg_file_id ?? -1,
      name: currentMsg?.bg_file_id ?? -1,
      url: currentMsg?.bg_file_url_thumb ?? '',
      file_url_original: currentMsg?.bg_file_url_enough ?? ''
    }]
    setImageList(image)

    const getList = async () => {
      if (currentMsg?.city_id) {
        const marketResponse = await getMarketList({ city_id: currentMsg?.city_id });
        handleSelectedChild(SelectType.LoadData, 'markets', marketResponse.data);
      }
      if (currentMsg?.brand_id && currentMsg?.city_id && currentMsg?.market_id) {
        const shopParams = {
          brand_id: currentMsg?.brand_id,
          city_id: currentMsg?.city_id,
          market_id: currentMsg?.market_id
        }
        const shopResponse = await getShopList(shopParams);
        shopData = shopResponse.data;
        handleSelectedChild(SelectType.LoadData, 'shops', shopData);
      }
    }
    getList()

    form.setFieldsValue({
      brand: {
        value: currentMsg?.brand_id,
        label: currentMsg?.brand_en
      },
      city: {
        value: currentMsg?.city_id,
        label: currentMsg?.city_cn
      },
      market: {
        value: currentMsg?.market_id,
        label: currentMsg?.market_cn
      },
      shop: {
        value: currentMsg?.store_id,
        label: currentMsg?.store_cn
      },
      area: currentMsg?.store_area ?? '',
      url: currentMsg?.url ?? '',
      bg_file_url_thumb: image ?? [],
      status: currentMsg?.status ?? -1,
      scan_at: dayjs(currentMsg?.scan_at, 'YYYY-MM-DD HH:mm:ss') ?? '',
      completed_at: dayjs(currentMsg?.completed_at, 'YYYY-MM-DD HH:mm:ss') ?? '',
      tips: "",
    });
  }, [])

  return (
    <>
      <Typography.Title level={2}>{currentMsg ? '编辑 3DScan' : '新建 3DScan'}</Typography.Title>
      <Form
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600, marginTop: 50 }}
        onFinish={handleFinish}
        onFieldsChange={handleFieldsChange}
      >
        {/* 品牌选择 */}
        <Form.Item label="品牌" name="brand">
          <Select
            placeholder="请选择品牌"
            allowClear
            options={optionsBrands}
            onChange={handleChangeBrands}
            showSearch
            filterOption={(input, option) => (option?.label ?? '').includes(input)}
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
            }
          />
        </Form.Item>
        {/* 城市选择 */}
        <Form.Item label="城市" name="city">
          <Select
            placeholder="请选择城市"
            allowClear
            options={optionsCities}
            onChange={handleChangeCity}
            showSearch
            filterOption={(input, option) => (option?.label ?? '').includes(input)}
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
            }
          />
        </Form.Item>
        {/* 商场选择 */}
        <Form.Item label="商场" name="market">
          <Select
            placeholder="请选择商场"
            allowClear
            options={optionsMarket}
            onChange={handleChangeMarket}
            showSearch
            filterOption={(input, option) => (option?.label ?? '').includes(input)}
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
            }
          />
        </Form.Item>
        {/* 店铺选择 */}
        <Form.Item label="店铺" name="shop">
          <Select
            placeholder="请选择店铺"
            allowClear
            options={optionsShop}
            showSearch
            filterOption={(input, option) => (option?.label ?? '').includes(input)}
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
            }
          />
        </Form.Item>
        {/* 项目面积 */}
        <Form.Item label="项目面积" name="area">
          <Input placeholder="请输入面积" />
        </Form.Item>
        {/* 链接地址 */}
        <Form.Item label="链接地址" name="url">
          <Input />
        </Form.Item>
        {/* 选择封面 */}
        <Form.Item name="bg_file_url_thumb" label="选择封面" valuePropName="fileList">
          {/* <Upload action="/upload.do" listType="picture-card" maxCount={1} onChange={handleUpload}>
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          </Upload> */}
          <GkUpload value={imageList} fileLength={1} onChange={handleUpload} />
        </Form.Item>
        {/* 是否允许查看 */}
        <Form.Item name="status" label="是否允许查看">
          <Radio.Group onChange={handleChangeRadio} value={value}>
            <Radio value={1}>是</Radio>
            <Radio value={0}>否</Radio>
          </Radio.Group>
        </Form.Item>
        {/* 拍摄日期 */}
        <Form.Item label="拍摄日期" name="scan_at">
          <DatePicker showTime />
        </Form.Item>
        {/* 完工日期 */}
        <Form.Item label="完工日期" name="completed_at">
          <DatePicker showTime />
        </Form.Item>
        {/* 备注 */}
        {/* <Form.Item label="备注" name="tips">
          <Input />
        </Form.Item> */}
        <Form.Item style={{ float: 'right' }}>
          <Space>
            <Button type="primary" htmlType="submit">
              确定
            </Button>
            <Button onClick={onClose}>取消</Button>
          </Space>
        </Form.Item>
      </Form>
    </>
  )
}

export default AddEdit
