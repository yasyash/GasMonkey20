/*
 * Copyright © 2018-2022 Yaroslav Shkliar <mail@ilit.ru>
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3.0 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Research Laboratory of IT
 * www.ilit.ru on e-mail: mail@ilit.ru
 * Also you сould open support domain www.cleenair.ru or write to e-mail: mail@cleenair.ru
 */

import Axios from "axios";
import format from 'node.date-time';

import shortid from 'shortid';
import isEmpty from 'lodash.isempty';
import FileDownload from 'js-file-download';

function wrapData(data_in) {
    const data = data_in.map(item => {
        const _id = shortid.generate();


        Object.assign(item, { _id: _id });
        return item;
    });
    return data;
}

//service handle
export function stopService(paramstr) {

    // const data = JSON.stringify(paramstr);
    //  console.log('parameters is ', data);
    return dispatch => {
        return Axios.post('/api/admin/service_stop', { id: paramstr })
            .then(resp => resp)
    };
};

export function startService(paramstr) {

    // const data = JSON.stringify(paramstr);
    //  console.log('parameters is ', data);
    return dispatch => {
        return Axios.post('/api/admin/service_start', { id: paramstr })
            .then(resp => resp)
    };
};

export function deleteService(paramstr) {

    // const data = JSON.stringify(paramstr);
    //  console.log('parameters is ', data);
    return dispatch => {
        return Axios.post('/api/admin/service_del', { id: paramstr, is_present: false })
            .then(resp => resp)
    };
};

export function deactivateService(paramstr) {

    // const data = JSON.stringify(paramstr);
    //  console.log('parameters is ', data);
    return dispatch => {
        return Axios.post('/api/admin/service_del', { id: paramstr, is_present: true })
            .then(resp => resp)
    };
};

export function updateService(paramstr) {

    // const data = JSON.stringify(paramstr);
    //  console.log('parameters is ', data);
    return dispatch => {
        return Axios.post('/api/admin/service_update', ...paramstr)
            .then(resp => resp)
    };
};
export function insertService(paramstr) {

    // const data = JSON.stringify(paramstr);
    //  console.log('parameters is ', data);
    return dispatch => {
        return Axios.post('/api/admin/service_insert', paramstr)
            .then(resp => {

                return resp
            })
    };
};

export function getService() {

    // const data = JSON.stringify(paramstr);
    //  console.log('parameters is ', data);
    return dispatch => {
        return Axios.get('/api/admin/service_get')
            .then(resp => {
                let srv_list = [];
                let data = resp.data.srv_list;
                data.forEach(element => {
                    srv_list.push({

                        date_time: new Date(element.date_time).format('dd-MM-Y HH:mm:SS'),
                        descr: element.descr,
                        id: String(element.id),
                        init_str: element.init_str,
                        groups: element.groups,
                        parameter: element.parameter,
                        is_active: element.is_active
                    })

                });


                return wrapData(srv_list);
            })
    };
};

//server handle
export function deleteSrv(paramstr) {

    // const data = JSON.stringify(paramstr);
    //  console.log('parameters is ', data);
    return dispatch => {
        return Axios.post('/api/admin/srv_del', { id: paramstr })
            .then(resp => resp)
    };
};
export function updateSrv(paramstr) {

    // const data = JSON.stringify(paramstr);
    //  console.log('parameters is ', data);
    return dispatch => {
        return Axios.post('/api/admin/srv_update', ...paramstr)
            .then(resp => resp)
    };
};
export function insertSrv(paramstr) {

    // const data = JSON.stringify(paramstr);
    //  console.log('parameters is ', data);
    return dispatch => {
        return Axios.post('/api/admin/srv_insert', paramstr)
            .then(resp => {

                return resp
            })
    };
};

