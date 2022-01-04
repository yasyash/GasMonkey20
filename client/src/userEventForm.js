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
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TxtFieldGroup from './stuff/txtField';
import { createMyEvent } from './actions/eventActions';

class UserEventForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            errors: {},
            isLoading: false


        }
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(e) {
        e.preventDefault();
        this.props.createMyEvent(this.state);
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {
        const { title, errors, isLoading } = this.state;
        return (
            < form onSubmit={this.onSubmit} ><br />
                <h5>Проверка пользователя:</h5>

                <TxtFieldGroup
                    field="title"
                    value={title}
                    label="Заголовок:"
                    error={errors.title}
                    onChange={this.onChange}
                />


                <div className="form-group">
                    <button type="submit" className="btn btn-primary btn-sm">
                        Создать
                    </button>
                </div>
            </form>
        );
    }
}

UserEventForm.propTypes = {
    createMyEvent: PropTypes.func.isRequired
}

UserEventForm.contextType = {
    router: PropTypes.object.isRequired
}

export default connect(null, { createMyEvent })(withRouter(UserEventForm));