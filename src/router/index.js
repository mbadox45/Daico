import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';
import RoomLayout from '@/views/finance/layout/Index.vue';
import AppLayout from '@/layout/AppLayout.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            redirect:'/dashboard',
            children: [
                {
                    path: '/dashboard',
                    name: 'dashboard',
                    component: () => import('@/views/finance/dashboard/Index2.vue'),
                    meta:{
                        // guestOnly:true,
                        requiresAuth: true,
                        akunting:true,
                        produksi:true,
                        logistik:true,
                        marketing:true,
                        sourcing:true,
                        view:true,
                    }
                },

                // Accounting
                {
                    path: '/target',
                    name: 'target',
                    component: () => import('@/views/finance/accounting/target/Index.vue'),
                    meta:{
                        requiresAuth: true,
                        akunting:true,
                        view:true,
                    }
                },
                {
                    path: '/cpo',
                    name: 'cpo kpbn',
                    component: () => import('@/views/finance/accounting/cpokpbn/Index.vue'),
                    meta:{
                        requiresAuth: true,
                        akunting:true,
                        view:true,
                    }
                },
                {
                    path: '/prop-cost',
                    name: 'proportion cost',
                    component: () => import('@/views/finance/accounting/propcost/Index.vue'),
                    meta:{
                        requiresAuth: true,
                        akunting:true,
                        view:true,
                    }
                },

                // Reporting
                {
                    path: '/cost-prod',
                    name: 'cost production',
                    component: () => import('@/views/finance/reporting/costprod/Index.vue'),
                    meta:{
                        requiresAuth: true,
                        akunting:true,
                        view:true,
                    }
                },

                // Configuration
                {
                    path: '/database',
                    name: 'database',
                    component: () => import('@/views/finance/config/DatabasePage.vue'),
                    meta:{
                        requiresAuth: true,
                        akunting:true,
                        view:true,
                    }
                },
                {
                    path: '/general-leager',
                    name: 'general leager',
                    component: () => import('@/views/finance/config/GlPage.vue'),
                    meta:{
                        requiresAuth: true,
                        akunting:true,
                        view:true,
                    }
                },
                // Master Data 
                {
                    path: '/master-data/allocation',
                    name: 'allocation',
                    component: () => import('@/views/finance/config/master/components/AllocMaster.vue'),
                    meta:{
                        requiresAuth: true,
                        akunting:true,
                        view:true,
                    }
                },
                {
                    path: '/master-data/m_report',
                    name: 'management report',
                    component: () => import('@/views/finance/config/master/components/ReportMaster.vue'),
                    meta:{
                        requiresAuth: true,
                        akunting:true,
                        view:true,
                    }
                },
                {
                    path: '/master-data/cost_centre',
                    name: 'cost centre',
                    component: () => import('@/views/finance/config/master/components/CentreMaster.vue'),
                    meta:{
                        requiresAuth: true,
                        akunting:true,
                        view:true,
                    }
                },
                {
                    path: '/master-data/plant',
                    name: 'plant',
                    component: () => import('@/views/finance/config/master/components/PlantMaster.vue'),
                    meta:{
                        requiresAuth: true,
                        akunting:true,
                        view:true,
                    }
                },
                {
                    path: '/master-data/category',
                    name: 'category',
                    component: () => import('@/views/finance/config/master/components/CategoryMaster.vue'),
                    meta:{
                        requiresAuth: true,
                        akunting:true,
                        view:true,
                    }
                },
                {
                    path: '/master-data/bulky',
                    name: 'Bulky',
                    component: () => import('@/views/finance/config/master/components/BulkyMaster.vue'),
                    meta:{
                        requiresAuth: true,
                        akunting:true,
                        view:true,
                    }
                },
            ]
        },
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
            if (roles == 'akunting') {
                if (to.matched.some((route) => route.meta.akunting)) {
                    next();
                } else {
                    next('/dashboard');
                }
            } else if (roles == 'produksi') {
                if (to.matched.some((route) => route.meta.produksi)) {
                    next();
                } else {
                    next('/dashboard');
                }
            } else if (roles == 'logistik') {
                if (to.matched.some((route) => route.meta.logistik)) {
                    next();
                } else {
                    next('/dashboard');
                }
            } else if (roles == 'marketing') {
                if (to.matched.some((route) => route.meta.marketing)) {
                    next();
                } else {
                    next('/dashboard');
                }
            } else if (roles == 'sourcing') {
                if (to.matched.some((route) => route.meta.sourcing)) {
                    next();
                } else {
                    next('/dashboard');
                }
            } else {
                if (to.matched.some((route) => route.meta.view)) {
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
            if (roles == 'akunting') {
                next('/dashboard');
            } else if (roles == 'produksi') {
                next('/dashboard');
            } else if (roles == 'logistik') {
                next('/dashboard');
            } else if (roles == 'marketing') {
                next('/dashboard');
            } else if (roles == 'sourcing') {
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
