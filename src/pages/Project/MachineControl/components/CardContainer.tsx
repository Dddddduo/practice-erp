import React from 'react';

interface Props {
  className?: string;
  children: React.ReactNode;
  width?: number;
}

const CardContainer: React.FC<Props> = ({ className, children, width }) => {
  return (
    <div className={`bg-gray-200 rounded-1xl py-12p px-16p ${className}`} style={{ width: width }}>
      {children}
    </div>
  );
};

export default CardContainer;
