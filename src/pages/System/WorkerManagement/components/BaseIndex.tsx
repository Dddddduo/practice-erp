import { Button, Divider, Input, InputNumber, Table } from "antd"
import React, { useEffect, useState } from "react"
import { showScore, createOrUpdateScore } from "@/services/ant-design-pro/system"

interface ItemListProps {
  handleCloseBaseIndex: () => void
  currentMsg: any
  actionRef
  success: (text: string) => void
  error: (text: string) => void
}

const BaseIndex: React.FC<ItemListProps> = ({
  handleCloseBaseIndex,
  currentMsg,
  actionRef,
  success,
  error,
}) => {
  const [year, setYear] = useState([])
  const [baseDataOne, setBaseDataOne] = useState([
    {
      Q1: '',
      Q2: '',
      Q3: '',
      Q4: '',
    },
  ])
  const [baseDataTwo, setBaseDataTwo] = useState([
    {
      Q1: '',
      Q2: '',
      Q3: '',
      Q4: '',
    },
  ])
  const [baseDataThree, setBaseDataThree] = useState([
    {
      Q1: '',
      Q2: '',
      Q3: '',
      Q4: '',
    },
  ])

  const columnsOne = [
    {
      title: '第一季度',
      align: 'center',
      dataIndex: 'Q1',
      render: (dom, entity) => {
        return (
          <InputNumber style={{ width: 150 }} value={dom} onInput={(e) => handleInputOne(e, 'Q1')} />
        )
      }
    },
    {
      title: '第二季度',
      align: 'center',
      dataIndex: 'Q2',
      render: (dom, entity) => {
        return (
          <InputNumber style={{ width: 150 }} value={dom} onInput={(e) => handleInputOne(e, 'Q2')} />
        )
      }
    },
    {
      title: '第三季度',
      align: 'center',
      dataIndex: 'Q3',
      render: (dom, entity) => {
        return (
          <InputNumber style={{ width: 150 }} value={dom} onInput={(e) => handleInputOne(e, 'Q3')} />
        )
      }
    },
    {
      title: '第四季度',
      align: 'center',
      dataIndex: 'Q4',
      render: (dom, entity) => {
        return (
          <InputNumber style={{ width: 150 }} value={dom} onInput={(e) => handleInputOne(e, 'Q4')} />
        )
      }
    },
  ]

  const columnsTwo = [
    {
      title: '第一季度',
      align: 'center',
      dataIndex: 'Q1',
      render: (dom, entity) => {
        return (
          <InputNumber style={{ width: 150 }} value={dom} onInput={(e) => handleInputTwo(e, 'Q1')} />
        )
      }
    },
    {
      title: '第二季度',
      align: 'center',
      dataIndex: 'Q2',
      render: (dom, entity) => {
        return (
          <InputNumber style={{ width: 150 }} value={dom} onInput={(e) => handleInputTwo(e, 'Q2')} />
        )
      }
    },
    {
      title: '第三季度',
      align: 'center',
      dataIndex: 'Q3',
      render: (dom, entity) => {
        return (
          <InputNumber style={{ width: 150 }} value={dom} onInput={(e) => handleInputTwo(e, 'Q3')} />
        )
      }
    },
    {
      title: '第四季度',
      align: 'center',
      dataIndex: 'Q4',
      render: (dom, entity) => {
        return (
          <InputNumber style={{ width: 150 }} value={dom} onInput={(e) => handleInputTwo(e, 'Q4')} />
        )
      }
    },
  ]

  const columnsThree = [
    {
      title: '第一季度',
      align: 'center',
      dataIndex: 'Q1',
      render: (dom, entity) => {
        return (
          <InputNumber style={{ width: 150 }} value={dom} onInput={(e) => handleInputThree(e, 'Q1')} />
        )
      }
    },
    {
      title: '第二季度',
      align: 'center',
      dataIndex: 'Q2',
      render: (dom, entity) => {
        return (
          <InputNumber style={{ width: 150 }} value={dom} onInput={(e) => handleInputThree(e, 'Q2')} />
        )
      }
    },
    {
      title: '第三季度',
      align: 'center',
      dataIndex: 'Q3',
      render: (dom, entity) => {
        return (
          <InputNumber style={{ width: 150 }} value={dom} onInput={(e) => handleInputThree(e, 'Q3')} />
        )
      }
    },
    {
      title: '第四季度',
      align: 'center',
      dataIndex: 'Q4',
      render: (dom, entity) => {
        return (
          <InputNumber style={{ width: 150 }} value={dom} onInput={(e) => handleInputThree(e, 'Q4')} />
        )
      }
    },
  ]

  const handleInputOne = (e, type) => {
    setBaseDataOne(pre => {
      let format
      if (type === 'Q1') {
        format = [
          {
            ...pre[0],
            Q1: e
          }
        ]
      }
      if (type === 'Q2') {
        format = [
          {
            ...pre[0],
            Q2: e
          }
        ]
      }
      if (type === 'Q3') {
        format = [
          {
            ...pre[0],
            Q3: e
          }
        ]
      }
      if (type === 'Q4') {
        format = [
          {
            ...pre[0],
            Q4: e
          }
        ]
      }
      return format
    })
  }

  const handleInputTwo = (e, type) => {
    setBaseDataTwo(pre => {
      let format
      if (type === 'Q1') {
        format = [
          {
            ...pre[0],
            Q1: e
          }
        ]
      }
      if (type === 'Q2') {
        format = [
          {
            ...pre[0],
            Q2: e
          }
        ]
      }
      if (type === 'Q3') {
        format = [
          {
            ...pre[0],
            Q3: e
          }
        ]
      }
      if (type === 'Q4') {
        format = [
          {
            ...pre[0],
            Q4: e
          }
        ]
      }
      return format
    })
  }

  const handleInputThree = (e, type) => {
    setBaseDataThree(pre => {
      let format
      if (type === 'Q1') {
        format = [
          {
            ...pre[0],
            Q1: e
          }
        ]
      }
      if (type === 'Q2') {
        format = [
          {
            ...pre[0],
            Q2: e
          }
        ]
      }
      if (type === 'Q3') {
        format = [
          {
            ...pre[0],
            Q3: e
          }
        ]
      }
      if (type === 'Q4') {
        format = [
          {
            ...pre[0],
            Q4: e
          }
        ]
      }
      return format
    })
  }

  const handleFinish = () => {
    const oneYear = {
      year: year[0],
      q1: baseDataOne[0].Q1,
      q2: baseDataOne[0].Q2,
      q3: baseDataOne[0].Q3,
      q4: baseDataOne[0].Q4,
    }
    const twoYear = {
      year: year[1],
      q1: baseDataTwo[0].Q1,
      q2: baseDataTwo[0].Q2,
      q3: baseDataTwo[0].Q3,
      q4: baseDataTwo[0].Q4,
    }
    const threeYear = {
      year: year[2],
      q1: baseDataThree[0].Q1,
      q2: baseDataThree[0].Q2,
      q3: baseDataThree[0].Q3,
      q4: baseDataThree[0].Q4,
    }
    const params = {
      worker_id: currentMsg.worker_id,
      score_info: [
        oneYear,
        twoYear,
        threeYear
      ]
    }
    createOrUpdateScore(params).then(res => {
      if (res.success) {
        handleCloseBaseIndex()
        actionRef.current.reload()
        success('操作成功')
        return
      }
      error(res.message)
    })
  }

  useEffect(() => {
    showScore(currentMsg.worker_id).then(res => {
      if (res.success) {
        const format = res.data.map(item => {
          return [item.q1, item.q2, item.q3, item.q4]
        })
        setYear(res.data.map(item => item.year))
        setBaseDataOne(pre => {
          return [
            {
              Q1: format[0][0],
              Q2: format[0][1],
              Q3: format[0][2],
              Q4: format[0][3],
            }
          ]
        })
        setBaseDataTwo(pre => {
          return [
            {
              Q1: format[1][0],
              Q2: format[1][1],
              Q3: format[1][2],
              Q4: format[1][3],
            }
          ]
        })
        setBaseDataThree(pre => {
          return [
            {
              Q1: format[2][0],
              Q2: format[2][1],
              Q3: format[2][2],
              Q4: format[2][3],
            }
          ]
        })
      }
    })
  }, [])

  return (
    <>
      <Divider orientation="center">{year[0]}</Divider>
      <Table
        dataSource={baseDataOne}
        columns={columnsOne}
        pagination={false}
        style={{ marginBottom: 50 }}
      />

      <Divider orientation="center">{year[1]}</Divider>
      <Table
        dataSource={baseDataTwo}
        columns={columnsTwo}
        pagination={false}
        style={{ marginBottom: 50 }}
      />

      <Divider orientation="center">{year[2]}</Divider>
      <Table
        dataSource={baseDataThree}
        columns={columnsThree}
        pagination={false}
        style={{ marginBottom: 50 }}
      />

      <Button type="primary" onClick={handleFinish}>提交</Button>
    </>
  )
}

export default BaseIndex