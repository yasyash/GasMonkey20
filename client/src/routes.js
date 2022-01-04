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
import React from 'react';
import { Switch, Route } from 'react-router-dom'
//import { IndexRoute} from 'react-router-dom';
import requireAuth from './stuff/requireAuth';
import requireAuth2 from './stuff/requireAuth2';

import loginPage from './loginPage';
import App from './App';
import signUp from './signUp';
import UserEventPage from './usereventPage'
import TablePage from './TablePage';
import MeteoPage from './MeteoPage';
import ChartPage from './ChartPage';
import ReportPage from './ReportPage';
import  AdminPage from './AdminPage';
import DashBoard from './DashBoard';
import MapsPage from './MapsPage';
import Divider from 'material-ui/Divider';
import StatPage from './StatPage';

export default (
    <div><Divider/>
        <div className="routes form-control">
            <Switch>
                <Route exact path="/" component={requireAuth2(DashBoard)} />
                <Route path="/signup" component={signUp} />
                <Route path="/login" component={loginPage} />
                <Route path="/myuserevent" component={requireAuth(UserEventPage)} />
                <Route path="/maps" component={requireAuth(MapsPage)} />
                <Route path="/tables" component={requireAuth(TablePage)} />
                <Route path="/meteo" component={requireAuth(MeteoPage)} />
                <Route path="/charts" component={requireAuth(ChartPage)} />
                <Route path="/reports" component={requireAuth(ReportPage)} />
                <Route path="/admin" component={requireAuth(AdminPage)} />
                <Route path="/stats" component={requireAuth(StatPage)} />

            </Switch>
        </div>
    </div>


)

