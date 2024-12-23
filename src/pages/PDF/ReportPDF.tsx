import React, {useEffect, useRef, useState} from "react";
import {useLocation} from "umi";
import {isEmpty} from "lodash";
import {Button, message} from "antd";
import {getFileOssUrl} from "@/services/ant-design-pro/pdf";
import {downloadFile} from "@/utils/utils";
import {createPdf, createPdfFilePlus} from "@/services/ant-design-pro/api";
import PollingButton from "@/components/Buttons/PollingButton";

const ReportPDF: React.FC = () => {

  const [pdfUrl, setPdfUrl] = useState('')
  const [autoHeight, setAutoHeight] = useState('1200px')

  const iframeRef = useRef(null);
  const timerId = useRef<NodeJS.Timer>();

  const [loading, setLoading] = useState(false)
  const [stopTimer, setStopTimer] = useState<boolean>(false)

  const timerCount = useRef(0)

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  let reportId = '';
  let reportTid = '';
  let reportTitle = '';

  if (!isEmpty(queryParams.get('report_id'))) {
    console.log(queryParams.get('report_id'))
    reportId = queryParams.get('report_id')
  }

  if (!isEmpty(queryParams.get('report_tid'))) {
    console.log(queryParams.get('report_tid'))
    reportTid = queryParams.get('report_tid')
  }

  if (!isEmpty(queryParams.get('report_title'))) {
    console.log(queryParams.get('report_title'))
    reportTitle = queryParams.get('report_title')
  }

  const newReportTempId: string[] = ['14', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28']

  useEffect(() => {
    console.log('打印id', queryParams)

    if (reportId !== '' && reportTid !== '') {
      if (process.env.NODE_ENV === 'development') {
        console.log('This is a development environment.');

        if (newReportTempId.includes(reportTid)) {
          setPdfUrl(`http://erp-api.huyudev.com/pdf/new_report?report_id=${reportId}`)
        } else {
          setPdfUrl(`http://erp-api.huyudev.com/pdf/report?report_id=${reportId}`)
        }


      } else if (process.env.NODE_ENV === 'production') {
        console.log('This is a production environment.');

        if (newReportTempId.includes(reportTid)) {
          setPdfUrl(`https://erp-pre.zhian-design.com/pdf/new_report?report_id=${reportId}`)
        } else {
          setPdfUrl(`https://erp-pre.zhian-design.com/pdf/report?report_id=${reportId}`)
        }
      }
    }


    return () => {
      if (timerId) clearInterval(timerId?.current)
    }
  }, []);

  const handleLoad = () => {
    const contentHeight = iframeRef?.contentWindow?.document?.body?.scrollHeight;
    iframeRef.height = contentHeight;
    setAutoHeight(contentHeight + "px")
  }

  const downloadHandle = async (token: string) => {
    if ('' === token) {
      return
    }

    let result = await getFileOssUrl({download_token: token})
    console.log("downloadHandle:", result)
    if (result?.success && !isEmpty(result?.data)) {
      setStopTimer(true);
      await downloadFile(
        result?.data.replace("http:", "https:"),
        reportTitle + ".pdf"
      );
    }

    return
  }

  /**
   * 获取token
   */
  const getTokenHandle = async () => {
    let type_setting = "";

    if (reportTid === '11') {
      type_setting = "column";
    }

    if (newReportTempId.includes(reportTid)) {
      const requestData = {
        single_pdf: [
          {
            pdf_info: {report_id: reportId},
            pdf_type: `maintenance_report_${reportTid}`,
          },
        ],
      };

      const result = await createPdfFilePlus(requestData);
      if (result.success) {
        return result.data;
      }
    } else {
      const params = {
        pdf_type: "worker_report",
        type_setting: type_setting,
        pdf_info: {report_id: reportId},
      }

      const result = await createPdf(params);
      if (result.success) {
        return result.data;
      }
    }

    return '';
  }

  return (
    <>
      <div style={{width: '100%', textAlign: 'center'}}>
        <PollingButton
          requestHandle={(token) => downloadHandle(token)}
          beforeRequest={getTokenHandle}
          type="primary"
          style={{margin: 10}}
          stopPolling={stopTimer}
          maxPollingTime={600}
          changeOutStatus={() => {
            setStopTimer(false)
          }}
        />
        {/*<Button type='primary' style={{margin: 10}} onClick={downloadPDF} disabled={loading}>*/}
        {/*   {loading ? '下载中...' : '下载'}*/}
        {/*</Button>*/}
      </div>
      <iframe
        ref={iframeRef}
        onLoad={handleLoad}
        src={pdfUrl}
        style={{width: '1900px', height: autoHeight}}
        allowFullScreen={true}
      />
    </>
  )
}

export default ReportPDF
