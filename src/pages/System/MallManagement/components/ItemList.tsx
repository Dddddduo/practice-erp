import React, {useEffect, useState} from "react"
import {ParamsType, ProColumns, ProTable} from "@ant-design/pro-components"
import {FormattedMessage, useIntl} from "@umijs/max"
import {Button, Drawer} from "antd";
import {getCityList} from "@/services/ant-design-pro/report";
import {PlusOutlined} from "@ant-design/icons";
import Addsystem from "./Addsystem";
import {marketsExportExcel} from "@/services/ant-design-pro/system";
import {exportExcel, getStateMap, setStateMap} from "@/utils/utils";
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
  success,
  error
}

const ItemList: React.FC<ItemListProps> = ({
                                             onListData,
                                             actionRef,
                                             success,
                                             error
                                           }) => {
  const [loadings, setLoadings] = useState<boolean[]>([]);
  const intl = useIntl()
  // 城市
  const [cityList, setCityList] = useState()
  // 抽屉
  const [showDetailDrawer, setShowDetailDrawer] = useState(false)
  const [currentMsg, setCurrentMsg] = useState()
  const [title, setTitle] = useState()
  const [queryForm, setQueryForm] = useState({
    city: '',
    market: ''
  })
  const [columnsStateMap, setColumnsStateMap] = useState({});
  const location = useLocation();
  const currentPath = location.pathname;
  const pathname = currentPath.split('/')[currentPath.split('/').length - 1]

  const columns: ProColumns<API.MallManagement>[] = [
    {
      title: (
        <FormattedMessage
          id="mallManagement.field.id"
          defaultMessage="商场ID"
        />
      ),
      dataIndex: 'id',
      align: "center",
      search: false
    },
    {
      title: (
        <FormattedMessage
          id="mallManagement.field.city"
          defaultMessage="城市"
        />
      ),
      dataIndex: 'city',
      align: "center",
      valueType: 'select',
      valueEnum: cityList?.reduce((acc, item) => {
        acc[`${item.id}`] = {text: item.city_cn};
        return acc;
      }, {}),
      fieldProps: {
        showSearch: true,
        onChange: (key, option) => {
          setQueryForm({
            ...queryForm,
            city: option.label
          })
        }
      }
    },
    {
      title: (
        <FormattedMessage
          id="mallManagement.field.market"
          defaultMessage="商场中文名"
        />
      ),
      dataIndex: 'market',
      align: "center",
      fieldProps: {
        onChange: (key) => {
          setQueryForm({
            ...queryForm,
            market: key.target.value
          })
        }
      }
    },
    {
      title: (
        <FormattedMessage
          id="mallManagement.field.market_en"
          defaultMessage="商场英文名"
        />
      ),
      dataIndex: 'market_en',
      search: false,
      align: "center"
    },
    {
      title: (
        <FormattedMessage
          id="mallManagement.field.address"
          defaultMessage="地址中文"
        />
      ),
      dataIndex: 'address',
      search: false,
      align: "center",
      width: 300
    },
    {
      title: (
        <FormattedMessage
          id="mallManagement.field.address_en"
          defaultMessage="地址英文"
        />
      ),
      dataIndex: "address_en",
      search: false,
      align: "center",
      width: 300
    },
    {
      title: (
        <FormattedMessage
          id="mallManagement.field.operate"
          defaultMessage="操作"
        />
      ),
      dataIndex: "operate",
      search: false,
      align: 'center',
      render: (dom: any, entity) => {
        return (
          <div>
            <Button type="primary"
                    onClick={() => {
                      openDetailDarwer(entity)
                    }}
            >编辑</Button>
          </div>
        )
      }
    }

  ]
  const openDetailDarwer = (e) => {
    setCurrentMsg(e)
    setShowDetailDrawer(true)
    setTitle("修改商场")
  }
  const handleClose = () => {
    setCurrentMsg(undefined)
    setShowDetailDrawer(false)
  }
  useEffect(() => {
    setColumnsStateMap(getStateMap(pathname))
    getCityList().then(res => {
      setCityList(res.data)
    })
  }, [])

  const exportFile = (e, index) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });

    marketsExportExcel(queryForm).then(res => {
      if (!res.success) {
        setLoadings((prevLoadings) => {
          const newLoadings = [...prevLoadings];
          newLoadings[index] = false;
          return newLoadings;
        });
        error('数据生成失败:' + res.message)
        return
      }
      console.log(res.data.data);
      exportExcel('markets/downloadExcel', res.data.data, res.data.data.filename)
      setTimeout(() => {
        setLoadings((prevLoadings) => {
          const newLoadings = [...prevLoadings];
          newLoadings[index] = false;
          return newLoadings;
        })
      }, 2000)
    }).catch(e => {
      setLoadings((prevLoadings) => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = false;
        return newLoadings;
      })
      error('下载出错' + e.message)
    })
  }
  return (
    <>
      <ProTable<API.MallManagement, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'MallManagement.table.title',
          defaultMessage: 'table list',
        })}

        toolBarRender={() => [
          <>
            <Button
              type="primary"
              key="primary"
              onClick={() => {
                setShowDetailDrawer(true)
                setTitle("添加商场")
              }}
            >
              <PlusOutlined/>
              <FormattedMessage id="pages.searchTable.new" defaultMessage="New"/>
            </Button>
            <Button type="primary"
                    loading={loadings[1]} onClick={(e) => {
              exportFile(e, 1)
            }}>
              导出
            </Button>
          </>

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
          cityList={cityList}

        />
      </Drawer>
    </>
  )
}
export default ItemList
