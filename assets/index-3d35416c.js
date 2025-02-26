import{d as ee,r as v,c as V,b as e,w as a,f as i,g as _,e as f,B as ae,u as oe,C as te,F as M,h as z,i as l,t as r,k as S,y as U,z as le,E as B,_ as ne}from"./index-57e0277e.js";const de={class:"employee-container"},ie={class:"card-header"},re={class:"left"},se={class:"table-container"},me={class:"pagination-container"},ue={class:"dialog-footer"},pe=ee({__name:"index",setup(ce){const N=[{label:"总经理办公室",value:"GM-OFFICE"},{label:"研发中心",value:"RD-CENTER"},{label:"机器人研发部",value:"RD-ROBOT"},{label:"软件开发部",value:"RD-SOFTWARE"},{label:"生产制造中心",value:"PM-CENTER"},{label:"生产部",value:"PM-PROD"},{label:"质量部",value:"PM-QC"}],d=v({keyword:"",department:"",position:"",status:"",page:1,pageSize:20}),R=v(100),c=v({detail:!1,form:!1}),n=v(),p=v({employeeNo:"",name:"",department:"",position:"",phone:"",email:"",status:"active"}),q={employeeNo:[{required:!0,message:"请输入工号",trigger:"blur"}],name:[{required:!0,message:"请输入姓名",trigger:"blur"}],department:[{required:!0,message:"请选择部门",trigger:"change"}],position:[{required:!0,message:"请选择职位",trigger:"change"}]},D=v([{id:1,employeeNo:"EMP001",name:"王志远",department:"总经理办公室",position:"总经理",phone:"13900139000",email:"wangzy@shandong-robot.com",joinTime:"2023-01-01",status:"active",idCard:"370100198001011234",birthday:"1980-01-01",education:"博士",major:"机械工程",address:"济南市历下区",emergencyContact:"王女士",emergencyPhone:"13911111111"},{id:2,employeeNo:"EMP002",name:"李明",department:"研发中心",position:"总监",phone:"13900139001",email:"liming@shandong-robot.com",joinTime:"2023-02-01",status:"active",idCard:"370100198203121234",birthday:"1982-03-12",education:"硕士",major:"机器人工程",address:"济南市高新区",emergencyContact:"李先生",emergencyPhone:"13922222222"},{id:3,employeeNo:"EMP003",name:"张工",department:"机器人研发部",position:"主管",phone:"13900139002",email:"zhang@shandong-robot.com",joinTime:"2023-03-15",status:"active",idCard:"370100198505151234",birthday:"1985-05-15",education:"硕士",major:"控制工程",address:"济南市天桥区",emergencyContact:"张女士",emergencyPhone:"13933333333"},{id:4,employeeNo:"EMP004",name:"刘芳",department:"软件开发部",position:"主管",phone:"13900139003",email:"liuf@shandong-robot.com",joinTime:"2023-04-01",status:"active",idCard:"370100198707071234",birthday:"1987-07-07",education:"本科",major:"软件工程",address:"济南市槐荫区",emergencyContact:"刘先生",emergencyPhone:"13944444444"},{id:5,employeeNo:"EMP005",name:"周强",department:"生产制造中心",position:"总监",phone:"13900139004",email:"zhouq@shandong-robot.com",joinTime:"2023-03-01",status:"active",idCard:"370100198404041234",birthday:"1984-04-04",education:"硕士",major:"机械制造",address:"济南市历城区",emergencyContact:"周女士",emergencyPhone:"13955555555"},{id:6,employeeNo:"EMP006",name:"吴工",department:"质量部",position:"主管",phone:"13900139005",email:"wu@shandong-robot.com",joinTime:"2023-05-01",status:"active",idCard:"370100198606061234",birthday:"1986-06-06",education:"本科",major:"质量工程",address:"济南市市中区",emergencyContact:"吴先生",emergencyPhone:"13966666666"},{id:7,employeeNo:"EMP007",name:"赵工",department:"机器人研发部",position:"工程师",phone:"13900139006",email:"zhao@shandong-robot.com",joinTime:"2023-07-01",status:"probation",idCard:"370100199001011234",birthday:"1990-01-01",education:"硕士",major:"机器人工程",address:"济南市历下区",emergencyContact:"赵女士",emergencyPhone:"13977777777"},{id:8,employeeNo:"EMP008",name:"孙工",department:"软件开发部",position:"工程师",phone:"13900139007",email:"sun@shandong-robot.com",joinTime:"2023-06-15",status:"resigned",idCard:"370100199202021234",birthday:"1992-02-02",education:"本科",major:"计算机科学",address:"济南市天桥区",emergencyContact:"孙先生",emergencyPhone:"13988888888"},{id:9,employeeNo:"EMP009",name:"陈工",department:"机器人研发部",position:"工程师",phone:"13900139008",email:"chen@shandong-robot.com",joinTime:"2023-08-01",status:"probation",idCard:"370100199303031234",birthday:"1993-03-03",education:"硕士",major:"机械电子工程",address:"济南市历下区",emergencyContact:"陈先生",emergencyPhone:"13999999999"},{id:10,employeeNo:"EMP010",name:"郭工",department:"软件开发部",position:"工程师",phone:"13900139009",email:"guo@shandong-robot.com",joinTime:"2023-08-15",status:"probation",idCard:"370100199404041234",birthday:"1994-04-04",education:"本科",major:"人工智能",address:"济南市高新区",emergencyContact:"郭女士",emergencyPhone:"13900000001"},{id:11,employeeNo:"EMP011",name:"杨工",department:"生产部",position:"主管",phone:"13900139010",email:"yang@shandong-robot.com",joinTime:"2023-03-01",status:"active",idCard:"370100198808081234",birthday:"1988-08-08",education:"本科",major:"机械制造",address:"济南市槐荫区",emergencyContact:"杨先生",emergencyPhone:"13900000002"},{id:12,employeeNo:"EMP012",name:"马工",department:"质量部",position:"工程师",phone:"13900139011",email:"ma@shandong-robot.com",joinTime:"2023-04-01",status:"active",idCard:"370100199505051234",birthday:"1995-05-05",education:"本科",major:"测控技术",address:"济南市市中区",emergencyContact:"马女士",emergencyPhone:"13900000003"},{id:13,employeeNo:"EMP013",name:"韩工",department:"机器人研发部",position:"工程师",phone:"13900139012",email:"han@shandong-robot.com",joinTime:"2023-05-15",status:"active",idCard:"370100199606061234",birthday:"1996-06-06",education:"硕士",major:"控制工程",address:"济南市历城区",emergencyContact:"韩先生",emergencyPhone:"13900000004"},{id:14,employeeNo:"EMP014",name:"朱工",department:"软件开发部",position:"工程师",phone:"13900139013",email:"zhu@shandong-robot.com",joinTime:"2023-06-01",status:"active",idCard:"370100199707071234",birthday:"1997-07-07",education:"本科",major:"软件工程",address:"济南市天桥区",emergencyContact:"朱女士",emergencyPhone:"13900000005"},{id:15,employeeNo:"EMP015",name:"秦工",department:"生产部",position:"工程师",phone:"13900139014",email:"qin@shandong-robot.com",joinTime:"2023-07-01",status:"active",idCard:"370100199808081234",birthday:"1998-08-08",education:"本科",major:"机械工程",address:"济南市历下区",emergencyContact:"秦先生",emergencyPhone:"13900000006"},{id:16,employeeNo:"EMP016",name:"许工",department:"质量部",position:"工程师",phone:"13900139015",email:"xu@shandong-robot.com",joinTime:"2023-07-15",status:"active",idCard:"370100199909091234",birthday:"1999-09-09",education:"本科",major:"质量工程",address:"济南市高新区",emergencyContact:"许女士",emergencyPhone:"13900000007"},{id:17,employeeNo:"EMP017",name:"何工",department:"机器人研发部",position:"工程师",phone:"13900139016",email:"he@shandong-robot.com",joinTime:"2023-08-01",status:"probation",idCard:"370100199010101234",birthday:"1990-10-10",education:"硕士",major:"机器人工程",address:"济南市槐荫区",emergencyContact:"何先生",emergencyPhone:"13900000008"},{id:18,employeeNo:"EMP018",name:"曹工",department:"软件开发部",position:"工程师",phone:"13900139017",email:"cao@shandong-robot.com",joinTime:"2023-08-15",status:"probation",idCard:"370100199111111234",birthday:"1991-11-11",education:"本科",major:"计算机科学",address:"济南市市中区",emergencyContact:"曹女士",emergencyPhone:"13900000009"}]),E=m=>({active:"success",resigned:"info",probation:"warning"})[m]||"info",T=m=>({active:"在职",resigned:"离职",probation:"试用期"})[m]||"未知",b=()=>{console.log("搜索条件：",d.value)},F=()=>{d.value={keyword:"",department:"",position:"",status:"",page:1,pageSize:20},b()},O=m=>{n.value=m,c.value.detail=!0},$=m=>{n.value=m,p.value={...m},c.value.form=!0},A=()=>{n.value=void 0,p.value={employeeNo:"",name:"",department:"",position:"",phone:"",email:"",status:"active"},c.value.form=!0},I=m=>{le.confirm(`确认将员工"${m.name}"设置为离职状态吗？`,"提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(()=>{B.success("操作成功")})},K=()=>{B.success("保存成功"),c.value.form=!1},L=m=>{d.value.pageSize=m,d.value.page=1,b()},Q=m=>{d.value.page=m,b()};return(m,o)=>{const G=i("el-icon"),j=i("el-input"),u=i("el-option"),h=i("el-select"),y=i("el-button"),g=i("el-table-column"),w=i("el-tag"),W=i("el-table"),H=i("el-pagination"),J=i("el-card"),s=i("el-descriptions-item"),X=i("el-descriptions"),k=i("el-dialog"),C=i("el-form-item"),P=i("el-col"),Y=i("el-row"),Z=i("el-form");return _(),V("div",de,[e(J,null,{header:a(()=>[f("div",ie,[f("div",re,[e(j,{modelValue:d.value.keyword,"onUpdate:modelValue":o[0]||(o[0]=t=>d.value.keyword=t),placeholder:"请输入姓名/工号",style:{width:"200px"},clearable:"",onKeyup:ae(b,["enter"])},{prefix:a(()=>[e(G,null,{default:a(()=>[e(oe(te))]),_:1})]),_:1},8,["modelValue"]),e(h,{modelValue:d.value.department,"onUpdate:modelValue":o[1]||(o[1]=t=>d.value.department=t),placeholder:"所属部门",clearable:"",style:{width:"180px"}},{default:a(()=>[(_(),V(M,null,z(N,t=>e(u,{key:t.value,label:t.label,value:t.value},null,8,["label","value"])),64))]),_:1},8,["modelValue"]),e(h,{modelValue:d.value.position,"onUpdate:modelValue":o[2]||(o[2]=t=>d.value.position=t),placeholder:"职位",clearable:"",style:{width:"150px"}},{default:a(()=>[e(u,{label:"工程师",value:"engineer"}),e(u,{label:"主管",value:"supervisor"}),e(u,{label:"经理",value:"manager"}),e(u,{label:"总监",value:"director"})]),_:1},8,["modelValue"]),e(h,{modelValue:d.value.status,"onUpdate:modelValue":o[3]||(o[3]=t=>d.value.status=t),placeholder:"状态",clearable:"",style:{width:"120px"}},{default:a(()=>[e(u,{label:"在职",value:"active"}),e(u,{label:"离职",value:"resigned"}),e(u,{label:"试用期",value:"probation"})]),_:1},8,["modelValue"]),e(y,{type:"primary",onClick:b},{default:a(()=>o[13]||(o[13]=[l("搜索")])),_:1}),e(y,{onClick:F},{default:a(()=>o[14]||(o[14]=[l("重置")])),_:1})]),e(y,{type:"primary",onClick:A},{default:a(()=>o[15]||(o[15]=[l("新增员工")])),_:1})])]),default:a(()=>[f("div",se,[e(W,{data:D.value,border:"",style:{width:"100%"},height:"100%"},{default:a(()=>[e(g,{prop:"employeeNo",label:"工号",width:"120"}),e(g,{prop:"name",label:"姓名",width:"120"}),e(g,{prop:"department",label:"所属部门",width:"150"}),e(g,{prop:"position",label:"职位",width:"120"}),e(g,{prop:"phone",label:"联系电话",width:"150"}),e(g,{prop:"email",label:"邮箱","min-width":"200"}),e(g,{prop:"joinTime",label:"入职时间",width:"180"}),e(g,{prop:"status",label:"状态",width:"100"},{default:a(({row:t})=>[e(w,{type:E(t.status)},{default:a(()=>[l(r(T(t.status)),1)]),_:2},1032,["type"])]),_:1}),e(g,{label:"操作",width:"180",fixed:"right"},{default:a(({row:t})=>[e(y,{link:"",type:"primary",onClick:x=>O(t)},{default:a(()=>o[16]||(o[16]=[l("查看")])),_:2},1032,["onClick"]),e(y,{link:"",type:"primary",onClick:x=>$(t)},{default:a(()=>o[17]||(o[17]=[l("编辑")])),_:2},1032,["onClick"]),t.status==="active"?(_(),S(y,{key:0,link:"",type:"danger",onClick:x=>I(t)},{default:a(()=>o[18]||(o[18]=[l("离职")])),_:2},1032,["onClick"])):U("",!0)]),_:1})]),_:1},8,["data"])]),f("div",me,[e(H,{"current-page":d.value.page,"onUpdate:currentPage":o[4]||(o[4]=t=>d.value.page=t),"page-size":d.value.pageSize,"onUpdate:pageSize":o[5]||(o[5]=t=>d.value.pageSize=t),total:R.value,"page-sizes":[10,20,50,100],layout:"total, sizes, prev, pager, next",onSizeChange:L,onCurrentChange:Q},null,8,["current-page","page-size","total"])])]),_:1}),e(k,{title:"员工详情",modelValue:c.value.detail,"onUpdate:modelValue":o[6]||(o[6]=t=>c.value.detail=t),width:"800px"},{default:a(()=>[n.value?(_(),S(X,{key:0,column:2,border:""},{default:a(()=>[e(s,{label:"工号"},{default:a(()=>[l(r(n.value.employeeNo),1)]),_:1}),e(s,{label:"姓名"},{default:a(()=>[l(r(n.value.name),1)]),_:1}),e(s,{label:"所属部门"},{default:a(()=>[l(r(n.value.department),1)]),_:1}),e(s,{label:"职位"},{default:a(()=>[l(r(n.value.position),1)]),_:1}),e(s,{label:"联系电话"},{default:a(()=>[l(r(n.value.phone),1)]),_:1}),e(s,{label:"邮箱"},{default:a(()=>[l(r(n.value.email),1)]),_:1}),e(s,{label:"入职时间"},{default:a(()=>[l(r(n.value.joinTime),1)]),_:1}),e(s,{label:"状态"},{default:a(()=>[e(w,{type:E(n.value.status)},{default:a(()=>[l(r(T(n.value.status)),1)]),_:1},8,["type"])]),_:1}),e(s,{label:"身份证号"},{default:a(()=>[l(r(n.value.idCard),1)]),_:1}),e(s,{label:"出生日期"},{default:a(()=>[l(r(n.value.birthday),1)]),_:1}),e(s,{label:"学历"},{default:a(()=>[l(r(n.value.education),1)]),_:1}),e(s,{label:"专业"},{default:a(()=>[l(r(n.value.major),1)]),_:1}),e(s,{label:"紧急联系人"},{default:a(()=>[l(r(n.value.emergencyContact),1)]),_:1}),e(s,{label:"紧急联系电话"},{default:a(()=>[l(r(n.value.emergencyPhone),1)]),_:1}),e(s,{label:"居住地址",span:2},{default:a(()=>[l(r(n.value.address),1)]),_:1}),e(s,{label:"备注",span:2},{default:a(()=>[l(r(n.value.remark||"暂无"),1)]),_:1})]),_:1})):U("",!0)]),_:1},8,["modelValue"]),e(k,{title:n.value?"编辑员工":"新增员工",modelValue:c.value.form,"onUpdate:modelValue":o[12]||(o[12]=t=>c.value.form=t),width:"800px"},{footer:a(()=>[f("span",ue,[e(y,{onClick:o[11]||(o[11]=t=>c.value.form=!1)},{default:a(()=>o[19]||(o[19]=[l("取 消")])),_:1}),e(y,{type:"primary",onClick:K},{default:a(()=>o[20]||(o[20]=[l("确 定")])),_:1})])]),default:a(()=>[e(Z,{ref:"formRef",model:p.value,rules:q,"label-width":"100px"},{default:a(()=>[e(Y,{gutter:20},{default:a(()=>[e(P,{span:12},{default:a(()=>[e(C,{label:"工号",prop:"employeeNo"},{default:a(()=>[e(j,{modelValue:p.value.employeeNo,"onUpdate:modelValue":o[7]||(o[7]=t=>p.value.employeeNo=t),placeholder:"请输入工号"},null,8,["modelValue"])]),_:1})]),_:1}),e(P,{span:12},{default:a(()=>[e(C,{label:"姓名",prop:"name"},{default:a(()=>[e(j,{modelValue:p.value.name,"onUpdate:modelValue":o[8]||(o[8]=t=>p.value.name=t),placeholder:"请输入姓名"},null,8,["modelValue"])]),_:1})]),_:1}),e(P,{span:12},{default:a(()=>[e(C,{label:"所属部门",prop:"department"},{default:a(()=>[e(h,{modelValue:p.value.department,"onUpdate:modelValue":o[9]||(o[9]=t=>p.value.department=t),placeholder:"请选择部门",style:{width:"100%"}},{default:a(()=>[(_(),V(M,null,z(N,t=>e(u,{key:t.value,label:t.label,value:t.value},null,8,["label","value"])),64))]),_:1},8,["modelValue"])]),_:1})]),_:1}),e(P,{span:12},{default:a(()=>[e(C,{label:"职位",prop:"position"},{default:a(()=>[e(h,{modelValue:p.value.position,"onUpdate:modelValue":o[10]||(o[10]=t=>p.value.position=t),placeholder:"请选择职位",style:{width:"100%"}},{default:a(()=>[e(u,{label:"工程师",value:"engineer"}),e(u,{label:"主管",value:"supervisor"}),e(u,{label:"经理",value:"manager"}),e(u,{label:"总监",value:"director"})]),_:1},8,["modelValue"])]),_:1})]),_:1})]),_:1})]),_:1},8,["model"])]),_:1},8,["title","modelValue"])])}}});const ye=ne(pe,[["__scopeId","data-v-27eb5f4c"]]);export{ye as default};
