import React, { useEffect, useReducer, useState } from 'react'
import { Form, Input, Button, Space, Select, Radio, DatePicker, Table, Modal, message, Drawer } from "antd"
import {
  getCompanyList,
  getBrandContactsList,
  getClassTypeList,
  getQuoHistoryPrice,
  getReimHistoryPrice,
  getQuoPartsPrice,
  createOrUpdateQuo,
  generalBrandList,
  translateCnToEn,
  getWaterLeakageRecordByQuoId
} from "@/services/ant-design-pro/quotation";
import type { RadioChangeEvent, SelectProps } from 'antd';
import { PlusOutlined, DeleteFilled, BarsOutlined } from '@ant-design/icons';
import SearchDetail from './Search';
import dayjs from 'dayjs';
import * as math from 'mathjs';
import type { DragEndEvent } from '@dnd-kit/core';
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { UploadFile, UploadFileStatus } from "antd/es/upload/interface";
import UploadFiles from "@/components/UploadFiles";
import CreateOrUpdate from "@/pages/Order/WaterLeakageRecords/components/CreateOrUpdate";
import Transfer from "@/pages/Order/Quotation/components/Transfer";
import { isEmpty } from "lodash";
import { SearchType } from "@/pages/Order/WaterLeakageRecords";
import { getBrandList, getCityList, getWorkerList } from "@/services/ant-design-pro/report";

interface ItemListProps {
  quo: any
  costPrice: any
  onCloseDetail: () => void
  currentItem
  success: (text: string) => void
  error: (text: string) => void
  actionRef: any
  unit: any
}

const { Search } = Input;

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  'data-row-key': string;
}

const Row = (props: RowProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: props['data-row-key'],
  });

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
    transition,
    cursor: 'move',
    ...(isDragging ? { position: 'relative', zIndex: 9999 } : {}),
  };

  return <tr {...props} ref={setNodeRef} style={style} {...attributes} {...listeners} />;
};

// 初始状态
const initialSearchForm = {
  brands: [],
  cities: [],
  shops: [],
  workers: [],
  quo: []
};

// reducer 函数
function searchFormReducer(state, action) {
  const { field, data } = action.payload;
  if (isEmpty(field)) {
    return state;
  }

  switch (action.type) {
    case SearchType.LoadData:
      return { ...state, [field]: [...Array.from(data)] };
    case SearchType.DeleteData:
      return { ...state, [field]: [] };
    default:
      return state;
  }
}

