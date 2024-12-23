import React, {forwardRef, useImperativeHandle, useState} from 'react';
import { DatePicker, Select, Input, Button } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from "dayjs";

const VoListForm = forwardRef((props, ref) => {
  const [voList, setVoList] = useState([{ quotation_date: null, description: '', amount: '' }]);
  const [selectAmountType, setSelectAmountType] = useState(0);
  const [amountType, setAmountType] = useState<any>([{value: 'ix', text: 'Including VAT'}, {value: 'ex', text: 'Excluding VAT'}]) // Example amount types

  useImperativeHandle(ref, () => ({
    getVoList: () => voList,

    updateVoList: (newVoList) => setVoList(newVoList),

    getAmountType: () => selectAmountType,

    updateAmountType: (newAmountType) => setSelectAmountType(newAmountType),
  }))

    // Function to add a new item to the voList
  const addVoList = (index) => {
    const newDetails = [...voList];
    newDetails.splice(index + 1, 0, { quotation_date: null, description: '', amount: '' });
    setVoList(newDetails);
  }

  // Function to delete an item from the voList by index
  const delVoList = (index) => {
    setVoList(voList.filter((_, i) => i !== index));
  };

  // Function to calculate the total amount
  const calculateTotal = () => {
    return voList.reduce((total, item) => {
      // Parse the amount as a float, default to 0 if it's NaN
      const amount = parseFloat(item.amount);
      return total + (isNaN(amount) ? 0 : amount);
    }, 0).toFixed(2);
  };

  const changeDate = (dateString, index) => {
    const newVoList = [...voList];
    newVoList[index].quotation_date = dateString;
    setVoList(newVoList);
  }

  return (
    <div>
      <div className="progress-week-list">
        <div className="progress-week-item">Item</div>
        <div className="progress-week-item">Quotation Dated</div>
        <div className="progress-week-item">Description</div>
        <div className="progress-week-item">
          <Select value={selectAmountType} onChange={value => setSelectAmountType(value)}>
            {amountType.map((item, index) => (
              <Select.Option key={index} value={item.value}>{item.text}</Select.Option>
            ))}
          </Select> Amount Including VAT(RMB)
        </div>
      </div>
      {voList.map((item, index) => (
        <div key={index} className="progress-week-list">
          <div className="progress-week-item">{index + 1}</div>
          <div className="progress-week-item">
            <DatePicker
              style={{width: '100%', height: '100%'}}
              value={item.quotation_date ? dayjs(item.quotation_date, "DD-MM-YYYY") : null}
              format={"DD-MM-YYYY"}
              onChange={(date, dateString) => changeDate(dateString, index)}
            />
          </div>
          <div className="progress-week-item">
            <Input
              value={item.description}
              onChange={e => {
                const newVoList = [...voList];
                newVoList[index].description = e.target.value;
                setVoList(newVoList);
              }}
              style={{ border: 'none', borderBottom: '1px solid red', width: '60%', textAlign: 'center', color: 'red' }}
            />
          </div>
          <div className="progress-week-item">
            <Input
              value={item.amount}
              onChange={e => {
                const newVoList = [...voList];
                newVoList[index].amount = e.target.value;
                setVoList(newVoList);
              }}
              style={{ border: 'none', borderBottom: '1px solid red', width: '60%', textAlign: 'center', color: 'red' }}
            />
          </div>
          <div className="progress-week-item">
            <Button icon={<PlusOutlined />} onClick={() => addVoList(index)} style={{ cursor: 'pointer', height: '30px', lineHeight: '20px' }} />
            {index > 0 && (
              <Button icon={<DeleteOutlined />} onClick={() => delVoList(index)} style={{ cursor: 'pointer', color: 'red', height: '30px', lineHeight: '20px' }} />
            )}
          </div>
        </div>
      ))}
      <div style={{ paddingTop: "20px", paddingLeft: "450px" }}>Total: {calculateTotal()}</div>
    </div>
  );
});

export default VoListForm;
