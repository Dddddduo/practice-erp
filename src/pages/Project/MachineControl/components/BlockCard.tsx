import React from "react";
import {getLocale, useModel} from "@@/exports";

interface Props {
  title?: string,
  children: React.ReactNode,
  style?: React.CSSProperties; // Define style prop
}

const BlockCard: React.FC<Props> = ({title, children, style}) => {
  const {initialState} = useModel('@@initialState');
  const {settings} = initialState;

  const isEN = getLocale() === 'en-US';

  return (
    <div
      style={{
        backgroundColor: settings?.navTheme === 'light' ? '#EEEEEF' : '#404040',
        width: isEN ? 280 :220,
        height: 37,
        borderRadius: 4,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 10px',
        ...style,
      }}
    >
      <div style={{fontWeight: 'bold'}}>
        {title ?? ''}
      </div>
      <div>
        {children}
      </div>
    </div>
  )
}

export default BlockCard
