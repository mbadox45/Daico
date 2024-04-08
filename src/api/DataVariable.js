import moment from "moment/moment"
const date_now = moment().format('DD-MM-YYYY')
const date_ago =  moment().subtract(10, 'days').format('DD-MM-YYYY');

// Public Access
export const URL_WEB = 'https://e-survey.inl.co.id/';
// export const URL_WEB = 'http://36.92.181.10:3777/';
export const URL_API = 'http://36.92.181.10:3888/api/';
export const URL_WEB_Portal = 'https://portalapps.inl.co.id/';
export const URL_API_Portal = 'http://36.92.181.10:4763/api/';

// // Server Access
// export const URL_WEB = 'http://192.168.1.223:8086/';
// export const URL_API = 'http://192.168.1.223:3001/api/';
// export const URL_WEB_Portal = 'http://192.168.1.223:8085/';
// export const URL_API_Portal = 'http://36.92.181.10:4763/api/';

// // Local Access
// export const URL_WEB = 'http://localhost:8086/';
// export const URL_API = 'http://localhost:8000/api/';
// export const URL_WEB_Portal = 'http://localhost:8085/';
// export const URL_API_Portal = 'http://36.92.181.10:4763/api/';

// List for dropdown
export const listAkses = [
    { name: 1, level_akses: 1 },
    { name: 2, level_akses: 2 },
    { name: 3, level_akses: 3 },
    { name: 4, level_akses: 4 },
    { name: 5, level_akses: 5 },
    { name: 6, level_akses: 6 },
    { name: 7, level_akses: 7 },
    { name: 8, level_akses: 8 },
    { name: 9, level_akses: 9 },
    { name: 10, level_akses: 10 },
];
export const listRequired = [
    { name: 'Required', require: 1 },
    { name: 'Optional', require: 0 },
];
export const listCategory = [
    { name: 'Kategori 1', category_id: 1 },
    { name: 'Kategori 2', category_id: 2 },
    { name: 'Kategori 3', category_id: 3 },
];
export const typeAnswer = [
    { name: 'Text (Type: Text)', type: 'text', icon:'/layout/icon/textinput.png' },
    { name: 'Text (Type: Number)', type: 'number', icon:'/layout/icon/number.png' },
    { name: 'Checkbox', type: 'checkbox', icon:'/layout/icon/checkbox.png' },
    { name: 'Radio', type: 'radio', icon:'/layout/icon/radio.png' },
    { name: 'Dropdown', type: 'dropdown', icon:'/layout/icon/dropdown.png' },
    { name: 'File', type: 'file', icon:'/layout/icon/file.png' },
    { name: 'Range', type: 'range', icon:'/layout/icon/range.png' },
];

// Menu Pertanyaan
export const settingPertanyaan = [
    {
        label: 'Options',
        items: [
            {
                label: 'Update',
                icon: 'pi pi-refresh',
                command: () => {
                    toast.add({ severity: 'success', summary: 'Updated', detail: 'Data Updated', life: 3000 });
                }
            },
            {
                label: 'Delete',
                icon: 'pi pi-times',
                command: () => {
                    toast.add({ severity: 'warn', summary: 'Delete', detail: 'Data Deleted', life: 3000 });
                }
            }
        ]
    },
    {
        label: 'Navigate',
        items: [
            {
                label: 'Vue Website',
                icon: 'pi pi-external-link',
                url: 'https://vuejs.org/'
            },
            {
                label: 'Router',
                icon: 'pi pi-upload',
                to: '/fileupload'
            }
        ]
    }
];


// Breadcrumb Variable
export const BreadcrumbHome =  { icon: 'pi pi-home', to: '/home' };

// Variable default Forms
export const formSurvey = {
    id: 0,
    desc: '',
    title: '',
    from: '',
    to: '',
    order_sp:[],
    value:[],
    question_order:'',
}
export const formUser = {
    id: 0,
    name: '',
    email: '',
}
export const formCategory = {
    id: 0,
    name: '',
}
export const formQuestion = {
    id: 0,
    category_id: 0,
    question: null,
    type: null,
    require: null,
    value:[],
    desc:[],
    extra:[],
}


