import React, {useCallback, useEffect, useState} from "react";
import {RcFile, UploadProps} from "antd/es/upload";
import OSS from "ali-oss";
import {UploadFile} from "antd/es/upload/interface";
import {PlusOutlined} from "@ant-design/icons";
import {Modal, Upload} from "antd";

import {getImages, getUploadToken} from '@/services/ant-design-pro/api';

export type ImageSourceList = {
  beforeImageList: string[];
  afterImageList: string[];
  isOpen: number;
  beforeAfterParams: HANDLE.ImageBeforeAfter;
  onImageChange: (params: HANDLE.ImageBeforeAfter, data: string) => void;
};

// type ResponseData = {
//   uid: string;
//   name: string;
//   url: string;
// };

// 图片base64转换
const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

// Before 和 After 形式
const ImageBeforeAfter: React.FC<ImageSourceList> = ({
                                                       beforeImageList,
                                                       afterImageList,
                                                       beforeAfterParams,
                                                       onImageChange
                                                     }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [imageBefore, setImageBefore] = useState<UploadFile[]>([]);
  const [imageAfter, setImageAfter] = useState<UploadFile[]>([]);
  const [currentUploadUid, setCurrentUploadUid] = useState<{ [key: string]: string }>({});
  // const [popWhere,] = useState<HANDLE.ImageBeforeAfter>(beforeAfterParams);
  // beforeAfterParams:
  // console.log("popWhere:", popWhere);
  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  };

  const handleBeforeChange: UploadProps['onChange'] = ({fileList}) => {
    let fileIds: string[] = [];
    for (const item of fileList) {
      if ('done' === item.status) {
        let uid = currentUploadUid[item.uid] ?? item.uid;
        fileIds.push(uid);
      }
    }

    console.log('handleBeforeChange:', fileList);
    setImageBefore(fileList);
    onImageChange({
      ...beforeAfterParams,
      sourceType: 'image_before'
    }, fileIds.join(','));
  }

  const handleAfterChange: UploadProps['onChange'] = ({fileList}) => {
    console.log('onchange:', fileList);
    setImageAfter(fileList);
  }

  const handleGetImages = useCallback(async () => {
    console.log('123sifagagaafafafa');
    if (0 === beforeImageList.length && 0 === afterImageList.length) {
      return;
    }

    // const hide = message.loading('正在获取数据');
    const beforeParams = beforeImageList.join(',');
    const afterParams = afterImageList.join(',');
    try {
      const beforeResult = await getImages({file_ids: beforeParams});
      if (beforeResult.data) {
        const beforeData = beforeResult.data;
        if (beforeData.length > 0) {
          const beforeList = {
            ...beforeData[0],
            status: "done"
          };

          console.log('beforeList: ', [beforeList]);
          setImageBefore([beforeList]);
        }
      }

      const afterResult = await getImages({file_ids: afterParams});
      if (afterResult.data) {
        const afterData = afterResult.data;
        if (afterData.length > 0) {
          const afterList = {
            ...afterData[0],
            status: "done"
          };

          console.log('afterList: ', [afterList]);
          setImageAfter([afterList]);
        }
      }

    } catch (error) {
      console.log('upload:err:', error);
      // hide();
      // message.error((error as Error).message);
    }
  }, []);

  const handleBeforeUpload: UploadProps['beforeUpload'] = async (file) => {
    // const hide = message.loading('正在上传');
    const fileFullName = file.name;
    const lastIndex = fileFullName.lastIndexOf('.');
    const basename = fileFullName.slice(0, lastIndex);
    const extension = fileFullName.slice(lastIndex + 1);
    const tokenInfo = await getUploadToken({file_suffix: extension, original_file_name: basename});
    console.log('handleBeforeUploadResult:222:', tokenInfo);
    if (!tokenInfo.data) {
      return;
    }

    const tokenData = tokenInfo.data;
    const {
      region_id: region,
      access_id: accessId,
      access_secret: accessSecret,
      file_name: fileName,
      secret_token: secretToken,
      file_id: fileId,
      bucket
    } = tokenData;
    const client = new OSS({
      region: `oss-${region}`,
      accessKeyId: accessId,
      accessKeySecret: accessSecret,
      bucket: bucket,
      stsToken: secretToken,
      secure: true
    });

    const uid = file.uid;
    console.log('handleBeforeUploadResult:fileId:', fileId);
    try {
      setCurrentUploadUid(prevState => {
        return {
          ...prevState,
          [uid]: fileId,
        };
      });

      await client.put(fileName, file);
    } catch (error) {
      console.log('upload:err:', error);
      // hide();
      // message.error((error as Error).message);
    }
  }
  //
  useEffect(() => {
    console.log('useEffect:useEffect:useEffect');
    handleGetImages().then(r => {

    });
    // handleGetImages().then(r => {
    //   console.log("useEffect_result: ", r);
    // });

    return () => {
      console.log('amount')
    };
  }, []);

  const uploadButton = (
    <div>
      <PlusOutlined/>
      <div style={{marginTop: 8}}>Upload</div>
    </div>
  );

  return (
    <>
      <div style={{clear: "both", height: 160}}>
        <div style={{float: "left"}}>
          <h3 style={{textAlign: "center"}}>Before</h3>
          <Upload
            // action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
            listType="picture-card"
            fileList={imageBefore}
            onPreview={handlePreview}
            onChange={handleBeforeChange}
            beforeUpload={handleBeforeUpload}
          >
            {imageBefore.length >= 1 ? null : uploadButton}
          </Upload>
        </div>

        <div style={{float: "right"}}>
          <h3 style={{textAlign: "center"}}>After</h3>
          <Upload
            // action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
            listType="picture-card"
            fileList={imageAfter}
            onPreview={handlePreview}
            onChange={handleAfterChange}
            beforeUpload={handleBeforeUpload}
          >
            {imageAfter.length >= 1 ? null : uploadButton}
          </Upload>
        </div>
      </div>


      <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
        <img alt="example" style={{width: '100%'}} src={previewImage}/>
      </Modal>
    </>
  );
};

export default ImageBeforeAfter;
