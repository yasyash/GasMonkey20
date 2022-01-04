/*
 * Copyright © 2022 Yaroslav Shkliar <mail@ilit.ru>
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
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';

import isEmpty from 'lodash.isempty';

const styles = theme => ({
    root: {
        width: '90%',
    },
    button: {
        marginTop: theme.spacing.unit,
        marginRight: theme.spacing.unit,
    },
    actionsContainer: {
        marginBottom: theme.spacing.unit * 2,
    },
    resetContainer: {
        padding: theme.spacing.unit * 3,
    },
    formControl: {
        margin: 2,
        minWidth: 160,
        padding: 0
    },
});

class FileImportDialog extends React.Component {
    constructor(props) {
        super(props);
        const { openDialog, title, idd } = props;

        this.state = {
            idd,
            activeStep: 0,
            openDialog,
            filePath: '',
            fileBlob: '',
            begin: 1,
            quant: 1,
            delim: ";",
            title: 'Выберите файл с данными для импорта:',
            component:''
        };
        if (!isEmpty(title)) this.state.title = title;
    };

    getSteps() {
        return ['Выберите наименование сенсора', 'Выберите файл с разделитем полей *.csv или *.txt', 'Выберите номер начальной строки и количество импортируемых строк', 'Выберите разделитель'];
    }

    handleSelectChange = event => {
        
       // let filter = stationsList.filter((item, i, arr) => {
       //     return item.namestation == station_name;
       // });

        this.setState({ [event.target.name]: event.target.value });
      //  if (!isEmpty(station_name))
          //  this.props.handleReportChange({ station_name: station_name, station_actual: filter[0].id, chemical: event.target.value });
    };


    getStepContent(step) {
        let content;
        let { activeSensorsList } = this.props;
        const { classes } = this.props;

        switch (step) {
            case 0:
                content = (<div className="navbar-header">
                    <form className={classes.root} autoComplete="off">
                        <FormControl className={classes.formControl}>
                            <Select
                                value={this.state.component}
                                onChange={this.handleSelectChange}
                                inputProps={{
                                    name: 'component',
                                    id: this.state.component,
                                }}>
                                {(activeSensorsList) &&// if not empty
                                    activeSensorsList.map((option, i) => (
                                        <MenuItem key={option.serialnum} value={option.typemeasure}>
                                            {option.typemeasure}
                                        </MenuItem>
                                    ))
                                }
                            </Select>


                        </FormControl>
                    </form>

                </div>
                );
                return content;
                break;
            case 1:
                content = (<div><input type="file" accept=".csv, .txt" onChange={(e) => this.handleChange(e.target.files)} />
                    <br />{(!isEmpty(this.state.filePath)) && <label>Файл для импорта: {this.state.filePath} </label>}</div>);
                return content;
                break;
            case 2:
                content = (<div><input type="number" id="begin" value={this.state.begin} min="1" onChange={(e) => this.handleTextChange(e.target.id, e.target.value)} />
                    <br /><input type="number" id="quant" value={this.state.quant} min="1" onChange={(e) => this.handleTextChange(e.target.id, e.target.value)} /></div>);
                return content;
                break;
            case 3:
                content = (<div><input type="text" id="delim" value={this.state.delim} onChange={(e) => this.handleTextChange(e.target.id, e.target.value)} /></div>);
                return content;
                break;
            default:
                return 'Неизвестно';
        }
    }

    handleNext() {
        this.setState(state => ({
            activeStep: state.activeStep + 1,
        }));
    };

    handleBack() {
        this.setState(state => ({
            activeStep: state.activeStep - 1,
        }));
    };

    handleReset() {
        this.setState({
            activeStep: 0,
        });
    }

    handleChange(selectorFiles) {
        let _path = selectorFiles[0].name;
        this.setState(state => ({
            filePath: _path, fileBlob: selectorFiles[0]
        }));
    }

    handleTextChange(name, val) {
        this.setState(state => ({
            [name]: val,
        }));
    }

    handleSubmit() {
        const { fileBlob, component, begin, quant, delim } = this.state;

        this.props.handleImport(fileBlob, component, begin, quant, delim);
    }

    componentWillMount() {





    };

    render() {
        const { id_station } = this.state;
        const { classes } = this.props;
        const steps = this.getSteps();
        const { activeStep } = this.state;
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

                        <div className={classes.root}>
                            <Stepper activeStep={activeStep} orientation="vertical">
                                {steps.map((label, index) => (
                                    <Step key={label}>
                                        <StepLabel>{label}</StepLabel>
                                        <StepContent>
                                            <div className={classes.actionsContainer}>
                                                {this.getStepContent(index)}

                                                <div>
                                                    <Button
                                                        disabled={activeStep === 0 ? true : false}
                                                        onClick={this.handleBack.bind(this)}
                                                        className={classes.button}>
                                                        Назад
                                                     </Button>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={this.handleNext.bind(this)}
                                                        className={classes.button}>
                                                        {activeStep === steps.length - 1 ? 'Завершить' : 'Далее'}
                                                    </Button>
                                                </div>
                                            </div>
                                        </StepContent>
                                    </Step>
                                ))}
                            </Stepper>
                            {activeStep === steps.length && (
                                <Paper square elevation={0} className={classes.resetContainer}>
                                    <Typography>Отправьте данные для импорта</Typography>
                                    <Button onClick={this.handleBack.bind(this)} className={classes.button} color="primary">
                                        Назад
            </Button>
                                    <Button onClick={this.handleSubmit.bind(this)} className={classes.button} color="primary" variant="contained">
                                        Импортировать
            </Button>
                                </Paper>
                            )}
                        </div>

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.props.handleDialogClose} color="primary">
                            Закрыть
        </Button>

                    </DialogActions>
                </Dialog>
            </div>

        );
    }
}

export default ((withStyles(styles)(FileImportDialog)));