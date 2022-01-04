/*
 * Copyright © 2018-2019 Yaroslav Shkliar <mail@ilit.ru>
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
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from './actions/loginActions';
import TxtFieldGroup from './stuff/txtField';
import validateInput from '../../api/shared/loginValidation';

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            identifier: '',
            passwrd: '',
            errors: {},
            isLoading: false


        }
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    isValid() {
        const { errors, isValid } = validateInput(this.state);
        if (!isValid) {
            this.setState({ errors });
            return isValid;
        }
        this.setState({ errors: {}, isLoading: true });
        this.props.login(this.state).then(
            (resp) => { this.props.history.push('/'); }
        ).catch((err) => { this.setState({ errors: err.response.data.errors, isLoading: false }) });

        return isValid;
    }

    onSubmit(e) {
        e.preventDefault();
        if (this.isValid()) {

        }
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {
        const { identifier, passwrd, errors, isLoading } = this.state;
        return (
            < form onSubmit={this.onSubmit} ><br />
                <h5>Авторизация пользователя:</h5>

                {errors.form && <div className="alert alert-danger"> {errors.form}</div>}
                <TxtFieldGroup
                    field="identifier"
                    value={identifier}
                    label="Имя пользователя / email:"
                    error={errors.identifier}
                    onChange={this.onChange}
                />
                <TxtFieldGroup
                    field="passwrd"
                    value={passwrd}
                    label="Пароль:"
                    error={errors.passwrd}
                    onChange={this.onChange}
                    type="password"
                />

                <div className="form-group">
                    <button disabled={isLoading} className="btn btn-primary btn-sm">
                        Войти
                    </button>
                </div>
            </form>
        );
    }
}

LoginForm.propTypes = {
    login: PropTypes.func.isRequired
}

export default connect(null, { login })(withRouter(LoginForm));