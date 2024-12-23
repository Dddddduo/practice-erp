import BaseContainer, {ModalType} from "@/components/Container"
import {useCorporatePayment} from "@/viewModel/FinancialDepartment/useCorporatePayment"
import {PageContainer, ProColumns, ProTable} from "@ant-design/pro-components"
import {Button, DatePicker, Divider, message, Popconfirm, Space, Typography} from "antd"
import React from "react"
import Payouts from "./components/Payouts"
import dayjs from "dayjs"
import {setStateMap} from "@/utils/utils";
import FileList from './components/FileList'
import SubmitButton from "@/components/Buttons/SubmitButton";
import DeleteButton from "@/components/Buttons/DeleteButton";
import {isEmpty} from "lodash";
import {DeleteOutlined, EyeOutlined} from "@ant-design/icons";
import { deleteInput } from '@/services/ant-design-pro/financialReimbursement';

import { StringRangePicker } from '@/components/StringDatePickers';

const CorporatePayment: React.FC = () => {
  const {
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
  } = useCorporatePayment()
  const {Text} = Typography;
  const sharedOnCell = (data, index?: number) => {
    // console.log(data)
    if (data.rowSpan) {
      return {rowSpan: data.rowSpan};
    }
    return {rowSpan: 0}
  };
  console.log(dayjs().format('YYYY-ww'))

  const columns: ProColumns<API.CorporatePaymentParams>[] = [
    {
      title: '序号',
      dataIndex: "id",
      search: false,
      align: 'center',
      render: (_, row) => {
        const {index} = row;
        return <>{index}</>
      },
      onCell: sharedOnCell
    },
    {
      title: '收款公司',
      dataIndex: "coll_name",
      search: false,
      align: 'center',
      onCell: sharedOnCell
    },
    {
      title: '打款公司',
      dataIndex: "company",
      search: false,
      align: 'center',
      onCell: sharedOnCell,
      render: (dom, entity) => (
        <>{entity?.company?.cn}</>
      )
    },
    {
      title: '收款公司银行',
      dataIndex: "coll_company_name",
      search: false,
      align: 'center',
      onCell: sharedOnCell,
      render: (dom, entity) => (
        <>{entity?.coll_company?.bank_name}</>
      )
    },
    {
      title: '收款公司账号',
      dataIndex: "coll_company_no",
      search: false,
      align: 'center',
      onCell: sharedOnCell,
      render: (dom, entity) => (
        <>{entity?.coll_company?.bank_no}</>
      )
    },
    {
      title: '申请人',
      dataIndex: 'create_name_cn',
      search: false,
      align: 'center',
    },
    {
      title: '审批人',
      dataIndex: 'approver_name',
      search: false,
      align: 'center',
    },
    {
      title: '项目编号',
      dataIndex: 'trd_no',
      search: false,
      align: 'center',
      render: (_, row) => <a onClick={() => handleJumpTrdNo(row)}>{row.trd_no}</a>
    },
    {
      title: '申请时间',
      dataIndex: 'reim_date',
      search: {
        title: '开始周：',
      },
      valueType: 'dateDate',
      align: 'center',
      fieldProps: {
        allowClear: false,
        format: 'YYYY-ww',
      },
      initialValue: dayjs().startOf('week'),
      // render: (dom, entity) => {
      //   return <div>{entity.reim_date}</div>;
      // },
      renderFormItem: (item, {type, defaultRender, ...rest}, form) => {
        // console.log('申请时间',item,form.getFieldValue(item.dataIndex))
        return (
          <div style={{width: 600}}>

            <DatePicker.WeekPicker
              style={{marginRight: 8}}
              format="YYYY-ww"
              allowClear={false}
              value={form.getFieldValue(item.dataIndex) || dayjs().startOf('week')}
              onChange={(date) => {

                handleGetCurrentWeekly(dayjs(date).format('YYYY-ww')) // 获取上周五到本周四的日期
                form.setFieldsValue({[item.dataIndex]: date})
              }}
              {...rest?.fieldProps}
            />
            结束周：
            <DatePicker.WeekPicker
              format="YYYY-ww"
              allowClear={false}
              value={form.getFieldValue(item.dataIndex) || dayjs().endOf('week')}
              onChange={(date) => {

                handleGetCurrentWeekly(dayjs(date).format('YYYY-ww')) // 获取上周五到本周四的日期
                form.setFieldsValue({[item.dataIndex]: date})
              }}
              {...rest?.fieldProps}
            />
            <span style={{marginLeft: 8}}>{baseData?.showWeekday}</span>
          </div>
        );
      },
    },
    {
      title: '打款时间',
      dataIndex: 'payment_at',
      search: false,
      align: 'center',
    },
    {
      title: '部门',
      dataIndex: 'department',
      search: false,
      align: 'center',
    },
    {
      title: '总价(不含税)',
      dataIndex: 'ex_amount',
      search: false,
      align: 'center',
    },
    {
      title: '税额',
      dataIndex: 'tax_amount',
      search: false,
      align: 'center',
    },
    {
      title: '税率',
      dataIndex: 'tax_rate',
      search: false,
      align: 'center',
      render: (_, row) => {
        return (
          <>
            {
              row.tax_rate ?
                parseFloat(row.tax_rate).toFixed(2) + '%' :
                ''
            }
          </>
        )
      }
    },
    {
      title: '总价(含税)',
      dataIndex: 'in_amount',
      search: false,
      align: 'center',
    },
    {
      title: '报销类型',
      dataIndex: 'coll_channel',
      search: false,
      align: 'center',
    },
    {
      title: '状态',
      dataIndex: 'status_cn',
      search: false,
      align: 'center',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      search: false,
      align: 'center',
      render: (_, row) => (
        <Text
          style={{width: 100}}
          ellipsis={{tooltip: row.remark}}
        >
          {row.remark}
        </Text>
      )
    },
    {
      title: '申请附件',
      dataIndex: "file_ids",
      search: false,
      align: 'center',
      render: (_, row) => (
        <Button
          type='primary'
          onClick={() => handleOpenFiles(row, '申请附件')}
          disabled={!(!!row.file_ids)}
        >
          查看
        </Button>
      )
    },
    // {
    //   title: '打款附件',
    //   dataIndex: "payment_file_ids",
    //   search: false,
    //   align: 'center',
    //   render: (_, row) => (
    //     <Button
    //       type='primary'
    //       onClick={() => handleOpenFiles(row, '打款附件')}
    //       disabled={!(!!row.payment_file_ids)}
    //     >
    //       查看
    //     </Button>
    //   )
    // },
    // 将打款附件改成打款记录
    {
      title: '打款记录',
      dataIndex: 'info',
      search: false,
      align: 'center',
      render: (_, row) => {
        const infoList = row?.info ? JSON.parse(row?.info) : []
        // console.log('打款记录', infoList,row)
        return (
          <>
            {
              !isEmpty(infoList) &&
              infoList.map((item, index) => {

                return (
                  <div key={index} style={{ display: "flex" }}>
                    {
                      !isEmpty(item) &&
                      <div>
                        <Space align={'start'}>
                          <Space direction={'vertical'} align={'start'}>
                            <div>付款公司: {item?.companyName}</div>
                            <div>金额: {item?.amount}</div>
                            <div>备注: {item?.remark}</div>
                            {
                              item?.file_ids ?
                                <EyeOutlined style={{cursor: 'pointer'}} onClick={() => {
                                  handleOpenFiles(row, '打款附件')
                                }}/> : <></>
                            }
                          </Space>

                          <Popconfirm
                            title="提示"
                            description="确认要删除这条打款记录吗?"
                            onConfirm={() => {
                              deleteInputRecord(item?.id ?? '0', 'publicIncome')
                            }}
                            okText="Yes"
                            cancelText="No"
                          >
                            <DeleteOutlined style={{ color: 'red'}} />
                          </Popconfirm>
                        </Space>

                        {
                        index !== infoList.length - 1 && <Divider />
                        }
                      </div>
                    }
                  </div>
                )
              })
            }
          </>
        )
      }
    },
    {
      title: '操作',
      dataIndex: "action",
      search: false,
      align: 'center',
      render: (_, row) => {
        return (
          <Space>
            <Button
              type="primary"
              onClick={() => handleOpenPayouts(row)}>
              打款
            </Button>
            {
              row.show_reject_button && <DeleteButton
                type="primary"
                danger
                onConfirm={() => handleAction(row, 'reject')}
                title="确认驳回？"
              >
                驳回
              </DeleteButton>
            }

          </Space>
        )
      },
    },
  ]

  const deleteInputRecord = async (id: any, type: any) => {
    const params = {
      id: id,
      type: type
    }

    try {
      const res = await deleteInput(params)
      if (res.success) {
        actionRef?.current?.reload()

        message.success('删除成功')
        return
      }
      message.error(res.message)
    } catch (error) {
      message.error((error as Error).message)
    }
  }


  return (
    <PageContainer>
      {contextHolder}
      <ProTable
        headerTitle="对公付款列表"
        actionRef={actionRef}
        scroll={{x: 'max-content'}}
        search={{
          labelWidth: 120,
        }}

        request={handleFetchListData}
        columns={columns}
        columnsState={{
          value: columnsStateMap,
          onChange: (newState) => {
            setColumnsStateMap(newState)
            setStateMap(pathname, newState)
          }
        }}
      />

      {
        openDrawer.payouts &&
        <BaseContainer
          type={ModalType.Drawer}
          width={800}
          open={openDrawer.payouts}
          destroyOnClose={true}
          maskClosable={false}
          title="打款"
          onClose={handleClosePayouts}
        >
          <Payouts
            form={form}
            baseData={baseData}
            onChangeFileIds={handleChangeFileIds}
            // onFinishPayouts={handleFinishPayouts}
            handleShowCheckPanel={handleShowCheckPanel}
            handleFinishPayoutsForm={handleFinishPayoutsForm}
          />
        </BaseContainer>
      }

      {
        openDrawer.files &&
        <BaseContainer
          type={ModalType.Modal}
          width={800}
          open={openDrawer.files}
          destroyOnClose={true}
          maskClosable={false}
          title="附件"
          onClose={handleCloseFiles}
        >
          <FileList
            baseData={baseData}
          />
        </BaseContainer>
      }
    </PageContainer>
  )
}

export default CorporatePayment
