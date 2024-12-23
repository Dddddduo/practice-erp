import React, { RefObject, useEffect, useState } from "react"
import type { ActionType, ParamsType } from "@ant-design/pro-components";
import { ProTable, ProColumns } from "@ant-design/pro-components";
import { useIntl, FormattedMessage } from "@umijs/max";
import {Button, Space, Tag, Form, Drawer, Input, message, Popconfirm, Tooltip, Select, Modal, DatePicker} from "antd";
import {
  approveFinanceReim,
  getFinanceReimStatusMap,
  exportAloneReimExcel,
  operateByBatchListIds
} from "@/services/ant-design-pro/financialReimbursement";
import { isEmpty } from "lodash";
import { getWorkerList } from "@/services/ant-design-pro/report";
import { getUserList } from "@/services/ant-design-pro/pushManagement";
import ReimDetail from "./ReimDetail";
import ReimbursementSeparately from "./ReimbursementSeparately";
import Detail from "./Detail";
import Enter from "./Enter";
import dayjs from "dayjs";
import Payouts from "./Payouts";
import {getStateMap, LocalStorageService, setStateMap, showButtonByType} from "@/utils/utils";
import { useLocation } from "@@/exports";
import { getUserButtons } from "@/services/ant-design-pro/user";
import SubmitButton from "@/components/Buttons/SubmitButton";
import DeleteButton from "@/components/Buttons/DeleteButton";
import {ExclamationCircleFilled} from "@ant-design/icons";

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

interface ItemListProps {
  onListData: HandleListDataFunc;
  actionRef: RefObject<ActionType>;
  success: (text: string) => void
  error: (text: string) => void
  settlementTypes: {
    value: number
    label: string
    desc: string
  }[]
  path: string
  onRowSelected: HandleRowSelectionFunc;
  selectedRowsState: any
  tableList: {}
  selectedTotalAmount: any
}

// const settlementType = [
//   { value: 'full-time-qiyedidi', label: '全职 - 企业滴滴', desc: '结算周期：上一个自然月，用于企业滴滴对账' },
//   { value: 'full-time-huolala', label: '全职 - 货拉拉', desc: '结算周期：用于结算本公司工人货拉拉' },
//   { value: 'part-time-labor-cost', label: '兼职 - 人工费', desc: '结算周期：上周四 ~ 本周五，用于结算兼职人工费' },
//   { value: 'full-time-materials-cost', label: '全职 - 材料费', desc: '结算周期：上月21日 ~ 本月20日，用于结算本公司工人材料费' },
//   { value: 'liuyunfei-part-time', label: '刘云飞 - 下属', desc: '结算周期：上一个自然月，用于刘云飞下属兼职工人（不含刘云飞）结算上个月的费用' },
//   { value: 'lixiaohai-pay-for-business', label: '李小海 - 对公', desc: '结算周期：上月16日 ~ 本月15日，用于李小海及其下属兼职工人结算上个月的费用' },
//   { value: 'changyangfan-pay-for-business', label: '畅扬帆 - 对公', desc: '结算周期：上一个自然月，用于畅扬帆及其下属兼职工人结算上个月的费用' },
//   { value: 'other-pay-for-business', label: '其它报销对公打款  ', desc: '结算周期：上周四 ~ 本周五，用于结算其他供应商费用' },
// ]

const allType = [
  { value: 'fm-alone', label: '维保部-单独报销' },
  // { value: 'project-alone', label: '维保部-单独报销' },
  { value: 'pqi_alone_reim', label: '项目部-单独报销' },
  { value: 'pqi_vendor_reim', label: '项目部-供应商报销' },
  { value: 'fm_worker_reim', label: '维保部-工人报销' },
  { value: 'fm_vendor_reim', label: '维保部-对公报销' },
  { value: 'pqi_cost', label: '项目部-PQI成本报销' }
]

const subType = [
  { value: '差旅费', label: '差旅费' },
  { value: '奖金', label: '奖金' },
  { value: '人工费', label: '人工费' },
  { value: '材料费', label: '材料费' },
  { value: '其他', label: '其他' },
  { value: '工人报销单', label: '工人报销单' }
]

