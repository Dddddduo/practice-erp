import React, {forwardRef, useImperativeHandle, useState} from 'react';
import { Button, Input } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const ProgressTracker = forwardRef((props, ref) => {
  const [progressPassedWeekList, setProgressPassedWeekList] = useState([
    { key: 'A', content: '', expected_completion: '', note: '', items: [{ content: '', expected_completion: '', note: '' }] },
    { key: 'B', content: '', note: '', items: [{ content: '', expected_completion: '', note: '' }] }
  ])

  const [progressComingWeekList, setProgressComingWeekList] = useState([
    { key: 'A', content: '', expected_completion: '', note: '', items: [{ content: '', expected_completion: '', note: '' }] },
    { key: 'B', content: '', note: '', items: [{ content: '', expected_completion: '', note: '' }] }
  ])

  useImperativeHandle(ref, () => ({
    getProgressPassedWeekList: () => progressPassedWeekList,

    updateProgressPassedWeekList: (newList) => setProgressPassedWeekList(newList),

    getProgressComingWeekList: () => progressComingWeekList,

    updateProgressComingWeekList: (newList) => setProgressComingWeekList(newList),
  }))

  const addHeader = (index) => {
    const newItem = { key: 'C', content: '', expected_completion: '', note: '', items: [{ content: '', expected_completion: '', note: '' }] };
    const newList = [...progressPassedWeekList];
    newList.splice(index + 1, 0, newItem);
    setProgressPassedWeekList(newList);
  };

  const addComingHeader = (index) => {
    const newItem = { key: 'C', content: '', expected_completion: '', note: '', items: [{ content: '', expected_completion: '', note: '' }] };
    const newList = [...progressComingWeekList];
    newList.splice(index + 1, 0, newItem);
    setProgressComingWeekList(newList);
  }

  const delHeader = (index) => {
    const newList = progressPassedWeekList.filter((_, i) => i !== index);
    setProgressPassedWeekList(newList);
  }

  const delComingHeader = (index) => {
    const newList = progressComingWeekList.filter((_, i) => i !== index);
    setProgressComingWeekList(newList);
  }

  /**
   * 增加分支
   * @param index
   */
  const addHeaderItem = (index) => {
    const newList = [...progressPassedWeekList];
    newList[index].items.push({ content: '', expected_completion: '', note: '' });
    setProgressPassedWeekList(newList);
  }

  /**
   * 增加分支
   * @param index
   */
  const addComingHeaderItem = (index) => {
    const newList = [...progressComingWeekList];
    newList[index].items.push({ content: '', expected_completion: '', note: '' });
    setProgressComingWeekList(newList);
  }

  /**
   * 删除分支
   * @param headerIndex
   * @param itemIndex
   */
  const delHeaderItem = (headerIndex, itemIndex) => {
    const newList = [...progressPassedWeekList];
    newList[headerIndex].items.splice(itemIndex, 1);
    setProgressPassedWeekList(newList);
  }

  const delComingHeaderItem = (headerIndex, itemIndex) => {
    const newList = [...progressComingWeekList];
    newList[headerIndex].items.splice(itemIndex, 1);
    setProgressComingWeekList(newList);
  }

  const setHeaderContent = (value, key) => {
    console.log(key, value)
    const newData = [...progressPassedWeekList];
    newData[key].content = value;
    setProgressPassedWeekList(newData);
  }

  const setComingHeaderContent = (value, key) => {
    const newData = [...progressComingWeekList];
    newData[key].content = value;
    setProgressComingWeekList(newData);
  }

  const setItemData = (value, key, index, keyIndex) => {
    const newData = [...progressPassedWeekList];
    newData[key].items[index][keyIndex] = value;
    setProgressPassedWeekList(newData);
  }

  const setComingItemData = (value, key, index, keyIndex) => {
    const newData = [...progressComingWeekList];
    newData[key].items[index][keyIndex] = value;
    setProgressComingWeekList(newData);
  }

  return (
    <div>
      <>
        <div style={{ textAlign: 'center' }}>Passed Week</div>
        {progressPassedWeekList.map((header, headerIndex) => (
          <div key={headerIndex} className="progress-week-data">
            <div className="progress-week-list">
              <div className="progress-week-item">{header.key}</div>
              <div className="progress-week-item">
                <Input value={header.content} onInput={(e) => setHeaderContent(e.target.value, headerIndex)}/>
              </div>
              <div className="progress-week-item">&nbsp;</div>
              <div className="progress-week-item">Notes</div>
              <div className="progress-week-item">
                {
                  header.key === 'B' && progressPassedWeekList.length === 2 && <Button
                    icon={<PlusOutlined />}
                    onClick={() => addHeader(headerIndex)}
                    style={{ marginLeft: 'auto' }}
                  />
                }
                {header.key === 'C' && (
                  <Button
                    icon={<DeleteOutlined />}
                    onClick={() => delHeader(headerIndex)}
                    style={{ color: 'red' }}
                  />
                )}
              </div>
            </div>
            {header.items.map((item, itemIndex) => (
              <div key={itemIndex} className="progress-week-list">
                {/* Sub Item Content */}
                <div className="progress-week-item">{itemIndex + 1}</div>
                <div className="progress-week-item">
                  <Input
                    value={item.content}
                    onChange={(e) => setItemData(e.target.value, headerIndex, itemIndex, 'content')}
                    style={{ border: 'none', borderBottom: '1px solid red', color: 'red' }}
                  />
                </div>
                <div className="progress-week-item">
                  <Input
                    value={item.expected_completion}
                    onChange={(e) => setItemData(e.target.value, headerIndex, itemIndex, 'expected_completion')}
                    style={{ border: 'none', borderBottom: '1px solid red', color: 'red' }}
                  />
                </div>
                <div className="progress-week-item">
                  <Input
                    value={item.note}
                    onChange={(e) => setItemData(e.target.value, headerIndex, itemIndex, 'note')}
                    style={{ border: 'none', borderBottom: '1px solid red', color: 'red' }}
                  />
                </div>
                <div className="progress-week-item">
                  <Button
                    icon={<PlusOutlined />}
                    onClick={() => addHeaderItem(headerIndex)}
                  />
                  {itemIndex > 0 && (
                    <Button
                      icon={<DeleteOutlined />}
                      onClick={() => delHeaderItem(headerIndex, itemIndex)}
                      style={{ color: 'red' }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </>

      <>
        <div style={{ textAlign: 'center', marginTop: '10px', marginBottom: '10px' }}>Coming Week</div>
        {progressComingWeekList.map((header, headerIndex) => (
          <div key={headerIndex} className="progress-week-data">
            <div className="progress-week-list">
              <div className="progress-week-item">{header.key}</div>
              <div className="progress-week-item">
                <Input value={header.content} onInput={(e) => setComingHeaderContent(e.target.value, headerIndex)}/>
              </div>
              <div className="progress-week-item">&nbsp;</div>
              <div className="progress-week-item">Notes</div>
              <div className="progress-week-item">
                {
                  header.key === 'B' && progressPassedWeekList.length === 2 && <Button
                    icon={<PlusOutlined />}
                    onClick={() => addComingHeader(headerIndex)}
                    style={{ marginLeft: 'auto' }}
                  />
                }
                {header.key === 'C' && (
                  <Button
                    icon={<DeleteOutlined />}
                    onClick={() => delComingHeader(headerIndex)}
                    style={{ color: 'red' }}
                  />
                )}
              </div>
            </div>
            {header.items.map((item, itemIndex) => (
              <div key={itemIndex} className="progress-week-list">
                {/* Sub Item Content */}
                <div className="progress-week-item">{itemIndex + 1}</div>
                <div className="progress-week-item">
                  <Input
                    value={item.content}
                    onChange={(e) => setComingItemData(e.target.value, headerIndex, itemIndex, 'content')}
                    style={{ border: 'none', borderBottom: '1px solid red', color: 'red' }}
                  />
                </div>
                <div className="progress-week-item">
                  <Input
                    value={item.expected_completion}
                    onChange={(e) => setComingItemData(e.target.value, headerIndex, itemIndex, 'expected_completion')}
                    style={{ border: 'none', borderBottom: '1px solid red', color: 'red' }}
                  />
                </div>
                <div className="progress-week-item">
                  <Input
                    value={item.note}
                    onChange={(e) => setComingItemData(e.target.value, headerIndex, itemIndex, 'note')}
                    style={{ border: 'none', borderBottom: '1px solid red', color: 'red' }}
                  />
                </div>
                <div className="progress-week-item">
                  <Button
                    icon={<PlusOutlined />}
                    onClick={() => addComingHeaderItem(headerIndex)}
                  />
                  {itemIndex > 0 && (
                    <Button
                      icon={<DeleteOutlined />}
                      onClick={() => delComingHeaderItem(headerIndex, itemIndex)}
                      style={{ color: 'red' }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </>
    </div>
  );
})

export default ProgressTracker;
