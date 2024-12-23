import React, { useState, useEffect } from "react";
import { Form, Button, Drawer, Space, Modal, Select, Upload } from 'antd';
import { ProTable, ProColumns, ParamsType } from "@ant-design/pro-components";
import { PlusOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import { useIntl, FormattedMessage } from '@umijs/max';
import { getBrandList, getCityList } from "@/services/ant-design-pro/report";
import { managerList, batchAssign, brandShopTemplate } from "@/services/ant-design-pro/system";
import type { UploadProps } from 'antd';
import DeviceManagement from "./DeviceManagement";
import CreateOrUpdate from "./CreateOrUpdate";
import {LocalStorageService, handleParseStateChange, getStateMap, setStateMap, filterOption} from "@/utils/utils";
import GkUpload from "@/components/UploadImage/GkUpload";
import FloorPlan from "./FloorPlan";
import { useLocation } from "@@/exports";

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
  const intl = useIntl();
  const { confirm } = Modal;
  const [brandList, setBrandList] = useState<[]>([])
  const [cityList, setCityList] = useState<[]>([])
  const [manager, setManager] = useState<[]>([])
  const [showAssignment, setShowAssignment] = useState(false)
  const [showDevice, setShowDevice] = useState(false)
  const [currentItem, setCurrentItem] = useState({})
  const [managerIdList, setManagerIdList] = useState([])
  const [title, setTitle] = useState('')
  const [showCreateOrUpdate, setShowCreateOrUpdate] = useState(false)
  const [showPlan, setShowPlan] = useState(false)
  const [columnsStateMap, setColumnsStateMap] = useState({});
  const location = useLocation();
  const currentPath = location.pathname;
  const pathname = currentPath.split('/')[currentPath.split('/').length - 1]
  // 选中项
  const [selectedRowsState, setSelectedRows] = useState<API.RuleListItem[]>([]);
  /**
   * 处理表格行选中
   * @param _
   * @param selectedRows
   */
  const handleRowSelection = (_, selectedRows) => {
    setSelectedRows(selectedRows);
  }

  const columns: ProColumns<API.StoreManagement>[] = [
    {
      title: "ID",
      dataIndex: 'id',
      search: false,
      align: 'center',
    },
    {
      title: "店铺名",
      dataIndex: 'store_name_cn',
      // search: false,
      align: 'center',
    },
    {
      title: "英文名",
      dataIndex: 'store_name_en',
      search: false,
      align: 'center',
    },
    {
      title: "编号",
      dataIndex: 'store_name_abbreviate',
      search: false,
      align: 'center',
    },
    {
      title: "缩写",
      dataIndex: 'store_name_short',
      search: false,
      align: 'center',
    },
    {
      title: "品牌",
      dataIndex: 'brand_en',
      align: 'center',
      valueType: 'select',
      fieldProps: {
        showSearch: true,
        // mode: 'multiple', // 启用多选模式
        options: brandList
      }
    },
    {
      title: "城市",
      dataIndex: 'city_cn',
      align: 'center',
      valueType: 'select',
      fieldProps: {
        showSearch: true,
        // mode: 'multiple', // 启用多选模式
        options: cityList
      }
    },
    {
      title: "商场",
      dataIndex: 'market_cn',
      search: false,
      align: 'center',
    },
    {
      title: "负责人",
      width: 200,
      dataIndex: 'manager_list_str',
      search: {
        title: "店铺负责人",
      },
      align: 'center',
      valueType: 'select',
      fieldProps: {
        showSearch: true,
        // mode: 'multiple', // 启用多选模式
        options: manager
      }
    },
    {
      title: "操作",
      dataIndex: '',
      search: false,
      align: 'center',
      render: (_, entity) => {
        return (
          <>
            <Space>
              <Button
                type="primary"
                onClick={() => {
                  setCurrentItem(entity)
                  setShowCreateOrUpdate(true);
                  setTitle('修改店铺')
                }}
              >
                修改
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  setShowDevice(true)
                  setCurrentItem(entity)
                }}
              >
                设备管理
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  setShowPlan(true)
                  setCurrentItem(entity)
                }}
              >
                内装平面图
              </Button>
            </Space>
          </>
        )
      }
    },
  ]

  const handleAssignment = () => {
    if (selectedRowsState.length < 1) {
      error('请选择店铺')
      return
    }
    setShowAssignment(true)
  }

  const showConfirm = (type) => {
    if (type === 'create') {
      setShowDevice(false)
      return
    }
    confirm({
      title: '提示',
      icon: <ExclamationCircleFilled />,
      content: '是否取消当前的变动',
      onOk() {
        setShowDevice(false)
      },
    });
  };

  const handleChangeManager = (e) => {
    setManagerIdList(e)
  }

  const handleAssignmentOk = () => {
    batchAssign({
      manager_id_arr: managerIdList ?? [],
      store_id_arr: selectedRowsState.map(item => item.id) ?? []
    }).then(res => {
      if (res.success) {
        setShowAssignment(false)
        actionRef.current.reload()
        success('分配成功')
        return
      }
      error(res.message)
    })
  }

  const handleCloseCreateOrUpdate = () => {
    setShowCreateOrUpdate(false)
    setCurrentItem({})
  }

  const loginInfo = LocalStorageService.getItem('loginInfo');
  const { accessToken, tokenType } = loginInfo;

  useEffect(() => {
    setColumnsStateMap(getStateMap(pathname))
  }, []);

  const props: UploadProps = {
    name: 'file',
    data: { source: 'report' },
    action: '/prod-api/brand/brand-shop-import',
    headers: {
      authorization: `${tokenType} ${accessToken}`,
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        // console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        if (info.file.response.data.msg === 'success') {
          success(info.file.response.data.msg);
          return
        }
        error(info.file.response.data.msg);
      } else if (info.file.status === 'error') {
        error(`${info.file.name} file upload failed.`);
      }
    },
  };

  const handleDownLoad = () => {
    brandShopTemplate().then(res => {
      function downloadArrayBuffer(arrayBuffer, fileName) {
        // 将 ArrayBuffer 转换为 Blob
        const blob = new Blob([arrayBuffer], { type: 'application/octet-stream' });

        // 创建一个指向 Blob 的 URL
        const url = URL.createObjectURL(blob);

        // 创建一个 a 元素
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName; // 设置下载的文件名

        // 模拟点击 a 元素，触发下载
        document.body.appendChild(link); // 将 a 元素添加到文档中使得 click 生效
        link.click();

        // 清理：下载后移除元素和释放 Blob URL
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }

      // 使用示例
      // const arrayBuffer = new ArrayBuffer(8); // 示例 ArrayBuffer，实际使用时替换为你的 ArrayBuffer
      downloadArrayBuffer(res, '店铺信息模板.xlsx'); // 下载文件，'example.bin' 为文件名
    })
  }

  const handleClosePlan = () => {
    setShowPlan(false)
    setCurrentItem({})
  }

  const handleValueChange: any = (path: string, value: any) => {
    const newData = handleParseStateChange(currentItem, path, value.deviceData ? value.deviceData : value)
    setCurrentItem(newData)
  };

  useEffect(() => {
    getBrandList().then(res => {
      setBrandList(res.data.map(item => {
        return {
          value: item.id,
          label: item.brand_en
        }
      }))
    })
    getCityList().then(res => {
      setCityList(res.data.map(item => {
        return {
          value: item.id,
          label: item.city_cn
        }
      }))
    })
    managerList().then(res => {
      setManager(res.data.map(item => {
        return {
          value: item.id,
          label: item.name
        }
      }))
    })
  }, [])

  return (
    <>
      <ProTable<API.StoreManagement, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'storeManagement.table.title',
          defaultMessage: 'table list',
        })}
        scroll={{ x: 'max-content' }}
        actionRef={actionRef}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setShowCreateOrUpdate(true);
              setTitle('新增店铺')
            }}
          >
            <PlusOutlined />
            <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          </Button>,

          <Upload {...props}>
            <Button
              type="primary"
              key="primary"
            // onClick={() => {
            //   setShowDetailDrawer(true);
            // }}
            >
              导入
            </Button>
          </Upload>,

          <Button
            type="primary"
            key="primary"
            onClick={handleDownLoad}
          >
            下载模板
          </Button>,

          <Button
            type="primary"
            key="primary"
            onClick={handleAssignment}
          >
            <PlusOutlined />
            分配
          </Button>,
        ]}
        rowSelection={{
          onChange: handleRowSelection
        }}
        columnEmptyText={false}
        columns={columns}
        request={onListData}
        columnsState={{
          value: columnsStateMap,
          onChange: (newState) => {
            setColumnsStateMap(newState)
            setStateMap(pathname, newState)
          }
        }}
        onDataSourceChange={(e) => {
          // 清空选中项
          actionRef.current.clearSelected();
        }}
      />

      {/* <Drawer
        open={showDevice}
        width={800}
        onClose={showConfirm}
        destroyOnClose={true}
        title="设备管理"
        maskClosable={false}
        keyboard={false}
      >
        <DeviceManagement
          actionRef={actionRef}
          success={success}
          error={error}
          handleCloseDevice={showConfirm}
          currentItem={currentItem}
        />
      </Drawer> */}

      {
        showDevice &&
        <DeviceManagement
          visible={showDevice}
          onValueChange={handleValueChange}
          currentItem={currentItem}
          onClose={showConfirm}
          actionRef={actionRef}
        />
      }

      {/* 分配按钮 */}
      <Modal
        open={showAssignment}
        onCancel={() => setShowAssignment(false)}
        title="分配管理员"
        destroyOnClose={true}
        onOk={handleAssignmentOk}
      >
        <Select
          options={manager}
          style={{ width: 300 }}
          mode="multiple"
          onChange={handleChangeManager}
          placeholder="请选择"
          showSearch
          filterOption={filterOption}
        />
      </Modal>

      <Drawer
        width={800}
        open={showCreateOrUpdate}
        title={title}
        onClose={handleCloseCreateOrUpdate}
        destroyOnClose={true}
      >
        <CreateOrUpdate
          handleCloseCreateOrUpdate={handleCloseCreateOrUpdate}
          actionRef={actionRef}
          success={success}
          error={error}
          currentItem={currentItem}
          brandList={brandList}
          cityList={cityList}
          manager={manager}
        />
      </Drawer>

      <Drawer
        width={800}
        open={showPlan}
        onClose={handleClosePlan}
        destroyOnClose={true}
        title="内装平面图"
      >
        <FloorPlan
          handleClosePlan={handleClosePlan}
          actionRef={actionRef}
          currentItem={currentItem}
          success={success}
          error={error}
        />
      </Drawer>
    </>
  )
}

export default ItemList
