export const akuntansi = [
    { label: 'Home', items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-th-large', to: '/' }] },
    {
        label: 'Management',
        items: [
            { label: 'Accounting', icon: 'pi pi-fw pi-chart-pie', items:[
                { label: 'Kurs Mandiri', icon: 'pi pi-fw pi-dollar', to: '/kurs-mandiri' },
                { label: 'Cash', icon: 'pi pi-fw pi-money-bill', to: '/cash' },
            ]},
            { label: 'Retail', icon: 'pi pi-fw pi-shopping-cart', items:[
                { label: 'Target', icon: 'pi pi-fw pi-chart-line', to: '/target' },
                { label: 'CPO', icon: 'pi pi-fw pi-filter-fill', to: '/cpo' },
                { label: 'Market', icon: 'pi pi-fw pi-shopping-cart', to: '/prop-cost' },
                { label: 'Average Price', icon: 'pi pi-fw pi-dollar', to: '/avg-price' },
                { label: 'Stock', icon: 'pi pi-fw pi-shopping-cart', to: '/stock' },
            ]},
            { label: 'Production', icon: 'pi pi-fw pi-building', items:[
                { label: 'Cost Production', icon: 'pi pi-fw pi-dollar', to: '/cost-prod' },
                { label: 'Detail Allocation', icon: 'pi pi-fw pi-sitemap', to: '/det-alloc' },
            ]},
        ]
    },
    {
        label: 'Reporting',
        items: [
            { label: 'Retail', icon: 'pi pi-fw pi-shopping-cart', items:[
                { label: 'Target', icon: 'pi pi-fw pi-chart-bar', to: '/target-report' },
                { label: 'Average Price', icon: 'pi pi-fw pi-dollar', to: '/avg-price-report' },
                { label: 'Market Routers', icon: 'pi pi-fw pi-chart-line', to: '/market-report' },
            ]},
            { label: 'Production', icon: 'pi pi-fw pi-building', items:[
                { label: 'Costing HPP', icon: 'pi pi-fw pi-list', to: '/costing-hpp' },
                { label: 'Allocation Cost', icon: 'pi pi-fw pi-table', to: '/alloc-cost' },
            ]},
        ]
    },
    {
        label: 'Configuration',
        items: [
            { label: 'General Leager', icon: 'pi pi-fw pi-shield', to: '/general-leager' },
            { label: 'Database', icon: 'pi pi-fw pi-database', to: '/database' },
            { label: 'Master Data', icon: 'pi pi-fw pi-server', 
                items:[
                    { label: 'Allocation', to: '/master-data/allocation' },
                    { label: 'Management Report', to: '/master-data/m_report' },
                    { label: 'Cost Centre', to: '/master-data/cost_centre' },
                    { label: 'Harga Satuan Prod.', to: '/master-data/harga_satuan' },
                    { label: 'Plant', to: '/master-data/plant' },
                    { label: 'Category', items:[
                        {label: 'Management', to: '/master-data/category/management'},
                        {label: 'Production', to: '/master-data/category/produksi'},
                    ] },
                    { label: 'Bulky', items:[
                        {label: 'Market', to: '/master-data/bulky/market'},
                        {label: 'Produksi', to: '/master-data/bulky/produksi'},
                    ] },
                    { label: 'Retail', to: '/master-data/retail' },
                ]
            },
        ]
    },
]

export const produksi = [
    { label: 'Home', items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-th-large', to: '/' }] },
    {
        label: 'Data',
        items: [
            { label: 'Data', icon: 'pi pi-fw pi-dollar', items:[
                { label: 'Production', icon: 'pi pi-fw pi-th-large'},
            ]},
            { label: 'Reporting', icon: 'pi pi-fw pi-book', items:[
                { label: 'Cost Production', icon: 'pi pi-fw pi-th-large', to: '/cost-prod' },
            ]},
        ]
    },
    {
        label: 'Master Data',
        items: [
            { label: 'Allocation', to: '/master-data/allocation' },
            { label: 'Plant', to: '/master-data/plant' },
            { label: 'Bulky Produksi', to: '/master-data/bulky/produksi'},
        ]
    },
]

export const logistik = [
    { label: 'Home', items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-th-large', to: '/' }] },
    {
        label: 'Master Data',
        items: [
            { label: 'Allocation', to: '/master-data/allocation' },
            { label: 'Plant', to: '/master-data/plant' },
            { label: 'Cost Centre', to: '/master-data/cost_centre' },
            { label: 'Bulky Market', to: '/master-data/bulky/market'},
        ]
    },
]

export const marketing = [
    { label: 'Home', items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-th-large', to: '/' }] },
]

export const sourcing = [
    { label: 'Home', items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-th-large', to: '/' }] },
]

export const view = [
    { label: 'Home', items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-th-large', to: '/' }] },
]