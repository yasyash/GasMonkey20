/*
 * Copyright © 2018-2022 Yaroslav Shkliar <mail@ilit.ru>
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
import PropTypes from 'prop-types';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import Settings from 'material-ui/svg-icons/action/settings';
import ContentFilter from 'material-ui/svg-icons/content/filter-list';
import FileFileDownload from 'material-ui/svg-icons/file/file-download';
import Toggle from 'material-ui/Toggle';
import Renew from 'material-ui/svg-icons/action/autorenew';
import Snackbar from '@material-ui/core/Snackbar';
import SvgIcon from '@material-ui/core/SvgIcon';
import Tooltip from '@material-ui/core/Tooltip';

import Slider from 'rc-slider';
import './css/rc-slider.css';

import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import Icon from '@material-ui/core/Icon';

import SaveIcon from './icons/save-icon';
import BallotIcon from './icons/ballot-recount';
import RenewIcon from './icons/renew-icon';
import SettingsIcon from './icons/settings';

import blue from '@material-ui/core/colors/blue';
import pink from '@material-ui/core/colors/pink';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

import { connect } from 'react-redux';
import isEmpty from 'lodash.isempty';

import { saveAs } from 'file-saver'

import { dateAddAction } from './actions/dateAddAction';
//import isDate from 'lodash.isdate';
/**
 * Three controlled examples, the first allowing a single selection, the second multiple selections,
 * the third using internal state.
 */
const wrapperStyle = { width: '90%', margin: 10 };
const wrapperStyle1 = { width: 150, margin: 0 };

const styles = theme => ({
    root: {
        flexGrow: 1,
        width: '90%',
        align: 'center',
        backgroundColor: theme.palette.background.paper,
    },
    smallIcon: {
        width: 30,
        height: 30,
    },
    mediumIcon: {
        width: 48,
        height: 48,
    },
    largeIcon: {
        width: 60,
        height: 60,
    },
    small: {
        width: 30,
        height: 30,
        padding: 1,
    },
    medium: {
        width: 96,
        height: 96,
        padding: 24,
    },
    large: {
        width: 120,
        height: 120,
        padding: 30,
    },
    propContainer: {
        width: '80%',
        overflow: 'hidden',
        margin: '20px auto 0',
    },
    propToggleHeader: {
        margin: '20px auto 10px',
    },
    menuContainer: {
        width: '95%',
        overflow: 'hidden',
        margin: '20px auto 0',
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: '0',
        marginRight: '0',
        width: ' 200px '
    },
    rc_slider_mark:
    {
        top: '12px'
    },
    button: {
        margin: 0,
    },
    icon: {
        margin: theme.spacing.unit * 2,
        color: blue[600],
        width: 30,
        height: 30,
        margin: 0
    },
    icon_small: {
        margin: theme.spacing.unit * 2,
        color: blue[600],
        width: 25,
        height: 25,
        margin: 0
    },
    icon_small_checked: {
        margin: theme.spacing.unit * 2,
        color: pink[900],
        width: 27,
        height: 27,
        margin: 0
    }
});




class MenuTable extends Component {

    constructor(props) {
        let isNll = false;
        super(props);

        const { fixedHeader,
            fixedFooter,
            stripedRows,
            showRowHover,
            selectable,
            multiSelectable,
            enableSelectAll,
            deselectOnClickaway,
            showCheckboxes,
            height,
            isStation,
            isLoading,
            snack_msg,
            dateTimeBegin,
            dateTimeEnd,
            isSensor,
            defaultPageSize,
            hideFiltartion,
            isEdit,
            isForceToggle,
            isData,
            isTableStation,
            selectAll
        } = props;

        if (isStation) { isNll = true }
        // if (!isSensor) { isSensor = false }

        this.state = {
            fixedHeader,
            fixedFooter,
            stripedRows,
            showRowHover,
            selectable,
            multiSelectable,
            isEdit: isEdit,
            enableSelectAll,
            deselectOnClickaway,
            showCheckboxes,
            height,
            isStation: isNll,
            isLoading,
            snack_msg,
            dateTimeBegin,
            dateTimeEnd,
            isSensor,
            defaultPageSize,
            hideFiltartion,
            averaging: 1,
            isData,
            isTableStation,
            selectAll,
            sensorsList: []
        };



        this.handleChangeMultiple = this.handleChangeMultiple.bind(this);
        this.handleChangeSingle = this.handleChangeSingle.bind(this);
        this.handleOnRequestChange = this.handleOnRequestChange.bind(this);
        this.handleOpenMenu = this.handleOpenMenu.bind(this);
        this.handleToggle = this.handleToggle.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleUpdateSQLClick = this.handleUpdateSQLClick.bind(this);
        // this.handleToggleAll = this.handleToggleAll.bind(this);
    }

