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

import { queryMeteoEvent } from './actions/queryActions';
import MenuTable from './menuTable';

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
import Switch from '@material-ui/core/Switch';
import SvgIcon from '@material-ui/core/SvgIcon';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

import { Bar, Line, Pie, Radar } from 'react-chartjs-2';

import shortid from 'shortid';
import isEmpty from 'lodash.isempty';
import toUpper from 'lodash/toUpper';
import "react-table/react-table.css";
import isNumber from 'lodash.isnumber';

import MenuChart from './menuChart';
import deepcopy from 'lodash';

const styles = theme => ({
    root: {
        flexGrow: 1,
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },


});



class ChartForm extends React.Component {
    constructor(props) {
        super(props);
        const {

            chartData,
            stationsList,
            sensorsList,
            sensors_actual,
            station_actual,
            dataList,


        } = props;

        this.state = {
            title: '',
            snack_msg: '',
            errors: {},
            isLoading: false,

            dateTimeBegin: new Date().format('Y-MM-dd') + ' 00:00:00',
            dateTimeEnd: new Date().format('Y-MM-dd H:m:SS'),
            station_actual: '',
            sensors_actual: [],
            stationsList,
            sensorsList,
            dataList,
            selected: [],
            selection: [],
            selectAll: false,
            chartData,
            locations: '',
            checkedLine: true,
            checkedMeteo: true,
            whatsRange: false, //false corresponds to % range of MACs
            pointStyle: 'crossRot',
            radius: 2,
            borderWidth: 1,
            borderDash: [5, 10],
            chemical: [],
            options: [],
            barThickness: null,
            beginChartData: [],
            meteoOptions: [],
            consentration: 0,
            max_range: '',
            is_range: false
        };


        this.onClick = this.onSubmit.bind(this);
        // this.onClose= this.handleClose.bind(this);
        //this.onExited= this.handleClose.bind(this);

        //   this.onRowSelection = this.onRowSelection.bind(this);
    }

    static defaultProps = {
        displayTitle: true,
        displayLegend: true,
        legendPosition: 'right',
        locations: ''
    };
    handleChangeExhaust = (name, event) => {
        this.setState({ [name]: event.target.value });

    };

    handleClickExhaust() {
        var _datasets = this.state.chartData.datasets;
        var { chartData } = this.state;
        var len = this.state.chartData.datasets.length;
        const _consentration = Number(this.state.consentration);
        if (len > 0) {
            //var _obj =Object.create( _datasets[len - 1]);
            //_obj=_datasets[len-1];
            if (_consentration != 0) {
                _datasets[len - 1].label = 'ПДВ: ' + _consentration;
                _datasets[len - 1].hidden = false;
                _datasets[len - 1].data = [];
                _datasets[len - 1].borderColor = '#000000';
                _datasets[len - 1].backgroundColor = '#000000';
                _datasets[0].data.forEach((element, key) =>
                    _datasets[len - 1].data.push(_consentration));
            } else {
                _datasets[len - 1].label = ' ';
                _datasets[len - 1].hidden = true;
                _datasets[len - 1].data = [];
                _datasets[len - 1].borderColor = '#FFFFFF';
                _datasets[len - 1].backgroundColor = '#FFFFFF';

            }

        }
        this.setState({ chartData });

    }

    handleRangeChange() {
        var _datasets = this.state.chartData.datasets;
        var { chartData, is_range } = this.state;
        var len = this.state.chartData.datasets.length;
        var _consentration = 0;
        if (!is_range) {
            _consentration = Number(this.state.max_range);
        }

        if (len > 0) {
            //var _obj =Object.create( _datasets[len - 1]);
            //_obj=_datasets[len-1];
            if (_consentration != 0) {
                _datasets[len - 1].label = 'Гр.диапазона: ' + _datasets[0].label + ' = ' + _consentration;
                _datasets[len - 1].hidden = false;
                _datasets[len - 1].data = [];
                _datasets[len - 1].borderColor = '#ffa500';
                _datasets[len - 1].backgroundColor = '#ffa500';
                _datasets[0].data.forEach((element, key) =>
                    _datasets[len - 1].data.push(_consentration));
            } else {
                _datasets[len - 1].label = ' ';
                _datasets[len - 1].hidden = true;
                _datasets[len - 1].data = [];
                _datasets[len - 1].borderColor = '#FFFFFF';
                _datasets[len - 1].backgroundColor = '#FFFFFF';

            }

        }
        this.setState({ chartData, 'is_range': !is_range });
    }
    ////////////    
    handleChangeToggle = (name, event) => {
        this.setState({ [name]: event.target.checked });
        if ((name === 'checkedMeteo')) {
            this.getChartData(event.target.checked, this.state.whatsRange);
        }
        if ((name === 'whatsRange')) {
            this.getChartData(this.state.checkedMeteo, event.target.checked);
        }

    };
    onSubmit(e) {
        e.preventDefault();

        alert('OK');

        //   this.props.createMyEvent(this.state);
    };

