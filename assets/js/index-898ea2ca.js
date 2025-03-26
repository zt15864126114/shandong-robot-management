import{d as ve,q as w,M as C,C as _e,c as f,b as a,w as l,r as s,o as _,a as u,J as be,y as fe,K as ye,h as m,t as A,F as G,f as N,G as $,e as O,H as D,E as q,_ as ge}from"./index-831cb100.js";const ke={class:"purchase-container"},Ce={class:"card-header"},Ve={class:"left"},he={class:"right"},xe={class:"table-container"},we={class:"operation-buttons"},qe=["onClick"],Ge=["onClick"],Te=["onClick"],Ue=["onClick"],Re=["onClick"],Se=["onClick"],Pe=["onClick"],Ae={class:"pagination-container"},$e={key:0,style:{"margin-top":"10px"}},ze=ve({__name:"index",setup(Be){const p=w({page:1,pageSize:10,keyword:"",status:"",dateRange:[]}),c=w([{id:1,code:"CG20250301001",supplier:"发那科（中国）有限公司",amount:32e4,status:"completed",operator:"刘明阳",createTime:"2025-03-01 09:30:00",products:[{name:"发那科机器人 CR-7iA",spec:"CR-7iA",quantity:2,price:16e4}],remark:"机器人本体采购"},{id:2,code:"CG20250301002",supplier:"西门子（中国）有限公司",amount:85e3,status:"approved",operator:"王建国",createTime:"2025-03-01 14:00:00",products:[{name:"西门子S7-1500 PLC",spec:"S7-1500",quantity:5,price:17e3}],remark:"自动化控制系统采购"},{id:3,code:"CG20250302001",supplier:"安川（中国）机器人有限公司",amount:45e4,status:"pending",operator:"张志强",createTime:"2025-03-02 10:15:00",products:[{name:"安川机器人 GP8",spec:"GP8",quantity:5,price:9e4}],remark:"机器人本体采购"},{id:4,code:"CG20250302002",supplier:"欧姆龙自动化（中国）有限公司",amount:25e3,status:"completed",operator:"陈海波",createTime:"2025-03-02 13:45:00",products:[{name:"欧姆龙光电传感器",spec:"E3Z-T61",quantity:100,price:250}],remark:"传感器采购"},{id:5,code:"CG20250302003",supplier:"倍加福工业自动化（中国）有限公司",amount:18e3,status:"cancelled",operator:"李伟东",createTime:"2025-03-02 16:30:00",products:[{name:"倍加福接近开关",spec:"NBB4-12GM50-E0",quantity:30,price:600}],remark:"接近开关采购-已取消"},{id:6,code:"CG20250303001",supplier:"三菱电机自动化（中国）有限公司",amount:95e3,status:"pending",operator:"刘明阳",createTime:"2025-03-03 09:15:00",products:[{name:"三菱伺服电机",spec:"HG-KR43",quantity:5,price:19e3}],remark:"伺服系统采购"},{id:7,code:"CG20250303002",supplier:"基恩士（中国）有限公司",amount:28e4,status:"approved",operator:"王建国",createTime:"2025-03-03 11:30:00",products:[{name:"基恩士视觉系统",spec:"CV-X150F",quantity:2,price:14e4}],remark:"视觉检测系统采购"},{id:8,code:"CG20250303003",supplier:"图尔克（天津）传感器有限公司",amount:42e3,status:"completed",operator:"张志强",createTime:"2025-03-03 14:45:00",products:[{name:"图尔克接近开关",spec:"BI5-M18-AP6X",quantity:60,price:700}],remark:"接近开关批量采购"},{id:9,code:"CG20250304001",supplier:"魏德米勒电联接（上海）有限公司",amount:15e3,status:"pending",operator:"陈海波",createTime:"2025-03-04 10:00:00",products:[{name:"魏德米勒端子",spec:"WDU 2.5",quantity:1e3,price:15}],remark:"接线端子采购"},{id:10,code:"CG20250304002",supplier:"库卡机器人（上海）有限公司",amount:58e4,status:"approved",operator:"李伟东",createTime:"2025-03-04 13:20:00",products:[{name:"库卡机器人",spec:"KR10 R1100",quantity:2,price:29e4}],remark:"机器人本体采购"},{id:11,code:"CG20250304003",supplier:"欧姆龙自动化（中国）有限公司",amount:68e3,status:"completed",operator:"刘明阳",createTime:"2025-03-04 15:40:00",products:[{name:"欧姆龙PLC",spec:"NX1P2",quantity:4,price:17e3}],remark:"控制系统采购"},{id:12,code:"CG20250305001",supplier:"邦纳工程国际有限公司",amount:32e3,status:"pending",operator:"王建国",createTime:"2025-03-05 09:30:00",products:[{name:"邦纳光电传感器",spec:"QS18VP6",quantity:40,price:800}],remark:"光电传感器采购"},{id:13,code:"CG20250305002",supplier:"力士乐（中国）有限公司",amount:45e3,status:"approved",operator:"张志强",createTime:"2025-03-05 11:15:00",products:[{name:"力士乐气缸",spec:"R480",quantity:15,price:3e3}],remark:"气动元件采购"},{id:14,code:"CG20250305003",supplier:"施耐德电气（中国）有限公司",amount:96e3,status:"pending",operator:"陈海波",createTime:"2025-03-05 14:00:00",products:[{name:"施耐德变频器",spec:"ATV320",quantity:8,price:12e3}],remark:"变频器采购"},{id:15,code:"CG20250305004",supplier:"雷尼绍（上海）贸易有限公司",amount:18e4,status:"completed",operator:"李伟东",createTime:"2025-03-05 16:30:00",products:[{name:"雷尼绍测量系统",spec:"RMP60",quantity:2,price:9e4}],remark:"测量系统采购"}]),K=w(100),n=C({visible:!1,type:"add"}),y=C({visible:!1,data:{}}),d=C({code:"",supplier:"",products:[],remark:""}),g=C({id:"",remark:""}),j=[{value:"发那科（中国）有限公司",label:"发那科（中国）有限公司"},{value:"西门子（中国）有限公司",label:"西门子（中国）有限公司"},{value:"安川（中国）机器人有限公司",label:"安川（中国）机器人有限公司"},{value:"欧姆龙自动化（中国）有限公司",label:"欧姆龙自动化（中国）有限公司"},{value:"倍加福工业自动化（中国）有限公司",label:"倍加福工业自动化（中国）有限公司"},{value:"三菱电机自动化（中国）有限公司",label:"三菱电机自动化（中国）有限公司"},{value:"基恩士（中国）有限公司",label:"基恩士（中国）有限公司"},{value:"图尔克（天津）传感器有限公司",label:"图尔克（天津）传感器有限公司"},{value:"魏德米勒电联接（上海）有限公司",label:"魏德米勒电联接（上海）有限公司"},{value:"库卡机器人（上海）有限公司",label:"库卡机器人（上海）有限公司"}],X=[{value:"发那科机器人 CR-7iA",label:"发那科机器人 CR-7iA"},{value:"西门子S7-1500 PLC",label:"西门子S7-1500 PLC"},{value:"安川机器人 GP8",label:"安川机器人 GP8"},{value:"欧姆龙光电传感器",label:"欧姆龙光电传感器"},{value:"倍加福接近开关",label:"倍加福接近开关"},{value:"三菱伺服电机",label:"三菱伺服电机"},{value:"基恩士视觉系统",label:"基恩士视觉系统"},{value:"图尔克接近开关",label:"图尔克接近开关"},{value:"魏德米勒端子",label:"魏德米勒端子"},{value:"库卡机器人",label:"库卡机器人"}],H=C({code:[{required:!0,message:"请输入采购单号",trigger:"blur"}],supplier:[{required:!0,message:"请选择供应商",trigger:"change"}],products:[{required:!0,message:"请添加采购商品",trigger:"change"}]}),J=C({remark:[{required:!0,message:"请输入审核意见",trigger:"blur"}]}),T=w(),U=w(),Q=o=>({pending:"warning",approved:"success",completed:"primary",cancelled:"info"})[o]||"info",W=o=>({pending:"待审核",approved:"已审核",completed:"已完成",cancelled:"已取消"})[o]||o,z=_e(()=>d.products.reduce((o,e)=>o+e.quantity*e.price,0)),B=()=>{p.value.page=1,R()},R=()=>{console.log("加载采购列表:",p.value)},Z=()=>{n.type="add",Object.assign(d,{code:"",supplier:"",products:[],remark:""}),n.visible=!0},Y=o=>{n.type="edit",Object.assign(d,o),n.visible=!0},S=o=>{n.type="view",Object.assign(d,o),n.visible=!0},ee=o=>{y.data=o,g.id=o.id,g.remark="",y.visible=!0},te=o=>{D.confirm("确认完成该采购单？","提示",{type:"warning"}).then(()=>{const e=c.value.findIndex(v=>v.id===o.id);e!==-1&&(c.value[e].status="completed",q.success("操作成功"))})},ae=o=>{D.confirm("确认取消该采购单？","提示",{type:"warning"}).then(()=>{const e=c.value.findIndex(v=>v.id===o.id);e!==-1&&(c.value[e].status="cancelled",q.success("操作成功"))})},le=()=>{d.products.push({name:"",spec:"",quantity:1,price:0})},oe=o=>{d.products.splice(o,1)},ne=async()=>{T.value&&await T.value.validate(o=>{if(o){if(n.type==="add")c.value.unshift({id:c.value.length+1,...d,amount:z.value,status:"pending",operator:"当前用户",createTime:new Date().toLocaleString()}),q.success("添加成功");else{const e=c.value.findIndex(v=>v.id===d.id);e!==-1&&(Object.assign(c.value[e],{...d,amount:z.value}),q.success("修改成功"))}n.visible=!1}})},de=async()=>{U.value&&await U.value.validate(o=>{if(o){const e=c.value.findIndex(v=>v.id===g.id);e!==-1&&(c.value[e].status="approved",q.success("审核通过")),y.visible=!1}})},se=()=>{R()},re=()=>{R()};return(o,e)=>{const v=s("el-icon"),V=s("el-input"),k=s("el-option"),P=s("el-select"),ie=s("el-date-picker"),b=s("el-button"),r=s("el-table-column"),pe=s("el-tag"),F=s("el-table"),ue=s("el-pagination"),ce=s("el-card"),h=s("el-form-item"),E=s("el-col"),me=s("el-row"),L=s("el-input-number"),I=s("el-form"),M=s("el-dialog");return _(),f("div",ke,[a(ce,null,{header:l(()=>[u("div",Ce,[u("div",Ve,[a(V,{modelValue:p.value.keyword,"onUpdate:modelValue":e[0]||(e[0]=t=>p.value.keyword=t),placeholder:"请输入采购单号/商品名称",style:{width:"300px"},clearable:"",onKeyup:be(B,["enter"])},{prefix:l(()=>[a(v,null,{default:l(()=>[a(fe(ye))]),_:1})]),_:1},8,["modelValue"]),a(P,{modelValue:p.value.status,"onUpdate:modelValue":e[1]||(e[1]=t=>p.value.status=t),placeholder:"采购状态",clearable:"",style:{width:"120px"}},{default:l(()=>[a(k,{label:"待审核",value:"pending"}),a(k,{label:"已审核",value:"approved"}),a(k,{label:"已完成",value:"completed"}),a(k,{label:"已取消",value:"cancelled"})]),_:1},8,["modelValue"]),a(ie,{modelValue:p.value.dateRange,"onUpdate:modelValue":e[2]||(e[2]=t=>p.value.dateRange=t),type:"daterange","range-separator":"至","start-placeholder":"开始日期","end-placeholder":"结束日期",style:{width:"240px"}},null,8,["modelValue"]),a(b,{type:"primary",onClick:B},{default:l(()=>e[13]||(e[13]=[m("搜索")])),_:1})]),u("div",he,[a(b,{type:"primary",onClick:Z},{default:l(()=>e[14]||(e[14]=[m("新增采购")])),_:1})])])]),default:l(()=>[u("div",xe,[a(F,{data:c.value,border:"",style:{width:"100%"},height:"100%"},{default:l(()=>[a(r,{prop:"code",label:"采购单号","min-width":"180"}),a(r,{prop:"supplier",label:"供应商","min-width":"200"}),a(r,{prop:"amount",label:"采购金额","min-width":"120"},{default:l(({row:t})=>[m(" ¥"+A(t.amount.toFixed(2)),1)]),_:1}),a(r,{prop:"status",label:"状态","min-width":"100"},{default:l(({row:t})=>[a(pe,{type:Q(t.status)},{default:l(()=>[m(A(W(t.status)),1)]),_:2},1032,["type"])]),_:1}),a(r,{prop:"operator",label:"操作人","min-width":"120"}),a(r,{prop:"createTime",label:"创建时间","min-width":"180"}),a(r,{label:"操作",width:"180",fixed:"right"},{default:l(({row:t})=>[u("div",we,[t.status==="pending"?(_(),f(G,{key:0},[u("a",{onClick:i=>Y(t)},"编辑",8,qe),u("a",{onClick:i=>ee(t)},"审核",8,Ge),u("a",{class:"danger",onClick:i=>ae(t)},"取消",8,Te),u("a",{onClick:i=>S(t)},"查看",8,Ue)],64)):t.status==="approved"?(_(),f(G,{key:1},[u("a",{class:"success",onClick:i=>te(t)},"完成",8,Re),u("a",{onClick:i=>S(t)},"查看",8,Se)],64)):(_(),f("a",{key:2,onClick:i=>S(t)},"查看",8,Pe))])]),_:1})]),_:1},8,["data"])]),u("div",Ae,[a(ue,{"current-page":p.value.page,"onUpdate:currentPage":e[3]||(e[3]=t=>p.value.page=t),"page-size":p.value.pageSize,"onUpdate:pageSize":e[4]||(e[4]=t=>p.value.pageSize=t),total:K.value,"page-sizes":[10,20,50,100],layout:"total, sizes, prev, pager, next",onSizeChange:se,onCurrentChange:re},null,8,["current-page","page-size","total"])])]),_:1}),a(M,{modelValue:n.visible,"onUpdate:modelValue":e[9]||(e[9]=t=>n.visible=t),title:n.type==="add"?"新增采购":n.type==="edit"?"编辑采购":"采购详情",width:"1000px"},{footer:l(()=>[a(b,{onClick:e[8]||(e[8]=t=>n.visible=!1)},{default:l(()=>e[17]||(e[17]=[m("取消")])),_:1}),n.type!=="view"?(_(),N(b,{key:0,type:"primary",onClick:ne},{default:l(()=>e[18]||(e[18]=[m(" 确定 ")])),_:1})):$("",!0)]),default:l(()=>[a(I,{ref_key:"formRef",ref:T,model:d,rules:H,"label-width":"100px",disabled:n.type==="view"},{default:l(()=>[a(me,{gutter:20},{default:l(()=>[a(E,{span:12},{default:l(()=>[a(h,{label:"采购单号",prop:"code"},{default:l(()=>[a(V,{modelValue:d.code,"onUpdate:modelValue":e[5]||(e[5]=t=>d.code=t),placeholder:"请输入采购单号"},null,8,["modelValue"])]),_:1})]),_:1}),a(E,{span:12},{default:l(()=>[a(h,{label:"供应商",prop:"supplier"},{default:l(()=>[a(P,{modelValue:d.supplier,"onUpdate:modelValue":e[6]||(e[6]=t=>d.supplier=t),placeholder:"请选择供应商",style:{width:"100%"}},{default:l(()=>[(_(),f(G,null,O(j,t=>a(k,{key:t.value,label:t.label,value:t.value},null,8,["label","value"])),64))]),_:1},8,["modelValue"])]),_:1})]),_:1})]),_:1}),a(h,{label:"采购商品"},{default:l(()=>[a(F,{data:d.products,border:"",style:{width:"100%"}},{default:l(()=>[a(r,{type:"index",label:"序号",width:"50"}),a(r,{prop:"name",label:"商品名称","min-width":"200"},{default:l(({row:t,$index:i})=>[a(P,{modelValue:t.name,"onUpdate:modelValue":x=>t.name=x,placeholder:"请选择商品",style:{width:"100%"},disabled:n.type==="view"},{default:l(()=>[(_(),f(G,null,O(X,x=>a(k,{key:x.value,label:x.label,value:x.value},null,8,["label","value"])),64))]),_:2},1032,["modelValue","onUpdate:modelValue","disabled"])]),_:1}),a(r,{prop:"spec",label:"规格型号","min-width":"150"},{default:l(({row:t})=>[a(V,{modelValue:t.spec,"onUpdate:modelValue":i=>t.spec=i,placeholder:"请输入规格型号"},null,8,["modelValue","onUpdate:modelValue"])]),_:1}),a(r,{prop:"quantity",label:"数量",width:"120"},{default:l(({row:t})=>[a(L,{modelValue:t.quantity,"onUpdate:modelValue":i=>t.quantity=i,min:1,style:{width:"100%"}},null,8,["modelValue","onUpdate:modelValue"])]),_:1}),a(r,{prop:"price",label:"单价",width:"120"},{default:l(({row:t})=>[a(L,{modelValue:t.price,"onUpdate:modelValue":i=>t.price=i,min:0,precision:2,style:{width:"100%"}},null,8,["modelValue","onUpdate:modelValue"])]),_:1}),a(r,{prop:"amount",label:"金额",width:"120"},{default:l(({row:t})=>[m(A((t.quantity*t.price).toFixed(2)),1)]),_:1}),n.type!=="view"?(_(),N(r,{key:0,label:"操作",width:"80"},{default:l(({$index:t})=>[a(b,{link:"",type:"danger",onClick:i=>oe(t)},{default:l(()=>e[15]||(e[15]=[m("删除")])),_:2},1032,["onClick"])]),_:1})):$("",!0)]),_:1},8,["data"]),n.type!=="view"?(_(),f("div",$e,[a(b,{type:"primary",onClick:le},{default:l(()=>e[16]||(e[16]=[m("添加商品")])),_:1})])):$("",!0)]),_:1}),a(h,{label:"备注",prop:"remark"},{default:l(()=>[a(V,{modelValue:d.remark,"onUpdate:modelValue":e[7]||(e[7]=t=>d.remark=t),type:"textarea",rows:3,placeholder:"请输入备注"},null,8,["modelValue"])]),_:1})]),_:1},8,["model","rules","disabled"])]),_:1},8,["modelValue","title"]),a(M,{modelValue:y.visible,"onUpdate:modelValue":e[12]||(e[12]=t=>y.visible=t),title:"采购审核",width:"500px"},{footer:l(()=>[a(b,{onClick:e[11]||(e[11]=t=>y.visible=!1)},{default:l(()=>e[19]||(e[19]=[m("取消")])),_:1}),a(b,{type:"primary",onClick:de},{default:l(()=>e[20]||(e[20]=[m("确定")])),_:1})]),default:l(()=>[a(I,{ref_key:"approveFormRef",ref:U,model:g,rules:J,"label-width":"100px"},{default:l(()=>[a(h,{label:"审核意见",prop:"remark"},{default:l(()=>[a(V,{modelValue:g.remark,"onUpdate:modelValue":e[10]||(e[10]=t=>g.remark=t),type:"textarea",rows:3,placeholder:"请输入审核意见"},null,8,["modelValue"])]),_:1})]),_:1},8,["model","rules"])]),_:1},8,["modelValue"])])}}});const Ee=ge(ze,[["__scopeId","data-v-8af5bc78"]]);export{Ee as default};
