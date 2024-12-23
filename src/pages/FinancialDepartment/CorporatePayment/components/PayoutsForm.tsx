import {Form, Input, Select, Space} from "antd"
import React, {useEffect} from "react"
import {FormInstance} from "antd/lib"
import UploadFiles from "@/components/UploadFiles"
import {StringDatePicker} from "@/components/StringDatePickers"
import SubmitButton from "@/components/Buttons/SubmitButton"
import {BaseData} from "@/viewModel/FinancialDepartment/useCorporatePayment"
import {showPaymentInfo} from "@/services/ant-design-pro/quotation";
import {isEmpty} from "lodash";
import dayjs from "dayjs";
import CheckInvoicePanel from "@/components/CheckInvoicePanel";

interface PayoutsFormParams {
  form: FormInstance
  baseData: BaseData
  onChangeFileIds: (file_ids: string, isDisplayBack: boolean) => void
  onFinishPayouts: (values) => void
  handleShowCheckPanel: () => void
}

const PayoutsForm: React.FC<PayoutsFormParams> = ({
                                                    form,
                                                    baseData,
                                                    onChangeFileIds,
                                                    onFinishPayouts,
                                                    handleShowCheckPanel
                                                  }) => {
  return (
    <>
      <Form
        form={form}
        labelCol={{span: 4}}
        wrapperCol={{span: 15}}
        style={{maxWidth: 800}}
        onFinish={onFinishPayouts}
      >
        <Form.Item label="收款公司名称" name="coll_company">
          <Input readOnly variant="borderless"/>
        </Form.Item>

        <Form.Item label="收款公司开户行" name="bank_name">
          <Input readOnly variant="borderless"/>
        </Form.Item>

        <Form.Item label="收款公司账号" name="bank_no">
          <Input readOnly variant="borderless"/>
        </Form.Item>

        <Form.Item label="公司" name="company" required={true}>
          <Select options={baseData.companyList} allowClear placeholder="请选择公司"/>
        </Form.Item>

        <Form.Item label="附件" name="annex">
          <UploadFiles onChange={(file_ids) => onChangeFileIds(file_ids)}/>
        </Form.Item>

        <Form.Item label="打款时间" name="time" required={true}>
          <StringDatePicker />
        </Form.Item>

        <Form.Item label="打款金额" name="amount">
          <Input style={{width: 150}}/>
        </Form.Item>

        <Form.Item label="备注" name="remark">
          <Input.TextArea placeholder="请输入备注"/>
        </Form.Item>

        <Form.Item label=" " colon={false}>
          <Space>
            <SubmitButton form={form} type="primary">提交</SubmitButton>
          </Space>
        </Form.Item>
      </Form>

      <CheckInvoicePanel
        open={baseData.showCheckPanel}

        errorData={baseData.checkData}

        handleCancel={() => {
          handleShowCheckPanel()
        }}

        handleOk={() => {
          const newValue = {
            ...baseData.saveValue,
            check: false
          }

          onFinishPayouts(newValue)
        }}
      />
    </>
  )
}

export default PayoutsForm
