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
import propTypes from 'prop-types';
import classnames from 'classnames';


const TxtFieldGroup = ({ field, value, label, error, type, onChange, checkUserExists }) => {
    return (
        <div className="form-group">
            <label className="control-label">{label}</label>
            <input value={value}
            onBlur={checkUserExists}
                onChange={onChange}
                type={type} name={field}
                className={classnames("form-control ", { 'is-invalid': error })} />
            {error && <span className={classnames("text-sm-left ", { "text-danger": error })}>{error}</span>}
        </div>
    );
}

TxtFieldGroup.propTypes = {
    field: propTypes.string.isRequired,
    value: propTypes.string.isRequired,
    label: propTypes.string.isRequired,
    error: propTypes.string,
    type: propTypes.string.isRequired,
    onChange: propTypes.func.isRequired,
    checkUserExists: propTypes.func

}

TxtFieldGroup.defaultProps = {
    type: 'text'
}

export default TxtFieldGroup;