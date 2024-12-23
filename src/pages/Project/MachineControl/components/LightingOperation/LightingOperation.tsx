import React from 'react';
import LightCard from '@/pages/Project/MachineControl/components/LightingOperation/LightCard';
import { ClickEnum, LightData } from '@/viewModel/Project/useMachineControl';

interface Props {
  lightingOperation: LightData[];
  handleOnChange: (path: string, value: any) => void;
}

const LightingOperation: React.FC<Props> = ({
  lightingOperation,
  handleOnChange,
}) => {
  return (
    <div className={'flex flex-wrap p-4 gap-8'}>
      {lightingOperation.map((item, index) => {
        return (
          <div key={index}>
            <LightCard
              lightData={item}
              index={index}
              handleOnChange={handleOnChange}
            />
          </div>
        );
      })}
    </div>
  );
};
export default LightingOperation;
