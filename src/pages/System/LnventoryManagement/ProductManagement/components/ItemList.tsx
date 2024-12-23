import {FormattedMessage, useIntl} from '@umijs/max';
import {ParamsType, ProColumns, ProTable} from '@ant-design/pro-components';
import {getBrandList} from '@/services/ant-design-pro/report';
import React, {useEffect, useState} from "react";
import {Button, Drawer, Switch} from 'antd';
import {PlusOutlined} from "@ant-design/icons";
import AddSystem from './AddSystem';
import {categoryStatus} from '@/services/ant-design-pro/system';
import {useLocation} from "@@/exports";
import {getStateMap, setStateMap} from "@/utils/utils";

const type = [
  {
    value: '1',
    label: '启用'
  },
  {
    value: '0',
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
  actionRef
  success: (text: string) => void
  error: (text: string) => void
}

const ItemList: React.FC<ItemListProps> = ({
                                             actionRef,
                                             onListData,
                                             success,
                                             error
                                           }) => {
  // 品牌下拉框
  const [brandList, setBrandList]: any = useState([])

  const intl = useIntl()
  // 新增或者编辑抽屉
  const [showDetailDrawer, setShowDetailDrawer] = useState(false)
  // const [typeList, settypeList]: any = useState([])
  const [currentMsg, setCurrentMsg] = useState()
  const [columnsStateMap, setColumnsStateMap] = useState({});
  const location = useLocation();
  const currentPath = location.pathname;
  const pathname = currentPath.split('/')[currentPath.split('/').length - 1]

  const onChange = (checked: boolean, entity) => {
    console.log(`switch to ${checked}`, entity);
    entity.status = checked ? 1 : 0
  };


  const columns: ProColumns<API.ProductManagement>[] = [
    {
      title: (
        <FormattedMessage
          id="productManagement.field.id"
          defaultMessage="id"
        />
      ),
      dataIndex: 'id',
      search: false
    },
    {
      title: (
        <FormattedMessage
          id="productManagement.field.no"
          defaultMessage="产品编码"
        />
      ),
      dataIndex: 'no',
    },
    {
      title: (
        <FormattedMessage
          id="productManagement.field.cn_name"
          defaultMessage="产品名称"
        />
      ),
      dataIndex: 'cn_name',
    },
    {
      title: (
        <FormattedMessage
          id="productManagement.field.en_name"
          defaultMessage="产品英文名称"
        />
      ),
      dataIndex: 'en_name',
      search: false
    },
    {
      title: (
        <FormattedMessage
          id="productManagement.field.unit"
          defaultMessage="单位"
        />
      ),
      dataIndex: 'unit',
      search: false
    },
    {
      title: (
        <FormattedMessage
          id="productManagement.field.remark"
          defaultMessage="描述"
        />
      ),
      dataIndex: 'remark',
      search: false
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: type?.reduce((acc, item) => {
        acc[`${item.value}`] = {text: item.label};
        return acc;
      }, {}),
      fieldProps: {
        showSearch: true
      },

      render: (_, record) => (
        <Switch
          checked={record.status === 1}
          onChange={(checked) => handleStatusChange(checked, record)}
        />
      ),
    },
    // {
    //     title: (
    //         <FormattedMessage
    //             id="productManagement.field.status"
    //             defaultMessage="状态"
    //         />
    //     ),
    //     dataIndex: 'status',
    //     valueType: 'select',
    //     valueEnum: type?.reduce((acc, item) => {
    //         acc[`${item.value}`] = { text: item.label };
    //         return acc;
    //     }, {}),
    //     render: (dom, entity: any) => {
    //         console.log(entity.status);
    //         const isChecked = 1 === entity.status ? true : false;
    //         return (
    //             <Switch checked={isChecked} onChange={(e) => onChange(e, entity)} />
    //             // <Space direction="vertical">
    //             //     <Switch checkedChildren="开启" unCheckedChildren="关闭" onChange={onChange} />
    //             // </Space>


    //         )
    //     },
    // },
    {
      title: (
        <FormattedMessage
          id="productManagement.field.brand.brand"
          defaultMessage="所属品牌"
        />
      ),
      dataIndex: 'brand',
      valueType: 'select',
      fieldProps: {
        showSearch: true
      },

      render: (dom: any, entity) => {
        console.log(entity);

        return (
          <div>{entity.brand.brand}</div>
        )
      },
      valueEnum: brandList?.reduce((acc, item) => {
        acc[`${item.id}`] = {text: item.brand_en};
        return acc;
      }, {}),
    },

  ]

  // const handleChangeSwitch = (e, entity) => {
  //     console.log(e, entity);
  // }

  const handleStatusChange = async (checked, record) => {
    console.log(checked, record);

    const newStatus = checked ? 1 : 0;
    // 调用 API 更新状态
    try {
      const res = await categoryStatus({status: newStatus, id: record.id});
      console.log(res);
      if (res.success) {
        actionRef.current.reload()
      }

      // 更新成功后，您可以在这里更新表格数据
      // 例如，如果您使用的是状态来存储数据，可以在这里更新状态
    } catch (error) {
      // 处理错误，例如回退 switch 状态
    }
  };


  const openDetailDarwer = (e) => {
    setCurrentMsg(e)
    setShowDetailDrawer(true)
  }

  const handleClose = () => {
    setCurrentMsg(undefined)
    setShowDetailDrawer(false)
  }


  useEffect(() => {
    setColumnsStateMap(getStateMap(pathname))
    getBrandList().then(res => {
      setBrandList(Object.keys(res.data).map(key => res.data[key]))
    })

  }, [])


  return (
    <>
      <ProTable<API.ProductManagement, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'ProductManagement.table.title',
          defaultMessage: 'table list',
        })}

        scroll={{x: 'max-content'}}
        actionRef={actionRef}

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
        title="添加类别"
        open={showDetailDrawer}
        onClose={handleClose}
        destroyOnClose={true}
      >
        <AddSystem
          brandList={brandList}
          handleClose={handleClose}
          actionRef={actionRef}
          success={success}
          error={error}
        />
      </Drawer>

    </>
  )
}

export default ItemList
