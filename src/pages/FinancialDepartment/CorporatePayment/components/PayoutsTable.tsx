import React from "react"
import { BaseData } from "@/viewModel/FinancialDepartment/useCorporatePayment"
import { Table, Typography } from "antd"

interface PayoutsTableParams {
  baseData: BaseData
}

const PayoutsTable: React.FC<PayoutsTableParams> = ({
  baseData
}) => {
  const { Text } = Typography;
  const columns: {}[] = [
    {
      title: "序号",
      dataIndex: "coll_name",
      align: 'center',
      render: (_, row, index) => <>{index + 1}</>
    },
    {
      title: "公司",
      dataIndex: "coll_name",
      align: 'center',
    },
    {
      title: "申请人",
      dataIndex: "create_name_cn",
      align: 'center',
    },
    {
      title: "税前金额",
      dataIndex: "ex_amount",
      align: 'center',
    },
    {
      title: "税后金额",
      dataIndex: "in_amount",
      align: 'center',
    },
    {
      title: "税额",
      dataIndex: "tax_amount",
      align: 'center',
    },
    {
      title: "税率",
      dataIndex: "tax_rate",
      align: 'center',
      render: (_, row) => {
        return (
          <>
            {
              row.tax_rate ?
                parseFloat(row.tax_rate).toFixed(2) + '%' :
                ''
            }
          </>
        )
      }
    },
    {
      title: '备注',
      dataIndex: 'remark',
      align: 'center',
      render: (_, row) => (
        <Text
          style={{ width: 100 }}
          ellipsis={{ tooltip: row.remark }}
        >
          {row.remark}
        </Text>
      )
    },
  ]
  return (
    <Table
      dataSource={baseData.currentDataList[baseData.currentRow.index - 1]?.items}
      pagination={false}
      columns={columns}
      scroll={{ x: 'max-content' }}
    />
  )
}

export default PayoutsTable