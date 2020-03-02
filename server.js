const moment = require('moment');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 6000;
var Promise = require('bluebird');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: false })); // support encoded bodies

const data = fs.readFileSync('./database.json');
const conf = JSON.parse(data);
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: conf.host,
    user: conf.user,
    password: conf.password,
    port: conf.port,
    database: conf.database,
    multipleStatements: true
});
//var queryAsync = Promise.promisify(connection.query.bind(connection));
connection.connect();

const multer = require('multer');
const upload = multer({dest: './upload'});

app.get('/api/customers/:page', (req, res) => {
    let sql = "SELECT IDX, classify, first_in_reason, company, initial, maker, model, year, chassis_no, reg_date, in_date, out_date, last_date, status_code, release_reason, release_dest, checker, step, auth FROM main WHERE isDeleted = 0 and NOT status_code ='최종출고' ORDER BY IDX DESC LIMIT 20 OFFSET ?"
    let page = (req.params.page * 20) -20;
    let params = [page];
    connection.query(
      sql,params,
      (err, rows, fields) => {
          res.send(rows);
      }  
    );
});

app.get('/api/customerSearch/:searchKeyword/:searchOption', (req, res) => {
    let sql = '';
    if(req.params.searchOption==="차대번호") {
        sql =  "SELECT IDX, classify, first_in_reason, company, initial, maker, model, year, chassis_no, reg_date, in_date, out_date, last_date, status_code, release_reason, release_dest, checker, step, auth FROM main WHERE chassis_no LIKE ? and isDeleted = 0";
    }else if(req.params.searchOption === "의뢰 업체명"){
        sql = "SELECT IDX, classify, first_in_reason, company, initial, maker, model, year, chassis_no, reg_date, in_date, out_date, last_date, status_code, release_reason, release_dest, checker, step, auth FROM main WHERE company LIKE ? and isDeleted = 0";
    }

    let searchKeyword = '%'+req.params.searchKeyword.toUpperCase()+'%';
    
    
    connection.query(
        sql, searchKeyword,
        (err, rows, fields) => {
            res.send(rows);
        }  
    );
});

app.get('/api/customersData/', (req,res)=> {
    connection.query(
        "SELECT classify as '분류', first_in_reason as '입고사유', company as '의뢰 업체명', maker as '제조사', model as '차량모델', year as '연식', chassis_no as '차대번호', \
        in_date as '입고 (날짜)', out_date as '출고 (날짜)', last_date as '갱신 (날짜)', status_code as '입출고 상태', \
        release_reason as '출고 사유', release_dest as '목적지', checker as '입·출고 담당자' FROM main WHERE isDeleted = 0 ORDER BY IDX DESC",
        (err, rows, fields) => {
            res.json(rows);
      });
})

app.get('/api/make', (req,res)=> {
    connection.query(
        "SELECT * FROM category_make1",
        (err, rows, fields) => {
            res.json(rows);
      });
})

app.get('/api/model', (req,res)=> {
    connection.query(
        "SELECT * FROM category_model1",
        (err, rows, fields) => {
            res.json(rows);
      });
})

app.post('/api/model', (req,res)=> {
    let params = req.body.reason
    connection.query(
        "SELECT * FROM category_model1 where eng_make_name = ?", params,
        (err, rows, fields) => {
            res.json(rows);
      });
})

app.get('/api/classification', (req,res)=> {
    connection.query(
        "SELECT class_name AS 'value', class_name AS 'label' FROM classification",
        (err, rows, fields) => {
            res.json(rows);          
      });
})

app.post('/api/firstinreason', (req,res)=> {
    let params = req.body.reason
    connection.query(
        "SELECT * FROM category_first_in_reason WHERE reason = ?", params,
        (err, rows, fields) => {
            res.json(rows);
    });
})

app.get('/api/year', (req,res)=> {
    connection.query(
        "select idx, year from category_car_year order by year desc",
        (err, rows, fields) => {
            res.json(rows);
      });
})

app.post(`/api/company/`, (req,res)=> {
    let params = req.body.reason
    connection.query(
        "SELECT corp_name, corp_initial_name FROM category_corp WHERE reason = ? order by corp_name asc", params,
        (err, rows, fields) => {
            return res.json(rows);     
    });
})


app.post('/api/memberInfo', (req, res) => {
    let sql = "SELECT * FROM management.memberInfo WHERE ID = ? and password = PASSWORD(?)";
    let ID = req.body.ID;
    let password = req.body.password;
    let params = [ID, password];
    connection.query(sql, params,
        (err, rows, fields) => {         
            if(err) throw err;
            if(rows.length>0)
                return res.send({loginresult:true, admin:rows[0].admin, userName:rows[0].userName});
            else
                return res.send({loginresult:false});
        }  
    ); 
});

app.use('/image', express.static('./upload'));

