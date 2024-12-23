import React, {RefObject, useEffect, useRef, useState} from "react"
import {ActionType, ParamsType, ProColumns, ProTable} from '@ant-design/pro-components';
import {FormattedMessage, useIntl} from "@@/exports";
import {message, SelectProps} from 'antd';
import {Badge, Button, Drawer, Form, Modal, Space, Tag} from "antd";
import {getMaCateList, getMarketList, getShopList} from "@/services/ant-design-pro/report";
import {SearchType} from "..";
import {isEmpty, isUndefined, map, sumBy} from "lodash";
import './index.css'
import {useLocation} from "umi";
import {
  approveQuo, createOrUpdateFinanceCollAlone,
  createPdfFile,
  getClassTypeListOutSide,
  getFileOssUrl,
  getQuoExcelList,
  getUploadToken,
  shareQuotation
} from "@/services/ant-design-pro/quotation";
import {PlusCircleOutlined, ShoppingCartOutlined, WarningTwoTone} from "@ant-design/icons";
import CreateSpecialOffers from "./CreateSpecialOffers";
import Summary from "./Summary";
import Billing from "./Billing";
import MarkerColor from "./MarkerColor";
import Approval from "./Approval";
import QuoDetail from "./QuoDetail";
import History from "./History";
import CarList from "./CarList";
import {downloadFile, getStateMap, LocalStorageService, setStateMap} from "@/utils/utils";
import dayjs from "dayjs";
import OSS from 'ali-oss'
import Tags from "@/pages/Order/Quotation/components/tags";
import BaseContainer, {ModalType} from "@/components/Container";
import {InvoiceRequestForm} from "@/components/Finance/InvoiceRequestForm";
import {getFinanceCollInfoBatch} from "@/services/ant-design-pro/aggregateQuotes";

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
  onClearSelected: () => void
  searchData: {
    isHasSign: any
    maCates: any
    brands: any
    cities: any
    markets: any
    shops: any
    maType: any
    quotationType: any
    secondQuotationType: any
    status: any
    color: any
  },
  onSearchSelectedChild: (type: string, field: string, data: []) => void;
  actionRef: RefObject<ActionType>;
  onRowSelected
  selectedRowsState
  success: (text: string) => void
  error: (text: string) => void
  customParams
}

