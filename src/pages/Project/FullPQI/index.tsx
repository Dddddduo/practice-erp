// 导入依赖
import React, { useEffect, useRef, useState } from 'react';
import { ActionType, ProTable } from '@ant-design/pro-components';
import { Button, Drawer, List, message, Popconfirm, Space } from 'antd';

import {
  getProjectTypeList,
  getProjectStatusList,
  deleteProject,
  getProjectList,
} from '@/services/ant-design-pro/project';
import { getBrandList } from '@/services/ant-design-pro/report';
import Estimate from './components/Estimate';
import FinalAccount from "@/pages/Project/FullPQI/components/FinalAccount";
import LookTotals from "./components/LookTotals";
import Reimbursement from "./components/Reimbursement";
import LookCost from "./components/LookCost";
import { PlusOutlined } from "@ant-design/icons";
import { FormattedMessage, useLocation } from "@@/exports";
import { isEmpty } from "lodash";
import {log, LOG2E} from "mathjs";
import DeleteButton from "@/components/Buttons/DeleteButton";
import {getStateMap, setStateMap, showButtonByType} from "@/utils/utils";
import ViewCost from './components/ViewCost';
import {getUserButtons} from "@/services/ant-design-pro/user";
import SubmitButton from "@/components/Buttons/SubmitButton";
import {InvoiceRequestForm} from "@/components/Finance/InvoiceRequestForm";

