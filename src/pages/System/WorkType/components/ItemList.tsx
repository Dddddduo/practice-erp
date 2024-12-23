import React, {useEffect, useState} from "react";
import {ParamsType, ProColumns, ProTable} from "@ant-design/pro-components";
import {FormattedMessage, useIntl} from "@umijs/max";
import {Button, Drawer} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import AddSystem from "./AddSystem";
import {getBrandList} from "@/services/ant-design-pro/report";
import {useLocation} from "@@/exports";
import {getStateMap, setStateMap} from "@/utils/utils";

const type = [
  {
    value: 'maintenance',
    label: 'maintenance'
  },
  {
    value: 'project',
    label: 'project'
  },
]


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
  actionRef: any,
  success: (text: string) => void
  error: (text: string) => void

}

const ItemList: React.FC<ItemListProps> = ({
                                             onListData,
                                             actionRef,
                                             success,
                                             error,

                                           }) => {

  const intl = useIntl()

  const [brandList, setBrandList] = useState()

  const [showDetailDrawer, setShowDetailDrawer] = useState(false)
  const [currentMsg, setCurrentMsg] = useState()
  const [title, setTitle] = useState()

  const [columnsStateMap, setColumnsStateMap] = useState({});
  const location = useLocation();
  const currentPath = location.pathname;
  const pathname = currentPath.split('/')[currentPath.split('/').length - 1]

  const columns: ProColumns<API.WorkType>[] = [
    {
      title: (
        <FormattedMessage
          id="workType.field.department"
          defaultMessage="Department"
        />
      ),
      dataIndex: 'department',
      hideInTable: 'select',
      valueEnum: type?.reduce((acc, item) => {
        acc[`${item.value}`] = {text: item.label};
        return acc;
      }, {}),
    },
    {
      title: (
        <FormattedMessage
          id="WorkType.field.brand_en"
          defaultMessage="品牌"
        />
      ),
      dataIndex: 'brand_en',
      align: "center",
      valueType: 'select',
      render: (dom, entity) => {
        return (
          <>
            {
              entity.brand_en === '' ?
                <span>
                                默认
                            </span> :
                <span>
                                {
                                  entity.brand_en
                                }
                            </span>
            }
          </>
        )
      },
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
          id="WorkType.field.id"
          defaultMessage="工作类型ID"
        />
      ),
      dataIndex: 'id',
      align: "center",
      search: false,
    },
    {
      title: (
        <FormattedMessage
          id="WorkType.field.job"
          defaultMessage="工作"
        />
      ),
      dataIndex: 'job',
      align: "center",
      search: false,
    },
    {
      title: (
        <FormattedMessage
          id="WorkType.field.typename"
          defaultMessage="工作类型"
        />
      ),
      dataIndex: 'typename',
      align: "center",
    },
    {
      title: (
        <FormattedMessage
          id="WorkType.field.typename_en"
          defaultMessage="英文"
        />
      ),
      dataIndex: 'typename_en',
      align: "center",
      search: false,
    },
    {
      title: (
        <FormattedMessage
          id="WorkType.field.shorter"
          defaultMessage="编号"
        />
      ),
      dataIndex: 'shorter',
      align: "center",
      search: false,
    },
    {

      title: (
        <FormattedMessage
          id="WorkType.field.operate"
          defaultMessage="操作"
        />
      ),
      dataIndex: 'operate',
      align: "center",
      search: false,
      render: (dom, entity) => {
        return (
          <>
            {
              entity.brand_en !== '' &&
              <Button type="primary" onClick={() => {
                setTitle('修改工作类型')
                openDetailDarwer(entity)
              }}>
                修改
              </Button>
            }

          </>
        )
      }
    },
  ]
  useEffect(() => {
    setColumnsStateMap(getStateMap(pathname))
    getBrandList().then(res => {
      setBrandList(Object.keys(res.data).map(key => res.data[key]))
    })

  }, [])

  const openDetailDarwer = (e) => {
    setCurrentMsg(e)
    setShowDetailDrawer(true)
  }

  const handleClose = () => {
    setCurrentMsg(undefined)
    setShowDetailDrawer(false)
  }

  return (
    <>
      <ProTable<API.WorkType, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'WorkType.table.title',
          defaultMessage: 'table list',
        })}
        scroll={{x: 'max-content'}}
        actionRef={actionRef}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setTitle('添加工作类型')
              setShowDetailDrawer(true)
            }}
          >
            <PlusOutlined/>
            <FormattedMessage id="pages.searchTable.new" defaultMessage="New"/>


          </Button>,
        ]}

        columnEmptyText
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
        title={title}
        open={showDetailDrawer}
        onClose={handleClose}
        destroyOnClose={true}
      >
        <AddSystem
          type={type}
          brandList={brandList}
          handleClose={handleClose}
          actionRef={actionRef}
          success={success}
          error={error}
          currentMsg={currentMsg}
        />
      </Drawer>
    </>
  )
}
export default ItemList
