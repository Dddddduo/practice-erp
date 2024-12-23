import React, {useEffect, useState} from "react";
import UploadFiles from "@/components/UploadFiles";
import {Button, message} from "antd";
import {updateSignId} from "@/services/ant-design-pro/report";

interface Props {
  report_id: any,
  report_tid: any,
  sign_value: any,
}

const SignSync:React.FC<Props> = ({
                                    report_id,
                                    report_tid,
                                    sign_value,
                                  }) => {

  const [signList, setSignList] = useState('')

  const syncSigns = async () => {
    let isFork = 0

    if (report_tid === 17) {
      isFork = 1;
    }

    if (report_tid === 19) {
      isFork = 19;
    }

    updateSignId({report_id: report_id, is_fork: isFork, sign_ids: signList}).then(res => {
      if (res.success) {
        message.success('签单同步成功')
      }
    })
  }

  useEffect(() => {
    setSignList(sign_value)
  }, []);

  return (
    <div>
      <UploadFiles value={signList} onChange={(e) => {setSignList(e)}}/>

      <div style={{ display: 'flex', justifyContent: 'end' }}>
        <Button type={'primary'} onClick={syncSigns}>提交</Button>
      </div>
    </div>
  )
}

export default SignSync
