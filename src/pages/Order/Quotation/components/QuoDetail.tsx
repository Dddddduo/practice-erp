import React, { useEffect, useState } from 'react'
import { getReimListByOrderId, getQuoInfo } from '@/services/ant-design-pro/quotation'
import Quo from './Quo'
import Reim from './Reim'
import CreateSpecialOffers from "@/pages/Order/Quotation/components/CreateSpecialOffers";
import { getQtyMapList } from '@/services/ant-design-pro/reimbursement';

interface ItemListProps {
  brandList: any
  searchData: {
    markets: any
    cities: any
    shops: any
    maType: any
    secondQuotationType: any
    maCates: any
  }
  currentItem: any
  onCloseDetail: () => void
  success: (text: string) => void
  error: (text: string) => void
  actionRef: any
  onSearchSelectedChild: (type: string, field: string, data: []) => void
  onCloseCreateSpecialOffers: () => void
}

const QuoDetail: React.FC<ItemListProps> = ({
  brandList,
  searchData,
  currentItem,
  onCloseDetail,
  success,
  error,
  actionRef,
  onSearchSelectedChild,
  onCloseCreateSpecialOffers,
}) => {
  const [quo, setQuo] = useState()
  const [reim, setReim] = useState()
  const [costPrice, setCostPrice] = useState(0)
  const [specialQuo, setSpecialQuo] = useState(false)
  const [unit, setUnit] = useState([])

  const getData = async () => {
    const reimResponse = await getReimListByOrderId({ supplier_order_id: currentItem.order_supplier_id })
    setReim(reimResponse.data)
    setCostPrice(reimResponse.data.reim_total_price)
    const quoResponse = await getQuoInfo({ quotation_id: currentItem.id || currentItem.quo_id })
    if (quoResponse.data.quo_file_list.length > 0 && (typeof quoResponse.data.quo_detail_list === 'undefined' || quoResponse.data.quo_detail_list.length <= 0)) {
      setSpecialQuo(true)
    } else {
      setSpecialQuo(false)
    }
    setQuo(quoResponse.data)
  }

  // 获取数量单位
  const getQtyMap = async () => {
    const res = await getQtyMapList()
    setUnit(res.data)
  }

  useEffect(() => {
    getData()
    getQtyMap()
  }, [])

  return (
    <>
      {!specialQuo && <>
        <div>
          <div style={{ width: '48%', padding: 5, float: 'left' }}>
            <Quo
              quo={quo}
              costPrice={costPrice}
              onCloseDetail={onCloseDetail}
              currentItem={currentItem}
              success={success}
              error={error}
              actionRef={actionRef}
              unit={unit}
            />
          </div>
          <div style={{ width: '48%', borderLeft: '5px solid', float: 'left', paddingLeft: 20 }}>
            <Reim
              reim={reim}
              onCloseDetail={onCloseDetail}
              currentItem={currentItem}
              success={success}
              error={error}
              actionRef={actionRef}
              getData={getData}
              unit={unit}
            />
          </div>
        </div>
      </>}
      {
        specialQuo &&
        <>
          <CreateSpecialOffers
            brandList={brandList}
            searchData={searchData}
            onSearchSelectedChild={onSearchSelectedChild}
            success={success}
            error={error}
            actionRef={actionRef}
            currentItem={currentItem}
            onCloseCreateSpecialOffers={onCloseCreateSpecialOffers}
          />
        </>
      }
    </>
  )
}

export default QuoDetail
