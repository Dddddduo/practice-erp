import React, { useEffect, useState, useRef } from "react";
import { Button, message } from "antd"; // Corrected import
import dayjs from 'dayjs';
import { createPdf, getFileOssurl } from "@/services/ant-design-pro/pdf";
import { downloadFile } from "@/utils/utils";

const QuotationPdf: React.FC = () => {
  const [showFooter] = useState(true);
  const [iframeSrc, setIframeSrc] = useState('');
  const [downloadingStatus, setDownloadingStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null); // Changed to useRef

  // Removed messageApi as it's not correctly implemented
  // If you want to display messages, use message.info(), message.success(), etc.

  const savePDF = async () => {
    if (downloadingStatus) {
      console.error('存在下载任务，待下载任务完成');
      return false;
    }
    setDownloadingStatus(true);
    setLoading(true);
    const res = await createPdf({ pdf_type: 'quotation', pdf_info: { quotation_id: window.location.search } });
    const download_token = res.data.data;

    timerRef.current = setInterval(async () => {
      const ossResult = await getFileOssurl({ download_token });
      if (ossResult.data.data) {
        clearInterval(timerRef.current);
        const filename = `${dayjs().format('YYYYMMDDHHmmss')}`;
        downloadFile(ossResult.data.data.replace('http:', 'https:'), filename + '.pdf');
        setLoading(false);
        setDownloadingStatus(false); // Ensure to reset downloading status
      }
    }, 1000);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (window.location.search.includes('id')) {
        const quoId = new URLSearchParams(window.location.search).get('quo_id');
        setIframeSrc(`http://erp-api.huyudev.com/pdf/quotation?quotation_id=${quoId}`);
      }
    };

    fetchData();

    // Cleanup interval on component unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <>
      <div className="container">
        {showFooter && (
          <div className="quotation_button" style={{position: 'fixed', top: '2vh', left: '65vw', zIndex: 1000}}>
            <Button type="primary" onClick={savePDF}>
              下载
            </Button>
          </div>
        )}
        <iframe
          id="iframe"
          src={iframeSrc}
          style={{ width: '100%', height: '100vh' }} // Adjusted for better responsiveness
          allowFullScreen={true}
        />
      </div>
    </>
  );
}

export default QuotationPdf
