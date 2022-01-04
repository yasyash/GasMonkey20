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

import { SET_DATE, SET_REPORT_DATE, SET_CURRENT_TIME, DELETE_CURRENT_TIME } from './types'
import store from '../reducers/rootReducer';

export function dateAddAction(data) {
    store.dispatch({ type: SET_DATE, data });
}

export function dateAddReportAction(data) {
    store.dispatch({ type: SET_REPORT_DATE, data });
}

export function timeAddAction(data) {
    store.dispatch({ type: SET_CURRENT_TIME, data });
}

export function timeDeleteAction(data) {
    store.dispatch({ type: DELETE_CURRENT_TIME, data });
}