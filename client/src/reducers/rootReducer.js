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

import { combineReducers, applyMiddleware } from 'redux';
import flashMessages from './flashMessages';

import { composeWithDevTools } from 'redux-devtools-extension';
import { createStore } from 'redux';
import thunk from 'redux-thunk';
import auth from './auth';

import dataList from './dataList';

import sensorsList from './sensorsList';

import meteoList from './meteoList';

import activeStationsList from './activeStationsList';

import activeSensorsList from './activeSensorsList';

import macsList from './macsList';

import datePickers from './datePickers';

import meteoStation from './meteoStation';

import logsList from './logsList';

import stationsList from './getStationsList';

import time from './time';

export default createStore(
    combineReducers({time, stationsList,
        logsList, meteoStation, datePickers, macsList, activeStationsList, activeSensorsList, meteoList,
        dataList, sensorsList, flashMessages, auth
    }),
    composeWithDevTools(applyMiddleware(thunk))
);

