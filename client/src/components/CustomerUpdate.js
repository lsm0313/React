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

class CustomerUpdate extends React.Component {
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
            makerOption:[],
            modelOption:[],
            companyOption:[],
            classifyOption:[],
            yearOption:[],
            first_in_reasonOption:[],
            open: false,
            chkSelectClassify: false,
            chkSelectFirst_in_reason: false
        }; 
    }

    componentDidMount(){
        this.fetchMakerOptions();
        this.fetchModelOptions();
        this.fetchyearOptions();
    }

    fetchMakerOptions(){
        get('../api/make')
        .then((response) => {
            this.setState({
                makerOption: response.data
            })
        });
    }

    fetchModelOptions(){
        get('../api/model')
        .then((response) => {
            this.setState({
                modelOption: response.data
            })
        });
    }

    fetchclassifyOptions(){
        get('../api/classification')
        .then((response) => {
            this.setState({
                classifyOption: response.data
            })
        });
    }

    fetchyearOptions(){
        get('../api/year')
        .then((response) => {
            this.setState({
                yearOption: response.data
            })
        });
    }


    handleFormSubmit(e,id) {
        this.updateCustomer(id)
            .then((response)=>{
                setTimeout("location.reload()", 1000);
            })        
    }

    handleValueChange = (e) =>
    {
        let nextState = {};
        nextState[e.target.name] = e.target.value;
        this.setState(nextState);
    }

    handleFileChange = (e) =>
    {
        this.setState({
            file: e.target.files[0],
            fileName: e.target.value
        })
    }

    updateCustomer(id){
        let url = '../api/customersUpdate/' + id;
        const formData1 = new FormData();
        formData1.append('classify', this.state.classify.value);
        formData1.append('first_in_reason', this.state.first_in_reason.value);
        formData1.append('company', this.state.company.value);
        formData1.append('maker', this.state.maker.value);
        formData1.append('model', this.state.model.value);
        formData1.append('year', this.state.year.value);
        formData1.append('chassis_no', this.state.chassis_no.toUpperCase());
        formData1.append('userName', this.props.userName);        
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };        
        return put(url, formData1, config);
    }

    handleClickOpen = (id) => {       
        get('../api/customersUpdates/'+ id)
            .then((response) => {
                this.fetchclassifyOptions();
                post('../api/firstinreason/', {reason : response.data[0].classify}, null)
                    .then((response) => {
                        this.setState({
                            first_in_reasonOption: response.data
                        })
                    });
                post('../api/company/', {reason : response.data[0].first_in_reason}, null)
                    .then((response) => {
                        this.setState({
                            companyOption: response.data
                        })
                });
                this.setState({
                    classify:{value : response.data[0].classify, label: response.data[0].classify},
                    first_in_reason: {value : response.data[0].first_in_reason, label : response.data[0].first_in_reason},
                    company: {value : response.data[0].company, label : response.data[0].company},
                    maker: {value : response.data[0].maker, label : response.data[0].maker},
                    model: {value : response.data[0].model, label : response.data[0].model},
                    year: {value : response.data[0].year, label : response.data[0].year},
                    chassis_no: response.data[0].chassis_no,
                    isCarNumberValid: true,
                })            
            })
        .catch(function (error) {
            console.log(error);
        })
        this.setState({
            open : true,
        });     
    };  

    handleClose = () => {
        this.setState ({
            file:null,
            classify:[],
            first_in_reason:[],
            company:[],
            maker:[],
            model:[],
            year:[],
            chassis_no:"",
            open: false,
            companyOption:[],
            classifyOption:[],
            first_in_reasonOption:[],
        }); 
    };

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
        

        
        if (!this.isEveryFieldValid()) {
            return (
            <Button variant ="contained" color="primary" disabled>수정</Button>
            );
        }
        return (
            <Button variant ="contained" color="primary" onClick={(e) => this.handleFormSubmit(e, this.props.id)} >수정</Button>
        );
    };

    validateCarNumber = chassis_no => {

        const regExp = /^[a-zA-Z0-9]{7,12}[0-9]{0,5}$/g;

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

    onDataChange=(ev, action) => {
        this.setState({
            [action.name]: ev
        })       
    }

    onDataChangeClassify=(ev, action) => {
        this.setState({
            [action.name]: ev,
            chkSelectClassify:false
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
            chkSelectFirst_in_reason:false
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

    render = () =>{
        const{
            classifyOption, first_in_reasonOption, companyOption, makerOption, modelOption, yearOption
        } = this.state;     
        const styles = {
            container: base => ({
                ...base,
                width: 100,
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
                    <IconButton variant= "contained" color="primary" onClick={() => this.handleClickOpen(this.props.id)} styles={{padding : '5px'}}><EditIcon style={{fontSize:22}}/></IconButton>
                </div>
                {this.props.userName !=='undefined'?
                    <Dialog open={this.state.open} onClose={e=>{if(e.key==='Escape'){
                        this.handleClose();
                    }}}>
                        <DialogTitle>차량 수정</DialogTitle>
                            <DialogContent>
                                <FormControl>
                                    <label>구분</label>
                                        <Select
                                            class="form-control" id="classify"
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
                                                class="form-control" id="first_in_reason"
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
                                                class="form-control" id="company"
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
                                                class="form-control" id="maker"
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
                                                class="form-control" id="model"
                                                name="model"
                                                native
                                                value={this.state.model}
                                                onChange={this.onDataChange}
                                                inputProps={{name: 'model'}}
                                                styles={styles1}
                                                menuPlacement="auto"
                                                menuPosition="fixed"
                                                options={modelOptions}
                                            />
                                    </FormControl><br/><br/>
                                    <FormControl>
                                        <label>연식</label>
                                            <Select
                                                class="form-control" id="year"
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
                                    <label for="inputsm">차대번호</label>
                                    <input class="form-control input-sm" id="inputsm" type="text" name="chassis_no" value={this.state.chassis_no.toUpperCase()} onChange={e=>this.validateCarNumber(e.target.value)}/><br/><br/>
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

export default withStyles(styles)(CustomerUpdate);