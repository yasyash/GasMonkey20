/*
 * Copyright © 2018-2020 Yaroslav Shkliar <mail@ilit.ru>
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
import Promise from 'bluebird';
import fs from 'fs';


import shortid from 'shortid';
import isEmpty from 'lodash.isempty';
//import FileDownload from 'js-file-download';

export function reportGen(paramstr) {
    return dispatch => {
        //const data = JSON.stringify(paramstr);
        //console.log('parameters is ', data);

        return Axios.create({ responseType: 'blob' }).post('/api/operative_report/', paramstr  )
            .then(resp => {
                return resp;
            }).catch(err => { console.log('error is ', err) });//.then(file => { FileDownload(file, 'report.docx'); });
    }
};

export function reportXlsGen(paramstr) {
    return dispatch => {
        //const data = JSON.stringify(paramstr);
        //console.log('parameters is ', data);

        return Axios.create({ responseType: 'blob' }).post('/api/operative_report/report_excel',  paramstr)
            .then(resp => {
                return resp;

                //console.log("OK ...")
            }).catch(err => { console.log('error is ', err) });//.then(file => { FileDownload(file, 'report.docx'); });
    }
};

/*headers:{
    'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'Access-Control-Allow-Origin':'*',
    'Access-Control-Allow-Headers' : 'Origin, X-Requested-With, Content-Type, Accept'}, */

export function reportXGen(paramstr) 
     {
        //const data = JSON.stringify(paramstr);
        const data = paramstr;
        console.log('parameters is ', data);

        console.log("IN ");

        if (data.report == 'table') {
            var filename = 'Table_' + data.station + '_' + data.chemical + '_' + data.date + '.csv';
            var filereport = 'table_templ.xlsx'
        };
        var filepath = './reports/';
        var str_hdr = 'Время;Тип;Значение;Единицы;Тревога;id';
        var str_body = "";

        data.data_4_report[1].values[0].pollution.forEach(item => {
            str_body += item.date_time + ";" + item.typmeasure + ";" + item.measure + ";" + item.unit_name + ";" +
                item.is_alert + ";" + item.serialnum + ";" + String.fromCharCode(10, 13);

        });
        var file = [str_hdr + '\r\n' + str_body];
        var response={};
        response.headers= {'content-type' :"text/plain;charset=utf-8"};
        response.headers= {'content-disposition': filename} ;
        response.data = str_hdr + '\r\n' + str_body;

        return response;
        //var blob = new Blob (file, {type: "text/plain;charset=utf-8"});
        //saveAs (blob, filename);
        

};

    export function reportGet_monthly(paramstr) {

        const data = JSON.stringify(paramstr);
        //  console.log('parameters is ', data);

       // return Axios.get('/api/operative_report/get_monthly', { params: { data } })
         //   .then(resp => resp.data.response);

         return Axios.post('/api/operative_report/get_monthly',  paramstr)
            .then(resp => {
                return resp.data.response;

                //console.log("OK ...")
            }).catch(err => { console.log('error is ', err) });

    };

    export function reportGet_tza4(paramstr) {

        const data = JSON.stringify(paramstr);
        //  console.log('parameters is ', data);

        return Axios.get('/api/operative_report/get_tza4', { params: { data } })
            .then(resp => resp.data.response);

    };

    export function reportGet_tza4_auto(paramstr) {

        const data = JSON.stringify(paramstr);
        //  console.log('parameters is ', data);

        return Axios.get('/api/operative_report/get_tza4_auto', { params: { data } })
            .then(resp => resp.data.response);

    };