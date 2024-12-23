import React, { RefObject, useState } from "react"
import type { ActionType, ParamsType } from "@ant-design/pro-components";
import { ProTable, ProColumns } from "@ant-design/pro-components";
import { useIntl, FormattedMessage } from "@umijs/max";
import { Button, Drawer, Form, Tag } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import CreateOrUpdate from "./CreateOrUpdate";
import Detail from "./Detail";


const types = [
  { val: 'alone', label: '单独请款' },
  { val: 'pqi_coll', label: 'PQI请款' },
  // { val: 'pqi_cost', label: 'PQI成本' },
  { val: 'from_quo', label: '报价单' },
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

interface ItemListProps {
  onListData: HandleListDataFunc;
  actionRef: RefObject<ActionType>;
  success: (text: string) => void
  error: (text: string) => void
}

const ItemList: React.FC<ItemListProps> = ({
  onListData,
  actionRef,
  success,
  error,
}) => {

  const intl = useIntl()
  const [currentItem, setCurrentItem] = useState({})
  const [showCreateOrUpdate, setShowCreateOrUpdate] = useState(false)
  const [showDetail, setShowDetail] = useState(false)

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
      search: false,
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
      title: (
        <FormattedMessage
          id="maintenanceDepartmentParams.field.messrs"
          defaultMessage="M E S S R S"
        />
      ),
      dataIndex: 'messrs',
      align: 'center',
      search: false,
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
        acc[`${item.value}`] = { text: item.label }
        return acc
      }, {})
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
      dataIndex: 'amount',
      align: 'center',
      search: false,
      render: (dom, entity) => {
        return (
          <>
            {
              entity.detail_list.reduce((acc, item) => acc + Number(item.amount), 0)
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
              (
                Number(entity.detail_list.reduce((acc, item) => acc + Number(item.amount), 0)) *
                (Number(entity.tax_rate) / 100)
              ).toFixed(2)
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
      dataIndex: 'amount',
      align: 'center',
      search: false,
      render: (dom, entity) => {
        return (
          <>
            {
              (
                Number(entity.detail_list.reduce((acc, item) => acc + Number(item.amount), 0)) +
                Number(entity.detail_list.reduce((acc, item) => acc + Number(item.amount), 0)) *
                (Number(entity.tax_rate) / 100)
              ).toFixed(2)
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
      search: false,
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
    {
      title: (
        <FormattedMessage
          id="maintenanceDepartmentParams.field.invoice_time"
          defaultMessage="发票日期"
        />
      ),
      dataIndex: 'invoice_time',
      align: 'center',
      search: false,
      render: (dom, entity) => {
        return (
          <div>
            {
              entity.detail_list[0].invoice_at
            }
          </div>
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="maintenanceDepartmentParams.field.invoice_no"
          defaultMessage="发票号"
        />
      ),
      dataIndex: 'invoice_no',
      align: 'center',
      search: false,
      render: (dom, entity) => {
        return (
          <div>
            {
              entity.detail_list[0].invoice_no
            }
          </div>
        )
      }
    },
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
        title: '收款状态'
      },
      valueType: 'select',
      valueEnum: coll_yes_or_no.reduce((acc, item) => {
        acc[`${item.value}`] = { text: item.label }
        return acc
      }, {}),
      fieldProps: {
        showSearch: true
      },
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
            {
              types.find(item => item.val === entity.type)?.label
            }
            {
              entity.trd_no !== '' &&
              <a> | {entity.trd_no}</a>
            }
          </>
        )
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
              entity.detail_list.map(item => {
                return (
                  <div key={item.id} style={entity.detail_list.length > 0 ? { margin: 10 } : {}}>
                    <span style={{ marginRight: 15 }}>
                      公司：{entity.detail_list[0].company_name}&nbsp;&nbsp;&nbsp;&nbsp;
                      金额：{Number(entity.detail_list.reduce((acc, item) => acc + Number(item.amount), 0)).toFixed(2)}
                    </span>
                    <span>
                      <Tag color="blue" style={{ cursor: 'pointer' }} onClick={() => {
                        setCurrentItem(item)
                        setShowDetail(true)
                      }}>查看记录</Tag>
                    </span>
                  </div>
                )
              })
            }

          </>
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="maintenanceDepartmentParams.field.action"
          defaultMessage="操作"
        />
      ),
      dataIndex: 'action',
      align: 'center',
      search: false,
      fixed: 'right',
      width: 200,
      render: (dom, entity) => {
        return (
          <Button type="primary" onClick={() => {
            setCurrentItem(entity)
            setShowCreateOrUpdate(true)
          }}>查看</Button>
        )
      }
    },
  ]

  const handleCloseCreateOrUpdate = () => {
    setCurrentItem({})
    setShowCreateOrUpdate(false)
  }

  const handleCloseDetail = () => {
    setCurrentItem({})
    setShowDetail(false)
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
          <Button
            type="primary"
            key="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setShowCreateOrUpdate(true);
            }}
          >
            <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          </Button>,
        ]}
        request={onListData}
        columns={columns}
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
    </>
  )
}

export default ItemList
