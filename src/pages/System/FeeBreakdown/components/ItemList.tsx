import React, {useEffect, useState} from "react"
import {ParamsType, ProColumns, ProTable} from "@ant-design/pro-components"
import {FormattedMessage, useIntl} from "@umijs/max";
import {Button, Drawer, Popconfirm, Space, Upload} from "antd";
import {getBrandList} from "@/services/ant-design-pro/report";
import {PlusOutlined} from "@ant-design/icons";
import AddSystem from "./AddSystem";
import {brandDescPricesDel} from "@/services/ant-design-pro/system";
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
  // 品牌
  const [brandList, setBrandList]: any = useState([])
  //  抽屉
  const [showDetailDrawer, setShowDetailDrawer] = useState(false)
  const [currentMsg, setCurrentMsg] = useState()
  const [title, setTitle] = useState()
  const [columnsStateMap, setColumnsStateMap] = useState({});
  const location = useLocation();
  const currentPath = location.pathname;
  const pathname = currentPath.split('/')[currentPath.split('/').length - 1]

  const columns: ProColumns<API.FeeBreakdown>[] = [
    {
      title: (
        <FormattedMessage
          id="FeeBreakdown.field.id"
          defaultMessage="项目ID"
        />
      ),
      dataIndex: 'id',
      search: false,
      align: "center"
    },
    {
      title: (
        <FormattedMessage
          id="FeeBreakdown.field.brand_en"
          defaultMessage="品牌"
        />
      ),
      dataIndex: 'brand_en',
      align: "center",
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
          id="FeeBreakdown.field.description"
          defaultMessage="项目"
        />
      ),
      dataIndex: 'description',
      align: "center"
    },
    {
      title: (
        <FormattedMessage
          id="FeeBreakdown.field.unit"
          defaultMessage="单位"
        />
      ),
      dataIndex: 'unit',
      search: false,
      align: "center"
    },
    {
      title: (
        <FormattedMessage
          id="FeeBreakdown.field.unit_price"
          defaultMessage="单价"
        />
      ),
      dataIndex: 'unit_price',
      search: false,
      align: "center"
    },
    {
      title: (
        <FormattedMessage
          id="FeeBreakdown.field.operate"
          defaultMessage="操作"
        />
      ),
      dataIndex: 'operate',
      search: false,
      align: "center",
      render: (dom: any, entity) => {
        return (
          <Space>
            <Button type="primary"
                    onClick={() => {
                      openDetailDrawer(entity)
                    }}
            >
              修改
            </Button>
            <Popconfirm
              title="警告"
              description="确定要删除吗?"
              onConfirm={() => handleConfirm(entity)}
              okText="确定"
              cancelText="取消"
            >
              <Button type="primary" danger>删除</Button>
            </Popconfirm>
          </Space>
        )
      }
    },
  ]
  const handleConfirm = (entity) => {
    console.log(entity);
    brandDescPricesDel({id: entity.id}).then(res => {
      if (res.success) {
        actionRef?.current.reload()
        success('删除成功')
        return
      }
      error(res.message)
    })
  }
  useEffect(() => {
    setColumnsStateMap(getStateMap(pathname))
    getBrandList().then(res => {
      setBrandList(Object.keys(res.data).map(key => res.data[key]))
    })

  }, [])
  const openDetailDrawer = (e) => {
    setCurrentMsg(e)
    setShowDetailDrawer(true)
    setTitle('修改')
  }
  const handleClose = () => {
    setCurrentMsg(undefined)
    setShowDetailDrawer(false)
  }

  return (
    <>
      <ProTable<API.FeeBreakdown, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'FeeBreakdown.table.title',
          defaultMessage: 'table list',
        })}

        toolBarRender={() => [
          <>
            <Button
              // style={{marginRight:200}}
              type="primary"
              key="primary"
              onClick={() => {
                setShowDetailDrawer(true)
                setTitle('新增')
              }}
            >
              <PlusOutlined/>
              <FormattedMessage id="pages.searchTable.new" defaultMessage="New"/>
            </Button>
            <Popconfirm
              title="批量导入"
              style={{width: 200}}
              // onConfirm={() => handleConfirm(entity)}
              okText="导入"
              cancelText="取消"
              icon=""
              description={() => (
                <>
                  <a>
                    <Upload>
                      <Button>
                        <a>选择文件</a>
                      </Button>
                    </Upload>
                  </a>
                  <a style={{marginTop: 20}}>
                    模板下载
                  </a>
                </>

              )}
            >
              <Button type="primary">批量导入</Button>
            </Popconfirm>
          </>
        ]}

        columnEmptyText
        scroll={{x: 'max-content'}}
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
      <Drawer
        width={600}
        title={title}
        open={showDetailDrawer}
        onClose={handleClose}
        destroyOnClose={true}
      >
        <AddSystem
          handleClose={handleClose}
          actionRef={actionRef}
          success={success}
          error={error}
          currentMsg={currentMsg}
          brandList={brandList}
        />
      </Drawer>
    </>
  )
}
export default ItemList
