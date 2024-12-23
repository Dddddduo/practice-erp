import { ApplyInvoice } from '@/components/Finance/ApplyInvoice';
import { ApplyList } from '@/components/Finance/ApplyList';
import { getCompanyList, getCustomerInvoiceInfo } from '@/services/ant-design-pro/quotation';
import { Divider, Form, message } from 'antd';
import { find, isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';

interface InvoiceRequestFormProps {
  // dataList?: [{ [key: string]: any }]
  amount: number;
  brandId: number;
  records?: { [key: string]: any }[];
  handleFinish: (values: any, close: boolean) => Promise<void>;
  remark?: string;
  type: string;
  handleReloadRecords: (value) => void;
  currentRecord: any;
  showEdit?: boolean;
}

export const InvoiceRequestForm: React.FC<InvoiceRequestFormProps> = ({
  type,
  brandId,
  amount,
  handleFinish,
  records = [],
  handleReloadRecords,
  currentRecord,
  showEdit = true,
}) => {
  const [dataSource, setDataSource] = useState<{ [key: string]: any }>({});
  const [formOutInstance] = Form.useForm();
  const [formInnerInstance] = Form.useForm();
  const [editData, setEditData] = useState<any>();

  const loadBaseData = async () => {
    const hide = message.loading('loading...');
    try {
      const companies = await getCompanyList();
      if (!companies.success) {
        message.error(companies.message as unknown as string);
        return;
      }

      const customerInvoiceInfo = await getCustomerInvoiceInfo({ brand_id: brandId });
      console.log(customerInvoiceInfo);
      if (!customerInvoiceInfo.success) {
        message.error(customerInvoiceInfo.message as unknown as string);
        return;
      }

      const defaultInvoiceInfo = customerInvoiceInfo.data.find((item:any) => {
        return item.brand_id === brandId;
      });
      console.log('defaultInvoiceInfo--defaultInvoiceInfo',defaultInvoiceInfo);

      console.log('customerInvoiceInfo', customerInvoiceInfo);
      const data = {
        amount: amount,
        companyList: companies.data.map((item) => {
          return {
            label: item.company_cn,
            value: item.id,
          };
        }),
        // .filter(item => {
        //           return item.brand_id === brandId;
        //         })
        companyInfo: customerInvoiceInfo.data.map((item) => {
          return {
            ...item,
            label: item.name,
            value: item.id,
          };
        }),
      };

      formOutInstance.setFieldValue('money', amount);
      formOutInstance.setFieldValue('companyInfo',defaultInvoiceInfo.name);
      console.log('data', data);
      setDataSource(data);
    } catch (error) {
      message.error((error as Error).message);
    } finally {
      hide();
    }
  };

  useEffect(() => {
    loadBaseData().catch(console.log);
    if (type === 'pqi') {
      formInnerInstance.setFieldValue('remark', `工程名称：\n工程地址：`);
      formOutInstance.setFieldValue('remark', `工程名称：\n工程地址：`);
    } else {
      formOutInstance.setFieldValue('type', '*建筑服务*维护维修服务');
    }

    // records
  }, []);

  const handleChangeCompany = (id) => {
    if (isEmpty(dataSource.companyInfo)) {
      return;
    }

    const foundCompany = find(dataSource.companyInfo, { id });
    if (isEmpty(foundCompany)) {
      return;
    }

    formInnerInstance.setFieldsValue({
      address: foundCompany?.address ?? '',
      tel: foundCompany?.tel ?? '',
      code: foundCompany?.code ?? '',
      bank: foundCompany?.bank_name ?? '',
      bank_no: foundCompany?.bank_no ?? '',
      company_name: foundCompany?.name ?? '',
    });

    formOutInstance.setFieldsValue({
      address: foundCompany?.address ?? '',
      tel: foundCompany?.tel ?? '',
      code: foundCompany?.code ?? '',
      bank: foundCompany?.bank_name ?? '',
      bank_no: foundCompany?.bank_no ?? '',
      company_name: foundCompany?.name ?? '',
    });
  };

  const handleEditData = (values) => {
    setEditData(values);
  };

  const ApplyInvoiceComponent = (
    <ApplyInvoice
      key="ApplyInvoiceComponentInner"
      formInstance={formInnerInstance}
      handleFinish={async (values) => {
        await handleFinish(values, false);
        handleReloadRecords(currentRecord);
      }}
      dataSource={dataSource}
      onChangeCompany={handleChangeCompany}
      editData={editData}
    />
  );
  return (
    <>
      <ApplyInvoice
        key="ApplyInvoiceComponentOut"
        formInstance={formOutInstance}
        handleFinish={(values) => handleFinish(values, true)}
        dataSource={dataSource}
        onChangeCompany={handleChangeCompany}
      />
      <Divider orientation="left">请款记录</Divider>
      <ApplyList
        invoice={ApplyInvoiceComponent}
        records={records}
        showEdit={showEdit}
        handleEditData={handleEditData}
      />
    </>
  );
};
