import {getMarketList, getShopList} from '@/services/ant-design-pro/report';
import {ParamsType, ProColumns, ProTable} from '@ant-design/pro-components';
import {FormattedMessage, useIntl} from '@umijs/max';
import {Button, Form, Space, Modal, Tag} from 'antd';
import React, {useEffect, useState} from 'react';
import {SearchType} from '..';
import {isEmpty} from 'lodash';
import {ExclamationCircleFilled} from '@ant-design/icons';
import ShieldList from './ShieldList';
import {storeShield, deleteHardwareAlarm} from '@/services/ant-design-pro/project';
import {useLocation} from "@@/exports";
import {getStateMap, setStateMap, showButtonByType} from "@/utils/utils";
import {getUserButtons} from "@/services/ant-design-pro/user";

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

type HandleListDataFunc = (
  params: HandleListDataParams,
  sort: ParamsType,
) => Promise<HandleListDataReturnType>;

const clearList = [
  {
    value: 0,
    label: '报警',
  },
  {
    value: 1,
    label: '解除',
  },
]

interface ItemListProps {
  actionRef: any
  onListData: HandleListDataFunc;
  searchData;
  onSearchSelectedChild;
  success: (text: string) => void
  error: (text: string) => void
}

const ItemList: React.FC<ItemListProps> = ({
                                             onListData,
                                             searchData,
                                             onSearchSelectedChild,
                                             actionRef,
                                             success,
                                             error,
                                           }) => {
  const {confirm} = Modal;
  const intl = useIntl();
  const [form] = Form.useForm();
  const [showShieldList, setShowShieldList] = useState(false)
  const [columnsStateMap, setColumnsStateMap] = useState({});
  const location = useLocation();
  const currentPath = location.pathname;
  const pathname = currentPath.split('/')[currentPath.split('/').length - 1]

  const [toolBarRenderCtrButtons, setToolBarRenderCtrButtons] = useState<any[]>([])

  const [showTableListButton, setShowTableListButton] = useState(false)

  const handleSearchValuesChange = async (changedValues, allValues) => {
    // 获取店铺参数
    const shopParams: {
      city_id: string | number;
      brand_id: string | number;
      market_id: string | number;
    } = {
      city_id: allValues['city'] ?? '',
      brand_id: allValues['brand_en'] ?? '',
      market_id: allValues['market_cn'] ?? '',
    };

    let shopData: [] = [];
    if (
      '' !== shopParams['city_id'] ||
      '' !== shopParams['market_id']
    ) {
      const shopResponse = await getShopList(shopParams);
      shopData = shopResponse.data;
    }

    if ('city' in changedValues) {
      const marketResponse = await getMarketList({city_id: changedValues.city});
      onSearchSelectedChild(SearchType.LoadData, 'markets', marketResponse.data);
    }

    // 品牌、城市、商场切换
    if ('brand_en' in changedValues || 'city' in changedValues || 'market' in changedValues) {
      onSearchSelectedChild(SearchType.LoadData, 'shops', shopData);
    }
  };

  const showDeleteConfirm = (entity) => {
    confirm({
      title: '提示',
      icon: <ExclamationCircleFilled/>,
      content: '此操作将会永久删除此纪录，是否继续？',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        deleteHardwareAlarm(entity.id).then(res => {
          if (res.success) {
            success('删除成功')
            actionRef.current.reload()
            return
          }
          error(res.message)
        })
      },
    });
  };

  const showShieldConfirm = (entity) => {
    confirm({
      title: '提示',
      icon: <ExclamationCircleFilled/>,
      content: '此操作将会屏蔽此纪录，是否继续？',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        storeShield({alarm_id: entity.id}).then(res => {
          if (res.success) {
            success('添加成功')
            actionRef.current.reload()
            return
          }
          error(res.message)
        })
      },
    });
  }

  const columns: ProColumns<API.WarningEventParams>[] = [
    {
      title: <FormattedMessage id="warningEvent.field.city" defaultMessage="城市"/>,
      valueType: 'select',
      align: 'center',
      valueEnum: searchData.cities.reduce((acc, item) => {
        acc[`${item.id}`] = {text: item.city_cn};
        return acc;
      }, {}),
      dataIndex: 'city',
      fieldProps: {
        showSearch: true,
        onChange: (key, option) => {
          form.setFieldsValue({store_cn: undefined});
          form.setFieldsValue({market_cn: undefined});
          if (isEmpty(key) && isEmpty(option)) {
            onSearchSelectedChild(SearchType.DeleteData, 'markets', []);
            onSearchSelectedChild(SearchType.DeleteData, 'shops', []);
          }
        },
      },
      // search: false,
      render: (dom, entity) => {
        return <>{entity.center.shop.city.city}</>;
      },
    },
    {
      title: (
        <FormattedMessage
          id="warningEvent.field.market"
          defaultMessage="商场"
        />
      ),
      dataIndex: 'market',
      hideInTable: true,
      align: 'center',
      valueType: 'select',
      valueEnum: searchData.markets?.reduce((acc, item) => {
        acc[`${item.id}`] = {text: item.market_cn};
        return acc;
      }, {}),
      fieldProps: {
        showSearch: true,
        onChange: (key, option) => {
          form.setFieldsValue({store_cn: undefined});
          if (isEmpty(key) && isEmpty(option)) {
            onSearchSelectedChild(SearchType.DeleteData, 'shops', []);
          }
        },
      },
    },
    {
      title: <FormattedMessage id="warningEvent.field.store" defaultMessage="店铺"/>,
      dataIndex: 'store',
      // search: false,
      valueType: 'select',
      align: 'center',
      valueEnum: searchData.shops?.reduce((acc, item) => {
        acc[`${item.id}`] = {text: item.name_cn};
        return acc;
      }, {}),
      fieldProps: {
        showSearch: true
      },
      render: (dom, entity) => {
        return <>{entity.center.shop.name}</>;
      },
    },
    {
      title: <FormattedMessage id="warningEvent.field.machine_name" defaultMessage="机器"/>,
      dataIndex: 'machine_name',
      search: false,
      align: 'center',
    },

    {
      title: <FormattedMessage id="warningEvent.field.content" defaultMessage="故障"/>,
      dataIndex: 'content',
      align: 'center',
    },

    {
      title: <FormattedMessage id="warningEvent.field.clear" defaultMessage="当前报警状态"/>,
      dataIndex: 'is_clear',
      align: 'center',
      search: {
        title: '报警状态',
      },
      valueType: 'select',
      valueEnum: clearList.reduce((acc, item) => {
        acc[`${item.value}`] = {text: item.label};
        return acc;
      }, {}),
      fieldProps: {
        showSearch: true
      },
      render: (dom, entity) => {
        return (
          <Tag color={entity.is_clear === 0 ? 'red' : 'green'}>
            {
              entity.is_clear === 0 ? '报警' : '解除'
            }
          </Tag>
        )
      }
    },

    {
      title: <FormattedMessage id="warningEvent.field.create_at" defaultMessage="报警时间"/>,
      dataIndex: 'created_at',
      valueType: 'dateRange',
      align: 'center',
      render: (dom, entity) => {
        let time =
          (entity.created_at === entity.updated_at || !entity.updated_at) ?
            entity.created_at :
            entity.created_at + ' ~ ' + entity.updated_at
        return (
          <>{time}</>
        )
      }
    },

    {
      title: <FormattedMessage id="warningEvent.field.action" defaultMessage="操作"/>,
      dataIndex: '',
      align: 'center',
      search: false,
      render: (dom, entity) => (
        <Space>
          {
            showTableListButton &&
            <Button type="primary" onClick={() => showShieldConfirm(entity)}>屏蔽</Button>
          }

          <Button danger onClick={() => showDeleteConfirm(entity)}>删除</Button>
        </Space>
      )
    },
  ];

  const handleCloseShieldList = () => {
    setShowShieldList(false)
  }

  const toolBarRenderMappings = {
    faultMessageShieldList:
      <Space>
        <Button
          type="primary"
          key="primary"
          onClick={() => {
            setShowShieldList(true)
          }}
        >
          屏蔽列表
        </Button>,
      </Space>
  }


  useEffect(() => {

    try {
      showButtonByType(toolBarRenderMappings, 'warningEvent', 'toolBarRender').then(r => {
        console.log("操作栏数据", r)
        setToolBarRenderCtrButtons(r)
      })

      getUserButtons({module: 'warningEvent', pos: 'tableList'}).then(res => {
        console.log('获取单个按钮数据', res);

        if (res.success && !isEmpty(res.data)) {
          res.data.forEach(item => {
            if (item.name === 'faultMessageShield') {
              setShowTableListButton(true)
              return
            }
          })
        }
      })
    } catch (err) {}

    setColumnsStateMap(getStateMap(pathname))
  }, []);

  return (
    <>
      <ProTable<API.WarningEventParams, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'warningEvent.table.title',
          defaultMessage: 'table list',
        })}
        actionRef={actionRef}
        scroll={{x: 'max-content'}}
        toolBarRender={() => [
          // <Button
          //   type="primary"
          //   key="primary"
          //   onClick={() => {
          //     setShowShieldList(true)
          //   }}
          // >
          //   屏蔽列表
          // </Button>,
          ...toolBarRenderCtrButtons
        ]}
        columns={columns}
        request={onListData}
        form={{
          form,
          onValuesChange: handleSearchValuesChange,
        }}
        columnsState={{
          value: columnsStateMap,
          onChange: (newState) => {
            setColumnsStateMap(newState)
            setStateMap(pathname, newState)
          }
        }}
      />

      <Modal
        width={1000}
        open={showShieldList}
        onCancel={handleCloseShieldList}
        footer={null}
        destroyOnClose={true}
        title="屏蔽列表"
      >
        <ShieldList
          success={success}
          error={error}
        />
      </Modal>
    </>
  );
};

export default ItemList;