app.post('/api/customersAdd', upload.single('image'), (req, res) => {
    let classify = req.body.classify;
    let first_in_reason = req.body.first_in_reason;
    let company = req.body.company;
    let maker = req.body.maker;
    let model = req.body.model;
    let year = req.body.year;
    let chassis_no = req.body.chassis_no; 
    let userName = req.body.userName;
    var today = moment().format('YYYY-MM-DD HH:mm:ss');
    let sql ='';
    let params = [];
    if(first_in_reason !== '기타'){
        sql = `INSERT INTO main(classify, first_in_reason, company, initial, maker, model, year, chassis_no, reg_name, reg_date) VALUES (?, ?, ?, 
                                        (SELECT corp_initial_name FROM category_corp where corp_name=? and reason=?), ?, ?, ?, ?, ?, ?);`;
            params = [classify, first_in_reason, company, company, first_in_reason, maker, model, year, chassis_no, userName, today];
        }else{
            sql = `INSERT INTO main(classify, first_in_reason, company, initial, maker, model, year, chassis_no, reg_name, reg_date) VALUES (?, ?, ?, 
                (SELECT corp_initial_name FROM category_corp where corp_name=?), ?, ?, ?, ?, ?, ?);`;
                params = [classify, first_in_reason, company, company, maker, model, year, chassis_no, userName, today];
        }
    
    connection.query(sql, params, 
        (err, rows, fields) => {
            console.log(err);
            
            res.send(rows);
        }
    );
});

app.get('/api/customersUpdates/:id', (req, res) => {
    let sql = "SELECT classify, first_in_reason, company, maker, model, year, chassis_no FROM main WHERE IDX = ?";
    let params = [req.params.id];
    
    connection.query(
        sql, params,
      (err, rows, fields) => {          
            res.json(rows);
      }  
    );
});

app.put('/api/customersUpdate/:id', upload.single('image'), (req, res) => {
    let classify = req.body.classify;
    let first_in_reason = req.body.first_in_reason;
    let company = req.body.company;
    let maker = req.body.maker;
    let model = req.body.model;
    let year = req.body.year;
    let chassis_no = req.body.chassis_no;
    let userName = req.body.userName;
    let params = [];
    let sql = "";
    var today = moment().format('YYYY-MM-DD HH:mm:ss');
    
    if(first_in_reason !== '기타'){
        sql = `INSERT INTO yms_system_log.web_log(actor, chassis_no, command, datetime) VALUES(?, ?, '차량 정보 수정', ?);` + 
        `UPDATE main SET classify = ?, first_in_reason=?, company = ?, initial=(SELECT corp_initial_name FROM category_corp where corp_name=? and reason=?) ,maker = ?, model = ?, year = ?, chassis_no = ? WHERE IDX = ?`   
            params = [userName, chassis_no, today, classify, first_in_reason, company, company, first_in_reason, maker, model, year, chassis_no, req.params.id];
        }
    else{
        sql = `INSERT INTO yms_system_log.web_log(actor, chassis_no, command, datetime) VALUES(?, ?, '차량 정보 수정', ?);` + 
        `UPDATE main SET classify = ?, first_in_reason=?, company = ?, initial=(SELECT corp_initial_name FROM category_corp where corp_name=?) ,maker = ?, model = ?, year = ?, chassis_no = ? WHERE IDX = ?`   
        params = [userName, chassis_no, today, classify, first_in_reason, company, company, first_in_reason, maker, model, year, chassis_no, req.params.id];
    }

    
    

    
    connection.query(
        sql, params,
        (err, rows, fields) => {
            res.send(rows);
            console.log(err);              
        }  
    );
});

app.delete('/api/customerDelete/:id/:chassis_no/:userName', (req, res) => {
    let sql = "UPDATE main SET isDeleted = 1 WHERE IDX = ?;" + "INSERT INTO yms_system_log.web_log(actor, chassis_no, command, datetime) VALUES(?, ?, '차량 삭제', ?)";
    var today = moment().format('YYYY-MM-DD HH:mm:ss');
    let id= req.params.id;
    let chassis_no = req.params.chassis_no;
    let userName = req.params.userName;
    let params = [id, userName, chassis_no, today];
    
    connection.query(sql, params,
        (err, rows, fields) =>{
            console.log(err);
            res.send(rows);
        }
    );

    
});



app.get('/api/customersCount', (req, res) =>{
    connection.query(
        "SELECT count(*) as totalCount FROM erp_step3.main WHERE isDeleted = 0 and NOT status_code ='최종출고'",
        (err, rows, fields) => {
            res.send(rows);
        }  
    );
})

app.get('/api/now', (req, res) =>{
    var today = moment().format('YYYY-MM-DD HH:mm:ss');    
    res.send(today);
})

app.get('/api/first_in_reasonCount', (req, res) =>{
    connection.query(
        "SELECT count(*) AS 입고 FROM main where status_code='입고' and isDeleted = 0",
        (err, rows, fields) => {
            res.send(rows);
        }  
    );
})

