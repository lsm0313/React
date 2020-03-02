import React from 'react';
import { post,get,put } from 'axios';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Select from 'react-select'; 
import {Route} from 'react-router-dom';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';

const styles = theme =>({
    hidden : {
        display: 'none'
    },
});

class WorkAdd extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            open:false,
            open2:false,
            open_cost:false,
            open_cost1:false,
            openStorage:false,
            openChange:false,
            Chassis_no:[],
            Division:[],
            Section:[],
            deadline:'',
            partCost:0,
            laborCost:0,
            packageCost:0,
            Chassis_noOption:[],
            DivisionOption:[],
            SectionOption:[],
            chkSelectCategory:true,
            chkSelectDivision:true,
            cancellation:false,
        }
    }

    componentWillMount(){
        this.fetchChassis_noOptions();
        this.fetchDivisionOptions();
    }

    fetchChassis_noOptions(){
        get('../api/task/getChassis_no')
        .then((response) => {
            this.setState({
                Chassis_noOption: response.data
            })
        });
    }

    fetchDivisionOptions(){
        if(this.props.chkDetail===1){
            get('../api/task/getDivision/'+this.props.main_IDX)
            .then((response) => {
                this.setState({
                    DivisionOption: response.data
                })
            });
        }
    }

    handleClickOpen = () => {
        if(this.props.chkDetail===1){
            this.setState({
                Chassis_no: {value: this.props.main_IDX, label: this.props.chassis_no},
                chkSelectCategory:false
            })
        }
        this.setState({
            open : true,
            deadline:moment().add(1, 'd').format('YYYY-MM-DDTHH:mm')
        });
    };

    handleClickOpen2 = () => {
        this.setState({
            open_cost : true,
            packageCost:150000,
        })
    }

    handleClickOpenStorage = () => {
        this.setState({
            openStorage : true,
            storageCost:3000,
        })
    }

    handleClickOpencancellation = () => {
        this.setState({
            cancellation : true,
            cancellationCost:5000,
        })
    }

    handleCloseCancellation = () => {
        this.setState({
            cancellation : false,
        })
    }

    handleCloseStorage = () =>{
        this.setState({
            openStorage : false,
        })
    }

    handleFormSubmitStorage = (e) => {
        e.preventDefault()
        
        this.UpdateWorkStateStorage()
            .then(()=>{
                setTimeout("location.reload()", 1000)
            }
        )
    }

    UpdateWorkStateStorage = () =>{
        const url = '../api/task/workStateUpdateStorage/';
        const formData = new FormData();
        formData.append('userName', this.props.userName);
        formData.append('chassis_no', this.props.chassis_no);
        formData.append('main_IDX', this.props.main_IDX)
        formData.append('storageCost', this.state.storageCost);
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };       
         
        return put(url, formData, config);
    }

    handleFormSubmitCancellation = (e) => {
        e.preventDefault()
        
        this.UpdateWorkStateCancellation()
            .then(()=>{
                setTimeout("location.reload()", 1000)
            }
        )
    }

    UpdateWorkStateCancellation = () =>{
        const url = '../api/task/workStateUpdateCancellation/';
        const formData = new FormData();
        formData.append('userName', this.props.userName);
        formData.append('chassis_no', this.props.chassis_no);
        formData.append('main_IDX', this.props.main_IDX)
        formData.append('cancellationCost', this.state.cancellationCost);
        formData.append('admin', this.props.admin);
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };       
         
        return put(url, formData, config);
    }

    handleClose = () => {
        this.setState ({
            open : false,
            Chassis_no:[],
            Category:[],
            Division:[],
            Section:[],
            deadline:'',
            partCost:0,
            laborCost:0,
            SectionOption:[],
            chkSelectCategory:true,
            chkSelectDivision:true,
        })
    };

    onDataChange=(ev, action) => {
        this.setState({
            [action.name]: ev,
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
                    DivisionOption: response.data
                })
            });
        
    }

    onDataChangeDivision=(ev, action) => {
        this.setState({
            [action.name]: ev,
            Section:[],
            chkSelectDivision:false,
        })
        if(this.state.Chassis_no.value){
            post('../api/task/getSection', {reason1 : this.state.Chassis_no.value, reason2 : ev.value}, null)
                .then((response) => {
                this.setState({
                    SectionOption: response.data, 
                })
            }); 
        }else{
            post('../api/task/getSection', {reason1 : this.props.main_IDX, reason2 : ev.value}, null)
                .then((response) => {
                this.setState({
                    SectionOption: response.data,  
                })
            }); 
        }
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

    handleFormSubmit = (e) => {
        e.preventDefault()
        
        this.addWork()
            .then(()=>{
                setTimeout("location.reload()", 1000);
            })
    }

    handleFormSubmit1 = (e) => {
        this.setState({
            open2: true
        })
    }
    handleClose1 = (e) => {
        this.setState({
            open2: false
        })
    }

    handleClose2 = (e) => {
        this.setState({
            open_cost: false
        })
    }

    handleFormSubmit2 = (e) => {
        e.preventDefault()
        
        this.addWork()
            .then(()=>{
                this.setState({
                    Section:[],
                    deadline:moment().add(1, 'd').format('YYYY-MM-DDTHH:mm'),
                    partCost:0,
                    laborCost:0,
                    open2:false
                })
            })
    }

    handleFormSubmit3 = (e) => {
        e.preventDefault()
        
        this.addPackageCost()
            .then(()=>{
                window.location.reload();
            })
    }

    addPackageCost = () =>{
        const url = '../api/task/packageCost';
        const formData1 = new FormData();
        formData1.append('main_IDX', this.props.main_IDX);
        formData1.append('chassis_no', this.props.chassis_no);
        formData1.append('packageCost', this.state.packageCost);
        formData1.append('UserName', this.props.userName);
        formData1.append('admin', this.props.admin);
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };
        return post(url, formData1, config);
    }

    handleFormSubmit4 = (e) => {
        e.preventDefault()
        
        this.UpdatePackageCost()
            .then(()=>{
                window.location.reload();
            })
    }


    handleClickOpen3=() =>{
        this.setState({
            open_cost1 : true,
        })
        post('../api/task/get/packageCost', {main_IDX : this.props.main_IDX, chassis_no: this.props.chassis_no}, null)
            .then((response) => {              
            this.setState({
                packageCost: response.data[0].package_cost
            })
        });
        
    }

    handleClose3=()=>{
        this.setState({
            open_cost1 : false,
        })
    }

    UpdatePackageCost = () =>{
        const url = '../api/task/packageCostUpdate';
        const formData2 = new FormData();
        formData2.append('main_IDX', this.props.main_IDX);
        formData2.append('chassis_no', this.props.chassis_no);
        formData2.append('packageCost', this.state.packageCost);
        formData2.append('userName', this.props.userName);
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };
        return put(url, formData2, config);
    }

    updateState = () =>{
        const url = '../api/task/changeBA/';
        const formData1 = new FormData();
        formData1.append('main_IDX', this.props.main_IDX);
        formData1.append('userName', this.props.userName);
        formData1.append('chassis_no', this.props.chassis_no);
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };
        return put(url, formData1, config);
    }

    handleFormSubmitChange = (e) => {
        e.preventDefault()
        
        this.updateState()
            .then(()=>{
                window.location.reload();
            })
    }

    handleClickOpenChange=() =>{
        this.setState({
            openChange : true,
        })
    }

    handleCloseChange=()=>{
        this.setState({
            openChange : false,
        })
    }

    addWork = () => {
        const url = '../api/task/workAdd';
        const formData = new FormData();
        formData.append('main_IDX', this.state.Chassis_no.value);
        formData.append('Chassis_no', this.state.Chassis_no.label);
        formData.append('Category', this.state.DivisionOption[0].large_task_code);
        formData.append('Division', this.state.Division.value);
        formData.append('length',this.state.Section.length);
        for(let i=0;i<this.state.Section.length;i++){
            formData.append('Section', this.state.Section[i].value);
            formData.append('SectionName', this.state.Section[i].label);
        }
        formData.append('UserName', this.props.userName);
        formData.append('admin', this.props.admin);     
        formData.append('deadline', this.state.deadline);
            
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
        return post(url, formData, config);
        
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
                {this.props.first_in_reason==='수B' && this.props.status_code!=="보관" && this.props.first_in_reason!=="수A" && this.props.status_code!=="수A"?
                    <Button variant="contained" color="primary" onClick={this.handleClickOpenStorage}>보관 시작</Button>
                :
                    <div/>
                }
                {this.props.first_in_reason==='수B' && this.props.status_code==="보관"?
                    <Button variant="contained" color="primary" onClick={this.handleClickOpencancellation}>말소 추가</Button>
                :
                    <div/>
                }
                {
                this.props.status_code==="보관"?
                    <Button variant="contained" color="primary" onClick={this.handleClickOpenChange}>수A 변경</Button>
                :
                    <div/>
                }
                {
                (this.props.first_in_reason!=='수B'&&this.props.status_code!=="보관")|| (this.props.first_in_reason==='수B'&&this.props.status_code==="수A")?
                    <Button variant="contained" color="primary" onClick={this.handleClickOpen}>작업 추가</Button>
                :
                    <div/>
                }
                &nbsp;
                {
                    this.props.first_in_reason==='수A' || this.props.status_code==='수A' || this.props.first_in_reason==='위탁' ?
                        this.props.check===1
                            ?
                                <div/>
                            :   this.props.packageYN===0 ?
                                    <Button variant="contained" color="primary" onClick={this.handleClickOpen2}>
                                        패키지 가격 입력
                                    </Button>
                                :
                                    <Button variant="contained" color="primary" onClick={this.handleClickOpen3}>
                                        패키지 가격 수정
                                    </Button>
                        :
                            <div/>
                }

                <Dialog open={this.state.openStorage} onClose={this.handleCloseStorage}>
                    <DialogTitle onClose={this.handleCloseStorage}>
                        보관
                    </DialogTitle>
                    <DialogContent>
                        <Typography>
                            <h4>보관 상태 전환</h4>
                            <label>보관료 (1일)</label>
                            <input className="form-control input-sm" id="storageCost" type="text" 
                            name="storageCost" value={this.state.storageCost} onChange={this.handleCostValueChange}/><br/>
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="primary" onClick={(e) =>this.handleFormSubmitStorage(e)}>확인</Button>
                        <Button variant="outlined" color="primary" onClick={this.handleCloseStorage}>취소</Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={this.state.cancellation} onClose={this.handleCloseCancellation}>
                    <DialogTitle onClose={this.handleCloseCancellation}>
                        말소
                    </DialogTitle>
                    <DialogContent>
                        <Typography>
                            <h4>말소증 추가</h4>
                            <label>말소증 가격</label>
                            <input className="form-control input-sm" id="cancellationCost" type="text" 
                            name="cancellationCost" value={this.state.cancellationCost} onChange={this.handleCostValueChange}/><br/>
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="primary" onClick={(e) =>this.handleFormSubmitCancellation(e)}>확인</Button>
                        <Button variant="outlined" color="primary" onClick={this.handleCloseCancellation}>취소</Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={this.state.open_cost} onClose={this.handleClose2}>
                    <DialogTitle>패키지 금액 입력</DialogTitle>
                    <DialogContent>
                        <input className="form-control input-sm" id="laborCost" type="text" 
                            name="packageCost" value={this.state.packageCost} onChange={this.handleCostValueChange}/><br/>
                    </DialogContent>
                    <DialogActions>
                        <Button variant ="contained" color="primary" onClick={this.handleFormSubmit3}>추가</Button>
                        <Button variant ="outlined" color="primary" onClick={this.handleClose2}>취소</Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={this.state.open_cost1} onClose={this.handleClose3}>
                    <DialogTitle>패키지 금액 수정</DialogTitle>
                    <DialogContent>
                        <input className="form-control input-sm" id="laborCost" type="text" 
                            name="packageCost" value={this.state.packageCost} onChange={this.handleCostValueChange}/><br/>
                    </DialogContent>
                    <DialogActions>
                        <Button variant ="contained" color="primary" onClick={this.handleFormSubmit4}>수정</Button>
                        <Button variant ="outlined" color="primary" onClick={this.handleClose3}>취소</Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={this.state.open2} onClose={this.handleClose1}>
                    <DialogTitle>확인</DialogTitle>
                    <DialogContent>
                        <label>작업명 : </label>{this.state.Section.label}<br/>
                        <label>예상 기한 : </label>{this.state.deadline.replace("T", " ")}<br/>
                        <label>부품비 : </label>{this.state.partCost}<br/>
                        <label>공임비 : </label>{this.state.laborCost}<br/>
                    </DialogContent>
                    <DialogActions>
                        {this.props.admin >= 2 ?
                            <Button variant ="contained" color="primary" onClick={this.handleFormSubmit2}>추가</Button> :
                            <Button variant ="contained" color="primary" onClick={this.handleFormSubmit2}>추가 요청</Button>
                        }
                            <Button variant ="outlined" color="primary" onClick={this.handleClose1}>취소</Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={this.state.openChange} onClose={this.handleCloseChange}>
                    <DialogTitle>확인</DialogTitle>
                    <DialogContent>
                        <div style={{fontSize:18}}>"수A"로 변경하시겠습니까?</div>
                    </DialogContent>
                    <DialogActions>
                        <Button variant ="contained" color="primary" onClick={this.handleFormSubmitChange}>확인</Button>
                        <Button variant ="outlined" color="primary" onClick={this.handleCloseChange}>취소</Button>
                    </DialogActions>
                </Dialog>
                
                {this.props.userName !=='undefined'?
                    <Dialog open={this.state.open}>
                        <DialogTitle>작업 추가</DialogTitle>
                        <DialogContent>
                            <FormControl>
                                <label>차대번호</label>
                                <Select
                                    id="Chassis_no"
                                    name="Chassis_no"
                                    value={this.state.Chassis_no}
                                    onChange={this.onDataChangeChassis_no}
                                    styles={styles1}
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    options={Chassis_noOptions}
                                />
                            </FormControl><br/><br/>
                            <FormControl>
                                <label>분류</label>
                                <Select
                                    id="Division"
                                    name="Division"
                                    value={this.state.Division}
                                    onChange={this.onDataChangeDivision}
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
                                    id="Section"
                                    name="Section"
                                    closeMenuOnSelect={false}
                                    isMulti
                                    value={this.state.Section}
                                    onChange={this.onDataChange}
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
                            {this.props.admin >= 2 ?
                                <Button variant ="contained" color="primary" onClick={this.handleFormSubmit}>추가</Button> :
                                <Button variant ="contained" color="primary" onClick={this.handleFormSubmit}>추가 요청</Button>
                            }
                            <Button variant ="contained" color="primary" onClick={this.handleFormSubmit1}>계속 작업 추가</Button>
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

export default withStyles(styles)(WorkAdd);