    onRefresh() {

        // e.preventDefault();

        this.loadData(1).then(data => {
            if (data) {
                this.setState({ dataList: this.setData(data) })
                this.setState({ isLoading: true })
                this.setState({ snack_msg: 'Данные успешно загружены...' })

            }
            else {
                this.setState({ isLoading: false })
                this.setState({ snack_msg: 'Данные отсутствуют...' })

            }
        });

        //alert('loadData');

        //   this.props.createMyEvent(this.state);
    };

    async    loadData(qtype) {
        let params = {};
        // 0 - all stations, 1- all sensors of the station, 2 - selected sensors

        params.period_from = this.state.dateTimeBegin;
        params.period_to = this.state.dateTimeEnd;
        if (qtype === 1) {
            params.station = this.state.station_actual;
        }

        let data = await (this.props.queryMeteoEvent(params));
        //console.log(data);
        return data;
    };

    hideLine(state) {
        let { chartData } = this.state;
        let beginChartData = this.state.beginChartData;
        let arr = [];
        let keys = Object.keys(state);
        let name = keys[0];
        let obj = state[name];
        //let  options  = state;
        //var chrt = document.getElementById('line-chart');//.getContext("2d");
        //chartData.datasets.splice(1, );
        obj.forEach((element, indx) => {
            // beginChartData.datasets[indx].showLine = element.visible;
            //if (!element.visible) {
            //    let _indx = chartData.datasets.indexOf(beginChartData.datasets[indx]);
            //    chartData.datasets.splice(_indx, 1);

            //chartData.datasets[indx].radius = 0;
            //chartData.datasets[indx].pointRadius = 0;
            // chartData.datasets[indx].barThickness = 0;
            // chartData.datasets[indx].showLine = !chartData.datasets[indx].showLine;

            if (element.visible) {
                // if (beginChartData[indx]._meta) beginChartData[indx]._meta = {};
                // arr.push(beginChartData[indx]);

                //chartData.datasets[indx].radius = this.state.radius;
                //if (chartData.datasets[indx].borderDash.length == 0)
                //   chartData.datasets[indx].pointRadius = this.state.radius;
                chartData.datasets[indx].hidden = false;
                // chartData.datasets[indx].showLine = !chartData.datasets[indx].showLine;


                //  chartData.datasets[indx].barThickness=null;

            } else {
                chartData.datasets[indx].hidden = true;
            };

        });
        //  let obj = { labels: [], datasets: [] };
        // let labels = '';
        // Object.assign(obj.labels, chartData.labels);

        //obj.datasets.splice(1, );

        //Object.assign(obj.datasets, arr);
        this.setState({ [name]: obj });//change checkbox state - options and meteoOptions

        this.setState({ chartData });
        // chrt.update();
    };

