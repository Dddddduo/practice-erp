### 删除按钮

```js
// 示例1
<DeleteButton
  type="primary"
  danger key="delPopconfirm"
  onConfirm={() => handleDeleteProject(record.id)}
>
  删除
</DeleteButton>

// 示例2
<DeleteButton
danger
onConfirm={() => console.log('执行删除操作')}
title="自定义标题"
desc="您确定要删除这个项目吗？"
okText="删除"
cancelText="我再想想"
>
删除
</DeleteButton>
```

### 提交按钮

```js
// 示例1: 时间非Form提交方式自定义提交
<SubmitButton
  type="primary"
  onConfirm={async () => {
    // 这里执行您的提交逻辑，比如API调用
    console.log('执行提交');
    await new Promise(resolve => setTimeout(resolve, 2000)); // 模拟异步操作
  }}
>
  提交
</SubmitButton>

// 示例2：使用Form原始提交方式
<SubmitButton
  form={formRef}
  className="green-button"
  type="primary"
  style={{marginRight: 20, width: 80, marginTop: 20}}
>
  保存
</SubmitButton>
```

### 下载按钮

```js
<DownloadButton
  fetchMethod={() => handleRequest(params)}
  fileName="example.xlsx"
  type="primary"
>
  自定义下载文本
</DownloadButton>

```

### 轮询下载按钮

```js
// 停止状态
const [stopTimer, setStopTimer] = useState<boolean>(false)
/**
 * 轮询下载
 * 
 * @param token
 * @returns {Promise<void>}
 */
const downloadHandle = async (token: string) => {
  if ('' === token) {
    return
  }

  const result = await getFileOssUrl({download_token: token})
  // 当获取到数据后，把stopTimer 设置为true
  if (result?.success && !isEmpty(result?.data)) {
    setStopTimer(true);
    await downloadFile(
      result?.data.replace("http:", "https:"),
      reportTitle + ".pdf"
    );
  }

  return
}

/**
 * 获取token
 */
const getTokenHandle = async () => {
  let type_setting = "";

  if (reportTid === '11') {
    type_setting = "column";
  }

  if (reportTid === '14') {
    const requestData = {
      single_pdf: [
        {
          pdf_info: {report_id: reportId},
          pdf_type: "maintenance_report_14",
        },
      ],
    };

    const result = await createPdfFilePlus(requestData);
    if (result.success) {
      return result.data;
    }
  } else {
    const params = {
      pdf_type: "worker_report",
      type_setting: type_setting,
      pdf_info: {report_id: reportId},
    }

    const result = await createPdf(params);
    if (result.success) {
      return result.data;
    }
  }

  return '';
}

// beforeRequest 获取token，获取其他的预处理
// requestHandle 需要轮询的方法
// stopTimer 停止状态，当state变成true，就会停止轮询
// maxPollingTime 最大轮询时间，超过后会停止轮询
// pollingInterval 轮询间隔，1表示每1秒轮询一次，默认2
// buttonText 按钮的名字
<PollingButton
  requestHandle={(token) => downloadHandle(token)}
  beforeRequest={getTokenHandle}
  type="primary"
  style={{margin: 10}}
  stopPolling={stopTimer}
  maxPollingTime={300}
  changeOutStatus={() => {
    setStopTimer(false)
  }}
/>

```
