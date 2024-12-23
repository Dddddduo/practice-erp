// 导入依赖
import React, {useEffect, useReducer, useState} from 'react';
import {Button, Form, Input, Typography, message} from "antd";
import {estimateReducer, initialState} from "@/models/pqi";
import {
  changeFormData,
  initBaseData, initEquipmentData,
  initFormData, initHistoryData,
  initTableData,
  tableAllFlush, tableDevValueChange, tableMidValueChange, tableTopValueChange,
} from "@/models/pqi/actions";
import {bcMath, formatFormData, formatToTwoDecimalPlaces, showButtonByType} from "@/utils/utils";
import Content from "./Content";
import {
  cloneDeep,
  difference,
  get,
  isEmpty,
  isFunction,
  isNaN,
  isNull,
  map,
  pick,
  startsWith,
  sumBy,
  tail
} from "lodash";
import {
  createOrUpdateProject,
  getProjectBackListAll,
  getProjectEquipmentList,
  getProjectInfo
} from "@/services/ant-design-pro/project";
import dayjs from "dayjs";
import pqiFormulas from "@/pages/Project/FullPQI/formulas";
import Budget from "@/pages/Project/FullPQI/components/Estimate/Budget";
import {deepCopy} from "ali-oss/lib/common/utils/deepCopy";
import {getNumber} from "@/services/ant-design-pro/pqi";
import SubmitButton from "@/components/Buttons/SubmitButton";
import {isNumeric} from "mathjs";
import Bidder from './Bidder';


type MapType = { [key: string]: any }

interface InputData {
  submitData: any; // 定义具体的类型可能更好
  top: Array<any>;
  mid4: Array<any>;
  mid41: Array<any>;
  mid42: Array<any>;
  mid43: Array<any>;
  bottom: Array<any>;
  dev: Array<any>;
}

interface FinalAccountItem {
  cost_detail: string;
  cost_type: string;
  price: string;
}

interface EquipmentListItem {
  id?: number;
  project_id?: number;
  equipment_id: number;
  detail: string;
  create_at?: string;
  equipment_name?: string;
}

interface TargetFormat {
  cost_price: string;
  unit: string;
  projectData: object;
  equipment_list: EquipmentListItem[];
  final_account_list: FinalAccountItem[];
  times: Array<{ date: string[] }>;
  brand_id: number;
  project_id: number;
  comm_at: null | string;
  comp_at: null | string;
  project_name: string;
  project_type_id: number;
  project_status_id: number;
  project_no: string;
  area: string;
  floor: string;
  weekDay: number;
  reverse_calculate: object;
  time_ranges: Array<{ date: string[] }>;
  area_unit: string;
  profit_rate_list: (string | null)[];
  file_ids: string;
}

const saveButtonMappings = {
  projectEstimateSave: function (formRef) {
    return (
      <Button style={{marginRight: 20, width: 80, marginTop: 20}} disabled>保存</Button>
    )
  },
  saveButton: function (formRef) {
    return <SubmitButton
      form={formRef}
      className="green-button"
      type="primary"
      style={{marginRight: 20, width: 80, marginTop: 20}}
    >
      保存
    </SubmitButton>
  }
}

