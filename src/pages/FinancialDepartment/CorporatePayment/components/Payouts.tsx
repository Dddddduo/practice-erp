import { Card } from "antd"
import React, {useEffect} from "react"
import { FormInstance } from "antd/lib"
import { BaseData } from "@/viewModel/FinancialDepartment/useCorporatePayment"
import PayoutsTable from "./PayoutsTable"
import PayoutsFormReplace from "@/pages/FinancialDepartment/CorporatePayment/components/PayoutsFormReplace";

interface PayoutsParams {
  form: FormInstance
  baseData: BaseData
  onChangeFileIds: (file_id: string, isDisplayBack: boolean) => void
  // onFinishPayouts: (values) => void
  handleShowCheckPanel: () => void

  handleFinishPayoutsForm: (values) => void
}

const Payouts: React.FC<PayoutsParams> = ({
  form,
  baseData,
  onChangeFileIds,
  // onFinishPayouts,
                                            handleShowCheckPanel,

                                            handleFinishPayoutsForm
}) => {

  return (
    <>
      <Card
        title="打款录入"
        bordered
        style={{ marginBottom: 30 }}
      >
        <PayoutsFormReplace
          form={form}
          baseData={baseData}
          onChangeFileIds={onChangeFileIds}
          handleShowCheckPanel={handleShowCheckPanel}

          handleFinishPayoutsForm={handleFinishPayoutsForm}
        />
      </Card>

      <Card
        title="申请列表"
        bordered
      >
        <PayoutsTable
          baseData={baseData}
        />
      </Card>
    </>
  )
}

export default Payouts
