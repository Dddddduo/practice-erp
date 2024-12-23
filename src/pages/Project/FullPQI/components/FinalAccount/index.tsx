// 导入依赖
import React, {useEffect, useState} from 'react';
import {Button, DatePicker, Drawer, Form, Input, message, Modal, Table} from "antd";
import {find, get, isEmpty, sumBy, tail} from "lodash";
import {MinusCircleOutlined, PlusCircleOutlined} from "@ant-design/icons";
import {
  addCollectMoneyItem, addVoCostItem,
  getAccountList,
  getCollectMoneyList,
  getProjectInfo, getVoCostList
} from "@/services/ant-design-pro/project";
import {bcMath, millennials} from "@/utils/utils";
import {produce} from "immer";
import {deepCopy} from "ali-oss/lib/common/utils/deepCopy";
import pqiFormulas from "@/pages/Project/FullPQI/formulas";
import UploadFiles, {allowFileTypes} from "@/components/UploadFiles";
import Reimbursement from "./Reimbursement";
import SubmitButton from "@/components/Buttons/SubmitButton";
import dayjs, {isDayjs} from "dayjs";
import {getUserButtons} from "@/services/ant-design-pro/user";
import {InvoiceRequestForm} from "@/components/Finance/InvoiceRequestForm";
import {getFinanceCollInfoBatch} from "@/services/ant-design-pro/aggregateQuotes";
import {createOrUpdateFinanceCollAlone} from "@/services/ant-design-pro/quotation";


type MapType = { [key: string]: any }

interface FinalAccountProps {
  brandMap: MapType[];
  projectTypeMap: MapType[];
  projectStatusMap: MapType[];
  currentRow: MapType; // 根据实际情况定义类型
}

