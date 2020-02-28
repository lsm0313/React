import React from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import FormControl from '@material-ui/core/FormControl';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import WorkAdd from '../WorkComponents/WorkAdd';
import Button from '@material-ui/core/Button';
import { withRouter } from 'react-router';

const styles = theme => ({
    table: {
        fontSize: '8pt',
        font: '돋움'
    },
});

class CustomerUser extends React.Component {
    
    constructor(props){
        super(props);
        this.state = {
            classify:'',
            company:'',
            maker:'',
            model:'',
            year:'',
            chassis_no:'',
            in_date:'',
            out_date:'',
            last_date:'',
            status_code:'',
            release_code:'',
            checker:'',
            step:'',
            auth:'',
            open: false
        }; 
    }
    
    handleValueChange = (e) =>
    {
        let nextState = {};
        nextState[e.target.name] = e.target.value;
        this.setState(nextState);
    }

    handleChange = (e) => {
        const { target: { checked } } = e;
        this.setState({ checked });
    };

    handleSearch = (e) =>{
        if(this.props.first_in_reason==='BF'){
            const url = "http://112.221.172.211:70/qrcodejs-master?carNumber="+this.props.chassis_no+"&initial=BF&first_in_reason=BF&reg_date="+this.props.reg_date.substring(0,10).replace(/-/gi, '.');;
            window.open(url, "","location=no,width=2000,height=1000")
        }else{
            const url = "http://112.221.172.211:70/qrcodejs-master?carNumber="+this.props.chassis_no+"&initial="+this.props.initial+"&first_in_reason="+this.props.first_in_reason+"&reg_date="+this.props.reg_date.substring(0,10).replace(/-/gi, '.');;
            window.open(url, "","location=no,width=2000,height=1000")
        }
    }

    handleOpen = () =>{
        this.setState({
            open:true
        })
    }

    handleClose = () =>{
        this.setState({
            open:false
        })
    }

    hadnleClick = () =>{
        this.setState({
            open:false
        })
        const url = "http://112.221.172.211:70/index.php?carNumber="+this.props.chassis_no
        window.open(url, "","location=no,width=800,height=950")
    }

