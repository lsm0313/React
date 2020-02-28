import React from 'react';
import { put, get, post } from 'axios';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import Select from 'react-select';
import TextField from '@material-ui/core/TextField';
import {Route} from 'react-router-dom';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
    root: {
        width: "100%",
        marginTop: theme.spacing.unit * 3,
        overflowX: "auto"
    },
    table: {
        minWidth: 700
    },
    hidden : {
        display: 'none'
    }
});

class WorkUpdate extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            open:false,
            Chassis_no:[],
            Division:[],
            Section:[],
            large_task_code:'',
            deadline:'',
            partCost:0,
            laborCost:0,
            Chassis_noOption:[],
            DivisionOption:[],
            SectionOption:[],
        }
    }

    componentWillMount(){
        this.fetchChassis_noOptions();
    }

    fetchChassis_noOptions(){
        get('../api/task/getChassis_no')
        .then((response) => {
            this.setState({
                Chassis_noOption: response.data
            })
        });
    }

    fetchDivisionOptions(main_IDX){
        get('../api/task/getDivision/'+main_IDX)
            .then((response) => {
                this.setState({
                    DivisionOption: response.data
                })
        });
    }

    fetchSectionOptions(main_IDX, medium_task_code){
        post('../api/task/getSection', {reason1 : main_IDX, reason2 : medium_task_code}, null)
            .then((response) => {
            this.setState({
                SectionOption: response.data,  
            })
        }); 
    }

    handleClickOpen= (id) => {
        get('../api/task/getUpdateData/'+ id)
            .then((response) => {
                this.setState({
                    Chassis_no: {value: response.data[0].main_IDX, label: response.data[0].chassis_no},
                    Division:{value: response.data[0].medium_task_code, label: response.data[0].medium_task_name},
                    Section:{value: response.data[0].small_task_code, label: response.data[0].small_task_name},
                    deadline:response.data[0].task_deadline.replace(" ", "T").replace(".","-").replace(".","-"),
                    large_task_code:response.data[0].large_task_code,
                    partCost:response.data[0].part_cost,
                    laborCost:response.data[0].labor_cost,
                    open:true,
                })
                this.fetchDivisionOptions(response.data[0].main_IDX);
                this.fetchSectionOptions(response.data[0].main_IDX, response.data[0].medium_task_code);
            })
    };

    handleClose = () => {
        this.setState ({
            open : false,
            Chassis_no:[],
            Category:[],
            Division:[],
            Section:[],
            deadline:'',
            large_task_code:'',
            partCost:'',
            laborCost:'',
            DivisionOption:[],
            SectionOption:[],
        })
    };

    onDataChangeChassis_no=(ev, action) => {
        this.setState({
            [action.name]: ev,
            chkSelectCategory:false,
            Division:[],
        })
             
            get('../api/task/getDivision/'+ev.value, null)
                .then((response) => {
                this.setState({
                    large_task_code:response[0].data.large_task_code,
                    DivisionOption: response.data,
                })
            });
        
    }

    onDataChangeDivision=(ev, action) => {
        this.setState({
            [action.name]: ev,
            Section:[],
            chkSelectDivision:false,
        })

        post('../api/task/getSection', {reason1 : this.state.Chassis_no.value, reason2 : ev.value}, null)
            .then((response) => {
            this.setState({
                SectionOption: response.data,  
            })
        }); 

    }


    handleValueChange = (e) => {
        let nextState = {};
        nextState[e.target.name] = e.target.value;
        this.setState(nextState);
    }

    handleCostValueChange = (e) => {
        let nextState = {};
        nextState[e.target.name] = e.target.value.replace(/[^0-9]/g,'');
        this.setState(nextState);
    }

    handleFormSubmit = (e,IDX) => {
        e.preventDefault()
        
        this.UpdateWork(IDX)
            .then(()=>{
                setTimeout("location.reload()", 1000)
            })
    }

    UpdateWork = (IDX) => {
        const url = '../api/task/workUpdate/'+IDX;
        const formData = new FormData();
        formData.append('admin', this.props.admin);
        formData.append('main_IDX', this.state.Chassis_no.value);
        formData.append('Chassis_no', this.state.Chassis_no.label);
        formData.append('Category', this.state.large_task_code);
        formData.append('Division', this.state.Division.value);
        formData.append('Section', this.state.Section.value);
        formData.append('SectionName', this.state.Section.label);
        formData.append('userName', this.props.userName);
        formData.append('deadline', this.state.deadline.replace("T", " "));
        if(this.state.Division.label!=="대행패키지"){
            formData.append('partCost', this.state.partCost);
            formData.append('laborCost', this.state.laborCost);
        }else{
            formData.append('partCost', 0);
            formData.append('laborCost', 0);
        }
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };       
         
        return put(url, formData, config);
    };

    onDataChange=(ev, action) => {
        this.setState({
            [action.name]: ev,
        })       
    };

    render(){
        const {Chassis_noOption, DivisionOption, SectionOption} = this.state;
        var Chassis_noOptions = Chassis_noOption.map(obj => {
            return{ value: obj.IDX, label: obj.chassis_no }
        })
        var DivisionOptions = DivisionOption.map(obj => {
            return{ value: obj.medium_task_code, label: obj.medium_task_name }
        })
        var SectionOptions = SectionOption.map(obj => {
            return{ value: obj.small_task_code, label: obj.small_task_name }
        })
        const styles1 = {
            container: base => ({
                ...base,
                width: 380,
            }),
        }
        return(
            <div>
                <IconButton color="primary" onClick={() => this.handleClickOpen(this.props.IDX)}><EditIcon style={{fontSize:22}}/></IconButton>
                {this.props.userName !=='undefined'?
                    <Dialog open={this.state.open} onClose={e=>{if(e.key==='Escape'){
                        this.handleClose();
                    }}}>
                        <DialogTitle>작업 수정</DialogTitle>
                        <DialogContent>
                            <FormControl>
                                <label>차대번호</label>
                                <Select
                                    class="form-control" id="Chassis_no"
                                    name="Chassis_no"
                                    native
                                    value={this.state.Chassis_no}
                                    onChange={this.onDataChange}
                                    inputProps={{name: 'Chassis_no'}}
                                    styles={styles1}
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    options={Chassis_noOptions}
                                    isDisabled
                                />
                            </FormControl><br/><br/>
                            <FormControl>
                                <label>분류</label>
                                <Select
                                    class="form-control" id="Division"
                                    name="Division"
                                    native
                                    value={this.state.Division}
                                    onChange={this.onDataChangeDivision}
                                    inputProps={{name: 'Division'}}
                                    styles={styles1}
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    options={DivisionOptions}
                                    isDisabled={this.state.chkSelectCategory}
                                />
                            </FormControl><br/><br/>
                            <FormControl>
                                <label>작업명</label>
                                <Select
                                    class="form-control" id="Section"
                                    name="Section"
                                    native
                                    value={this.state.Section}
                                    onChange={this.onDataChange}
                                    inputProps={{name: 'Section'}}
                                    styles={styles1}
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    options={SectionOptions}
                                    isDisabled={this.state.chkSelectDivision}
                                />
                            </FormControl><br/><br/>
                            <FormControl fullWidth >
                            <label>예상 기한</label>
                            <TextField margin="dense" name="deadline" variant="outlined" 
                            value={this.state.deadline} type="datetime-local" onChange={this.handleValueChange} 
                            InputLabelProps={{shrink: true,}}/><br/>
                            </FormControl>
                            <label>부품비</label>
                            {this.state.Division.label!=="대행패키지"?
                                <input className="form-control input-sm" id="partCost" type="text" 
                                name="partCost" value={this.state.partCost} onChange={this.handleCostValueChange}/>
                                :
                                <input className="form-control input-sm" id="partCost" type="text" 
                                name="partCost" value={0} disabled/>
                            }<br/>
                            <label>공임비</label>
                            {this.state.Division.label!=="대행패키지"?
                                <input className="form-control input-sm" id="laborCost" type="text" 
                                name="laborCost" value={this.state.laborCost} onChange={this.handleCostValueChange}/>
                                :
                                <input className="form-control input-sm" id="laborCost" type="text" 
                                name="laborCost" value={0} disabled/>
                            }<br/><br/>
                        </DialogContent>
                        <DialogActions>
                            {this.props.admin>=2?
                                <Button variant ="contained" color="primary" onClick={(e) =>this.handleFormSubmit(e, this.props.IDX)} >수정</Button> : 
                                <Button variant ="contained" color="primary" onClick={(e) =>this.handleFormSubmit(e, this.props.IDX)} >수정 요청</Button>
                            }
                            <Button variant ="outlined" color="primary" onClick={this.handleClose}>취소</Button>
                        </DialogActions>
                    </Dialog>
                :
                    <Dialog open={this.state.open}>
                        <DialogTitle>재로그인 필요</DialogTitle>
                        <DialogContent>
                            <div align = 'center'>
                            <ErrorOutlineIcon color="disabled" style={{fontSize:90}}/><br/>
                            <Typography style={{fontSize:28}}>세션이 만료되어 재로그인이 필요합니다.</Typography>
                            </div>
                        <DialogActions>
                            <Route render={({ history}) => (
                                <Button variant="contained" color="primary" onClick={() => { history.push('/') }}>확인</Button>
                            )}/>
                        </DialogActions>
                        </DialogContent>
                    </Dialog>
                }
            </div>
        )
    }
}

export default withStyles(styles)(WorkUpdate);