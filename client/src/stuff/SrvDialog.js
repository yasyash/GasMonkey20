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
        const { openDialog, title, id_station } = props;


        this.state = {
            openDialog, title: 'Введите данные по обслуживанию оборудования:'
        };
        if (!isEmpty(title)) this.state.title = title;
    };

    componentWillMount() {

this.setState({date_time: this.props.date_time});



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
                            id="date_time"
                            label="Время"
                            type="text"
                            fullWidth
                            value = {this.state.date_time}
                            onChange={this.props.handleChange('date_time')}
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="serialnum"
                            label="Серийный номер"
                            type="text"
                            fullWidth
                            onChange={this.props.handleChange('serialnum')}

                        />
                         <TextField
                            autoFocus
                            margin="dense"
                            id="inv_num"
                            label="Инвентарный номер"
                            type="text"
                            fullWidth
                            onChange={this.props.handleChange('inv_num')}

                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Наименование"
                            type="text"
                            fullWidth
                            onChange={this.props.handleChange('name')}

                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="note"
                            label="Перечень работ"
                            type="text"
                            fullWidth
                            onChange={this.props.handleChange('note')}



                        />

                        <TextField
                            autoFocus
                            margin="dense"
                            id="result"
                            label="Результаты работ"
                            type="text"
                            fullWidth
                            onChange={this.props.handleChange('result')}

                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="person"
                            label="Отвественный"
                            type="text"
                            fullWidth
                            onChange={this.props.handleChange('person')}

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