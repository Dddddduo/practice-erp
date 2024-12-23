import React, { useEffect, useState } from 'react';

import { getChooseOrder } from '@/services/ant-design-pro/report';
import { Select } from 'antd';
import OrderDetail from "@/pages/Order/Report/components/OrderDetail";
interface  Props {
  actionRef: any;
  currentItem: any;
  handleCloseOrderDetail: () => void
}

const ChooseOrder: React.FC<Props> = (props) => {
  const { actionRef, currentItem , handleCloseOrderDetail } = props;
  const [chooseOrderData, setChooseOrderData] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const handleChooseOrder = async () => {
    try {
      const res = await getChooseOrder();
      if (res.success) {
        const options = res.data.map((item: any) => ({
          value: item.id,
          label: item.order_no,
        }));
        setChooseOrderData(options);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleChooseOrder().then()
  }, []);

  return (
    <>
    <Select
      placeholder="请选择"
      style={{ width: '100%' ,marginBottom: 20}}
      options={chooseOrderData}
      onChange={(value: any) => {
        setSelectedOrder(value)
      }}
      showSearch={ true }
    />
      {
        selectedOrder && <OrderDetail actionRef={actionRef} currentItem={currentItem} selectedOrder={selectedOrder} handleCloseOrderDetail={handleCloseOrderDetail} />
      }
    </>
  );
};

export default ChooseOrder;
