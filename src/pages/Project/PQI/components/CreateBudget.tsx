import { Input, Space, Table, Typography } from "antd"
import { forEach, isArray, isUndefined } from "lodash"
import { PlusCircleOutlined, MinusCircleOutlined } from "@ant-design/icons"
import { useEffect, useReducer, useState } from "react"
import { produce, current } from "immer"
import { getProjectInfo } from "@/services/ant-design-pro/project"


const dataTopStructure = {
  "No.": {
    title: "Item",
    col_1: {
      canEdit: true,
      price: ""
    },
    col_2: {
      canEdit: true,
      price: ""
    },
    col_3: {
      canEdit: true,
      price: ""
    },
    col_4: {
      canEdit: true,
      price: ""
    },
    col_5: {
      canEdit: true,
      price: ""
    },
    col_6: {
      canEdit: true,
      price: ""
    },
    col_7: {
      canEdit: true,
      price: ""
    },
    col_8: {
      canEdit: true,
      price: ""
    },
    col_9: {
      canEdit: false,
      price: "操作"
    },
  },
  "1": {
    title: "Profit",
    col_1: {
      canEdit: true,
      price: ""
    },
    col_2: {
      canEdit: false,
      price: ""
    },
    col_3: {
      canEdit: false,
      price: ""
    },
    col_4: {
      canEdit: false,
      price: ""
    },
    col_5: {
      canEdit: false,
      price: ""
    },
    col_6: {
      canEdit: false,
      price: ""
    },
    col_7: {
      canEdit: false,
      price: ""
    },
    col_8: {
      canEdit: false,
      price: ""
    },
    col_9: {
      canEdit: false,
      price: ""
    },
  },
  "2-1": {
    title: "Total Amount(In. VAT)",
    col_1: {
      canEdit: true,
      price: ""
    },
    col_2: {
      canEdit: false,
      price: ""
    },
    col_3: {
      canEdit: false,
      price: ""
    },
    col_4: {
      canEdit: false,
      price: ""
    },
    col_5: {
      canEdit: false,
      price: ""
    },
    col_6: {
      canEdit: false,
      price: ""
    },
    col_7: {
      canEdit: false,
      price: ""
    },
    col_8: {
      canEdit: false,
      price: ""
    },
    col_9: {
      canEdit: false,
      price: ""
    },
  },
  "2-2": {
    title: "Total Amount(Ex. VAT)",
    col_1: {
      canEdit: true,
      price: ""
    },
    col_2: {
      canEdit: false,
      price: ""
    },
    col_3: {
      canEdit: false,
      price: ""
    },
    col_4: {
      canEdit: false,
      price: ""
    },
    col_5: {
      canEdit: false,
      price: ""
    },
    col_6: {
      canEdit: false,
      price: ""
    },
    col_7: {
      canEdit: false,
      price: ""
    },
    col_8: {
      canEdit: false,
      price: ""
    },
    col_9: {
      canEdit: false,
      price: ""
    },
  },
  "3": {
    title: "VAT",
    col_1: {
      canEdit: true,
      price: ""
    },
    col_2: {
      canEdit: false,
      price: ""
    },
    col_3: {
      canEdit: false,
      price: ""
    },
    col_4: {
      canEdit: false,
      price: ""
    },
    col_5: {
      canEdit: false,
      price: ""
    },
    col_6: {
      canEdit: false,
      price: ""
    },
    col_7: {
      canEdit: false,
      price: ""
    },
    col_8: {
      canEdit: false,
      price: ""
    },
    col_9: {
      canEdit: false,
      price: ""
    },
  },
}

const dataStructure = {
  "4": {
    title: "Cost",
    price: "",
    canInput: false,
    addAndDel: false,
  },
  "4-1": {
    title: "Vendor's cost",
    price: "0.00",
    canInput: false,
    addAndDel: true,
    list: []
  },
  "4-2": {
    title: "Carrier",
    price: "0.00",
    canInput: false,
    addAndDel: true,
    list: []
  },
  "4-3": {
    title: "Schneider",
    price: "0.00",
    canInput: false,
    addAndDel: true,
    list: []
  },
  "4-4": {
    title: "AV System Cost",
    price: "",
    canInput: true,
    addAndDel: false,
  },
  "4-5": {
    title: "Project Manager Salary",
    item: "",
    price: "",
    canInput: false,
    addAndDel: false,
  },
  "4-6": {
    title: "Project Manager Bonus",
    item: "",
    price: "",
    canInput: true,
    addAndDel: false,
  },
  "4-7": {
    title: "Travel Cost",
    price: "0",
    canInput: true,
    addAndDel: false,
  },
  "4-8": {
    title: "Other Incidental Expenses",
    price: "0",
    canInput: true,
    addAndDel: false,
  }
}

interface ItemListProps {
  handleClose: () => void
  actionRef
  success: (text: string) => void
  error: (text: string) => void
  vat: number
  project: Number
  currentMsg: {}
  handleBudget: (data: any) => void
}

