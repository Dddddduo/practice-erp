import ItemList from '@/pages/Order/Report/components/ItemList';
import TemplateList from '@/pages/Order/Report/components/TemplateList';
import { addRule } from '@/services/ant-design-pro/api';
import {
  getBrandList,
  getCityList,
  getList,
  getReportTeamList,
  getTeamDetailByUid,
  getTplList,
  getWorkerList,
} from '@/services/ant-design-pro/report';
import type { ActionType, ParamsType } from '@ant-design/pro-components';
import {
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Button, Drawer, message } from 'antd';
import { isEmpty } from 'lodash';
import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';

/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */
const handleAdd = async (fields: API.RuleListItem) => {
  const hide = message.loading('正在添加');
  try {
    await addRule({ ...fields });
    hide();
    message.success('Added successfully');
    return true;
  } catch (error) {
    hide();
    message.error('Adding failed, please try again!');
    return false;
  }
};

export enum SearchType {
  LoadData = 'LOAD_DATA',
  DeleteData = 'DELETE_DATA',
}

// 初始状态
const initialSearchForm = {
  brands: [],
  cities: [],
  shops: [],
  markets: [],
  workTypes: [
    {
      type: 'urgent',
      name: '紧急维修',
    },
    {
      type: 'not_urgent',
      name: '固定维保',
    },
  ],
  repairCategories: [],
  templateTypes: [],
  directors: [],
};

// reducer 函数
function searchFormReducer(state, action) {
  const { field, data } = action.payload;
  if (isEmpty(field)) {
    return state;
  }

  switch (action.type) {
    case SearchType.LoadData:
      return { ...state, [field]: [...Array.from(data)] };
    case SearchType.DeleteData:
      return { ...state, [field]: [] };
    // case UPDATE_EMAIL:
    //   return { ...state, profile: { ...state.profile, email: action.payload } };
    // case UPDATE_ADDRESS:
    //   // payload 应该是一个对象，包含 street, city 和 zip
    //   return { ...state, profile: { ...state.profile, address: { ...state.profile.address, ...action.payload } } };
    default:
      return state;
  }
}

/**
 * 报告单组件主体
 * @constructor
 */
