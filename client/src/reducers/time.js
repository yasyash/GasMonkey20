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

import { SET_CURRENT_TIME, DELETE_CURRENT_TIME } from "../actions/types";
import isEmpty from 'lodash.isempty';

const initialState = [{
    end_measure:''
}];

export default (state = initialState, action = {}) => {

    switch (action.type) {
        case SET_CURRENT_TIME:
            return [
                {
                    end_measure: action.date_time_end
                }
            ];
            case DELETE_CURRENT_TIME:
                return [
                    {
                        end_measure: ''
                    }
                ];
        default: return state;

    }

}