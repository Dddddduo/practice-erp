import React, { RefObject, useEffect, useState } from "react";
import type { ActionType } from "@ant-design/pro-components";
import { FormattedMessage, useIntl } from "@@/exports";
import { users, fullMenus, indexUsersMenu, updateUsersMenus } from "@/services/ant-design-pro/accessControl";
import { Checkbox, Space, Button, Select } from "antd";

interface ItemListProps {
  actionRef: RefObject<ActionType>;
  success: (text: string) => void
  error: (text: string) => void
  handleCloseBind: () => void
}

const MenuBindUsers: React.FC<ItemListProps> = ({
  actionRef,
  success,
  error,
  handleCloseBind,
}) => {
  const intl = useIntl()
  const [treeData, setTreeData] = useState<{ id: number, children: [] }[]>([])
  const [treeId, setTreeId] = useState()
  const [secondTree, setSecondTree] = useState<{ id: number, children: [] }[]>([])
  const [secondTreeId, setSecondTreeId] = useState()
  const [showsecondTree, setShowSecondTree] = useState(false)
  const [threeTree, setThreeTree] = useState([])
  const [showthreeTree, setShowThreeTree] = useState(false)
  const [userList, setUserList] = useState<{ id: number, username: string, checked: boolean }[]>([])
  const [userIds, setUserIds] = useState([])
  const [menuId, setMenuId] = useState()

  const submitBind = () => {
    console.log(userIds);
    const params = {
      user_ids: userIds,
      menu_ids: [menuId]
    }
    updateUsersMenus(params).then(res => {
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
    setUserIds([...userIds, item.id])
  }

  const getUserById = (menuId) => {
    indexUsersMenu(menuId).then(res => {
      if (res.success) {
        setUserIds(res.data.map(item => item.id))
        const format = userList.map(item => {
          item.checked = false
          res.data.map(value => {
            if (item.id === value.id) {
              item.checked = true
            }
            return item
          })
          return item
        })
        setUserList(format)
      }
    })
  }

  const handleChange = (e) => {
    if (!e) {
      setSecondTree([])
      setThreeTree([])
      setShowSecondTree(false)
      setShowThreeTree(false)
      const format = userList.map(item => {
        item.checked = false
        return item
      })
      setUserList(format)
    }
    setMenuId(e)
    treeData.map(item => {
      if (item.id === e) {
        setSecondTree(item.children)
        if (item.children.length > 0) {
          setShowSecondTree(true)
        }
      }
    })
    setTreeId(e)
    getUserById(e)
  }

  const handleChangeSecond = (e) => {
    if (!e) {
      setMenuId(treeId)
      getUserById(treeId)
      setThreeTree([])
      setShowSecondTree(false)
      return
    }
    setMenuId(e)
    setSecondTreeId(e)
    secondTree.map(item => {
      if (item.id === e) {
        setThreeTree(item.children)
        if (item.children.length > 0) {
          setShowThreeTree(true)
        }
      }
    })
    getUserById(e)
    setSecondTreeId(e)
  }

  const handleChangeThree = (e) => {
    if (!e) {
      setMenuId(secondTreeId)
      getUserById(secondTreeId)
      setShowThreeTree(false)
    }
    getUserById(e)
    setMenuId(e)
  }

  useEffect(() => {
    users().then(res => {
      if (res.success) {
        res.data.map(item => {
          item.checked = false
        })
        setUserList(res.data)
      }
    })
    fullMenus().then(res => {
      if (res.success) {
        setTreeData(res.data)
      }
    })
  }, [])

  return (
    <>
      <Space>
        <Select
          allowClear
          style={{ width: 300 }}
          options={treeData}
          onChange={handleChange}
          fieldNames={{ label: 'name', value: 'id' }}
        />
        {
          showsecondTree &&
          <Select
            allowClear
            style={{ width: 300 }}
            options={secondTree}
            onChange={handleChangeSecond}
            fieldNames={{ label: 'name', value: 'id' }}
          />
        }
        {
          showthreeTree &&
          <Select
            allowClear
            style={{ width: 300 }}
            options={threeTree}
            onChange={handleChangeThree}
            fieldNames={{ label: 'name', value: 'id' }}
          />
        }
      </Space>
      <div style={{ display: 'flex', flexWrap: 'wrap', margin: 20 }}>
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
      <Button type="primary" onClick={submitBind}>提交</Button>
    </>
  )
}

export default MenuBindUsers
