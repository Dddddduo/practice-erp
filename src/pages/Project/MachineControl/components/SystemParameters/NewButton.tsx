import {Button} from "antd";
import React from "react";
import {getLocale, useIntl} from "@@/exports";
import {ButtonProps} from "antd/lib/button";

interface Props {
  btnText: {
    id: string,
    defaultMessage: string,
  }
  className?: string
  buttonProps?: ButtonProps
  onClick: () => void
  style?: React.CSSProperties
}

const NewButton: React.FC<Props> = ({
                                     btnText,
                                     className,
                                     onClick,
                                     style,
                                     ...buttonProps
                                   }) => {

  const intl = useIntl();
  const isEN = getLocale() === 'en-US';

  return (
    <Button
      size="small"
      type={'primary'}
      className={`text-btn-default rounded-2xl ${className}`}
      onClick={onClick}
      style={{width: isEN ? 200 : 100, fontSize: 14, ...style}}
      {...buttonProps}
    >
      {
        intl.formatMessage({
          id: btnText.id,
          defaultMessage: btnText.defaultMessage,
        })
      }
    </Button>
  )
}

export default NewButton
