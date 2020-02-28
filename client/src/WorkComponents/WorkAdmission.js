import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { put } from 'axios';

function numberAddComma(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

}
class WorkAdmission extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            open: false
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
        
        this.UpdateWork(IDX)
            .then(()=>{
                setTimeout("location.reload()", 1000)
            })
    }

    UpdateWork = (IDX) => {
        const url = '../api/task/workAdmission/'+IDX;
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
    };

    render(){
        if(this.props.admin >=2 && this.props.approvalStatus===0){
            return(
                <div>
                    <div>
                        <IconButton variant= "contained" color="primary" onClick={this.handleClickOpen}><CheckCircleIcon style={{fontSize:22}}/></IconButton>
                    </div>
                    <Dialog open={this.state.open} onClose={this.handleClose}>
                    <DialogTitle onClose={this.handleClose}>
                        승인
                    </DialogTitle>
                    <DialogContent gutterBottom>
                        <Typography>
                            <h4>
                                차대번호 : {this.props.chassis_no}<br/>
                                작업명 : {this.props.task_name}<br/>
                                부품비 : {numberAddComma(this.props.part_cost)}원<br/>
                                공임비 : {numberAddComma(this.props.labor_cost)}원<br/>
                                위의 작업을 승인 하시겠습니까?
                            </h4>
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="primary" onClick={(e) =>this.handleFormSubmit(e, this.props.IDX)}>승인</Button>
                        <Button variant="outlined" color="primary" onClick={this.handleClose}>취소</Button>
                    </DialogActions>
                </Dialog>
                </div>
            )
        }else if(this.props.admin >=2 && this.props.approvalStatus===1){
            return(
                <div>
                    <IconButton variant= "contained" color="primary" disabled><CheckCircleIcon style={{fontSize:22}}/></IconButton>
                </div>
                    
            )
        }else{
            return(
                <div/>
            )
        }
    }

}

export default WorkAdmission;