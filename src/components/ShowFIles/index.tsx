// 引入所需的模块和组件
import React, { useEffect, useState } from 'react';
import { Image, message } from 'antd';
import { ExclamationCircleFilled, FilePdfOutlined, FileImageOutlined } from "@ant-design/icons";
import { getFileUrlListByIds } from '@/services/ant-design-pro/api';
import {isEmpty} from "lodash";

// showFiles组件定义
const ShowFiles = ({ fileIds }) => {
  const [files, setFiles] = useState([]);
  const [visible, setVisible] = useState(false);
  const [src, setSrc] = useState('');
  // 在组件挂载时调用API
  useEffect(() => {
    if (isEmpty(fileIds) || "" === fileIds) {
      setFiles([]);
      return;
    }
    getFileUrlListByIds({file_ids: fileIds}).then((res) => {
      if (res && res.success) {
        setFiles(res.data); // 假设返回的数据在data字段中
      } else {
        message.error('操作失败');
      }
    }).catch(err => {
      console.error(err);
      message.error('操作失败');
    });
  }, [fileIds]);

  // 文件类型图标选择
  const getFileIcon = (fileName) => {
    if (fileName.endsWith('.pdf')) {
      return <FilePdfOutlined />;
    } else if (fileName.endsWith('.jpg') || fileName.endsWith('.png') || fileName.endsWith('.gif') || fileName.endsWith('.jpeg')) {
      return <FileImageOutlined />;
    } else {
      return <ExclamationCircleFilled />;
    }
  };

  // 文件下载
  // const downloadFile = (url, fileName) => {
  //   const link = document.createElement('a');
  //   link.href = url;
  //   link.download = fileName; // 下载后文件的名称
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };
  const downloadFile = async (url, fileName) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
      message.error('下载失败');
    }
  };

  // 文件预览
  const previewFile = (file) => {
    if (file.name.endsWith('.jpg') || file.name.endsWith('.png') || file.name.endsWith('.gif') || file.name.endsWith('.jpeg')) {
      setVisible(true);
      setSrc(file.url)
    } else {
      window.open(file.url, "_blank");
    }
  };

  return (
    <>
      <div>
        {!isEmpty(files)
          ? files.map((file) => (
              <div key={file.uid}>
                <a
                  // href={file.url}
                  // style={{ marginRight: 8 }}
                  // target="_blank"
                  // rel=" noreferrer"
                  onClick={() => {
                    console.log('file', file);
                    downloadFile(file.url, file.name);
                  }}
                >
                  下载
                </a>
                {getFileIcon(file.name)}
                <span onClick={() => previewFile(file)} style={{ cursor: 'pointer' }}>
                  {file.name}
                </span>
              </div>
            ))
          : '没有任何附件'}
      </div>
      <Image
        width={200}
        style={{ display: 'none' }}
        src={src}
        preview={{
          visible,
          src,
          onVisibleChange: (value) => {
            setVisible(value);
          },
        }}
      />
    </>
  );
};

export default ShowFiles;


// // 引入所需的依赖和样式
// import React, { useEffect, useState } from 'react';
// import { Image, message } from 'antd';
// import { ExclamationCircleFilled, FilePdfOutlined, FileImageOutlined } from '@ant-design/icons';
// import { getFileUrlListByIds } from '@/services/ant-design-pro/api';
// import {isEmpty} from "lodash";
//
// // 定义组件
// const ShowFiles = ({ fileIds }) => {
//   const [files, setFiles] = useState([]);
//   useEffect(() => {
//     if (isEmpty(fileIds) || "" === fileIds) {
//       setFiles([])
//       return;
//     }
//
//     // 调用API获取文件列表
//     getFileUrlListByIds({file_ids: fileIds}).then((res) => {
//       console.log("request", fileIds, res)
//       if (res && res.success) {
//         setFiles(res.data); // 假设API返回的数据结构中有data字段包含文件列表
//         message.success('文件加载成功');
//       } else {
//         message.error('文件加载失败');
//       }
//     }).catch(err => {
//       console.error(err);
//       message.error('操作失败');
//     });
//   }, [fileIds]);
//
//   // 文件下载函数
//   const downloadFile = (url) => {
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = url.split('/').pop(); // 使用URL的最后一部分作为文件名
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };
//
//   // 文件预览函数
//   const previewFile = (file) => {
//     if (file.type === 'image') {
//       Image.preview({
//         src: file.url,
//         alt: file.name,
//       });
//     } else {
//       window.open(file.url, '_blank');
//     }
//   };
//
//   return (
//     <div>
//       {files.map(file => (
//         <div key={file.uid}>
//           <a onClick={() => downloadFile(file.url)} style={{marginRight: '10px'}} target="_blank">下载</a>
//           {file.url.endsWith('.pdf') && <FilePdfOutlined/>}
//           {file.url.match(/\.(jpeg|jpg|png|gif|JPEG|JPG|PNG|GIF)$/) ? <FileImageOutlined/> : <ExclamationCircleFilled/>}
//           <span
//             onClick={() => previewFile(file)}
//             style={{
//               cursor: 'pointer',
//               marginLeft: '10px',
//               whiteSpace: 'nowrap',
//               overflow: 'hidden',
//               textOverflow: 'ellipsis',
//               maxWidth: '100px', // 根据需要调整最大宽度
//               display: 'inline-block'
//             }}
//             title={file.name} // 鼠标悬停时显示完整文本
//           >
//   {file.name}
// </span>
//           {/*<span onClick={() => previewFile(file)} style={{cursor: 'pointer', marginLeft: '10px'}}>{file.name}</span>*/}
//         </div>
//       ))}
//     </div>
//   );
// };
//
// export default ShowFiles;
