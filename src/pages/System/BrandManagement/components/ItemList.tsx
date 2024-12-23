import React, { useEffect, useState } from "react"
import { ParamsType, ProColumns, ProTable } from "@ant-design/pro-components"
import { FormattedMessage, useIntl } from "@umijs/max"
import { Button, Drawer, Image, List } from "antd"
import AddSystem from "./AddSystem"
import { getStateMap, setStateMap } from "@/utils/utils";
import { useLocation } from "@@/exports";
import UploadFiles from "@/components/UploadFiles"

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

  // 抽屉
  const [showDetailDrawer, setShowDetailDrawer] = useState(false)
  const [currentMsg, setCurrentMsg] = useState()
  const [columnsStateMap, setColumnsStateMap] = useState({});
  const location = useLocation();
  const currentPath = location.pathname;
  const pathname = currentPath.split('/')[currentPath.split('/').length - 1]

  const columns: ProColumns<API.BrandManagement>[] = [
    {
      title: (
        <FormattedMessage
          id="brandManagement.field.id"
          defaultMessage="品牌ID"
        />
      ),
      dataIndex: 'id',
      align: "center",
      search: false
    },
    {
      title: (
        <FormattedMessage
          id="brandManagement.field.logo_original_name"
          defaultMessage="Logo"
        />
      ),
      dataIndex: 'logo_original_name',
      align: "center",
      search: false,
      width: 100,
      render: (dom: any, entity) => {
        return (
          <>
            {
              entity.logo_url ?
                <Image src={entity.logo_url} alt={entity.logo_original_name}></Image> :
                <UploadFiles
                  value={entity.logo}
                  disabled={true}
                  fileLength={1}
                />
            }
          </>
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="brandManagement.field.brandname"
          defaultMessage="品牌全称"
        />
      ),
      dataIndex: 'brandname',
      align: "center",
      search: false,
      render: (dom: any, entity) => {
        return (
          <>
            <div>{entity.brandname}</div>
            <div style={{ marginTop: 10 }}>{entity.brandname_en}</div>
          </>

        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="brandManagement.field.brand"
          defaultMessage="品牌简写"
        />
      ),
      dataIndex: 'brand',
      align: "center",
      search: false,
      render: (dom: any, entity) => {
        return (
          <>
            <div>{entity.brand}</div>
            <div style={{ marginTop: 10 }}>{entity.brand_en_all}</div>
          </>
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="brandManagement.field.brand_en"
          defaultMessage="英文缩写"
        />
      ),
      dataIndex: 'brand_en',
      align: "center",
      search: false,
    },
    {
      title: (
        <FormattedMessage
          id="brandManagement.field.address"
          defaultMessage="地址"
        />
      ),
      dataIndex: 'address',
      align: "center",
      search: false,
      width: 260,
      render: (dom: any, entity) => {
        return (
          <>
            <div>{entity.address}</div>
            <div style={{ marginTop: 10 }}>{entity.address_en}</div>
          </>
        )
      }
    },
    {
      title: '联系人',
      dataIndex: 'contacts',
      align: "center",
      search: false,
      render: (cur, row) => {
        return (
          <List
            size="small"
            locale={{ emptyText: '暂无联系人' }}
            dataSource={row.contacts}
            renderItem={(item: any) => <List.Item>{item.contact_user ? item.contact_user : '暂无联系人'}</List.Item>}
          />
        )
      }
    },
    {
      title: '联系电话',
      dataIndex: 'contacts',
      align: "center",
      search: false,
      render: (cur, row) => {
        return (
          <List
            size="small"
            dataSource={row.contacts}
            renderItem={(item: any) => <List.Item>{item.contact_tel ? item.contact_tel : '暂无联系电话'}</List.Item>}
          />
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="brandManagement.field.disposition"
          defaultMessage="配置"
        />
      ),
      dataIndex: 'disposition',
      align: "center",
      search: false,
      render: (dom: any, entity) => {
        return (
          <>
            <div>服务费:{entity.administrative_cost_rate}</div>
            <div style={{ marginTop: 10 }}>利润率:{entity.profit_rate_warn}</div>
          </>
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="brandManagement.field.username"
          defaultMessage="公司负责人"
        />
      ),
      dataIndex: 'username',
      align: "center",
      search: false,
    },
    {
      title: (
        <FormattedMessage
          id="brandManagement.field.operate"
          defaultMessage="操作"
        />
      ),
      dataIndex: 'operate',
      align: "center",
      search: false,
      render: (dom: any, entity) => {
        return (
          <Button type="primary"
            onClick={() => {
              openDetailDarwer(entity)
            }}>
            修改
          </Button>
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
  useEffect(() => {
    setColumnsStateMap(getStateMap(pathname))
  }, []);
  return (
    <>
      <ProTable<API.BrandManagement, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'BrandManagement.table.title',
          defaultMessage: 'table list',
        })}
        search={false}
        toolBarRender={() => [
          <Button type="primary"
            onClick={() => {
              setShowDetailDrawer(true)
            }}
          >
            新增
          </Button>
        ]}
        columnEmptyText={false}
        scroll={{ x: 'max-content' }}
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
        width={800}
        onClose={handleClose}
        destroyOnClose={true}
        open={showDetailDrawer}
      >
        <AddSystem
          handleClose={handleClose}
          actionRef={actionRef}
          success={success}
          error={error}
          currentMsg={currentMsg}
        >
        </AddSystem>
      </Drawer>
    </>
  )
}
export default ItemList
