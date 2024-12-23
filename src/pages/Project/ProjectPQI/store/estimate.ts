import {produce} from 'immer';
import {sum} from "lodash";

export type EstimateAction = { type: string, payload?: any }

interface EstimateState {
  commonData: { [key: string]: any }
  currentRow: { [key: string]: any }
  contentData: { [key: string]: any }
  form: any,
}

export const initialEstimateState: EstimateState = {
  commonData: {
    brandMap: [],
    projectTypeMap: [],
    projectStatusMap: [],
    projectInfo: {},
    equipmentInfo: {},
    tableTopDateList: [],
    data4: [],
    data41: [],
    data42: [],
    data43: [],
  },
  currentRow: {},
  contentData: {},
  form: {},
};


// dispatch({
//   type: "totalAmountHandle",
//   payload: {
//     middleAmount: costTableData
//   }
// });

export function estimateReducer(state: EstimateState, action: EstimateAction): EstimateState {

  return produce(state, draft => {
      switch (action.type) {
        case 'initBaseData':
          draft.commonData = action.payload
          break
        case "subBudgetHandle":
          draft.commonData[action.payload.tableType] = action.payload.data
          break
        case "totalAmountHandle": {
          const {middleAmount: {cost41, cost42, cost43}} = action.payload
          draft.commonData.data41[0].cost = cost41
          draft.commonData.data42[0].cost = cost42
          draft.commonData.data43[0].cost = cost43
        }
          break
        default:
          // 不需要处理默认情况，immer会自动返回当前状态
          break;
      }
    }
  )
}
