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

import express from 'express';
import bcrypt from 'bcrypt';
//import Promise from 'bluebird';
import isEmpty from 'lodash.isempty';
import jsonWT from 'jsonwebtoken';
import config from './config';
import date from 'date-and-time';

import commonValidations from './shared/validations';
import User from '../models/user';
import LOGS from '../models/logs';


let router = express.Router();

router.post('/', (req, resp) => {
    const { identifier, passwrd } = req.body;
   // const ip =  req.headers['x-forwarded-for'] || req.connection.remoteAddress;
   const ip =   req.connection.remoteAddress;

    User.query({
        where: { username: identifier },
        orWhere: { email: identifier }
    }).fetch().then(user => {
        if (user) {
            if (user.get('is_active') == true) {
                if (bcrypt.compareSync(passwrd, user.get('password_digest'))) {
                    const token = jsonWT.sign({
                        id: user.get('id'),
                        username: user.get('username'),
                        full: user.get('is_admin')
                    },
                        config.jwtSecret);

                    let date_time = date.format(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), new Date().getHours(), new Date().getMinutes(), new Date().getSeconds()), 'YYYY-MM-DD HH:mm:ss');
                    //console.log('date ', date_time);
                    //type = 100 is successful authorized.
                    LOGS.forge({
                        date_time,
                        type: 200, descr: ('User - ' + user.get('username') + ' from ip - ' + ip + ' - logged in.')
                    }).save()
                        .then(result => resp.json({ token }))
                        .catch(err => resp.status(500).json({ error: err }));
                    //                       resp.json({ token });

                } else {
                    let date_time = date.format(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), new Date().getHours(), new Date().getMinutes(), new Date().getSeconds()), 'YYYY-MM-DD HH:mm:ss');
                    //console.log('date ', date_time);
                    //type = 100 is successful authorized.
                    LOGS.forge({
                        date_time,
                        type: 401, descr: ('User - ' + user.get('username') + ' from ip - ' + ip + ' - invalid password.')
                    }).save().then(result =>
                        resp.status(401).json({ errors: { form: 'Недействительные полномочия...' } }));
                    // there is invalid password
                }
            }
            else {
                let date_time = date.format(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), new Date().getHours(), new Date().getMinutes(), new Date().getSeconds()), 'YYYY-MM-DD HH:mm:ss');

                LOGS.forge({
                    date_time,
                    type: 401, descr: ('User - ' + user.get('username') + ' from ip - ' + ip + ' - blocked.')
                }).save().then(result =>
                    resp.status(401).json({ errors: { form: 'Пользователь заблокирован...' } }));

            }
        } else {
            let date_time = date.format(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), new Date().getHours(), new Date().getMinutes(), new Date().getSeconds()), 'YYYY-MM-DD HH:mm:ss');
            LOGS.forge({
                date_time,
                type: 401, descr: ('User - ' + identifier + ' - illegal authority.')
            }).save().then(result =>
                resp.status(401).json({ errors: { form: 'Недействительные полномочия...' } }));
            //user doesn't exist
        }
    });
});


export default router;