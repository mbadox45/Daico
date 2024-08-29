import moment from "moment/moment"
const date_now = moment().format('DD-MM-YYYY')
const date_ago =  moment().subtract(10, 'days').format('DD-MM-YYYY');

// Public Access
// export const URL_WEB = 'https://daico.inl.co.id/';
export const URL_WEB = 'http://localhost:8481/';
// export const URL_API = 'https://daicoapi.salvaco.id/api/';
// export const URL_API = 'http://192.168.4.88:8081/api/';
export const URL_API = 'http://192.168.1.223:3008/api/';
export const URL_WEB_Portal = 'https://portalapps.salvaco.id/';
export const URL_API_Portal = 'https://portal-api.salvaco.id/api/';
// export const URL_API_Odoo = 'https://odoo-api.salvaco.id/api/';
export const URL_API_Odoo = 'http://192.168.1.223:3003/api/';

export const APP_ID = '22'

export const cek_token = localStorage.getItem('usertoken');
