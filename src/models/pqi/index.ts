import {
  INIT_BASE_DATA,
  INIT_FORM_DATA,
  CHANGE_FORM_DATA,
  INIT_TABLE_DATA,
  TABLE_VALUE_CHANGE,
  TABLE_ALL_FLUSH,
  TABLE_TOP_VALUE_CHANGE,
  TABLE_MID_VALUE_CHANGE, TABLE_BOTTOM_VALUE_CHANGE, INIT_EQUIPMENT_DATA, TABLE_DEV_VALUE_CHANGE, INIT_HISTORY_DATA
} from './constants';
import {produce} from "immer";


export type EstimateAction = { type: string, payload?: any }

interface EstimateState {
  baseData: { [key: string]: any }
  formData: { [key: string]: any }
  tableData: { [key: string]: any }
  othersData: { [key: string]: any },
  historyData: {[key: string]: any}[]
}

export const initialState = {
  historyData: [],
  baseData: {},
  formData: {},
  tableData: {
    top: [],
    mid4: [],
    mid41: [],
    mid42: [],
    mid43: [],
    bottom: [],
    dev: [],
    formatData: {
      top: [
        ["No.", "Item"],
        ["1", "Profit"],
        ["2-1", "Total Amount(In. VAT)"],
        ["2-2", "Total Amount(Ex. VAT)"],
        ["3", "VAT"],
      ],
      mid: {
        no: '4',
        item: "Cost",
        cost: 0
      },
    }
  },
  othersData: {}
};

export function estimateReducer(state: EstimateState, action: EstimateAction): EstimateState {
  return produce(state, draft => {
      switch (action.type) {
        case INIT_BASE_DATA:
          draft.baseData = action.payload
          break
        case INIT_FORM_DATA:
          draft.formData = action.payload
          break
        case CHANGE_FORM_DATA:
          draft.formData = {...state.formData, ...action.payload}
          break
        case INIT_TABLE_DATA:
          draft.tableData = {
            ...state.tableData,
            [action.payload.initType]: action.payload.data
          }
          break
        case TABLE_VALUE_CHANGE:
          draft.tableData.top[action.payload.row][action.payload.col] = action.payload.data
          break
        case TABLE_ALL_FLUSH:
          draft.tableData = action.payload
          break

        case TABLE_MID_VALUE_CHANGE: {
          const {type, index, data} = action.payload
          if (action.payload.pos === 'item') {
            draft.tableData[type][index].costDetail = data
          }

          if (action.payload.pos === 'cost') {
            draft.tableData[type][index].cost = data
          }
        }

          break
        case TABLE_TOP_VALUE_CHANGE:
          draft.tableData.top[0][action.payload.col] = action.payload.data[0]
          draft.tableData.top[1][action.payload.col] = action.payload.data[1]
          draft.tableData.top[2][action.payload.col] = action.payload.data[2]
          draft.tableData.top[3][action.payload.col] = action.payload.data[3]
          draft.tableData.top[4][action.payload.col] = action.payload.data[4]
          break

        case TABLE_BOTTOM_VALUE_CHANGE:
          draft.tableData.bottom[action.payload.index].cost = action.payload.data.cost
          draft.tableData.bottom[action.payload.index].costDetail = action.payload.data.detailCost
          break

        case INIT_EQUIPMENT_DATA:
          draft.tableData.dev = action.payload
          break
        case TABLE_DEV_VALUE_CHANGE:
          draft.tableData.dev[action.payload.index] = action.payload.data
          break
        case INIT_HISTORY_DATA:
          draft.historyData = action.payload
          break
        default:
          // 不需要处理默认情况，immer会自动返回当前状态
          break;
      }
    }
  )
}

