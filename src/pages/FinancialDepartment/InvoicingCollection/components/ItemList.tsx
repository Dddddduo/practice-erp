import React, { RefObject, useEffect, useState } from 'react';
import type { ActionType, ParamsType } from '@ant-design/pro-components';
import { ProColumns, ProTable } from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Button, Drawer, Space, Tag } from 'antd';
import CreateOrUpdate from './CreateOrUpdate';
import Detail from './Detail';
import Enter from './Enter';
import { bcMath, getStateMap, setStateMap, showButtonByType } from '@/utils/utils';
import { isEmpty, isFunction } from 'lodash';
import SubmitButton from '@/components/Buttons/SubmitButton';
import { invoiceCollectionByBatch } from '@/services/ant-design-pro/invoiceCollection';
import { useLocation } from '@@/exports';
import { updateApplyInvoiceStatus } from '@/services/ant-design-pro/financialReimbursement';
import './index.scss';
import { getCompanyList, getCustomerInvoiceInfo } from '@/services/ant-design-pro/aggregateQuotes';


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

interface ItemListProps {
  onListData: HandleListDataFunc;
  actionRef: RefObject<ActionType>;
  success: (text: string) => void
  error: (text: string) => void
  onRowSelected: HandleRowSelectionFunc;
  selectedRowsState: any,
  total: any
}

