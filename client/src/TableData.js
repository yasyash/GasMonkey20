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

import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import format from 'node.date-time';
//import store from './reducers/rootReducer';

import TxtFieldGroup from './stuff/txtField';
import { queryEvent } from './actions/queryActions';
import { addDataList, deleteDataList } from './actions/dataAddActions';
import { updateData } from './actions/adminActions';
import { query4EditEvent } from './actions/queryActions';

import MenuTable from './menuTable';
import { Tabs, Tab } from 'material-ui/Tabs';
import FontIcon from 'material-ui/FontIcon';
import MapsPersonPin from 'material-ui/svg-icons/maps/person-pin';
import SensorsIcon from 'material-ui/svg-icons/action/settings-input-component';
import StationsIcon from 'material-ui/svg-icons/action/account-balance';
import DataIcon from 'material-ui/svg-icons/action/timeline';


import ReactTable from "react-table";
import ReactTableDefaults from "react-table";

import checkboxHOC from "react-table/lib/hoc/selectTable";
import FoldableTableHOC from '../foldableTable/index';

import "react-table/react-table.css";

import shortid from 'shortid';
import { isNumber } from 'util';
import isEmpty from 'lodash.isempty';

import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';

import { withStyles } from '@material-ui/core/styles';
import { isNull } from 'util';

import { reportGen, reportXGen } from './actions/genReportActions';

import FileImportDialog from './stuff/FileImportDialog';

Object.assign(ReactTableDefaults, {
    previousText: 'Предыдущие',
    nextText: 'Следующие',
    loadingText: 'Loading...',
    noDataText: 'Записей не найдено',
    pageText: 'Страница',
    ofText: 'из',
    rowsText: 'записей',
});

const CheckboxTable = checkboxHOC(ReactTable);


const FoldableTable = FoldableTableHOC(CheckboxTable);

const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
    },
    menu: {
        width: 200,
    },
});

function wrapData(data_in) {
    const data = data_in.map(item => {
        const _id = shortid.generate();


        Object.assign(item, { _id: _id });
        return item;
    });
    return data;
}

class TableData extends React.Component {
    constructor(props) {
        super(props);
        const {
            queryEvent,

            fixedHeader,
            fixedFooter,
            stripedRows,
            showRowHover,
            selectable,
            multiSelectable,
            enableSelectAll,
            deselectOnClickaway,
            showCheckboxes,
            station_actual,
            sensors_actual,
            stationsList,
            sensorsList,
            dataList,
            dateTimeBegin,
            dateTimeEnd,
            title,
            auth

        } = props;


        this.state = {
            title: '',
            snack_msg: '',
            errors: {},
            isLoading: false,
            isForceToggle: false,
            dateTimeBegin,
            dateTimeEnd,
            station_actual,
            stationsList,
            sensorsList: props.sensorsList,
            dataList: [],
            selected: [],
            sensors_actual,

            fixedHeader,
            fixedFooter,
            stripedRows: false,
            showRowHover,
            selectable,
            multiSelectable: true,
            enableSelectAll: true,
            deselectOnClickaway,
            showCheckboxes,
            height: 600,
            defaultPageSize: 50,
            selection: [],
            selectAll: false,
            hideFiltartion: false,
            isEdit: false,
            isData: true,
            openDialog: false,
            isImported: false
        };


        this.renderEditable = this.renderEditable.bind(this);
    }


    // begin of table functions

    handleUpdateData() {
        if (!isEmpty(this.state.dataList))
            if (this.props.updateData(this.state.dataList)) {
                this.setState({ isLoading: true });
                this.setState({ snack_msg: 'Данные успешно сохранены...' });
                this.setState({ isEdit: false });
                this.setState({ isForceToggle: true });
                this.setState({ isImported: false });

                this.handleToggleEdit({ target: { name: 'isEdit' } }, false, true); //generation syntetic event
                // this.setState({ isForceToggle: false });

            };
    }

    handleForceToggle() {
        this.setState({ isForceToggle: false });
    }