const ItemList: React.FC<ItemListProps> = ({
                                             onListData,
                                             searchData,
                                             onSearchSelectedChild,
                                             actionRef,
                                             onRowSelected,
                                             selectedRowsState,
                                             success,
                                             error,
                                             customParams,
                                             onClearSelected
                                           }) => {
  const intl = useIntl()
  const [form] = Form.useForm()
  const [showCreateSpecialOffers, setShowCreateSpecialOffers] = useState(false)
  const [carList, setCarList]: any = useState(LocalStorageService.getItem('carList') || [])
  const [showSummary, setShowSummary] = useState(false)
  const [showBillimg, setShowBillimg] = useState(false)
  const [loadingShare, setLoadingShare] = useState<boolean[]>([]);
  const [loading, setLoading] = useState<boolean[]>([]);
  const [loadings, setLoadings] = useState<boolean[]>([]);
  const [loadingDownload, setLoadingDownload] = useState<boolean[]>([]);
  const [showMarkerColor, setShowMarkerColor] = useState(false)
  const [currentItem, setCurrentItem] = useState()
  const [showApproval, setShowApproval] = useState(false)
  const [showQuoDetail, setShowQuoDetail] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [showSpecialQuotation, setShowSpecialQuotation] = useState(false)
  const [showCar, setShowCar] = useState(false)
  const timerId = useRef<NodeJS.Timer>();
  const [showDialog, setShowDialog] = useState(false)
  const [columnsStateMap, setColumnsStateMap] = useState({});
  const location = useLocation();
  const currentPath = location.pathname;
  const pathname = currentPath.split('/')[currentPath.split('/').length - 1]
  // 根据参数名称获取具体的路由参数
  const queryParams = new URLSearchParams(location.search);
  const quo_no = queryParams.get('quo_no');

  const [showTagDialog, setShowTagDialog] = useState<boolean>(false)
  const [tagEntity, setTagEntity] = useState<any>()

  const [invoiceOpen, setInvoiceOpen] = useState<boolean>(false);
  const [invoiceDataSource, setInvoiceDataSource] = useState<{ [key: string]: any }>({})

  const handleSearchValuesChange = async (changedValues, allValues) => {
    console.log(changedValues);

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
      const marketResponse = await getMarketList({city_id: changedValues.city_cn});
      onSearchSelectedChild(SearchType.LoadData, 'markets', marketResponse.data);
    }

    // 品牌、城市、商场切换
    if ('brand_en' in changedValues || 'city_cn' in changedValues || 'market_cn' in changedValues) {
      onSearchSelectedChild(SearchType.LoadData, 'shops', shopData);
    }

    if ('ma_type_cn' in changedValues) {
      const maTypeResponse = await getMaCateList({p_type: changedValues.ma_type_cn})
      onSearchSelectedChild(SearchType.LoadData, 'maType', maTypeResponse.data);
    }

    if ('quotation_type' in changedValues) {
      const quotationTypeResponse = await getClassTypeListOutSide({class_type: changedValues.quotation_type})
      onSearchSelectedChild(SearchType.LoadData, 'secondQuotationType', quotationTypeResponse.data);
    }
  }

  // 处理品牌
  const brandList: SelectProps['options'] = searchData.brands.map((item: any) => {
    return {
      value: item.id,
      label: item.brand_en
    }
  })

  const onCloseCreateSpecialOffers = () => {
    setCurrentItem(undefined)
    setShowCreateSpecialOffers(false)
    setShowSpecialQuotation(false)
    setShowQuoDetail(false)
  }

  const addCarList = (entity: any) => {
    if (carList.length < 1) {
      setCarList([entity])
      LocalStorageService.setItem('carList', [entity])
    }
    if (isUndefined(carList.find((item: any) => item.id === entity.id))) {
      setCarList([...carList, entity])
      LocalStorageService.setItem('carList', [...carList, entity])
    }
  }

  const exportList = (type, index) => {
    if (type === '') {
      setLoading((prevLoadings) => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = true;
        return newLoadings;
      });
    }
    if (type === 'gucci_export_excel') {
      setLoadings((prevLoadings) => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = true;
        return newLoadings;
      });
    }

    // console.log(type, customParams);
    const params = {...customParams, action_type: type}
    // console.log(params);
    getQuoExcelList(params).then(res => {
      if (res.success) {
        if (type === '') {
          if (res.data && res.data.filename) {
            getUploadToken({file_suffix: 'xlsx', only_download: 1}).then(result => {
              const ossData = res.data
              const client = new OSS({
                region: 'oss-' + ossData.region_id,
                accessKeySecret: ossData.access_secret,
                accessKeyId: ossData.access_id,
                stsToken: ossData.secret_token,
                bucket: ossData.bucket
              })
              const filename = '报价单明细.xlsx'
              const response = {
                'content-disposition': `attachment; filename=${encodeURIComponent(
                  filename
                )}`
              }
              const url = client.signatureUrl(res.data.filename, {
                response
              })
              downloadFile(url, filename)
              setLoading((prevLoadings) => {
                const newLoadings = [...prevLoadings];
                newLoadings[index] = true;
                return newLoadings;
              });
            })
          }
        }
        if (type === 'gucci_export_excel') {
          if (res.data && res.data.filename) {
            getUploadToken({file_suffix: 'xlsx', only_download: 1}).then(result => {
              const ossData = res.data
              const client = new OSS({
                region: 'oss-' + ossData.region_id,
                accessKeySecret: ossData.access_secret,
                accessKeyId: ossData.access_id,
                stsToken: ossData.secret_token,
                bucket: ossData.bucket
              })
              const filename = '报价单明细.xlsx'
              const response = {
                'content-disposition': `attachment; filename=${encodeURIComponent(
                  filename
                )}`
              }
              const url = client.signatureUrl(res.data.filename, {
                response
              })
              downloadFile(url, filename)
              setLoadings((prevLoadings) => {
                const newLoadings = [...prevLoadings];
                newLoadings[index] = true;
                return newLoadings;
              });
            })
          }
        }
      }
    })
  }

  const batchDownloads = (index) => {
    setLoadingDownload((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });
    console.log();

    createPdfFile({pdf_type: 'zip_quotation', pdf_info: selectedRowsState.map(item => item.id)}).then(res => {
      timerId.current = setInterval(async () => {
        await getFileOssUrl({download_token: res.data}).then(ossResult => {
          console.log(ossResult);
          if (ossResult.data) {
            downloadFile(ossResult.data, dayjs().format('YYYY-MM-DD') + '.zip')
            setLoadingDownload((prevLoadings) => {
              const newLoadings = [...prevLoadings];
              newLoadings[index] = false;
              return newLoadings;
            });
            clearInterval(timerId.current)
          }
        })
        if (!loadingDownload) {
          return false
        }
      }, 1000)
    })
  }

  const share = (index) => {
    setLoadingShare((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });

    shareQuotation({quo_ids: selectedRowsState.map(item => item.id).join(',')}).then((res: any) => {
      if (res.success) {
        success('分享成功')
        setLoadingShare((prevLoadings) => {
          const newLoadings = [...prevLoadings];
          newLoadings[index] = false;
          return newLoadings;
        });
        return
      }
      error(res.msg)
    })
  }

  const showBilling = () => {
    let brandId = 0;
    let flag = false;
    selectedRowsState.map(item => {
      if (item.brand_id != brandId && brandId !== 0) {
        flag = true;
        return;
      } else {
        brandId = item.brand_id;
      }
    })
    if (flag) {
      error('品牌不一致不可提交')
      return
    }
    setShowBillimg(true);
  }

  const showDetail = (entity) => {
    setCurrentItem(entity)
    /*if (entity.quo_file_ids) {
      setShowSpecialQuotation(true)
      return
    }*/
    setShowQuoDetail(true)
  }

  const history = (entity) => {
    setCurrentItem(entity)
    setShowHistory(true)
  }

  const handleOk = () => {
    const params = {
      quo_ids: currentItem?.id,
      user_type: 'brand_admin',
      status: 'submit_brand'
    }
    approveQuo(params).then(res => {
      if (res.success) {
        setCurrentItem(undefined)
        setShowDialog(false)
        actionRef.current?.reload()
        success('提交成功')
        return
      }
      error(res.message)
    })
  }

  const columns: ProColumns<API.QuotationParams>[] = [
    {
      title: (
        <FormattedMessage
          id="quotation.field.id"
          defaultMessage="序号"
        />
      ),
      dataIndex: 'id',
      search: false,
      align: 'center',
    },
    {
      title: (
        <FormattedMessage
          id="quotation.field.quo_no"
          defaultMessage="编号"
        />
      ),
      dataIndex: 'quo_no',
      align: 'center',
      render: (dom, entity) => {
        return (
          <div>
            <a onClick={() => showDetail(entity)}>
              {dom}
            </a>
            <div>{entity.appendix_no}</div>
            <PlusCircleOutlined style={{fontSize: 16, cursor: 'pointer'}} onClick={() => addCarList(entity)}/>
          </div>
        )
      },
      initialValue: quo_no
    },
    {
      title: (
        <FormattedMessage
          id="quotation.field.history"
          defaultMessage="历史报价"
        />
      ),
      dataIndex: '',
      align: 'center',
      search: false,
      render: (dom, entity) => {
        return (
          <>
            {
              entity.quo_back_id &&
              <Button type="primary" onClick={() => history(entity)}>查看</Button>
            }
          </>
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="quotation.field.order_no"
          defaultMessage="订单编号"
        />
      ),
      dataIndex: 'supplier_order_no',
      align: 'center',
      render: (dom, row) => {
        return (
          <a
            href={`/order/orderList?code=${dom}`}
            target="_blank"
          >
            {dom}
          </a>
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="quotation.field.status_value"
          defaultMessage="状态"
        />
      ),
      dataIndex: 'status_value',
      align: 'center',
      search: false,
      render: (dom, entity) => {
        return (
          <Space direction="vertical">
            {
              entity.class_type === 'mqi' &&
              <Tag style={{backgroundColor: 'red', color: '#fff'}}>MQI</Tag>
            }
            <Tag color={entity.status_color}>{dom}</Tag>
            <Tag color={entity.is_merge ? 'green' : 'red'}>{entity.is_merge ? '已汇总' : '未汇总'}</Tag>
          </Space>

        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="quotation.field.brand"
          defaultMessage="品牌"
        />
      ),
      dataIndex: 'brand_en',
      align: 'center',
      valueType: 'select',
      fieldProps: {
        mode: 'multiple', // 启用多选模式
        options: brandList,
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
      title: (
        <FormattedMessage
          id="quotation.field.city"
          defaultMessage="城市"
        />
      ),
      hideInTable: true, // 在表格中隐藏
      dataIndex: 'city_cn',
      valueType: 'select',
      valueEnum: searchData.cities.reduce((acc, item) => {
        acc[`${item.id}`] = {text: item.city_cn};
        return acc;
      }, {}),
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
    },
    {
      title: (
        <FormattedMessage
          id="reimbursement.field.market"
          defaultMessage="商场"
        />
      ),
      hideInTable: true, // 在表格中隐藏
      dataIndex: 'market_cn',
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
      title: (
        <FormattedMessage
          id="quotation.field.store"
          defaultMessage="店铺"
        />
      ),
      dataIndex: 'store_cn',
      align: 'center',
      valueType: 'select',
      valueEnum: searchData.shops?.reduce((acc, item) => {
        acc[`${item.id}`] = {text: item.name_cn};
        return acc;
      }, {}),
      fieldProps: {
        showSearch: true
      },
    },
    {
      title: (
        <FormattedMessage
          id="report.field.isHasSign"
          defaultMessage="是否有签单"
        />
      ),
      hideInTable: true, // 在表格中隐藏
      dataIndex: "sign_ids",
      valueType: 'select',
      valueEnum: searchData.isHasSign?.reduce((acc, item) => {
        acc[`${item.type}`] = {text: item.name};
        return acc;
      }, {}),
      fieldProps: {
        showSearch: true
      },
    },
    {
      title: (
        <FormattedMessage
          id="quotation.field.ma_type_cn"
          defaultMessage="维修类目"
        />
      ),
      dataIndex: 'ma_type_cn',
      align: 'center',
      valueType: 'select',
      valueEnum: searchData.maCates?.reduce((acc, item) => {
        acc[`${item.value}`] = {text: item.label};
        return acc;
      }, {}),
      fieldProps: {
        showSearch: true
      },
    },
    {
      title: (
        <FormattedMessage
          id="quotation.field.ma_type"
          defaultMessage="报修类型"
        />
      ),
      hideInTable: true, // 在表格中隐藏
      dataIndex: 'ma_type',
      align: 'center',
      valueType: 'select',
      valueEnum: searchData.maType?.reduce((acc, item) => {
        acc[`${item.id}`] = {text: item.cn_name === '' ? item.en_name : item.cn_name};
        return acc;
      }, {}),
      fieldProps: {
        showSearch: true
      },
    },
    {
      title: (
        <FormattedMessage
          id="quotation.field.quotation_type"
          defaultMessage="报价分类"
        />
      ),
      hideInTable: true, // 在表格中隐藏
      dataIndex: 'quotation_type',
      align: 'center',
      valueType: 'select',
      valueEnum: searchData.quotationType?.reduce((acc, item) => {
        acc[`${item.type}`] = {text: item.name};
        return acc;
      }, {}),
      fieldProps: {
        showSearch: true
      },
    },
    {
      title: (
        <FormattedMessage
          id="quotation.field.second_quotation_type"
          defaultMessage="二级分类"
        />
      ),
      hideInTable: true, // 在表格中隐藏
      dataIndex: 'second_quotation_type',
      align: 'center',
      valueType: 'select',
      valueEnum: searchData.secondQuotationType?.reduce((acc, item) => {
        acc[`${item.id}`] = {text: item.class_type_plus !== '' ? item.class_type_plus : item.id};
        return acc;
      }, {}),
      fieldProps: {
        showSearch: true
      },
    },
    {
      title: (
        <FormattedMessage
          id="quotation.field.work_desc"
          defaultMessage="工作内容"
        />
      ),
      dataIndex: 'work_desc',
      align: 'center',
      search: false,
    },
    {
      title: (
        <FormattedMessage
          id="quotation.field.supplier_username"
          defaultMessage="申请人"
        />
      ),
      dataIndex: 'supplier_username',
      align: 'center',
      search: false,
    },
    {
      title: (
        <FormattedMessage
          id="quotation.field.create_at"
          defaultMessage="创建报价"
        />
      ),
      dataIndex: 'create_at',
      align: 'center',
      valueType: 'dateRange',
      render: (dom, entity) => {
        return (
          <div>{entity.create_at}</div>
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="quotation.field.completion_at"
          defaultMessage="申报日期"
        />
      ),
      dataIndex: 'completion_at',
      align: 'center',
      valueType: 'dateRange',
      render: (dom, entity) => {
        return (
          <div>{entity.completion_at}</div>
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="quotation.field.cost"
          defaultMessage="成本"
        />
      ),
      dataIndex: 'cost',
      align: 'center',
      search: false,
    },
    {
      title: (
        <FormattedMessage
          id="quotation.field.ex_total_price"
          defaultMessage="报价"
        />
      ),
      dataIndex: 'ex_total_price',
      align: 'center',
      search: false,
    },
    {
      title: (
        <FormattedMessage
          id="quotation.field.profit_price"
          defaultMessage="利润"
        />
      ),
      dataIndex: 'profit_price',
      align: 'center',
      search: false,
    },
    {
      title: (
        <FormattedMessage
          id="quotation.field.profit_rate"
          defaultMessage="利润率"
        />
      ),
      dataIndex: 'profit_rate',
      align: 'center',
      search: false,
    },
    {
      title: (
        <FormattedMessage
          id="quotation.field.status"
          defaultMessage="报价单状态"
        />
      ),
      hideInTable: true, // 在表格中隐藏
      dataIndex: 'status',
      align: 'center',
      valueType: 'select',
      valueEnum: searchData.status?.reduce((acc, item) => {
        acc[`${item.type}`] = {text: item.name};
        return acc;
      }, {}),
      fieldProps: {
        showSearch: true
      },
    },
    {
      title: (
        <FormattedMessage
          id="quotation.field.color"
          defaultMessage="颜色标记"
        />
      ),
      hideInTable: true, // 在表格中隐藏
      dataIndex: 'color',
      align: 'center',
      valueType: 'select',
      fieldProps: {
        mode: 'multiple', // 启用多选模式
        options: searchData.color,
        showSearch: true,
      }
    },
    {
      title: (
        <FormattedMessage
          id="quotation.field.operate"
          defaultMessage="操作"
        />
      ),
      dataIndex: '',
      align: 'center',
      search: false,
      render: (dom, entity) => {
        return (
          <>
            <Space>
              {
                entity.status_color === 'gray' &&
                <Button type="primary" onClick={() => openDialog(entity)}>提交客户</Button>
              }
              <Button type="primary" onClick={() => showMarkColor(entity)}>标记</Button>
              <Button type="primary" onClick={() => {
                setShowTagDialog(true)
                setTagEntity(entity)
              }}>标签</Button>
            </Space>

          </>
        )
      }
    },
  ]

  const rowClassName = (record) => {
    if (record.color_mark) {
      return 'record-' + record.color_mark; // 需要高亮显示的行使用  类名
    }
    return '';
  };

  const onCloseSummary = () => {
    setShowSummary(false)
  }

  const onCloseBillimg = () => {
    setShowBillimg(false)
  }

  const onCloseMarkerColor = () => {
    setCurrentItem(undefined)
    setShowMarkerColor(false)
  }

  const showMarkColor = (entity) => {
    setCurrentItem(entity)
    setShowMarkerColor(true)
  }

  const onCloseApproval = () => {
    setShowApproval(false)
  }

  const onCloseDetail = () => {
    setCurrentItem(undefined)
    setShowQuoDetail(false)
  }

  const onCloseHistory = () => {
    setCurrentItem(undefined)
    setShowHistory(false)
  }

  const onCloseCar = () => {
    setShowCar(false)
  }

  const handleCarList = (list) => {
    setCarList(list)
  }

  const openDialog = (entity) => {
    setCurrentItem(entity)
    setShowDialog(true)
  }

  const handleInvoice = async (state: boolean) => {
    console.log("selectedRowsState", selectedRowsState)
    if (state && !isEmpty(selectedRowsState)) {
      const hide = message.loading('loading...');
      try {
        const params = {
          // trd_id: 0,
          // trd_sub_id: 0,
          quo_id: selectedRowsState[0].id,
          trd_type: "from_quo",
        }

        const result = await getFinanceCollInfoBatch(params);
        if (!result.success) {
          message.error(result.message);
          return;
        }

        const amount = _.sumBy(selectedRowsState, (obj) => {
          const value = obj.total_price;
          if (typeof value === 'number') {
            return value;
          } else if (typeof value === 'string') {
            const parsed = parseFloat(value);
            return isNaN(parsed) ? 0 : parsed;
          } else {
            return 0;
          }
        }).toFixed(2);

        const brandIds = selectedRowsState.filter(item => item.brand_id === selectedRowsState[0]?.brand_id)
        if (brandIds.length !== selectedRowsState.length) {
          message.error('不同品牌之间不能合并开票');
          return
        }

        const dataSource = {
          amount: amount,
          brandId: selectedRowsState[0]?.brand_id,
          records: isEmpty(result.data) ? [] : result.data
        }

        setInvoiceDataSource(dataSource);
      } catch (error) {
        message.error((error as Error).message);
      } finally {
        hide();
      }
    } else {
      onClearSelected();
    }

    setInvoiceOpen(state);
  }

  const handleInvoiceSubmit = async (values) => {

    // quo_id_list
    const hide = message.loading('loading...');
    const quoIds = map(selectedRowsState, item => item.id);
    let params = {
      quo_id_list: quoIds,
      tax_rate: selectedRowsState[0]?.tax_rate ?? '0',
      type: "from_quo",
      status: values.submitType,
      remark: values?.remark ?? '',
      department: "设施维护部",
      detail_list: [{
        address: values?.address ?? '',
        amount: values?.money ?? '',
        bank_name: values?.bank ?? '',
        bank_no: values?.bank_no ?? '',
        coll_type: values?.type ?? '',
        company_id: values?.companyInfo ?? 0,
        company_name: values?.company_name ?? '',
        mobile: values?.tel ?? '',
        seller_company_id: values?.company ?? 0,
        tax_no: values?.code ?? '',
        file_ids: values?.detail ?? '',
      }]
    }

    if (values?.id && values.id > 0) {
      params.id = values.id;
    }

    try {
      const result = await createOrUpdateFinanceCollAlone(params);
      if (!result.success) {
        message.error(result.message);
        return;
      }

      message.success('Success');
      await handleInvoice(false)

    } catch (error) {
      message.error((error as Error).message)
    } finally {
      hide();
    }
  }


  useEffect(() => {
    setColumnsStateMap(getStateMap(pathname))
    return () => {
      if (timerId) clearInterval(timerId.current)
    }
  }, [])

  return (
    <>
      <ProTable<API.QuotationParams, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'quotation.table.title',
          defaultMessage: 'table list',
        })}
        actionRef={actionRef}
        scroll={{x: 'max-content'}}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        // rowClassName={(record, index) => {
        //   `${style.customRowHover} ${style.customRowSelected}`
        // }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            loading={loadingDownload[1]}
            disabled={selectedRowsState.length < 1}
            onClick={() => {
              batchDownloads(1);
            }}
          >
            <FormattedMessage id="pages.searchTable.batchDownloads" defaultMessage="BatchDownloads"/>
          </Button>,

          <Button
            type="primary"
            key="primary"
            loading={loadingShare[1]}
            disabled={selectedRowsState.length < 1}
            onClick={() => {
              share(1);
            }}
          >
            <FormattedMessage id="pages.searchTable.batchShare" defaultMessage="BatchShare"/>
          </Button>,

          <Button
            type="primary"
            key="primary"
            disabled={selectedRowsState.length < 1}
            onClick={() => setShowMarkerColor(true)}
          >
            <FormattedMessage id="pages.searchTable.batchMark" defaultMessage="BatchMark"/>
          </Button>,

          <Button
            type="primary"
            key="primary"
            disabled={selectedRowsState.length < 1}
            onClick={() => {
              setShowApproval(true);
            }}
          >
            <FormattedMessage id="pages.searchTable.batchApproval" defaultMessage="BatchApproval"/>
          </Button>,

          <Button
            type="primary"
            key="primary"
            loading={loading[1]}
            onClick={() => {
              exportList('', 1)
            }}
          >
            <FormattedMessage id="pages.searchTable.export" defaultMessage="Export"/>
          </Button>,

          <Button
            type="primary"
            key="primary"
            loading={loadings[1]}
            onClick={() => {
              exportList('gucci_export_excel', 1)
            }}
          >
            <FormattedMessage id="pages.searchTable.exportList" defaultMessage="ExportList"/>
          </Button>,

          <Button
            type="primary"
            key="primary"
            disabled={selectedRowsState.length < 1}
            onClick={() => {
              setShowSummary(true);
            }}
          >
            <FormattedMessage id="pages.searchTable.summary" defaultMessage="Summary"/>
          </Button>,

          // todo 。。。。。。
          <Button
            type="primary"
            key="primary"
            disabled={selectedRowsState.length < 1}
            onClick={() => handleInvoice(true)}
          >
            <FormattedMessage id="pages.searchTable.billing" defaultMessage="Billing"/>
          </Button>,

          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setShowCreateSpecialOffers(true);
            }}
          >
            <FormattedMessage id="pages.searchTable.createSpecialOffers" defaultMessage="CreateSpecialOffers"/>
          </Button>,

          <Badge key="item-list-badge" count={carList.length}>
            <ShoppingCartOutlined style={{marginRight: 5, fontSize: 30, cursor: 'pointer'}}
                                  onClick={() => setShowCar(true)}/>
          </Badge>
        ]}
        request={onListData}
        columns={columns}
        rowClassName={rowClassName}
        rowSelection={{
          onChange: onRowSelected
        }}
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

      <BaseContainer
        type={ModalType.Drawer}
        width="60%"
        open={invoiceOpen}
        destroyOnClose={true}
        maskClosable={false}
        title="开票收款"
        onClose={() => handleInvoice(false)}
      >
        {!isEmpty(invoiceDataSource) &&
          <InvoiceRequestForm amount={invoiceDataSource.amount} brandId={invoiceDataSource.brandId}
                              handleFinish={handleInvoiceSubmit} records={invoiceDataSource.records} type="quo"
                              handleReloadRecords={() => {
                              }} currentRecord={[]}/>}
      </BaseContainer>

      <Drawer
        width={600}
        title="创建特殊报价"
        open={showCreateSpecialOffers}
        onClose={onCloseCreateSpecialOffers}
        destroyOnClose={true}
      >
        <CreateSpecialOffers
          brandList={brandList}
          searchData={searchData}
          onSearchSelectedChild={onSearchSelectedChild}
          success={success}
          error={error}
          actionRef={actionRef}
          onCloseCreateSpecialOffers={onCloseCreateSpecialOffers}
        />
      </Drawer>

      <Modal
        open={showSummary}
        onCancel={onCloseSummary}
        footer={null}
        destroyOnClose={true}
        title="汇总报价"
      >
        <Summary
          onCloseSummary={onCloseSummary}
          selectedRowsState={selectedRowsState}
          success={success}
          error={error}
        />
      </Modal>

      <Drawer
        width={"50%"}
        title="开票收款"
        open={showBillimg}
        onClose={onCloseBillimg}
        destroyOnClose={true}
      >
        <Billing
          onCloseBillimg={onCloseBillimg}
          selectedRowsState={selectedRowsState}
          success={success}
          error={error}
        />
      </Drawer>

      <Modal
        open={showMarkerColor}
        onCancel={onCloseMarkerColor}
        footer={null}
        destroyOnClose={true}
        title="颜色标记"
      >
        <MarkerColor
          onCloseMarkerColor={onCloseMarkerColor}
          currentItem={currentItem}
          selectedRowsState={selectedRowsState}
          success={success}
          error={error}
          actionRef={actionRef}
        />
      </Modal>

      <Modal
        open={showApproval}
        onCancel={onCloseApproval}
        footer={null}
        destroyOnClose={true}
        title="批量审批"
      >
        <Approval
          onCloseApproval={onCloseApproval}
          selectedRowsState={selectedRowsState}
          success={success}
          error={error}
        />
      </Modal>

      <Drawer
        width={'90%'}
        title="报价单"
        open={showQuoDetail}
        onClose={onCloseDetail}
        maskClosable={false}
        destroyOnClose={true}
      >
        <QuoDetail
          brandList={brandList}
          currentItem={currentItem}
          onCloseDetail={onCloseDetail}
          searchData={searchData}
          success={success}
          error={error}
          actionRef={actionRef}
          onSearchSelectedChild={onSearchSelectedChild}
          onCloseCreateSpecialOffers={onCloseCreateSpecialOffers}
        />
      </Drawer>

      <Drawer
        width={600}
        title="特殊报价单"
        open={showSpecialQuotation}
        onClose={onCloseCreateSpecialOffers}
        destroyOnClose={true}
      >
        <CreateSpecialOffers
          brandList={brandList}
          searchData={searchData}
          onSearchSelectedChild={onSearchSelectedChild}
          success={success}
          error={error}
          actionRef={actionRef}
          currentItem={currentItem}
          onCloseCreateSpecialOffers={onCloseCreateSpecialOffers}
        />
      </Drawer>

      <Modal
        open={showHistory}
        onCancel={onCloseHistory}
        footer={null}
        destroyOnClose={true}
        title="历史报价"
      >
        <History
          onCloseHistory={onCloseHistory}
          currentItem={currentItem}
        />
      </Modal>

      <Modal
        width={800}
        open={showCar}
        onCancel={onCloseCar}
        footer={null}
        destroyOnClose={true}
        title="批量操作"
      >
        <CarList
          carList={carList}
          handleCarList={handleCarList}
        />
      </Modal>

      <Modal
        open={showDialog}
        onOk={handleOk}
        onCancel={() => setShowDialog(false)}
        destroyOnClose
      >
        <WarningTwoTone twoToneColor="red"/>
        <p style={{height: '50px', lineHeight: '50px'}}>
          确定要提交给客户吗？
        </p>
      </Modal>

      <Modal
        open={showTagDialog}
        onCancel={() => {
          setShowTagDialog(false)
          setTagEntity(null);
        }}
        destroyOnClose
        footer={false}
        title="打标签"
      >
        <Tags entity={tagEntity} handleClose={() => {
          setShowTagDialog(false)
          setTagEntity(null);
        }} success={success}/>
      </Modal>
    </>
  )
}

export default ItemList
