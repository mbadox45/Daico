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
                        // guestOnly:true,
                        requiresAuth: true,
                        admin:true,
                        user:true,
                    }
                },
                {
                    path: '/database',
                    name: 'database',
                    component: () => import('@/views/finance/config/DatabasePage.vue'),
                    meta:{
                        requiresAuth: true,
                        admin:true,
                        user:true,
                    }
                },
                {
                    path: '/general-leager',
                    name: 'general leager',
                    component: () => import('@/views/finance/config/GlPage.vue'),
                    meta:{
                        requiresAuth: true,
                        admin:true,
                        user:true,
                    }
                },
                {
                    path: '/master-data',
                    name: 'master data',
                    component: () => import('@/views/finance/config/master/Index.vue'),
                    meta:{
                        requiresAuth: true,
                        admin:true,
                        user:true,
                    }
                },
                {
                    path: '/target',
                    name: 'target',
                    component: () => import('@/views/finance/accounting/target/Index.vue'),
                    meta:{
                        requiresAuth: true,
                        admin:true,
                        user:true,
                    }
                },
                {
                    path: '/cpo-kpbn',
                    name: 'cpo kpbn',
                    component: () => import('@/views/finance/accounting/cpokpbn/Index.vue'),
                    meta:{
                        requiresAuth: true,
                        admin:true,
                        user:true,
                    }
                },
                {
                    path: '/prop-cost',
                    name: 'proportion cost',
                    component: () => import('@/views/finance/accounting/propcost/Index.vue'),
                    meta:{
                        requiresAuth: true,
                        admin:true,
                        user:true,
                    }
                },
                {
                    path: '/cost-prod',
                    name: 'cost production',
                    component: () => import('@/views/finance/reporting/costprod/Index.vue'),
                    meta:{
                        requiresAuth: true,
                        admin:true,
                        user:true,
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
                user:true,
            }
        },
        {
            path: '/verify/:id',
            name: 'verify',
            component: () => import('@/views/finance/auth/Verify.vue'),
            meta:{
                guestOnly:true,
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
                    next('/dashboard');
                }
            } else {
                if (to.matched.some((route) => route.meta.user)) {
                    next();
                } else {
                    next('/dashboard');
                }
            }
        } else {
            next('/auth/login');
        }
    } else if (to.matched.some((route) => route.meta.guestOnly)) {
        if (tokens) {
            if (roles == 'admin') {
                next('/dashboard');
            } else {
                next('/dashboard');
            }
        } else {
            next();
        }
    } else {
        next();
    }
})

export default router;