    renderEditable(cellInfo) {

        function _html_out(_obj) {
            if (isEmpty(_obj.state.dataList)) {
                try {
                    var _tmp = Date.parse(_obj.props.dataList[0]["date_time"]);
                    if (!isNaN(_tmp))
                        return { __html: _obj.props.dataList[cellInfo.index][cellInfo.column.id] }
                    else
                        return { __html: _obj.props.dataList[cellInfo.index + 1][cellInfo.column.id] }

                }
                catch (err) {
                    return { __html: _obj.props.dataList[cellInfo.index + 1][cellInfo.column.id] }
                }

            } else {
                try {
                    var _tmp = Date.parse(_obj.state.dataList[0]["date_time"]);
                    if (!isNaN(_tmp))
                        return { __html: _obj.state.dataList[cellInfo.index][cellInfo.column.id] }
                    else
                        return { __html: _obj.state.dataList[cellInfo.index + 1][cellInfo.column.id] }

                }
                catch (err) {
                    return { __html: _obj.state.dataList[cellInfo.index + 1][cellInfo.column.id] }
                }

            }
        };
        return (
            <div
                style={{ backgroundColor: "#fafafa" }}
                contentEditable
                suppressContentEditableWarning
                onBlur={e => {
                    // if (isEmpty(e.target.innerHTML)) {
                    //    alert("Поле не должно быть пустым");

                    // }
                    // else
                    {

                        var data;
                        if (isEmpty(this.state.dataList)) {
                            data = [...this.props.dataList];

                        } else {
                            data = [...this.state.dataList];
                        }

                        try {
                            var _tmp = Date.parse(data[0]["date_time"]);
                            if (!isNaN(_tmp))
                                data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
                            else
                                data[cellInfo.index + 1][cellInfo.column.id] = e.target.innerHTML;

                        }
                        catch (err) {
                            data[cellInfo.index + 1][cellInfo.column.id] = e.target.innerHTML;
                        }

                        this.setState({ dataList: data });
                        deleteDataList();
                        addDataList(data);
                    }
                }}


                dangerouslySetInnerHTML={
                    _html_out(this)
                }


            />
        );
    } I


