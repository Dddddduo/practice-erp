import { Button, Card, Form, Input, Modal, Radio, Select, Space, message } from "antd"
import React, { useEffect, useState } from "react"
import { getBrandList, getCityList, getMarketList, getShopList, getTplList, createOrderAndReport, createOrUpdateReport } from "@/services/ant-design-pro/report"
import { produce } from "immer";
import { getCompanyList, getMaCateLv0List } from "@/services/ant-design-pro/quotation";
import { getMaCateLv1List, getOptions, getReportInfo, getSameAppoSignList, approveReport } from "@/services/ant-design-pro/orderList";
import UploadFiles from "@/components/UploadFiles";
import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import SubmitButton from "@/components/Buttons/SubmitButton";
import { StringDatePicker } from "@/components/StringDatePickers";
import TempOne from "./template/TempOne";
import TempTwo from "./template/TempTwo";
import TempThree from "./template/TempThree";
import TempFour from "./template/TempFour";
import TempFive from "./template/TempFive";
import TempSeven from "./template/TempSeven";
import TempEight from "./template/TempEight";
import TempNine from "./template/TempNine";
import TempTen from "./template/TempTen";
import TempEleven from "./template/TempEleven";
import TempTwelve from "./template/TempTwelve";
import TempThirteen from "./template/TempThirteen";
import TempFourteen from "./template/TempFourteen";
import { isArray, isEmpty } from "lodash";
import DeleteButton from "@/components/Buttons/DeleteButton";

interface Props {
  handleCloseCreateReport: () => void
  actionRef: any,
  currentItem: any
  type: string
}

