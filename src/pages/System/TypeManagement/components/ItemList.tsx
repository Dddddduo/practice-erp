import React, {useEffect, useState} from "react"
import {FormattedMessage, useIntl} from "@umijs/max"
import {Button, Drawer, Popconfirm, Switch} from "antd"
import {PlusOutlined} from "@ant-design/icons"
import {ParamsType, ProColumns, ProTable} from "@ant-design/pro-components"
import {CategoryAll, Categorytatus, categorytatus, getSubCategory} from '@/services/ant-design-pro/system';
import AddSystem from "./AddSystem"
import {getStateMap, setStateMap} from "@/utils/utils";
import {useLocation} from "@@/exports";

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
  actionRef: any,
  success: (text: string) => void
  error: (text: string) => void
}


const ItemList: React.FC<ItemListProps> = ({
                                             onListData,
                                             actionRef,
                                             success,
                                             error
                                           }) => {
  const intl = useIntl()

  const [category, setCategory] = useState([])
  // 抽屉
  const [showDetailDrawer, setShowDetailDrawer] = useState()
  const [currentMsg, setCurrentMsg] = useState()
  // 一级类别
  const [firstLevel, setFirstLevel] = useState([])
  // 二级类别
  const [secondLevels, setSecondLevels] = useState([])
  const [columnsStateMap, setColumnsStateMap] = useState({});
  const location = useLocation();
  const currentPath = location.pathname;
  const pathname = currentPath.split('/')[currentPath.split('/').length - 1]

  const columns: ProColumns<API.TypeManagement>[] = [
    {
      title: (
        <FormattedMessage
          id="TypeManagement.field.id"
          defaultMessage="ID"
        />
      ),
      dataIndex: 'id',
      align: "center",
      search: false,
    },
    {
      title: (
        <FormattedMessage
          id="TypeManagement.field.no"
          defaultMessage="类别编码"
        />
      ),
      dataIndex: 'no',
      align: "center",
    },
    {
      title: (
        <FormattedMessage
          id="TypeManagement.field.name"
          defaultMessage="类别名称"
        />
      ),
      dataIndex: 'name',
      align: "center",
      width: 350,
      render: (dom: any, entity) => {
        return (
          <div>
            {entity.cn_name}/{entity.en_name}</div>
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="TypeManagement.field.level"
          defaultMessage="类别级别"
        />
      ),
      dataIndex: 'level',
      align: "center",
      search: false,
      render: (dom: any, entity) => {
        return (
          <div>
            {
              entity.level === 0 ? '一级' : '' ||
              entity.level === 1 ? '二级' : '' ||
              entity.level === 2 ? '三级' : ''
            }
            /{entity.parent_cn_name}
          </div>
        )
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      align: 'center',
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
    {
      title: (
        <FormattedMessage
          id="TypeManagement.field.operate"
          defaultMessage="操作"
        />
      ),
      dataIndex: 'operate',
      align: "center",
      search: false,
      render: (dom: any, entity) => {
        return (
          <Popconfirm
            title="警告"
            description="确定要删除吗"
            okText="确定"
            cancelText="取消"
            onConfirm={() => {
              handleConfirm(entity)
            }}
          >
            <Button type="primary" danger

            >删除</Button>
          </Popconfirm>

        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="TypeManagement.field.oneLevel"
          defaultMessage="一级类别"
        />
      ),
      dataIndex: 'oneLevel',
      valueType: 'select',
      hideInTable: true,
      valueEnum: firstLevel?.reduce((acc, item) => {
        acc[`${item.value}`] = {text: item.label};
        return acc;
      }, {}),
      fieldProps: {
        showSearch: true,
        onChange: (e, entity) => {
          getSubCategory(e).then((res) => {
            setSecondLevels(res.data)
          })
        }
      }
    },
    {
      title: (
        <FormattedMessage
          id="TypeManagement.field.twoLevel"
          defaultMessage="二级类别"
        />
      ),
      dataIndex: 'twoLevel',
      valueType: 'select',
      hideInTable: 'true',
      fieldProps: {
        showSearch: true
      },

      valueEnum: secondLevels?.reduce((acc, item) => {
        acc[`${item.id}`] = {text: item.cn_name + '/' + item.en_name};
        return acc;
      }, {}),
    }
  ]


  const handleConfirm = (e) => {
    Categorytatus(e.id).then((res) => {
      if (res.success) {
        actionRef?.current.reload()
        success('删除成功')
        return
      }
      error(res.message)
    })
  }

  const handleStatusChange = async (checked, record) => {
    console.log(checked, record);

    const newStatus = checked ? 1 : 0;
    // 调用 API 更新状态
    try {
      const res = await categorytatus({status: newStatus, id: record.id});
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
  const handleClose = () => {
    setShowDetailDrawer(false)

  }

  useEffect(() => {
    setColumnsStateMap(getStateMap(pathname))
    CategoryAll().then((res) => {
      if (res.success) {
        const data = res.data
        const types: any = []
        const first: any = []
        for (const i in data) {
          let item: any = {}
          if (data[i].pid === 0 && data[i].status === 1) {
            item = {
              value: data[i].id,
              label: data[i].cn_name + '/' + data[i].en_name,
              children: []
            }
            first.push(item)
            for (const j in data) {
              if (data[j].pid === data[i].id && data[j].status == 1) {
                item.children.push({
                  value: data[j].id,
                  label: data[j].cn_name + '/' + data[i].en_name
                })
              }
            }
            if (Object.keys(item).length > 0) {
              if (item.children && item.children.length < 1) {
                delete item.children
              }
              types.push(item)
            }
          }
        }
        console.log(first);
        setFirstLevel(first)
        setCategory(types)
      }
    })


  }, [])

  return (
    <>
      <ProTable<API.TypeManagement, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'TypeManagement.table.title',
          defaultMessage: 'table list',
        })}
        scroll={{x: 'max-content'}}
        actionRef={actionRef}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
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
        success={success}
        error={error}
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
        open={showDetailDrawer}
        onClose={handleClose}
        destroyOnClose={true}
      >
        <AddSystem
          handleClose={handleClose}
          actionRef={actionRef}
          currentMsg={currentMsg}
          success={success}
          error={error}
          category={category}
        />
      </Drawer>
    </>
  )
}
export default ItemList
