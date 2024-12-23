import React, { useEffect, useState } from "react";
import { useLocation } from "umi";
import { wxLogin } from "@/services/ant-design-pro/login";
import { flushSync } from "react-dom";
import { LocalStorageService } from "@/utils/utils";
import { useModel } from "@@/exports";
import { history } from '@umijs/max';

const WXLogin: React.FC = () => {
    console.log('--- <WXLogin /> --- ');
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const { setInitialState } = useModel('@@initialState');
    const [loginState, setLoginState] = useState<number>(0);

    useEffect(() => {
        const code = queryParams.get('code');
        const uri = queryParams.get('uri');
        const source: string = queryParams.get('source_id') ?? '';
        const deleteBtn: string = queryParams.get('delete_btn') ?? '';
        const apply: string = queryParams.get('apply') ?? '';
        const del_order: string = queryParams.get('del_order') ?? '';
        const status: string = queryParams.get('status') ?? '';

        if (code === null || '' === code || uri === null || '' === uri) {
            setLoginState(2);
            return;
        }

        wxLogin({ code }).then(response => {
            if (!response.success) {
                setLoginState(2);
                return;
            }

            const { access_token: accessToken, token_type: tokenType, expires, user: currentUser } = response.data;
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
                history.push(`/mobile/${uri}?source=${source}&delete_btn=${deleteBtn}&apply=${apply}&del_order=${del_order}&status=${status}`);
                return;
            }

            setLoginState(2);
        })

    }, []);

    return <>
        {0 === loginState ? <div>登入中</div> : (1 === loginState ? <div>鉴权成功</div> : <div>鉴权失败</div>)}
    </>
}

export default WXLogin
