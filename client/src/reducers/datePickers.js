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

import { SET_DATE, SET_REPORT_DATE } from "../actions/types";
import isEmpty from 'lodash.isempty';
import format from 'node.date-time';


const initialState = {
    dateTimeBegin: new Date().format('Y-MM-dd') + 'T00:00',
    dateTimeEnd: new Date().format('Y-MM-ddThh:mm')
};

export default (state = initialState, action = {}) => {
    let newstate = {};
    switch (action.type) {
        case SET_DATE:

            if ('dateTimeBegin' in action.data)
                newstate = { 'dateTimeBegin': action.data.dateTimeBegin, 'dateTimeEnd': state.dateTimeEnd };

            if ('dateTimeEnd' in action.data)
                newstate = { 'dateTimeBegin': state.dateTimeBegin, 'dateTimeEnd': action.data.dateTimeEnd };
            return newstate;

        case SET_REPORT_DATE:

            if ('dateReportBegin' in action.data)
                newstate = { 'dateReportBegin': action.data.dateReportBegin, 'dateReportEnd': state.dateReportEnd, 'dateTimeBegin': state.dateTimeBegin, 'dateTimeEnd': state.dateTimeEnd };

            if ('dateReportEnd' in action.data)
                newstate = { 'dateReportBegin': state.dateReportBegin, 'dateReportEnd': action.data.dateReportEnd, 'dateTimeBegin': state.dateTimeBegin, 'dateTimeEnd': state.dateTimeEnd };
            return newstate;

        default: return state;

    }

}