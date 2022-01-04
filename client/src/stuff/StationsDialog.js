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
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import isEmpty from 'lodash.isempty';

export default class FormDialog extends React.Component {
    constructor(props) {
        super(props);
        const { openDialog, title } = props;

        this.state = {
            openDialog, title: 'Введите данные станции наблюдения:'
        };
        if (!isEmpty(title)) this.state.title = title;
    };



    render() {
        return (

            <div>
                <Dialog
                    open={this.props.openDialog}
                    onClose={this.handleDialogClose}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">Добавьте данные</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {this.state.title}
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="idd"
                            label="ID станции"
                            value={this.props.idd}
                            type="text"
                            fullWidth
                            onChange={this.props.handleChange('idd')}
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="namestation"
                            label="Наименование станции"
                            type="text"
                            fullWidth
                            onChange={this.props.handleChange('namestation')}

                        />
                         <TextField
                            autoFocus
                            margin="dense"
                            id="place"
                            label="Адрес расположения станции"
                            type="text"
                            fullWidth
                            onChange={this.props.handleChange('place')}

                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="latitude"
                            label="Широта"
                            type="text"
                            fullWidth
                            onChange={this.props.handleChange('latitude')}

                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="longitude"
                            label="Долгота"
                            type="text"
                            fullWidth
                            onChange={this.props.handleChange('longitude')}

                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="address"
                            label="Адрес подключения SOAP"
                            type="text"
                            fullWidth
                            onChange={this.props.handleChange('address')}
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="login"
                            label="Логин"
                            type="text"
                            fullWidth
                            onChange={this.props.handleChange('login')}

                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="password_soap"
                            label="Пароль"
                            type="text"
                            fullWidth
                            onChange={this.props.handleChange('password_soap')}

                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="updateperiod"
                            label="Период опроса, сек."
                            type="text"
                            value={this.props.updateperiod}
                            fullWidth
                            onChange={this.props.handleChange('updateperiod')}

                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.props.handleDialogClose} color="primary">
                            Отмена
        </Button>
                        <Button onClick={this.props.handleAdd} color="primary">
                            Добавить
         </Button>
                    </DialogActions>
                </Dialog>
            </div>

        );
    }
}