import React from 'react';
import {adminView} from '../adminView';
import {userView} from '../userView';
import {Route} from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { post } from 'axios';
import './home.css';

class home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ID : '',
            password : '',
            admin : null,
        };
        this.loginChk = this.loginChk.bind(this);
        this.textInput = React.createRef();
        this.focus = this.focus.bind(this);
        this.textInput2 = React.createRef();
        this.focus2 = this.focus2.bind(this);
    }

    focus() {
        // Explicitly focus the text input using the raw DOM API
        // Note: we're accessing "current" to get the DOM node
        this.textInput.current.focus();
    }

    focus2() {
        // Explicitly focus the text input using the raw DOM API
        // Note: we're accessing "current" to get the DOM node
        this.textInput2.current.focus();
    }

    handleKeyPressPW = e =>{
        if(e.key==='Enter'){
            this.loginChk();
        }
    }

    handleKeyPressID = e =>{
        if(e.key==='Enter'){
            this.focus();
        }
    }

    loginChk = async() => {

        post('./api/memberInfo',{ ID:this.state.ID, password:this.state.password },null)
        .then((response) => {
            if(!response.data.loginresult){
                alert('ID와 비밀번호를 확인해주세요.');
                this.setState({
                    ID:'',
                    password:'',
                })
                this.focus2();
            }else{

                if(response.data.admin >= 1)
                    this.props.history.push({
                        pathname : '/adminView/',
                        state :{
                            admin : response.data.admin,
                            userName : response.data.userName
                        }
                    });
                else
                    this.props.history.push({
                        pathname : '/userView/',
                        state :{
                            admin : response.data.admin,
                            userName : response.data.userName
                        }
                    });
            }
        })
        .catch(function (error) {
            console.log(error);
        })
    }

    
    
    
    handleValueChange = (e) =>{
        let nextState = {};
        nextState[e.target.name] = e.target.value;
        this.setState(nextState);
    }

    render(){
        return (
            <div>
                <br/><br/>
                <div align = 'center' className="todo-list-template">
                    <div className="title" >
                        로그인
                    </div>
                    <div className="form-wrapper">
                        <Route render={({ history}) => (
                        <form method="post" name="frm_login" id="frm_login">
                            <br/>
                            <table>
                                <tr style={{height:50}}>
                                    <td><Typography align="right">ID</Typography></td><td>&nbsp;&nbsp;&nbsp; </td>
                                    <td><input autoFocus ref={this.textInput2} label="ID" type="text" name="ID"  value={this.state.ID} onChange={this.handleValueChange} onKeyPress={this.handleKeyPressID}/></td>
                                </tr>
                                <tr>
                                    <td><Typography align="center">PASSWORD</Typography></td><td>&nbsp;&nbsp;&nbsp; </td>
                                    <td><input ref={this.textInput} label="PASSWORD" type="password" name="password" value={this.state.password} onChange={this.handleValueChange} onKeyPress={this.handleKeyPressPW}/></td>
                                </tr>
                            </table>
                            <br/>
                            <div className="create-button" style={{fontSize:20, width:150}} onClick={this.loginChk}>로그인</div>
                            <Route path='/userView' component={userView}/>
                            <Route path='/adminView' component={adminView}/>
                        </form>            
                    )}/>
                    <br/>
                    </div> 
                </div>
            </div>
        );
    };

}

export default home;