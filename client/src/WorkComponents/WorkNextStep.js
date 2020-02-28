import React from 'react';
import UpdateIcon from '@material-ui/icons/Update';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import { put } from 'axios';

class WorkNextStep extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            open: false,
            storageCost:3000
        };
    }

    handleClickOpen= () => {
        this.setState({
            open : true
        });
    }

    handleClose = () => {
        this.setState ({
            open: false
        }); 
    };

    handleFormSubmit = (e,IDX) => {
        e.preventDefault()
        
        this.UpdateWorkState(IDX)
            .then(()=>{
                setTimeout("location.reload()", 1000)
            }
        )
    }

    UpdateWorkState = (IDX) =>{
        const url = '../api/task/workStateUpdate/'+IDX;
        const formData = new FormData();
        formData.append('performanceStatus', this.props.performanceStatus);
        formData.append('userName', this.props.userName);
        formData.append('chassis_no', this.props.chassis_no);
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };       
         
        return put(url, formData, config);
    }

    handleCostValueChange = (e) => {
        let nextState = {};
        nextState[e.target.name] = e.target.value.replace(/[^0-9]/g,'');
        this.setState(nextState);
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
        formData.append('first_in_reason',this.props.first_in_reason);
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };       
         
        return put(url, formData, config);
    }

    render(){     
        if(this.props.admin <= 1 && this.props.approvalStatus===1 && this.props.performanceStatus !== '작업 완료' && this.props.status_code !== '보관'){ 
            return(
                <div>
                    <div>
                        <IconButton variant= "contained" color="primary" onClick={this.handleClickOpen}><UpdateIcon style={{fontSize:22}}/></IconButton>
                    </div>
                    <Dialog open={this.state.open} onClose={this.handleClose}>
                        <DialogTitle onClose={this.handleClose}>
                            다음 단계 진행
                        </DialogTitle>
                        <DialogContent>
                            <Typography>
                                <h4>{this.props.performanceStatus === '작업 대기' ? '진행중 상태로 변경하시겠습니까?' : '완료 상태로 변경하시겠습니까?'}</h4>
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button variant="contained" color="primary" onClick={(e) =>this.handleFormSubmit(e, this.props.IDX)}>확인</Button>
                            <Button variant="outlined" color="primary" onClick={this.handleClose}>취소</Button>
                        </DialogActions>
                    </Dialog>
                </div>
            )
        }else if(this.props.admin <= 1 && this.props.performanceStatus === '작업 완료' && this.props.status_code !== '보관' && this.props.classify=== "타사" && (this.props.fullTaskCode ==='20109' || this.props.fullTaskCode ==='20302' || this.props.fullTaskCode==='20201')){
            return(
                <div>
                    <div>
                        <IconButton variant= "contained" color="primary" onClick={this.handleClickOpen}><UpdateIcon style={{fontSize:22}}/></IconButton>
                        <Dialog open={this.state.open} onClose={this.handleClose}>
                            <DialogTitle onClose={this.handleClose}>
                                보관
                            </DialogTitle>
                            <DialogContent>
                            <Typography>
                                <h4>보관 상태 전환</h4>
                                <label>보관료 (1일)</label>
                                <input class="form-control input-sm" id="storageCost" type="text" 
                                name="storageCost" value={this.state.storageCost} onChange={this.handleCostValueChange}/><br/>
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button variant="contained" color="primary" onClick={(e) =>this.handleFormSubmitStorage(e)}>확인</Button>
                            <Button variant="outlined" color="primary" onClick={this.handleClose}>취소</Button>
                        </DialogActions>
                        </Dialog>
                    </div>
                </div>
            )
        }else if(this.props.admin <= 1){
            return(
                <div>
                    <div>
                        <IconButton variant= "contained" disabled><UpdateIcon style={{fontSize:22}}/></IconButton>
                    </div>
                </div>
            )
        }
        else{
            return(
                <div/>
            )
        }
    }
}

export default WorkNextStep;