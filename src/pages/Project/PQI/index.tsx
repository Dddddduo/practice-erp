import React, { useState } from 'react';
import { Upload, Modal, Checkbox } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

// 模拟的文件列表
const initialFiles = [
  {
    uid: '-1',
    name: 'image1.png',
    status: 'done',
    url: 'https://your-image-url.com/image1.png',
    thumbUrl: 'https://your-image-url.com/image1.png',
  },
  // 更多文件...
];

const ImageUploadSelect = () => {
  const [fileList, setFileList] = useState(initialFiles);
  const [selectedIds, setSelectedIds] = useState([]);

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  const handleSelect = (file) => {
    const selectedIndex = selectedIds.indexOf(file.uid);
    let newSelectedIds = [];
    if (selectedIndex === -1) {
      newSelectedIds = newSelectedIds.concat(selectedIds, file.uid);
    } else {
      newSelectedIds = newSelectedIds.concat(
        selectedIds.slice(0, selectedIndex),
        selectedIds.slice(selectedIndex + 1)
      );
    }
    setSelectedIds(newSelectedIds);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <>
      <Upload
        action="https://your-upload-api.com"
        listType="picture-card"
        fileList={fileList}
        onChange={handleChange}
        onPreview={false}
      >
        {fileList.length >= 8 ? null : uploadButton}
      </Upload>
      <div>
        {fileList.map((file) => (
          <Checkbox
            key={file.uid}
            checked={selectedIds.includes(file.uid)}
            onChange={() => handleSelect(file)}
          >
            Select
          </Checkbox>
        ))}
      </div>
    </>
  );
};

export default ImageUploadSelect;
