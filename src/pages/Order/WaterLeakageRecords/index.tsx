import { PageContainer, ParamsType, ProColumns, ProTable } from "@ant-design/pro-components";
import { Button, Drawer, Form, Modal, Space, message } from "antd";
import React, { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { ActionType } from "@ant-design/pro-components";
import { ExclamationCircleFilled, PlusOutlined } from "@ant-design/icons";
import { FormattedMessage, useIntl } from "@umijs/max";
import { leakageReportList, leakageReportDestroy, leakageReportReset } from "@/services/ant-design-pro/project";
import CreateOrUpdate from "./components/CreateOrUpdate";
import { isEmpty } from "lodash";
import { getBrandList, getCityList, getShopList, getWorkerList } from "@/services/ant-design-pro/report";
import DownloadButton from "@/components/Buttons/DownloadButton";
import {getStateMap, setStateMap} from "@/utils/utils";
import {useLocation} from "@@/exports";

export enum SearchType {
  LoadData = 'LOAD_DATA',
  DeleteData = 'DELETE_DATA'
}

// 初始状态
const initialSearchForm = {
  brands: [],
  cities: [],
  shops: [],
  workers: [],
  quo: []
};

// reducer 函数
function searchFormReducer(state, action) {
  const { field, data } = action.payload;
  if (isEmpty(field)) {
    return state;
  }

  switch (action.type) {
    case SearchType.LoadData:
      return { ...state, [field]: [...Array.from(data)] };
    case SearchType.DeleteData:
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

const WaterLeakageRecords = () => {
  const intl = useIntl()
  const [form] = Form.useForm()
  const { confirm } = Modal;
  const [searchDataState, dispatchSearchData] = useReducer(searchFormReducer, initialSearchForm);
  const [showCreateOrUpdate, setShowCreateOrUpdate] = useState(false)
  const [title, setTitle] = useState('')
  const [currentItem, setCurrentItem] = useState({})
  const [initParams, setInitParams] = useState({})
  // 配置Message
  const [messageApi, contextHolder] = message.useMessage();
  const [columnsStateMap, setColumnsStateMap] = useState({});
  const location = useLocation();
  const currentPath = location.pathname;
  const pathname = currentPath.split('/')[currentPath.split('/').length - 1]

  // 成功Message
  const success = (text: string) => {
    messageApi.open({
      type: 'success',
      content: text,
    });
  };

  // 失败Message
  const error = (text: string) => {
    messageApi.open({
      type: 'error',
      content: text,
    });
  };

  // 表格的引入
  const actionRef = useRef<ActionType>();

  const handleFetchListData: any = useCallback(async ({ current, pageSize, ...params }) => {
    console.log('handleFetchListData:params:', params);

    const retData = {
      success: false,
      total: 0,
      data: [],
    };

    const customParams = {
      page: current,
      page_size: pageSize,
      brand_id: params['brand'] ?? '',
      city_id: params['city'] ?? '',
      store_id: params['store'] ?? '',
      worker_uid: params['worker'] ?? '',
      report_at_start: params['report_at'] ? params['report_at'][0] : '',
      report_at_end: params['report_at'] ? params['report_at'][1] : '',
      is_delete: params['delete'] ?? 0
    };
    setInitParams(customParams)
    try {
      const response = await leakageReportList(customParams);
      const data = response.data.data;
      if (!data.data) {
        return
      }
      data.data.map((item, index) => {
        item.key = item.id
        return item
      })

      retData.success = true;
      retData.total = data.total;
      retData.data = data.data ?? [];

    } catch (error) {
      message.error('数据请求异常');
    }

    return retData;
  }, [])


  const handleSearchValuesChange = async (changedValues, allValues) => {
    setInitParams(prevState => {
      return {
        ...prevState,
        brand_id: allValues.brand ?? '',
        city_id: allValues.city ?? '',
        store_id: allValues.store ?? '',
        worker_uid: allValues.worker ?? '',
        report_at_start: allValues.report_at ? allValues.report_at[0] : '',
        report_at_end: allValues.report_at ? allValues.report_at[1] : '',
      }
    })
    // 获取店铺参数
    const shopParams: { city_id: string | number, brand_id: string | number } = {
      city_id: allValues['city'] ?? '',
      brand_id: allValues['brand'] ?? '',
    };

    let shopData: [] = [];
    if ('' !== shopParams['city'] || '' !== shopParams['brand']) {
      const shopResponse = await getShopList(shopParams);
      shopData = shopResponse.data.map(item => {
        return {
          value: item.id,
          label: item.name_cn
        }
      })
      handleSearchSelectedChild(SearchType.LoadData, 'shops', shopData);
    }

    // 品牌、城市切换
    // if ('brand' in changedValues || 'city' in changedValues) {
    //   handleSearchSelectedChild(SearchType.LoadData, 'shops', shopData);
    // }
  }

  const columns: ProColumns<API.WaterLeakageRecordsParams>[] = [
    {
      title: (
        <FormattedMessage
          id="waterLeakageRecords.field.id"
          defaultMessage="序号"
        />
      ),
      dataIndex: 'no',
      align: 'center',
      search: false,
    },
    {
      title: (
        <FormattedMessage
          id="waterLeakageRecords.field.brand"
          defaultMessage="品牌"
        />
      ),
      dataIndex: 'brand',
      align: 'center',
      valueType: 'select',
      fieldProps: {
        showSearch:true,
        options: searchDataState.brands,
        onChange: (key, option) => {
          form.setFieldsValue({ store_cn: undefined });
          // if (isEmpty(key) && isEmpty(option)) {
          //   handleSearchSelectedChild(SearchType.DeleteData, 'shops', []);
          // }
        },
      },
      render: (_, entity) => {
        return (
          <>{entity.brand.brand_en}</>
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="waterLeakageRecords.field.city"
          defaultMessage="城市"
        />
      ),
      dataIndex: 'city',
      align: 'center',
      valueType: 'select',
      fieldProps: {
        showSearch: true,
        options: searchDataState.cities,
        onChange: (key, option) => {
          form.setFieldsValue({ store_cn: undefined });
          // if (isEmpty(key) && isEmpty(option)) {
          //   handleSearchSelectedChild(SearchType.DeleteData, 'shops', []);
          // }
        },
      },
      render: (_, entity) => {
        return (
          <>{entity.city.city}</>
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="waterLeakageRecords.field.store"
          defaultMessage="店铺"
        />
      ),
      dataIndex: 'store',
      align: 'center',
      valueType: 'select',
      fieldProps: {
        showSearch:true,
        options: searchDataState.shops
      },
      render: (_, entity) => {
        return (
          <>{entity.store.name}</>
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="waterLeakageRecords.field.worker"
          defaultMessage="工人"
        />
      ),
      dataIndex: 'worker',
      align: 'center',
      valueType: 'select',
      fieldProps: {
        showSearch:true,
        options: searchDataState.workers
      },
      render: (_, entity) => {
        return (
          <>{entity.worker.name}</>
        )
      }
    },
    {
      title: '责任方',
      dataIndex: 'responsible_party',
      align: 'center',
      search: false,
      render: (_, entity) => {
        return (
          <>{entity.responsible_party === '其它' ? entity.responsible_party_other : entity.responsible_party}</>
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="waterLeakageRecords.field.report_content"
          defaultMessage="报告内容"
        />
      ),
      dataIndex: 'report_content',
      align: 'center',
      search: false,
    },
    {
      title: '是否删除',
      dataIndex: 'delete',
      align: 'center',
      hideInTable: true,
      valueType: 'select',
      fieldProps: {
        showSearch:true,
        options: [
          {
            value: 1,
            label: '已删除',
          },
        ]
      },
    },
    {
      title: (
        <FormattedMessage
          id="waterLeakageRecords.field.report_at"
          defaultMessage="报告时间"
        />
      ),
      dataIndex: 'report_at',
      align: 'center',
      valueType: 'dateRange',
      render: (_, entity) => (
        <div>{entity.report_at}</div>
      )
    },
    {
      title: (
        <FormattedMessage
          id="waterLeakageRecords.field.area"
          defaultMessage="面积"
        />
      ),
      dataIndex: 'area',
      align: 'center',
      search: false,
      render: (dom, entity) => (
        <>
          {
            entity.area === '其它' ? entity.area_other : entity.area
          }
        </>
      )
    },
    {
      title: '漏水类型',
      dataIndex: 'leak_type',
      align: 'center',
      search: false,
      render: (dom, entity) => (
        <>
          {
            entity.leak_type === '其它' ? entity.leak_type_other : entity.leak_type
          }
        </>
      )
    },
    {
      title: '是否商品损失',
      dataIndex: 'is_product_damage',
      align: 'center',
      search: false,
      render: (dom, entity) => (
        <>
          {
            entity.is_product_damage ? '是' : '否'
          }
        </>
      )
    },
    {
      title: '是否装修损失',
      dataIndex: 'is_decor_damage',
      align: 'center',
      search: false,
      render: (dom, entity) => (
        <>
          {
            entity.is_decor_damage ? '是' : '否'
          }
        </>
      )
    },
    {
      title: (
        <FormattedMessage
          id="waterLeakageRecords.field.cause"
          defaultMessage="原因"
        />
      ),
      dataIndex: 'cause',
      search: false,
      align: 'center',
    },
    {
      title: (
        <FormattedMessage
          id="waterLeakageRecords.field.solution"
          defaultMessage="解决方案"
        />
      ),
      dataIndex: 'solution',
      align: 'center',
      search: false,
    },
    {
      title: (
        <FormattedMessage
          id="waterLeakageRecords.field.analysis"
          defaultMessage="分析"
        />
      ),
      dataIndex: 'analysis',
      align: 'center',
      search: false,
    },
    {
      title: (
        <FormattedMessage
          id="waterLeakageRecords.field.statue"
          defaultMessage="statue"
        />
      ),
      dataIndex: 'statue',
      align: 'center',
      search: false,
    },
    {
      title: (
        <FormattedMessage
          id="waterLeakageRecords.field.estimated_repair_time"
          defaultMessage="预估解决时间"
        />
      ),
      dataIndex: 'estimated_repair_time',
      align: 'center',
      search: false,
    },
    {
      title: (
        <FormattedMessage
          id="waterLeakageRecords.field.action"
          defaultMessage="操作"
        />
      ),
      dataIndex: '',
      align: 'center',
      search: false,
      render: (_, entity) => {
        return (
          <Space>
            {
              !entity.deleted_at &&
              <Button type="primary" onClick={() => {
                setShowCreateOrUpdate(true)
                setTitle('修改报告')
                setCurrentItem(entity)
              }}>修改</Button>
            }
            {
              entity.deleted_at ?
                <Button
                  type="primary"
                  style={{ backgroundColor: "green" }}
                  onClick={() => handleReset(entity)}
                >还原</Button> :
                <Button danger onClick={() => handleDelLeakageReport(entity)}>删除</Button>
            }
          </Space>
        )
      }
    },
  ]

  const fetchSearchInitData = async () => {
    const brandResponse = await getBrandList();
    if (brandResponse.success) {
      dispatchSearchData({
        type: SearchType.LoadData,
        payload: {
          field: 'brands',
          data: brandResponse.data.map(item => {
            return {
              value: item.id,
              label: item.brand_en
            }
          })
        }
      });
    }

    const cityResponse = await getCityList();
    if (cityResponse.success) {
      dispatchSearchData({
        type: SearchType.LoadData,
        payload: {
          field: 'cities',
          data: cityResponse.data.map(item => {
            return {
              value: item.id,
              label: item.city_cn
            }
          })
        }
      });
    }

    const workerResponse = await getWorkerList({ type: '' });
    if (workerResponse.success) {
      dispatchSearchData({
        type: SearchType.LoadData,
        payload: {
          field: 'workers',
          data: workerResponse.data.map(item => {
            return {
              value: item.worker_id,
              label: item.worker
            }
          })
        }
      });
    }
  }

  const handleSearchSelectedChild = (type: string, field: string, data: []) => {
    dispatchSearchData({
      type,
      payload: {
        field,
        data
      }
    });
  }

  const handleCloseCreateOrUpdate = () => {
    setShowCreateOrUpdate(false)
    setCurrentItem({})
  }

  const handleDelLeakageReport = (entity) => {
    confirm({
      title: '提示',
      icon: <ExclamationCircleFilled />,
      content: '您确定要删除吗',
      onOk() {
        leakageReportDestroy(entity.id).then(res => {
          if (res.success) {
            actionRef.current?.reload()
            success('删除成功')
            return
          }
          error(res.message)
        })
      },
    });
  };

  const handleExport = () => {
    leakageReportList({ ...initParams, export: 1 }).then(res => {
      function downloadArrayBuffer(arrayBuffer, fileName) {
        // 将 ArrayBuffer 转换为 Blob
        const blob = new Blob([arrayBuffer], { type: 'application/octet-stream' });

        // 创建一个指向 Blob 的 URL
        const url = URL.createObjectURL(blob);

        // 创建一个 a 元素
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName; // 设置下载的文件名

        // 模拟点击 a 元素，触发下载
        document.body.appendChild(link); // 将 a 元素添加到文档中使得 click 生效
        link.click();

        // 清理：下载后移除元素和释放 Blob URL
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }

      // 使用示例
      // const arrayBuffer = new ArrayBuffer(8); // 示例 ArrayBuffer，实际使用时替换为你的 ArrayBuffer
      downloadArrayBuffer(res, '漏水记录.xlsx'); // 下载文件，'example.bin' 为文件名
    })
  }

  const handleReset = (entity) => {
    confirm({
      title: '提示',
      icon: <ExclamationCircleFilled />,
      content: '您确定要还原吗？',
      onOk() {
        leakageReportReset(entity.id).then(res => {
          if (res.success) {
            actionRef.current?.reload()
            success('还原成功')
            return
          }
          error(res.message)
        })
      },
    });
  };

  useEffect(() => {
    setColumnsStateMap(getStateMap(pathname))
    const fetchData = async () => {
      await fetchSearchInitData();
    };

    fetchData();
  }, [])

  return (
    <>
      {contextHolder}
      <PageContainer>
        <ProTable<API.WaterLeakageRecordsParams, API.PageParams>
          headerTitle={intl.formatMessage({
            id: 'waterLeakageRecords.table.title',
            defaultMessage: 'table list',
          })}
          actionRef={actionRef}
          scroll={{ x: 'max-content' }}
          toolBarRender={() => [
            <DownloadButton
              type="primary"
              key="download"
              onDownload={() => leakageReportList({ ...initParams, export: 1 })}
              fileName={'漏水记录.xlsx'}
            >
              <FormattedMessage id="pages.searchTable.export" defaultMessage="Export" />
            </DownloadButton>,
            // <Button
            //   type="primary"
            //   key="primary"
            //   onClick={handleExport}
            // >
            //   <FormattedMessage id="pages.searchTable.export" defaultMessage="Export" />
            // </Button>,
            // <DownloadButton onDownload={() => leakageReportList({ ...initParams, export: 1 }} fileName={"a.txt"}>
            //   导出文件
            // </DownloadButton>
            <Button
              type="primary"
              key="primary"
              onClick={() => {
                setShowCreateOrUpdate(true)
                setTitle('创建报告')
              }}
            >
              <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
            </Button>,
          ]}
          columnEmptyText={false}
          columns={columns}
          request={handleFetchListData}
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
      </PageContainer>

      <Drawer
        open={showCreateOrUpdate}
        width={800}
        destroyOnClose={true}
        title={title}
        onClose={handleCloseCreateOrUpdate}
        maskClosable={false}
      >
        <CreateOrUpdate
          actionRef={actionRef}
          success={success}
          error={error}
          currentItem={currentItem}
          searchDataState={searchDataState}
          handleCloseCreateOrUpdate={handleCloseCreateOrUpdate}
          handleSearchSelectedChild={handleSearchSelectedChild}
        />
      </Drawer>
    </>
  )
}

export default WaterLeakageRecords
