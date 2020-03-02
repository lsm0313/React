import React from 'react';
import { post,get } from 'axios';
import Dialog from '@material-ui/core/Dialog';
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

const styles = theme =>({
    hidden : {
        display: 'none'
    },

});

class CustomerAdd extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            classify:[],
            first_in_reason:[],
            company:[],
            maker:[],
            model:[],
            year:[],
            chassis_no:"",
            data:[],
            makerOption:[],
            modelOption:[],
            companyOption:[],
            classifyOption:[],
            first_in_reasonOption:[],
            yearOption:[],
            open: false,
            chkSelectClassify: true,
            chkSelectFirst_in_reason: true,
            chkSelectMaker:true,
        }; 
    }

    componentWillMount(){
        this.fetchMakerOptions();
        this.fetchClassifyOptions();
        this.fetchYearOptions();
    }

    fetchMakerOptions(){
        get('../api/make')
        .then((response) => {
            this.setState({
                makerOption: response.data
            })
        });
    }

    fetchClassifyOptions(){
        get('../api/classification')
        .then((response) => {
            this.setState({
                classifyOption: response.data
            })
        });
    }

    fetchYearOptions(){
        get('../api/year')
        .then((response) => {
            this.setState({
                yearOption: response.data
            })
        });
    }
    
    inputClassNameHelper = boolean => {
        switch (boolean) {
          case true:
            return 'is-valid';
          case false:
            return 'is-invalid';
          default:
            return '';
        }
    };

    isEveryFieldValid = () => {
        const { isCarNumberValid } = this.state;
        return isCarNumberValid;
      };
    
      renderSubmitBtn = () => {
        if (this.isEveryFieldValid()) {
          return (
            <Button variant ="contained" color="primary" onClick={this.handleFormSubmit}>추가</Button>
          );
        }
        return (
          <Button variant ="contained" color="primary" disabled>추가</Button>
        );
    };

    validateCarNumber = chassis_no => {

        const regExp = /^[a-zA-Z0-9]{7,11}[0-9]{0,6}$/g;

        if (chassis_no.match(regExp)) {
            this.setState({
                isCarNumberValid: true,
                chassis_no
            });
        } else {
            this.setState({
                isCarNumberValid: false,
                chassis_no
            });
        }
    };

    handleFormSubmit = (e) => {
        if(this.state.classify.value && this.state.first_in_reason.value && this.state.company.value && this.state.maker.value && this.state.model.value && this.state.year.value && this.state.chassis_no){
            e.preventDefault()
            
            this.addCustomer()
                .then(()=>{
                    window.location.reload();
                });
        }else{
            alert('모든 값을 입력하세요.');
        }
    }

    addCustomer = () => {
        const url = '../api/customersAdd';
        const formData = new FormData();
        formData.append('classify', this.state.classify.value);
        formData.append('first_in_reason', this.state.first_in_reason.value);
        formData.append('company', this.state.company.value);
        formData.append('maker', this.state.maker.value);
        formData.append('model', this.state.model.value);
        formData.append('year', this.state.year.value);
        formData.append('chassis_no', this.state.chassis_no.toUpperCase());
        formData.append('userName', this.props.userName); 
               
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };       
         
        return post(url, formData,config);
    };

    handleClickOpen= () => {
        this.setState({
            open : true
        });
    };

    handleClose = () => {
        this.setState ({
            classify:[],
            first_in_reason:[],
            company:[],
            maker:[],
            model:[],
            year:[],
            chassis_no:"",
            open: false,
            chkSelectClassify: true,
            chkSelectFirst_in_reason: true,
            chkSelectMaker:true,
        }); 
    };

    onDataChange=(ev, action) => {
        this.setState({
            [action.name]: ev
        })       
    }

    onDataChangeClassify=(ev, action) => {
        this.setState({
            [action.name]: ev,
            chkSelectClassify:false,
            first_in_reason:[],
            company:[],
        })

        post('../api/firstinreason/', {reason : ev.value}, null)
            .then((response) => {
            this.setState({
                first_in_reasonOption: response.data
            })
        });
         
    }

    onDataChangeFirst_in_reason=(ev, action) => {
        this.setState({
            [action.name]: ev,
            chkSelectFirst_in_reason:false,
            company:[],
        })       
        post('../api/company/', {reason : ev.value}, null)
            .then((response) => {
            this.setState({
                companyOption: response.data
            })
        });  
    }

    onDataChangeMaker=(ev, action) => {
        this.setState({
            [action.name]: ev,
            chkSelectMaker:false,
            model:[],
        })       
        post('../api/model', {reason : ev.value}, null)
            .then((response) => {
            this.setState({
                modelOption: response.data
            })
        });  
    }

    render = () => {        
        const{
            classifyOption, first_in_reasonOption, companyOption, makerOption, modelOption, yearOption
        } = this.state;     

        const styles = {
            container: base => ({
                ...base,
                width: 150,
            }),
            menu: (provided, state) => ({
                ...provided,
                padding:  -5,
            }),
        }
        const styles1 = {
            container: base => ({
                ...base,
                width: 380,
                
            }),
        }
        var classifyOptions = classifyOption.map(obj => {
            return{ value: obj.value, label: obj.label }
        })

        var first_in_reasonOptions = first_in_reasonOption.map(obj => {
            return{ value: obj.first_in_reason_short, label: obj.first_in_reason }
        })

        var companyOptions = companyOption.map(obj => {
            return{ value: obj.corp_name, label: obj.corp_name }
        })

        var makerOptions = makerOption.map(obj => {
            return{ value: obj.eng_make_name, label: obj.eng_make_name }
        })

        var modelOptions = modelOption.map(obj => {
            return{ value: obj.model_name, label: obj.model_name }
        })

        var yearOptions = yearOption.map(obj => {
            return{ value: obj.year, label: obj.year }
        })
        

            return(
                <div>
                    <div>
                        <Button variant="contained" color="primary" onClick={this.handleClickOpen}>
                            차량 추가하기
                        </Button>
                        &nbsp;
                    </div>
                    {this.props.userName !=='undefined'?
                        <Dialog open={this.state.open} onClose={e=>{if(e.key==='Escape'){
                            this.handleClose();
                        }}}>
                            <DialogTitle>차량 추가</DialogTitle>
                            <DialogContent>
                                <FormControl>
                                    <label>구분</label>
                                    <Select
                                        id="classify"
                                        name="classify"
                                        native
                                        value={this.state.classify}
                                        onChange={this.onDataChangeClassify}
                                        inputProps={{name: 'classify'}}
                                        styles={styles}
                                        options={classifyOptions}
                                    />
                                </FormControl><br/><br/>
                                <FormControl>
                                    <label>입고 사유</label>
                                        <Select
                                            id="first_in_reason"
                                            name="first_in_reason"
                                            native
                                            value={this.state.first_in_reason}
                                            onChange={this.onDataChangeFirst_in_reason}
                                            inputProps={{name: 'first_in_reason'}}
                                            styles={styles1}
                                            options={first_in_reasonOptions}
                                            isDisabled={this.state.chkSelectClassify}
                                        />
                                </FormControl><br/><br/>
                                <FormControl>
                                    <label>의뢰업체명</label>
                                        <Select
                                            id="company"
                                            name="company"
                                            native
                                            value={this.state.company}
                                            onChange={this.onDataChange}
                                            inputProps={{name: 'company'}}
                                            styles={styles1}
                                            options={companyOptions}
                                            isDisabled={this.state.chkSelectFirst_in_reason}
                                        />
                                </FormControl><br/><br/>
                                <FormControl>
                                    <label>제조사</label>
                                        <Select
                                            id="maker"
                                            name="maker"
                                            native
                                            value={this.state.maker}
                                            onChange={this.onDataChangeMaker}
                                            inputProps={{name: 'maker'}}
                                            styles={styles1}
                                            menuPlacement="auto"
                                            menuPosition="fixed"
                                            options={makerOptions}
                                        />
                                </FormControl><br/><br/>
                                <FormControl>
                                    <label>모델</label>
                                        <Select
                                            id="model"
                                            name="model"
                                            native
                                            value={this.state.model}
                                            onChange={this.onDataChange}
                                            inputProps={{name: 'model'}}
                                            styles={styles1}
                                            menuPlacement="auto"
                                            menuPosition="fixed"
                                            options={modelOptions}
                                            isDisabled={this.state.chkSelectMaker}
                                        />
                                </FormControl><br/><br/>
                                <label>차대번호</label>
                                <input className="form-control input-sm"  id="inputsm" type="text" name="chassis_no" value={this.state.chassis_no.toUpperCase()} onChange={e=>this.validateCarNumber(e.target.value)}/><br/>
                                <FormControl>
                                    <label>연식</label>
                                        <Select
                                            id="year"
                                            name="year"
                                            native
                                            value={this.state.year}
                                            onChange={this.onDataChange}
                                            inputProps={{name: 'year'}}
                                            styles={styles}
                                            menuPlacement="auto"
                                            menuPosition="fixed"
                                            options={yearOptions}
                                        />
                                        </FormControl>
                                        <br/><br/>
                            </DialogContent>
                            <DialogActions>
                                {this.renderSubmitBtn()}
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

export default withStyles(styles)(CustomerAdd);
