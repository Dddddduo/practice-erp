import { text } from "express"
import ItemList from "./ItemList"
import { useEffect, useState } from 'react'
import { Button } from "antd"
import { message } from "antd"
import { createPdfFile, getFileOssUrl } from "@/services/ant-design-pro/quotation"
import { parsePdfPath } from "@/utils/utils"
import { useLocation } from "umi";
import { isEmpty } from "lodash"

interface ItemListProps {
    currentMsg
}

const ViewSystem: React.FC<ItemListProps> = ({
    currentMsg
}) => {

    const [src, setSrc] = useState('')
    const [loadings, setLoadings] = useState<boolean[]>([]);
    const location = useLocation();
    // const [loading, setLoading] = useState(false)
    const queryParams = new URLSearchParams(location.search);

    useEffect(() => {
        if (currentMsg && currentMsg.contract_file_url_enough) {
            setSrc(currentMsg.contract_file_url_enough)
        }
    }, [currentMsg])

    const download = (e, index) => {
        const report_title = queryParams.get('report_title');
        if (!isEmpty(loadings)) {
            message.error('正在下载中，请耐心等待')
            return false
        }
        message.success('提交下载成功，请耐心等待')

        setLoadings((prevLoadings) => {
            const newLoadings = [...prevLoadings];
            newLoadings[index] = true;
            return newLoadings;
        });

        createPdfFile({ 'pdf_type': 'worker_contract', pdf_info: { file_id: e.file_id } }).then((res) => {
            if (!res.success) {
                message.error(res.data.msg ? res.data.msg : '系统异常请稍后重试')
                return false
            }
            const timer = setInterval(async () => {
                await getFileOssUrl({ download_token: res.data }).then((ossResult) => {
                    if (ossResult.data) {
                        //downloadFile(ossResult.data.data, this.$route.query.report_title)
                        const fileUrl = ossResult.data.replace('http://zhian-erp-files.oss-cn-shanghai.aliyuncs.com/', '')
                        parsePdfPath(fileUrl, report_title)
                        setLoadings((prevLoadings) => {
                            const newLoadings = [...prevLoadings];
                            newLoadings[index] = false;
                            return newLoadings;
                        });
                        clearInterval(timer)
                    }
                })
                if (!isEmpty(loadings)) {
                    return false
                }
            }, 1000)
        })
    }
    return (
        <>
            <div style={{ marginLeft: 750 }} >
                <img src="http://erp.huyudev.com/static/img/zhian-logo.57533e44.jpeg" alt="" style={{ width: 200 }} />
            </div>
            <div style={{ textAlign: "center", paddingLeft: 100, paddingRight: 100, fontSize: 12 }}>
                <h2>服务规范协议</h2>
                <p>感谢服务人员相信并选择为上海置安提供服务，上海置安尊重并保护所有用户的个人隐私及身份信息安全。在施工前也请服务人员认真阅读以下注意事项，并签字确认同意遵守。</p>
                <div style={{ textAlign: "left" }}>
                    <h4>一. 服务人员禁止从事以下行为：</h4>
                    <p>1.1 不遵守当地施工防疫要求或提供虚假信息办理施工证件等行为；</p>
                    <p>1.2 未经我司事先书面同意，临时更换施工人员或者变更施工时间，或私自上门检查等行为；</p>
                    <p>1.3 使用不恰当语言或行为侮辱.骚扰恐吓店铺员工或商场工作人员的行为；</p>
                    <p>1.4 在店铺抽烟（含电子烟），吃东西，嚼口香糖，看书报等行为；</p>
                    <p>1.5 酒后去店铺服务，或在店铺维修过程中饮酒等行为；</p>
                    <p>1.6 在店铺大声哼唱歌曲，吹口哨，谈笑，喧哗等行为；</p>
                    <p>1.7 衣着不整，及违反公序良俗的其他行为；</p>
                    <p>1.8 存在或可能产生侵害我方的企业声誉，信用等各项合法权利的不利行为；</p>
                    <p>1.9利用我司进行私下谋利及投机，发布传送传播广告信息等行为；</p>
                    <p>1.10 任何犯罪行为及与犯罪有关的行为；</p>
                    <p>1.11 施工时未按国家建筑施工安全防护规范进行自我防护（安全用梯，安全带等）；</p>
                    <p>1.12 虚构事实，自行假冒店铺人员签署完工签单或实际施工人数与签单不符等行为；</p>
                    <p>1.13 盗窃店铺商品及任何物品，随意使用或拿取店铺内的任何物品；</p>
                    <p>1.14 以任何方式打探或窃取我方商业机密的行为；</p>
                    <p>1.15 以任何方式泄露店铺图纸、环境照片以及其他侵权上海置安、品牌商业机密的信息的行为；</p>
                </div>
                <div style={{ textAlign: "left" }}>
                    <h3>二. 服务人员承诺：</h3>
                    <p>2.1 施工时严格按照国家建筑施工安全防护规范等相关规定，充分进行自我防护（高空作业需要安全用梯，安全带等）；</p>
                    <p>2.2 工作前需进行店铺商品保护，避免商品受到水渍或者灰尘或者油漆涂料等污染；</p>
                    <p>2.3 具备相关职业证件，持证上岗，比如电工工作需具备电工证，空调维修需具备制冷证；</p>
                    <p>2.4 施工后将施工垃圾带出店铺送至商场指定垃圾清理处，梯子归位，保持店铺整洁；</p>
                    <p>2.5 与店铺员工及商场相关人员保持礼貌友好沟通态度；</p>
                </div>
                <div style={{ textAlign: "left" }}>
                    <h3>三. 违约责任</h3>
                    <p>3.1服务人员违反本协议任意一条约定，我司有权立即单方终止与服务人员之间的全部合作，并对此不承担任何违约责任。同时我司有权要求服务人员退还其已收到的全部款项，且服务人员还应赔偿甲方的全部经济损失，包括但不限于：律师费、诉讼费、差旅费、公正费、调查取证费、所有损失或损害等；</p>
                    <p>3.2如服务人员盗用他人身份信息、或散播虚假信息、或采取其他不正当手段谋利的，一旦查实，我司有权立即单方终止与服务人员之间的全部合作，并对此不承担任何违约责任。同时我司有权要求服务人员退还其已收到的全部款项，且服务人员还应赔偿甲方的全部经济损失，包括但不限于：律师费、诉讼费、差旅费、公正费、调查取证费、所有损失或损害等。</p>
                    <p>3.3 如服务人员的行为使我方/或关联公司遭受第三方主张权利，我方及/或关联公司可在对第三方人承担相应违约责任后，就前述全部违约责任向服务人员追偿；</p>
                </div>
                <div style={{ textAlign: "left" }}>
                    <h3>四．工作服务需求</h3>
                    <p>4.1 接到维修通知，及时提供上门时间，按照要求到店铺勘察检修；</p>
                    <p>4.2 到店铺后，在卖场门口征得店铺同意方可进店，并由店铺通知维修主管与店铺维修主管沟通需维修事项，同时在主管陪同下检修，检查店铺设施，协商维修时间。店铺要求时间内不能完成工作必须及时反馈；</p>
                    <p>4.3灰尘，大件，噪音，异味，动火，线路检修等工作必须晚上施工，提供相关特种证件，必须远离货品，家具，物品等，同时必须做物品保护，施工后清理工作；</p>
                    <p>4.4 需采购维修材料及配件，先反馈负责人确定后再采购，订做物品需要提供订做周期；</p>
                    <p>4.5 确定维修时间，维修时长，反馈负责人；</p>
                    <p>4.6 夜间施工必须按照店铺要求提供相应资料，工具出入按照商场要求办理相关手续。</p>
                    <p>4.7 进入店铺无人区，如后仓，外仓，办公区必须征得店铺同意或陪同；</p>
                    <p>4.8 施工需求如有有需要挪动货品必须由店铺人员操作，如需协助必须拍照留底，移动物品时佩戴干净手套；</p>
                    <p>4.9 工作完成后必须与店铺值班人员巡检维修事项，得到肯定再签单，签单必须实名制，日期，人名，施工时间；</p>
                    <p>4.10 施工完成后撤场必须巡检店铺检查是否遗漏工具或其他物品，检查施工区域是否恢复原状。必须带走施工所产生的垃圾及边角料，在卖场大门处监控下让值班人员检查携带工具包，无问题方可离店；</p>
                </div>
                <div style={{ textAlign: "left" }}>
                    <h3>五．举报或投诉</h3>
                    <p>如果服务人员对本协议有任何疑问，或者在施工过程中想投诉或举报，请致电：+86 021-61911156（周一至周五 10：00-18：30）</p>
                </div>
                <div style={{ textAlign: "left" }}>
                    <p>六．其他</p>
                    <p>本协议签订地为中华人民共和国上海市，因本协议生效.履行.解释服务而产生的一切相关争议均适用于中华人民共和国法律。服务人员与上海置安发生的一切争议，应友好协商，如协商不成的，双方均可向上海仲裁委员会提起仲裁。</p>
                    <p>双方确认，已经仔细审阅并完全理解本协议全部条款的内容和其法律含义，并本协议由甲方盖章和乙方签字/盖章后生效。</p>
                </div>
                <div style={{ textAlign: "left" }}>
                    <img src="http://erp.huyudev.com/static/img/zhian-seal.66e2d734.png" alt="" style={{ width: 150 }} />
                    <img src={src} alt="" style={{ width: 150, marginLeft: 100 }} />
                </div>
                <div>
                    <Button type="primary" loading={loadings[1]} onClick={(e) => download(e, 1)}>下载</Button>
                </div>
            </div>

        </>
    )
}
export default ViewSystem