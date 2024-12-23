import React, {RefObject, useEffect, useRef, useState} from "react"
import type {ActionType, ParamsType} from "@ant-design/pro-components";
import {ProTable, ProColumns} from "@ant-design/pro-components";
import {useIntl, FormattedMessage} from "@umijs/max";
import {Button, Form, Drawer, message, Space} from "antd";
import {exportAloneReimExcel} from "@/services/ant-design-pro/financialReimbursement";
import Enter from "./Enter";
import ReimbursementSeparately from "../../ReimbursementPayment/components/ReimbursementSeparately";
import ViewDetail from "./ViewDetail";
import {getUserList} from "@/services/ant-design-pro/project";
import dayjs from "dayjs";
import {getUserButtons} from "@/services/ant-design-pro/user";
import {bcMath, downloadFile, getStateMap, setStateMap, showButtonByType} from "@/utils/utils";
import {isEmpty, sumBy} from "lodash";
import {useLocation} from "@@/exports";
import {createSinglePdfFile, getFileOssUrl, getMergeQuoFileName} from "@/services/ant-design-pro/pdf";
import OSS from "ali-oss";
import DeleteButton from "@/components/Buttons/DeleteButton";

type HandleListDataParams = {
  current: number;
  pageSize: number;
  [key: string]: any;
};

type HandleListDataReturnType = {
  success: boolean;
  total: number;
  data: any[]; // 可以根据需要进一步指定数组的类型
};

type HandleListDataFunc = (params: HandleListDataParams, sort: ParamsType) => Promise<HandleListDataReturnType>;

type HandleRowSelectionFunc = (keys: any, selectedRows: any[]) => void; // 根据实际情况替换 any

interface ItemListProps {
  onListData: HandleListDataFunc;
  actionRef: RefObject<ActionType>;
  success: (text: string) => void
  error: (text: string) => void
  settlementTypes: {
    value: number
    label: string
  }[]
  onRowSelected: HandleRowSelectionFunc;
  selectedRowsState: any
  tableList: any
}

interface DetailItem {
  item: string;
  date: string;
  type: string;
  desc: string;
  qty: number | string;
  sub_total: string;
  invoice_num: number | string;
  remark: string;
  file_ids?: string;
}

