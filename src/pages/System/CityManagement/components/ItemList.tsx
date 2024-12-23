import {ParamsType, ProColumns, ProTable} from "@ant-design/pro-components"
import {FormattedMessage, useIntl} from "@umijs/max"
import {Button, Drawer} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {useEffect, useState} from "react";
import Addsystem from "./Addsystem";
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
  actionRef
  success,
  error
}

const ItemList: React.FC<ItemListProps> = ({
                                             onListData,
                                             actionRef,
                                             success,
                                             error
                                           }) => {

  const intl = useIntl()

  const [columnsStateMap, setColumnsStateMap] = useState({});
  const location = useLocation();
  const currentPath = location.pathname;
  const pathname = currentPath.split('/')[currentPath.split('/').length - 1]
  // 抽屉
  const [showDetailDrawer, setShowDetailDrawer] = useState(false)
  const [currentMsg, setCurrentMsg] = useState()
  const [title, setTitle] = useState('')

  const columns: ProColumns<API.CityManagement>[] = [
    {
      title: (
        <FormattedMessage
          id="cityManagement.field.id"
          defaultMessage="序号"
        />
      ),
      dataIndex: 'id',
      search: false,
    },
    {
      title: (
        <FormattedMessage
          id="cityManagement.field.city_cn"
          defaultMessage="城市中文名"
        />
      ),
      dataIndex: 'city_cn',
      search: false,
    },
    {
      title: (
        <FormattedMessage
          id="cityManagement.field.city_en"
          defaultMessage="城市英文名"
        />
      ),
      dataIndex: 'city_en',
      search: false,
    },
    {
      title: (
        <FormattedMessage
          id="cityManagement.field.country_cn"
          defaultMessage="国家中文名"
        />
      ),
      dataIndex: 'country_cn',
      search: false,
    },
    {
      title: (
        <FormattedMessage
          id="cityManagement.field.country_en"
          defaultMessage="国家英文名"
        />
      ),
      dataIndex: 'country_en',
      search: false,
    },
    {
      title: (
        <FormattedMessage
          id="cityManagement.field.sort_cn"
          defaultMessage="中文简写"
        />
      ),
      dataIndex: 'sort_cn',
      search: false,
    },
    {
      title: (
        <FormattedMessage
          id="cityManagement.field.sort_en"
          defaultMessage="英文简写"
        />
      ),
      dataIndex: 'sort_en',
      search: false,
    },
    {
      title: (
        <FormattedMessage
          id="cityManagement.field.operate"
          defaultMessage="操作"
        />
      ),
      dataIndex: 'operate',
      search: false,
      render: (dom: any, entity) => {
        return (
          <div>
            <Button type="primary"
                    onClick={() => {
                      openDetailDarwer(entity)
                    }}
            >
              修改
            </Button>
          </div>
        )
      }
    },
  ]
  const openDetailDarwer = (e) => {
    setCurrentMsg(e)
    setShowDetailDrawer(true)
    setTitle('修改城市')
  }

  const handleClose = () => {
    setCurrentMsg(undefined)
    setShowDetailDrawer(false)
  }
  useEffect(() => {
    setColumnsStateMap(getStateMap(pathname))
  }, []);

  return (
    <>
      <ProTable<API.CityManagement, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'CityManagement.table.title',
          defaultMessage: 'table list',
        })}

        search={false}

        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setShowDetailDrawer(true)
              setTitle('添加城市')
            }}
          >
            <PlusOutlined/>
            <FormattedMessage id="pages.searchTable.new" defaultMessage="New"/>


          </Button>,
        ]}

        columnEmptyText

        scroll={{x: 'max-content'}}
        actionRef={actionRef}
        request={onListData}
        columns={columns}
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
        title={title}
        open={showDetailDrawer}
        onClose={handleClose}
        destroyOnClose={true}
      >
        <Addsystem
          handleClose={handleClose}
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
