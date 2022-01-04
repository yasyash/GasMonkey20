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

import { SET_STATION_LIST, DELETE_STATION_LIST, FIRST_STATION_LIST } from "./types";


import store from '../reducers/rootReducer';


//real store functions place below
export function addActiveStationsList(data) {
    store.dispatch({ type: SET_STATION_LIST, data });
};

export function deleteActiveStationsList() {
    store.dispatch({ type: DELETE_STATION_LIST });
};
export function getFirstActiveStationsList() {
    store.dispatch({ type: FIRST_STATION_LIST });
};
