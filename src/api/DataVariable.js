import moment from "moment/moment"
const date_now = moment().format('DD-MM-YYYY')
const date_ago =  moment().subtract(10, 'days').format('DD-MM-YYYY');

// Public Access
export const URL_WEB = 'https://e-survey.inl.co.id/';
// export const URL_WEB = 'http://36.92.181.10:3777/';
export const URL_API = 'http://36.92.181.10:3888/api/';
export const URL_WEB_Portal = 'https://portalapps.inl.co.id/';
export const URL_API_Portal = 'http://36.92.181.10:4763/api/';


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