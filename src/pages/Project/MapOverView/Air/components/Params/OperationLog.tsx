import { Table } from "antd"


interface ItemListProps {

}

const OperationLog: React.FC<ItemListProps> = () => {

  const columns: any = [
    {
      title: '时间',
      align: 'center',
    },
    {
      title: '机器',
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
    },
    {
      title: '值',
      align: 'center',
    },
    {
      title: '来源',
      align: 'center',
    },
  ]

  return (
    <>
      <Table
        columns={columns}
      />
    </>
  )
}

export default OperationLog