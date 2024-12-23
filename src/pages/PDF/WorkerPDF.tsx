import React, { useEffect, useState, useRef } from "react"
import { useLocation } from "umi";
import { getCountPdf, createPdfFile, getFileOssUrl, getConstructionPdfFileName } from "@/services/ant-design-pro/pdf";
import { downloadFile, parsePdfPath } from "@/utils/utils";
import { Button, Modal, Space, message } from "antd";
import './index.css'
import { isEmpty } from "lodash";
import SendEmail from "./components/SendEmail";
import CreatePdf from "./components/CreatePdf";

const WorkerPDF: React.FC = () => {
  const location = useLocation();
  // 根据参数名称获取具体的路由参数
  const queryParams = new URLSearchParams(location.search);
  const [src, setSrc] = useState('')
  const [height, setHeight] = useState(1200)
  const [loadingDownload, setLoadingDownload] = useState<boolean[]>([]);
  const [appoTaskId, setAppoTaskId]: any = useState()
  const [contactPersonType, setContactPersonType]: any = useState()
  const [companyId, setCompanyId]: any = useState()
  const timerId = useRef<NodeJS.Timer>();
  const [showSendEmail, setShowSendEmail] = useState(false)
  const [params, setParams] = useState({})
  const [showCreatePdf, setShowCreatePdf] = useState(false)
  // 配置Message
  const [messageApi, contextHolder] = message.useMessage();
  // 成功Message
  const success = (text: string) => {
    messageApi.open({
      type: 'success',
      content: text,
    });
  };

  // 失败Message
  const error = (text: string) => {
    messageApi.open({
      type: 'error',
      content: text,
    });
  };
  const downloadPDF = (index) => {
    success('提交下载成功，请耐心等待')
    setLoadingDownload((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });
    createPdfFile(
      {
        'pdf_type': 'worker_construction_report',
        pdf_info: {
          appo_task_id: appoTaskId,
          contact_person_type: contactPersonType,
          company_id: companyId
        }
      }
    ).then(res => {
      timerId.current = setInterval(async () => {
        getFileOssUrl({ download_token: res.data }).then(ossResult => {
          if (ossResult.success && ossResult.data) {
            const fileUrl = ossResult.data.replace('https://zhian-erp-files.oss-cn-shanghai.aliyuncs.com/', '')
            getConstructionPdfFileName({ appo_task_id: appoTaskId }).then(res => {
              parsePdfPath(fileUrl, res.data)
            })
            setLoadingDownload((prevLoadings) => {
              const newLoadings = [...prevLoadings];
              newLoadings[index] = false;
              return newLoadings;
            });
            clearInterval(timerId.current)
          }
        })
      }, 1000)

    })
  }

  const handleCloseSendEmail = () => {
    setShowSendEmail(false)
  }

  const handleCloseCreatePdf = () => {
    setShowCreatePdf(false)
  }

  useEffect(() => {
    const appo_task_id = queryParams.get('appo_task_id')
    setAppoTaskId(appo_task_id)
    const contact_person_type = queryParams.get('contact_person_type')
    setContactPersonType(contact_person_type)
    const company_id = queryParams.get('company_id')
    setCompanyId(company_id)
    const brand_en = queryParams.get('brand_en')
    const store_cn = queryParams.get('store_cn')
    const type = queryParams.get('type')
    const leader_name = queryParams.get('leader_name')
    const leader_mobile = queryParams.get('leader_mobile')
    setParams(preState => {
      return {
        ...preState,
        brand_en,
        store_cn,
        type,
        leader_name,
        leader_mobile,
      }
    })
    setSrc(`https://erp-pre.zhian-design.com/pdf/worker?appo_task_id=${appo_task_id}&contact_person_type=${contact_person_type}&company_id=${company_id}`)
    getCountPdf({ appo_task_id, contact_person_type, company_id, get_page: 1 }).then(res => {
      if (res.success) {
        setHeight(1170 * Number(res.data))
      }
    })
    return () => {
      if (timerId) clearInterval(timerId.current)
    }
  }, [])

  return (
    <>
      <div className="container" style={{ width: 1900, pageBreakAfter: 'always' }}>
        {contextHolder}
        <Space className="print">
          <Button type="primary" loading={loadingDownload[1]} onClick={() => downloadPDF(1)}>下载</Button>
          <Button type="primary" onClick={() => {
            setShowSendEmail(true)
          }}>发送邮件</Button>
          <Button type="primary" onClick={() => {
            setShowCreatePdf(true)
          }}>复制</Button>
        </Space>
        <div>
          <iframe
            src={src}
            style={{ width: "100%", height: height }}
            allowFullScreen={true}
          />
        </div>
      </div>

      <Modal
        width={800}
        open={showSendEmail}
        onCancel={handleCloseSendEmail}
        destroyOnClose={true}
        footer={null}
        title="邮件发送"
      >
        <SendEmail
          handleCloseSendEmail={handleCloseSendEmail}
          success={success}
          error={error}
          appoTaskId={appoTaskId}
          contactPersonType={contactPersonType}
          companyId={companyId}
          params={params}
        />
      </Modal>

      <Modal
        width={800}
        open={showCreatePdf}
        onCancel={handleCloseCreatePdf}
        destroyOnClose={true}
        footer={null}
        title="复制"
      >
        <CreatePdf
          appoTaskId={appoTaskId}
          success={success}
          error={error}
          handleCloseCreatePdf={handleCloseCreatePdf}
        />
      </Modal>
    </>
  )
}

export default WorkerPDF