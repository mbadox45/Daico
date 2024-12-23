import { cek_token } from "@/api/DataVariable.js";

export const akuntansi = [
    { label: 'Dashboard', items: [
        { label: 'Main Dashboard', icon: 'pi pi-fw pi-desktop', to: `${cek_token != null ? '/' : '/dashboard'}` },
        { label: 'Costing HPP', icon: 'pi pi-fw pi-th-large', to: `${cek_token != null ? '' : '/viewer'}/costing-hpp` },
        { label: '(BETA) Financial', icon: 'pi pi-fw pi-wallet', to: `${cek_token != null ? '' : '/viewer'}/financial-dashboard` },
        { label: '(BETA) Ops', icon: 'pi pi-fw pi-cog', to: `${cek_token != null ? '' : '/viewer'}/ops-dashboard` },
        { label: '(BETA) Transform', icon: 'pi pi-fw pi-sync', items:[
            { label: 'Cash Release', icon: 'pi pi-fw pi-money-bill', to: `${cek_token != null ? '' : '/viewer'}/cash-release` },
            { label: 'Commercial Excellence', icon: 'pi pi-fw pi-chart-bar', to: `${cek_token != null ? '' : '/viewer'}/commercial-excellence` },
            { label: 'Ops & SC Excellence', icon: 'pi pi-fw pi-truck', to: `${cek_token != null ? '' : '/viewer'}/ops-sc-excellence` },
            { label: '(BETA) Sales Performance', icon: 'pi pi-fw pi-chart-line', to: `${cek_token != null ? '' : '/viewer'}/mockup-dashboard` },
        ]}
    ] },
    {
        label: 'Management',
        items: [
            {label: 'Marketing', icon: 'pi pi-fw pi-list', items:[
                { label: 'Target', icon: 'pi pi-fw pi-chart-line', to: `${cek_token != null ? '' : '/viewer'}/target` },
                { label: 'CPO', icon: 'pi pi-fw pi-filter-fill', to: `${cek_token != null ? '' : '/viewer'}/cpo` },
                { label: 'Proportion Cost', icon: 'pi pi-fw pi-shopping-cart', to: `${cek_token != null ? '' : '/viewer'}/prop-cost` },
            ]},
            { label: 'Finance', icon: 'pi pi-fw pi-chart-pie', items:[
                { label: 'Kurs Mandiri', icon: 'pi pi-fw pi-dollar', to: `${cek_token != null ? '' : '/viewer'}/kurs-mandiri` },
                { label: 'Cash', icon: 'pi pi-fw pi-money-bill', to: `${cek_token != null ? '' : '/viewer'}/cash` },
                { label: 'General Ledger', icon: 'pi pi-fw pi-list', to: `${cek_token != null ? '' : '/viewer'}/general-leager` },
                { label: 'Database', icon: 'pi pi-fw pi-database', to: `${cek_token != null ? '' : '/viewer'}/database` },
            ]},
            { label: 'Stock', icon: 'pi pi-fw pi-box', items:[
                { label: 'Average Price', icon: 'pi pi-fw pi-dollar', to: `${cek_token != null ? '' : '/viewer'}/avg-price` },
                { label: 'Stock', icon: 'pi pi-fw pi-shopping-cart', to: `${cek_token != null ? '' : '/viewer'}/stock` },
            ]},
            { label: 'Production', icon: 'pi pi-fw pi-sitemap', items:[
                { label: 'Cost Production', icon: 'pi pi-fw pi-dollar', to: `${cek_token != null ? '' : '/viewer'}/cost-prod` },
                { label: 'Detail Allocation', icon: 'pi pi-fw pi-sitemap', to: `${cek_token != null ? '' : '/viewer'}/det-alloc` },
                { label: 'Allocation Cost', icon: 'pi pi-fw pi-table', to: `${cek_token != null ? '' : '/viewer'}/alloc-cost` },
            ]},
        ]
    },
    {
        label: 'Master',
        items: [
            {label: 'Report', icon: 'pi pi-fw pi-tablet', items:[
                { label: 'Allocation', to: '/master-data/allocation' },
                { label: 'Cost Centre', to: '/master-data/cost_centre' },
                { label: 'Management Report', to: '/master-data/m_report' },
            ]},
            {label: 'Location', icon: 'pi pi-fw pi-map-marker', items:[
                { label: 'Location', to: '/master-data/location' },
                { label: 'Plant', to: '/master-data/plant' },
                { label: 'Tank', to: '/master-data/tank' },
            ]},
            {label: 'Product', icon: 'pi pi-fw pi-gift', items:[
                { label: 'Harga Satuan Prod.', to: '/master-data/harga_satuan' },
                { label: 'Bulky', items:[
                    {label: 'Market', to: '/master-data/bulky/market'},
                    {label: 'Produksi', to: '/master-data/bulky/produksi'},
                ] },
                { label: 'Retail', items:[
                    {label: 'Market', to: '/master-data/retail/market'},
                    {label: 'Produksi', to: '/master-data/retail/produksi'},
                ] },
                { label: 'Product', items:[
                    {label: 'Main Product', to: '/master-data/produk/mainproduk'},
                    {label: 'Sub Product', to: '/master-data/produk/subproduk'},
                ] },
            ]},
            { label: 'Setting', to: '/master-data/setting', icon: 'pi pi-fw pi-wrench' },
            { label: 'Category', icon: 'pi pi-fw pi-folder-open', items:[
                {label: 'Management', to: '/master-data/category/management'},
                {label: 'Production', to: '/master-data/category/produksi'},
            ] },
            { label: 'Rekening', icon: 'pi pi-fw pi-wallet', items:[
                {label: 'Rekening', to: '/master-data/rekening/rekening'},
                {label: 'Jenis Rekening', to: '/master-data/rekening/jenis_rekening'},
                {label: 'Tipe Rekening', to: '/master-data/rekening/tipe_rekening'},
            ] },
        ]
    },
]
// to: `${cek_token != null ? '' : '/viewer'}/cash-release`

