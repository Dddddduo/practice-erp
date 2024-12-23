import React, { RefObject, useEffect, useState } from "react";
import type { ActionType } from "@ant-design/pro-components";
import { FormattedMessage, useIntl } from "@@/exports";
import { Button, Select, Tree } from "antd";
import { users, fullMenus, updateUsersMenus, indexMenusUser } from "@/services/ant-design-pro/accessControl";
import { isEmpty } from "lodash";

interface ItemListProps {
  actionRef: RefObject<ActionType>;
  success: (text: string) => void
  error: (text: string) => void
  handleCloseBind: () => void
}

const UserBindMenus: React.FC<ItemListProps> = ({
  actionRef,
  success,
  error,
  handleCloseBind,
}) => {
  const intl = useIntl()
  const [userList, setUserList] = useState([])
  const [treeData, setTreeData] = useState([])
  // const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const [selectUser, setSelectUser] = useState([])
  const [checkedKeys, setCheckedKeys] = useState<number[]>([]);
  const [hrefCheckedKeys, setHrefCheckedKeys] = useState<number[]>([]);
  const [parents, setParents] = useState([])

  const extractIds = (data) => {
    let hrefIds: any = []
    let childrenIds: any = []
    for (const oneItem in data) {
      hrefIds.push(data[oneItem].id)
      for (const twoItem in data[oneItem].children) {
        if (isEmpty(data[oneItem].children[twoItem].children)) {
          childrenIds.push(data[oneItem].children[twoItem].id)
        } else {
          hrefIds.push(data[oneItem].children[twoItem].id)
          for (const threeItem in data[oneItem].children[twoItem].children) {
            childrenIds.push(data[oneItem].children[twoItem].children[threeItem].id)
          }
        }
      }
    }
    return {
      hrefIds,
      childrenIds,
    };
  }

  const handleChange = (e) => {
    setSelectUser(e)
    indexMenusUser(e).then(res => {
      if (res.success) {
        const { hrefIds, childrenIds } = extractIds(res.data)
        setCheckedKeys(childrenIds)
        setHrefCheckedKeys(hrefIds)
      }
    })
  }

  const handleCheck = (checkedKeysValue, e) => {
    setCheckedKeys(checkedKeysValue)
    setParents(e.halfCheckedKeys)
  }

  const submitBind = () => {
    updateUsersMenus({ user_ids: [selectUser], menu_ids: [...parents, ...checkedKeys] }).then(res => {
      if (res.success) {
        handleCloseBind()
        actionRef.current?.reload()
        success('绑定成功')
        return
      }
      error(res.message)
    })
  }

  useEffect(() => {
    users().then(res => {
      if (res.success) {
        setUserList(res.data.map(item => {
          return {
            value: item.id,
            label: item.username
          }
        }))
      }
    })

    fullMenus().then(res => {
      if (res.success) {
        res.data.map(item => {
          item.title = item.name
          item.key = item.id
          item.children.map(data => {
            data.title = data.name
            data.key = data.id
            data.children.map(value => {
              value.title = value.name
              value.key = value.id
            })
            return data
          })
          return item
        })
        setTreeData(res.data)
      }
    })
  }, [])

  return (
    <>
      <Select showSearch style={{ width: 300 }} options={userList} onChange={handleChange}
        filterOption={(input, option: any) => (option?.label ?? '').includes(input)}
        filterSort={(optionA, optionB) =>
          (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
        }
      />
      <Tree
        checkable
        style={{ margin: 20 }}
        autoExpandParent={true}
        onCheck={handleCheck}
        checkedKeys={{ checked: checkedKeys, halfChecked: hrefCheckedKeys }}
        treeData={treeData}

      />
      <Button type="primary" onClick={submitBind}>提交</Button>
    </>
  )
}

export default UserBindMenus