import React from "react";


interface Props {
  children: React.ReactNode,
  className?: string;
  style?: React.CSSProperties;
}

const FcuTag: React.FC<Props> = ({children, className , style }) => {
  return (
    <div
      className={ className }
      style={{
        position: 'absolute',
        backgroundColor: '#3b82f6',
        color: 'white',
        borderRadius: '0.4rem',
        padding: '0.5rem',
        textAlign: 'center',
        ...style
      }}
    >
      {children}
    </div>
  );
}

export default FcuTag