app.get('/api/not_in_reasonCount', (req, res) =>{
    connection.query(
        "SELECT count(*) AS 미입고 FROM main where status_code='미입고' and isDeleted = 0",
        (err, rows, fields) => {
            res.send(rows);
        }  
    );
})

app.get('/api/tmp_final_reasonCount', (req, res) =>{
    connection.query(
        "SELECT count(*) AS 임시출고 FROM main where status_code='임시출고' and isDeleted = 0",
        (err, rows, fields) => {
            res.send(rows);
        }  
    );
})

app.get('/api/final_reasonCount', (req, res) =>{
    connection.query(
        "SELECT count(*) AS 출고 FROM main where status_code='출고' and isDeleted = 0",
        (err, rows, fields) => {
            res.send(rows);
        }  
    );
})

app.get('/api/today_first_in_reasonCount', (req, res) =>{
    connection.query(
        "SELECT count(*) AS 입고 FROM main WHERE status_code='입고' and isDeleted = 0 and in_date > curdate( )",
        (err, rows, fields) => {
            res.send(rows);
        }  
    );
})

app.get('/api/today_final_reasonCount', (req, res) =>{
    connection.query(
        "SELECT count(*) AS 출고 FROM main where status_code='최종출고' and isDeleted = 0 and last_date > curdate( )",
        (err, rows, fields) => {
            res.send(rows);
        }  
    );
})

app.get('/api/week_first_in_reasonCount', (req, res) =>{

    var today = moment().format('YYYY.MM.DD HH:mm:ss'); 

    connection.query(
        "SELECT count(*) AS 입고 FROM main WHERE YEARWEEK(in_date) = YEARWEEK(?) AND status_code='입고' and isDeleted = 0", today,
        (err, rows, fields) => {
            res.send(rows);
        }  
    );
})

app.get('/api/week_final_reasonCount', (req, res) =>{

    var today = moment().format('YYYY.MM.DD HH:mm:ss');
    connection.query(
        "SELECT count(*) AS 출고 FROM main where YEARWEEK(last_date) = YEARWEEK(?) AND status_code='최종출고' and isDeleted = 0", today,
        (err, rows, fields) => {
            res.send(rows);
        }  
    );
})

app.post('/api/sttsdata', (req, res) =>{
    let chkFinal = req.body.chkFinal;
    let chkNot_First = req.body.chkNot_First;
    let chkFirstIn = req.body.chkFirstIn;
    if(chkFinal===true && chkNot_First===true && chkFirstIn === true){
        connection.query(
            "SELECT classify,company,first_in_reason,status_code,count(*) as 대수 FROM erp_step3.main WHERE isDeleted = 0 group by company, first_in_reason,status_code,classify order by classify asc, status_code desc",
            (err, rows, fields) => {
                res.send(rows);
            }  
        );
    }else if(chkFinal===true && chkNot_First===false  && chkFirstIn === true){
        connection.query(
            "SELECT classify,company,first_in_reason,status_code,count(*) as 대수 FROM erp_step3.main WHERE isDeleted = 0 and NOT status_code ='미입고' group by company, first_in_reason,status_code,classify order by classify asc, status_code desc",
            (err, rows, fields) => {
                res.send(rows);
            }  
        );
    }else if(chkFinal===false && chkNot_First===true  && chkFirstIn === true){
        connection.query(
            "SELECT classify,company,first_in_reason,status_code,count(*) as 대수 FROM erp_step3.main WHERE isDeleted = 0 and NOT status_code ='최종출고' group by company, first_in_reason,status_code,classify order by classify asc, status_code desc",
            (err, rows, fields) => {
                res.send(rows);
            }  
        );
    }else if(chkFinal===false && chkNot_First===true  && chkFirstIn === false){
        connection.query(
            "SELECT classify,company,first_in_reason,status_code,count(*) as 대수 FROM erp_step3.main WHERE isDeleted = 0 and NOT status_code ='최종출고' and NOT status_code ='입고' group by company, first_in_reason,status_code,classify order by classify asc, status_code desc",
            (err, rows, fields) => {
                res.send(rows);
            }  
        );
    }else if(chkFinal===true && chkNot_First===false  && chkFirstIn === false){
        connection.query(
            "SELECT classify,company,first_in_reason,status_code,count(*) as 대수 FROM erp_step3.main WHERE isDeleted = 0 and NOT status_code ='미입고' and NOT status_code ='입고' group by company, first_in_reason,status_code,classify order by classify asc, status_code desc",
            (err, rows, fields) => {
                res.send(rows);
            }  
        );
    }else if(chkFinal===false && chkNot_First===false  && chkFirstIn === false){
        connection.query(
            "SELECT classify,company,first_in_reason,status_code,count(*) as 대수 FROM erp_step3.main WHERE isDeleted = 0 and NOT status_code ='최종출고' and NOT status_code ='입고' and NOT status_code ='미입고' group by company, first_in_reason,status_code,classify order by classify asc, status_code desc",
            (err, rows, fields) => {
                res.send(rows);
            }  
        );
    }else if(chkFinal===true && chkNot_First===true  && chkFirstIn === false){
        connection.query(
            "SELECT classify,company,first_in_reason,status_code,count(*) as 대수 FROM erp_step3.main WHERE isDeleted = 0 and NOT status_code ='입고' group by company, first_in_reason,status_code,classify order by classify asc, status_code desc",
            (err, rows, fields) => {
                res.send(rows);
            }  
        );
    }
    else{
        connection.query(
            "SELECT classify,company,first_in_reason,status_code,count(*) as 대수 FROM erp_step3.main WHERE isDeleted = 0 and NOT status_code ='최종출고' and NOT status_code ='미입고' \
            group by company, first_in_reason,status_code,classify order by classify asc, status_code desc",
            (err, rows, fields) => {
                res.send(rows);
            }  
        );
    }
})

