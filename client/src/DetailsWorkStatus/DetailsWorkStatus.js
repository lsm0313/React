import React from 'react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { get } from 'axios';
import { CSVLink } from "react-csv";
import {Route} from 'react-router-dom';
import {WorkStatus} from '../WorkStatus';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';
import Drawer from '@material-ui/core/Drawer';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import WorkUpdate from '../WorkComponents/WorkUpdate'
import WorkDelete from '../WorkComponents/WorkDelete'
import Grid from '@material-ui/core/Grid';
import WorkAdd from '../WorkComponents/WorkAdd';
import WorkAdmission from '../WorkComponents/WorkAdmission';
import WorkNextStep from '../WorkComponents/WorkNextStep';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import BuildIcon from '@material-ui/icons/Build';
import DirectionsCarIcon from '@material-ui/icons/DirectionsCar';
import Divider from '@material-ui/core/Divider';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import moment from 'moment';

function numberAddComma(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const styles = theme => ({
    root: {
        width: '100%',
        minWidth: 1080,
    },
    menu: {
        marginTop: 15,
        marginBottom: 15,
    },
    paper: {
        width: '95%',
        marginLeft: 18,
        marginRight: 18,
    },
    progress: {
        margin: theme.spacing.unit * 2
    },
    grow: {
        flexGrow: 1,
    },
    tableHead: {
        fontSize: '9pt',
        fontfamily :'"Dotum"'
    },
    table: {
        fontSize: '9pt',
        fontfamily :'"Dotum"'
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
    title: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
});

class DetailsWorkStatus extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            completed: 0,
            Data: [],
            drawerOpened: false,
            csvData: [],
            csvstorageData:[],
            total_cost:[],
            package_cost:[],
            status_code:''
        }
    }

    progress = () => {
        const { completed } = this.state;
        this.setState({ completed: completed >= 100 ? 0 : completed + 1});
    }
  
    stateRefresh = () => {
        this.setState({
            completed: 0,
            Data: [],
        });
    }
    componentWillMount(){
        this.timer = setInterval(this.progress, 20);
        this.fetch_data();
        this.fetch_CSVdata();
        this.getTotal_cost();
        this.fetch_storage_CSVdata();
    }

    fetch_data=()=>{
        get('../api/task/taskStatus/'+this.props.location.state.chassis_no+'/'+this.props.location.state.main_IDX)
        .then((response) => {
        this.setState({
            Data: response.data
        })
    })}

    handleClickOpenDrawer= () => {
        this.setState({
            drawerOpened : true,
        });
    };
      
    handleClickCloseDrawer= () => {
        this.setState({
            drawerOpened : false,
        });
    };

    getTotal_cost=()=>{
        get('../api/task/totalCost/'+this.props.location.state.main_IDX)
        .then((response) => {
        this.setState({
            total_cost: response.data[0].total_cost
        })
    })}

    getPackage_Cost=()=>{
        get('../api/task/packageCost/'+this.props.location.state.main_IDX+'/'+this.props.location.state.chassis_no)
        .then((response) => {
        if(response.data[0]){
            this.setState({
                package_cost: response.data[0].package_cost
            })
        }else{
            this.setState({
                package_cost: 0
            })
        }
        
    })}

    shouldComponentUpdate(nextProps, nextState) {
        return (this.state.Data!==nextState.Data) || (this.state.drawerOpened !== nextState.drawerOpened) || (this.state.csvData!==nextState.csvData && this.state.csvData==='') || 
        (this.state.total_cost !== nextState.total_cost) || (this.state.Data==='') || (this.state.package_cost !== nextState.package_cost) || (this.state.csvstorageData !== nextState.csvstorageData)
    }

    fetch_CSVdata=()=>{
        get('../api/task/CSVData/'+this.props.location.state.chassis_no)
            .then((response) => {
            this.setState({
                csvData: response.data
            })
        })
        .catch(function (error) {
            console.log(error);
        })
    }

    fetch_storage_CSVdata=()=>{
        get('../api/task/storageCSVData/'+this.props.location.state.chassis_no)
            .then((response) => {
            this.setState({
                csvstorageData: response.data
            })
        })
        .catch(function (error) {
            console.log(error);
        })
    }    

    render(){
        const { classes } = this.props;
        if(this.props.location.state.first_in_reason==="수A" || this.props.location.state.status_code==="수A" || this.props.location.state.first_in_reason==="위탁"){
            this.getPackage_Cost();
        }
        try{        
            if(this.props.location.state.userName){
            return(
                <Typography>
                <div className={classes.root}>
                    <AppBar position="static">
                    <Toolbar>
                    <IconButton edge="start" className={classes.menu} color="inherit" aria-label="Open drawer" onClick={this.handleClickOpenDrawer}>
                        <MenuIcon style={{fontSize:21}}/>
                    </IconButton>
                    <Typography className={classes.title} variant="h6" color="inherit" noWrap>
                        <div>야드 입·출고 시스템 V 1.1.1</div>
                    </Typography>
                    <Drawer open={this.state.drawerOpened} onClose={this.handleClickCloseDrawer} >
                    <List style={{width : 280}}>
                        <ListItem button onClick={this.handleClickCloseDrawer} >
                        <ArrowBackIcon style={{fontSize:23}}/>
                        </ListItem>
                        <ListItem button onClick={() => {
                        if(this.props.location.state.admin>=1){
                            this.props.history.push({
                                pathname : '/adminView/',
                                state :{ 
                                admin : this.props.location.state.admin,
                                userName : this.props.location.state.userName
                            }
                        });}
                        else{
                            this.props.history.push({
                            pathname : '/userView/',
                            state :{ 
                                admin : this.props.location.state.admin,
                                userName : this.props.location.state.userName
                            }
                            });
                        }}} 
                        >
                            <ListItemIcon><DirectionsCarIcon style={{fontSize:23}}/></ListItemIcon><ListItemText style={{fontSize:20}}>차량 입·출고 현황</ListItemText>
                        </ListItem>
                        <ListItem button onClick={() => { 
                            this.props.history.push({
                            pathname : '/WorkStatus/',
                            state :{ 
                                admin : this.props.location.state.admin,
                                userName : this.props.location.state.userName
                            }
                        });}}>
                            <ListItemIcon><BuildIcon style={{fontSize:23}}/></ListItemIcon><ListItemText style={{fontSize:20}}>작업 현황</ListItemText>
                        </ListItem>
                    </List>
                    <Divider/>
                    <List>
                        <ListItem button onClick={() => { 
                            this.props.history.push({
                            pathname : '/',
                            });}}>
                            <ListItemIcon><ExitToAppIcon style={{fontSize:23}}/></ListItemIcon><ListItemText style={{fontSize:20}}>로그아웃</ListItemText>
                        </ListItem>
                    </List>
                </Drawer>
                <div className={classes.grow} />
                    <Route render={({ history}) => (
                        <Button variant= "contained" color="" onClick={() => { 
                            this.props.history.goBack()}}><ArrowBackIcon style={{fontSize:22}}/></Button>
                        )}/>
                        <Route path='/WorkStatus' component={WorkStatus}/>
                        
                    </Toolbar>
                    </AppBar>
                    <br/>
                    <div align ="left" >

                        <table border="0">
                            <tr><td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td><td><h4>분&nbsp;&nbsp;&nbsp;&nbsp;류 :&nbsp;</h4></td><td><h4>{this.props.location.state.classify}</h4></td>
                                <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td><td><h4>입고날짜 :&nbsp;</h4></td><td><h4>{this.props.location.state.in_date}</h4></td>
                                <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td><td><h4>차량모델 :&nbsp;</h4></td><td><h4>{this.props.location.state.model}</h4></td></tr>
                            <tr><td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td><td><h4>입고사유 :&nbsp;</h4></td><td><h4>{this.props.location.state.first_in_reason}</h4></td>
                                <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td><td><h4>차대번호 :&nbsp;</h4></td><td><h4>{this.props.location.state.chassis_no}</h4></td>
                            </tr>
                        </table>            
                    </div>
                    <div align="center">
                        <WorkAdd chkDetail={1} admin = {this.props.location.state.admin} userName={this.props.location.state.userName} status_code={this.props.location.state.status_code} chassis_no={this.props.location.state.chassis_no} main_IDX={this.props.location.state.main_IDX} first_in_reason={this.props.location.state.first_in_reason} packageYN={this.state.package_cost>0?1/*패키지금액이 있을 때*/:0}/>
                        <br/>
                        <Paper className={classes.paper}>
                            <div align='right'>
                                <Button variant="contained">
                                    <CSVLink data={this.state.csvstorageData} filename={moment().format('YYYYMMDDHHmm_')+"보관_현황.csv"} separator={","}>
                                        보관.CSV
                                    </CSVLink>
                                </Button>&nbsp;
                                <Button variant="contained">
                                    <CSVLink data={this.state.csvData} filename={moment().format('YYYYMMDDHHmm_')+this.props.location.state.chassis_no+"_야드_작업_현황.csv"} separator={","}>
                                        작업현황.CSV
                                    </CSVLink>
                                </Button>
                            </div>
                        </Paper>
                        <Paper className={classes.paper}>
                            <Table size = 'small' className={classes.table}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align = 'center'>
                                            <div>순번</div>
                                        </TableCell>
                                        <TableCell align = 'center'>
                                            <div>코드번호</div>
                                        </TableCell>
                                        <TableCell align = 'center'>
                                            <div>작업명</div>
                                        </TableCell>
                                        <TableCell align = 'center'>
                                            <div>부품비(원)</div>
                                        </TableCell>
                                        <TableCell align = 'center'>
                                            <div>부품비 부가세(원)</div>
                                        </TableCell>
                                        <TableCell align = 'center'>
                                            <div>공임비(원)</div>
                                        </TableCell>
                                        <TableCell align = 'center'>
                                            <div>작업 신청자</div>
                                        </TableCell>
                                        <TableCell align = 'center'>
                                            <div>신청 날짜</div>
                                        </TableCell>
                                        <TableCell align = 'center'>
                                            <div>승인 여부</div>
                                        </TableCell>
                                        <TableCell align = 'center'>
                                            <div>작업 기한</div>
                                        </TableCell>
                                        <TableCell align = 'center'>
                                            <div>진행 상태</div>
                                        </TableCell>
                                        <TableCell align = 'center'>
                                            <div>작업 시작 날짜</div>
                                        </TableCell>
                                        <TableCell align = 'center'>
                                            <div>권한</div>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                {this.state.Data.length !==0 ?
                                    this.state.Data.map((c)=>
                                        <TableRow>
                                            <TableCell align = "center"><div>{c.IDX}</div></TableCell>
                                            <TableCell align = "center"><div>{c.full_task_code}</div></TableCell>
                                            <TableCell align = "center"><div>{c.small_task_name}</div></TableCell>
                                            <TableCell align = "right"><div>{numberAddComma(c.part_cost)}</div></TableCell>
                                            <TableCell align = "right"><div>{numberAddComma(c.part_cost*0.1)}</div></TableCell>
                                            <TableCell align = "right"><div>{numberAddComma(c.labor_cost)}</div></TableCell>
                                            <TableCell align = "center"><div>{c.task_requester}</div></TableCell>
                                            <TableCell align = "center"><div>{c.request_date}</div></TableCell>
                                            <TableCell align = "center"><div>{c.approval_status === 1 ? '승인' : '승인 대기'}</div></TableCell>
                                            <TableCell align = "center"><div>{c.task_deadline}</div></TableCell>
                                            <TableCell align = "center"><div>{c.performance_status}</div></TableCell>
                                            <TableCell align = "center"><div>{c.task_start_date}</div></TableCell>
                                            <TableCell align = "center">
                                                <Grid container spacing={-1} align = 'center'>
                                                    <Grid item>
                                                        <WorkAdmission IDX={c.IDX} small_task_name={c.small_task_name} admin = {this.props.location.state.admin} performanceStatus = {c.performance_status} approvalStatus = {c.approval_status} chassis_no={c.chassis_no} userName = {this.props.location.state.userName} task_name= {c.small_task_name} part_cost={c.part_cost} labor_cost={c.labor_cost} />
                                                    </Grid>
                                                    <Grid item>
                                                        <WorkNextStep status_code={c.status_code} small_task_name={c.small_task_name} IDX={c.IDX} main_IDX={c.main_IDX} admin = {this.props.location.state.admin} fullTaskCode={c.full_task_code} performanceStatus = {c.performance_status} approvalStatus = {c.approval_status} chassis_no={c.chassis_no} userName = {this.props.location.state.userName} task_name= {c.small_task_name} part_cost={c.part_cost} labor_cost={c.labor_cost} classify={this.props.location.state.classify}/>
                                                    </Grid>      
                                                    <Grid item>
                                                        <WorkUpdate chassis_no={c.chassis_no} IDX={c.IDX} admin = {this.props.location.state.admin} userName = {this.props.location.state.userName} />
                                                    </Grid>
                                                    <Grid>
                                                        <WorkDelete IDX={c.IDX} admin = {this.props.location.state.admin} chassis_no = {c.chassis_no} userName = {this.props.location.state.userName}/>
                                                    </Grid>
                                                </Grid>
                                            </TableCell>
                                        </TableRow>
                                    )
                                    :
                                    <TableRow>
                                        <TableCell colSpan="16" align="center">
                                            -
                                        </TableCell>
                                    </TableRow>

                                }
                                <TableRow>
                                    <TableCell colSpan="15" align ="right">
                                    {this.props.location.state.first_in_reason==="수A" || this.props.location.state.first_in_reason==="위탁" || this.props.location.state.status_code === "수A"?
                                        <div style={{fontSize:18}}>패키지 금액 : &nbsp;<b>{this.state.package_cost === 0 ? 0 : numberAddComma(this.state.package_cost)}</b> (원)<br/>
                                        총 수리비 (부가세 포함) : &nbsp;<b>{this.state.total_cost ? numberAddComma(this.state.total_cost) : 0 }</b> (원)</div>
                                        :
                                        <div/>
                                    }
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell colSpan="15" align ="right">
                                        <div style={{fontSize:18}}>총 금액 (부가세 포함) : <b>{(this.state.total_cost === null && this.state.package_cost === 0) ? 0 : numberAddComma(this.state.total_cost+(this.state.package_cost*1.1))}</b> (원) </div>
                                    </TableCell>
                                </TableRow>
                            </Table>
                        </Paper>
                        <br/>
                    </div>
                </div>
                </Typography>
            );
            }else{
                return(
                    <div align = 'center' className="todo-list-template">
                        <div className="form-wrapper">
                        <br/>
                        <ErrorOutlineIcon color="disabled" style={{fontSize:90}}/><br/>
                        <Typography style={{fontSize:28}}>세션이 만료되어 로그인이 필요합니다.<br/></Typography>
                        <div><br/>
                        <Route render={({ history}) => (
                            <Button variant="contained" color="primary" onClick={() => { history.push('/') }}>확인</Button>
                        )}/>
                        <br/>
                        </div>
                        <br/>
                        </div>
                    </div>
                
                );
            }
        }catch{
            return(
                <div align = 'center' className="todo-list-template">
                    <div height ="50%" align ="center" className="form-wrapper">
                        <ErrorOutlineIcon color="disabled" style={{fontSize:90}}/><br/>
                        <Typography style={{fontSize:28}} align = 'center'>권한이 없습니다.<br/></Typography>
                            <Route render={({ history}) => (
                            <Button variant="contained" color="primary" onClick={() => { history.push('/') }}>확인</Button>
                        )}/>
                    </div>
                <br/>
                </div>
            );
        }
    };
}

export default withStyles(styles)(DetailsWorkStatus);
