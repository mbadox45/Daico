import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';
import RoomLayout from '@/views/finance/layout/Index.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: RoomLayout,
            redirect:'/dashboard',
            children: [
                {
                    path: '/dashboard',
                    name: 'dashboard',
                    component: () => import('@/views/finance/dashboard/Index.vue'),
                    meta:{
                        guestOnly:true,
                    }
                },
                {
                    path: '/master-database',
                    name: 'database',
                    component: () => import('@/views/finance/master/DatabasePage.vue'),
                    meta:{
                        guestOnly:true,
                    }
                },
                {
                    path: '/general-leager',
                    name: 'general leager',
                    component: () => import('@/views/finance/master/GlPage.vue'),
                    meta:{
                        guestOnly:true,
                    }
                },
                {
                    path: '/cpo-kpbn',
                    name: 'cpo kpbn',
                    component: () => import('@/views/finance/accounting/cpokpbn/Index.vue'),
                    meta:{
                        guestOnly:true,
                    }
                },
                {
                    path: '/prop-cost',
                    name: 'proportion cost',
                    component: () => import('@/views/finance/accounting/propcost/Index.vue'),
                    meta:{
                        guestOnly:true,
                    }
                },
            ]
        },
        // {
        //     path: '/',
        //     name: 'dashboard',
        //     component: () => import('@/views/finance/dashboard/Index.vue'),
        //     meta:{
        //         guestOnly:true,
        //     }
        // },
        {
            path: '/sign-out',
            name: 'signout',
            component: () => import('@/views/finance/auth/SignOut.vue'),
            meta:{
                requiresAuth: true,
                distributor:true,
            }
        },
        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/finance/auth/Login2.vue'),
            meta:{
                guestOnly:true,
            }
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'notfound',
            component: () => import('@/views/finance/auth/NotFound.vue')
        },
    ]
});

router.beforeEach((to, from, next) => {
    const tokens = localStorage.getItem('usertoken') != null;
    const roles = localStorage.getItem('roles');
    // console.log(roles);

    if (to.matched.some((route) => route.meta.requiresAuth)) {
        if (tokens) {
            if (roles == 'admin') {
                if (to.matched.some((route) => route.meta.admin)) {
                    next();
                } else {
                    next('/home');
                }
            } else {
                if (to.matched.some((route) => route.meta.distributor)) {
                    next();
                } else {
                    next('/beranda');
                }
            }
        } else {
            next('/auth/login');
        }
    } else if (to.matched.some((route) => route.meta.guestOnly)) {
        if (tokens) {
            if (roles == 'admin') {
                next('/home');
            } else {
                next('/beranda');
            }
        } else {
            next();
        }
    } else {
        next();
    }
})

export default router;