    handleExcelSave = (name) => {

        const { dateReportEnd } = this.props;
        var date = '';
        var chemical = this.state.chemical;


        var date = new Date().format('dd-MM-Y_H:mm');
        var pollution = this.props.dataList;
        var values = [], data = [];

        values.push({ pollution: pollution });
        data.push({ station: this.props.stationName }, { values: values });


        if (!isEmpty(this.props.dataList)) {

            var filename = 'Table_' + this.props.stationName + '_Export' + '_' + date + '.csv';

            var str_hdr = ';;;Данные наблюдения ПНЗ ;;\r\nВремя;Тип;Значение;Единицы;В диапазоне;Тревога;id';
            var str_body = "";
            var keys = [];

            data[1].values[0].pollution.forEach(item => {
                if (item.date_time.indexOf('Время') == -1) {
                    if (keys.length == 0) {
                        str_body += item.date_time + ";" + item.typemeasure + ";" + item.measure.replace('.', ',') + ";" + item.unit_name + ";" +
                            ((item.is_range == "вне диапазона") ? "вне диапазона" : "в диапазоне") + ";" + item.is_alert + ";" + item.serialnum + ";" + "\r\n";
                    }
                    else {
                        str_body += item.date_time;
                        keys.forEach(_item_key => {
                            str_body += ";" + item[_item_key];
                        })
                        str_body += "\r\n";
                    }

                }
                else {

                    str_hdr = ';;Данные наблюдения ПНЗ ;\r\n' + item.date_time;
                    for (var __key in item) {
                        if ((__key != 'date_time') && (__key != '_id')) {
                            keys.push(__key);
                            str_hdr += ";" + item[__key];
                        }
                    }


                }
            });


            var file = [str_hdr + '\r\n' + str_body];

            var blob = new Blob([file], { type: "text/plain;charset=utf-8" });

            saveAs(blob, filename);


        }

    };

    handleImport = (name) => {
        this.props.handleDialogAdd();
    };

    handleDeleteSet = (name) => {

        this.props.handleDeleteSet();
    }

    handleUpdateSQLClick() {
        this.props.handleUpdateData();

    };

    handleChangeSingle(event, value) {
        this.setState({
            valueSingle: value,
        });
    };

    handleChangeMultiple(event, value) {
        this.setState({
            valueMultiple: value,
        });
    };

    handleOpenMenu() {
        this.setState({
            openMenu: true,
        });
    }

    handleOnRequestChange(value) {
        this.setState({
            openMenu: value,
        });
    }
    handleTableUpdate(stateValue) {
        this.setState({
            nameFilter: stateValue
        })
    }
    handleToggleAll() {


        if ((event.target.name === 'selectable') ||
            (event.target.name === 'multiSelectable') ||
            (event.target.name === 'enableSelectAll')) {

            if (!this.state.showCheckboxes) {
                event.target.name = 'showCheckboxes'
                this.props.handleToggleAll();

            }
        }
    };

    handleToggle(event, toggled) {
        this.setState({
            [event.target.name]: toggled
        });
        this.props.handleToggle(event, toggled);

        if ((event.target.name === 'selectable') ||
            (event.target.name === 'multiSelectable') ||
            (event.target.name === 'enableSelectAll')) {

            if (!this.state.showCheckboxes) {
                event.target.name = 'showCheckboxes'
                this.props.handleToggle(event, toggled);
                this.setState({
                    showCheckboxes: toggled
                });
            }
        }
    };

    handleChange(name, event) {
        this.setState({ [name]: event.target.value });
        this.props.handleChange(name, event.target.value);

    };
    handleRefresh = name => event => {
        // let { state } = this;
        this.props.handleClick();
    };

    handlePickerChange = (event) => {
        const value = event.target.value;
        const id = event.target.id;

        dateAddAction({ [id]: value });
    };

    handleEdit(event, toggled) {

        var _res = this.props.handleToggleEdit(event, toggled);
        if (!_res)
            this.setState({
                [event.target.name]: toggled
            });
    };



