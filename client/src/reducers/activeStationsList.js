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

import { SET_STATION_LIST, DELETE_STATION_LIST, FIRST_STATION_LIST } from "../actions/types";
import isEmpty from 'lodash.isempty';

const initialState = [{
    sensorsList: []
}];

export default (state = [], action = {}) => {

    switch (action.type) {
        case SET_STATION_LIST:
            if (action.data.station) {
                const station = action.data.station;
                return [  {station} ];

            };
            if (action.data.sensors) {
                const sensors = action.data.sensors;
                return [state[0], { sensors }];

            };


        case DELETE_STATION_LIST:
            return [];

        case FIRST_STATION_LIST:
            return [

                state[0]

            ];

        default: return state;

    }

}