    render() {
        const imageSrc= "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTkgMmMxLjY1NCAwIDMgMS4zNDYgMyAzdjE0YzAgMS42NTQtMS4zNDYgMy0zIDNoLTE0Yy0xLjY1NCAwLTMtMS4zNDYtMy0zdi0xNGMwLTEuNjU0IDEuMzQ2LTMgMy0zaDE0em0wLTJoLTE0Yy0yLjc2MSAwLTUgMi4yMzktNSA1djE0YzAgMi43NjEgMi4yMzkgNSA1IDVoMTRjMi43NjIgMCA1LTIuMjM5IDUtNXYtMTRjMC0yLjc2MS0yLjIzOC01LTUtNXptLTggOGgtMXYtMmgxdjFoMnYxaC0xdjFoLTF2LTF6bTIgMTJ2LTFoLTF2MWgxem0tMS0xNXYtMWgtMnYxaDF2MWgxdi0xem04LTF2NmgtMXYtMWgtNHYtNWg1em0tMSA0di0zaC0zdjNoM3ptLTE0IDJoLTF2MWgydi0xaC0xem0wIDNoMXYxaDF2LTNoLTF2MWgtMnYyaDF2LTF6bTUgMXYyaDF2LTJoLTF6bTQtMTBoLTF2M2gxdi0zem0wIDV2LTFoLTF2MWgxem0zLTJoMXYtMWgtMXYxem0tMTAtMWgtMXYxaDF2LTF6bTItMnY1aC01di01aDV6bS0xIDFoLTN2M2gzdi0zem05IDV2MWgtMXYtMWgtMnYxaC0xdi0xaC0zdi0xaC0xdjFoLTF2MWgxdjJoMXYtMWgxdjJoMXYtMmgzdjFoLTJ2MWgydjFoMXYtM2gxdjFoMXYyaDF2LTFoMXYtMWgtMXYtMWgtMXYtMWgxdi0xaC0yem0tMTEgOGgxdi0xaC0xdjF6bS0yLTNoNXY1aC01di01em0xIDRoM3YtM2gtM3Yzem0xMi0zdi0xaC0xdjFoMXptMCAxaC0xdjFoLTF2LTFoLTF2LTFoMXYtMWgtMnYtMWgtMXYyaC0xdjFoLTF2M2gxdi0xaDF2LTFoMnYyaDF2LTFoMXYxaDJ2LTFoMXYtMWgtMnYtMXptLTktM2gxdi0xaC0xdjF6bTEwIDJ2MWgxdjFoMXYtM2gtMXYxaC0xem0yIDR2LTFoLTF2MWgxem0wLTh2LTFoLTF2MWgxeiIvPjwvc3ZnPg=="
        const { classes } = this.props;
        return (
            <TableRow> 
                <Dialog open={this.state.open} onClose={this.handleClose}>
                    <DialogTitle>작업 선택</DialogTitle>
                    <DialogContent>
                        <div align="center">
                            <FormControl>
                                <Button variant="contained" color="primary" disabled>전자 문서</Button>
                            </FormControl>
                            <br/><br/>
                            <FormControl>
                                <WorkAdd chkDetail={1} check={1} admin = {this.props.admin} first_in_reason={this.props.first_in_reason} status_code={this.props.status_code} userName={this.props.userName} main_IDX={this.props.id} chassis_no={this.props.chassis_no}/>
                            </FormControl>
                            <br/><br/>
                                <FormControl>
                                    <Button variant="contained" color="primary" onClick={()=>{ 
                                        this.props.history.push({
                                            pathname : "/DetailsWorkStatus/",
                                            state :{ 
                                                admin : this.props.admin,
                                                userName : this.props.userName,
                                                chassis_no : this.props.chassis_no,
                                                main_IDX : this.props.id,
                                                model: this.props.model,
                                                in_date:this.props.in_date,
                                                classify:this.props.classify,
                                                first_in_reason:this.props.first_in_reason,
                                                status_code:this.props.status_code
                                            }
                                    });}}>상세 작업 현황</Button>
                                </FormControl>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <div align="right">
                            <Button variant="outlined" color="primary" onClick={this.handleClose}>닫기</Button>
                        </div>
                    </DialogActions>
                </Dialog>
                <TableCell align = 'center' className={classes.table}><div>{this.props.id}</div></TableCell>
                <TableCell align = 'center' className={classes.table}><div>{this.props.classify}</div></TableCell>
                <TableCell align = 'center' className={classes.table}><div>{this.props.first_in_reason}</div></TableCell>
                <TableCell align = 'center' className={classes.table}><div>{this.props.company}</div></TableCell>
                <TableCell align = 'center' className={classes.table}><div>{this.props.model}</div></TableCell>
                <TableCell align = 'center' className={classes.table}><div>{this.props.year}</div></TableCell>
                <TableCell align = 'center' className={classes.table} onClick={this.handleOpen}>
                    <div>{this.props.chassis_no}</div></TableCell>
                <TableCell align = 'center' className={classes.table}><div>{this.props.status_code}</div></TableCell>
                <TableCell align = 'center' className={classes.table}><div>{this.props.release_reason}</div></TableCell>
                <TableCell align = 'center' className={classes.table}><div>{this.props.release_dest}</div></TableCell>
                <TableCell align = 'center' className={classes.table}><div>{this.props.in_date}</div></TableCell>
                <TableCell align = 'center' className={classes.table}><div>{this.props.out_date}</div></TableCell>
                <TableCell align = 'center' className={classes.table}><div>{this.props.last_date}</div></TableCell>
                <TableCell align = 'center' className={classes.table}><div>{this.props.checker}</div></TableCell>
                <TableCell align = 'center'>
                    <div>
                        <IconButton variant= "contained" color="primary" onClick={(e)=>{this.handleSearch()}}><img src= {imageSrc} width="20" height="20" alt="QR CODE"/></IconButton>
                    </div>
                </TableCell>
            </TableRow>
        )
    }
}

export default withRouter(withStyles(styles)(CustomerUser));