import React, { useEffect } from "react"
import { useLocation } from "umi";

const ReportPDF: React.FC = () => {
  const location = useLocation();
  // 根据参数名称获取具体的路由参数
  const queryParams = new URLSearchParams(location.search);
  const source = queryParams.get('source');
  useEffect(() => {
    console.log(source);
  }, [])

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
    }}>
      <iframe
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
        }}
        src={`https://erp.zhian-design.com/pdf/report?report_id=${source}`}
      />
    </div>
  )
}

export default ReportPDF