const CreateBudget: React.FC<ItemListProps> = ({
  project,
  handleClose,
  actionRef,
  success,
  error,
  vat,
  currentMsg,
  handleBudget
}) => {

  const [totalPrice, setTotalPirice] = useState(0)
  const [isFirstRender, setIsFirstRender] = useState(true);

  const handleDataSource = () => {
    let data: any = []
    forEach(dataStructure, (item, no) => {
      let tmp: any = {
        no: no,
        title: item.title,
        price: item.price
      }
      if (item.canInput) {
        tmp.canInput = true
      }
      if ('item' in item) {
        tmp.detail = item.item
      }
      if (item.addAndDel) {
        tmp.addAndDel = true
        tmp.itemList = []
      }
      data.push(tmp)
    })
    // console.log(data);
    return data
  }

  const handleDataTop = () => {
    const keys = ['No.', '1', '2-1', '2-2', '3']

    const data = keys.map(key => {
      return {
        no: key,
        title: dataTopStructure[key].title,
        col_1: {
          canEdit: dataTopStructure[key].col_1.canEdit,
          price: dataTopStructure[key].col_1.price,
        },
        col_2: {
          canEdit: dataTopStructure[key].col_2.canEdit,
          price: dataTopStructure[key].col_2.price,
        },
        col_3: {
          canEdit: dataTopStructure[key].col_3.canEdit,
          price: dataTopStructure[key].col_3.price,
        },
        col_4: {
          canEdit: dataTopStructure[key].col_4.canEdit,
          price: dataTopStructure[key].col_4.price,
        },
        col_5: {
          canEdit: dataTopStructure[key].col_5.canEdit,
          price: dataTopStructure[key].col_5.price,
        },
        col_6: {
          canEdit: dataTopStructure[key].col_6.canEdit,
          price: dataTopStructure[key].col_6.price,
        },
        col_7: {
          canEdit: dataTopStructure[key].col_7.canEdit,
          price: dataTopStructure[key].col_7.price,
        },
        col_8: {
          canEdit: dataTopStructure[key].col_8.canEdit,
          price: dataTopStructure[key].col_8.price,
        },
        col_9: {
          canEdit: dataTopStructure[key].col_9.canEdit,
          price: dataTopStructure[key].col_9.price,
        },
      }
    })
    // const data = Object.entries(dataTopStructure).map(([no, { title }]) => ({ no, title }));
    // console.log(data);

    return data
  }

  const addOrDel = (entity, type, index) => {
    dispatchCompute({
      type: 'addOrDel',
      payload: {
        current: { entity: entity, index: index },
        type: type
      }
    })
  }

  // 添加
  const addItemHandle = (payload, data, value) => {
    const no = payload.current.entity.no

    // no的第三个数字
    let i = no.split('-')[0]
    let j = no.split('-')[1]
    let k = no.split('-')[2] ?? 0

    let ret = [];
    let noMap = {};

    forEach(data, (item, _) => {
      let a = item.no.split('-')[0]
      let b = item.no.split('-')[1]
      let c = item.no.split('-')[2] ?? 0

      if (c != 0) {
        if (noMap[a] && noMap[a][b]) {
          noMap[a][b] += 1
        } else {
          noMap[a] = {}
          noMap[a][b] = 1
        }
      }
      let newNo = a
      if (b) {
        newNo += '-'
        newNo += b
      }
      if (noMap[a] && noMap[a][b]) {
        newNo += '-'
        newNo += noMap[a][b]
      }
      const newRow = {
        ...item,
        no: newNo
      }
      ret.push(newRow)

      if (a === i && b === j && c === k) {
        if (noMap[a] && noMap[a][b]) {
          noMap[a][b] += 1
        } else {
          noMap[a] = {}
          noMap[a][b] = 1
        }
        const newAddRow = {
          no: `${a}-${b}-${noMap[a] && noMap[a][b] ? noMap[a][b] : ''}`,
          title: payload.current.entity.title,
          detail: value.cost_detail ?? '',
          price: value.price ?? '',
          canInput: true,
          canEdit: true,
          addAndDel: true
        }
        ret.push(newAddRow)
      }
    })

    return ret
  }

  // 删除
  const delItemHandle = (payload, data) => {
    const no = payload.current.entity.no
    const formatData = [...data]

    // no的第三个数字
    // let i = no.split('-')[0]
    // let j = no.split('-')[1]
    // let k = no.split('-')[2] ?? 0

    let ret = [];
    let noMap = {};
    let delNo = -1

    for (const key in data) {
      if (no === data[key].no) {
        delNo = key
        break;
      }
    }

    if (delNo < 0) {
      return false
    }

    formatData.splice(delNo, 1)

    forEach(formatData, (item, _) => {
      let a = item.no.split('-')[0]
      let b = item.no.split('-')[1]
      let c = item.no.split('-')[2] ?? 0

      if (c != 0) {
        if (noMap[a] && noMap[a][b]) {
          noMap[a][b] += 1
        } else {
          noMap[a] = {}
          noMap[a][b] = 1
        }
      }
      let newNo = a
      if (b) {
        newNo += '-'
        newNo += b
      }
      if (noMap[a] && noMap[a][b]) {
        newNo += '-'
        newNo += noMap[a][b]
      }
      const newRow = {
        ...item,
        no: newNo
      }
      ret.push(newRow)
    })
    return ret
  }

  const handleInput = (e, entity, idx) => {
    const val = e.target.value;
    dispatchCompute({
      type: 'itemInput',
      payload: {
        value: val,
        index: idx,
        item: entity
      }
    })
  }

  // 输入价格
  const handleInputPrice = (e, idx) => {
    dispatchCompute({
      type: 'priceInput',
      payload: {
        value: e.target.value,
        index: idx
      }
    })
  }

  // 计算 4-1  4-2  4-3  的总价
  const calcPrice = (currentData, allData) => {
    const splitNo = currentData.no.split('-')
    const data = [...allData]
    let ret = []
    const filteredData = data.filter(item => item.no.startsWith(`${splitNo[0]}-${splitNo[1]}-`));
    const totalPrice = filteredData.reduce((acc, item) => acc + Number(item.price), 0);
    data.map(item => {
      let newRow = {
        ...item
      }
      if (item.no === `${splitNo[0]}-${splitNo[1]}` && !isUndefined(splitNo[2])) {
        newRow = {
          ...item,
          price: totalPrice
        }
      }

      ret.push(newRow)
    })
    return ret
  }

  // 计算总价
  const calcTotalPrice = (data) => {
    let total = 0
    for (const key in data) {
      if (data[key].no.split('-').length === 2) {
        total += Number(data[key].price)
      }
    }
    return total
  }

  // 计算工资
  const calcSalary = (payload, salary) => {
    let ret = []
    salary.map(item => {
      let newRow = {
        ...item
      }
      if (item.no === '4-5') {
        newRow = {
          ...item,
          price: Number(payload.value) * Number(project)
        }
      }
      ret.push(newRow)
    })
    return ret
  }

  const handleInputRate = (e, current, index) => {
    dispatchCompute({
      type: 'computeRate',
      payload: {
        value: e.target.value,
        col: current,
        index: index
      }
    })
  }

  // 时间改变重新计算
  const bySalary = (salaryBottom, payload) => {
    let ret = []
    salaryBottom.map(item => {
      let newRow = {
        ...item
      }
      if (item.no === '4-5') {
        newRow = {
          ...item,
          price: Number(item.detail) * Number(payload.day)
        }
      }
      ret.push(newRow)
    })
    return ret
  }

  // 计算上方表格的每一项
  const computeItemRate = (data, payload, bottom_data) => {
    let ret = []
    let priceList: any = []
    if (!payload.value) {
      return data
    }
    data.map((item, index) => {
      let newRow = {
        ...item,
      }
      if (index === 3) {
        const idx3Price = (Number(bottom_data[0].price) / (1 - Number(payload.value) / 100)).toFixed(2)
        priceList[3] = idx3Price
        newRow = {
          ...item,
          [payload.col]: {
            ...item[payload.col],
            price: idx3Price
          }
        }
      }
      if (index === 4) {
        const idx4Price = (Number(priceList[3] ?? 0) * Number(vat)).toFixed(2)
        priceList[4] = idx4Price
        newRow = {
          ...item,
          [payload.col]: {
            ...item[payload.col],
            price: idx4Price
          }
        }
      }
      if (index === 1) {
        newRow = {
          ...item,
          [payload.col]: {
            ...item[payload.col],
            price: (parseFloat(Number(bottom_data[0].price) / (1 - Number(payload.value) / 100)) - parseFloat(bottom_data[0].price)).toFixed(2)
          }
        }
      }
      if (index === 2) {
        newRow = {
          ...item,
          [payload.col]: {
            ...item[payload.col],
            price: (
              parseFloat(Number(bottom_data[0].price) / (1 - Number(payload.value) / 100)) +
              parseFloat(Number(bottom_data[0].price) / (1 - Number(payload.value) / 100) * Number(vat))
            ).toFixed(2)
          }
        }
      }
      ret.push(newRow)
    })
    return ret
  }

  const handleInputItem = (e, current, index) => {
    dispatchCompute({
      type: 'col_1Compute',
      payload: {
        value: e.target.value,
        col: current,
        index: index
      }
    })
  }

  // 第一列计算
  const computeCol = (data, payload, bottomData) => {
    let itemList = []
    if (!payload.value) {
      return data
    }
    const col_1 = data.map(item => item.col_1)
    // col_1[payload.index - 1].price = payload.value
    col_1.map((item, index) => {
      let newItem = {
        ...item
      }

      if (bottomData[0].price === 0) {
        itemList = col_1
        return col_1
      }
      if (payload.index === 3) {
        if (index === 3) {
          newItem = {
            ...item,
            price: payload.value
          }
        }
        if (index === 0) {
          newItem = {
            ...item,
            price: ((1 - Number(bottomData[0].price) / Number(payload.value)) * 100).toFixed(2)
          }
        }
        if (index === 4) {
          newItem = {
            ...item,
            price: (Number(payload.value) * Number(vat)).toFixed(2)
          }
        }
        if (index === 2) {
          newItem = {
            ...item,
            price: (Number(payload.value) * (1 + Number(vat))).toFixed(2)
          }
        }
        if (index === 1) {
          newItem = {
            ...item,
            price: (Number(payload.value) - Number(bottomData[0].price)).toFixed(2)
          }
        }
      }
      if (payload.index === 2) {
        if (index === 2) {
          newItem = {
            ...item,
            price: payload.value
          }
        }
        if (index === 3) {
          newItem = {
            ...item,
            price: (Number(payload.value) / (1 + Number(vat))).toFixed(2)
          }
        }
        if (index === 0) {
          newItem = {
            ...item,
            price: ((1 - Number(bottomData[0].price) / parseFloat(Number(payload.value) / (1 + Number(vat)))) * 100).toFixed(2)
          }
        }
        if (index === 4) {
          newItem = {
            ...item,
            price: (Number(payload.value) / (1 + Number(vat)) * Number(vat)).toFixed(2)
          }
        }
        if (index === 1) {
          newItem = {
            ...item,
            price: (parseFloat(Number(payload.value) / (1 + Number(vat))) - parseFloat(bottomData[0].price)).toFixed(2)
          }
        }
      }
      if (payload.index === 4) {
        if (index === 4) {
          newItem = {
            ...item,
            price: payload.value
          }
        }
        if (index === 3) {
          newItem = {
            ...item,
            price: (Number(payload.value) / Number(vat)).toFixed(2)
          }
        }
        if (index === 0) {
          newItem = {
            ...item,
            price: ((1 - Number(bottomData[0].price) / (Number(payload.value) / Number(vat))) * 100).toFixed(2)
          }
        }
        if (index === 2) {
          newItem = {
            ...item,
            price: (parseFloat(parseFloat(payload.value) / parseFloat(vat)) + parseFloat(payload.value)).toFixed(2)
          }
        }
        if (index === 1) {
          newItem = {
            ...item,
            price: (parseFloat(parseFloat(payload.value) / parseFloat(vat)) - parseFloat(bottomData[0].price)).toFixed(2)
          }
        }
      }
      if (payload.index === 1) {
        if (index === 1) {
          newItem = {
            ...item,
            price: payload.value
          }
        }
        if (index === 3) {
          newItem = {
            ...item,
            price: (parseFloat(payload.value) + parseFloat(bottomData[0].price)).toFixed(2)
          }
        }
        if (index === 4) {
          newItem = {
            ...item,
            price: ((parseFloat(payload.value) + parseFloat(bottomData[0].price)) * parseFloat(vat)).toFixed(2)
          }
        }
        if (index === 0) {
          newItem = {
            ...item,
            price: ((1 - parseFloat(bottomData[0].price) / (parseFloat(payload.value) + parseFloat(bottomData[0].price))) * 100).toFixed(2)
          }
        }
        if (index === 2) {
          newItem = {
            ...item,
            price: ((parseFloat(payload.value) + parseFloat(bottomData[0].price)) + (parseFloat(payload.value) + parseFloat(bottomData[0].price)) * parseFloat(vat)).toFixed(2)
          }
        }
      }

      itemList.push(newItem)
    })
    const format = data.map((item, index) => {
      return {
        ...item,
        col_1: {
          ...item.col_1,
          price: itemList ? itemList[index].price : ''
        },
      }
    })
    return format
  }

  const resetCol = (col, top, bottom, colRow) => {
    let ret
    col.map((item, index) => {
      if (index === 0 && item.price !== '') {
        const paylod = {
          value: item.price,
          col: colRow
        }

        ret = computeItemRate(top, paylod, bottom)
      }
    })
    return ret
  }

  // 重新计算
  const reCompute = (top, bottom) => {
    let ret_1, ret_2, ret_3, ret_4, ret_5, ret_6, ret_7, ret_8
    const col_1 = top.map(item => item.col_1)
    const col_2 = top.map(item => item.col_2)
    const col_3 = top.map(item => item.col_3)
    const col_4 = top.map(item => item.col_4)
    const col_5 = top.map(item => item.col_5)
    const col_6 = top.map(item => item.col_6)
    const col_7 = top.map(item => item.col_7)
    const col_8 = top.map(item => item.col_8)
    if (col_1[0].price) {
      ret_1 = resetCol(col_1, top, bottom, 'col_1').map(item => item.col_1)
    }
    if (col_2[0].price) {
      ret_2 = resetCol(col_2, top, bottom, 'col_2').map(item => item.col_2)
    }
    if (col_3[0].price) {
      ret_3 = resetCol(col_3, top, bottom, 'col_3').map(item => item.col_3)
    }
    if (col_4[0].price) {
      ret_4 = resetCol(col_4, top, bottom, 'col_4').map(item => item.col_4)
    }
    if (col_5[0].price) {
      ret_5 = resetCol(col_5, top, bottom, 'col_5').map(item => item.col_5)
    }
    if (col_6[0].price) {
      ret_6 = resetCol(col_6, top, bottom, 'col_6').map(item => item.col_6)
    }
    if (col_7[0].price) {
      ret_7 = resetCol(col_7, top, bottom, 'col_7').map(item => item.col_7)
    }
    if (col_8[0].price) {
      ret_8 = resetCol(col_8, top, bottom, 'col_8').map(item => item.col_8)
    }
    const format = top.map((item, index) => {
      return {
        ...item,
        col_1: {
          ...item.col_1,
          price: ret_1 ? ret_1[index].price : ''
        },
        col_2: {
          ...item.col_2,
          price: ret_2 ? ret_2[index].price : ''
        },
        col_3: {
          ...item.col_3,
          price: ret_3 ? ret_3[index].price : ''
        },
        col_4: {
          ...item.col_4,
          price: ret_4 ? ret_4[index].price : ''
        },
        col_5: {
          ...item.col_5,
          price: ret_5 ? ret_5[index].price : ''
        },
        col_6: {
          ...item.col_6,
          price: ret_6 ? ret_6[index].price : ''
        },
        col_7: {
          ...item.col_7,
          price: ret_7 ? ret_7[index].price : ''
        },
        col_8: {
          ...item.col_8,
          price: ret_8 ? ret_8[index].price : ''
        },
      };
    })
    return format
  }

  // 处理数据
  const processData = (top, bottom) => {
    let formatBottom: any = []
    let formatTop: any = []
    bottom.map(item => {
      if (item.no !== '4' && item.no !== '4-1' && item.no !== '4-2' && item.no !== '4-3') {
        formatBottom.push({
          cost_detail: item?.detail ?? '',
          cost_type: item?.title ?? '',
          price: item?.price ?? ''
        })
      }
    })

    Object.keys(top[0]).map((item, index) => {
      if (index > 2 && index < 10) {
        formatTop.push(top[0][item].price)
      }
    })
    const params = {
      cost_price: bottom[0].price ?? '',
      final_account_list: formatBottom ?? [],
      reverse_calculate: {
        profit_rate: top[0].col_1.price ?? '',
        profit: top[1].col_1.price ?? '',
        total_amount_in_vat: top[2].col_1.price ?? '',
        total_amount_ex_vat: top[3].col_1.price ?? '',
        vat: top[4].col_1.price ?? '',
      },
      profit_rate_list: formatTop
    }
    handleBudget(params)
  }

  const columns = [
    {
      title: '',
      width: '6%',
      dataIndex: 'no',
    },
    {
      title: '',
      width: '22%',
      dataIndex: 'title',
      render: (dom, entity, index) => (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ width: 180, overflow: 'hidden', textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{dom}</div>
          {
            (entity.detail || entity.detail === '') &&
            <Input value={entity.detail} onInput={(e) => handleInput(e, entity, index)} style={{ width: 100 }} />
          }
        </div>
      )
    },
    {
      title: false,
      dataIndex: 'canInput',
      width: '64%',
      align: 'center',
      render: (dom, entity, index) => (
        <>
          {
            dom ?
              <Input
                value={entity.price}
                style={{
                  width: '60%',
                  textAlign: 'center',
                  border: 'none',
                  borderRadius: 0,
                  borderBottom: '1px solid red'
                }}
                onInput={(e) => handleInputPrice(e, index)}
              /> :
              <div>{entity.price}</div>
          }
        </>
      )
    },
    {
      title: '',
      dataIndex: 'addAndDel',
      width: '8%',
      render: (dom, entity, index) => {
        return (
          <>
            {
              dom &&
              <Space>
                <PlusCircleOutlined style={{ fontSize: 20, cursor: 'pointer' }} onClick={() => addOrDel(entity, 'add', index)} />
                {
                  entity.no !== '4-1' && entity.no !== '4-2' && entity.no !== '4-3' &&
                  <MinusCircleOutlined style={{ fontSize: 20, cursor: 'pointer' }} onClick={() => addOrDel(entity, 'del', index)} />
                }
              </Space>
            }
          </>
        )
      }
    }
  ]

  const columnsTop = [
    {
      title: '',
      width: '6%',
      dataIndex: 'no',
    },
    {
      title: '',
      width: '22%',
      dataIndex: 'title',
    },
    {
      title: '',
      dataIndex: 'col_1',
      width: '8%',
      render: (dom, entity, index) => (
        <>
          {
            dom.canEdit && index === 0 &&
            <div style={{ display: 'flex', color: 'red' }}>
              <Input
                value={dom.price}
                style={{
                  border: 'none',
                  borderBottom: '1px solid red',
                  borderRadius: 0,
                  color: 'red'
                }}
                onInput={(e) => handleInputRate(e, 'col_1', index)}
              />%
            </div>
          }
          {
            dom.canEdit && index === 1 &&
            <div style={{ display: 'flex', color: 'red' }}>
              <Input
                value={dom.price}
                style={{
                  border: 'none',
                  borderBottom: '1px solid red',
                  borderRadius: 0,
                  color: 'red'
                }}
                onInput={(e) => handleInputItem(e, 'col_1', index)}
              />
            </div>
          }
          {
            dom.canEdit && index === 2 &&
            <div style={{ display: 'flex', color: 'red' }}>
              <Input
                value={dom.price}
                style={{
                  border: 'none',
                  borderBottom: '1px solid red',
                  borderRadius: 0,
                  color: 'red'
                }}
                onInput={(e) => handleInputItem(e, 'col_1', index)}
              />
            </div>
          }
          {
            dom.canEdit && index === 3 &&
            <div style={{ display: 'flex', color: 'red' }}>
              <Input
                value={dom.price}
                style={{
                  border: 'none',
                  borderBottom: '1px solid red',
                  borderRadius: 0,
                  color: 'red'
                }}
                onInput={(e) => handleInputItem(e, 'col_1', index)}
              />
            </div>
          }
          {
            dom.canEdit && index === 4 &&
            <div style={{ display: 'flex', color: 'red' }}>
              <Input
                value={dom.price}
                style={{
                  border: 'none',
                  borderBottom: '1px solid red',
                  borderRadius: 0,
                  color: 'red'
                }}
                onInput={(e) => handleInputItem(e, 'col_1', index)}
              />
            </div>
          }
        </>
      )
    },

    {
      title: '',
      dataIndex: 'col_2',
      width: '8%',
      render: (dom, entity, index) => (
        <>
          {
            dom.canEdit ?
              <div style={{ display: 'flex', color: 'red' }}>
                <Input
                  value={dom.price}
                  style={{
                    border: 'none',
                    borderBottom: '1px solid red',
                    borderRadius: 0,
                    color: 'red'
                  }}
                  onInput={(e) => handleInputRate(e, 'col_2', index)}
                />%
              </div> :
              <div>{dom.price}</div>
          }
        </>
      )
    },
    {
      title: '',
      dataIndex: 'col_3',
      width: '8%',
      render: (dom, entity, index) => (
        <>
          {
            dom.canEdit ?
              <div style={{ display: 'flex', color: 'red' }}>
                <Input
                  value={dom.price}
                  style={{
                    border: 'none',
                    borderBottom: '1px solid red',
                    borderRadius: 0,
                    color: 'red'
                  }}
                  onInput={(e) => handleInputRate(e, 'col_3', index)}
                />%
              </div> :
              <div>{dom.price}</div>
          }
        </>
      )
    },
    {
      title: '',
      dataIndex: 'col_4',
      width: '8%',
      render: (dom, entity, index) => (
        <>
          {
            dom.canEdit ?
              <div style={{ display: 'flex', color: 'red' }}>
                <Input
                  value={dom.price}
                  style={{
                    border: 'none',
                    borderBottom: '1px solid red',
                    borderRadius: 0,
                    color: 'red'
                  }}
                  onInput={(e) => handleInputRate(e, 'col_4', index)}
                />%
              </div> :
              <div>{dom.price}</div>
          }
        </>
      )
    },
    {
      title: '',
      dataIndex: 'col_5',
      width: '8%',
      render: (dom, entity, index) => (
        <>
          {
            dom.canEdit ?
              <div style={{ display: 'flex', color: 'red' }}>
                <Input
                  value={dom.price}
                  style={{
                    border: 'none',
                    borderBottom: '1px solid red',
                    borderRadius: 0,
                    color: 'red'
                  }}
                  onInput={(e) => handleInputRate(e, 'col_5', index)}
                />%
              </div> :
              <div>{dom.price}</div>
          }
        </>
      )
    },
    {
      title: '',
      dataIndex: 'col_6',
      width: '8%',
      render: (dom, entity, index) => (
        <>
          {
            dom.canEdit ?
              <div style={{ display: 'flex', color: 'red' }}>
                <Input
                  value={dom.price}
                  style={{
                    border: 'none',
                    borderBottom: '1px solid red',
                    borderRadius: 0,
                    color: 'red'
                  }}
                  onInput={(e) => handleInputRate(e, 'col_6', index)}
                />%
              </div> :
              <div>{dom.price}</div>
          }
        </>
      )
    },
    {
      title: '',
      dataIndex: 'col_7',
      width: '8%',
      render: (dom, entity, index) => (
        <>
          {
            dom.canEdit ?
              <div style={{ display: 'flex', color: 'red' }}>
                <Input
                  value={dom.price}
                  style={{
                    border: 'none',
                    borderBottom: '1px solid red',
                    borderRadius: 0,
                    color: 'red'
                  }}
                  onInput={(e) => handleInputRate(e, 'col_7', index)}
                />%
              </div> :
              <div>{dom.price}</div>
          }
        </>
      )
    },
    {
      title: '',
      dataIndex: 'col_8',
      width: '8%',
      render: (dom, entity, index) => (
        <>
          {
            dom.canEdit ?
              <div style={{ display: 'flex', color: 'red' }}>
                <Input
                  value={dom.price}
                  style={{
                    border: 'none',
                    borderBottom: '1px solid red',
                    borderRadius: 0,
                    color: 'red'
                  }}
                  onInput={(e) => handleInputRate(e, 'col_8', index)}
                />%
              </div> :
              <div>{dom.price}</div>
          }
        </>
      )
    },
    {
      title: '',
      dataIndex: 'col_9',
      width: '8%',
      render: (dom, entity) => (
        <>
          {
            dom.canEdit ?
              <Input style={{ border: 'none', borderBottom: '1px solid red', borderRadius: 0 }} /> :
              <div>{dom.price}</div>
          }
        </>
      )
    },
  ]

  const [compute, dispatchCompute] = useReducer(
    produce((draft, act) => {
      const { type, payload } = act;
      let draftTop, draftBottom
      switch (type) {
        case 'init':
          draft.bottom = handleDataSource()
          draft.top = handleDataTop()
          if (payload.value) {
            // echoData()
            draft.top[0].col_1.price = payload.value.reverse_calculate.profit
            draft.top[1].col_1.price = payload.value.reverse_calculate.profit_rate
            draft.top[2].col_1.price = payload.value.reverse_calculate.total_amount_ex_vat
            draft.top[3].col_1.price = payload.value.reverse_calculate.total_amount_in_vat
            draft.top[4].col_1.price = payload.value.reverse_calculate.vat
            draft.top[0].col_2.price = payload.value.profit_rate_list[0]
            draft.top[0].col_3.price = payload.value.profit_rate_list[1]
            draft.top[0].col_4.price = payload.value.profit_rate_list[2]
            draft.top[0].col_5.price = payload.value.profit_rate_list[3]
            draft.top[0].col_6.price = payload.value.profit_rate_list[4]
            draft.top[0].col_7.price = payload.value.profit_rate_list[5]
            draft.top[0].col_8.price = payload.value.profit_rate_list[6]

            draft.bottom[0].price = payload.value.cost_price
            draft.bottom[1].price = payload.value.final_account_list[1] ? payload.value.final_account_list[1].total_price : '0.00'
            draft.bottom[2].price = payload.value.final_account_list[2] ? payload.value.final_account_list[2].total_price : '0.00'
            draft.bottom[3].price = payload.value.final_account_list[3] ? payload.value.final_account_list[3].total_price : '0.00'
            draft.bottom[4].price = payload.value.final_account_list[4] ? payload.value.final_account_list[4].total_price : ''
            draft.bottom[5].price = payload.value.final_account_list[5] ? payload.value.final_account_list[5].total_price : '0'
            draft.bottom[5].detail = payload.value.final_account_list[5] ? payload.value.final_account_list[5].list[0].cost_detail : ''
            draft.bottom[6].price = payload.value.final_account_list[6] ? payload.value.final_account_list[6].total_price : ''
            draft.bottom[7].price = payload.value.final_account_list[7] ? payload.value.final_account_list[7].total_price : ''
            draft.bottom[8].price = payload.value.final_account_list[8] ? payload.value.final_account_list[8].total_price : ''
            if (payload.value.final_account_list[1] && payload.value.final_account_list[1].list) {
              payload.value.final_account_list[1].list.map((item, index) => {
                const curPayload = {
                  current: {
                    entity: draft.bottom.find(item => item.no === '4-1'),
                    index: 1
                  },
                  type: 'add'
                }
                const ret = addItemHandle(curPayload, draft.bottom, item)
                draft.bottom = ret
              })
            }

            if (payload.value.final_account_list[2] && payload.value.final_account_list[2].list) {
              payload.value.final_account_list[2].list.map((item, index) => {
                const curPayload = {
                  current: {
                    entity: draft.bottom.find(item => item.no === '4-2'),
                    index: 2
                  },
                  type: 'add'
                }
                const ret = addItemHandle(curPayload, draft.bottom, item)
                draft.bottom = ret
              })
            }

            if (payload.value.final_account_list[3] && payload.value.final_account_list[3].list) {
              payload.value.final_account_list[3].list.map((item, index) => {
                const curPayload = {
                  current: {
                    entity: draft.bottom.find(item => item.no === '4-3'),
                    index: 3
                  },
                  type: 'add'
                }
                const ret = addItemHandle(curPayload, draft.bottom, item)
                draft.bottom = ret
              })
            }
            // const bottom = current(draft.bottom)
            // const top = current(draft.top)
            let reRet = reCompute(draft.top, draft.bottom)
            draft.top = reRet
            processData(draft.top, draft.bottom)
          }

          break;

        case 'addOrDel':
          const data = current(draft.bottom)
          let formatRet, totalPrice
          if (payload.type === 'add') {
            formatRet = addItemHandle(payload, data, {})
            draftTop = current(draft.top)
            processData(draftTop, draft.bottom)
          }

          if (payload.type === 'del') {
            const currentData = current(draft.bottom[payload.current.index])
            formatRet = delItemHandle(payload, data)
            formatRet = calcPrice(currentData, formatRet)
            totalPrice = calcTotalPrice(formatRet)
            draft.bottom = formatRet
            draft.bottom[0].price = totalPrice
            setTotalPirice(totalPrice)
            draftTop = current(draft.top)
            processData(draftTop, draft.bottom)
          }

          draft.bottom = formatRet
          break;

        case 'itemInput':
          draft.bottom[payload.index].detail = payload.value
          if (payload.item.no !== '4-5') {
            return
          }
          const salary = current(draft.bottom)
          const salaryFormat = calcSalary(payload, salary)
          totalPrice = calcTotalPrice(salaryFormat)
          draft.bottom = salaryFormat
          draft.bottom[0].price = totalPrice
          setTotalPirice(totalPrice)
          draftTop = current(draft.top)
          processData(draftTop, draft.bottom)
          break;

        case 'priceInput':
          draft.bottom[payload.index].price = payload.value
          const currentData = current(draft.bottom[payload.index])
          const allData = current(draft.bottom)
          const itemPirceList = calcPrice(currentData, allData)
          const total = calcTotalPrice(itemPirceList)
          // computeItemRate()
          draft.bottom = itemPirceList
          draft.bottom[0].price = total
          setTotalPirice(total)
          draftTop = current(draft.top)
          // draftBottom = current(draft.bottom)
          processData(draftTop, draft.bottom)
          break;

        case 'updateSalary':
          const salaryBottom = current(draft.bottom)
          const byDay = bySalary(salaryBottom, payload)
          const totalBySalary = calcTotalPrice(byDay)
          draft.bottom = byDay
          draft.bottom[0].price = totalBySalary
          setTotalPirice(totalBySalary)
          draftTop = current(draft.top)
          processData(draftTop, draft.bottom)
          break;

        case 'computeRate':
          draft.top[payload.index][payload.col].price = payload.value
          const top_data = current(draft.top)
          const bottom_data = current(draft.bottom)
          const rateRow = computeItemRate(top_data, payload, bottom_data)
          draft.top = rateRow
          draftBottom = current(draft.bottom)
          processData(draft.top, draftBottom)
          break;

        case 'col_1Compute':
          draft.top[payload.index][payload.col].price = payload.value
          const topData = current(draft.top)
          const bottomData = current(draft.bottom)
          const colRow = computeCol(topData, payload, bottomData)
          draft.top = colRow
          draftBottom = current(draft.bottom)
          processData(draft.top, draftBottom)
          break;

        case 'reComputeItem':
          draftBottom = current(draft.bottom)
          processData(draft.top, draftBottom)
          break;

        default:
          break
      }
    }), dataStructure)

  useEffect(() => {
    dispatchCompute({
      type: 'init',
      payload: {
        value: null
      }
    })
    if (currentMsg) {
      getProjectInfo({ project_id: currentMsg.id }).then(res => {
        if (res.success) {
          dispatchCompute({
            type: 'init',
            payload: {
              value: res.data
            }
          })
          // handleBudget
        }
      })
    }
  }, [])

  useEffect(() => {
    dispatchCompute({
      type: 'updateSalary',
      payload: {
        day: project
      }
    })
  }, [project])

  useEffect(() => {
    // console.log(currentMsg);
    if (!currentMsg) {
      return
    }

    // // 首次渲染时不执行回调函数
    // if (isFirstRender) {
    //   setIsFirstRender(false);
    //   return;
    // }
    dispatchCompute({
      type: "reComputeItem",
      payload: {}
    })
  }, [])

  return (
    <>
      <Typography.Title level={4} style={{ marginTop: 20 }}>创建预算</Typography.Title>

      <Table
        dataSource={compute.top}
        columns={columnsTop}
        bordered
        pagination={false}
        showHeader={false}
        title={() => (
          <div
            style={{
              textAlign: 'center',
              color: 'red',
              fontWeight: 700
            }}>
            Rate of Profit（Bidding price）
          </div>
        )}
      />

      <Table
        dataSource={compute.bottom}
        columns={columns}
        bordered
        pagination={false}
        showHeader={false}
      />
    </>
  )
}

export default CreateBudget