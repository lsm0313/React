import React from 'react';
import { post,get } from 'axios';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
// import Select from 'react-select'; 

const styles = theme =>({
    hidden : {
        display: 'none'
    },
});

class SttsView extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            open2: false,
            chkFinal_out_reason : false,
            chkNot_First_reason : false,
            chkFirst_reason : true,
            data: [],
        }; 
    }

    componentWillMount(){
        this.fetch_not_in_reasonCount();
        this.fetch_first_in_reasonCount();
        this.fetch_tmp_final_reasonCount();
        this.fetch_today_first_in_reasonCount();
        this.fetch_today_final_reasonCount();
        this.fetch_week_first_in_reasonCount();
        this.fetch_week_final_reasonCount();
        this.fetch_now();
    }

    fetch_not_in_reasonCount(){
        get('../api/not_in_reasonCount')
        .then((response) => {
            this.setState({
            not_in_reasonCount: response.data[0].미입고
        })
        })
        .catch(function (error) {
        console.log(error);
        })
    }

    fetch_first_in_reasonCount(){
        get('../api/first_in_reasonCount')
        .then((response) => {
            this.setState({
            first_in_reasonCount: response.data[0].입고
        })
        })
        .catch(function (error) {
        console.log(error);
        })
    }

    fetch_tmp_final_reasonCount(){
        get('../api/tmp_final_reasonCount')
        .then((response) => {
            this.setState({
            tmp_final_reasonCount: response.data[0].임시출고
        })
        })
        .catch(function (error) {
        console.log(error);
        })
    }

    fetch_today_first_in_reasonCount(){
        get('../api/today_first_in_reasonCount')
        .then((response) => {
            this.setState({
            today_first_in_reasonCount: response.data[0].입고
        })
        })
        .catch(function (error) {
        console.log(error);
        })
    }

    fetch_today_final_reasonCount(){
        get('../api/today_final_reasonCount')
        .then((response) => {
            this.setState({
            today_final_reasonCount: response.data[0].출고
        })
        })
        .catch(function (error) {
        console.log(error);
        })
    }

    fetch_week_first_in_reasonCount(){
        get('../api/week_first_in_reasonCount')
        .then((response) => {
            this.setState({
            week_first_in_reasonCount: response.data[0].입고
        })
        })
        .catch(function (error) {
        console.log(error);
        })
    }

    fetch_week_final_reasonCount(){
        get('../api/week_final_reasonCount')
        .then((response) => {
            this.setState({
            week_final_reasonCount: response.data[0].출고
        })
        })
        .catch(function (error) {
        console.log(error);
        })
    }

    fetch_now(){
        get('../api/now')
        .then((response) => {
        this.setState({
            time: response.data
        })
        })
        .catch(function (error) {
        console.log(error);
        })
    }

    fetch_data(){
        post('../api/sttsdata')
        .then((response) => {
        this.setState({
            data: response.data
        })
        })
        .catch(function (error) {
        console.log(error);
        })
    }
    
    handleClickOpen2= () => {
        this.fetch_data();
        this.setState({
            open2 : true,
            data:[],
        });
        
    };

    handleClose2 = () => {
        this.setState ({
            open2: false,
            chkFinal_out_reason : false,
            chkNot_First_reason : false,
            chkFirst_reason : true,
        }); 
    };

    printPage = (printThis) =>{
        var win = null;
        win = window.open();
        win.document.open();
		win.document.write(printThis);
        win.document.close();
        win.print();
        win.close();
    }

    handleChkFinal_out_reason = () => {
        this.setState(prevState =>{
		return{
			...prevState,
			chkFinal_out_reason : !prevState.chkFinal_out_reason
		}
        },()=>{
            this.dataTable()
        });   
    };

    handleChkNot_First_reason = () => {
        this.setState(prevState =>{
		return{
			...prevState,
            		chkNot_First_reason : !prevState.chkNot_First_reason
		}
        },()=>{
            this.dataTable()
        });      
    };

    handleChkFirst_reason = () => {
        this.setState(prevState =>{
		return{
			...prevState,
            		chkFirst_reason : !prevState.chkFirst_reason
		}
        },()=>{
            this.dataTable()
        });      
    };

    dataTable = () =>{
        post('../api/sttsdata/', {chkFinal : this.state.chkFinal_out_reason, 
            chkNot_First : this.state.chkNot_First_reason, chkFirstIn: this.state.chkFirst_reason}, null)
            .then((response) => {
            this.setState({
                data: response.data
            })
        });
    }    

    render = () => {
              
        return(
            <div>
                <div>
            <Button variant="contained" color="primary" onClick={this.handleClickOpen2}>현황 조회</Button>
            </div>
            <Dialog maxWidth={'lg'} open={this.state.open2} onClose={e=>{if(e.key==='Escape'){
                this.handleClose2();
            }}}>
                <DialogTitle>현황 조회</DialogTitle>
                <br/><div align = 'right'>
                    <button variant="contained" onClick={() => this.printPage(document.getElementById('printme').innerHTML)}>
                        인쇄
                    </button>&nbsp;&nbsp;&nbsp;&nbsp;
                    <div align = 'left'>
                        &nbsp;&nbsp;&nbsp;<label>필터 입출고 상태 (선택 옵션)</label><br/>
                        &nbsp;&nbsp;&nbsp;<label><input type="checkbox" name="chkFinal_out_reason" onChange={this.handleChkFinal_out_reason}/>최종출고</label>&nbsp;
                        <label><input type="checkbox" name="chkNot_First_reason" onChange={this.handleChkNot_First_reason}/>미입고</label>&nbsp;
                        <label><input type="checkbox" name="chkFirst_reason" onChange={this.handleChkFirst_reason} checked={this.state.chkFirst_reason}/>재고</label>
                    </div>
                </div>
                <DialogContent>
                    <FormControl >
                    <div id="printme">
                            <table border='1'>
                            <tr>
                                <td rowSpan="2" style={{width : 150}}>
                                    <div align = 'center'>조회시각</div>
                                </td>
                                <td rowSpan="2" align = 'center'>
                                    미입고 대수
                                </td>
                                <td rowSpan="2" colSpan="2" align = 'center'>
                                    금일 처리 대수
                                </td>
                                <td rowSpan="2" colSpan="2" align = 'center'>
                                    주간 처리 대수
                                </td>
                                <td colSpan="3">
                                    <div align = 'center'>총 잔여 대수</div>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan="2" align = 'center'>
                                    현재 잔여 대수
                                </td>
                                <td align = 'center'>
                                    집계
                                </td>
                            </tr>
                            <tr>
                                <td rowSpan="2">
                                <div align = 'center'>{this.state.time}</div>
                                </td>
                                <td rowSpan="2" align = 'right'>
                                    {this.state.not_in_reasonCount}&nbsp;
                                </td>
                                <td align = 'center'>
                                    입고
                                </td>
                                <td align = 'right'>
                                    {this.state.today_first_in_reasonCount}&nbsp;
                                </td>
                                <td align = 'center'>
                                    입고
                                </td>
                                <td align = 'right'>
                                    {this.state.week_first_in_reasonCount}&nbsp;
                                </td>
                                <td align = 'center'>
                                    입고
                                </td>
                                <td align = 'right'>
                                    {this.state.first_in_reasonCount}&nbsp;
                                </td>
                                <td rowSpan="2" align = 'right'>
                                    {this.state.first_in_reasonCount+this.state.tmp_final_reasonCount + this.state.not_in_reasonCount}
                                </td>
                            </tr>
                            <tr>
                                <td align = 'center'>
                                    출고
                                </td>
                                <td align = 'right'>
                                {this.state.today_final_reasonCount}&nbsp;
                                </td>
                                <td align = 'center'>
                                    출고
                                </td>
                                <td align = 'right'>
                                    {this.state.week_final_reasonCount}&nbsp;
                                </td>
                                <td align = 'center'>
                                    임시출고
                                </td>
                                <td align = 'right'>
                                    {this.state.tmp_final_reasonCount}&nbsp;
                                </td>
                            </tr>
                        </table>
                    <br/>
                        <table border='1' style={{width : 400}}>
                            <tr>
                                <td align = 'center'>
                                    분류
                                </td>
                                <td align = 'center'>
                                    업체명
                                </td>
                                <td align = 'center'>
                                    입고 사유
                                </td>
                                <td align = 'center'>
                                    입출고 상태
                                </td>
                                <td align = 'right'>
                                    대수&nbsp;
                                </td>
                            </tr>
                                {this.state.data.map((c)=>
                                    c.classify==="자사" && c.status_code==="입고"?
                                        <tr bgcolor="#c7e0f3"><td align = 'center'>
                                            <div>{c.classify}</div>
                                        </td>
                                        <td align = 'center'>
                                            <div>{c.company}</div>
                                        </td>
                                        <td align = 'center'>
                                            <div >{c.first_in_reason}</div>
                                        </td>
                                        <td align = 'center'>
                                            <div>{c.status_code}</div>
                                        </td>
                                        <td align = 'right'>
                                            <div>{c.대수}&nbsp;</div>
                                        </td></tr>
                                    : 
                                        <tr bgcolor="#fefefe"><td align = 'center'>
                                                <div>{c.classify}</div>
                                            </td>
                                            <td align = 'center'>
                                                <div>{c.company}</div>
                                            </td>
                                            <td align = 'center'>
                                                <div>{c.first_in_reason}</div>
                                            </td>
                                            <td align = 'center'>
                                                <div>{c.status_code}</div>
                                            </td>
                                            <td align = 'right'>
                                                <div>{c.대수}&nbsp;</div>
                                        </td></tr>
                                )}
                            </table>                    
                    </div>          
                </FormControl>
                </DialogContent>
                <DialogActions onKeyPress={e=>{if (e.key==='Esc'){
                this.handleClose2();
            }}}>
                    <Button variant ="outlined" color="primary" onClick={this.handleClose2}>닫기</Button>
                </DialogActions>
            </Dialog>

        </div>
        )
    }
}

export default withStyles(styles)(SttsView);
