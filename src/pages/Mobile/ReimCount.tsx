import React, { useEffect, useState } from "react";
import { getReimCount } from "@/services/ant-design-pro/mobile";
import { List } from "antd-mobile";
import { history } from '@umijs/max';

const ReimCount: React.FC = () => {

  const [brandList, setBrandList]: any = useState([])

  const toReimList = (reim) => {
    history.push(`/mobile/reimList?status=wait&brand_id=${reim.brand_id}`)
  }

  useEffect(() => {
    getReimCount({ query_type: 'count_and_list' }).then(res => {
      setBrandList(res.data.brand_list)
    })
  }, [])
  return (
    <>
      <List header='未处理报销单数量' mode="card">
        {
          brandList.map(item =>
            <List.Item key={item.brand_id} extra={item.count_num} onClick={() => toReimList(item)} >
              {item.brand_en}
            </List.Item>
          )
        }

      </List>
    </>
  )
}

export default ReimCount