import axios from 'axios'
import {baseURL, delCookie} from '@/utils'
import router from '@/router'
import {ElMessage} from 'element-plus'
import store from "@/store"

axios.defaults.withCredentials = true

export function request(config) {
    const instance = axios.create({
        baseURL,
        timeout: 10000,
    })

    instance.interceptors.request.use(
        (config) => {
            return config
        },
        (err) => {
            console.log(err)
        }
    )

    instance.interceptors.response.use(
        (res) => {
            const {code, msg} = res.data
            if (code == 0) {

            } else if (code == 777 && router.currentRoute.value.fullPath != "/login") {
                store.commit("logout")
                delCookie("user")
                delCookie("user_sign")

                _.debounce(() => {
                    router.push('/login')
                },1500)()
            } else {
                ElMessage.error(msg)
            }

            return res.data
        },
        (err) => {
            console.log(err)
        }
    )

    return instance(config)
}
