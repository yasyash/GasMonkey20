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
import React, { Component } from 'react';
import './App.css';
import NavigationBar from './NavigationBar';

import {connect} from 'react-redux';
import signUp from './signUp';

//import fCharts from './reducers/fusion';

class App extends Component {
  render() {
    return (
      <div className="App">
      {this.props.children}

      </div>
    );
  }
}

/*function mapStateToProps(state){
  return {
    user: state.meteoInfo[0].ID
  }
}*/

//export default connect(mapStateToProps)(App);
export default App;