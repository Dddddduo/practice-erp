import React, {useEffect, useState} from 'react';
import { PlusOutlined } from '@ant-design/icons';
// message
import {Modal, Upload} from 'antd';
import type { RcFile, UploadProps } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
import {request} from "@umijs/max";
// import {request} from "@@/exports";
// import {removeRule} from "@/services/ant-design-pro/api";

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const UploadImageBA: React.FC = () => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  // setFileList
  const [fileList] = useState<UploadFile[]>([
    {
      uid: '-1',
      name: 'image.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
    {
      uid: '-2',
      name: 'image.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
    {
      uid: '-3',
      name: 'image.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
    {
      uid: '-4',
      name: 'image.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
    {
      uid: '-xxx',
      percent: 50,
      name: 'image.png',
      status: 'uploading',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
    {
      uid: '-5',
      name: 'image.png',
      status: 'error',
    },
  ]);


  // allow-credentials /an/getFileUrlById


  async function getWeather(options?: { [key: string]: any }) {
    return request<any>('/api/getWeather', {
      method: 'GET',
      ...(options || {}),
    });
  }

  const handleGetWeather = async () => {
    try {
      const result = await getWeather();
      console.log('result: ', result);
    } catch (error) {
      console.log('err: ', error);
    }
    // const hide = message.loading('正在删除');
    // if (!selectedRows) return true;
    // try {
    //   await removeRule({
    //     key: selectedRows.map((row) => row.key),
    //   });
    //   hide();
    //   message.success('Deleted successfully and will refresh soon');
    //   return true;
    // } catch (error) {
    //   hide();
    //   message.error('Delete failed, please try again');
    //   return false;
    // }
  };

  useEffect(() => {
    const { REACT_APP_ENV = 'dev' } = process.env;
    console.log('use effect: ', REACT_APP_ENV);

    handleGetWeather();
  }, []);

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  };

  // { fileList: newFileList, file: file, event: evt }
  const handleChange: UploadProps['onChange'] = () => {
    // setFileList(newFileList);
    // console.log("handleChange", newFileList, file, evt);
  }


  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  return (
    <>
      <Upload
        action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
      >
        {fileList.length >= 8 ? null : uploadButton}
      </Upload>
      <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );
};

export default UploadImageBA;



// import React, {useState, useEffect} from 'react';
// import {PlusOutlined} from '@ant-design/icons';
// import {Modal, Upload} from 'antd';
// import type {RcFile} from 'antd/es/upload';
// import type {UploadFile} from 'antd/es/upload/interface';
//
// const getBase64 = (file: RcFile): Promise<string> =>
//   new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => resolve(reader.result as string);
//     reader.onerror = (error) => reject(error);
//   });
//
//
// export type SourceList = {
//   beforeIds: string[];
//   afterIds: string[];
//   onBeforeImageChange: (id: string) => void;
//   onAfterImageChange: (id: string) => void;
//   beforeName?: string;
//   afterName?: string;
//   title?: string;
// };
//
// const UploadImageBA: React.FC<SourceList> = ({
//                                                beforeIds,
//                                                afterIds,
//                                                onBeforeImageChange,
//                                                onAfterImageChange,
//                                                beforeName,
//                                                afterName
//                                              }) => {
//   const beforeArr = beforeIds.length > 1 ? [beforeIds[0]] : beforeIds;
//   const afterArr = afterIds.length > 1 ? [afterIds[0]] : afterIds;
//   const [previewOpen, setPreviewOpen] = useState(false);
//   const [previewImage, setPreviewImage] = useState('');
//   const [previewTitle, setPreviewTitle] = useState('');
//   const [imageBefore, setImageBefore] = useState<UploadFile[]>([]);
//   const [imageAfter, setImageAfter] = useState<UploadFile[]>([]);
//
//   useEffect(() => {
//     console.log('use')
//     if (0 === beforeArr.length) {
//       setImageBefore([]);
//       return;
//     }
//
//     if (0 === afterArr.length) {
//       setImageAfter([]);
//       return;
//     }
//
//     // todo http请求
//   }, []);
//
//
//   const handleCancel = () => setPreviewOpen(false);
//
//   const handlePreview = async (file: UploadFile) => {
//     if (!file.url && !file.preview) {
//       file.preview = await getBase64(file.originFileObj as RcFile);
//     }
//
//     setPreviewImage(file.url || (file.preview as string));
//     setPreviewOpen(true);
//     setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
//   };
//
//   // const handleImgBeforeChange: UploadProps['onChange'] = ({fileList: beforeFileList}) => setImageBefore(beforeFileList);
//   // const handleImgAfterChange: UploadProps['onChange'] = ({fileList: afterFileList}) => setImageAfter(afterFileList);
//
//   const uploadButton = (
//     <div>
//       <PlusOutlined/>
//       <div style={{marginTop: 8}}>Upload</div>
//     </div>
//   );
//
//   // if (props.imageBefore.length > 1) {
//   //   imageBefore = [...imageBefore];
//   // }
//
//   // [
//   //   {
//   //     uid: '-5',
//   //     name: 'image.png',
//   //     status: 'error',
//   //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
//   //   }
//   // ]
//
//   const onBeforeImageChange2 = () => {
//     console.log(111);
//   }
//   return (
//     <>
//       <div style={{float: "left"}}>
//         <h3 style={{textAlign: "center"}}>{beforeName ?? 'Before'}</h3>
//         <Upload
//           action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
//           listType="picture-card"
//           fileList={imageBefore}
//           onPreview={handlePreview}
//           onChange={onBeforeImageChange2}
//         >
//           {imageBefore.length >= 1 ? null : uploadButton}
//         </Upload>
//       </div>
//       <div style={{float: "right"}}>
//         <h3 style={{textAlign: "center"}}>{afterName ?? 'After'}</h3>
//         <Upload
//           action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
//           listType="picture-card"
//           fileList={imageAfter}
//           onPreview={handlePreview}
//           // onChange={onAfterImageChange}
//         >
//           {imageAfter.length >= 1 ? null : uploadButton}
//         </Upload>
//       </div>
//       <div style={{clear: "both"}}></div>
//       <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
//         <img alt="example" style={{width: '100%'}} src={previewImage}/>
//       </Modal>
//     </>
//   );
// };
//
// export default UploadImageBA;
