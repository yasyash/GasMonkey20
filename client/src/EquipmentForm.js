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
import format from 'node.date-time';

import TxtFieldGroup from './stuff/txtField';
import MenuAdmin from './MenuAdmin';
import TableSensors from './TableSensors';
import TableData from './TableData';

import { Tabs, Tab } from 'material-ui/Tabs';
import FontIcon from 'material-ui/FontIcon';
import MapsPersonPin from 'material-ui/svg-icons/maps/person-pin';
import SensorsIcon from 'material-ui/svg-icons/action/settings-input-component';
import StationsIcon from 'material-ui/svg-icons/action/account-balance';
import DataIcon from 'material-ui/svg-icons/action/timeline';
import IconButton from 'material-ui/IconButton';
import Renew from 'material-ui/svg-icons/action/autorenew';
import Snackbar from '@material-ui/core/Snackbar';
import Slider from '@material-ui/core/Slide';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';


import ReactTable from "react-table";
import checkboxHOC from "react-table/lib/hoc/selectTable";
import "react-table/react-table.css";
import isEmpty from 'lodash.isempty';
import { getDev, updateDev, deleteDev, insertDev } from './actions/adminActions';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { ChromePicker } from 'react-color';


import shortid from 'uuid/v1';
import reactCSS from 'reactcss'

//import './Table.css';
//import './css/rwd-table.css';


import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import DeviceDialog from './stuff/DeviceDialog';

const CheckboxTable = checkboxHOC(ReactTable);

