import { Button, Table } from "antd"


interface ItemListProps {

}

const AlarmLog: React.FC<ItemListProps> = () => {

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
      title: '内容',
      align: 'center',
    },
  ]

  // 清空报警记录
  const clearAlarmLog = () => {

  }

  return (
    <>
      <Button type="primary" onClick={clearAlarmLog}>清空报警记录</Button>

      <Table
        columns={columns}
      />
    </>
  )
}

export default AlarmLog