const CreateReport: React.FC<Props> = ({
  handleCloseCreateReport,
  actionRef,
  currentItem,
  type,
}) => {
  const [form] = Form.useForm()
  const [isCompletion, setIsCompletion] = useState(0)
  const [showSync, setShowSync] = useState(false)
  const [buttonType, setButtonType] = useState('save')

  // 初始化数据
  const [baseData, setBaseData] = useState<any>({
    brandList: [],
    cityList: [],
    marketList: [],
    storeList: [],
    companyList: [],
    maCateLv0List: [],
    maCateLv1List: [],
    templateList: [],
  })
  const [temp, setTemp] = useState(0)

  // 模板配置
  const [tempData, setTempData] = useState({
    temp1: [
      {
        img_left_file_id: '',
        img_right_file_id: '',
        title: '天花易燃物堆放检查',
      },
      {
        img_left_file_id: '',
        img_right_file_id: '',
        title: '天花线路安全隐患检查',
      },
    ],
    temp2: {
      options: [],
      base: [
        {
          img_left_file_id: '',
          img_right_file_id: '',
          title: undefined
        },
      ],
    },
    temp3: {
      options: [],
      base: [
        {
          img_left_file_id: '',
          img_right_file_id: '',
          title: undefined
        },
      ],
    },
    temp4: [
      {
        img_left_file_id: '',
        img_right_file_id: '',
        title: ''
      },
    ],
    temp5: [
      {
        imageList: '',
        title: ''
      },
    ],
    temp6: [
      {
        imageList: '',
        title: ''
      },
    ],
    temp7: {
      options: [],
      base: [
        {
          img_left_file_id: '',
          img_right_file_id: '',
          title: undefined
        },
      ],
    },
    temp8: {
      options: [],
      base: [
        {
          img_left_file_id: '',
          img_right_file_id: '',
          title: undefined
        },
      ],
    },
    temp9: {
      options: [],
      base: [
        {
          img_left_file_id: '',
          img_right_file_id: '',
          title: undefined
        },
      ],
    },
    temp10: {
      baseOne: {
        options: [],
        base: [
          {
            before_id: '',
            after_id: '',
            description: undefined
          },
        ]
      },
      baseTwo: {
        options: [],
        base: [
          {
            before_id: '',
            description: ''
          },
        ]
      },
      baseThree: {
        options: [],
        base: [
          {
            before_id: '',
            after_id: '',
            description: undefined
          },
        ]
      },
      baseRemark: [
        {
          before_id: '',
          title: '',
          answer: '',
        }
      ],
    },
    temp11: [
      {
        description: '检查所有电气接线点是否紧固',
        imageIds: '',
        remark: '',
      },
      {
        description: '测试绝缘电阻值是否符合要求',
        imageIds: '',
        remark: '',
      },
      {
        description: '测试电器电压是否正常',
        imageIds: '',
        remark: '',
      },
      {
        description: '开关带负荷使用时有否发热（记录温度），带漏电保护的开关的实验按钮动作是否灵活可靠',
        imageIds: '',
        remark: '',
      },
      {
        description: '各个开关（回路）标识是否清晰',
        imageIds: '',
        remark: '',
      },
      {
        description: '测量三相负荷是否均匀，并重新整理箱内线路',
        imageIds: '',
        remark: '',
      },
      {
        description: '已清除阻挡开关箱的物件，并对租户解释清除杂物阻挡开关箱的负面影响',
        imageIds: '',
        remark: '',
      },
      {
        description: '已对箱内开关作除尘处理',
        imageIds: '',
        remark: '',
      },
      {
        description: '检查散热风扇是否正常',
        imageIds: '',
        remark: '',
      },
    ],
    temp12: [
      {
        description: '所有电气接线点是否紧固（包括开关接线、零线、地线）',
        imageIds: '',
        remark: '',
      },
      {
        description: '所有开关及导线线径是否达标，线芯有否发热变色（均正常）',
        imageIds: '',
        remark: '',
      },
      {
        description: '各个配电回路的绝缘电阻是否达标（均达标）',
        imageIds: '',
        remark: '',
      },
      {
        description: '开关带负荷使用时有否发热（记录温度），带漏电保护的开关的实验按钮动作是否灵活可靠（均正常）',
        imageIds: '',
        remark: '',
      },
      {
        description: '各个开关（回路）标识是否清晰（店铺无开关面板）',
        imageIds: '',
        remark: '',
      },
      {
        description: '测量三相负荷是否均匀，如发现不均匀则进行调整（均匀）',
        imageIds: '',
        remark: '',
      },
      {
        description: '确保没有杂物阻挡开关箱操作（无杂物）',
        imageIds: '',
        remark: '',
      },
      {
        description: '所有开关除尘',
        imageIds: '',
        remark: '',
      },
    ],
    temp13: [
      {
        description: '室外幕墙-幕墙背景灯',
        imageIds: '',
        remark: '',
        imageType: 'list'
      },
      {
        description: '室外幕墙-灯箱灯',
        imageIds: '',
        remark: '',
        imageType: 'list'
      },
      {
        description: '室外幕墙-橱窗灯',
        imageIds: '',
        remark: '',
        imageType: 'list'
      },
      {
        description: '室外幕墙-Logo灯',
        imageIds: '',
        remark: '',
        imageType: 'list'
      },
      {
        description: '室内幕墙-幕墙背景灯',
        imageIds: '',
        remark: '',
        imageType: 'list'
      },
      {
        description: '室内幕墙-灯箱灯',
        imageIds: '',
        remark: '',
        imageType: 'list'
      },
      {
        description: '室内幕墙-橱窗灯',
        imageIds: '',
        remark: '',
        imageType: 'list'
      },
      {
        description: '室内幕墙-Logo灯',
        imageIds: '',
        remark: '',
        imageType: 'list'
      },
      {
        description: '店铺内-灯具-天花灯',
        imageIds: '',
        remark: '',
        imageType: 'list'
      },
      {
        description: '店铺内-灯具-墙身柜灯',
        imageIds: '',
        remark: '',
        imageType: 'list'
      },
      {
        description: '店铺内-灯具-层板灯',
        imageIds: '',
        remark: '',
        imageType: 'list'
      },
      {
        description: '店铺内-灯具-海报背景灯',
        imageIds: '',
        remark: '',
        imageType: 'list'
      },
      {
        description: '电视屏-成衣区',
        imageIds: '',
        remark: '',
        imageType: 'list'
      },
      {
        description: '电视屏-珠宝区',
        imageIds: '',
        remark: '',
        imageType: 'list'
      },
      {
        description: '电视屏-楼梯区',
        imageIds: '',
        remark: '',
        imageType: 'list'
      },
      {
        description: '后勤-天花灯',
        imageIds: '',
        remark: '',
        imageType: 'list'
      },
      {
        description: '后勤-电箱用电设施',
        imageIds: '',
        remark: '',
        imageType: 'list'
      },
    ],
    temp14: [
      {
        img_left_file_id: '',
        img_right_file_id: '',
        title: undefined,
      }
    ]
  })

  // 初始化数据获取
  const initData = () => {
    getBrandList().then(res => {
      if (res.success) {
        setBaseData(
          produce((draft) => {
            draft.brandList = res.data.map(item => {
              return {
                value: item.id,
                label: item.brand_en,
              }
            })
          })
        );
      }
    })
    getCityList().then(res => {
      if (res.success) {
        setBaseData(
          produce((draft) => {
            draft.cityList = res.data.map(item => {
              return {
                value: item.id,
                label: item.city_cn,
              }
            })
          })
        );
      }
    })
    getCompanyList().then(res => {
      if (res.success) {
        setBaseData(
          produce((draft) => {
            draft.companyList = res.data.map(item => {
              return {
                value: item.id,
                label: item.company_en ? item.company_en : item.company_cn,
              }
            })
          })
        );
      }
    })
    getMaCateLv0List().then(res => {
      if (res.success) {
        setBaseData(
          produce((draft) => {
            draft.maCateLv0List = Object.keys(res.data).map(item => {
              return {
                value: item,
                label: res.data[item]
              }
            })
          })
        );
      }
    })
    getTplList().then(res => {
      if (res.success) {
        setBaseData(
          produce((draft) => {
            draft.templateList = res.data.map(item => {
              return {
                value: item.id,
                label: item.title,
              }
            })
          })
        );
      }
    })
    getOptions().then(res => {
      if (res.success) {
        setTempData(
          produce((draft) => {
            draft.temp2.options = res.data.descMap.temp2.map(item => {
              return {
                value: item.cn,
                label: item.cn
              }
            })
            draft.temp3.options = res.data.descMap.temp3.map(item => {
              return {
                value: item.cn,
                label: item.cn
              }
            })
            draft.temp7.options = res.data.descMap.temp7.map(item => {
              return {
                value: item.cn,
                label: item.cn
              }
            })
            draft.temp8.options = res.data.descMap.temp8.map(item => {
              return {
                value: item.cn,
                label: item.cn
              }
            })
            draft.temp9.options = res.data.descMap.temp9.map(item => {
              return {
                value: item.cn,
                label: item.cn
              }
            })
          })
        )
      }
    })
  }

  // 联动数据获取
  const handleValueChange = (cur, all) => {
    const params: {
      brand_id: number | string,
      city_id: number | string,
      market_id: number | string,
    } = {
      brand_id: all.brand,
      city_id: all.city,
      market_id: all.market,
    }
    if (cur.city) {
      form.setFieldsValue({
        market: undefined,
        store: undefined,
      })
      getMarketList({ city_id: cur.city }).then(res => {
        if (res.success) {
          setBaseData(
            produce((draft) => {
              draft.marketList = res.data.map(item => {
                return {
                  value: item.id,
                  label: item.market_cn,
                }
              })
            })
          );
        }
      })
    }
    if (!all.city) {
      form.setFieldsValue({
        market: undefined,
        store: undefined,
      })
      setBaseData(
        produce((draft) => {
          draft.marketList = []
        })
      );
    }
    if (Object.keys(cur).find(item => item === 'brand' || item === 'city' || item === 'market')) {
      form.setFieldsValue({ store: undefined })
      getShopList(params).then(res => {
        if (res.success) {
          setBaseData(
            produce((draft) => {
              draft.storeList = res.data.map(item => {
                return {
                  value: item.id,
                  label: item.name_cn,
                }
              })
            })
          );
        }
      })
    }
    if (cur.maCateLv0) {
      form.setFieldsValue({ maCateLv1: undefined })
      getMaCateLv1List({ p_type: cur.maCateLv0 }).then(res => {
        if (res.success) {
          setBaseData(
            produce((draft) => {
              draft.maCateLv1List = res.data.map(item => {
                return {
                  value: item.id,
                  label: item.cn_name,
                }
              })
            })
          );
        }
      })
    }
    if (!all.maCateLv0) {
      form.setFieldsValue({ maCateLv1: undefined })
      setBaseData(
        produce((draft) => {
          draft.maCateLv1List = []
        })
      );
    }
    if (cur.template) {
      setTemp(cur.template)
      if (cur.template === 1) {
        form.setFieldsValue({
          details: tempData.temp1
        })
      }
      if (cur.template === 2) {
        form.setFieldsValue({
          details: tempData.temp2.base
        })
      }
      if (cur.template === 3) {
        form.setFieldsValue({
          details: tempData.temp3.base
        })
      }
      if (cur.template === 4) {
        form.setFieldsValue({
          details: tempData.temp4
        })
      }
      if (cur.template === 5) {
        form.setFieldsValue({
          details: tempData.temp5
        })
      }
      if (cur.template === 6) {
        form.setFieldsValue({
          details: tempData.temp6
        })
      }
      if (cur.template === 7) {
        form.setFieldsValue({
          details: tempData.temp7.base
        })
      }
      if (cur.template === 8) {
        form.setFieldsValue({
          details: tempData.temp8.base
        })
      }
      if (cur.template === 9) {
        form.setFieldsValue({
          details: tempData.temp9.base,
        })
      }
      if (cur.template === 10) {
        form.setFieldsValue({
          baseOne: tempData.temp10.baseOne.base,
          baseTwo: tempData.temp10.baseTwo.base,
          baseThree: tempData.temp10.baseThree.base,
          baseRemark: tempData.temp10.baseRemark,
        })
      }
      if (cur.template === 13) {
        form.setFieldsValue({
          list: tempData.temp13,
        })
      }
      if (cur.template === 14 || cur.template === 15 || cur.template === 16) {
        form.setFieldsValue({
          detail_list: tempData.temp14,
        })
      }
    }
    if (!all.template) {
      setTemp(0)
    }
  }

  // 前后图片类，前后图片切换
  const handleBeforAfterChange = (index, temp) => {
    let BAImageId = {
      img_left_file_id: '',
      img_right_file_id: '',
      title: '',
    }
    let list = form.getFieldValue('details')

    BAImageId.img_left_file_id = form.getFieldValue('details')[index].img_right_file_id ?? ''
    BAImageId.img_right_file_id = form.getFieldValue('details')[index].img_left_file_id ?? ''
    BAImageId.title = form.getFieldValue('details')[index].title ?? ''

    list[index] = BAImageId
    setTempData(
      produce((draft) => {
        draft[`temp${temp}`] = list
      })
    );
    form.setFieldsValue({
      details: list
    })
  }

  const handleChangeTempData = (data, index, type, temp) => {
    if (type === 'input') {
      setTempData(
        produce((draft) => {
          if (temp === 13) {
            draft.temp13[index].remark = data
            form.setFieldsValue({ list: draft.temp13 })
          }
          if (temp === 11) {
            draft.temp11[index].remark = data
            form.setFieldsValue({ list: draft.temp11 })
          }
          if (temp === 12) {
            draft.temp12[index].remark = data
            form.setFieldsValue({ list: draft.temp12 })
          }
        })
      )
    }
    if (type === 'upload') {
      setTempData(
        produce((draft) => {
          if (temp === 13) {
            draft.temp13[index].imageList = data
            form.setFieldsValue({ list: draft.temp13 })
          }
          if (temp === 11) {
            draft.temp11[index].imageList = data
            form.setFieldsValue({ list: draft.temp11 })
          }
          if (temp === 12) {
            draft.temp12[index].imageList = data
            form.setFieldsValue({ list: draft.temp12 })
          }
        })
      )
    }
    if (type === 'add') {
      const newData: any = {
        description: data[index].description,
        imageList: '',
        remark: '',
        imageType: 'list',
      }
      setTempData(
        produce((draft) => {
          draft.temp13.splice(index + 1, 0, newData)
          form.setFieldsValue({ list: draft.temp13 })
        })
      )
    }
    if (type === 'remove') {
      setTempData(
        produce((draft) => {
          draft.temp13 = draft.temp13.filter((item, idx) => index !== idx)
          form.setFieldsValue({ list: draft.temp13 })
        })
      )
    }
    if (type === 'radio') {
      setTempData(
        produce((draft) => {
          draft.temp13[index].type = data.target.value
          form.setFieldsValue({ list: draft.temp13 })
        })
      )
    }
  }

  // 拖拽
  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }
    const sourceIndex = result.source.index;
    const destIndex = result.destination.index;
    form.setFieldsValue({
      details: reorder(form.getFieldValue('details'), sourceIndex, destIndex),
    });
  };
  const reorder = (list: any[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  // 保存
  const handleFinish = (values: any) => {
    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`
    const day = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`
    let temp10Detail = {}
    if (temp === 10) {
      let beforeAfterData: any = []
      let oneData: any = []
      let twoData: any = []
      let questions: any = []
      values.baseOne.map(item => {
        const format = {
          img_left_file_id: item.before_id ?? '',
          img_right_file_id: item.after_id ?? '',
          title: item.description ?? '',
          type: 'beforeAfterData'
        }
        beforeAfterData.push(format)
      })
      values.baseTwo.map(item => {
        const format = {
          img_left_file_id: item.before_id ?? '',
          img_right_file_id: item.after_id ?? '',
          title: item.description ?? '',
          type: 'oneData'
        }
        oneData.push(format)
      })
      values.baseThree.map(item => {
        const format = {
          img_left_file_id: item.before_id ?? '',
          img_right_file_id: item.after_id ?? '',
          title: item.description ?? '',
          type: 'twoData'
        }
        twoData.push(format)
      })
      values.baseRemark.map(item => {
        const format = {
          answer: item.answer ?? '',
          img_left_file_id: item.before_id ?? '',
          title: item.title ?? '',
          type: 'questions'
        }
        questions.push(format)
      })
      temp10Detail = {
        0: questions,
        1: beforeAfterData,
        2: oneData,
        3: twoData
      }
    }
    if (temp === 11 || temp === 12 || temp === 13) {
      if (temp === 11) {
        temp10Detail = tempData.temp11
      }
      if (temp === 12) {
        temp10Detail = tempData.temp12
      }
      if (temp === 13) {
        temp10Detail = tempData.temp13
      }
    }
    let params = {
      appo_task_id: !isEmpty(currentItem) ? currentItem.appo_task_id : undefined,
      report_id: !isEmpty(currentItem) ? currentItem.report_id : undefined,
      store_id: !isEmpty(currentItem) ? currentItem.store_id : values.store,
      company_id: !isEmpty(currentItem) ? currentItem.company_id : values.company,
      ma_type: !isEmpty(currentItem) ? currentItem.ma_type : values.maCateLv0,
      ma_cate_id: !isEmpty(currentItem) ? currentItem.ma_cate_id : values.maCateLv1,
      is_completed: values.isCompletion ?? '',
      completed_at: values.completion_time ?? '',
      report_title: values.title ?? '',
      sign_ids: values.sign ?? '',
      report_tid: values.template ?? '',
      ma_item_list: [{
        file_ids: '',
        location: '',
        ma_cate_id: !isEmpty(currentItem) ? currentItem.ma_cate_id : values.maCateLv1,
        prob_desc: values.title ?? '',
      }],
      detail_list:
        values.details ? values.details : temp10Detail,
      report_at_list: temp === 9 ? values.report_time ? values.report_time.map(item => item.time) : [] : undefined,
      other_info: temp === 9 ? {
        an_equipment_ids: values.equipment ?? '',
        an_floor_plans_ids: values.layout ?? '',
      } : undefined,
      elDetails: temp === 11 ? tempData.temp11 : undefined,
      twelveDetails: temp === 12 ? tempData.temp12 : undefined,
      thirteenDetails: temp === 13 ? tempData.temp13 : undefined,
      specialDetails: temp === 10 ? {
        questions: values.baseRemark ?? [],
        oneData: values.baseTwo ?? [],
        twoData: values.baseThree ?? [],
        beforeAfterData: values.baseOne ?? [],
        cleanAirMachine: [{}],
      } : undefined
    }
    if (isEmpty(currentItem)) {
      createOrderAndReport(params).then(res => {
        if (res.success) {
          if (buttonType === 'save') {
            message.success('添加成功')
            handleCloseCreateReport()
            actionRef.current.reload()
          } else if (buttonType === 'preview') {
            const brand_name = baseData?.brandList?.find((item: any) => item?.value === values?.brand)?.label

            let report_title = ''

            if (currentItem.brand_id === 9) {
              report_title = `${currentItem.brand_en}-${currentItem.abbreviate ?? ''}${currentItem.store_cn}${values.title}${year}-${month}-${day}`
            } else {
              report_title = `${currentItem.brand_en}${values.title}${year}-${month}-${day}`
            }

            window.open(`https://erp.zhian-design.com/#/report-pdf?report_id=${res.data}&report_tid=${values.template}&report_title=${report_title}`, '_blank')


            console.log(currentItem)

            // window.open(`/PDF/ReportPDF?report_id=${res.data}&report_tid=${values.template}&report_title=${report_title}`, '_blank')

            // if (this.reportTid === 14) {
            //   this.iframeSrc =
            //     "https://erp.zhian-design.com/pdf/new_report?report_id=" + report_id;
            // } else {
            //   this.iframeSrc =
            //     "https://erp.zhian-design.com/pdf/report?report_id=" + report_id;
            // }

          }
          return
        }
        message.error(res.message)
      })
    }

    if (!isEmpty(currentItem)) {
      params = {
        company_id: currentItem.company_id ?? '',
        completed_at: values.completion_time ?? '',
        report_title: values.title ?? '',
        report_tid: values.template ?? '',
        detail_list:
          values.details ? values.details : temp10Detail,
        order_id: currentItem.order_id ?? '',
        ma_item_id: currentItem.ma_item_id ?? '',
        appo_task_id: currentItem.appo_task_id ?? '',
        report_id: currentItem.id ? currentItem.id : currentItem.report_id,
        sign_ids: typeof values.sign !== 'string' ? values.sign.join(',') : values.sign,
        supplier_order_id: currentItem.supplier_order_id ? currentItem.supplier_order_id : undefined,
      }
      createOrUpdateReport(params).then(res => {
        if (res.success) {
          if (buttonType === 'save') {
            message.success('修改成功')
            handleCloseCreateReport()
            actionRef.current.reload()
          } else if (buttonType === 'preview') {

            console.log(currentItem)

            let report_title = ''

            if (currentItem.brand_id === 9) {
              report_title = `${currentItem.brand_en}-${currentItem.abbreviate ?? ''}${currentItem.store_cn}${values.title}${year}-${month}-${day}`
            } else {
              report_title = `${currentItem.brand_en}${values.title}${year}-${month}-${day}`
            }

            // window.open(`https://erp.zhian-design.com/#/report-pdf?report_id=${res.data}&report_tid=${values.template}&report_title=${report_title}`, '_blank')
            window.open(`/PDF/ReportPDF?report_id=${res.data}&report_tid=${values.template}&report_title=${report_title}`, '_blank')
          }
          return
        }
        message.error(res.message)
      })
    }
  }

  // 签单同步
  const handleSignSync = () => {
    setShowSync(true)
    getSameAppoSignList({ appo_task_id: currentItem.appo_task_id ?? 0 }).then(res => {
      if (res.success) {
        return
      }
      message.error(res.message)
    })
  }

  // 通过和拒绝
  const handleApproveReport = async (type: string) => {
    try {
      const params = {
        report_id: currentItem?.id ?? 0,
        status: type ?? '',
      }
      const res = await approveReport(params)
      if (!res.success) {
        message.error(res.message)
        return
      }
      handleCloseCreateReport()
      message.success('操作成功')
    } catch (error) {
      message.error('操作异常')
    }
  }

  useEffect(() => {
    console.log(currentItem);

    initData()
    if (isEmpty(currentItem)) {
      form.setFieldsValue({ isCompletion: 0, report_time: [{}] })
      return
    }
    let params
    if (type === 'report') {
      params = {
        report_id: currentItem.id
      }
    } else {
      if (!currentItem.report_id) {
        params = {
          ma_item_id: currentItem.ma_item_id,
          appo_task_id: currentItem.appo_task_id,
          supplier_order_id: currentItem.order_supplier_id
        }
      } else {
        params = {
          report_id: currentItem.report_id,
          supplier_order_id: currentItem.order_supplier_id
        }
      }
    }

    getReportInfo(params).then(res => {
      if (res.success) {
        setTemp(res.data.report_tid)
        let details = res.data.detail_list.map(item => {
          if (item.imageList) {
            return {
              imageList: item.imageList,
              title: item.title,
            }
          }
          return item
        })

        let report_time_list: any = []
        if (res.data.report_at_list) {
          res.data.report_at_list.map((item, index) => {
            let formatTime = {
              time: item
            }
            report_time_list.push(formatTime)
          })
        }


        let baseOne: any = []
        let baseTwo: any = []
        let baseThree: any = []
        let questions: any = []
        if (res.data.report_tid === 10) {
          if (res.data.detail_list && isArray(res.data.detail_list)) {
            res.data.detail_list[1]?.map(item => {
              baseOne.push({
                description: item.title ?? undefined,
                before_id: item.img_left_file_id ?? '',
                after_id: item.img_right_file_id ?? '',
              })
            })

            res.data.detail_list[2]?.map(item => {
              baseTwo.push({
                description: item.title ?? undefined,
                before_id: item.img_left_file_id ?? '',
                after_id: item.img_right_file_id ?? '',
              })
            })

            res.data.detail_list[3]?.map(item => {
              baseThree.push({
                description: item.title ?? undefined,
                before_id: item.img_left_file_id ?? '',
                after_id: item.img_right_file_id ?? '',
              })
            })

            res.data.detail_list[0]?.map(item => {
              questions.push({
                answer: item.answer ?? undefined,
                before_id: item.img_left_file_id ?? '',
                title: item.title ?? '',
              })
            })
          }
        }

        let list: any = []
        if (res.data.report_tid === 11 || res.data.report_tid === 12 || res.data.report_tid === 13) {
          if (!isEmpty(res.data.detail_list)) {
            res.data.detail_list.map(item => {
              list.push({
                description: item.description ?? '',
                imageIds: item.imageList ?? '',
                remark: item.remark ?? '',
              })
            })
          }
        }

        let curTempData
        if (res.data.report_tid === 11) {
          curTempData = tempData.temp11
        } else if (res.data.report_tid === 12) {
          curTempData = tempData.temp12
        } else if (res.data.report_tid === 13) {
          curTempData = tempData.temp13
        }

        setTempData(
          produce((draft) => {
            draft.temp13 = list
          })
        )

        form.setFieldsValue({
          report_no: res.data.report_no ?? '',
          brand: res.data.brand_cn ?? '',
          city: res.data.city_cn ?? '',
          market: res.data.market_cn ?? '',
          store: res.data.store_cn ?? '',
          company: res.data.company_en ?? '',
          maCateLv0: res.data.ma_type_cn ?? '',
          maCateLv1: res.data.ma_cate_cn ?? '',
          completion_time: res.data.completed_at ?? '',
          title: res.data.report_title ?? '',
          sign: res.data.sign_file_list ? res.data.sign_file_list.map(item => item.id) : [],
          template: res.data.report_tid ? res.data.report_tid : undefined,
          details: isEmpty(details) ? [{}] : details,
          report_time: report_time_list ?? [{ time: undefined }],
          equipment: res.data.other_info.an_equipment_ids ?? '',
          layout: res.data.other_info.an_floor_plans_ids ?? '',
          baseOne: isEmpty(baseOne) ? [{}] : baseOne,
          baseTwo: isEmpty(baseTwo) ? [{}] : baseTwo,
          baseThree: isEmpty(baseThree) ? [{}] : baseThree,
          baseRemark: isEmpty(questions) ? [{}] : questions,
          list: list ?? curTempData,
          // detail_list: list ?? tempData.temp14
        })
      }
    })
  }, [])

  return (
    <>
      <Form
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 18 }}
        style={{ maxWidth: 800 }}
        onFinish={handleFinish}
        onValuesChange={handleValueChange}
      >
        {
          (currentItem && (currentItem.report_id || currentItem.id)) &&
          <Form.Item name="report_no" label="编号" rules={[{ required: true }]}>
            <Input readOnly bordered={false} />
          </Form.Item>
        }

        <Form.Item name="brand" label="品牌" rules={[{ required: true }]}>
          {
            isEmpty(currentItem) ?
              <Select
                options={baseData.brandList}
                allowClear
                placeholder="请选择"
                showSearch
                filterOption={(input, option) => (option?.label ?? '').includes(input)}
              /> :
              <Input readOnly bordered={false} />
          }
        </Form.Item>

        <Form.Item name="city" label="城市" rules={[{ required: true }]}>
          {
            isEmpty(currentItem) ?
              <Select
                options={baseData.cityList}
                allowClear
                placeholder="请选择"
                showSearch
                filterOption={(input, option) => (option?.label ?? '').includes(input)}
              /> :
              <Input readOnly bordered={false} />
          }
        </Form.Item>

        <Form.Item name="market" label="商场" rules={[{ required: true }]}>
          {
            isEmpty(currentItem) ?
              <Select
                options={baseData.marketList}
                allowClear
                placeholder="请选择"
                showSearch
                filterOption={(input, option) => (option?.label ?? '').includes(input)}
              /> :
              <Input readOnly bordered={false} />
          }
        </Form.Item>

        <Form.Item name="store" label="店铺" rules={[{ required: true }]}>
          {
            isEmpty(currentItem) ?
              <Select
                options={baseData.storeList}
                allowClear
                placeholder="请选择"
                showSearch
                filterOption={(input, option) => (option?.label ?? '').includes(input)}
              /> :
              <Input readOnly bordered={false} />
          }
        </Form.Item>

        <Form.Item name="company" label="公司">
          {
            isEmpty(currentItem) ?
              <Select
                options={baseData.companyList}
                allowClear
                placeholder="请选择"
                showSearch
                filterOption={(input, option) => (option?.label ?? '').includes(input)}
              /> :
              <Input readOnly bordered={false} />
          }
        </Form.Item>

        <Form.Item name="maCateLv0" label="维修类型" rules={[{ required: true }]}>
          {
            isEmpty(currentItem) ?
              <Select
                options={baseData.maCateLv0List}
                allowClear
                placeholder="请选择"
                showSearch
                filterOption={(input, option) => (option?.label ?? '').includes(input)}
              /> :
              <Input readOnly bordered={false} />
          }
        </Form.Item>

        <Form.Item name="maCateLv1" label="维修项目" rules={[{ required: true }]}>
          {
            isEmpty(currentItem) ?
              <Select
                options={baseData.maCateLv1List}
                allowClear
                placeholder="请选择"
                showSearch
                filterOption={(input, option) => (option?.label ?? '').includes(input)}
              /> :
              <Input readOnly bordered={false} />
          }
        </Form.Item>

        {
          isEmpty(currentItem) &&
          <Form.Item name="isCompletion" label="是否完工">
            <Radio.Group onChange={(e => setIsCompletion(e.target.value))}>
              <Radio value={0}>否</Radio>
              <Radio value={1}>是</Radio>
            </Radio.Group>
          </Form.Item>
        }

        {
          (isCompletion === 1 || !isEmpty(currentItem)) &&
          <Form.Item name="completion_time" label="完工日期">
            <StringDatePicker />
          </Form.Item>
        }

        <Form.Item name="title" label="标题" rules={[{ required: true }]}>
          <Input placeholder="0-100个字符" />
        </Form.Item>

        <Form.Item name="sign" label="签收单">
          <UploadFiles />
        </Form.Item>

        <Form.Item name="synchronous" label="签单同步">
          <Button type="primary" onClick={() => handleSignSync()}>签单同步</Button>
        </Form.Item>

        <Form.Item name="template" label="选择模板" rules={[{ required: true }]}>
          <Select
            options={baseData.templateList}
            allowClear
            placeholder="请选择" showSearch
            filterOption={(input, option) => (option?.label ?? '').includes(input)}
          />
        </Form.Item>

        {
          temp === 9 &&
          <>
            <Form.Item label="报告时间">
              <Form.List name="report_time" initialValue={[{}]}>
                {(fields, { add, remove }) => (
                  fields.map(({ key, name, ...restField }, index) => (
                    <div key={key} style={{ display: 'flex' }}>
                      <Form.Item
                        {...restField}
                        name={[name, 'time']}
                        style={{ marginRight: 10 }}
                      >
                        <StringDatePicker />
                      </Form.Item>
                      <Form.Item>
                        <Space>
                          {
                            name !== 0 &&
                            <MinusCircleOutlined onClick={() => remove(name)} style={{ fontSize: 18, cursor: 'pointer' }} />
                          }
                          <PlusCircleOutlined
                            style={{ fontSize: 18, cursor: 'pointer' }}
                            onClick={() => add({}, index + 1)}
                          />
                        </Space>
                      </Form.Item>
                    </div>
                  ))

                )}
              </Form.List>
              {/* <StringDatePicker /> */}
            </Form.Item>

            <Form.Item name="equipment" label="设备表">
              <UploadFiles />
            </Form.Item>

            <Form.Item name="layout" label="布局图">
              <UploadFiles />
            </Form.Item>
          </>
        }

        {
          temp !== 0 &&
          <Form.Item label="明细" required>
            {
              temp === 1 &&
              <TempOne onDragEnd={onDragEnd} tempData={tempData.temp1} handleBeforAfterChange={handleBeforAfterChange} />
            }
            {
              temp === 2 &&
              <TempTwo onDragEnd={onDragEnd} tempData={tempData.temp2} handleBeforAfterChange={handleBeforAfterChange} />
            }
            {
              temp === 3 &&
              <TempThree onDragEnd={onDragEnd} tempData={tempData.temp3} handleBeforAfterChange={handleBeforAfterChange} />
            }
            {
              temp === 4 &&
              <TempFour onDragEnd={onDragEnd} tempData={tempData.temp4} handleBeforAfterChange={handleBeforAfterChange} />
            }
            {
              (temp === 5 || temp === 6) &&
              <TempFive onDragEnd={onDragEnd} />
            }
            {
              temp === 7 &&
              <TempSeven onDragEnd={onDragEnd} tempData={tempData.temp7} handleBeforAfterChange={handleBeforAfterChange} />
            }
            {
              temp === 8 &&
              <TempEight onDragEnd={onDragEnd} tempData={tempData.temp8} handleBeforAfterChange={handleBeforAfterChange} />
            }
            {
              temp === 9 &&
              <TempNine onDragEnd={onDragEnd} tempData={tempData.temp9} handleBeforAfterChange={handleBeforAfterChange} />
            }
            {
              temp === 10 &&
              <TempTen tempData={tempData.temp10} />
            }
            {
              temp === 11 &&
              <TempEleven tempData={tempData.temp11} handleChangeTempData={handleChangeTempData} />
            }
            {
              temp === 12 &&
              <TempTwelve tempData={tempData.temp12} handleChangeTempData={handleChangeTempData} />
            }
            {
              temp === 13 &&
              <TempThirteen tempData={tempData.temp13} handleChangeTempData={handleChangeTempData} />
            }
            {
              (temp === 14 || temp === 15 || temp === 16) &&
              <TempFourteen onDragEnd={onDragEnd} tempData={tempData.temp14} handleBeforAfterChange={handleBeforAfterChange} />
            }
          </Form.Item>
        }

        {
          temp === 10 &&
          <Form.Item label="问题及反馈描述" required>
            <Form.List name="baseRemark">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Card style={{ marginBottom: 20 }}>
                      <Space key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} align="baseline">
                        <Form.Item
                          {...restField}
                          name={[name, 'before_id']}
                        >
                          <UploadFiles fileLength={1} />
                        </Form.Item>

                        <Form.Item>
                          <Space>
                            <PlusCircleOutlined onClick={() => add()} style={{ fontSize: 20 }} />
                            {
                              name !== 0 &&
                              <MinusCircleOutlined onClick={() => remove(name)} style={{ fontSize: 20 }} />
                            }
                          </Space>
                        </Form.Item>
                      </Space>
                      <Form.Item
                        {...restField}
                        name={[name, 'title']}
                      >
                        <Input placeholder="请输入问题" />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'answer']}
                      >
                        <Input.TextArea placeholder="请输入解决方案" />
                      </Form.Item>
                    </Card>
                  ))}
                </>
              )}
            </Form.List>
          </Form.Item>
        }

        <Form.Item label=" " colon={false}>
          <Space>
            <SubmitButton type="primary" form={form} onClick={() => setButtonType('sava')}>保存</SubmitButton>
            <Button type="primary" htmlType="submit" onClick={() => setButtonType('preview')}>预览</Button>
            <Button danger onClick={handleCloseCreateReport}>取消</Button>
            <DeleteButton
              type="primary"
              className="green-button"
              onConfirm={() => handleApproveReport('manager_agree')}
              title="确认通过吗？"
            >
              通过
            </DeleteButton>
            <DeleteButton
              type="primary"
              danger
              onConfirm={() => handleApproveReport('manager_reject')}
              title="确认拒绝吗？"
            >
              拒绝
            </DeleteButton>
            <Button type="primary" className="green-button" onClick={() => { }}>分享</Button>
          </Space>
        </Form.Item>
      </Form >

      <Modal
        open={showSync}
        width={600}
        destroyOnClose={true}
        onCancel={() => setShowSync(false)}
        title="图片列表"
      >
        <UploadFiles />
      </Modal>
    </>
  )
}

export default CreateReport