app.get('/api/task/sampleAPI/:admin/:page', (req, res) =>{
    let admin = req.params.admin;
    let page = (req.params.page * 20) -20;
    let sql="";
    if(admin=='2'){
        sql = `select distinct B.IDX, A.status_code, A.IDX as main_IDX, A.classify ,A.company, A.in_date, A.model, A.chassis_no, A.first_in_reason, (SELECT SUM(part_cost+part_cost*0.1+labor_cost)+IFNULL(C.package_cost,0) AS total_cost FROM task_status WHERE main_IDX = A.IDX and isDeleted = 0 and approval_status=1) AS total_cost from main A inner join task_status B on A.chassis_no = B.chassis_no and A.IDX = B.main_IDX LEFT OUTER join task_package C ON A.IDX = C.main_IDX where B.isDeleted = 0 and A.isDeleted = 0 and NOT A.status_code ='최종출고' group by B.chassis_no order by case when performance_status LIKE '%요청%' then 1 when performance_status LIKE '작업 대기' then 2 else 3 end LIMIT 20 OFFSET ?`
    }else{
        sql = `select distinct B.IDX, A.status_code, A.IDX as main_IDX, A.classify ,A.company, A.in_date, A.model, A.chassis_no, A.first_in_reason, (SELECT SUM(part_cost+part_cost*0.1+labor_cost)+IFNULL(C.package_cost,0) AS total_cost FROM task_status WHERE main_IDX = A.IDX and isDeleted = 0 and approval_status=1) AS total_cost from main A inner join task_status B on A.chassis_no = B.chassis_no and A.IDX = B.main_IDX LEFT OUTER join task_package C ON A.IDX = C.main_IDX where B.isDeleted = 0 and A.isDeleted = 0 and NOT A.status_code ='최종출고' group by B.chassis_no order by task_deadline asc LIMIT 20 OFFSET ? `
    }
    
    connection.query(
        sql, page,
        (err, rows, fields) => {
                res.send(rows);
        }  
    );
})

app.get('/api/task/CSVData', (req, res) =>{
    let sql = `select B.IDX AS '순번',A.classify AS '분류', A.company AS '입·출고 의뢰업체명', A.in_date AS '입고 날짜' , A.maker AS '제조사', A.model AS '차량모델', A.chassis_no AS '차대번호', A.checker '입·출고 담당자', 
    B.full_task_code AS '코드번호', B.small_task_name AS '작업명', B.part_cost AS '부품단가', (B.part_cost*0.1) AS '부품비 부가세', B.part_cost+B.part_cost*0.1 AS '총 부품비', 
    B.labor_cost AS '공임비', C.package_cost AS '패키지 금액', B.part_cost+B.part_cost*0.1+B.labor_cost+C.package_cost+C.package_cost*0.1 AS '총 합계', B.task_requester AS '요청자', B.request_date AS '요청날짜', IF(B.approval_status=1,'승인','승인 대기') AS '승인여부',
    B.approval_date AS '승인날짜', B.task_deadline AS '작업기한', B.performance_status AS '진행상태', B.task_start_date AS '작업 시작 날짜', B.task_end_date AS '작업 완료 날짜', A.out_date AS '출고날짜'  FROM main A INNER JOIN 
    task_status B ON A.chassis_no = B.chassis_no AND A.IDX=B.main_IDX LEFT OUTER join task_package C ON A.IDX = C.main_IDX WHERE B.isDeleted = 0 AND A.isDeleted = 0  ORDER BY B.request_date DESC`

    connection.query(
        sql,
        (err, rows, fields) => {
            res.send(rows);
        }  
    );
})

app.get('/api/task/storageCSVData', (req, res) =>{
    let sql = `SELECT A.IDX AS 'IDX', C.company AS '의뢰 업체명',A.chassis_no AS '차대번호', A.storage_cost AS '보관료 (1일)', A.storage_start_date '보관 시작일', B.reg_date '수A 변경일', C.out_date AS '출고일' FROM erp_step3.task_storage A LEFT OUTER JOIN erp_step3.task_changeBA B ON A.main_IDX=B.main_IDX and A.change_count = B.change_count LEFT OUTER JOIN erp_step3.main C ON A.main_IDX = C.IDX;`

    connection.query(
        sql,
        (err, rows, fields) => {
            res.send(rows);
        }  
    );
})

