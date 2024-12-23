import { Button, Select, Tree } from 'antd';
import React from 'react';

interface Props {
  userList: any;
  treeData: any;
  handleChange: (value: string) => void;
  handleCheck: (checkedKeysValue: any, e: any) => void;
  submitBind: () => void;
  checkedKeys: any;
  hrefCheckedKeys: any;
}

const UserBindMenus: React.FC<Props> = (props) => {
  const {
    userList,
    treeData,
    handleChange,
    handleCheck,
    submitBind,
    checkedKeys,
    hrefCheckedKeys,
  } = props;
  return (
    <>
      <Select
        showSearch
        style={{ width: 300 }}
        options={userList}
        onChange={handleChange}
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
      <Button type="primary" onClick={submitBind}>
        提交
      </Button>
    </>
  );
};

export default UserBindMenus;