export function getSrv() {

    // const data = JSON.stringify(paramstr);
    //  console.log('parameters is ', data);
    return dispatch => {
        return Axios.get('/api/admin/srv_get')
            .then(resp => {
                let srv_list = [];
                let data = resp.data.srv_list;
                data.forEach(element => {
                    srv_list.push({

                        date_time: new Date(element.date_time).format('dd-MM-Y HH:mm:SS'),
                        serialnum: element.serialnum,
                        id: String(element.id),
                        name: element.name,
                        result: element.result,
                        person: element.person,
                        note: element.note,
                        inv_num: element.inv_num
                    })

                });


                return wrapData(srv_list);
            })
    };
};

//REST API 
export function insertApi(paramstr) {

    // const data = JSON.stringify(paramstr);
    //  console.log('parameters is ', data);
    return dispatch => {
        return Axios.post('/api/admin/api_insert', paramstr)
            .then(resp => resp)
    };
};

export function deleteApi(paramstr) {

    // const data = JSON.stringify(paramstr);
    //  console.log('parameters is ', data);
    return dispatch => {
        return Axios.post('/api/admin/api_del', { id: paramstr })
            .then(resp => resp)
    };
};


export function updateApi(paramstr) {

    // const data = JSON.stringify(paramstr);
    //  console.log('parameters is ', data);
    return dispatch => {
        return Axios.post('/api/admin/api_update', ...paramstr)
            .then(resp => resp)
    };
};

export function getApi() {

    // const data = JSON.stringify(paramstr);
    //  console.log('parameters is ', data);
    return dispatch => {
        return Axios.get('/api/admin/api_get')
            .then(resp => {
                let api_list = [];
                let data = resp.data.api_list;

                data.forEach(element => {
                    api_list.push({
                        indx: element.indx,
                        token: element.token,
                        uri: element.uri,
                        code: element.code,
                        msg_id: element.msg_id,
                        last_time: new Date(element.last_time).format('dd-MM-Y HH:mm:SS'),
                        date_time: new Date(element.date_time).format('dd-MM-Y HH:mm:SS'),
                        idd: String(element.idd),
                        id: String(element.id),
                        is_present: element.is_present ? "включен" : "выключен"
                    })

                });


                return wrapData(api_list);
            })
    };
};

//FTP API
export function getFtp() {

    // const data = JSON.stringify(paramstr);
    //  console.log('parameters is ', data);
    return dispatch => {
        return Axios.get('/api/admin/ftp_get')
            .then(resp => {
                let list = [];
                let data = resp.data.ftplist;

                data.forEach(element => {
                    list.push({
                        indx: element.indx,
                        address: element.address,
                        username: element.username,
                        pwd: element.pwd,
                        folder: element.folder,
                        name: element.name,
                        periods: element.periods,
                        date_time: new Date(element.date_time).format('dd-MM-Y HH:mm:SS'),
                        idd: String(element.id)
                    })

                });


                return wrapData(list);
            })
    };
};

export function updateFtp(paramstr) {

    // const data = JSON.stringify(paramstr);
    //  console.log('parameters is ', data);
    return dispatch => {
        return Axios.post('/api/admin/ftp_update', ...paramstr)
            .then(resp => resp)
    };
};

export function deleteFtp(paramstr) {

    // const data = JSON.stringify(paramstr);
    //  console.log('parameters is ', data);
    return dispatch => {
        return Axios.post('/api/admin/ftp_del', { id: paramstr })
            .then(resp => resp)
    };
};

export function insertFtp(paramstr) {

    // const data = JSON.stringify(paramstr);
    //  console.log('parameters is ', data);
    return dispatch => {
        return Axios.post('/api/admin/ftp_insert', paramstr)
            .then(resp => resp)
    };
};

///// SOAP

