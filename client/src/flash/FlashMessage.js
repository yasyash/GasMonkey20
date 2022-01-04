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
import classnames from 'classnames';
import PropTypes from 'prop-types';


class FlashMessage extends React.Component {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    onClick() {
        this.props.deleteFlashMessage(this.props.message.id);
    }

    render() {
        const { id, type, text } = this.props.message;
        return (
            <div><br />
                <div className={classnames('alert', {
                    'alert-success': type === 'success',
                    'alert-danger': type === 'error'
                })}>
                    <button onClick={this.onClick} className="close" ><span>&times;</span></button>
                    {text}
                </div>

            </div>
        );

    }
}

FlashMessage.propTypes = {
    message: PropTypes.object.isRequired,
    deleteFlashMessage: PropTypes.func.isRequired
}



export default FlashMessage;