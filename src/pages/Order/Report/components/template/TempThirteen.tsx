import UploadFiles from "@/components/UploadFiles"
import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons"
import { Card, Form, Input, Space } from "antd"
import React, { useEffect } from "react"

interface Props {
  tempData: any
  handleChangeTempData: (data, index, type, temp) => void
}

const TempThirteen: React.FC<Props> = ({
  tempData,
  handleChangeTempData
}) => {

  return (
    <Form.Item name="list">
      {
        tempData.map((item, index) => (
          <Card
            key={index + 1}
            title={`${index + 1}、${item.description}`}
            style={{ marginBottom: 20 }}
          // extra={
          //   <Radio.Group value={item.type} onChange={(e) => handleChangeTempData(e, index, 'radio')}>
          //     <Radio value={'list'}>列表</Radio>
          //     <Radio value={'before-after'}>前后</Radio>
          //   </Radio.Group>
          // }
          >
            <Form.Item noStyle>
              <UploadFiles value={item.imageIds} onChange={(e) => handleChangeTempData(e, index, 'upload', 13)} />
            </Form.Item>

            <Space style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Form.Item noStyle>
                <Input.TextArea value={item.remark} style={{ width: 400 }} placeholder="请输入内容" onChange={(e) => handleChangeTempData(e.target.value, index, 'input', 13)} />
              </Form.Item>
              <Space>
                <PlusCircleOutlined onClick={() => handleChangeTempData(tempData, index, 'add', 13)} style={{ fontSize: 22 }} />
                <MinusCircleOutlined onClick={() => handleChangeTempData(tempData, index, 'remove', 13)} style={{ fontSize: 22 }} />
              </Space>
            </Space>
          </Card>
        ))
      }
    </Form.Item >
    // <Form.List name="list">
    //   {(fields, { add, remove }) => (
    //     <>
    //       {fields.map((item, index) => {
    //         console.log(fields);

    //         return (
    //           <Card
    //             key={index + 1}
    //             title={`${index + 1}、${item.title}`}
    //             style={{ marginBottom: 20 }}
    //             extra={
    //               <Radio.Group value={0}>
    //                 <Radio value={0} >列表</Radio>
    //                 <Radio value={1}>前后</Radio>
    //               </Radio.Group>
    //             }
    //           >
    //             <Form.Item
    //               // {...restField}
    //               name={[index, 'img']}
    //               noStyle
    //             >
    //               <UploadFiles />
    //             </Form.Item>
    //             <div style={{ display: 'flex', justifyContent: 'space-between' }}>
    //               <Form.Item
    //                 // {...restField}
    //                 name={[index, 'remark']}
    //                 noStyle
    //               >
    //                 <Input.TextArea style={{ width: 300 }} />
    //               </Form.Item>
    //               <div style={{ width: 50, display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }}>
    //                 <PlusCircleOutlined onClick={() => add()} style={{ fontSize: 20 }} />
    //                 {
    //                   // name !== 0 &&
    //                   <MinusCircleOutlined onClick={() => remove(index)} style={{ fontSize: 20 }} />
    //                 }
    //               </div>
    //             </div>
    //           </Card>
    //         )
    //       })}
    //     </>
    //   )
    //   }
    // </Form.List >
  )
}

export default TempThirteen