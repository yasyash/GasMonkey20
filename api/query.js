/*
 * Copyright © 2018-2021 Yaroslav Shkliar <mail@ilit.ru>
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

import express from 'express';
import bcrypt from 'bcrypt';
import Promise from 'bluebird';
import isEmpty from 'lodash.isempty';
import jsonWT from 'jsonwebtoken';
import config from './config';

import authenticate from './shared/authenticate';

import commonValidations from './shared/validations';
import Stations from '../models/stations';
import Sensors from '../models/sensors';
import Data from '../models/data';
import Macs from '../models/macs';
import User from '../models/user';

import url from 'url';
import qs from 'querystring';

let router = express.Router();



router.get('/', authenticate, (req, resp) => {
    //  

    let query = url.parse(req.url).query;
    let obj = qs.parse(query);
    let data = JSON.parse(obj.data);
    //  if (query) {
    //    obj = JSON.parse(decodeURIComponent(query))
    //}
    const between_date = [data.period_from, data.period_to];

    if (isEmpty(data.station)) {
        Stations.query({
            where: ({ is_present: true })
        }).fetchAll().then(stations => {
            resp.json({ stations });
        }).catch(err => resp.status(500).json({ error: err }));
    } else {
        if (isEmpty(data.sensors)) {
            Sensors.query({
                where: ({ is_present: true }),
                andWhere: ({ idd: data.station })

            }).fetchAll().then(sensors => {
                resp.json({ sensors });
            }).catch(err => resp.status(500).json({ error: err }));
        } else {
            Promise.join(
                Data.query('whereBetween', 'date_time', between_date)
                    .query('whereIn', 'serialnum', data.sensors)
                    .orderBy('date_time', 'ASC').fetchAll()
                    .catch(err => resp.status(500).json({ error: err })),
                Sensors.query({
                    select: ['serialnum', 'typemeasure', 'unit_name', 'def_colour', 'max_consentration', 'max_day_consentration'],
                    where: ({ is_present: true }),
                    andWhere: ({ idd: data.station }),
                })
                    .query('whereIn', 'serialnum', data.sensors)
                    .fetchAll()
                    .catch(err => resp.status(500).json({ error: err })),
                Macs.fetchAll()
                    .catch(err => resp.status(500).json({ error: err })),
                ((data_list, data_sensors, consentration) => {
                    let response = [data_list, data_sensors, consentration];
                    var _data_list = JSON.parse(JSON.stringify(data_list));

                    //console.log("data list ", _data_list);
                    resp.json({ response });
                })

            )

                .catch(err => resp.status(500).json({ error: err }));
        };
    };
    //'whereIn', 'serialnum', data.sensors,


});

router.get('/many', authenticate, (req, resp) => {
    //  

    let query = url.parse(req.url).query;
    let obj = qs.parse(query);
    let data = JSON.parse(obj.data);
    //  if (query) {
    //    obj = JSON.parse(decodeURIComponent(query))
    //}
    const between_date = [data.period_from, data.period_to];

    if (isEmpty(data.station)) {
        Stations.query({
            where: ({ is_present: true })
        }).fetchAll().then(stations => {
            resp.json({ stations });
        }).catch(err => resp.status(500).json({ error: err }));
    } else {
        if (isEmpty(data.sensors)) {
            Sensors.query({
                where: ({ is_present: true })
                // andWhere: ({ idd: data.station })

            }).query('whereIn', 'idd', data.station)
                .fetchAll().then(sensors => {
                    resp.json({ sensors });
                }).catch(err => resp.status(500).json({ error: err }));
        } else {
            Promise.join(
                Data.query('whereBetween', 'date_time', between_date)
                    .query('whereIn', 'serialnum', data.sensors)
                    .orderBy('date_time', 'ASC').fetchAll()
                    .catch(err => resp.status(500).json({ error: err })),
                Sensors.query({
                    select: ['serialnum', 'typemeasure', 'unit_name', 'def_colour', 'max_consentration', 'max_day_consentration'],
                    where: ({ is_present: true })
                    
                })
                    .query('whereIn', 'serialnum', data.sensors)
                    .fetchAll()
                    .catch(err => resp.status(500).json({ error: err })),
                Macs.fetchAll()
                    .catch(err => resp.status(500).json({ error: err })),
                ((data_list, data_sensors, consentration) => {
                    let response = [data_list, data_sensors, consentration];
                    var _data_list = JSON.parse(JSON.stringify(data_list));

                    //console.log("data list ", _data_list);
                    resp.json({ response });
                })

            )

                .catch(err => resp.status(500).json({ error: err }));
        };
    };
    //'whereIn', 'serialnum', data.sensors,


});
//  andWhereBetween: ('date_time_in', {[data.period_from, data.period_to]} )
router.post('/', authenticate, (req, resp) => {
    //  const {dateTimeBegin, dateTimeEnd} = req.body;
    //consol.log('query in');
    Stations.query({
    }).fetchAll().then(stations => {
        resp.json({ stations });
    })
        .catch(err => resp.status(500).json({ error: err }));



});

router.get('/by_type', authenticate, (req, resp) => {
    //  

    let query = url.parse(req.url).query;
    let obj = qs.parse(query);
    let data = JSON.parse(obj.data);
    //  if (query) {
    //    obj = JSON.parse(decodeURIComponent(query))
    //}
    const between_date = [data.period_from, data.period_to];

    if (isEmpty(data.station)) {
        Stations.query({
            where: ({ is_present: true })
        }).fetchAll().then(stations => {
            resp.json({ stations });
        }).catch(err => resp.status(500).json({ error: err }));
    } else {
        if (isEmpty(data.sensors)) {
            Sensors.query({
                where: ({ is_present: true }),
                andWhere: ({ idd: data.station })

            }).fetchAll().then(sensors => {
                resp.json({ sensors });
            }).catch(err => resp.status(500).json({ error: err }));
        } else {
            Promise.join(
                Data.query('whereBetween', 'date_time', between_date)
                    .query('whereIn', 'typemeasure', data.sensors)
                    .query('where', 'idd', data.station)
                    .orderBy('date_time', 'ASC').fetchAll()
                    .catch(err => resp.status(500).json({ error: err })),
                Sensors.query({
                    select: ['serialnum', 'typemeasure', 'unit_name', 'def_colour'],
                    where: ({ is_present: true }),
                    andWhere: ({ idd: data.station }),
                })
                    .query('whereIn', 'typemeasure', data.sensors)
                    .fetchAll()
                    .catch(err => resp.status(500).json({ error: err })),
                Macs.fetchAll()
                    .catch(err => resp.status(500).json({ error: err })),
                ((data_list, data_sensors, consentration) => {
                    let response = [data_list, data_sensors, consentration];
                    resp.json({ response });
                })

            )

                .catch(err => resp.status(500).json({ error: err }));
        };
    };


});

export default router;