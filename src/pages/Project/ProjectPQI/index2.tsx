// 引入所需模块和库
import React, { useEffect, useState } from 'react';
import { Button, message, Modal } from 'antd';
import { ProTable } from '@ant-design/pro-components';
import { getProjectTypeList, getProjectStatusList, deleteProject, getProjectList } from '@/services/ant-design-pro/project';
import { getBrandList } from '@/services/ant-design-pro/report';

interface ProjectListItem {
  id: number;
  project_no: string;
  brand_en: string;
  project_name: string;
  project_type: string;
  project_status_cn: string;
}

const PQIList: React.FC = () => {
  const [brandMap, setBrandMap] = useState<{[key: string]: any}>({});
  const [projectTypeMap, setProjectTypeMap] = useState<{[key: string]: any}>([]);
  const [projectStatusMap, setProjectStatusMap] = useState<{[key: string]: any}>([]);

  useEffect(() => {
    // 获取品牌列表
    getBrandList().then(res => {
      const brandMap = {};
      res.data.forEach(item => {
        brandMap[item.id] = item.brand_en;
      });
      setBrandMap(brandMap);
    });

    // 获取项目类型列表
    getProjectTypeList().then(res => {
      const projectTypeMap = {};
      res.data.forEach(item => {
        projectTypeMap[item.project_type_id] = item.project_type;
      });
      setProjectTypeMap(projectTypeMap);
    });

    // 获取项目状态列表
    getProjectStatusList().then(res => {
      const projectStatusMap = {};
      res.data.forEach(item => {
        projectStatusMap[item.project_status_id] = item.project_status;
      });
      setProjectStatusMap(projectStatusMap);
    });
  }, []);

  const columns = [
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <Button key="estimate">项目预估</Button>,
        <Button key="finalAccount">决算开票</Button>,
        <Button key="viewCost">查看成本</Button>,
        <Button key="reimbursement">报销</Button>,
        <Button key="viewTotal">查看总计</Button>,
        <Button key="preview">预览</Button>,
        <Button key="delete" onClick={() => handleDelete(record)}>删除</Button>,
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

  const handleDelete = (record: ProjectListItem) => {
    Modal.confirm({
      title: '确认删除这个项目吗？',
      onOk: () => {
        deleteProject({ id: record.id }).then(res => {
          if (res.success) {
            message.success('删除成功');
            // 重新加载列表等其他逻辑
          } else {
            message.error('删除失败');
          }
        }).catch(() => {
          message.error('删除失败');
        });
      },
    });
  };

  return (
    <ProTable<ProjectListItem>
      columns={columns}
      request={(params, sorter, filter) => getProjectList({ ...params }).then((res) => ({
        data: res.data.list,
        success: true,
        total: res.data.total,
      }))}
      rowKey="id"
      pagination={{
        showQuickJumper: true,
      }}
      search={{
        layout: 'vertical',
      }}
      dateFormatter="string"
    />
  );
};

export default PQIList;
