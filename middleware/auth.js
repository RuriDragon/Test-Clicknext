import { useLoginStore } from '~/store/login'
export default function (context) {

    const getCookieLogin = useCookie('isLogin');

    getCookieLogin.value = getCookieLogin.value || false

    const loginStore = useLoginStore()

    loginStore.initLogin(getCookieLogin.value)

    const isLogin = loginStore.getStatus

    if(context.path === '/' && isLogin){
        return navigateTo('/dashboard/home') 
    }

    if(context.path !== '/' && !isLogin){
        return navigateTo('/') 
    }

}