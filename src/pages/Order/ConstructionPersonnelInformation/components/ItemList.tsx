import React, {RefObject, useEffect, useState} from "react"
import type { ActionType, ParamsType } from "@ant-design/pro-components";
import { ProTable, ProColumns } from "@ant-design/pro-components";
import { useIntl, FormattedMessage } from "@umijs/max";
import { Button, Form } from "antd";
import { isEmpty } from "lodash";
import { SearchType } from "..";
import { getShopList, getMarketList } from "@/services/ant-design-pro/report";
import {getStateMap, setStateMap} from "@/utils/utils";
import {useLocation} from "@@/exports";

type HandleListDataParams = {
  current: number;
  pageSize: number;
  [key: string]: any;
};

type HandleListDataReturnType = {
  success: boolean;
  total: number;
  data: any[]; // 可以根据需要进一步指定数组的类型
};

type HandleListDataFunc = (params: HandleListDataParams, sort: ParamsType) => Promise<HandleListDataReturnType>;

interface ItemListProps {
  onListData: HandleListDataFunc;
  searchData: [],
  onSearchSelectedChild: (type: string, field: string, data: []) => void;
  actionRef: RefObject<ActionType>;
  success: (text: string) => void
  error: (text: string) => void
}

const ItemList: React.FC<ItemListProps> = ({
  actionRef,
  onListData,
  searchData,
  onSearchSelectedChild,
  success,
  error
}) => {
  const intl = useIntl()
  const [form] = Form.useForm()

  const [columnsStateMap, setColumnsStateMap] = useState({});
  const location = useLocation();
  const currentPath = location.pathname;
  const pathname = currentPath.split('/')[currentPath.split('/').length - 1]

  const handleSearchValuesChange = async (changedValues, allValues) => {
    // 获取店铺参数
    const shopParams: { city_id: string | number, brand_id: string | number, market_id: string | number } = {
      city_id: allValues['city_cn'] ?? '',
      brand_id: allValues['brand_en'] ?? '',
      market_id: allValues['market_cn'] ?? '',
    };

    let shopData: [] = [];
    if ('' !== shopParams['city_id'] || '' !== shopParams['brand_id'] || '' !== shopParams['market_id']) {
      const shopResponse = await getShopList(shopParams);
      shopData = shopResponse.data;
    }

    if ('city_cn' in changedValues) {
      const marketResponse = await getMarketList({ city_id: changedValues.city_cn });
      onSearchSelectedChild(SearchType.LoadData, 'markets', marketResponse.data);
    }

    // 品牌、城市、商场切换
    if ('brand_en' in changedValues || 'city_cn' in changedValues || 'market_cn' in changedValues) {
      onSearchSelectedChild(SearchType.LoadData, 'shops', shopData);
    }
  }

  const columns: ProColumns<API.ConstructionPersonnelInformationParams>[] = [
    {
      title: (
        <FormattedMessage
          id="constructionPersonnelInformation.field.id"
          defaultMessage="序号"
        />
      ),
      dataIndex: 'id',
      search: false,
      render: (text, record, rowIndex) => {
        return (
          <div>{rowIndex + 1}</div>
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="constructionPersonnelInformation.field.supplier_order_no"
          defaultMessage="订单编号"
        />
      ),
      dataIndex: 'supplier_order_no',
      align: 'center',
      search: false,
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              window.open(`/order/orderList?code=${entity.supplier_order_no}`, '_blank')
              // setCurrentRow(entity);
              // setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: (
        <FormattedMessage
          id="constructionPersonnelInformation.field.city"
          defaultMessage="城市"
        />
      ),
      dataIndex: 'city_cn',
      align: 'center',
      valueType: 'select',
      valueEnum: searchData.cities.reduce((acc, item) => {
        acc[`${item.id}`] = { text: item.city_cn };
        return acc;
      }, {}),
      fieldProps: {
        showSearch: true,
        onChange: (key, option) => {
          form.setFieldsValue({ market_cn: undefined, store_cn: undefined });
          if (isEmpty(key) && isEmpty(option)) {
            onSearchSelectedChild(SearchType.DeleteData, 'markets', []);
            onSearchSelectedChild(SearchType.DeleteData, 'shops', []);
          }
        },
      },
    },
    {
      title: (
        <FormattedMessage
          id="constructionPersonnelInformation.field.brand"
          defaultMessage="品牌"
        />
      ),
      dataIndex: 'brand_en',
      align: 'center',
      valueType: 'select',
      valueEnum: searchData.brands?.reduce((acc, item) => {
        acc[`${item.id}`] = { text: item.brand_en };
        return acc;
      }, {}),
      fieldProps: {
        onChange: (key, option) => {
          form.setFieldsValue({ store_cn: undefined });
          // form.setFieldsValue({ market_cn: undefined });
          if (isEmpty(key) && isEmpty(option)) {
            onSearchSelectedChild(SearchType.DeleteData, 'shops', []);
          }
        },
      },
    },
    {
      title: (
        <FormattedMessage
          id="constructionPersonnelInformation.field.market"
          defaultMessage="商场"
        />
      ),
      dataIndex: 'market_cn',
      align: 'center',
      valueType: 'select',
      valueEnum: searchData.markets?.reduce((acc, item) => {
        acc[`${item.id}`] = { text: item.market_cn };
        return acc;
      }, {}),
      fieldProps: {
        showSearch: true,
        onChange: (key, option) => {
          form.setFieldsValue({ store_cn: undefined });
          if (isEmpty(key) && isEmpty(option)) {
            onSearchSelectedChild(SearchType.DeleteData, 'shops', []);
          }
        },
      },
    },
    {
      title: (
        <FormattedMessage
          id="constructionPersonnelInformation.field.store"
          defaultMessage="店铺"
        />
      ),
      dataIndex: 'store_cn',
      align: 'center',
      valueType: 'select',
      valueEnum: searchData.shops?.reduce((acc, item) => {
        acc[`${item.id}`] = { text: item.name_cn };
        return acc;
      }, {}),
    },
    {
      title: (
        <FormattedMessage
          id="constructionPersonnelInformation.field.ma_type_cn"
          defaultMessage="维修类型"
        />
      ),
      dataIndex: 'ma_type_cn',
      align: 'center',
      search: false,
    },
    {
      title: (
        <FormattedMessage
          id="constructionPersonnelInformation.field.ma_cate_cn"
          defaultMessage="工作类型"
        />
      ),
      dataIndex: 'ma_cate_cn',
      align: 'center',
      search: false,
    },
    {
      title: (
        <FormattedMessage
          id="constructionPersonnelInformation.field.leader_name"
          defaultMessage="负责人"
        />
      ),
      dataIndex: 'leader',
      align: 'center',
      valueType: 'select',
      valueEnum: searchData.manager?.reduce((acc, item) => {
        acc[`${item.worker_id}`] = { text: item.worker };
        return acc;
      }, {}),
      fieldProps: {
        showSearch: true,
      },
      render: (dom, entity) => {
        return (
          <div>
            <div>{entity.leader_name}</div>
            <div>{entity.leader_mobile}</div>
            <div>{entity.leader_id_card_no}</div>
          </div>
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="constructionPersonnelInformation.field.worker_name_list"
          defaultMessage="工人"
        />
      ),
      dataIndex: 'worker_name_list',
      align: 'center',
      search: false,
    },
    {
      title: (
        <FormattedMessage
          id="constructionPersonnelInformation.field.submit_at"
          defaultMessage="提交时间"
        />
      ),
      dataIndex: 'submit_at',
      align: 'center',
      search: false,
    },
    {
      title: (
        <FormattedMessage
          id="constructionPersonnelInformation.field.action"
          defaultMessage="操作"
        />
      ),
      dataIndex: 'action',
      align: 'center',
      search: false,
      render: (dom, entity) => {

        return (
          <Button type="primary" onClick={() => {
            const ma_type = entity.ma_cate_cn.split('/')
            const type = ma_type[ma_type.length - 1]
            console.log(entity);
            window.open(`/PDF/workerPDF?appo_task_id=${entity.id}&contact_person_type=same&company_id=1&brand_en=${entity.brand_en}&store_cn=${entity.store_cn}&type=${type}&leader_name=${entity.leader_name}&leader_mobile=${entity.leader_mobile}`, '_blank'
            )
          }}>预览</Button>
        )
      }
    },
  ]

  useEffect(() => {
    setColumnsStateMap(getStateMap(pathname))
  }, []);

  return (
    <>
      <ProTable<API.ConstructionPersonnelInformationParams, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'constructionPersonnelInformation.table.title',
          defaultMessage: 'table list',
        })}
        actionRef={actionRef}
        scroll={{ x: 'max-content' }}
        search={{
          labelWidth: 120,
        }}
        request={onListData}
        columns={columns}
        form={{
          form,
          onValuesChange: handleSearchValuesChange
        }}
        columnsState={{
          value: columnsStateMap,
          onChange: (newState) => {
            setColumnsStateMap(newState)
            setStateMap(pathname, newState)
          }
        }}
      />
    </>
  )
}

export default ItemList