type messrs = {
  value: string;
  label: string;
}[]

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
  const [currentItem, setCurrentItem] = useState({})
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


  const [messrs , setMessrs] = useState<messrs>([])
  const revokeMyInvoice = async  (id: any) => {
    const res = await updateApplyInvoiceStatus(id)

    if (!res.success) {
      error(res.message)
      return
    }

    actionRef.current?.reload()
    success('撤回成功')
  }

  const ctrButtonMappings = {
    invoicCollectionPassAndReject: (record, idx) => {
      console.log(record)
      return [
        <Space>
          <SubmitButton
            confirmTitle="确认通过？"
            confirmDesc="您确认要通过审批吗？"
            type="primary"
            onConfirm={async () => {
              await invoiceCollectionByBatch({list_ids: [record.id], type: 'approved'})
              actionRef.current?.reload()
            }}
            key={`pass_${idx}`}
            disabled={
              record?.status === 'approved' ||
              record?.status === 'payment' ||
              record?.status === 'wait_income' ||
              record?.status === 'deal'
            }
          >
            通过
          </SubmitButton>
          <SubmitButton
            confirmTitle="确认驳回？"
            confirmDesc="您确认要驳回审批吗？"
            type="primary"
            danger
            key={`reject_${idx}`}
            onConfirm={async () => {
              await invoiceCollectionByBatch({list_ids: [record.id], type: 'reject'})
              actionRef.current?.reload()
            }}
            disabled={
              record?.status === 'approved' ||
              record?.status === 'payment' ||
              record?.status === 'wait_income' ||
              record?.status === 'deal' ||
              record?.status === 'reject'
            }
          >
            驳回
          </SubmitButton>
        </Space>
      ]
    },
    selfCancel: (record, idx) => {
      return [
        <SubmitButton
          confirmTitle="提示"
          confirmDesc="您确定要执行撤回吗？"
          type="primary"
          danger
          onConfirm={async () => {
            revokeMyInvoice(record.id ?? 0)
          }}
          key={`pass_${idx}`}
          disabled={
            record?.status !== 'submit'
          }
        >
          撤回
        </SubmitButton>
      ]
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
        </Button>,

        <Button
          type="primary"
          onClick={() => {
            setShowEnter(true)
            setTitle('收款录入')
          }}
          disabled={selectedRowsState.length < 1}
        >
          <FormattedMessage id="pages.searchTable.receiptEntry" defaultMessage="Receipt Entry"/>
        </Button>,
      </Space>

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
  useEffect(() => {
    setColumnsStateMap(getStateMap(pathname))

    console.log('ctrButtonMappingsctrButtonMappingsctrButtonMappings', ctrButtonMappings)


    showButtonByType(ctrButtonMappings, 'invoicingCollection', 'tableList').then(r => {
      setCtrButtons(r);
    })

    // invoicingCollection
    showButtonByType(ctrButtonMappings2, 'invoicingCollection', 'toolBarRender').then(r => {
      console.log("rr", r)
      setCtrButtons2(r)
    })

    handleGetCustomerInvoiceInfo().then()
  }, [])

  const calculateTotalCost = (children_quos: any[] | undefined): string => {
    if (!children_quos || !Array.isArray(children_quos) || children_quos.length === 0) {
      return "0.00";
    }
    return children_quos.reduce((sum, item) => {
      const cost = item.cost || "0";
      return bcMath.add(sum, cost,2);
    }, "0");
  };

  const columns: ProColumns<API.MaintenanceDepartmentParams>[] = [
    {
      title: (
        <FormattedMessage
          id="maintenanceDepartmentParams.field.id"
          defaultMessage="序号"
        />
      ),
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
        return (
          <div>{entity.detail_list[0].seller_company_cn}</div>
        )
      }
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
        title: "开票时间"
      },
      valueType: "dateRange",
      render: (_, entity) => (
        <>{entity.create_at}</>
      )
    },
    // {
    //   title: (
    //     <FormattedMessage
    //       id="maintenanceDepartmentParams.field.invoice_type"
    //       defaultMessage="开票类型"
    //     />
    //   ),
    //   dataIndex: 'invoice_type',
    //   align: 'center',
    //   search: false,
    //   render: (_, entity) => (
    //     <></>
    //   )
    // },
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
        title: "客户名称"
      },
      valueType: "select",
      valueEnum: messrs.reduce((acc, item) => {
        acc[`${item.value}`] = {text: item.label}
        return acc
      },{}),
      fieldProps: {
        showSearch: true
      },
      render: (_, entity) => (
        <>{entity.messrs}</>
      )
    },
    {
      title: (
        <FormattedMessage
          id="maintenanceDepartmentParams.field.department"
          defaultMessage="部门"
        />
      ),
      dataIndex: 'department',
      align: 'center',
      valueType: "select",
      valueEnum: department.reduce((acc, item) => {
        acc[`${item.value}`] = {text: item.label}
        return acc
      }, {}),
      fieldProps: {
        showSearch: true
      }
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
    // {
    //   title: (
    //     <FormattedMessage
    //       id="maintenanceDepartmentParams.field.cost"
    //       defaultMessage="成本"
    //     />
    //   ),
    //   dataIndex: 'cost',
    //   align: 'center',
    //   search: false,
    // },
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
      render: (dom, entity) => {
        return (
          <>
            {
              Number(entity.detail_list[0]?.excl_amount)
            }
          </>
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="maintenanceDepartmentParams.field.tax_rate"
          defaultMessage="税率"
        />
      ),
      dataIndex: 'tax_rate',
      align: 'center',
      search: false,
      render: (dom, entity) => {
        return (
          <>
            {
              dom + '%'
            }
          </>
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="maintenanceDepartmentParams.field.tax_amount"
          defaultMessage="税额"
        />
      ),
      dataIndex: 'tax_amount',
      align: 'center',
      search: false,
      render: (dom, entity) => {
        return (
          <>
            {
              entity.detail_list[0]?.tax
            }
          </>
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="maintenanceDepartmentParams.field.amount_yes"
          defaultMessage="Amount(含税)"
        />
      ),
      dataIndex: 'amount-yes',
      align: 'center',
      search: false,
      render: (dom, entity) => {
        return (
          <>
            {
              entity.detail_list[0]?.amount ?? 0
            }
          </>
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="maintenanceDepartmentParams.field.profit"
          defaultMessage="利润"
        />
      ),
      dataIndex: 'profit',
      align: 'center',
      search: false,
      render: (dom, entity) => {
        const totalCost = calculateTotalCost(entity.children_quos) ?? 0;
        const excl_amount = Number(entity.detail_list[0]?.excl_amount) ?? 0
        const new_profit = () => {
          if(excl_amount === 0){
            return
          } else {
            return bcMath.sub(excl_amount, Number(totalCost));
          }
        }
        return (
          <>
            {
              new_profit()
            }
          </>
        )
      }
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
      render: (dom, entity) => {
        const totalCost = calculateTotalCost(entity.children_quos) ?? 0;
        const excl_amount = Number(entity.detail_list[0]?.excl_amount) ?? 0
        const new_profit_rate = () => {
          if(excl_amount === 0){
            return
          } else {
            const profit = bcMath.sub(excl_amount, Number(totalCost));
            const profitRate = bcMath.div(Number(profit), excl_amount,4);
            return (Number(profitRate) * 100).toFixed(2) + '%';
          }
        }
        return (
          <>
            {
              new_profit_rate()
            }
          </>
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="maintenanceDepartmentParams.field.cost"
          defaultMessage="成本"
        />
      ),
      dataIndex: 'cost',
      align: 'center',
      search: false,
      render: (dom, entity) => {
        const totalCost = calculateTotalCost(entity.children_quos);
        return (
          <>
            {
              totalCost
            }
          </>
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="maintenanceDepartmentParams.field.collection"
          defaultMessage="收款"
        />
      ),
      dataIndex: 'collection',
      align: 'center',
      search: {
        title: '收款状态',
      },
      valueType: 'select',
      valueEnum: coll_yes_or_no.reduce((acc, item) => {
        acc[`${item.value}`] = { text: item.label };
        return acc;
      }, {}),
      render: (dom, entity) => {
        return (
          <div>
            {
              entity.detail_list[0].coll_yes_or_no
            }
          </div>
        )
      }
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
        return (
          <div>
            {
              entity.detail_list[0].income_at
            }
          </div>
        )
      }
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
        return (
          <div>
            {
              entity.detail_list[0].guess_income_at
            }
          </div>
        )
      }
    },
    // {
    //   title: (
    //     <FormattedMessage
    //       id="maintenanceDepartmentParams.field.invoice_time"
    //       defaultMessage="发票日期"
    //     />
    //   ),
    //   dataIndex: 'invoice_time',
    //   align: 'center',
    //   search: false,
    //   render: (dom, entity) => {
    //     return (
    //       <div>
    //         {
    //           entity.detail_list[0].invoice_at
    //         }
    //       </div>
    //     )
    //   }
    // },
    // {
    //   title: (
    //     <FormattedMessage
    //       id="maintenanceDepartmentParams.field.invoice_no"
    //       defaultMessage="发票号"
    //     />
    //   ),
    //   dataIndex: 'invoice_no',
    //   align: 'center',
    //   search: false,
    //   render: (dom, entity) => {
    //     // console.log('发票号entity',entity)
    //     return (
    //       <div>
    //         {
    //           entity.detail_list[0].invoice_no
    //         }
    //       </div>
    //     )
    //   }
    // },
    {
      title: (
        <FormattedMessage
          id="maintenanceDepartmentParams.field.type"
          defaultMessage="类型"
        />
      ),
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
      }
    },
    {
      title: (
        <FormattedMessage
          id="maintenanceDepartmentParams.field.status"
          defaultMessage="状态"
        />
      ),
      dataIndex: 'status',
      align: 'center',
      search: false,
      render: (dom, entity) => {
        return (
          <>{entity.status_cn}</>
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="maintenanceDepartmentParams.field.detail"
          defaultMessage="详情"
        />
      ),
      dataIndex: 'detail',
      align: 'center',
      search: false,
      render: (dom, entity) => {

        return (
          <>
            {
             !isEmpty(entity.detail_list) && [entity.detail_list[0]].map(item => {

                const totalCost = calculateTotalCost(entity.children_quos);
                return (
                  <div key={item.id} style={entity.detail_list.length > 0 ? {margin: 10} : {}}>
                    <span style={{marginRight: 15}}>
                      公司：{entity.detail_list[0].company_name}&nbsp;&nbsp;&nbsp;&nbsp;
                      金额：{entity.detail_list[0]?.amount ?? 0}  成本：{totalCost}
                    </span>
                    <span>
                      <Tag color="blue" style={{cursor: 'pointer'}} onClick={() => {
                        setCurrentItem(item)
                        setShowDetail(true)
                      }}>查看记录</Tag>
                    </span>
                    {
                      entity?.children_quos?.map(item => {
                        // console.log('item--item', item)
                        return (
                          <div key={item.id}>
                            <a onClick={() => handleFullClick(item.quo_no)}>{item.quo_no}</a>|
                            金额：{item.total_price} {item && `成本：${item.cost}`}
                          </div>
                        );
                      })
                    }
                  </div>
                )
              })
            }

          </>
        )
      }
    },
    {
      title: '操作',
      dataIndex: 'option',
      search: false,
      align: 'center',
      fixed: 'right',
      render: (_, record, index) => {
        if (isEmpty(ctrButtons) || !isFunction(ctrButtons[0])) {
          return []
        }

        return ctrButtons[0](record, index)
      }
    },
    // {
    //   title: (
    //     <FormattedMessage
    //       id="maintenanceDepartmentParams.field.action"
    //       defaultMessage="操作"
    //     />
    //   ),
    //   dataIndex: 'action',
    //   align: 'center',
    //   search: false,
    //   fixed: 'right',
    //   width: 200,
    //   render: (dom, entity) => {
    //     return (
    //       <Button type="primary" onClick={() => {
    //         setCurrentItem(entity)
    //         setShowCreateOrUpdate(true)
    //       }}>查看</Button>
    //     )
    //   }
    // },
  ]

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

  return (
    <>
      <ProTable<API.MaintenanceDepartmentParams, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'maintenanceDepartmentParams.table.title',
          defaultMessage: 'table list',
        })}
        actionRef={actionRef}
        scroll={{ x: 'max-content' }}
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          ...ctrButtons2,
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
          <Button
            type="primary"
            key="item-list-button-1"
            onClick={() => {
              setShowEnter(true);
              setTitle('开票录入');
            }}
            disabled={selectedRowsState.length !== 1}
          >
            <FormattedMessage
              id="pages.searchTable.invoicingEntry"
              defaultMessage="Invoicing Entry"
            />
          </Button>,
          <Button
            key="item-list-button-2"
            type="primary"
            onClick={() => {
              setShowEnter(true);
              setTitle('收款录入');
            }}
            disabled={selectedRowsState.length < 1}
          >
            <FormattedMessage id="pages.searchTable.receiptEntry" defaultMessage="Receipt Entry" />
          </Button>,
        ]}
        rowSelection={{
          onChange: onRowSelected,
        }}
        tableAlertRender={() => {
          return (
            <div style={{display: 'flex', gap: 20}}>
              <div>已选择 {selectedRowsState.length} 项</div>
              <div>总金额：{total.amount}</div>
              <div>总成本：{total.cost}</div>
              <div>不含税金额：{total.excl_amount}</div>
              <div>税额：{total.tax}</div>
              <div>含税金额：{total.amount}</div>
            </div>
          );
        }}
        rowKey="id"
        request={onListData}
        columns={columns}
        columnsState={{
          value: columnsStateMap,
          onChange: (newState) => {
            setColumnsStateMap(newState);
            setStateMap(pathname, newState);
          },
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

      <Drawer width={800} destroyOnClose={true} open={showDetail} onClose={handleCloseDetail}>
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
        />
      </Drawer>
    </>
  );
}

export default ItemList
