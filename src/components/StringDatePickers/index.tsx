import React from 'react';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

const { RangePicker } = DatePicker;

// 单日期选择器封装
const StringDatePicker = ({ value, onChange, ...props }) => {
  const handleChange = (date) => {
    onChange(date ? date.format('YYYY-MM-DD') : null);
  };

  return (
    <DatePicker
      {...props}
      value={value ? dayjs(value) : null}
      onChange={handleChange}
    />
  );
};

// 日期范围选择器封装
const StringRangePicker = ({ value, onChange, ...props }) => {
  const handleChange = (dates) => {
    onChange(dates ? dates.map(date => date.format('YYYY-MM-DD')) : null);
  };

  return (
    <RangePicker
      {...props}
      value={(value && value[0]) ? value.map((date: any) => dayjs(date)) : null}
      onChange={handleChange}
      format={format}
    />
  );
};

export { StringDatePicker, StringRangePicker };