const Quo: React.FC<ItemListProps> = ({
  quo,
  costPrice,
  onCloseDetail,
  currentItem,
  success,
  error,
  actionRef,
                                        unit
}) => {
  const [form] = Form.useForm()
  const [companyList, setCompanyList] = useState([])
  const [company, setCompany] = useState()
  const [contactsList, setContactsList] = useState([])
  const [classTypeList, setClassTypeList] = useState()
  const [classType, setClassType] = useState()
  const [quoDetailList, setQuoDetailList]: any = useState([])
  const [num, setNum] = useState(0)
  const [price, setPrice] = useState(0)
  const [showSearch, setShowSearch] = useState(false)
  const [loading, setLoading] = useState(false)
  const [quohistoryPrice, setQuohistoryPrice] = useState()
  const [reimhistoryPrice, setReimhistoryPrice] = useState()
  const [quoPartsPrice, setQuoPartsPrice] = useState()
  const [otherServiceRate, setOtherServiceRate] = useState(0)
  const [administrativeCostTitle, setAdministrativeCostTitle] = useState('Administrative Cost')
  const [brandProfitAndRate, setBrandProfitAndRate] = useState({ id: 0, brand: '', brand_en: '', rate: 0, profit: 0 })
  const [administrativeCost, setAdministrativeCost] = useState(0)
  const [cost, setCost] = useState(0.00)
  const [quoFileIds, setQuoFileIds] = useState('')
  const [showCreateOrUpdateWaterLeakage, setShowCreateOrUpdateWaterLeakage] = useState(false)
  const [title, setTitle] = useState('创建漏水记录')
  const [currentQuoItem, setCurrentQuoItem] = useState({})
  const [showTransfer, setShowTransfer] = useState(false)
  const [quoId, setQuoId] = useState(0)
  const [searchDataState, dispatchSearchData] = useReducer(searchFormReducer, initialSearchForm)
  const [quoFileList, setQuoFileList] = useState<UploadFile[]>([{
    uid: '497718',
    name: "MQTT 连接参数.docx",
    url: 'https://zhian-erp-files.oss-cn-shanghai.aliyuncs.com/images/599d8b7d478a9de3.docx',
  }])

  const handleFinish = (values) => {
    console.log('valuesvaluesvalues', values)
    if (values.completion_at) {
      values.completion_at = dayjs(values.completion_at.$d).format('YYYY-MM')
    }
    const params = {
      ...currentItem,
      ...values,
      completion_at: values.completion_at.length > 0 ? dayjs(values.completion_at).format('YYYY-MM') + '-01' : '',
      quotation_detail_list: quoDetailList ?? [],
      quo_file_ids: quoFileIds
    }
    createOrUpdateQuo(params).then(res => {
      if (!res.success) {
        error(res.message)
        return
      }
      onCloseDetail()
      actionRef.current.reload()
      success('处理成功')
    })
  }

  const optionsCompany: SelectProps['options'] = companyList.map((item: any) => {
    return {
      value: item.id,
      label: item.company_en === '' ? item.company_cn : item.company_en,
    };
  });

  const optionsContacts: SelectProps['options'] = contactsList.map((item: any) => {
    return {
      value: item.id,
      label: item.contact_user,
    };
  });

  // 处理单位
  const optionsMaps: SelectProps['options'] = unit.map((item: any) => {
    return {
      value: item.value,
      label: item.value,
    };
  });

  const handleChangeClassType = (e) => {
    console.log(e.target.value);
    setClassType(e.target.value)
  }

  // 添加新项
  const handleAddReim = () => {
    const newReim = {
      key: parseInt((Math.random() * 1000).toString()),
      id: parseInt((Math.random() * 1000).toString()),
      detail_cn: '',
      num: '',
      price: '',
      total_price: '',
      unit: "项",
      title: '',
      remark: '',
      description: '',
    }

    setQuoDetailList([...quoDetailList, newReim])
  }

  // 删除一项
  const handleDeleteRiem = (id) => {
    const newReim = quoDetailList?.filter(item => item.id !== id)
    setQuoDetailList(newReim)
  }

  const handleInput = async (e, dom) => {
    let updatedQuoDetailList = quoDetailList.map(item => ({ ...item }))

    for (const item of updatedQuoDetailList) {
      if (item.id === dom.id) {
        item.detail_cn = e.target.value
        try {
          const detailResponse = await translateCnToEn({ content: e.target.value })
          if (detailResponse.data && detailResponse.data.en) {
            item.detail_en = detailResponse.data.en
          }
        } catch (error) {
          console.error('Error translating content:', error)
          // Handle error (e.g., set detail_en to a default value or leave as is)
        }
      }
    }

    setQuoDetailList(updatedQuoDetailList)
  }

  const handleInputEn = (e, dom) => {
    quoDetailList?.map(item => {
      if (item.id === dom.id) {
        item.detail_en = e.target.value
        return item
      }
      return item
    })
    form.setFieldsValue({
      reim_detail_list: quoDetailList ?? []
    })
  }

  // 处理利润
  const updateProfit = () => {
    let profitPrice = 0.00
    let preferentialPrice = Number(form.getFieldValue('preferential_price'))
    profitPrice = math.chain(preferentialPrice).subtract(costPrice).round(2).done()
    form.setFieldsValue({
      profit_price: profitPrice,
      profit_rate: math.chain(profitPrice).divide(preferentialPrice).multiply(100).round(2).done()
    })
  }

  // 处理价格
  const handlePrice = () => {
    let price = 0.00
    quoDetailList.map((item) => {
      const perPrice = math.chain(item.num).multiply(item.price).round(2).done()
      price = math.chain(price).add(perPrice).round(2).done()
    })

    let adminCost = math.chain(price)
      .multiply(Number(form.getFieldValue('service_rate')))
      .divide(100)
      .round(2).done()

    let discount = !isNaN(Number(form.getFieldValue('less_discount'))) ? Number(form.getFieldValue('less_discount')) : 0
    let preferentialPrice = math.chain(price).add(adminCost).subtract(discount).round(2).done()
    let taxPrice = math.chain(preferentialPrice).multiply(Number(form.getFieldValue('tax_rate'))).divide(100).round(2).done()
    let totalAmount = math.chain(preferentialPrice).add(taxPrice).round(2).done()
    form.setFieldsValue({
      sub_total: price,
      administrative_cost: adminCost,
      preferential_price: preferentialPrice,
      tax: taxPrice,
      total_amount: totalAmount,
    })
    updateProfit()
  }

  // 数量输入
  const handleInputNum = (e, dom) => {
    quoDetailList?.map(item => {
      if (item.id === dom.id) {
        setNum(e.target.value)
        item.num = e.target.value
        item.total_price = Number(item.num) * Number(item.price)
        return item
      }
    })
    handlePrice()
    form.setFieldsValue({
      reim_detail_list: quoDetailList ?? []
    })
  }

  const handleInputPrice = (e, dom) => {
    let price = 0.00
    quoDetailList?.map(item => {
      if (item.id === dom.id) {
        setPrice(e.target.value)
        item.price = e.target.value
        item.total_price = Number(item.num) * Number(item.price)
        const perPrice = math.chain(item.num).multiply(item.price).round(2).done()
        price = math.chain(price).add(perPrice).round(2).done()
        return item
      }
    })
    handlePrice()
    form.setFieldsValue({
      subTotal: price,
      reim_detail_list: quoDetailList ?? []
    })
  }

  // 修改单位
  const handleChangeUnit = (e, entity) => {
    quoDetailList?.map(item => {
      if (item.id === entity.id) {
        item.unit = e
      }
      return item
    })
  }


  const toSearch = (entity, type) => {
    if (type === 'jd') {
      // https://search.jd.com/Search?keyword=%E9%97%BD%E8%A5%BF123313131&enc=utf-8
      window.open(`https://search.jd.com/Search?keyword=${entity.detail_cn}&enc=utf-8`)
      return
    }
    window.open(`https://s.taobao.com/search?q=${entity.detail_cn}`)
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1,
      },
    }),
  );

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      setQuoDetailList((prev) => {
        const activeIndex = prev.findIndex((i) => i.id === active.id);
        const overIndex = prev.findIndex((i) => i.id === over?.id);
        return arrayMove(prev, activeIndex, overIndex);
      });
    }
  }

  const columns: any = [
    {
      title: '排序',
      dataIndex: 'sort',
      width: 60,
      className: 'drag-visible',
      render: (dom) => {
        return (
          <>
            <BarsOutlined />
          </>
        )
      }
    },
    {
      title: '搜索',
      dataIndex: 'search',
      align: 'center',
      render: (dom, entity) => {
        return (
          <>
            <a onClick={() => toSearch(entity, 'jd')} target='_blank' style={{ marginRight: 10 }}>京东</a>
            <a onClick={() => toSearch(entity, 'taobao')} target='_blank'>淘宝</a>
          </>
        )
      },
    },
    {
      title: '明细',
      dataIndex: 'detail_cn',
      align: 'center',
      render: (dom, entity) => {
        return (
          <Input.TextArea rows={1} style={{ width: 150 }} defaultValue={dom} onInput={(e) => handleInput(e, entity)} />
        )
      },
    },
    {
      title: 'detail',
      dataIndex: 'detail_en',
      align: 'center',
      render: (dom, entity) => {
        return (
          <>
            <Input.TextArea rows={1} style={{ width: 150 }} value={dom} onInput={(e) => handleInputEn(e, entity)} />
          </>
        )
      },
    },
    {
      title: '数量',
      dataIndex: 'num',
      align: 'center',
      render: (dom, entity) => {
        return (
          <Input style={{ width: 140 }} defaultValue={dom} onInput={(e) => handleInputNum(e, entity)} addonAfter={
            <Select style={{ width: 60 }} defaultValue={entity.unit} options={optionsMaps} onChange={(e) => handleChangeUnit(e, entity)} />
          } />
        )
      }
    },
    {
      title: '单价',
      dataIndex: 'price',
      align: 'center',
      render: (dom, entity) => {
        return (
          <Input style={{ width: 120 }} defaultValue={dom} onInput={(e) => { handleInputPrice(e, entity) }} />
        )
      }
    },
    {
      title: '小计',
      dataIndex: 'total_price',
      align: 'center',
      render: (dom) => {
        return (
          <Input style={{ width: 120 }} disabled value={dom} />
        )
      }
    },
    {
      title: '标题',
      align: 'center',
      dataIndex: 'title',
      render: (dom) => {
        return (
          <Input.TextArea rows={1} style={{ width: 120 }} value={dom} />
        )
      }
    },
    {
      title: '工作描述',
      dataIndex: 'description',
      align: 'center',
      render: (dom, entity) => {
        return (
          <Input.TextArea rows={1} defaultValue={dom} />
        )
      }
    },
    {
      title: '备注',
      dataIndex: 'remark',
      align: 'center',
      render: (dom, entity) => {
        return (
          <Input.TextArea rows={1} defaultValue={dom} />
        )
      }
    },
    {
      title: '操作',
      dataIndex: 'operate',
      align: 'center',
      render: (dom, entity) => {
        return (
          <DeleteFilled style={{ cursor: 'pointer' }} onClick={() => handleDeleteRiem(entity.id)} />
        )
      }
    }
  ]

  const fetchSearchInitData = async () => {
    const brandResponse = await getBrandList();
    if (brandResponse.success) {
      dispatchSearchData({
        type: SearchType.LoadData,
        payload: {
          field: 'brands',
          data: brandResponse.data.map(item => {
            return {
              value: item.id,
              label: item.brand_en
            }
          })
        }
      });
    }

    const cityResponse = await getCityList();
    if (cityResponse.success) {
      dispatchSearchData({
        type: SearchType.LoadData,
        payload: {
          field: 'cities',
          data: cityResponse.data.map(item => {
            return {
              value: item.id,
              label: item.city_cn
            }
          })
        }
      });
    }

    const workerResponse = await getWorkerList({ type: 'all' });
    if (workerResponse.success) {
      dispatchSearchData({
        type: SearchType.LoadData,
        payload: {
          field: 'workers',
          data: workerResponse.data.map(item => {
            return {
              value: item.worker_id,
              label: item.worker
            }
          })
        }
      });
    }
  }

  const changeAdministrativeCost = ({ target: { value } }: RadioChangeEvent) => {
    handlePrice()
  }

  const handleCloseCreateOrUpdate = () => {
    setShowCreateOrUpdateWaterLeakage(false)
    setCurrentQuoItem({})
  }

  const handleLessDiscount = (e) => {
    form.setFieldsValue({ less_discount: e.target.value })
    handlePrice()
  }

  // 修改税率
  const changeTaxRate = ({ target: { value } }: RadioChangeEvent) => {
    handlePrice()
  }

  const onSearch = async (e) => {
    setLoading(true)
    const quoHistoryPriceResponse = await getQuoHistoryPrice({ detail_cn: e, brand_id: quo.brand_id, search_type: 'new' })
    const reimHistoryPriceResponse = await getReimHistoryPrice({ detail_cn: e, brand_id: quo.brand_id, search_type: 'new' })
    const quoPartsPriceResponse = await getQuoPartsPrice({ parts_name: e, brand_id: quo.brand_id })
    if (quoHistoryPriceResponse.success && reimHistoryPriceResponse.success && quoPartsPriceResponse.success) {
      setQuohistoryPrice(quoHistoryPriceResponse.data)
      setReimhistoryPrice(reimHistoryPriceResponse.data)
      setQuoPartsPrice(quoPartsPriceResponse.data)
      setLoading(false)
      setShowSearch(true)
    }
  }

  const handleUpload = (files) => {
    setQuoFileIds(files)
  }

  const handleCloseCreateOrUpdateWaterLeakage = () => {
    setShowCreateOrUpdateWaterLeakage(false)
  }

  const handleSearchSelectedChild = (type: string, field: string, data: []) => {
    dispatchSearchData({
      type,
      payload: {
        field,
        data
      }
    });
  }

  const handleTransfer = () => {
    setQuoId(quo.id)
    setShowTransfer(true)
  }

  const addWaterLeakage = async () => {
    const fetchData = async () => {
      await fetchSearchInitData();
    };

    fetchData();

    const result = await getWaterLeakageRecordByQuoId(quo.id)

    if (result.data) {
      setTitle('修改漏水记录')
      setCurrentQuoItem({
        id: result.data.id,
        quo_id: quo.id,
        brand_id: quo.brand_id,
        city_id: quo.city_id,
        store_id: quo.shop_id,
        quo_no: quo.quo_no,
        estimated_repair_time: quo.estimated_repair_time,
        report_content: result.data.report_content ?? '',
        report_at: result.data.report_at ?? '',
        solution: result.data.solution ?? '',
        statue: result.data.statue ?? '',
        analysis: result.data.analysis ?? '',
        worker_uid: result.data.worker_uid ?? '',
        cause: result.data.cause ?? '',
        area: result.data.area ?? ''
      })
    } else {
      setTitle('创建漏水记录')
      setCurrentQuoItem({
        quo_id: quo.id,
        brand_id: quo.brand_id,
        city_id: quo.city_id,
        store_id: quo.shop_id,
        quo_no: quo.quo_no
      })
    }

    setShowCreateOrUpdateWaterLeakage(true)
  }

  useEffect(() => {
    const getData = async () => {
      const companyResponse = await getCompanyList()
      setCompany(companyResponse.data.find((item: any) => item.id === quo?.company_id)?.company_en)
      setCompanyList(companyResponse.data)
      const contactsResponse = await getBrandContactsList({ brand_id: quo.brand_id })
      setContactsList(contactsResponse.data)
      const brandsList = await generalBrandList()
      brandsList.data.map(item => {
        if (item.id === quo.brand_id) {
          setBrandProfitAndRate(item)
        }
        return item
      })
    }
    if (quo && quo.brand_id === 4) {
      setAdministrativeCostTitle('Material Administrative Cost')
    }
    if (quo) {
      console.log('quoqoqququqqq', quo.quo_file_ids);
      getData()
      if (quo.quo_file_list) {
        //setQuoFileList(quo.quo_file_list)
      }
      setAdministrativeCost(quo.service_price)
      setQuoDetailList(quo.quo_detail_list)
      setClassType(quo.class_type)
      if (quo.class_type) {
        getClassTypeList({ brand_id: quo.brand_id, class_type: quo.class_type }).then(res => {
          setClassTypeList(res.data.map((item, index) => ({ value: index, label: item })))
        })
      }
      console.log('iieieieieie', quo, brandProfitAndRate)
      if (parseInt(String(brandProfitAndRate.rate)) !== parseInt(quo.service_rate)) {
        setOtherServiceRate(parseInt(quo.service_rate))
      }
      setQuoFileIds(quo.quo_file_ids)
      let preferential_price = math.chain(quo.pre_total_price).add(quo.service_price).subtract(quo.reduction_price).round(2).done();

      form.setFieldsValue({
        quo_no: quo.quo_no ?? '',
        city: quo.city_cn ?? '',
        market: quo.market_cn ?? '',
        brand: quo.brand_en ?? '',
        store: quo.store_cn ?? '',
        contacts: quo.title_info.attn ?? '',
        company: company ?? '',
        // subTotal:
        tax_rate: quo.tax_rate ? parseInt(quo.tax_rate) : '',
        tax: quo.quo_tax_price ?? '',
        total_amount: quo.total_price ?? '',
        profit_price: quo.profit_price ?? '',
        profit_rate: quo.profit_rate ?? '',
        class_type: quo.class_type ?? '',
        class_type_plus: quo.class_type_plus ?? '',
        sub_total: quo.pre_total_price ?? '',
        reim_detail_list: quoDetailList ?? [],
        completion_at: quo.completion_at ? dayjs(quo.completion_at, 'YYYY-MM') : '',
        work_desc: quo.work_desc ?? '',
        description: quo.work_desc ?? '',
        remark: quo.remark ?? '',
        shop_contact_id: quo?.shop_contact_id ? quo?.shop_contact_id : undefined,
        service_rate: quo.service_rate ? parseInt(quo.service_rate) : '',
        administrative_cost: quo.service_price ? parseFloat(quo.service_price).toFixed(2) : '',
        less_discount: quo.reduction_price ? parseFloat(quo.reduction_price).toFixed(2) : '',
        preferential_price: preferential_price,
        quo_file_ids: quo.quo_file_ids ?? '',
        last_completed_at: quo.last_completed_at ? dayjs(quo.last_completed_at, 'YYYY-MM-DD') : '',
      })
    }
  }, [quo, company])

  // @ts-ignore
  return (
    <>
      <Form
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: '100%' }}
        onFinish={handleFinish}
      >
        <Form.Item label="报价单编号" name="quo_no">
          <Input readOnly />
        </Form.Item>

        <Form.Item label="城市" name="city">
          <Input readOnly />
        </Form.Item>

        <Form.Item label="商场" name="market">
          <Input readOnly />
        </Form.Item>

        <Form.Item label="品牌" name="brand">
          <Input readOnly />
        </Form.Item>

        <Form.Item label="店铺" name="store">
          <Input readOnly />
        </Form.Item>

        <Form.Item label="联系人" name="shop_contact_id">
          <Select options={optionsContacts} allowClear/>
        </Form.Item>

        <Form.Item label="公司" name="company">
          <Select options={optionsCompany} allowClear/>
        </Form.Item>

        <Form.Item label="工作描述" name="work_desc">
          <Input.TextArea />
        </Form.Item>

        <Form.Item label="明细" name="reim_detail_list">
          <>
            <Search placeholder="请输入搜索内容" loading={loading} enterButton onSearch={onSearch} />
            <DndContext sensors={sensors} modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
              <SortableContext
                // rowKey array
                items={quoDetailList.map((i: any) => i.id)}
                strategy={verticalListSortingStrategy}
              >
                <Table
                  components={{
                    body: {
                      row: Row,
                    },
                  }}
                  rowKey="id"
                  columns={columns}
                  scroll={{ x: 'max-content' }}
                  dataSource={quoDetailList}
                  pagination={false}
                />
              </SortableContext>
            </DndContext>
            <Button type="primary" onClick={handleAddReim}>
              <PlusOutlined />
              添加新项
            </Button>
          </>
        </Form.Item>

        <Form.Item label="Sub Total" name="sub_total">
          <Input disabled />
        </Form.Item>

        <Form.Item label=" " name="service_rate" colon={false}>
          <Radio.Group onChange={changeAdministrativeCost}>
            <Radio value={0}>默认</Radio>
            <Radio value={brandProfitAndRate.rate}>{brandProfitAndRate.rate}% {administrativeCostTitle}</Radio>
            {otherServiceRate > 0 && <Radio value={otherServiceRate}>{otherServiceRate}% {administrativeCostTitle}</Radio>}
          </Radio.Group>
        </Form.Item>

        {administrativeCost > 0 &&
          <Form.Item label="Administrative Cost" name="administrative_cost">
            <Input disabled />
          </Form.Item>
        }

        <Form.Item label="Less Discount" name="less_discount">
          <Input onInput={handleLessDiscount} />
        </Form.Item>

        <Form.Item label="Preferential Price" name="preferential_price">
          <Input disabled />
        </Form.Item>

        <Form.Item label="税率" name="tax_rate">
          <Radio.Group onChange={changeTaxRate}>
            <Radio value={9}>9% VAT</Radio>
            <Radio value={6}>6% VAT</Radio>
            <Radio value={0}>无</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="taxes" name="tax">
          <Input disabled />
        </Form.Item>

        <Form.Item label="TOTAL AMOUNT" name="total_amount">
          <Input disabled />
        </Form.Item>

        <Form.Item label="利润" name="profit_price">
          <Input disabled />
        </Form.Item>

        <Form.Item label="利润率" name="profit_rate">
          <Input disabled />
        </Form.Item>

        <Form.Item label="是否月结" name="class_type">
          <Radio.Group buttonStyle="solid" onChange={handleChangeClassType}>
            <Radio.Button value='monthly'>月结</Radio.Button>
            <Radio.Button value='not_monthly'>单结</Radio.Button>
            <Radio.Button value='fix'>固定</Radio.Button>
            <Radio.Button value='other'>other</Radio.Button>
            <Radio.Button value='mqi'>成本入MQI</Radio.Button>
          </Radio.Group>
        </Form.Item>

        {
          classType === 'monthly' &&
          <Form.Item label="分类" name="class_type_plus">
            <Select mode="tags" maxCount={1} options={classTypeList} />
          </Form.Item>
        }

        <Form.Item label="申报日期" name="completion_at">
          <DatePicker picker="month" />
        </Form.Item>

        <Form.Item label="完工时间(PDF)" name="last_completed_at">
          <DatePicker />
        </Form.Item>

        {
          quo && typeof quo.ma_cate_cn !== 'undefined' && ['活动', '改造'].includes(quo.ma_cate_cn) &&
          <Form.Item label="附件" name="quo_file_ids">
            <UploadFiles value={quoFileIds} fileLength={8} onChange={handleUpload} />
          </Form.Item>
        }

        <Form.Item label="备注" name="remark">
          <Input.TextArea />
        </Form.Item>

        <Form.Item>
          <Space style={{ marginTop: 20 }}>
            <Button type="primary" htmlType="submit">保存</Button>
            <Button type="primary" onClick={() => {
              window.open(`/PDF/quotation?quo_id=${quo.id}`, '_blank'
              )
            }}>预览</Button>
            <Button onClick={onCloseDetail}>返回</Button>
            {
              currentItem?.status_color === 'gray' &&
              <Button type="primary">提交给客户端</Button>
            }
            {/* <Button type="primary">颜色标记</Button> */}
            {
              quo &&
              <Button type="primary" onClick={() => handleTransfer()}>转单</Button>
            }
            <Button type="primary" onClick={() => addWaterLeakage()}>添加漏水记录</Button>
          </Space>
        </Form.Item>


      </Form>

      <Modal
        width={800}
        open={showSearch}
        maskClosable={false}
        onCancel={() => setShowSearch(false)}
        footer={null}
        destroyOnClose={true}
        title="历史报价"
      >
        <SearchDetail
          quohistoryPrice={quohistoryPrice}
          reimhistoryPrice={reimhistoryPrice}
          quoPartsPrice={quoPartsPrice}
        />
      </Modal>

      <Drawer
        open={showCreateOrUpdateWaterLeakage}
        width={800}
        destroyOnClose={true}
        title={title}
        onClose={handleCloseCreateOrUpdateWaterLeakage}
      >
        <CreateOrUpdate
          actionRef={actionRef}
          success={success}
          error={error}
          currentItem={currentQuoItem}
          searchDataState={searchDataState}
          handleCloseCreateOrUpdate={handleCloseCreateOrUpdate}
          handleSearchSelectedChild={handleSearchSelectedChild}
        />
      </Drawer>

      <Modal
        width={400}
        open={showTransfer}
        maskClosable={false}
        onCancel={() => setShowTransfer(false)}
        footer={null}
        destroyOnClose={true}
        title="报价单转移"
      >
        <Transfer
          fromQuoId={quoId}
          hideTransfer={() => setShowTransfer(false)}
        />
      </Modal>

    </>
  )
}

export default Quo
