// 导入所需模块和依赖
import React, {Dispatch} from 'react';
import {EstimateAction} from "@/pages/Project/ProjectPQI/store/estimate";
import {Form, Input, Table, Typography} from "antd";
import {MinusCircleOutlined, PlusCircleOutlined} from "@ant-design/icons";


type MapType = { [key: string]: any };

// onSubBudgetAdd={subBudgetAdd}
// onSubBudgetRemove={subBudgetRemove}
// Content组件定义
const Budget: React.FC<{
    fullState: MapType,
    dispatch: Dispatch<EstimateAction>,
    onSubBudgeHandle: (string, number, string) => void
  }> = ({
          fullState: {commonData},
          dispatch,
          onSubBudgeHandle,
        }) => {

    const tableTopColumns = [
      {
        title: 'No',
        dataIndex: 'no',
      },
      {
        title: 'Item',
        dataIndex: 'item',
      },
      {
        title: 'col_0',
        dataIndex: 'col_0',
      },
      {
        title: 'col_1',
        dataIndex: 'col_1',
      },
      {
        title: 'col_2',
        dataIndex: 'col_2',
      },
      {
        title: 'col_3',
        dataIndex: 'col_3',
      },
      {
        title: 'col_4',
        dataIndex: 'col_4',
      },
      {
        title: 'col_5',
        dataIndex: 'col_5',
      },
      {
        title: 'col_6',
        dataIndex: 'col_6',
      },
      {
        title: 'col_7',
        dataIndex: 'col_7',
      },
      {
        title: '操作',
        dataIndex: 'operate',
      },
    ];

    const columns4 = [
      {
        title: 'No',
        dataIndex: 'no'
      },
      {
        title: 'Item',
        dataIndex: 'item',
      },
      {
        title: 'Cost',
        dataIndex: 'cost',
      },
      {
        title: 'Operate',
        dataIndex: 'operate',
      }
    ];

    const columns41 = [
      {
        title: 'No',
        dataIndex: 'no',
        render: (_, record, index) => {
          return (
            <div style={{display: 'flex', flexDirection: 'row'}}>
              {<Form.Item
                name={['cost41', index, 'no']}
              >
                <input disabled/>
              </Form.Item>
              }

            </div>
          )
        }
      },
      {
        title: 'Item',
        dataIndex: 'item',
        render: (_, record, index) => {
          return (
            <div style={{display: 'flex', flexDirection: 'row'}}>
              <span>Vendor's Cost</span>
              {<Form.Item
                name={['cost41', index, 'vendor']}
              >
                <Input/>
              </Form.Item>
              }

            </div>
          )
        }
      },
      {
        title: 'Cost',
        dataIndex: 'cost',
        render: (_, record, index) => {
          return (
            <Form.Item
              key={`${record.no}-${index}`}
              name={['cost41', index, 'cost']}
            >
              <Input disabled={index < 1} />
            </Form.Item>
          );
        }
      },
      {
        title: 'Operate',
        dataIndex: 'operate',
        render: (_, record, index) => {
          return (
            <div>
              <PlusCircleOutlined style={{marginRight: 8}} onClick={() => onSubBudgeHandle('4-1', index, 'add')}/>
              {record.no !== '4-1' && <MinusCircleOutlined onClick={() => onSubBudgeHandle('4-1', index, 'del')}/>}
            </div>
          )
        },
      }
    ];

    const columns42 = [
      {
        title: 'No',
        dataIndex: 'no',
        render: (_, record, index) => {
          return (
            <div style={{display: 'flex', flexDirection: 'row'}}>
              {<Form.Item
                name={['cost42', index, 'no']}
              >
                <input disabled/>
              </Form.Item>
              }

            </div>
          )
        }
      },
      {
        title: 'Item',
        dataIndex: 'item',
        render: (_, record, index) => {
          return (
            <div style={{display: 'flex', flexDirection: 'row'}}>
              <span>{record.item}</span>
              {index > 0 && <Form.Item
                name={['item42', index]}
              >
                <Input/>
              </Form.Item>
              }

            </div>
          )
        }
      },
      {
        title: 'Cost',
        dataIndex: 'cost',
        render: (_, record, index) => {
          return (
            <Form.Item
              name={['cost42', index]}
              key={`${record.no}-${index}`}
            >
              <Input disabled={index < 1}/>
            </Form.Item>
          );
        }
      },
      {
        title: 'Operate',
        dataIndex: 'operate',
        render: (_, record, index) => {
          console.log('render', index, record)
          return (
            <div>
              <PlusCircleOutlined style={{marginRight: 8}} onClick={() => onSubBudgeHandle('4-2', index, 'add')}/>
              {record.no !== '4-2' && <MinusCircleOutlined onClick={() => onSubBudgeHandle('4-2', index, 'del')}/>}
            </div>
          )
        },
      }
    ];

    const columns43 = [
      {
        title: 'No',
        dataIndex: 'no'
      },
      {
        title: 'Item',
        dataIndex: 'item',
        render: (_, record, index) => {
          return (
            <div style={{display: 'flex', flexDirection: 'row'}}>
              <span>{record.item}</span>
              {index > 0 && <Form.Item
                name={['item43', index]}
              >
                <Input/>
              </Form.Item>
              }

            </div>
          )
        }
      },
      {
        title: 'Cost',
        dataIndex: 'cost',
        render: (_, record, index) => {
          return (
            <Form.Item
              name={['cost43', index]}
              key={`${record.no}-${index}`}
            >
              <Input disabled={index < 1}/>
            </Form.Item>
          );
        }
      },
      {
        title: 'Operate',
        dataIndex: 'operate',
        render: (_, record, index) => {
          console.log('render', index, record)
          return (
            <div>
              <PlusCircleOutlined style={{marginRight: 8}} onClick={() => onSubBudgeHandle('4-3', index, 'add')}/>
              {record.no !== '4-3' && <MinusCircleOutlined onClick={() => onSubBudgeHandle('4-3', index, 'del')}/>}
            </div>
          )
        },
      }
    ];

    return (
      <>
        <Typography.Title level={4} style={{marginTop: 20, marginBottom: 20}}>创建预算</Typography.Title>
        <Table
          key="topTable"
          columns={tableTopColumns}
          dataSource={commonData.tableTopDateList}
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
        {/*4*/}
        <Table
          key="table4"
          columns={columns4}
          dataSource={commonData.data4}
          pagination={false}
          showHeader={false}
          bordered
        />

        {/*4-1*/}
        <Table
          key="table41"
          columns={columns41}
          dataSource={commonData.data41}
          pagination={false}
          showHeader={false}
          bordered
        />
        {/*4-2*/}
        <Table
          key="table42"
          columns={columns42}
          dataSource={commonData.data42}
          pagination={false}
          showHeader={false}
          bordered
        />
        {/*4-3*/}
        <Table
          key="table43"
          columns={columns43}
          dataSource={commonData.data43}
          pagination={false}
          showHeader={false}
          bordered
        />
        {/*4-4 ~ 4-8*/}
      </>
    );

// 组件的其他部分（如状态管理和事件处理函数）保持不变
  }
;

export default Budget;
