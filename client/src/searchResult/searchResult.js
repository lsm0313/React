import React, { Component } from 'react';
import Customer from '../components/Customer';
import CustomerUser from '../components/CustomerUser';
import './App.css';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { get } from 'axios';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Button from '@material-ui/core/Button';
import {Route} from 'react-router-dom';
import {adminView} from '../adminView';
import {userView} from '../userView';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';
import Drawer from '@material-ui/core/Drawer';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import BuildIcon from '@material-ui/icons/Build';
import DirectionsCarIcon from '@material-ui/icons/DirectionsCar';
import Divider from '@material-ui/core/Divider';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

const styles = theme => ({
  root: {
    width: '100%',
    minWidth: 1080,
    fontSize : '9pt',
    font:'돋움'
  },
  menu: {
    marginTop: 15,
    marginBottom: 15,
  },
  paper: {
    width: '95%',
    marginLeft: 18,
    marginRight: 18,
    fontSize : '9pt',
    font :'돋움'
  },
  progress: {
    margin: theme.spacing.unit * 2
  },
  grow: {
    flexGrow: 1,
  },
  tableHead: {
    fontSize: '9pt',
    font :'돋움'
  },
  table: {
    fontSize: '9pt',
    font :'돋움'
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
  paper1:{
    width: 850,
    hight: 80
  }
});

let sort = true;

function objSort(sortKey){
  return function(a, b) {

    if ( sort ){  return a[sortKey] < b[sortKey] ? -1 : 1; }
    
    else  { return a[sortKey] > b[sortKey] ? -1 : 1;} 

	}
}

class ResultView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      customers: '',
      completed: 0,
      searchKeyword: '',
      data: [],
      offset: 0,
      total: null,
      sortChk: true,
      drawerOpened: false,
    };
    this.handleClickEvent = this.handleClickEvent.bind(this)
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (this.state.customers==='') || (nextState.searchKeyword !== this.state.searchKeyword) || (nextState.sortChk !==this.state.sortChk) || (nextState.drawerOpened !== this.state.drawerOpened);
  }
  
  componentWillMount() {
    this.timer = setInterval(this.progress, 20);
    this.fetchSearsearchResult();
  }

  fetchSearsearchResult= () =>{
    get('../api/customerSearch/'+this.props.location.state.searchKeyword.replace(" ", "")+'/'+this.props.location.state.searchOption)
    .then((response) => {
        this.setState({
            customers: response.data
        })
    });
}

  progress = () => {
    const { completed } = this.state;
    this.setState({ completed: completed >= 100 ? 0 : completed + 1});
  }

  handleValueChange = (e) => {
    let nextState = {};
    nextState[e.target.name] = e.target.value;
    this.setState(nextState);
  }

  handleClickEvent = (e, sortKey) =>{
    this.state.customers.sort(objSort(sortKey));
    sort = !sort;
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

  render = () => {
    try{
    if(this.props.location.state.userName){
      if(this.props.location.state.admin >= 1){
          const filteredComponents = (data) => {
              return data.map((c) => {
                return <Customer stateRefresh={this.stateRefresh} key={c.IDX} id={c.IDX} classify={c.classify} first_in_reason={c.first_in_reason} company={c.company} 
                initial={c.initial} maker={c.maker} model={c.model} year={c.year} chassis_no={c.chassis_no} status_code={c.status_code} reg_date= {c.reg_date} in_date={c.in_date}
                release_reason={c.release_reason} release_dest={c.release_dest} out_date={c.out_date} last_date={c.last_date} release_code={c.release_code} checker={c.checker} 
                step={c.step} auth={c.auth} userName ={this.props.location.state.userName} admin ={this.props.location.state.admin}/>  
              });
          }

          const { classes } = this.props;        
          
              return (
              <div className={classes.root}>
                  <AppBar position="static">
                  <Toolbar>
                    <IconButton edge="start" className={classes.menu} color="inherit" aria-label="Open drawer" onClick={this.handleClickOpenDrawer}>
                      <MenuIcon style={{fontSize:23}}/>
                    </IconButton>
                    <Typography className={classes.title} variant="h6" color="inherit" noWrap>
                      <div>야드 입·출고 시스템 V 1.1.1&nbsp;&nbsp;</div>
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
                                }
                            }}>
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
                      </Drawer><div className={classes.grow} />
                      <Route render={({ history}) => (
                      <Button variant= "contained" color="" onClick={() => { 
                        this.props.history.push({
                        pathname : '/adminView/',
                        state :{ 
                          admin : this.props.location.state.admin,
                          userName : this.props.location.state.userName
                        }
                        });}}><ArrowBackIcon style={{fontSize:22}}/></Button>
                      )}/>
                      <Route path='/adminView' component={adminView}/>
                  </Toolbar>
                  </AppBar>            
                  <div align = 'center'>
                      <br/>
                      <h1 style ={{fontFamily:'돋움'}}>검색 결과</h1>
                  <br/><br/>
                  <Paper className={classes.paper} >
                      <Table size = 'small' className={classes.table}>
                          <TableHead>
                              <TableRow>
                                <TableCell className={classes.tableHead} onClick={(e) => this.handleClickEvent('IDX')} align = 'center'><div>순번</div></TableCell>
                                <TableCell className={classes.tableHead} onClick={(e) => this.handleClickEvent('classify')} align = 'center'><div>분류</div></TableCell>
                                <TableCell className={classes.tableHead} onClick={(e) => this.handleClickEvent('first_in_reason')} align = 'center'><div>입고 사유</div></TableCell>
                                <TableCell className={classes.tableHead} onClick={(e) => this.handleClickEvent('company')} align = 'center'><div>의뢰 업체명</div></TableCell>
                                <TableCell className={classes.tableHead} onClick={(e) => this.handleClickEvent('model')} align = 'center'><div>차량모델</div></TableCell>
                                <TableCell className={classes.tableHead} onClick={(e) => this.handleClickEvent('year')} align = 'center'><div>연식</div></TableCell>
                                <TableCell className={classes.tableHead} onClick={(e) => this.handleClickEvent('chassis_no')} align = 'center'><div>차대번호</div></TableCell>
                                <TableCell className={classes.tableHead} onClick={(e) => this.handleClickEvent('status_code')} align = 'center'><div>입·출고 (상태)</div></TableCell>
                                <TableCell className={classes.tableHead} onClick={(e) => this.handleClickEvent('release_reason')} align = 'center'><div>출고 사유</div></TableCell>
                                <TableCell className={classes.tableHead} onClick={(e) => this.handleClickEvent('release_dest')} align = 'center'><div>목적지</div></TableCell>
                                <TableCell className={classes.tableHead} onClick={(e) => this.handleClickEvent('in_date')} align = 'center'><div>입고(날짜)</div></TableCell>
                                <TableCell className={classes.tableHead} onClick={(e) => this.handleClickEvent('out_date')} align = 'center'><div>출고(날짜)</div></TableCell>
                                <TableCell className={classes.tableHead} onClick={(e) => this.handleClickEvent('last_date')} align = 'center'><div>갱신(날짜)</div></TableCell>
                                <TableCell className={classes.tableHead} onClick={(e) => this.handleClickEvent('checker')} align = 'center'><div>입·출고 담당자</div></TableCell>
                                  <TableCell className={classes.tableHead} align = 'center'>관리자 권한</TableCell>
                              </TableRow>
                          </TableHead>
                          <TableBody>
                              {this.state.customers ? 
                              (filteredComponents(this.state.customers)) :            
                              <TableRow>
                                  <TableCell colSpan="15" align="center">
                                  <CircularProgress className={classes.progress} variant="determinate" value={this.state.completed}/>
                                  </TableCell>
                              </TableRow>
                              }
                          </TableBody>
                      </Table>
                  </Paper>
              </div>
          </div>
          );}
          else if(this.props.location.state.admin === 0){    
              const filteredComponents = (data) => {
                  return data.map((c) => {
                      return <CustomerUser admin={this.props.location.state.admin} stateRefresh={this.stateRefresh} key={c.IDX} id={c.IDX} classify={c.classify} first_in_reason={c.first_in_reason} company={c.company} 
                      initial={c.initial} maker={c.maker} model={c.model} year={c.year} chassis_no={c.chassis_no} status_code={c.status_code} reg_date= {c.reg_date} in_date={c.in_date}
                      release_reason={c.release_reason} release_dest={c.release_dest} out_date={c.out_date} last_date={c.last_date} release_code={c.release_code} checker={c.checker}
                      step={c.step} auth={c.auth} userName={this.props.location.state.userName}/> 
                  });
              }
      
              const { classes } = this.props;
              
                  return (
                  <div className={classes.root}>
                      <AppBar position="static">
                      <Toolbar>
                        <IconButton edge="start" className={classes.menu} color="inherit" aria-label="Open drawer" onClick={this.handleClickOpenDrawer}>
                          <MenuIcon style={{fontSize:23}}/>
                        </IconButton>
                        <Typography className={classes.title} variant="h6" color="inherit" noWrap>
                          <div>야드 입·출고 시스템 V 1.1.1&nbsp;&nbsp;</div>
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
                                }
                            }}>
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
                      </Drawer><div className={classes.grow} />
                        <Button variant= "contained" color="" onClick={() => { 
                          this.props.history.push({
                          pathname : '/userView/',
                          state :{ 
                            admin : this.props.location.state.admin,
                            userName : this.props.location.state.userName
                          }
                          });}}><ArrowBackIcon style={{fontSize:22}}/></Button>
                        <Route path='/userView' component={userView}/>
                      </Toolbar>
                      </AppBar>            
                      <div align = 'center'>
                          <br/>
                          <h1 style ={{fontFamily:'돋움'}}>검색 결과</h1>
                      <br/><br/>
                      <Paper className={classes.paper} >
                          <Table size = 'small' className={classes.table}>
                              <TableHead>
                                  <TableRow>
                                    <TableCell className={classes.tableHead} onClick={(e) => this.handleClickEvent('IDX')} align = 'center'><div>순번</div></TableCell>
                                    <TableCell className={classes.tableHead} onClick={(e) => this.handleClickEvent('classify')} align = 'center'><div>분류</div></TableCell>
                                    <TableCell className={classes.tableHead} onClick={(e) => this.handleClickEvent('first_in_reason')} align = 'center'><div>입고 사유</div></TableCell>
                                    <TableCell className={classes.tableHead} onClick={(e) => this.handleClickEvent('company')} align = 'center'><div>의뢰 업체명</div></TableCell>
                                    <TableCell className={classes.tableHead} onClick={(e) => this.handleClickEvent('model')} align = 'center'><div>차량모델</div></TableCell>
                                    <TableCell className={classes.tableHead} onClick={(e) => this.handleClickEvent('year')} align = 'center'><div>연식</div></TableCell>
                                    <TableCell className={classes.tableHead} onClick={(e) => this.handleClickEvent('chassis_no')} align = 'center'><div>차대번호</div></TableCell>
                                    <TableCell className={classes.tableHead} onClick={(e) => this.handleClickEvent('status_code')} align = 'center'><div>입·출고 (상태)</div></TableCell>
                                    <TableCell className={classes.tableHead} onClick={(e) => this.handleClickEvent('release_reason')} align = 'center'><div>출고 사유</div></TableCell>
                                    <TableCell className={classes.tableHead} onClick={(e) => this.handleClickEvent('release_dest')} align = 'center'><div>목적지</div></TableCell>
                                    <TableCell className={classes.tableHead} onClick={(e) => this.handleClickEvent('in_date')} align = 'center'><div>입고(날짜)</div></TableCell>
                                    <TableCell className={classes.tableHead} onClick={(e) => this.handleClickEvent('out_date')} align = 'center'><div>출고(날짜)</div></TableCell>
                                    <TableCell className={classes.tableHead} onClick={(e) => this.handleClickEvent('last_date')} align = 'center'><div>갱신(날짜)</div></TableCell>
                                    <TableCell className={classes.tableHead} onClick={(e) => this.handleClickEvent('checker')} align = 'center'><div>입·출고 담당자</div></TableCell>
                                    <TableCell className={classes.tableHead} align = 'center'>기타</TableCell>
                                  </TableRow>
                              </TableHead>
                              <TableBody>
                                  {this.state.customers ? 
                                  (filteredComponents(this.state.customers)) :            
                                  <TableRow>
                                      <TableCell colSpan="15" align="center">
                                      <CircularProgress className={classes.progress} variant="determinate" value={this.state.completed}/>
                                      </TableCell>
                                  </TableRow>
                                  }
                              </TableBody>
                          </Table>
                      </Paper>
                  </div>
              </div>
              );}
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
      }catch{
        return(
          <div align = 'center' className="todo-list-template">
            <div height ="50%" align ="center" className="form-wrapper">
            <ErrorOutlineIcon color="disabled" style={{fontSize:90}}/><br/>
            <Typography style={{fontSize:28}} align = 'center'>잘못된 접근입니다.<br/></Typography>
              <Route render={({ history}) => (
                <Button variant="contained" color="primary" onClick={() => { history.push('/') }}>확인</Button>
              )}/>
            </div>
            <br/>
        </div>
      );
    }
  }
}

export default withStyles(styles)(ResultView);
