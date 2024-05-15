import moment from "moment/moment"
const date_now = moment().format('DD-MM-YYYY')
const date_ago =  moment().subtract(10, 'days').format('DD-MM-YYYY');

// Public Access
export const URL_WEB = 'https://daico.inl.co.id/';
export const URL_API = 'https://daicoapi.salvaco.id/api/';
// export const URL_API = 'http://127.0.0.1:8000/api/';
export const URL_WEB_Portal = 'https://portalapps.salvaco.id/';
export const URL_API_Portal = 'https://portal-api.salvaco.id/api/';
export const URL_API_Odoo = 'https://odoo-api.inl.co.id/api/';

export const APP_ID = '22'
