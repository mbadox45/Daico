import { cek_token } from "@/api/DataVariable.js";

export const akuntansi = [
    { label: 'Home', items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-th-large', to: `${cek_token != null ? '/' : '/dashboard'}` }] },
    {
        label: 'Management',
        items: [
            { label: 'Accounting', icon: 'pi pi-fw pi-chart-pie', items:[
                { label: 'Kurs Mandiri', icon: 'pi pi-fw pi-dollar', to: `${cek_token != null ? '' : '/viewer'}/kurs-mandiri` },
                { label: 'Cash', icon: 'pi pi-fw pi-money-bill', to: `${cek_token != null ? '' : '/viewer'}/cash` },
            ]},
            { label: 'Retail', icon: 'pi pi-fw pi-shopping-cart', items:[
                { label: 'Target', icon: 'pi pi-fw pi-chart-line', to: `${cek_token != null ? '' : '/viewer'}/target` },
                { label: 'CPO', icon: 'pi pi-fw pi-filter-fill', to: `${cek_token != null ? '' : '/viewer'}/cpo` },
                { label: 'Market', icon: 'pi pi-fw pi-shopping-cart', to: `${cek_token != null ? '' : '/viewer'}/prop-cost` },
                { label: 'Average Price', icon: 'pi pi-fw pi-dollar', to: `${cek_token != null ? '' : '/viewer'}/avg-price` },
                { label: 'Stock', icon: 'pi pi-fw pi-shopping-cart', to: `${cek_token != null ? '' : '/viewer'}/stock` },
            ]},
            { label: 'Production', icon: 'pi pi-fw pi-building', items:[
                { label: 'Cost Production', icon: 'pi pi-fw pi-dollar', to: `${cek_token != null ? '' : '/viewer'}/cost-prod` },
                { label: 'Detail Allocation', icon: 'pi pi-fw pi-sitemap', to: `${cek_token != null ? '' : '/viewer'}/det-alloc` },
                { label: 'Costing HPP', icon: 'pi pi-fw pi-list', to: `${cek_token != null ? '' : '/viewer'}/costing-hpp` },
                { label: 'Allocation Cost', icon: 'pi pi-fw pi-table', to: `${cek_token != null ? '' : '/viewer'}/alloc-cost` },
            ]},
        ]
    },
    {
        label: 'Configuration',
        items: [
            { label: 'General Leager', icon: 'pi pi-fw pi-shield', to: `${cek_token != null ? '' : '/viewer'}/general-leager` },
            { label: 'Database', icon: 'pi pi-fw pi-database', to: `${cek_token != null ? '' : '/viewer'}/database` },
            { label: 'Master Data', icon: 'pi pi-fw pi-server', 
                items:[
                    { label: 'Allocation', to: '/master-data/allocation' },
                    { label: 'Location', to: '/master-data/location' },
                    { label: 'Management Report', to: '/master-data/m_report' },
                    { label: 'Cost Centre', to: '/master-data/cost_centre' },
                    { label: 'Harga Satuan Prod.', to: '/master-data/harga_satuan' },
                    { label: 'Plant', to: '/master-data/plant' },
                    { label: 'Setting', to: '/master-data/setting' },
                    { label: 'Tank', to: '/master-data/tank' },
                    { label: 'Category', items:[
                        {label: 'Management', to: '/master-data/category/management'},
                        {label: 'Production', to: '/master-data/category/produksi'},
                    ] },
                    { label: 'Rekening', items:[
                        {label: 'Rekening', to: '/master-data/rekening/rekening'},
                        {label: 'Jenis Rekening', to: '/master-data/rekening/jenis_rekening'},
                        {label: 'Tipe Rekening', to: '/master-data/rekening/tipe_rekening'},
                    ] },
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
                ]
            },
        ]
    },
]