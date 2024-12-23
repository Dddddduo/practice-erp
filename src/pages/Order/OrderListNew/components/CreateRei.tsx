import React from "react";
import {Button, Form, Input, Radio, Select} from "antd";
import {StringDatePicker} from "@/components/StringDatePickers";
import UploadFiles from "@/components/UploadFiles";
import {ColumnsType} from "antd/es/table";
import DynamicTable from "@/components/Table/DynamicTable";
import {useReiDataSource} from "@/hooks/useReiDataSource";

interface CreateReiProps {
  handleReiFormData,
  handleReiFormChange,
  onChangeFinish,
  onChangeCompletedFinish,
  isCompleted,
  recordData,
  dataSource,
  handleFullValueChange,
}

const CreateRei: React.FC<CreateReiProps> = ({
                                               handleReiFormData,
                                               handleReiFormChange,
                                               onChangeFinish,
                                               onChangeCompletedFinish,
                                               isCompleted,
                                               recordData,
                                               dataSource,
                                               handleFullValueChange,
                                             }) => {

  // const {currentData, formRef, handleFullValueChange, handleFinish} = useReiDataSource(recordData);

  const emptyDataStruct = {
    detail: '',
    num: '',
    price: '',
    total_price: 0,
    remark: '',
    worker_uid: '',
    reim_type: '',
  }
  const actionColumn = (handleAddRow, handleDeleteRow) => ({
    title: '操作',
    dataIndex: 'operation',
    render: (_, record, index: number) => (
      <>
        <Button type="link" onClick={() => handleAddRow(index)}>新增</Button>
        <Button type="link" danger onClick={() => handleDeleteRow(index)}>删除</Button>
      </>
    ),
  })

  const columns = [
    {
      title: '明细',
      dataIndex: 'detail',
      render: (dom, entity) => {
        return (<Input style={{ width: 150 }} defaultValue={dom} />)
      },
    },
    {
      title: '数量',
      dataIndex: 'num',
      render: (dom, entity) => {
        return (
          <Input style={{ width: 150 }} defaultValue={dom} onInput={(e) => { }}
                 addonAfter={<Select style={{ width: 80 }}
                                     defaultValue={entity.unit} options={dataSource.optionsUnit} />
                 } />
        )
      }
    },
    {
      title: '单价',
      dataIndex: 'price',
      render: (dom, entity) => {
        return (<Input style={{ width: 150 }} defaultValue={dom} />)
      }
    },
    {
      title: '小计',
      dataIndex: 'total_price',
      render: (dom) => {
        return (<Input readOnly disabled style={{ width: 150 }} defaultValue={dom} />)
      }
    },
    {
      title: '备注',
      dataIndex: 'remark',
      render: (dom, entity) => {
        return (<Input style={{ width: 150 }} defaultValue={dom} />)
      }
    },
    {
      title: '合作工人',
      dataIndex: 'worker_uid',
      render: (dom, entity) => {
        return (
          <Select placeholder="请选择" style={{ width: 150 }} defaultValue={dom} options={dataSource.optionsWorker}
                  onChange={(e) => { }}></Select>
        )
      }
    },
    {
      title: '费用类别',
      dataIndex: 'reim_type',
      render: (dom, entity) => {
        return (
          <Select placeholder="请选择" style={{ width: 150 }} defaultValue={dom} options={dataSource.optionsType}
                  onChange={(e) => { }}></Select>
        )
      }
    }
  ]

  return (
    <Form layout="vertical" form={handleReiFormData} onValuesChange={handleReiFormChange}>
      <Form.Item
        name="order_no"
        label="报销单编号"
        rules={[{required: true, message: '请输入报销单编号'}]}
      >
        <Input
          readOnly // 只读模式
        />
      </Form.Item>

      <Form.Item label="申请日期" name="submit_at">
        <StringDatePicker/>
      </Form.Item>


      <Form.Item label="是否完工" name="is_completed">
        <Radio.Group onChange={onChangeCompletedFinish}>
          <Radio value={0}>否</Radio>
          <Radio value={1}>是</Radio>
        </Radio.Group>
      </Form.Item>

      {
        isCompleted === 1 &&
        <Form.Item label="完工日期" name="completed_at">
          <StringDatePicker/>
        </Form.Item>
      }

      <Form.Item
        name="brand_cn"
        label="品牌"
        rules={[{required: true, message: '请选择品牌'}]}
      >
        <Input
          readOnly // 只读模式
        />
      </Form.Item>

      <Form.Item
        name="city_cn"
        label="城市"
        rules={[{required: true, message: '请输入城市'}]}
      >
        <Input
          readOnly // 只读模式
        />
      </Form.Item>

      <Form.Item
        name="market_cn"
        label="商场"
        rules={[{required: true, message: '请输入商场'}]}
      >
        <Input
          readOnly // 只读模式
        />
      </Form.Item>

      <Form.Item
        name="company_en"
        label="店铺"
        rules={[{required: true, message: '请输入店铺'}]}
      >
        <Input
          readOnly // 只读模式
        />
      </Form.Item>

      <Form.Item
        name="a_cate_cn"
        label="工作类型"
        rules={[{required: true, message: '请选择工作类型'}]}
      >
        <Input
          readOnly // 只读模式
        />
      </Form.Item>

      <Form.Item
        name="ma_type_cn"
        label="工作内容"
        rules={[{required: true, message: '请输入工作内容'}]}
      >
        <Input.TextArea
          value={handleReiFormData.work_content}
          onChange={(e) => handleReiFormChange({work_content: e.target.value})}
          readOnly // 只读模式
        />
      </Form.Item>

      <Form.Item
        name="worker_price"
        label="工人费用"
        rules={[{required: true, message: '请输入工人费用'}]}
      >
        <Input
          readOnly // 只读模式
        />
      </Form.Item>

      <Form.Item
        name="leader_price"
        label="负责人费用"
        rules={[{required: true, message: '请输入负责人费用'}]}
      >
        <Input
          readOnly // 只读模式
        />
      </Form.Item>

      <Form.Item
        name="total_price"
        label="Sub-Total"
        rules={[{required: true, message: '请输入小计'}]}
      >
        <Input
          value={handleReiFormData.subtotal}
          readOnly // 只读模式
        />
      </Form.Item>

      <Form.Item label="明细" name="reim_detail_list">
        <DynamicTable
          style={{width: '100%', overflowX: 'auto'}}
          sourceKey="detailsDataSource"
          dataSource={dataSource.detailsDataSource}
          onValueChange={handleFullValueChange}
          // formRef={formRef}
          columns={columns.map((item, index) => {
            if ('key' in item) {
              return item
            }
            return {
              ...item,
              key: index
            }
          })}
          actionColumn={actionColumn}
          dataStruct={emptyDataStruct}
        />
      </Form.Item>

      <Form.Item
        label="签收单"
      >
        <UploadFiles/>
      </Form.Item>

      <Form.Item
        label="发票或收据(可选)"
      >
        <UploadFiles/>
      </Form.Item>

      <Form.Item
        name="is_report"
        label="是否预报价"
      >
        {handleReiFormData.getFieldValue('is_report') ? '是' : '否'}
      </Form.Item>
    </Form>
  );
}

export default CreateRei;
