import {getAllCostList, getAllUserList} from "@/services/ant-design-pro/project";
import { bcMath } from "@/utils/utils";
import { message, Form } from "antd";
import {isEmpty, sortBy} from "lodash";
import { useEffect, useState } from "react"
import {
  createInvoice,
  editorInvoice,
  getInvoiceInfo,
  invoicePqiCostEstimate,
  savePQICostData
} from "@/services/ant-design-pro/pqi";
import { invoiceOcr } from "@/services/ant-design-pro/financialReimbursement";
import { produce } from "immer";
import {getUserButtons} from "@/services/ant-design-pro/user";
import uploadForm from "@/components/UploadImage/UploadForm";

export type CurrentMsgParams = {
  id: number
}

export type FormValues = {
  company: number
  bank: string
  bank_no: string
  seller_name: string
  in_amount: string
  ex_amount: string
  tax_amount: string
  tax_rate: string
  invoice_num: string
  seller_register_num: string
  invoice_date: string
  files: string
  remark: string

  t_amount_in_figuers: string
  t_commodity_name: string
  t_invoice_date: string
  t_invoice_num: string
  t_purchaser_name: string
  t_purchaser_register_num: string
  t_seller_name: string
  t_seller_register_num: string
  t_tax_rate:string
  t_total_amount: string
  t_total_tax: string

  stamp_files:string
  no_stamp_files:string

}

export type CurrentItemParams = {
  cost_type_name: string
  itemIndex: number
  Project_final_account_id: number,
  detail_id: number
}

type CurrentDataParams = {
  tableIndex: number
  cost_type_id: number
  tax_exclusive: string
  tax_rate: string
  tax_amount: string
  estimated_payment_date: string
  payment_at: string
  estimate_items: []
}[][]

export type ItemAlpply = {
  coll_company_id: undefined | number
  detail_id: number
  coll_name: string
  in_amount: string
  ex_amount: string
  tax: string
  tax_rate: string
  tax_no: string
  invoice_no: string
  reim_date: string
}

