import {useState, useEffect} from 'react';
import {produce} from "immer";
import {addSortKey} from "@/components/Table/DragTable";
import {Form} from "antd";
import {handleParseStateChange} from "@/utils/utils";
import {useReimbursementNew} from "@/hooks/useReimbursementNew";
import {useOrderListNew} from "@/hooks/useOrderListNew";


const initData = {
  tableData: [],
  formData: {}
};
export const useReiDataSource = (currentData: { [key: string]: any }) => {

  const {
    dataSource,
  } = useOrderListNew();

  const [detailsDataSource, setDetailsDataSource] = useState<any>({});

  const [formRef] = Form.useForm();
  // 初始化数据
  const loadInitData = async () => {
    const httpRequestData = {...initData}
    // http获取基础数据
    if (0 === dataSource.tableData.length) {
      // 清洗数据格式化
      if (0 === httpRequestData.tableData.length) {
        httpRequestData.tableData = [{
          name: currentData?.name ?? undefined,
          age: 0,
          email: currentData?.email ?? undefined
        }];
      }
      httpRequestData.tableData = addSortKey(httpRequestData.tableData)
    }

    // 传递到组件
    const formData = {
      name: currentData.name,
      email: currentData.email,
    };

    formRef.setFieldsValue({...formData});
    setDataSource(produce(draft => {
      draft.tableData = httpRequestData.tableData;
      draft.formData = formData
    }))

    // 操作更新
    // 提交数据
    // 清洗数据
    // 调用api

    // todo... 需要初始化的在这里做
  };

  /**
   * 加载基础数据
   */
  useEffect(() => {
    console.log(currentData)
    loadInitData().catch(console.log);
    setDetailsDataSource(dataSource.detailsDataSource);
    console.log(dataSource.detailsDataSource)
    return () => {
      console.log('logout');
    };
  }, []);

  const handleFinish = async () => {
    console.log("handleFinish", dataSource)
  }

  const handleFullValueChange: any = (path: string, value: any) => {
    console.log("path-value", path, value)
    const newData = handleParseStateChange(dataSource, path, value)
    setDataSource(newData);
  };

  return {
    currentData,
    formRef,
    dataSource,
    handleFinish,
    handleFullValueChange
  };
};