export function getSoap() {

    // const data = JSON.stringify(paramstr);
    //  console.log('parameters is ', data);
    return dispatch => {
        return Axios.get('/api/admin/soap_get')
            .then(resp => {
                let list = [];
                let data = resp.data.ftplist;

                data.forEach(element => {
                    list.push({
                        address: element.address,
                        is_present: element.is_present ? 'включена' : 'деактивирована',
                        login: element.login,
                        password_soap: element.password_soap,
                        updateperiod: element.updateperiod,
                        namestation: element.namestation,
                        useraccessright: element.useraccessright,
                        date_time_in: new Date(element.date_time_in).format('dd-MM-Y HH:mm:SS'),
                        idd: element.idd,
                        place: element.place,
                        latitude: element.latitude,
                        longitude: element.longitude
                    })

                });


                return wrapData(list);
            })
    };
};

export function updateSoap(paramstr) {

    // const data = JSON.stringify(paramstr);
    //  console.log('parameters is ', data);
    return dispatch => {
        return Axios.post('/api/admin/soap_update', ...paramstr)
            .then(resp => resp)
    };
};
export function activateSoap(paramstr) {

    // const data = JSON.stringify(paramstr);
    //  console.log('parameters is ', data);
    return dispatch => {
        return Axios.post('/api/admin/soap_activate', { id: paramstr })
            .then(resp => resp)
    };
};
export function deleteSoap(paramstr) {

    // const data = JSON.stringify(paramstr);
    //  console.log('parameters is ', data);
    return dispatch => {
        return Axios.post('/api/admin/soap_del', { id: paramstr })
            .then(resp => resp)
    };
};

export function insertSoap(paramstr) {

    // const data = JSON.stringify(paramstr);
    //  console.log('parameters is ', data);
    return dispatch => {
        return Axios.post('/api/admin/soap_insert', paramstr)
            .then(resp => resp)
    };
};

// User's API

export function getUser() {

    // const data = JSON.stringify(paramstr);
    //  console.log('parameters is ', data);
    return dispatch => {
        return Axios.get('/api/admin/user_get')
            .then(resp => {
                let list = [];
                let data = resp.data.userlist;

                data.forEach(element => {
                    list.push({
                        username: element.username,
                        email: element.email,
                        mobile: element.mobile,
                        created_at: new Date(element.created_at).format('dd-MM-Y HH:mm:SS'),
                        updated_at: new Date(element.updated_at).format('dd-MM-Y HH:mm:SS'),
                        is_active: element.is_active ? 'да' : 'нет',
                        is_admin: element.is_admin ? 'да' : 'нет',
                        idd: element.id
                    })

                });


                return wrapData(list);
            })
    };
};

export function updateUser(paramstr) {

    // const data = JSON.stringify(paramstr);
    //  console.log('parameters is ', data);
    return dispatch => {
        return Axios.post('/api/admin/user_update', ...paramstr)
            .then(resp => resp)
    };
};
export function updateSecurityUser(paramstr) {

    // const data = JSON.stringify(paramstr);
    //  console.log('parameters is ', data);
    return dispatch => {
        return Axios.post('/api/admin/user_security_update', ...paramstr)
            .then(resp => resp)
    };
};

export function deleteUser(paramstr) {

    // const data = JSON.stringify(paramstr);
    //  console.log('parameters is ', data);
    return dispatch => {
        return Axios.post('/api/admin/user_del', { id: paramstr })
            .then(resp => resp)
    };
};

export function insertUser(paramstr) {

    // const data = JSON.stringify(paramstr);
    //  console.log('parameters is ', data);
    return dispatch => {
        return Axios.post('/api/admin/user_insert', paramstr)
            .then(resp => resp)
    };
};

// Meteostation's API


export function getMeteo() {

    // const data = JSON.stringify(paramstr);
    //  console.log('parameters is ', data);
    return dispatch => {
        return Axios.get('/api/admin/meteo_get')
            .then(resp => {
                let list = [];
                let data = resp.data.userlist;

                data.forEach(element => {
                    list.push({
                        updateperiod: element.updateperiod,
                        namestation: element.namestation,
                        date_time_in: new Date(element.date_time_in).format('dd-MM-Y HH:mm:SS'),
                        idd: element.idd,
                        id: element.id,
                        folder: element.folder
                    })

                });


                return wrapData(list);
            })
    };
};

