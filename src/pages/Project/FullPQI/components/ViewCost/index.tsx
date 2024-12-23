import {StringDatePicker} from "@/components/StringDatePickers"
import {useViewCost, CurrentMsgParams} from "@/viewModel/PQI/useViewCost"
import {MinusCircleOutlined, PlusCircleOutlined} from "@ant-design/icons"
import {Button, Drawer, Select, Table} from "antd"
import {isEmpty} from "lodash"
import React from "react"
import RequestPayment from './RequestPayment'
import dayjs from "dayjs"
import BaseContainer, {ModalType} from "@/components/Container";
import FileList from "./FileList";
import Payee from "@/pages/Project/FullPQI/components/ViewCost/Payee";
import Reimbursement from "@/pages/Project/FullPQI/components/Reimbursement";
import {log} from "mathjs";
import ShowFiles from "@/components/ShowFIles";

interface ViewCostParams {
  currentMsg: CurrentMsgParams
}

const ViewCost: React.FC<ViewCostParams> = ({
                                              currentMsg
                                            }) => {
  const {
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
    handleOpenPayment,
    handleClosePayment,
    handleInvoicePqiCostEstimate,
    handleUploadFile,
    handleOpenFiles,
    handleCloseFiles,
    handleChangeCompany,

    handleCreateInvoice,
    handleEditorInvoice,
    handleGetInvoiceInfo
  } = useViewCost(currentMsg)

  const sharedOnCell = (data: any, index?: number) => {
    if (index === 1) {
      return {colSpan: 0};
    }
    if (index === 0) {
      return {rowSpan: currentData[data?.tableIndex]?.length + currentData[data?.tableIndex][0]?.estimate_items?.length};
    }
    if (index !== 0) {
      return {rowSpan: 0};
    }
    return {};
  };

  const columns: any = [
    {
      title: '项目',
      indexData: 'cost_type_name',
      align: 'center',
      width: '10vw',
      render: (_, entity) => (
        <>
          {entity.cost_type_name}
          {entity.cost_detail && <>({entity.cost_detail})</>}
        </>
      ),
      onCell: sharedOnCell,
    },
    {
      title: '供应商全称',
      indexData: 'supplier_name',
      align: 'center',
      width: '5vw',
      render: (_, entity) => <>{entity.supplier_name}</>,
      onCell: sharedOnCell,
    },
    {
      title: '发票',
      indexData: 'invoice_infos',
      align: 'center',
      width: '5vw',
      render: (record, _, index) => (
        <>
          {/*{console.log('1111111111111',record)}*/}
          <Button
            type="primary"
            onClick={() =>
              handleOpenFiles({
                payment_file_ids: record?.invoice_infos.map((item) => item.file_id).join(','),
              })
            }
            disabled={!!!record?.invoice_infos.map((item) => item.file_id).join(',')}
          >
            查看
          </Button>
        </>
      ),
      onCell: sharedOnCell,
    },
    {
      title: '发票总金额',
      indexData: 'invoice_infos',
      align: 'center',
      width: '5vw',
      render: (record, entity) => {
        // console.log('发票总金额--发票总金额',record, record.cost_type_name)
        return (
          <>
            {record?.invoice_infos.reduce((sum, item) => {
              // console.log('发票总金额--item', sum + parseFloat(item.amount_in_figuers))
              return sum + parseFloat(item.amount_in_figuers);
            }, 0)}
          </>
        );
      },
      onCell: sharedOnCell,
    },
    {
      title: '合同价(不含税)',
      indexData: 'price',
      align: 'center',
      width: '5vw',
      render: (_, entity) => <>{entity.price}</>,
      onCell: sharedOnCell,
    },
    {
      title: '含税价格',
      indexData: 'sub_total_price',
      align: 'center',
      width: '5vw',
      render: (_, entity) => <>{entity.sub_total_price}</>,
      onCell: sharedOnCell,
    },
    {
      title: '税额',
      dataIndex: 'tax_price',
      align: 'center',
      width: '5vw',
      onCell: sharedOnCell,
    },
    {
      title: '收款比例',
      dataIndex: 'payment_ratio',
      align: 'center',
      width: '5vw',
      onCell: sharedOnCell,
    },
    {
      title: '已付金额',
      dataIndex: 'estimate_items',
      align: 'center',
      width: '5vw',
      render: (dom, entity, _) => (
        <>
          {dom.reduce((sum, item) => {
            // console.log(parseFloat(item.payment_amount === '' ? 0 : item.payment_amount),item.payment_amount,'2342424')
            return sum + parseFloat(item.payment_amount === '' ? 0 : item.payment_amount ?? 0);
          }, 0) === 0
            ? ''
            : dom.reduce((sum, item) => {
                // console.log(parseFloat(item.payment_amount === '' ? 0 : item.payment_amount),item.payment_amount,'2342424')
                return sum + parseFloat(item.payment_amount === '' ? 0 : item.payment_amount ?? 0);
              }, 0)}
        </>
      ),
      onCell: sharedOnCell,
    },
    {
      title: '申请金额',
      dataIndex: 'total_apply_price',
      align: 'center',
      width: '5vw',
      onCell: sharedOnCell,
    },

    {
      title: '序号',
      dataIndex: '',
      align: 'center',
      width: '3vw',
      render: (dom, entity, index) => <>{index + 1}</>,
    },

    {
      title: '不含税',
      dataIndex: 'tax_exclusive',
      align: 'center',
      width: '5vw',
      render: (_, entity, index) => {
        return (
          <>
            <input
              value={entity.tax_exclusive}
              type="number"
              min={0}
              style={{
                width: '100%',
                border: 'none',
                outline: 'none',
                borderBottom: '1px solid #f00',
                color: 'red',
                textAlign: 'center',
              }}
              onChange={(e) => handleInput(e?.target?.value, entity.tableIndex, index, 'exclusive')}
            />
          </>
        );
      },
    },
    {
      title: '税率(%)',
      dataIndex: 'tax_rate',
      align: 'center',
      width: '5vw',
      render: (_, entity, index) => {
        return (
          <>
            <input
              value={entity.tax_rate}
              min={0}
              type="number"
              style={{
                width: '100%',
                border: 'none',
                outline: 'none',
                borderBottom: '1px solid #f00',
                color: 'red',
                textAlign: 'center',
              }}
              onChange={(e) => handleInput(e?.target?.value, entity.tableIndex, index, 'rate')}
            />
          </>
        );
      },
    },
    {
      title: '税额',
      dataIndex: 'tax_amount',
      align: 'center',
      width: '5vw',
    },
    {
      title: '预计付款时间',
      dataIndex: 'estimated_payment_date',
      align: 'center',
      width: '8vw',
      render: (_, entity, index) => (
        <StringDatePicker
          value={entity.estimated_payment_date}
          onChange={(date) => handleChangeTime(date, entity.tableIndex, index)}
        />
      ),
    },
    {
      title: '保存',
      dataIndex: '',
      align: 'center',
      width: '5vw',
      onCell: sharedOnCell,
      hidden: !showSaveBtn,
      render: (_, entity) => {
        const tableIndex = entity.tableIndex;
        const accountId = entity?.Project_final_account_id ?? 0;
        const saveData = currentData[tableIndex];

        const btn = (
          <Button type="primary" onClick={() => handleEstimateSaveData(accountId, saveData)}>
            保存
          </Button>
        );

        return btn;
      },
    },
    {
      title: '实际付款时间',
      dataIndex: 'payment_at',
      align: 'center',
      width: '5vw',
      render: (_, entity) => (
        <>{entity.payment_at ? dayjs(entity.payment_at).format('YYYY-MM-DD') : ''}</>
      ),
    },
    {
      title: '实际付款金额',
      dataIndex: 'payment_amount',
      align: 'center',
      width: '5vw',
      render: (text, entity, index) => (
        <>
          {/*{console.log('kkkkkkkk',entity,text)}*/}
          {entity.estimate_items[index]?.payment_amount ?? ''}
        </>
      ),
    },
    {
      title: '审批人',
      dataIndex: 'apply_username',
      align: 'center',
      width: '5vw',
    },
    {
      title: '申请人',
      dataIndex: 'username',
      align: 'center',
      width: '5vw',
    },
    {
      title: '收款人',
      dataIndex: 'payee',
      align: 'center',
      width: '5vw',
      render: (_, entity, index) => {
        let payee = '';

        if (entity?.cost_type_name === 'Project Manager Bonus' && entity?.uid) {
          const filterValue = payeeList.filter((item) => item?.value == entity?.uid);
          if (!isEmpty(filterValue)) {
            payee = filterValue[0]?.label;
          }
        }

        return <div>{payee}</div>;
      },
    },
    {
      title: '合同/报价（无章）',
      dataIndex: 'estimate_items',
      align: 'center',
      width: '5vw',
      render: (record, _, index) => (
        <>
          {/*{console.log('asfasfsafasfsfasafsaeeee',record)}*/}
          {/*<ShowFiles fileIds={record[index+1]?.apply?.file_ids} />*/}
          <Button
            type="primary"
            onClick={() => handleOpenFiles({ payment_file_ids: record[index]?.apply?.stamp_ids })}
            disabled={!!!record[index]?.apply?.stamp_ids}
          >
            查看
          </Button>
        </>
      ),
    },
    {
      title: '报价（有章）',
      dataIndex: 'estimate_items',
      align: 'center',
      width: '5vw',
      render: (record, _, index) => (
        // <>
        //   {console.log(record[index+1]?.apply?.file_ids,index)}
        //   <ShowFiles fileIds={record[index+1]?.apply?.file_ids} />
        <Button
          type="primary"
          onClick={() => handleOpenFiles({ payment_file_ids: record[index]?.apply?.no_stamp_ids })}
          disabled={!!!record[index]?.apply?.no_stamp_ids}
        >
          查看
        </Button>
        // </>
      ),
    },
    {
      title: '付款附件',
      dataIndex: 'payment_file_ids',
      align: 'center',
      width: '5vw',
      render: (_, entity) => (
        <Button
          type="primary"
          onClick={() => handleOpenFiles(entity)}
          disabled={!!!entity.payment_file_ids}
        >
          查看
        </Button>
      ),
    },
    {
      title: '操作',
      dataIndex: '',
      align: 'center',
      width: '3vw',
      colSpan: 3,
      render: (_, entity, index) => (
        <PlusCircleOutlined
          style={{ fontSize: 20, cursor: 'pointer' }}
          onClick={() => {
            handleAddTable(entity.tableIndex, index);
          }}
        />
      ),
    },
    {
      title: '操作',
      dataIndex: '',
      align: 'center',
      width: '3vw',
      colSpan: 0,
      render: (_, entity, index) => (
        <MinusCircleOutlined
          style={{ fontSize: 20, cursor: 'pointer' }}
          onClick={() => {
            handleDelTable(entity.tableIndex, index);
          }}
        />
      ),
    },
    {
      title: '操作',
      dataIndex: '',
      align: 'center',
      width: '5vw',
      colSpan: 0,
      render: (_, entity, index) => {
        let btnStatusTxt = '';
        if (entity?.cost_type_name === 'Project Manager Bonus') {
          btnStatusTxt = entity?.uid ? '查看申请' : '申请付款';
        } else {
          btnStatusTxt = isEmpty(entity.estimate_items[index]?.apply) ? '申请付款' : '查看申请';
        }

        return (
          <Button
            type="primary"
            onClick={() => {
              handleOpenPayment({ ...entity, itemIndex: index + 1 });
              handleGetInvoiceInfo({ ...entity, itemIndex: index + 1 });
            }}
          >
            {btnStatusTxt}
          </Button>
        );
      },
    },
  ];

  const totalColumns: any = [
    {
      title: '项目',
      indexData: 'cost_type_name',
      align: 'center',
      width: '10vw',
      render: (dom, row) => <div style={{color: 'red'}}>{row.cost_type_name}</div>
    },
    {
      title: '供应商全称',
      indexData: 'supplier_name',
      align: 'center',
      width: '5vw',
    },
    {
      title: '合同价(不含税)',
      indexData: 'price',
      align: 'center',
      width: '5vw',
      render: (dom, row) => <div style={{color: 'red'}}>{row?.price}</div>
    },
    {
      title: '含税价格',
      indexData: 'sub_total_price',
      align: 'center',
      width: '5vw',
      render: (dom, row) => <div style={{color: 'red'}}>{row?.sub_total_price}</div>
    },
    {
      title: '税额',
      dataIndex: 'tax_price',
      align: 'center',
      width: '5vw',
      render: (dom, row) => <div style={{color: 'red'}}>{row?.tax_price}</div>
    },
    {
      title: '收款比例',
      dataIndex: 'payment_ratio',
      align: 'center',
      width: '5vw',
      render: (dom, row) => <div style={{color: 'red'}}>{row?.payment_ratio}</div>
    },
    {
      title: '已付金额',
      dataIndex: 'total_payment_price',
      align: 'center',
      width: '5vw',
      render: (dom, row) => <div style={{color: 'red'}}>{row?.total_payment_price}</div>
    },
    {
      title: '申请金额',
      dataIndex: 'total_apply_price',
      align: 'center',
      width: '5vw',
      render: (dom, row) => <div style={{color: 'red'}}>{row?.total_apply_price}</div>
    },

    {
      title: '序号',
      dataIndex: '',
      align: 'center',
      width: '5vw',
    },

    {
      title: '不含税',
      dataIndex: 'tax_exclusive',
      align: 'center',
      width: '5vw',
    },
    {
      title: '税率(%)',
      dataIndex: 'tax_rate',
      align: 'center',
      width: '5vw',
    },
    {
      title: '税额',
      dataIndex: 'tax_amount',
      align: 'center',
      width: '5vw',
    },
    {
      title: '预计付款时间',
      dataIndex: 'estimated_payment_date',
      align: 'center',
      width: '5vw',
    },
    {
      title: '保存',
      dataIndex: '',
      align: 'center',
      width: '5vw',
    },
    {
      title: '审批人',
      dataIndex: 'apply_username',
      align: 'center',
      width: '5vw',
    },
    {
      title: '申请人',
      dataIndex: 'username',
      align: 'center',
      width: '5vw',
    },
    {
      title: '收款人',
      dataIndex: '',
      align: 'center',
      width: '5vw',
      colSpan: 0,
    },
    {
      title: '实际付款时间',
      dataIndex: 'payment_at',
      align: 'center',
      width: '5vw',
    },
    {
      title: '实际付款金额',
      dataIndex: 'payment_amount',
      align: 'center',
      width: '5vw',
    },
    {
      title: '付款附件',
      dataIndex: 'payment_file_ids',
      align: 'center',
      width: '5vw',
    },
    {
      title: '操作',
      dataIndex: '',
      align: 'center',
      width: '3vw',
      colSpan: 3,
    },
    {
      title: '操作',
      dataIndex: '',
      align: 'center',
      width: '3vw',
      colSpan: 0,
    },
    {
      title: '操作',
      dataIndex: '',
      align: 'center',
      width: '3vw',
      colSpan: 0,
    },
    {
      title: '操作',
      dataIndex: '',
      align: 'center',
      width: '5vw',
      colSpan: 0,
    }
  ]

  return (
    <>
      <div style={{width: '120vw'}}>
        {
          !isEmpty(currentData) && currentData.map((item, tableIndex) => {
            return (
              <Table
                key={tableIndex}
                showHeader={tableIndex === 0}
                pagination={false}
                bordered={true}
                size='small'
                dataSource={[...item]}
                columns={columns}
              />
            )
          })
        }
        {
          !isEmpty(currentData) &&
          <Table
            showHeader={false}
            pagination={false}
            bordered={true}
            size='small'
            dataSource={[totalData]}
            columns={totalColumns}
          />
        }
      </div>

      {
        showPayment &&
        <RequestPayment
          form={form}
          formUpload={formUpload}
          invoiceInfo={invoiceInfo}
          open={showPayment}
          currentItem={currentItem}
          handleClosePayment={() => {
            handleClosePayment('payment')
          }}
          handleInvoicePqiCostEstimate={handleInvoicePqiCostEstimate}
          handleUploadFile={handleUploadFile}
          showSubmitBtn={showSubmitBtn}
          handleChangeCompany={handleChangeCompany}
          itemApply={itemApply}

          handleCreateInvoice={handleCreateInvoice}
          handleEditorInvoice={handleEditorInvoice}
        />
      }

      {
        <Drawer
          width="80%"
          open={showPayee}
          onClose={() => {
            handleClosePayment('payee')
          }}
          destroyOnClose={true}
          title="奖金申请"
        >
          <Payee
            needData={{
              'currentItem': currentItem,
              'currentMsg': currentMsg,
            }}
            listInitData={initData}
            payeeList={payeeList}
          />
        </Drawer>
      }

      {
        showFiles &&
        <BaseContainer
          type={ModalType.Modal}
          width={800}
          open={showFiles}
          destroyOnClose={true}
          maskClosable={false}
          title="附件"
          onClose={handleCloseFiles}
        >
          <FileList
            currentItem={currentItem}
          />
        </BaseContainer>
      }
    </>
  )
}

export default ViewCost
