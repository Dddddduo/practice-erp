import { useEffect, useState } from "react"
import { useLocation } from "umi";
import {
  getQuoTaxRate,
  quotationSummaryPdf,
  quotationSummaryFixedPdf,
  downloadExcel,
  createPdfFile,
  getFileOssUrl,
  getMergeQuoFileName,
  createSinglePdfFile
} from "@/services/ant-design-pro/pdf";
import { Button, message } from "antd";
import './index.css'
import dayjs from "dayjs";
import { downloadFile } from "@/utils/utils";


const QuotationSummaryPdf = () => {
  const location = useLocation();
  // 根据参数名称获取具体的路由参数
  const queryParams = new URLSearchParams(location.search);
  // 配置Message
  const [messageApi, contextHolder] = message.useMessage();
  const [mergeQuoId, setMergeQuoId]: any = useState()
  const [brandId, setBrandId]: any = useState()
  const [type, setType]: any = useState()
  const [mergeIds, setMergeIds]: any = useState()
  const [ids, setIds]: any = useState()
  const [firstKey, setFirstKey]: any = useState()
  const [loadingDownload, setLoadingDownload] = useState<boolean[]>([]);
  const [src, setSrc]: any = useState()
  const [height, setHeight] = useState(1200)
  // 成功Message
  const success = (text: string) => {
    messageApi.open({
      type: 'success',
      content: text,
    });
  };

  // 失败Message
  const error = (text: string) => {
    messageApi.open({
      type: 'error',
      content: text,
    });
  };

  const changeIds = (item) => {
    setMergeIds(item)
    setSrc(`https://erp-pre.zhian-design.com/pdf/quotation-summary?merge_quo_id=${item}`)
    quotationSummaryPdf({ merge_quo_id: item, get_page: 1 }).then(res => {
      if (res.data) {
        if ([10, 11, 15, 9].indexOf(parseInt(brandId)) !== -1) {
          setHeight(1330 * Number(res.data))
        } else {
          setHeight(1230 * Number(res.data))
        }
      }
    })
  }

  const DownloadExcel = () => {
    downloadExcel({ merge_quo_id: mergeQuoId, 'file_type': 'excel' }).then(res => {
      if (res.data) {
        // this.loading = false
        downloadFile(res.data, 'moncler' + dayjs().format('YYYY-MM') + '月结' + '.xlsx')
      }
    })
  }

  const downloadPDF = (index) => {
    // if (loadingDownload) {
    //   error('正在下载中，请耐心等待')
    //   return false
    // }
    success('提交下载成功，请耐心等待')
    setLoadingDownload((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });
    let type_setting = ''
    if ([10, 11, 15, 21, 24].indexOf(parseInt(brandId)) !== -1 || type === 'event') {
      type_setting = 'column'
    }
    if ([10, 11, 15, 24].indexOf(parseInt(brandId)) !== -1 || type === 'event') {
      const queryData = { 'pdf_type': 'merge_quotation', type_setting: type_setting, pdf_info: { merge_quo_id: mergeQuoId } }
      if (mergeIds) {
        queryData.pdf_info = { merge_quo_id: mergeIds }
      } else {
        queryData.pdf_info = { merge_quo_id: mergeQuoId }
      }
      createPdfFile(queryData).then(async (res) => {
        console.log('res1111321113', res);
        downloadPdfFile(res.data, index);
      })
    } else {
      let requestData = {}
      if (mergeIds) {
        requestData = {
          single_pdf: [
            { pdf_info: { merge_quo_id: mergeIds, header: true }, pdf_type: 'merge_quotation_header' },
            { pdf_info: { merge_quo_id: mergeIds, is_body: true }, pdf_type: 'merge_quotation_body' }
          ]
        }
      } else if (type === 'fixed') {
        requestData = {
          single_pdf: [
            { pdf_info: { merge_quo_id: mergeQuoId }, pdf_type: 'merge_quotation_fixed' }
          ]
        }
      } else {
        requestData = {
          single_pdf: [
            { pdf_info: { merge_quo_id: mergeQuoId, header: true }, pdf_type: 'merge_quotation_header' },
            { pdf_info: { merge_quo_id: mergeQuoId, is_body: true }, pdf_type: 'merge_quotation_body' }
          ]
        }
      }

      createSinglePdfFile(requestData).then((res) => {
        console.log('2893322302309239023022390', res.data);
        downloadPdfFile(res.data, undefined);
      })
    }
  }

  const downloadPdfFile = (token, index) => {
    getFileOssUrl({ download_token: token }).then(ossResult => {
      if (ossResult.data) {
        getMergeQuoFileName({ merge_quo_id: mergeQuoId }).then(res => {
          if (res.data) {
            downloadFile(ossResult.data.replace('http:', 'https:'), res.data.data + '.pdf')
          } else {
            const fileName = dayjs().format('YYYY-MM') + '月结' + '.pdf'
            downloadFile(ossResult.data.replace('http:', 'https:'), fileName)
          }
        })
        if (index) {
          setLoadingDownload((prevLoadings) => {
            const newLoadings = [...prevLoadings];
            newLoadings[index] = false;
            return newLoadings;
          });
        }
      } else {
        setTimeout(() => {
          downloadPdfFile(token, undefined)
        }, 1000)
      }
    })
  }

  useEffect(() => {
    const merge_quo_id = queryParams.get('merge_quo_id')
    setMergeQuoId(merge_quo_id)
    const brand_id: any = queryParams.get('brand_id')
    setBrandId(brand_id)
    const type = queryParams.get('type')
    setType(type)
    const merge_ids = queryParams.get('merge_ids')
    setMergeIds(merge_ids)

    if (merge_ids) {
      getQuoTaxRate({ quo_ids: merge_quo_id }).then(result => {
        if (result) {
          setIds(result.data)
          let firstIds = ''
          for (const item in result.data) {
            console.log(result.data[item]);
            firstIds = result.data[item]
            setFirstKey(item)
            break
          }
          setSrc(`https://erp-pre.zhian-design.com/pdf/quotation-summary?merge_quo_id=${firstIds}`)
          quotationSummaryPdf({ merge_quo_id: firstIds, get_page: 1 }).then(res => {
            if (res.data) {
              if ([10, 11, 15].indexOf(parseInt(brand_id)) !== -1) {
                setHeight(1330 * Number(res.data))
              } else {
                setHeight(1230 * Number(res.data))
              }
            }
          })
        }
      })
    } else {
      if (type === 'fixed') {
        setSrc(`https://erp-pre.zhian-design.com/pdf/quotation-summary-fixed?merge_quo_id=${merge_quo_id}`)
        quotationSummaryFixedPdf({ merge_quo_id: merge_quo_id, get_page: 1 }).then(res => {
          if (res.data) {
            setHeight(1330 * Number(res.data))
          }
        })
      } else {
        setSrc(`https://erp-pre.zhian-design.com/pdf/quotation-summary?merge_quo_id=${merge_quo_id}`)
        quotationSummaryPdf({ merge_quo_id: merge_quo_id, get_page: 1 }).then(res => {
          if (res.data) {
            if ([10, 11, 15].indexOf(parseInt(brand_id)) !== -1) {
              setHeight(1330 * Number(res.data))
            } else {
              setHeight(1230 * Number(res.data))
            }
          }
        })
      }
    }
  }, [])

  return (
    <div className="container" style={{ width: 1900, pageBreakAfter: 'always' }}>
      {contextHolder}
      {
        ids &&
        <div style={{ margin: '60px auto', width: 200 }}>
          {
            ids.map((item, index) => {
              return (
                <div style={{ float: 'left' }}>
                  {
                    firstKey === index ?
                      <Button type="primary" loading={loadingDownload[1]} style={{ cursor: 'pointer', marginRight: 10 }} onClick={() => changeIds(item)}>{index}%</Button> :
                      <Button type="default" style={{ cursor: 'pointer' }} onClick={() => changeIds(item)}>{index}%</Button>
                  }
                </div>
              )
            })
          }
        </div>
      }
      <div className="print">
        <Button type="primary" loading={loadingDownload[1]} onClick={() => downloadPDF(1)}>下载</Button>
        {
          brandId === 9 &&
          <Button type="primary" onClick={DownloadExcel}>下载Excel</Button>
        }
      </div>
      <div>
        <iframe
          src={src}
          style={{ width: "100%", height: height }}
        />
      </div>
    </div>
  )
}

export default QuotationSummaryPdf