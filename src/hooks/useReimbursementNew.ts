import {useCallback, useEffect, useRef, useState} from "react";
import {getCityList, getShopListNew} from "../../erp/src/services/ant-design-pro/report";
import {getBrandList, getMarketList} from "@/services/ant-design-pro/report";
import {message} from "antd";
import {ActionType, ParamsType} from "@ant-design/pro-components";
import {getReimList} from "@/services/ant-design-pro/reimbursement";
import {produce} from "immer";
import {isUndefined} from "lodash";

export const useReimbursementNew = () => {

  const [dataSource, setDataSource] = useState<any>({
    // 报销单的状态
    reimStatusOptions: [
      {label: '待审批', value: 'wait'},
      {label: '已驳回', value: 'reject'},
      {label: '已通过', value: 'agree'},
    ],
    // 是否预支的状态
    isPrePayOptions: [
      {label: 'Y', value: 'y'},
      {label: 'N', value: 'n'},
    ],
    // 在搜索中的城市
    cityOptions: [],
    // 在搜索中的品牌
    brandOptions: [],
    // 在搜索中的商场
    marketOptions: [],
    // 在搜索中的店铺
    shopOptions: [],
    // 在搜索中选择的城市
    citySelectOptions: [],
    // 在搜索中选择的品牌
    brandSelectOptions: [],
    // 在搜索中选择的商场
    marketSelectOptions: [],
    // 在搜索中选择的店铺
    shopSelectOptions: [],
  })

  // 搜索参数
  const [reimSearchParams, setReimSearchParams]: any = useState()

  // 报销单表格的状态
  const actionRef = useRef<ActionType>();

  const queryParams = new URLSearchParams(location.search);

  // 获取报销单列表
  const handleFetchListData = useCallback(async ({ current, pageSize, ...params }, sort: ParamsType) => {
    const reim_no = queryParams.get('reim_no');
    const createStart = isUndefined(params.create_at) ? '' : params.create_at[0]
    const createEnd = isUndefined(params.create_at) ? '' : params.create_at[1]
    const completedStart = isUndefined(params.completed_at) ? '' : params.completed_at[0]
    const completedEnd = isUndefined(params.completed_at) ? '' : params.completed_at[1]
    const retData = {
      success: false,
      total: 0,
      data: []
    };
    const customParams = {
      page: current,
      page_size: pageSize,
      user_type: 'brand_admin',
      reim_no: reim_no ?? params['reim_no'] ?? '', // 报销单编号
      city_id: params['city_cn'] ?? '',
      market_id: params['market_cn'] ?? '',
      store_id: params['store_cn'] ?? '',
      brand_id_list: params['brand_en'] ? params['brand_en'] : [],
      ma_remark: params['ma_remark'] ?? '', // 工作描述
      reim_status: params['reim_status'] ?? '', // 状态
      has_sign_ids: params['sign_ids'] ?? '', //是否有签单
      is_completed: params['is_completed'] ?? '', //是否完工
      is_advance: params['is_advance'] ?? '', //是否预支
      leader_id: params['leader_name'] ?? '', //负责人（id）
      completed_start_at: completedStart ?? '', // 完工时间开始
      completed_end_at: completedEnd ?? '', //完工时间结束
      reim_create_start_at: createStart ?? '', //申请时间开始
      reim_create_end_at: createEnd ?? '', //申请时间结束
      pre_quote_status: params['pre_quote_status'] ?? '', //是否预报价
    };
    // console.log(customParams);
    setReimSearchParams(customParams)
    try {
      const response = await getReimList(customParams);
      if (!response.success) {
        return retData;
      }
      const data = response.data;
      retData.success = true;
      retData.total = data.total;
      retData.data = data.list ?? [];
    } catch (e) {
      console.log(e);
      message.error('数据请求异常');
    }
    return retData;
  }, [])

  useEffect(() => {
    loadInitSearchData();
  }, []);

  // 初始化搜索的数据
  const loadInitSearchData = async () => {
    // 先获得品牌和城市的数据
    try{
      const cityResponse = await getCityList();
      const BrandResponse = await getBrandList();
      if (!cityResponse.success || !BrandResponse.success) {
        message.error(cityResponse.success ? BrandResponse.message : cityResponse.message);
        return;
      }
      console.log('cityResponse', cityResponse);
      console.log('BrandResponse', BrandResponse);
      // 清洗数据 把id和name提取出来
      const cityOptions = cityResponse.data.map((item: any) => ({label: item.city_cn, value: item.id}));
      const BrandOptions = BrandResponse.data.map((item: any) => ({label: item.brand_cn, value: item.id}));
      console.log('cityOptions', cityOptions);
      console.log('BrandOptions', BrandOptions);
      // setDataSource
      setDataSource({
        ...dataSource,
        cityOptions: cityOptions,
        brandOptions: BrandOptions,
      })
    }catch (error) {
      console.error('Error fetching market options:', error);
    }
  };

  // 放置品牌数据
  const getBrandOptions = async (brandIds) => {
    console.log('getBrandOptions', brandIds);
    setDataSource({
      ...dataSource,
      brandSelectOptions: brandIds,
    })
  }

  // 获取商场的数据
  const getMarketOptions = async (cityId) => {
    console.log('getCityOptions', cityId);
    const cityIds: number[] = [cityId];  // 将其放入一个数组中

    setDataSource({
      ...dataSource,
      citySelectOptions: cityIds,
    })
    try {
      const results = await Promise.all(
        cityIds.map(async (city_id) => {
          const data = await getMarketList({city_id});
          return data; // 假设 data 是一个包含商店对象的数组
        })
      );
      // 合并所有获取到的商店数据
      const allShops = results.flatMap(result => result.data);
      console.log('allShops', allShops)
      // 直接格式化为 {label: '', value: ''} 的形式
      const formattedShops = allShops.map(shop => ({
        label: shop.market_cn,
        value: shop.id,
      }));
      // 更新 marketSelectOptions
      setDataSource(prevState => ({
        ...prevState,
        marketOptions: formattedShops,
      }));
    } catch (error) {
      console.error('Error fetching market options:', error);
    }
  };

  // 获取店铺的数据
  const getShopsOptions = async (marketIds) => {
    // 商场
    console.log('marketIds', marketIds);
    // 城市
    console.log('citySelectOptions', dataSource.citySelectOptions);
    // 品牌
    console.log('brandSelectOptions', dataSource.brandSelectOptions);
    const params = {
      brand_id: dataSource.brandSelectOptions,
      city_id: dataSource.citySelectOptions,
      market_id: marketIds,
    };
    try {
      const result = await getShopListNew(params);
      console.log(result.data)
      const formattedShops = result.data.map(shop => ({
        label: shop.name_cn,
        value: shop.id,
      }));
      console.log(formattedShops)
      // 更新 marketSelectOptions
      setDataSource(prevState => ({
        ...prevState,
        shopOptions: formattedShops,
      }));
    } catch (error) {
      console.error('Error fetching market options:', error);
    }
  };

  // 店铺信息
  const setShopOptions = async (shopIds) => {
    console.log(shopIds);
    setDataSource(prevState => ({
      ...prevState,
      shopSelectOptions: shopIds,
    }));
  }


  return {
    dataSource,
    actionRef,
    getBrandOptions,
    getMarketOptions,
    getShopsOptions,
    setShopOptions,
    handleFetchListData,
  };

}

