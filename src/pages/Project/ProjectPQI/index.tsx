// 导入依赖
import React, { useEffect, useState } from 'react';
import { ProTable } from '@ant-design/pro-components';
import { Button, Drawer, message } from 'antd';

import { getProjectTypeList, getProjectStatusList, deleteProject, getProjectList } from '@/services/ant-design-pro/project';
import { getBrandList } from '@/services/ant-design-pro/report';
import Estimate from './components/Estimate';

const PQIList: React.FC = () => {
  const [brandMap, setBrandMap] = useState<{[key: string]: any}>({});
  const [projectTypeMap, setProjectTypeMap] = useState<{[key: string]: any}>([]);
  const [projectStatusMap, setProjectStatusMap] = useState<{[key: string]: any}>([]);
  const [pqiDrawerVisible, setPqiDrawerVisible] = useState(false);
  const [jsDrawerVisible, setJsDrawerVisible] = useState(false);
  const [currentRow, setCurrentRow] = useState<any>(null);

  const columns = [
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <Button key="estimate" onClick={() => {
          setCurrentRow(record);
          setPqiDrawerVisible(true);
        }}>项目预估</Button>,
        <Button key="finalAccount">决算开票</Button>,
        <Button key="viewCost">查看成本</Button>,
        <Button key="reimbursement">报销</Button>,
        <Button key="viewTotal">查看总计</Button>,
        <Button key="preview">预览</Button>,
        <Button key="delete" onClick={() => handleDeleteProject(record.id)}>删除</Button>,
      ],
    },
    {
      title: '项目编号',
      dataIndex: 'project_no',
      valueType: 'text',
    },
    {
      title: '项目品牌',
      dataIndex: 'brand_en',
      valueType: 'select',
      valueEnum: brandMap,
      fieldProps: {
        showSearch: true
      },
      search: {
        transform: (value) => {
          return {
            brand_id: value
          }
        },
      },
    },
    {
      title: '项目名称',
      dataIndex: 'project_name',
      valueType: 'text',
    },
    {
      title: '项目类型',
      dataIndex: 'project_type',
      valueType: 'select',
      valueEnum: projectTypeMap,
      search: {
        transform: (value) => {
          return {
            project_type_id: value
          }
        },
      },
    },
    {
      title: '项目状态',
      dataIndex: 'project_status_cn',
      valueType: 'select',
      valueEnum: projectStatusMap,
      search: {
        transform: (value) => {
          return {
            project_status: value
          }
        },
      },
    },
  ];

  useEffect(() => {
    const loadData = async () => {

    }
    getBrandList().then(res => {
      if (res.success) {
        const brandMap = {};
        res.data.forEach(item => {
          brandMap[item.id] = item.brand_en;
        });
        setBrandMap(brandMap);
      }
    });

    getProjectTypeList().then(res => {
      if (res.success) {
        let projectTypeMap = {};
        res.data.forEach(item => {
          projectTypeMap[item.project_type_id] = item.project_type;
        });
        setProjectTypeMap(projectTypeMap);
      }
    });

    getProjectStatusList().then(res => {
      if (res.success) {
        let projectStatusMap = {};
        res.data.forEach(item => {
          projectStatusMap[item.project_status_id] = item.project_status;
        });
        setProjectStatusMap(projectStatusMap);
      }
    });
  }, []);

  const handleDeleteProject = (projectId) => {
    deleteProject(projectId).then(res => {
      if (res.success) {
        message.success('项目删除成功');
        // 可以在这里调用获取项目列表的方法来刷新列表
      } else {
        message.error('项目删除失败');
      }
    }).catch((err: Error) => {
      message.error('项目删除失败:' + err.message);
    });
  };

  return (
    <>
      <ProTable

        columns={columns}
        request={(params, sorter, filter) => getProjectList({ ...params }).then((res) => ({
          data: res.data.list,
          success: true,
          total: res.data.total,
        }))}
        rowKey="id"
        // 其他ProTable属性...
      />
      <Drawer
        key="pqi"
        title="项目预估(PQI)"
        onClose={() => setPqiDrawerVisible(false)}
        open={pqiDrawerVisible}
        width="80%"
        destroyOnClose={true}
      >
        <Estimate brandMap={brandMap} projectTypeMap={projectTypeMap} projectStatusMap={projectStatusMap} currentRow={currentRow} />
      </Drawer>
      <Drawer
        key="js"
        title="决算(JS)"
        onClose={() => setJsDrawerVisible(false)}
        open={jsDrawerVisible}
        width="80%"
        destroyOnClose={true}
      >
        {/* 决算内容，这里可以根据需求调整 */}
      </Drawer>
    </>
  );
};

export default PQIList;