    getChartData(_state, _range) {
        // Ajax calls here
        const { dataList } = this.props;
        const { meteoList } = this.props;
        const { sensors_actual } = this.props;
        const { sensorsList } = this.props;
        const { selectedSensors } = this.props;
        const { macs } = this.props;
        const { meteoOptions } = this.props;
        const stateOptions = this.state.options;
        const stateMeteoOption = this.state.meteoOptions;

        let beginChartData = [];
        let obj = [];
        let _boderColor = 'rgba(255, 99, 132, 0.6)';
        let colour_pairs = [];
        let options = [];//checkbox init state
        // Chart.defaults.global.layout.padding.top = 50;

        let chartData = {
            labels: ['0', '1', '2', '3', '4', '5'],

            datasets: [
                {
                    label: 'Загрузите данные',
                    fill: false,
                    borderColor: _boderColor,
                    backgroundColor: _boderColor,

                    data: [
                        0,
                        1,
                        0,
                        1,
                        0,
                        3
                    ],

                }
            ],


        };

        let chartOptions = {
            responsive: true,
            title: {
                display: true,
                text: 'Min and Max Settings'
            },
            scales: {
                yAxes: [{
                    ticks: {
                        // the data minimum used for determining the ticks is Math.min(dataMin, suggestedMin)
                        suggestedMin: 10,
                        // the data maximum used for determining the ticks is Math.max(dataMax, suggestedMax)
                        suggestedMax: 10
                    }
                }]
            }
        };



        let title = '';
        let _timeaxis = [];
        if (_state) {
            if (dataList.length > 1) {
                let tmp = [];
                let _tmp = '';
                let filter = '';
                let i = 0;
                let label = '';
                let counter = 0;
                let chemical = [];//Chemical substance for MACs
                let _prev_measure = 0.0;

                if (sensorsList.length > 0) {

                    chartData.datasets[0].data = [];
                    if (sensors_actual.length > 1) {
                        sensors_actual.forEach(element => {
                            _prev_measure = 0.0;
                            dataList.forEach((item, indx) => {
                                if (isEmpty(filter)) {
                                    filter = sensorsList.filter((_item, i, arr) => {
                                        return _item._id === element;
                                    });
                                };
                                if (filter[0].serialnum) {
                                    _tmp = item[filter[0].serialnum];

                                    if ((_tmp != undefined) && (indx > 0))
                                        _prev_measure = Number.parseFloat(_tmp);

                                };

                                if (counter === 0) {
                                    if (indx > 0) {
                                        _timeaxis.push(item['date_time']);

                                    }
                                };

                                if (indx > 0) {

                                    if (_range) {
                                        tmp.push(_prev_measure);
                                    } else {
                                        let _filter = macs.filter((_item, i, arr) => {
                                            return _item.chemical === filter[0].typemeasure;
                                        });
                                        if (!isEmpty(_filter))
                                            tmp.push(_prev_measure / _filter[0].max_m); //normalize to fractional range of macs
                                    };


                                    // tmp.push(_tmp);

                                } else {
                                    if (i === 0) label = filter[0].typemeasure + ' ' + filter[0].namestation;//_tmp;
                                };

                                i++;
                            });


                            let n = '#' + (filter[0].def_colour.toString(16));
                            let m = '#' + ((filter[0].def_colour + 20).toString(16));
                            colour_pairs.push({
                                sensor: filter[0].typemeasure,
                                colour: n
                            });

                            let emptydatasets =
                            {
                                label: label,
                                fill: false,
                                borderColor: n,
                                backgroundColor: m,
                                data: tmp,
                                pointStyle: this.state.pointStyle,
                                radius: this.state.radius,
                                borderWidth: this.state.borderWidth,
                                borderDash: [],

                            };
                            //chartData.datasets = obj;
                            if (!isEmpty(title)) {
                                title += ',';
                            };
                            title = title + ' ' + label;
                            if (_range) {
                                title += ' (' + filter[0].unit_name + ')';
                            } else {
                                title += ' (долей ПДК)';
                            };
                            //this.setState({ 'locations': title });
                            if (isEmpty(stateOptions[0])) {//if first rendering - not simple switch
                                options.push({ chemical: filter[0].typemeasure + ' ' + filter[0].namestation, visible: true, id: counter });
                            } else {
                                emptydatasets['hidden'] = !stateOptions[counter].visible;
                            };
                            obj.push(emptydatasets);

                            label = '';
                            tmp = [];

                            filter = '';
                            i = 0;

                            counter++;
                        });

                    };
                }; //end multidata section
                if (sensors_actual.length === 1) {
                    let _filter = macs.filter((_item, i, arr) => {
                        return _item.chemical === dataList[0].typemeasure;
                    });
                    dataList.forEach(element => {
                        if (_range) {
                            tmp.push(element.measure);
                        } else {
                            if (!isEmpty(_filter))
                                tmp.push(element.measure / _filter[0].max_m); //normalize to fractional range of macs
                        };
                        _timeaxis.push(element['date_time']);

                    });
                    filter = sensorsList.filter((_item, i, arr) => {
                        return _item._id === sensors_actual[0];
                    });
                    let n = '#' + (filter[0].def_colour.toString(16));
                    let m = '#' + ((filter[0].def_colour + 20).toString(16));
                    let emptydatasets =
                    {
                        label: dataList[0].typemeasure,
                        fill: false,
                        borderColor: n,
                        backgroundColor: m,
                        data: tmp,
                        pointStyle: this.state.pointStyle,
                        radius: this.state.radius,
                        borderWidth: this.state.borderWidth,
                        borderDash: [],

                    };

                    colour_pairs.push({
                        sensor: dataList[0].typemeasure,
                        colour: n
                    });
                    if (_range) {
                        title = dataList[0].typemeasure + ' (' + dataList[0].unit_name + ')';
                    } else {
                        title = dataList[0].typemeasure + ' (в долях ПДК)';

                    }

                    if (isEmpty(stateOptions[0])) {
                        options.push({ chemical: (dataList[0].typemeasure), visible: true, id: 0 });
                    } else {
                        emptydatasets['hidden'] = !stateOptions[0].visible;
                    };

                    obj.push(emptydatasets);
                    counter = 1;

                    this.setState({ 'max_range': filter[0].max_range });
                };



                //macs creation
                let obj_macs = [];
                let _arr = [];
                let _worked_sensors = [];
                i = 0;
                selectedSensors.forEach(element => {
                    let _filter_duplication = _worked_sensors.filter((_item, i) => {
                        return _item.typemeasure == element.typemeasure;
                    });
                    if (_filter_duplication.length == 0) {
                        _worked_sensors.push(element);

                        let filter = macs.filter((_item, i, arr) => {
                            return _item.chemical === element.typemeasure;
                        });

                        if (!isEmpty(filter[0])) {
                            if (_range) {

                                _arr = new Array(_timeaxis.length + 1).join(filter[0].max_m + '|').split('|');
                            } else {
                                _arr = new Array(_timeaxis.length + 1).join(1 + '|').split('|'); //scaling macs to 100 fractions of MACS
                            }
                            let _colour = '#' + element.def_colour.toString(16);


                            let emptydatasets =
                            {
                                label: filter[0].chemical + ' ПДК',
                                fill: false,
                                borderColor: _colour,
                                backgroundColor: _colour,
                                data: _arr,
                                pointStyle: 'circle',
                                radius: 0,
                                borderWidth: this.state.borderWidth + 2,
                                borderDash: [10, 10],
                                hidden: false
                            };


                            if (isEmpty(stateOptions[0])) {
                                options.push({ chemical: (element.typemeasure + ' ПДК'), visible: true, id: selectedSensors.length + i });
                            } else {
                                emptydatasets['hidden'] = !stateOptions[counter + i].visible;
                            };
                            obj_macs.push(emptydatasets);

                            i++;
                        };
                    };
                });

                obj = obj.concat(obj_macs);
                var _tmp = [];
                let _emptydatasets =
                {
                    label: ' ',
                    fill: false,
                    borderColor: '#FFFFFF',
                    backgroundColor: '#FFFFFF',
                    data: [],
                    pointStyle: 'circle',
                    radius: 0,
                    borderWidth: this.state.borderWidth + 2,
                    borderDash: [10, 10],
                    hidden: true
                };

                _tmp.push(_emptydatasets);
                obj = obj.concat(_tmp);

                Object.assign(beginChartData, obj);
                Object.assign(chartData.datasets, obj);
                Object.assign(chartData.labels, _timeaxis);

            }; // end fetch section when data is exist
            //console.log('data = ', chartData.datasets[0].data);


            this.setState({ beginChartData });
            if (isEmpty(this.state.options[0]))
                this.setState({ options });

            this.setState({ 'locations': title });

            this.setState({ chartData });
        } else //end gazoanalitic section
        {//begin of meteosection
            if (meteoList.length > 0) {
                let tmp = [];
                let _tmp = '';
                let filter = '';
                let i = 0;
                let label = '';
                let counter = 0;
                let chemical = [];//Chemical substance for MACs


                chartData.datasets[0].data = [];
                meteoOptions.forEach(element => {

                    meteoList.forEach((item, indx) => {


                        if (counter === 0) {
                            // if (indx > 0)
                            _timeaxis.push(item['date_time']);
                        };
                        if (toUpper(item[element.id]) != toUpper('null')) {
                            tmp.push(item[element.id]);
                        } else {
                            tmp.push('0');
                        };


                        //chartData.datasets = obj;


                    });
                    let n = 14104600 + counter * 8191;
                    let m = '#' + (n.toString(16));

                    n += 40;
                    n = '#' + (n.toString(16))
                    // let obj = chartData.datasets.concat(emptydatasets);
                    let emptydatasets =
                    {
                        label: element.header,
                        fill: false,
                        borderColor: n,
                        backgroundColor: m,
                        data: tmp,
                        pointStyle: this.state.pointStyle,
                        radius: this.state.radius,
                        borderWidth: this.state.borderWidth,
                        borderDash: [],
                        hidden: (!element.visible)
                    };
                    if (!isEmpty(stateMeteoOption[0]))
                        emptydatasets['hidden'] = !stateMeteoOption[counter].visible;

                    obj.push(emptydatasets);

                    tmp = [];



                    counter++;
                });
                Object.assign(chartData.datasets, obj);
                Object.assign(chartData.labels, _timeaxis);
                title = 'метеонаблюдений';
                if (isEmpty(stateMeteoOption[0])) {
                    this.setState({ meteoOptions });
                };

            };
            if (!isEmpty(title)) {
                this.setState({ 'locations': title });
            } else {
                this.setState({ 'locations': '- данные отсутствуют...' });
            };

            this.setState({ chartData });
        };


    };

