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

import { SET_SENSORS_LIST, DELETE_SENSORS_LIST } from './types';

import {SET_ACTIVE_SENSORS_LIST, DELETE_ACTIVE_SENSORS_LIST} from './types';

import store from '../reducers/rootReducer';

export function addSensorsList(data) {
    store.dispatch({ type: SET_SENSORS_LIST, data });
}

export function deleteSensorsList() {
    store.dispatch({ type: DELETE_SENSORS_LIST });
}

//real store functions place below
export function addActiveSensorsList(data) {
    store.dispatch({ type: SET_ACTIVE_SENSORS_LIST, data });
}

export function deleteActiveSensorsList() {
    store.dispatch({ type: DELETE_ACTIVE_SENSORS_LIST });
}