app.get('/api/task/CSVData/:chassis_no', (req, res) =>{
    let chassis_no= req.params.chassis_no;
    let sql = `select B.IDX AS '순번',A.classify AS '분류', A.company AS '입·출고 의뢰업체명', A.in_date AS '입고 날짜' , A.maker AS '제조사', A.model AS '차량모델', A.chassis_no AS '차대번호', A.checker '입·출고 담당자', 
    B.full_task_code AS '코드번호', B.small_task_name AS '작업명', B.part_cost AS '부품단가', (B.part_cost*0.1) AS '부품비 부가세', B.part_cost+B.part_cost*0.1 AS '총 부품비', 
    B.labor_cost AS '공임비', C.package_cost AS '패키지 금액', B.part_cost+B.part_cost*0.1+B.labor_cost+C.package_cost+C.package_cost*0.1 AS '총 합계', B.task_requester AS '요청자', B.request_date AS '요청날짜', IF(B.approval_status=1,'승인','승인 대기') AS '승인여부',
    B.approval_date AS '승인날짜', B.task_deadline AS '작업기한', B.performance_status AS '진행상태', B.task_start_date AS '작업 시작 날짜', B.task_end_date AS '작업 완료 날짜'  FROM main A INNER JOIN 
    task_status B ON A.chassis_no = B.chassis_no AND A.IDX=B.main_IDX LEFT OUTER join task_package C ON A.IDX = C.main_IDX WHERE B.isDeleted = 0 AND A.isDeleted = 0 AND NOT A.status_code ='최종출고' AND B.chassis_no= ? ORDER BY B.request_date DESC;`

    connection.query(
        sql, chassis_no,
        (err, rows, fields) => {
            res.send(rows);
        }  
    );
})

app.get('/api/task/storageCSVData/:chassis_no', (req, res) =>{
    let chassis_no= req.params.chassis_no;
    let sql = `SELECT C.company AS '의뢰 업체명',A.chassis_no AS '차대번호', A.storage_cost AS '보관료 (1일)', A.storage_start_date '보관 시작일', B.reg_date '수A 변경일', C.out_date AS '출고일' FROM erp_step3.task_storage A LEFT OUTER JOIN erp_step3.task_changeBA B ON A.main_IDX=B.main_IDX and A.change_count = B.change_count LEFT OUTER JOIN erp_step3.main C ON A.main_IDX = C.IDX where A.chassis_no =?;`

    connection.query(
        sql, chassis_no,
        (err, rows, fields) => {
            res.send(rows);
        }  
    );
})

app.get('/api/task/taskStatus/:chassis_no/:main_IDX', (req, res) =>{
    let chassis_no= req.params.chassis_no;
    let main_IDX= req.params.main_IDX;
    let params = [chassis_no, main_IDX];
    connection.query(
        `select A.*, B.status_code from task_status A INNER JOIN main B ON A.main_IDX = B.IDX WHERE A.chassis_no = ? and main_IDX = ? AND A.isDeleted = 0 \
        order by case when performance_status="대기" then 1 when performance_status="진행 중" then 2 when performance_status="완료" then 3 end, task_deadline asc`, params,
        (err, rows, fields) => {
            res.send(rows);
        }  
    );
})

app.get('/api/task/totalCost/:main_IDX', (req, res) =>{
    let main_IDX= req.params.main_IDX;
    connection.query(
        `SELECT SUM(part_cost+part_cost*0.1+labor_cost) AS total_cost FROM task_status WHERE main_IDX = ? and isDeleted = 0 and approval_status=1;`,main_IDX,
        (err, rows, fields) => {
            res.send(rows);
        }  
    )
})

app.get('/api/task/packageCost/:main_IDX/:chassis_no', (req, res) =>{
    let main_IDX= req.params.main_IDX;
    let chassis_no= req.params.chassis_no;
    let params = [main_IDX, chassis_no];
        connection.query(
            `SELECT package_cost FROM task_package WHERE main_IDX = ? AND chassis_no = ?;`,params,
            (err, rows, fields) => {
                res.send(rows);
            }  
        )
})

app.get('/api/task/getChassis_no', (req, res) =>{
    connection.query(
        "SELECT IDX, chassis_no FROM main WHERE isDeleted = 0 AND NOT status_code = '최종출고';",
        (err, rows, fields) => {
            res.send(rows);
        }  
    );
})

app.get('/api/task/getDivision/:main_IDX', (req, res) =>{
    let params = req.params.main_IDX;
    connection.query(
        "SELECT distinct large_task_code, medium_task_code, medium_task_name FROM category_task1 WHERE large_task_name = (SELECT classify FROM main WHERE IDX = ?) AND activation = 1;", params,
        (err, rows, fields) => {
            res.send(rows);
        }  
    );
})

