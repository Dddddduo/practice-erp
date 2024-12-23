// 导入所需模块和依赖
import React, {Dispatch, useEffect, useState} from 'react';
import {isEmpty, values} from 'lodash';
import {
  ProForm,
  ProFormText,
  ProFormSelect,
  ProFormDateRangePicker,
} from '@ant-design/pro-components';
import {Button, DatePicker, Form, Input, message, Select, Space, Table} from 'antd';
import {MinusCircleOutlined, PlusCircleOutlined, PlusOutlined} from '@ant-design/icons';
import moment from 'dayjs';
import {ProFormDigit} from "@ant-design/pro-form";
import {useForm} from "antd/es/form/Form";
import {EstimateAction} from "@/pages/Project/ProjectPQI/store/estimate";
import dayjs from "dayjs";

// 假设的brandMap、projectTypeMap、projectStatusMap的类型定义
type MapType = { [key: string]: any };

// Content组件定义
const SubBudget: React.FC<{ fullState: MapType, dispatch: Dispatch<EstimateAction> }> = () => {
    const columns = [
      {
        title: 'No',
        dataIndex: 'no'
      },
      {
        title: 'Item',
        dataIndex: 'item'
      },
      {
        title: 'Cost',
        dataIndex: 'cost',
      },
      {
        title: 'Operate',
        dataIndex: 'operate',
        render: (_, record) => (
          <div>
            <PlusCircleOutlined  style={{ marginRight: 8 }} />
            {record.key !== '1-1' && <MinusCircleOutlined  />}
          </div>
        ),
      }
    ];

    const data = [
      {
        no: '4-1',
        item: "Vendor's cost",
        cost: 200,
      },
    ];
    return (
      <>
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          showHeader={false}
          bordered
        />
      </>
    );

// 组件的其他部分（如状态管理和事件处理函数）保持不变
  }
;

export default SubBudget;
