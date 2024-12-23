import React, { useState, useEffect } from 'react'
import { Button, Card, InfiniteScroll, Popup } from 'antd-mobile'
import { getReimList } from '@/services/ant-design-pro/reimbursement';
import { history } from '@umijs/max';
import { useLocation } from "umi";
import ReimFilter from './components/ReimFilter';

const ReimList: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const delete_btn = queryParams.get('delete_btn') ?? 0;
  const reimStatus = queryParams.get('status') ?? '';
  const brand_id = queryParams.get('brand_id') ?? '';

  const [reimParams, setReimParmas] = useState({})
  const [reimList, setReimList]: any = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [showFilterPopup, setShowFilterPopup] = useState(false)
  const [deleteBtn, setDeleteBtn]: any = useState(0)
  const [status, setStatus]: any = useState('wait')
  const [brandId, setBrandId]: any = useState()

  // const getReimListInfo = async ({ current, pageSize, ...params }) => {
  //   const customParams = {
  //     page: current,
  //     page_size: pageSize,
  //     user_type: 'brand_admin',
  //     reim_status: params['reimStatus'] ?? status, // 状态
  //     city_id: params['cityId'] ?? '',
  //     market_id: params['marketId'] ?? '',
  //     store_id: params['storeId'] ?? '',
  //     brand_id: params['brandId'] ?? '',
  //   };

  //   const res = await getReimList(customParams)
  //   setReimList(res.data.list)
  // }

  const loadMore = async () => {
    console.log('loadMore');
    
    setPage(page + 1)
    const customParams = {
      page: page,
      page_size: 20,
      user_type: 'brand_admin',
      reim_status: reimParams['reimStatus'] ?? reimStatus, // 状态
      city_id: reimParams['cityId'] ?? '',
      market_id: reimParams['marketId'] ?? '',
      store_id: reimParams['storeId'] ?? '',
      brand_id: reimParams['brandId'] ?? brand_id,
    };
    const { data } = await getReimList(customParams)
    setHasMore(data.list.length > 1)
    setReimList([...reimList, ...data.list])
  }

  const toReimDetail = (item) => {
    console.log(item.id);
    history.push(`/mobile/reimInfo?source=${item.id}&delete_btn=${deleteBtn}&apply=1`)
  }

  const showFilter = () => {
    setShowFilterPopup(true)
  }

  const closeFilterPopup = async (params) => {
    setShowFilterPopup(false)
    setPage(1)
    setReimParmas(params)
    if (params !== reimParams) {
      setReimList([])
    }
    // loadMore()
    // getReimListInfo({current: 1, pageSize: 20, ...params })
  }

  useEffect(() => {
    setDeleteBtn(delete_btn)
    setStatus(reimStatus)
    setReimParmas({...reimParams, reimStatus, brandId: brand_id})
    setBrandId(brand_id)
    
    console.log('useEffect');
    
    // getReimListInfo({ current: 1, pageSize: 20 })
  }, [])

  return (
    <div style={{ padding: 10 }}>
      <Button block color='primary' size='middle' onClick={showFilter}>筛选</Button>
      {
        reimList?.map(item =>
          <Card
            key={item.id}
            title={
              <div>{item.reim_no}</div>
            }
            style={{ background: '#eee', borderRadius: '10px', margin: '10px 0' }}
          >
            <div onClick={() => toReimDetail(item)}>
              <p><span style={{display: 'inline-block', width: 70}}>申请人：</span>{item.leader_name}</p>
              <p><span style={{display: 'inline-block', width: 70}}>状态：</span>{item.reim_status_value}</p>
              <p><span style={{display: 'inline-block', width: 70}}>申请日期：</span>{item.create_at}</p>
              <p><span style={{display: 'inline-block', width: 70}}>品牌：</span>{item.brand_en}</p>
              <p><span style={{display: 'inline-block', width: 70}}>城市：</span>{item.city_cn}</p>
              <p><span style={{display: 'inline-block', width: 70}}>商场：</span>{item.market_cn}</p>
              <p><span style={{display: 'inline-block', width: 70}}>店铺：</span>{item.store_cn}</p>
              <p><span style={{display: 'inline-block', width: 70}}>维修类型：</span>{item.ma_type_cn}</p>
            </div>
          </Card>
        )
      }
      <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
      <Popup
        visible={showFilterPopup}
        onClose={closeFilterPopup}
        position='right'
        bodyStyle={{ width: '80vw' }}
        destroyOnClose={true}
      >
        <ReimFilter
          closeFilterPopup={closeFilterPopup}
          reimParams={reimParams}
        />
      </Popup>
    </div>
  )
}

export default ReimList