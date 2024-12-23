import React, { RefObject, useEffect, useState } from 'react';
import type { ActionType, ParamsType } from '@ant-design/pro-components';
import { ProColumns, ProTable } from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import {Button, Divider, Drawer, Input, message, Popconfirm, Space, Tag} from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import CreateOrUpdate from './CreateOrUpdate';
import Detail from './Detail';
import Enter from './Enter';
import { bcMath, getStateMap, setStateMap, showButtonByType } from '@/utils/utils';
import {dropRight, isEmpty} from 'lodash';
import SubmitButton from '@/components/Buttons/SubmitButton';
import { invoiceCollectionByBatch } from '@/services/ant-design-pro/invoiceCollection';
import { useLocation } from '@@/exports';
import { deleteInput } from '@/services/ant-design-pro/financialReimbursement';
import './index.scss';
import {getCustomerInvoiceInfo} from "@/services/ant-design-pro/maintenanceDepartment";

const types = [
  {val: 'alone', label: '单独请款'},
  {val: 'pqi_coll', label: 'PQI请款'},
  // { val: 'pqi_cost', label: 'PQI成本' },
  {val: 'from_quo', label: '报价单'},
]

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

type HandleRowSelectionFunc = (keys: any, selectedRows: any[]) => void; // 根据实际情况替换 any

const department = [
  {
    value: "fm",
    label: '维保',
  },
  {
    value: "project",
    label: '项目',
  },
]

const coll_yes_or_no = [
  {
    value: 'Y',
    label: 'Y'
  },
  {
    value: 'N',
    label: 'N'
  },
]
const invoiceType = [
  {
    value: 'all',
    label: '汇总报价'
  },
  {
    value: 'common',
    label: '普通报价'
  },
  {
    value: 'pqi',
    label: 'pqi'
  },
]

type messrs = {
  value: string;
  label: string;
}[]

interface ItemListProps {
  onListData: HandleListDataFunc;
  actionRef: RefObject<ActionType>;
  success: (text: string) => void
  error: (text: string) => void
  onRowSelected: HandleRowSelectionFunc;
  selectedRowsState: any;
  total:any
}

