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
import setAuthToken from '../stuff/setAuthToken';
//import jwToken from 'jsonwebtoken';
import jwtDecode from 'jwt-decode';
import { SET_CURRENT_USER } from "./types";

export function setCurrentUser(user) {
    return {
        type: SET_CURRENT_USER,
        user
    };
}

export function login(data) {
    return dispatch => {
        return Axios.post('/api/auth', data).then(resp => {
            let token = resp.data.token;
            sessionStorage.setItem('jwToken', token);
            setAuthToken(token);
            dispatch(setCurrentUser(jwtDecode(token)));
        }
        );
    }
}

export function logout(data) {
    return dispatch => {

        sessionStorage.removeItem('jwToken');
        setAuthToken(false);
        dispatch(setCurrentUser({}));
    }
       
}
