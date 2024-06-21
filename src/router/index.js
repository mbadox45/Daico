import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';
import RoomLayout from '@/views/finance/layout/Index.vue';
import AppLayout from '@/layout/AppLayout.vue';

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
                    component: () => import('@/views/finance/dashboard/Index2.vue'),
                    meta:{
                        guestOnly:true,
                        // requiresAuth: true,
                        // akunting:true,
                        // produksi:true,
                        // logistik:true,
                        // marketing:true,
                        // sourcing:true,
                        // view:true,
                    }
                },
            ]
        },
        {
            path: '/',
            component: AppLayout,
            redirect:'/home',
            children: [

                // Home
                {
                    path: '/home',
                    name: 'home',
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
                // Management ==============================================
                // Accounting ====================================
                {
                    path: '/kurs-mandiri',
                    name: 'kurs mandiri',
                    component: () => import('@/views/finance/accounting/kurs_mandiri/Index.vue'),
                    meta:{
                        requiresAuth: true,
                        akunting:true,
                        view:true,
                    }
                },
                {
                    path: '/cash',
                    name: 'cash',
                    component: () => import('@/views/finance/accounting/cash/Index.vue'),
                    meta:{
                        requiresAuth: true,
                        akunting:true,
                        view:true,
                    }
                },
                {
                    path: '/form-cash/',
                    name: 'form cash',
                    component: () => import('@/views/finance/accounting/cash/components/FormCash.vue'),
                    meta:{
                        requiresAuth: true,
                        akunting:true,
                        view:true,
                    }
                },
                // Retail     ====================================
                {
                    path: '/stock',
                    name: 'stock',
                    component: () => import('@/views/finance/accounting/stock/Index.vue'),
                    meta:{
                        requiresAuth: true,
                        akunting:true,
                        view:true,
                    }
                },
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
                    path: '/form-target',
                    name: 'form target',
                    component: () => import('@/views/finance/accounting/target/components/forms/FormTarget.vue'),
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
                    path: '/avg-price',
                    name: 'average price',
                    component: () => import('@/views/finance/accounting/avg_price/Index.vue'),
                    meta:{
                        requiresAuth: true,
                        akunting:true,
                        view:true,
                    }
                },
                {
                    path: '/form-avg-price/:status',
                    name: 'form average price',
                    component: () => import('@/views/finance/accounting/avg_price/components/FormPersediaanAwal.vue'),
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

                // Production
                {
                    path: '/cost-prod',
                    name: 'cost production',
                    component: () => import('@/views/finance/production/cost_prod/Index.vue'),
                    meta:{
                        requiresAuth: true,
                        akunting:true,
                        view:true,
                    }
                },
                {
                    path: '/costing-hpp',
                    name: 'Costing HPP',
                    component: () => import('@/views/finance/production/costing_hpp/Index.vue'),
                    meta:{
                        requiresAuth: true,
                        akunting:true,
                        view:true,
                    }
                },
                {
                    path: '/alloc-cost',
                    name: 'allocation cost',
                    component: () => import('@/views/finance/production/allocation_cost/Index.vue'),
                    meta:{
                        requiresAuth: true,
                        akunting:true,
                        view:true,
                    }
                },
                {
                    path: '/det-alloc',
                    name: 'Detail Allocation',
                    component: () => import('@/views/finance/production/det_alloc/Index.vue'),
                    meta:{
                        requiresAuth: true,
                        akunting:true,
                        view:true,
                    }
                },
                {
                    path: '/form-det-alloc',
                    name: 'Form Detail Allocation',
                    component: () => import('@/views/finance/production/det_alloc/components/FormDetAlloc.vue'),
                    meta:{
                        requiresAuth: true,
                        akunting:true,
                        view:true,
                    }
                },

                // REPORTING ==============================================

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
                    path: '/master-data/harga_satuan',
                    name: 'harga satuan produksi',
                    component: () => import('@/views/finance/config/master/components/HargaSatuanProdMaster.vue'),
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
                    path: '/master-data/category/management',
                    name: 'category - management',
                    component: () => import('@/views/finance/config/master/components/CategoryMaster.vue'),
                    meta:{
                        requiresAuth: true,
                        akunting:true,
                        view:true,
                    }
                },
                {
                    path: '/master-data/category/produksi',
                    name: 'category - production',
                    component: () => import('@/views/finance/config/master/components/CategoryProdMaster.vue'),
                    meta:{
                        requiresAuth: true,
                        akunting:true,
                        view:true,
                    }
                },
                {
                    path: '/master-data/bulky/market',
                    name: 'Bulky Market',
                    component: () => import('@/views/finance/config/master/components/BulkyMarketMaster.vue'),
                    meta:{
                        requiresAuth: true,
                        akunting:true,
                        view:true,
                    }
                },
                {
                    path: '/master-data/bulky/produksi',
                    name: 'Bulky Produksi',
                    component: () => import('@/views/finance/config/master/components/BulkyProduksiMaster.vue'),
                    meta:{
                        requiresAuth: true,
                        akunting:true,
                        view:true,
                    }
                },
                {
                    path: '/master-data/retail',
                    name: 'Retail Produksi',
                    component: () => import('@/views/finance/config/master/components/RetailProduksiMaster.vue'),
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
                    next('/home');
                }
            } else if (roles == 'produksi') {
                if (to.matched.some((route) => route.meta.produksi)) {
                    next();
                } else {
                    next('/home');
                }
            } else if (roles == 'logistik') {
                if (to.matched.some((route) => route.meta.logistik)) {
                    next();
                } else {
                    next('/home');
                }
            } else if (roles == 'marketing') {
                if (to.matched.some((route) => route.meta.marketing)) {
                    next();
                } else {
                    next('/home');
                }
            } else if (roles == 'sourcing') {
                if (to.matched.some((route) => route.meta.sourcing)) {
                    next();
                } else {
                    next('/home');
                }
            } else {
                if (to.matched.some((route) => route.meta.view)) {
                    next();
                } else {
                    next('/home');
                }
            }
        } else {
            next('/auth/login');
        }
    } else if (to.matched.some((route) => route.meta.guestOnly)) {
        if (tokens) {
            if (roles == 'akunting') {
                next('/home');
            } else if (roles == 'produksi') {
                next('/home');
            } else if (roles == 'logistik') {
                next('/home');
            } else if (roles == 'marketing') {
                next('/home');
            } else if (roles == 'sourcing') {
                next('/home');
            } else {
                next('/home');
            }
        } else {
            next();
        }
    } else {
        next();
    }
})

export default router;
