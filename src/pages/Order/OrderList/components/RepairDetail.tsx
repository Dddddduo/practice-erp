import React, { useEffect, useState, RefObject } from "react"
import { Typography, Form, Select, Button } from "antd"
import { getMaItemInfoByMaId, getMaCateLv1List, getMaCateList, modifySubCate } from "@/services/ant-design-pro/orderList";
import type { SelectProps } from 'antd';
import { ActionType } from '@ant-design/pro-components';

interface ItemListProps {
  repairDetail: any
  closeRepairDetailModal: () => void
  actionRef: RefObject<ActionType>;
}

const RepairDetail: React.FC<ItemListProps> = ({
  repairDetail,
  closeRepairDetailModal,
  actionRef
}) => {
  const [form] = Form.useForm();
  const [currentMaInfo, setCurrentMaInfo]: any = useState()
  const [maCateLv1List, setMaCateLv1List]: any = useState()
  const [maCateList, setMaCateList]: any = useState()

  const handleFinish = (values) => {
    const params = {
      ma_cate_id: values.categoryTwo.value ?? values.categoryTwo ?? '',
      ma_sub_cate_id: values.categoryThree.value ?? values.categoryThree ?? '',
      ma_item_id: repairDetail.ma_item_id ?? ''
    }
    console.log(params);
    modifySubCate(params).then(res => {
      if (res.success) {
        closeRepairDetailModal()
        actionRef?.current?.reload();
      }
    })
  }

  const getMaItemInfo = () => {
    getMaItemInfoByMaId({ma_id: repairDetail.ma_item_id}).then(res => {
      if (res.success) {
        setCurrentMaInfo(res.data)
        form.setFieldsValue({
          categoryTwo: {
            label: res.data.ma_cate_cn_name,
            value: res.data.ma_cate_id
          }
        })
      }
    })
    getMaCateLv1List({p_type: repairDetail.ma_type}).then(res => {
      if (res.success) {
        setMaCateLv1List(res.data)
      }
    })
  }

  const handleChangeMaCate = (e) => {
    getMaCateList({p_id: e}).then(res => {
      if (res.success) {
        setMaCateList(res.data)
        form.setFieldsValue({
          categoryThree: {
            label: res.data.ma_cate_cn_name,
            value: res.data.ma_cate_id
          }
        })
      }
    })
  }

  const optionsMaLv1Cate: SelectProps['options'] = maCateLv1List?.map((item: any) => {
    return {
      value: item.id,
      label: item.cn_name,
    };
  });

  const optionsMaCate: SelectProps['options'] = maCateList?.map((item: any) => {
    return {
      value: item.id,
      label: item.cn_name,
    };
  });

  useEffect(() => {
    getMaItemInfo()
  }, [repairDetail])

  return (
    <>
      <Typography.Title level={3}>客户报修详情</Typography.Title>
      <Form
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600, marginTop: 30 }}
        onFinish={handleFinish}
      >
        <Form.Item label="图片">

        </Form.Item>

        <Form.Item label="报修位置">

        </Form.Item>

        <Form.Item label="问题描述">
          <Typography.Text strong>{currentMaInfo?.prob_desc}</Typography.Text>
        </Form.Item>

        <Form.Item label="报修类目">
          <>
            <Form.Item label="二级类目" name="categoryTwo">
              <Select placeholder="请选择" options={optionsMaLv1Cate} onChange={handleChangeMaCate}></Select>
            </Form.Item>
            <Form.Item label="三级类目" name="categoryThree">
              <Select placeholder="请选择" options={optionsMaCate}></Select>
            </Form.Item>
          </>
        </Form.Item>
        <Form.Item style={{ position: 'relative', left: 138 }}>
          <Button type="primary" htmlType="submit">修改</Button>
        </Form.Item>
      </Form>
    </>
  )
}

export default RepairDetail