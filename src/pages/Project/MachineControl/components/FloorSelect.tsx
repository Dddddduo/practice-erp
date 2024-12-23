import React from 'react';
import { Select } from 'antd';
import { Option } from '@/utils/machine_control_service';
import { ClickEnum } from '@/viewModel/Project/useMachineControl';

interface Props {
  value: string;
  options: Option[];
  handleOnChange: (path: string, value: any  ) => void
}

const FloorSelect: React.FC<Props> = ({ value, options, handleOnChange }) => {

  return (
    <>
      <Select
        value={value}
        options={options}
        onChange={(e) => {
          console.log(e)
          handleOnChange('selectFloor', e);
        }}
        style={{
          width: 100
        }}
      />
    </>
  );
};

export default FloorSelect;
