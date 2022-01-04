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

import { ADD_FLASH_MSG, DELETE_FLASH_MSG } from "../actions/types";
import shortid from 'shortid';
import findIndex from 'lodash/findIndex';

export default (state = [], action = {}) => {

    switch (action.type) {
        case ADD_FLASH_MSG:
            return [
                ...state,
                {
                    id: shortid.generate(),
                    type: action.message.type,
                    text: action.message.text
                }
            ];

        case DELETE_FLASH_MSG:
            const indx = findIndex(state, { id: action.id })

            if (indx >= 0) {
                return [
                    ...state.slice(0, indx),
                    ...state.slice(indx + 1, )
                ];
            } else return state;

        default: return state;

    }

}