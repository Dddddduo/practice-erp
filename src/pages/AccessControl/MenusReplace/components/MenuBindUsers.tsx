import React from 'react';
import {Button, Checkbox, Select, Space} from "antd";
interface Props {
  userList: any;
  options:any;
  selectedLevel1: string;
  selectedLevel2: string;
  selectedLevel3: string;
  userIds: string[],
  onLevel1Change: (value: string) => void
  onLevel2Change: (value: string) => void
  onLevel3Change: (value: string) => void,
  onUserChange: (checkedKeysValue: any, e: any) => void
  onSubmit: () => void
}
const MenuBindUsers: React.FC<Props> = (props) => {
  const {
    userList,
    options,
    selectedLevel1,
    selectedLevel2,
    selectedLevel3,
    userIds,
    onLevel1Change,
    onLevel2Change,
    onLevel3Change,
    onUserChange,
    onSubmit
  } = props;
  console.log('MenuBindUsers:userList', userList,options)
  return (
    <>
      <Space>
        <Select
          showSearch
          style={{ width: 300 }}
          value={selectedLevel1}
          options={options.level1Options}
          onChange={onLevel1Change}
        />
        {
          options.level2Options.length > 0 && <Select
            showSearch
            value={selectedLevel2}
            style={{ width: 300 }}
            options={options.level2Options || []}
            onChange={onLevel2Change}
            disabled={!selectedLevel1}
          />
        }
        {
          options.level3Options.length > 0 && <Select
            showSearch
            value={selectedLevel3}
            style={{ width: 300 }}
            options={options.level3Options || []}
            onChange={onLevel3Change}
            disabled={!selectedLevel2}
          />
        }
      </Space>
      <div style={{display: 'flex', flexWrap: 'wrap', margin: 20}}>
        {
          userList.map(item => {
            console.log('Checkbox--checked',userIds.includes(item.value))
            return (
              <div key={item.id} style={{width: 120, marginBottom: 10}}>
                <Checkbox checked={userIds.includes(item.value)} onChange={(e) => onUserChange(item.value, e.target.checked)}  >{item.label}</Checkbox>
              </div>
            )
          })
        }
      </div>
      <Button type="primary" onClick={onSubmit}>提交</Button>
    </>
  )
};
export default MenuBindUsers;
