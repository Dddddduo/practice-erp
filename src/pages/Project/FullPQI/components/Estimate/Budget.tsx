// 导入所需模块和依赖
import React, { useEffect, useState } from 'react';
import { Form, Input, Select, Table, Typography } from "antd";
import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { difference, includes, isEmpty } from "lodash";
import ShowFiles from "@/components/ShowFIles";
import UploadFiles from "@/components/UploadFiles";
import {formatToTwoDecimalPlaces, millennials, showButtonByType} from '@/utils/utils';


type MapType = { [key: string]: any };

interface BudgetProps {
  baseData: MapType
  tableData: MapType
  onTableChange: (type: string, index: string, col: string, value: any) => void
  onDelTableRow: (type: string, index: number) => void
  onAddTableRow: (type: string, index: number) => void
}

const Budget: React.FC<BudgetProps> = ({ baseData, tableData, onTableChange, onAddTableRow, onDelTableRow }) => {
  const [ctrUpload, setCtrUpload] = useState<any[]>([])
  useEffect(() => {

  }, [tableData, baseData]);

  const topColumns = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
    },
    {
      title: 'Item',
      dataIndex: 'item',
    },
    {
      title: 'col_0',
      dataIndex: 'col_0',
      render: (_, record, index) => {
        const tmpVal = tableData.top[index]?.col_0 ?? ''
        return (
          <div key={`top-col_0_${index}`} style={{ display: 'flex', flexDirection: 'row', color: "red" }}>
            <input style={{ width: 86, border: "none", borderBottom: "1px solid red" }} value={tmpVal} onChange={(e) => onTableChange('top', index, 'col_0', e.target.value)} /> {0 === index && '%'}
          </div>
        )
      }
    },
    {
      title: 'col_1',
      dataIndex: 'col_1',
      render: (_, record, index) => {
        const tmpVal = tableData.top[index]?.col_1 ?? ''
        if (0 === index) {
          return (
            <div key={`top-col_1_${index}`} style={{ display: 'flex', flexDirection: 'row' }}>
              <input style={{ width: 86, border: "none", borderBottom: "1px solid red" }} value={tmpVal} onChange={(e) => onTableChange('top', index, 'col_1', e.target.value)} /> {0 === index && '%'}
            </div>
          )
        }

        return <p key={`top-col_1_p_${index}`}>{millennials(tmpVal)}</p>
      }
    },
    {
      title: 'col_2',
      dataIndex: 'col_2',
      render: (_, record, index) => {
        const tmpVal = tableData.top[index]?.col_2 ?? ''
        if (0 === index) {
          return (
            <div key={`top-col_2_${index}`} style={{ display: 'flex', flexDirection: 'row' }}>
              <input style={{ width: 86, border: "none", borderBottom: "1px solid red" }} value={tmpVal} onChange={(e) => onTableChange('top', index, 'col_2', e.target.value)} /> {0 === index && '%'}
            </div>
          )
        }

        return <p key={`top-col_2_p_${index}`}>{millennials(tmpVal)}</p>
      }
    },
    {
      title: 'col_3',
      dataIndex: 'col_3',
      render: (_, record, index) => {
        const tmpVal = tableData.top[index]?.col_3 ?? ''
        if (0 === index) {
          return (
            <div key={`top-col_3_${index}`} style={{ display: 'flex', flexDirection: 'row' }}>
              <input style={{ width: 86, border: "none", borderBottom: "1px solid red" }} value={tmpVal} onChange={(e) => onTableChange('top', index, 'col_3', e.target.value)} /> {0 === index && '%'}
            </div>
          )
        }

        return <p key={`top-col_3_p_${index}`}>{millennials(tmpVal)}</p>
      }
    },
    {
      title: 'col_4',
      dataIndex: 'col_4',
      render: (_, record, index) => {
        const tmpVal = tableData.top[index]?.col_4 ?? ''
        if (0 === index) {
          return (
            <div key={`top-col_4_${index}`} style={{ display: 'flex', flexDirection: 'row' }}>
              <input style={{ width: 86, border: "none", borderBottom: "1px solid red" }} value={tmpVal} onChange={(e) => onTableChange('top', index, 'col_4', e.target.value)} /> {0 === index && '%'}
            </div>
          )
        }
        return <p key={`top-col_4_p_${index}`}>{millennials(tmpVal)}</p>
      }
    },
    {
      title: 'col_5',
      dataIndex: 'col_5',
      render: (_, record, index) => {
        const tmpVal = tableData.top[index]?.col_5 ?? ''
        if (0 === index) {
          return (
            <div key={`top-col_5_${index}`} style={{ display: 'flex', flexDirection: 'row' }}>
              <input style={{ width: 86, border: "none", borderBottom: "1px solid red" }} value={tmpVal} onChange={(e) => onTableChange('top', index, 'col_5', e.target.value)} /> {0 === index && '%'}
            </div>
          )
        }
        return <p key={`top-col_5_p_${index}`}>{millennials(tmpVal)}</p>
      }
    },
    {
      title: 'col_6',
      dataIndex: 'col_6',
      render: (_, record, index) => {
        const tmpVal = tableData.top[index]?.col_6 ?? ''
        if (0 === index) {
          return (
            <div key={`top-col_6_${index}`} style={{ display: 'flex', flexDirection: 'row' }}>
              <input style={{ width: 86, border: "none", borderBottom: "1px solid red" }} value={tmpVal} onChange={(e) => onTableChange('top', index, 'col_6', e.target.value)} /> {0 === index && '%'}
            </div>
          )
        }

        return <p key={`top-col_6_p_${index}`}>{millennials(tmpVal)}</p>
      }
    },
    {
      title: 'col_7',
      dataIndex: 'col_7',
      render: (_, record, index) => {
        const tmpVal = tableData.top[index]?.col_7 ?? ''
        if (0 === index) {
          return (
            <div key={`top-col_7_${index}`} style={{ display: 'flex', flexDirection: 'row' }}>
              <input style={{ width: 86, border: "none", borderBottom: "1px solid red" }} value={tmpVal} onChange={(e) => onTableChange('top', index, 'col_7', e.target.value)} /> {0 === index && '%'}
            </div>
          )
        }

        return <p key={`top-col_7_p_${index}`}>{millennials(tmpVal)}</p>
      }
    },
    {
      title: '操作',
      dataIndex: 'operate',
    },
  ];

  const columns4 = [
    {
      title: 'No',
      dataIndex: 'no',
      width: "8%"
    },
    {
      title: 'Item',
      dataIndex: 'item',
      width: "32%",
    },
    {
      title: 'Cost',
      dataIndex: 'cost',
      width: "25%",
      render: (_, record, index) => {
        const tmpVal = tableData.mid4[index]
        return (
          <div style={{ marginLeft: 20 }}>{millennials(tmpVal.cost)}</div>
        )
      }
    },
    {
      title: 'Operate',
      dataIndex: 'operate',
      width: "35%",
    }
  ];

  const getColumnsBy4n = (type) => {
    return [
      {
        title: 'No',
        dataIndex: 'no',
        width: "8%"
      },
      {
        title: 'Item',
        dataIndex: 'item',
        width: "32%",
        render: (_, record, index) => {
          const tmpVal = tableData[type][index]
          return (
            <div key={`${type}_item_test_${index}`}>
              {tmpVal.item}
              {index > 0 && <input style={{ width: "65%", border: "none", borderBottom: "1px solid red", marginLeft: 10 }} key={`${type}_item_input_${index}`} value={tmpVal.costDetail}
                onChange={(e) => onTableChange(type, index, 'item', e.target.value)} />}
            </div>
          )
        }
      },
      {
        title: 'Cost',
        dataIndex: 'cost',
        width: "25%",
        render: (_, record, index) => {
          const tmpVal = tableData[type][index]
          if (0 === index) {
            return <div style={{ marginLeft: 20 }} key={`${type}_cost_text_${index}`}>{millennials(tmpVal.cost)}</div>
          }

          return index > 0 && <input style={{ width: 112, border: "none", borderBottom: "1px solid red", marginLeft: 20 }} key={`${type}_cost_input_${index}`} value={tmpVal.cost}
            onChange={(e) => onTableChange(type, index, 'cost', e.target.value)} />
        }
      },
      {
        title: 'Operate',
        dataIndex: 'operate',
        width: "35%",
        render: (_, record, index) => {
          return (
            <div>
              <PlusCircleOutlined key={`${type}_cost_operate_1_${index}`} style={{ marginRight: 8 }} onClick={() => onAddTableRow(type, index)} />
              {index > 0 && <MinusCircleOutlined key={`${type}_cost_operate_2_${index}`} onClick={() => onDelTableRow(type, index)} />}
            </div>
          )
        },
      }
    ]
  }

  const bottomColumns = [
    {
      title: 'No',
      dataIndex: 'no',
      width: "8%",
    },
    {
      title: 'Item',
      dataIndex: 'item',
      width: "32%",
      render: (_, record, index) => {
        const tmpVal = tableData['bottom'][index]
        return <span>
          {record.no === '4-5' ? 'Project Manger Salary(RMB/Day）' : record.item}
          {record.no === '4-5' || record.no === '4-6' ?
            <input style={{ width: 112, border: "none", borderBottom: "1px solid red", marginLeft: 20 }} key={`bottom_item_input_${index}`} value={tmpVal.costDetail}
              onChange={(e) => onTableChange('bottom', index, 'item', e.target.value)} /> : ''}
        </span>
      },
    },
    {
      title: 'Cost',
      dataIndex: 'cost',
      width: "25%",
      render: (_, record, index) => {
        const tmpVal = tableData['bottom'][index]
        return <input style={{ width: 112, border: "none", borderBottom: "1px solid red", marginLeft: 20 }} key={`bottom_cost_input_${index}`} value={tmpVal.cost} disabled={record.no === '4-5'}
          onChange={(e) => onTableChange('bottom', index, 'cost', e.target.value)} />
      },
    },
    {
      title: 'Operate',
      dataIndex: 'operate',
      width: "35%",
    }
  ]

  const createDevColumns = [
    {
      title: '设备类型',
      dataIndex: 'equipment_id',
      align: "center",
      width: "35%",
      render: (_, record, index) => {
        const tmpVal = tableData['dev'][index]
        return (
          <Select
            key={`equipment_id_${index}`}
            mode="tags"
            style={{ width: '85%' }}
            placeholder="请选择设备"
            value={isEmpty(tmpVal.equipment_id) ? tmpVal.equipment_id : tmpVal.equipment_id.toString()}
            maxCount={1}
            onChange={(e, value) => onTableChange('dev', index, 'equipment_id', value)}
            options={baseData.equipmentList}
          />
        )
      },
    },
    {
      title: '数量',
      dataIndex: 'detail',
      align: "center",
      width: "35%",
      render: (_, record, index) => {
        const tmpVal = tableData['dev'][index]
        return (
          <input style={{ display: "block", margin: "0 auto", width: "65%", borderRadius: "20", border: "1px solid #d9d9d9" }} key={`equipment_detail_${index}`} value={tmpVal.detail} onChange={(e) => onTableChange('dev', index, 'detail', e.target?.value)} />
        )
      },
    },
    {
      title: '操作',
      align: "center",
      dataIndex: 'operate',
      render: (_, record, index) => {
        return (
          <div>
            {/*onAddTableRow(type, index, 'add')*/}
            <PlusCircleOutlined key={`dev_cost_operate_1_${index}`} style={{ marginRight: 8 }} onClick={() => onAddTableRow('dev', index)} />
            {/*onDelTableRow(type, index, 'del')*/}
            {index > 0 && <MinusCircleOutlined key={`dev_cost_operate_2_${index}`} onClick={() => onDelTableRow('dev', index)} />}
          </div>
        )
      },
    }
  ];

  const uploadMappings = {
    annexDownloadOnly:
      <ShowFiles
        fileIds={!isEmpty(baseData) && (isEmpty(baseData?.projectInfo?.file_ids) ? '' : baseData.projectInfo.file_ids)}
      />,
    upload:
    <Form.Item name="file_ids">
      <UploadFiles
        key="UploadFiles"
        value={!isEmpty(baseData) && (isEmpty(baseData?.projectInfo?.file_ids) ? '' : baseData.projectInfo.file_ids)}
        onChange={() => {
        }}
      />
    </Form.Item>
  }

  useEffect(() => {
    showButtonByType(uploadMappings, 'fullPQI', 'submit', uploadMappings.upload).then(r => {
      console.log("r", r)
      setCtrUpload(r)
    })
  }, [baseData])

  return (
    <>
      <Typography.Title key={"title_c"} level={4} style={{ marginTop: 20, marginBottom: 20 }}>创建设备</Typography.Title>
      <Table
        rowKey={record => record.equipment_id}
        key="createDevTable"
        columns={createDevColumns}
        dataSource={tableData.dev}
        pagination={false}
        showHeader={true}
        bordered
      />
      <Typography.Title level={4} style={{ marginTop: 20, marginBottom: 20 }}>创建预算</Typography.Title>
      <Table
        key="topTable"
        columns={topColumns}
        dataSource={tableData.top}
        pagination={false}
        showHeader={false}
        bordered
        title={() => (
          <div
            style={{
              textAlign: 'center',
              color: 'red',
              fontWeight: 700
            }}>
            Rate of Profit（Bidding price）
          </div>
        )}
      />
      <Table
        key="table4"
        columns={columns4}
        dataSource={tableData.mid4}
        pagination={false}
        showHeader={false}
        bordered
      />
      <Table
        key="table41"
        columns={getColumnsBy4n('mid41')}
        dataSource={tableData.mid41}
        pagination={false}
        showHeader={false}
        bordered
      />
      <Table
        key="table42"
        columns={getColumnsBy4n('mid42')}
        dataSource={tableData.mid42}
        pagination={false}
        showHeader={false}
        bordered
      />
      <Table
        key="table43"
        columns={getColumnsBy4n('mid43')}
        dataSource={tableData.mid43}
        pagination={false}
        showHeader={false}
        bordered
      />
      <Table
        key="bottomTable"
        columns={bottomColumns}
        dataSource={tableData.bottom}
        pagination={false}
        showHeader={false}
        bordered
      />
      <Typography.Title level={4} style={{ marginTop: 20, marginBottom: 20 }}>上传合同/附件</Typography.Title>
      {[...ctrUpload]}
    </>
  )
}
  ;

export default Budget;
