import DeleteButton from '@/components/Buttons/DeleteButton';
import SubmitButton from '@/components/Buttons/SubmitButton';
import { StringDatePicker } from '@/components/StringDatePickers';
import UploadFiles from '@/components/UploadFiles';
import TempFour from '@/pages/Order/Report/components/template/TempFour';
import TempOne from '@/pages/Order/Report/components/template/TempOne';
import TempThirteen from '@/pages/Order/Report/components/template/TempThirteen';
import {
  approveReport,
  getMaCateLv1List,
  getReportInfo,
  getSameAppoSignList,
} from '@/services/ant-design-pro/orderList';
import {
  createOrUpdateReport,
  getAllIdByOrderId,
  getMarketList,
  getShopList,
  getTplList,
} from '@/services/ant-design-pro/report';
import { Button, Checkbox, Form, Input, message, Modal, Select, Space } from 'antd';
import { produce } from 'immer';
import _, {concat, includes, isArray, map} from 'lodash';
import { isNil} from "lodash";
import React, { useEffect, useState } from 'react';
import {arrToStr, strToArr} from "@/utils/utils";

interface OrderDetailProps {
  actionRef: any;
  selectedOrder: any;
  currentItem: any;
  handleCloseOrderDetail: () => void;
}

const OrderDetail: React.FC<OrderDetailProps> = (props) => {
  const { actionRef, selectedOrder, currentItem, handleCloseOrderDetail } = props;
  const [form] = Form.useForm();
  const [showSync, setShowSync] = useState(false);
  const [buttonType, setButtonType] = useState('save');
  const [baseData, setBaseData] = useState<any>({
    marketList: [],
    storeList: [],
    maCateLv1List: [],
    templateList: [],
  });

  const [temp, setTemp] = useState(0);

  const getId = async () => {
    //获取 ma_item_ id appo_task_id supplier order id

    const res = await getAllIdByOrderId(selectedOrder);
    let params;
    if (res.success) {
      params = res.data[0];
    }
    return params;
  };

  // 签单同步
  /*签收单列表*/
  const urlList = form.getFieldValue('sign');
  const [fileUrlEnough, setFileUrlEnough] = useState<{[key: number]: boolean}[]>();
  const [checked , setChecked] = useState('');
  //去重
  console.log('urlList--urlList', urlList);
  const handleSignSync = async (form) => {
    setShowSync(true);
    const Ids = await getId();
    getSameAppoSignList({ appo_task_id: Ids.appo_task_id ?? 0 }).then((res) => {
      if (res.success) {
        console.log('签单同步数据', res.data[0]);
        const SignList = res.data[0].sign_file_list.map((item) => {
          return item;
        });

        const currentSign = strToArr(form.getFieldValue('sign')).map(item => {
          return parseInt(item);
        });

        const signListMap = map(SignList, 'file_id')
        const fullSign = [...new Set([...currentSign, ...signListMap])]
        const formatFullSign = fullSign.map(item => {
          return {
            [item]: includes(currentSign, item)
          }
        });

        setFileUrlEnough(formatFullSign);
        return;
      }
      message.error(res.message);
    });
  };
  // 通过和拒绝
  const handleApproveReport = async (type: string) => {
    try {
      const params = {
        report_id: currentItem?.id ?? 0,
        status: type ?? '',
      };
      const res = await approveReport(params);
      if (!res.success) {
        message.error(res.message);
        return;
      }
      handleCloseOrderDetail();
      message.success('操作成功');
    } catch (error) {
      message.error('操作异常');
    }
  };

  //获取模板
  const getTemplateList = () => {
    getTplList().then((res) => {
      if (res.success) {
        setBaseData(
          produce((draft) => {
            draft.templateList = res.data
              .filter((item) => [1, 4, 13].includes(item.id))
              .map((item) => {
                return {
                  value: item.id,
                  label: item.title,
                };
              });
          }),
        );
      }
    });
  };

  const handleGetReportInfo = async () => {
    let params = await getId();
    console.log('params--params9999', params);
    if (params) {
      const res = await getReportInfo(params);
      if (res.success) {
        console.log('res0', res);
        form.setFieldsValue({
          ...res.data,
          completed_at:
            isNil(res.data.completed_at) || res.data.completed_at === '1970-01-01'
              ? undefined
              : res.data.completed_at,
          sign: res.data?.sign_list
        });
      }
    } else {
      console.error('获取数据异常');
    }
  };

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
    temp4: [
      {
        img_left_file_id: '',
        img_right_file_id: '',
        title: '',
      },
    ],
    temp13: [
      {
        description: '室外幕墙-幕墙背景灯',
        imageIds: '',
        remark: '',
        imageType: 'list',
      },
      {
        description: '室外幕墙-灯箱灯',
        imageIds: '',
        remark: '',
        imageType: 'list',
      },
      {
        description: '室外幕墙-橱窗灯',
        imageIds: '',
        remark: '',
        imageType: 'list',
      },
      {
        description: '室外幕墙-Logo灯',
        imageIds: '',
        remark: '',
        imageType: 'list',
      },
      {
        description: '室内幕墙-幕墙背景灯',
        imageIds: '',
        remark: '',
        imageType: 'list',
      },
      {
        description: '室内幕墙-灯箱灯',
        imageIds: '',
        remark: '',
        imageType: 'list',
      },
      {
        description: '室内幕墙-橱窗灯',
        imageIds: '',
        remark: '',
        imageType: 'list',
      },
      {
        description: '室内幕墙-Logo灯',
        imageIds: '',
        remark: '',
        imageType: 'list',
      },
      {
        description: '店铺内-灯具-天花灯',
        imageIds: '',
        remark: '',
        imageType: 'list',
      },
      {
        description: '店铺内-灯具-墙身柜灯',
        imageIds: '',
        remark: '',
        imageType: 'list',
      },
      {
        description: '店铺内-灯具-层板灯',
        imageIds: '',
        remark: '',
        imageType: 'list',
      },
      {
        description: '店铺内-灯具-海报背景灯',
        imageIds: '',
        remark: '',
        imageType: 'list',
      },
      {
        description: '电视屏-成衣区',
        imageIds: '',
        remark: '',
        imageType: 'list',
      },
      {
        description: '电视屏-珠宝区',
        imageIds: '',
        remark: '',
        imageType: 'list',
      },
      {
        description: '电视屏-楼梯区',
        imageIds: '',
        remark: '',
        imageType: 'list',
      },
      {
        description: '后勤-天花灯',
        imageIds: '',
        remark: '',
        imageType: 'list',
      },
      {
        description: '后勤-电箱用电设施',
        imageIds: '',
        remark: '',
        imageType: 'list',
      },
    ],
  });

  const handleFinish = async (values: any) => {
    console.log('handleFinish：', values, currentItem);
    const Ids = await getId();
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`;
    const day = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`;

    let temp10Detail = {};
    if (temp === 10) {
      let beforeAfterData: any = [];
      let oneData: any = [];
      let twoData: any = [];
      let questions: any = [];
      values.baseOne.map((item) => {
        const format = {
          img_left_file_id: item.before_id ?? '',
          img_right_file_id: item.after_id ?? '',
          title: item.description ?? '',
          type: 'beforeAfterData',
        };
        beforeAfterData.push(format);
      });
      values.baseTwo.map((item) => {
        const format = {
          img_left_file_id: item.before_id ?? '',
          img_right_file_id: item.after_id ?? '',
          title: item.description ?? '',
          type: 'oneData',
        };
        oneData.push(format);
      });
      values.baseThree.map((item) => {
        const format = {
          img_left_file_id: item.before_id ?? '',
          img_right_file_id: item.after_id ?? '',
          title: item.description ?? '',
          type: 'twoData',
        };
        twoData.push(format);
      });
      values.baseRemark.map((item) => {
        const format = {
          answer: item.answer ?? '',
          img_left_file_id: item.before_id ?? '',
          title: item.title ?? '',
          type: 'questions',
        };
        questions.push(format);
      });
      temp10Detail = {
        0: questions,
        1: beforeAfterData,
        2: oneData,
        3: twoData,
      };
    }

    if (temp === 13) {
      temp10Detail = tempData.temp13;
    }
    const params = {
      company_id: values?.company_id ?? '',
      completed_at: values.completed_at ?? '',
      report_title: values.title ?? '',
      report_tid: values.template ?? '',
      detail_list: values.details ? values.details : temp10Detail,
      order_id: selectedOrder ?? '',
      ma_item_id: Ids.ma_item_id ?? '',
      appo_task_id: Ids.appo_task_id ?? '',
      report_id: currentItem.id ? currentItem.id : currentItem.report_id,
      supplier_order_id: Ids.supplier_order_id ? Ids.supplier_order_id : undefined,
    };


    let signIds = '';
    if (values?.sign) {
      signIds = arrToStr(values?.sign)
    }

    params.sign_ids = signIds
    createOrUpdateReport(params).then((res) => {
      if (res.success) {
        if (buttonType === 'save') {
          message.success('操作成功');
          handleCloseOrderDetail();
          actionRef.current.reload();
        } else if (buttonType === 'preview') {
          console.log(currentItem);

          let report_title = '';

          if (currentItem.brand_id === 9) {
            report_title = `${currentItem.brand_en}-${currentItem.abbreviate ?? ''}${
              currentItem.store_cn
            }${values.title}${year}-${month}-${day}`;
          } else {
            report_title = `${currentItem.brand_en}${values.title}${year}-${month}-${day}`;
          }

          // window.open(`https://erp.zhian-design.com/#/report-pdf?report_id=${res.data}&report_tid=${values.template}&report_title=${report_title}`, '_blank')
          window.open(
            `/PDF/ReportPDF?report_id=${res.data}&report_tid=${values.template}&report_title=${report_title}`,
            '_blank',
          );
        }
        return;
      }
      message.error(res.message);
    });
  };

  // 联动数据获取
  const handleValueChange = (cur, all) => {
    const params: {
      brand_id: number | string;
      city_id: number | string;
      market_id: number | string;
    } = {
      brand_id: all.brand,
      city_id: all.city,
      market_id: all.market,
    };
    if (cur.city) {
      form.setFieldsValue({
        market: undefined,
        store: undefined,
      });
      getMarketList({ city_id: cur.city }).then((res) => {
        if (res.success) {
          setBaseData(
            produce((draft) => {
              draft.marketList = res.data.map((item) => {
                return {
                  value: item.id,
                  label: item.market_cn,
                };
              });
            }),
          );
        }
      });
    }
    if (!all.city) {
      form.setFieldsValue({
        market: undefined,
        store: undefined,
      });
      setBaseData(
        produce((draft) => {
          draft.marketList = [];
        }),
      );
    }
    if (Object.keys(cur).find((item) => item === 'brand' || item === 'city' || item === 'market')) {
      form.setFieldsValue({ store: undefined });
      getShopList(params).then((res) => {
        if (res.success) {
          setBaseData(
            produce((draft) => {
              draft.storeList = res.data.map((item) => {
                return {
                  value: item.id,
                  label: item.name_cn,
                };
              });
            }),
          );
        }
      });
    }
    if (cur.maCateLv0) {
      form.setFieldsValue({ maCateLv1: undefined });
      getMaCateLv1List({ p_type: cur.maCateLv0 }).then((res) => {
        if (res.success) {
          setBaseData(
            produce((draft) => {
              draft.maCateLv1List = res.data.map((item) => {
                return {
                  value: item.id,
                  label: item.cn_name,
                };
              });
            }),
          );
        }
      });
    }
    if (!all.maCateLv0) {
      form.setFieldsValue({ maCateLv1: undefined });
      setBaseData(
        produce((draft) => {
          draft.maCateLv1List = [];
        }),
      );
    }
    if (cur.template) {
      setTemp(cur.template);
      if (cur.template === 1) {
        form.setFieldsValue({
          details: tempData.temp1,
        });
      }
      if (cur.template === 4) {
        form.setFieldsValue({
          details: tempData.temp4,
        });
      }
      if (cur.template === 13) {
        form.setFieldsValue({
          list: tempData.temp13,
        });
      }
    }
    if (!all.template) {
      setTemp(0);
    }
  };

  // 拖拽
  const reorder = (list: any[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };
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

  // 前后图片类，前后图片切换
  const handleBeforAfterChange = (index, temp) => {
    let BAImageId = {
      img_left_file_id: '',
      img_right_file_id: '',
      title: '',
    };
    let list = form.getFieldValue('details');

    BAImageId.img_left_file_id = form.getFieldValue('details')[index].img_right_file_id ?? '';
    BAImageId.img_right_file_id = form.getFieldValue('details')[index].img_left_file_id ?? '';
    BAImageId.title = form.getFieldValue('details')[index].title ?? '';

    list[index] = BAImageId;
    setTempData(
      produce((draft) => {
        draft[`temp${temp}`] = list;
      }),
    );
    form.setFieldsValue({
      details: list,
    });
  };

  const handleChangeTempData = (data, index, type, temp) => {
    if (type === 'input') {
      setTempData(
        produce((draft) => {
          if (temp === 13) {
            draft.temp13[index].remark = data;
            form.setFieldsValue({ list: draft.temp13 });
          }
        }),
      );
    }
    if (type === 'upload') {
      setTempData(
        produce((draft) => {
          if (temp === 13) {
            draft.temp13[index].imageList = data;
            form.setFieldsValue({ list: draft.temp13 });
          }
        }),
      );
    }
    if (type === 'add') {
      const newData: any = {
        description: data[index].description,
        imageList: '',
        remark: '',
        imageType: 'list',
      };
      setTempData(
        produce((draft) => {
          draft.temp13.splice(index + 1, 0, newData);
          form.setFieldsValue({ list: draft.temp13 });
        }),
      );
    }
    if (type === 'remove') {
      setTempData(
        produce((draft) => {
          draft.temp13 = draft.temp13.filter((item, idx) => index !== idx);
          form.setFieldsValue({ list: draft.temp13 });
        }),
      );
    }
    if (type === 'radio') {
      setTempData(
        produce((draft) => {
          draft.temp13[index].type = data.target.value;
          form.setFieldsValue({ list: draft.temp13 });
        }),
      );
    }
  };

  const handleCheckBoxChange = (e, value) => {
    const isChecked = e.target.checked;
    setFileUrlEnough(prevState =>
      prevState.map(item => {
        const key = Object.keys(item)[0];
        if (key === value) {
          return { [key]: isChecked };
        }
        return item;
      })
    );

    const currentSignList = strToArr(form.getFieldValue('sign'));
    let newSignList = [];
    if (isChecked) {
      // 如果勾选，添加元素到 currentSignList
      newSignList = [...new Set([...currentSignList, value])];
    } else {
      // 如果取消勾选，从 currentSignList 中删除元素
      newSignList = currentSignList.filter(item => item !== value);
    }

    if (0 === newSignList.length) {
      form.setFieldValue('sign', '')
      return;
    }

    form.setFieldValue('sign', newSignList);
  }

  useEffect(() => {
    console.log("useEffect: ", currentItem)
    getId().then();
    getTemplateList();
    handleGetReportInfo().then();
    form.setFieldValue('sign', checked);
  }, [selectedOrder,checked,form]);
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
        <Form.Item name="brand_cn" label="品牌" rules={[{ required: true }]}>
          <Input readOnly variant="borderless" />
        </Form.Item>

        <Form.Item name="city_cn" label="城市" rules={[{ required: true }]}>
          <Input readOnly variant="borderless" />
        </Form.Item>

        <Form.Item name="market_cn" label="商场" rules={[{ required: true }]}>
          <Input readOnly variant="borderless" />
        </Form.Item>

        <Form.Item name="store_cn" label="店铺" rules={[{ required: true }]}>
          <Input readOnly variant="borderless" />
        </Form.Item>

        <Form.Item name="company_id" >
          <Input hidden />
        </Form.Item>

        <Form.Item name="company_cn" label="公司">
          <Input readOnly variant="borderless" />
        </Form.Item>

        <Form.Item name="ma_type_cn" label="维修类型" rules={[{ required: true }]}>
          <Input readOnly variant="borderless" />
        </Form.Item>

        <Form.Item name="ma_cate_cn" label="维修项目" rules={[{ required: true }]}>
          <Input readOnly variant="borderless" />
        </Form.Item>
        <Form.Item name="completed_at" label="完工日期">
          <StringDatePicker />
        </Form.Item>

        <Form.Item name="title" label="标题" rules={[{ required: true }]}>
          <Input placeholder="0-100个字符" />
        </Form.Item>

        <Form.Item name="sign" label="签收单">
          <UploadFiles />
        </Form.Item>

        <Form.Item name="synchronous" label="签单同步">
          <Button type="primary" onClick={() => handleSignSync(form)}>
            签单同步
          </Button>
        </Form.Item>

        <Form.Item name="template" label="选择模板" rules={[{ required: true }]}>
          <Select options={baseData.templateList} allowClear placeholder="请选择" showSearch />
        </Form.Item>

        {temp !== 0 && (
          <Form.Item label="明细" required>
            {temp === 1 && (
              <TempOne
                onDragEnd={onDragEnd}
                tempData={tempData.temp1}
                handleBeforAfterChange={handleBeforAfterChange}
              />
            )}
            {temp === 4 && (
              <TempFour
                onDragEnd={onDragEnd}
                tempData={tempData.temp4}
                handleBeforAfterChange={handleBeforAfterChange}
              />
            )}
            {temp === 13 && (
              <TempThirteen
                tempData={tempData.temp13}
                handleChangeTempData={handleChangeTempData}
              />
            )}
          </Form.Item>
        )}

        <Form.Item label=" " colon={false}>
          <Space>
            <SubmitButton
              type="primary"
              form={form}
              onClick={() => {
                setButtonType('sava');
              }}
            >
              保存
            </SubmitButton>
            <Button type="primary" htmlType="submit" onClick={() => setButtonType('preview')}>
              预览
            </Button>
            <Button danger onClick={handleCloseOrderDetail}>
              取消
            </Button>
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
            <Button type="primary" className="green-button" onClick={() => {}}>
              分享
            </Button>
          </Space>
        </Form.Item>
      </Form>
      <Modal
        open={showSync}
        width={600}
        destroyOnClose={true}
        onCancel={() => setShowSync(false)}
        onOk={() => setShowSync(false)}
        title="图片列表"
      >
        {/* 多选框选中 */}
        {/*<Form.Item name='sign_url'>*/}
        {/*  <UploadFiles*/}
        {/*    value={merge}*/}
        {/*    onChange={(values) => {*/}
        {/*      setSignNum(values.length);*/}
        {/*      console.log('values--values,values', values);*/}
        {/*    }}*/}
        {/*  />*/}
        {/*</Form.Item>*/}
        {/* 根据signNum 个数渲染CheckBox */}
        {/*{Array(signNum).map((_, i) => (*/}
        {/*  <Checkbox key={i} />*/}
        {/*))}*/}




      {/*  console.log('item--item', item)*/}
      {/*  const handleChange = (e: any, item: any) => {*/}
      {/*  console.log('item--item', item)*/}
      {/*  const { checked: checkboxChecked } = e.target;*/}
      {/*  const idToAddOrRemove = item.id;*/}

      {/*  if (checkboxChecked) {*/}
      {/*  setChecked(prevChecked => {*/}
      {/*  if (prevChecked.includes(idToAddOrRemove)) {*/}
      {/*  return prevChecked;*/}
      {/*} else {*/}
      {/*  return `${prevChecked ? `${prevChecked},` : ''},${idToAddOrRemove}`;*/}
      {/*}*/}
      {/*});*/}
      {/*} else {*/}
      {/*  setChecked(prevChecked => {*/}
      {/*  if (prevChecked.includes(idToAddOrRemove)) {*/}
      {/*  return prevChecked.replace(`,${idToAddOrRemove}`, '').replace(idToAddOrRemove + ',', '');*/}
      {/*} else {*/}
      {/*  return prevChecked;*/}
      {/*}*/}
      {/*});*/}
      {/*}*/}
      {/*}*/}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px'  }}>
          {fileUrlEnough && fileUrlEnough.map(item => {
            const key = Object.keys(item)[0];
            const isChecked = item[key] ?? false;
            return (
              <div key={key} style={{marginBottom: '10px'}}>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                  <Checkbox
                    checked={isChecked}
                    onChange={(ok) => handleCheckBoxChange(ok, key)}
                  />
                </div>
                <UploadFiles value={key} fileLength={1} />
              </div>
              // <div key={key} style={{ marginBottom: '10px' }}>
              //   <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              //     {/*onChange={(e) => handleChange(e, item)}*/}
              //     <Checkbox key={key} value={key} checked={item}/>
              //   </div>
              //   <img style={{ width: 100, height: 100 }} src={item.file_url_enough} alt={''} />
              // </div>
            );
          })}
        </div>
      </Modal>
    </>
  );
};

export default OrderDetail;