const ItemList: React.FC<ItemListProps> = ({
                                             actionRef,
                                             onListData,
                                             success,
                                             error,
                                             onRowSelected,
                                             selectedRowsState,
                                             tableList
                                           }) => {
  const [form] = Form.useForm()
  const intl = useIntl()
  const [columnsStateMap, setColumnsStateMap] = useState({});
  const location = useLocation();
  const currentPath = location.pathname;
  const pathname = currentPath.split('/')[currentPath.split('/').length - 1]
  const [type, setType] = useState<any>('')
  const [peopleList, setPeopleList] = useState<{
    value: number
    label: string
  }[]>([])
  const [currentItem, setCurrentItem] = useState({})
  const [separately, setSeparately] = useState<boolean>(false)
  const [title, setTitle] = useState<string>('')
  const [showDetail, setShowDetail] = useState(false)
  const [showEnter, setShowEnter] = useState(false)
  const [loadings, setLoadings] = useState<boolean[]>([]);
  const [isHaveTickets, setIsHaveTickets] = useState(0)
  const [currentTime, setCurrentTime] = useState(dayjs().subtract(1, 'month').format('YYYY-MM'))
  const [ctrButtons, setCtrButtons] = useState<any[]>([])
  const [downloadPdfLoading, setDownloadPdfLoading] = useState<boolean>(false)
  const [downloadToken, setDownloadToken] = useState<string>('');


  const calculateTotals = (detail_list: DetailItem[]) => {
    const result = detail_list.reduce(
      (acc, item) => {
        if (item.invoice_num === '' || item.sub_total === '0') {
          return acc;
        }

        const subTotal = bcMath.fixedNum(item.sub_total);
        const invoiceNum = Number(item.invoice_num);

        if (invoiceNum === 0) {
          acc.withoutInvoiceTotal = bcMath.add(acc.withoutInvoiceTotal, subTotal);
        } else if (invoiceNum === 1) {
          acc.withInvoiceTotal = bcMath.add(acc.withInvoiceTotal, subTotal);
        }
        return acc;
      },
      { withInvoiceTotal: '0', withoutInvoiceTotal: '0' }
    );

    return {
      withInvoiceTotal: result.withInvoiceTotal,
      withoutInvoiceTotal: result.withoutInvoiceTotal
    };
  };


  const data = tableList.data
  const getDetailLists = (data) => {
    return Array.isArray(data)
      ? data.map(item => Array.isArray(item.detail_list) ? item.detail_list : [])
      : [];
  };
  const detailList = getDetailLists(data);
  // console.log('detailList--detailList', detailList);


  // console.log('withInvoiceTotal', withInvoiceTotal, 'withoutInvoiceTotal', withoutInvoiceTotal);

  const columns: ProColumns<API.OfficeParams>[] = [
    {
      title: "序号",
      align: 'center',
      search: false,
      render: (dom, entity, index) => {
        return (
          <>{index + 1}</>
        )
      }
    },
    {
      title: '审批人',
      dataIndex: 'approver_name',
      search: false,
      align: 'center',
    },
    {
      title: "姓名",
      align: 'center',
      dataIndex: "username",
      hideInSearch: true
    },
    {
      title: "报销月份",
      align: 'center',
      dataIndex: "month",
      valueType: 'dateMonth',
      fieldProps: {
        onChange: (_, time) => {
          setCurrentTime(time)
          console.log("time", time)
        }
      },
      initialValue: currentTime,
      render: (dom, entity) => {
        return (
          <div>{currentTime}</div>
        )
      },
    },
    {
      title: "有票申请金额",
      align: 'center',
      // dataIndex: "with_invoice_amount",
      hideInSearch: true,
      render: (dom, entity,index) => {
        const { withInvoiceTotal, withoutInvoiceTotal } = calculateTotals(detailList[index] ? detailList[index] : []);
        return (
          <div>{withInvoiceTotal}</div>
        )
      }
    },
    {
      title: "有票打款金额",
      align: 'center',
      dataIndex: "with_invoice_amount",
      hideInSearch: true,

    },
    {
      title: "有票打款",
      align: 'center',
      search: false,
      dataIndex: "",
      render: (dom, entity) => {
        if (!entity.show_with_button) {
          return <p>-</p>
        }

        const isPayment = !isEmpty(entity.with_invoice_payment_at) && entity.with_invoice_payment_at !== '';
        const total = sumBy(entity.with_invoice_payment_list, item => parseFloat(item.amount))
        const isDisable = (entity?.with_invoice_amount ?? 0) >= total
        return (
          <Button
            type="primary"
            style={isPayment ? { backgroundColor: '#d9d9d9', borderColor: '#d9d9d9', color: '#8c8c8c' } : {}}
            onClick={() => {
              setShowEnter(true)
              setCurrentItem(entity)
              setType('有票单独打款')
            }}
            disabled={isDisable}
          >
            打款
          </Button>
        )
      }
    },
    // 不在这里显示了
    // {
    //   title: "有票打款时间",
    //   align: 'center',
    //   search: false,
    //   dataIndex: "with_invoice_payment_at",
    // },
    {
      title: "无票申请金额",
      align: 'center',
      // dataIndex: "with_invoice_amount",---------------------------------------------------------------------------------------------
      hideInSearch: true,
      render: (dom, entity,index) => {
        const { withInvoiceTotal, withoutInvoiceTotal } = calculateTotals(detailList[index] ? detailList[index] : []);
        return (
          <div>{withoutInvoiceTotal}</div>
        )
      }
    },
    {
      title: "无票打款金额",
      align: 'center',
      search: false,
      dataIndex: "without_invoice_amount",
    },
    {
      title: "无票打款",
      align: 'center',
      search: false,
      dataIndex: "",
      render: (dom, entity) => {
        if (!entity.show_without_button) {
          return <p>-</p>
        }

        const isPayment = !isEmpty(entity.without_invoice_payment_at) && entity.without_invoice_payment_at !== '';
        const total = sumBy(entity.without_invoice_payment_list, item => parseFloat(item.amount))
        const isDisable = (entity?.without_invoice_amount ?? 0) >= total

        return (
          <Button
            type="primary"
            style={isPayment ? { backgroundColor: '#d9d9d9', borderColor: '#d9d9d9', color: '#8c8c8c' } : {}}
            onClick={() => {
              setShowEnter(true)
              setCurrentItem(entity)
              setType('无票单独打款')
            }}
            disabled={isDisable}
          >
            打款
          </Button>
        )
      }
    },
    // 不在这里显示了
    // {
    //   title: "无票打款时间",
    //   align: 'center',
    //   search: false,
    //   dataIndex: "without_invoice_payment_at",
    // },
    {
      title: "总计",
      align: 'center',
      search: false,
      dataIndex: "total_amount",
    },
    {
      title: "状态",
      align: 'center',
      dataIndex: "status",
      valueType: "select",
      valueEnum: {
        "approved": "approved",
        "submit": "submit",
        "reject": "reject"
      },
      fieldProps: {
        showSearch: true
      }
    },
    {
      title: "pass",
      dataIndex: "show_pass_button",
      hideInTable: true,
      hideInSearch: true
    },
    {
      title: "reject",
      dataIndex: "show_reject_button",
      hideInTable: true,
      hideInSearch: true
    },
    {
      title: "list_ids",
      dataIndex: "list_ids",
      hideInTable: true,
      hideInSearch: true
    },
    {
      title: "操作",
      align: 'center',
      search: false,
      dataIndex: "",
      render: (dom, entity) => (
        <Space>
          <Button type="primary" onClick={() => {
            setShowDetail(true)
            setCurrentItem(entity)
          }}>查看</Button>
        </Space>

      )
    },
  ]

  const exportReimExcel = (index) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });
    const ids = selectedRowsState.map(item => (item.list_ids).join()).join(',')
    exportAloneReimExcel({reim_list_ids: ids}).then(res => {
      if (res.success) {
        setLoadings((prevLoadings) => {
          const newLoadings = [...prevLoadings];
          newLoadings[index] = false;
          return newLoadings;
        });

        // if (isEmpty(res.data)) {
        //   message.error("获取不到数据")
        //   return
        // }

        const link = document.createElement('a');
        link.href = res.data;
        link.target = '_blank'
        // link.download = fileName;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return
      }
      message.error("导出失败")
    })
  }

  // 轮询以获取文件
  const downloadPdfFile = (token, index) => {
    getFileOssUrl({download_token: token}).then(ossResult => {
      if (ossResult.data) {
        const fileName = dayjs().format('YYYY-MM') + '.pdf'
        downloadFile(ossResult.data.replace('http:', 'https:'), fileName)
        setDownloadPdfLoading(false)
      } else {
        setTimeout(() => {
          downloadPdfFile(token, undefined)
        }, 1000)
      }
    })
  }

  const exportReimPdf = (index) => {
    setDownloadPdfLoading(true)
    console.log(selectedRowsState)
    const ids = selectedRowsState.map(item => (item.list_ids).join()).join(',')
    console.log('idsidsidsisd', ids, index)
    createSinglePdfFile({
      single_pdf: [
        {pdf_info: {reim_list_ids: ids}, pdf_type: 'finance_reim'}
      ]
    }).then((res) => {
      downloadPdfFile(res.data, undefined);
      console.log('kdslkdldldd', res)
    })
  }

  const handleCloseEnter = () => {
    setCurrentItem({})
    setShowEnter(false)
  }

  const handleCloseSeparately = () => {
    setTitle('')
    setCurrentItem({})
    setSeparately(false)
  }

  const handleCloseDetail = (isReload = false) => {
    setShowDetail(false)
    if (isReload) {
      actionRef.current?.reload()
    }

  }


  const ctrButtonMappings = {
    batchPayment:
      <Space>
        <Button
          key="批量有票打款"
          type="primary"
          disabled={selectedRowsState.length < 1}
          onClick={() => {
            if (currentTime !== '') {
              setShowEnter(true)
              setType('批量有票打款')
              // if (isHaveTickets) {
              //   setShowEnter(true)
              //   setType('批量打款')
              //   return
              // }
              // error('请选择是否有票')
              return
            }
            error('请选择报销月份')
          }}
        >
          批量有票打款
        </Button>
        <Button
          key="批量无票打款"
          type="primary"
          disabled={selectedRowsState.length < 1}
          onClick={() => {
            if (currentTime !== '') {
              setShowEnter(true)
              setType('批量无票打款')
              // if (isHaveTickets) {
              //   setShowEnter(true)
              //   setType('批量打款')
              //   return
              // }
              // error('请选择是否有票')
              return
            }
            error('请选择报销月份')
          }}
        >
          批量无票打款
        </Button>
      </Space>

  }


  useEffect(() => {
    setColumnsStateMap(getStateMap(pathname))
    getUserList().then(res => {
      if (res.success) {
        setPeopleList(res.data.map(item => {
          return {
            value: item.uid,
            label: item.name_cn,
          }
        }))
      }
    })
  }, [])

  useEffect(() => {
    // 获取可用的button按钮对象，并且更新ctrButtons的值
    showButtonByType(ctrButtonMappings, 'officeMonthlyReimbursement', 'toolBarRender').then(r => {
      console.log("r", r)
      setCtrButtons(r)
    })
  }, [selectedRowsState])
  return (
    <>
      <ProTable<API.OfficeParams, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'office.table.title',
          defaultMessage: 'table list',
        })}
        actionRef={actionRef}
        scroll={{x: 'max-content'}}
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="导出报销单Excel"
            disabled={selectedRowsState.length < 1}
            loading={loadings[1]}
            onClick={() => exportReimExcel(1)}
          >
            导出报销单Excel
          </Button>,
          <Button
            type="primary"
            key="导出报销单Pdf"
            disabled={selectedRowsState.length < 1}
            loading={downloadPdfLoading}
            onClick={() => exportReimPdf(1)}
          >
            导出报销单Pdf
          </Button>,
          ...ctrButtons
        ]}
        columnEmptyText={false}
        form={{
          form
        }}
        columnsState={{
          value: columnsStateMap,
          onChange: (newState) => {
            setColumnsStateMap(newState)
            setStateMap(pathname, newState)
          }
        }}
        rowSelection={{
          onChange: onRowSelected,
          fixed: 'left',
          columnWidth: 50
        }}
        request={onListData}
        columns={columns}
      />
      <Drawer
        width={1400}
        open={separately}
        onClose={handleCloseSeparately}
        destroyOnClose={true}
        title={title}
      >
        <ReimbursementSeparately
          actionRef={actionRef}
          success={success}
          error={error}
          handleCloseSeparately={handleCloseSeparately}
          currentItem={currentItem}
        />
      </Drawer>

      <Drawer
        width={1000}
        open={showDetail}
        onClose={handleCloseDetail}
        destroyOnClose={true}
        title="查看详情"
      >
        <ViewDetail
          currentItem={currentItem}
          onCloseDrawer={handleCloseDetail}
          applyDate={currentTime}
        />
      </Drawer>

      <Drawer
        open={showEnter}
        onClose={handleCloseEnter}
        destroyOnClose={true}
        width={800}
        title="打款录入"
      >
        <Enter
          success={success}
          error={error}
          handleCloseEnter={handleCloseEnter}
          currentItem={currentItem}
          selectedRowsState={selectedRowsState}
          type={type}
          isHaveTickets={isHaveTickets}
          currentTime={currentTime}
          actionRef={actionRef}
        />
      </Drawer>
    </>
  )
}

export default ItemList
