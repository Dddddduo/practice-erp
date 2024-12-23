import {
  approveFinanceReim, checkPayment,
  collectionOcr,
  getFinancePublicPaymentList,
  submitPayment
} from "@/services/ant-design-pro/financialReimbursement";
import {getCompanyList, updatePaymentInfo} from "@/services/ant-design-pro/quotation";
import {ActionType} from "@ant-design/pro-components";
import {message, Form} from "antd";
import {produce} from "immer";
import {isEmpty} from "lodash";
import {useCallback, useEffect, useRef, useState} from "react";
import {bcMath, getStateMap} from "@/utils/utils";
import {useLocation} from "@@/exports";
import dayjs from "dayjs";
import {weeklyToDays} from "@/services/ant-design-pro/project";

export type BaseData = {
  type: string
  currentDataList: {
    items: {
      detail_id: number
      ex_amount: string
      user_id: number
    }[]
  }[],
  currentRow: {
    payment_at: string
    index: number
    file_ids: string
    payment_file_ids: string
    detail_id: number
    ex_amount: string
    user_id: number
  }
  companyList: {
    value: number,
    label: string
  }[]
  currentWeekday: string
  showWeekday: string
  saveValue: any
  checkData: any
  showCheckPanel: boolean
}

export const useCorporatePayment = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const pathname = currentPath.split('/')[currentPath.split('/').length - 1]
  const [columnsStateMap, setColumnsStateMap] = useState({});
  const [form] = Form.useForm()
  // 配置Message
  const [messageApi, contextHolder] = message.useMessage();
  // 表格实体的引用
  const actionRef = useRef<ActionType>();
  // 成功Message
  const success = (text: string) => {
    messageApi.open({
      type: 'success',
      content: text,
    });
  };

  // 失败Message
  const error = (text: string) => {
    messageApi.open({
      type: 'error',
      content: text,
    });
  };
  const [openDrawer, setOpenDrawer] = useState({
    payouts: false,
    files: false
  })
  const [baseData, setBaseData] = useState<BaseData>({
    currentDataList: [],
    currentRow: {
      index: 0,
      payment_at: '',
      detail_id: 0,
      ex_amount: '',
      user_id: 0,
      file_ids: '',
      payment_file_ids: ''
    },
    companyList: [],
    type: '',
    currentWeekday: '',
    showWeekday: '',
    saveValue: {},
    checkData: {},
    showCheckPanel: false,
  })

  const handleShowCheckPanel = () => {
    setBaseData(produce(draft => {
      draft.showCheckPanel = false
    }))
  }

  const handleGetCurrentWeekly = (weekly: any) => {
    // console.log('weekly', weekly)
    try {
      weeklyToDays(weekly).then(res => {
        if (res?.success) {
          const start = res?.data?.start?.split(' ')[0]
          const end = res?.data?.end?.split(' ')[0]
          setBaseData(produce(draft => {
            draft.showWeekday = start + '~' + end
          }))
        }
      })
    } catch (err) {
      console.log(err)
    }
  }

  const handleFetchListData = useCallback(async ({current, pageSize, ...params}) => {
    const currentDay = dayjs().format('YYYY-MM-DD')
    const retData = {
      success: false,
      total: 0,
      data: []
    };

    if (params['reim_date'] && params['reim_date'] === currentDay) {
      params['reim_date'] = dayjs(params['reim_date']).format('YYYY-ww')
    }

    setBaseData(produce(draft => {
      draft.currentWeekday = params['reim_date']
    }))

    handleGetCurrentWeekly(params['reim_date'])

    const customParams = {
      page: current,
      page_size: pageSize,
      type: 'pqi_vendor_reim',
      monthly: params['reim_date'],
    };

    try {
      const response = await getFinancePublicPaymentList(customParams);
      if (!response.success) {
        error(response.message)
        return retData;
      }

      const data = response.data;
      setBaseData(produce(draft => {
        draft.currentDataList = data
      }))
      const processedData: any = [];

      data.forEach((item, index) => {
        const {coll_name, items} = item;
        items.map((subItem, itemIndex) => {
          if (itemIndex === 0) {
            processedData.push({
              ...subItem,
              coll_name,
              index: index + 1,
              rowSpan: item.items.length,
              // key: itemIndex
            });
          } else {
            processedData.push({
              ...subItem,
              coll_name,
              index: index + 1,
              // key: itemIndex,
            });
          }
        });
      });
      retData.success = true;
      retData.total = data.total;
      retData.data = processedData ?? [];
    } catch (e) {
      error('数据请求异常');
    }
    // console.log(retData)
    return retData;
  }, [])

  const handleJumpTrdNo = (row) => {
    if (row.type === 'pqi_vendor_reim') {
      window.open(`/project/fullPQI?quo_no=${row.trd_no}`, '_blank')
    }
  }

  const handleOpenPayouts = (row: any) => {


    setOpenDrawer(produce(draft => {
      draft.payouts = true
    }))

    setBaseData(produce(draft => {
      draft.currentRow = row
    }))

    form.setFieldsValue({
      coll_company: row?.coll_name ?? '',
      bank_name: row?.coll_company?.bank_name ?? row?.bank_name ?? '',
      bank_no: row?.coll_company?.bank_no ?? row?.bank_no ?? '',
      company: row?.company?.id ?? undefined
    })
  }

  const handleOpenFiles = (row, type) => {
    setOpenDrawer(produce(draft => {
      draft.files = true
    }))
    setBaseData(produce(draft => {
      draft.currentRow = row
      draft.type = type
    }))
  }

  const handleClosePayouts = () => {
    setOpenDrawer(produce(draft => {
      draft.payouts = false
    }))
    setBaseData(produce(draft => {
      draft.currentRow = {
        index: 0,
        payment_at: ''
      }
    }))
  }



  // const handleFinishPayouts = async (values) => {
  //   setBaseData(produce(draft => {
  //     draft.saveValue = values;
  //   }));
  //
  //   const payment_list = [
  //     {
  //       detail_id: baseData?.currentRow?.detail_id ?? 0,
  //       amount: baseData?.currentRow?.ex_amount ?? '',
  //     }
  //   ];
  //   const reim_uid_list = [baseData?.currentRow?.user_id];
  //
  //   // 除掉千分位的逗号
  //   const amount = values.amount?.replace(/,/g, '');
  //
  //   if (('check' in values)) {
  //     // 提交
  //     const params = {
  //       method: 'with_invoice',
  //       payment_type: "paymentPublic",
  //       company_id: values.company ?? '',
  //       department: '对公打款',
  //       file_ids: values?.annex ?? '',
  //       pay_at: values?.time ?? '',
  //       remark: values.remark ?? '',
  //       office_alone_at: baseData.currentRow.payment_at ?? '',
  //       payment_list: payment_list ?? [],
  //       reim_uid_list: reim_uid_list ?? [],
  //       amount: amount ?? '',
  //     };
  //     console.log('未进行校验params--params', values, params);
  //     try {
  //       const res = await submitPayment(params);
  //       console.log('提交成功', res, params);
  //       if (res.success) {
  //         setBaseData(produce(draft => {
  //         draft.showCheckPanel = true;
  //         draft.checkData = res.data ?? [];
  //         }));
  //
  //         await handleClosePayouts();
  //         message.success('操作成功');
  //         actionRef.current?.reload();
  //         return;
  //       }
  //       message.error(res.message);
  //     } catch (err) {
  //       message.error('打款异常');
  //     }
  //   } else {
  //     // 校验
  //     const params = {
  //       detail_id: baseData?.currentRow?.detail_id ?? 0,
  //       company_id: values.company ?? '',
  //       amount: amount ? bcMath.fixedNum(amount) : '',
  //     };
  //     const res = await checkPayment(params);
  //     console.log('进行校验params--params', res, values, params);
  //
  //     if (res.message === 'error' ) {
  //       setBaseData(produce(draft => {
  //         draft.showCheckPanel = true;
  //         draft.checkData = res.data ?? [];
  //       }));
  //     } else {
  //       const newValue = {
  //         ...baseData.saveValue,
  //         check: false
  //       };
  //     await  handleFinishPayouts(newValue);
  //     }
  //   }
  // };


  const handleFinishPayoutsForm = async (values) => {
    console.log('接受数据', values);
    setBaseData(produce(draft => {
      draft.saveValue = values;
    }))
    const payment_list = [
      {
        detail_id: baseData?.currentRow?.detail_id ?? 0,
        amount: baseData?.currentRow?.ex_amount ?? '',
      }
    ];
    const reim_uid_list = [baseData?.currentRow?.user_id];
    const amount = values.amount?.replace(/,/g, '');

    const submitParams = {
      method: 'with_invoice',
      payment_type: "paymentPublic",
      company_id: values.company ?? '',
      department: '对公打款',
      file_ids: values?.annex ?? '',
      pay_at: values?.time ?? '',
      remark: values.remark ?? '',
      office_alone_at: baseData.currentRow.payment_at ?? '',
      payment_list: payment_list ?? [],
      reim_uid_list: reim_uid_list ?? [],
      amount: amount ?? '',
    };
    console.log('提交参数',submitParams);
    const checkParams = {
      detail_id: baseData?.currentRow?.detail_id ?? 0,
      company_id: values.company ?? '',
      amount: amount ? bcMath.fixedNum(amount) : '',
    }
    console.log('校验参数', checkParams);
    try {
      const checkRes = await checkPayment(checkParams);
      console.log('校验结果', checkRes);
      if(checkRes.message === 'error') {
        console.log('金额不相等')
        setBaseData(produce(draft => {
          draft.showCheckPanel = true;
          draft.checkData = checkRes.data ?? [];
        }));
        if(('check' in values)){
          const submitRes = await submitPayment(submitParams);
          if(submitRes.success) {
            message.success('操作成功');
            setBaseData(produce(draft => {
              draft.showCheckPanel = false;
              draft.checkData = [];
            }));
            handleClosePayouts();
            actionRef.current?.reload();
            return;
          } else {
            message.error(submitRes.message);
          }
        }
        return
      } else if (checkRes.message === 'success') {
        console.log('金额相等')
        setBaseData(produce(draft => {
          draft.showCheckPanel = false;
          draft.checkData = [];
        }));
      }
      console.log('values.check', 'check' in values);

      const submitRes = await submitPayment(submitParams);
      console.log('提交结果', submitRes);
      if(submitRes.success) {
        message.success('操作成功');
        handleClosePayouts();
        actionRef.current?.reload();
        return;
      } else {
        message.error(submitRes.message);
      }
    } catch (err) {
      message.error('打款异常');
    }
  }


  const handleChangeFileIds = async (file_ids: string, isDisplayBack = false) => {
    if (file_ids) {
      try {
        const fileList = file_ids.split(',')
        const params = {
          file_id: isEmpty(fileList) ? '' : fileList[fileList.length - 1],
          file_type: 'img'
        }
        const res = await collectionOcr(params)

        if (!res.success && isEmpty(res.data)) {
          error('发票信息获取失败')
          return
        }

        if (isDisplayBack) {
          await form.setFieldsValue({
            amount: res.data?.small ?? ''
          })
        } else {
          await form.setFieldsValue({
            company: 0 === res.data.company ? undefined : res.data.company,
            time: "" !== res.data.income_at && res.data.income_at,
            amount: res.data?.small ?? ''
          })
        }

        await success('发票信息获取成功')

      } catch (err) {
        error('发票信息获取异常')
      }
    }
  }

  const handleCloseFiles = () => {
    setOpenDrawer(produce(draft => {
      draft.files = false
    }))
    setBaseData(produce(draft => {
      draft.type = ''
    }))
  }

  // 财务拒绝对公付款的申请
  const handleAction = (entity, type) => {
    approveFinanceReim({id: entity.reim_list_id, status: type}).then(res => {
      if (res.success) {
        actionRef.current?.reload()
        success('处理成功')
        return
      }
      error(res.message)
    })
  }

  useEffect(() => {
    setColumnsStateMap(getStateMap(pathname))
  }, []);

  useEffect(() => {
    if (!openDrawer.payouts) {
      form.resetFields()
    } else {
      getCompanyList().then(res => {
        if (res.success) {
          setBaseData(produce(draft => {
            draft.companyList = res.data.map(item => {
              return {
                value: item.id,
                label: item.company_cn
              }
            })
          }))
        }
      })
    }
  }, [openDrawer.payouts])

  return {
    form,
    actionRef,
    contextHolder,
    openDrawer,
    baseData,
    handleFetchListData,
    columnsStateMap,
    pathname,
    handleOpenPayouts,
    handleOpenFiles,
    handleClosePayouts,
    handleChangeFileIds,
    // handleFinishPayouts,
    handleJumpTrdNo,
    setColumnsStateMap,
    handleCloseFiles,
    handleGetCurrentWeekly,
    handleAction,
    handleShowCheckPanel,



    handleFinishPayoutsForm
  }
}
