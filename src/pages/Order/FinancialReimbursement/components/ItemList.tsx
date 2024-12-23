import React, { RefObject, useEffect, useState } from "react"
import type { ActionType, ParamsType } from "@ant-design/pro-components";
import { ProTable, ProColumns } from "@ant-design/pro-components";
import { useIntl, FormattedMessage } from "@umijs/max";
import { Button, Space, Tag, Form, Drawer } from "antd";
import { approveFinanceReim, getFinanceReimStatusMap } from "@/services/ant-design-pro/financialReimbursement";
import { isEmpty } from "lodash";
import { getWorkerList } from "@/services/ant-design-pro/report";
import { getUserList } from "@/services/ant-design-pro/pushManagement";
import ReimDetail from "./ReimDetail";
import ReimbursementSeparately from "./ReimbursementSeparately";
import Detail from "./Detail";

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
  actionRef: RefObject<ActionType>;
  success: (text: string) => void
  error: (text: string) => void
}

const settlementType = [
  { value: 'full-time-qiyedidi', label: '全职 - 企业滴滴', desc: '结算周期：上一个自然月，用于企业滴滴对账' },
  { value: 'full-time-huolala', label: '全职 - 货拉拉', desc: '结算周期：用于结算本公司工人货拉拉' },
  { value: 'part-time-labor-cost', label: '兼职 - 人工费', desc: '结算周期：上周四 ~ 本周五，用于结算兼职人工费' },
  { value: 'full-time-materials-cost', label: '全职 - 材料费', desc: '结算周期：上月21日 ~ 本月20日，用于结算本公司工人材料费' },
  { value: 'liuyunfei-part-time', label: '刘云飞 - 下属', desc: '结算周期：上一个自然月，用于刘云飞下属兼职工人（不含刘云飞）结算上个月的费用' },
  { value: 'lixiaohai-pay-for-business', label: '李小海 - 对公', desc: '结算周期：上月16日 ~ 本月15日，用于李小海及其下属兼职工人结算上个月的费用' },
  { value: 'changyangfan-pay-for-business', label: '畅扬帆 - 对公', desc: '结算周期：上一个自然月，用于畅扬帆及其下属兼职工人结算上个月的费用' },
  { value: 'other-pay-for-business', label: '其它报销对公打款  ', desc: '结算周期：上周四 ~ 本周五，用于结算其他供应商费用' },
]

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
  error
}) => {
  const [form] = Form.useForm()
  const intl = useIntl()
  const [reimStatus, setReimStatus] = useState<{ status: string, status_cn: string }[]>([])
  const [showPayeePeople, setShowPayeePeople] = useState<any>(false)
  const [type, setType] = useState<any>('text')
  const [peopleList, setPeopleList] = useState<{
    value: number
    label: string
  }[]>([])
  const [currentItem, setCurrentItem] = useState({})
  const [showReimDetail, setShowReimDetail] = useState<boolean>(false)
  const [separately, setSeparately] = useState<boolean>(false)
  const [title, setTitle] = useState<string>('')
  const [showDetail, setShowDetail] = useState(false)

  const columns: ProColumns<API.FinancialReimbursementParams>[] = [
    {
      title: (
        <FormattedMessage
          id="financialReimbursement.field.id"
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
          id="financialReimbursement.field.type"
          defaultMessage="结算类型"
        />
      ),
      dataIndex: 'type',
      hideInTable: true,
      valueType: 'select',
      valueEnum: settlementType.reduce((acc, item) => {
        acc[`${item.value}`] = { text: item.label }
        return acc
      }, {}),
      fieldProps: {
        showSearch: true
      }
    },
    {
      title: (
        <FormattedMessage
          id="financialReimbursement.field.payee"
          defaultMessage="收款方"
        />
      ),
      dataIndex: 'payee',
      hideInTable: true,
      valueType: 'select',
      valueEnum: plats.reduce((acc, item) => {
        acc[`${item.value}`] = { text: item.label }
        return acc
      }, {}),
      fieldProps: {
        showSearch: true,
        onChange: (key, option) => {
          form.setFieldsValue({ payeePeople: undefined })
          if (isEmpty(key) && isEmpty(option)) {
            setShowPayeePeople(false)
            return
          }
          setShowPayeePeople(true)
          if (key === 'worker' || key === 'supplier') {
            setPeopleList([])
            setType('select')
            if (key === 'worker') {
              getWorkerList().then(res => {
                if (res.success) {
                  const format = res.data.map(item => {
                    return {
                      value: item.worker_id,
                      label: item.name
                    }
                  })
                  setPeopleList(format)
                }
              })
            }
            if (key === 'supplier') {
              getUserList().then(res => {
                if (res.success) {
                  const format = res.data.map(item => {
                    return {
                      value: item.uid,
                      label: item.name_cn
                    }
                  })
                  setPeopleList(format)
                }
              })
            }
            return
          }
          setType('text')
        },
      },
    },
    {
      dataIndex: 'payeePeople',
      hideInTable: true,
      search: showPayeePeople,
      valueType: type,
      valueEnum: type === 'select' ? peopleList.reduce((acc, item) => {
        acc[`${item.value}`] = { text: item.label }
        return acc
      }, {}) : undefined
    },
    {
      title: (
        <FormattedMessage
          id="financialReimbursement.field.person"
          defaultMessage="申请人"
        />
      ),
      dataIndex: 'person',
      search: false,
      align: 'center',
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
        <FormattedMessage
          id="financialReimbursement.field.create_at"
          defaultMessage="申请时间"
        />
      ),
      dataIndex: 'create_at',
      align: 'center',
      valueType: 'dateRange',
      render: (dom, entity) => {
        return (
          <div>
            {entity.create_at}
          </div>
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="financialReimbursement.field.approve_at"
          defaultMessage="审批时间"
        />
      ),
      dataIndex: 'approve_at',
      align: 'center',
      valueType: 'dateRange',
      render: (dom, entity) => {
        return (
          <div>
            {entity.approve_at}
          </div>
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="financialReimbursement.field.department"
          defaultMessage="部门"
        />
      ),
      dataIndex: 'department',
      align: 'center',
      search: false
    },
    {
      title: (
        <FormattedMessage
          id="financialReimbursement.field.reimType"
          defaultMessage="报销类型"
        />
      ),
      dataIndex: 'reimType',
      align: 'center',
      valueType: 'select',
      valueEnum: allType.reduce((acc, item) => {
        acc[`${item.value}`] = { text: item.label }
        return acc
      }, {}),
      fieldProps: {
        showSearch: true
      },
      render: (dom, entity) => {
        return (
          <div>
            {
              entity.type === "alone" ?
                <div>alone</div> :
                <>
                  {/* {entity.department}部-
                  {
                    entity.type === 'fm_worker_reim' && <span>工人报销</span>
                  }
                  {
                    entity.type === 'fm_vendor_reim' && <span>对公报销</span>
                  }
                  {
                    entity.type === 'fm-alone' && <span>单独报销</span>
                  } */}
                  {
                    allType.find(item => item.value === entity.type)?.label
                  }
                  {
                    entity.trd_no !== '' && <span> | </span>
                  }
                  <a>{entity.trd_no}</a>
                </>
            }

          </div>
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="financialReimbursement.field.detail"
          defaultMessage="明细"
        />
      ),
      dataIndex: 'detail',
      align: 'center',
      valueType: 'select',
      valueEnum: subType.reduce((acc, item) => {
        acc[`${item.value}`] = { text: item.label }
        return acc
      }, {}),
      fieldProps: {
        showSearch: true
      },
      render: (dom, entity) => {
        return (
          <div>
            {
              entity.detail_list.map(item => {
                return (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center' }}>
                    <span>
                      <Tag color="skyblue" style={{ cursor: 'pointer', margin: 5 }} onClick={() => {
                        setShowDetail(true)
                        setCurrentItem(item)
                      }} >查看记录</Tag>
                    </span>
                    <span>
                      【类型：{item.reim_type}】
                      【账号：{item.name_cn}】
                      【开户行：{item.bank_name}】
                      【银行卡号：{item.bank_no}】
                      【金额：{item.amount}】
                    </span>
                  </div>
                )
              })
            }
          </div>
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="financialReimbursement.field.status"
          defaultMessage="状态"
        />
      ),
      dataIndex: 'status_cn',
      align: 'center',
      valueType: 'select',
      valueEnum: reimStatus?.reduce((acc, item) => {
        acc[`${item.status}`] = { text: item.status_cn }
        return acc
      }, {}),
      fieldProps: {
        showSearch: true
      },
    },
    {
      title: (
        <FormattedMessage
          id="financialReimbursement.field.remark"
          defaultMessage="备注"
        />
      ),
      dataIndex: 'remark',
      align: 'center',
      search: false,
    },
    {
      title: (
        <FormattedMessage
          id="financialReimbursement.field.action"
          defaultMessage="操作"
        />
      ),
      dataIndex: 'action',
      align: 'center',
      fixed: 'right',
      search: false,
      render: (dom, entity) => {
        return (
          <>
            {
              entity.department !== 'finance' &&
              <Space>
                {
                  (entity.status === 'submit' || entity.status === 'reject') &&
                  entity.department !== 'finance' &&
                  <Button type="primary" onClick={() => handleAction(entity, 'approved')}>通过</Button>
                }
                {
                  (entity.status === 'submit' || entity.status === 'approve') &&
                  entity.department !== 'finance' &&
                  <Button type="primary" onClick={() => handleAction(entity, 'reject')}>驳回</Button>
                }
                {
                  entity.department !== 'finance' &&
                  <Button type="primary" onClick={() => {
                    if (entity.type === 'fm-alone') {
                      setCurrentItem(entity)
                      setSeparately(true)
                      setTitle('单独报销')
                    } else {
                      setCurrentItem(entity)
                      setShowReimDetail(true)
                      setTitle('查看详情')
                    }
                  }}>查看</Button>
                }
              </Space>
            }
          </>
        )
      }
    },
  ]

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

  const handleCloseReimDetail = () => {
    setTitle('')
    setCurrentItem({})
    setShowReimDetail(false)
  }

  const handleCloseSeparately = () => {
    setTitle('')
    setCurrentItem({})
    setSeparately(false)
  }

  const handleCloseDetail = () => {
    setCurrentItem({})
    setShowDetail(false)
  }

  useEffect(() => {
    getFinanceReimStatusMap({ role_type: 'm' }).then(res => {
      if (res.success) {
        setReimStatus(res.data)
      }
    })


    // const department = location.state?.department;
    // const department = meta.department;
    // const department_cn = meta.department_cn;
    // console.log(department);

  }, [])

  return (
    <>
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
        toolBarRender={() => [
          <>
            <Button
              type="primary"
              onClick={() => {
                setSeparately(true)
                setTitle('单独报销')
              }}
            >
              <FormattedMessage id="pages.searchTable.separateReimbursement" defaultMessage="Separate reimbursement" />
            </Button >
            <Button
              type="primary"
              onClick={() => {
                setShowReimDetail(true)
                setTitle('创建申请')
              }}
            >
              <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
            </Button >
          </>
        ]}
        columnEmptyText={false}
        form={{
          form
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
        width={1000}
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
      >
        <Detail
          actionRef={actionRef}
          success={success}
          error={error}
          handleCloseDetail={handleCloseDetail}
          currentItem={currentItem}
        />
      </Drawer>
    </>
  )
}

export default ItemList
