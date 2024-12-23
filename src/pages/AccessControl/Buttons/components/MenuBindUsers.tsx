import React, { RefObject, useEffect, useState } from "react";
import type { ActionType } from "@ant-design/pro-components";
import { users, assignButton, assignList } from "@/services/ant-design-pro/accessControl";
import { Checkbox, Button } from "antd";
import { includes } from "lodash";

interface ItemListProps {
  actionRef: RefObject<ActionType>;
  success: (text: string) => void
  error: (text: string) => void
  handleCloseBind: () => void
  btnId: number
}

const MenuBindUsers: React.FC<ItemListProps> = ({
  actionRef,
  success,
  error,
  handleCloseBind,
  btnId,
}) => {
  const [userList, setUserList] = useState<{ id: number, username: string, checked: boolean }[]>([])

  const submitBind = (btnId: number) => {

    const userIds = userList.map(item => {
      console.log(item.checked)
      if (item.checked) {
        return item.id
      }
    }).filter(id => id !== undefined) // 返回满足回调函数中指定条件的数组元素

    console.log('新userIds <------', userIds);

    const params = {
      user_ids: userIds,
    }

    assignButton(btnId, params).then(res => {
      if (res.success) {
        handleCloseBind()
        actionRef.current?.reload()
        success('绑定成功')
        return
      }
      error(res.message)
    })
  }

  const handleChangeChecked = (item) => {
    const format = userList.map(value => {
      if (value.id === item.id) {
        value.checked = !value.checked
        return value
      }
      return value
    })

    setUserList(format)
  }

  useEffect(() => {
    // 获取了promise对象，同步获取，留作下面用
    const allUsers = users().then(r => {
      return r.data
    })

    console.log('获取所有users', allUsers)

    assignList(btnId).then(res => {
      if (res.success) {

        console.log('打印res <---------------', res.data)

        // map返回一个新数组
        const ids = res.data.map(item => {
          return item.user_id;
        })

        console.log('打印选中的ids', ids)

        allUsers.then(r => {
          const checkUsers = r.map(item => {
            return { id: item.id, username: item.username, checked: includes(ids, item.id) }
          })
          setUserList(checkUsers)
        })
      }
    })
  }, [])



  return (
    <>
      <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: 10 }}>
        {
          userList.map(item => {
            return (
              <div key={item.id} style={{ width: 120, marginBottom: 10 }}>
                <Checkbox checked={item.checked} onChange={() => handleChangeChecked(item)}>{item.username}</Checkbox>
              </div>
            )
          })
        }
      </div>
      <Button type="primary" onClick={() => submitBind(btnId)}>提交</Button>
    </>
  )
}

export default MenuBindUsers