import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import {Route} from 'react-router-dom';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

class WorkDelete extends React.Component{
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

    deleteCustmoer(id, chassis_no,userName,admin){
        const url ='../api/workDelete/' + id +'/'+ chassis_no +'/'+ userName+'/'+admin;
        fetch(url, {
            method: 'DELETE'
        });
        
        setTimeout("location.reload()", 1000);
    }

    render(){
        if(this.props.userName !== 'undefined'){
        if(this.props.admin>= 2){
            return(
                <div>
                    <div>
                        <IconButton variant= "contained" color="secondary" onClick={this.handleClickOpen}><DeleteIcon style={{fontSize:22}}/></IconButton>
                    </div>
                    <Dialog open={this.state.open} onClose={this.handleClose}>
                        <DialogTitle onClose={this.handleClose}>
                            삭제 경고
                        </DialogTitle>
                        <DialogContent gutterBottom>
                            <Typography>
                                <h4>선택한 작업 정보가 삭제됩니다.</h4>
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button variant="contained" color="primary" onClick={(e)=>{this.deleteCustmoer(this.props.IDX, this.props.chassis_no, this.props.userName, this.props.admin)}}>삭제</Button>
                            <Button variant="outlined" color="primary" onClick={this.handleClose}>취소</Button>
                        </DialogActions>
                    </Dialog>
                </div>
            )
        }else{
            return(
                <div>
                    <div>
                        <IconButton variant= "contained" color="secondary" onClick={this.handleClickOpen}><DeleteIcon style={{fontSize:22}}/></IconButton>
                    </div>
                    <Dialog open={this.state.open} onClose={this.handleClose}>
                        <DialogTitle onClose={this.handleClose}>
                            삭제 경고
                        </DialogTitle>
                        <DialogContent gutterBottom>
                            <Typography>
                                <h4>선택한 작업 정보를 삭제 요청합니다.</h4>
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button variant="contained" color="primary" onClick={(e)=>{this.deleteCustmoer(this.props.IDX, this.props.chassis_no, this.props.userName, this.props.admin)}}>삭제 요청</Button>
                            <Button variant="outlined" color="primary" onClick={this.handleClose}>취소</Button>
                        </DialogActions>
                    </Dialog>
                </div>
            )
        }
        }else{
            return(
                <div>
                    <div>
                        <IconButton variant= "contained" color="secondary" onClick={this.handleClickOpen}><DeleteIcon style={{fontSize:22}}/></IconButton>
                    </div>
                    <Dialog open={this.state.open} onClose={this.handleClose}>
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
                </div>
            );
        }  
    }
}

export default WorkDelete;