const Report: React.FC = () => {
  console.log('--- <Report /> ---');
  const [searchDataState, dispatchSearchData] = useReducer(searchFormReducer, initialSearchForm);
  // 表单模态框
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  // 右侧弹出区域控制
  const [showDetail, setShowDetail] = useState<boolean>(false);

  // 表格实体的引用
  const actionRef = useRef<ActionType>();
  // 当前选中行
  const [currentRow, setCurrentRow] = useState<API.ReportListItem>({});
  // 选中项
  const [selectedRowsState, setSelectedRows] = useState<API.RuleListItem[]>([]);
  // 团队列表
  const [teamList, setTeamList] = useState<{ [key: string]: number }>({});
  // 团队数据详情
  const [teamDetailList, setTeamDetailList] = useState({});
  //  当前选中的tab
  const [selectedTab, setSelectedTab] = useState(-1);

  const [appoTaskId, setAppoTaskId] = useState<number>(0);

  // 国际化
  const intl = useIntl();

  const fetchSearchInitData = async () => {
    const tplResponse = await getTplList();
    if (tplResponse.success) {
      dispatchSearchData({
        type: SearchType.LoadData,
        payload: {
          field: 'templateTypes',
          data: tplResponse.data,
        },
      });
    }

    const brandResponse = await getBrandList();
    if (brandResponse.success) {
      dispatchSearchData({
        type: SearchType.LoadData,
        payload: {
          field: 'brands',
          data: Object.keys(brandResponse.data).map((key) => brandResponse.data[key]),
        },
      });
    }

    const cityResponse = await getCityList();
    if (cityResponse.success) {
      dispatchSearchData({
        type: SearchType.LoadData,
        payload: {
          field: 'cities',
          data: cityResponse.data,
        },
      });
    }

    const workerResponse = await getWorkerList();
    if (workerResponse.success) {
      dispatchSearchData({
        type: SearchType.LoadData,
        payload: {
          field: 'directors',
          data: workerResponse.data,
        },
      });
    }
    console.log('brandResponse:', workerResponse);
  };

  const handleSearchSelectedChild = (type: string, field: string, data: []) => {
    dispatchSearchData({
      type,
      payload: {
        field,
        data,
      },
    });
  };

  const handleFetchListData = useCallback(
    async ({ current, pageSize, ...params }, sort: ParamsType) => {
      console.log('handleFetchListData:params:', params);
      const retData = {
        success: false,
        total: 0,
        data: [],
      };

      const customParams = {
        page: current,
        page_size: pageSize,
        report_tid: params['report_title'] ?? '',
        report_no: params['report_no'] ?? '',
        city_id: params['city_cn'] ?? '',
        market_id: params['market_cn'] ?? '',
        store_id: params['store_cn'] ?? '',
        brand_id: params['brand_en'] ?? '',
        ma_type: params['ma_type_cn'] ?? '',
        ma_cate_id: params['ma_cate_cn'] ?? '',
        worker_uid: params['worker'] ?? '',
      };
      try {
        const response = await getList(customParams);
        if (!response.success) {
          return retData;
        }

        const data = response.data;
        retData.success = true;
        retData.total = data.total;
        retData.data = data.list ?? [];
      } catch (error) {
        message.error('数据请求异常');
      }
      console.log(retData);

      return retData;
    },
    [],
  );

  /**
   * 处理表格行选中
   * @param _
   * @param selectedRows
   */
  const handleRowSelection = (_, selectedRows) => {
    setSelectedRows(selectedRows);
  };

  /**
   * tab切换
   * @param key
   */
  const handleTabChange = (key: string | string[]) => {
    let workerUid = 0;
    if (typeof key === 'string') {
      workerUid = parseInt(key);
    }

    const reportId = currentRow?.id;
    const params = {
      report_id: reportId,
      worker_uid: workerUid,
    };

    try {
      getTeamDetailByUid(params).then((result) => {
        if (!result.success) {
          return;
        }

        setTeamDetailList(result.data);
        setSelectedTab(workerUid);
      });
    } catch (error) {
      message.error((error as Error).message);
    }
  };

  /**
   * 表格处理查新操作按钮触发
   *
   * @param record
   */
  const handleTableSearchClick = useCallback(async (record: API.ReportListItem) => {
    console.log('handleTableSearchClick:', record);
    setCurrentRow(record);
    setShowDetail(true);
    setAppoTaskId(record.appo_task_id);

    const reportId = record?.id ?? 0;
    let data: { [key: string]: number } = {};
    const params = {
      report_id: reportId,
    };

    try {
      const result = await getReportTeamList(params);
      if (!result.success) {
        message.error(result.message);
        return;
      }

      data = result.data;
      console.log('handleTableSearchClick:', data);
      const defaultKey = data['团队'] || 0;
      const details = await getTeamDetailByUid({
        report_id: reportId,
        worker_uid: defaultKey,
      });
      if (details.success) {
        setTeamDetailList(details.data);
      }
    } catch (error) {
      message.error((error as Error).message);
      setTeamDetailList({});
    } finally {
      setTeamList(data);
    }
  }, []);

  /**
   * 清理处理
   * 把和Drawer组件关联的state恢复为默认状态
   */
  const handleDrawerStateClean = () => {
    console.log('handleDrawerStateClean:run');
    setCurrentRow({});
    setShowDetail(false);
    setTeamList({});
    setTeamDetailList({});
  };

  // todo... 改造
  // todo 1.  Drawer打开和关闭，可以尝试使用userReducer来管理复杂状态。打开和关闭操作
  // todo 2. 所有点击触发的异步操作，都是有useCallback来改进
  // todo 3. useEffect只做初始化加载数据，以及销毁数据使用。另外不推荐监听依赖，因为每次变化都会更新组件，一定要监听就选择boolean值
  // todo 4. 使用Context API来处理深层次传递问题

  // 加载选择项
  useEffect(() => {
    const fetchData = async () => {
      await fetchSearchInitData();
    };

    fetchData();
  }, []);

  return (
    <PageContainer>
      <ItemList
        actionRef={actionRef}
        onListData={handleFetchListData}
        onRowSelected={handleRowSelection}
        onSearchClick={handleTableSearchClick}
        searchData={searchDataState}
        onSearchSelectedChild={handleSearchSelectedChild}
        selectedRowsState={selectedRowsState}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              <FormattedMessage id="pages.searchTable.chosen" defaultMessage="Chosen" />{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              <FormattedMessage id="pages.searchTable.item" defaultMessage="项" />
              &nbsp;&nbsp;
              <span>
                <FormattedMessage
                  id="pages.searchTable.totalServiceCalls"
                  defaultMessage="Total number of service calls"
                />{' '}
                {selectedRowsState.reduce((pre, item) => pre + item.callNo!, 0)}{' '}
                <FormattedMessage id="pages.searchTable.tenThousand" defaultMessage="万" />
              </span>
            </div>
          }
        >
          <Button
            onClick={async () => {
              // await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            <FormattedMessage
              id="pages.searchTable.batchDeletion"
              defaultMessage="Batch deletion"
            />
          </Button>
          <Button type="primary">
            <FormattedMessage
              id="pages.searchTable.batchApproval"
              defaultMessage="Batch approval"
            />
          </Button>
        </FooterToolbar>
      )}
      <ModalForm
        title={intl.formatMessage({
          id: 'pages.searchTable.createForm.newRule',
          defaultMessage: 'New rule',
        })}
        width="400px"
        open={createModalOpen}
        onOpenChange={handleModalOpen}
        onFinish={async (value) => {
          const success = await handleAdd(value as API.RuleListItem);
          if (success) {
            handleModalOpen(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.searchTable.ruleName"
                  defaultMessage="Rule name is required"
                />
              ),
            },
          ]}
          width="md"
          name="name"
        />
        <ProFormTextArea width="md" name="desc" />
      </ModalForm>
      {/*抽屉*/}
      <Drawer
        width={600}
        onClose={handleDrawerStateClean}
        closable={false}
        open={showDetail}
        destroyOnClose={true}
        title={
          currentRow.lock_status === 'locked'
            ? '查看步骤 (团队报告【已锁定】'
            : '查看步骤 (团队报告【未锁定】'
        }
      >
        <TemplateList
          lockStatus={currentRow.lock_status === 'locked'}
          itemUsers={teamList}
          onTabClick={handleTabChange}
          teamDetailList={teamDetailList}
          selectedRow={currentRow}
          selectedTab={selectedTab}
          appoTaskId={appoTaskId}
        />
      </Drawer>
    </PageContainer>
  );
};

export default Report;