const ItemList: React.FC<ItemListProps> = ({
                                             onListData,
                                             actionRef,
                                             success,
                                             error,
                                             onRowSelected,
                                             selectedRowsState,
                                             total
                                           }) => {

  const intl = useIntl()
  const [currentItem, setCurrentItem] = useState<any>({})
  const [showCreateOrUpdate, setShowCreateOrUpdate] = useState(false)
  const [showDetail, setShowDetail] = useState(false)
  const [showEnter, setShowEnter] = useState(false)
  const [title, setTitle] = useState('')
  const [ctrButtons, setCtrButtons] = useState({})
  const [columnsStateMap, setColumnsStateMap] = useState({});
  const location = useLocation();
  const currentPath = location.pathname;
  const pathname = currentPath.split('/')[currentPath.split('/').length - 1]
  const [ctrButtons2, setCtrButtons2] = useState<any[]>([])


  //客户列表
  const [messrs , setMessrs] = useState<messrs>([])

  const ctrButtonMappings = {
    invoicCollectionPassAndReject: (record, idx) => {
      return []
    }
  }

  const ctrButtonMappings2 = {
    invoicingCollectionTopBar:
      <Space>
        <Button
          type="primary"
          onClick={() => {
            setShowEnter(true)
            setTitle('开票录入')
          }}
          disabled={selectedRowsState.length !== 1}
        >
          <FormattedMessage id="pages.searchTable.invoicingEntry" defaultMessage="Invoicing Entry"/>
        </Button>

        <Button
          type="primary"
          onClick={() => {
            setShowEnter(true)
            setTitle('收款录入')
          }}
          disabled={selectedRowsState.length < 1}
        >
          <FormattedMessage id="pages.searchTable.receiptEntry" defaultMessage="Receipt Entry"/>
        </Button>
      </Space>

  }



  const toOrder = (item, isMerge?: boolean = false) => {
    if (item.type === 'from_quo') {
      if (isMerge) {
        window.open(`/order/AggregateQuotes?merge_quo_no=${item.trd_no}`, '_blank')
      } else {
        window.open(`/order/quotation?quo_no=${item.trd_no}`, '_blank')
      }
      // history.push(`/order/quotation?quo_no=${item.trd_no}`, '_blank')

    }
    if (item.type === 'pqi_coll') {
      // history.push(`/project/fullPQI?quo_no=${item.trd_no}`, '_blank')
      window.open(`/project/fullPQI?quo_no=${item.trd_no}`, '_blank')
    }
  }

  const handleFullClick = (quoNo) => {
    window.open(`/order/quotation?quo_no=${quoNo}`, '_blank')
  }
  //获取客户名称
  const handleGetCustomerInvoiceInfo = async () => {
    try {
      const res = await getCustomerInvoiceInfo()
      if(res.success) {
        console.log('get customer info success', res)
        const newMessrs = res.data.map((item:any) => {
          return {
            value: item.name,
            label: item.name
          }
        })
        setMessrs(newMessrs)
      }
    } catch (error) {
      console.log('get customer info error', error)
    }
  }
//计算成本
  const calculateTotalCost = (children_quos: any[] | undefined): string => {
    if (!children_quos || !Array.isArray(children_quos) || children_quos.length === 0) {
      return "0.00";
    }
    return children_quos.reduce((sum, item) => {
      const cost = item.cost || "0";
      return bcMath.add(sum, cost,2);
    }, "0");
  };


  const deleteInputRecord = async (id: any, type: any) => {
    const params = {
      id: id,
      type: type
    }

    try {
      const res = await deleteInput(params)
      if (res.success) {
        actionRef?.current?.reload()

        message.success('删除成功')
        return
      }
      message.error(res.message)
    } catch (error) {
      message.error((error as Error).message)
    }
  }

  const revokeInvoice = async (id: any) => {
    const res = await invoiceCollectionByBatch({list_ids: [id], type: 'reject'})

    if (!res.success) {
      error(res.message)
      return
    }

    actionRef.current?.reload()
    success('驳回成功')
  }

  const columns: ProColumns<API.MaintenanceDepartmentParams>[] = [
    {
      title: <FormattedMessage id="maintenanceDepartmentParams.field.id" defaultMessage="序号" />,
      dataIndex: 'id',
      align: 'center',
      search: false,
    },
    {
      title: (
        <FormattedMessage
          id="maintenanceDepartmentParams.field.company"
          defaultMessage="开票公司"
        />
      ),
      dataIndex: 'company',
      align: 'center',
      search: false,
      render: (dom, entity) => {
        return <div>{entity.detail_list[0].seller_company_cn}</div>;
      },
    },
    {
      title: (
        <FormattedMessage
          id="maintenanceDepartmentParams.field.create_at"
          defaultMessage="开票申请时间"
        />
      ),
      dataIndex: 'create_at',
      align: 'center',
      search: {
        title: '开票时间',
      },
      valueType: 'dateRange',
      render: (_, entity) => <>{entity.create_at}</>,
    },
    {
      title: (
        <FormattedMessage
          id="maintenanceDepartmentParams.field.create_name_cn"
          defaultMessage="开票申请人"
        />
      ),
      dataIndex: 'create_name_cn',
      align: 'center',
      search: false,
    },
    {
      title: '审批人',
      dataIndex: 'approver_name',
      search: false,
      align: 'center',
    },
    {
      title: (
        <FormattedMessage
          id="maintenanceDepartmentParams.field.messrs"
          defaultMessage="M E S S R S"
        />
      ),
      dataIndex: 'messrs',
      align: 'center',
      search: {
        title: '客户名称',
      },
      valueType: 'select',
      fieldProps: {
        showSearch: true,
      },
      valueEnum: messrs.reduce((acc, item) => {
        acc[`${item.value}`] = {text: item.label}
        return acc
      },{}),
      render: (_, entity:any) => <>{entity.messrs}</>,
    },
    {
      title: (
        <FormattedMessage id="maintenanceDepartmentParams.field.department" defaultMessage="部门" />
      ),
      dataIndex: 'department',
      align: 'center',
      valueType: 'select',
      valueEnum: department.reduce((acc, item) => {
        acc[`${item.value}`] = { text: item.label };
        return acc;
      }, {}),
      fieldProps: {
        showSearch: true,
      },
    },
    {
      title: (
        <FormattedMessage
          id="maintenanceDepartmentParams.field.description"
          defaultMessage="Description"
        />
      ),
      dataIndex: 'remark',
      align: 'center',
      search: false,
    },
    {
      title: (
        <FormattedMessage
          id="maintenanceDepartmentParams.field.amount_no"
          defaultMessage="Amount(不含税)"
        />
      ),
      dataIndex: 'excl_amount',
      align: 'center',
      search: {
        title: '不含税金额',
      },
      valueType: 'digitRange',
      render: (dom, entity:any) => {
        return <>{entity.detail_list[0]?.excl_amount ?? 0.00}</>;
      },
    },
    {
      title: (
        <FormattedMessage id="maintenanceDepartmentParams.field.tax_rate" defaultMessage="税率" />
      ),
      dataIndex: 'tax_rate',
      align: 'center',
      search: false,
      render: (dom, entity) => {
        return <>{dom + '%'}</>;
      },
    },
    {
      title: (
        <FormattedMessage id="maintenanceDepartmentParams.field.tax_amount" defaultMessage="税额" />
      ),
      dataIndex: 'tax_amount',
      align: 'center',
      search: false,
      render: (dom, entity:any) => {
        return <>{entity.detail_list[0]?.tax ?? 0.0}</>;
      },
    },
    {
      title: (
        <FormattedMessage
          id="maintenanceDepartmentParams.field.amount_yes"
          defaultMessage="Amount(含税)"
        />
      ),
      dataIndex: 'amount',
      align: 'center',
      search: false,
      render: (dom, entity) => {
        // console.log('entity.detail_list含税',entity.detail_list.map(item => item),(entity.detail_list.reduce((acc, item) => acc + Number(item.amount), 0)).toFixed(2))
        return <>{entity.detail_list[0]?.amount ?? 0}</>;
      },
    },
    {
      title: (
        <FormattedMessage id="maintenanceDepartmentParams.field.profit" defaultMessage="利润" />
      ),
      dataIndex: 'profit',
      align: 'center',
      search: false,
      render: (dom, entity:any) => {
        const totalCost = calculateTotalCost(entity.children_quos) ?? 0;
        const excl_amount = Number(entity.detail_list[0]?.excl_amount) ?? 0;
        const new_profit = () => {
          if (excl_amount === 0) {
            return;
          } else {
            return bcMath.sub(excl_amount, Number(totalCost),2);
          }
        };
        return <>{new_profit()}</>;
      },
    },
    {
      title: (
        <FormattedMessage
          id="maintenanceDepartmentParams.field.profit_rate"
          defaultMessage="利润率"
        />
      ),
      dataIndex: 'profit_rate',
      align: 'center',
      search: false,
      render: (dom, entity:any) => {
        // console.log('利润率--entity',entity)
        const totalCost = calculateTotalCost(entity.children_quos) ?? 0;
        const excl_amount = Number(entity.detail_list[0]?.excl_amount) ?? 0;
        const new_profit_rate = () => {
          if (excl_amount === 0) {
            return;
          } else {
            const profit = bcMath.sub(excl_amount, Number(totalCost));
            const profitRate = bcMath.div(Number(profit), excl_amount,6);
            return (Number(dropRight(profitRate, 2).join('')) * 100) + '%';
          }
        };
        return <>{new_profit_rate()}</>;
      },
    },
    {
      title: <FormattedMessage id="maintenanceDepartmentParams.field.cost" defaultMessage="成本" />,
      dataIndex: 'cost',
      align: 'center',
      search: false,
      render: (dom, entity:any) => {
        const totalCost = calculateTotalCost(entity.children_quos);
        return <>{totalCost}</>;
      },
    },
    {
      title: (
        <FormattedMessage id="maintenanceDepartmentParams.field.collection" defaultMessage="收款" />
      ),
      dataIndex: 'collection',
      align: 'center',
      // search: false,
      search: {
        title: '收款状态',
      },
      valueType: 'select',
      valueEnum: coll_yes_or_no.reduce((acc, item) => {
        acc[`${item.value}`] = { text: item.label };
        return acc;
      }, {}),
      render: (dom, entity) => {
        return <div>{entity.detail_list[0].coll_yes_or_no}</div>;
      },
    },
    {
      title: (
        <FormattedMessage
          id="maintenanceDepartmentParams.field.collection_time"
          defaultMessage="收款时间"
        />
      ),
      dataIndex: 'collection_time',
      align: 'center',
      search: false,
      render: (dom, entity) => {
        return <div>{entity.detail_list[0].income_at}</div>;
      },
    },
    {
      title: (
        <FormattedMessage
          id="maintenanceDepartmentParams.field.remittance"
          defaultMessage="预计汇款时间"
        />
      ),
      dataIndex: 'remittance',
      align: 'center',
      search: false,
      render: (dom, entity) => {
        return <div>{entity.detail_list[0].guess_income_at}</div>;
      },
    },
    {
      title: <FormattedMessage id="maintenanceDepartmentParams.field.type" defaultMessage="类型" />,
      // <Tooltip title='显示未解决的提示' defaultOpen={true} placement={"top"}>
      //
      // </Tooltip>
      dataIndex: 'type',
      align: 'center',
      search: {
        title: '开票收款类型',
      },
      valueType: 'select',
      valueEnum: invoiceType.reduce((acc, item) => {
        acc[`${item.value}`] = { text: item.label };
        return acc;
      }, {}),
      render: (dom, entity) => {
        return (
          <>
            {/* {
              entity.type === 'from_quo' &&
              <><span>报价单</span><span> | </span></>
            }
            {
              entity.trd_no !== '' &&
              <a>{entity.trd_no}</a>
            }
            {
              entity.type === 'alone' &&
              <span>单独请款</span>
            } */}
            {types.find((item) => item.val === entity.type)?.label === '报价单' &&
            entity.trd_no !== ''
              ? '汇总报价单'
              : types.find((item) => item.val === entity.type)?.label}
            {entity.trd_no !== '' && (
              <a onClick={() => toOrder(entity, true)}> | {entity.trd_no}</a>
            )}
          </>
        );
      },
    },
    {
      title: (
        <FormattedMessage id="maintenanceDepartmentParams.field.status" defaultMessage="状态" />
      ),
      dataIndex: 'status',
      align: 'center',
      search: false,
      render: (dom, entity) => {
        const rowClassName = entity.status_cn === '已回款' ? 'statusDone' : '';
        return <div className={rowClassName}>{entity.status_cn}</div>;
      },
    },
    {
      title: (
        <FormattedMessage id="maintenanceDepartmentParams.field.detail" defaultMessage="详情" />
      ),
      dataIndex: 'detail',
      align: 'center',
      search: false,
      render: (dom, entity:any) => {
        return (
          <>
            {[entity.detail_list[0]].map((item) => {
              // console.log('item.cost',index,entity.children_quos)
              const calculateTotalCost = (children_quos: any[] | undefined): string => {
                if (!children_quos || !Array.isArray(children_quos) || children_quos.length === 0) {
                  return '0.00';
                }
                return children_quos.reduce((sum, item) => {
                  const cost = item.cost || '0';
                  return bcMath.add(sum, cost, 2);
                }, '0');
              };
              const totalCost = calculateTotalCost(entity.children_quos);
              return (
                <div key={item.id} style={entity.detail_list.length > 0 ? { margin: 10 } : {}}>
                  <span style={{ marginRight: 15 }}>
                    公司：{entity.detail_list[0].company_name}&nbsp;&nbsp;&nbsp;&nbsp;
                    {/*金额：{Number(entity.detail_list.reduce((acc, item) => acc + Number(item.amount), 0)).toFixed(2)}*/}
                    金额：{bcMath.add(item.amount, 0, 2)} 成本：{totalCost}
                  </span>
                  <span>
                    <Tag
                      color="blue"
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        setCurrentItem(item);
                        setShowDetail(true);
                      }}
                    >
                      查看记录
                    </Tag>
                  </span>
                  {entity?.children_quos?.map((item:any) => {
                    return (
                      <div key={item.id}>
                        <a onClick={() => handleFullClick(item.quo_no)}>{item.quo_no}</a>| 金额：
                        {bcMath.add(item.total_price, 0, 2)}{' '}
                        {item && `成本：${bcMath.add(item.cost, 0, 2)}`}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </>
        );
      },
    },
    {
      title: '开票信息',
      dataIndex: 'invoiceInfo',
      align: 'center',
      search: false,
      render: (dom, entity:any) => {
        return (
          <>
            {entity?.invoiceInfo.map((item:any, index: number) => {
              const data = !isEmpty(item) ? JSON.parse(item) : '';

              return (
                <div key={index} style={{ display: 'flex' }}>
                  {!isEmpty(item) && (
                    <div>
                      <Space direction={'horizontal'} align={'start'}>
                        <Space direction={'vertical'} align={'start'}>
                          <div>销售方: {data?.seller_name}</div>
                          <div>购买方: {data?.purchaser_name}</div>
                          <div>发票号: {data?.invoice_no}</div>
                          <div>发票日期: {data?.invoice_at}</div>
                          <div>含税金额: {data?.amount_in_figuers}</div>
                          <div>不含税金额: {data?.total_amount}</div>
                          <div>税额: {data?.total_tax}</div>
                          <div>税率: {data?.tax_rate}</div>
                        </Space>

                        <Popconfirm
                          title="提示"
                          description="确认要删除这条开票记录吗?"
                          onConfirm={() => {
                            deleteInputRecord(data?.id ?? '0', 'invoice');
                          }}
                          okText="Yes"
                          cancelText="No"
                        >
                          <DeleteOutlined style={{ color: 'red' }} />
                        </Popconfirm>
                      </Space>
                      {index !== entity?.invoiceInfo.length - 1 && <Divider />}
                    </div>
                  )}
                </div>
              );
            })}
          </>
        );
      },
    },
    {
      title: '收款信息',
      dataIndex: 'incomeInfo',
      align: 'center',
      search: false,
      render: (dom, entity:any) => {
        return (
          <>
            {entity?.incomeInfo.map((item, index) => {
              const data = !isEmpty(item) ? JSON.parse(item) : '';

              return (
                <div key={index} style={{ display: 'flex' }}>
                  {!isEmpty(item) && (
                    <div>
                      <Space align={'start'}>
                        <Space direction={'vertical'} align={'start'}>
                          <div>付款公司: {data?.companyName}</div>
                          <div>金额: {data?.amount}</div>
                        </Space>

                        <Popconfirm
                          title="提示"
                          description="确认要删除这条收款记录吗?"
                          onConfirm={() => {
                            deleteInputRecord(data?.id ?? '0', 'income').then();
                          }}
                          okText="Yes"
                          cancelText="No"
                        >
                          <DeleteOutlined style={{ color: 'red' }} />
                        </Popconfirm>
                      </Space>

                      {index !== entity?.incomeInfo.length - 1 && <Divider />}
                    </div>
                  )}
                </div>
              );
            })}
          </>
        );
      },
    },
    {
      title: (
        <FormattedMessage id="maintenanceDepartmentParams.field.action" defaultMessage="操作" />
      ),
      dataIndex: 'action',
      align: 'center',
      search: false,
      fixed: 'right',
      width: 200,
      render: (dom, entity:any) => {
        return (
          <>
            {entity?.show_reject_button && (
              <SubmitButton
                confirmTitle="确认驳回？"
                confirmDesc="您确认要驳回审批吗？"
                type="primary"
                danger
                onConfirm={async () => {
                  revokeInvoice(entity.id);
                }}
              >
                驳回
              </SubmitButton>
            )}
          </>
        );
      },
    },
  ];


  const handleCloseCreateOrUpdate = () => {
    setCurrentItem({})
    setShowCreateOrUpdate(false)
  }

  const handleCloseDetail = () => {
    setCurrentItem({})
    setShowDetail(false)
  }

  const handleCloseEnter = () => {
    setShowEnter(false)
  }

  // 利润率计算精度测试
  // const new_profit_rate = () => {
  //   const profit = bcMath.sub(31000.00, 13687.00);
  //   console.log('profit', profit);
  //   const profitRate = bcMath.div(Number(profit), 31000.00,6);
  //   console.log('profitRate',dropRight(profitRate, 1).join(''));
  //   return (Number(dropRight(profitRate, 2).join('')) * 100) + '%';
  // }

  useEffect(() => {
    setColumnsStateMap(getStateMap(pathname))
    showButtonByType(ctrButtonMappings, 'invoicingCollection', 'tableList').then(r => {
      // console.log("r", r)
      setCtrButtons(r)
    })

    // invoicingCollection
    showButtonByType(ctrButtonMappings2, 'invoicingCollection', 'toolBarRender').then(r => {
      // console.log("rr", r)
      setCtrButtons2(r)
    })

    handleGetCustomerInvoiceInfo().then()
  }, [])

  return (
    <>
      {/*{new_profit_rate()}*/}
      <ProTable<API.MaintenanceDepartmentParams, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'maintenanceDepartmentParams.table.title',
          defaultMessage: 'table list',
        })}
        actionRef={actionRef}
        scroll={{x: 'max-content'}}
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            key="invoicing-entry-button"
            type="primary"
            onClick={() => {
              setShowEnter(true)
              setTitle('开票录入')
            }}
            disabled={selectedRowsState.length !== 1}
          >
            <FormattedMessage id="pages.searchTable.invoicingEntry" defaultMessage="Invoicing Entry"/>
          </Button>,

          <Button
            key='receipt-entry-button'
            type="primary"
            onClick={() => {
              setShowEnter(true)
              setTitle('收款录入')
              setCurrentItem({})
            }}
            disabled={selectedRowsState.length < 1}
          >
            <FormattedMessage id="pages.searchTable.receiptEntry" defaultMessage="Receipt Entry"/>
          </Button>
          // ...ctrButtons2
          // <Button
          //   type="primary"
          //   key="primary"
          //   icon={<PlusOutlined />} an/supplier/createOrUpdateFinanceReimAlone
          //   onClick={() => {
          //     setShowCreateOrUpdate(true);
          //   }}
          // >
          //   <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          // </Button>,

        ]}
        rowSelection={{
          onChange: onRowSelected
        }}
        tableAlertRender={() => {
          return (
            <div style={{display:'flex',gap:20}}>
              <div>已选择 {selectedRowsState.length} 项</div>
              <div>总金额：{total.excl_amount}</div>
              <div>总成本：{total.cost}</div>
              <div>不含税金额：{total.excl_amount}</div>
              <div>税额：{total.tax}</div>
              <div>含税金额：{total.amount}</div>
            </div>
          );
        }}
        request={onListData}
        columns={columns}
        columnsState={{
          value: columnsStateMap,
          onChange: (newState) => {
            setColumnsStateMap(newState)
            setStateMap(pathname, newState)
          }
        }}
        rowClassName={(record) => {
          return record.status_cn === '已回款' ? 'statusStyle' : '';
        }}
      />

      <Drawer
        width={1000}
        destroyOnClose={true}
        open={showCreateOrUpdate}
        onClose={handleCloseCreateOrUpdate}
      >
        <CreateOrUpdate
          actionRef={actionRef}
          success={success}
          error={error}
          currentItem={currentItem}
          handleCloseCreateOrUpdate={handleCloseCreateOrUpdate}
        />
      </Drawer>

      <Drawer
        width={800}
        destroyOnClose={true}
        open={showDetail}
        onClose={handleCloseDetail}
      >
        <Detail
          actionRef={actionRef}
          success={success}
          error={error}
          currentItem={currentItem}
          handleCloseDetail={handleCloseDetail}
        />
      </Drawer>

      <Drawer
        width={800}
        destroyOnClose={true}
        open={showEnter}
        onClose={handleCloseEnter}
        title={title}
      >
        <Enter
          success={success}
          error={error}
          selectedRowsState={selectedRowsState}
          handleCloseEnter={handleCloseEnter}
          title={title}
          actionRef={actionRef}
          currentItem={currentItem}
        />
      </Drawer>
    </>
  )
}

export default ItemList
