import React, { useEffect, useState } from 'react'
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { Form, Button, Select } from 'antd'
import type { SelectProps } from 'antd';
import { getWorkerList, getReimCountCharsMulti } from '@/services/ant-design-pro/report';
import MoreToOne from './components/MoreToOne';
import MoreToMore from './components/MoreToMore';

const WorkerStats: React.FC = () => {

  const [workerList, setWorkerList]: any = useState([])
  const year = [
    {
      value: 2019,
      label: 2019,
    },
    {
      value: 2020,
      label: 2020,
    },
    {
      value: 2021,
      label: 2021,
    },
    {
      value: 2022,
      label: 2022,
    },
    {
      value: 2023,
      label: 2023,
    },
    {
      value: 2024,
      label: 2024,
    },
    {
      value: 2025,
      label: 2025,
    },
    {
      value: 2026,
      label: 2026,
    },
    {
      value: 2027,
      label: 2027,
    },
    {
      value: 2028,
      label: 2028,
    },
    {
      value: 2029,
      label: 2029,
    },
    {
      value: 2030,
      label: 2030,
    },
  ]
  const onceInitialValues = {
    year: new Date().getFullYear()
  }
  const moreInitialValues = {
    year: [new Date().getFullYear()]
  }
  const [reimLineMoreToOne, setReimLineMoreToOne]: any = useState({})
  const [reimBarMoreToOne, setReimBarMoreToOne]: any = useState({})
  const [reimLineMoreToMore, setReimLineMoreToMore]: any = useState({})
  const [reimBarMoreToMore, setReimBarMoreToMore]: any = useState({})
  const onFinishSearch = (values) => {
    if (typeof values.year === 'number') {
      const lineParams = {
        count_chars_type: 'reim_count',
        worker_uid_list: values.worker,
        completed_at_year_list: values.year,
        count_time_dimension: 'season'
      }
      getReimCountCharsMulti(lineParams).then(res => {
        setReimLineMoreToOne(res.data)
      })
      const barParams = {
        count_chars_type: 'reim_price',
        worker_uid_list: values.worker,
        completed_at_year_list: values.year,
        count_time_dimension: 'season'
      }
      getReimCountCharsMulti(barParams).then(res => {
        setReimBarMoreToOne(res.data)
      })
      return
    }
    // count_chars_type=reim_price&worker_uid_list=1,60&completed_at_year_list=2022,2023&count_time_dimension=year
    const lineParams = {
      count_chars_type: 'reim_count',
      worker_uid_list: values.worker,
      completed_at_year_list: values.year,
      count_time_dimension: 'year'
    }
    getReimCountCharsMulti(lineParams).then(res => {
      setReimLineMoreToMore(res.data)
    })
    const barParams = {
      count_chars_type: 'reim_price',
      worker_uid_list: values.worker,
      completed_at_year_list: values.year,
      count_time_dimension: 'year'
    }
    getReimCountCharsMulti(barParams).then(res => {
      setReimBarMoreToMore(res.data)
    })
  }

  const optionsWorker: SelectProps['options'] = workerList.map((item) => {
    return {
      value: item.worker_id,
      label: item.worker,
    };
  });

  const filterOption = (input: string, option?: { label: string; value: string }) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());


  useEffect(() => {
    getWorkerList({ type: '1' }).then(res => {
      console.log(res);
      setWorkerList(res.data)
    })
  }, [])

  return (
    <PageContainer>
      <ProCard
        bordered
        boxShadow
        style={{ marginBottom: 20 }}
      >
        <Form
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          layout='inline'
          onFinish={onFinishSearch}
          initialValues={onceInitialValues}
          style={{ marginBottom: 30 }}
        >
          <Form.Item label="施工负责人" name="worker">
            <Select
              showSearch
              filterOption={filterOption}
              style={{ width: 200 }}
              options={optionsWorker}
              placeholder="请选择工人"
              mode="multiple"
              allowClear
            />
          </Form.Item>
          <Form.Item label="年份" name="year">
            <Select style={{ width: 200 }} options={year}></Select>
          </Form.Item>
          <Form.Item name="oneYear">
            <Button style={{ marginLeft: 100 }} type='primary' htmlType="submit">查询</Button>
          </Form.Item>
        </Form>
        <MoreToOne
          reimLineMoreToOne={reimLineMoreToOne}
          reimBarMoreToOne={reimBarMoreToOne}
        />
      </ProCard>

      <ProCard
        bordered
        boxShadow
      >
        <Form
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          layout='inline'
          onFinish={onFinishSearch}
          initialValues={moreInitialValues}
          style={{ marginBottom: 30 }}
        >
          <Form.Item label="施工负责人" name="worker">
            <Select
              showSearch
              filterOption={filterOption}
              style={{ width: 200 }}
              options={optionsWorker}
              placeholder="请选择工人"
              mode="multiple"
              allowClear
            />
          </Form.Item>
          <Form.Item label="年份" name="year">
            <Select style={{ width: 200 }} options={year} mode="multiple" allowClear></Select>
          </Form.Item>
          <Form.Item >
            <Button style={{ marginLeft: 100 }} type='primary' htmlType="submit">查询</Button>
          </Form.Item>
        </Form>
        <MoreToMore
          reimLineMoreToMore={reimLineMoreToMore}
          reimBarMoreToMore={reimBarMoreToMore}
        />
      </ProCard>
    </PageContainer>
  )
}

export default WorkerStats