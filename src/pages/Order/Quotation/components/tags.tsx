import React, {useEffect, useState} from "react";
import {Button, Form, Select, Space} from "antd";
import {getTagById, getTags, mark} from "@/services/ant-design-pro/project";
import {produce} from "immer";
import {isEmpty, isObject} from "lodash";
interface  Props {
  entity: any,
  handleClose: () => void,
  success: (text: string) => void
}

const Tags: React.FC<Props> = ({
  entity,
                                 handleClose,
                                 success,
                               }) => {

  const [pageData, setPageData] = useState<any>({
    originTags: [],
    firstLevelTags: [],
    secondLevelTags: [],
    tagSubId: 0, // 回显二级标签
  })

  const [formRef] = Form.useForm();

  const getFirstLevelTags = (origins: any)  => {
    let list = [];

    const filter = origins.filter(tag => tag.pid === 0)

    list = filter.map(tag => {
      return {
        value: tag.id,
        label: tag.name,
      }
    })

    return list
  }


  const onFirstTagChange = (tagId: any) => {
    const filter = pageData.originTags.filter(tag => tag.pid === tagId)

    const list = filter.map(tag => {
      return {
        value: tag.id,
        label: tag.name,
      }
    })

    setPageData(pre => produce(pre, draft => {
      draft.secondLevelTags = list
    }))
  }

  const onFinish = (value: any) => {
    console.log(value, entity)
    const params = {
      quo_id: entity.id ?? 0,
      tag_id: value?.tag ?? 0,
      tag_sub_id: value?.tag_sub ?? '',
    }

    mark(params).then(value => {
      if (value.success) {
        success('提交成功')
        handleClose()
      }
    })
  }

  const getTagValue = () => {
    getTagById(entity.id).then((value) => {
      if (value?.success && isObject(value?.data)) {
        formRef.setFieldValue('tag',  value?.data?.tag_id)

        onFirstTagChange(value?.data.tag_id ?? 0)

        setPageData(pre => produce(pre, draft => {
          draft.tagSubId = value?.data?.tag_sub_id ?? 0
        }))
      }
    })
  }

  useEffect(() => {
    if (!isEmpty(pageData.secondLevelTags) && pageData.tagSubId > 0) formRef.setFieldValue('tag_sub', pageData.tagSubId)
  }, [pageData.secondLevelTags, pageData.tagSubId]);

  useEffect(() => {
    getTagValue()
  }, [pageData.firstLevelTags]);


  useEffect(() => {
    getTags().then((value) => {
      if (value?.success) {
        const list = getFirstLevelTags(value?.data)

        setPageData(pre => produce(pre, draft => {
          draft.originTags = value?.data
          draft.firstLevelTags = list
        }))
      }
    })
  }, [entity]);

  return (
    <div style={{ marginTop: 34 }}>
      <Form
        name="basic"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{}}
        onFinish={onFinish}
        autoComplete="off"
        form={formRef}
      >
          <Form.Item
            label="一级标签"
            name="tag"
            rules={ [ {required: true, message: '请选择一级标签!'} ] }
          >
            <Select
              allowClear
              showSearch
              onChange={(e) => {
                setPageData(pre => produce(pre, draft => {
                  draft.tagSubId = 0
                }))
                formRef.setFieldValue('tag_sub', undefined)
                onFirstTagChange(e)
              }}
              options={pageData.firstLevelTags}
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            >
            </Select>
          </Form.Item>

        <Form.Item
          label="二级标签"
          name="tag_sub"
        >
          <Select
            allowClear
            showSearch
            options={pageData.secondLevelTags}
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
          >
          </Select>
        </Form.Item>

        <Form.Item>
          <Space style={{ marginTop: 20 }}>
            <Button type="primary" htmlType="submit">提交</Button>
            <Button type="primary" onClick={handleClose}>取消</Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  )
}

export  default  Tags;
