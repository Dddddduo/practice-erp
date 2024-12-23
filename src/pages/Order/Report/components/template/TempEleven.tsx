import UploadFiles from "@/components/UploadFiles"
import { Card, Form, Input } from "antd"
import React, { useEffect } from "react"

interface Props {
  tempData: any
  handleChangeTempData: (data, index, type, temp) => void
}

const TempEleven: React.FC<Props> = ({
  tempData,
  handleChangeTempData
}) => {

  return (
    <Form.List name="list">
      {(fields, { add, remove }) => (
        <>
          {tempData.map((item, index, { key, name, ...restField }) => (
            <Card
              key={index + 1}
              title={`${index + 1}、${item.description}`}
              style={{ marginBottom: 20 }}
            >
              <Form.Item
                {...restField}
                name={[index, 'imageIds']}
                noStyle
              >
                <UploadFiles onChange={(e) => handleChangeTempData(e, index, 'upload', 11)} />
              </Form.Item>
              <Form.Item
                {...restField}
                name={[index, 'remark']}
                noStyle
              >
                <Input.TextArea placeholder="请输入内容" onChange={(e) => handleChangeTempData(e.target.value, index, 'input', 11)} />
              </Form.Item>
            </Card>
          ))}
        </>
      )}
    </Form.List >
  )
}

export default TempEleven