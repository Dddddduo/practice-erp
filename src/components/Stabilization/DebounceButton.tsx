import { Button } from 'antd'
import React from 'react'
import _ from 'loadsh'

interface ItemListProps {
  onClick: () => void

}

// 防抖按钮组件
class DebounceButton extends React.Component {
  constructor(props: any) {
    super(props);
    // 创建防抖函数
    this.handleClick = _.debounce(this.handleClick.bind(this), 500)
  }

  handleClick() {
    // 如果 props 中传入了 onClick, 就调用它
    this.props.onClick && this.props.onClick();
  }

  render() {
    const { onClick, ...rest } = this.props;

    // 渲染 Button 组件, 把除 onClick 外的所有 props 传给 Button
    // 并将 handleClick 作为点击事件处理器
    return <Button {...rest} onClick={this.handleClick} />
  }
}

export default DebounceButton