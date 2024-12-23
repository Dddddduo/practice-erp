import React, { RefObject, useEffect, useState } from "react"
import { ParamsType, ProTable, ActionType, ProColumns } from "@ant-design/pro-components"
import {FormattedMessage, useIntl, useLocation} from "@@/exports";
import {Button, Drawer, message, Modal, Space} from "antd";
import {
  exportMergeQuo,
  getFinanceCollInfoBatch,
  gucciFree20,
  gucciMergeQuo
} from "@/services/ant-design-pro/aggregateQuotes";
import { getBrandList } from "@/services/ant-design-pro/report";
import Summary from "./Summary";
import Billing from "./Billing";
import Clearing from "./Clearing";
import {getStateMap, setStateMap} from "@/utils/utils";
import BaseContainer, {ModalType} from "@/components/Container";
import {InvoiceRequestForm} from "@/components/Finance/InvoiceRequestForm";
import {isEmpty, map} from "lodash";
import {createOrUpdateFinanceCollAlone} from "@/services/ant-design-pro/quotation";


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
  actionRef: RefObject<ActionType>;
  onListData: HandleListDataFunc
  searchData: {
    brands: any
    rollup_type: any
  }
  success: (text: string) => void
  error: (text: string) => void
}

const ItemList: React.FC<ItemListProps> = ({
  actionRef,
  onListData,
  searchData,
  success,
  error
}) => {

  const intl = useIntl()

  const [showSummary, setShowSummary] = useState(false)
  const [title, setTitle] = useState()
  const [showBilling, setShowBilling] = useState(false)
  const [current, setCurrent] = useState()
  const [showClearing, setShowClearing] = useState(false)
  const [showGUCCIMC, setShowGUCCIMC] = useState(false)
  const [showFendiMC, setShowFendiMC] = useState(false)
  const [showMonclerMC, setShowMonclerMC] = useState(false)
  const [showDiorMC, setShowDiorMC] = useState(false)
  const [columnsStateMap, setColumnsStateMap] = useState({});
  const location = useLocation();
  const currentPath = location.pathname;
  const pathname = currentPath.split('/')[currentPath.split('/').length - 1]
  // 根据参数名称获取具体的路由参数
  const queryParams = new URLSearchParams(location.search);
  const merge_quo_no = queryParams.get('merge_quo_no');

  const [invoiceOpen, setInvoiceOpen] = useState<boolean>(false);
  const [invoiceDataSource, setInvoiceDataSource] = useState<{[key: string]: any}>({});





  const handleInvoiceOpen = async (state: boolean, entity?: {[key: string]: any}) => {
    if (!state) {
      setCurrent(undefined);
      setInvoiceOpen(state);
      return
    }

    const hide = message.loading('loading...');
    try {
      const params = {
        trd_id: entity?.quo_merge_id,
        trd_sub_id: 0,
        trd_type: "from_quo",
      }

      const result = await getFinanceCollInfoBatch(params);
      if (!result.success) {
        message.error(result.message);
        return;
      }

      console.log("entity?.total_price_sum ?? 0", entity?.total_price_sum ?? 0)
      const dataSource = {
        brand_id: entity?.brand_id ?? 0,
        amount: entity?.total_price_sum ?? 0,
        // companyInfo: result.data,
        records: isEmpty(result.data) ? [] : result.data
      }

      setCurrent(entity);
      console.log('dataSource--dataSource',dataSource,entity);
      setInvoiceDataSource(dataSource);
    } catch (error) {
      message.error((error as Error).message);
    } finally {
      hide();
    }
    setInvoiceOpen(state);

  }

  const columns: ProColumns<API.AggregateQuotesParams>[] = [
    {
      title: (
        <FormattedMessage
          id="aggregateQuotes.field.id"
          defaultMessage="序号"
        />
      ),
      dataIndex: 'quo_merge_id',
      align: 'center',
      search: false
    },
    {
      title: (
        <FormattedMessage
          id="aggregateQuotes.field.no"
          defaultMessage="编号"
        />
      ),
      dataIndex: 'quo_merge_no',
      align: 'center',
      render: (dom, entity) => {
        return (
          <a href={`/PDF/quotation-summary-pdf?merge_quo_id=${entity.quo_merge_id}&brand_id=${entity.brand_id}&type=${entity.type}`} target="_blank">{dom}</a>
        )
      },
      initialValue: merge_quo_no
    },
    {
      title: (
        <FormattedMessage
          id="aggregateQuotes.field.title"
          defaultMessage="标题"
        />
      ),
      dataIndex: 're',
      align: 'center',
      search: false,
      render: (dom, entity) => {
        return (
          <div>
            {
              dom === '-' ? '' : dom
            }
          </div>
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="aggregateQuotes.field.brand"
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
        showSearch: true
      }
    },
    {
      title: (
        <FormattedMessage
          id="aggregateQuotes.field.type"
          defaultMessage="类型"
        />
      ),
      dataIndex: 'type',
      align: 'center',
      search: false
    },
    {
      title: (
        <FormattedMessage
          id="aggregateQuotes.field.create_at"
          defaultMessage="申请日期"
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
          id="aggregateQuotes.field.rollup_type"
          defaultMessage="汇总类型"
        />
      ),
      dataIndex: 'rollup_type',
      align: 'center',
      hideInTable: true, // 在表格中隐藏
      valueType: 'select',
      valueEnum: searchData.rollup_type?.reduce((acc, item) => {
        acc[`${item.type}`] = { text: item.name };
        return acc;
      }, {}),
      fieldProps: {
        showSearch: true
      }
    },
    {
      title: (
        <FormattedMessage
          id="aggregateQuotes.field.cost"
          defaultMessage="成本"
        />
      ),
      dataIndex: 'create_at',
      align: 'center',
      search: false,
      render: (dom, entity) => {
        return (
          <div>{(Number(entity.total_price_sum) - Number(entity.total_profit_price)).toFixed(2)}</div>
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="aggregateQuotes.field.total_price_excl_tax"
          defaultMessage="报价(不含税)"
        />
      ),
      dataIndex: 'total_price_excl_tax',
      align: 'center',
      search: false
    },
    {
      title: (
        <FormattedMessage
          id="aggregateQuotes.field.total_tax_price"
          defaultMessage="税金"
        />
      ),
      dataIndex: 'total_tax_price',
      align: 'center',
      search: false
    },
    {
      title: (
        <FormattedMessage
          id="aggregateQuotes.field.tax_rate"
          defaultMessage="税率"
        />
      ),
      dataIndex: 'tax_rate',
      align: 'center',
      search: false,
      render: (dom) => {
        return (
          <div>
            {
              Number(dom)?.toFixed(0)
            }
          </div>
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="aggregateQuotes.field.total_profit_price"
          defaultMessage="利润"
        />
      ),
      dataIndex: 'total_profit_price',
      align: 'center',
      search: false
    },
    {
      title: (
        <FormattedMessage
          id="aggregateQuotes.field.total_profit_rate"
          defaultMessage="利润率(%)"
        />
      ),
      dataIndex: 'total_profit_rate',
      align: 'center',
      search: false
    },
    {
      title: (
        <FormattedMessage
          id="aggregateQuotes.field.recording"
          defaultMessage="开票收款记录"
        />
      ),
      dataIndex: 'recording',
      align: 'center',
      search: false,
      render: (dom, entity) => {
        return (
          <Button type="primary" onClick={() => openClearing(entity)}>查看</Button>
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="aggregateQuotes.field.quo_merge_username_cn"
          defaultMessage="操作人"
        />
      ),
      dataIndex: 'quo_merge_username_cn',
      align: 'center',
      search: false,
    },
    {
      title: (
        <FormattedMessage
          id="aggregateQuotes.field.operate"
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
              <Button type="primary" onClick={() => exportCurrent(entity)}>导出</Button>
              <Button type="primary" onClick={async () => {
                await handleInvoiceOpen(true, entity)
              }}>开票收款</Button>
            </Space>
            <div>
              {
                entity.brand_id === 1 &&
                entity.type === 'FO非固定' &&
                (typeof entity.gucci_free_20 === 'undefined' || entity.gucci_free_20 != 1) &&
                <Button type="primary" danger onClick={() => getFreeWorker(entity)}>慎点! 刷新20个免费人工</Button>
              }
            </div>
          </>
        )
      }
    },
  ]

  const openSummaryModal = (title) => {
    setShowSummary(true)
    setTitle(title)
  }

  const handleCloseSummary = () => {
    setShowSummary(false)
    setTitle('')
  }

  // 导出
  const exportCurrent = (entity) => {
    exportMergeQuo({ id: entity.quo_merge_id }).then(res => {
      console.log(res);

    }).catch(e => {
      error('导出失败')
    })
  }

  const billing = (entity) => {
    setCurrent(entity)
    setShowBilling(true)
  }

  const handleCloseBilling = () => {
    setCurrent(undefined)
    setShowBilling(false)
  }

  const openClearing = (entity) => {
    setCurrent(entity)
    setShowClearing(true)
  }

  const handleCloseClearing = () => {
    setCurrent(undefined)
    setShowClearing(false)
  }

  const getFreeWorker = (entity) => {
    console.log(entity);

    gucciFree20({ quo_merge_id: entity.quo_merge_id }).then((res) => {
      if (res.success) {
        gucciMergeQuo({ gucci_free_20: entity.gucci_free_20, quo_ids: '' }).then(res => {
          if (res.success) {
            actionRef.current.reload()
          }
        })
      }
    })
  }


  useEffect(() => {
    setColumnsStateMap(getStateMap(pathname))
    getBrandList().then(res => {
      if (res.data) {
        for (const item in res.data) {
          if (res.data[item].id == 1) {
            setShowGUCCIMC(true)
          }
          if (res.data[item].id == 3) {
            setShowFendiMC(true)
          }
          if (res.data[item].id == 9) {
            setShowMonclerMC(true)
          }
          if (res.data[item].id == 2) {
            setShowDiorMC(true)
          }
        }
      }
    })
  }, [])

  const handleInvoiceSubmit = async (values) => {
    console.log("current", values)
    // quo_id_list
    const hide = message.loading('loading...');
    // const quoIds = map(selectedRowsState, item => item.id);
    let params = {
      quo_merge_id: current?.quo_merge_id ?? 0,
      tax_rate: current?.tax_rate ?? '0',
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

    console.log("pppp", params)
    try {
      const result = await createOrUpdateFinanceCollAlone(params);
      if (!result.success) {
        message.error(result.message);
        return;
      }

      message.success('Success');
      await handleInvoiceOpen(false);

    } catch (error) {
      message.error((error as Error).message)
    } finally {
      hide();
    }
  }

  return (
    <>
      <ProTable<API.AggregateQuotesParams, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'aggregateQuotes.table.title',
          defaultMessage: 'table list',
        })}
        actionRef={actionRef}
        //  y: 200
        scroll={{ x: 'max-content' }}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        request={onListData}
        columns={columns}
        columnsState={{
          value: columnsStateMap,
          onChange: (newState) => {
            setColumnsStateMap(newState);
            setStateMap(pathname, newState);
          },
        }}
        toolBarRender={() => [
          <>
            {showGUCCIMC && (
              <Button
                type="primary"
                key="primary"
                onClick={() => {
                  openSummaryModal('GUCCI MC汇总');
                }}
              >
                <FormattedMessage id="pages.searchTable.GUCCI" defaultMessage="GUCCI MC汇总" />
              </Button>
            )}
            {showFendiMC && (
              <Button
                type="primary"
                key="primary"
                onClick={() => {
                  openSummaryModal('FENDI MC汇总');
                }}
              >
                <FormattedMessage id="pages.searchTable.FENDI" defaultMessage="FENDI MC汇总" />
              </Button>
            )}
            {showMonclerMC && (
              <Button
                type="primary"
                key="primary"
                onClick={() => {
                  openSummaryModal('MONCLER MC汇总');
                }}
              >
                <FormattedMessage id="pages.searchTable.MONCLER" defaultMessage="MONCLER MC汇总" />
              </Button>
            )}
            {showDiorMC && (
              <Button
                type="primary"
                key="primary"
                onClick={() => {
                  openSummaryModal('Dior MC汇总');
                }}
              >
                <FormattedMessage id="pages.searchTable.Dior" defaultMessage="Dior MC汇总" />
              </Button>
            )}
          </>,
        ]}
      />

      <Modal
        open={showSummary}
        onCancel={handleCloseSummary}
        destroyOnClose={true}
        title={title}
        footer={null}
      >
        <Summary
          title={title}
          handleCloseSummary={handleCloseSummary}
          success={success}
          error={error}
        />
      </Modal>

      {/*handleClosePayment*/}
      <BaseContainer
        open={invoiceOpen}
        type={ModalType.Drawer}
        onClose={() => handleInvoiceOpen(false)}
        width="60%"
        maskClosable={false}
        destroyOnClose={true}
        title="开票收款"
      >
        {!isEmpty(invoiceDataSource) && (
          <InvoiceRequestForm
            amount={invoiceDataSource?.amount ?? 0}
            brandId={invoiceDataSource?.brand_id ?? 0}
            // companyInfo={invoiceDataSource?.companyInfo}
            handleFinish={handleInvoiceSubmit}
            type="quo_merge"
            records={invoiceDataSource.records}
            handleReloadRecords={() => {}}
            currentRecord={[]}
          />
        )}
      </BaseContainer>
      {/*<Drawer*/}
      {/*  open={showBilling}*/}
      {/*  onClose={handleCloseBilling}*/}
      {/*  title="开票收款"*/}
      {/*  destroyOnClose={true}*/}
      {/*  width={600}*/}
      {/*>*/}
      {/*<Billing*/}
      {/*  handleCloseBilling={handleCloseBilling}*/}
      {/*  current={current}*/}
      {/*  success={success}*/}
      {/*  error={error}*/}
      {/*/>*/}
      {/*</Drawer>*/}

      <Drawer
        open={showClearing}
        onClose={handleCloseClearing}
        title="请款记录"
        destroyOnClose={true}
        width={'90%'}
      >
        <Clearing
          handleCloseClearing={handleCloseClearing}
          current={current}
          success={success}
          error={error}
        />
      </Drawer>
    </>
  );
}

export default ItemList
