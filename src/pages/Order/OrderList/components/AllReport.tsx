import React, { useEffect, useState } from 'react'
import { Typography, Card, List } from "antd";
import GkUpload from '@/components/UploadImage/GkUpload';

interface ItemListProps {
  completedReports: any
}
const AllReport: React.FC<ItemListProps> = ({
  completedReports,
}) => {

  useEffect(() => {
    console.log(completedReports);
    const format = completedReports.map(item => {
      item.body.map(body => {
        if (typeof body.v == "string") {
          return
        }
        body.v.map(v => {
          v.url = v.file_url_thumb
          return v
        })
        return body
      })
      return item
    })
    console.log(format);

  }, [])
  return (
    <>
      <Typography.Title level={3}>报告详情</Typography.Title>
      {
        completedReports.map(item => {
          return (
            <Card
              key={item.title.action_node_id}
              bordered={false}
              title={item.title.action_node_person}
              headStyle={{ color: item.title.action_node_color }}
              extra={item.title.action_node_value + item.title.action_node_at}
            >
              <Card>
                <List
                  dataSource={item.body}
                  renderItem={(body: any) => <List.Item>{body.k}：{
                    typeof body.v === 'string' ? body.v :
                      <GkUpload value={body.v} fileLength={1} />
                  }</List.Item>}
                />
              </Card>
            </Card>
          )
        })
      }
    </>
  )
}

export default AllReport