const Estimate: React.FC<{
  brandMap: MapType;
  projectTypeMap: MapType;
  projectStatusMap: { [key: string]: any };
  currentRow: any; // 根据实际情况定义类型
  isCreate: boolean
  onClose: (isReload: boolean) => void
}> = ({brandMap, projectTypeMap, projectStatusMap, currentRow, onClose, isCreate = false}) => {
  const [formRef] = Form.useForm();
  const [state, dispatch] = useReducer(estimateReducer, initialState);
  const [rateList, setRateList] = useState<{}[]>([])
  const [backId, setBackId] = useState(null)
  const [ctrSaveButton, setCtrSaveButton] = useState(null)

  /**
   *
   */
  const initHistoryDataHandle = (historyData) => {
    dispatch(initHistoryData(historyData))
  }

  /**
   * 表单初始化数据填充
   * @param initData
   */
  const initFormDataHandle = (initData) => {
    const {projectInfo, projectTypeMap} = initData
    if (isEmpty(projectInfo)) {
      return
    }

    const baseContentFormData = {
      ...projectInfo,
      days: pqiFormulas.calculateWorkDays(projectInfo.time_ranges),
      brand_id: {value: projectInfo.brand_id, label: projectInfo.brand_en ?? ''},
      project_type_id: {value: projectInfo.project_type_id, label: projectTypeMap[projectInfo.project_type_id] ?? ''},
      project_status_id: {
        value: projectInfo.project_status_id,
        label: projectStatusMap[projectInfo.project_status_id] ?? ''
      },
      file_ids: isEmpty(projectInfo.file_ids) ? '' : projectInfo.file_ids
    }

    formRef.setFieldsValue({
      ...baseContentFormData,
      // file_ids: 498243
    })

    if (!isEmpty(backId)) {
      formRef.setFieldValue('back_id', backId)
    }


    const pickedVal = pick(
      baseContentFormData,
      ['project_no', 'brand_id', 'project_name', 'project_type_id', 'project_status_id', 'time_ranges', 'days', 'area', 'area_unit', 'floor']
    );

    dispatch(initFormData(pickedVal))
  }

  /**
   * Form数据提交
   * @param changedValues
   * @param value
   */
  const valueChangeHandle = async (changedValues, value) => {
    console.log("valueChangeHandle", value, changedValues)
    if ('back_id' in changedValues) {
      const backId = changedValues['back_id'];
      setBackId(backId)
      return
    }

    if ("area_unit" in changedValues) {
      const area = pqiFormulas.calculateAreaUnit(changedValues.area_unit, value.area)
      formRef.setFieldValue('area', area)
    }

    if ("project_type_id" in changedValues) {
      const result = await getNumber({type: changedValues['project_type_id']})
      if (!result.success) {
        message.error('请求数据异常')
        return
      }

      const {data: {number: no}} = result
      formRef.setFieldValue('project_no', no)
    }

    if ("time_ranges" in changedValues) {
      const totalDays = pqiFormulas.calculateWorkDays(value.time_ranges)
      formRef.setFieldValue("days", totalDays)
      let costDetail = parseFloat(state.tableData.bottom[1].costDetail)
      if (isNaN(costDetail)) {
        costDetail = 0
      }

      const tmpArr = deepCopy(state.tableData.bottom)
      tmpArr[1].cost = costDetail * totalDays
      flushAll(tmpArr, 'bottom', true)
    }

    const currentFormData = formRef.getFieldsValue()
    dispatch(changeFormData(currentFormData))
  }

  /**
   * 提交数据格式化
   *
   * @param input
   */
  function transformData(inputData: InputData): TargetFormat {
    const equipmentList = isEmpty(state.tableData.dev) ? [{equipment_id: '', detail: '0'}] : state.tableData.dev
    console.log("transformData", inputData.submitData.file_ids)
    const reverseCalculate = map(inputData.top, 'col_0')
    const timeRanges = inputData.submitData.time_ranges
    const profitRateList = Object.values(pick(inputData.top[0], ['col_1', 'col_2', 'col_3', 'col_4', 'col_5', 'col_6', 'col_7']))
    // 初始化最终对象结构
    const result: TargetFormat = {
      area: get(inputData.submitData, 'area', '0'),
      area_unit: get(inputData.submitData, 'area_unit', 'sqm'),
      brand_id: get(inputData.submitData, 'brand_id', '0'),
      comm_at: null,
      comp_at: null,
      cost_price: get(inputData.mid4[0], 'cost', '0'),
      equipment_list: equipmentList,
      file_ids: inputData.submitData.file_ids,
      final_account_list: [
        ...tail(inputData.mid41.map(item => {
          return {
            cost_detail: item.costDetail,
            cost_type: item.item,
            price: item.cost
          }
        })),
        ...tail(inputData.mid42.map(item => {
          return {
            cost_detail: item.costDetail,
            cost_type: item.item,
            price: item.cost
          }
        })),
        ...tail(inputData.mid43.map(item => {
          return {
            cost_detail: item.costDetail,
            cost_type: item.item,
            price: item.cost
          }
        })),
        ...inputData.bottom.map(item => {
          return {
            cost_detail: item.costDetail,
            cost_type: item.item,
            price: item.cost
          }
        })
      ],
      floor: inputData.submitData.floor,
      profit_rate_list: [...profitRateList],
      projectData: {}, // 根据需要填充
      project_id: get(inputData.submitData, 'id', '0'),
      unit: "1", // 根据实际情况调整
      project_name: get(inputData.submitData, 'project_name', ''),
      project_no: get(inputData.submitData, 'project_no', ''),
      project_status_id: get(inputData.submitData, 'project_status_id', '0'),
      project_type_id: get(inputData.submitData, 'project_type_id', '0'),
      reverse_calculate: {
        profit_rate: reverseCalculate[0], // 示例值，应该根据实际情况计算
        profit: reverseCalculate[1], // 示例值
        total_amount_in_vat: reverseCalculate[2], // 示例值
        total_amount_ex_vat: reverseCalculate[3], // 示例值
        vat: reverseCalculate[4], // 示例值
      },
      time_ranges: timeRanges.map(item => {
        if ("" === item.date[0] || "" === item.date[1]) {
          return {
            date: ['', '']
          }
        }

        return {
          date: [dayjs(item.date[0], 'YYYY-MM-DD'), dayjs(item.date[1], 'YYYY-MM-DD')]
        }
      }),
      weekDay: inputData.submitData.days

    };

    return result;
  }


  /**
   * Form 数据change
   * @param formData
   */
  const formSubmitHandle = async (formData) => {
    console.log("formData", formData)
    const submitData = formatFormData(formData);
    const {top, mid4, mid41, mid42, mid43, bottom, dev} = state.tableData
    const currentData = {
      submitData,
      top,
      mid4,
      mid41,
      mid42,
      mid43,
      bottom,
      dev
    }

    const fullData = transformData(currentData)
    console.log("fullData:", fullData)
    const hide = message.loading('正在提交...');
    try {
      const result = await createOrUpdateProject(fullData)
      hide();
      if (result.success) {
        message.success('提交成功')
        if (isCreate) {
          onClose(true)
        }

        return
      }

      message.error('提交失败:' + result.message)
    } catch (err) {
      hide();
      message.error('提交时发生异常:' + (err as Error).message)
    }
  }

  const createInitDataHandle = () => {
    const baseTopTableData =
      [
        {
          no: "No.",
          item: "Item",
        },
        {
          no: "1",
          item: "Profit",
        },
        {
          no: "2-1",
          item: "Total Amount(In. VAT)",
        },
        {
          no: "2-2",
          item: "Total Amount(Ex. VAT)",
        },
        {
          no: "3",
          item: "VAT",
        }
      ]

    const baseDevTableData = [{
      equipment_id: undefined,
      detail: '0'
    }]

    const midTableData = [{
      "no": "4",
      "item": "Cost",
      "cost": "0"
    }]

    const struct = [1, 2, 3]
    let tmpArr: any = []
    struct.forEach((item, idx) => {
      let itemName = 'Vendor\'s cost'
      if (item === 2) {
        itemName = 'Carrier'
      } else if (item === 3) {
        itemName = 'Schneider'
      }
      tmpArr.push({
        no: `4-${item}`,
        item: itemName,
        cost: 0,
        costDetail: ''
      })
      dispatch(initTableData(`mid4${item}`, tmpArr))
      tmpArr = []
    })

    const struct48 = [
      {
        no: "4-4",
        item: "AV System Cost",
        cost: "0",
        costDetail: ""
      }, {
        no: "4-5",
        item: "Project Manager Salary",
        cost: "0",
        costDetail: ""
      },
      {
        no: "4-6",
        item: "Project Manager Bonus",
        cost: "0",
        costDetail: ""
      },
      {
        no: "4-7",
        item: "Travel Cost",
        cost: "0",
        costDetail: ""
      },
      {
        no: "4-8",
        item: "Other Incidental Expenses",
        cost: "0",
        costDetail: ""
      }
    ]
    dispatch(initTableData('top', baseTopTableData))
    dispatch(initTableData('mid4', midTableData))
    dispatch(initTableData(`bottom`, struct48))
    dispatch(initEquipmentData(baseDevTableData))
  }

  const initTableDataHandle = (baseData) => {
    let tableTopDateList: any = [];
    const {projectInfo} = baseData
    if (isCreate) {
      createInitDataHandle()
      return
    }

    const {top, mid} = state.tableData.formatData
    top.forEach((line, idx) => {
      let rowObj = {
        no: line[0],
        item: line[1],
      }

      const currentReverseCalculate = projectInfo.reverse_calculate
      // 利润率
      if (0 === idx) {
        rowObj['col_0'] = currentReverseCalculate?.profit_rate ?? ''
        projectInfo.profit_rate_list.forEach((item, index) => {
          rowObj[`col_${index + 1}`] = isEmpty(item) ? '' : item
        })
      }

      // 利润
      if (1 === idx) {
        rowObj['col_0'] = projectInfo.reverse_calculate?.profit ?? ''
        projectInfo.profit_rate_list.forEach((item, index) => {
          rowObj[`col_${index + 1}`] = item > 0 && item < 100 ? pqiFormulas.profitRateToProfit(projectInfo.cost_price, item) : ''
        })
      }

      // 含税
      if (2 === idx) {
        rowObj['col_0'] = projectInfo.reverse_calculate?.total_amount_in_vat ?? ''
        projectInfo.profit_rate_list.forEach((item, index) => {
          rowObj[`col_${index + 1}`] = item > 0 && item < 100 ? pqiFormulas.profitRateToInVat(projectInfo.cost_price, item, projectInfo.project_type_id) : ''
        })
      }

      // 不含税
      if (3 === idx) {
        rowObj['col_0'] = projectInfo.reverse_calculate?.total_amount_ex_vat ?? ''
        projectInfo.profit_rate_list.forEach((item, index) => {
          rowObj[`col_${index + 1}`] = item > 0 && item < 100 ? pqiFormulas.profitRateToExVat(projectInfo.cost_price, item) : ''
        })
      }

      // VAT
      if (4 === idx) {
        rowObj['col_0'] = projectInfo.reverse_calculate?.vat ?? ''
        projectInfo.profit_rate_list.forEach((item, index) => {
          rowObj[`col_${index + 1}`] = item > 0 && item < 100 ? pqiFormulas.profitRateToVat(projectInfo.cost_price, item, projectInfo.project_type_id) : ''
        })
      }

      tableTopDateList.push(rowObj);
    })

    for (let i = 0; i <= 7; i++) {
      let colName = `col_${i}`;
      if (tableTopDateList[0].hasOwnProperty(colName)) {
        tableTopDateList[0][colName] = formatToTwoDecimalPlaces(tableTopDateList[0][colName]);
      }
    }

    console.log("tableTopDateList", tableTopDateList)
    dispatch(initTableData('top', tableTopDateList))

    const rate = difference(Object.values(tableTopDateList[0]), Object.values(tableTopDateList[0]).splice(0, 2))
    let rates: {}[] = []
    for (const item in rate) {
      if (rate[item]) {
        rates.push({
          value: item,
          label: rate[item]
        })
      }
    }
    setRateList(rates)

    let midFormat = {...mid}
    // console.log(midFormat)
    midFormat.cost = projectInfo.cost_price
    midFormat.no = '4'
    dispatch(initTableData('mid4', [midFormat]))

    const {final_account_list} = projectInfo
    let to41 = 0
    let bottomData: any = []
    const bottomArr = [4, 5, 6, 7, 8]
    console.log("bottomArr:", final_account_list)
    bottomArr.forEach((item, idx) => {
      let tmp = final_account_list[item] ?? []
      let costDetail = tmp?.cost_detail ?? (tmp['list']?.[0]?.cost_detail ?? '')
      const formDays = formRef.getFieldValue('days')
      const days = formDays <= 0 ? 0 : formDays

      if (4 === item) {
        to41 = parseFloat(bcMath.add((tmp?.total_price ?? 0), to41))
      }

      if (5 === item && "" === costDetail) {
        costDetail = 0 === days ? 0 : bcMath.div(tmp.total_price, days, 2)
      }

      bottomData.push({
        no: `4-${item}`,
        item: tmp.cost_type_name,
        cost: tmp.total_price,
        costDetail: costDetail,
      })
    })

    dispatch(initTableData(`bottom`, bottomData))

    const struct = [3, 2, 1]
    struct.forEach((item, idx) => {
      let tmpArr: any = []
      if (isEmpty(final_account_list[item])) {
        let itemName = 'Vendor\'s cost'
        if (item === 2) {
          itemName = 'Carrier'
        } else if (item === 3) {
          itemName = 'Schneider'
        }
        tmpArr.push({
          no: `4-${item}`,
          item: itemName,
          cost: 1 === item ? to41 : 0,
        })
      } else {
        let totalPrice = final_account_list[item].total_price
        if (1 === item) {
          totalPrice = parseFloat(bcMath.add(totalPrice, to41))
        } else {
          to41 = parseFloat(bcMath.add(totalPrice, to41))
        }

        tmpArr.push({
          no: `4-${item}`,
          item: final_account_list[item].cost_type_name,
          cost: totalPrice,
        })

        final_account_list[item].list.forEach((val, i) => {
          tmpArr.push({
            no: `4-${item}-${i + 1}`,
            item: val.cost_type_name,
            cost: val.price,
            costDetail: val.cost_detail,
          })
        })
      }

      dispatch(initTableData(`mid4${item}`, tmpArr))
    })

    // 设备：
    let tmpEquipments: any = []
    const {equipment_list} = projectInfo;
    if (isEmpty(equipment_list) || equipment_list.length < 1) {
      tmpEquipments.push({
        equipment_id: undefined,
        detail: '0'
      })
    } else {
      console.log("equipment_list:", equipment_list)
      equipment_list.forEach((item, idx) => {
        tmpEquipments.push({
          equipment_id: item.equipment_id <= 0 ? undefined : item.equipment_id,
          detail: "" === item.detail ? 0 : item.detail
        })
      })
    }

    dispatch(initEquipmentData(tmpEquipments))
  }

  const changeTopTableValue = (row, col, costVal, value) => {
    const vatType = state.formData.project_type_id?.value ?? 0
    if (0 === row) {
      const profitRate = isEmpty(value) || '' === value || isNaN(value) ? '' : value;
      const profit = isEmpty(value) || '' === value || isNaN(value) ? '' : pqiFormulas.profitRateToProfit(costVal, value).toString()
      const inVat = isEmpty(value) || '' === value || isNaN(value) ? '' : pqiFormulas.profitRateToInVat(costVal, value, vatType).toString()
      const exVat = isEmpty(value) || '' === value || isNaN(value) ? '' : pqiFormulas.profitRateToExVat(costVal, value).toString()
      const vat = isEmpty(value) || '' === value || isNaN(value) ? '' : pqiFormulas.profitRateToVat(costVal, value, vatType).toString()
      dispatch(tableTopValueChange(col, [profitRate.toString(), profit, inVat, exVat, vat]))
    } else if (1 === row) {
      const profit = value
      const {exVat, vat, inVat, profitRate} = pqiFormulas.profitToOther(costVal, value, vatType)
      dispatch(tableTopValueChange(col, [profitRate.toString(), profit.toString(), inVat.toString(), exVat.toString(), vat.toString()]))
    } else if (2 === row) {
      const inVat = value;
      const {exVat, profit, profitRate, vat} = pqiFormulas.inVatToOther(costVal, value, vatType)
      dispatch(tableTopValueChange(col, [profitRate.toString(), profit.toString(), inVat.toString(), exVat.toString(), vat.toString()]))
    } else if (3 === row) {
      const exVat = value
      const {profit, profitRate, vat, inVat} = pqiFormulas.exVatToOther(costVal, value, vatType)
      dispatch(tableTopValueChange(col, [profitRate.toString(), profit.toString(), inVat.toString(), exVat.toString(), vat.toString()]))
    } else {
      const vat = value
      const {exVat, profitRate, profit, inVat} = pqiFormulas.vatToOther(costVal, value, vatType)
      dispatch(tableTopValueChange(col, [profitRate.toString(), profit.toString(), inVat.toString(), exVat.toString(), vat.toString()]))
    }

  }


  const changeMidTableValue = (type, index, pos, value) => {
    if (pos === 'cost') {
      let tmpArr: any = cloneDeep(state.tableData[type])
      tmpArr[index].cost = isEmpty(value) || isNaN(value) || '' === value ? '' : value
      flushAll(tmpArr, type, true)
    }

    if (pos === 'item' && index > 0) {
      dispatch(tableMidValueChange(type, index, pos, value))
    }
  }

  const changeBottomTableValue = (index, pos, value) => {
    let days = parseFloat(state.formData.days)
    let tmpArr = deepCopy(state.tableData['bottom'])
    if (isNaN(days)) {
      days = 0
    }

    if (pos === 'item') {
      tmpArr[index].costDetail = value
      if (index === 1) {
        tmpArr[index].cost = value * days
      }
    } else {
      tmpArr[index].cost = value
    }

    flushAll(tmpArr, 'bottom', true)
  }

  /**
   * 表格变更
   * @param type
   * @param value
   */
  const tableChangeHandle = (type: string, row: number, col: string, value: any, cost = null) => {
    const costVal = isNull(cost) ? (state.tableData.mid4[0]?.cost ?? 0) : cost
    if (type === 'top') {
      changeTopTableValue(row, col, costVal, value)
      return
    }

    if (startsWith(type, 'mid')) {
      changeMidTableValue(type, row, col, value)
      return
    }

    if (type === 'bottom') {
      changeBottomTableValue(row, col, value)
    }

    if (type === 'dev') {
      const devRowData = deepCopy(state.tableData.dev[row])
      if (col === 'equipment_id') {
        devRowData.equipment_id = isEmpty(value) ? undefined : value[0].value
        if (isEmpty(value)) {
          devRowData.detail = '0'
        }
      }

      if (col === 'detail') {
        const tmpValue = parseInt(value)
        if (isNaN(tmpValue)) {
          devRowData.detail = ''
        } else {
          devRowData.detail = value
        }
      }

      dispatch(tableDevValueChange(row, devRowData))
    }
  }

  const flushAll = (tmpArr, type, isFlushTop = false, detailCost = null) => {
    if ('bottom' !== type) {
      tmpArr[0].cost = sumBy(tail(tmpArr), (t) => {
        const tmp = parseFloat(t.cost)
        if (isNaN(tmp)) {
          return 0
        }
        return tmp
      })
    }

    let all: any = []
    // todo sum mid41 ~ mid43
    const tmp = ['mid41', 'mid42', 'mid43']
    tmp.forEach((item, idx) => {
      if (item !== type) {
        const r = state.tableData[item][0]?.cost ?? 0
        all.push(r)
      } else {
        all.push(tmpArr[0].cost)
      }
    })

    // todo sum mid44 ~ mid48
    let md44_8 = type === 'bottom' ? tmpArr : deepCopy(state.tableData['bottom'])
    md44_8.forEach((item, idx) => {
      const tmp = parseFloat(item.cost)
      if (isNaN(tmp)) {
        all.push(0)
      } else {
        all.push(item.cost)
      }

    })

    const {mid} = state.tableData.formatData
    let mid4Struct = {...mid}
    // mid4Struct.cost = sumBy(all, (t) => parseFloat(t)).toFixed(2)
    const currentState = {
      ...state.tableData,
      [type]: tmpArr,
      ['mid4']: [mid4Struct]
    }

    let tmpState = deepCopy(currentState)
    tmp.forEach(item => {
      if (!isEmpty(tmpState[item]) && isNumeric(tmpState[item][0]?.cost)) {
        tmpState[item][0].cost = tmpState[item][0].cost.toFixed(2)
      }
    })

    // todo 注意：4-1 = 4-1 +（4-2 + 4-3 + 4-4）
    // todo tmpState['mid41'][0].cost = tmpState['mid41'][0].cost + tmpState['mid42'][0].cost + tmpState['mid43'][0].cost + tmpState['bottom'][0].cost
    let tmpBottom0 = parseFloat((tmpState['bottom'][0]?.cost ?? 0));
    if (isNaN(tmpBottom0)) {
      tmpBottom0 = 0
    }

    // 重新计算41
    let sum41 = 0
    if (tmpState['mid41'].length > 0) {
      sum41 = sumBy(tail(tmpState['mid41']), (t) => {
        const tmp = parseFloat(t.cost)
        if (isNaN(tmp)) {
          return 0
        }

        return tmp
      })
    }

    const sum423 = parseFloat(tmpState['mid42'][0].cost) + parseFloat(tmpState['mid43'][0].cost) + tmpBottom0
    const mid41Total = parseFloat(bcMath.add(sum423, sum41, 2))
    const bottomTotal = sumBy(tail(tmpState['bottom']), (t) => {
      const tmp = parseFloat(t.cost)
      if (isNaN(tmp)) {
        return 0
      }

      return tmp
    })

    tmpState['mid41'][0].cost = mid41Total
    const totalAmount = bcMath.add(mid41Total, bottomTotal, 2)
    tmpState['mid4'][0].cost = parseFloat(totalAmount)
    dispatch(tableAllFlush(tmpState))
    if (isFlushTop) {
      const topLineData = state.tableData.top[0]
      for (let i = 0; i <= 7; i++) {
        tableChangeHandle('top', 0, `col_${i}`, topLineData[`col_${i}`], totalAmount)
      }
    }

  }

  /**
   * 添加表格行
   * @param index
   * @param type
   * @param value
   */
  const addTableRowHandle = (type: string, index: number) => {
    let tmpArr: any = []
    let i = 0
    if ('dev' === type) {
      state.tableData[type].forEach((item, idx) => {
        const tmpItem = {...item}
        tmpArr.push(tmpItem)
        i += 1
        if (index === idx) {
          tmpArr.push({
            equipment_id: undefined,
            detail: '0'
          })
          i += 1
        }
      })
      dispatch(initEquipmentData(tmpArr))
      return;
    }

    state.tableData[type].forEach((item, idx) => {
      const tmpItem = {...item}
      const lastStr = type[type.length - 1]
      tmpItem['no'] = i > 0 ? `4-${lastStr}-${i.toString()}` : `4-${lastStr}`
      tmpArr.push(tmpItem)
      i += 1
      if (index === idx) {
        tmpArr.push({
          no: `4-${lastStr}-${i.toString()}`,
          costDetail: '',
          item: tmpItem.item,
          cost: 0,
        })

        i += 1
      }
    })

    flushAll(tmpArr, type)
  }

  /**
   * 删除表格行
   * @param index
   * @param type
   * @param value
   */
  const delTableRowHandle = (type: string, index: number) => {
    let tmpArr: any = []
    let i = 0
    if ('dev' === type) {
      state.tableData[type].forEach((item, idx) => {
        if (idx !== index) {
          const tmpItem = {...item}
          tmpArr.push(tmpItem)
          i += 1;
        }
      })
      dispatch(initEquipmentData(tmpArr))
      return
    }

    state.tableData[type].forEach((item, idx) => {
      if (idx !== index) {
        const lastStr = type[type.length - 1]
        const tmpItem = {...item}
        tmpItem['no'] = i > 0 ? `4-${lastStr}-${i.toString()}` : `4-${lastStr}`
        tmpArr.push(tmpItem)
        i += 1;
      }
    })

    flushAll(tmpArr, type, true)
  }

  const handlePreviewClick = () => {
    window.open("/PDF/PQIPDF?id=" + state.baseData.currentRow.id, "_blank");
  }

  const loadData = async () => {
    let historyData: [] = []
    let projectData: any = {}
    if (!isCreate) {
      const projectParams = isEmpty(backId) ? {project_id: currentRow.id} : {back_project_id: backId}
      const projectInfoResult = await getProjectInfo(projectParams);
      const historyResult = !isCreate ? await getProjectBackListAll({project_id: currentRow.id}) : [];
      if (!projectInfoResult.success || !historyResult.success) {
        message.error("数据初始化失败")
        return;
      }

      projectInfoResult.data.time_ranges = projectInfoResult.data.time_ranges.map(item => {
        if (isEmpty(item.date)) {
          return {
            date: ['', '']
          }
        }

        return {
          date: [isEmpty(item.date[0]) ? '' : dayjs(item.date[0]), isEmpty(item.date[1]) ? '' : dayjs(item.date[1])]
        }
      })

      historyResult.data = isEmpty(historyResult.data) ? [] : historyResult.data.map(item => {
        return {
          value: item.back_id.toString(),
          label: `${item.project_no} - ${item.back_at} - ${item?.user_name}`,
        }
      })

      projectData = projectInfoResult.data
      historyData = historyResult.data
    }

    const equipmentListResult = await getProjectEquipmentList();
    if (!equipmentListResult.success) {
      message.error("数据初始化失败")
      return;
    }

    equipmentListResult.data = isEmpty(equipmentListResult.data) ? [] : equipmentListResult.data.map(item => {
      return {
        value: item.equipment_id,
        label: item.equipment_name ?? '',
      }
    })

    const baseData = {
      brandMap,
      projectTypeMap,
      projectStatusMap,
      currentRow,
      projectInfo: projectData,
      equipmentList: equipmentListResult.data
    }

    dispatch(initBaseData(baseData))
    initHistoryDataHandle(historyData)
    initTableDataHandle(baseData)
    if (!isCreate) {
      initFormDataHandle(baseData)
    }
  }

  useEffect(() => {
    loadData().catch(console.error)
    showButtonByType(saveButtonMappings, 'fullPQI', 'save', saveButtonMappings.saveButton).then(r => {
      console.log("rrrrr:", r[0])
      const showBtn = !isFunction(r[0]) ? null : r[0](formRef)
      console.log("showBtn:", showBtn)
      setCtrSaveButton(showBtn)
    })
  }, [formRef, backId]);

  // 组件返回渲染
  return (
    <>
      <Form
        form={formRef}
        onValuesChange={(changedValues, value) => valueChangeHandle(changedValues, value)}
        initialValues={{time_ranges: [{date: ['', '']}]}}
        onFinish={(formData) => formSubmitHandle(formData)}
      >
        <Content
          baseData={state.baseData}
          historyData={state.historyData}
        />

        <Budget
          baseData={state.baseData}
          tableData={state.tableData}
          onTableChange={tableChangeHandle}
          onAddTableRow={addTableRowHandle}
          onDelTableRow={delTableRowHandle}
        />
        <Form.Item name="id" label={false}>
          <Input type="hidden"/>
        </Form.Item>
        <Form.Item>
          {ctrSaveButton}
          <Button type="primary" onClick={handlePreviewClick}>
            预览
          </Button>
        </Form.Item>
      </Form>

      {
        !isCreate &&
        <>
          <Typography.Title level={4} style={{marginTop: 20, marginBottom: 20}}>中标操作</Typography.Title>
          <Bidder
            rateList={rateList}
            tableData={state.tableData}
            baseData={state.baseData}
          />
        </>
      }


    </>
  );
}

export default Estimate;
