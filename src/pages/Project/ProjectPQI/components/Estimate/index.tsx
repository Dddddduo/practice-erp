// 导入依赖
import React, {useEffect, useReducer} from 'react';
import {getProjectInfo, getProjectEquipmentList} from '@/services/ant-design-pro/project';
import Content from './Content'; // 假设你已经创建了这个子组件
import {estimateReducer, initialEstimateState} from '../../store/estimate'
import {Button, Form, Input, message} from "antd";
import {includes, isArray, isEmpty, isUndefined, sumBy, tail} from "lodash";
import {formatFormData} from "@/utils/utils";
import dayjs from "dayjs";
import Budget from "@/pages/Project/ProjectPQI/components/Estimate/Budget";
import SubBudget from "@/pages/Project/ProjectPQI/components/Estimate/SubBudget";

type MapType = { [key: string]: any }; // 用于映射任何键值对的类型

const data4 = [
  {
    no: '4',
    item: "Cost",
    cost: 0,
  },
];

const data41 = [
  {
    no: '4-1',
    item: "Vendor's cost",
    cost: 0,
  },
];

const data42 = [
  {
    no: '4-2',
    item: "Carrier",
    cost: 0,
  },
];

const data43 = [
  {
    no: '4-3',
    item: "Schneider",
    cost: 0,
  },
];

const tableTopFormat = [
  ["No.", "Item"],
  ["1", "Profit"],
  ["2-1", "Total Amount(In. VAT)"],
  ["2-2", "Total Amount(Ex. VAT)"],
  ["3", "VAT"],
];

