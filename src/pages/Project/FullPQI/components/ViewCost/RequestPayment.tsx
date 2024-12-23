import BaseContainer, { ModalType } from '@/components/Container';
import { CurrentItemParams, FormValues, ItemAlpply } from '@/viewModel/PQI/useViewCost';
import { FormInstance } from 'antd';
import PaymentFormData from './PaymentFormData';
import {useEffect} from "react";

interface RequestPaymentParams {
  form: FormInstance;
  formUpload: any;
  invoiceInfo: any;
  open: boolean;
  showSubmitBtn: boolean;
  currentItem: CurrentItemParams;
  handleClosePayment: () => void;
  handleInvoicePqiCostEstimate: (values: FormValues) => void;
  handleUploadFile: (file_id: string) => void;
  handleChangeCompany: (companyDetail: { value: number; label: string }) => void;
  itemApply: ItemAlpply;
  type?: string;

  handleCreateInvoice: (values: any) => void,
}

const RequestPayment: React.FC<RequestPaymentParams> = ({
  form,
                                                          formUpload,
                                                          invoiceInfo,
  open,
  currentItem,
  showSubmitBtn,
  handleClosePayment,
  handleInvoicePqiCostEstimate,
  handleUploadFile,
  handleChangeCompany,
  itemApply,

                                                          handleCreateInvoice,
}) => {

  return (
    <BaseContainer
      open={open}
      type={ModalType.Drawer}
      onClose={handleClosePayment}
      width={1000}
      maskClosable={false}
      destroyOnClose={true}
      title="申请付款"
    >
      <div style={{ display: 'flex',}}>
        <PaymentFormData
          type="apply"
          form={form}
          open={open}
          formUpload={formUpload}
          currentItem={currentItem}
          onClosePayment={handleClosePayment}
          onInvoicePqiCostEstimate={handleInvoicePqiCostEstimate}
          onUploadFile={handleUploadFile}
          showSubmitBtn={showSubmitBtn}
          handleChangeCompany={handleChangeCompany}
          itemApply={itemApply}

          handleCreateInvoice={handleCreateInvoice}
          handleEditorInvoice={handleCreateInvoice}
        />
        <PaymentFormData
          type="upload"
          open={open}
          form={form}
          invoiceInfo={invoiceInfo}
          formUpload={formUpload}
          currentItem={currentItem}
          onClosePayment={handleClosePayment}
          onInvoicePqiCostEstimate={handleInvoicePqiCostEstimate}
          onUploadFile={handleUploadFile}
          showSubmitBtn={showSubmitBtn}
          handleChangeCompany={handleChangeCompany}
          itemApply={itemApply}

          handleCreateInvoice={handleCreateInvoice}
          handleEditorInvoice={handleCreateInvoice}
        />
      </div>
        <PaymentFormData
          type="invoiceInfo"
          form={form}
          open={open}
          invoiceInfo={invoiceInfo}
          formUpload={formUpload}
          currentItem={currentItem}
          onClosePayment={handleClosePayment}
          onInvoicePqiCostEstimate={handleInvoicePqiCostEstimate}
          onUploadFile={handleUploadFile}
          showSubmitBtn={showSubmitBtn}
          handleChangeCompany={handleChangeCompany}
          itemApply={itemApply}

          handleCreateInvoice={handleCreateInvoice}
          handleEditorInvoice={handleCreateInvoice}
        />
    </BaseContainer>
  );
};

export default RequestPayment;
