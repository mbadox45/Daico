import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';
// import AppLayout2 from '@/layout/layout_sso/AppLayout.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'Home',
            component: () => import('@/views/portofolio/home/Index.vue'),
            meta:{
                guestOnly:true,
            }
        },
        {
            path: '/sign-out',
            name: 'signout',
            component: () => import('@/views/survey/administrator/sign/SignOut.vue'),
            meta:{
                requiresAuth: true,
                distributor:true,
                // admin:true,
            }
        },
        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login2.vue'),
            meta:{
                guestOnly:true,
            }
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'notfound',
            component: () => import('@/views/survey/administrator/sign/NotFound.vue')
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
