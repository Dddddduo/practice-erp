import React from 'react';
import { Card } from 'antd';

interface Props {
  title: string;
  formatVal: string;
  onClick: () => void;
  style?: React.CSSProperties;
  isActive?: boolean;
  titleStyle?: React.CSSProperties;
  contentStyle?: React.CSSProperties;
}

const PowerCard: React.FC<Props> = ({
  title,
  formatVal,
  onClick,
  style,
  isActive=false,
  titleStyle,
  contentStyle,
}) => {
  return(
  <Card
    onClick={onClick}
    style={{width: 200,cursor: 'pointer', boxShadow: isActive ? '0px 10px 10px rgba(0, 0, 0, 0.1)' : '', ...style}}
  >
    <div style={{...titleStyle}}>{title}</div>
    <div style={{...contentStyle}} className={'font-bold'}>{formatVal}</div>
  </Card>
)};

export default PowerCard;
