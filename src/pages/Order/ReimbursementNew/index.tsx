import React, {useCallback, useEffect, useReducer, useState} from 'react';
import {Tag} from 'antd';
import {PageContainer, ProTable} from '@ant-design/pro-components'
import {useReimbursementNew} from '@/hooks/useReimbursementNew';

const ReimbursementNew: React.FC = () => {

  // 从hooks拿数据
  const {
    dataSource,
    actionRef,
    getBrandOptions,
    getMarketOptions,
    getShopsOptions,
    setShopOptions,
    getReimPageList,
    handleFetchListData,
  } = useReimbursementNew();

  // 滚动条高度
  const getTableScroll = (window) => {
    // 计算除了表格之外的其他区域高度
    // 页头 + padding + 表格头部 + 分页器 + 底部间距
    const otherHeight = 64 + 24 + 40 + 24 + 24;
    // 返回一个略小于视窗高度的值，确保滚动条在可视区域内
    return (window.innerHeight - otherHeight) / 1.35;
  }

  // 表格的列数据
  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
      search: false,
    },
    {
      title: ('报销单编号'),
      dataIndex: 'reim_no',
      search: true,
    },
    {
      title: ('工作内容'),
      dataIndex: 'ma_remark',
      search: true,
    },
    //
    {
      title: ('品牌'),
      dataIndex: 'brand_en',
      search: true,
      valueType: 'select',
      fieldProps: {
        // 搜索选项
        options: dataSource.brandOptions,
        showSearch: true,
        filterOption: (input: string, option?: { label: string; value: number }) =>
          (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
        // mode: 'multiple',
        onChange: (value) => {
          // 获取品牌数据
          getBrandOptions(value);
        },
        mode: 'multiple',
      },
    },
    {
      title: ('城市'),
      dataIndex: 'city_cn',
      search: true,
      valueType: 'select',
      fieldProps: {
        // 搜索选项
        options: dataSource.cityOptions,
        showSearch: true,
        filterOption: (input: string, option?: { label: string; value: number }) =>
          (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
        onChange: (value) => {
          // 获取商场数据
          getMarketOptions(value);
        },
        // mode: 'multiple',
      },
    },
    {
      title: ('商场'),
      dataIndex: 'market_cn',
      search: true,
      valueType: 'select',
      fieldProps: {
        // 搜索选项
        options: dataSource.marketOptions,
        showSearch: true,
        filterOption: (input: string, option?: { label: string; value: number }) =>
          (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
        // mode: 'multiple',
        onChange: (value) => {
          // 此时可以获取商场
          getShopsOptions(value);
        },
      },
    },
    {
      title: ('店铺'),
      dataIndex: 'store_cn',
      search: true,
      valueType: 'select',
      fieldProps: {
        // 搜索选项
        options: dataSource.shopOptions,
        showSearch: true,
        filterOption: (input: string, option?: { label: string; value: number }) =>
          (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
        onChange: (value) => {
          // 此时可以获取商场
          setShopOptions(value);
        },
      },
    },
    {
      title: '报销单状态',
      dataIndex: 'reim_status',
      search: true,
      valueType: 'select',
      fieldProps: {
        // 搜索选项
        options: dataSource.reimStatusOptions,
        showSearch: true,
        filterOption: (input: string, option?: { label: string; value: number }) =>
          (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
        // mode: 'multiple',
      },
      render: (text, record) => {
        // 根据字段设置状态颜色和文本
        const color = record.reim_status_color;
        const statusText = record.reim_status_value;
        return <Tag color={color}>{statusText}</Tag>;
      },
    },

    {
      title: ('历史报销'),
      dataIndex: 'stock',
      search: true,
    },

    {
      title: ('维修类型'),
      dataIndex: 'ma_type_cn',
      search: true,
    },
    {
      title: ('工作类型'),
      dataIndex: 'ma_cate_cn',
      search: true,
    },
    {
      title: ('成本'),
      dataIndex: 'total_price',
      search: true,
    },
    {
      title: ('是否预支'),
      dataIndex: 'is_advance',
      search: true,
      valueType: 'select',
      fieldProps: {
        // 搜索选项
        options: dataSource.isPrePayOptions,
        showSearch: true,
        filterOption: (input: string, option?: { label: string; value: number }) =>
          (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
        // mode: 'multiple',
      },
    },
    {
      title: ('负责人'),
      dataIndex: 'leader_name',
      search: true,
    },
    {
      title: ('申请时间'),
      dataIndex: 'create_at',
      search: true,
    },
    {
      title: ('完工日期'),
      dataIndex: '',
      search: true,
    },
  ]

  return (
    <PageContainer>
      {/*新创建的ProTable*/}
      <ProTable
        rowKey="id"
        search={true}
        actionRef={actionRef}
        request={handleFetchListData}
        columns={columns}
        scroll={{
          x: 'max-content', // 确保水平滚动条在可视区域
          y: getTableScroll(window), // 设置表格高度，使垂直滚动条在可视区域
          scrollToFirstRowOnChange: true
        }}
      />
    </PageContainer>

  )
}

export default ReimbursementNew
