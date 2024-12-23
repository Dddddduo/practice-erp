import React, { RefObject } from "react";
import type { ActionType } from "@ant-design/pro-components";
import MenuBindUsers from "./MenuBindUsers";

interface ItemListProps {
  actionRef: RefObject<ActionType>;
  success: (text: string) => void
  error: (text: string) => void
  handleCloseBind: () => void
  btnId: number
}

const Bind: React.FC<ItemListProps> = ({
  actionRef,
  success,
  error,
  handleCloseBind,
  btnId,
}) => {
  return (
    <>
      <MenuBindUsers

        actionRef={actionRef}
        success={success}
        error={error}
        handleCloseBind={handleCloseBind}
        btnId={btnId}
      />
    </>
  )
}

export default Bind