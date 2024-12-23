import {Button, Form, Input, Radio, Select, Space} from "antd";
import {useEffect, useState} from "react";
import UploadFiles from "@/components/UploadFiles";
import {StringDatePicker} from "@/components/StringDatePickers";
import SubmitButton from "@/components/Buttons/SubmitButton";
import {getBrandList, getCityList, getMarketList, getShopList} from "@/services/ant-design-pro/report";
import {produce} from "immer";
import {getAllWorkerList, createOrUPdateComplaint} from "@/services/ant-design-pro/system";

interface CreateComplaintParams {
  openComplaint: boolean
  actionRef: any
  success: (text: string) => void
  error: (text: string) => void
  handleCloseComplaint: () => void
}

type BaseDataType = {
  radioType: string
  brandList: {}[]
  cityList: {}[]
  marketList: {}[]
  storeList: {}[]
  workerList: {}[]
}

const CreateComplaint = ({
                           openComplaint,
                           actionRef,
                           success,
                           error,
                           handleCloseComplaint
                         }) => {

  const [form] = Form.useForm()
  // 初始化数据
  const [baseData, setBaseData] = useState<BaseDataType>({
    radioType: "投诉",
    brandList: [],
    cityList: [],
    marketList: [],
    storeList: [],
    workerList: []
  })

  const handleFinish = (values) => {
    const params = {
      type: baseData?.radioType ?? '',
      brand_id: values?.brand ?? '',
      city_id: values?.city ?? '',
      market_id: values?.market ?? '',
      store_id: values?.store ?? '',
      repairmen_id: values?.repairmen ?? '',
      file_ids: values?.file_ids ?? '',
      content: values?.content ?? '',
      complaint_at: values?.complaint_at ?? '',
    }
    createOrUPdateComplaint(params).then(res => {
      if (res.success) {
        handleCloseComplaint()
        actionRef?.current?.reload()
        success('创建成功')
        return
      }
      error(res.message)
    })
  }

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
    getAllWorkerList().then(res => {
      if (res.success) {
        setBaseData(
          produce((draft) => {
            draft.workerList = res.data.map(item => {
              return {
                value: item.worker_id,
                label: item.worker,
              }
            })
          })
        );
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
  }

  const handleChangRadio = (e) => {
    setBaseData(produce(draft => {
      draft.radioType = e.target.value
    }))
  }

  useEffect(() => {
    if (openComplaint) {
      initData()
    }
  }, [openComplaint]);

  return (
    <Form
      form={form}
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 15 }}
      style={{ maxWidth: '100%' }}
      onFinish={handleFinish}
      onValuesChange={handleValueChange}
    >
      <Form.Item label="问题类型" name="type">
        <Radio.Group defaultValue={"投诉"} onChange={handleChangRadio}>
          <Radio value="投诉">投诉</Radio>
          <Radio value="反馈">反馈</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item label="品牌" name="brand">
        <Select
          placeholder="请选择"
          options={baseData.brandList}
          allowClear={true}
        />
      </Form.Item>

      <Form.Item label="城市" name="city">
        <Select
          placeholder="请选择"
          options={baseData.cityList}
          allowClear={true}
        />
      </Form.Item>

      <Form.Item label="商场" name="market">
        <Select
          placeholder="请选择"
          options={baseData.marketList}
          allowClear={true}
        />
      </Form.Item>

      <Form.Item label="店铺" name="store">
        <Select
          placeholder="请选择"
          options={baseData.storeList}
          allowClear={true}
        />
      </Form.Item>

      <Form.Item label="施工负责人" name="repairmen">
        <Select
          placeholder="请选择"
          allowClear={true}
          options={baseData.workerList}
        />
      </Form.Item>

      <Form.Item label="上传图片" name="file_ids">
        <UploadFiles />
      </Form.Item>

      <Form.Item label="备注" name="content">
        <Input.TextArea placeholder="请输入" autoSize allowClear/>
      </Form.Item>

      <Form.Item label="反馈日期" name="complaint_at">
        <StringDatePicker />
      </Form.Item>

      <Form.Item label=" " colon={false}>
        <Space>
          <SubmitButton type="primary" form={form}>保存</SubmitButton>
          <Button danger>取消</Button>
        </Space>
      </Form.Item>
    </Form>
  )
}

export default CreateComplaint