// Data Bodong
export const listKategori = [
    {id:1, name:'Kategori 1'},
    {id:2, name:'Kategori 2'},
    {id:3, name:'Kategori 3'},
]
export const listuser = [
    {id:1, name:'CV Dimas Love You', email:'marketing@dly.co.id'},
    {id:2, name:'CV Dimas Karya', email:'marketing@cdk.co.id'},
    {id:3, name:'PT Mencari Cinta Dimas', email:'marketing@mcd.co.id'},
]
export const listSurvey = [
    {id:1, title:'Perkembangan Skill DCD', desc:'Dimas sedang diuji para pakar peneliti UNESCO terkait kemampuan bertanyanya.', from: date_ago, to: date_now, status:true},
    {id:2, title:'Hasil Skill Dimas', desc:'Hasil pengujian skill Dimas terhadap UNESCO, Erdogan ketar-ketir', from: date_ago, to: date_now, status:false},
    {id:3, title:'Dimas pembawa perdamaian dunia', desc:'Elite global ketar-ketir melihat skill Dimas', from: date_ago, to: date_now, status:true},
]

export const FormPreview = [
    {
        id:1,
        chapter:'Tingkat Kepentingan',
        categories:[
            {
                category_id:1,
                category:'Misi Dunia',
                survey:[
                    {
                        id:1,
                        pertanyaan:'Apa yang terjadi jika DMS tidak ada di muka bumi ini?',
                        type: 'text',
                        require:1,
                        jawaban: ''
                    },
                    {
                        id:2,
                        pertanyaan:'Apa saja yg di berbuat DMS untuk membawa perdamaian dunia?',
                        type: 'option',
                        require:0,
                        jawaban: [
                            {desc:'Menyelamatkan bumi dari kiamat sugra', value: 1},
                            {desc:'Menghancurkan dunia dan seisinya', value: 2},
                        ]
                    },
                ],
            },
            {
                category_id:2,
                category:'Visi Dunia',
                survey:[
                    {
                        id:3,
                        pertanyaan:'Mengapa DMS harus ada di bumi ini?',
                        type: 'text',
                        require:1,
                        jawaban: ''
                    },
                    {
                        id:4,
                        pertanyaan:'Bagaimana cara DMS bisa menyelamatkan dunia dari perang dunia?',
                        type: 'option',
                        require:1,
                        jawaban: [
                            {desc:'Kentut berjama`ah', value: 1},
                            {desc:'Bertanya kepada ahlinya dan melempar tanggung jawabnya ke oranglain', value: 2},
                            {desc:'Akhlak BUMN', value: 3},
                        ]
                    },
                ],
            },
        ]
    },
    {
        id:2,
        chapter:'Tingkat Kepuasan thd. Supplier Lain Sejenis',
        categories:[
            {
                category_id:1,
                category:'Misi Dunia',
                survey:[
                    {
                        id:1,
                        pertanyaan:'Apa yang terjadi jika DMS tidak ada di muka bumi ini?',
                        type: 'text',
                        require:1,
                        jawaban: ''
                    },
                    {
                        id:2,
                        pertanyaan:'Apa saja yg di berbuat DMS untuk membawa perdamaian dunia?',
                        type: 'option',
                        require:0,
                        jawaban: [
                            {desc:'Menyelamatkan bumi dari kiamat sugra', value: 1},
                            {desc:'Menghancurkan dunia dan seisinya', value: 2},
                        ]
                    },
                ],
            },
            {
                category_id:2,
                category:'Visi Dunia',
                survey:[
                    {
                        id:3,
                        pertanyaan:'Mengapa DMS harus ada di bumi ini?',
                        type: 'text',
                        require:1,
                        jawaban: ''
                    },
                    {
                        id:4,
                        pertanyaan:'Bagaimana cara DMS bisa menyelamatkan dunia dari perang dunia?',
                        type: 'option',
                        require:1,
                        jawaban: [
                            {desc:'Kentut berjama`ah', value: 1},
                            {desc:'Bertanya kepada ahlinya dan melempar tanggung jawabnya ke oranglain', value: 2},
                            {desc:'Akhlak BUMN', value: 3},
                        ]
                    },
                ],
            },
        ]
    },
]