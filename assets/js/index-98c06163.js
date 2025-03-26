import{d as pe,q as x,M as w,c as h,b as e,w as t,r as n,o as _,a as p,J as ce,y as me,K as ve,h as y,t as ge,F as q,G as P,f as F,e as I,H as O,E as T,_ as _e}from"./index-831cb100.js";const fe={class:"logistics-container"},be={class:"card-header"},ye={class:"left"},Ce={class:"right"},he={class:"table-container"},Ve={class:"operation-buttons"},ke=["onClick"],we=["onClick"],xe=["onClick"],Te=["onClick"],Ge=["onClick"],Ue=["onClick"],qe=["onClick"],Pe=["onClick"],Se={class:"pagination-container"},Le={key:0,style:{"margin-top":"10px"}},Re=pe({__name:"index",setup(We){const u=x({page:1,pageSize:10,keyword:"",status:"",dateRange:[]}),c=x([{id:1,code:"WL20250301001",orderCode:"CG20250301001",receiver:"张明",receiverPhone:"13800138000",address:"山东省济南市高新区科技园区88号",carrier:"顺丰速运",status:"delivered",createTime:"2025-03-01 09:30:00",goods:[{name:"发那科机器人 CR-7iA",spec:"CR-7iA",quantity:2,unit:"台"}],remark:"机器人本体运输"},{id:2,code:"WL20250301002",orderCode:"CG20250301002",receiver:"李强",receiverPhone:"13900139000",address:"山东省青岛市崂山区海尔路1号",carrier:"德邦物流",status:"transit",createTime:"2025-03-01 14:00:00",goods:[{name:"西门子S7-1500 PLC",spec:"S7-1500",quantity:5,unit:"台"}],remark:"控制系统运输"},{id:3,code:"WL20250302001",orderCode:"CG20250302001",receiver:"王华",receiverPhone:"13700137000",address:"山东省烟台市开发区长江路88号",carrier:"中通快递",status:"pending",createTime:"2025-03-02 10:15:00",goods:[{name:"安川机器人 GP8",spec:"GP8",quantity:5,unit:"台"}],remark:"机器人本体运输"},{id:4,code:"WL20250302002",orderCode:"CG20250302002",receiver:"赵静",receiverPhone:"13600136000",address:"山东省潍坊市奎文区东风街1号",carrier:"圆通速递",status:"delivered",createTime:"2025-03-02 13:45:00",goods:[{name:"欧姆龙光电传感器",spec:"E3Z-T61",quantity:100,unit:"个"}],remark:"传感器运输"},{id:5,code:"WL20250302003",orderCode:"CG20250302003",receiver:"刘伟",receiverPhone:"13500135000",address:"山东省淄博市张店区人民路1号",carrier:"韵达快递",status:"cancelled",createTime:"2025-03-02 16:30:00",goods:[{name:"倍加福接近开关",spec:"NBB4-12GM50-E0",quantity:30,unit:"个"}],remark:"接近开关运输-已取消"},{id:6,code:"WL20250303001",orderCode:"CG20250303001",receiver:"陈明",receiverPhone:"13400134000",address:"山东省威海市环翠区文化路1号",carrier:"顺丰速运",status:"pending",createTime:"2025-03-03 09:15:00",goods:[{name:"三菱伺服电机",spec:"HG-KR43",quantity:5,unit:"台"}],remark:"伺服系统运输"},{id:7,code:"WL20250303002",orderCode:"CG20250303002",receiver:"杨华",receiverPhone:"13300133000",address:"山东省临沂市兰山区解放路1号",carrier:"德邦物流",status:"transit",createTime:"2025-03-03 11:30:00",goods:[{name:"基恩士视觉系统",spec:"CV-X150F",quantity:2,unit:"套"}],remark:"视觉系统运输"},{id:8,code:"WL20250303003",orderCode:"CG20250303003",receiver:"周强",receiverPhone:"13200132000",address:"山东省泰安市泰山区泰山路1号",carrier:"中通快递",status:"delivered",createTime:"2025-03-03 14:45:00",goods:[{name:"图尔克接近开关",spec:"BI5-M18-AP6X",quantity:60,unit:"个"}],remark:"接近开关运输"},{id:9,code:"WL20250304001",orderCode:"CG20250304001",receiver:"吴静",receiverPhone:"13100131000",address:"山东省济宁市任城区建设路1号",carrier:"圆通速递",status:"pending",createTime:"2025-03-04 10:00:00",goods:[{name:"魏德米勒端子",spec:"WDU 2.5",quantity:1e3,unit:"个"}],remark:"接线端子运输"},{id:10,code:"WL20250304002",orderCode:"CG20250304002",receiver:"郑伟",receiverPhone:"13000130000",address:"山东省东营市东营区黄河路1号",carrier:"韵达快递",status:"transit",createTime:"2025-03-04 13:20:00",goods:[{name:"库卡机器人",spec:"KR10 R1100",quantity:2,unit:"台"}],remark:"机器人本体运输"}]),A=x(100),o=w({visible:!1,type:"add"}),V=w({visible:!1,data:{}}),r=w({code:"",orderCode:"",receiver:"",receiverPhone:"",address:"",carrier:"",transportType:"",goods:[],remark:""}),f=w({id:"",shipTime:"",remark:""}),K=[{value:"CG20250301001",label:"CG20250301001 - 发那科机器人采购"},{value:"CG20250301002",label:"CG20250301002 - 西门子PLC采购"},{value:"CG20250302001",label:"CG20250302001 - 安川机器人采购"},{value:"CG20250302002",label:"CG20250302002 - 欧姆龙传感器采购"},{value:"CG20250302003",label:"CG20250302003 - 倍加福接近开关采购"}],M=[{value:"顺丰速运",label:"顺丰速运"},{value:"德邦物流",label:"德邦物流"},{value:"中通快递",label:"中通快递"},{value:"圆通速递",label:"圆通速递"},{value:"韵达快递",label:"韵达快递"}],N=w({code:[{required:!0,message:"请输入物流单号",trigger:"blur"}],orderCode:[{required:!0,message:"请选择关联订单",trigger:"change"}],receiver:[{required:!0,message:"请输入收货人",trigger:"blur"}],receiverPhone:[{required:!0,message:"请输入联系电话",trigger:"blur"}],address:[{required:!0,message:"请输入收货地址",trigger:"blur"}],carrier:[{required:!0,message:"请选择承运商",trigger:"change"}],transportType:[{required:!0,message:"请选择运输方式",trigger:"change"}],goods:[{required:!0,message:"请添加货物信息",trigger:"change"}]}),j=w({shipTime:[{required:!0,message:"请选择发货时间",trigger:"change"}]}),S=x(),L=x(),H=d=>({pending:"warning",transit:"primary",delivered:"success",cancelled:"info"})[d]||"info",X=d=>({pending:"待发货",transit:"运输中",delivered:"已送达",cancelled:"已取消"})[d]||d,$=()=>{u.value.page=1,R()},R=()=>{console.log("加载物流列表:",u.value)},J=()=>{o.type="add",Object.assign(r,{code:"",orderCode:"",receiver:"",receiverPhone:"",address:"",carrier:"",transportType:"",goods:[],remark:""}),o.visible=!0},Z=d=>{o.type="edit",Object.assign(r,d),o.visible=!0},G=d=>{o.type="view",Object.assign(r,d),o.visible=!0},Q=d=>{V.data=d,f.id=d.id,f.shipTime="",f.remark="",V.visible=!0},Y=d=>{O.confirm("确认货物已送达？","提示",{type:"warning"}).then(()=>{const a=c.value.findIndex(b=>b.id===d.id);a!==-1&&(c.value[a].status="delivered",T.success("操作成功"))})},ee=d=>{O.confirm("确认取消该物流单？","提示",{type:"warning"}).then(()=>{const a=c.value.findIndex(b=>b.id===d.id);a!==-1&&(c.value[a].status="cancelled",T.success("操作成功"))})},le=()=>{r.goods.push({name:"",spec:"",quantity:1,unit:""})},ae=d=>{r.goods.splice(d,1)},te=async()=>{S.value&&await S.value.validate(d=>{if(d){if(o.type==="add")c.value.unshift({id:c.value.length+1,...r,status:"pending",createTime:new Date().toLocaleString()}),T.success("添加成功");else{const a=c.value.findIndex(b=>b.id===r.id);a!==-1&&(Object.assign(c.value[a],r),T.success("修改成功"))}o.visible=!1}})},re=async()=>{L.value&&await L.value.validate(d=>{if(d){const a=c.value.findIndex(b=>b.id===f.id);a!==-1&&(c.value[a].status="transit",T.success("发货成功")),V.visible=!1}})},de=()=>{R()},oe=()=>{R()};return(d,a)=>{const b=n("el-icon"),v=n("el-input"),g=n("el-option"),U=n("el-select"),z=n("el-date-picker"),C=n("el-button"),s=n("el-table-column"),ne=n("el-tag"),B=n("el-table"),ie=n("el-pagination"),se=n("el-card"),m=n("el-form-item"),k=n("el-col"),W=n("el-row"),ue=n("el-input-number"),E=n("el-form"),D=n("el-dialog");return _(),h("div",fe,[e(se,null,{header:t(()=>[p("div",be,[p("div",ye,[e(v,{modelValue:u.value.keyword,"onUpdate:modelValue":a[0]||(a[0]=l=>u.value.keyword=l),placeholder:"请输入物流单号/收货人",style:{width:"300px"},clearable:"",onKeyup:ce($,["enter"])},{prefix:t(()=>[e(b,null,{default:t(()=>[e(me(ve))]),_:1})]),_:1},8,["modelValue"]),e(U,{modelValue:u.value.status,"onUpdate:modelValue":a[1]||(a[1]=l=>u.value.status=l),placeholder:"物流状态",clearable:"",style:{width:"120px"}},{default:t(()=>[e(g,{label:"待发货",value:"pending"}),e(g,{label:"运输中",value:"transit"}),e(g,{label:"已送达",value:"delivered"}),e(g,{label:"已取消",value:"cancelled"})]),_:1},8,["modelValue"]),e(z,{modelValue:u.value.dateRange,"onUpdate:modelValue":a[2]||(a[2]=l=>u.value.dateRange=l),type:"daterange","range-separator":"至","start-placeholder":"开始日期","end-placeholder":"结束日期",style:{width:"240px"}},null,8,["modelValue"]),e(C,{type:"primary",onClick:$},{default:t(()=>a[19]||(a[19]=[y("搜索")])),_:1})]),p("div",Ce,[e(C,{type:"primary",onClick:J},{default:t(()=>a[20]||(a[20]=[y("新增物流")])),_:1})])])]),default:t(()=>[p("div",he,[e(B,{data:c.value,border:"",style:{width:"100%"},height:"100%"},{default:t(()=>[e(s,{prop:"code",label:"物流单号","min-width":"180"}),e(s,{prop:"orderCode",label:"关联订单","min-width":"180"}),e(s,{prop:"receiver",label:"收货人","min-width":"120"}),e(s,{prop:"receiverPhone",label:"联系电话","min-width":"120"}),e(s,{prop:"address",label:"收货地址","min-width":"200"}),e(s,{prop:"carrier",label:"承运商","min-width":"150"}),e(s,{prop:"status",label:"状态","min-width":"100"},{default:t(({row:l})=>[e(ne,{type:H(l.status)},{default:t(()=>[y(ge(X(l.status)),1)]),_:2},1032,["type"])]),_:1}),e(s,{prop:"createTime",label:"创建时间","min-width":"180"}),e(s,{label:"操作",width:"180",fixed:"right"},{default:t(({row:l})=>[p("div",Ve,[l.status==="pending"?(_(),h(q,{key:0},[p("a",{onClick:i=>Q(l)},"发货",8,ke),p("a",{onClick:i=>Z(l)},"编辑",8,we),p("a",{class:"danger",onClick:i=>ee(l)},"取消",8,xe),p("a",{onClick:i=>G(l)},"查看",8,Te)],64)):l.status==="transit"?(_(),h(q,{key:1},[p("a",{class:"success",onClick:i=>Y(l)},"送达",8,Ge),p("a",{onClick:i=>G(l)},"查看",8,Ue)],64)):l.status==="delivered"?(_(),h("a",{key:2,onClick:i=>G(l)},"查看",8,qe)):l.status==="cancelled"?(_(),h("a",{key:3,onClick:i=>G(l)},"查看",8,Pe)):P("",!0)])]),_:1})]),_:1},8,["data"])]),p("div",Se,[e(ie,{"current-page":u.value.page,"onUpdate:currentPage":a[3]||(a[3]=l=>u.value.page=l),"page-size":u.value.pageSize,"onUpdate:pageSize":a[4]||(a[4]=l=>u.value.pageSize=l),total:A.value,"page-sizes":[10,20,50,100],layout:"total, sizes, prev, pager, next",onSizeChange:de,onCurrentChange:oe},null,8,["current-page","page-size","total"])])]),_:1}),e(D,{modelValue:o.visible,"onUpdate:modelValue":a[14]||(a[14]=l=>o.visible=l),title:o.type==="add"?"新增物流":o.type==="edit"?"编辑物流":"物流详情",width:"1000px"},{footer:t(()=>[e(C,{onClick:a[13]||(a[13]=l=>o.visible=!1)},{default:t(()=>a[23]||(a[23]=[y("取消")])),_:1}),o.type!=="view"?(_(),F(C,{key:0,type:"primary",onClick:te},{default:t(()=>a[24]||(a[24]=[y(" 确定 ")])),_:1})):P("",!0)]),default:t(()=>[e(E,{ref_key:"formRef",ref:S,model:r,rules:N,"label-width":"100px",disabled:o.type==="view"},{default:t(()=>[e(W,{gutter:20},{default:t(()=>[e(k,{span:12},{default:t(()=>[e(m,{label:"物流单号",prop:"code"},{default:t(()=>[e(v,{modelValue:r.code,"onUpdate:modelValue":a[5]||(a[5]=l=>r.code=l),placeholder:"请输入物流单号"},null,8,["modelValue"])]),_:1})]),_:1}),e(k,{span:12},{default:t(()=>[e(m,{label:"关联订单",prop:"orderCode"},{default:t(()=>[e(U,{modelValue:r.orderCode,"onUpdate:modelValue":a[6]||(a[6]=l=>r.orderCode=l),placeholder:"请选择关联订单",style:{width:"100%"}},{default:t(()=>[(_(),h(q,null,I(K,l=>e(g,{key:l.value,label:l.label,value:l.value},null,8,["label","value"])),64))]),_:1},8,["modelValue"])]),_:1})]),_:1})]),_:1}),e(W,{gutter:20},{default:t(()=>[e(k,{span:12},{default:t(()=>[e(m,{label:"收货人",prop:"receiver"},{default:t(()=>[e(v,{modelValue:r.receiver,"onUpdate:modelValue":a[7]||(a[7]=l=>r.receiver=l),placeholder:"请输入收货人"},null,8,["modelValue"])]),_:1})]),_:1}),e(k,{span:12},{default:t(()=>[e(m,{label:"联系电话",prop:"receiverPhone"},{default:t(()=>[e(v,{modelValue:r.receiverPhone,"onUpdate:modelValue":a[8]||(a[8]=l=>r.receiverPhone=l),placeholder:"请输入联系电话"},null,8,["modelValue"])]),_:1})]),_:1})]),_:1}),e(m,{label:"收货地址",prop:"address"},{default:t(()=>[e(v,{modelValue:r.address,"onUpdate:modelValue":a[9]||(a[9]=l=>r.address=l),type:"textarea",rows:2,placeholder:"请输入收货地址"},null,8,["modelValue"])]),_:1}),e(W,{gutter:20},{default:t(()=>[e(k,{span:12},{default:t(()=>[e(m,{label:"承运商",prop:"carrier"},{default:t(()=>[e(U,{modelValue:r.carrier,"onUpdate:modelValue":a[10]||(a[10]=l=>r.carrier=l),placeholder:"请选择承运商",style:{width:"100%"}},{default:t(()=>[(_(),h(q,null,I(M,l=>e(g,{key:l.value,label:l.label,value:l.value},null,8,["label","value"])),64))]),_:1},8,["modelValue"])]),_:1})]),_:1}),e(k,{span:12},{default:t(()=>[e(m,{label:"运输方式",prop:"transportType"},{default:t(()=>[e(U,{modelValue:r.transportType,"onUpdate:modelValue":a[11]||(a[11]=l=>r.transportType=l),placeholder:"请选择运输方式",style:{width:"100%"}},{default:t(()=>[e(g,{label:"公路运输",value:"road"}),e(g,{label:"铁路运输",value:"rail"}),e(g,{label:"航空运输",value:"air"}),e(g,{label:"海运",value:"sea"})]),_:1},8,["modelValue"])]),_:1})]),_:1})]),_:1}),e(m,{label:"货物信息"},{default:t(()=>[e(B,{data:r.goods,border:"",style:{width:"100%"}},{default:t(()=>[e(s,{type:"index",label:"序号",width:"50"}),e(s,{prop:"name",label:"商品名称","min-width":"200"},{default:t(({row:l})=>[e(v,{modelValue:l.name,"onUpdate:modelValue":i=>l.name=i,placeholder:"请输入商品名称"},null,8,["modelValue","onUpdate:modelValue"])]),_:1}),e(s,{prop:"spec",label:"规格型号","min-width":"150"},{default:t(({row:l})=>[e(v,{modelValue:l.spec,"onUpdate:modelValue":i=>l.spec=i,placeholder:"请输入规格型号"},null,8,["modelValue","onUpdate:modelValue"])]),_:1}),e(s,{prop:"quantity",label:"数量",width:"120"},{default:t(({row:l})=>[e(ue,{modelValue:l.quantity,"onUpdate:modelValue":i=>l.quantity=i,min:1,style:{width:"100%"}},null,8,["modelValue","onUpdate:modelValue"])]),_:1}),e(s,{prop:"unit",label:"单位",width:"100"},{default:t(({row:l})=>[e(v,{modelValue:l.unit,"onUpdate:modelValue":i=>l.unit=i,placeholder:"单位"},null,8,["modelValue","onUpdate:modelValue"])]),_:1}),o.type!=="view"?(_(),F(s,{key:0,label:"操作",width:"80"},{default:t(({$index:l})=>[e(C,{link:"",type:"danger",onClick:i=>ae(l)},{default:t(()=>a[21]||(a[21]=[y("删除")])),_:2},1032,["onClick"])]),_:1})):P("",!0)]),_:1},8,["data"]),o.type!=="view"?(_(),h("div",Le,[e(C,{type:"primary",onClick:le},{default:t(()=>a[22]||(a[22]=[y("添加商品")])),_:1})])):P("",!0)]),_:1}),e(m,{label:"备注",prop:"remark"},{default:t(()=>[e(v,{modelValue:r.remark,"onUpdate:modelValue":a[12]||(a[12]=l=>r.remark=l),type:"textarea",rows:3,placeholder:"请输入备注"},null,8,["modelValue"])]),_:1})]),_:1},8,["model","rules","disabled"])]),_:1},8,["modelValue","title"]),e(D,{modelValue:V.visible,"onUpdate:modelValue":a[18]||(a[18]=l=>V.visible=l),title:"物流发货",width:"500px"},{footer:t(()=>[e(C,{onClick:a[17]||(a[17]=l=>V.visible=!1)},{default:t(()=>a[25]||(a[25]=[y("取消")])),_:1}),e(C,{type:"primary",onClick:re},{default:t(()=>a[26]||(a[26]=[y("确定")])),_:1})]),default:t(()=>[e(E,{ref_key:"shipFormRef",ref:L,model:f,rules:j,"label-width":"100px"},{default:t(()=>[e(m,{label:"发货时间",prop:"shipTime"},{default:t(()=>[e(z,{modelValue:f.shipTime,"onUpdate:modelValue":a[15]||(a[15]=l=>f.shipTime=l),type:"datetime",placeholder:"选择发货时间",style:{width:"100%"}},null,8,["modelValue"])]),_:1}),e(m,{label:"发货备注",prop:"remark"},{default:t(()=>[e(v,{modelValue:f.remark,"onUpdate:modelValue":a[16]||(a[16]=l=>f.remark=l),type:"textarea",rows:3,placeholder:"请输入发货备注"},null,8,["modelValue"])]),_:1})]),_:1},8,["model","rules"])]),_:1},8,["modelValue"])])}}});const ze=_e(Re,[["__scopeId","data-v-0b9f3882"]]);export{ze as default};
