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
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types'

import { addFlashMessage } from '../actions/flashMessages';

export default function (ComposedComponent) {

    class Authenticate extends Component {

        componentDidMount() {
            if (!this.props.isAuthenticated) {
                addFlashMessage({
                    type: 'error', text: 'Для доступа необходима авторизация...'
                });

                this.props.history.push('/login');
            }
        }

        componentWillUpdate(nextProps) {
            if (!nextProps.isAuthenticated) {
                this.props.history.push('/login');
            }
        }

        render() {
            return (

                <ComposedComponent {...this.props} />
            );
        }
    }


    Authenticate.propTypes = {
        isAuthenticated: PropTypes.bool.isRequired,
        addFlashMessage: PropTypes.func.isRequired
    }

    Authenticate.contextTypes = {
        router: PropTypes.object.isRequired
    }

    function mapStateToProps(state) {
        return {
            isAuthenticated: state.auth[0].isAuthenticated,
            auth: state.auth
        };
    }

    return connect(mapStateToProps, { addFlashMessage })(withRouter(Authenticate));
}
