import {Button, message, Modal, Space, Table} from "antd"
import React, {useEffect, useState} from "react"
import {deleteInput, getOfficeReceipt, operateByBatchListIds} from "@/services/ant-design-pro/financialReimbursement";
import SubmitButton from "@/components/Buttons/SubmitButton";
import {EyeOutlined} from "@ant-design/icons";
import UploadFiles from "@/components/UploadFiles";
import {find, isEmpty} from "lodash";
import {bcMath} from "@/utils/utils";

interface ItemListProps {
  currentItem: {
    show_pass_button: boolean
    show_reject_button: boolean
    detail_list: []
    total_amount: number,
    list_ids: []
    status?: string
  },
  onCloseDrawer: (isReload?: boolean) => void
  applyDate: string,
}

interface DetailItem {
  sub_total: string;
  invoice_num: number;
}

const ViewDetail: React.FC<ItemListProps> = ({
                                               currentItem,
                                               onCloseDrawer,
  applyDate,
                                             }) => {
  console.log('currentItem--currentItem', currentItem)
  const [file, setFile] = useState('')
  const [openFile, setOpenFile] = useState(false)
  const [officeReceipt, setOfficeReceipt] = useState([])

  const columns: any = [
    {
      title: "Num",
      dataIndex: "item",
      align: 'center',
    },
    {
      title: "Date",
      dataIndex: "date",
      align: 'center',
    },
    {
      title: "Type",
      dataIndex: "type",
      align: 'center',
    },
    {
      title: "Description",
      dataIndex: "desc",
      align: 'center',
    },
    {
      title: "QTY",
      dataIndex: "qty",
      align: 'center',
    },
    {
      title: "Sub-Total",
      dataIndex: "sub_total",
      align: 'center',
    },
    {
      title: "Invoice",
      dataIndex: "invoice_num",
      align: 'center',
      render: (dom, entity, index) => {
        return (
          <>
            {
              dom === 1 && <>有</>
            }
            {
              dom === 0 && <>无</>
            }
          </>
        )
      }
    },
    {
      title: "Remark",
      dataIndex: "remark",
      align: 'center',
    },
    {
      title: "Attachment",
      dataIndex: "file_ids",
      align: 'center',
      render: (dom, entity, index) => {
        return (
          <>
            {
              dom ? <EyeOutlined style={{cursor: 'pointer'}} onClick={() => {
                setFile(entity?.file_ids)
                setOpenFile(true)
              }}/> : <></>
            }
          </>
        )
      }
    },
  ]

  const officeReceiptColumns = [
    // {
    //   title: "类型",
    //   dataIndex: "have_invoice",
    //   align: 'center',
    //   render: (dom, entity, index) => {
    //     return (
    //       <>
    //         {
    //           dom ? '有票打款' : '无票打款'
    //         }
    //       </>
    //     )
    //   }
    // },
    {
      title: "金额",
      dataIndex: "pay_amount",
      align: 'center',
      render: (dom, entity, index) => {
        // {find(officeReceipt, {have_invoice: false})?.total_amount ?? 0}
        return entity?.amount ?? 0
      }
    },
    {
      title: "打款时间",
      dataIndex: "pay_at",
      align: 'center'
    },
    {
      title: "录入时间",
      dataIndex: "created_at",
      align: 'center',
    },
    {
      title: "附件",
      dataIndex: "file_ids",
      align: 'center',
      render: (dom, entity, index) => {
        return (
          <>
            {
              dom ? <EyeOutlined style={{cursor: 'pointer'}} onClick={() => {
                setFile(entity?.file_ids)
                setOpenFile(true)
              }}/> : <></>
            }
          </>
        )
      }
    },
    {
      title: "备注",
      dataIndex: "remark",
      align: 'center'
    },
    {
      title: "操作",
      dataIndex: "action",
      align: 'center',
      render: (dom, entity, index) => {
        return (
          <>
            <SubmitButton
              confirmTitle="提示？"
              confirmDesc="您确认要删除记录吗？"
              type="primary"
              danger
              onConfirm={async () => {
                deleteInputRecord(entity?.id ?? 0)
              }}
            >
              删除
            </SubmitButton>
          </>
        )
      }
    },
  ]

  const deleteInputRecord = async (id: number) => {
    const hide = message.loading('loading...');
    const params = {
      id,
      type: 'officeIncome'
    }
    try {
      const res = await deleteInput(params)
      if (res.success) {
        await getReceipt().catch(console.log)
        message.success('删除成功')
        return
      }
      message.error(res.message)
    } catch (error) {
      message.error((error as Error).message)
    } finally {
      hide();
    }
  }

  const operateHandle = async (type: string) => {
    try {
      const res = await operateByBatchListIds({list_ids: currentItem.list_ids, type: type})
      if (res.success) {
        onCloseDrawer(true)
        message.success('提交成功')
        return
      }
      message.error(res.message)
    } catch (error) {
      message.error((error as Error).message)
    }
  }

  const getReceipt = async () => {
    if ('' === applyDate || isEmpty(applyDate)) {
      message.error('请先选择月份');
      return;
    }

    const hide = message.loading('loading...');
    try {
      // {list_ids: currentItem.list_ids}
      const params = {uid: currentItem.uid, office_alone_at: applyDate};
      const result = await getOfficeReceipt(params);
      if (!result.success) {
        message.error(result.message);
        return;
      }

      // console.log("result", result, )
      setOfficeReceipt(result.data)
    } catch (error) {
      message.error((error as Error).message);
    } finally {
      hide();
    }
  }


  //
  useEffect(() => {
    getReceipt().catch(console.log)
  }, []);


  const calculateTotals = (detail_list: DetailItem[]) => {
    const result = detail_list.reduce(
      (acc, item) => {
        const subTotal = bcMath.fixedNum(item.sub_total);

        if (item.invoice_num === 0) {
          acc.withoutInvoiceTotal = bcMath.add(acc.withoutInvoiceTotal, subTotal);
        } else if (item.invoice_num === 1) {
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

  const { withInvoiceTotal, withoutInvoiceTotal } = calculateTotals(currentItem.detail_list);
  // console.log('withInvoiceTotal:', withInvoiceTotal);
  // console.log('withoutInvoiceTotal:', withoutInvoiceTotal);
  console.log('currentItem:--', currentItem);
  return (
    <>
      <Table
        dataSource={currentItem.detail_list}
        columns={columns}
        pagination={false}
        summary={() => (
          <Table.Summary fixed>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0}>Total Amount</Table.Summary.Cell>
              <Table.Summary.Cell index={2}>{currentItem.total_amount}</Table.Summary.Cell>
            </Table.Summary.Row>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0}>
                Have Invoice
                <br />
                Apply Amount
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2}>
                {withInvoiceTotal ? `${withInvoiceTotal}` : ''}
              </Table.Summary.Cell>
            </Table.Summary.Row>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0}>
                Have Invoice
                <br />
                Payment Amount
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2}>{currentItem.with_invoice_amount}</Table.Summary.Cell>
            </Table.Summary.Row>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0}>
                No Invoice
                <br />
                Apply Amount
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2}>
                {withoutInvoiceTotal ? `${withoutInvoiceTotal}` : ''}
              </Table.Summary.Cell>
            </Table.Summary.Row>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0}>
                No Invoice
                <br />
                Payment Amount
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2}>
                {currentItem.without_invoice_amount}
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        )}
      />
      <Space style={{ marginTop: 20 }}>
        {currentItem.show_pass_button && (
          <SubmitButton
            confirmTitle="确认通过？"
            confirmDesc="您确认要通过吗？"
            key="pass"
            type="primary"
            onConfirm={() => {
              operateHandle('approved');
              console.log('currentItem?.status', currentItem?.status);
            }}
            disabled={currentItem?.status === 'approved' }
          >
            通过
          </SubmitButton>
        )}
        {currentItem.show_reject_button && (
          <SubmitButton
            confirmTitle="确认？"
            confirmDesc="您确认要吗？"
            key="reject"
            type="primary"
            danger
            onConfirm={() => {
              operateHandle('reject');
              console.log('currentItem?.status',currentItem?.status)
            }}
            // disabled={currentItem?.status === 'approved' }
          >
            拒绝
          </SubmitButton>
        )}
      </Space>
      {!isEmpty(officeReceipt) && (
        <div>
          <div style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 12 }}>
            无票打款记录 ｜ 总金额:{' '}
            {find(officeReceipt, { have_invoice: false })?.total_amount ?? 0}
          </div>
          <Table
            pagination={false}
            dataSource={officeReceipt[0].list}
            columns={officeReceiptColumns}
          />
        </div>
      )}

      {officeReceipt.length >= 2 && (
        <div style={{ marginTop: 24 }}>
          <div style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 12 }}>
            有票打款记录 | 总金额：{find(officeReceipt, { have_invoice: true })?.total_amount ?? 0}
          </div>
          <Table
            pagination={false}
            dataSource={officeReceipt[1].list}
            columns={officeReceiptColumns}
          />
        </div>
      )}

      <Modal
        open={openFile}
        width={1000}
        destroyOnClose={true}
        title="附件"
        footer={null}
        onCancel={() => {
          setOpenFile(false);
          setFile('');
        }}
      >
        <UploadFiles value={file} disabled={true} fileLength={file.split(',').length} />
      </Modal>
    </>
  );
}

export default ViewDetail
