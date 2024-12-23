import React, {forwardRef, useImperativeHandle, useState} from 'react';
import { Upload, Button, Input, Form, Modal } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import UploadFiles from "@/components/UploadFiles";

const PhotoDetailForm = forwardRef((props, ref) => {
  const [list, setList] = useState<any>([{ picture_ids: '', location: '', item: '', description: [''] }]);

  useImperativeHandle(ref, () => ({
    getList: () => list,

    updateList: (newList) => setList(newList),
  }))

  const addDescription = (index, k) => {
    const newList = [...list];
    newList[index].description.splice(k + 1, 0, '');
    setList(newList);
  };

  const delDescription = (index, k) => {
    const newList = [...list];
    newList[index].description.splice(k, 1);
    setList(newList);
  };

  const addPhotoColumn = (index) => {
    const newList = [...list];
    newList.splice(index + 1, 0, { picture_ids: '', location: '', item: '', description: [''] });
    setList(newList);
  };

  const deletePhotoColumn = (index) => {
    const newList = [...list];
    newList.splice(index, 1);
    setList(newList);
  };

  /**
   * 修改图片
   * @param e
   * @param index
   */
  const changePictures = (e, index) => {
    setList(list.map((detail, key) =>
      key === index ? { ...detail, picture_ids: e } : detail
    ));
  }

  // Render Method
  return (
    <div style={{ overflow: 'auto' }}>
      {list.map((item, index) => (
        <div key={index} style={{ marginBottom: '20px', height: 'auto' }}>
          <div style={{ marginBottom: '10px' }}>
            Item {index + 1}:
          </div>
          <div className="detail-items">
            <div className="detail-items-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="detail-list" style={{ flex: 1 }}>
                <UploadFiles value={item.picture_ids + ','} onChange={val => changePictures(val, index)} fileLength={1} allowedTypes={['*']} />
              </div>
              <div>
                <Button icon={<PlusOutlined />} onClick={() => addPhotoColumn(index)} style={{ marginLeft: 20, cursor: 'pointer' }} />
                {index > 0 && <Button icon={<DeleteOutlined />} onClick={() => deletePhotoColumn(index)} style={{ marginLeft: 20, cursor: 'pointer', color: 'red' }} />}
              </div>
            </div>
            <div className="detail-items-content" style={{ marginTop: '20px', height: 'auto' }}>
              <div>Location</div>
              <Input value={item.location} style={{marginBottom: '2px'}} onChange={(e) => {
                const newList = [...list];
                newList[index].location = e.target.value;
                setList(newList);
              }} />
              <div>Item</div>
              <Input value={item.item} onChange={(e) => {
                const newList = [...list];
                newList[index].item = e.target.value;
                setList(newList);
              }} />
              <div>Description</div>
              {item.description && item.description.map((desc, k) => (
                <div key={k} style={{ display: 'flex', marginBottom: '10px' }}>
                  <Input
                    style={{ flex: 1 }}
                    value={desc}
                    onChange={(e) => {
                      const newList = [...list];
                      newList[index].description[k] = e.target.value;
                      setList(newList);
                    }}
                  />
                  <Button icon={<PlusOutlined />} onClick={() => addDescription(index, k)} style={{ marginLeft: 20 }} />
                  {k > 0 && <Button icon={<DeleteOutlined />} onClick={() => delDescription(index, k)} style={{ marginLeft: 20, color: 'red' }} />}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
})

export default PhotoDetailForm
