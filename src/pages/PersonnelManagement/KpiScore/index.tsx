import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Input, message, Modal } from 'antd';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { getEmployee } from '@/services/ant-design-pro/system';
import { getKpiTableInfo, getKpiInfo, submitKpi } from '@/services/ant-design-pro/kpi';
import * as math from 'mathjs';
import './KpiAssessment.css';
import { createPdfFilePlus } from '@/services/ant-design-pro/api';
import { downloadFile } from '@/utils/utils';
import { getFileOssUrl } from '@/services/ant-design-pro/pdf';
import PollingButton from "@/components/Buttons/PollingButton";
import { isEmpty } from 'lodash';

const KpiAssessment = ({ kpiTableId }) => {
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState({ name: '', department_name: [] });
  const [addParams, setAddParams] = useState({ kpi_item_list: [], desc: '', comment: '' });
  const [totalScore, setTotalScore] = useState(0);
  const [year, setYear] = useState('');
  const [quarter, setQuarter] = useState('');
  const [loading, setLoading] = useState(false);
  const [readonly, setReadonly] = useState(false); // Assuming you determine this based on some condition
  const [resultModal, setResultModal] = useState(false)
  const [kpiInfo, setKpiInfo] = useState({ level: '', level_cn: '', score: 0, id: 0 })
  const [scorer, setScorer] = useState<string>('')
  const queryParams = new URLSearchParams(location.search);

  // 初始化员工信息
  const initEmployee = async (eid) => {
    const result = await getEmployee({ id: eid })
    if (result.success) {
      setEmployee(result.data)
    }
  }

  const quarterCn = (q) => {
    const quarterMap = { Q1: '第一季度', Q2: '第二季度', Q3: '第三季度', Q4: '第四季度' }
    return quarterMap[q] ? quarterMap[q] : ''
  }

  const departments = (ds) => {
    return ds.join('|')
  }

  // @ts-ignore
  useEffect(async () => {
    document.title = 'KPI 打分项';
    const kpiId = queryParams.get('kpi_id');
    const kpiTableId = queryParams.get('kpi_table_id');
    const eid = queryParams.get('eid') ?? '';
    if (kpiId) {
      const result = await getKpiInfo({ kpi_id: kpiId });
      if (result.success) {
        setReadonly(true)
        setYear(result.data.year)
        setQuarter(result.data.quarter)
        setScorer(result.data.e_name)
        await initEmployee(result.data.kpi_eid)
        setAddParams(result.data.kpi_info)
        setKpiInfo({
          id: result.data.id,
          score: result.data.score,
          level: result.data.level,
          level_cn: result.data.level_cn
        })
        setTotalScore(result.data.score)
      }
    } else {
      await initEmployee(eid)
      setYear(queryParams.get('year') ?? '')
      setQuarter(queryParams.get('quarter') ?? '')
      const results = await getKpiTableInfo({ kpi_table_id: kpiTableId, year: queryParams.get('year') ?? '', quarter: queryParams.get('quarter') ?? '', kpi_eid: eid })
      if (results.data) {
        const addParams = results.data
        // @ts-ignore
        setAddParams(addParams);
        if (results.data.score) {
          setTotalScore(results.data.score)
        }
      }
    }
  }, []);

  // 输入分数
  const inputScore = (val, item, idx, k) => {
    const newKpiItemList = [...addParams.kpi_item_list];
    let score = 0
    if (!isNaN(Number(val))) {
      score = Number(val) > 100 ? 100 : Number(val)
    } else {
      return
    }
    newKpiItemList[idx].info[k].score = score;
    newKpiItemList[idx].info[k].score2 = math.chain(score).multiply(item.weight).round(1).done();
    setAddParams({ ...addParams, kpi_item_list: newKpiItemList });
    let currentTotalScore = 0
    newKpiItemList.map((item, idx) => {
      item.info.map((value, idx) => {
        if (typeof value.score !== 'undefined' && !isNaN(value.score)) {
          currentTotalScore = math.chain(currentTotalScore).add(value.score2).round(1).done()
        }
      })
    })
    setTotalScore(currentTotalScore)
  };

  const savePDF = async () => {
    const requestData = {
      single_pdf: [
        { pdf_info: { kpi_id: kpiInfo.id }, pdf_type: 'hr_kpi' },
      ]
    }
    const result = await createPdfFilePlus(requestData)
    // if (result.success) {
    //   downloadPdfFile(result.data)
    // }
    return result.data
  };

  const downloadPdfFile = async (token) => {
    if (token === '') {
      return
    }

    const result = await getFileOssUrl({ download_token: token })
    if (result?.success && !isEmpty(result?.data)) {
      setLoading(true)
      await downloadFile(
        result.data.replace("http:", "https:"),
        employee.name + '.pdf'
      );
    }

    // getFileOssUrl({ download_token: token }).then((ossResult) => {
    //   if (ossResult.success && typeof ossResult.data !== 'undefined') {
    //     setLoading(true)
    //     downloadFile(ossResult.data, employee.name + '.pdf')
    //   } else {
    //     setTimeout(() => {
    //       downloadPdfFile(token)
    //     }, 1000)
    //   }
    // })
    return
  }

  const changeWeight = (value) => {
    return math.chain(value).multiply(100).round(2).done() + '%'
  }

  const setResultSuccess = () => {
    navigate('/personnelManagement/kpiScore?kpi_id=' + kpiInfo.id, { replace: true })
    setResultModal(false)
    setReadonly(true)
  }

  const inputComment = (e) => {
    setAddParams({ ...addParams, comment: e.target.value });
  }

  // 提交
  const submit = async () => {
    const params = {
      kpi_table_id: queryParams.get('kpi_table_id'),
      kpi_eid: queryParams.get('eid'),
      year: year,
      quarter: quarter,
      score: parseInt(totalScore.toFixed(1)),
      kpi_info: addParams
    }
    const result = await submitKpi(params)
    if (result.success) {
      const kpiInfoResult = await getKpiInfo({ kpi_id: result.data })
      setResultModal(true)
      setKpiInfo(kpiInfoResult.data)
    } else {
      message.error('保存失败');
    }
  };

  return (
    <>
      <div className="app-container jobtyp-container">
        {totalScore > 0 && !readonly && (
          <div className="show-total-score">
            总分: <span style={{ color: 'red' }}>{totalScore}</span>
          </div>
        )}
        {readonly && (
          <div className="print" style={{ textAlign: 'center', marginBottom: '2px', zIndex: '9999' }}>
            <PollingButton
              type="primary"
              beforeRequest={savePDF}
              requestHandle={(token) => downloadPdfFile(token)}
              maxPollingTime={600}
              stopPolling={loading}
              changeOutStatus={() => {
                setLoading(false)
              }}
            >
              下载
            </PollingButton>
          </div>
        )}
        <div className="print_score">
          <Card id="kpi-score">
            <h2 style={{ textAlign: 'center', fontWeight: 'bold' }}>{year}年{quarterCn(quarter)}绩效考核</h2>
            <h3 style={{ textAlign: 'center' }}>被考核对象：{employee.name}</h3>
            <h3 style={{ textAlign: 'center' }}>所属部门: {departments(employee.department_name)}</h3>
            {
              scorer && <h3 style={{ textAlign: 'center' }}>打分人: {scorer}</h3>
            }
            <pre>说明：{addParams.desc}</pre>
            {
              readonly &&
              <>
                <h3 style={{ textAlign: 'left' }}>分数：{totalScore}</h3>
                <h3 style={{ textAlign: 'left' }}>等级：{kpiInfo.level} ({kpiInfo.level_cn})</h3>
              </>
            }
            {addParams.kpi_item_list.map((item, idx) => (
              <Row key={idx}>
                <Col span={24}>
                  <h3>{item.item + '(' + item.score + ')分'}</h3>
                  {item.info && item.info.map((v, k) => (
                    <Row key={k}>
                      <Col span={24}>
                        <div>
                          <h4>(权重{changeWeight(v.weight)}) {v.score_index}:</h4>
                          <div>{v.content}</div>
                          {
                            readonly &&
                            <>
                              <div className={"readonly-score-partition"}>
                                {
                                  readonly && <div style={{ float: 'left' }}>打分</div>
                                }
                                <Input
                                  value={v.score}
                                  style={{ width: '14vw', marginRight: '2vw' }}
                                  placeholder=""
                                  onChange={(e) => inputScore(e.target.value, v, idx, k)}
                                  readOnly={readonly}
                                />
                                {
                                  readonly && <div style={{ float: 'left' }}>得分</div>
                                }
                                <Input
                                  value={v.score2}
                                  style={{ width: '14vw' }}
                                  placeholder=""
                                  readOnly={true}
                                />
                              </div>
                            </>
                          }
                          {
                            !readonly &&
                            <>
                              <div className={"score-partition"}>
                                <Input
                                  value={v.score}
                                  style={{ minWidth: '20vw', marginRight: '2vw' }}
                                  placeholder="请打分(满分100)"
                                  onChange={(e) => inputScore(e.target.value, v, idx, k)}
                                  readOnly={readonly}
                                />
                                <Input
                                  value={v.score2}
                                  style={{ minWidth: '20vw' }}
                                  placeholder="得分"
                                  readOnly={true}
                                />
                              </div>
                            </>
                          }
                        </div>
                      </Col>
                    </Row>
                  ))}
                </Col>
              </Row>
            ))}
            <h3>评语</h3>
            {
              !readonly &&
              <Input.TextArea value={addParams.comment} onInput={inputComment} placeholder={""} rows={2} />
            }
            {
              readonly &&
              <div style={{ textAlign: 'left', textIndent: '1.67em' }}>{addParams.comment}</div>
            }
            {
              !readonly && <Button style={{ marginTop: '10px' }} type="primary" onClick={submit}>提交</Button>
            }
          </Card>
        </div>
      </div>

      <Modal
        open={resultModal}
        onCancel={() => setResultModal(false)}
        destroyOnClose
        maskClosable={false}
        footer={[
        ]}
      >
        <div style={{ textAlign: 'center', fontSize: '18px', fontWeight: 'bold' }}>绩效考核</div>
        <div style={{ textAlign: 'center', marginTop: '20px' }}>{kpiInfo.level}-{kpiInfo.score}分 ({kpiInfo.level_cn})</div>
        <div style={{ margin: '10px auto', width: '100px' }}>
          <Button style={{ width: '100px' }} type={"primary"} onClick={setResultSuccess}>确认</Button>
        </div>
      </Modal>
    </>
  );
};

export default KpiAssessment;

