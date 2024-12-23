import Footer from '@/components/Footer';
import { login } from '@/services/ant-design-pro/api';
import {
    AlipayCircleOutlined,
    LockOutlined,
    TaobaoCircleOutlined,
    UserOutlined,
    WeiboCircleOutlined,
} from '@ant-design/icons';
import {
    LoginForm,
    ProFormCheckbox,
    ProFormText,
} from '@ant-design/pro-components';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { FormattedMessage, history, SelectLang, useIntl, useModel, Helmet } from '@umijs/max';
import { message, Tabs } from 'antd';
import Settings from '../../../../config/defaultSettings';
import React, { useState } from 'react';
import { flushSync } from 'react-dom';
import { LocalStorageService } from "@/utils/utils";

const ActionIcons = () => {
    const langClassName = useEmotionCss(({ token }) => {
        return {
            marginLeft: '8px',
            color: 'rgba(0, 0, 0, 0.2)',
            fontSize: '24px',
            verticalAlign: 'middle',
            cursor: 'pointer',
            transition: 'color 0.3s',
            '&:hover': {
                color: token.colorPrimaryActive,
            },
        };
    });

    return (
        <>
            <AlipayCircleOutlined key="AlipayCircleOutlined" className={langClassName} />
            <TaobaoCircleOutlined key="TaobaoCircleOutlined" className={langClassName} />
            <WeiboCircleOutlined key="WeiboCircleOutlined" className={langClassName} />
        </>
    );
};

const Lang = () => {
    const langClassName = useEmotionCss(({ token }) => {
        return {
            width: 42,
            height: 42,
            lineHeight: '42px',
            position: 'fixed',
            right: 16,
            borderRadius: token.borderRadius,
            ':hover': {
                backgroundColor: token.colorBgTextHover,
            },
        };
    });

    return (
        <div className={langClassName} data-lang="">
            {SelectLang && <SelectLang />}
        </div>
    );
};

const Login: React.FC = () => {
    const [type, setType] = useState<string>('account');
    const { setInitialState } = useModel('@@initialState');

    const containerClassName = useEmotionCss(() => {
        return {
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            overflow: 'auto',
            backgroundImage:
                "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
            backgroundSize: '100% 100%',
        };
    });

    const intl = useIntl();
    const handleSubmit = async (values: API.LoginParams) => {
        const defaultLoginFailureMessage = intl.formatMessage({
            id: 'pages.login.failure',
            defaultMessage: '登录失败，请重试！',
        });

        const hide = message.loading('登入中');
        try {
            const result = await login({ ...values, type });
            hide();
            if (!result.success) {
                message.error(result.message);
                return;
            }

            const { access_token: accessToken, token_type: tokenType, expires, user: currentUser } = result.data;
            if (currentUser) {
                const loginInfo = {
                    currentUser,
                    tokenType,
                    accessToken,
                    expires
                };
                flushSync(() => {
                    setInitialState((s) => ({
                        ...s,
                        ...loginInfo
                    }));
                });
                LocalStorageService.sync('loginInfo', loginInfo);
            }

            const urlParams = new URL(window.location.href).searchParams;
            history.push(urlParams.get('redirect') || '/'); // /financialDepartment/officeBack
            return;
        } catch (error) {
            message.error(defaultLoginFailureMessage);
            hide();
        }
    };

    return (
        <div className={containerClassName}>
            <Helmet>
                <title>
                    {intl.formatMessage({
                        id: 'menu.login',
                        defaultMessage: '登录页',
                    })}
                    - {Settings.title}
                </title>
            </Helmet>
            <Lang />
            <div
                style={{
                    flex: '1',
                    padding: '32px 0',
                }}
            >
                <LoginForm
                    contentStyle={{
                        minWidth: 280,
                        maxWidth: '75vw',
                    }}
                    // logo={<img alt="logo" src="/zhian-logo.png" />}
                    title="ZhiAn Design"
                    subTitle={intl.formatMessage({ id: 'pages.layouts.userLayout.title' })}
                    initialValues={{
                        autoLogin: true,
                    }}
                    // actions={[
                    //     <FormattedMessage
                    //         key="loginWith"
                    //         id="pages.login.loginWith"
                    //         defaultMessage="其他登录方式"
                    //     />,
                    //     <ActionIcons key="icons" />,
                    // ]}
                    onFinish={async (values) => {
                        await handleSubmit(values as API.LoginParams);
                    }}
                >
                    <Tabs
                        activeKey={type}
                        onChange={setType}
                        centered
                        items={[
                            {
                                key: 'account',
                                label: intl.formatMessage({
                                    id: 'pages.login.accountLogin.tab',
                                    defaultMessage: '账户密码登录',
                                }),
                            },
                        ]}
                    />

                    {type === 'account' && (
                        <>
                            <ProFormText
                                name="username"
                                fieldProps={{
                                    size: 'large',
                                    prefix: <UserOutlined />,
                                }}
                                placeholder={intl.formatMessage({
                                    id: 'pages.login.username.placeholder',
                                    defaultMessage: '请输入用户名',
                                })}
                                rules={[
                                    {
                                        required: true,
                                        message: (
                                            <FormattedMessage
                                                id="pages.login.username.required"
                                                defaultMessage="请输入用户名!"
                                            />
                                        ),
                                    },
                                ]}
                            />
                            <ProFormText.Password
                                name="password"
                                fieldProps={{
                                    size: 'large',
                                    prefix: <LockOutlined />,
                                }}
                                placeholder={intl.formatMessage({
                                    id: 'pages.login.password.placeholder',
                                    defaultMessage: '请输入密码',
                                })}
                                rules={[
                                    {
                                        required: true,
                                        message: (
                                            <FormattedMessage
                                                id="pages.login.password.required"
                                                defaultMessage="请输入密码！"
                                            />
                                        ),
                                    },
                                ]}
                            />
                        </>
                    )}

                    <div
                        style={{
                            marginBottom: 24,
                        }}
                    >
                        <ProFormCheckbox noStyle name="autoLogin">
                            <FormattedMessage id="pages.login.rememberMe" defaultMessage="自动登录" />
                        </ProFormCheckbox>
                    </div>
                </LoginForm>
            </div>
            <Footer />
        </div>
    );
};

export default Login;
