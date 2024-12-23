import React, {useState, useEffect, useRef} from 'react'
import {Checkbox, message, Modal, Upload} from 'antd'
import {UploadFile} from "antd/es/upload/interface";
import {PlusOutlined} from "@ant-design/icons";
import {RcFile} from "antd/es/upload";
import {flattenDeep, isArray, isEmpty} from "lodash";
import OSS from "ali-oss";
import type {UploadRequestOption as RcCustomRequestOptions} from 'rc-upload/lib/interface';
import {getUploadToken, getFileUrlListByIds} from "@/services/ant-design-pro/api";

type UploadFilesProps = {
  value: string | number;
  onChange: (data: any) => void;
  fileLength: number;
  allowedTypes: string[];
  maxSizeMB?: number;
  showDownloadIcon: boolean;
  disabled?: boolean
};

interface OSSUploadType {
  region: string;
  accessId: string;
  accessSecret: string;
  fileName: string;
  secretToken: string;
  fileId: number;
  bucket: string;
  endpoint: string;
}

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });


export const allowFileTypes = {
  pdf: ["application/pdf"], // PDF文档：application/pdf
  word: ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword"],
  excel: ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
  images: ["image/jpeg", "image/png", "image/gif", "image/svg+xml", "image/bmp", "image/webp", "image/vnd.microsoft.icon"],
  zip: ["application/zip"],
  rar: ["application/x-rar-compressed"]
}

const isImage = (fileName) => {
  return fileName.endsWith('.jpg') || fileName.endsWith('.png') || fileName.endsWith('.gif') || fileName.endsWith('.jpeg')
}

const downloadFile = (url, fileName) => {
  const link = document.createElement('a');
  link.href = url;
  link.target = "_blank"
  link.download = fileName; // 下载后文件的名称
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * File Upload
 * @param value
 * @param onChange
 * @param fileLength
 * @param allowedTypes
 * @param maxSizeMB
 * @constructor
 */
const UploadFiles: React.FC<UploadFilesProps> = ({
                                                   value,
                                                   onChange,
                                                   fileLength,
                                                   allowedTypes = ['*'],
                                                   maxSizeMB = 100,
                                                   disabled = false
                                                 }) => {
  console.log('value--value',value)
  const uploadRef = useRef<{ [key: string]: number }>({});
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>();

  const handlePreview = async (file: UploadFile) => {
    console.log(file, file.name)
    if (isImage(file.name) || isImage(file.url)) {
      // todo 图片展示，非图片跳转链接
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj as RcFile);
      }

      setPreviewImage(file.url || (file.preview as string));
      setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
      setPreviewOpen(true);
      return
    }

    downloadFile(file.url, file.name);
  };

  useEffect(() => {
    if ('' === value || '0' === value || 0 === value || null === value || undefined === value) {
      setFileList([])
      return
    }

    getFileUrlListByIds({file_ids: value}).then(res => {
      if (res.success) {
        const formatData = res.data.map(item => {
          item.file_id = item.uid
          item.status = 'done'
          return item
        })

        setFileList(formatData ?? [{}])
      }
    })

  }, [value])

  const handleCancel = () => setPreviewOpen(false);

  const beforeUpload = (file: RcFile) => {
    const allowMineTypes = flattenDeep(allowedTypes)
    // 检查文件类型
    if (!allowMineTypes.includes('*') && !allowMineTypes.includes(file.type)) {
      message.error(`Only these file types are allowed: ${allowedTypes.join(', ')}`);
      return Upload.LIST_IGNORE; // 忽略文件上传
    }

    // 检查文件大小
    if (file.size / 1024 / 1024 > maxSizeMB) {
      message.error(`File size cannot exceed ${maxSizeMB}MB`);
      return Upload.LIST_IGNORE; // 忽略文件上传
    }

    return true; // 允许上传
  };

  const handleChange = ev => {
    let flag = true
    const fileID: any = []
    setFileList([...ev.fileList])
    for (const item of ev.fileList) {
      if (item.status !== 'done') {
        flag = false
      }

      fileID.push(uploadRef.current[item.uid ?? ''] ?? item.uid)
    }

    if (onChange && flag) {
      onChange(fileID.join(','))
    }
  }

  const uploadButton = (
    <div style={{margin: 0}}>
      <PlusOutlined/>
      <div style={{marginTop: 8}}>Upload</div>
    </div>
  );

  const init = async (file: RcFile) => {
    let retData: OSSUploadType | null = null;
    try {
      const fileFullName = file.name;
      const lastIndex = fileFullName.lastIndexOf('.');
      const basename = fileFullName.slice(0, lastIndex);
      const extension = fileFullName.slice(lastIndex + 1);
      const tokenInfo = await getUploadToken({file_suffix: extension, original_file_name: basename});
      if (tokenInfo.success) {
        const {data} = tokenInfo;
        retData = {
          region: data["region_id"],
          accessId: data["access_id"],
          accessSecret: data["access_secret"],
          fileName: data["file_name"],
          secretToken: data["secret_token"],
          fileId: data["file_id"],
          bucket: data["bucket"],
          endpoint: data["endpoint"]
        };
      }
    } catch (error) {
      message.error((error as Error).message);
    }

    return retData;
  };

  const handleCustomRequest = async ({file, onProgress, onError, onSuccess}: RcCustomRequestOptions) => {
    const tokenData = await init(file as RcFile);
    if (isEmpty(tokenData)) {
      return;
    }
    console.log(uploadRef.current)
    const currUid = isEmpty((file as RcFile).uid) ? '' : (file as RcFile).uid
    uploadRef.current[currUid] = tokenData?.fileId ?? 0
    const params = {
      region: `oss-${tokenData?.region}`,
      accessKeyId: tokenData?.accessId,
      accessKeySecret: tokenData?.accessSecret,
      bucket: tokenData?.bucket,
      stsToken: tokenData?.secretToken,
      secure: true
    };

    const client = new OSS(params);
    try {
      client.put(tokenData?.fileName, file)
        .then(result => {
          if (!isEmpty(result) && !isEmpty(result.url)) {
            onSuccess(result, file);
            return
          }

          onError(Error('Upload Fail'))
        })
        .catch(onError);
    } catch (error) {
      console.log("err:", error)
      if (!isEmpty(onError)) {
        const errMsg = !isEmpty(error) ? (error as Error).message : ''
        onError(new Error(errMsg));
      }
    }
  }

  //
  return <>
    <Upload
      listType="picture-card"
      onPreview={handlePreview}
      onChange={handleChange}
      fileList={fileList}
      beforeUpload={beforeUpload}
      customRequest={handleCustomRequest}
      showUploadList={{showPreviewIcon: true, showRemoveIcon: !disabled}}
      disabled={disabled}
    >
      {(!isEmpty(fileList) && isArray(fileList) && fileList.length >= fileLength) ? null : uploadButton}
    </Upload>


    <Modal width="auto" open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>

      <img alt="file" style={{width: '100%'}} src={previewImage}/>
    </Modal>
  </>
}

export default UploadFiles;