const PQIList: React.FC = () => {
  const tableRef = useRef<ActionType>();

  const [brandMap, setBrandMap] = useState<{ [key: string]: any }>({});
  const [projectTypeMap, setProjectTypeMap] = useState<{ [key: string]: any }>([]);
  const [projectStatusMap, setProjectStatusMap] = useState<{ [key: string]: any }>([]);
  const [pqiDrawerVisible, setPqiDrawerVisible] = useState(false);
  const [jsDrawerVisible, setJsDrawerVisible] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);
  const [showTotalDrawer, setShowTotalDrawer] = useState(false)
  const [showReimbursement, setShowReimbursement] = useState(false)
  const [showViewCost, setShowViewCost] = useState(false)
  const [isCreate, setIsCreate] = useState(false)

  const [columnsStateMap, setColumnsStateMap] = useState({});
  const location = useLocation();
  const currentPath = location.pathname;
  const pathname = currentPath.split('/')[currentPath.split('/').length - 1]
  // 根据参数名称获取具体的路由参数
  const queryParams = new URLSearchParams(location.search);
  const quo_no = queryParams.get('quo_no');
  const [showDelBtn, setShowDelBtn] = useState(false)

  const handleDeleteProject = async (projectId) => {
    const hide = message.loading('正在提交...');
    try {
      const result = await deleteProject(projectId)
      hide()
      if (!result.success) {
        message.error('删除失败:' + result.message)
        return
      }

      message.success('删除成功')
      tableRef.current?.reload()
    } catch (error) {
      hide()
      message.error('删除时发生异常:' + (error as Error).message)
    }
  };

  const handlePreviewClick = (id) => {
    window.open("/PDF/PQIPDF?id=" + id, "_blank");
  };


  const columns = [
    {
      title: '项目编号',
      dataIndex: 'project_no',
      valueType: 'text',
      initialValue: quo_no,
    },
    {
      title: '项目品牌',
      dataIndex: 'brand_en',
      valueType: 'select',
      valueEnum: brandMap,
      fieldProps: {
        showSearch: true,
      },
      search: {
        transform: (value) => {
          return {
            brand_id: value,
          };
        },
      },
    },
    {
      title: '项目名称',
      dataIndex: 'project_name',
      valueType: 'text',
    },
    {
      title: '项目类型',
      dataIndex: 'project_type',
      valueType: 'select',
      valueEnum: projectTypeMap,
      search: {
        transform: (value) => {
          return {
            project_type_id: value,
          };
        },
      },
    },
    {
      title: '项目状态',
      dataIndex: 'project_status_cn',
      valueType: 'select',
      valueEnum: projectStatusMap,
      search: {
        transform: (value) => {
          return {
            project_status: value,
          };
        },
      },
    },
    {
      title: <FormattedMessage id="PQI.field.area" defaultMessage="项目面积" />,
      dataIndex: 'area',
      search: false,
      align: 'center',
      render: (dom: any, entity) => {
        return <div>{entity.area + entity.area_unit}</div>;
      },
    },
    {
      title: <FormattedMessage id="PQI.field.comm_at" defaultMessage="开工日期" />,
      dataIndex: 'comm_at',
      search: false,
      align: 'center',
    },
    {
      title: <FormattedMessage id="PQI.field.comp_at" defaultMessage="完工日期" />,
      dataIndex: 'comp_at',
      search: false,
      align: 'center',
    },
    {
      title: <FormattedMessage id="PQI.field.profit_rate" defaultMessage="利润率" />,
      dataIndex: 'profit_rate',
      search: false,
      align: 'center',
      render: (dom: any, entity) => {
        return <div>{entity.reverse_calculate.profit_rate}%</div>;
      },
    },
    {
      title: <FormattedMessage id="PQI.field.contracts" defaultMessage="合同总价(Ex.VAT)" />,
      dataIndex: 'contracts',
      search: false,
      align: 'center',
      render: (dom: any, entity) => {
        return <div>{entity.project_status > 1 ? entity.cost_price : ''}</div>;
      },
    },
    {
      title: <FormattedMessage id="PQI.field.contract" defaultMessage="合同总价(ln.VAT)" />,
      dataIndex: 'contract',
      search: false,
      align: 'center',
      render: (dom: any, entity) => {
        return <div>{entity.project_status > 1 ? (entity.cost_price * 1.09).toFixed(2) : ''}</div>;
      },
    },
    {
      title: <FormattedMessage id="PQI.field.contract_total_price" defaultMessage="利润" />,
      dataIndex: 'contract_total_price',
      search: false,
      align: 'center',
      render: (dom: any, entity) => {
        return (
          <div>
            {entity.contract_profit_rate
              ? ((entity.contract_profit_rate * entity.cost_price) / 100).toFixed(2)
              : ''}
          </div>
        );
      },
    },
    {
      title: <FormattedMessage id="PQI.field. contract_profit_rate" defaultMessage="利润率" />,
      dataIndex: 'contract_profit_rate',
      search: false,
      align: 'center',
      render: (dom: any, entity) => {
        return <div>{entity.contract_profit_rate ? entity.contract_profit_rate + '%' : ''}</div>;
      },
    },
    {
      title: <FormattedMessage id="PQI.field.invoice_rate" defaultMessage="开户开票%" />,
      dataIndex: 'invoice_rate',
      search: false,
      align: 'center',
    },
    {
      title: <FormattedMessage id="PQI.field.vo_collect_rate" defaultMessage="客户收款%" />,
      dataIndex: 'collect_rate',
      search: false,
      align: 'center',
    },
    {
      title: <FormattedMessage id="PQI.field.supplier_name" defaultMessage="名称" />,
      dataIndex: 'supplier_name',
      search: false,
      align: 'center',
      render: (dom: any, entity) => {
        return <div>{entity.supplier_list.supplier_name}</div>;
      },
    },
    {
      title: <FormattedMessage id="PQI.field.cost_price" defaultMessage="成本价" />,
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
                <List.Item.Meta description={item.cost_price} />
              </List.Item>
            )}
          />
        );
      },
    },
    {
      title: <FormattedMessage id="PQI.field.get_invoice_price" defaultMessage="应付金额" />,
      dataIndex: 'get_invoice_price',
      search: false,
      align: 'center',
      render: (dom: any, entity) => {
        return (
          <List
            itemLayout="horizontal"
            dataSource={entity.supplier_list}
            renderItem={(item, index) => (
              <List.Item>
                <List.Item.Meta description={item.get_invoice_price} />
              </List.Item>
            )}
          />
        );
      },
    },
    {
      title: <FormattedMessage id="PQI.field.payment_price" defaultMessage="实付金额" />,
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
                <List.Item.Meta description={item.payment_price} />
              </List.Item>
            )}
          />
        );
      },
    },
    {
      title: <FormattedMessage id="PQI.field.vo_total_collect_price" defaultMessage="已收款" />,
      dataIndex: 'vo_total_collect_price',
      search: false,
      align: 'center',
      render: (dom, entity) => {
        return <div>{Number(entity.vo_total_collect_price).toFixed(2)}</div>;
      },
    },
    {
      title: <FormattedMessage id="PQI.field.total_vo_cost_price" defaultMessage="供应商成本价" />,
      dataIndex: 'total_vo_cost_price',
      search: false,
      align: 'center',
      render: (dom, entity) => {
        return <div>{Number(entity.total_vo_cost_price).toFixed(2)}</div>;
      },
    },
    {
      title: <FormattedMessage id="PQI.field.vo_profit_price" defaultMessage="利润" />,
      dataIndex: 'vo_profit_price',
      search: false,
      align: 'center',
    },
    {
      title: <FormattedMessage id="PQI.field.create_at" defaultMessage="创建日期" />,
      dataIndex: 'create_at',
      align: 'center',
      valueType: 'dateRange',
      render: (dom: any, entity) => {
        return <>{entity.create_at}</>;
      },
    },
    {
      title: <FormattedMessage id="PQI.field.operator" defaultMessage="操作人" />,
      dataIndex: 'user_name',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'option',
      search: false,
      align: 'center',
      fixed: 'right',
      width: 350,
      render: (_, record) => {
        return (
        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
          <Space wrap style={{ width: '100%' }}>
            <Button
              key="estimate"
              onClick={() => {
                setCurrentRow(record);
                setIsCreate(false);
                setPqiDrawerVisible(true);
              }}
            >
              项目预估
            </Button>
            <Button
              key="finalAccount"
              onClick={() => {
                setCurrentRow(record);
                setJsDrawerVisible(true);
              }}
            >
              决算开票
            </Button>
            <Button
              key="viewCost"
              onClick={() => {
                setCurrentRow(record);
                setShowViewCost(true);
              }}
            >
              查看成本
            </Button>
          </Space>
          <Space wrap style={{ width: '100%' }}>
            <Button
              key="reimbursement"
              onClick={() => {
                setCurrentRow(record);
                setShowReimbursement(true);
              }}
            >
              报销
            </Button>
            <Button
              key="viewTotal"
              onClick={() => {
                setCurrentRow(record);
                setShowTotalDrawer(true);
              }}
            >
              最终决算
            </Button>
            <Button key="preview" onClick={() => handlePreviewClick(record.id)}>
              预览
            </Button>
            {showDelBtn && (
              <DeleteButton
                type="primary"
                danger
                key="delPopconfirm"
                onConfirm={() => handleDeleteProject(record.id)}
              >
                删除
              </DeleteButton>
            )}
          </Space>
        </Space>
        )
      },
    },
  ];

  useEffect(() => {
    getBrandList().then(res => {
      if (res.success) {
        const brandMap = {};
        res.data.forEach(item => {
          brandMap[item.id] = item.brand_en;
        });
        setBrandMap(brandMap);
      }
    });

    getProjectTypeList().then(res => {
      if (res.success) {
        let projectTypeMap = {};
        res.data.forEach(item => {
          projectTypeMap[item.project_type_id] = item.project_type;
        });
        setProjectTypeMap(projectTypeMap);
      }
    });

    getProjectStatusList().then(res => {
      if (res.success) {
        let projectStatusMap = {};
        res.data.forEach(item => {
          projectStatusMap[item.project_status_id] = item.project_status;
        });
        setProjectStatusMap(projectStatusMap);
      }
    });
  }, []);

  const handleEstimateClose = (isReload = false) => {
    setPqiDrawerVisible(false)
    setCurrentRow(null);
    setIsCreate(false)
    if (isReload) {
      tableRef.current?.reload()
    }
  }

  useEffect(() => {
    setColumnsStateMap(getStateMap(pathname))
    getUserButtons({module: 'fullPQI-list-del', pos: 'tableList'}).then(r => {
      if (r.success) {
        if (r.data.length > 0 && r?.data[0].name === 'pqiListDeleteBtn') {
          setShowDelBtn(true)
        }
      }
    })
  }, [])

  return (
    <>
      <ProTable
        actionRef={tableRef}
        scroll={{ x: 'max-content' }}
        columns={columns}
        request={(params, sorter, filter) => getProjectList({ ...params, page: params.current, page_size: params.pageSize }).then((res) => ({
          data: res.data.list,
          success: true,
          total: res.data.total,
        }))}
        toolBarRender={() => [
          <Button
            type="primary"
            key="create"
            onClick={() => {
              setIsCreate(true)
              setPqiDrawerVisible(true)
              setCurrentRow(null);
            }}
          >
            <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          </Button>,
        ]}
        rowKey="id"
        columnsState={{
          value: columnsStateMap,
          onChange: (newState) => {
            setColumnsStateMap(newState)
            setStateMap(pathname, newState)
          }
        }}
      />
      <Drawer
        key="pqi"
        title="项目预估(PQI)"
        onClose={() => handleEstimateClose()}
        open={pqiDrawerVisible}
        width="80%"
        destroyOnClose={true}
      >
        <Estimate
          brandMap={brandMap}
          projectTypeMap={projectTypeMap}
          projectStatusMap={projectStatusMap}
          currentRow={isEmpty(currentRow) ? {} : currentRow}
          isCreate={isCreate}
          onClose={handleEstimateClose}
        />
      </Drawer>
      <Drawer
        key="js"
        title="决算(JS)"
        // tableRef
        onClose={() => {
          setJsDrawerVisible(false)
          tableRef.current?.reload()
        }}
        open={jsDrawerVisible}
        width="90%"
        destroyOnClose={true}
      >
        <FinalAccount
          brandMap={brandMap}
          projectTypeMap={projectTypeMap}
          projectStatusMap={projectStatusMap}
          currentRow={currentRow}
        />
      </Drawer>
      <Drawer
        key="total"
        width="80%"
        open={showTotalDrawer}
        onClose={() => {
          setShowTotalDrawer(false)
          setCurrentRow(null)
        }}
        destroyOnClose={true}
        title="最终决算"
      >
        <LookTotals
          currentMsg={currentRow}
        />
      </Drawer>

      <Drawer
        width="80%"
        open={showReimbursement}
        onClose={() => {
          setShowReimbursement(false)
        }}
        destroyOnClose={true}
        title="创建申请"
      >
        <Reimbursement
          handleClose={() => {
            setCurrentRow(null)
            setShowReimbursement(false)
          }}
          currentMsg={currentRow}
          actionRef={tableRef}
          type="reimbursement"
          handlereimbursement={() => {
            setCurrentRow(null)
            setShowReimbursement(false)
          }}
        />
      </Drawer>

      <Drawer
        width="95vw"
        title="查看成本"
        open={showViewCost}
        onClose={() => {
          setShowViewCost(false)
          setCurrentRow(null)
        }}
        destroyOnClose={true}
      >
        {/* <LookCost
          currentMsg={currentRow}
          actionRef={tableRef}
        /> */}
        <ViewCost
          currentMsg={currentRow}
        />
      </Drawer>
    </>
  );
};

export default PQIList;