    render() {
        let { username } = '';

        const { classes } = this.props;

        if (!isEmpty(sessionStorage.jwToken)) {
            let { auth } = this.props;
            username = auth[0].user.username;
        } else {
            isAuthenticated = false;
            username = '';
        }
        /*let { fixedHeader,
            fixedFooter,
            stripedRows,
            showRowHover,
            selectable,
            multiSelectable,
            enableSelectAll,
            deselectOnClickaway,
            showCheckboxes,
            height
        } = this.props;*/
        return (
            //<Paper className={classes.root}>

            <nav className="navbar form-control classes.container">
                <div className="navbar-header"   >
                    {(this.state.isSensor || this.state.isTableStation) && <IconButton
                        className={classes.button}
                        tooltip={'Обновить'}
                        onClick={this.handleRefresh('all')} //fake parameter for return function call
                    >
                        <Icon className={classes.icon} color="primary">
                            <RenewIcon />
                        </Icon>
                    </IconButton>
                    }

                    {(this.state.isData) && <Tooltip id="tooltip-charts-view4" title="Экспорт в Excel">

                        <IconButton className={classes.button} onClick={this.handleExcelSave} aria-label="Экспорт в Excel">
                            <SvgIcon className={classes.icon}>
                                <path d="M6,2H14L20,8V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V4A2,2 0 0,1 6,2M13,3.5V9H18.5L13,
                            3.5M17,11H13V13H14L12,14.67L10,13H11V11H7V13H8L11,15.5L8,18H7V20H11V18H10L12,16.33L14,
                            18H13V20H17V18H16L13,15.5L16,13H17V11Z" />
                            </SvgIcon>
                        </IconButton>

                    </Tooltip>}


                    {(this.state.isData)&&(this.props.sensorsList.length < 2) && <Tooltip id="tooltip-charts-view5" title="Импорт данных">
                        <IconButton className={classes.button} onClick={this.handleImport} aria-label="Импорт данных">
                            <SvgIcon className={classes.icon}>
                                <path d="M16.5,6V17.5A4,4 0 0,1 12.5,21.5A4,4 0 0,1 8.5,17.5V5A2.5,2.5 0 0,1 11,2.5A2.5,2.5 
                                0 0,1 13.5,5V15.5A1,1 0 0,1 12.5,16.5A1,1 0 0,1 11.5,15.5V6H10V15.5A2.5,2.5 0 0,0 12.5,18A2.5,
                                2.5 0 0,0 15,15.5V5A4,4 0 0,0 11,1A4,4 0 0,0 7,5V17.5A5.5,5.5 0 0,0 12.5,23A5.5,5.5 0 0,0 18,17.5V6H16.5Z" />
                            </SvgIcon>
                        </IconButton>
                    </Tooltip>}
                    {(this.state.isEdit) && (!this.props.isForceToggle) &&
                        <IconButton className={classes.button} tooltip={'Записать'} aria-label="Записать">
                            <Icon className={classes.icon} color="primary" onClick={this.handleUpdateSQLClick}>
                                < SaveIcon />
                            </Icon>
                        </IconButton>
                    }
                    {(this.state.isEdit) && (!this.props.isForceToggle) &&
                        <IconButton name="isDeleted" className={classes.button} tooltip={'Удалить записи'} aria-label="Удалить" onClick={this.handleDeleteSet}>
                            <SvgIcon className={this.props.isDeleted ? classes.icon_small_checked : classes.icon_small}>
                                <path d="M7 11v2h10v-2H7zm5-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 
                                2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                            </SvgIcon>
                        </IconButton>
                    }
                    {(this.props.isImported) &&
                        <IconButton className={classes.button} tooltip={'Записать'} aria-label="Записать">
                            <Icon className={classes.icon} color="secondary" onClick={this.handleUpdateSQLClick}>
                                <SvgIcon className={classes.icon}>
                                    <path d="M4 7C4 4.79 7.58 3 12 3S20 4.79 20 7 16.42 11 12 11 4 9.21 4 7M19.72 13.05C19.9 12.71 20 12.36 20 12V9C20
                                     11.21 16.42 13 12 13S4 11.21 4 9V12C4 14.21 7.58 16 12 16C12.65 16 13.28 15.96 13.88 15.89C14.93 14.16 16.83 13 19 
                                     13C19.24 13 19.5 13 19.72 13.05M13.1 17.96C12.74 18 12.37 18 12 18C7.58 18 4 16.21 4 14V17C4 19.21 7.58 21 12 21C12.46 
                                     21 12.9 21 13.33 20.94C13.12 20.33 13 19.68 13 19C13 18.64 13.04 18.3 13.1 17.96M18 18V16L15 19L18 22V20H22V18H18Z" />
                                </SvgIcon>
                            </Icon>
                        </IconButton>
                    }

                    &nbsp;&nbsp;&nbsp;
                    {(this.state.isSensor) && '  данные с:    '}
                    {(this.state.isSensor) && <TextField
                        id="dateTimeBegin"
                        label="начало периода"
                        type="datetime-local"
                        defaultValue={this.props.dateTimeBegin}
                        className={classes.textField}
                        // selectProps={this.state.dateTimeBegin}
                        onChange={(event) => { this.handlePickerChange(event) }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />}
                    &nbsp;&nbsp;&nbsp;
                    {(this.state.isSensor) && '  по:     '}
                    {(this.state.isSensor) && <TextField
                        id="dateTimeEnd"
                        label="конец периода"
                        type="datetime-local"
                        defaultValue={this.props.dateTimeEnd}
                        className={classes.textField}
                        // SelectProps ={this.state.dateTimeEnd}
                        onChange={(event) => { this.handlePickerChange(event) }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    }
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    {(this.state.isSensor) && ' усреднение, мин.:'}


                </div>

                <div style={wrapperStyle1}>
                    {(this.state.isSensor) && <br />}


                    {(this.state.isSensor) &&
                        <Slider min={1} max={60} defaultValue={1} marks={{ 1: '1', 5: '5', 10: '10', 20: '20', 60: '60' }} step={null}
                            onChange={(value1) => this.handleChange(name = 'averaging', { target: { value: value1 } })}

                        />
                    }


                </div>

                <div className="navbar-right">

                    <IconMenu
                        iconButtonElement={<IconButton
                            className={classes.button}
                            tooltip={'Настройки таблиц'}>
                            <Icon
                                className={classes.icon}>
                                <SettingsIcon />
                            </Icon>
                        </IconButton>}
                        onChange={this.handleChangeSingle}
                        value={this.state.valueSingle}>

                        <div className="form-control " style={styles.menuContainer}>
                            {(this.props.sensorsList.length == 1)&&(!this.props.isImported) && (username == 'admin') && (typeof (this.props.handleToggleEdit) === 'function') && <Toggle
                                name="isEdit"
                                label="Редактировать данные"
                                onToggle={this.handleEdit}
                                defaultToggled={(!this.props.isForceToggle) ? this.state.isEdit : false}
                            />}
                            <Toggle
                                name="stripedRows"
                                label="Черно-белый стиль"
                                onToggle={this.handleToggle}
                                defaultToggled={this.state.stripedRows}
                            />
                        </div>
                        <div className="form-control " style={styles.menuContainer}>
                            <div style={styles.propContainer} >

                                <h6>Настройка таблицы</h6>

                                <TextField
                                    label="Высота окна таблицы"
                                    defaultValue={this.state.height}
                                    onChange={(event) => this.handleChange(name = 'height', event)}
                                /><br />
                                <TextField
                                    label="Записей на странице таблицы"
                                    defaultValue={this.state.defaultPageSize}
                                    onChange={(event) => this.handleChange(name = 'defaultPageSize', event)}
                                />

                            </div>
                        </div>


                    </IconMenu>

                </div>

                <Snackbar
                    open={this.props.isLoading}
                    // TransitionComponent={<Slider direction="up" />}
                    autoHideDuration={4000}
                    onClose={this.props.handleClose}

                    message={<span id="message-id">{this.props.snack_msg}</span>}

                />
            </nav>
            //</Paper>
        );
    }
}

function mapStateToProps(state) {
    return {
        /*  fixedHeader: state.fixedHeader,
          fixedFooter: state.fixedFooter,
          stripedRows: state.stripedRows,
          showRowHover: state.showRowHover,
          selectable: state.selectable,
          multiSelectable: state.multiSelectable,
          enableSelectAll: state.enableSelectAll,
          deselectOnClickaway: state.deselectOnClickaway,
          showCheckboxes: state.showCheckboxes,
          height: state.height*/

        //isEdit: state.isEdit
        sensorsList: state.sensorsList
    };
}

MenuTable.propTypes = {

    classes: PropTypes.object.isRequired,
    handleClick: PropTypes.func.isRequired
}

export default connect(mapStateToProps, { dateAddAction })(withStyles(styles)(MenuTable));