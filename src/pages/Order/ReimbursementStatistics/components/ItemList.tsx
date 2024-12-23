import React, { RefObject, useEffect, useState } from "react"
import type { ActionType, ParamsType } from "@ant-design/pro-components";
import { ProTable, ProColumns } from "@ant-design/pro-components";
import { useIntl, FormattedMessage } from "@umijs/max";
import { Button, Drawer, Form, Tag } from "antd";
import { ExportOutlined } from "@ant-design/icons";
import { getBrandList, getCityList, getWorkerList } from "@/services/ant-design-pro/report";
import { statsExport } from "@/services/ant-design-pro/reimbursementStatistics";
import { getUploadToken } from "@/services/ant-design-pro/quotation";
import OSS from "ali-oss";

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
  actionRef: RefObject<ActionType>;
  success: (text: string) => void
  error: (text: string) => void
  params: {}
}

const ItemList: React.FC<ItemListProps> = ({
  onListData,
  actionRef,
  success,
  error,
  params,
}) => {
  const intl = useIntl()
  const [brandList, setBrandList] = useState<{ id: number, brand_en: string }[]>([])
  const [cityList, setCityList] = useState<{ id: number, city_cn: string }[]>([])
  const [workerList, setWorkerList] = useState<{ worker_id: number, worker: string }[]>([])
  const [loadings, setLoadings] = useState<boolean[]>([]);

  const columns: ProColumns<API.ReimbursementStatisticsParams>[] = [
    {
      title: (
        <FormattedMessage
          id="reimbursementStatistics.field.month"
          defaultMessage="月份"
        />
      ),
      dataIndex: 's_month',
      align: 'center',
      search: false,
    },
    {
      title: (
        <FormattedMessage
          id="reimbursementStatistics.field.name"
          defaultMessage="负责人"
        />
      ),
      dataIndex: 'name',
      align: 'center',
      valueType: 'select',
      valueEnum: workerList?.reduce((acc, item) => {
        acc[`${item.worker_id}`] = { text: item.worker };
        return acc;
      }, {}),
      fieldProps: {
        showSearch: true
      },
    },
    {
      title: (
        <FormattedMessage
          id="reimbursementStatistics.field.brand"
          defaultMessage="品牌"
        />
      ),
      dataIndex: 'brand',
      align: 'center',
      hideInTable: true,
      valueType: 'select',
      valueEnum: brandList?.reduce((acc, item) => {
        acc[`${item.id}`] = { text: item.brand_en };
        return acc;
      }, {}),
      fieldProps: {
        showSearch: true
      },
    },
    {
      title: (
        <FormattedMessage
          id="reimbursementStatistics.field.city"
          defaultMessage="城市"
        />
      ),
      dataIndex: 'city',
      align: 'center',
      valueType: 'select',
      valueEnum: cityList?.reduce((acc, item) => {
        acc[`${item.id}`] = { text: item.city_cn };
        return acc;
      }, {}),
      fieldProps: {
        showSearch: true
      },
    },
    {
      title: (
        <FormattedMessage
          id="reimbursementStatistics.field.detail"
          defaultMessage="项目"
        />
      ),
      dataIndex: 'detail',
      align: 'center',
      search: {
        title: '明细'
      },
    },
    {
      title: (
        <FormattedMessage
          id="reimbursementStatistics.field.price"
          defaultMessage="单价"
        />
      ),
      dataIndex: 'price',
      align: 'center',
      search: false,
    },
    {
      title: (
        <FormattedMessage
          id="reimbursementStatistics.field.num"
          defaultMessage="数量"
        />
      ),
      dataIndex: 'num',
      align: 'center',
      search: false,
    },
    {
      title: (
        <FormattedMessage
          id="reimbursementStatistics.field.unit"
          defaultMessage="单位"
        />
      ),
      dataIndex: 'unit',
      align: 'center',
      search: false,
    },
    {
      title: (
        <FormattedMessage
          id="reimbursementStatistics.field.total_price"
          defaultMessage="总价"
        />
      ),
      dataIndex: 'total_price',
      align: 'center',
      search: false,
    },
    {
      title: (
        <FormattedMessage
          id="reimbursementStatistics.field.create_at"
          defaultMessage="创建时间"
        />
      ),
      dataIndex: 'create_at',
      hideInTable: true,
      align: 'center',
      valueType: 'dateRange',
    },
  ]

  const exportFile = (index) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });
    statsExport(params).then(result => {
      if (result.success) {
        if (result.data && result.data.filename) {
          getUploadToken({ file_suffix: 'xlsx', only_download: 1 }).then(res => {
            const ossData = res.data
            const client = new OSS({
              region: 'oss-' + ossData.region_id,
              accessKeySecret: ossData.access_secret,
              accessKeyId: ossData.access_id,
              stsToken: ossData.secret_token,
              bucket: ossData.bucket
            })
            const filename = '报销统计.xlsx'
            const response = {
              'content-disposition': `attachment; filename=${encodeURIComponent(filename)}`
            }
            const url = client.signatureUrl(result.data.filename, { response })
            const iframe = document.createElement('iframe')
            iframe.style.display = 'none'
            iframe.src = url
            document.body.appendChild(iframe)
            setTimeout(() => {
              document.body.removeChild(iframe)
            }, 200)
            setLoadings((prevLoadings) => {
              const newLoadings = [...prevLoadings];
              newLoadings[index] = false;
              return newLoadings;
            });
          })
        }
        return
      }
      error(result.message)
      setLoadings((prevLoadings) => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = false;
        return newLoadings;
      });
    })
  }

  useEffect(() => {
    getBrandList().then(res => {
      if (res.success) {
        setBrandList(Object.keys(res.data).map(key => res.data[key]))
      }
    })
    getCityList().then(res => {
      if (res.success) {
        setCityList(res.data)
      }
    })
    getWorkerList().then(res => {
      if (res.success) {
        setWorkerList(res.data)
      }
    })
  }, [])

  return (
    <>
      <ProTable<API.ReimbursementStatisticsParams, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'reimbursementStatistics.table.title',
          defaultMessage: 'table list',
        })}
        actionRef={actionRef}
        scroll={{ x: 'max-content' }}
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            icon={<ExportOutlined />}
            loading={loadings[1]}
            onClick={() => exportFile(1)}
          >
            <FormattedMessage id="pages.searchTable.export" defaultMessage="Export" />
          </Button>,
        ]}
        request={onListData}
        columns={columns}
      />
    </>
  )
}

export default ItemList
