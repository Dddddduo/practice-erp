// import {
//   createMenu,
//   deleteMenu,
//   fullMenus,
//   indexMenus,
//   indexMenusUser,
//   indexUsersMenu,
//   showMenu,
//   updateMenu,
//   updateUsersMenus,
//   users,
// } from '@/services/ant-design-pro/accessControl';
// import {getStateMap, setStateMap} from '@/utils/utils';
// import { useLocation } from '@@/exports';
// import { ActionType } from '@ant-design/pro-components';
// import { Form, message } from 'antd';
// import { produce } from 'immer';
// import { isEmpty } from 'lodash';
// import { useEffect, useRef, useState } from 'react';
//
// export interface User {
//   id: string;
//   username: string;
// }
//
// export interface Menu {
//   id: string;
//   title: string;
//   children?: Menu[];
// }
//
// interface BindData {
//   userBindMenus: {
//     userList: User[];
//     treeData: Menu[];
//     selectUser: any[];
//     checkedKeys: string[];
//     hrefCheckedKeys: string[];
//     parents: any[];
//   };
//   menuBindUsers: {
//     userList: User[];
//     userIds: any;
//     menuId: any;
//     treeData: Menu[];
//     options: {
//       level1Options: any[];
//       level2Options: any[];
//       level3Options: any[];
//     };
//     selectedLevel1: string;
//     selectedLevel2: string;
//     selectedLevel3: string;
//   };
// }
//
// interface TreeNode {
//   id: string;
//   children?: TreeNode[];
// }
//
// export const useMenusReplace = () => {
//   const actionRef = useRef<ActionType>();
//   const [form] = Form.useForm();
//   const location = useLocation();
//   const currentPath = location.pathname;
//   const pathname = currentPath.split('/')[currentPath.split('/').length - 1];
//   const [messageApi, contextHolder] = message.useMessage();
//   /* 对话框状态 */
//   const [modalStatus, setModalStatus] = useState({
//     visible: false,
//     title: '',
//     type: '',
//   });
//   /**/
//   const [bindData, setBindData] = useState<BindData>({
//     userBindMenus: {
//       userList: [],
//       treeData: [],
//       selectUser: [],
//       checkedKeys: [],
//       hrefCheckedKeys: [],
//       parents: [],
//     },
//     menuBindUsers: {
//       userList: [],
//       userIds: [],
//       menuId: [],
//       treeData: [],
//       options: {
//         level1Options: [],
//         level2Options: [],
//         level3Options: [],
//       },
//       selectedLevel1: '',
//       selectedLevel2: '',
//       selectedLevel3: '',
//     },
//   });
//
//   const [formData, setFormData] = useState({
//     menus: [],
//     currentItem: {},
//     columnsStateMap: {},
//   });
//   const onChangeColumnsStateMap = (value) => {
//     setFormData(
//       produce((draft) => {
//         draft.columnsStateMap = value;
//       })
//     );
//     setStateMap(pathname, value);
//   }
//
//   const success = (text: string) => {
//     messageApi
//       .open({
//         type: 'success',
//         content: text,
//       })
//       .then();
//   };
//   const error = (text: string) => {
//     messageApi
//       .open({
//         type: 'error',
//         content: text,
//       })
//       .then();
//   };
//
//   /**
//    * 获取table数据
//    */
//   const fetchListData = async ({ current, pageSize, ...params }) => {
//     const dataSource = {
//       total: 0,
//       data: [],
//     };
//     const customParams = {
//       page: current,
//       page_size: pageSize,
//     };
//     try {
//       const res = await indexMenus(customParams);
//       console.log('fetchListData:res', res);
//       if (res.success) {
//         dataSource.total = res.data.length ?? 0;
//         dataSource.data = res.data ?? [];
//       }
//     } catch (error) {
//       console.log('fetchListData:error', error);
//     } finally {
//     }
//     // console.log('dataSource--dataSource', dataSource);
//     return dataSource;
//   };
//   /**
//    * 模态框 open
//    */
//   const openModal = ({ title, type }): any => {
//     setModalStatus({
//       visible: true,
//       title,
//       type,
//     });
//   };
//   /**
//    * 模态框  close
//    */
//   const closeModal = () => {
//     setModalStatus({
//       visible: false,
//       title: '',
//       type: '',
//     });
//     setBindData((prevData) => {
//       return {
//         ...prevData,
//         userBindMenus: {
//           ...prevData.userBindMenus,
//           selectUser: [],
//           checkedKeys: [],
//           hrefCheckedKeys: [],
//           parents: [],
//         },
//       };
//     });
//     setFormData(
//       produce((draft) => {
//         draft.currentItem = {};
//       }),
//     );
//   };
//   /**
//    * 获取用户 菜单数据
//    */
//   const fetchData = async () => {
//     try {
//       const [usersRes, menusRes] = await Promise.all([users(), fullMenus()]);
//
//       let newUserList: User[] = [];
//       let newTreeData: Menu[] = [];
//       let newSelectData = [];
//
//       if (usersRes.success) {
//         console.log('getUsers:res', usersRes.data);
//         newUserList = (usersRes.data ?? []).map((user: any) => ({
//           value: user.id,
//           label: user.username,
//         }));
//       }
//
//       if (menusRes.success) {
//         console.log('getFullMenus:res', menusRes.data);
//         newTreeData = (menusRes.data ?? []).map((menu: any) => ({
//           key: menu.id,
//           title: menu.name,
//           children: menu.children.map((child: any) => ({
//             key: child.id,
//             title: child.name,
//             children: child.children.map((c: any) => ({
//               key: c.id,
//               title: c.name,
//             })),
//           })),
//         }));
//         newSelectData = (menusRes.data ?? []).map((menu: any) => ({
//           value: menu.id,
//           label: menu.name,
//           children: menu.children.map((child: any) => ({
//             value: child.id,
//             label: child.name,
//             children: child.children.map((c: any) => ({
//               value: c.id,
//               label: c.name,
//             })),
//           })),
//         }));
//
//         const newMenuList = (menusRes.data ?? []).map((menu: any) => ({
//           value: menu.id,
//           label: menu.name,
//           children: menu.children.map((child: any) => ({
//             value: child.id,
//             label: child.name,
//             children: child.children.map((c: any) => ({
//               value: c.id,
//               label: c.name,
//             })),
//           })),
//         }));
//         newMenuList.unshift({
//           value: 0,
//           label: '顶级菜单',
//         });
//         setFormData(
//           produce((draft) => {
//             draft.menus = newMenuList ?? [];
//           }),
//         );
//       }
//
//       setBindData(
//         produce((draft) => {
//           draft.userBindMenus.userList = newUserList;
//           draft.userBindMenus.treeData = newTreeData;
//           draft.menuBindUsers.userList = newUserList;
//           draft.menuBindUsers.treeData = newSelectData;
//         }),
//       );
//     } catch (error) {
//       console.log('fetchData:error', error);
//     }
//   };
//
//   /**
//    * 获取 hrefIds, childrenIds
//    * @param data
//    */
//   const extractIds = (data: TreeNode[]): { hrefIds: string[]; childrenIds: string[] } => {
//     const hrefIds: string[] = [];
//     const childrenIds: string[] = [];
//
//     const traverse = (node: TreeNode) => {
//       if (isEmpty(node.children)) {
//         childrenIds.push(node.id);
//       } else {
//         hrefIds.push(node.id);
//         node.children?.forEach(traverse);
//       }
//     };
//
//     data.forEach(traverse);
//
//     return { hrefIds, childrenIds };
//   };
//   /**
//    * selectUser
//    * @param e
//    */
//   const handleChangeTop = (e: any) => {
//     console.log('handleChange:', e);
//     indexMenusUser(e).then((res) => {
//       if (res.success) {
//         const { hrefIds, childrenIds } = extractIds(res.data);
//         setBindData((prevData) => ({
//           ...prevData,
//           userBindMenus: {
//             ...prevData.userBindMenus,
//             selectUser: e,
//             checkedKeys: childrenIds,
//             hrefCheckedKeys: hrefIds,
//           },
//         }));
//       }
//     });
//   };
//   /**
//    * 菜单绑定用户
//    * @param value
//    */
//   const onLevel1Change = (value: any) => {
//     console.log('onLevel1Change:', value);
//     indexUsersMenu(value).then((res) => {
//       if (res.success) {
//         setBindData(
//           produce((draft) => {
//             draft.menuBindUsers.selectedLevel1 = value;
//             draft.menuBindUsers.selectedLevel2 = '';
//             draft.menuBindUsers.selectedLevel3 = '';
//             draft.menuBindUsers.userIds = res.data.map((item: any) => item.id);
//             draft.menuBindUsers.menuId = [value];
//
//             const selectedOption = draft.menuBindUsers.treeData.find(
//               (item: any) => item.value === value,
//             );
//             draft.menuBindUsers.options.level2Options = selectedOption?.children || [];
//             draft.menuBindUsers.options.level3Options = [];
//           }),
//         );
//       }
//     });
//   };
//
//   const onLevel2Change = (value: any) => {
//     console.log('onLevel2Change:', value);
//     indexUsersMenu(value).then((res) => {
//       if (res.success) {
//         setBindData(
//           produce((draft) => {
//             draft.menuBindUsers.selectedLevel2 = value;
//             draft.menuBindUsers.selectedLevel3 = '';
//             draft.menuBindUsers.userIds = res.data.map((item: any) => item.id);
//             draft.menuBindUsers.menuId = [value];
//
//             const selectedLevel1 = draft.menuBindUsers.treeData.find(
//               (item: any) => item.value === draft.menuBindUsers.selectedLevel1,
//             );
//             const selectedOption = selectedLevel1?.children?.find(
//               (item: any) => item.value === value,
//             );
//             draft.menuBindUsers.options.level3Options = selectedOption?.children || [];
//           }),
//         );
//       }
//     });
//   };
//
//   const onLevel3Change = (value: any) => {
//     console.log('onLevel3Change:', value);
//     indexUsersMenu(value).then((res) => {
//       if (res.success) {
//         setBindData(
//           produce((draft) => {
//             draft.menuBindUsers.selectedLevel3 = value;
//             draft.menuBindUsers.userIds = res.data.map((item: any) => item.id);
//             draft.menuBindUsers.menuId = [value];
//           }),
//         );
//       }
//     });
//   };
//
//   const onUserChange = (userId: string, checked: boolean) => {
//     setBindData(
//       produce((draft) => {
//         if (checked && !draft.menuBindUsers.userIds.includes(userId)) {
//           draft.menuBindUsers.userIds.push(userId);
//           console.log('checkbox 选中',checked,userId)
//         } else if (!checked) {
//           draft.menuBindUsers.userIds = draft.menuBindUsers.userIds.filter((id) => id !== userId);
//           console.log('checkbox 取消选中',checked,draft.menuBindUsers.userIds.filter((id) => id !== userId))
//         }
//       }),
//     );
//   };
//   const fetchUpdatedPermissions = () => {
//     indexUsersMenu(bindData.menuBindUsers.menuId[0]).then((res) => {
//       console.log('更新后的权限:', res.data);
//     });
//   };
//   const onSubmit = () => {
//     console.log('onSubmit--onSubmit',bindData.menuBindUsers.userIds,bindData.menuBindUsers.menuId)
//     try {
//       updateUsersMenus({
//       menu_ids: bindData.menuBindUsers.menuId,
//       user_ids: bindData.menuBindUsers.userIds,
//     }).then((res) => {
//       if (res.success) {
//         closeModal();
//         success('绑定成功');
//         actionRef.current?.reload();
//         fetchUpdatedPermissions();
//         return
//       }
//       error(res.message);
//     });
//     } catch (error) {
//       console.log('onSubmit', error);
//     }
//   };
//   /**
//    * 勾选
//    * @param checkedKeysValue
//    * @param e
//    */
//   const handleCheck = (checkedKeysValue: any, e: any) => {
//     setBindData((prevData) => ({
//       ...prevData,
//       userBindMenus: {
//         ...prevData.userBindMenus,
//         checkedKeys: checkedKeysValue,
//         parents: e.halfCheckedKeys,
//       },
//     }));
//   };
//   const submitBind = () => {
//     console.log('用户绑定菜单',[bindData.userBindMenus.selectUser],[...bindData.userBindMenus.parents, ...bindData.userBindMenus.checkedKeys])
//     updateUsersMenus({
//       user_ids: [bindData.userBindMenus.selectUser],
//       menu_ids: [...bindData.userBindMenus.parents, ...bindData.userBindMenus.checkedKeys],
//     }).then((res) => {
//       if (res.success) {
//         closeModal();
//         success('绑定成功');
//         actionRef.current?.reload();
//         return;
//       }
//       error(res.message);
//     });
//   };
//
//   //Table
//   const getCurrent = (current) => {
//     // console.log('current', current)
//     setFormData(
//       produce((draft) => {
//         draft.currentItem = current;
//       }),
//     );
//     showMenu(current.id).then((res) => {
//       if (res.success) {
//         console.log('showMenu--showMenu--showMenu',res.data);
//
//         form.setFieldsValue({
//           name: res.data?.name ?? '',
//           icon: res.data?.icon ?? '',
//           pid: res.data.pid ?? '',
//           path: res.data.path ?? '',
//           level: res.data.level ?? '',
//           sort_by: res.data?.sort_by ?? '',
//         });
//       }
//     });
//   };
//   /**
//    * create or update
//    */
//   const handleFinished = (values: any) => {
//     let params = {
//       name: values.name ?? '',
//       icon: values.icon ?? '',
//       pid: values.pid ?? 0,
//       path: values.path ?? '',
//       sort_by: values.sort_by ?? '',
//     } ;
//     if (isEmpty(formData.currentItem)) {
//
//       createMenu(params).then((res) => {
//         if (res.success) {
//           closeModal();
//           actionRef.current?.reload();
//           success('添加成功');
//           return;
//         }
//         error(res.message);
//       });
//     }
//     params = {
//       ...params,
//       id: formData.currentItem?.id,
//     };
//     updateMenu(params).then((res) => {
//       if (res.success) {
//         closeModal();
//         actionRef.current?.reload();
//         success('更新成功');
//         return;
//       }
//       error(res.message);
//     });
//   };
//   /**
//    * delete
//    */
//   const handleDelete = (entity) => {
//     deleteMenu(entity.id).then((res) => {
//       if (res.success) {
//         actionRef.current?.reload();
//         success('删除成功');
//         return;
//       }
//       error(res.message);
//     });
//   };
//   useEffect(() => {
//     fetchData().then(() => {
//       setBindData(
//         produce((draft) => {
//           draft.menuBindUsers.options.level1Options = draft.menuBindUsers.treeData;
//         }),
//       );
//     });
//
//     setFormData(
//       produce((draft) => {
//         draft.columnsStateMap = getStateMap(pathname);
//       }),
//     );
//
//     // if (isEmpty(formData.currentItem)) {
//     //   return;
//     // }
//     // showMenu(formData.currentItem.id).then((res) => {
//     //   if (res.success) {
//     //     console.log('showMenu--showMenu--showMenu',res.data);
//     //
//     //     form.setFieldsValue({
//     //       name: res.data?.name ?? '',
//     //       icon: res.data?.icon ?? '',
//     //       pid: res.data.pid ?? '',
//     //       path: res.data.path ?? '',
//     //       level: res.data.level ?? '',
//     //       sort_by: res.data?.sort_by ?? '',
//     //     });
//     //   }
//     // });
//   }, []);
//   return {
//     form,
//     actionRef,
//     contextHolder,
//     success,
//     error,
//     fetchListData,
//     modalStatus,
//     openModal,
//     closeModal,
//     bindData,
//     handleChangeTop,
//     handleCheck,
//     submitBind,
//     onLevel1Change,
//     onLevel2Change,
//     onLevel3Change,
//     onUserChange,
//     onSubmit,
//     getCurrent,
//     handleDelete,
//     formData,
//     onChangeColumnsStateMap,
//     handleFinished,
//   };
// };


