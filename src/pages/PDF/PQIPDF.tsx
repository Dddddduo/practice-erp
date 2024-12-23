import React, {useEffect, useState, useRef} from "react"
import dayjs from 'dayjs'
import {createPdfFile, getFileOssUrl, getProjectInfoMessage} from "@/services/ant-design-pro/pdf";
import {downloadFile} from "@/utils/utils";
import PollingButton from "@/components/Buttons/PollingButton";
import {isEmpty} from "lodash";
import {useLocation} from "@@/exports";

const PQIPDF: React.FC = () => {
  const [stopTimer, setStopTimer] = useState<boolean>(false)
  const [showFooter, setShowFooter] = useState(true);
  const [iframeSrc, setIframeSrc] = useState('');

  const [projectName, setProjectName] = useState('')

  const iframeRef = useRef(null);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);


  const getTokenHandle = async () => {
    let id: number = 0

    if (queryParams.get('id')) {
      id = parseInt(queryParams.get('id') ?? '0')
    }

    const res = await createPdfFile({pdf_type: 'pqi_pdf', pdf_info: {project_id: id}});

    if (res.success) {
      return res.data;
    }

    return '';
  }

  const downloadHandle = async (token: string) => {
    if ('' === token) {
      return
    }

    const result = await getFileOssUrl({download_token: token})
    if (result?.success && !isEmpty(result?.data)) {
      setStopTimer(true);
      const filename = `${dayjs().format('YYYYMMDDHHmmss')}`;
      await downloadFile(
        result?.data.replace("http:", "https:"),
        projectName + filename + ".pdf"
      );
    }

    return
  }

  useEffect(() => {
    const fetchData = async () => {
      if (window.location.search.includes('id')) {
        const projectId = new URLSearchParams(window.location.search).get('id');
        setIframeSrc(`https://erp-pre.zhian-design.com/pdf/project?project_id=${projectId}`);
        const res = await getProjectInfoMessage({project_id: projectId});

        if (res.success) {
          console.log('res.data', res.data)
          setProjectName(res?.data?.project_name ?? '')
          // 使用强制更新来更新组件，类似于Vue中的$forceUpdate()
        }
      }
    };
    fetchData();
  }, []);

  return (
    <div className="container">
      {showFooter && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
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
        </div>
      )}
      <div>
        <iframe
          id="iframe"
          ref={iframeRef}
          src={iframeSrc}
          style={{width: '1920px', height: '1200px'}}
          allowFullScreen={true}
        />
      </div>
    </div>
  );
}
export default PQIPDF
