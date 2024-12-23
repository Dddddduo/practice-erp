import React, {RefObject, useEffect, useRef, useState} from "react";
import {Button, DatePicker, Input, Select, Upload, Form, Table, Radio, Card, Row, message, Space} from 'antd';
import dayjs from "dayjs";
import "./weekly.css";
import UploadFiles from "@/components/UploadFiles";
import {DeleteOutlined, PlusOutlined} from "@ant-design/icons";
import PhotoDetailForm from "@/pages/Project/Weekly/components/PhotoDetailForm";
import DynamicProgressList from "@/pages/Project/Weekly/components/DynamicProgressList";
import VoListForm from "@/pages/Project/Weekly/components/VoListForm";
import ADetails from "@/pages/Project/Weekly/components/ADetails";
import DynamicFormTable from "@/pages/Project/Weekly/components/DynamicFormTable";
import {getBrandList, getCityList, getMarketList, getShopList} from "@/services/ant-design-pro/report";
import {createOrUpdateWeeklyReport, getWeeklyReportInfo} from "@/services/ant-design-pro/weekly";

interface ItemProps {
  weeklyId: number
  marketId: number
  cityId: number
  onClose: () => void
  fetchInitData: ({ current, pageSize }) => void
}

const { Option } = Select;

const WeeklyDetail: React.FC<ItemProps> = ({weeklyId, marketId, cityId, onClose, fetchInitData}) => {
  const [brands, setBrands] = useState([]);
  const [cities, setCities] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [stores, setStores] = useState([]);
  const [voListTotal, setVoListTotal] = useState(0)
  const [status, setStatus] = useState(false)
  const quotationDetailsRef = useRef<any>(null)
  const voListFormRef = useRef<any>(null)
  const dynamicProgressList = useRef<any>(null)
  const dynamicFormTable = useRef<any>(null)
  const photoDetailForm = useRef<any>(null)
  const [weeklyParams, setWeeklyParams] = useState<any>({
    brand_id: '',
    city_id: '',
    market_id: '',
    store_id: '',
    project_start_at: '',
    project_end_at: '',
    report_start_at: '',
    report_end_at: '',
    report_title: '',
    code: '',
    project_type: '',
    aDetails: [],
    bDetails: { pictures: [], picture_ids: '' },
    aTitle: 'A. Drawing',
    bTitle: 'B. Construction Schedule',
    cTitle: 'C. Milestone Date',
    dTitle: 'D.Site Photos',
    eTitle: 'E. Schedule Progress',
    fTitle: 'F. Vo List',
    voList: [],
    // Convert other data as needed
  });


  const changeStores = (city_id: any, brand_id: any, market_id: any) => {
    getShopList({ city_id: city_id, brand_id: brand_id, market_id: market_id }).then((res) => {
      setStores(res.data)
    })
  }

  const handleChangeBrand = (value) => {
    setWeeklyParams({ ...weeklyParams, brand_id: value, store_id: '' })
    changeStores(weeklyParams.city_id, value, weeklyParams.market_id)
  }

  const initMarkets = (cityId) => {
    getMarketList({ city_id: cityId }).then((res) => {
      setMarkets(res.data)
    })
  }

  /**
   * 切换城市
   * @param value
   */
  const handleChangeCity = (value) => {
    setWeeklyParams({ ...weeklyParams, city_id: value, market_id: '', store_id: '' })
    changeStores(value, weeklyParams.brand_id, weeklyParams.market_id)
    initMarkets(value)
  }

  /**
   * 切换市场
   * @param value
   */
  const handleChangeMarket = (value) => {
    setWeeklyParams({ ...weeklyParams, market_id: value, store_id: '' })
    changeStores(weeklyParams.city_id, weeklyParams.brand_id, value)
  }

  const handleChangeStore = (value) => {
    setWeeklyParams({ ...weeklyParams, store_id: value })
  }

  const onChangeDate = (field, value) => {
    setWeeklyParams({ ...weeklyParams, [field]: dayjs(value).format('YYYY-MM-DD') });
  }

  const handleSubmit = (type) => {
    if (weeklyParams.store_id.length <= 0 && parseInt(weeklyParams.store_id) <= 0) {
      message.error('请选择店铺')
      return
    }

    const params: any = {
      store_id: weeklyParams.store_id,
      project_start_at: weeklyParams.project_start_at,
      project_end_at: weeklyParams.project_end_at,
      report_info: [],
    }

    if (weeklyParams.code.length > 0) {
      params.report_info.push({
        type: 'code',
        value: weeklyParams.code,
      })
    }

    if (weeklyParams.report_start_at) {
      params.report_info.push({
        type: 'report_start_at',
        report_start_at: weeklyParams.report_start_at,
        title: weeklyParams.report_start_at
      })
    }

    if (weeklyParams.report_end_at) {
      params.report_info.push({
        type: 'report_end_at',
        report_start_at: weeklyParams.report_end_at,
        title: weeklyParams.report_end_at
      })
    }

    if (weeklyParams.report_title) {
      params.report_info.push({
        type: 'report_title',
        title: weeklyParams.report_title
      })
    }

    if (weeklyParams.project_type) {
      params.report_info.push({
        type: 'report_title',
        title: weeklyParams.project_type
      })
    }

    if (quotationDetailsRef.current.getADetails()) {
      for (const item in quotationDetailsRef.current.getADetails()) {
        const detail  = {
          type: 'aDetails',
          remark: quotationDetailsRef.current.getADetails()[item].remark,
        }
        for (const key in quotationDetailsRef.current.getADetails()[item].picture_ids.split(',')) {
          detail['img_' + key + '_file_id'] = quotationDetailsRef.current.getADetails()[item].picture_ids.split(',')[key]
        }
        params.report_info.push(detail)
      }
    }

    if (weeklyParams.bDetails.picture_ids.length > 0) {
      for (const item in weeklyParams.bDetails.picture_ids.split(',')) {
        params.report_info.push({
          type: 'bDetails',
          img_file_id: weeklyParams.bDetails.picture_ids.split(',')[item]
        })
      }
    }

    if (dynamicFormTable.current.getFormData()) {
      const detail = {
        type: 'cDetails',
        status: dynamicFormTable.current.getStatus(),
        details: dynamicFormTable.current.getFormData(),
      }
      params.report_info.push(detail)
    }

    if (photoDetailForm.current.getList()) {
      for (const item in photoDetailForm.current.getList()) {
        params.report_info.push({
          type: 'dDetails_list',
          date: photoDetailForm.current.getList()[item].date,
          img_file_id: photoDetailForm.current.getList()[item].picture_ids,
          location: photoDetailForm.current.getList()[item].location,
          item: photoDetailForm.current.getList()[item].item,
          description: photoDetailForm.current.getList()[item].description,
        })
      }
    }

    if (dynamicProgressList.current.getProgressPassedWeekList()) {
      params.report_info.push({
        type: 'progressPassedList',
        details: dynamicProgressList.current.getProgressPassedWeekList()
      })
    }

    if (dynamicProgressList.current.getProgressComingWeekList()) {
      params.report_info.push({
        type: 'progressPassedList',
        details: dynamicProgressList.current.getProgressComingWeekList()
      })
    }

    if (voListFormRef.current.getVoList()) {
      params.report_info.push({
        type: 'voList',
        details: voListFormRef.current.getVoList(),
        amount_type: voListFormRef.current.getAmountType()
      })
    }

    params.report_info.push({
      type: 'titles',
      details: {
        aTitle: weeklyParams.aTitle,
        bTitle: weeklyParams.bTitle,
        cTitle: weeklyParams.cTitle,
        dTitle: weeklyParams.dTitle,
        eTitle: weeklyParams.eTitle,
        fTitle: weeklyParams.fTitle,
      }
    })

    createOrUpdateWeeklyReport(params).then((res) => {
      if (res.success) {
        if (type === 'preview') {
          window.open('https://erp.zhian-design.com/#/weekly-pdf?id=0', '_blank')
        } else {
          message.success('提交成功')
          onClose()
          const param = {
            current: 1,
            pageSize: 20
          }
          fetchInitData(param)
        }
      } else {
        message.error(res.message)
      }
    })
  }

  const changeBDetailPictures = (value) => {
    setWeeklyParams({ ...weeklyParams, bDetails: { ...weeklyParams.bDetails, pictures: [], picture_ids: value } })
  }

  const back = () => {
    onClose()
  }

  useEffect(() => {
    console.log('sdkfklsdlfldsfdfds', marketId, cityId)
    getBrandList().then((res) => {
      if (res.data && res.data.length > 0) {
        setBrands(res.data)
      }
    })

    getCityList().then((res) => {
      if (res.data && res.data.length > 0) {
        setCities(res.data)
      }
    })
    if (weeklyId > 0) {
      getWeeklyReportInfo({ weekly_report_id: weeklyId }).then((res) => {
        if (res.data) {
          initMarkets(cityId)
          changeStores(cityId, res.data.brand_id, marketId)
          const data = {
            brand_id: res.data.brand_id,
            city_id: cityId,
            market_id: marketId,
            store_id: res.data.store_id,
            project_start_at: res.data.project_start_at,
            project_end_at: res.data.project_end_at,
            bDetails: {picture_ids: ''},
            code: '',
            aTitle: 'A. Drawing',
            bTitle: 'B. Construction Schedule',
            cTitle: 'C. Milestone Date',
            dTitle: 'D.Site Photos',
            eTitle: 'E. Schedule Progress',
            fTitle: 'F. Vo List',
            report_start_at: '',
            report_end_at: '',
            project_type: '',
            report_title: '',
          }
          const reportInfo = res.data.report_info
          const bDetails:any = []
          const aDetails:any = []
          const dDetails:any = []
          let progressPassedList: any = []
          let progressAPassedList: any = []
          let progressBPassedList: any = []
          let progressCPassedList: any = []
          let progressComingWeekList: any = []
          let progressAComingWeekList: any = []
          let progressBComingWeekList: any = []
          let progressCComingWeekList: any = []
          let siteDescriptions: any = []
          for (const item in reportInfo) {
            if (reportInfo[item].type === 'siteDescriptions') {
              for (const value in reportInfo[item].details) {
                let currentSiteDescription: any = []
                for (const key in reportInfo[item].details[value]) {
                  currentSiteDescription.push(reportInfo[item].details[value][key].text)
                }
                siteDescriptions[value] = currentSiteDescription
              }
            }
          }

          let index = 0
          for (const item in reportInfo) {
            if (reportInfo[item].type === 'code') {
              data.code = reportInfo[item].title
            } else if (reportInfo[item].type === 'project_type') {
              data.project_type = reportInfo[item].title
            } else if (reportInfo[item].type === 'report_title') {
              data.report_title = reportInfo[item].title
            } else if (reportInfo[item].type === 'report_start_at') {
              data.report_start_at = reportInfo[item].title
            } else if (reportInfo[item].type === 'report_end_at') {
              data.report_end_at = reportInfo[item].title
            } else if (reportInfo[item].type === 'titles') {
              data.aTitle = reportInfo[item].details.aTitle
              data.bTitle = reportInfo[item].details.bTitle
              data.cTitle = reportInfo[item].details.cTitle
              data.dTitle = reportInfo[item].details.dTitle
              data.eTitle = reportInfo[item].details.eTitle
              data.fTitle = reportInfo[item].details.fTitle
            } else if (reportInfo[item].type === 'voList') {
              voListFormRef.current.updateVoList(reportInfo[item].details)
              voListFormRef.current.updateAmountType(reportInfo[item].amount_type)
            } else if (reportInfo[item].type === 'aDetails') {
              let pictureIds: any = []
              for (let i = 0; i < 50; i++) {
                if (reportInfo[item]['img_' + i + '_file_id']) {
                  pictureIds.push(reportInfo[item]['img_' + i + '_file_id'])
                }
              }
              aDetails.push({
                remark: reportInfo[item].remark,
                picture_ids: pictureIds.join(','),
              })
            } else if (reportInfo[item].type === 'bDetails') {
              bDetails.push(reportInfo[item].img_file_id)
            } else if (reportInfo[item].type === "dDetails_list") {
              console.log('description.....', reportInfo[item].description)
              let description = []
              if (typeof reportInfo[item].description !== 'undefined' && reportInfo[item].description !== null && reportInfo[item].description.length > 0 && reportInfo[item].description[0] != null && reportInfo[item].description[0].length > 0) {
                description = reportInfo[item].description
              } else if (siteDescriptions.length > 0 && siteDescriptions[index].length > 0) {
                description = siteDescriptions[index]
              }
              dDetails.push({
                picture_ids: reportInfo[item].img_file_id,
                location: reportInfo[item].location,
                item: reportInfo[item].item,
                description: description
              })
              index++
            } else if (reportInfo[item].type === 'cDetails') {
              dynamicFormTable.current.updateFormData(reportInfo[item].details)
              dynamicFormTable.current.updateStatus(reportInfo[item].status)
            } else if (reportInfo[item].type === 'progressPassedList') {
              progressPassedList = reportInfo[item].details
            } else if (reportInfo[item].type === 'progressAPassedList') {
              progressAPassedList = reportInfo[item].details
            } else if (reportInfo[item].type === 'progressBPassedList') {
              progressBPassedList = reportInfo[item].details
            } else if (reportInfo[item].type === 'progressCPassedList') {
              progressCPassedList = reportInfo[item].details
            } else if (reportInfo[item].type === 'progressComingList') {
              progressComingWeekList = reportInfo[item].details
            } else if (reportInfo[item].type === 'progressAComingList') {
              progressAComingWeekList = reportInfo[item].details
            } else if (reportInfo[item].type === 'progressBComingList') {
              progressBComingWeekList = reportInfo[item].details
            } else if (reportInfo[item].type === 'progressCComingList') {
              progressCComingWeekList = reportInfo[item].details
            }
          }
          if (aDetails.length > 0) {
            quotationDetailsRef?.current.updateDetails(aDetails)
          }

          if (bDetails.length > 0) {
            data.bDetails.picture_ids = bDetails.join(',')
          }

          if (dDetails.length > 0) {
            photoDetailForm.current.updateList(dDetails)
          }

          const pData:any = []
          for (const item of progressPassedList) {
            if (item.key === 'A') {
              let aItems:any = []
              for (const value of progressAPassedList) {
                aItems.push({
                  content: value.content,
                  expected_completion: value.expected_completion,
                  note: value.note,
                })
              }
              pData.push({
                key: 'A',
                content: item.content,
                note: '',
                items: aItems
              })
            }
            if (item.key === 'B') {
              let aItems:any = []
              for (const value of progressBPassedList) {
                aItems.push({
                  content: value.content,
                  expected_completion: value.expected_completion,
                  note: value.note,
                })
              }
              pData.push({
                key: 'B',
                content: item.content,
                note: '',
                items: aItems
              })
            }
            if (item.key === 'C') {
              let aItems:any = []
              for (const value of progressCPassedList) {
                aItems.push({
                  content: value.content,
                  expected_completion: value.expected_completion,
                  note: value.note,
                })
              }
              pData.push({
                key: 'C',
                content: item.content,
                note: '',
                items: aItems
              })
            }
          }
          if (pData.length > 0) {
            dynamicProgressList.current.updateProgressPassedWeekList(pData)
          }

          const cData: any = []
          for (const item of progressComingWeekList) {
            if (item.key === 'A') {
              let aItems:any = []
              for (const value of progressAComingWeekList) {
                aItems.push({
                  content: value.content,
                  expected_completion: value.expected_completion,
                  note: value.note,
                })
              }
              cData.push({
                key: 'A',
                content: item.content,
                note: '',
                items: aItems
              })
            }
            if (item.key === 'B') {
              let aItems:any = []
              for (const value of progressBComingWeekList) {
                aItems.push({
                  content: value.content,
                  expected_completion: value.expected_completion,
                  note: value.note,
                })
              }
              cData.push({
                key: 'B',
                content: item.content,
                note: '',
                items: aItems
              })
            }
            if (item.key === 'C') {
              let aItems:any = []
              for (const value of progressCComingWeekList) {
                aItems.push({
                  content: value.content,
                  expected_completion: value.expected_completion,
                  note: value.note,
                })
              }
              cData.push({
                key: 'C',
                content: item.content,
                note: '',
                items: aItems
              })
            }
          }

          if (cData.length > 0) {
            dynamicProgressList.current.updateProgressComingWeekList(cData)
          }
          setWeeklyParams(data)
        }
      })
    }
  }, []);



  return (
    <>
      <Form labelCol={{ span: 4 }} wrapperCol={{ span: 16 }}>
        <Form.Item label="品牌">
          <Select
            showSearch
            value={weeklyParams.brand_id}
            filterOption={(input, option: any) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            onChange={handleChangeBrand}>
            {brands.map((brand: any) => (
              <Option key={brand.id} value={brand.id}>{brand.brand_en}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="城市">
          <Select
            showSearch
            value={weeklyParams.city_id}
            onChange={handleChangeCity}
            filterOption={(input, option: any) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {cities.map((city: any) => (
              <Option key={city.id}  value={city.id}>{city.city_cn}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="商场">
          <Select
            showSearch
            value={weeklyParams.market_id}
            filterOption={(input, option: any) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            onChange={handleChangeMarket}>
            {markets.map((item: any) => (
              <Option key={item.id} value={item.id}>{item.market_cn}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="店铺" >
          <Select
            showSearch
            value={weeklyParams.store_id}
            filterOption={(input, option: any) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            onChange={handleChangeStore}>
            {stores.map((store: any) => (
              <Option key={store.id} value={store.id}>{store.name_cn}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="开工日期">
          <DatePicker value={dayjs(weeklyParams.project_start_at).isValid() ? dayjs(weeklyParams.project_start_at) : ''}  onChange={(value) => onChangeDate('project_start_at', value)} />
        </Form.Item>
        <Form.Item label="完工日期">
          <DatePicker value={dayjs(weeklyParams.project_end_at).isValid() ? dayjs(weeklyParams.project_end_at) : ''}  onChange={(value) => onChangeDate('project_end_at', value)} />
        </Form.Item>
        <Form.Item label="报告开始时间">
          <DatePicker value={ dayjs(weeklyParams.report_start_at).isValid() ? dayjs(weeklyParams.report_start_at) : ''} onChange={(value) => onChangeDate('report_start_at', value)} />
        </Form.Item>
        <Form.Item label="报告结束时间">
          <DatePicker value={dayjs(weeklyParams.report_end_at).isValid() ? dayjs(weeklyParams.report_end_at) : ''} onChange={(value) => onChangeDate('report_end_at', value)} />
        </Form.Item>
        <Form.Item label="标题">
          <Input value={weeklyParams.report_title} onInput={e => setWeeklyParams({ ...weeklyParams, report_title: e.target.value })}/>
        </Form.Item>
        <Form.Item label="编号">
          <Input value={weeklyParams.code} onInput={e => setWeeklyParams({ ...weeklyParams, code: e.target.value })}/>
        </Form.Item>
        <Form.Item label="报告类型">
          <Input value={weeklyParams.project_type} onInput={e => setWeeklyParams({ ...weeklyParams, project_type: e.target.value })}/>
        </Form.Item>

        <Form.Item
          label={""}
          wrapperCol={{ offset: 2, span: 18 }}
        >
          <Input value={weeklyParams.aTitle} onInput={(e) => setWeeklyParams({ ...weeklyParams, aTitle: e.target.value })} variant={"borderless"} className={"weekly-item-title"} style={{borderBottom: "solid 1px red"}} />
        </Form.Item>

        <Form.Item
          label={""}
          wrapperCol={{ offset: 2, span: 18 }}
        >
          <ADetails ref={quotationDetailsRef} />
        </Form.Item>

        <Form.Item
          label={""}
          wrapperCol={{ offset: 2, span: 18 }}
        >
          <Input value={weeklyParams.bTitle} onInput={(e) => setWeeklyParams({ ...weeklyParams, bTitle: e.target.value })} variant={"borderless"} className={"weekly-item-title"} style={{borderBottom: "solid 1px red"}} />
        </Form.Item>

        <Form.Item
          label={""}
          wrapperCol={{ offset: 2, span: 18 }}
        >
          <div style={{border: 'solid 1px rgba(0, 0, 0, 0.2)', borderRadius: '5px', padding: '10px',}}>
            <UploadFiles value={weeklyParams.bDetails.picture_ids} onChange={(value) => changeBDetailPictures(value)} fileLength={20} allowedTypes={['*']} showDownloadIcon={false} />
          </div>
        </Form.Item>

        <Form.Item
          label={""}
          wrapperCol={{ offset: 2, span: 18 }}
        >
          <Input value={weeklyParams.cTitle} onInput={(e) => setWeeklyParams({ ...weeklyParams, cTitle: e.target.value })} variant={"borderless"} className={"weekly-item-title"} style={{borderBottom: "solid 1px red"}} />
        </Form.Item>

        <Form.Item
          label={""}
          wrapperCol={{ offset: 2, span: 18 }}
          >
          <DynamicFormTable ref={dynamicFormTable} />
        </Form.Item>

        <Form.Item
          label={""}
          wrapperCol={{ offset: 2, span: 18 }}
        >
          <Input value={weeklyParams.dTitle} onInput={(e) => setWeeklyParams({ ...weeklyParams, dTitle: e.target.value })} variant={"borderless"} className={"weekly-item-title"} style={{borderBottom: "solid 1px red"}} />
        </Form.Item>

        <Form.Item
          label={""}
          wrapperCol={{ offset: 2, span: 18 }}
        >
          <PhotoDetailForm ref={photoDetailForm}/>
        </Form.Item>

        <Form.Item
          label={""}
          wrapperCol={{ offset: 2, span: 18 }}
        >
          <Input value={weeklyParams.eTitle} onInput={(e) => setWeeklyParams({ ...weeklyParams, eTitle: e.target.value })} variant={"borderless"} className={"weekly-item-title"} style={{borderBottom: "solid 1px red"}} />
        </Form.Item>

        <Form.Item
          label={""}
          wrapperCol={{ offset: 2, span: 18 }}
        >
          <DynamicProgressList ref={dynamicProgressList} />
        </Form.Item>

        <Form.Item
          label={""}
          wrapperCol={{ offset: 2, span: 18 }}
        >
          <Input value={weeklyParams.fTitle} onInput={(e) => setWeeklyParams({ ...weeklyParams, fTitle: e.target.value })} variant={"borderless"} className={"weekly-item-title"} style={{borderBottom: "solid 1px red"}} />
        </Form.Item>

        <Form.Item
          label={""}
          wrapperCol={{ offset: 2, span: 18 }}
        >
          <VoListForm ref={voListFormRef} />
        </Form.Item>

        <Form.Item
          wrapperCol={{ offset: 2, span: 18 }}
        >
          <Space>
            <Button type="primary" onClick={() => handleSubmit('save')}>保存</Button>
            <Button type="primary" onClick={() => handleSubmit('preview')}>预览</Button>
            <Button type="default" onClick={back}>返回</Button>
          </Space>
        </Form.Item>
      </Form>
    </>
  )
}

export default WeeklyDetail;