const FinalAccount: React.FC<FinalAccountProps> = ({brandMap, projectTypeMap, projectStatusMap, currentRow}) => {
  const [baseData, setBaseData] = useState<{ [key: string]: any }>({})

  const [tableData, setTableData] = useState<{ [key: string]: any }>({})

  const [showInvoicing, setShowInvoicing] = useState(false)

  const [currentRowId, setCurrentRowId] = useState(null);

  const [openUpload, setOpenUpload] = useState<boolean>(false)

  const [currentItem, setCurrentItem] = useState({})

  const [reset, setReset] = useState(false)

  const [formRef] = Form.useForm();

  const [showSaveBtn, setShowSaveBtn] = useState(false)

  const [records, setRecords] = useState<{ [key: string]: any }[]>([])

  const [reloadRecord, setReloadRecord] = useState<boolean>(false);
  const valueChangeHandle = (changedValues, value) => {
    console.log("valueChangeHandle", changedValues, value)
  }

  const calcTotal = (collectData, voData, total) => {
    const totalData = deepCopy(total)
    const voFirstProfit = sumBy(tail(voData), (t) => parseFloat(t.profit_price)).toFixed(2)
    const voFirstPrice = sumBy(tail(voData), (t) => parseFloat(t.price)).toFixed(2)
    const voFirstTaxPrice = sumBy(tail(voData), (t) => parseFloat(t.tax_price)).toFixed(2)
    const voFirstSubTotalPrice = sumBy(tail(voData), (t) => parseFloat(t.sub_total_price)).toFixed(2)
    const voFirstCostPrice = sumBy(tail(voData), (t) => parseFloat(t.cost_price)).toFixed(2)
    const voFirstProfitRate = (parseFloat(bcMath.div(parseFloat(voFirstProfit), parseFloat(voFirstPrice), 4)) * 100).toFixed(2)
    voData[0].price = voFirstPrice
    voData[0].profit_price = voFirstProfit
    voData[0].tax_price = voFirstTaxPrice
    voData[0].sub_total_price = voFirstSubTotalPrice
    voData[0].cost_price = voFirstCostPrice
    voData[0].profit_rate = voFirstProfitRate
    const voFirstRow = voData[0]
    const collectFirstRow = collectData[0]
    const totalProfit = bcMath.add(voFirstRow.profit_price, collectFirstRow.profit_price, 2)
    const totalPrice = bcMath.add(voFirstRow.price, collectFirstRow.price, 2)
    totalData[0].price = totalPrice
    totalData[0].tax_price = bcMath.add(voFirstRow.tax_price, collectFirstRow.tax_price, 2)
    totalData[0].sub_total_price = bcMath.add(voFirstRow.sub_total_price, collectFirstRow.sub_total_price, 2)
    totalData[0].cost_price = bcMath.add(voFirstRow.cost_price, collectFirstRow.cost_price, 2)
    totalData[0].profit_price = totalProfit
    totalData[0].profit_rate = (parseFloat(bcMath.div(parseFloat(totalProfit), parseFloat(totalPrice), 4)) * 100).toFixed(2)
    return {
      voData,
      totalData
    }
  }

  const createProjectNoPrefix = (str) => {
    if ("" === str || isEmpty(str)) {
      return ''
    }

    const matches = str.match(/-/g); // 使用正则表达式匹配所有的 '-'
    const cnt = matches ? matches.length : 0; // 如果没有匹配项，返回0
    if (0 === cnt) {
      return str
    }

    if (1 === cnt) {
      return str.split('-')[0]
    }

    if (2 === cnt) {
      return str
    }

    const lastIndex = str.lastIndexOf("-");
    return str.substring(0, lastIndex);
  }

  const addTableRowHandle = (type: string, index: number) => {
    let tmpArr: any = []
    let i = 0
    let j = 0
    const initData = {
      supplier_name: '',
      project_no: '',
      price: 0,
      percent: 100,
      tax_price: 0,
      sub_total_price: 0,
      cost_price: 0,
      profit_price: 0,
      profit_rate: 0,
      estimate_bill_at: '',
      estimate_collect_at: '',
    };

    if ('collect' === type) {
      tableData.collectData.forEach((item, idx) => {
        let projectNoPrefix = createProjectNoPrefix(item.project_no)
        console.log("projectNoPrefix", projectNoPrefix)
        const tmpItem = {...item}
        if (i > 0) {
          tmpItem.project_no = `${projectNoPrefix}-${i}`
        }

        tmpArr.push(tmpItem)
        i += 1
        if (index === idx) {
          initData.project_no = `${projectNoPrefix}-${i}`
          initData.percent = 0
          tmpArr.push(initData)
          i += 1
        }
      })

      setTableData(currentState => produce(currentState, draftState => {
        draftState.collectData = tmpArr
      }));

      return;
    }

    if ('vo' === type) {
      let projectName = ''
      tableData.voCostData.forEach((item, idx) => {
        let tmpPrefix = item.project_no.split('-VO')
        projectName = tmpPrefix[0]
        let currentI = 0
        if (!isEmpty(tmpPrefix[1])) {
          const [currI] = tmpPrefix[1].split('-')
          currentI = parseInt(currI)
        }

        if ((currentI) > i) {
          i += 1
          j = 0
        }

        const tmpItem = {...item}
        if (idx > 0) {
          tmpItem.project_no = `${projectName}-VO${i}-${j + 1}`
        }

        tmpArr.push(tmpItem)
        j += 1
        if (idx === index && index > 0) {
          initData.project_no = `${projectName}-VO${i}-${j + 1}`
          tmpArr.push(initData)
          j += 1
        }
      })

      if (0 === index) {
        initData.project_no = `${projectName}-VO${i + 1}-1`
        tmpArr.push(initData)
      }

      setTableData(currentState => produce(currentState, draftState => {
        draftState.voCostData = tmpArr
      }));
    }
  }

  const delTableRowHandle = (type: string, index: number) => {
    let tmpArr: any = []
    let i = 0
    let j = 0
    if ('collect' === type) {
      tableData.collectData.forEach((item, idx) => {
        let projectNoPrefix = createProjectNoPrefix(item.project_no)
        if (idx !== index) {
          const tmpItem = {...item}
          if (i > 0) {
            tmpItem.project_no = `${projectNoPrefix}-${i}`
          }

          tmpArr.push(tmpItem)
          i += 1;
        }
      })

      setTableData(currentState => produce(currentState, draftState => {
        draftState.collectData = tmpArr
      }));

      return
    }

    if ('vo' === type) {
      let projectName = ''
      let tmp = 0
      tableData.voCostData.forEach((item, idx) => {
        let tmpPrefix = item.project_no.split('-VO')
        projectName = tmpPrefix[0]
        let currentI = 0
        if (!isEmpty(tmpPrefix[1])) {
          const [currI] = tmpPrefix[1].split('-')
          currentI = parseInt(currI)
        }

        if (currentI !== tmp && idx !== index) {
          tmp = currentI
          i += 1
          j = 0
        }

        const tmpItem = {...item}
        if (idx > 0) {
          tmpItem.project_no = `${projectName}-VO${i}-${j + 1}`
        }

        if (idx !== index) {
          tmpArr.push(tmpItem)
          j += 1
        }
      })

      setTableData(currentState => produce(currentState, draftState => {
        const collect = currentState?.collectData ?? []
        const total = currentState?.totalData ?? []
        const {voData, totalData} = calcTotal(collect, tmpArr, total)
        draftState.voCostData = voData
        draftState.totalData = totalData
      }));
    }
  }

  const formSubmitHandle = async () => {
    const collectParams = {
      project_id: baseData.projectInfo.id,
      collent_list: tableData.collectData.map((item, idx) => {
        if (idx === 0) {
          return item
        }

        return {
          ...item,
          project_no: createProjectNoPrefix(item.project_no)
        }
      })
    }

    let voData = tail(deepCopy(tableData.voCostData))
    voData.map(item => {
      let tmpVal = item.project_no.split('VO')
      const [i, j] = tmpVal[1].split('-')
      const projectNo = `${i - 1}_${j - 1}`
      item.project_no = projectNo
      return item
    })


    // console.log("voData", voData)
    // return
    // voData = voData
    const voParams = {
      project_id: baseData.projectInfo.id,
      vo_cost_list: voData
    }

    const hide = message.loading('正在提交...');
    try {
      const collectResult = await addCollectMoneyItem(collectParams)
      const voResult = await addVoCostItem(voParams)
      hide()
      if (!collectResult.success) {
        message.error('提交失败:' + collectResult.message)
        return
      }

      if (!voResult.success) {
        message.error('提交失败:' + voResult.message)
        return
      }

      message.success('提交成功')
      setReset(prevState => {
        return !prevState
      })
    } catch (error) {
      hide()
      message.error('提交时发生异常:' + (error as Error).message)
    }
  }

  const tableChangeHandle = (type: string, index: string, col: string, value: any) => {
    // console.log(type, index, col, value)
    if (col === 'estimate_bill_at') {
      setTableData(currentState => produce(currentState, draftState => {
        const tmpType = type === 'collect' ? 'collectData' : 'voCostData'
        draftState[tmpType][index].estimate_bill_at = isEmpty(value) || value === '' ? '' : dayjs(value).format("YYYY-MM-DD")
      }))
      return
    }

    const currentVat = parseFloat(baseData.projectInfo.tax_rate)

    if (type === 'vo') {
      if ('supplier_name' === col) {
        setTableData(currentState => produce(currentState, draftState => {
          draftState.voCostData[index].supplier_name = value
        }))
        return
      }

      setTableData(currentState => produce(currentState, draftState => {

        // const totalItem = currentState.voCostData[0];
        // 新改写（原因：不要每次取第0条，应该是当前的数据）
        const totalItem = currentState.voCostData[index];

        const preItem = currentState.voCostData[index]
        const preCost = preItem?.cost_price ?? '0';
        const collect = currentState?.collectData ?? []
        const total = currentState?.totalData ?? []
        const allVoItem = [...draftState.voCostData]


        const {
          price,
          tax,
          subTotal,
          cost,
          profit,
          profitRate
        } = pqiFormulas.inputToOther(value, currentVat, totalItem, col, type, preCost)

        if (col !== 'cost_price') {

          allVoItem[index].price = price
          allVoItem[index].tax_price = tax
          allVoItem[index].sub_total_price = subTotal
        }

        console.log('profit利润', profit)

        allVoItem[index].cost_price = cost
        allVoItem[index].profit_price = profit
        allVoItem[index].profit_rate = profitRate
        const {voData, totalData} = calcTotal(collect, allVoItem, total)
        draftState.voCostData = voData
        draftState.totalData = totalData
      }));
    }
    if (type === 'collect') {
      setTableData(currentState => produce(currentState, draftState => {
        const totalItem = currentState.collectData[0];
        const tmpItem = draftState.collectData[index]; // 直接引用，因为Immer允许我们这么做
        const {
          price,
          percent,
          tax,
          subTotal,
          cost,
          profit,
          profitRate
        } = pqiFormulas.inputToOther(value, currentVat, totalItem, col)

        tmpItem.price = price
        tmpItem.percent = percent
        tmpItem.tax_price = tax
        tmpItem.sub_total_price = subTotal
        tmpItem.cost_price = cost
        tmpItem.profit_price = profit
        tmpItem.profit_rate = profitRate
      }));
    }
  }

  const inputStyles = {
    width: "80%",
    border: "none",
    borderBottom: "1px solid red",
    outline: 'none',
    background: 'none',
    textAlign: 'center',
    overflow: 'hidden'
  }

  // 倒算百分比
  const reverseComputePercent = (num1: any, num2: any) => {
    // 先相除，并保留4位精度
    const res = parseFloat(bcMath.div(num1, num2, 4))

    // 再相乘(100)，并保留2位精度
    return bcMath.mul(res, 100, 2)
  }

  const initTableData = (initData) => {
    let collectArr: any = []
    let voCostArr: any = []

    let projectName = '';
    const {collectMoneyList, voCostList} = initData
    console.log("collectMoneyList1:", collectMoneyList)
    collectMoneyList.forEach((item, idx) => {
      if (0 === idx) {
        projectName = item.project_no
      }

      const profit = item.profit_price
      const price = item.price
      const tmpRate = parseFloat(bcMath.div(profit, price, 4)) * 100
      const rate = isNaN(tmpRate) ? '0' : tmpRate.toFixed(2)
      collectArr.push({
        id: item.id,
        project_no: 0 === idx ? item.project_no : `${item.project_no}-${idx}`,
        price: item.price,
        // percent: item.percent,
        percent: 0 === idx ? item.percent : Number(collectMoneyList[0].price) > 0 && Number(item.percent) === 0 ? reverseComputePercent(item.price, collectMoneyList[0].price) : item.percent,
        tax_price: item.tax_price,
        sub_total_price: bcMath.add(item.price, item.tax_price, 2),
        cost_price: item.cost_price,
        profit_price: item.profit_price,
        profit_rate: rate,
        estimate_bill_at: 0 === idx ? '' : (isEmpty(item?.estimate_bill_at) ? '' : item?.estimate_bill_at),
        estimate_collect_at: 0 === idx ? '' : (isEmpty(item?.estimate_collect_at) ? '' : item?.estimate_collect_at),
        bill_at: 0 === idx ? '' : (isEmpty(item?.bill_at) ? '' : item?.bill_at),
        collect_at: 0 === idx ? '' : (isEmpty(item?.collect_at) ? '' : item?.collect_at),
      })
    })

    console.log("collectMoneyList2:", collectMoneyList)

    voCostList.forEach((item, idx) => {
      console.log("item", item)
      let projectNo = item.project_no;
      const [i, j] = projectNo.split("_")
      const profit = item.profit_price
      const price = item.price
      const tmpRate = parseFloat(bcMath.div(profit, price, 4)) * 100
      const rate = tmpRate.toFixed(2)
      voCostArr.push({
        id: item.id,
        file_ids: isEmpty(item.file_ids) ? '' : item.file_ids.join(','),
        supplier_name: item.supplier_name,
        project_no: `${projectName}-VO${parseInt(i) + 1}-${parseInt(j) + 1}`,
        price: item.price,
        percent: item.percent,
        tax_price: item.tax_price,
        sub_total_price: bcMath.add(item.price, item.tax_price, 2),
        cost_price: item.cost_price,
        profit_price: item.profit_price,
        profit_rate: rate,
        estimate_bill_at: (isEmpty(item?.estimate_bill_at) || '' === item.estimate_bill_at ? '' : item?.estimate_bill_at),
        estimate_collect_at: (isEmpty(item?.estimate_collect_at) || '' === item.estimate_collect_at ? '' : item?.estimate_collect_at),
        bill_at: (isEmpty(item?.bill_at) || '' === item.bill_at ? '' : item?.bill_at),
        collect_at: (isEmpty(item?.collect_at) || '' === item.collect_at ? '' : item?.collect_at),
      })
    })

    console.log("voCostArr", voCostArr)
    const firstProfit = sumBy(voCostList, (t) => parseFloat(t.profit_price)).toFixed(2)
    const firstPrice = sumBy(voCostList, (t) => parseFloat(t.price)).toFixed(2)
    const tmpRate = parseFloat(bcMath.div(parseFloat(firstProfit), parseFloat(firstPrice), 4)) * 100
    const rate = tmpRate.toFixed(2)
    const firstVo = {
      id: 0,
      supplier_name: '',
      project_no: projectName + '-VO',
      price: firstPrice,
      percent: 100,
      tax_price: sumBy(voCostList, (t) => parseFloat(t.tax_price)).toFixed(2),
      sub_total_price: sumBy(voCostList, (t) => parseFloat(t.sub_total_price)).toFixed(2),
      cost_price: sumBy(voCostList, (t) => parseFloat(t.cost_price)).toFixed(2),
      profit_price: firstProfit,
      profit_rate: rate,
      estimate_bill_at: '',
      estimate_collect_at: '',
    };

    voCostArr.unshift(firstVo)

    const totalProfit = bcMath.add(parseFloat(firstVo.profit_price), get(collectArr[0], 'profit_price', 0), 2)
    const totalPrice = bcMath.add(parseFloat(firstVo.price), get(collectArr[0], 'price', 0), 2)
    const totalAmount = {
      project_no: 'Total Amount:',
      price: totalPrice,
      percent: '',
      tax_price: bcMath.add(parseFloat(firstVo.tax_price), get(collectArr[0], 'tax_price', 0), 2),
      sub_total_price: bcMath.add(parseFloat(firstVo.sub_total_price), get(collectArr[0], 'sub_total_price', 0), 2),
      cost_price: bcMath.add(parseFloat(firstVo.cost_price), get(collectArr[0], 'cost_price', 0), 2),
      profit_price: totalProfit,
      profit_rate: bcMath.mul(parseFloat(bcMath.div(parseFloat(totalProfit), parseFloat(totalPrice), 4)), 100, 2),
      estimate_bill_at: '',
      estimate_collect_at: '',
    }

    const initTableData = {
      collectData: collectArr,
      voCostData: voCostArr,
      totalData: [totalAmount]
    }

    setTableData(initTableData)
  }

  const formatRecords = async (record) => {
    const project = baseData?.projectInfo;
    if (isEmpty(project)) {
      return;
    }

    // console.log("record", record?.sub_total_price ?? 0);
    const params = {
      trd_id: project.id,
      trd_sub_id: record.id,
      trd_type: "pqi_coll",
    }

    console.log("record",);
    const hide = message.loading('loading...');
    try {
      const result = await getFinanceCollInfoBatch(params);
      if (!result.success) {
        message.error(result.message);
        return;
      }

      setRecords(result.data);
      setCurrentRowId(record)
      setShowInvoicing(true)
    } catch (error) {
      message.error((error as Error).message);
    } finally {
      hide();
    }
  }

  useEffect(() => {


    const loadData = async () => {
      const projectParams = {project_id: currentRow.id}
      const projectInfoResult = await getProjectInfo(projectParams)


      const collectMoneyListResult = await getCollectMoneyList(projectParams)
      const accountListResult = await getAccountList()
      const voCostListResult = await getVoCostList(projectParams)
      if (!collectMoneyListResult.success || !accountListResult.success || !voCostListResult.success || !projectInfoResult.success) {
        message.error("数据初始化失败")
        return;
      }

      const initData = {
        collectMoneyList: collectMoneyListResult.data,
        accountList: accountListResult.data,
        voCostList: voCostListResult.data,
        projectInfo: projectInfoResult.data,
        brandMap,
        projectTypeMap,
        projectStatusMap,
        currentRow,
      }

      setBaseData(initData)
      initTableData(initData)
    }

    loadData().catch(console.error)
  }, [formRef, reset]);

  const getTopColumns = (vatRate, type) => {
    return [
      {
        title: 'Item.',
        dataIndex: 'project_no',
        width: "12%",
        align: "center",
        render: (_, record, index) => {
          return index > 0 && type === 'vo' ?
            <p
              style={{width: "100%"}}
            >
              {record.project_no}
              <input
                style={inputStyles} value={record.supplier_name}
                onChange={(e) => tableChangeHandle(type, index, 'supplier_name', e.target.value)}
              />
            </p> :
            <p style={{width: "100%"}}>{record.project_no}</p>
        },
      },
      {
        title: 'Price',
        dataIndex: 'price',
        width: "8%",
        align: "center",
        render: (_, record, index) => {
          return (
            index > 0 ? <p style={{width: "100%"}}>
                <input style={inputStyles} value={record.price}
                       onChange={(e) => tableChangeHandle(type, index, 'price', e.target.value)}/>
              </p> :
              <p>{millennials(record.price)}</p>
          )
        },
      },
      {
        title: '%',
        dataIndex: 'percent',
        width: "5%",
        align: "center",
        render: (_, record, index) => {
          return (
            index > 0 && type === 'collect' ?
              <p style={{width: "100%"}}>
                <input
                  style={inputStyles}
                  value={record.percent}
                  onChange={(e) => tableChangeHandle(type, index, 'percent', e.target.value)}
                />
                %
              </p> :
              type !== 'total' ? <p>{`${record.percent}%`}</p> : ''
          )
        },
      },
      {
        title: `${vatRate}%VAT`,
        dataIndex: 'tax_price',
        width: "5%",
        align: "center",
        render: (_, record, index) => {
          return <p>{millennials(record.tax_price)}</p>
        },
      },
      {
        title: 'Sub-total',
        width: "8%",
        align: "center",
        dataIndex: 'sub_total_price',
        render: (_, record, index) => {
          return <p>{millennials(record.sub_total_price)}</p>
        },
      },
      {
        title: 'Cost',
        dataIndex: 'cost_price',
        width: "8%",
        align: "center",
        render: (_, record, index) => {
          return index > 0 && type === 'vo' ? <input style={inputStyles} value={record.cost_price}
                                                     onChange={(e) => tableChangeHandle(type, index, 'cost_price', e.target.value)}/> :
            <p>{millennials(record.cost_price)}</p>
        },
      },
      {
        title: 'Profit',
        dataIndex: 'profit_price',
        width: "8%",
        align: "center",
        render: (_, record, index) => {
          return <p>{millennials(record.profit_price)}</p>
        },
      },
      {
        title: 'Rate',
        dataIndex: 'profit_rate',
        width: "5%",
        align: "center",
        render: (_, record, index) => {
          return <p>{`${record.profit_rate}%`}</p>
        },
      },
      {
        title: '预计开票日期',
        dataIndex: 'estimate_bill_at',
        width: "8%",
        align: "center",
        render: (_, record, index) => {
          const billAt = isEmpty(record.estimate_bill_at) || '' === record.estimate_bill_at ? '' : dayjs(record.estimate_bill_at)
          return <div>
            {
              index > 0 && <DatePicker
                value={billAt}
                onChange={(value) => tableChangeHandle(type, index, 'estimate_bill_at', value)}
              />
            }
          </div>
        },
      },
      {
        title: '实际开票日期',
        dataIndex: 'bill_at',
        width: "8%",
        align: "center",
        render: (_, record, index) => {
          return <p>{isEmpty(record?.bill_at) ? '' : ('-0001-11-30' === record.bill_at ? '' : record.bill_at)}</p>
        },
      },
      {
        title: '预计收款日期',
        dataIndex: 'estimate_collect_at',
        width: "8%",
        align: "center",
        render: (_, record, index) => {
          return <p>{isEmpty(record?.estimate_collect_at) ? '' : ('-0001-11-30' === record.estimate_collect_at ? '' : record.estimate_collect_at)}</p>
        },
      },
      {
        title: '实际收款日期',
        dataIndex: 'collect_at',
        width: "8%",
        align: "center",
        render: (_, record, index) => {
          return <p>{isEmpty(record?.collect_at) ? '' : ('-0001-11-30' === record.collect_at ? '' : record.collect_at)}</p>
        },
      },
      {
        title: '操作',
        dataIndex: 'operate',
        width: "8%",
        align: "center",
        render: (_, record, index) => {
          if (type === 'total') {
            return ''
          }

          return <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <div style={{width: '50%', display: 'flex', justifyContent: 'space-around', alignItems: 'center'}}>
              <PlusCircleOutlined
                key={`js_operate_add_${index}`}
                style={{fontSize: 20}}
                onClick={() => addTableRowHandle(type, index)}
              />
              {
                (index > 0 && !record?.collect_at && !record?.estimate_collect_at && !record?.bill_at) &&
                <MinusCircleOutlined
                  key={`js_operate_del_${index}`}
                  onClick={() => delTableRowHandle(type, index)} style={{fontSize: 20}}
                />
              }
            </div>
            {index > 0 && (type === 'collect' || type === 'vo') && (!isEmpty(record) && record.id > 0) &&
              <Button style={{marginTop: 12}} type="primary" onClick={() => {
                formatRecords(record).catch(console.log)
                if (type === 'vo') {
                  setCurrentItem((tableData.voCostData[index] ?? {}))
                } else {
                  setCurrentItem((tableData.collectData[index] ?? {}))
                }
              }}>开票收款</Button>}
            {index > 0 && type === 'vo' && <Button style={{marginTop: 20}} onClick={() => {
              setCurrentRowId(index)
              setOpenUpload(true)

            }} type="primary">附件上传</Button>}
          </div>
        },
      }
    ]
  }

  const fileUploadChangeHandle = (value, index) => {
    setTableData(currentState => produce(currentState, draftState => {
      draftState.voCostData[index].file_ids = value
    }));
  }

  const handleFinish = async (values, close= true) => {
    const hide = message.loading('loading...');
    let params = {
      id: undefined,
      trd_id: baseData?.projectInfo.id ?? 0,
      trd_sub_id: currentRowId?.id ?? 0,
      tax_rate: baseData?.projectInfo.tax_rate ?? 0,
      type: "pqi_coll",
      status: values.submitType,
      remark: values?.remark ?? '',
      department: "设施维护部",
      detail_list: [{
        address: values?.address ?? '',
        amount: values?.money ?? '',
        bank_name: values?.bank ?? '',
        bank_no: values?.bank_no ?? '',
        coll_type: values?.type ?? '',
        company_id: values?.companyInfo ?? 0,
        company_name: values?.company_name ?? '',
        mobile: values?.tel ?? '',
        seller_company_id: values?.company ?? 0,
        tax_no: values?.code ?? '',
        trd_id: baseData?.projectInfo.id ?? 0,
        file_ids: values?.detail ?? '',
      }]
    }

    if (isEmpty(values?.id) && values.id > 0) {
      params = {
        ...params,
        id: values.id
      };
    }

    console.log(params)

    try {
      const result = await createOrUpdateFinanceCollAlone(params);
      if (!result.success) {
        message.error(result.message);
        return;
      }

      message.success('Success');
      if (close) {
        setShowInvoicing(false)
        setCurrentRowId(null)
      }

    } catch (error) {
      message.error((error as Error).message);
    } finally {
      hide();
    }

  }


  useEffect(() => {
    getUserButtons({module: 'fullPQI-final-save', pos: 'save'}).then(r => {
      if (r.success) {
        if (r.data.length > 0 && r?.data[0].name === 'pqiFinalBillingSaveBtn') {
          setShowSaveBtn(true)
        }
      }
    })
  }, []);


  const handleReloadRecords = (record) => {
    formatRecords(record).catch(console.log);
  }

  // 组件返回渲染
  return (
    <div style={{width: '100vw'}}>
      <Form
        form={formRef}
        onValuesChange={(changedValues, value) => valueChangeHandle(changedValues, value)}
        initialValues={{}}
        onFinish={formSubmitHandle}
      >
        {/*<Form.Item name="id" label={false}>*/}
        {/*  <Input type="hidden"/>*/}
        {/*</Form.Item>*/}
        <Table
          rowKey={record => record.id}
          key="topTable"
          columns={getTopColumns(isEmpty(baseData?.projectInfo) ? '' : parseInt(baseData?.projectInfo.tax_rate), 'collect')}
          dataSource={tableData?.collectData ?? []}
          pagination={false}
          showHeader={true}
          bordered
        />

        <Table
          rowKey={record => record.id}
          key="midTable"
          columns={getTopColumns(isEmpty(baseData?.projectInfo) ? '' : parseInt(baseData?.projectInfo.tax_rate), 'vo')}
          dataSource={tableData?.voCostData ?? []}
          pagination={false}
          showHeader={false}
          bordered
        />

        <Table
          key="bottomTable"
          columns={getTopColumns(isEmpty(baseData?.projectInfo) ? '' : parseInt(baseData?.projectInfo.tax_rate), 'total')}
          dataSource={tableData?.totalData ?? []}
          pagination={false}
          showHeader={false}
          bordered
        />

        <Modal
          open={openUpload}
          onCancel={() => {
            setOpenUpload(false)
            setCurrentRowId(null)
          }}
          title="上传附件"
          footer={null}
          destroyOnClose={true}
        >
          <UploadFiles
            value={currentRowId ? (tableData.voCostData[currentRowId]?.file_ids ?? '') : ''}
            onChange={(value) => fileUploadChangeHandle(value, currentRowId)}
          />
        </Modal>
        <Drawer
          width={"85%"}
          open={showInvoicing}
          onClose={() => {
            setShowInvoicing(false)
            setCurrentRowId(null)
          }}
          title="开票收款"
          destroyOnClose={true}
        >
          {
            baseData?.projectInfo && currentRow &&
            <InvoiceRequestForm type="pqi" currentRecord={currentRowId} brandId={baseData?.projectInfo.brand_id} amount={currentRowId?.sub_total_price ?? 0}
                                handleFinish={handleFinish} records={records} handleReloadRecords={handleReloadRecords}/>
          }

          {/*<Reimbursement*/}
          {/*  type="invoicing"*/}
          {/*  currentMsg={baseData?.projectInfo ?? {}}*/}
          {/*  currentItem={currentItem}*/}
          {/*  handleCloseInvoicing={() => {*/}
          {/*    setShowInvoicing(false)*/}
          {/*    setCurrentRowId(null)*/}
          {/*  }}*/}
          {/*/>*/}
        </Drawer>
        {
          showSaveBtn &&
          <Form.Item>
            <SubmitButton
              form={formRef}
              className="green-button"
              type="primary"
              style={{marginRight: 20, width: 80, marginTop: 20}}
            >
              保存
            </SubmitButton>
          </Form.Item>
        }
      </Form>
    </div>
  );
}

export default FinalAccount;
