export const akuntansi = [
    { label: 'Home', items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-th-large', to: '/' }] },
    {
        label: 'Management',
        items: [
            // { label: 'Data', icon: 'pi pi-fw pi-dollar', items:[
            // ]},
            { label: 'Target', icon: 'pi pi-fw pi-chart-line', to: '/target' },
            { label: 'CPO', icon: 'pi pi-fw pi-filter-fill', to: '/cpo' },
            { label: 'Market', icon: 'pi pi-fw pi-shopping-cart', to: '/prop-cost' },
            { label: 'Production', icon: 'pi pi-fw pi-building', items:[
                { label: 'Cost Production', icon: 'pi pi-fw pi-dollar', to: '/cost-prod' },
                { label: 'Detail Allocation', icon: 'pi pi-fw pi-sitemap', to: '/det-alloc' },
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