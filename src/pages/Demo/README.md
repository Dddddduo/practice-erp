# Demo

### FormList表单方式拖拽
- /demo/drag/form

### StateList方式拖拽
- /demo/drag/state


# Immer类型使用
```js
// 处理基础类型
const [count, setCount] = useState(0);

const increment = () => {
  setCount(currentCount => produce(currentCount, draftCount => draftCount + 1));
};

// 对原始状态进行改变方法1
setDataSource(currentState => produce(currentState, draftState => {
  // 给 myTable1 每项加上 sortTableKey
  draftState.myTable1.forEach((item, index) => {
    item['sortTableKey'] = (index + 1).toString();
  });
  // 给 myTable2 每项加上 sortTableKey
  draftState.myTable2.forEach((item, index) => {
    item['sortTableKey'] = (index + 1).toString();
  });
}));

// 方法2
setDataSource(currentState => produce(currentState, draftState => {
  // 分别对 myTable1 和 myTable2 应用 addSortKey 方法
  draftState.myTable1 = addSortKey(draftState.myTable1);
  draftState.myTable2 = addSortKey(draftState.myTable2);
}));
```
