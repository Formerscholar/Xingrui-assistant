import {createRouter, createWebHistory} from 'vue-router'
import {getCookie} from "../utils";

const Home = () => import(/* webpackChunkName: "home" */ '@/views/Home/Home.vue')
const Login = () => import(/* webpackChunkName: "Login" */ '@/views/Login/Login.vue')
const Personal = () => import(/* webpackChunkName: "personal" */ '@/views/Personal/Personal.vue')
const Password = () => import(/* webpackChunkName: "personal" */ '@/views/Personal/Password.vue')
const Error = () => import(/* webpackChunkName: "error" */ '@/views/Error.vue')

//控制台
const Index = () => import(/* webpackChunkName: "index" */ '@/views/Index/Index')
//机构管理
const BuyType = () => import(/* webpackChunkName: "BuyType" */ '@/views/BuyType/index.vue')
const Institution = () => import(/* webpackChunkName: "institution" */ '@/views/Institution/Institution.vue')
const School = () => import(/* webpackChunkName: "school" */ '@/views/School/School.vue')
const Teacher = () => import(/* webpackChunkName: "TeacherManager" */ '@/views/Teacher/Teacher.vue')
const TeacherDetail = () => import( /* webpackChunkName: "TeacherManager" */ '@/views/TeacherDetail/TeacherDetail.vue' )
const Student = () => import(/* webpackChunkName: "StudentManager" */ '@/views/Student/Student.vue')
const StudentDetail = () => import( /* webpackChunkName: "StudentManager" */ '@/views/StudentDetail/StudentDetail.vue')
//教务管理
const Course = () => import(/* webpackChunkName: "course" */ '@/views/Course/Course.vue')
const Timetable = () => import(/* webpackChunkName: "timetable" */ '@/views/Timetable')
const Team = () => import(/* webpackChunkName: "team" */ '@/views/Team/Team.vue')
const TeamDetail = () => import(/* webpackChunkName: "team" */ '@/views/TeamDetail')
//课时管理
const Study = () => import(/* webpackChunkName: "study" */ '@/views/Study/Study.vue')
const StudyEdit = () => import(/* webpackChunkName: "study" */ '@/views/Study/StudyEdit.vue')
const StudyAdd = () => import(/* webpackChunkName: "study" */ '@/views/Study/StudyAdd.vue')
const StudyDetail = () => import(/* webpackChunkName: "study" */ '@/views/Study/StudyDetail.vue')
const Buy = () => import(/* webpackChunkName: "buy" */ '@/views/Buy/Buy.vue')
//教学管理
const AllPaper = () => import(/* webpackChunkName: "Paper" */ '@/views/Paper/All.vue')
const MyPaper = () => import(/* webpackChunkName: "Paper" */ '@/views/Paper/Paper.vue')
const PaperDetail = () => import( /* webpackChunkName: "Paper" */ '@/views/PaperDetail/PaperDetail.vue')
const PreviewPaper = () => import(/* webpackChunkName: "Paper" */ '@/views/PreviewPaper/PreviewPaper.vue')
const MyMaterial = () => import(/* webpackChunkName: "MyMaterial" */ '@/views/MyMaterial')
const Report = () => import(/* webpackChunkName: "Report" */ '@/views/Report')
//资源库
const Bank = () => import(/* webpackChunkName: "RecourseStorage" */ '@/views/Bank/')
const Material = () => import(/* webpackChunkName: "RecourseStorage" */ '@/views/Material')
const Famous = () => import(/* webpackChunkName: "RecourseStorage" */ '@/views/Famous')

const routes = [
    {
        path: '/',
        name: 'Home',
        meta: {
            requireAuth: true
        },
        component: Home,
        children: [
            {
                path: '/',
                name: 'Index',
                component: Index,
            },
            {
                path: '/buytype',
                name: 'BuyType',
                component: BuyType,
            },
            {
                path: '/institution',
                name: 'Institution',
                component: Institution,
            },
            {
                path: '/school',
                name: 'School',
                component: School,
            },
            {
                path: '/teacher',
                name: 'Teacher',
                component: Teacher,
            },
            {
                path: '/teacher/detail/:id',
                name: 'TeacherDetail',
                component: TeacherDetail,
            },
            {
                path: '/student',
                name: 'Student',
                component: Student,
            },
            {
                path: '/student/detail/:id',
                name: 'StudentDetail',
                component: StudentDetail,
            },
            {
                path: '/course',
                name: 'Course',
                component: Course,
            },
            {
                path: '/timetable',
                name: 'Timetable',
                component: Timetable,
            },
            {
                path: '/team',
                name: 'Team',
                component: Team,
            },
            {
                path: '/team_detail/:id',
                name: 'TeamDetail',
                component: TeamDetail
            },
            {
                path: '/study',
                name: 'Study',
                component: Study,
            },
            {
                path: '/study/add',
                name: 'StudyAdd',
                component: StudyAdd,
            },
            {
                path: '/study/edit/:id',
                name: 'StudyEdit',
                component: StudyEdit,
            },
            {
                path: '/study/detail/:id',
                name: 'StudyDetail',
                component: StudyDetail,
            },
            {
                path: '/buy',
                name: 'Buy',
                component: Buy,
            },
            {
                path: '/paper',
                name: 'AllPaper',
                component: AllPaper,
            },
            {
                path: '/mypaper',
                name: 'MyPaper',
                component: MyPaper,
            },
            {
                path: '/paper/detail/:id',
                name: 'PaperDetail',
                component: PaperDetail,
            },
            {
                path: '/preview_paper',
                name: 'PreviewPaper',
                component: PreviewPaper,
            },
            {
                path: '/preview_edit/:id',
                name: 'preview_edit',
                component: PreviewPaper,
            },
            {
                path: '/mymaterial',
                name: 'MyMaterial',
                component: MyMaterial
            },
            {
                path: '/report',
                name: 'Report',
                component: Report
            },
            {
                path: '/bank',
                name: 'Bank',
                component: Bank,
            },
            {
                path: '/material',
                name: 'Material',
                component: Material
            },
            {
                path: '/famous',
                name: 'Famous',
                component: Famous
            },
            {
                path: '/personal',
                name: 'Personal',
                component: Personal,
            },
            {
                path: '/password',
                name: 'Password',
                component: Password,
            }
        ],
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
    },
    {
        path:'/:catchAll(.*)*',
        component:Error
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
})

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requireAuth)) { // 判断该路由是否需要登录权限

        if (getCookie("user")) { // 判断当前的token是否存在 ； 登录存入的token
            next();
        } else {
            next({
                path: '/login',
                query: {redirect: to.fullPath} // 将跳转的路由path作为参数，登录成功后跳转到该路由
            })
        }
    } else {
        next();
    }

})

export default router
