import React, {useEffect} from "react"
import {PageContainer, ProTable} from '@ant-design/pro-components'
import {useOrderListNew} from "@/hooks/useOrderListNew";
import BaseContainer, {ModalType} from "@/components/Container";
import CreateRei from "@/pages/Order/OrderListNew/components/CreateRei";


const OrderList: React.FC = () => {
  const {
    dataSource,
    handleFetchListData,
    actionRef,
    handleReiFormData,
    handleReiFormChange,
    closeCreateReiModel,
    showCreateReiModel,
    onChangeCompletedFinish,
    isCompleted,
    handleFullValueChange ,
    currentRecord,
  } = useOrderListNew();

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
      title: '订单号',
      dataIndex: 'order_no',
      search: false,
    },
    {
      title: ('品牌'),
      dataIndex: 'brand_cn',
      search: true,
    },
    {
      title: ('城市'),
      dataIndex: 'city_cn',
      search: true,
    },
    {
      title: '商场',
      dataIndex: 'market_cn',
      search: true,
    },
    {
      title: ('公司'),
      dataIndex: 'company_en',
      search: true,
    },
    {
      title: ('操作'),
      dataIndex: '',
      search: true,
    },
    {
      title: '报销单编号',
      dataIndex: 'supplier_order_no',
      key: 'supplier_order_no',
      render: (text, record) => {
        // 如果 reim_info 为 0，则不显示该单元格
        if (record.reim_info.reim_id === 0) {
          return null; // 或者 return ''; 根据你的需要
        }

        return (
          <span
            style={{ cursor: 'pointer', color: 'blue' }}
            onClick={() => showCreateReiModel(text, record)}
          >
        {text}
      </span>
        );
      },
      search: true,
    },
    {
      title: ('报销单状态'),
      dataIndex: '',
      search: true,
    },
    {
      title: ('完工时间'),
      dataIndex: '',
      search: true,
    },
    {
      title: ('报告单'),
      dataIndex: '',
      search: true,
    },
    {
      title: ('报销明细'),
      dataIndex: '',
      search: true,
    },
    {
      title: ('报销总价'),
      dataIndex: '',
      search: true,
    },
    {
      title: ('报价编号'),
      dataIndex: '',
      search: true,
    },
    {
      title: ('报价审核状态'),
      dataIndex: '',
      search: true,
    },
    {
      title: ('报价总金额'),
      dataIndex: '',
      search: true,
    },
    {
      title: ('报价利润率'),
      dataIndex: '',
      search: true,
    },
  ]

  // 加载选择项
  useEffect(() => {
  }, []);

  return (
    <>
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
      <BaseContainer type={ModalType.Drawer}
                     width={2000}
                     open={dataSource.createReiModelStatus}
                     destroyOnClose={closeCreateReiModel}
                     onClose={closeCreateReiModel}>
        <CreateRei
          handleReiFormData={handleReiFormData}
          handleReiFormChange={handleReiFormChange}
          dataSource={dataSource}
          onChangeCompletedFinish={onChangeCompletedFinish}
          isCompleted={isCompleted}
          handleFullValueChange={handleFullValueChange}
          recordData={currentRecord}
        ></CreateRei>
      </BaseContainer>
    </>
  )
}


export default OrderList
