import React, { useEffect, useState } from "react";
import { ParamsType } from "@ant-design/pro-components";
import { FormattedMessage, useIntl } from '@umijs/max';
import { ProColumns, ProTable } from "@ant-design/pro-components";
import { Button, List } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { getBrandList } from "@/services/ant-design-pro/report";
import { getProjectTypeList, getProjectStatusList, deleteProject } from "@/services/ant-design-pro/project";
import { Popconfirm } from "antd";
import { Drawer } from "antd";
import AddPQI from "./AddPQI";
import LookCost from "./LookCost";
import LookTotals from "./LookTotals";
import PaymentEntry from "./PaymentEntry";
import Reimbursement from "./Reimbursement";
import FinalInvoice from "./FinalInvoice";

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
interface ItemListProps {
    onListData: HandleListDataFunc;
    actionRef,
    success: (text: string) => void,
    error: (text: string) => void
}
const ItemList: React.FC<ItemListProps> = ({
    onListData,
    actionRef,
    success,
    error
}) => {
    const intl = useIntl()
    // 品牌
    const [brandList, setBrandList]: any = useState([])
    // 类型
    const [typeList, setTypeList]: any = useState()
    // 状态
    const [statusList, setStatusList]: any = useState()
    // 抽屉
    const [showDetailDrawer, setShowDetailDrawer] = useState(false)
    const [currentMsg, setCurrentMsg] = useState()

    // 查看成本
    const [showcostDrawer, setShowcostDrawer] = useState(false)

    //查看总计
    const [showtotaltDrawer, setshoWtotaltDrawer] = useState(false)

    // 报销
    const [showreimbursement, setShowreimbursement] = useState(false)

    // 决算
    const [showFinallInvoice, setShowFinallInvoice] = useState(false)

    const columns: ProColumns<API.PQI>[] = [
        {
            title: (
                <FormattedMessage
                    id="PQI.field.project_no"
                    defaultMessage="项目编号"
                />
            ),
            dataIndex: 'project_no',
            align: 'center'
        },
        {
            title: (
                <FormattedMessage
                    id="PQI.field.brand_en"
                    defaultMessage="项目品牌"
                />
            ),
            dataIndex: 'brand_en',
            align: 'center',
            valueType: 'select',
            valueEnum: brandList?.reduce((acc, item) => {
                acc[`${item.id}`] = { text: item.brand_en };
                return acc;
            }, {}),
        },
        {
            title: (
                <FormattedMessage
                    id="PQI.field.project_name"
                    defaultMessage="项目名称"
                />
            ),
            dataIndex: 'project_name',
            align: 'center'
        },
        {
            title: (
                <FormattedMessage
                    id="PQI.field.project_type"
                    defaultMessage="项目类型"
                />
            ),
            dataIndex: 'project_type',
            align: 'center',
            valueEnum: typeList?.reduce((acc, item) => {
                acc[`${item.project_type_id}`] = { text: item.project_type };
                return acc;
            }, {}),
        },
        {
            title: (
                <FormattedMessage
                    id="PQI.field.project_status_cn"
                    defaultMessage="项目状态"
                />
            ),
            dataIndex: 'project_status_cn',
            align: 'center',
            valueType: 'select',
            valueEnum: statusList?.reduce((acc, item) => {
                acc[`${item.project_status_id}`] = { text: item.project_status };
                return acc;
            }, {}),
        },
        {
            title: (
                <FormattedMessage
                    id="PQI.field.area"
                    defaultMessage="项目面积"
                />
            ),
            dataIndex: 'area',
            search: false,
            align: 'center',
            render: (dom: any, entity) => {
                return (
                    <div>
                        {entity.area + entity.area_unit}
                    </div>
                )
            }
        },
        {
            title: (
                <FormattedMessage
                    id="PQI.field.comm_at"
                    defaultMessage="开工日期"
                />
            ),
            dataIndex: 'comm_at',
            search: false,
            align: 'center',
        },
        {
            title: (
                <FormattedMessage
                    id="PQI.field.comp_at"
                    defaultMessage="完工日期"
                />
            ),
            dataIndex: 'comp_at',
            search: false,
            align: 'center'
        },
        {
            title: (
                <FormattedMessage
                    id="PQI.field.profit_rate"
                    defaultMessage="利润率"
                />
            ),
            dataIndex: 'profit_rate',
            search: false,
            align: 'center',
            render: (dom: any, entity) => {
                return (
                    <div>
                        {
                            entity.reverse_calculate.profit_rate
                        }
                        %
                    </div>
                )
            }
        },
        {
            title: (
                <FormattedMessage
                    id="PQI.field.create_at"
                    defaultMessage="创建日期"
                />
            ),
            dataIndex: 'create_at',
            align: 'center',
            valueType: 'dateRange',
            render: (dom: any, entity) => {
                return (
                    <>{entity.create_at}</>
                )
            }
        },
        {
            title: (
                <FormattedMessage
                    id="PQI.field.update_at"
                    defaultMessage="最后修改日期"
                />
            ),
            dataIndex: 'update_at',
            search: false,
            align: 'center'
        },
        {
            title: (
                <FormattedMessage
                    id="PQI.field.contracts"
                    defaultMessage="合同总价(Ex.VAT)"
                />
            ),
            dataIndex: 'contracts',
            search: false,
            align: 'center',
            render: (dom: any, entity) => {
                return (
                    <div>
                        {entity.project_status > 1 ? entity.cost_price : ''}
                    </div>
                )
            }
        },
        {
            title: (
                <FormattedMessage
                    id="PQI.field.contract"
                    defaultMessage="合同总价(ln.VAT)"
                />
            ),
            dataIndex: 'contract',
            search: false,
            align: 'center',
            render: (dom: any, entity) => {
                return (
                    <div>
                        {entity.project_status > 1 ? (entity.cost_price * 1.09).toFixed(2) : ''}
                    </div>
                )
            }
        },
        {
            title: (
                <FormattedMessage
                    id="PQI.field.contract_total_price"
                    defaultMessage="利润"
                />
            ),
            dataIndex: 'contract_total_price',
            search: false,
            align: 'center',
            render: (dom: any, entity) => {
                return (
                    <div>
                        {
                            entity.contract_profit_rate ? (entity.contract_profit_rate * entity.cost_price / 100).toFixed(2) : ''
                        }
                    </div>
                )
            }
        },
        {
            title: (
                <FormattedMessage
                    id="PQI.field. contract_profit_rate"
                    defaultMessage="利润率"
                />
            ),
            dataIndex: 'contract_profit_rate',
            search: false,
            align: 'center',
            render: (dom: any, entity) => {
                return (
                    <div>
                        {entity.contract_profit_rate ? entity.contract_profit_rate + '%' : ''}
                    </div>
                )
            }
        },
        {
            title: (
                <FormattedMessage
                    id="PQI.field.invoice_rate"
                    defaultMessage="开户开票%"
                />
            ),
            dataIndex: 'invoice_rate',
            search: false,
            align: 'center'
        },
        {
            title: (
                <FormattedMessage
                    id="PQI.field.vo_collect_rate"
                    defaultMessage="客户收款%"
                />
            ),
            dataIndex: 'collect_rate',
            search: false,
            align: 'center'
        },
        {
            title: (
                <FormattedMessage
                    id="PQI.field.supplier_name"
                    defaultMessage="名称"
                />
            ),
            dataIndex: 'supplier_name',
            search: false,
            align: 'center',
            render: (dom: any, entity) => {
                return (
                    <div>
                        {entity.supplier_list.supplier_name}
                    </div>
                )
            }
        },
        {
            title: (
                <FormattedMessage
                    id="PQI.field.cost_price"
                    defaultMessage="成本价"
                />
            ),
            dataIndex: 'cost_price',
            search: false,
            align: 'center',
            render: (dom: any, entity) => {
                return (
                    <List
                        itemLayout="horizontal"
                        dataSource={entity.supplier_list}
                        renderItem={(item, index) => (
                            <List.Item>
                                <List.Item.Meta
                                    description={item.cost_price}
                                />
                            </List.Item>
                        )}
                    />
                )
            }
        },
        {
            title: (
                <FormattedMessage
                    id="PQI.field.get_invoice_price"
                    defaultMessage="应付金额"
                />
            ),
            dataIndex: 'get_invoice_price',
            search: false,
            align: 'center',
            render: (dom: any, entity) => {
                return (
                    <List
                        itemLayout="horizontal"
                        dataSource={entity.supplier_list}
                        renderItem={(item, index) => (
                            <List.Item >
                                <List.Item.Meta
                                    description={item.get_invoice_price}
                                />
                            </List.Item>
                        )}
                    />
                )
            }
        },
        {
            title: (
                <FormattedMessage
                    id="PQI.field.payment_price"
                    defaultMessage="实付金额"
                />
            ),
            dataIndex: 'payment_price',
            search: false,
            align: 'center',
            render: (dom: any, entity) => {
                return (
                    <List
                        itemLayout="horizontal"
                        dataSource={entity.supplier_list}
                        renderItem={(item, index) => (
                            <List.Item>
                                <List.Item.Meta
                                    description={item.payment_price}
                                />
                            </List.Item>
                        )}
                    />
                )
            }
        },
        {
            title: (
                <FormattedMessage
                    id="PQI.field.vo_total_collect_price"
                    defaultMessage="已收款"
                />
            ),
            dataIndex: 'vo_total_collect_price',
            search: false,
            align: 'center',
            render: (dom, entity) => {

                return (
                    <div>
                        {Number(entity.vo_total_collect_price).toFixed(2)}
                    </div>
                )

            }
        },
        {
            title: (
                <FormattedMessage
                    id="PQI.field.total_vo_cost_price"
                    defaultMessage="供应商成本价"
                />
            ),
            dataIndex: 'total_vo_cost_price',
            search: false,
            align: 'center',
            render: (dom, entity) => {

                return (
                    <div>
                        {Number(entity.total_vo_cost_price).toFixed(2)}
                    </div>
                )

            }

        },
        {
            title: (
                <FormattedMessage
                    id="PQI.field.vo_profit_price"
                    defaultMessage="利润"
                />
            ),
            dataIndex: 'vo_profit_price',
            search: false,
            align: 'center'
        },
        {
            title: (
                <FormattedMessage
                    id="PQI.field.Project_manager_salary_total_price"
                    defaultMessage="Project manager Salary"
                />
            ),
            dataIndex: 'Project_manager_salary_total_price',
            search: false,
            align: 'center',
            render: (dom: any, entity) => {
                return (
                    <div>
                        {(entity.Project_manager_salary_total_price)}RMB/day
                    </div>
                )
            }
        },
        {
            title: (
                <FormattedMessage
                    id="PQI.field.Project_manager_bonus_total_price"
                    defaultMessage="Project manager Bonus"
                />
            ),
            dataIndex: 'Project_manager_bonus_total_price',
            search: false,
            align: 'center',
            render: (dom, entity) => {

                return (
                    <div>
                        {Number(entity.Project_manager_bonus_total_price).toFixed(2)}
                    </div>
                )

            }
        },
        {
            title: (
                <FormattedMessage
                    id="PQI.field.total_travel_cost_price"
                    defaultMessage="Travel Cost"
                />
            ),
            dataIndex: 'total_travel_cost_price',
            search: false,
            align: 'center',
            render: (dom, entity) => {

                return (
                    <div>
                        {Number(entity.total_travel_cost_price).toFixed(2)}
                    </div>
                )

            }
        },
        {
            title: (
                <FormattedMessage
                    id="PQI.field.other_incidental_expenses_total_price"
                    defaultMessage="Other Incidental Expenses"
                />
            ),
            dataIndex: 'other_incidental_expenses_total_price',
            search: false,
            align: 'center',
            render: (dom, entity) => {

                return (
                    <div>
                        {Number(entity.other_incidental_expenses_total_price).toFixed(2)}
                    </div>
                )

            }
        },
        {
            title: (
                <FormattedMessage
                    id="PQI.field.final_price"
                    defaultMessage="结余"
                />
            ),
            dataIndex: 'final_price',
            search: false,
            align: 'center',
            render: (dom, entity) => {
                return (
                    <div>
                        {Number(entity.final_price).toFixed(2)}
                    </div>
                )

            }
        },

        {
            title: (
                <FormattedMessage
                    id="PQI.field.operate"
                    defaultMessage="操作"
                />
            ),
            dataIndex: 'operate',
            search: false,
            align: 'center',
            fixed: 'right',
            width: 350,
            render: (dom, entity) => {
                return (
                    <>
                        <Button
                            type="primary"
                            style={{ marginRight: 10 }}
                            onClick={() => {
                                openDetailDarwer(entity)
                            }}
                        >项目预估</Button>
                        <Button type="primary" style={{ marginRight: 10 }} onClick={() => {
                            setShowFinallInvoice(true)
                            setCurrentMsg(entity)
                        }}>决算开票</Button>
                        <Button type="primary" style={{ marginRight: 10 }} onClick={() => {
                            setShowcostDrawer(true)
                            setCurrentMsg(entity)
                        }}>查看成本</Button>
                        <Button type="primary" style={{ marginRight: 10, marginTop: 20 }} onClick={() => {
                            setShowreimbursement(true)
                            setCurrentMsg(entity)
                        }}>&nbsp;报销&nbsp;</Button>
                        <Button type="primary" style={{ marginRight: 10 }} onClick={() => {
                            setshoWtotaltDrawer(true)
                            setCurrentMsg(entity)
                        }}>查看总计</Button>
                        <Button type="primary" style={{ marginRight: 10 }} onClick={() => {
                            window.open("/PDF/PQIPDF?id=" + entity.id, "_blank")
                        }}>&nbsp;预览&nbsp;</Button>
                        <Popconfirm
                            title="警告"
                            description="确定要删除吗"
                            okText="确定"
                            cancelText="取消"
                            onConfirm={() => {
                                handleConfirm(entity)
                            }}

                        >
                            <Button type="primary" style={{ marginRight: 20, marginTop: 15 }}>删除</Button>
                        </Popconfirm>

                    </>
                )
            }
        },
    ]
    const handleConfirm = (e) => {
        console.log(e);

        deleteProject(e.id).then((res) => {
            if (res.success) {
                actionRef?.current.reload()
                success('删除成功')
                return
            }
            error(res.message)
        })
    }
    const openDetailDarwer = (e) => {
        setCurrentMsg(e)
        setShowDetailDrawer(true)
    }
    const handleClose = () => {
        setCurrentMsg(undefined)
        setShowDetailDrawer(false)
    }

    // 查看成本
    const handleCost = () => {
        setShowcostDrawer(false)
        setCurrentMsg({})
    }

    //查看总计 handletotal
    const handletotal = () => {
        setshoWtotaltDrawer(false)
        setCurrentMsg({})
    }

    // 报销
    const handlereimbursement = () => {
        setShowreimbursement(false)
    }

    const handleFinallInvoice = () => {
        setCurrentMsg({})
        setShowFinallInvoice(false)
    }

    useEffect(() => {
        getBrandList().then(res => {
            setBrandList(Object.keys(res.data).map(key => res.data[key]))
        })
        getProjectTypeList().then(res => {
            setTypeList(res.data)
        })
        getProjectStatusList().then(res => {
            setStatusList(res.data)
        })
    }, [])
    return (
        <>
            <ProTable<API.PQI, API.PageParams>
                headerTitle={intl.formatMessage({
                    id: 'PQI.table.title',
                    defaultMessage: 'table list',
                })}
                actionRef={actionRef}
                scroll={{ x: 'max-content' }}

                toolBarRender={() => [
                    <Button
                        type="primary"
                        key="primary"
                        onClick={() => {
                            setShowDetailDrawer(true)
                        }}
                    >
                        <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
                    </Button>,
                ]}
                columnEmptyText
                columns={columns}
                request={onListData}
            />
            <Drawer
                width={1600}
                title="PQI"
                open={showDetailDrawer}
                onClose={handleClose}
                destroyOnClose={true}
            >
                <AddPQI
                    currentMsg={currentMsg}
                    handleClose={handleClose}
                    actionRef={actionRef}
                    success={success}
                    brandList={brandList}
                    error={error}
                    typeList={typeList}
                    statusList={statusList}
                />
            </Drawer>
            <Drawer
                width={1800}
                title="查看成本"
                open={showcostDrawer}
                onClose={handleCost}
                destroyOnClose={true}
            >
                <LookCost
                    handleClose={handleClose}
                    currentMsg={currentMsg}
                    actionRef={actionRef}
                    success={success}
                    error={error}
                />
            </Drawer>

            <Drawer
                width={800}
                open={showtotaltDrawer}
                onClose={handletotal}
                destroyOnClose={true}
                title="查看总计"
            >
                <LookTotals
                    currentMsg={currentMsg}
                    actionRef={actionRef}
                    success={success}
                    error={error}
                />
            </Drawer>

            <Drawer
                width={1400}
                open={showreimbursement}
                onClose={handlereimbursement}
                destroyOnClose={true}
                title="创建申请"
            >
                <Reimbursement
                    handleClose={handleClose}
                    currentMsg={currentMsg}
                    actionRef={actionRef}
                    success={success}
                    error={error}
                    type="reimbursement"
                    handlereimbursement={handlereimbursement}
                />
            </Drawer>

            <Drawer
                width={1600}
                open={showFinallInvoice}
                onClose={handleFinallInvoice}
                destroyOnClose={true}
                title="决算"
            >
                <FinalInvoice
                    currentMsg={currentMsg}
                    actionRef={actionRef}
                    success={success}
                    error={error}
                />
            </Drawer>
        </>
    )
}
export default ItemList
