import React, {useState, useEffect, useRef} from 'react';
import {PlusOutlined} from '@ant-design/icons';
import {Modal, Button, Upload, message} from 'antd';
import type {RcFile, UploadProps} from 'antd/es/upload';
import type {UploadFile} from 'antd/es/upload/interface';
import {UploadOutlined} from '@ant-design/icons';
import {getUploadToken} from "@/services/ant-design-pro/api";
import {isEmpty} from "lodash";
import type {UploadRequestOption as RcCustomRequestOptions} from 'rc-upload/lib/interface';
import OSS from "ali-oss";

// {
//   uid: '-1',
//     name: 'image.png',
//   status: 'done',
//   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
// },
const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

interface UploadFormProps {
    fileLength: number;
    fileItems: [{[key: string]: any}];
    onUploadChange: (data: any) => void;
    appType?: string;
    appMethod?: string;
    // getValueFromEvent: any;
}

interface OSSDataType {
    region: string;
    accessId: string;
    accessSecret: string;
    fileName: string;
    secretToken: string;
    fileId: number;
    bucket: string;
    endpoint: string;
}


const UploadForm: React.FC<UploadFormProps> = ({fileLength, fileItems, onUploadChange, appType, appMethod, getValueFromEvent}) => {
    console.log(' --- <UploadForm /> --- ');
    console.log('UpdateForm: ', fileLength, fileItems, onUploadChange, appType ?? '', appMethod ?? '');
    const uploadRef = useRef<OSSDataType>();
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>(fileItems);
    const [successUid, setSuccessUid] = useState<number>(0);
    const [tokenInfo, setTokenInfo] = useState<OSSDataType>();
    const [uploadFileItems, setUploadFileItems] = useState(fileItems);

    const init = async (file: RcFile) => {
        let retData: OSSDataType | null = null;
        try {
            const fileFullName = file.name;
            const lastIndex = fileFullName.lastIndexOf('.');
            const basename = fileFullName.slice(0, lastIndex);
            const extension = fileFullName.slice(lastIndex + 1);
            const tokenInfo = await getUploadToken({file_suffix: extension, original_file_name: basename});
            if (tokenInfo.success) {
                const {data} = tokenInfo;
                console.log("UploadForm:token:info", data);
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

    const handleCancel = () => setPreviewOpen(false);


    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as RcFile);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
    };

    const handleChange: UploadProps['onChange'] = ({fileList: newFileList, file}) => {
        console.log("UploadForm:handleChange: ", newFileList, uploadFileItems, file);
        onUploadChange(newFileList);
        setFileList(newFileList);
    }

    const handleCustomRequest = async ({
                                           action,
                                           data,
                                           file,
                                           filename,
                                           headers,
                                           onError,
                                           onProgress,
                                           onSuccess,
                                           withCredentials,
                                       }: RcCustomRequestOptions) => {
        const tokenData = await init(file as RcFile);
        if (isEmpty(tokenData)) {
            return;
        }

        const params = {
            region: `oss-${tokenData?.region}`,
            accessKeyId: tokenData?.accessId,
            accessKeySecret: tokenData?.accessSecret,
            bucket: tokenData?.bucket,
            stsToken: tokenData?.secretToken,
            secure: true
        };

        const client = new OSS(params);
        client.put(tokenData?.fileName, file)
            .then(result => {
                if (!isEmpty(result) && !isEmpty(result.url)) {
                    onSuccess(result, file);
                    // const newFile = {
                    //     ...file, // 展开原 file 对象的属性
                    //     // 添加自定义属性
                    //     customProp1: 'value1',
                    //     customProp2: 'value2',
                    //     url: result.url, // 假设你想要添加从 result 获取的 URL
                    // };
                    //
                    // // 更新上传文件项状态
                    // setFileList(prevState => {
                    //     return [...prevState, newFile];
                    // });
                    // console.log("handleCustomRequest:onSuccess:", file, uploadFileItems, result);
                    // setUploadFileItems(prevState => {
                    //     const newItem = {
                    //         url: 'http://www.baidu.com',
                    //         uid: 1234556
                    //     };
                    //
                    //     return [...prevState, newItem]
                    // });

                }
            })
            .catch(onError);


        // console.log('handleCustomRequest:', uploadRef.current, data, file);
        // setActionData(`https://${result.bucket}.${result.endpoint}/${result.fileName}`);
        // setHeaderData({
        //     'Authorization': `OSS ${result.accessId}`,
        //     'x-oss-security-token': result.secretToken,
        //     'Content-Type': file.type,
        //     'Host': `${result.bucket}.${result.endpoint}`,
        //     'Date': file.lastModifiedDate
        // });
    }


    const beforeUpload: UploadProps['beforeUpload'] = async (file, FileList) => {
    const token = await init(file as RcFile);
    if (isEmpty(token)) {
      return;
    }

    file.uid = token?.fileId.toString() ?? '0';
    uploadRef.current = token;

    // console.log('beforeUpload:', token);
    };

    const uploadButton = (
        <div style={{margin: 0}}>
            <PlusOutlined/>
            <div style={{marginTop: 8}}>Upload</div>
        </div>
    );

    return (
        <>
            <Upload
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                beforeUpload={beforeUpload}
                customRequest={handleCustomRequest}
                // ref={}
            >
                {fileList.length >= fileLength ? null : uploadButton}
            </Upload>
            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                <img alt="example" style={{width: '100%'}} src={previewImage}/>
            </Modal>
        </>
    );
};

export default UploadForm;
