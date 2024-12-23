import DragTable from "@/components/Table/DragTable";
import { Button, Input, InputNumber } from "antd";


const emptyDataStruct = {
  score_index: '',
  rate: 1,
  content: '',
}

interface TableDataProps {
  currentRecord: {
    info: []
  }
  onValueChange: (path: string, value: any) => void
  score: number
}

const TableData: React.FC<TableDataProps> = ({
  currentRecord,
  onValueChange,
  score
}) => {

  const columns: any = [
    {
      title: '细分指标',
      dataIndex: 'score_index',
      width: '15%',
      align: 'center',
      render: (_, record, index) => (
        <Input
          value={record.score_index}
          placeholder='请输入细分指标'
          onChange={e => {
            onValueChange(`baseData:info:${index}:score_index`, e.target.value)
          }} />
      ),
    },
    {
      title: '权重',
      dataIndex: 'rate',
      width: '15%',
      align: 'center',
      render: (_, record, index) => {
        return (
          <>
            <InputNumber
              value={record.rate}
              placeholder='请输入权重'
              style={{ width: '100%' }}
              onChange={e => {
                onValueChange(`baseData:info:${index}:rate`, e)
              }}
              min={1}
            />
          </>
        )
      }
    },
    {
      title: '指标内容和定义',
      dataIndex: 'content',
      align: 'center',
      render: (_, record, index) => (
        <Input.TextArea
          autoSize
          value={record.content}
          placeholder='请输入指标内容和定义'
          onChange={e => {
            onValueChange(`baseData:info:${index}:content`, e.target.value)
          }}
        />
      ),
    },
  ];

  const actionColumn = (handleAddRow, handleDeleteRow) => ({
    title: '操作',
    dataIndex: 'operation',
    align: 'center',
    render: (_, record, index: number) => (
      <>
        <Button type="link" onClick={() => handleAddRow(index)}>新增</Button>
        <Button type="link" danger onClick={() => handleDeleteRow(index)}>删除</Button>
      </>
    ),
  })

  return (
    <DragTable
      sourceKey='baseData:info'
      dataSource={currentRecord?.info}
      columns={columns}
      onValueChange={onValueChange}
      actionColumn={actionColumn}
      dataStruct={emptyDataStruct}
    />
  )
}

export default TableData
