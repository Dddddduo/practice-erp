import React, { useEffect, useState } from 'react'
import { Form, Button, Input, Image, TextArea, Card, Dialog, Toast } from 'antd-mobile';
import { updateReim, getReimInfo, getSameReimList } from '@/services/ant-design-pro/reimbursement';
import { useLocation } from "umi";
import { deleteReim, applyDeleteReim } from '@/services/ant-design-pro/mobile';

interface ItemListProps {

}

const ReimInfo: React.FC<ItemListProps> = () => {
  const [form] = Form.useForm()
  const location = useLocation();
  const [reimId, setReimId]: any = useState('')
  const [reimDetail, setReimDetail]: any = useState({})
  const [approveRemark, setApproveRemark] = useState('')
  const [deleteBtn, setDeleteBtn]: any = useState('')
  const [apply, setApply]: any = useState('')
  const [delOrder, setDelOrder]: any = useState('')
  const [sameReimList, setSameReimList] = useState([])
  // 根据参数名称获取具体的路由参数
  const queryParams = new URLSearchParams(location.search);
  const reimOperation = async (type) => {
    const statusParams = {
      status: type ?? '',
      reim_id: reimDetail?.id ?? '',
      remark: approveRemark ?? ''
    }
    console.log(statusParams);

    const res = await updateReim(statusParams)
    if (res.success) {
      window.location.reload();
    }
  }

  const inputApproveRemark = (e) => {
    setApproveRemark(e)
  }

  const delReim = () => {
    Dialog.confirm({
      content: '确定要删除吗？',
      onConfirm: async () => {
        deleteReim({ reim_id: reimId, del_order: delOrder }).then(res => {
          if (res.success) {
            Toast.show({
              icon: 'success',
              content: '删除成功',
              position: 'bottom',
              afterClose: () => {
                window.location.reload()
              }
            })
            return
          }
          Toast.show({
            icon: 'error',
            content: res.message,
            position: 'bottom',
          })
        })
      },
    })
  }

  const applyDelete = () => {
    Dialog.confirm({
      content: '确定要申请删除吗？',
      onConfirm: async () => {
        applyDeleteReim({ reim_id: reimId }).then(res => {
          res.success ?
            Toast.show({
              icon: 'success',
              content: '申请成功',
              position: 'bottom',
            }) :
            Toast.show({
              icon: 'error',
              content: res.message,
              position: 'bottom',
            })
        })
      }
    })
  }

  // const toReimDetail = (reim) => {
  //   const param = {
  //     source: reim.reim_id,
  //     delete_btn: deleteBtn,
  //     apply: 1
  //   }; // 要传递的参数
  //   const url = `
  //     ${window.location.origin}
  //     ${window.location.pathname}
  //     ?source=${param.source}
  //     &delete_btn=${param.delete_btn}
  //     &apply=${param.apply}
  //   `;
  //   window.open(url); // 重新加载当前页面并传递参数
  // }


  useEffect(() => {
    const source = queryParams.get('source');
    const delete_btn = queryParams.get('delete_btn');
    const apply = queryParams.get('apply')
    const del_order = queryParams.get('del_order')
    setReimId(source)
    setDeleteBtn(delete_btn)
    setApply(apply)
    setDelOrder(del_order)
    getReimInfo({ reim_id: source }).then((reimDetail: any) => {
      if (!reimDetail.success) {
        return
      }
      // console.log(reimDetail);
      setReimDetail(reimDetail.data)
      form.setFieldsValue({
        reim_no: reimDetail.data?.reim_no ?? '',
        create_at: reimDetail.data?.create_at ?? '',
        is_completed: Number(reimDetail.data?.is_completed) === 0 ? '否' : '是' ?? 0,
        completed_at: reimDetail.data?.completed_at ?? '',
        brand_en: reimDetail.data?.brand_en ?? '',
        city_cn: reimDetail.data?.city_cn ?? '',
        market_cn: reimDetail.data?.market_cn ?? '',
        store_cn: reimDetail.data?.store_cn ?? '',
        ma_type_cn: reimDetail.data?.ma_type_cn ?? '',
        ma_remark: reimDetail.data?.ma_remark ?? '',
        worker_price: reimDetail.data?.worker_price ?? '',
        leader_price: reimDetail.data?.leader_price ?? '',
        sub_total: reimDetail.data?.total_price ?? '',
        remark: reimDetail.data?.remark ?? '',
        approve_remark: reimDetail.data?.approve_remark ?? '',
        pre_quote_status: reimDetail.data?.pre_quote_status === 1 ? '是' : '否' ?? '',
        sign_file_list: reimDetail.data?.sign_file_list ?? [],
        bill_file_list: reimDetail.data?.bill_file_list ?? [],
        reim_detail_list: reimDetail.data?.reim_detail_list ?? [],
      })
    })

    // 获取相似报销单
    getSameReimList({ reim_id: source }).then(res => {
      // console.log(res.data.same_list);
      setSameReimList(res.data.same_list)
    })

  }, [])

  return (
    <>
      <Form
        form={form}
        footer={
          <div style={{ display: 'flex' }}>
            {
              reimDetail.status === 'create' &&
              <>
                <Button style={{ marginLeft: 10, marginRight: 10 }} block color='danger' size='middle' onClick={() => reimOperation('reject_submit')}>
                  驳回
                </Button>
                <Button style={{ marginLeft: 10, marginRight: 10 }} block color='success' size='middle' onClick={() => reimOperation('agree_submit')}>
                  通过
                </Button>
              </>
            }
            {
              reimDetail.status === 'agree_submit' &&
              <Button style={{ marginLeft: 10, marginRight: 10 }} block color="danger" size='middle' onClick={() => reimOperation('reject_submit')}>
                重新驳回
              </Button>
            }
            {
              reimDetail.status === 'reject_submit' &&
              <Button style={{ marginLeft: 10, marginRight: 10 }} block color="success" size='middle' onClick={() => reimOperation('agree_submit')}>
                重新通过
              </Button>
            }
            {
              reimDetail.id && deleteBtn === '1' &&
              <Button style={{ marginLeft: 10, marginRight: 10 }} block color="danger" size='middle' onClick={delReim}>
                删除
              </Button>
            }
            {
              reimDetail.id && apply === '1' &&
              <Button style={{ marginLeft: 10, marginRight: 10 }} block color="warning" size='middle' onClick={applyDelete}>
                申请删除
              </Button>
            }
          </div>
        }
      >
        <Form.Header>报销单详情</Form.Header>
        <Form.Item label="报销单编号" name="reim_no">
          <Input readOnly />
        </Form.Item>
        {
          sameReimList.length > 0 &&
          <Form.Item label="相似报销单编号">
            {
              sameReimList.map((item: any) => {
                console.log(item.reim_id);
                return (
                  <Card key={item.reim_id} >
                    <a href={`/mobile/reimInfo?source=${item.reim_id}&delete_btn=0&apply=0`}>
                      {item.reim_no}
                    </a>
                  </Card>
                )
              })
            }
          </Form.Item>
        }
        <Form.Item label="申请日期" name="create_at">
          <Input readOnly />
        </Form.Item>
        <Form.Item label="是否完工" name="is_completed">
          <Input readOnly />
        </Form.Item>
        {
          Number(reimDetail?.is_completed) === 1 &&
          <Form.Item label="完工日期" name="completed_at">
            <Input readOnly />
          </Form.Item>
        }
        <Form.Item label="品牌" name="brand_en">
          <Input readOnly />
        </Form.Item>

        <Form.Item label="城市" name="city_cn">
          <Input readOnly />
        </Form.Item>

        <Form.Item label="商场" name="market_cn">
          <Input readOnly />
        </Form.Item>
        <Form.Item label="店铺" name="store_cn">
          <Input readOnly />
        </Form.Item>

        <Form.Item label="工作类型" name="ma_type_cn">
          <Input readOnly />
        </Form.Item>

        <Form.Item label="工作内容" name="ma_remark">
          <Input readOnly />
        </Form.Item>

        <Form.Item label="明细" name="reim_detail_list">
          {
            reimDetail.reim_detail_list?.map(item =>
              <Card key={item.reim_detail_id}>
                <div style={{ border: '1px solid #eee' }}>
                  <Form.Item label="明细">
                    <Input readOnly defaultValue={item.detail} />
                  </Form.Item>
                  <Form.Item label="数量">
                    <Input readOnly defaultValue={item.num + item.unit} />
                  </Form.Item>
                  <Form.Item label="单价">
                    <Input readOnly defaultValue={item.price} />
                  </Form.Item>
                  <Form.Item label="小计">
                    <Input readOnly defaultValue={item.total_price} />
                  </Form.Item>
                  <Form.Item label="备注">
                    <Input readOnly defaultValue={item.remark} />
                  </Form.Item>
                  <Form.Item label="合作工人">
                    <Input readOnly defaultValue={item.worker} />
                  </Form.Item>
                  <Form.Item label="费用类别">
                    <Input readOnly defaultValue={
                      item.detail === ('企业滴滴' || '企业货拉拉') ?
                        item.detail :
                        item.reim_type === 'material_fee' ? '材料费' : '人工费'
                    } />
                  </Form.Item>
                </div>
              </Card>
            )
          }
        </Form.Item>

        <Form.Item label="工人费用" name="worker_price">
          <Input readOnly />
        </Form.Item>

        <Form.Item label="负责人费用" name="leader_price">
          <Input readOnly />
        </Form.Item>

        <Form.Item label="总费用" name="sub_total">
          <Input readOnly />
        </Form.Item>

        <Form.Item label="签收单" name="sign_file_list">
          {
            reimDetail.sign_file_list?.map(item => <Image key={item.id} lazy src={item.file_url_thumb} />)
          }
        </Form.Item>

        <Form.Item label="发票或收据" name="bill_file_list">
          {
            reimDetail.bill_file_list?.map(item => <Image key={item.id} lazy src={item.file_url_thumb} />)
          }
        </Form.Item>

        <Form.Item label="备注" name="remark">
          <TextArea readOnly />
        </Form.Item>

        <Form.Item label="审核意见" name="approve_remark">
          <TextArea placeholder='请输入审核意见' style={{ borderBottom: '1px solid #eee' }} onChange={inputApproveRemark} />
        </Form.Item>
        <Form.Item label="是否预报价" name="pre_quote_status">
          <Input readOnly />
        </Form.Item>
      </Form>
    </>
  )
}

export default ReimInfo