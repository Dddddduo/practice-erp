import ItemList from "./ItemList"
import React, { useEffect } from 'react';
import { Card, Col, Row, Button, Drawer, List, Tag } from 'antd';
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import Stage from "./Stage";
import { getProcess } from "@/services/ant-design-pro/project";

interface ItemListProps {
  Close,
  actionRef
  currentMsg
  success: (text: string) => void,
  error: (text: string) => void
}


const Process: React.FC<ItemListProps> = ({
  Close,
  actionRef,
  currentMsg,
  success,
  error
}) => {

  // 新增或者编辑抽屉
  const [showDetailDrawer, setShowDetailDrawer] = useState(false)
  const [currentItem, setCurrentItem] = useState()
  const [colListOne, setColListOne] = useState([])
  const [colListTwo, setColListTwo] = useState([])
  const [colListThree, setColListThree] = useState([])
  const [colListFour, setColListFour] = useState([])
  const [colCard, setColCard] = useState<{
    id: number,
    title: string,
    data: []
  }[]>([
    {
      id: 1,
      title: '投标阶段',
      data: []
    },
    {
      id: 2,
      title: '启动阶段',
      data: []
    },
    {
      id: 3,
      title: '施工阶段',
      data: []
    },
    {
      id: 4,
      title: '竣工阶段',
      data: []
    }
  ])

  const handleClose = () => {
    setCurrentItem(undefined)
    setShowDetailDrawer(false)
  }

  const getList = () => {
    colCard.map(item => {
      getProcess({ process: item.id, project_process_id: currentMsg.id }).then(res => {
        if (res.success) {
          item.data = res.data
          if (item.id === 1) {
            setColListOne(res.data)
          } else if (item.id === 2) {
            setColListTwo(res.data)
          } else if (item.id === 3) {
            setColListThree(res.data)
          } else if (item.id === 4) {
            setColListFour(res.data)
          }
        }
      })
    })
  }

  const handleDetail = (value) => {
    setCurrentItem(value)
    setShowDetailDrawer(true)
  }

  useEffect(() => {
    getList()
  }, [])
  return (
    <>
      <Row gutter={16}>
        {
          colCard.map(item => {
            return (
              <Col span={6} key={item.id}>
                <Card title={item.title} bordered={true} hoverable style={{ backgroundColor: '#eee' }}>
                  {
                    item.data.map((value: any) => {
                      return (
                        <Card key={value.id} style={{ marginBottom: 10, display: 'flex', flexDirection: 'column' }} onClick={() => handleDetail(value)}>
                          {
                            value.status !== '' &&
                            <Tag color="gray">
                              {
                                value.status === 'not_checkend' &&
                                <span>待审批</span>
                              }
                            </Tag>
                          }

                          <div style={{ fontSize: 20 }}>{value.process_type}</div>
                        </Card>
                      )
                    })
                  }
                  {
                    item.data.length < 1 &&
                    <PlusOutlined onClick={() => {
                      setShowDetailDrawer(true);
                    }} />
                  }
                  
                </Card>
              </Col>
            )
          })
        }
        {/* <Col span={6}>
                    <Card title="启动阶段" bordered={true} hoverable>
                        <PlusOutlined onClick={() => {
                            setShowDetailDrawer(true);
                        }} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card title="施工阶段" bordered={true} hoverable>
                        <PlusOutlined onClick={() => {
                            setShowDetailDrawer(true);
                        }} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card title="竣工阶段" bordered={true} hoverable>
                        <PlusOutlined onClick={() => {
                            setShowDetailDrawer(true);
                        }} />
                    </Card>
                </Col> */}
      </Row>
      <Drawer
        width={600}
        title="工作计划"
        open={showDetailDrawer}
        onClose={handleClose}
        destroyOnClose={true}
      >
        <Stage
          handleClose={handleClose}
          actionRef={actionRef}
          currentMsg={currentMsg}
          currentItem={currentItem}
          getList={getList}
          success={success}
          error={error}
        />
      </Drawer>
    </>

  )
}

export default Process