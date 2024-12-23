import {
  INIT_BASE_DATA,
  INIT_FORM_DATA,
  CHANGE_FORM_DATA,
  INIT_TABLE_DATA,
  TABLE_VALUE_CHANGE,
  TABLE_ALL_FLUSH,
  TABLE_TOP_VALUE_CHANGE,
  TABLE_MID_VALUE_CHANGE,
  TABLE_BOTTOM_VALUE_CHANGE,
  INIT_EQUIPMENT_DATA,
  TABLE_DEV_VALUE_CHANGE, INIT_HISTORY_DATA
} from './constants';

export const initBaseData = (data: { [key: string]: any }) => {
  return {
    type: INIT_BASE_DATA,
    payload: data,
  }
};

export const initFormData = (data: { [key: string]: any }) => {
  return {
    type: INIT_FORM_DATA,
    payload: data,
  }
}

export const changeFormData = (data: { [key: string]: any }) => {
  return {
    type: CHANGE_FORM_DATA,
    payload: data,
  }
}

export const initTableData = (type: string, data: { [key: string]: any }) => {
  return {
    type: INIT_TABLE_DATA,
    payload: {
      initType: type,
      data,
    },
  }
}

export const tableValueChange = (row: number, col: string, data: any) => {
  return {
    type: TABLE_VALUE_CHANGE,
    payload: {
      row,
      col,
      data
    },
  }
}


export const tableAllFlush = (data: any) => {
  return {
    type: TABLE_ALL_FLUSH,
    payload: data
  }
}

export const tableTopValueChange = (col: string, data: string[]) => {
  return {
    type: TABLE_TOP_VALUE_CHANGE,
    payload: {
      col,
      data
    }
  }
}

export const tableMidValueChange = (type: string, index: number, pos: string, data: string) => {
  return {
    type: TABLE_MID_VALUE_CHANGE,
    payload: {
      type,
      index,
      pos,
      data
    }
  }
}

export const tableBottomValueChange = (index: number, pos: string, data: string) => {
  return {
    type: TABLE_BOTTOM_VALUE_CHANGE,
    payload: {
      index,
      pos,
      data
    }
  }
}

export const initEquipmentData = (data) => {
  return {
    type: INIT_EQUIPMENT_DATA,
    payload: data
  }
}

export const tableDevValueChange = (index, data) => {
  return {
    type: TABLE_DEV_VALUE_CHANGE,
    payload: {
      index,
      data
    }
  }
}

export const initHistoryData = (data) => {
  return {
    type: INIT_HISTORY_DATA,
    payload: data
  }
}

//
// TABLE_BOTTOM_VALUE_CHANGE