export const akuntansi2 = [
    { label: 'Dashboard', items: [
        { label: 'Main Dashboard', icon: 'pi pi-fw pi-desktop', to: `${cek_token != null ? '/' : '/dashboard'}` },
        { label: 'Costing HPP', icon: 'pi pi-fw pi-th-large', to: `${cek_token != null ? '' : '/viewer'}/costing-hpp` },
        { label: '(BETA) Financial', icon: 'pi pi-fw pi-wallet', to: `${cek_token != null ? '' : '/viewer'}/financial-dashboard` },
        { label: '(BETA) Ops', icon: 'pi pi-fw pi-cog', to: `${cek_token != null ? '' : '/viewer'}/ops-dashboard` },
        { label: '(BETA) Transform', icon: 'pi pi-fw pi-sync', items:[
            { label: 'Cash Release', icon: 'pi pi-fw pi-money-bill', to: `${cek_token != null ? '' : '/viewer'}/cash-release` },
            { label: 'Commercial Excellence', icon: 'pi pi-fw pi-chart-bar', to: `${cek_token != null ? '' : '/viewer'}/commercial-excellence` },
            { label: 'Ops & SC Excellence', icon: 'pi pi-fw pi-truck', to: `${cek_token != null ? '' : '/viewer'}/ops-sc-excellence` },
            { label: '(BETA) Sales Performance', icon: 'pi pi-fw pi-chart-line', to: `${cek_token != null ? '' : '/viewer'}/mockup-dashboard` },
        ]}
    ] },
    {
        label: 'Management',
        items: [
            {label: 'Marketing', icon: 'pi pi-fw pi-list', items:[
                { label: 'Target', icon: 'pi pi-fw pi-chart-line', to: `${cek_token != null ? '' : '/viewer'}/target` },
                { label: 'CPO', icon: 'pi pi-fw pi-filter-fill', to: `${cek_token != null ? '' : '/viewer'}/cpo` },
                { label: 'Proportion Cost', icon: 'pi pi-fw pi-shopping-cart', to: `${cek_token != null ? '' : '/viewer'}/prop-cost` },
            ]},
            { label: 'Finance', icon: 'pi pi-fw pi-chart-pie', items:[
                { label: 'Kurs Mandiri', icon: 'pi pi-fw pi-dollar', to: `${cek_token != null ? '' : '/viewer'}/kurs-mandiri` },
                { label: 'Cash', icon: 'pi pi-fw pi-money-bill', to: `${cek_token != null ? '' : '/viewer'}/cash` },
                { label: 'General Ledger', icon: 'pi pi-fw pi-list', to: `${cek_token != null ? '' : '/viewer'}/general-leager` },
                { label: 'Database', icon: 'pi pi-fw pi-database', to: `${cek_token != null ? '' : '/viewer'}/database` },
            ]},
            { label: 'Stock', icon: 'pi pi-fw pi-box', items:[
                { label: 'Average Price', icon: 'pi pi-fw pi-dollar', to: `${cek_token != null ? '' : '/viewer'}/avg-price` },
                { label: 'Stock', icon: 'pi pi-fw pi-shopping-cart', to: `${cek_token != null ? '' : '/viewer'}/stock` },
            ]},
            { label: 'Production', icon: 'pi pi-fw pi-sitemap', items:[
                { label: 'Cost Production', icon: 'pi pi-fw pi-dollar', to: `${cek_token != null ? '' : '/viewer'}/cost-prod` },
                { label: 'Detail Allocation', icon: 'pi pi-fw pi-sitemap', to: `${cek_token != null ? '' : '/viewer'}/det-alloc` },
                { label: 'Allocation Cost', icon: 'pi pi-fw pi-table', to: `${cek_token != null ? '' : '/viewer'}/alloc-cost` },
            ]},
        ]
    },
]