import React from 'react';
import './App.css';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import {Route} from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

class NotFound extends React.Component {
    render(){
        return(
            <div align = 'center' className="todo-list-template">
                <div height ="50%" align ="center" className="form-wrapper">
                    <ErrorOutlineIcon color="error" style={{fontSize:90}}/><br/>
                    <Typography style={{fontSize:28}} align = 'center'>잘못된 경로입니다.<br/>에러코드 : 404<br/></Typography>
                    <Route render={({ history}) => (
                        <Button variant="contained" color="primary" onClick={() => { this.props.history.goBack() }}>확인</Button>
                    )}/>
                    </div>
                <br/>
            </div>
        );
    };
}

export default NotFound;