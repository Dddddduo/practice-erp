import React, { RefObject } from "react";
import { Divider } from "antd";
import type { ActionType } from "@ant-design/pro-components";
import { FormattedMessage, useIntl } from "@@/exports";
import UserBindMenus from "./UserBindMenus";
import MenuBindUsers from "./MenuBindUsers";

interface ItemListProps {
  actionRef: RefObject<ActionType>;
  success: (text: string) => void
  error: (text: string) => void
  handleCloseBind: () => void
}

const Bind: React.FC<ItemListProps> = ({
  actionRef,
  success,
  error,
  handleCloseBind,
}) => {
  const intl = useIntl()

  return (
    <>
      <UserBindMenus
        actionRef={actionRef}
        success={success}
        error={error}
        handleCloseBind={handleCloseBind}
      />
      <Divider />
      <MenuBindUsers
        actionRef={actionRef}
        success={success}
        error={error}
        handleCloseBind={handleCloseBind}
      />
    </>
  )
}

export default Bind