const plats = [
  { value: "worker", label: "工人" },
  { value: "supplier", label: "管理员" },
  { value: "other", label: "第三方" },
];

const ItemList: React.FC<ItemListProps> = ({
  actionRef,
  onListData,
  success,
  error,
  settlementTypes,
  path,
  onRowSelected,
  selectedRowsState,
  tableList,
                                             selectedTotalAmount,
}) => {
  const [form] = Form.useForm()
  const intl = useIntl()
  const [columnsStateMap, setColumnsStateMap] = useState({});
  const location = useLocation();
  const currentPath = location.pathname;
  const pathname = currentPath.split('/')[currentPath.split('/').length - 1]
  const [isFirst, setIsFirst] = useState(true)
  const [reimStatus, setReimStatus] = useState<{ status: string, status_cn: string }[]>([])
  const [showPayeePeople, setShowPayeePeople] = useState<any>(false)
  const [type, setType] = useState<any>('text')
  const [peopleList, setPeopleList] = useState<{
    value: number
    label: string
  }[]>([])
  const [applicantList, setApplicantList] = useState([])
  const [currentItem, setCurrentItem] = useState({})
  const [showReimDetail, setShowReimDetail] = useState<boolean>(false)
  const [separately, setSeparately] = useState<boolean>(false)
  const [title, setTitle] = useState<string>('')
  const [showDetail, setShowDetail] = useState(false)
  const [detailList, setDetailList]: any = useState([])
  const [showEnter, setShowEnter] = useState(false)
  const [createTime, setCreateTime] = useState('')
  const [showPayouts, setShowPayouts] = useState(false)
  const [loadings, setLoadings] = useState<boolean[]>([]);
  const [showTableListButton, setShowTableListButton] = useState<boolean>(false)
  const [currentTime, setCurrentTime] = useState('')
  const [currentTypeDesc, setCurrentTypeDesc] = useState('')
  const [showTooltip, setShowTooltip] = useState(true)
  const [showMonthPicker, setShowMonthPicker] = useState(false)

  const { confirm } = Modal;

  // 报销归属月
  const [reimAt, setReimAt] = useState('')

  const [messageApi, contextHolder] = message.useMessage();

  const cancelHandle = (entity) => {
    try {
      operateByBatchListIds({ list_ids: [entity.id], type: 'cancel' }).then(r => {
        if (r.success) {
          message.success('提交成功')
          actionRef.current?.reload();
          return
        }

        message.error(r.message)
      })
    } catch (error) {
      message.error((error as Error).message)
    }
  }

  useEffect(() => {
    setShowTableListButton(false)
    if (path === 'company') {
      try {
        getUserButtons({ module: 'reimbursementPayment', pos: 'tableList' }).then(res => {
          if (res.success && !isEmpty(res.data)) {
            res.data.forEach(item => {
              if (item.name === 'companyReimbursementPayment') {
                setShowTableListButton(true)
                return
              }
            })
          }
        })
      } catch (error) {
        message.error('Error')
        setShowTableListButton(false)
      }
    }
  }, [path])


  const columns: ProColumns<API.FinancialReimbursementParams>[] = [
    {
      title: <FormattedMessage id="financialReimbursement.field.id" defaultMessage="序号" />,
      dataIndex: 'id',
      search: false,
      align: 'center',
    },
    {
      title: <FormattedMessage id="financialReimbursement.field.type" defaultMessage="结算类型" />,
      dataIndex: 'type',
      search:
        path === 'office'
          ? false : false,
          // : {
          //     title: (
          //       <Tooltip
          //         title={currentTypeDesc}
          //         open={!!currentTypeDesc && showTooltip}
          //         placement="top"
          //         destroyTooltipOnHide
          //         fresh
          //       >
          //         <div>结算类型</div>
          //       </Tooltip>
          //     ),
          //   },
      hideInTable: true,
      valueType: 'select',
      fieldProps: {
        allowClear: false,
        options: settlementTypes,
        onChange: (_, e) => {
          setCurrentTypeDesc(e?.desc ?? '');
          setIsFirst(false);
        },
      },
    },
    {
      title: <FormattedMessage id="financialReimbursement.field.payee" defaultMessage="收款方" />,
      search: path === 'office' ? false : false,
      dataIndex: 'payee',
      hideInTable: true,
      valueType: 'select',
      valueEnum: plats.reduce((acc, item) => {
        acc[`${item.value}`] = { text: item.label };
        return acc;
      }, {}),
      fieldProps: {
        showSearch: true,
        onChange: (key, option) => {
          form.setFieldsValue({ payeePeople: undefined });
          if (isEmpty(key) && isEmpty(option)) {
            setShowPayeePeople(false);
            return;
          }
          setShowPayeePeople(true);
          if (key === 'worker' || key === 'supplier') {
            setPeopleList([]);
            setType('select');
            if (key === 'worker') {
              getWorkerList().then((res) => {
                if (res.success) {
                  const format = res.data.map((item) => {
                    return {
                      value: item.worker_id,
                      label: item.name,
                    };
                  });
                  setPeopleList(format);
                }
              });
            }
            if (key === 'supplier') {
              getUserList().then((res) => {
                if (res.success) {
                  const format = res.data.map((item) => {
                    return {
                      value: item.uid,
                      label: item.name_cn,
                    };
                  });
                  setPeopleList(format);
                }
              });
            }
            return;
          }
          setType('text');
        },
      },
    },
    {
      dataIndex: 'payeePeople',
      hideInTable: true,
      search: showPayeePeople,
      valueType: type,
      valueEnum:
        type === 'select'
          ? peopleList.reduce((acc, item) => {
              acc[`${item.value}`] = { text: item.label };
              return acc;
            }, {})
          : undefined,
    },
    {
      title: (
        <FormattedMessage
          id="financialReimbursement.field.person"
          defaultMessage="申请人"
        />
      ),
      dataIndex: 'person',
      align: 'center',
      valueType: 'select',
      valueEnum: applicantList.reduce((acc, item) => {
        acc[`${item.value}`] = { text: item.label }
        return acc
      }, {}),
      search: path === 'office' ? false : false,
      fieldProps: {
        showSearch: true,
      },
      render: (dom, entity) => {
        return (
          <div>
            {entity.create_palt_cn}: {entity.create_name_cn}
          </div>
        )
      }
    },
    {
      title: (
        <FormattedMessage id="financialReimbursement.field.create_at" defaultMessage="申请时间" />
      ),
      dataIndex: 'create_at',
      align: 'center',
      valueType: 'dateMonth',
      fieldProps: {
        onChange(e: any) {
          if (e) {
            setCreateTime(dayjs(e).format('YYYY-MM'));
            return;
          }
          setCreateTime('');
        },
      },
      render: (dom, entity) => {
        return <div>{entity.create_at}</div>;
      },
    },
    {
      title: (
        <FormattedMessage id="financialReimbursement.field.department" defaultMessage="部门" />
      ),
      dataIndex: 'department',
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
        <FormattedMessage id="financialReimbursement.field.approve_at" defaultMessage="审批时间" />
      ),
      dataIndex: 'approve_at',
      align: 'center',
      valueType: 'dateRange',
      render: (dom, entity) => {
        return <div>{entity.approve_at}</div>;
      },
    },
    {
      title: (
        <FormattedMessage id="financialReimbursement.field.reimType" defaultMessage="报销类型" />
      ),
      dataIndex: 'reimType',
      align: 'center',
      search: path === 'office' ? false : true,
      valueType: 'select',
      valueEnum: allType.reduce((acc, item) => {
        acc[`${item.value}`] = { text: item.label };
        return acc;
      }, {}),
      render: (dom, entity) => {
        return (
          <div>
            {entity.type === 'alone' ? (
              <div>alone</div>
            ) : (
              <>
                {allType.find((item) => item.value === entity.type)?.label}
                {entity.trd_no !== '' && <span> | </span>}
                <a onClick={() => toOrder(entity)}>{entity.trd_no}</a>
              </>
            )}
          </div>
        );
      },
    },
    {
      title: <FormattedMessage id="financialReimbursement.field.detail" defaultMessage="明细" />,
      dataIndex: 'detail',
      search: path === 'office' ? false : true,
      align: 'center',
      valueType: 'select',
      valueEnum: subType.reduce((acc, item) => {
        acc[`${item.value}`] = { text: item.label };
        return acc;
      }, {}),
      render: (dom, entity, index) => {
        return (
          <div>
            {!isEmpty(detailList) && !isEmpty(detailList[index])
              ? detailList[index].map((item) => {
                  return (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ display: 'flex', alignItems: 'center' }}>
                        {path !== 'office' && (
                          <>
                            <Input
                              style={{ width: 80, height: 20 }}
                              value={item.amount}
                              onInput={(e) => handleInput(e, item, index)}
                            />
                            <Tag
                              color="blue"
                              style={{ cursor: 'pointer', margin: 5 }}
                              onClick={() => {
                                setShowEnter(true);
                                setCurrentItem({ ...item, create_uid: entity.create_uid });
                                const formattedMonth = (new Date(entity.create_at).getMonth() + 1)
                                  .toString()
                                  .padStart(2, '0');
                                const formattedYearMonth =
                                  new Date(entity.create_at).getFullYear() + '-' + formattedMonth;
                                setCurrentTime(formattedYearMonth);
                              }}
                            >
                              打款录入
                            </Tag>
                          </>
                        )}
                        <Tag
                          color="blue"
                          style={{ cursor: 'pointer', margin: 5 }}
                          onClick={() => {
                            setShowDetail(true);
                            setCurrentItem(item);
                          }}
                        >
                          查看记录
                        </Tag>
                      </span>
                      <span>
                        【是否开票：{item.have_invoice === 0 ? '否' : '是'}】 【类型：
                        {item.reim_type}】 【账号：{item.name_cn}】 【开户行：{item.bank_name}】
                        【银行卡号：{item.bank_no}】 【金额：{item.amount}】
                      </span>
                    </div>
                  );
                })
              : ''}
          </div>
        );
      },
    },
    {
      title: <FormattedMessage id="financialReimbursement.field.status" defaultMessage="状态" />,
      dataIndex: 'status_cn',
      align: 'center',
      valueType: 'select',
      valueEnum: reimStatus?.reduce((acc, item) => {
        acc[`${item.status}`] = { text: item.status_cn };
        return acc;
      }, {}),
    },
    {
      title: <FormattedMessage id="financialReimbursement.field.remark" defaultMessage="备注" />,
      dataIndex: 'remark',
      align: 'center',
      search: false,
    },
    {
      title: <FormattedMessage id="financialReimbursement.field.action" defaultMessage="操作" />,
      dataIndex: 'action',
      align: 'center',
      fixed: 'right',
      search: false,
      render: (dom, entity) => {
        return (
          <>
            {entity.department !== 'finance' && (
              <Space>
                {showTableListButton && (
                  <>
                    {(entity.status === 'submit' || entity.status === 'reject') &&
                      entity.department !== 'finance' && (
                        <DeleteButton
                          type="primary"
                          onConfirm={() => handleAction(entity, 'approved')}
                          title="确认通过？"
                        >
                          通过
                        </DeleteButton>
                      )}
                    {(entity.status === 'submit' || entity.status === 'approve') &&
                      entity.department !== 'finance' && (
                        <DeleteButton
                          type="primary"
                          danger
                          onConfirm={() => handleAction(entity, 'reject')}
                          title="确认驳回？"
                        >
                          驳回
                        </DeleteButton>
                      )}
                  </>
                )}
                {entity.department !== 'finance' && (
                  <Button type="primary" onClick={() => handleShow(entity)}>
                    查看
                  </Button>
                )}

                {entity.show_cancel && (
                  <Popconfirm
                    title="提示"
                    description="您确定要执行撤回吗？"
                    onConfirm={() => cancelHandle(entity)}
                    disabled={!(entity.status === 'submit')}
                  >
                    <Button
                      type="primary"
                      danger
                      disabled={entity?.status === 'approved' || entity?.status === 'payment'}
                    >
                      撤回
                    </Button>
                  </Popconfirm>
                )}
              </Space>
            )}
          </>
        );
      },
    },
  ];

  const handleAction = (entity, type) => {
    approveFinanceReim({ id: entity.id, status: type }).then(res => {
      if (res.success) {
        actionRef.current?.reload()
        success('处理成功')
        return
      }
      error(res.message)
    })
  }

  const toOrder = (item) => {
    if (item.type === 'fm_worker_reim' || item.type === 'fm_vendor_reim') {
      window.open(`/order/reimbursement?reim_no=${item.trd_no}`, '_blank')
    }
    if (item.type === 'pqi_alone_reim' || item.type === 'pqi_vendor_reim' || item.type === 'pqi_cost') {
      window.open(`/project/fullPQI?quo_no=${item.trd_no}`, '_blank')
    }
  }

  const handleShow = (entity) => {
    if (entity.type.indexOf('alone') !== -1) {
      setCurrentItem(entity)
      setSeparately(true)
      setShowTooltip(false)
      setTitle('单独报销')
    } else {
      setCurrentItem(entity)
      setShowTooltip(false)
      setShowReimDetail(true)
      setTitle('查看详情')
    }
  }

  const handleCloseReimDetail = () => {
    setTitle('')
    setCurrentItem({})
    setShowTooltip(true)
    setShowReimDetail(false)
  }

  const handleCloseSeparately = () => {
    setTitle('')
    setCurrentItem({})
    setShowTooltip(true)
    setSeparately(false)
  }

  const handleCloseDetail = () => {
    setCurrentItem({})
    setShowDetail(false)
  }

  const handleInput = (e, item, index) => {
    const currentData = detailList[index].find(detail => detail.id === item.id)
    currentData.amount = e.target.value
    setDetailList(preState => {
      return [
        ...preState,
        [
          ...preState[index],
          currentData
        ]
      ]
    })
  }

  const handleCloseEnter = () => {
    setCurrentItem({})
    setShowTooltip(true)
    setShowEnter(false)
  }

  const exportReimExcel = (index) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });
    const ids = selectedRowsState.map(item => item.id).join(',')
    exportAloneReimExcel({ reim_list_ids: ids }).then(res => {
      if (res.success && res.data) {
        setLoadings((prevLoadings) => {
          const newLoadings = [...prevLoadings];
          newLoadings[index] = false;
          return newLoadings;
        });
        const link = document.createElement('a');
        link.href = res.data;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        message.error('导出失败')
        setLoadings((prevLoadings) => {
          const newLoadings = [...prevLoadings];
          newLoadings[index] = false;
          return newLoadings;
        });
      }
    })
  }

  const handleClosePayouts = () => {
    setShowTooltip(true)
    setShowPayouts(false)
  }

  useEffect(() => {
    getFinanceReimStatusMap({ role_type: 'm' }).then(res => {
      if (res.success) {
        setReimStatus(res.data)
      }
    })
    getUserList().then(res => {
      if (res.success) {
        const format = res.data.map(item => {
          return {
            value: item.uid,
            label: item.name_mobile
          }
        })
        setApplicantList(format)
      }
    })
    if (!isEmpty(settlementTypes) && isFirst) {
      form.setFieldsValue({
        type: settlementTypes[0].value,
      });
    }

    if (!isEmpty(tableList)) {
      const detail = []
      tableList.data.map(item => {
        detail.push(item.detail_list)
      })
      console.log(detail);
      setDetailList(detail)
    }
  }, [settlementTypes, tableList])

  useEffect(() => {
    setCurrentTypeDesc(settlementTypes[0]?.desc ?? '')
  }, [settlementTypes])

  const batchSubmitHandle = () => {
    const ids = selectedRowsState.map(item => {
      return item.id
    })

    try {
      operateByBatchListIds({ list_ids: ids, type: 'submit',  reim_at: reimAt}).then(r => {
        if (r.success) {
          message.success('提交成功')
          actionRef.current?.reload();
          setReimAt('')
          setShowMonthPicker(false)
          return
        }

        message.error(r.message)
      })
    } catch (error) {
      message.error((error as Error).message)
    }
  }

  const handleShowEnter = () => {
    if (selectedRowsState.length > 1) {
      // 取得第一条数据的月份
      const firstMonth = new Date(selectedRowsState[0].create_at).getMonth();

      // 判断数据中的所有 create_at 是否在同一个月
      const isSameMonth = selectedRowsState.every(item => new Date(item.create_at).getMonth() === firstMonth);

      if (isSameMonth) {
        const formattedMonth = (new Date(selectedRowsState[0].create_at).getMonth() + 1).toString().padStart(2, '0');
        const formattedDay = new Date(selectedRowsState[0].create_at).getDate()
        console.log(formattedDay);
        const formattedYearMonth = new Date(selectedRowsState[0].create_at).getFullYear() + '-' + formattedMonth;
        setCurrentTime(formattedYearMonth)
        setShowEnter(true)
        setShowTooltip(false)
      } else {
        message.error('请选择同一月份的报销！')
      }
    } else {
      const formattedMonth = (new Date(selectedRowsState[0].create_at).getMonth() + 1).toString().padStart(2, '0');
      const formattedYearMonth = new Date(selectedRowsState[0].create_at).getFullYear() + '-' + formattedMonth;
      setCurrentTime(formattedYearMonth)
      setShowEnter(true)
      setShowTooltip(false)
    }
  }

  useEffect(() => {
    setColumnsStateMap(getStateMap(pathname))
  }, []);

  return (
    <>
      {contextHolder}
      <ProTable<API.FinancialReimbursementParams, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'financialReimbursement.table.title',
          defaultMessage: 'table list',
        })}
        actionRef={actionRef}
        scroll={{ x: 'max-content' }}
        search={{
          labelWidth: 120,
        }}
        columnsState={{
          value: columnsStateMap,
          onChange: (newState) => {
            setColumnsStateMap(newState)
            setStateMap(pathname, newState)
          }
        }}
        toolBarRender={() => [
          <>
            {
              !isEmpty(selectedRowsState) && <div style={{ color: "red", width: 190, fontSize: 16 }}>已选择金额：{selectedTotalAmount.toFixed(2)}</div>
            }
            {
              path === 'office' &&
              <Button
                type="primary"
                // disabled={selectedRowsState.length < 1}
                onClick={() => {
                  if (createTime) {
                    setShowPayouts(true)
                    return
                  }
                  error('请选择申请时间')
                }}
              >
                报销汇总
              </Button>
            }
            {/*<Popconfirm*/}
            {/*  title="提示"*/}
            {/*  description="您确定要执行批量提交吗？"*/}
            {/*  onConfirm={batchSubmitHandle}*/}
            {/*>*/}
            {/*  <Button*/}
            {/*    type="primary"*/}
            {/*    disabled={selectedRowsState.length < 1}*/}
            {/*  >*/}
            {/*    <FormattedMessage id="pages.searchTable.batchSubmit" defaultMessage="Separate reimbursement" />*/}
            {/*  </Button>*/}
            {/*</Popconfirm>*/}

            {
              path === 'office' && <Button
              type="primary"
              disabled={selectedRowsState.length < 1}
              onClick={() => {
                setShowMonthPicker(true)
              }}
            >
              <FormattedMessage id="pages.searchTable.batchSubmit" defaultMessage="Separate reimbursement" />
            </Button>
            }
            {
              path === 'company' && <Button
                type="primary"
                disabled={selectedRowsState.length < 1}
                onClick={() => {
                  confirm({
                    title: '提示',
                    icon: <ExclamationCircleFilled />,
                    content: '您确定要执行批量提交吗？',
                    onOk() {
                      batchSubmitHandle()
                    }
                  });
                }}
              >
                <FormattedMessage id="pages.searchTable.batchSubmit" defaultMessage="Separate reimbursement" />
              </Button>
            }
            <Button
              type="primary"
              onClick={() => {
                setSeparately(true)
                setShowTooltip(false)
                setTitle('单独报销')
              }}
            >
              <FormattedMessage id="pages.searchTable.separateReimbursement" defaultMessage="Separate reimbursement" />
            </Button>

            <Button
              type="primary"
              disabled={selectedRowsState.length < 1}
              loading={loadings[1]}
              onClick={() => exportReimExcel(1)}
            >
              导出报销单Excel
            </Button>
            {/* <Button
              type="primary"
              onClick={() => {
                setShowReimDetail(true)
                setTitle('创建申请')
              }}
            >
              <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
            </Button > */}


            {/*<Button*/}
            {/*  type="primary"*/}
            {/*  disabled={selectedRowsState.length < 1}*/}
            {/*>*/}
            {/*  <FormattedMessage id="pages.searchTable.export" defaultMessage="Export" />*/}
            {/*</Button>*/}

            {
              path !== 'office' &&
              <Button
                type="primary"
                disabled={selectedRowsState.length < 1}
                onClick={handleShowEnter}
              >
                <FormattedMessage id="pages.searchTable.bulkPayouts" defaultMessage="Bulk Payouts" />
              </Button>
            }
          </>
        ]}
        columnEmptyText={false}
        form={{
          form
        }}
        rowSelection={{
          onChange: onRowSelected,
          fixed: 'left',
          columnWidth: 50
        }}
        request={onListData}
        columns={columns}
      />

      <Drawer
        width={1000}
        open={showReimDetail}
        onClose={handleCloseReimDetail}
        destroyOnClose={true}
        title={title}
      >
        <ReimDetail
          actionRef={actionRef}
          success={success}
          error={error}
          currentItem={currentItem}
          subType={subType}
          plats={plats}
          handleCloseReimDetail={handleCloseReimDetail}
        />
      </Drawer>

      <Drawer
        width={1400}
        open={separately}
        onClose={handleCloseSeparately}
        destroyOnClose={true}
        title={title}
      >
        <ReimbursementSeparately
          actionRef={actionRef}
          success={success}
          error={error}
          handleCloseSeparately={handleCloseSeparately}
          currentItem={currentItem}
        />
      </Drawer>

      <Drawer
        width={800}
        open={showDetail}
        onClose={handleCloseDetail}
        destroyOnClose={true}
        title="打款记录"
      >
        <Detail
          actionRef={actionRef}
          success={success}
          error={error}
          handleCloseDetail={handleCloseDetail}
          currentItem={currentItem}
        />
      </Drawer>

      <Drawer
        open={showEnter}
        onClose={handleCloseEnter}
        destroyOnClose={true}
        width={800}
        title="打款录入"
        maskClosable={false}
      >
        <Enter
          success={success}
          error={error}
          selectedRowsState={selectedRowsState}
          handleCloseEnter={handleCloseEnter}
          title={'打款录入'}
          currentItem={currentItem}
          path={path}
          currentTime={currentTime}
        />
      </Drawer>

      <Drawer
        open={showPayouts}
        onClose={handleClosePayouts}
        destroyOnClose={true}
        width={800}
      >
        <Payouts
          createTime={createTime}
          actionRef={actionRef}
          success={success}
          error={error}
        />
      </Drawer>

      <Modal
        open={showMonthPicker}
        onCancel={() => {
          setShowMonthPicker(false)
        }}
        title={'选择归属月'}
        onOk={() => {

          if (reimAt === '') {
            messageApi.open({
              type: 'error',
              content: '归属月是必填项',
            });
            return
          }

          confirm({
            title: '提示',
            icon: <ExclamationCircleFilled />,
            content: '您确定要执行批量提交吗？',
            onOk() {
              batchSubmitHandle()
            }
          });
        }}
        destroyOnClose={true}
      >
        <div style={{ marginTop: 12 }}>
          <span style={{ color: "red", fontSize: 20, marginRight: 6 }}>*</span>
          <DatePicker
            onChange={(e) => {
              setReimAt(e.format('YYYY-MM'))
            }}
            // disabledDate={(currentDate) => {
            //   // 获取当前月份的第一天
            //   const today = new Date();
            //   const firstDayOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            //
            //   // 如果当前日期在当前月份之前，则禁用
            //   return currentDate.isBefore(firstDayOfCurrentMonth, 'day');
            // }}
            picker="month"
          />
        </div>
      </Modal>
    </>
  )
}

export default ItemList
