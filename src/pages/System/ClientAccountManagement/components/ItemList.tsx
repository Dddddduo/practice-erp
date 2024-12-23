import React, {useEffect, useState} from "react";
import {ParamsType, ProColumns, ProTable} from "@ant-design/pro-components";
import {FormattedMessage, useIntl} from "@umijs/max";
import {getBrandList} from "@/services/ant-design-pro/report";
import {Button, Drawer} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import AddSystem from "./AddSystem";
import {useLocation} from "@@/exports";
import {getStateMap, setStateMap} from "@/utils/utils";


const type = [
  {
    value: 'y',
    label: '启用'
  },
  {
    value: 'n',
    label: '禁用'
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
  // AddSystem
  actionRef
  success: (text: string) => void
  error: (text: string) => void
}

const ItemList: React.FC<ItemListProps> = ({
                                             onListData,
                                             actionRef,
                                             success,
                                             error
                                           }) => {


  const optionsBrand = () => {
    // return({
    //     value: item.id,
    //     label: item.brand_en,
    // })
  }


  const intl = useIntl()
  const [columnsStateMap, setColumnsStateMap] = useState({});
  const location = useLocation();
  const currentPath = location.pathname;
  const pathname = currentPath.split('/')[currentPath.split('/').length - 1]


  // 新增或者编辑抽屉
  const [showDetailDrawer, setShowDetailDrawer] = useState(false)
  const [typeList, settypeList]: any = useState([])
  const [currentMsg, setCurrentMsg] = useState()

  const [title, setTitle] = useState('')


  // 品牌下拉框
  const [brandList, setBrandList]: any = useState([])

  const columns: ProColumns<API.ClientAccountManagement>[] = [
    {
      title: (
        <FormattedMessage
          id="clientAccountManagement.field.usnername"
          defaultMessage="姓名"
        />
      ),
      dataIndex: 'usnername',
    },
    {
      title: (
        <FormattedMessage
          id="clientAccountManagement.field.email"
          defaultMessage="客户邮箱"
        />
      ),
      dataIndex: 'email',
      search: false
    },
    {
      title: (
        <FormattedMessage
          id="clientAccountManagement.field.mobile"
          defaultMessage="客户电话"
        />
      ),
      dataIndex: 'mobile',
      search: false
    },
    {
      title: (
        <FormattedMessage
          id="clientAccountManagement.field.status"
          defaultMessage="状态"
        />
      ),
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: type?.reduce((acc, item) => {
        acc[`${item.value}`] = {text: item.label};
        return acc;
      }, {}),
      fieldProps: {
        showSearch: true
      },

      // valueEnum:'',s
      render: (dom, entity) => {
        return (
          <div>
            {
              entity.status === 'y' ? '启用' : '禁用'
            }
          </div>
        )
      },
    },
    {
      title: (
        <FormattedMessage
          id="clientAccountManagement.field.brand_list_str"
          defaultMessage="品牌"
        />
      ),
      dataIndex: 'brand_list_str',
      valueType: 'select',
      valueEnum: brandList?.reduce((acc, item) => {
        acc[`${item.id}`] = {text: item.brand_en};
        return acc;
      }, {}),
      fieldProps: {
        showSearch: true
      },

      render: (dom, entity) => {
        return (
          <div style={{width: 300}}>{dom}</div>
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="clientAccountManagement.field.operate"
          defaultMessage="操作"
        />
      ),
      dataIndex: 'operate',
      search: false,
      render: (dom, entity) => {
        return (
          <>
            <Button type="primary" onClick={() => openDetailDarwer(entity)}>修改</Button>
          </>
        )
      }
    },


  ]

  const openDetailDarwer = (e) => {
    setCurrentMsg(e)
    setShowDetailDrawer(true)
    setTitle('修改管理员')
  }

  const handleClose = () => {
    setCurrentMsg(undefined)
    setShowDetailDrawer(false)
    setTitle('')
  }


  useEffect(() => {
    setColumnsStateMap(getStateMap(pathname))
    getBrandList().then(res => {
      setBrandList(Object.keys(res.data).map(key => res.data[key]))
    })
    // getBrandUserListPage().then(res =>{settypeList(res.data)})
  }, [])


  return (
    <>
      <ProTable<API.ClientAccountManagement, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'clientAccountManagement.table.title',
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
            key="primary"
            onClick={() => {
              setShowDetailDrawer(true);
              setTitle('新增管理员')
            }}
          >
            <PlusOutlined/> <FormattedMessage id="pages.searchTable.new" defaultMessage="New"/>
          </Button>,
        ]}

        columnsState={{
          value: columnsStateMap,
          onChange: (newState) => {
            setColumnsStateMap(newState)
            setStateMap(pathname, newState)
          }
        }}

        columns={columns}
        request={onListData}
      />

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
          brandList={brandList}
          actionRef={actionRef}
          success={success}
          error={error}
        />
      </Drawer>

    </>
  )

}

export default ItemList
