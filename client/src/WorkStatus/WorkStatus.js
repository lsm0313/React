import React from 'react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import { fade } from '@material-ui/core/styles/colorManipulator';
import SearchIcon from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button';
import { get,post } from 'axios';
import { CSVLink } from "react-csv";
import {Route} from 'react-router-dom';
import {searchResult} from '../searchResult';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';
import Drawer from '@material-ui/core/Drawer';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ReactPaginate from 'react-paginate';
import WorkAdd from '../WorkComponents/WorkAdd';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import BuildIcon from '@material-ui/icons/Build';
import DirectionsCarIcon from '@material-ui/icons/DirectionsCar';
import Divider from '@material-ui/core/Divider';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import moment from 'moment';

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
      width: '60%',
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
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing.unit,
        width: 'auto',
      },
    },
    searchIcon: {
      width: theme.spacing.unit * 9,
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoot: {
      color: 'inherit',
      width: '100%',
    },
    inputInput: {
      paddingTop: theme.spacing.unit,
      paddingRight: theme.spacing.unit,
      paddingBottom: theme.spacing.unit,
      paddingLeft: theme.spacing.unit * 10,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: 120,
        '&:focus': {
          width: 200,
        },
      },
    },
    paparRoot: {
      position: 'relative',
      fontsize: '14px',
    },
    appbarTable:{
      fontSize: '7pt',
      width: 850,
      hight: 80
      
    },
});

function numberAddComma(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

class WorkStatus extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        completed: 0,
        Data: [],
        drawerOpened: false,
        totalCount:'',
        current_page: 1,
        selectedPage: 0,
        csvData: [],
        csvStorageData:[],
      }
    }

    progress = () => {
      const { completed } = this.state;
      this.setState({ completed: completed >= 100 ? 0 : completed + 1});
    }

    stateRefresh = () => {
      this.setState({
        completed: 0,
        data: [],
      });
    }

    componentWillMount(){
      this.makeHttpRequestWithPage();
      this.fetchWorksCount();
      this.timer = setInterval(this.progress, 20);
      this.fetch_CSVdata();
      this.fetch_storage_CSVdata();
    }

    shouldComponentUpdate(nextProps, nextState) {
      return (this.state.Data!==nextState.Data) || (this.state.totalCount!==nextState.totalCount) || (this.state.drawerOpened !== nextState.drawerOpened) || 
      (this.state.csvData!==nextState.csvData && this.state.csvData==='') || (this.state.Data==='') || (this.state.csvStorageData !== nextState.csvStorageData)
    }

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

    handlePageClick = data => {
      this.stateRefresh();
      let selected = data.selected;
      let offset = Math.ceil(selected * this.props.perPage);
  
      this.setState({ offset: offset }, () => {
        this.makeHttpRequestWithPage(selected+1 );
      });
      window.scrollTo(0,0);
    };

    makeHttpRequestWithPage = async pageNumber => {
      const response = await get(`/api/task/sampleAPI/`+this.props.location.state.admin+'/'+pageNumber);
      
      this.setState({
        
        
        Data:response.data,
        total:this.state.totalCount[0],
        per_page:response.data.perPageCount,
        current_page:response.data.pageNo,
        pageCount: this.state.totalCount[0] / 20
      });   
       
    }

    fetchWorksCount=()=>{
      get('../api/task/getWorkCount')
        .then((response) => {
          this.setState({
            totalCount: response.data[0].totalCount
        })
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  fetch_CSVdata=()=>{
    get('../api/task/CSVData/')
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
    get('../api/task/storageCSVData')
      .then((response) => {
      this.setState({
        csvStorageData: response.data
      })
    })
    .catch(function (error) {
      console.log(error);
    })
  }

  
    
    render(){
        const { classes } = this.props;
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
                <ListItem button onClick={this.handleClickCloseDrawer}>
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
            </Toolbar>
            </AppBar>
            <br/>
              <div align="center">
                <WorkAdd chkDetail={0} userName = {this.props.location.state.userName} admin ={this.props.location.state.admin}/><br/>
                <Paper className={classes.paper} >
                    <div align='right'>
                        <Button variant="contained">
                          <CSVLink data={this.state.csvStorageData} filename={moment().format('YYYYMMDDHHmm_')+"보관_현황.csv"} separator={","}>
                            보관.CSV
                          </CSVLink>
                        </Button>&nbsp;
                        <Button variant="contained">
                          <CSVLink data={this.state.csvData} filename={moment().format('YYYYMMDDHHmm_')+"야드_작업_현황.csv"} separator={","}>
                            작업현황.CSV
                          </CSVLink>
                        </Button>
                    </div>
                </Paper>
                <Paper className={classes.paper} >
                    <Table size = 'small' className={classes.table}>
                      <TableHead>
                        <TableRow>
                          <TableCell align = "center"><div>순번</div></TableCell>
                          <TableCell align = "center"><div>분류</div></TableCell>
                          <TableCell align = "center"><div>입고사유</div></TableCell>
                          <TableCell align = "center"><div>의뢰업체명</div></TableCell>
                          <TableCell align = "center"><div>차량모델</div></TableCell>
                          <TableCell align = "center"><div>차대번호</div></TableCell>
                          <TableCell align = "center"><div>입고일</div></TableCell>
                          <TableCell align = "center"><div>총 금액 (부가세 포함)</div></TableCell>
                        </TableRow>
                      </TableHead>
                        {this.state.Data !== '' ? 
                          this.state.Data.map((c)=>
                            <TableRow>
                              <TableCell align = "center"><div>{c.IDX}</div></TableCell>
                              <TableCell align = "center"><div>{c.classify}</div></TableCell>
                              <TableCell align = "center"><div>{c.first_in_reason}</div></TableCell>
                              <TableCell align = "center"><div>{c.company}</div></TableCell>
                              <TableCell align = "center"><div>{c.model}</div></TableCell>
                              <TableCell align = "center" onClick={()=>{ 
                                this.props.history.push({
                                pathname : '/DetailsWorkStatus/',
                                state :{ 
                                  admin : this.props.location.state.admin,
                                  userName : this.props.location.state.userName,
                                  chassis_no : c.chassis_no,
                                  main_IDX : c.main_IDX,
                                  model: c.model,
                                  in_date:c.in_date,
                                  classify:c.classify,
                                  first_in_reason:c.first_in_reason,
                                  status_code:c.status_code
                                }
                              });}}><div>{c.chassis_no}</div></TableCell>
                              <TableCell align = "center"><div>{c.in_date}</div></TableCell>
                              <TableCell align = "right"><div>{c.total_cost?numberAddComma(c.total_cost):0} (원)</div></TableCell>
                            </TableRow>
                          )
                        : 
                          <TableRow>
                            <TableCell colSpan="8" align="center">
                              <CircularProgress className={classes.progress} variant="determinate" value={this.state.completed}/>
                            </TableCell>
                          </TableRow>
                        }  
                    </Table>
                </Paper>
              </div>
              <div align="center">
                <ReactPaginate
                  initialPage={ 0 }
                  pageCount={(this.state.totalCount)/20}
                  previousLabel="Prev"
                  nextLabel="Next"
                  breakLabel="..."
                  activeClassName="active"
                  breakClassName="ellipsis"
                  breakLinkClassName="anchorLink"
                  containerClassName={'pagination'}
                  onPageChange={this.handlePageClick}
                />
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
            
        )
      }
    };
}

export default withStyles(styles)(WorkStatus);
