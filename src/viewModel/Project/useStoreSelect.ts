import {
  getBrandOptionList,
  getCityOptionList,
  getMarketOptionList,
  getShopList,
  getShopOptionList,
} from '@/services/ant-design-pro/project';
import { message } from 'antd';
import { produce } from 'immer';
import React from 'react';

export const useStoreSelect = () => {
  const [dataSource, setDataSource] = React.useState<any>({
    cityOptions: [],
    brandOptions: [],
    marketOptions: [],
    shopOptions: [],
  });
  const [selectedValues, setSelectedValues] = React.useState({
    city: 0,
    brand_en: 0,
    market: 0,
    shop: 0,
  });

  //通用获取Options方法
  const fetchOptions = async (optionType: string, ...params: any) => {
    const optionTypeMap = {
      city: getCityOptionList,
      brand: getBrandOptionList,
      market: getMarketOptionList,
      shop: getShopOptionList,
    };
    try {
      const res = await optionTypeMap[optionType](...params);
      if (res.success) {
        console.log(`Get ${optionType} Options success`, res);
        const newOptions = res.data.map((item: any) => {
          return {
            value: item.id,
            label: item.label,
          };
        });
        setDataSource(
          produce((draft: any) => {
            draft[`${optionType}Options`] = newOptions;
          }),
        );
      }
    } catch (error) {
      console.error(`Get ${optionType} Options error`, error);
    }
  };

  //获取分页数据
  const handleFetchListData = React.useCallback(async ({ current, pageSize, ...params }) => {
    console.log('handleFetchListData:params:', params);

    const retData = {
      success: false,
      total: 0,
      data: [],
    };

    const customParams = {
      page: current,
      page_size: pageSize,
      city_id: params['city'] ?? '',
      brand_id: params['brand_en'] ?? '',
      market_id: params['market'] ?? '',
      shop_id: params['name'] ?? '',
    };
    try {
      const response = await getShopList(customParams);

      const data = response.data;
      if (!data.list) {
        return;
      }

      retData.success = true;
      retData.total = data.total;
      retData.data = data.list ?? [];
    } catch (error) {
      message.error('数据请求异常');
    }
    return retData;
  }, []);

  const handleOnValueChange = async (field: string, value: any) => {
    console.log('field--field',field)
    if (field === 'city') {
      setSelectedValues({ ...selectedValues, [field]: value });
      await fetchOptions('brand', value);
      await fetchOptions('market', value);
      await fetchOptions('shop',selectedValues['brand_en'], value,  selectedValues['market']);
    }
    if (field === 'brand_en') {
      setSelectedValues({ ...selectedValues, [field]: value });
      await fetchOptions(
        'shop',
        field === 'brand_en' ? value : selectedValues['brand_en'],
        selectedValues.city,
        selectedValues['market'],
      );
    }
    if (field === 'market') {
      setSelectedValues({ ...selectedValues, [field]: value });
      await fetchOptions(
        'shop',
        selectedValues['brand_en'],
        selectedValues.city,
        field === 'market' ? value : selectedValues['market'],
      );
    }
  };

  React.useEffect(() => {
    const initOptions = async () => {
      await fetchOptions('city');
      await fetchOptions('brand', selectedValues['city']);
      await fetchOptions('market', selectedValues['city']);
      await fetchOptions(
        'shop',
        selectedValues['brand_en'],
        selectedValues['city'],
        selectedValues['market'],
      );
    };
    initOptions();
  }, []);
  return {
    dataSource,
    selectedValues,
    handleFetchListData,
    handleOnValueChange,
  };
};
