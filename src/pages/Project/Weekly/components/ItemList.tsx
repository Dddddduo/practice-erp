import React, { useEffect, useState, RefObject } from "react"
import { Button, Tag, Modal, Drawer, Form, message, Popconfirm, Space } from 'antd'
import { ParamsType, ProColumns, ProTable, ActionType } from '@ant-design/pro-components';
import { FormattedMessage, useIntl, useLocation } from "@@/exports";
import { getMarketList, getShopList } from "@/services/ant-design-pro/report";
import { isEmpty } from "lodash";
import { SearchType } from "..";
import type { SelectProps } from 'antd';
import WeeklyDetail from "@/pages/Project/Weekly/components/detail";
import Trash from "@/pages/Project/Weekly/components/trash";
import { deleteOrRollbackReport } from "@/services/ant-design-pro/weekly";
import { getStateMap, setStateMap } from "@/utils/utils";

type HandleListDataParams = {
  current: number;
  pageSize: number;
  [key: string]: any;
};

type HandleRowSelectionFunc = (keys: any, selectedRows: any[]) => void; // 根据实际情况替换 any

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

/**
 * 报销单组件列表
 * @constructor
 */
const ItemList: React.FC<ItemListProps> = ({
  onListData,
  searchData,
  onSearchSelectedChild,
  actionRef,
  success,
  error
}) => {
  const intl = useIntl()
  const [loadings, setLoadings] = useState<boolean[]>([]);
  const [form] = Form.useForm();
  // 是否显示历史弹窗
  // 是否显示详情
  const [title, setTitle] = useState('')
  const [showWeeklyDetail, setShowWeeklyDetail] = useState(false)
  const [showTrash, setShowTrash] = useState(false)
  const [weeklyId, setWeeklyId] = useState(0)
  const [cityId, setCityId] = useState(0)
  const [marketId, setMarketId] = useState(0)
  const [columnsStateMap, setColumnsStateMap] = useState({});
  const location = useLocation();
  const currentPath = location.pathname;
  const pathname = currentPath.split('/')[currentPath.split('/').length - 1]

  const handleSearchValuesChange = async (changedValues, allValues) => {
    console.log(allValues);
    // 获取店铺参数
    const shopParams: { city_id: string | number, brand_id: string | number, market_id: string | number } = {
      city_id: allValues['city_id'] ?? '',
      brand_id: allValues['brand_id'] ?? '',
      market_id: allValues['market_id'] ?? '',
    };

    let shopData: [] = [];
    if ('' !== shopParams['city_id'] || '' !== shopParams['brand_id'] || '' !== shopParams['market_id']) {
      const shopResponse = await getShopList(shopParams);
      shopData = shopResponse.data;
    }

    if ('city_id' in changedValues) {
      const marketResponse = await getMarketList({ city_id: changedValues.city_id });
      onSearchSelectedChild(SearchType.LoadData, 'markets', marketResponse.data);
    }

    // 品牌、城市、商场切换
    if ('brand_id' in changedValues || 'city_id' in changedValues || 'market_id' in changedValues) {
      onSearchSelectedChild(SearchType.LoadData, 'shops', shopData);
    }
  }

  const editWeekly = (entity: any) => {
    setShowWeeklyDetail(true)
    setWeeklyId(entity.id)
    setCityId(entity.city_id)
    setMarketId(entity.market_id)
  }

  // 确认删除
  const confirmDelete = async (entity) => {
    const result = await deleteOrRollbackReport({ weekly_report_id: entity.id, is_delete: 'y' })
    if (result.success) {
      message.success('删除成功')
      actionRef.current?.reload()
    } else {
      message.error('删除失败')
    }
  }

  // 预览周报
  const previewWeekly = async (entity) => {
    if (process.env.NODE_ENV === 'development') {
      window.open(`https://erp.huyudev.com/#/weekly-pdf?id=${entity.id}`, '_blank');
    } else {
      window.open(`https://erp.zhian-design.com/#/weekly-pdf?id=${entity.id}`, '_blank');
    }
  }

  const optionsBrand: SelectProps['options'] = searchData.brands.map((item: any) => {
    return {
      value: item.id,
      label: item.brand_en,
    };
  })

  const columns: ProColumns<API.WeeklyListItem>[] = [
    {
      title: (
        <FormattedMessage
          id="reimbursement.field.id"
          defaultMessage="序号"
        />
      ),
      dataIndex: 'id',
      search: false
    },
    {
      title: (
        <FormattedMessage
          id="reimbursement.field.brand"
          defaultMessage="品牌"
        />
      ),
      dataIndex: 'brand_en',
      valueType: 'select',
      fieldProps: {
        showSearch: true,
        options: optionsBrand,
        onChange: (key, option) => {
          form.setFieldsValue({ store_id: undefined });
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
          id="reimbursement.field.city"
          defaultMessage="城市"
        />
      ),
      dataIndex: 'city_cn',
      valueType: 'select',
      valueEnum: searchData.cities.reduce((acc, item) => {
        acc[`${item.id}`] = { text: item.city_cn };
        return acc;
      }, {}),
      fieldProps: {
        showSearch: true,
        onChange: (key, option) => {
          form.setFieldsValue({ store_id: undefined });
          form.setFieldsValue({ market_id: undefined });
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
          id="reimbursement.field.market"
          defaultMessage="商场"
        />
      ),
      dataIndex: 'market_cn',
      valueType: 'select',
      valueEnum: searchData.markets?.reduce((acc, item) => {
        acc[`${item.id}`] = { text: item.market_cn };
        return acc;
      }, {}),
      fieldProps: {
        showSearch: true,
        onChange: (key, option) => {
          form.setFieldsValue({ store_id: undefined });
          if (isEmpty(key) && isEmpty(option)) {
            onSearchSelectedChild(SearchType.DeleteData, 'shops', []);
          }
        },
      },
    },
    {
      title: (
        <FormattedMessage
          id="reimbursement.field.store"
          defaultMessage="店铺"
        />
      ),
      dataIndex: 'store_cn',
      valueType: 'select',
      valueEnum: searchData.shops?.reduce((acc, item) => {
        acc[`${item.id}`] = { text: item.name_cn };
        return acc;
      }, {}),
      fieldProps: {
        showSearch: true
      },
    },
    {
      title: (
        <FormattedMessage
          id="pages.searchTable.creationDate"
          defaultMessage="创建日期"
        />
      ),
      dataIndex: 'create_at',
      search: false,
    },
    {
      title: (
        <FormattedMessage
          id="pages.searchTable.commencementDate"
          defaultMessage="开工日期"
        />
      ),
      dataIndex: 'project_start_at',
      search: false,
    },
    {
      title: (
        <FormattedMessage
          id="reimbursement.field.completed"
          defaultMessage="完工日期"
        />
      ),
      dataIndex: 'project_end_at',
      search: false,
    },
    {
      title: (
        <FormattedMessage
          id="pages.searchTable.titleOption"
          defaultMessage="操作"
        />
      ),
      dataIndex: 'completed_at',
      search: false,
      render: (dom, entity) => {
        return (
          <Space>
            <Button type="primary" onClick={() => editWeekly(entity)}>编辑</Button>
            <Button type="primary" style={{ marginLeft: '5px' }} onClick={() => previewWeekly(entity)}>预览</Button>
            <Popconfirm
              description="确定删除?"
              onConfirm={() => confirmDelete(entity)}
              okText="Yes"
              cancelText="No"
              title={""}
            >
              <Button danger style={{ marginLeft: '5px' }}>删除</Button>
            </Popconfirm>
          </Space>
        )
      }
    },
  ]

  const refreshList = () => {
    actionRef.current?.reload();
  }

  useEffect(() => {
    setColumnsStateMap(getStateMap(pathname))
  }, [])

  return (
    <>
      <ProTable<API.WeeklyListItem, API.PageParams>
        headerTitle={"周报列表"}
        actionRef={actionRef}
        scroll={{ x: 'max-content' }}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => setShowWeeklyDetail(true)}
            loading={loadings[1]}
          >
            <FormattedMessage id="pages.searchTable.new" defaultMessage="新建" />
          </Button>,
          <Button
            type="primary"
            key="primary"
            onClick={() => setShowTrash(true)}
            loading={loadings[1]}
          >
            <FormattedMessage id="pages.searchTable.recycleBin" defaultMessage="回收站" />
          </Button>,
        ]}
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

      <Drawer
        width={1200}
        onClose={() => {
          setShowWeeklyDetail(false)
          setWeeklyId(0)
        }}
        maskClosable={false}
        open={showWeeklyDetail}
        destroyOnClose={true}
        title={title}
      >
        <WeeklyDetail weeklyId={weeklyId} cityId={cityId} marketId={marketId} fetchInitData={refreshList} onClose={() => setShowWeeklyDetail(false)} />
      </Drawer>

      <Modal
        width={1000}
        open={showTrash}
        maskClosable={false}
        onCancel={() => setShowTrash(false)}
        destroyOnClose
      >
        <Trash refresh={refreshList} />
      </Modal>
    </>
  )
}

export default ItemList
