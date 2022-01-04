import express from 'express';
import bcrypt from 'bcrypt';
//import Promise from 'bluebird';
import isEmpty from 'lodash.isempty';

import commonValidations from './shared/validations';
import User from '../models/user';

let router = express.Router();

function validateInput(data, otherValidations) {


    let { errors } = otherValidations(data);
    console.log(' validation = ', data );

    return User.query({
        where: { email: data.email },
        orWhere: { username: data.username }
    }).fetchAll().then(user => {
        if (user) {
            if (user.get('username') === data.username) { errors.username = 'Пользователь с данным именем уже существует...'; }
            if (user.get('email') === data.email) { errors.email = 'Пользователь с данным email уже существует...'; }
        }
        return {
            errors,
            isValid: isEmpty(errors)
        };

    })
}

router.get('/:identifier', (req, resp) => {
    User.query({
        select: ['username', 'email'],
        where: { username: req.params.identifier },
        orWhere: { email: req.params.identifier }
    }).fetchAll().then(user => {
        resp.json({user});
    })
});

router.post('/', (req, resp) => {
    validateInput(req.body, commonValidations)
        .then(({ errors, isValid }) => {


            if (isValid) {
                // resp.json({ success: true });
                const { username, passwrd, email, mobile } = req.body;
                const password_digest = bcrypt.hashSync(passwrd, 10);
                User.forge({
                    username, email, mobile, password_digest
                }, { hasTimestamps: true }).save()
                    .then(user => resp.json({ success: true }))
                    .catch(err => resp.status(500).json({ error: err }));

            } else {
                resp.status(400).json(errors);
            }


        });



});

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

export default router;