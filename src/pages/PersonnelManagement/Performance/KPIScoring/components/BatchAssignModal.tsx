import React, { useEffect, useState } from 'react';
import { Modal, Select, message } from 'antd';
import { getEmployeeAll, getKpiTableListAll, shareKpi } from '@/services/ant-design-pro/kpi';
import { log } from "mathjs";

interface BatchAssignModalProps {
  visible: boolean;
  onClose: () => void;
  selectedRowKeys: React.Key[];
  year: string;
  quarter: string;
  actionRef: any
  handleClear: () => void
}

const BatchAssignModal: React.FC<BatchAssignModalProps> = ({
  visible,
  onClose,
  year,
  quarter,
  selectedRowKeys,
  actionRef,
  handleClear
}) => {
  const [employees, setEmployees] = useState([]);
  const [kpiTables, setKpiTables] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(undefined);
  const [selectedKpiTable, setSelectedKpiTable] = useState(undefined);

  useEffect(() => {
    async function fetchAllData() {
      try {
        const employeesResponse = await getEmployeeAll({ status: '在职' });
        setEmployees(employeesResponse.data);
        const kpiParams = {
          is_delete: 0,
          use_for: 'hr'
        };
        const kpiTablesResponse = await getKpiTableListAll(kpiParams);
        setKpiTables(kpiTablesResponse.data);
      } catch (error) {
        message.error('获取数据失败: ' + (error as Error).message);
      }
    }

    if (visible) {
      fetchAllData();
    }
  }, [visible]);

  const handleConfirm = async () => {
    // 校验选择项
    console.log("handleConfirm", selectedEmployee, selectedKpiTable, selectedRowKeys, selectedRowKeys.length, year, quarter)
    if (!selectedEmployee || !selectedKpiTable || selectedRowKeys.length === 0) {
      message.error('所有字段都是必选项，请确保已全部选择！');
      return;
    }

    // 提交数据
    try {
      await shareKpi({
        kpi_table_id: selectedKpiTable,
        eid_list: selectedEmployee, // 示例中假设只选择了一个打分人员，根据实际需求调整
        kpi_eid_list: selectedRowKeys,
        year,
        quarter
      });
      actionRef.current.clearSelected()
      actionRef.current.reload()
      message.success('分配成功');
      // handleClear()
      onClose(); // 关闭Modal并清空选择
    } catch (error) {
      message.error('分配失败: ' + (error as Error).message);
    }
  };

  return (
    <Modal
      title="批量分配"
      open={visible}
      onOk={handleConfirm}
      onCancel={onClose}
      afterClose={() => {
        setSelectedEmployee(undefined);
        setSelectedKpiTable(undefined);
        setEmployees([]);
        setKpiTables([]);
      }}
      destroyOnClose={true}
    >
      <Select
        showSearch
        mode="multiple"
        style={{ width: '100%', marginBottom: 16 }}
        placeholder="选择打分人员"
        optionFilterProp="children"
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        onChange={(value) => {
          setSelectedEmployee(value)
        }}
      >
        {employees.map((emp) => {
          return <Select.Option key={emp.eid} value={emp.eid}>{`${emp.name} (${emp.job_no})`}</Select.Option>
        })}
      </Select>
      <Select
        showSearch
        style={{ width: '100%' }}
        placeholder="选择绩效考核"
        optionFilterProp="children"
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        onChange={(value) => setSelectedKpiTable(value)}
      >
        {kpiTables.map((kpi) => (
          <Select.Option key={kpi.id} value={kpi.id}>{kpi.title}</Select.Option>
        ))}
      </Select>
    </Modal>
  );
};

export default BatchAssignModal;
