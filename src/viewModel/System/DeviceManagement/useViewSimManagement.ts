import {useCallback, useEffect, useRef, useState} from "react";
import {ActionType, type ParamsType} from "@ant-design/pro-components";
import {Form, message} from "antd";
import {createSimCard, simCard, simCardBaseInfo, simCardList, updateSimCard} from "@/services/ant-design-pro/simCard";
import {useLocation} from "@@/exports";
import {produce} from "immer";

export type BaseDataParams = {
  title: string
  status: number
  operatorList: {value: number, label: string}[]
  vendorList: {value: number, label: string}[]
  currentItem: {
    id: number
  }
}

export type OpenDataParams = {
  detail: boolean
}

export const useViewSimManagement = (intl) => {
  const [columnsStateMap, setColumnsStateMap] = useState({});
  const location = useLocation();
  const currentPath = location.pathname;
  const pathname = currentPath.split('/')[currentPath.split('/').length - 1]
  const [form] = Form.useForm()
  // 配置Message
  const [messageApi, contextHolder] = message.useMessage();
  // 表格实体的引用
  const actionRef = useRef<ActionType>();

  const [baseData, setBaseData] = useState<BaseDataParams>({
    title: '',
    status: 1,
    operatorList: [],
    vendorList: [],
    currentItem: {
      id: 0
    }
  });

  const [openData, setOpenData] = useState<OpenDataParams>({
    detail: false
  });

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

  const handleFetchListData = useCallback(async ({ current, pageSize, ...params }, sort: ParamsType) => {
    console.log('查询params✅✅✅', params);
    const retData = {
      success: false,
      total: 0,
      data: []
    };

    const customParams = {
      page: current,
      page_size: pageSize,
      card_no: params['card_no'] ?? '',
      icc_id: params['icc_id'] ?? '',
    };

    try {
      const response = await simCardList(customParams);
      if (!response.success) {
        return retData;
      }

      const data = response.data.data;

      data?.map(item => {
        item.key = item.id
        return item
      })

      retData.success = true;
      retData.total = response.data.total;
      retData.data = data ?? [];
    } catch (e) {
      error('数据请求异常');
    }
    return retData;
  }, [])

  const handleFinishForm = async () => {
    const value = form.getFieldsValue()
    try {
      if (baseData?.title === '创建') {
        createSimCard({...value}).then(res => {
          if (res.success) {
            success('提交成功')
            actionRef.current?.reload()
            handleCloseDrawer()
            return
          }
          error(res.message)
        })
      } else {
        console.log('修改')
        updateSimCard({...value}, baseData?.currentItem?.id).then(res => {
          if (res.success) {
            success('提交成功')
            actionRef.current?.reload()
            handleCloseDrawer()
            return
          }
          error(res.message)
        })
      }
    } catch (err) {
      error('提交异常')
    }
  }

  const handleCreateOrUpdate = (item, type: string) => {
    setOpenData(produce(draft => {
      draft.detail = true
    }))
    setBaseData(produce(draft => {
      if (type === 'create') {
        draft.title = '创建'
      }
      if (type === 'update') {
        draft.title = '修改'
        draft.currentItem = item
        getSimDetail(item?.id)
      }
    }))
  }

  const getSimDetail = (id: number) => {
    try {
      simCard(id).then(res => {
        if (res.success) {
          form.setFieldsValue({
            card_no: res.data?.card_no ?? '',
            icc_id: res.data?.icc_id ?? '',
            operator_id: (res.data?.operator_id)?.toString() ?? undefined,
            vendor_id: (res.data?.vendor_id)?.toString() ?? undefined,
            status: res.data?.status ?? 1,
            start_at: res.data?.start_at ?? '',
            end_at: res.data?.end_at ?? '',
          })
        }
      })
    } catch (e) {
      error('获取详情异常')
    }
  }

  const handleCloseDrawer = () => {
    form.resetFields()
    setOpenData(produce(draft => {
      draft.detail = false
    }))
    setBaseData(produce(draft => {
      draft.title = ''
    }))
  }

  const handleChangeStatus = (e) => {
    setBaseData(produce(draft => {
      draft.status = e?.target?.value
    }))
  }

  useEffect(() => {
    form.setFieldsValue({
      status: baseData?.status ?? '',
    })
    try {
      simCardBaseInfo().then(res => {
        if (res.success) {
          console.log(Object.keys(res.data.operator).map(item => {
            return {
              value: item,
              label: res.data.operator[item]
            }
          }))
          setBaseData(produce(draft => {
            draft.operatorList = Object.keys(res.data.operator).map(item => {
              return {
                value: item,
                label: res.data.operator[item]
              }
            })
            draft.vendorList = Object.keys(res.data.vendor).map(item => {
              return {
                value: item,
                label: res.data.vendor[item]
              }
            })
          }))
        }
      })
    } catch (error) {
      console.log(error)
    }
  }, []);

  return {
    form,
    actionRef,
    contextHolder,
    handleFetchListData,
    columnsStateMap,
    pathname,
    baseData,
    openData,
    success,
    error,
    setColumnsStateMap,
    handleCreateOrUpdate,
    handleCloseDrawer,
    handleFinishForm,
    handleChangeStatus,
  }
}