app.post('/api/task/getSection', (req, res) =>{
    let reason1 = req.body.reason1;
    let reason2 = req.body.reason2;
    let params = [reason1, reason2]
    connection.query(
        "SELECT small_task_code, small_task_name FROM category_task1 WHERE large_task_name = (SELECT classify FROM main WHERE IDX = ?) AND medium_task_code = ? AND \
        activation = 1;", params,
        (err, rows, fields) => {
            res.send(rows);
        }  
    );
})

app.put('/api/task/workAdmission/:IDX', upload.single('image') ,(req, res) =>{
    let sql = '';
    let params = [];
    var today = moment().format('YYYY-MM-DD HH:mm:ss');

    let IDX= req.params.IDX;
    let performanceStatus = req.body.performanceStatus;
    let userName = req.body.userName;
    let chassis_no = req.body.chassis_no;
    
    if(performanceStatus !== '삭제 요청'){
        sql = `UPDATE task_status SET approval_status = 1, approbator = ?, approval_date = ?, performance_status = '작업 대기' where IDX = ?;` 
        + "INSERT INTO yms_system_log.web_log(actor, chassis_no, command, datetime) VALUES(?,?,?,?)";
        params = [userName, today, IDX, userName, chassis_no, '승인 처리', today];
        
    }else{
        sql = `UPDATE task_status SET isDeleted = 1 WHERE IDX = ?;` + "INSERT INTO yms_system_log.web_log(actor, chassis_no, command, datetime) VALUES(?, ?, '승인 처리', ?)"
        params = [IDX, userName, chassis_no, today];
    }

    connection.query(
        sql,params,
        (err, rows, fields) => {
            console.log(err);
            
            res.send(rows);
        }  
    );
})


app.get('/api/task/getUpdateData/:IDX', (req, res) => {
    let IDX= req.params.IDX;
    connection.query(
        "SELECT A.main_IDX, A.chassis_no, A.task_deadline, A.part_cost, A.labor_cost, B.large_task_code, B.large_task_name, B.medium_task_code, B.medium_task_name, B.small_task_code, \
        B.small_task_name FROM task_status A inner JOIN category_task1 B ON A.full_task_code = B.full_task_code WHERE A.IDX = ?",IDX,
        (err, rows, fields) => {
            res.send(rows);
        }  
    );
})

app.put('/api/task/workUpdate/:IDX', upload.single('image'), (req, res) => {
    let IDX= req.params.IDX;
    let admin = req.body.admin;
    let main_IDX = req.body.main_IDX;
    let Chassis_no = req.body.Chassis_no;
    let full_task_code = req.body.Category + req.body.Division + req.body.Section;
    let small_task_name = req.body.SectionName;
    let task_deadline = req.body.deadline.replace("-", ".").replace("-", ".");
    let userName = req.body.userName;
    let partCost = req.body.partCost;
    let laborCost = req.body.laborCost;
    
    var today = moment().format('YYYY-MM-DD HH:mm:ss'); 

    let sql = '';
    let params = [];
    if(admin == '2'){
        let performance_status = '작업 대기'
        let command = '작업 승인';
        sql = `INSERT INTO yms_system_log.web_log(actor, chassis_no, command, datetime) VALUES(?,?,?,?); \
        UPDATE task_status SET main_IDX=?, chassis_no=?, full_task_code=?, small_task_name=?, task_deadline=?, part_cost=?, labor_cost=?, performance_status= ?, approval_date = ?, approval_status=? where IDX=?;`;
        params = [userName, Chassis_no, command, today, main_IDX, Chassis_no, full_task_code, small_task_name, task_deadline, partCost, laborCost, performance_status, today, 1, IDX];
    }else{
        let performance_status = '수정 요청'
        let command = '작업 수정 요청';
        sql = `INSERT INTO yms_system_log.web_log(actor, chassis_no, command, datetime) VALUES(?,?,?,?); \
        UPDATE task_status SET main_IDX=?, chassis_no=?, full_task_code=?, small_task_name=?, task_deadline=?, part_cost=?, labor_cost=?, approval_status = 0, performance_status= ?, request_date =? where IDX=?;`;
        params = [userName, Chassis_no, command, today, main_IDX, Chassis_no, full_task_code, small_task_name, task_deadline, partCost, laborCost, performance_status, today, IDX];
    }
    
    connection.query(
        sql, params,
        (err, rows, fields) => {
            console.log(err);
            
            res.send(rows);
        }  
    );
})


app.get('/api/task/getWorkCount', (req, res) => {
    connection.query(
        `SELECT COUNT(DISTINCT B.chassis_no) as totalCount FROM task_status B inner join main A 
        on A.chassis_no = B.chassis_no and A.IDX = B.main_IDX WHERE B.isDeleted = 0 and NOT A.status_code = '최종출고';`,
        (err, rows, fields) => {
            res.send(rows);
        }  
    );
})

