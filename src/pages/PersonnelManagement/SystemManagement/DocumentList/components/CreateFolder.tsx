import React, { RefObject, useEffect, useState } from "react"
import { Button, Radio, Form, Input, Space } from "antd"
import GkUpload from "@/components/UploadImage/GkUpload"
import { createOfficeDocument, filesInFolder, officeDocumentDetail, updateOfficeDocument } from "@/services/ant-design-pro/system"
import { isEmpty } from "lodash"

interface ItemListProps {
  handleCloseCreateFolder: () => void
  success: (text: string) => void
  error: (text: string) => void
  currentItem: {
    pid: number
    id: number
    name: string
  }
  openFileZip: any
  currentFolder: any
  file: string,
}

const CreateFolder: React.FC<ItemListProps> = ({
  currentItem,
  handleCloseCreateFolder,
  success,
  error,
  openFileZip,
  currentFolder,
  file
}) => {
  const [form] = Form.useForm()

  const handleFinish = (values: {
    name: string
    pid: number
    file_ids: {
      id: number
    }[]
  }) => {
    console.log(currentFolder, file);

    let params = {
      name: values.name ?? '',
      parent_id: currentItem.id ?? '',
    }
    if (isEmpty(currentFolder)) {
      if (file !== 'file') {
        // 创建文件夹
        createOfficeDocument(params).then(res => {
          if (res.success) {
            handleCloseCreateFolder()
            openFileZip(currentItem, 'open')
            success('操作成功')
            return
          }
          error(res.message)
        })
        return
      }
      // 创建文件
      filesInFolder({ file_ids: values.file_ids.map(item => item.id) }, currentItem.id).then(res => {
        if (res.success) {
          handleCloseCreateFolder()
          openFileZip(currentItem, 'open')
          success('操作成功')
          return
        }
        error(res.message)
      })

      // let fileIds: any = []
      // officeDocumentDetail(currentItem.id).then(res => {
      //   if (res.success) {
      //     fileIds = [
      //       ...res.data.annexes.map(item => item.id),
      //       ...values.file_ids ? values.file_ids.map(item => item.id) : []
      //     ]
      //     params = {
      //       name: currentItem.name ?? '',
      //     }
      //     updateOfficeDocument(params, currentItem.id).then(res => {
      //       if (res.success) {
      //         handleCloseCreateFolder()
      //         openFileZip(currentItem, 'open')
      //         success('操作成功')
      //         return
      //       }
      //       error(res.message)
      //     })
      //     return
      //   }
      //   error(res.message)
      //   return
      // })
      return
    }

    // 修改文件夹名
    updateOfficeDocument({ name: values.name }, currentFolder.id).then(res => {
      if (res.success) {
        handleCloseCreateFolder()
        openFileZip(currentItem, 'update')
        success('操作成功')
        return
      }
      error(res.message)
    })

    // officeDocumentDetail(currentItem.id).then(res => {
    //   if (res.success) {
    //     params = {
    //       name: values.name ?? '',
    //       pid: currentItem.pid ?? '',
    //       file_ids: !isEmpty(res.data.annexes) ? res.data.annexes.map(item => item.id) : []
    //     }
    //     console.log(params);
    //     updateOfficeDocument(params, currentFolder.id).then(res => {
    //       if (res.success) {
    //         handleCloseCreateFolder()
    //         openFileZip(currentItem, 'update')
    //         success('操作成功')
    //         return
    //       }
    //       error(res.message)
    //     })
    //   }
    // })
    // params = {
    //   name: values.name ?? '',
    //   pid: currentItem.pid ?? '',
    //   file_ids: values.file_ids ? values.file_ids.map(item => item.id) : []
    // }
  }

  useEffect(() => {
    console.log(currentFolder, currentItem, file);

    if (isEmpty(currentFolder)) {
      return
    }

    form.setFieldsValue({
      name: currentFolder.name ?? '',
    })
    // officeDocumentDetail(currentFolder.id).then(res => {
    //   if (res.success) {
    //     form.setFieldsValue({
    //       name: res.data.name ?? '',
    //       file_ids: res.data.annexes ?? []
    //     })
    //   }
    // })

  }, [])

  return (
    <Form
      form={form}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600, marginTop: 30 }}
      onFinish={handleFinish}
    >

      {
        file !== 'file' &&
        <Form.Item label="名称" name="name">
          <Input />
        </Form.Item>
      }


      {
        file === 'file' &&
        <Form.Item label="文件" name="file_ids">
          <GkUpload type="picture-card" deletable={true} preview={true} />
        </Form.Item>
      }

      <Form.Item label=" " colon={false}>
        <Space>
          <Button type="primary" htmlType="submit">确定</Button>
          <Button danger onClick={handleCloseCreateFolder}>取消</Button>
        </Space>
      </Form.Item>
    </Form>
  )
}

export default CreateFolder