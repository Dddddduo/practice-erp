// 导入所需模块和依赖
import React, {useEffect} from 'react';
import {DatePicker, Form, Input, Select, Space, Typography} from "antd";
import {MinusCircleOutlined, PlusCircleOutlined} from "@ant-design/icons";


type MapType = { [key: string]: any };
interface ContentProps {
  baseData: MapType,
  historyData: MapType[],
  options: []
}


// Content组件定义
const Content: React.FC<ContentProps> = ({baseData, historyData}) => {
    const {RangePicker} = DatePicker;

    const brandOptions = baseData.brandMap && Object.keys(baseData.brandMap).map((key) => {
      return {
        label: baseData.brandMap[key] ?? '', // 显示的名称
        value: key,
      }
    });

    const projectTypeOptions = baseData.projectTypeMap && Object.keys(baseData.projectTypeMap).map(key => ({
      value: key,
      label: baseData.projectTypeMap[key]
    }))

    const projectStatusOptions = baseData.projectStatusMap && Object.keys(baseData.projectStatusMap).map(key => ({
      value: key,
      label: baseData.projectStatusMap[key]
    }))

    const filterOptionHandle = (input, option) => (option?.label ?? '').toString().includes(input)
    const filterSortHandle = (optionA, optionB) =>
      (optionA?.label ?? '').toString().toLowerCase().localeCompare((optionB?.label ?? '').toString().toLowerCase())

    return (
      <>
        <Form.Item label="历史版本" name="back_id">
          <Select
            options={historyData}
            filterOption={filterOptionHandle}
            filterSort={filterSortHandle}
            showSearch
            allowClear
          />
        </Form.Item>

        <Typography.Title level={4} style={{marginTop: 20, marginBottom: 20}}>项目内容</Typography.Title>
        <Form.Item label="项目编号" name="project_no">
          <Input disabled/>
        </Form.Item>
        <Form.Item label="品牌" name="brand_id">
          <Select
            options={brandOptions}
            showSearch
            filterOption={filterOptionHandle}
            filterSort={filterSortHandle}
          />
        </Form.Item>
        <Form.Item label="项目名称" name="project_name">
          <Input/>
        </Form.Item>
        <Form.Item label="项目类型" name="project_type_id">
          <Select
            options={projectTypeOptions}
            filterOption={filterOptionHandle}
            filterSort={filterSortHandle}
            showSearch
          />
        </Form.Item>
        <Form.Item label="项目状态" name="project_status_id">
          <Select
            showSearch
            options={projectStatusOptions}
            filterOption={filterOptionHandle}
            filterSort={filterSortHandle}
          />
        </Form.Item>
        <Form.List name="time_ranges">
          {(fields, {add, remove}) => (
            <>
              {fields.map(({key, name, ...restField}, index) => {
                return (
                  <Space key={key} style={{display: 'flex', marginBottom: 8}} align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name, 'date']}
                      label={index === 0 ? '开工/完工日期' : ''}
                    >
                      <RangePicker />
                    </Form.Item>
                    {fields.length > 1 ? (
                      <MinusCircleOutlined onClick={() => remove(name)}/>
                    ) : null}
                    <PlusCircleOutlined onClick={() => add(undefined, index + 1)}/>
                  </Space>
                )
              })}
            </>
          )}
        </Form.List>
        <Form.Item label="工程周期" name="days">
          <Input disabled placeholder={"0"}/>
        </Form.Item>
        <Form.Item label="面积" name="area">
          <Input/>
        </Form.Item>
        <Form.Item label="面积单位" name="area_unit">
          <Select
            options={[
              {value: 'sqm', label: 'sqm'},
              {value: 'sq.ft', label: 'sq.ft'},
            ]}
          />
        </Form.Item>
        <Form.Item label="楼层" name="floor">
          <Input/>
        </Form.Item>
      </>
    );

// 组件的其他部分（如状态管理和事件处理函数）保持不变
  }
;

export default Content;
