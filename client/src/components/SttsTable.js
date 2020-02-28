import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import { withStyles } from '@material-ui/core/styles';
import { get } from 'axios';

const styles = theme => ({
    appbarTable:{
        fontSize: '7pt',
        width: 850,
        hight: 80
    },
    paper1:{
        width: 850,
        hight: 80
    },
})

class SttsTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            not_in_reasonCount:'',
            first_in_reasonCount:'',
            tmp_final_reasonCount:'',
            today_first_in_reasonCount:'',
            today_final_reasonCount:'',
            week_first_in_reasonCount:'',
            week_final_reasonCount:'',
            time:'',
        }
    }

    componentDidMount(){
        this.fetch_not_in_reasonCount();
        this.fetch_first_in_reasonCount();
        this.fetch_tmp_final_reasonCount();
        this.fetch_today_first_in_reasonCount();
        this.fetch_today_final_reasonCount();
        this.fetch_week_first_in_reasonCount();
        this.fetch_week_final_reasonCount();
        this.fetch_now();
    }
    shouldComponentUpdate(nextProps, nextState) {
        return (nextState.time !== this.state.time) || (nextState.week_final_reasonCount !== this.state.week_final_reasonCount)
    }
    
    fetch_not_in_reasonCount=()=>{
        get('../api/not_in_reasonCount')
            .then((response) => {
                    this.setState({
                    not_in_reasonCount: response.data[0].미입고
                })
            })
            .catch(function (error) {
                console.log(error);
            })
    }
    
    fetch_first_in_reasonCount=()=>{
        get('../api/first_in_reasonCount')
            .then((response) => {
                this.setState({
                first_in_reasonCount: response.data[0].입고
            })
        })
        .catch(function (error) {
            console.log(error);
        })
    }
    
    fetch_tmp_final_reasonCount=()=>{
        get('../api/tmp_final_reasonCount')
            .then((response) => {
                this.setState({
                tmp_final_reasonCount: response.data[0].임시출고
            })
        })
        .catch(function (error) {
            console.log(error);
        })
    }
    
    fetch_today_first_in_reasonCount=()=>{
        get('../api/today_first_in_reasonCount')
            .then((response) => {
                this.setState({
                today_first_in_reasonCount: response.data[0].입고
            })
        })
        .catch(function (error) {
            console.log(error);
        })
    }
    
    fetch_today_final_reasonCount=()=>{
        get('../api/today_final_reasonCount')
            .then((response) => {
                this.setState({
                today_final_reasonCount: response.data[0].출고
            })
        })
        .catch(function (error) {
            console.log(error);
        })
    }
    
    fetch_week_first_in_reasonCount =() =>{
        get('../api/week_first_in_reasonCount')
            .then((response) => {
                this.setState({
                week_first_in_reasonCount: response.data[0].입고
            })
            })
            .catch(function (error) {
                console.log(error);
        })
    }
    
    fetch_week_final_reasonCount=()=>{
        get('../api/week_final_reasonCount')
            .then((response) => {
                this.setState({
                week_final_reasonCount: response.data[0].출고
            })
        })
        .catch(function (error) {
            console.log(error);
        })
    }
    
    fetch_now=()=>{
        get('../api/now')
            .then((response) => {
                this.setState({
                time: response.data
            })
        })
        .catch(function (error) {
            console.log(error);
        })
    }

    render(){
        const { classes } = this.props;
        return(
            <Paper className={classes.paper1} >
                <Table className={classes.appbarTable}>
                    <TableRow>
                        <TableCell rowSpan="2" style={{width : 150}}>
                        <div class="text-uppercase" align = 'center'>조회시각</div>
                        </TableCell>
                        <TableCell rowSpan="2">
                        <div align = 'center'>미입고 대수</div>
                        </TableCell>
                        <TableCell rowSpan="2" colSpan="2">
                        <div align = 'center'>금일 처리 대수</div>
                        </TableCell>
                        <TableCell rowSpan="2" colSpan="2">
                        <div align = 'center'>주간 처리 대수</div>
                        </TableCell>
                        <TableCell colSpan="3">
                        <div align = 'center'>총 잔여 대수</div>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan="2">
                        <div align = 'center'>현재 잔여 대수</div>
                        </TableCell>
                        <TableCell>
                        <div align = 'center'>집계</div>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell rowSpan="2">
                        <div align = 'center'>{this.state.time}</div>
                        </TableCell>
                        <TableCell rowSpan="2">
                        <div align = 'center'>{this.state.not_in_reasonCount}</div>
                        </TableCell>
                        <TableCell>
                        <div>입고</div>
                        </TableCell>
                        <TableCell>
                        <div>{this.state.today_first_in_reasonCount}</div>
                        </TableCell>
                        <TableCell>
                        <div>입고</div>
                        </TableCell>
                        <TableCell>
                        <div>{this.state.week_first_in_reasonCount}</div>
                        </TableCell>
                        <TableCell>
                        <div>입고</div>
                        </TableCell>
                        <TableCell>
                        <div>{this.state.first_in_reasonCount}</div>
                        </TableCell>
                        <TableCell rowSpan="2">
                        <div>{this.state.first_in_reasonCount+this.state.tmp_final_reasonCount + this.state.not_in_reasonCount}</div>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                        <div>출고</div>
                        </TableCell>
                        <TableCell>
                        <div>{this.state.today_final_reasonCount}</div>
                        </TableCell>
                        <TableCell>
                        <div>출고</div>
                        </TableCell>
                        <TableCell>
                        <div>{this.state.week_final_reasonCount}</div>
                        </TableCell>
                        <TableCell>
                        <div>임시출고</div>
                        </TableCell>
                        <TableCell>
                        <div>{this.state.tmp_final_reasonCount}</div>
                        </TableCell>
                    </TableRow>
                </Table>
            </Paper>
        )
    }
}

export default withStyles(styles)(SttsTable);