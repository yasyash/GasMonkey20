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
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import logo from './logo.svg';

import './App.css';
import CssBaseline from '@material-ui/core/CssBaseline';

//import '../../node_modules/bootstrap/dist/css/bootstrap.css';
import { logout } from './actions/loginActions';

import isEmpty from 'lodash.isempty';

import Divider from 'material-ui/Divider';

//import Notifier from './stuff/Notifier';


class NavigationBar extends React.Component {


  logout(e) {
    e.preventDefault();
    this.props.logout();
  }


  render() {
    let { isAuthenticated } = false;
    let { username } = '';
    if (!isEmpty(sessionStorage.jwToken)) {
      let { auth } = this.props;
      isAuthenticated = auth[0];
      username = auth[0].user.username;
    } else {
      isAuthenticated = false;
      username = '';
    }

    const AdminLinks = (
      <ul className="nav navbar-nav navbar-right">

        <li><Link to="/admin">Администрирование  &nbsp; &nbsp;</Link>

          <Link to="/reports">Отчеты  &nbsp; &nbsp;</Link>
          <Link to="/charts">Графики  &nbsp; &nbsp;</Link>
          <Link to="/stats">Статистика  &nbsp; &nbsp;</Link>
          <Link to="/meteo">Метеоданные  &nbsp; &nbsp;</Link>
          <Link to="/tables">Таблицы  &nbsp; &nbsp;</Link>
          <Link to="/maps">Карты  &nbsp; &nbsp;</Link>

          <a href="#" onClick={this.logout.bind(this)}>   Выход</a></li>
      </ul>
    );

    const userLinks = (
      <ul className="nav navbar-nav navbar-right">
        <li><Link to="/reports">Отчеты  &nbsp; &nbsp;</Link>
          <Link to="/charts">Графики  &nbsp; &nbsp;</Link>
          <Link to="/stats">Статистика  &nbsp; &nbsp;</Link>
          <Link to="/meteo">Метеоданные  &nbsp; &nbsp;</Link>
          <Link to="/tables">Таблицы  &nbsp; &nbsp;</Link>
          <Link to="/maps">Карты  &nbsp; &nbsp;</Link>

          <a href="#" onClick={this.logout.bind(this)}>   Выход</a></li>
      </ul>
    );

    const guestLinks = (
      <ul className="nav navbar-nav navbar-right">
        <li><Link to="/signup">Регистрация</Link>{"           "}
          <Link to="/login">Войти</Link></li>
      </ul>
    );
    return (
      <div>
        <CssBaseline />
        <div className="App App-header">
          <img src={logo} className="App-logo" alt="Data visualizer" />
          <h3 className="">Визуализация газоаналитических данных </h3>
        </div>
        <nav className="navbar App-navbar">

          <div className="container-fluid">
            <div className="navbar-header">

              <Link to="/" className="navbar-text">{isAuthenticated ? ("Пользователь: " + username) : "Не авторизовано"}</Link>
            </div>

            <div className="navbar-text">

              {isAuthenticated && (username == 'admin') ? AdminLinks : (isAuthenticated ? userLinks : guestLinks)}



            </div>
          </div>

        </nav>

        <Divider />

      </div >

    );
  }
}

NavigationBar.propTypes = {

  logout: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  return { auth: state.auth };
}



export default connect(mapStateToProps, { logout })(NavigationBar);
//export default (NavigationBar);