app.post('/api/task/workAdd', upload.single('image'), (req, res) => {
    let main_IDX = req.body.main_IDX;
    let Chassis_no = req.body.Chassis_no;
    let full_task_code = req.body.Category + req.body.Division + req.body.Section;
    let small_task_name = req.body.SectionName;
    let task_deadline = req.body.deadline.replace("T", " ").replace("-", ".").replace("-", ".");
    let UserName = req.body.UserName;
    let partCost = req.body.partCost;
    let laborCost = req.body.laborCost;
    let admin = req.body.admin;
    
    var today = moment().format('YYYY-MM-DD HH:mm:ss'); 

    let params = [];
    let sql = '';
    if(admin >=2){
        sql = `INSERT INTO task_status(main_IDX, chassis_no, full_task_code, small_task_name, task_deadline, part_cost, labor_cost, task_requester, request_date, approval_status, performance_status, isDeleted) \
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1,'작업 대기', 0);`;
        params = [main_IDX, Chassis_no, full_task_code, small_task_name, task_deadline, partCost, laborCost, UserName, today];
    }else{
        sql = `INSERT INTO task_status(main_IDX, chassis_no, full_task_code, small_task_name, task_deadline, part_cost, labor_cost, task_requester, request_date, performance_status, isDeleted) \
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, '추가 요청', 0);`;
        params = [main_IDX, Chassis_no, full_task_code, small_task_name, task_deadline, partCost, laborCost, UserName, today];
    }
     
        
    
    connection.query(sql, params, 
        (err, rows, fields) => {
            console.log(err);
            
            res.send(rows);
        }
    );
});

app.post('/api/task/packageCost', upload.single('image'), (req, res) => {
    let main_IDX = req.body.main_IDX;
    let chassis_no = req.body.chassis_no;
    let packageCost = req.body.packageCost;
    let UserName = req.body.UserName;
    let admin = req.body.admin;
    var today = moment().format('YYYY-MM-DD HH:mm:ss'); 

    let params = [];
    let sql = '';
    if(admin >= 2){
        sql = `INSERT INTO task_package(main_IDX, chassis_no, package_cost, reg_userName, regDate) \
        VALUES (?, ?, ?, ?, ?);`;
        params = [main_IDX, chassis_no, packageCost, UserName, today];
    }else{
        sql = `INSERT INTO task_package(main_IDX, chassis_no, package_cost, reg_userName, regDate) \
        VALUES (?, ?, ?, ?, ?);`;
        params = [main_IDX, chassis_no, packageCost, UserName, today];
    }
    
    connection.query(sql, params, 
        (err, rows, fields) => {
            console.log(err);
            
            res.send(rows);
        }
    );
});

app.delete('/api/workDelete/:id/:chassis_no/:userName/:admin', (req, res) => {
    let sql = '';
    var today = moment().format('YYYY-MM-DD HH:mm:ss'); 
    let admin = req.params.admin;
    let id= req.params.id;
    let chassis_no = req.params.chassis_no;
    let userName = req.params.userName;
    let params = [];
    if(admin=='2'){
        sql = `UPDATE task_status SET isDeleted = 1 WHERE IDX = ?;` + "INSERT INTO yms_system_log.web_log(actor, chassis_no, command, datetime) VALUES(?, ?, '작업 삭제', ?)"
        params = [id, userName, chassis_no, today];
    }else {
        sql = `UPDATE task_status SET approval_status = 0, performance_status = '삭제 요청' WHERE IDX = ?;` + "INSERT INTO yms_system_log.web_log(actor, chassis_no, command, datetime) VALUES(?, ?, '작업 삭제 요청', ?)"
        params = [id, userName, chassis_no, today];
    }
    
    
    connection.query(sql, params,
        (err, rows, fields) =>{
            console.log(err);
            res.send(rows);
        }
    );

    
});

app.put('/api/task/workStateUpdate/:IDX', upload.single('image'), (req, res) => {
    let sql = '';
    let params = [];
    var today = moment().format('YYYY-MM-DD HH:mm:ss');
    let IDX= req.params.IDX;
    let chassis_no = req.body.chassis_no;
    let userName = req.body.userName;
    let performanceStatus = req.body.performanceStatus;
    
    if(performanceStatus === "작업 대기"){
        sql = `INSERT INTO yms_system_log.web_log(actor, chassis_no, command, datetime) VALUES(?,?,?,?); \
        UPDATE task_status SET performance_status= ?, task_start_date = ? where IDX=?;`;
        params = [userName, chassis_no, '작업 시작', today, '진행 중', today, IDX];
    }else if(performanceStatus === "진행 중"){
        sql = `INSERT INTO yms_system_log.web_log(actor, chassis_no, command, datetime) VALUES(?,?,?,?); \
        UPDATE task_status SET performance_status= ?, task_end_date = ? where IDX=?;`;
        params = [userName, chassis_no, '작업 완료', today, '작업 완료', today, IDX];
    };
    connection.query(
        sql, params,
        (err, rows, fields) => {
            console.log(err);
            
            res.send(rows);
        }  
    );
});

