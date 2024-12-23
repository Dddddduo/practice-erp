import React, {forwardRef, useImperativeHandle, useState} from 'react';
import { Upload, Button, Input } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import UploadFiles from "@/components/UploadFiles";

const ADetails = forwardRef((props, ref) => {
  const [aDetails, setADetails] = useState([{ picture_ids: '', remark: '' }]);

  useImperativeHandle(ref, () => ({
    getADetails: () => aDetails,
    updateDetails: (newDetails) => setADetails(newDetails),
  }))

  const addColumn = (index) => {
    const newDetails = [...aDetails];
    newDetails.splice(index + 1, 0, { picture_ids: '', remark: '' });
    setADetails(newDetails);
  };

  const deleteColumn = (index) => {
    const newDetails = [...aDetails].filter((_, i) => i !== index);
    setADetails(newDetails);
  };

  const changePictures = (e, index) => {
    setADetails(aDetails.map((detail, key) =>
      key === index ? { ...detail, picture_ids: e } : detail
    ));
  }

  return (
    <div style={{ overflow: 'auto' }}>
      {aDetails.map((row, index) => (
        <div key={index} className="detail-items">
          <div className="detail-items-top">
            <div className="detail-list receipts">
              <UploadFiles value={row.picture_ids} onChange={e => changePictures(e, index)} fileLength={10} allowedTypes={['*']} showDownloadIcon={false} />
            </div>
            <div style={{ textAlign: 'right' }}>
              <Button icon={<PlusOutlined />} onClick={() => addColumn(index)} style={{ marginLeft: 20, marginTop: 20 }} />
              {index > 0 && (
                <Button icon={<DeleteOutlined />} onClick={() => deleteColumn(index)} style={{ marginLeft: 20, marginTop: 20, color: 'red' }} />
              )}
            </div>
          </div>
          <div className="detail-items-remark">
            <Input
              value={row.remark}
              onChange={(e) => {
                const newDetails = [...aDetails];
                newDetails[index].remark = e.target.value;
                setADetails(newDetails);
              }}
              style={{ width: 200 }}
            />
          </div>
        </div>
      ))}
    </div>
  )
})

export default ADetails