const Estimate: React.FC<{
  brandMap: MapType;
  projectTypeMap: MapType;
  projectStatusMap: MapType;
  currentRow: any; // 根据实际情况定义类型
}> = ({brandMap, projectTypeMap, projectStatusMap, currentRow}) => {
  const [formRef] = Form.useForm();
  const [state, dispatch] = useReducer(estimateReducer, initialEstimateState);


  const getVatRate = (type) => {
    // const type = formRef.getFieldValue('project_type_id')
    let rate = 0.09;
    // todo...
    return rate
    if (type === 4) {
      rate = 0.06;
    }

    console.log("getVatRate:", rate, type)
    return rate;
  }


  const profitToOther = (cost, p, type) => {
    const exVat = parseFloat(cost) + parseFloat(p)
    const vat = getVatRate(type) * exVat
    const inVat = (getVatRate(type) + 1) * exVat
    const profitRate = (p / exVat) * 100;

  }

  const vatToOther = (cost, vat, type) => {
    const exVat = vat / getVatRate(type)
    const inVat = exVat + vat;
    const profit = exVat - cost
    const profitRate = (profit / exVat) * 100;
  }

  const exVatToOther = (cost, exVat, type) => {
    const profit = exVat - cost
    const profitRate = (profit / exVat) * 100;
    const vat = getVatRate(type) * exVat
    const inVat = (getVatRate(type) + 1) * exVat
  }

  const inVatToOther = (cost, inVat, type) => {
    const exVat = inVat / (getVatRate(type) + 1)
    const profit = exVat - cost
    const profitRate = (profit / exVat) * 100;
    const vat = getVatRate(type) * exVat
  }

  const subBudgetAdd = (type, index) => {
    const allData = formRef.getFieldsValue();
    console.log("allData:", allData)
    let tmp: any = [];
    let i = 0;
    let itemName = "Vendor's cost"
    let dataName = 'data41'
    let costName = 'cost41'
    if (type === "4-2") {
      itemName = "Carrier"
      dataName = 'data42'
      costName = 'cost42'
    } else if (type === "4-3") {
      itemName = "Schneider"
      dataName = 'data43'
      costName = 'cost43'
    }

    const costInputData = allData[costName]
    costInputData.forEach((item, idx) => {
      const tmpItem = {...item}
      tmpItem['no'] = i > 0 ? `${type}-${i.toString()}` : type
      i += 1
      tmp.push(tmpItem)
      if (idx === index) {
        tmp.push({
          no: i > 0 ? `${type}-${i.toString()}` : type,
          item: itemName,
          cost: 0,
        })

        i += 1;
      }
    })

    return {
      data: tmp,
      tableName: dataName,
      sum: sumBy(tail(tmp), (t) => parseFloat(t.cost))
    };
  }

  const subBudgetRemove = (type, index) => {
    const allData = formRef.getFieldsValue();
    let tmp: any = [];
    let i = 0;
    let dataName = 'data41'
    let costName = 'cost41'
    if (type === "4-2") {
      dataName = 'data42'
      costName = 'cost42'
    } else if (type === "4-3") {
      dataName = 'data43'
      costName = 'cost43'
    }

    const costInputData = allData[costName]
    costInputData.forEach((item, idx) => {
      if (idx !== index) {
        const tmpItem = {...item}
        tmpItem['no'] = i > 0 ? `${type}-${i.toString()}` : type
        tmp.push(tmpItem)
        i += 1;
      }
    })

    return {
      data: tmp,
      tableName: dataName,
      sum: sumBy(tail(tmp), (t) => parseFloat(t.cost))
    };
  }
  //
  const subBudgetHandle = (type, index, hType = 'add') => {
    if (hType === 'add') {
      const result = subBudgetAdd(type, index);
      formRef.setFieldValue("cost41", [{
        no: result.data[0].no,
        item: result.data[0].item,
        cost: result.sum,
      },
        ...result.data.slice(1)
      ])

      dispatch({
        type: "subBudgetHandle", payload: {
          data: [{
            no: result.data[0].no,
            item: result.data[0].item,
            cost: result.sum,
          },
            ...result.data.slice(1)
          ],
          tableType: result.tableName
        },
      })
      return
    }

    const result = subBudgetRemove(type, index);
    console.log("delresult", result);
    formRef.setFieldValue("cost41", [{
      no: result.data[0].no,
      item: result.data[0].item,
      cost: result.sum,
    },
      ...result.data.slice(1)
    ])
    dispatch({
      type: "subBudgetHandle", payload: {
        data: [{
          no: result.data[0].no,
          item: result.data[0].item,
          cost: result.sum,
        },
          ...result.data.slice(1)
        ],
        tableType: result.tableName
      },
    })


    // const allValues = formRef.getFieldsValue();
    // totalCostHandle(allValues)
    return
  }

  /**
   * 计算利润
   *
   * @param cost
   * @param pr
   */
  const profitRateToProfit = (cost, pr) => {
    return (cost * (pr / 100)) / (1 - (pr / 100))
  }

  const profitRateToExVat = (cost, pr) => {
    return parseFloat(cost) + (((pr / 100) * cost) / (1 - (pr / 100)))
  }

  const profitRateToVat = (cost, pr, type) => {
    return profitRateToExVat(cost, pr) * getVatRate(type);
  }

  const profitRateToInVat = (cost, pr, type) => {
    return profitRateToExVat(cost, pr) * (getVatRate(type) + 1);
  }


  /**
   * 计算面积
   *
   * @param unitVal
   * @param area
   */
  const handleAreaUnitChange = (unitVal: string, area?: number) => {
    if (isUndefined(area) || area <= 0 || (unitVal !== "sqm" && unitVal !== "sq.ft")) {
      return 0
    }

    if (unitVal === "sqm") {
      return (area * 0.092903).toFixed(2)
    }

    return (area * 10.7639).toFixed(2)
  };


  const totalCostHandle = (allValue) => {
    let cost41Val = 0
    let cost42Val = 0
    let cost43Val = 0
    const {cost41, cost42, cost43} = allValue
    if (!isEmpty(cost41) && isArray(cost41)) {
      cost41.forEach((item, idx) => {
        let tmp = parseFloat(item.cost)
        if (!isNaN(tmp) && idx > 0) {
          cost41Val += tmp
        }
      })
    }

    if (!isEmpty(cost42) && isArray(cost42)) {
      cost42.forEach((item) => {
        if (!isEmpty(item)) {
          let tmp = parseFloat(item)
          if (!isNaN(tmp)) {
            cost42Val += tmp
          }
        }
      })
    }

    if (!isEmpty(cost43) && isArray(cost43)) {
      cost43.forEach((item) => {
        if (!isEmpty(item)) {
          let tmp = parseFloat(item)
          if (!isNaN(tmp)) {
            cost43Val += tmp
          }
        }
      })
    }

    formRef.setFieldValue(['cost41', 0, 'cost'], cost41Val)
    return {
      cost41: cost41Val,
      cost42: cost42Val,
      cost43: cost43Val
    };
  }
  /**
   * 表单值变更
   *
   * @param changedValues
   * @param value
   */
  const valueChangeHandle = (changedValues, value) => {
    const firstKey = Object.keys(changedValues)[0];
    if (includes(["cost41", "cost42", "cost43"], firstKey)) {
      const costTableData = totalCostHandle(value)
      dispatch({
        type: "totalAmountHandle",
        payload: {
          middleAmount: costTableData
        }
      });
      return
    }

    console.log("valueChangeHandle", changedValues, value)

    if ("area_unit" in changedValues) {
      const area = handleAreaUnitChange(changedValues.area_unit, value.area)
      formRef.setFieldValue('area', area)
    }

    if ("time_ranges" in changedValues) {
      let totalDays = 0;
      value.time_ranges.forEach((item) => {
        if (isEmpty(item) || isEmpty(item?.date)) {
          return
        }

        const [startDate, endDate] = item.date
        if ("" === startDate || "" === endDate) {
          return;
        }

        let days = endDate.diff(startDate, 'day') + 1
        totalDays += days; // 累加到总天数
      })

      formRef.setFieldValue("days", totalDays)
    }

    // if () {
    //
    // }
  }

  /**
   * 初始化填充
   *
   * @param formRef
   * @param initData
   */
  const fillFormDataHandle = (formRef, initData) => {
    const {projectInfo, projectTypeMap} = initData
    if (isEmpty(projectInfo)) {
      return
    }

    formRef.setFieldsValue({
      // Content...
      ...projectInfo,
      brand_id: {value: projectInfo.brand_id, label: projectInfo.brand_en ?? ''},
      project_type_id: {value: projectInfo.project_type_id, label: projectTypeMap[projectInfo.project_type_id] ?? ''},
      project_status_id: {
        value: projectInfo.project_status_id,
        label: projectStatusMap[projectInfo.project_status_id] ?? ''
      },
      cost41: data41
      // ...
    })

  }

  useEffect(() => {
    const loadData = async () => {
      const projectInfo = await getProjectInfo({project_id: currentRow.id});
      const equipmentListResult = await getProjectEquipmentList();
      if (!projectInfo.success || !equipmentListResult.success) {
        message.error("数据初始化失败")
        return;
      }

      let infoData = projectInfo.data
      infoData.time_ranges = infoData.time_ranges.map(item => {
        if (isEmpty(item.date)) {
          return {
            date: ['', '']
          }
        }

        return {
          date: [dayjs(item.date[0], 'YYYY-MM-DD'), dayjs(item.date[1], 'YYYY-MM-DD')]
        }
      })

      let tableTopDateList: any = [];
      tableTopFormat.forEach((line, idx) => {
        let rowObj = {
          no: line[0],
          item: line[1],
        }

        // 利润率
        if (0 === idx) {
          rowObj['col_0'] = infoData.reverse_calculate?.profit_rate ?? ''
          infoData.profit_rate_list.forEach((item, index) => {
            rowObj[`col_${index + 1}`] = isEmpty(item) ? '' : item
          })
        }

        // 利润
        if (1 === idx) {
          rowObj['col_0'] = infoData.reverse_calculate?.profit ?? ''
          infoData.profit_rate_list.forEach((item, index) => {
            rowObj[`col_${index + 1}`] = profitRateToProfit(infoData.cost_price, item)
          })
        }

        // 含税
        if (2 === idx) {
          console.log(infoData)
          rowObj['col_0'] = infoData.reverse_calculate?.profit ?? ''
          infoData.profit_rate_list.forEach((item, index) => {
            rowObj[`col_${index + 1}`] = profitRateToInVat(infoData.cost_price, item, infoData.project_type_id)
          })
        }

        // 不含税
        if (3 === idx) {
          console.log(infoData)
          rowObj['col_0'] = infoData.reverse_calculate?.profit ?? ''
          infoData.profit_rate_list.forEach((item, index) => {
            rowObj[`col_${index + 1}`] = profitRateToExVat(infoData.cost_price, item)
          })
        }

        // VAT
        if (4 === idx) {
          console.log(infoData)
          rowObj['col_0'] = infoData.reverse_calculate?.vat ?? ''
          infoData.profit_rate_list.forEach((item, index) => {
            rowObj[`col_${index + 1}`] = profitRateToVat(infoData.cost_price, item, infoData.project_type_id)
          })
        }

        tableTopDateList.push(rowObj);
      })


      // infoData.time_ranges = ["hello"];
      const initData = {
        brandMap,
        projectTypeMap,
        projectStatusMap,
        tableTopDateList,
        projectInfo: infoData,
        equipmentInfo: isEmpty(equipmentListResult.data) ? [] : equipmentListResult.data.map(item => {
          return {
            [item.equipment_id]: item.equipment_name,
          }
        }),
        data4,
        data41,
        data42,
        data43
        // formRef,
      }


      // [dayjs('2023-01-01', 'YYYY-MM-DD'), dayjs('2023-01-11', 'YYYY-MM-DD')]
      dispatch({
        type: 'initBaseData',
        payload: initData
      })

      if (!isEmpty(formRef)) {
        fillFormDataHandle(formRef, initData)
      }
    }

    if (Object.keys(brandMap).length > 0) {
      loadData().catch(console.error)
    }

  }, [brandMap, formRef]);

  const formSubmitHandle = async (formData) => {
    const submitData = formatFormData(formData);
    console.log("formSubmitHandle:", submitData)
    console.log("formSubmitHandle:", state.commonData.data41)
  }

  // 组件返回渲染
  return (
    <>
      <Form
        // dateFormatter={(value, valueType) => (value.format('YYYY/MM/DD'))}
        form={formRef}
        onValuesChange={(changedValues, value) => valueChangeHandle(changedValues, value)}
        initialValues={{}}
        onFinish={(formData) => formSubmitHandle(formData)}
      >
        <Content
          fullState={state}
          dispatch={dispatch}
        />
        <Budget
          fullState={state}
          dispatch={dispatch}
          onSubBudgeHandle={subBudgetHandle}
        />
        {/*<SubBudget fullState={state} dispatch={dispatch} />*/}
        <Form.Item name="id" label={false}>
          <Input type="hidden"/>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Form.Item>
      </Form>

      {/*<Equipment*/}
      {/*  equipmentMap={equipmentMapState}*/}
      {/*  onChildChange={childChangeHandle.bind(null, 'equipment')}*/}
      {/*/>*/}
      {/*<Budget*/}
      {/*  onChildChange={childChangeHandle.bind(null, 'budget')}*/}
      {/*/>*/}
      {/*<BidWinOperate*/}
      {/*  onChildChange={childChangeHandle.bind(null, 'bidWinOperate')}*/}
      {/*/>*/}
    </>
  );
}

export default Estimate;