app.put('/api/task/workStateUpdateStorage/', upload.single('image'), (req, res) => {
    let sql = '';
    let params = [];
    var today = moment().format('YYYY-MM-DD HH:mm:ss');
    let main_IDX= req.body.main_IDX;
    let chassis_no = req.body.chassis_no;
    let userName = req.body.userName;
    let storageCost = req.body.storageCost;
    let first_in_reason = req.body.first_in_reason;
    console.log(first_in_reason);
    if(first_in_reason==='수A' || first_in_reason==='수B'){
        sql = `INSERT INTO yms_system_log.web_log(actor, chassis_no, command, datetime) VALUES(?,?,?,?); \
        INSERT INTO task_storage(storage_cost, storage_start_date, main_IDX, chassis_no, change_count) VALUES(?,?,?,?,(Select ifnull(change_count+1,1) from task_changeBA where main_IDX=? and chassis_no=?)); \
        update main set status_code =? where IDX =?;`;
    }else{
        sql = `INSERT INTO yms_system_log.web_log(actor, chassis_no, command, datetime) VALUES(?,?,?,?); \
        INSERT INTO task_storage(storage_cost, storage_start_date, main_IDX, chassis_no, change_count) VALUES(?,?,?,?,(Select ifnull(change_count+1,1) from task_changeBA where main_IDX=? and chassis_no=?)); \
        update main set status_code =? where IDX =?;`;
    }
        params = [userName, chassis_no, '보관 시작', today, storageCost, today, main_IDX, chassis_no, main_IDX, chassis_no, '보관', main_IDX];
    connection.query(
        sql, params,
        (err, rows, fields) => {
            console.log(err);
                
            res.send(rows);
        }  
    );
});

app.put('/api/task/changeBA/', upload.single('image'), (req, res) => {
    let sql = '';
    let params = [];
    var today = moment().format('YYYY-MM-DD HH:mm:ss');
    let main_IDX= req.body.main_IDX;
    let chassis_no = req.body.chassis_no;
    let userName = req.body.userName;
    let first_in_reason = req.body.first_in_reason;
    console.log(first_in_reason);
    
    if(first_in_reason==='수A' || first_in_reason==='수B'){
        sql = `INSERT INTO yms_system_log.web_log(actor, chassis_no, command, datetime) VALUES(?,?,?,?); \ update main set status_code =? where IDX =?; \ INSERT INTO task_changeBA(main_IDX, change_count, chassis_no, reg_date)VALUES(?,(Select ifnull(change_count+1,1) from task_storage where main_IDX=? and chassis_no=?),?,?);`;
    }else{
        sql = `INSERT INTO yms_system_log.web_log(actor, chassis_no, command, datetime) VALUES(?,?,?,?); \ update main set status_code =? where IDX =?; \ INSERT INTO task_changeBA(main_IDX, change_count, chassis_no, reg_date)VALUES(?,(Select ifnull(change_count+1,1) from task_storage where main_IDX=? and chassis_no=?),?,?);`;
    }
    params = [userName, chassis_no, '수A 변경', today, '수A', main_IDX, main_IDX, main_IDX, chassis_no, chassis_no, today];
    connection.query(
        sql, params,
        (err, rows, fields) => {
            console.log(err);
                
            res.send(rows);
        }  
    );
});

app.post('/api/task/get/packageCost', (req,res)=> {
    let main_IDX= req.body.main_IDX;
    let chassis_no = req.body.chassis_no;
    console.log(main_IDX);
    
    let params = [main_IDX, chassis_no];
    connection.query(
        "SELECT package_cost FROM task_package WHERE main_IDX = ? AND chassis_no = ?;", params,
        (err, rows, fields) => {
            console.log(err);
            
            res.json(rows);
        });
})

app.put('/api/task/packageCostUpdate', upload.single('image'), (req, res) => {
    let sql = '';
    let params = [];
    var today = moment().format('YYYY-MM-DD HH:mm:ss');
    let main_IDX= req.body.main_IDX;
    let chassis_no = req.body.chassis_no;
    let userName = req.body.userName;
    let packageCost = req.body.packageCost;
    
    sql = `update task_package set package_cost =? where main_IDX =? and chassis_no=?; INSERT INTO yms_system_log.web_log(actor, chassis_no, command, datetime) VALUES(?,?,?,?)`;
        params = [packageCost, main_IDX, chassis_no, userName, chassis_no, '패키지 금액 수정', today];
    connection.query(
        sql, params,
        (err, rows, fields) => {
            console.log(err);
                
            res.send(rows);
        }  
    );
});

app.listen(port, () => console.log(`Listening on port ${port}`));
