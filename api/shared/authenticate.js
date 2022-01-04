/*
 * Copyright © 2018 Yaroslav Shkliar <mail@ilit.ru>
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

import jwToken from 'jsonwebtoken';
import config from '../config';
import User from '../../models/user';

export default (req, resp, next) => {
    const authorizationHdr = req.headers['authorization'];
    let token;

    if (authorizationHdr) {
        token = authorizationHdr.split(' ')[1];
    }
    /* console.log(token);*/
    if (token) {

        jwToken.verify(token, config.jwtSecret, (err, decoded) => {
            if (err) {
                resp.status(401).json({ err: 'Invalid token...' });
            } else {
                //If Everything is ok
                User.query({
                    where: { id: decoded.id },
                    select: ['id', 'username', 'email', 'is_admin', 'is_active']
                }).fetch().then(user => {
                    if (!user) {
                        resp.status(404).json({ error: 'User not found...' });
                    } else {
                        if (user.get('is_active') == true) {

                            req.currentUser = user;
                            next();
                        }
                        else {
                            resp.status(404).json({ error: 'User not actives...' });

                        }
                    }
                });
            }
        });
    } else {
        resp.status(403).json({
            error: 'No token provided... '
        });
    }
}