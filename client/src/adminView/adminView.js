import React, { Component } from 'react';
import Customer from '../components/Customer';
import CustomerAdd from '../components/CustomerAdd';
import SttsView from '../components/SttsView';
import SttsTable from '../components/SttsTable';
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
import InputBase from '@material-ui/core/InputBase';
import { fade } from '@material-ui/core/styles/colorManipulator';
import SearchIcon from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button';
import { get } from 'axios';
import { CSVLink } from "react-csv";
import TextField from '@material-ui/core/TextField';
import ReactPaginate from 'react-paginate';
import {Route} from 'react-router-dom';
import {searchResult} from '../searchResult';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';
import Drawer from '@material-ui/core/Drawer';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Grid from '@material-ui/core/Grid';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import BuildIcon from '@material-ui/icons/Build';
import DirectionsCarIcon from '@material-ui/icons/DirectionsCar';
import Divider from '@material-ui/core/Divider';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import moment from 'moment';


const styles = theme => ({
  root: {
    //width: '100%',
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

  inline: {
    display: 'inline-block',
  }
});

let sort = true;

function objSort(sortKey){
  return function(a, b) {

    if ( sort ){  return a[sortKey] < b[sortKey] ? -1 : 1; }
    
    else { return a[sortKey] > b[sortKey] ? -1 : 1;} 

	}
}

class adminView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      customers: '',
      completed: 0,
      searchKeyword: '',
      data: [],
      csvData:[],
      offset: 0,
      classifyFilter:'',
      modelFilter:'',
      yearFilter:'',
      chassis_no:'',
      in_dateFilter:'',
      out_dateFilter:'',
      last_dateFilter:'',
      status_codeFilter:'',
      release_codeFilter:'',
      checkerFilter:'',
      totalCount:'',
      searchOption:'차대번호',
      total: null,
      per_page: null,
      current_page: 1,
      selectedPage: 0,
      sortChk: true,
      drawerOpened: false,
    };
    this.handleClickEvent = this.handleClickEvent.bind(this)
  }

  stateRefresh = () => {
    this.setState({
      customers: '',
      completed: 0,
      data: [],
      csvData: [],
      offset: 0,
      step:'',
    });
  }

  componentWillMount(){
    this.makeHttpRequestWithPage();
    this.fetchCustomersCount();

    this.fetch_CSVdata();
    this.timer = setInterval(this.progress, 20);
  }
  
  shouldComponentUpdate(nextProps, nextState) {
    return (this.state.customers==='') || (nextState.searchKeyword !== this.state.searchKeyword) || (nextState.classifyFilter !==this.state.classifyFilter) || 
    (nextState.companyFilter !==this.state.companyFilter) || (nextState.modelFilter !==this.state.modelFilter) || (nextState.status_codeFilter !==this.state.status_codeFilter) || 
    (nextState.in_dateFilter !==this.state.in_dateFilter) || (nextState.out_dateFilter !==this.state.out_dateFilter) || (nextState.last_dateFilter !==this.state.last_dateFilter) || 
    (nextState.checkerFilter !==this.state.checkerFilter) || (nextState.sortChk !==this.state.sortChk) || (nextState.drawerOpened !== this.state.drawerOpened) || (this.state.csvData===''&&this.state.csvData!==nextState.csvData) ||
    (this.state.customers!==nextState.customers) || (nextState.totalCount !== this.state.totalCount); 
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

  fetch_CSVdata=()=>{
    get('../api/customersData/')
      .then((response) => {
      this.setState({
        csvData: response.data
      })
    })
    .catch(function (error) {
      console.log(error);
    })
  }

  fetchCustomersCount=()=>{
    get('../api/customersCount')
      .then((response) => {
        this.setState({
          totalCount: response.data[0].totalCount
      })
    })
    .catch(function (error) {
      console.log(error);
    })
  }

  

  makeHttpRequestWithPage = async pageNumber => {
    const response = await get(`/api/customers/`+pageNumber);
    this.setState({
      customers:response.data,
      total:this.state.totalCount[0],
      per_page:response.data.perPageCount,
      current_page:response.data.pageNo,
      pageCount: this.state.totalCount[0] / 20
    });    
  }

  handlePageClick = data => {
    this.stateRefresh();
    let selected = data.selected;
    let offset = Math.ceil(selected * this.props.perPage);

    this.setState({ offset: offset }, () => {
      this.makeHttpRequestWithPage(selected+1 );
    });
    window.scrollTo(0,0);
  };

  handleClickEvent = (sortKey) =>{   
    this.state.customers.sort(objSort(sortKey));
    sort = !sort;
    this.setState({
      sortChk : sort
    });
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
    const filteredComponents = (data) => {
      data = data.filter((c) => {
        return c.classify.indexOf(this.state.classifyFilter) !== -1;
      });
      data = data.filter((c) => {
        return c.model.indexOf(this.state.modelFilter.toUpperCase()) !== -1;
      });

      data = data.filter((c)=> {
        return c.status_code.indexOf(this.state.status_codeFilter) !== -1;
      })

      data = data.filter((c) => {
        return c.in_date.indexOf(this.state.in_dateFilter) !== -1;
      });
      data = data.filter((c) => {
        return c.out_date.indexOf(this.state.out_dateFilter) !== -1;
      });
      data = data.filter((c) => {
        return c.checker.indexOf(this.state.checkerFilter) !== -1;
      });

      return data.map((c) => {
        return <Customer stateRefresh={this.stateRefresh} key={c.IDX} id={c.IDX} classify={c.classify} first_in_reason={c.first_in_reason} company={c.company} 
        initial={c.initial} model={c.model} year={c.year} chassis_no={c.chassis_no} status_code={c.status_code} reg_date= {c.reg_date} in_date={c.in_date}
        release_reason={c.release_reason} release_dest={c.release_dest} out_date={c.out_date} last_date={c.last_date} release_code={c.release_code} checker={c.checker} 
        step={c.step} auth={c.auth} userName ={this.props.location.state.userName} admin={this.props.location.state.admin}/> 
      });
    }

    const { classes } = this.props;
    try{
      if(this.props.location.state.admin >= 1){
        if(this.props.location.state.userName){
        return (
          <Typography>
          <div className={classes.root}>
            <AppBar position="static">
            <Toolbar>
              <IconButton edge="start" className={classes.menu} color="inherit" aria-label="Open drawer" onClick={this.handleClickOpenDrawer}>
                <MenuIcon style={{fontSize:21}}/>
              </IconButton>
              <Typography className={classes.title} color="inherit" noWrap>
                <div>야드 입·출고 시스템 V 1.1.1</div>
              </Typography>
               <Drawer open={this.state.drawerOpened} onClose={this.handleClickCloseDrawer} >
                <List style={{width : 280}}>
                  <ListItem button onClick={this.handleClickCloseDrawer} >
                    <ArrowBackIcon style={{fontSize:23}}/>
                  </ListItem>
                  <ListItem button onClick={this.handleClickCloseDrawer} >
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
                <div className={classes.search}>
                  <select class="form-control" id="searchOption"
                    name="searchOption"
                    native
                    value={this.state.searchOption}
                    onChange={this.handleValueChange}
                    inputProps={{name: 'searchOption'}}>>
                    <option value="차대번호">차대번호</option>
                    <option value="의뢰 업체명">의뢰 업체명</option>
                  </select>
                  </div>
                  <div className={classes.search}>
                    <div className={classes.searchIcon}>
                      <SearchIcon/>
                    </div>
                    <Route render={({ history}) => (
                      <InputBase
                        placeholder="검색"
                        classes={{
                          root: classes.inputRoot,
                          input: classes.inputInput,
                        }}
                        name="searchKeyword"
                        value={this.state.searchKeyword}
                        onChange={this.handleValueChange}
                        onKeyPress={e=>{if (e.key==='Enter'){
                            if(this.state.searchKeyword.length >= 2){
                              this.props.history.push({
                              pathname : '/searchResult/',
                              state :{ 
                                searchKeyword : this.state.searchKeyword,
                                searchOption : this.state.searchOption,
                                admin : this.props.location.state.admin,
                                userName : this.props.location.state.userName,
                              }
                            }); }
                            else{
                              alert('2글자 이상 입력해주세요.');
                            }}}
                          }
                        />
                      )}/>
                  
                </div>&nbsp;
                <Route render={({ history}) => (
                  <Button variant="contained" onClick={() => { 
                    if(this.state.searchKeyword.length >= 2){
                    this.props.history.push({
                    pathname : '/searchResult/',
                    state :{ 
                      searchKeyword : this.state.searchKeyword,
                      searchOption : this.state.searchOption,
                      admin : this.props.location.state.admin,
                      userName : this.props.location.state.userName
                    }
                  }); }
                  else{
                    alert('2글자 이상 입력해주세요.');
                  }}}>검색</Button>
                )}/>
                <Route path='/searchResult' component={searchResult}/>
              </Toolbar>
            </AppBar>
            
            <div className={classes.menu} align = 'center'>
              <div className={classes.inline}>
                <Grid container spacing={-1} align = 'center'>
                  <Grid item>
                    <CustomerAdd stateRefresh={this.stateRefresh} userName={this.props.location.state.userName} admin={this.props.location.state.admin}/>
                  </Grid>
                  <Grid item>
                    <SttsView/>
                  </Grid>
                </Grid>
              </div>
              <br/><br/>
              <div align = 'right' style={{marginRight: 20}}>
                <SttsTable/>
              </div>
            </div>
            
            <div align = 'center'>
            <br/>
              <Paper className={classes.paper} >
                <div align='right'>
                  <Button variant="contained">
                    <CSVLink data={this.state.csvData} filename={moment().format('YYYYMMDDHHmm_')+"야드 입출고 차량현황.csv"} separator={","}>
                      .CSV
                    </CSVLink>
                  </Button>
                </div>
              </Paper>
              <Paper className={classes.paper} >
                <Table size = 'small' className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell className={classes.tableHead} onClick={(e) => this.handleClickEvent('IDX')} align = 'center'><div>순번</div></TableCell>
                      <TableCell className={classes.tableHead} onClick={(e) => this.handleClickEvent('classify')} align = 'center'><div>분류</div></TableCell>
                      <TableCell className={classes.tableHead} onClick={(e) => this.handleClickEvent('first_in_reason')} align = 'center'><div>입고<br/>사유</div></TableCell>
                      <TableCell className={classes.tableHead} onClick={(e) => this.handleClickEvent('company')} align = 'center'><div>의뢰 업체명</div></TableCell>
                      <TableCell className={classes.tableHead} onClick={(e) => this.handleClickEvent('model')} align = 'center'><div>차량모델</div></TableCell>
                      <TableCell className={classes.tableHead} onClick={(e) => this.handleClickEvent('year')} align = 'center'><div>연식</div></TableCell>
                      <TableCell className={classes.tableHead} onClick={(e) => this.handleClickEvent('chassis_no')} align = 'center'><div>차대번호</div></TableCell>
                      <TableCell className={classes.tableHead} onClick={(e) => this.handleClickEvent('status_code')} align = 'center'><div>입·출고<br/>(상태)</div></TableCell>
                      <TableCell className={classes.tableHead} onClick={(e) => this.handleClickEvent('release_reason')} align = 'center'><div>출고 사유</div></TableCell>
                      <TableCell className={classes.tableHead} onClick={(e) => this.handleClickEvent('release_dest')} align = 'center'><div>목적지</div></TableCell>
                      <TableCell className={classes.tableHead} onClick={(e) => this.handleClickEvent('in_date')} align = 'center'><div>입고(날짜)</div></TableCell>
                      <TableCell className={classes.tableHead} onClick={(e) => this.handleClickEvent('out_date')} align = 'center'><div>출고(날짜)</div></TableCell>
                      <TableCell className={classes.tableHead} onClick={(e) => this.handleClickEvent('last_date')} align = 'center'><div>갱신(날짜)</div></TableCell>
                      <TableCell className={classes.tableHead} onClick={(e) => this.handleClickEvent('checker')} align = 'center'><div>입·출고 담당자</div></TableCell>
                      <TableCell className={classes.tableHead} align = 'center'><div>관리자 권한</div></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableCell className={classes.table}></TableCell>
                    <TableCell align="center" className={classes.table}><TextField placeholder="분류" name="classifyFilter" style ={{width: '60px'}} value={this.state.classifyFilter} onChange={this.handleValueChange}/></TableCell>
                    <TableCell align="center" className={classes.table}></TableCell>
                    <TableCell align="center" className={classes.table}><TextField placeholder="의뢰 업체명" name="companyFilter" style ={{width: '100px'}} value={this.state.companyFilter} onChange={this.handleValueChange}/></TableCell>
                    <TableCell align="center" className={classes.table}><TextField placeholder="차량모델" name="modelFilter" style ={{width: '110px'}} value={this.state.modelFilter} onChange={this.handleValueChange}/></TableCell>
                    <TableCell align="center" className={classes.table}></TableCell>
                    <TableCell align="center" className={classes.table}></TableCell>
                    <TableCell align="center" className={classes.table}><TextField placeholder="" name="status_codeFilter" style ={{width: '70px'}} value={this.state.status_codeFilter} onChange={this.handleValueChange}/></TableCell>
                    <TableCell align="center" className={classes.table}></TableCell>
                    <TableCell align="center" className={classes.table}></TableCell>
                    <TableCell align="center" className={classes.table}><TextField placeholder="입고(날짜)" name="in_dateFilter" style ={{width: '90px'}} value={this.state.in_dateFilter} type="date" onChange={this.handleValueChange} InputLabelProps={{shrink: true,}}/></TableCell>
                    <TableCell align="center" className={classes.table}><TextField placeholder="츨고(날짜)" name="out_dateFilter" style ={{width: '90px'}} value={this.state.out_dateFilter} type="date" onChange={this.handleValueChange} InputLabelProps={{shrink: true,}}/></TableCell>
                    <TableCell align="center" className={classes.table}><TextField placeholder="갱신(날짜)" name="last_dateFilter" style ={{width: '90px'}} value={this.state.last_dateFilter} type="date" onChange={this.handleValueChange} InputLabelProps={{shrink: true,}}/></TableCell>
                    <TableCell align="center" className={classes.table}><TextField placeholder="담당자" name="checkerFilter" style ={{width: '70px'}} value={this.state.checkerFilter} onChange={this.handleValueChange}/></TableCell>
                    <TableCell className={classes.table}></TableCell>
                    {this.state.customers ? 
                      (filteredComponents(this.state.customers)) :            
                      <TableRow>
                        <TableCell colSpan="14" align="center">
                          <CircularProgress className={classes.progress} variant="determinate" value={this.state.completed}/>
                        </TableCell>
                      </TableRow>
                    }
                  </TableBody>
                </Table>
              </Paper>
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
  }
}

export default withStyles(styles)(adminView);
