import React, { useState, useEffect } from 'react';
import { Modal, message } from 'antd';
import ProForm, {
  ProFormText,
  ProFormSelect,
} from '@ant-design/pro-form';
import {isEmpty} from "lodash";
import {getBrandList} from "@/services/ant-design-pro/report";
import {addInvoiceInfo} from "@/services/ant-design-pro/invoiceCollection";
import {createPqiPayInfo} from "@/services/ant-design-pro/project";

interface BrandOption {
  id: number;
  brand_cn: string;
  brand_en: string;
  brand_en_all: string;
  brand_logo: string;
  boss?: string;
}

const tmp = {
  "id": 0,
  "brand_cn": "第三方公司（做可选项）",
  "brand_en": "第三方公司（做可选项）",
  "brand_en_all": "第三方公司（做可选项）",
  "brand_logo": "",
  "boss": ""
}


const AddInvoiceModal: React.FC<{ visible: boolean; onClose: (reload:boolean) => void; type: string; }> = ({ type, visible, onClose }) => {
  const [brandOptions, setBrandOptions] = useState<BrandOption[]>([]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await getBrandList(); // 假设这个函数返回品牌列表
        if (response.success) {
          const brandData = response.data
          brandData.unshift(tmp)
          setBrandOptions(brandData);
          return
        }
        message.error('获取品牌列表失败');
      } catch (error) {
        message.error('获取品牌列表失败');
      }
    };

    if (visible) {
      fetchBrands().catch(console.log);
    }
  }, [visible]);

  return (
    <Modal
      title="新增开票信息"
      width="50%"
      open={visible}
      onCancel={onClose}
      footer={null}
      destroyOnClose={true}
    >
      <ProForm
        onFinish={async (values) => {
          console.log('finish', values)
          let brandName = ''
          brandOptions.forEach(item => {
            if (item.id === values.brand_id) {
              brandName = item.brand_en ?? ''
            }
          })
          console.log('brandOptions--brandOptions',brandOptions)

          // if ("" === brandName) {
          //   return
          // }

          const params = {
            ...values,
            brand: brandName
          }

          const hide = message.loading('数据提交中...')
          if (type === 'invoicing') {
            try {
              const result = await addInvoiceInfo(params)
              if (result.success) {
                message.success("数据提交成功")
                onClose(true);
                return
              }

              message.error("数据提交失败")
            } catch (error) {
              message.error("数据提交失败:" + (error as Error).message)
            } finally {
              hide();
            }
          }
          if (type === 'payment') {
            try {
              console.log('into payment createPqiPayInfo', params)
              const result = await createPqiPayInfo(params)
              if (result.success) {
                hide();
                message.success("数据提交成功")
                onClose(true);
                return
              }

              message.error("数据提交失败")
            } catch (error) {
              message.error("数据提交失败:" + (error as Error).message)
              hide();
            }
          }
        }}
      >
        <ProFormSelect
          name="brand_id"
          label="品牌"
          options={!isEmpty(brandOptions) && brandOptions.map((option) => ({
            value: option.id,
            label: option.brand_en,
          }))}
          // rules={[{ message: '请选择品牌' }]}
        />
        <ProFormText name="name" label="公司名称" rules={[{ required: true }]} />
        <ProFormText name="code" label="纳税人识别号"  />
        <ProFormText name="address" label="注册地址" />
        <ProFormText name="tel" label="注册电话" />
        <ProFormText name="bank_name" label="开户银行名称" rules={[{ required: true }]} />
        <ProFormText name="bank_no" label="银行账户" rules={[{ required: true }]} />
        <ProFormText name="email" label="电子邮箱" />
        <ProFormText name="default_address" label="默认地址" />
      </ProForm>
    </Modal>
  );
};

export default AddInvoiceModal;
