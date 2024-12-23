import {FormattedMessage, useIntl} from "@umijs/max"
import {ParamsType, ProColumns, ProTable} from "@ant-design/pro-components";
import {Button, Drawer} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import React, {useEffect, useState} from "react";
import AddSystem from "./AddSystem";
import copy from "copy-to-clipboard";
import ViewSystem from "./ViewSystem";
import {useLocation} from "@@/exports";
import {getStateMap, setStateMap} from "@/utils/utils";
// import { getCityList } from "@/services/ant-design-pro/report";

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
}


const ItemList: React.FC<ItemListProps> = ({
                                             onListData,
                                             success,
                                             error
                                           }) => {


  const intl = useIntl()

  const [columnsStateMap, setColumnsStateMap] = useState({});
  const location = useLocation();
  const currentPath = location.pathname;
  const pathname = currentPath.split('/')[currentPath.split('/').length - 1]
  // 新增或者编辑抽屉
  const [showDetailDrawer, setShowDetailDrawer] = useState(false)
  const [currentMsg, setCurrentMsg] = useState()

  // 查看抽屉
  const [showviewDrawer, setShowviewDrawer] = useState(false)


  const columns: ProColumns<API.WorkersContracts>[] = [
    {
      title: (
        <FormattedMessage
          id="workersContracts.field.id"
          defaultMessage="序号"
        />
      ),
      dataIndex: 'id',
      search: false,
      render: (dom, entity, index) => {
        return (
          <div>{index + 1}</div>
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="workersContracts.field.username"
          defaultMessage="姓名"
        />
      ),
      dataIndex: 'username',
    },
    {
      title: (
        <FormattedMessage
          id="workersContracts.field.mobile"
          defaultMessage="手机号"
        />
      ),
      dataIndex: 'mobile',
      search: false
    },
    {
      title: (
        <FormattedMessage
          id="workersContracts.field.city_cn"
          defaultMessage="城市"
        />
      ),
      dataIndex: 'city_cn',
    },
    {
      title: (
        <FormattedMessage
          id="workersContracts.field.id_card_no"
          defaultMessage="身份证件号"
        />
      ),
      dataIndex: 'id_card_no',
      search: false
    },
    {
      title: (
        <FormattedMessage
          id="workersContracts.field.update_at"
          defaultMessage="签约时间"
        />
      ),
      dataIndex: 'update_at',
      search: false
    },
    {
      title: (
        <FormattedMessage
          id="workersContracts.field.View"
          defaultMessage="查看签名"
        />
      ),
      dataIndex: 'View',
      search: false,
      render: (dom, entity) => {
        return (
          <>
            <Button type="primary" onClick={() => openView(entity)}>查看</Button>
          </>
        )
      }
    },
  ]

  const openDetailDarwer = (e) => {
    setCurrentMsg(e)
    setShowDetailDrawer(true)
  }

  const handleClose = () => {
    setCurrentMsg(undefined)
    setShowDetailDrawer(false)
  }

  const openView = (entity) => {
    setCurrentMsg(entity)
    setShowviewDrawer(true)
  }

  const handleView = () => {
    setCurrentMsg(undefined)
    setShowviewDrawer(false)
  }


  const handleCopy = () => {
    copy('https://erp-worker.zhian-design.com/#/worker_sign')
    success('复制成功')
  }
  useEffect(() => {
    setColumnsStateMap(getStateMap(pathname))
  }, []);

  return (
    <>
      <ProTable<API.WorkersContracts, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'WorkersContracts.table.title',
          defaultMessage: 'table list',
        })}

        scroll={{x: 'max-content'}}
        toolBarRender={() => [
          <Button
            type="primary"
            key="add"
            onClick={() => {
              setShowDetailDrawer(true);
            }}
          >
            <PlusOutlined/> <FormattedMessage id="pages.searchTable.new" defaultMessage="New"/>
          </Button>,
          <Button type="primary" onClick={handleCopy}>复制链接</Button>
        ]}

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
        width={850}
        title="周报详细"
        open={showDetailDrawer}
        onClose={handleClose}
        destroyOnClose={true}
      >
        <AddSystem
          handleClose={handleClose}
          success={success}
          error={error}
        />
      </Drawer>
      <Drawer
        width={1000}
        title="合同"
        open={showviewDrawer}
        onClose={handleView}
        destroyOnClose={true}
      >
        <ViewSystem
          handleView={handleView}
          currentMsg={currentMsg}
        />
      </Drawer>
    </>
  )

}
export default ItemList