import {
  createMenu,
  deleteMenu,
  fullMenus,
  indexMenus,
  indexMenusUser,
  indexUsersMenu,
  showMenu,
  updateMenu,
  updateUsersMenus,
  users,
} from '@/services/ant-design-pro/accessControl';
import {getStateMap, setStateMap} from '@/utils/utils';
import { useLocation } from '@@/exports';
import {ActionType, ParamsType} from '@ant-design/pro-components';
import { Form, message } from 'antd';
import { produce } from 'immer';
import { isEmpty } from 'lodash';
import { useEffect, useRef, useState } from 'react';

export interface User {
  id: string;
  username: string;
}

export interface Menu {
  id: string;
  title: string;
  children?: Menu[];
}

interface BindData {
  userBindMenus: {
    userList: User[];
    treeData: Menu[];
    selectUser: any[];
    checkedKeys: string[];
    hrefCheckedKeys: string[];
    parents: any[];
  };
  menuBindUsers: {
    userList: User[];
    userIds: any;
    menuId: any;
    treeData: Menu[];
    options: {
      level1Options: any[];
      level2Options: any[];
      level3Options: any[];
    };
    selectedLevel1: string;
    selectedLevel2: string;
    selectedLevel3: string;
  };
}

interface TreeNode {
  id: string;
  children?: TreeNode[];
}

