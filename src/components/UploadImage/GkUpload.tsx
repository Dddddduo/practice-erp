import React, { useState, useEffect, useRef } from 'react'
import { message, Modal, Upload } from 'antd'
import { UploadFile } from "antd/es/upload/interface";
import { PlusOutlined } from "@ant-design/icons";
import { RcFile, UploadProps } from "antd/es/upload";
import { isEmpty } from "lodash";
import OSS from "ali-oss";
import type { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface';
import { getUploadToken } from "@/services/ant-design-pro/api";

type GkUploadProps = {
    value: UploadFile[];
    onChange: (data: any) => void;
    fileLength: number;
};

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

const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
// value, onChange 是Form.Item 给的。
const GkUpload: React.FC<GkUploadProps> = ({ value, onChange, fileLength }) => {

    const uploadRef = useRef<{ [key: string]: number }>({});
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>(value);
    console.log('GkUpload:file:list:', value, fileList);
    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as RcFile);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
    };
    // console.log('GkUpload:props:', fileList, value);
    useEffect(() => {
        if (value) {
            console.log('GkUpload:', value)
            setFileList(value ?? [{}])
        }
    }, [value])

    const handleCancel = () => setPreviewOpen(false);

    const handleChange = ev => {
        const result: { [key: string]: any }[] = [];
        console.log('ev fileList', ev.fileList)
        setFileList([...ev.fileList])
        for (const item of ev.fileList) {
            result.push({
                ...item,
                id: uploadRef.current[item.uid ?? ''] ?? item.id,
                uid: uploadRef.current[item.uid ?? ''] ?? item.uid,
                file_id: uploadRef.current[item.uid ?? ''] ?? item.file_id,
            });
        }
        if (onChange) {
            onChange(result)
            return
        }
    }

    const uploadButton = (
        <div style={{ margin: 0 }}>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    const init = async (file: RcFile) => {
        let retData: OSSDataType | null = null;
        try {
            const fileFullName = file.name;
            const lastIndex = fileFullName.lastIndexOf('.');
            const basename = fileFullName.slice(0, lastIndex);
            const extension = fileFullName.slice(lastIndex + 1);
            const tokenInfo = await getUploadToken({ file_suffix: extension, original_file_name: basename });
            if (tokenInfo.success) {
                const { data } = tokenInfo;
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
                console.log(basename, extension, retData);
            }

        } catch (error) {
            message.error((error as Error).message);
        }

        return retData;
    };

    const handleCustomRequest = async ({ file, onError, onSuccess }: RcCustomRequestOptions) => {
        const tokenData = await init(file as RcFile);
        if (isEmpty(tokenData)) {
            return;
        }

        uploadRef.current[file?.uid ?? ''] = tokenData?.fileId ?? 0
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
                }
            })
            .catch(onError);
    }

    return <>
        <Upload
            listType="picture-card"
            onPreview={handlePreview}
            onChange={handleChange}
            fileList={fileList}
            customRequest={handleCustomRequest}
        >
            {(!isEmpty(fileList) && fileList.length >= fileLength) ? null : uploadButton}
        </Upload>
        <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
    </>
}

export default GkUpload;
