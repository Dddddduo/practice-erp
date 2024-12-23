import React from "react";
import Dashboard from "@/pages/Project/MachineControl/components/Dashboard";
import {i18nGlobalKey} from "@/utils/utils";
import {SupplyReturnData} from "@/viewModel/Project/useMachineControl";
import _ from "lodash";
interface Props {
  supplyReturnList: SupplyReturnData[]
}

const SupplyWaterList: React.FC<Props> = ({
                                            supplyReturnList,
                                          }) => {

  return (
    <div className={'bg-gray-200 p-4 rounded-1xl'} style={{ paddingTop: 50, paddingBottom: 50 }}>
      {
        supplyReturnList.map((item, index) => {
          return (
            <div
              key={index}
              className={'flex flex-wrap justify-center gap-x-14'}
              style={{ marginBottom: index !== supplyReturnList.length - 1 ? 50 : 0 }}
            >
              <Dashboard
                inputValue={item.supplyData.value}
                title={i18nGlobalKey(item.supplyData.name.substring(0, 4)) + (index + 1)}
                unit={item.supplyData.unit}
                desc={
                  i18nGlobalKey(item.flowData.name.substring(0, 4)) +
                  (index + 1) +
                  ': ' +
                  item.flowData.value +
                  item.flowData.unit
                }
              />
              <Dashboard
                inputValue={item.returnData.value}
                title={i18nGlobalKey(item.returnData.name.substring(0, 4)) + (index + 1)}
                unit={item.returnData.unit}
              />
            </div>
          );
        })
      }
    </div>
  )
}

export default SupplyWaterList
