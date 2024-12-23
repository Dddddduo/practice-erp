import Footer from '@/components/Footer';
import { Question, SelectLang } from '@/components/RightContent';
import { TableOutlined, SmileOutlined, ControlOutlined, UserOutlined } from '@ant-design/icons';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import { SettingDrawer } from '@ant-design/pro-components';
import type { RunTimeLayoutConfig } from '@umijs/max';
import { history, Link } from '@umijs/max';
import defaultSettings from '../config/defaultSettings';
import { errorConfig } from './requestErrorConfig';
// import { currentUser as queryCurrentUser } from './services/ant-design-pro/api';
import React, { useEffect, useState } from 'react';
import { AvatarDropdown, AvatarName } from './components/RightContent/AvatarDropdown';
import { getCurrentTimeString, isPastDay, LocalStorageService } from "@/utils/utils";

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';
import { indexMenus } from './services/ant-design-pro/login';
import { getUserInfo } from "@/services/ant-design-pro/api";
import { isEmpty } from "lodash";
import { Modal, notification } from "antd";
import ResetPassword from "@/components/RightContent/ResetPassword";

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    console.log('app.tsx@fetchUserInfo')
    try {
      // const msg = await queryCurrentUser({
      //   skipErrorHandler: true,
      // });
      const { location } = history;
      const loginInfo = LocalStorageService.getItem('loginInfo');
      if (!loginInfo || !loginInfo.currentUser) {
        history.push(`/user/login?redirect=${location.pathname}`);
      }
      return loginInfo?.currentUser ?? undefined;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };
  // 如果不是登录页面，执行
  const { location } = history;
  const mobileLoginPath = '/mobile/login';
  if (location.pathname.includes('/mobile/')) {
    if (location.pathname !== mobileLoginPath) {
      const currentUser = await fetchUserInfo();
      return {
        fetchUserInfo,
        currentUser,
        settings: defaultSettings as Partial<LayoutSettings>,
      };
    }

    return {
      settings: defaultSettings as Partial<LayoutSettings>,
    }
  }
  if (location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings as Partial<LayoutSettings>,
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings as Partial<LayoutSettings>,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  console.log('app.tsx@RunTimeLayoutConfig')

  const [api, contextHolder] = notification.useNotification();
  const [showResetPassword, setShowResetPassword] = useState(false)

  const openNotification = () => {
    api.info({
      key: 1,
      duration: null,
      message: '提示',
      onClose: () => {
        const time = getCurrentTimeString()
        console.log(time)
        LocalStorageService.setItem('isCloseTime', time)
      },
      description:
        <>
          <div>
            您的密码过于简单， 请
            <a
              onClick={() => {
                setShowResetPassword(true)
                const time = getCurrentTimeString()
                LocalStorageService.setItem('isCloseTime', time)
              }}
            >修改密码</a>
          </div>
        </>
    });
  };

  const handleCloseResetPassword = () => {
    setShowResetPassword(false)
  }

  const verifyPassword = () => {
    const { currentUser } = LocalStorageService.getItem('loginInfo')

    const date = new Date(currentUser?.password_updated_at ?? '')

    if (currentUser?.password_updated_at && !isNaN(date?.getTime())) {
      return
    }

    const isCloseTime = LocalStorageService.getItem('isCloseTime')
    if (isEmpty(isCloseTime) || isPastDay(isCloseTime)) { // 如何本地没有值，或者过去了一天都弹出
      openNotification()
    }

  }


  useEffect(() => {
    verifyPassword()
  }, []);

  return {
    actionsRender: () => [<SelectLang key="SelectLang" />],
    avatarProps: {
      src: initialState?.currentUser?.avatar,
      title: <AvatarName />,
      render: (_, avatarChildren) => {
        return <AvatarDropdown>{avatarChildren}</AvatarDropdown>;
      },
    },
    waterMarkProps: {
      content: initialState?.currentUser?.username,
    },
    menu: {
      // 每当 initialState?.currentUser?.userid 发生修改时重新执行 request
      params: {
        userId: initialState?.currentUser?.id,
      },
      request: async (params, defaultMenuData) => {
        let iconMappings: any = {
          // welcome: <SmileOutlined />,
          // order: <TableOutlined />,
          // project: <TableOutlined />,
          // system: <UserOutlined />,
          // accessControl: <ControlOutlined />,
          // financialDepartment: <TableOutlined />,
        }
        defaultMenuData.map((item: any) => {
          iconMappings[item?.name] = <TableOutlined />
          if (item.name === 'welcome') {
            iconMappings.welcome = <SmileOutlined />
          }
          if (item.name === 'system') {
            iconMappings.system = <UserOutlined />
          }
          if (item.name === 'accessControl') {
            iconMappings.accessControl = <ControlOutlined />
          }
        })
        let formatData = []

        try {
          // initialState.currentUser 中包含了所有用户信息
          const menuData = await indexMenus();

          formatData = menuData.data.map(item => {
            if (item.name in iconMappings) {
              // item.path = `/${item.name}`
              item.icon = iconMappings[item.name]
              // item.children.map(value => {
              //   value.path = `/${item.name}/${value.name}`
              // })
              return item
            }
            return item
          })
        } catch (e) {
          formatData = []
        }

        return [
          {
            path: '/welcome',
            name: 'welcome',
            icon: iconMappings.welcome,
            // component: './Welcome',
          },
          ...formatData,
        ];
      },
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      console.log("location.pathname", location.pathname)
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(`/user/login?redirect=${location.pathname}`);
      }
    },
    layoutBgImgList: [
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/D2LWSqNny4sAAAAAAAAAAAAAFl94AQBr',
        left: 85,
        bottom: 100,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/C2TWRpJpiC0AAAAAAAAAAAAAFl94AQBr',
        bottom: -68,
        right: -45,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/F6vSTbj8KpYAAAAAAAAAAAAAFl94AQBr',
        bottom: 0,
        left: 0,
        width: '331px',
      },
    ],
    // links: isDev
    //   ? [
    //       <Link key="openapi" to="/umi/plugin/openapi" target="_blank">
    //         <LinkOutlined />
    //         <span>OpenAPI 文档</span>
    //       </Link>,
    //     ]
    //   : [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {contextHolder}
          {children}
          <SettingDrawer
            disableUrlParams
            enableDarkTheme
            settings={initialState?.settings}
            onSettingChange={(settings) => {
              setInitialState((preInitialState) => ({
                ...preInitialState,
                settings,
              }));
            }}
          />
          <Modal
            width={600}
            open={showResetPassword}
            onCancel={handleCloseResetPassword}
            title={'重置密码'}
            footer={null}
            destroyOnClose={true}
          >
            <ResetPassword handleCloseResetPassword={handleCloseResetPassword} />
          </Modal>
        </>
      );
    },
    ...initialState?.settings,
    // title: '',
  };
};

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request = {
  ...errorConfig,
};