    handleClickPdf() {
        var cnvs = this.refs.chrts.chartInstance.canvas;
        console.log(this.refs.chrts);
        var img = cnvs.toDataURL("image/png").replace("image/png", "image/octet-stream");
        //var button = document.getElementById('sv-bt');
        //button.download = img;
        var link = document.getElementById('link_report');
        link.setAttribute('download', this.props.station_actual + '_' + this.state.dateTimeEnd + '.png');
        link.setAttribute('href', img);
        link.click();
    };

    componentWillMount() {

        this.setState({ checkedMeteo: this.props.checkedMeteo });


        this.getChartData(this.props.checkedMeteo, this.state.whatsRange);
    }



    render() {
        const { toggleSelection, toggleAll, isSelected } = this;
        const { selection, selectAll, stationsList } = this.state;
        const { loadData } = this.props;
        const { classes } = this.props;
        const { sensorsList } = this.props;
        let titles = {
            display: this.props.displayTitle,
            text: 'Данные отсутствуют - сформируйте запрос',
            fontSize: 15
        };
        let _title = '';



        if (isEmpty(this.state.locations)) {
            if (this.state.checkedMeteo) { _title = 'График газоаналитических данных не загружен...' }
            else {
                _title = 'График метеоданных не загружен...'
            };
        } else {

            _title = 'График ' + this.state.locations;
        };
        titles = {
            display: this.props.displayTitle,
            text: _title,
            fontSize: 15
        };


        return (


            <Paper className={classes.root}>
                <a id="link_report"></a>
                <MenuChart
                    {...this.state}
                    handleChangeExhaust={this.handleChangeExhaust.bind(this)}
                    handleChangeToggle={this.handleChangeToggle.bind(this)}
                    handleClickPdf={this.handleClickPdf.bind(this)}
                    hideLine={this.hideLine.bind(this)}
                    handleClickPdf={this.handleClickPdf.bind(this)}
                    handleClickExhaust={this.handleClickExhaust.bind(this)}
                    handleRangeChange={this.handleRangeChange.bind(this)}
                    value="checkedLine"
                    value="is_range"
                    valueMeteo="checkedMeteo"
                />

                {(this.state.checkedLine) &&
                    <Line
                        ref='chrts'
                        data={this.state.chartData}
                        options={{
                            title: titles,
                            legend: {
                                display: this.props.displayLegend,
                                position: this.props.legendPosition
                            }
                        }}
                    />}
                {(!this.state.checkedLine) &&
                    <Bar
                        data={this.state.chartData}
                        options={{
                            title: titles,
                            legend: {
                                display: this.props.displayLegend,
                                position: this.props.legendPosition
                            }
                        }}
                    />}
            </Paper >
        );
    }
}

function mapStateToProps(state) {
    let sensors = '';
    let station = '';
    let tmp = '';
    if (state.activeStationsList[1]) {
        tmp = state.activeStationsList.slice(state.activeStationsList.length - 1);
        sensors = tmp[0].sensors;

    };

    if (state.activeStationsList[0]) {
        station = state.activeStationsList[0].station;

    };
    if (!isEmpty(station)) { tmp = true } else { tmp = false };


    return {
        sensorsList: state.activeSensorsList,
        dataList: state.dataList,
        station_actual: station,
        sensors_actual: sensors,
        macs: state.macsList,
        selectedSensors: state.sensorsList,
        checkedMeteo: tmp,
        meteoList: state.meteoList

    };
}


ChartForm.propTypes = {
    queryMeteoEvent: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired
    //loadData: PropTypes.func.isRequired
}

ChartForm.contextType = {
    router: PropTypes.object.isRequired
}

export default connect(mapStateToProps, { queryMeteoEvent })(withRouter(withStyles(styles)(ChartForm)));