export const useMenusReplace = () => {
  const actionRef = useRef<ActionType>();
  const [form] = Form.useForm();
  const location = useLocation();
  const currentPath = location.pathname;
  const pathname = currentPath.split('/')[currentPath.split('/').length - 1];
  const [messageApi, contextHolder] = message.useMessage();
  /* 对话框状态 */
  const [modalStatus, setModalStatus] = useState({
    visible: false,
    title: '',
    type: '',
  });
  /**/
  const [bindData, setBindData] = useState<BindData>({
    userBindMenus: {
      userList: [],
      treeData: [],
      selectUser: [],
      checkedKeys: [],
      hrefCheckedKeys: [],
      parents: [],
    },
    menuBindUsers: {
      userList: [],
      userIds: [],
      menuId: [],
      treeData: [],
      options: {
        level1Options: [],
        level2Options: [],
        level3Options: [],
      },
      selectedLevel1: '',
      selectedLevel2: '',
      selectedLevel3: '',
    },
  });

  const [formData, setFormData] = useState({
    menus: [],
    currentItem: {},
    columnsStateMap: {},
  });
  const onChangeColumnsStateMap = (value) => {
    setFormData(
      produce((draft) => {
        draft.columnsStateMap = value;
      })
    );
    setStateMap(pathname, value);
  }

  const success = (text: string) => {
    messageApi
      .open({
        type: 'success',
        content: text,
      })
      .then();
  };
  const error = (text: string) => {
    messageApi
      .open({
        type: 'error',
        content: text,
      })
      .then();
  };

  /**
   * 获取table数据
   */
  const fetchListData = async ({ current, pageSize, ...params },sort: ParamsType) => {
    const dataSource = {
      success:false,
      total: 0,
      data: [],
    };
    const customParams = {
      page: current,
      page_size: pageSize,
    };
    try {
      const res = await indexMenus(customParams);
      console.log('fetchListData:res', res);
      if (res.success) {
        dataSource.success = true;
        dataSource.total = res.data.length ?? 0;
        dataSource.data = res.data ?? [];
        return dataSource ;
      }
    } catch (error) {
      console.log('fetchListData:error', error);
    } finally {
    }
    // console.log('dataSource--dataSource', dataSource);
    return dataSource;
  };
  /**
   * 模态框 open
   */
  const openModal = ({ title, type }): any => {
    setModalStatus({
      visible: true,
      title,
      type,
    });
    setModalStatus(produce(draft => {
      draft.type = type;
    }));
    if(type === 'create'){
      form.setFieldsValue({
        name:  '',
        icon:  '',
        pid:  0,
        path:  '',
        sort_by: '',
      })
      return
    }
  };
  /**
   * 模态框  close
   */
  const closeModal = () => {
    setModalStatus({
      visible: false,
      title: '',
      type: '',
    });
    setBindData((prevData) => {
      return {
        ...prevData,
        userBindMenus: {
          ...prevData.userBindMenus,
          selectUser: [],
          checkedKeys: [],
          hrefCheckedKeys: [],
          parents: [],
        },
      };
    });
    setFormData(
      produce((draft) => {
        draft.currentItem = {};
      }),
    );
  };
  /**
   * 获取用户 菜单数据
   */
  const fetchData = async () => {
    try {
      const [usersRes, menusRes] = await Promise.all([users(), fullMenus()]);

      let newUserList: User[] = [];
      let newTreeData: Menu[] = [];
      let newSelectData = [];

      if (usersRes.success) {
        console.log('getUsers:res', usersRes.data);
        newUserList = (usersRes.data ?? []).map((user: any) => ({
          value: user.id,
          label: user.username,
        }));
      }

      if (menusRes.success) {
        console.log('getFullMenus:res', menusRes.data);
        newTreeData = (menusRes.data ?? []).map((menu: any) => ({
          key: menu.id,
          title: menu.name,
          children: menu.children.map((child: any) => ({
            key: child.id,
            title: child.name,
            children: child.children.map((c: any) => ({
              key: c.id,
              title: c.name,
            })),
          })),
        }));
        newSelectData = (menusRes.data ?? []).map((menu: any) => ({
          value: menu.id,
          label: menu.name,
          children: menu.children.map((child: any) => ({
            value: child.id,
            label: child.name,
            children: child.children.map((c: any) => ({
              value: c.id,
              label: c.name,
            })),
          })),
        }));

        const newMenuList = (menusRes.data ?? []).map((menu: any) => ({
          value: menu.id,
          label: menu.name,
          children: menu.children.map((child: any) => ({
            value: child.id,
            label: child.name,
            children: child.children.map((c: any) => ({
              value: c.id,
              label: c.name,
            })),
          })),
        }));
        newMenuList.unshift({
          value: 0,
          label: '顶级菜单',
        });
        setFormData(
          produce((draft) => {
            draft.menus = newMenuList ?? [];
          }),
        );
      }

      setBindData(
        produce((draft) => {
          draft.userBindMenus.userList = newUserList;
          draft.userBindMenus.treeData = newTreeData;
          draft.menuBindUsers.userList = newUserList;
          draft.menuBindUsers.treeData = newSelectData;
        }),
      );
    } catch (error) {
      console.log('fetchData:error', error);
    }
  };

  /**
   * 获取 hrefIds, childrenIds
   * @param data
   */
  const extractIds = (data: TreeNode[]): { hrefIds: string[]; childrenIds: string[] } => {
    const hrefIds: string[] = [];
    const childrenIds: string[] = [];

    const traverse = (node: TreeNode) => {
      if (isEmpty(node.children)) {
        childrenIds.push(node.id);
      } else {
        hrefIds.push(node.id);
        node.children?.forEach(traverse);
      }
    };

    data.forEach(traverse);

    return { hrefIds, childrenIds };
  };
  /**
   * selectUser
   * @param e
   */
  const handleChangeTop = (e: any) => {
    console.log('handleChange:', e);
    indexMenusUser(e).then((res) => {
      if (res.success) {
        const { hrefIds, childrenIds } = extractIds(res.data);
        setBindData((prevData) => ({
          ...prevData,
          userBindMenus: {
            ...prevData.userBindMenus,
            selectUser: e,
            checkedKeys: childrenIds,
            hrefCheckedKeys: hrefIds,
          },
        }));
      }
    });
  };
  /**
   * 菜单绑定用户
   * @param value
   */
  const onLevel1Change = (value: any) => {
    console.log('onLevel1Change:', value);
    indexUsersMenu(value).then((res) => {
      if (res.success) {
        setBindData(
          produce((draft) => {
            draft.menuBindUsers.selectedLevel1 = value;
            draft.menuBindUsers.selectedLevel2 = '';
            draft.menuBindUsers.selectedLevel3 = '';
            draft.menuBindUsers.userIds = res.data.map((item: any) => item.id);
            draft.menuBindUsers.menuId = [value];

            const selectedOption = draft.menuBindUsers.treeData.find(
              (item: any) => item.value === value,
            );
            draft.menuBindUsers.options.level2Options = selectedOption?.children || [];
            draft.menuBindUsers.options.level3Options = [];
          }),
        );
      }
    });
  };

  const onLevel2Change = (value: any) => {
    console.log('onLevel2Change:', value);
    indexUsersMenu(value).then((res) => {
      if (res.success) {
        setBindData(
          produce((draft) => {
            draft.menuBindUsers.selectedLevel2 = value;
            draft.menuBindUsers.selectedLevel3 = '';
            draft.menuBindUsers.userIds = res.data.map((item: any) => item.id);
            draft.menuBindUsers.menuId = [value];

            const selectedLevel1 = draft.menuBindUsers.treeData.find(
              (item: any) => item.value === draft.menuBindUsers.selectedLevel1,
            );
            const selectedOption = selectedLevel1?.children?.find(
              (item: any) => item.value === value,
            );
            draft.menuBindUsers.options.level3Options = selectedOption?.children || [];
          }),
        );
      }
    });
  };

  const onLevel3Change = (value: any) => {
    console.log('onLevel3Change:', value);
    indexUsersMenu(value).then((res) => {
      if (res.success) {
        setBindData(
          produce((draft) => {
            draft.menuBindUsers.selectedLevel3 = value;
            draft.menuBindUsers.userIds = res.data.map((item: any) => item.id);
            draft.menuBindUsers.menuId = [value];
          }),
        );
      }
    });
  };

  const onUserChange = (userId: string, checked: boolean) => {
    setBindData(
      produce((draft) => {
        if (checked && !draft.menuBindUsers.userIds.includes(userId)) {
          draft.menuBindUsers.userIds.push(userId);
          console.log('checkbox 选中',checked,userId)
        } else if (!checked) {
          draft.menuBindUsers.userIds = draft.menuBindUsers.userIds.filter((id) => id !== userId);
          console.log('checkbox 取消选中',checked,draft.menuBindUsers.userIds.filter((id) => id !== userId))
        }
      }),
    );
  };
  const fetchUpdatedPermissions = () => {
    indexUsersMenu(bindData.menuBindUsers.menuId[0]).then((res) => {
      console.log('更新后的权限:', res.data);
    });
  };
  const onSubmit = () => {
    console.log('onSubmit--onSubmit',bindData.menuBindUsers.userIds,bindData.menuBindUsers.menuId)
    try {
      updateUsersMenus({
        menu_ids: bindData.menuBindUsers.menuId,
        user_ids: bindData.menuBindUsers.userIds,
      }).then((res) => {
        if (res.success) {
          closeModal();
          success('绑定成功');
          actionRef.current?.reload();
          fetchUpdatedPermissions();
          return
        }
        error(res.message);
      });
    } catch (error) {
      console.log('onSubmit', error);
    }
  };
  /**
   * 勾选
   * @param checkedKeysValue
   * @param e
   */
  const handleCheck = (checkedKeysValue: any, e: any) => {
    setBindData((prevData) => ({
      ...prevData,
      userBindMenus: {
        ...prevData.userBindMenus,
        checkedKeys: checkedKeysValue,
        parents: e.halfCheckedKeys,
      },
    }));
  };
  const submitBind = () => {
    console.log('用户绑定菜单',[bindData.userBindMenus.selectUser],[...bindData.userBindMenus.parents, ...bindData.userBindMenus.checkedKeys])
    updateUsersMenus({
      user_ids: [bindData.userBindMenus.selectUser],
      menu_ids: [...bindData.userBindMenus.parents, ...bindData.userBindMenus.checkedKeys],
    }).then((res) => {
      if (res.success) {
        closeModal();
        success('绑定成功');
        actionRef.current?.reload();
        return;
      }
      error(res.message);
    });
  };

  //Table
  const getCurrent = (current) => {
    // console.log('current', current)
    setFormData(
      produce((draft) => {
        draft.currentItem = current;
      }),
    );
    showMenu(current.id).then((res) => {
      if (res.success) {
        console.log('showMenu--showMenu--showMenu',res.data);

        form.setFieldsValue({
          name: res.data?.name ?? '',
          icon: res.data?.icon ?? '',
          pid: res.data.pid ?? '',
          path: res.data.path ?? '',
          sort_by: res.data?.sort_by ?? '',
        });
      }
    });
  };
  /**
   * create or update
   */
  const handleFinished = (values: any) => {
    let params = {
      name: values.name ?? '',
      icon: values.icon ?? '',
      pid: values.pid ?? 0,
      path: values.path ?? '',
      sort_by: values.sort_by ?? '',
    } ;
    if (isEmpty(formData.currentItem)) {

      createMenu(params).then((res) => {
        if (res.success) {
          closeModal();
          actionRef.current?.reload();
          success('添加成功');
          return;
        }
        error(res.message);
      });
    }
    params = {
      ...params,
      id: formData.currentItem?.id,
    };
    updateMenu(params).then((res) => {
      if (res.success) {
        closeModal();
        actionRef.current?.reload();
        success('更新成功');
        return;
      }
      error(res.message);
    });
  };
  /**
   * delete
   */
  const handleDelete = (entity) => {
    deleteMenu(entity.id).then((res) => {
      if (res.success) {
        actionRef.current?.reload();
        success('删除成功');
        return;
      }
      error(res.message);
    });
  };
  useEffect(() => {
    fetchData().then(() => {
      setBindData(
        produce((draft) => {
          draft.menuBindUsers.options.level1Options = draft.menuBindUsers.treeData;
        }),
      );
    });

    setFormData(
      produce((draft) => {
        draft.columnsStateMap = getStateMap(pathname);
      }),
    );

    // if (isEmpty(formData.currentItem)) {
    //   return;
    // }
    // showMenu(formData.currentItem.id).then((res) => {
    //   if (res.success) {
    //     console.log('showMenu--showMenu--showMenu',res.data);
    //
    //     form.setFieldsValue({
    //       name: res.data?.name ?? '',
    //       icon: res.data?.icon ?? '',
    //       pid: res.data.pid ?? '',
    //       path: res.data.path ?? '',
    //       level: res.data.level ?? '',
    //       sort_by: res.data?.sort_by ?? '',
    //     });
    //   }
    // });
  }, []);
  return {
    form,
    actionRef,
    contextHolder,
    success,
    error,
    fetchListData,
    modalStatus,
    openModal,
    closeModal,
    bindData,
    handleChangeTop,
    handleCheck,
    submitBind,
    onLevel1Change,
    onLevel2Change,
    onLevel3Change,
    onUserChange,
    onSubmit,
    getCurrent,
    handleDelete,
    formData,
    onChangeColumnsStateMap,
    handleFinished,
  };
};