const styles = theme => ({
    root: {
        flexGrow: 1,
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
});



class EquipmentForm extends React.Component {
    constructor(props) {
        super(props);
        const {


            fixedHeader,
            fixedFooter,
            stripedRows,
            showRowHover,
            selectable,
            multiSelectable,
            enableSelectAll,
            deselectOnClickaway,
            height,
            station_actual,
            stationsList,
            sensorsList,
            dataList,
            dateTimeBegin,
            dateTimeEnd,
            dev_list


        } = props;



        this.state = {
            title: '',
            snack_msg: '',
            errors: {},
            isLoading: false,

            dateTimeBegin, //new Date().format('Y-MM-dd') + 'T00:00',
            dateTimeEnd, //new Date().format('Y-MM-ddTH:mm'),
            dev_actual: '',
            sensors_actual: [],
            stationsList,
            sensorsList,
            dataList,
            selected: [],

            fixedHeader,
            fixedFooter,
            stripedRows,
            showRowHover,
            selectable,
            multiSelectable,
            enableSelectAll,
            deselectOnClickaway,
            showCheckboxes: true,
            height: '300px',

            selection: '',
            selectAll: false,

            isUpdated: false,
            dev_list,
            openDialog: false,
            periods: 1200,
            unit_name: 'мг/м3',
            idd: '',
            serialnum: '',
            typemeasure: '',
            max_consentration: 0,
            max_day_consentration: 0,
            def_colour: 0,
            is_meteo: false,
            meteo_field: '',
            displayColorPicker: false,
            selected_index: null

        };


        this.renderEditable = this.renderEditable.bind(this);

    }



    setData(data_in) {
        const data = data_in.map(item => {
            const _id = shortid();


            Object.assign(item, { _id: _id });
            return item;
        });
        return data;
    }

    toggleSelection(key, shift, row) {
        /*
          Implementation of how to manage the selection state is up to the developer.
          This implementation uses an array stored in the component state.
          Other implementations could use object keys, a Javascript Set, or Redux... etc.
        */
        // start off with the existing state
        // let selection = this.state.selection;

        // const keyIndex = selection.indexOf(key);
        // check to see if the key exists
        // if (keyIndex >= 0) {
        // it does exist so we will remove it using destructing
        //    selection = [
        //       ...selection.slice(0, keyIndex),
        //       ...selection.slice(keyIndex + 1)
        //  ];
        //  if (row.id == this.state.dev_actual) {
        //       this.setState({ dev_actual: '' });
        //  };

        // } else {
        // it does not exist so add it
        //ONLY ON ROW MAY BE SELECTED
        // selection = key;
        this.setState({ dev_actual: row.serialnum });
        this.setState({ idd: row.idd });

        //}
        // update the state
        this.setState({ selection: key });
    };

    toggleAll() {
        /*
          'toggleAll' is a tricky concept with any filterable table
          do you just select ALL the records that are in your data?
          OR
          do you only select ALL the records that are in the current filtered data?
          
          The latter makes more sense because 'selection' is a visual thing for the user.
          This is especially true if you are going to implement a set of external functions
          that act on the selected information (you would not want to DELETE the wrong thing!).
          
          So, to that end, access to the internals of ReactTable are required to get what is
          currently visible in the table (either on the current page or any other page).
          
          The HOC provides a method call 'getWrappedInstance' to get a ref to the wrapped
          ReactTable and then get the internal state and the 'sortedData'. 
          That can then be iterrated to get all the currently visible records and set
          the selection state.
        */
        const selectAll = this.state.selectAll ? false : true;
        const selection = [];
        if (selectAll) {
            // we need to get at the internals of ReactTable
            const wrappedInstance = this.checkboxTable.getWrappedInstance();
            // the 'sortedData' property contains the currently accessible records based on the filter and sort
            const currentRecords = wrappedInstance.getResolvedState().sortedData;
            // we just push all the IDs onto the selection array
            currentRecords.forEach(item => {
                selection.push(item._original._id);
            });
        }
        this.setState({ selectAll, selection });
    };

    isSelected(key) {
        /*
          Instead of passing our external selection state we provide an 'isSelected'
          callback and detect the selection state ourselves. This allows any implementation
          for selection (either an array, object keys, or even a Javascript Set object).
        */
        return this.state.selection.includes(key);
    };

    //// end of table fuctions
    //equipmnt tgl
    handleToggle(event, toggled) {
        this.setState({
            [event.target.name]: toggled
        });
    };




    handleRowSelection(selectedRows) {
        let ftp = (this.state.dev_list[selectedRows].id);

        this.setState({
            selected: selectedRows,
            dev_actual: ftp
        });
    };

    //  isSelected(index) {
    //      return this.state.selected.indexOf(index) !== -1;
    //  };
    handleClose() {
        this.setState({ isLoading: false });
        this.setState({ isUpdated: false });

    };


    ////////////

    onSubmit(e) {
        e.preventDefault();

        alert('OK');

        //   this.props.createMyEvent(this.state);
    };




    renderEditable(cellInfo) {
        const data = [...this.state.dev_list];
        const colour = data[cellInfo.index]['def_colour'];
        const styleP = reactCSS({
            'default': {
                color: {
                    width: '36px',
                    height: '14px',
                    borderRadius: '2px',
                    background: `rgb(${Math.floor(colour / 65536)},${Math.floor(colour / 256) % 256},${(colour % 256)})`
                },

                swatch: {
                    padding: '5px',
                    background: '#fff',
                    borderRadius: '1px',
                    boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
                    display: 'inline-block',
                    cursor: 'pointer',
                },
                popover: {
                    position: 'absolute',
                    top: '0px',
                    right: '0px',
                    bottom: '0px',
                    left: '300px',
                    zIndex: '2',
                },
                cover: {
                    position: 'absolute',
                    top: '0px',
                    right: '0px',
                    bottom: '0px',
                    left: '-300px',
                },
            },
        });

        if (cellInfo.column.id != 'def_colour') {
            return (
                <div
                    style={{ backgroundColor: "#fafafa" }}
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={e => {
                        const data = [...this.state.dev_list];
                        data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
                        this.setState({ dev_list: data });

                    }}

                    /*  onClick={e => {
                          if (cellInfo.column.id == 'def_colour') {
                              this.setState({ displayColorPicker: !this.state.displayColorPicker })
                          }
                      }}*/

                    dangerouslySetInnerHTML={{
                        __html: this.state.dev_list[cellInfo.index][cellInfo.column.id]
                    }}
                >
                </div>)
        } else {
            return (


                <div>
                    <div style={styleP.swatch} onClick={(e) => { this.handleColourClick(cellInfo.index) }}>
                        <div style={styleP.color} />
                    </div>
                    {this.state.displayColorPicker ? <div style={styleP.popover}>
                        <div style={styleP.cover} onClick={(e) => { this.handleColourClose() }} />
                        <ChromePicker color={{ r: (Math.floor(data[this.state.selected_index]['def_colour'] / 65536)), g: (Math.floor(data[this.state.selected_index]['def_colour'] / 256) % 256), b: (data[this.state.selected_index]['def_colour'] % 256) }} onChange={(color, e) => {
                            data[this.state.selected_index]['def_colour'] = color.rgb.r * 65536 + color.rgb.g * 256 + color.rgb.b;
                            this.setState({ dev_list: data });
                        }} />
                    </div> : null}
                </div>)
        }
    } I

    renderClick(cellInfo) {
        const cell_in = cellInfo;
        const data = [...this.state.dev_list];
        const colour = data[cellInfo.index]['def_colour'];
        const styleP = reactCSS({
            'default': {
                color: {
                    width: '36px',
                    height: '14px',
                    borderRadius: '2px',
                    background: `rgb(${Math.floor(colour / 65536)},${Math.floor(colour / 256) % 256},${(colour % 256)})`
                },

                swatch: {
                    padding: '5px',
                    background: '#fff',
                    borderRadius: '1px',
                    boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
                    display: 'inline-block',
                    cursor: 'pointer',
                },
                popover: {
                    position: 'absolute',
                    top: '0px',
                    right: '0px',
                    bottom: '0px',
                    left: '300px',
                    zIndex: '2',
                },
                cover: {
                    position: 'absolute',
                    top: '0px',
                    right: '0px',
                    bottom: '0px',
                    left: '-300px',
                },
            },
        });
        return (<div>
            <div style={styleP.swatch} onClick={(e) => { this.handleColourClick() }}>
                <div style={styleP.color} />
            </div>
            {this.state.displayColorPicker ? <div style={styleP.popover}>
                <div style={styleP.cover} onClick={(e) => { this.handleColourClose() }} />
                <SketchPicker color={{ r: (Math.floor(colour / 65536)), g: (Math.floor(colour / 256) % 256), b: (colour % 256) }} onChange={(color, e, cell_in) => {
                    data[cell_in.index]['def_colour'] = color.rgb.r * 65536 + color.rgb.g * 256 + color.rgb.b;
                    this.setState({ dev_list: data });
                }} />
            </div> : null}
        </div>)
    }


    async    load_user() {
        let params = {};
        // 0 - all stations, 1- all sensors of the station, 2 - selected sensors
        //3 - macs table

        let data = await (this.props.getDev());
        //console.log(data);
        return data;
    };

    handleSnackClose() {
        this.setState({ isLoading: false });
        this.setState({ isUpdated: false });

    };

    handleUpdate() {
        //equipment update
        if (!isEmpty(String(this.state.dev_actual))) {
            const { dev_list } = this.state;
            let filter = dev_list.filter((item, i, arr) => {
                return item.serialnum == String(this.state.dev_actual);
            });
            this.props.updateDev(filter).then(resp => {
                if (resp.status == 200) {
                    this.load_user().then(data => {
                        if (data)
                            this.setState({ dev_list: data });
                        this.setState({ dev_actual: '' });

                        this.setState({ isLoading: true });
                        this.setState({ snack_msg: 'Данные успешно обновлены...' });
                    });
                } else {
                    this.setState({ isLoading: true });
                    this.setState({ snack_msg: 'Ошибка сервера...' });
                };
            });
        }
    }



    handleDelete() {
        if (!isEmpty(String(this.state.dev_actual))) {
            var isReal = confirm("Вы уверены?...");

            if (isReal) {
                this.props.deleteDev(this.state.dev_actual).then(resp => {
                    if (resp.status == 200) {
                        this.load_user().then(data => {
                            if (data)
                                this.setState({ dev_list: data });
                            this.setState({ dev_actual: '' });

                            this.setState({ isLoading: true });
                            this.setState({ snack_msg: 'Данные удалены...' });
                        });
                    } else {
                        this.setState({ isLoading: true });
                        this.setState({ snack_msg: 'Ошибка сервера...' });
                    };
                });
            };
        }
    }

    handleDialogAdd() {
        this.setState({ serialnum: shortid() });

        this.setState({ openDialog: true });

    }

    handleDialogClose() {
        this.setState({ openDialog: false });
    };

    handleChange = name => event => {
        //changeField
        if (name == 'meteo_field') {
            if (event.target.value == 'bar')
                this.setState({
                    'typemeasure': 'Атм. давление',
                });

            if (event.target.value == 'temp_out')
                this.setState({
                    'typemeasure': 'Темп. внешняя',
                });

            if (event.target.value == 'hum_out')
                this.setState({
                    'typemeasure': 'Влажность внеш.',
                });
            if (event.target.value == 'speed_wind')
                this.setState({
                    'typemeasure': 'Скорость ветра',
                });
            if (event.target.value == 'dir_wind')
                this.setState({
                    'typemeasure': 'Направление ветра',
                });
            if (event.target.value == 'rain')
                this.setState({
                    'typemeasure': 'Интенс. осадков',
                });
            if (event.target.value == 'uv_dose')
                this.setState({
                    'typemeasure': 'Гамма-излучение',
                });
            if (event.target.value == 'temp_in')
                this.setState({
                    'typemeasure': 'Темп. внутренняя',
                });
            if (event.target.value == 'hum_in')
                this.setState({
                    'typemeasure': 'Влажность внутр.',
                });


        }

        if (name == 'def_colour') {
            if (event.rgb) {
                this.setState({
                    [name]: (event.rgb.r * 65536 + event.rgb.g * 256 + event.rgb.b)
                });
            } else {
                this.setState({
                    [name]: event.target.value
                });
            }
        } else {
            this.setState({
                [name]: event.target.value
            });
        };
    };

    handleAdd() {
        //insert action
        let { idd, typemeasure, serialnum, unit_name, max_consentration,
            max_day_consentration, def_colour, is_meteo, meteo_field, is_manual } = this.state;
        this.props.insertDev({ idd, typemeasure, serialnum, unit_name, max_consentration, max_day_consentration, def_colour, is_meteo, meteo_field, is_manual })
            .then(resp => {
                this.setState({ openDialog: false });

                if (resp.status == 200) {
                    this.load_user().then(data => {
                        if (data)
                            this.setState({ dev_list: data });

                        this.setState({ isLoading: true });
                        this.setState({ snack_msg: 'Данные успешно добавлены...' });

                    });
                } else {
                    this.setState({ isLoading: true });
                    this.setState({ snack_msg: 'Ошибка сервера...' });
                };
            });;


    };

    handleColourClose = () => {
        this.setState({ displayColorPicker: false })
    };

    handleColourChange(color_new, event, cellInfo) {
        console.log(color);
        this.setState({ def_colour: color_new });
    }

    handleColourClick = (index) => {
        this.setState({ displayColorPicker: !this.state.displayColorPicker });
        this.setState({ selected_index: index });
    };

    componentWillMount() {


        this.load_user().then(data => {
            if (data)
                this.setState({ dev_list: data });
        });





    };


    render() {
        const { dev_list } = this.state;
        const { snack_msg, isLoading } = this.state;

        const { toggleSelection, toggleAll, isSelected } = this;
        const { selection, selectAll, height } = this.state;
        const { loadData } = this.props;
        const { classes } = this.props;


        // var tableData = this.state.stationsList;
        // const { title, errors, isLoading } = this.state;
        //const {handleChange, handleToggle} = this.props;
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
        const checkboxProps = {
            selection,
            selectAll: false,
            isSelected: isSelected.bind(this),
            toggleSelection: toggleSelection.bind(this),
            selectType: "checkbox",
            getTrProps: (s, r) => {
                let selected = false;
                // someone asked for an example of a background color change
                // here it is...
                if (r) {
                    selected = this.isSelected(r.original._id);
                }
                return {
                    style: {
                        backgroundColor: selected ? "lightblue" : "inherit"
                        // color: selected ? 'white' : 'inherit',
                    }
                };
            }
        };

        const Tips = () =>
            <div style={{ textAlign: "center" }}>
                <em>Для сортировки по нескольким полям удерживайте клавишу Shift!</em>
            </div>;
        const Title = [
            {
                Header: "Перечень опрашиваемого оборудования станций",
                columns: [

                    {
                        Header: "Наименование станции",
                        id: "namestation",
                        accessor: "namestation",
                        filterable: true

                    },
                    {
                        Header: "ID станции наблюдения",
                        id: "idd",
                        accessor: "idd",
                        Cell: this.renderEditable,
                        filterable: true

                    },
                    {
                        Header: "Тип измерений",
                        id: "typemeasure",
                        accessor: "typemeasure",
                        Cell: this.renderEditable,
                        filterable: true

                    },
                    {
                        Header: "Размерность",
                        id: "unit_name",
                        accessor: "unit_name",
                        Cell: this.renderEditable,
                        filterable: true

                    },
                    {
                        Header: "ID датчика",
                        id: "serialnum",
                        accessor: "serialnum",
                        Cell: this.renderEditable,
                        filterable: true

                    },
                    {
                        Header: "Цвет отображения на графике",
                        id: "def_colour",
                        accessor: "def_colour",
                        Cell: this.renderEditable,
                        filterable: true
                    },

                    {
                        Header: "ПДК м.",
                        id: "max_consentration",
                        accessor: "max_consentration",
                        Cell: this.renderEditable,
                        filterable: true

                    },
                    {
                        Header: "ПДК с.с.",
                        id: "max_day_consentration",
                        accessor: "max_day_consentration",
                        Cell: this.renderEditable,
                        filterable: true

                    },
                    {
                        Header: "Нижний диапазон измерений",
                        id: "min_range",
                        accessor: "min_range",
                        Cell: this.renderEditable,
                        filterable: true

                    },
                    {
                        Header: "Верхний диапазон измерений",
                        id: "max_range",
                        accessor: "max_range",
                        Cell: this.renderEditable,
                        filterable: true

                    },
                    {
                        Header: "Время ближайшей загрузки данных",
                        id: "date_time_out",
                        accessor: "date_time_out"
                    },
                    {
                        Header: "Время создания",
                        id: "date_time_in",
                        accessor: "date_time_in"
                    }

                ]
            }
        ]


        return (


            <Paper className={classes.root}>
                <br />

                <MenuAdmin
                    {...this.props} snack_msg={snack_msg} isLoading={isLoading}

                    handleSnackClose={this.handleSnackClose.bind(this)}
                    handleUpdate={this.handleUpdate.bind(this)}
                    handleDelete={this.handleDelete.bind(this)}
                    handleDialogAdd={this.handleDialogAdd.bind(this)}
                    data_actual={this.state.soap_actual}
                />
                <DeviceDialog openDialog={this.state.openDialog}
                    handleDialogClose={this.handleDialogClose.bind(this)}
                    handleAdd={this.handleAdd.bind(this)}
                    handleChange={this.handleChange.bind(this)}
                    meteo_field={this.state.meteo_field}
                    unit_name={this.state.unit_name}
                    idd={this.state.idd}
                    serialnum={this.state.serialnum}
                    typemeasure={this.state.typemeasure}
                    def_colour={this.state.def_colour}

                />



                <div >


                    <CheckboxTable
                        ref={r => (this.checkboxTable = r)}
                        {...checkboxProps}

                        data={dev_list}
                        columns={Title}
                        defaultPageSize={7}
                        previousText={'Предыдущие'}
                        nextText={'Следующие'}
                        loadingText={'Loading...'}
                        noDataText={'Записей не найдено'}
                        pageText={'Страница'}
                        ofText={'из'}
                        rowsText={'записей'}
                        style={{
                            height: height + 100 // This will force the table body to overflow and scroll, since there is not enough room
                        }}
                        className="-striped -highlight"
                        {...this.state}
                    />
                    <br />
                    <Tips />
                </div>



            </Paper >
        );
    }
}

function mapStateToProps(state) {
    let station = '';
    if (state.activeStationsList[0]) { station = state.activeStationsList[0].station }
    return {

        /*  fixedHeader: state.fixedHeader,
          fixedFooter: state.fixedFooter,
          stripedRows: state.stripedRows,
          showRowHover: state.showRowHover,
          selectable: state.selectable,
          multiSelectable: state.multiSelectable,
          enableSelectAll: state.enableSelectAll,
          deselectOnClickaway: state.deselectOnClickaway,
          showCheckboxes: state.showCheckboxes,*/
        //sensorsList: state.sensorsList
        station_actual: station,
        dateTimeBegin: state.datePickers.dateTimeBegin,
        dateTimeEnd: state.datePickers.dateTimeEnd

    };
}


EquipmentForm.propTypes = {
    getDev: PropTypes.func.isRequired,
    updateDev: PropTypes.func.isRequired,
    deleteDev: PropTypes.func.isRequired,
    insertDev: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired
}

EquipmentForm.contextType = {
    router: PropTypes.object.isRequired
}

export default connect(null, {
    getDev, updateDev, deleteDev, insertDev
})(withRouter(withStyles(styles)(EquipmentForm)));