// 导入所需模块和依赖
import React, {Dispatch, useEffect, useState} from 'react';
import {isEmpty, values} from 'lodash';
import {
  ProForm,
  ProFormText,
  ProFormSelect,
  ProFormDateRangePicker,
} from '@ant-design/pro-components';
import {Button, DatePicker, Form, Input, message, Select, Space} from 'antd';
import {MinusCircleOutlined, PlusCircleOutlined, PlusOutlined} from '@ant-design/icons';
import moment from 'dayjs';
import {ProFormDigit} from "@ant-design/pro-form";
import {useForm} from "antd/es/form/Form";
import {EstimateAction} from "@/pages/Project/ProjectPQI/store/estimate";
import dayjs from "dayjs";

// 假设的brandMap、projectTypeMap、projectStatusMap的类型定义
type MapType = { [key: string]: any };

// Content组件定义
const Content: React.FC<{ fullState: MapType, dispatch: Dispatch<EstimateAction> }> = ({
                                                                                         fullState: {commonData},
                                                                                         dispatch
                                                                                       }) => {
    const {RangePicker} = DatePicker;

    // const [timeRanges, setTimeRanges] = useState([{date: ['', '']}])

    // const calcDays = (timeRanges: Array<{ date: [string, string] }>) => {
    // 计算总天数逻辑
    // let days = 0;
    // timeRanges.forEach(range => {
    //   const startDate = moment(range.date[0]);
    //   const endDate = moment(range.date[1]);
    //   days += endDate.diff(startDate, 'days') + 1; // 包含结束日期
    // });
    // setContentFormData(prevState => ({ ...prevState, days }));
    // };

    // const addRow = (index: number) => {
    //
    //   console.log('addrow', index)
    //   let tmp = [];
    //   timeRanges.forEach((time_item, idx) => {
    //     console.log("in:1", index, idx, time_item)
    //     tmp.push(time_item);
    //     if (index === idx) {
    //       console.log("in:2", 'add')
    //       tmp.push({ date: ['', ''] });
    //     }
    //   });
    //   // calcDays(tmp);
    //   setTimeRanges(tmp);
    // };
    //
    // const deleteRow = (index: number) => {
    //   let tmp = [];
    //   timeRanges.forEach((time_item, idx) => {
    //     console.log("in:1", index, idx, time_item)
    //
    //     if (index !== idx) {
    //       tmp.push(time_item);
    //     }
    //   });
    //   if (tmp.length < 1) {
    //     tmp.push({ date: ['', ''] });
    //   }
    //   // calcDays(tmp);
    //   setTimeRanges(tmp);
    //   // calcDays(tmp);
    //   // setContentFormData(prevState => ({ ...prevState, time_ranges: tmp }));
    // };

    useEffect(() => {
      // console.log("projectTypeMap:", commonData)
      // calcDays(projectInfo.time_ranges);
      // if (!isEmpty(projectInfo)) {
      //     //   setTimeRanges(projectInfo.time_ranges);
      //     //   // const { id, project_no, brand_id, project_name, project_type_id, project_status_id, area, floor, area_unit, time_ranges } = projectInfo;
      //     //   formRef.setFieldsValue(projectInfo)
      //     //   // setContentFormData({ id, project_no, brand_id, project_name, project_type_id, project_status_id, area, floor, area_unit, time_ranges });
      //     // }
    }, []);

    // 组件渲染的表单
// 组件的其余部分保持不变，直接从渲染表单部分开始补充

    const brandOptions = Object.keys(commonData.brandMap).map(key => ({
      label: commonData.brandMap[key], // 显示的名称
      value: key, // 实际的 ID
    }));

    return (
      <>
        <Form.Item label="项目编号" name="project_no">
          <Input disabled/>
        </Form.Item>
        <Form.Item label="品牌" name="brand_id">
          <Select
            options={brandOptions}
            showSearch
            filterOption={(input, option) => (option?.label ?? '').includes(input)}
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
            }
          />
        </Form.Item>
        <Form.Item label="项目名称" name="project_name">
          <Input />
        </Form.Item>
        <Form.Item label="项目类型" name="project_type_id">
          <Select
            options={Object.keys(commonData.projectTypeMap).map(key => ({
              value: key,
              label: commonData.projectTypeMap[key]
            }))}
            filterOption={(input, option) => (option?.label ?? '').includes(input)}
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
            }
            showSearch
          />
        </Form.Item>
        <Form.Item label="项目状态" name="project_status_id">
          <Select
            showSearch
            options={Object.keys(commonData.projectStatusMap).map(key => ({
              value: key,
              label: commonData.projectStatusMap[key]
            }))}
            filterOption={(input, option) => (option?.label ?? '').includes(input)}
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
            }
          />
        </Form.Item>
        <Form.List name="time_ranges" >
          {(fields, {add, remove}) => (
            <>
              {fields.map(({key, name, ...restField}, index) => {
                console.log(key, name, restField)
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
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    ) : null}
                    <PlusCircleOutlined onClick={() => add(undefined, index + 1)}/>
                  </Space>
                )
              })}
            </>
          )}
        </Form.List>
        <Form.Item label="工程周期" name="days" >
          <Input disabled placeholder={"0"} />
        </Form.Item>

        <Form.Item label="面积" name="area" >
          <Input  />
        </Form.Item>
        <Form.Item label="面积单位" name="area_unit" >
          <Select
            options={[
              {value: 'sqm', label: 'sqm'},
              {value: 'sq.ft', label: 'sq.ft'},
            ]}
          />
        </Form.Item>
        <Form.Item label="楼层" name="floor" >
          <Input />
        </Form.Item>
      </>
    );

// 组件的其他部分（如状态管理和事件处理函数）保持不变
  }
;

export default Content;