    setData(data_in) {
        const data = data_in.map(item => {
            const _id = shortid.generate();


            Object.assign(item, {});
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
        let selection = [...this.state.selection];

        const keyIndex = selection.indexOf(key);
        // check to see if the key exists
        if (keyIndex >= 0) {
            // it does exist so we will remove it using destructing
            selection = [
                ...selection.slice(0, keyIndex),
                ...selection.slice(keyIndex + 1)
            ];
        } else {
            // it does not exist so add it
            selection.push(key);
        }
        // update the state
        this.setState({ selection, station_actual: row.id });
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
            const wrappedInstance = this.FoldableTable.getWrappedInstance();
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

    handleClose() {
        this.setState({ isLoading: false });
    };

    handleToggleEdit(event, toggled, isForceToggle) {
        var _props;
        var title = [];
        var name = event.target.name;

        if (toggled) {
            if (this.props.sensors_actual.length > 0) {
                let params = {};

                params.period_from = this.props.dateTimeBegin;
                params.period_to = this.props.dateTimeEnd;


                params.station = this.props.station_actual;
                params.sensors = [this.props.sensors_actual[0].serialnum];

                this.props.query4EditEvent(params).then(data => {
                    if (data.length > 0) {
                        this.setState({ dataList: data })
                        this.setState({ isLoading: true })
                        this.setState({ snack_msg: 'Данные измерений для редактирования успешно загружены...' })
                        //addActiveSensorsList(this.state.selection);
                        //getFirstActiveStationsList();
                        //addActiveStationsList({ sensors: this.state.selection });

                    }
                    else {
                        this.setState({ isLoading: true })
                        this.setState({ snack_msg: 'Данные отсутствуют...' })

                    }

                    this.setState({ isForceToggle: false });
                    this.setState({
                        [name]: toggled
                    });
                    _props = this.props.title;

                    _props.map(item => {
                        if (item.Cell === null) item.Cell = this.renderEditable;
                        title.push(item);

                    });

                    this.setState({ title: title });
                });



            }
        }
        else {
            if (isForceToggle) {
                // Done it after SQL update!
                this.setState({
                    [event.target.name]: toggled
                });
                _props = this.state.title;

                _props.map(item => {
                    if (item.Cell === this.renderEditable) item.Cell = null;
                    title.push(item);

                });
                this.setState({ dataList: [] });
                this.setState({ title: title });

            } else {
                if (confirm('Все несохраненные данные будут потеряны! Вы уверены?')) {
                    // Save it!
                    this.setState({
                        [event.target.name]: toggled
                    });
                    _props = this.state.title;

                    _props.map(item => {
                        if (item.Cell === this.renderEditable) item.Cell = null;
                        title.push(item);

                    });
                    this.setState({ dataList: [] });
                    this.setState({ title: title });

                } else { return true; }
            }
        }
        //}
    };

    handleToggle(event, toggled) {
        this.setState({
            [event.target.name]: toggled
        });

    };


    handleChange(name, value) {
        if (isNumber(parseInt(value))) { var val = parseInt(value) } else { var val = value };

        this.setState({ [name]: val });


    };

    ////////////
    handleRowSelection(selectedRows) {
        let id_sensor = (this.props.sensorsList[selectedRows].id);

        this.setState({
            selected: selectedRows,
            sensors_actual: id_sensor
        });
    };



    onSubmit(e) {
        e.preventDefault();
        //   this.props.createMyEvent(this.state);
    };

    handleClick(e) {

        //e.preventDefault();

        //this.loadData().then(data => this.setState({ sensorsList: data }));

        alert('Nothing');

        //   this.props.createMyEvent(this.state);
    };


    handleDialogAdd() {
        this.setState({ openDialog: true });

    }

    handleDialogClose() {
        this.setState({ openDialog: false });
    };

    handleDialogChange = name => event => {
        //getFTPFunc
        this.setState({
            [name]: event.target.value,
        });
    };

    handleImport(fileBlob, component, begin, quant, delim) {
        const reader = new FileReader();
        const self = this;
        if (fileBlob) {
            reader.onload = (e) => {
                var lines = e.target.result.split('\n');
                if (self) {
                    const sensors = self.props.activeSensorsList;

                    var sensor = sensors.filter((item, i, arr) => {
                        return item.typemeasure == component;
                    });

                    const idd = self.props.station_actual[0];

                    var dataList = [];
                    var _props = self.props.title;
                    var title = [];

                    for (var line = Number(begin) - 1; line < ((Number(quant) + Number(begin) - 1 > lines.length) ? lines.length : Number(quant) + Number(begin) - 1); line++) {
                        // By delimiter
                        var tabs = lines[line].split(delim);
                        var time = tabs[0];
                        var measure = tabs[1];
                        dataList.push({ idd: idd, typemeasure: component, serialnum: sensor[0].serialnum, date_time: time, unit_name: sensor[0].unit_name, measure: measure.replace(',', '.') });
                    }
                    if (!isNaN(Number(dataList[0].measure))) {
                        const wrapedDataList = wrapData(dataList);
                        self.setState({ dataList: wrapedDataList });

                        deleteDataList();
                        addDataList(wrapedDataList);

                        _props.map(item => {
                            if (item.Cell === null) item.Cell = self.renderEditable;
                            title.push(item);

                        });
                        // self.setState({ isForceToggle: false });
                        self.setState({
                            isEdit: true
                        });
                        self.setState({ title: title });
                        self.setState({ isImported: true });
                    } else {
                        alert("Выберите строки содержащие значения.");
                    }
                }
            };
            reader.readAsText(fileBlob);
        } else {
            
            alert("Файл не выбран!");
        }
    };

    componentDidUpdate() {
        //        var _props;
        //var title = [];
        //_props = this.props.title;

        //        _props.map(item => {
        //           if (item.Cell === null) item.Cell = this.renderEditable;
        //            title.push(item);
        //       });

        // this.setState({ title: this.props.title });

    };
    componentWillMount() {
        // if (isEmpty(this.state.title))
        this.setState({ title: this.props.title });

    };
    render() {
        const { classes, auth } = this.props;
        const { toggleSelection, toggleAll, isSelected } = this;
        const { selection, selectAll, height, defaultPageSize, stripedRows } = this.state;

        try {
            var _tmp = Date.parse(this.props.dataList[0]["date_time"]);
            if (!isNaN(_tmp))
                var dataList = this.props.dataList;
            else
                var dataList = this.props.dataList.slice(1);

        }
        catch (err) {
            var dataList = this.props.dataList.slice(1);
        }

        var title = '';
        if (this.state.isEdit) {
            title = this.state.title;
        }
        else {
            title = this.props.title;
        }
        // let lists={};
        //     console.log('dataList ', dataList);
        const checkboxProps = {
            data: dataList,
            selection,
            selectAll,
            isSelected: isSelected.bind(this),
            toggleSelection: toggleSelection.bind(this),
            toggleAll: toggleAll.bind(this),
            selectType: "checkbox",
            getTrProps: (s, r) => {
                let selected = false;
                //  background color change
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

        return (


            <div>
                <FileImportDialog openDialog={this.state.openDialog}
                    handleDialogClose={this.handleDialogClose.bind(this)}
                    handleChange={this.handleDialogChange.bind(this)}
                    handleImport={this.handleImport.bind(this)}
                    activeSensorsList={this.props.activeSensorsList}

                />
                <br />
                <MenuTable {...this.state}
                    handleToggleEdit={this.handleToggleEdit.bind(this)}
                    handleToggle={this.handleToggle.bind(this)}
                    handleChange={this.handleChange.bind(this)}
                    handleClick={this.handleClick.bind(this)}
                    handleClose={this.handleClose.bind(this)}
                    handleUpdateData={this.handleUpdateData.bind(this)}
                    reportXGen={this.props.reportXGen.bind(this)}
                    handleDialogAdd={this.handleDialogAdd.bind(this)}

                    height={this.state.height}
                    auth={auth}
                    dataList={this.props.dataList}
                    stationName={this.props.station_actual}

                />
                <br />
                <FoldableTable
                    ref={r => (this.FoldableTable = r)}
                    data={dataList}
                    columns={title}
                    {...checkboxProps}
                    defaultPageSize={defaultPageSize}
                    pageSizeOptions={[10, 20, 50, 100, 150, 200, 300]}
                    pageSize={defaultPageSize}
                    previousText={'Предыдущие'}
                    nextText={'Следующие'}
                    loadingText={'Loading...'}
                    noDataText={'Записи не загружены...'}
                    pageText={'Страница'}
                    ofText={'из'}
                    rowsText={'записей'}
                    style={{
                        height: height,
                        backgroundColor: stripedRows ? '#000000' : '',
                        color: stripedRows ? '#FFFFFF' : ''
                    }
                    }
                    className="-striped -highlight"
                    {...this.state}
                />
                <br />
                <Tips />

            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    //let title = [];
    //if (state.sensorsList.length == 1) {
    let title = [{
        Header: "Время наблюдения",
        id: "date_time",
        accessor: "date_time",
        filterable: true
    }, {
        Header: "Тип",
        id: "typemeasure",
        accessor: "typemeasure"
    },
    {
        Header: "Значение",
        id: "measure",
        accessor: "measure",
        filterable: true,
        Cell: null


    },
    {
        Header: "Единицы",
        id: "unit_name",
        accessor: "unit_name"
    },
    {
        Header: "В диапазоне",
        id: "is_range",
        accessor: "is_range",
        foldable: true,
        folded: false,
        Cell: _row => (
            <div
                style={{

                    borderRadius: '2px'
                }}
            >
                <div
                    style={{

                        backgroundColor:
                            _row.value == 'вне диапазона' ? '#ffa500' : '    ',
                        borderRadius: '2px',
                        transition: 'all .2s ease-out',
                        className: '-striped -highlight'
                    }}>
                    {_row.value}
                </div>

            </div>)

    },
    {
        Header: "ID датчика",
        id: "serialnum",
        accessor: d => d.serialnum,
        foldable: true,
        folded: true

    },
    {
        Header: "Тревога",
        id: "is_alert",
        accessor: "is_alert",
        foldable: true,
        filterable: true,
        Cell: row => (
            <div
                style={{

                    borderRadius: '2px'
                }}
            >
                <div
                    style={{

                        backgroundColor:
                            row.value == 'тревога' ? '#ff2e00' : '',
                        borderRadius: '2px',
                        transition: 'all .2s ease-out',
                        className: '-striped -highlight'
                    }}>
                    {row.value}
                </div>

            </div>)

    }]


    //};

    if (state.sensorsList.length > 1) {

        let _header = state.dataList[0];
        let columns = [];
        for (var key in _header) {
            if ((key !== '_id') && (key != 'date_time')) {
                columns.push({
                    Header: _header[key],
                    id: key,
                    accessor: key,
                    Cell: null
                });
            }
            if (key == 'date_time') {
                columns.push({
                    Header: _header[key],
                    id: key,
                    accessor: key,
                });
            }
        };
        title = columns;
    }
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
        sensors_actual: state.sensorsList,
        dataList: state.dataList,
        sensorsList: state.sensorsList,
        title: title,
        dateTimeBegin: state.datePickers.dateTimeBegin,
        dateTimeEnd: state.datePickers.dateTimeEnd,
        activeSensorsList: state.activeSensorsList

    };
}


TableData.propTypes = {
    queryEvent: PropTypes.func.isRequired,
}

TableData.contextType = {
    router: PropTypes.object.isRequired
}

export default connect(mapStateToProps, { queryEvent, addDataList, deleteDataList, updateData, reportXGen, query4EditEvent })(withRouter(withStyles(styles)(TableData)));