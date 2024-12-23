import React, {useEffect, useState} from "react";
import {ParamsType, ProColumns, ProTable} from "@ant-design/pro-components";
import {FormattedMessage, useIntl} from '@umijs/max';
import {getBrandList} from "@/services/ant-design-pro/report";
import {getProjectTypeList} from "@/services/ant-design-pro/project";
import {Button, Drawer} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import AddProject from "./AddProject";
import Process from "./Process";
import {useLocation} from "@@/exports";
import {getStateMap, setStateMap} from "@/utils/utils";

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
  searchData,
  actionRef,
  success: (text: string) => void,
  error: (text: string) => void

}

const ItemList: React.FC<ItemListProps> = ({
                                             onListData,
                                             searchData,
                                             actionRef,
                                             success,
                                             error
                                           }) => {

  const intl = useIntl()
  // 新增或者编辑抽屉
  const [showDetailDrawer, setShowDetailDrawer] = useState(false)
  // 流程抽屉
  const [process, setProcess] = useState(false)
  const [brandList, setBrandList]: any = useState([])
  const [typeList, settypeList]: any = useState([])
  const [currentMsg, setCurrentMsg] = useState()
  const [columnsStateMap, setColumnsStateMap] = useState({});
  const location = useLocation();
  const currentPath = location.pathname;
  const pathname = currentPath.split('/')[currentPath.split('/').length - 1]

  const columns: ProColumns<API.EventSendingParams>[] = [
    {
      title: (
        <FormattedMessage
          id="processControl.field.id"
          defaultMessage="序号"
        />
      ),
      dataIndex: 'id',
      search: false
    },
    {
      title: (
        <FormattedMessage
          id="processControl.field.project_no"
          defaultMessage="项目编号"
        />
      ),
      dataIndex: 'project_no',
    },
    // brand_en
    {
      title: (
        <FormattedMessage
          id="processControl.field.brand"
          defaultMessage="品牌"
        />
      ),
      dataIndex: 'brand',
      valueType: 'select',
      valueEnum: brandList?.reduce((acc, item) => {
        acc[`${item.id}`] = {text: item.brand_en};
        return acc;
      }, {}),
      fieldProps: {
        showSearch: true
      },

    },
    {
      title: (
        <FormattedMessage
          id="processControl.field.project_type"
          defaultMessage="项目类型"
        />
      ),
      dataIndex: 'project_type',
    },
    {
      title: (
        <FormattedMessage
          id="processControl.field.creator_name"
          defaultMessage="创建人"
        />
      ),
      dataIndex: 'creator_name',
      search: false
    },
    {
      title: (
        <FormattedMessage
          id="processControl.field.create_at"
          defaultMessage="创建时间"
        />
      ),
      dataIndex: 'create_at',
      search: false
    },
    {
      title: (
        <FormattedMessage
          id="processControl.field.update_at"
          defaultMessage="更新时间"
        />
      ),
      dataIndex: 'update_at',
      search: false
    },
    {
      title: (
        <FormattedMessage
          id="processControl.field.operate"
          defaultMessage="操作"
        />
      ),
      dataIndex: 'operate',
      search: false,
      render: (dom, entity) => {
        return (
          <>
            <Button
              type="primary"
              style={{marginRight: 10}}
              onClick={() => openDetailDarwer(entity)}
            >编辑项目</Button>
            <Button type="primary" onClick={() => openProcess(entity)}>流程</Button>
          </>
        )
      }
    },
    // project_type
    {
      title: (
        <FormattedMessage
          id="processControl.field.type"
          defaultMessage="类型"
        />
      ),
      dataIndex: 'type',
      hideInTable: true,
      valueType: 'select',
      valueEnum: typeList?.reduce((acc, item) => {
        acc[`${item.project_type_id}`] = {text: item.project_type};
        return acc;
      }, {}),
      fieldProps: {
        showSearch: true
      },

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
  const Darwer = (e) => {
    setCurrentMsg(e)
    setProcess(true)
  }

  const Close = () => {
    setCurrentMsg(undefined)
    setProcess(false)
  }

  const openProcess = (entity) => {
    setCurrentMsg(entity)
    setProcess(true)
  }

  useEffect(() => {
    setColumnsStateMap(getStateMap(pathname))
    getBrandList().then(res => {
      setBrandList(Object.keys(res.data).map(key => res.data[key]))
    })

    getProjectTypeList().then(res => {
      settypeList(res.data)
    })
  }, [])


  return (
    <>
      <ProTable<API.EventSendingParams, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'processControl.table.title',
          defaultMessage: 'table list',
        })}
        actionRef={actionRef}
        scroll={{x: 'max-content'}}

        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setShowDetailDrawer(true);
            }}
          >
            <PlusOutlined/> <FormattedMessage id="pages.searchTable.new" defaultMessage="New"/>
          </Button>,
        ]}
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
        width={600}
        title="项目"
        open={showDetailDrawer}
        onClose={handleClose}
        destroyOnClose={true}
      >
        <AddProject
          handleClose={handleClose}
          currentMsg={currentMsg}
          brandList={brandList}
          actionRef={actionRef}
          success={success}
          error={error}
        />
      </Drawer>
      <Drawer
        width={1500}
        open={process}
        onClose={Close}
        destroyOnClose={true}
      >
        <Process
          Close={Close}
          actionRef={actionRef}
          currentMsg={currentMsg}
          success={success}
          error={error}
        />
      </Drawer>

    </>

  )


}

export default ItemList