export function updateMeteo(paramstr) {

    // const data = JSON.stringify(paramstr);
    //  console.log('parameters is ', data);
    return dispatch => {
        return Axios.post('/api/admin/meteo_update', ...paramstr)
            .then(resp => resp)
    };
};


export function deleteMeteo(paramstr) {

    // const data = JSON.stringify(paramstr);
    //  console.log('parameters is ', data);
    return dispatch => {
        return Axios.post('/api/admin/meteo_del', { id: paramstr })
            .then(resp => resp)
    };
};

export function insertMeteo(paramstr) {

    // const data = JSON.stringify(paramstr);
    //  console.log('parameters is ', data);
    return dispatch => {
        return Axios.post('/api/admin/meteo_insert', paramstr)
            .then(resp => resp)
    };
};

//Equipment's API

export function getDev() {

    // const data = JSON.stringify(paramstr);
    //  console.log('parameters is ', data);
    return dispatch => {
        return Axios.get('/api/admin/dev_get')
            .then(resp => {
                var list = [];
                const stns = resp.data.stations_list;
                const devs = resp.data.dev_list;
                const macs = resp.data.macs_list;
                var idd_old = '';
                var filter = [];
                var macs_filter = [];

                devs.forEach(element => {
                    if (idd_old != element.idd) {
                        filter = stns.filter((item, i, arr) => {
                            return item.idd == element.idd;
                        });
                        if (filter.length > 0)
                            idd_old = filter[0].idd;
                    }
                    macs_filter = macs.filter((item, i, arr) => {
                        return item.chemical == element.typemeasure;
                    });
                    if (filter.length > 0)

                        list.push({
                            id: String(element.id),
                            namestation: filter[0].namestation,
                            idd: element.idd,
                            typemeasure: element.typemeasure,
                            serialnum: element.serialnum,
                            date_time_in: new Date(element.date_time_in).format('dd-MM-Y HH:mm:SS'),
                            date_time_out: new Date(element.date_time_out).format('dd-MM-Y HH:mm:SS'),
                            unit_name: element.unit_name,
                            def_colour: element.def_colour,
                            max_consentration: !isEmpty(macs_filter) ? ((macs_filter[0].max_m > 900) ? '' : Number(macs_filter[0].max_m)) : '',
                            max_day_consentration: !isEmpty(macs_filter) ? ((macs_filter[0].max_d > 900) ? '' : Number(macs_filter[0].max_d)) : '', //for absend limits
                            min_range: element.max_consentration,
                            max_range: element.max_day_consentration
                        })

                });


                return wrapData(list);
            })
    };
};

export function updateDev(paramstr) {

     //const data = JSON.stringify(paramstr);
     //console.log('parameters is ', data.min_range);
    return dispatch => {
        return Axios.post('/api/admin/dev_update', ...paramstr)
            .then(resp => resp)
    };
};


export function deleteDev(paramstr) {

    // const data = JSON.stringify(paramstr);
    //  console.log('parameters is ', data);
    return dispatch => {
        return Axios.post('/api/admin/dev_del', { idd: paramstr })
            .then(resp => resp)
    };
};

export function insertDev(paramstr) {


    return dispatch => {
        return Axios.post('/api/admin/dev_insert', paramstr)
            .then(resp => resp)
    };
};

// update data table after edit

export function updateData(paramstr) {


    return dispatch => {
        return Axios.post('/api/admin/data_update', paramstr)
            .then(resp => { return (!resp.data.errcount ? true : false) });
    };
};

//delete data in DB

export function deleteData(paramstr) {


    return dispatch => {
        return Axios.post('/api/admin/data_delete', paramstr)
            .then(resp => { return (!resp.data.errcount ? true : false) });
    };
};