export const useViewCost = (currentMsg: CurrentMsgParams) => {
  const [form] = Form.useForm()
  const [formUpload] = Form.useForm()
  const [currentData, setCurrentData] = useState<CurrentDataParams>([])
  const [showPayment, setShowPayment] = useState(false)
  const [showPayee, setShowPayee] = useState(false)
  const [showFiles, setShowFiles] = useState(false)
  const [payeeList, setPayeeList] = useState([])
  const [currentItem, setCurrentItem] = useState<CurrentItemParams>({
    cost_type_name: '',
    itemIndex: 0,
    Project_final_account_id: 0,
    detail_id: 0
  })
  const [totalData, setTotalData] = useState({
    cost_type_name: 'Total',
    supplier_name: '',
    price: '0.00',
    sub_total_price: '0.00',
    tax_price: '0.00',
    total_apply_price: '0.00',
    total_payment_price: '0.00',
    payment_ratio: '0.00'
  })
  const [itemApply, setItemApply] = useState<ItemAlpply>({
    coll_company_id: undefined,
    detail_id: 0,
    coll_name: '',
    in_amount: '',
    ex_amount: '',
    tax: '',
    tax_rate: '',
    tax_no: '',
    invoice_no: '',
    reim_date: '',
  })
  const [showSaveBtn, setShowSavaBtn] = useState(false)
  const [showSubmitBtn, setShowSubmitBtn] = useState(false)
  const [sellerDetail, setSellerDetail] = useState({
    seller_id: 0,
    seller_name: ''
  })

  //开票记录
  const [invoiceInfo, setInvoiceInfo] = useState([{
    invoice_num: '',
    amount_in_figuers: '',
    total_amount: '',
    total_tax: '',
    tax_rate:'',
    seller_register_num: '',
    seller_name: '',
    purchaser_register_num: '',
    purchaser_name: '',
    invoice_date: '',
    commodity_name: '',
    file_id: ''
  }])

  // 一维数组转二维数组
  const convertTo2DArray = (arr: any) => {
    const result: any = [];

    for (let i = 0; i < arr.length; i++) {
      let listOf2d: any = [];

      if (arr[i]?.estimate_items.length > 0) {

        for (let j = 0; j < arr[i]?.estimate_items.length; j++) {
          let total_payment_price = 0
          let total_apply_price = 0
          let payment_ratio = '0'
          arr[i]?.estimate_items.forEach((item: {
            apply: {
              in_amount: number
            }
            ex_amount: number
          }) => {
            total_payment_price = parseFloat(bcMath.add(total_payment_price, item.apply.in_amount))
            total_apply_price = parseFloat(bcMath.add(total_apply_price, item.ex_amount))
          })
          if (total_apply_price && arr[i]?.price && arr[i]?.price !== '0' && arr[i]?.price !== '0.00') {
            payment_ratio = ((total_apply_price / arr[i]?.price) * 100).toFixed(2) + '%'
          }

          let item = {
            ...arr[i],
            tax_exclusive: arr[i]?.estimate_items[j].ex_amount,
            tax_rate: arr[i]?.estimate_items[j].tax_rate,
            tax_amount: arr[i]?.estimate_items[j].tax_amount,
            estimated_payment_date: arr[i]?.estimate_items[j].estimate_pay_at,
            tableIndex: i,
            payment_at: arr[i]?.estimate_items[j].payment_at,
            payment_amount: arr[i]?.estimate_items[j].apply.in_amount,
            payment_file_ids: arr[i]?.estimate_items[j].payment_file_ids,
            total_payment_price: total_payment_price ?? 0,
            total_apply_price: total_apply_price ?? 0,
            payment_ratio: payment_ratio ?? 0,
            apply_username: arr[i]?.estimate_items[j]?.apply_username ?? '',
            username: arr[i]?.estimate_items[j]?.username ?? '',
            uid: arr[i]?.estimate_items[j]?.uid ?? '',
          }
          listOf2d.push(item)
        }

      } else {
        let item = {
          ...arr[i],
          tableIndex: i,
        }
        listOf2d.push(item)
      }

      result.push(listOf2d)
    }

    let price = 0
    let sub_total_price = 0
    let tax_price = 0
    let total_apply_price = 0
    let total_payment_price = 0
    let payment_ratio = '0.00'

    result.forEach((item: {
      price: number
      sub_total_price: number
      tax_price: number
      total_apply_price: number
      total_payment_price: number
    }[]) => {
      price = parseFloat(bcMath.add(price, item[0].price))
      sub_total_price = parseFloat(bcMath.add(sub_total_price, item[0].sub_total_price))
      tax_price = parseFloat(bcMath.add(tax_price, item[0].tax_price))
      total_apply_price = parseFloat(bcMath.add(total_apply_price, item[0].total_apply_price))
      total_payment_price = parseFloat(bcMath.add(total_payment_price, item[0].total_payment_price))
      if (total_apply_price && price) {
        payment_ratio = ((total_apply_price / price) * 100).toFixed(2) + '%'
      }
    });
    setTotalData(produce(draft => {
      draft.price = price.toFixed(2)
      draft.sub_total_price = sub_total_price.toFixed(2)
      draft.tax_price = tax_price.toFixed(2)
      draft.total_apply_price = total_apply_price.toFixed(2)
      draft.total_payment_price = total_payment_price.toFixed(2)
      draft.payment_ratio = payment_ratio
    }))
    return result;
  }

  // 获取收款人列表
  const getPayeeList = async () => {
    const res = await getAllUserList()

    if (res.success) {
      const list = res.data.map(item => {
        return {
          label: item?.name ?? 'xxx',
          value: item?.id ?? '',
          // 以下两个为额外信息
          bank: item?.bank ?? '',
          bank_card_no: item?.bank_card_no ?? '',
        }
      })

      setPayeeList(list)
    }
  }

  // 初始化数据
  const initData = async () => {

    const hide = message.loading('获取数据中...')
    try {
      const res = await getAllCostList({ project_id: currentMsg.id })

      // console.log('res--res--res', res.data, currentMsg.id)

      res.data.map((item: {
        tax_exclusive: string
        tax_rate: string
        tax_amount: string
        estimated_payment_date: string
      }) => {
        item.tax_exclusive = ''
        item.tax_rate = ''
        item.tax_amount = '0.00'
        item.estimated_payment_date = ''
      })

      // console.log('resres2222', res.data)


      const sortList = sortBy(res.data, 'Project_final_account_id');

      const result = convertTo2DArray(sortList)
      // console.log('查看成本--result--result',result)

      setCurrentData(result)
    } catch (error) {
      message.error('获取数据失败，请稍后再试！')
    } finally {
      hide()
    }
  }

  // 表格增加
  const handleAddTable = (tableIndex: number, itemIndex: number) => {
    const data = [...currentData];

    const newTableItem = {
      ...data[tableIndex][itemIndex],
      payment_at: '',
      payment_amount: '',
      tax_exclusive: '',
      tax_rate: '',
      tax_amount: '0.00',
      estimated_payment_date: '',
      payment_file_ids: '',
      uid: '', // 收款人要清空，否则会出现数据重复
    };

    data[tableIndex].splice(itemIndex + 1, 0, newTableItem); // itemIndex本身比estimate_items大1

    setCurrentData(data); // 更新状态数据
  }

  // 表格删除
  const handleDelTable = (tableIndex: number, itemIndex: number) => {
    if (itemIndex === 0 || currentData[tableIndex][itemIndex].payment_at) {
      message?.error('该项无法删除')
      return
    }

    const data = [...currentData];
    data[tableIndex].splice(itemIndex, 1)

    setCurrentData(data)
  }

  // 表格输入
  const handleInput = (value: string, tableIndex: number, itemIndex: number, type: string) => {
    const data = [...currentData];
    if (type === 'exclusive') {

      data[tableIndex][itemIndex].tax_exclusive = value

      const rate = data[tableIndex][itemIndex].tax_rate

      let amount = bcMath.mul(parseFloat(value), rate ? (parseFloat(rate) / 100) : 0)

      data[tableIndex][itemIndex].tax_amount = amount
    }

    if (type === 'rate') {
      data[tableIndex][itemIndex].tax_rate = value
      const exclusive = data[tableIndex][itemIndex].tax_exclusive
      const amount = bcMath.mul(parseFloat(value) / 100, exclusive ? parseFloat(exclusive) : 0)
      data[tableIndex][itemIndex].tax_amount = amount
    }

    if (type === 'payee') {
      data[tableIndex][itemIndex].uid = value
    }

    setCurrentData(data)
  }

  // 时间选择
  const handleChangeTime = (date: string, tableIndex: number, itemIndex: number) => {
    const data = [...currentData];
    data[tableIndex][itemIndex].estimated_payment_date = date
    setCurrentData(data)
  }

  const handleEstimateSaveData = async (accountId: number, saveData: any) => {
    if (isEmpty(saveData)) {
      return
    }

    const items = saveData.map((item: {
      tax_exclusive: string
      tax_rate: string
      tax_amount: string
      estimated_payment_date: string
    }) => {
      return {
        ex_amount: item?.tax_exclusive ?? '',
        tax_rate: item?.tax_rate ?? '',
        tax_amount: item?.tax_amount ?? '',
        estimate_pay_at: item?.estimated_payment_date ?? '',
      }
    })
    const params = { items }
    const hide = message.loading('保存中...')
    try {
      const result = await savePQICostData(accountId, params)

      if (!result.success) {
        message.error('Request Error.')
        return
      }
      await initData()
      message.success('保存成功')
    } catch (err) {
      message.error('Request Error: ' + (err as Error).message)
    } finally {
      hide()
    }
  }

  const handleOpenPayment = (itemData: any) => {

    setCurrentItem(itemData)

    // 新加需求：允许奖金对多个人申请
    if (itemData?.cost_type_name === 'Project Manager Bonus') {
      setShowPayee(true)
      return
    }

    getUserButtons({module: 'fullPQI-cost-apply', pos: 'submit'}).then(r => {
      if (r.success) {
        if (r.data.length > 0 && r?.data[0].name === 'pqiSearchCostApplySubmitBtn') {
          setShowSubmitBtn(true)
        }
      }
    })
    const apply = itemData?.estimate_items[itemData?.itemIndex - 1]?.apply
    setItemApply({
      ...apply,
      coll_company_id: apply?.coll_company_id ? apply?.coll_company_id : undefined,
      detail_id: apply?.detail_id ? apply?.detail_id : undefined
    })
    console.log('asfsafsafsafsfasfasf',!apply,apply)
    if(!apply || (Array.isArray(apply) && apply.length === 0) ){
      const amountInfo=itemData?.estimate_items[itemData?.itemIndex - 1];
      console.log('adfaffffff',amountInfo?.ex_amount)
      form.setFieldsValue({
        in_amount: bcMath.add(amountInfo?.ex_amount ?? 0,amountInfo?.tax_amount ?? 0,2) ?? '',
        ex_amount: amountInfo?.ex_amount ? parseFloat(amountInfo?.ex_amount).toFixed(2) : '0.00',
        tax_amount:  amountInfo?.tax_amount ? parseFloat(amountInfo?.tax_amount).toFixed(2) : '0.00',
        tax_rate:  amountInfo?.tax_rate ? parseFloat(amountInfo?.tax_rate).toFixed(2) : '0.00',
      })
      console.log('00000000000000')

    }
    setShowPayment(true)
    setSellerDetail(produce(draft => {
      draft.seller_id = apply?.coll_company_id ? apply?.coll_company_id : undefined
      draft.seller_name = apply?.coll_name ? apply?.coll_name : ''
    }))
    if (apply && !Array.isArray(apply)) {
      form.setFieldsValue({
        company: apply?.company_id ? apply?.company_id : undefined,
        seller_name: apply?.coll_company_id ? apply?.coll_company_id : undefined,
        bank: apply?.bank_name ?? '',
        bank_no: apply?.bank_no ?? '',
        in_amount: apply?.in_amount ?? '',
        ex_amount: apply?.ex_amount ?? '',
        tax_amount: apply?.tax ?? '',
        tax_rate: apply?.tax_rate ? parseFloat(apply?.tax_rate).toFixed(2) : '',
        seller_register_num: apply?.tax_no ?? '',
        invoice_num: apply?.invoice_no ?? '',
        invoice_date: apply?.reim_date ?? '',
        files: apply?.file_ids ?? '',
        remark: apply?.remark ?? '',
        t_amount_in_figuers: apply?.invoice_info?.[0]?.amount_in_figuers ?? '',
        t_commodity_name: apply?.invoice_info?.[0]?.commodity_name ?? '' ,
        t_invoice_date: apply?.invoice_info?.[0]?.invoice_date ?? '',
        t_invoice_num: apply?.invoice_info?.[0]?.invoice_num ?? '',
        t_purchaser_name: apply?.invoice_info?.[0]?.purchaser_name ?? '',
        t_purchaser_register_num: apply?.invoice_info?.[0]?.purchaser_register_num ?? '',
        t_seller_name: apply?.invoice_info?.[0]?.seller_name ?? '',
        t_seller_register_num: apply?.invoice_info?.[0]?.seller_register_num ?? '',
        t_tax_rate:apply?.invoice_info?.[0]?.tax_rate ?? '',
        t_total_amount: apply?.invoice_info?.[0]?.total_amount ?? '',
        t_total_tax: apply?.invoice_info?.[0]?.total_tax ?? '',
        stamp_files: apply?.stamp_ids,
        no_stamp_files: apply?.no_stamp_ids
      })
    }
  }

  const handleClosePayment = (type: any) => {
    if (type === 'payee') {
      setShowPayee(false)
      return
    }

    setShowPayment(false)
    setCurrentItem({
      cost_type_name: '',
      itemIndex: 0,
      Project_final_account_id: 0,
      detail_id: 0
    })
    form.resetFields()
    formUpload.resetFields()
  }

  const handleUploadFile = async (file_id: string) => {
    if (file_id) {
      try {
        const fileList = file_id.split(',')
        const params = {
          file_id: isEmpty(fileList) ? '' : fileList[fileList.length - 1],
          file_type: 'pdf'
        }
        const res = await invoiceOcr(params)

        if (res?.success) {
          formUpload.setFieldsValue({

            seller_register_num: res.data?.seller_register_num ? res.data?.seller_register_num : (itemApply?.tax_no ?? ''),
            invoice_num: res.data?.invoice_num ? res.data?.invoice_num : (itemApply?.invoice_no ?? ''),
            invoice_date: res.data?.invoice_date ? res.data?.invoice_date : (itemApply?.reim_date ?? ''),

            t_purchaser_name:res.data?.purchaser_name ?? '',
            t_purchaser_register_num:res.data?.purchaser_register_num ?? '',
            t_seller_name:res.data?.seller_name ?? '',
            t_seller_register_num:res.data?.seller_register_num ?? '',
            t_amount_in_figuers:res.data?.amount_in_figuers ?? '',
            t_total_amount:res.data?.total_amount ?? '',
            t_total_tax:res.data?.total_tax ?? '',
            t_tax_rate:res.data?.tax_rate ?? '',
            t_invoice_num:res.data?.invoice_num ?? '',
            t_invoice_date:res.data?.invoice_date ?? '',
            t_commodity_name:res.data?.commodity_name ?? '',
          })
          await message.success('发票信息获取成功')
          return
        }

        await message?.error(res?.message)

      } catch (error) {
        message.error('发票信息获取异常')
      }
    }
  }

  const handleChangeCompany = (companyDetail: {value: number, label: string}) => {
    setSellerDetail(produce(draft => {
      draft.seller_id = companyDetail?.value
      draft.seller_name = companyDetail?.label
    }))
  }

  const handleInvoicePqiCostEstimate = async (values: FormValues) => {
    console.log('申请表单values--values',values)
    try {
      const params = {
        company: values?.company ?? 0, // 打款公司
        bank_name: values?.bank ?? '', // 收款银行
        bank_no: values?.bank_no ?? '', // 收款银行号
        detail_id: itemApply?.detail_id ?? undefined, // apply下的detail_id
        reim_type: currentItem?.cost_type_name ?? '', // 成本类型，比如：Carrier
        cost_no: currentItem?.itemIndex ?? 0, // 成本序列号
        item_id: currentItem?.Project_final_account_id ?? 0, // 成本项目id
        trd_id: currentMsg?.id ?? 0, // 项目id
        coll_company_id: sellerDetail?.seller_id ?? 0, // 收款公司id
        coll_name: sellerDetail?.seller_name ?? '', // 收款公司名称
        in_amount: values?.in_amount ?? '',  // 含税总金额
        ex_amount: values?.ex_amount ?? '', // 不含税总金额
        tax_amount: values?.tax_amount ?? '', // 税额
        tax_rate: values?.tax_rate ?? '', // 税率
        seller_register_num: values?.seller_register_num ?? '', // 税号
        remark: values?.remark ?? '', // 备注
        stamp_file:values?.stamp_files,
        no_stamp_file:values?.no_stamp_files
      }

      const res = await invoicePqiCostEstimate(params)
      if (!res.success) {
        message.error(res.message)
        return
      }
      handleClosePayment()
      message.success('提交成功')
      await initData()

    } catch (err) {
      message.error('提交异常')
    }
  }

  const handleCreateInvoice = async (values: FormValues) => {
    console.log('开票表单values--values',values)
    try {
      const params = {
        reim_detail_id: itemApply?.detail_id ?? undefined, // apply下的detail_id
        item_id: currentItem?.Project_final_account_id ?? 0, // 成本项目id
        t_commodity_name: values?.t_commodity_name,
        t_purchaser_name: values?.t_purchaser_name,
        t_purchaser_register_num: values?.t_purchaser_register_num,
        t_seller_name: values?.t_seller_name,
        t_seller_register_num: values?.t_seller_register_num,
        t_amount_in_figuers: values?.t_amount_in_figuers,
        t_total_amount: values?.t_total_amount,
        t_total_tax: values?.t_total_tax,
        t_tax_rate: values?.t_tax_rate,
        t_invoice_num: values?.t_invoice_num,
        t_invoice_date: values?.t_invoice_date,
        file_ids: Number(values?.files) ?? '', // 上传发票
        t_id:values?.id ?? 0
      };
      const res = await createInvoice(params)
      if(!res.success) {
        message.error(res.message)
        return
      }
      handleClosePayment()
      formUpload.resetFields()

      message.success('提交成功')
      await initData()
    } catch (err) {
      message.error('提交异常')
    }
  }

  const handleEditorInvoice = async (values: any) => {
  //   try {
  //     const params = {
  //       reim_detail_id: itemApply?.detail_id ?? undefined, // apply下的detail_id
  //       item_id: currentItem?.Project_final_account_id ?? 0, // 成本项目id
  //       t_commodity_name: values?.t_commodity_name,
  //       t_purchaser_name: values?.t_purchaser_name,
  //       t_purchaser_register_num: values?.t_purchaser_register_num,
  //       t_seller_name: values?.t_seller_name,
  //       t_seller_register_num: values?.t_seller_register_num,
  //       t_amount_in_figuers: values?.t_amount_in_figuers,
  //       t_total_amount: values?.t_total_amount,
  //       t_total_tax: values?.t_total_tax,
  //       t_tax_rate: values?.t_tax_rate,
  //       t_invoice_num: values?.t_invoice_num,
  //       t_invoice_date: values?.t_invoice_date,
  //       t_id: values?.id ?? 0
  //     };
  //     const res = await editorInvoice(params);
  //
  //     if(!res.success) {
  //       message.error(res.message)
  //       return
  //     }
  //     handleClosePayment()
  //     message.success('提交成功')
  //     await initData()
  //   } catch (err) {
  //     message.error('提交异常')
  //   }
  }

  const handleGetInvoiceInfo = async (itemData: any) => {
    const detailId = itemData?.estimate_items[itemData?.itemIndex - 1]?.apply?.detail_id
    // console.log('detailId---detailId',itemApply.detail_id,detailId)
    const res = await getInvoiceInfo({reim_detail_id: detailId ?? 0})
    // console.log('获取发票记录',res)
    if (!res.success) {
      message.error(res.message)
      return
    }
    setInvoiceInfo(res.data)
  }

  const handleOpenFiles = (entity: any) => {
    setCurrentItem(entity)
    setShowFiles(true)
  }

  const handleCloseFiles = () => {
    setCurrentItem({
      cost_type_name: '',
      itemIndex: 0,
      Project_final_account_id: 0,
      detail_id: 0
    })
    setShowFiles(false)
  }

  useEffect(() => {
    getPayeeList()
    if (isEmpty(currentMsg)) {
      return
    }
    initData().then()

    getUserButtons({module: 'fullPQI-cost-save', pos: 'save'}).then(r => {
      if (r.success) {
        if (r.data.length > 0 && r?.data[0].name === 'pqiSearchCostSaveBtn') {
          setShowSavaBtn(true)
        }
      }
    })
  }, [])

  return {
    form,
    formUpload,
    invoiceInfo,
    currentData,
    showPayment,
    totalData,
    currentItem,
    showSaveBtn,
    showSubmitBtn,
    showFiles,
    itemApply,
    showPayee,
    payeeList,
    initData,
    handleAddTable,
    handleDelTable,
    handleInput,
    handleChangeTime,
    handleEstimateSaveData,
    handleInvoicePqiCostEstimate,
    handleOpenPayment,
    handleClosePayment,
    handleUploadFile,
    handleOpenFiles,
    handleCloseFiles,
    handleChangeCompany,

    handleCreateInvoice,// 创建发票
    handleEditorInvoice,
    handleGetInvoiceInfo
  }
}
