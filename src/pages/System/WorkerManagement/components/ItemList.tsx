import { ParamsType, ProTable, ProColumns } from "@ant-design/pro-components";
import { useIntl, FormattedMessage } from "@umijs/max";
import { Button, Drawer, Space, Tag } from "antd";
import {useEffect, useState} from "react";
import { PlusOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import AddSystem from "./AddSystem";
import BaseIndex from "./BaseIndex";
import { approval } from "@/services/ant-design-pro/system";
import ShopPermission from "@/pages/System/WorkerManagement/components/ShopPermission";
import Detail from "./Detail";
import Score from "./Score";
import {getStateMap, setStateMap} from "@/utils/utils";
import {useLocation} from "@@/exports";
import BaseContainer, {ModalType} from "@/components/Container";
import {isEmpty} from "lodash";
import CreateComplaint from "@/pages/System/WorkerManagement/components/CreateComplaint";

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
  success: (text: string) => void
  error: (text: string) => void
  actionRef
}

const ItemList: React.FC<ItemListProps> = ({
  onListData,
  success,
  error,
  actionRef
}) => {

  const intl = useIntl()
  // 抽屉
  const [showDetailDrawer, setShowDetailDrawer] = useState(false)
  const [showBaseIndex, setShowBaseIndex] = useState(false)
  const [title, setTitle] = useState('')
  const [currentMsg, setCurrentMsg] = useState({})
  const [showShopPermission, setShowShopPermission] = useState(false)
  const [showDetail, setShowDetail] = useState(false)
  const [showScore, setShowScore] = useState(false)
  const [columnsStateMap, setColumnsStateMap] = useState({});
  const location = useLocation();
  const currentPath = location.pathname;
  const pathname = currentPath.split('/')[currentPath.split('/').length - 1]
  const [openComplaint, setOpenComplaint] = useState(false)
  const columns: ProColumns<API.WorkerManagement>[] = [
    {
      title: (
        <FormattedMessage
          id="WorkerManagement.field.worker_id"
          defaultMessage="ID"
        />
      ),
      dataIndex: 'worker_id',
      search: false,
      align: 'center'
    },
    {
      title: (
        <FormattedMessage
          id="WorkerManagement.field.worker_name"
          defaultMessage="姓名"
        />
      ),
      dataIndex: 'worker_name',
      align: 'center'
    },
    {
      title: (
        <FormattedMessage
          id="WorkerManagement.field.worker_mobile"
          defaultMessage="手机号"
        />
      ),
      dataIndex: 'worker_mobile',
      align: 'center'
    },
    {
      title: (
        <FormattedMessage
          id="WorkerManagement.field.worker_role"
          defaultMessage="角色"
        />
      ),
      dataIndex: 'worker_role',
      search: false,
      align: 'center'
    },
    {
      title: (
        <FormattedMessage
          id="WorkerManagement.field.id_card"
          defaultMessage="身份证号"
        />
      ),
      dataIndex: 'id_card',
      search: false,
      align: 'center',
      render: (dom: any, entity) => {
        return (
          <div>
            {
              entity.certificate_list.id_card === "n" ?
                <CloseOutlined style={{ color: 'red' }} /> :
                <CheckOutlined style={{ color: 'green' }} />
            }
          </div>
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="WorkerManagement.field.health_report"
          defaultMessage="健康报告"
        />
      ),
      dataIndex: 'health_report',
      search: false,
      align: 'center',
      render: (dom: any, entity) => {
        return (
          <div>
            {
              entity.certificate_list.health_report === "n" ?
                <CloseOutlined style={{ color: 'red' }} /> :
                <CheckOutlined style={{ color: 'green' }} />
            }
          </div>
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="WorkerManagement.field.bank_info"
          defaultMessage="银行卡信息"
        />
      ),
      dataIndex: 'bank_info',
      search: false,
      align: 'center',
      render: (dom: any, entity) => {
        return (
          <div>
            {
              entity.certificate_list.bank_info === "n" ?
                <CloseOutlined style={{ color: 'red' }} /> :
                <CheckOutlined style={{ color: 'green' }} />
            }
          </div>
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="WorkerManagement.field.electrician_certificate"
          defaultMessage="电工证"
        />
      ),
      dataIndex: 'electrician_certificate',
      search: false,
      align: 'center',
      render: (dom: any, entity) => {
        return (
          <div>
            {
              entity.certificate_list.electrician_certificate === "n" ?
                <CloseOutlined style={{ color: 'red' }} /> :
                <CheckOutlined style={{ color: 'green' }} />
            }
          </div>
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="WorkerManagement.field.high_altitude_certificate"
          defaultMessage="高空证"
        />
      ),
      dataIndex: 'high_altitude_certificate',
      search: false,
      align: 'center',
      render: (dom: any, entity) => {
        return (
          <div>
            {
              entity.certificate_list.high_altitude_certificate === "n" ?
                <CloseOutlined style={{ color: 'red' }} /> :
                <CheckOutlined style={{ color: 'green' }} />
            }
          </div>
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="WorkerManagement.field.refrigeration_certificate"
          defaultMessage="制冷证"
        />
      ),
      dataIndex: 'refrigeration_certificate',
      search: false,
      align: 'center',
      render: (dom: any, entity) => {
        return (
          <div>
            {
              entity.certificate_list.refrigeration_certificate === "n" ?
                <CloseOutlined style={{ color: 'red' }} /> :
                <CheckOutlined style={{ color: 'green' }} />
            }
          </div>
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="WorkerManagement.field.policy"
          defaultMessage="保险单"
        />
      ),
      dataIndex: 'policy',
      search: false,
      align: 'center',
      render: (dom: any, entity) => {
        return (
          <div>
            {
              entity.certificate_list.policy === "n" ?
                <CloseOutlined style={{ color: 'red' }} /> :
                <CheckOutlined style={{ color: 'green' }} />
            }
          </div>
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="WorkerManagement.field.count"
          defaultMessage="维修订单数"
        />
      ),
      dataIndex: 'count',
      search: false,
      align: 'center',
      render: (dom: any, entity) => {
        return (
          <div>
            {entity.worker_score_list.count}
          </div>
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="WorkerManagement.field.wxzl"
          defaultMessage="维修质量"
        />
      ),
      dataIndex: 'wxzl',
      search: false,
      align: 'center',
      render: (dom: any, entity) => {
        return (
          <div>
            {Number(entity.worker_score_list.wxzl).toFixed(2)}
          </div>
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="WorkerManagement.field.wxsd"
          defaultMessage="维修速度"
        />
      ),
      dataIndex: 'wxsd',
      search: false,
      align: 'center',
      render: (dom: any, entity) => {
        return (
          <div>
            {Number(entity.worker_score_list.wxsd).toFixed(2)}
          </div>
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="WorkerManagement.field.fwtd"
          defaultMessage="服务态度"
        />
      ),
      dataIndex: 'fwtd',
      search: false,
      align: 'center',
      render: (dom: any, entity) => {
        return (
          <div>
            {Number(entity.worker_score_list.fwtd).toFixed(2)}
          </div>
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="WorkerManagement.field.smzsd"
          defaultMessage="准时上门"
        />
      ),
      dataIndex: 'smzsd',
      search: false,
      align: 'center',
      render: (dom: any, entity) => {
        return (
          <div>
            {Number(entity.worker_score_list.smzsd).toFixed(2)}
          </div>
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="WorkerManagement.field.yryb"
          defaultMessage="仪容仪表"
        />
      ),
      dataIndex: 'yryb',
      search: false,
      align: 'center',
      render: (dom: any, entity) => {
        return (
          <div>
            {Number(entity.worker_score_list.yryb).toFixed(2)}
          </div>
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="SupplierManagement.field.average"
          defaultMessage="平均分"
        />
      ),
      dataIndex: 'average',
      search: false,
      align: 'center',
      render: (dom: any, entity) => {
        return (
          <>
            <div>
              {Number(entity.worker_score_list.wxzl + entity.worker_score_list.wxsd + entity.worker_score_list.fwtd + entity.worker_score_list.smzsd + entity.worker_score_list.yryb / 5).toFixed(2)}
            </div>
          </>

        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="WorkerManagement.field.complaint_count"
          defaultMessage="投诉数量"
        />
      ),
      dataIndex: 'complaint_count',
      search: false,
      align: 'center'
    },
    {
      title: (
        <FormattedMessage
          id="WorkerManagement.field.worker_status"
          defaultMessage="状态"
        />
      ),
      dataIndex: 'worker_status',
      search: false,
      align: 'center',
      render: (dom: any, entity) => {
        return (
          <div>
            {
              entity.worker_status === 1 ?
                <Tag color="green">启用</Tag> :
                <Tag color="red">禁用</Tag>
            }
          </div>
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="brandManagement.field.operate"
          defaultMessage="操作"
        />
      ),
      dataIndex: 'operate',
      align: "center",
      search: false,
      render: (dom: any, entity) => {
        return (
          <Space>
            <Button type="primary" onClick={() => {
              setShowShopPermission(true)
              setCurrentMsg(entity)
            }}>
              店铺权限
            </Button>
            <Button
              type="primary"
              onClick={() => {
                setShowBaseIndex(true)
                setCurrentMsg(entity)
              }}
            >
              基础指标
            </Button>
            <Button type="primary"
              onClick={() => {
                openDetailDarwer(entity)
              }}
            >编辑</Button>
            <Button
              type="primary"
              style={{
                backgroundColor: entity.worker_status ? 'red' : 'green'
              }}
              onClick={() => {
                approval({ status: entity.worker_status ? 0 : 1 }, entity.worker_id).then(res => {
                  if (res.success) {
                    actionRef.current.reload()
                    success('修改成功')
                    return
                  }
                  error(res.message)
                })
              }}
            >
              {
                entity.worker_status ? '禁用' : '启用'
              }
            </Button>
            <Button type="primary" onClick={() => {
              setShowDetail(true)
              setCurrentMsg(entity)
            }}>查看</Button>
            <Button type="primary" onClick={() => {
              setShowScore(true)
              setCurrentMsg(entity)
            }}>评分</Button>
          </Space>
        )
      }
    },
  ]
  const openDetailDarwer = (e) => {
    setCurrentMsg(e)
    setShowDetailDrawer(true)
    setTitle('编辑人员')
  }

  const handleClose = () => {
    setCurrentMsg({})
    setShowDetailDrawer(false)
  }

  const handleCloseBaseIndex = () => {
    setShowBaseIndex(false)
    setCurrentMsg({})
  }

  const handleShopPermissionClose = () => {
    setCurrentMsg({})
    setShowShopPermission(false)
  }

  const handleCloseDetail = () => {
    setShowDetail(false)
    setCurrentMsg({})
  }

  const handleCloseScore = () => {
    setShowScore(false)
    setCurrentMsg({})
  }

  const handleCloseComplaint = () => {
    setOpenComplaint(false)
  }

  useEffect(() => {
    setColumnsStateMap(getStateMap(pathname))
  }, []);

  return (
    <>
      <ProTable<API.WorkerManagement, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'WorkerManagement.table.title',
          defaultMessage: 'table list',
        })}
        actionRef={actionRef}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setOpenComplaint(true)
            }}
          >
            <PlusOutlined /> 投诉/返工
          </Button>,
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setShowDetailDrawer(true);
              setTitle('新增人员')
            }}
          >
            <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          </Button>,
        ]}

        scroll={{ x: 'max-content' }}
        columnEmptyText={false}
        columns={columns}
        request={onListData}
        columnsState={{
          value: columnsStateMap,
          onChange: (newState) => {
            setColumnsStateMap(newState)
            setStateMap(pathname, newState)
          }
        }}
      />

      <Drawer
        width={800}
        title={`店铺权限（${currentMsg.worker_name}）`}
        open={showShopPermission}
        onClose={handleShopPermissionClose}
        destroyOnClose={true}
      >
        <ShopPermission
          workerInfo={currentMsg}
          handleShopPermissionClose={handleShopPermissionClose}
          actionRef={actionRef}
        />
      </Drawer>
      <Drawer
        width={600}
        title={title}
        open={showDetailDrawer}
        onClose={handleClose}
        destroyOnClose={true}
      >
        <AddSystem
          handleClose={handleClose}
          currentMsg={currentMsg}
          actionRef={actionRef}
          success={success}
          error={error}
        />
      </Drawer>

      <Drawer
        width={800}
        title={'基础指标'}
        open={showBaseIndex}
        onClose={handleCloseBaseIndex}
        destroyOnClose={true}
      >
        <BaseIndex
          handleCloseBaseIndex={handleCloseBaseIndex}
          currentMsg={currentMsg}
          actionRef={actionRef}
          success={success}
          error={error}
        />
      </Drawer>

      <Drawer
        width={800}
        title={'查看'}
        open={showDetail}
        onClose={handleCloseDetail}
        destroyOnClose={true}
      >
        <Detail
          currentItem={currentMsg}
        />
      </Drawer>

      <Drawer
        width={800}
        title={'查看评分'}
        open={showScore}
        onClose={handleCloseScore}
        destroyOnClose={true}
      >
        <Score
          currentItem={currentMsg}
        />
      </Drawer>

      <BaseContainer
        type={ModalType.Drawer}
        title="创建投诉/反馈"
        open={openComplaint}
        onCancel={handleCloseComplaint}
        width="40%"
        destroyOnClose={true}
        maskClosable={false}
      >
        <CreateComplaint
          openComplaint={openComplaint}
          actionRef={actionRef}
          success={success}
          error={error}
          handleCloseComplaint={handleCloseComplaint}
        />
      </BaseContainer>
    </>
  )
}
export default ItemList
