export const akuntansi = [
    { label: 'Home', items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-th-large', to: '/' }] },
    {
        label: 'Management',
        items: [
            { label: 'Data', icon: 'pi pi-fw pi-dollar', items:[
                { label: 'Target', icon: 'pi pi-fw pi-th-large', to: '/target' },
                { label: 'CPO', icon: 'pi pi-fw pi-th-large', to: '/cpo' },
                { label: 'Market', icon: 'pi pi-fw pi-th-large', to: '/prop-cost' },
            ]},
            { label: 'Reporting', icon: 'pi pi-fw pi-book', items:[
                { label: 'Average Price', icon: 'pi pi-fw pi-th-large', },
                { label: 'Costing HPP', icon: 'pi pi-fw pi-th-large', },
                { label: 'Cost Production', icon: 'pi pi-fw pi-th-large', to: '/cost-prod' },
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
                    { label: 'Category', to: '/master-data/category' },
                    { label: 'Bulky', items:[
                        {label: 'Market', to: '/master-data/bulky/market'},
                        {label: 'Produksi', to: '/master-data/bulky/produksi'},
                    ] },
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