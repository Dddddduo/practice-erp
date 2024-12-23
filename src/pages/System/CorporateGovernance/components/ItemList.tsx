import {ParamsType, ProColumns, ProTable} from "@ant-design/pro-components"
import {FormattedMessage, useIntl} from '@umijs/max';
import {Button, Image, Modal} from "antd";
import {useEffect, useState} from "react";
import AddSystem from "./AddSystem";
import {getStateMap, setStateMap} from "@/utils/utils";
import {useLocation} from "@@/exports";

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
  actionRef
  success
  error

}

const ItemList: React.FC<ItemListProps> = ({
                                             onListData,
                                             actionRef,
                                             success,
                                             error
                                           }) => {

  const intl = useIntl()
  // Modal
  const [modal, setModel] = useState(false)
  const [currentMsg, setCurrentMsg] = useState()

  const [columnsStateMap, setColumnsStateMap] = useState({});
  const location = useLocation();
  const currentPath = location.pathname;
  const pathname = currentPath.split('/')[currentPath.split('/').length - 1]
  const [title, setTitle] = useState('')

  const columns: ProColumns<API.CorporateGovernance>[] = [
    {
      title: (
        <FormattedMessage
          id="corporateGovernance.field.id"
          defaultMessage="公司ID"
        />
      ),
      dataIndex: 'id',
      search: false,
      // render:(dom:any,entity,index) =>{
      //     return(
      //         <div>{entity.data.data.id}</div>
      //     )
      // }
    },
    {
      title: (
        <FormattedMessage
          id="corporateGovernance.field.en"
          defaultMessage="公司英文名"
        />
      ),
      dataIndex: 'en',
      search: false,
      // render:(dom:any,entity) =>{
      //     return(
      //         <div>{entity.data.en}</div>
      //     )
      // }
    },
    {
      title: (
        <FormattedMessage
          id="corporateGovernance.field.cn"
          defaultMessage="公司全称"
        />
      ),
      dataIndex: 'cn',
      search: false,
    },
    {
      title: (
        <FormattedMessage
          id="corporateGovernance.field.logo_name"
          defaultMessage="公司logo"
        />
      ),
      dataIndex: 'logo_name',
      search: false,
      render: (dom: any, entity) => {
        return (
          <Image preview={entity.logo_url !== ''} width={250} src={entity.logo_url} alt={entity.logo_name}></Image>
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="corporateGovernance.field.operate"
          defaultMessage="操作"
        />
      ),
      dataIndex: 'operate',
      search: false,
      render: (dom: any, entity) => {
        return (
          <div>
            <Button type="primary" onClick={() => {
              setTitle('编辑公司')
              openDetailModal(entity)
            }}>
              编辑
            </Button>
          </div>
        )
      }
    }
  ]
  const openDetailModal = (e) => {
    setCurrentMsg(e)
    setModel(true)
  }
  const handleClose = () => {
    setCurrentMsg(undefined)
    setModel(false)
  }

  useEffect(() => {
    setColumnsStateMap(getStateMap(pathname))
  }, []);

  return (
    <>
      <ProTable<API.CorporateGovernance, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'CorporateGovernance.table.title',
          defaultMessage: 'table list',
        })}
        scroll={{x: 'max-content'}}
        search={false}

        toolBarRender={() => [
          <Button type="primary" key="add" onClick={() => {
            setModel(true)
            setTitle('新建公司')
          }}>
            新增
          </Button>
        ]}


        actionRef={actionRef}
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

      <Modal
        width={600}
        open={modal}
        onCancel={handleClose}
        destroyOnClose={true}
        footer={null}
        title={title}
      >
        <AddSystem
          handleClose={handleClose}
          currentMsg={currentMsg}
          actionRef={actionRef}
          success={success}
          error={error}
        />

      </Modal>
    </>
  )
}
export default ItemList
