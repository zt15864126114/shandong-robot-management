import{d as le,C as te,q as O,D as re,f as P,w as t,r as o,o as y,a,b as e,h as f,c as D,e as W,F as K,E as X,_ as ae,t as b,G as F,H as oe,y as ee,I as ne,z as ue,J as de,K as ie}from"./index-09569aab.js";const pe={class:"dialog-footer"},me=le({__name:"order-dialog",props:{modelValue:Boolean,order:{type:Object,default:void 0}},emits:["update:modelValue","success"],setup(j,{emit:V}){const $=j,x=V,k=["山东重工","青岛港","济南医院","潍柴动力","浪潮集团","海尔集团","中国重汽","山东钢铁","齐鲁制药","东营石化"],U=[{type:"工业机器人",models:["AR-150","AR-200","AR-300","AR-500"]},{type:"服务机器人",models:["SR-100","SR-200","SR-300"]},{type:"特种机器人",models:["SP-150","SP-200","SP-300"]},{type:"协作机器人",models:["CR-50","CR-100","CR-150"]}],q=te({get:()=>$.modelValue,set:g=>x("update:modelValue",g)}),R=O(),w=O(!1),v=O({customer:"",productType:"",productModel:"",amount:0,status:"pending",deliveryTime:"",remark:""}),G=te(()=>{const g=U.find(s=>s.type===v.value.productType);return g?g.models:[]}),J={customer:[{required:!0,message:"请选择客户",trigger:"change"}],productType:[{required:!0,message:"请选择产品类型",trigger:"change"}],productModel:[{required:!0,message:"请选择产品型号",trigger:"change"}],amount:[{required:!0,message:"请输入订单金额",trigger:"blur"}],status:[{required:!0,message:"请选择订单状态",trigger:"change"}],deliveryTime:[{required:!0,message:"请选择交付日期",trigger:"change"}]};re(()=>$.order,g=>{g&&(v.value={...v.value,...g})},{immediate:!0});const E=()=>{v.value.productModel="",v.value.amount=0},H=()=>{if(v.value.productModel){const g=parseInt(v.value.productModel.split("-")[1])*1e4;v.value.amount=g}},p=async()=>{R.value&&await R.value.validate(g=>{g&&(w.value=!0,setTimeout(()=>{w.value=!1,X.success("保存成功"),q.value=!1,x("success")},1e3))})};return(g,s)=>{const r=o("el-option"),A=o("el-select"),i=o("el-form-item"),u=o("el-col"),m=o("el-input-number"),l=o("el-date-picker"),h=o("el-row"),C=o("el-input"),n=o("el-form"),T=o("el-button"),L=o("el-dialog");return y(),P(L,{title:j.order?"编辑订单":"新增订单",modelValue:q.value,"onUpdate:modelValue":s[8]||(s[8]=d=>q.value=d),width:"700px","close-on-click-modal":!1},{footer:t(()=>[a("span",pe,[e(T,{onClick:s[7]||(s[7]=d=>q.value=!1)},{default:t(()=>s[9]||(s[9]=[f("取 消")])),_:1}),e(T,{type:"primary",onClick:p,loading:w.value},{default:t(()=>s[10]||(s[10]=[f(" 确 定 ")])),_:1},8,["loading"])])]),default:t(()=>[e(n,{ref_key:"formRef",ref:R,model:v.value,rules:J,"label-width":"100px",class:"order-form"},{default:t(()=>[e(h,{gutter:20},{default:t(()=>[e(u,{span:12},{default:t(()=>[e(i,{label:"客户名称",prop:"customer"},{default:t(()=>[e(A,{modelValue:v.value.customer,"onUpdate:modelValue":s[0]||(s[0]=d=>v.value.customer=d),placeholder:"请选择客户",style:{width:"100%"}},{default:t(()=>[(y(),D(K,null,W(k,d=>e(r,{key:d,label:d,value:d},null,8,["label","value"])),64))]),_:1},8,["modelValue"])]),_:1})]),_:1}),e(u,{span:12},{default:t(()=>[e(i,{label:"产品类型",prop:"productType"},{default:t(()=>[e(A,{modelValue:v.value.productType,"onUpdate:modelValue":s[1]||(s[1]=d=>v.value.productType=d),placeholder:"请选择产品类型",style:{width:"100%"},onChange:E},{default:t(()=>[(y(),D(K,null,W(U,d=>e(r,{key:d.type,label:d.type,value:d.type},null,8,["label","value"])),64))]),_:1},8,["modelValue"])]),_:1})]),_:1}),e(u,{span:12},{default:t(()=>[e(i,{label:"产品型号",prop:"productModel"},{default:t(()=>[e(A,{modelValue:v.value.productModel,"onUpdate:modelValue":s[2]||(s[2]=d=>v.value.productModel=d),placeholder:"请选择产品型号",style:{width:"100%"},onChange:H},{default:t(()=>[(y(!0),D(K,null,W(G.value,d=>(y(),P(r,{key:d,label:d,value:d},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])]),_:1})]),_:1}),e(u,{span:12},{default:t(()=>[e(i,{label:"订单金额",prop:"amount"},{default:t(()=>[e(m,{modelValue:v.value.amount,"onUpdate:modelValue":s[3]||(s[3]=d=>v.value.amount=d),min:0,precision:2,step:1e4,style:{width:"100%"}},null,8,["modelValue"])]),_:1})]),_:1}),e(u,{span:12},{default:t(()=>[e(i,{label:"订单状态",prop:"status"},{default:t(()=>[e(A,{modelValue:v.value.status,"onUpdate:modelValue":s[4]||(s[4]=d=>v.value.status=d),placeholder:"请选择状态",style:{width:"100%"}},{default:t(()=>[e(r,{label:"待付款",value:"unpaid"}),e(r,{label:"待发货",value:"unshipped"}),e(r,{label:"已发货",value:"shipped"}),e(r,{label:"已完成",value:"completed"}),e(r,{label:"已取消",value:"cancelled"})]),_:1},8,["modelValue"])]),_:1})]),_:1}),e(u,{span:12},{default:t(()=>[e(i,{label:"交付日期",prop:"deliveryTime"},{default:t(()=>[e(l,{modelValue:v.value.deliveryTime,"onUpdate:modelValue":s[5]||(s[5]=d=>v.value.deliveryTime=d),type:"date",placeholder:"选择交付日期",style:{width:"100%"}},null,8,["modelValue"])]),_:1})]),_:1})]),_:1}),e(i,{label:"备注",prop:"remark"},{default:t(()=>[e(C,{modelValue:v.value.remark,"onUpdate:modelValue":s[6]||(s[6]=d=>v.value.remark=d),type:"textarea",rows:3,placeholder:"请输入备注信息"},null,8,["modelValue"])]),_:1})]),_:1},8,["model"])]),_:1},8,["title","modelValue"])}}});const ce=ae(me,[["__scopeId","data-v-8f7473c6"]]),_e={class:"logistics-tracking"},fe={class:"tracking-header"},ve={key:0,class:"tracking-info"},ge={class:"info-item"},ye={class:"value"},be={class:"info-item"},he={class:"value"},ke={class:"info-item"},Te={class:"value"},Se={class:"info-item"},Ve={class:"value"},we={class:"info-item"},Ce={class:"value"},$e={class:"tracking-timeline"},Re={class:"timeline-content"},Me={class:"location"},De={class:"status"},Ue={key:1,class:"tracking-actions"},Ie={class:"dialog-footer"},Oe=le({__name:"logistics-tracking",props:{order:{}},emits:["success"],setup(j,{emit:V}){var g;const $=j,x=V,k=O(!1),U=O(),q=O(!1),R=O({orderId:((g=$.order)==null?void 0:g.id)||0,status:"pending",trackingNumber:"",carrier:"",currentLocation:"",remark:""}),w={status:[{required:!0,message:"请选择物流状态",trigger:"change"}],trackingNumber:[{required:!0,message:"请输入运单号",trigger:"blur"}],carrier:[{required:!0,message:"请选择承运商",trigger:"change"}],currentLocation:[{required:!0,message:"请输入当前位置",trigger:"blur"}]},v=te(()=>{var s;return(s=$.order)==null?void 0:s.logistics}),G=s=>s?{pending:"info",picked_up:"primary",in_transit:"warning",delivered:"success"}[s]:"",J=s=>s?{pending:"待取件",picked_up:"已取件",in_transit:"运输中",delivered:"已送达"}[s]:"",E=s=>{var r;return s===0?"primary":s===((r=v.value)==null?void 0:r.trackingHistory.length)-1?"success":"info"},H=()=>{k.value=!0},p=async()=>{U.value&&await U.value.validate(s=>{s&&(q.value=!0,setTimeout(()=>{q.value=!1,X.success("物流信息更新成功"),k.value=!1,x("success")},1e3))})};return(s,r)=>{var d,S;const A=o("el-tag"),i=o("el-timeline-item"),u=o("el-timeline"),m=o("el-button"),l=o("el-option"),h=o("el-select"),C=o("el-form-item"),n=o("el-input"),T=o("el-form"),L=o("el-dialog");return y(),D("div",_e,[a("div",fe,[r[7]||(r[7]=a("h3",null,"物流跟踪",-1)),e(A,{type:G((d=v.value)==null?void 0:d.status)},{default:t(()=>{var _;return[f(b(J((_=v.value)==null?void 0:_.status)),1)]}),_:1},8,["type"])]),v.value?(y(),D("div",ve,[a("div",ge,[r[8]||(r[8]=a("span",{class:"label"},"运单号：",-1)),a("span",ye,b(v.value.trackingNumber||"-"),1)]),a("div",be,[r[9]||(r[9]=a("span",{class:"label"},"承运商：",-1)),a("span",he,b(v.value.carrier||"-"),1)]),a("div",ke,[r[10]||(r[10]=a("span",{class:"label"},"当前位置：",-1)),a("span",Te,b(v.value.currentLocation||"-"),1)]),a("div",Se,[r[11]||(r[11]=a("span",{class:"label"},"取件时间：",-1)),a("span",Ve,b(v.value.pickupTime||"-"),1)]),a("div",we,[r[12]||(r[12]=a("span",{class:"label"},"预计送达：",-1)),a("span",Ce,b(v.value.deliveryTime||"-"),1)])])):F("",!0),a("div",$e,[e(u,null,{default:t(()=>{var _;return[(y(!0),D(K,null,W((_=v.value)==null?void 0:_.trackingHistory,(I,M)=>(y(),P(i,{key:M,type:E(M),timestamp:I.time},{default:t(()=>[a("div",Re,[a("div",Me,b(I.location),1),a("div",De,b(I.status),1)])]),_:2},1032,["type","timestamp"]))),128))]}),_:1})]),((S=s.order)==null?void 0:S.status)==="unshipped"?(y(),D("div",Ue,[e(m,{type:"primary",onClick:H},{default:t(()=>r[13]||(r[13]=[f(" 更新物流信息 ")])),_:1})])):F("",!0),e(L,{modelValue:k.value,"onUpdate:modelValue":r[6]||(r[6]=_=>k.value=_),title:"更新物流信息",width:"600px"},{footer:t(()=>[a("span",Ie,[e(m,{onClick:r[5]||(r[5]=_=>k.value=!1)},{default:t(()=>r[14]||(r[14]=[f("取 消")])),_:1}),e(m,{type:"primary",onClick:p,loading:q.value},{default:t(()=>r[15]||(r[15]=[f(" 确 定 ")])),_:1},8,["loading"])])]),default:t(()=>[e(T,{ref_key:"formRef",ref:U,model:R.value,rules:w,"label-width":"100px"},{default:t(()=>[e(C,{label:"物流状态",prop:"status"},{default:t(()=>[e(h,{modelValue:R.value.status,"onUpdate:modelValue":r[0]||(r[0]=_=>R.value.status=_),placeholder:"请选择物流状态"},{default:t(()=>[e(l,{label:"待取件",value:"pending"}),e(l,{label:"已取件",value:"picked_up"}),e(l,{label:"运输中",value:"in_transit"}),e(l,{label:"已送达",value:"delivered"})]),_:1},8,["modelValue"])]),_:1}),e(C,{label:"运单号",prop:"trackingNumber"},{default:t(()=>[e(n,{modelValue:R.value.trackingNumber,"onUpdate:modelValue":r[1]||(r[1]=_=>R.value.trackingNumber=_),placeholder:"请输入运单号"},null,8,["modelValue"])]),_:1}),e(C,{label:"承运商",prop:"carrier"},{default:t(()=>[e(h,{modelValue:R.value.carrier,"onUpdate:modelValue":r[2]||(r[2]=_=>R.value.carrier=_),placeholder:"请选择承运商"},{default:t(()=>[e(l,{label:"顺丰速运",value:"顺丰速运"}),e(l,{label:"德邦物流",value:"德邦物流"}),e(l,{label:"中通快递",value:"中通快递"}),e(l,{label:"圆通速递",value:"圆通速递"}),e(l,{label:"韵达快递",value:"韵达快递"})]),_:1},8,["modelValue"])]),_:1}),e(C,{label:"当前位置",prop:"currentLocation"},{default:t(()=>[e(n,{modelValue:R.value.currentLocation,"onUpdate:modelValue":r[3]||(r[3]=_=>R.value.currentLocation=_),placeholder:"请输入当前位置"},null,8,["modelValue"])]),_:1}),e(C,{label:"备注",prop:"remark"},{default:t(()=>[e(n,{modelValue:R.value.remark,"onUpdate:modelValue":r[4]||(r[4]=_=>R.value.remark=_),type:"textarea",rows:3,placeholder:"请输入备注信息"},null,8,["modelValue"])]),_:1})]),_:1},8,["model"])]),_:1},8,["modelValue"])])}}});const Ne=ae(Oe,[["__scopeId","data-v-7c6d847b"]]),Le={class:"after-sale"},ze={class:"after-sale-header"},xe={key:0,class:"after-sale-info"},qe={key:0,class:"process-records"},Be={class:"timeline-content"},Ae={class:"operator"},Pe={class:"action"},Fe={key:0,class:"remark"},Ee={key:1,class:"attachments"},He={class:"attachment-list"},Ke={class:"dialog-footer"},je=le({__name:"after-sale",props:{order:{}},emits:["success"],setup(j,{emit:V}){var A;const $=j,x=V,k=O(!1),U=O(),q=O(!1),R=O([]),w=O({orderId:((A=$.order)==null?void 0:A.id)||0,type:"repair",reason:"",description:"",attachments:[]}),v={type:[{required:!0,message:"请选择售后类型",trigger:"change"}],reason:[{required:!0,message:"请输入申请原因",trigger:"blur"}],description:[{required:!0,message:"请输入问题描述",trigger:"blur"}]},G=i=>i?{none:"info",applying:"warning",processing:"primary",completed:"success",rejected:"danger"}[i]:"",J=i=>i?{none:"无售后",applying:"申请中",processing:"处理中",completed:"已完成",rejected:"已拒绝"}[i]:"",E=i=>({repair:"维修",return:"退货",refund:"退款"})[i]||i,H=i=>{var u,m,l;return i===0?"primary":i===((l=(m=(u=$.order)==null?void 0:u.afterSale)==null?void 0:m.processRecords)==null?void 0:l.length)-1?"success":"info"},p=()=>{k.value=!0},g=i=>{var u;(u=w.value.attachments)==null||u.push(i.url)},s=i=>{var m,l;const u=(m=w.value.attachments)==null?void 0:m.indexOf(i.url);u!==-1&&((l=w.value.attachments)==null||l.splice(u,1))},r=async()=>{U.value&&await U.value.validate(i=>{i&&(q.value=!0,setTimeout(()=>{q.value=!1,X.success("申请提交成功"),k.value=!1,x("success")},1e3))})};return O([{time:"2024-02-20 14:30",location:"济宁市汶上县中都街道",status:"已签收",operator:"张师傅",phone:"13953712345"},{time:"2024-02-20 09:15",location:"济宁市汶上县中都街道",status:"派送中",operator:"张师傅",phone:"13953712345"},{time:"2024-02-20 08:30",location:"济宁市汶上县中都街道",status:"已到达",operator:"张师傅",phone:"13953712345"},{time:"2024-02-19 16:45",location:"济宁市汶上县中都街道",status:"运输中",operator:"李师傅",phone:"13953767890"},{time:"2024-02-19 14:20",location:"济宁市汶上县中都街道",status:"已发货",operator:"王师傅",phone:"13953723456"}]),(i,u)=>{var Q,c,B,se;const m=o("el-button"),l=o("el-tag"),h=o("el-descriptions-item"),C=o("el-descriptions"),n=o("el-timeline-item"),T=o("el-timeline"),L=o("el-link"),d=o("el-option"),S=o("el-select"),_=o("el-form-item"),I=o("el-input"),M=o("el-upload"),Y=o("el-form"),N=o("el-dialog");return y(),D("div",Le,[a("div",ze,[u[6]||(u[6]=a("h3",null,"售后服务",-1)),(Q=i.order)!=null&&Q.afterSale?F("",!0):(y(),P(m,{key:0,type:"primary",onClick:p},{default:t(()=>u[5]||(u[5]=[f(" 申请售后 ")])),_:1}))]),(c=i.order)!=null&&c.afterSale?(y(),D("div",xe,[e(C,{column:2,border:""},{default:t(()=>[e(h,{label:"售后状态"},{default:t(()=>[e(l,{type:G(i.order.afterSale.status)},{default:t(()=>[f(b(J(i.order.afterSale.status)),1)]),_:1},8,["type"])]),_:1}),e(h,{label:"售后类型"},{default:t(()=>[f(b(E(i.order.afterSale.type)),1)]),_:1}),e(h,{label:"申请原因",span:2},{default:t(()=>[f(b(i.order.afterSale.reason),1)]),_:1}),e(h,{label:"问题描述",span:2},{default:t(()=>[f(b(i.order.afterSale.description),1)]),_:1}),e(h,{label:"申请时间"},{default:t(()=>[f(b(i.order.afterSale.applyTime),1)]),_:1}),e(h,{label:"处理时间"},{default:t(()=>[f(b(i.order.afterSale.processTime||"-"),1)]),_:1}),e(h,{label:"完成时间"},{default:t(()=>[f(b(i.order.afterSale.completeTime||"-"),1)]),_:1})]),_:1}),(B=i.order.afterSale.processRecords)!=null&&B.length?(y(),D("div",qe,[u[7]||(u[7]=a("h4",null,"处理记录",-1)),e(T,null,{default:t(()=>[(y(!0),D(K,null,W(i.order.afterSale.processRecords,(z,Z)=>(y(),P(n,{key:Z,type:H(Z),timestamp:z.time},{default:t(()=>[a("div",Be,[a("div",Ae,b(z.operator),1),a("div",Pe,b(z.action),1),z.remark?(y(),D("div",Fe,b(z.remark),1)):F("",!0)])]),_:2},1032,["type","timestamp"]))),128))]),_:1})])):F("",!0),(se=i.order.afterSale.attachments)!=null&&se.length?(y(),D("div",Ee,[u[8]||(u[8]=a("h4",null,"附件",-1)),a("div",He,[(y(!0),D(K,null,W(i.order.afterSale.attachments,(z,Z)=>(y(),P(L,{key:Z,type:"primary",href:z,target:"_blank"},{default:t(()=>[f(" 附件 "+b(Z+1),1)]),_:2},1032,["href"]))),128))])])):F("",!0)])):F("",!0),e(N,{modelValue:k.value,"onUpdate:modelValue":u[4]||(u[4]=z=>k.value=z),title:"申请售后",width:"600px"},{footer:t(()=>[a("span",Ke,[e(m,{onClick:u[3]||(u[3]=z=>k.value=!1)},{default:t(()=>u[10]||(u[10]=[f("取 消")])),_:1}),e(m,{type:"primary",onClick:r,loading:q.value},{default:t(()=>u[11]||(u[11]=[f(" 提 交 ")])),_:1},8,["loading"])])]),default:t(()=>[e(Y,{ref_key:"formRef",ref:U,model:w.value,rules:v,"label-width":"100px"},{default:t(()=>[e(_,{label:"售后类型",prop:"type"},{default:t(()=>[e(S,{modelValue:w.value.type,"onUpdate:modelValue":u[0]||(u[0]=z=>w.value.type=z),placeholder:"请选择售后类型"},{default:t(()=>[e(d,{label:"维修",value:"repair"}),e(d,{label:"退货",value:"return"}),e(d,{label:"退款",value:"refund"})]),_:1},8,["modelValue"])]),_:1}),e(_,{label:"申请原因",prop:"reason"},{default:t(()=>[e(I,{modelValue:w.value.reason,"onUpdate:modelValue":u[1]||(u[1]=z=>w.value.reason=z),type:"textarea",rows:3,placeholder:"请描述申请原因"},null,8,["modelValue"])]),_:1}),e(_,{label:"问题描述",prop:"description"},{default:t(()=>[e(I,{modelValue:w.value.description,"onUpdate:modelValue":u[2]||(u[2]=z=>w.value.description=z),type:"textarea",rows:4,placeholder:"请详细描述问题"},null,8,["modelValue"])]),_:1}),e(_,{label:"附件"},{default:t(()=>[e(M,{action:"/api/upload","on-success":g,"on-remove":s,"file-list":R.value,multiple:""},{default:t(()=>[e(m,{type:"primary"},{default:t(()=>u[9]||(u[9]=[f("点击上传")])),_:1})]),_:1},8,["file-list"])]),_:1})]),_:1},8,["model"])]),_:1},8,["modelValue"])])}}});const Ge=ae(je,[["__scopeId","data-v-0f29e443"]]),Je={class:"timeline-section"},Qe={class:"dialog-footer"},Ye=le({__name:"order-detail",props:{modelValue:{type:Boolean},order:{}},emits:["update:modelValue","success"],setup(j,{emit:V}){const $=j,x=V,k=te({get:()=>$.modelValue,set:p=>x("update:modelValue",p)}),U=O("basic"),q=p=>p?{unpaid:"warning",unshipped:"primary",shipped:"success",completed:"success",cancelled:"info"}[p]:"",R=p=>p?{unpaid:"待付款",unshipped:"待发货",shipped:"已发货",completed:"已完成",cancelled:"已取消"}[p]:"",w=p=>p?p.toLocaleString("zh-CN",{minimumFractionDigits:2,maximumFractionDigits:2}):"0.00",v=te(()=>{if(!$.order)return[];const p=[{content:"订单创建",timestamp:$.order.createTime,type:"primary"}];return $.order.status==="cancelled"?p.push({content:"订单取消",timestamp:$.order.updateTime,type:"danger"}):($.order.status!=="unpaid"&&p.push({content:"付款完成",timestamp:$.order.payTime||"-",type:"success"}),["shipped","completed"].includes($.order.status)&&p.push({content:"商品发货",timestamp:$.order.shipTime||"-",type:"success"}),$.order.status==="completed"&&p.push({content:"订单完成",timestamp:$.order.completeTime||"-",type:"success"})),p}),G=()=>{oe.confirm("确认该订单已完成付款？","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(()=>{X.success("确认付款成功"),x("success"),k.value=!1})},J=()=>{oe.confirm("确认发货该订单？","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(()=>{X.success("确认发货成功"),x("success"),k.value=!1})},E=()=>{oe.confirm("确认完成该订单？","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(()=>{X.success("订单已完成"),x("success"),k.value=!1})},H=()=>{x("success")};return(p,g)=>{const s=o("el-descriptions-item"),r=o("el-tag"),A=o("el-descriptions"),i=o("el-timeline-item"),u=o("el-timeline"),m=o("el-tab-pane"),l=o("el-tabs"),h=o("el-button"),C=o("el-dialog");return y(),P(C,{title:"订单详情",modelValue:k.value,"onUpdate:modelValue":g[2]||(g[2]=n=>k.value=n),width:"900px"},{footer:t(()=>{var n,T,L;return[a("span",Qe,[e(h,{onClick:g[1]||(g[1]=d=>k.value=!1)},{default:t(()=>g[4]||(g[4]=[f("关 闭")])),_:1}),((n=p.order)==null?void 0:n.status)==="unpaid"?(y(),P(h,{key:0,type:"primary",onClick:G},{default:t(()=>g[5]||(g[5]=[f(" 确认付款 ")])),_:1})):F("",!0),((T=p.order)==null?void 0:T.status)==="unshipped"?(y(),P(h,{key:1,type:"success",onClick:J},{default:t(()=>g[6]||(g[6]=[f(" 确认发货 ")])),_:1})):F("",!0),((L=p.order)==null?void 0:L.status)==="shipped"?(y(),P(h,{key:2,type:"success",onClick:E},{default:t(()=>g[7]||(g[7]=[f(" 确认完成 ")])),_:1})):F("",!0)])]}),default:t(()=>[e(l,{modelValue:U.value,"onUpdate:modelValue":g[0]||(g[0]=n=>U.value=n)},{default:t(()=>[e(m,{label:"基本信息",name:"basic"},{default:t(()=>[p.order?(y(),P(A,{key:0,column:2,border:""},{default:t(()=>[e(s,{label:"订单编号"},{default:t(()=>{var n;return[f(b((n=p.order)==null?void 0:n.orderNo),1)]}),_:1}),e(s,{label:"订单状态"},{default:t(()=>{var n;return[e(r,{type:q((n=p.order)==null?void 0:n.status)},{default:t(()=>{var T;return[f(b(R((T=p.order)==null?void 0:T.status)),1)]}),_:1},8,["type"])]}),_:1}),e(s,{label:"客户名称"},{default:t(()=>{var n;return[f(b((n=p.order)==null?void 0:n.customer),1)]}),_:1}),e(s,{label:"订单金额"},{default:t(()=>{var n;return[f("¥"+b(w((n=p.order)==null?void 0:n.amount)),1)]}),_:1}),e(s,{label:"产品类型"},{default:t(()=>{var n;return[f(b((n=p.order)==null?void 0:n.productType),1)]}),_:1}),e(s,{label:"产品型号"},{default:t(()=>{var n;return[f(b((n=p.order)==null?void 0:n.productModel),1)]}),_:1}),e(s,{label:"创建时间"},{default:t(()=>{var n;return[f(b((n=p.order)==null?void 0:n.createTime),1)]}),_:1}),e(s,{label:"交付时间"},{default:t(()=>{var n;return[f(b((n=p.order)==null?void 0:n.deliveryTime),1)]}),_:1}),e(s,{label:"备注",span:2},{default:t(()=>{var n;return[f(b(((n=p.order)==null?void 0:n.remark)||"暂无备注"),1)]}),_:1})]),_:1})):F("",!0),a("div",Je,[g[3]||(g[3]=a("h3",null,"订单进度",-1)),e(u,null,{default:t(()=>[(y(!0),D(K,null,W(v.value,(n,T)=>(y(),P(i,{key:T,type:n.type,timestamp:n.timestamp},{default:t(()=>[f(b(n.content),1)]),_:2},1032,["type","timestamp"]))),128))]),_:1})])]),_:1}),e(m,{label:"物流跟踪",name:"logistics"},{default:t(()=>[e(Ne,{order:p.order,onSuccess:H},null,8,["order"])]),_:1}),e(m,{label:"售后服务",name:"afterSale"},{default:t(()=>[e(Ge,{order:p.order,onSuccess:H},null,8,["order"])]),_:1})]),_:1},8,["modelValue"])]),_:1},8,["modelValue"])}}});const We=ae(Ye,[["__scopeId","data-v-1e109046"]]),Xe={class:"order-container"},Ze={class:"summary-cards"},et={class:"trend up"},tt={class:"trend up"},lt={class:"trend down"},at={class:"trend up"},ot={class:"card-header"},nt={class:"left"},st={class:"table-container"},rt={class:"operation-buttons"},ut=["onClick"],dt=["onClick"],it=["onClick"],pt=["onClick"],mt=["onClick"],ct=["onClick"],_t=["onClick"],ft=["onClick"],vt={class:"pagination-container"},gt=le({__name:"index",setup(j){const V=O({page:1,pageSize:10,keyword:"",type:"",status:void 0,dateRange:void 0}),$=O([]),x=O(0),k=O({order:!1,detail:!1}),U=O(),R=(()=>{const m=[],l=["unpaid","unshipped","shipped","completed","cancelled"],h=(S,_)=>new Date(S.getTime()+Math.random()*(_.getTime()-S.getTime())),C=new Date;C.setDate(C.getDate()-90);const n=["山东重工","青岛港","济南医院","潍柴动力","浪潮集团","海尔集团","中国重汽","山东钢铁","齐鲁制药","东营石化"],T=[{type:"工业机器人",models:["AR-150","AR-200","AR-300","AR-500"]},{type:"服务机器人",models:["SR-100","SR-200","SR-300"]},{type:"特种机器人",models:["SP-150","SP-200","SP-300"]},{type:"协作机器人",models:["CR-50","CR-100","CR-150"]}],L=["顺丰速运","德邦物流","中通快递","圆通速递","韵达快递"],d=(S,_)=>{if(S==="unpaid"||S==="unshipped")return;const I=S==="shipped"?"in_transit":"delivered",M=`SF${String(Math.floor(Math.random()*1e9)).padStart(9,"0")}`,Y=L[Math.floor(Math.random()*L.length)],N=new Date(_.getTime()+24*60*60*1e3),Q=new Date(_.getTime()+3*24*60*60*1e3),c=I==="delivered"?"已送达":"济南市历下区",B=[{time:_.toISOString().replace("T"," ").substring(0,19),location:"济南市历下区",status:"订单已创建"},{time:N.toISOString().replace("T"," ").substring(0,19),location:"济南市历下区",status:"已取件"},{time:new Date(_.getTime()+2*24*60*60*1e3).toISOString().replace("T"," ").substring(0,19),location:"济南市历下区",status:"运输中"}];return I==="delivered"&&B.push({time:Q.toISOString().replace("T"," ").substring(0,19),location:"已送达",status:"已送达"}),{status:I,trackingNumber:M,carrier:Y,pickupTime:N.toISOString().replace("T"," ").substring(0,19),deliveryTime:Q.toISOString().replace("T"," ").substring(0,19),currentLocation:c,trackingHistory:B}};for(let S=1;S<=100;S++){const _=T[Math.floor(Math.random()*T.length)],I=_.models[Math.floor(Math.random()*_.models.length)],Y=parseInt(I.split("-")[1])*1e4+Math.floor(Math.random()*5e4),N=h(C,new Date),Q=`ORD${N.getFullYear()}${String(N.getMonth()+1).padStart(2,"0")}${String(N.getDate()).padStart(2,"0")}${String(S).padStart(4,"0")}`,c=l[Math.floor(Math.random()*l.length)],B=d(c,N);m.push({id:S,orderNo:Q,customer:n[Math.floor(Math.random()*n.length)],productType:_.type,productModel:I,amount:Y,status:c,createTime:N.toISOString().replace("T"," ").substring(0,19),updateTime:N.toISOString().replace("T"," ").substring(0,19),payTime:c!=="unpaid"?new Date(N.getTime()+24*60*60*1e3).toISOString().replace("T"," ").substring(0,19):null,shipTime:["shipped","completed"].includes(c)?new Date(N.getTime()+3*24*60*60*1e3).toISOString().replace("T"," ").substring(0,19):null,completeTime:c==="completed"?new Date(N.getTime()+7*24*60*60*1e3).toISOString().replace("T"," ").substring(0,19):null,deliveryTime:new Date(N.getTime()+30*24*60*60*1e3).toISOString().split("T")[0],logistics:B,customerContact:{name:"张三",phone:"13800138000",email:"zhangsan@example.com",address:"山东省济南市历下区"},paymentInfo:{method:"银行转账",transactionId:`TR${String(Math.floor(Math.random()*1e9)).padStart(9,"0")}`,paidAmount:Y,paidTime:c!=="unpaid"?new Date(N.getTime()+24*60*60*1e3).toISOString().replace("T"," ").substring(0,19):void 0}})}return m.sort((S,_)=>new Date(_.createTime).getTime()-new Date(S.createTime).getTime())})(),w=()=>{const{page:m,pageSize:l,keyword:h,dateRange:C,status:n}=V.value;let T=R;if(h){const S=h.toLowerCase();T=T.filter(_=>_.orderNo.toLowerCase().includes(S)||_.customer.includes(h))}if(C){const[S,_]=C;T=T.filter(I=>{const M=new Date(I.createTime);return M>=S&&M<=_})}n&&(T=T.filter(S=>S.status===n)),x.value=T.length;const L=(m-1)*l,d=L+l;$.value=T.slice(L,d)},v=m=>({unpaid:"warning",unshipped:"primary",shipped:"success",completed:"success",cancelled:"info"})[m],G=m=>({unpaid:"待付款",unshipped:"待发货",shipped:"已发货",completed:"已完成",cancelled:"已取消"})[m],J=m=>m.toLocaleString("zh-CN",{minimumFractionDigits:2,maximumFractionDigits:2}),E=()=>{V.value.page=1,w()},H=()=>{V.value={page:1,pageSize:10,keyword:"",type:"",status:void 0,dateRange:void 0},w()},p=m=>{U.value=m,k.value.detail=!0},g=m=>{U.value=m,k.value.order=!0},s=m=>{oe.confirm("确定要取消该订单吗？","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(()=>{console.log("取消订单:",m),X.success("订单已取消"),w()}).catch(()=>{})},r=()=>{U.value=void 0,k.value.order=!0},A=m=>{V.value.pageSize=m,V.value.page=1,w()},i=m=>{V.value.page=m,w()},u=()=>{w()};return w(),(m,l)=>{const h=o("el-icon"),C=o("el-card"),n=o("el-col"),T=o("el-row"),L=o("el-input"),d=o("el-option"),S=o("el-select"),_=o("el-date-picker"),I=o("el-button"),M=o("el-table-column"),Y=o("el-tag"),N=o("el-table"),Q=o("el-pagination");return y(),D("div",Xe,[a("div",Ze,[e(T,{gutter:20},{default:t(()=>[e(n,{span:6},{default:t(()=>[e(C,{shadow:"hover",class:"data-card"},{default:t(()=>[l[9]||(l[9]=a("h3",null,"订单总数",-1)),l[10]||(l[10]=a("div",{class:"number"},"1,286",-1)),a("div",et,[e(h,null,{default:t(()=>[e(ee(ne))]),_:1}),l[8]||(l[8]=f(" 8.5% "))])]),_:1})]),_:1}),e(n,{span:6},{default:t(()=>[e(C,{shadow:"hover",class:"data-card"},{default:t(()=>[l[12]||(l[12]=a("h3",null,"订单金额",-1)),l[13]||(l[13]=a("div",{class:"number"},"¥15,862,500",-1)),a("div",tt,[e(h,null,{default:t(()=>[e(ee(ne))]),_:1}),l[11]||(l[11]=f(" 12.3% "))])]),_:1})]),_:1}),e(n,{span:6},{default:t(()=>[e(C,{shadow:"hover",class:"data-card"},{default:t(()=>[l[15]||(l[15]=a("h3",null,"待处理订单",-1)),l[16]||(l[16]=a("div",{class:"number warning"},"86",-1)),a("div",lt,[e(h,null,{default:t(()=>[e(ee(ue))]),_:1}),l[14]||(l[14]=f(" 5.2% "))])]),_:1})]),_:1}),e(n,{span:6},{default:t(()=>[e(C,{shadow:"hover",class:"data-card"},{default:t(()=>[l[18]||(l[18]=a("h3",null,"完成率",-1)),l[19]||(l[19]=a("div",{class:"number"},"96.8%",-1)),a("div",at,[e(h,null,{default:t(()=>[e(ee(ne))]),_:1}),l[17]||(l[17]=f(" 2.1% "))])]),_:1})]),_:1})]),_:1})]),e(C,null,{header:t(()=>[a("div",ot,[a("div",nt,[e(L,{modelValue:V.value.keyword,"onUpdate:modelValue":l[0]||(l[0]=c=>V.value.keyword=c),placeholder:"请输入订单号/客户名称",style:{width:"300px"},clearable:"",onKeyup:de(E,["enter"])},{prefix:t(()=>[e(h,null,{default:t(()=>[e(ee(ie))]),_:1})]),_:1},8,["modelValue"]),e(S,{modelValue:V.value.type,"onUpdate:modelValue":l[1]||(l[1]=c=>V.value.type=c),placeholder:"产品类型",clearable:"",style:{width:"180px"}},{default:t(()=>[e(d,{label:"工业机器人",value:"industrial"}),e(d,{label:"服务机器人",value:"service"}),e(d,{label:"特种机器人",value:"special"}),e(d,{label:"协作机器人",value:"cooperative"})]),_:1},8,["modelValue"]),e(S,{modelValue:V.value.status,"onUpdate:modelValue":l[2]||(l[2]=c=>V.value.status=c),placeholder:"订单状态",clearable:"",style:{width:"120px"}},{default:t(()=>[e(d,{label:"待付款",value:"unpaid"}),e(d,{label:"待发货",value:"unshipped"}),e(d,{label:"已发货",value:"shipped"}),e(d,{label:"已完成",value:"completed"}),e(d,{label:"已取消",value:"cancelled"})]),_:1},8,["modelValue"]),e(_,{modelValue:V.value.dateRange,"onUpdate:modelValue":l[3]||(l[3]=c=>V.value.dateRange=c),type:"daterange","range-separator":"至","start-placeholder":"开始日期","end-placeholder":"结束日期",style:{width:"240px"}},null,8,["modelValue"]),e(I,{type:"primary",onClick:E},{default:t(()=>l[20]||(l[20]=[f("搜索")])),_:1}),e(I,{onClick:H},{default:t(()=>l[21]||(l[21]=[f("重置")])),_:1})]),e(I,{type:"primary",onClick:r},{default:t(()=>l[22]||(l[22]=[f("新增订单")])),_:1})])]),default:t(()=>[a("div",st,[e(N,{data:$.value,border:"",style:{width:"100%"},height:"100%"},{default:t(()=>[e(M,{prop:"orderNo",label:"订单编号",width:"180"}),e(M,{prop:"customer",label:"客户名称",width:"180"}),e(M,{prop:"productType",label:"产品类型",width:"120"}),e(M,{prop:"productModel",label:"产品型号",width:"120"}),e(M,{prop:"amount",label:"订单金额",width:"150"},{default:t(({row:c})=>[f(" ¥"+b(J(c.amount)),1)]),_:1}),e(M,{prop:"status",label:"订单状态",width:"100"},{default:t(({row:c})=>[e(Y,{type:v(c.status)},{default:t(()=>[f(b(G(c.status)),1)]),_:2},1032,["type"])]),_:1}),e(M,{prop:"createTime",label:"创建时间",width:"180"}),e(M,{prop:"deliveryTime",label:"交付时间",width:"180"}),e(M,{label:"操作",width:"180",fixed:"right"},{default:t(({row:c})=>[a("div",rt,[c.status==="unpaid"?(y(),D(K,{key:0},[a("a",{onClick:B=>g(c)},"编辑",8,ut),a("a",{class:"danger",onClick:B=>s(c)},"删除",8,dt),a("a",{onClick:B=>p(c)},"查看",8,it)],64)):c.status==="unshipped"?(y(),D(K,{key:1},[a("a",{onClick:B=>m.handleShip(c)},"发货",8,pt),a("a",{onClick:B=>p(c)},"查看",8,mt)],64)):c.status==="shipped"?(y(),D(K,{key:2},[a("a",{class:"success",onClick:B=>m.handleComplete(c)},"完成",8,ct),a("a",{onClick:B=>p(c)},"查看",8,_t)],64)):(y(),D("a",{key:3,onClick:B=>p(c)},"查看",8,ft))])]),_:1})]),_:1},8,["data"])]),a("div",vt,[e(Q,{"current-page":V.value.page,"onUpdate:currentPage":l[4]||(l[4]=c=>V.value.page=c),"page-size":V.value.pageSize,"onUpdate:pageSize":l[5]||(l[5]=c=>V.value.pageSize=c),total:x.value,"page-sizes":[10,20,50,100],layout:"total, sizes, prev, pager, next",onSizeChange:A,onCurrentChange:i},null,8,["current-page","page-size","total"])])]),_:1}),e(ce,{modelValue:k.value.order,"onUpdate:modelValue":l[6]||(l[6]=c=>k.value.order=c),order:U.value,onSuccess:u},null,8,["modelValue","order"]),e(We,{modelValue:k.value.detail,"onUpdate:modelValue":l[7]||(l[7]=c=>k.value.detail=c),order:U.value,onSuccess:u},null,8,["modelValue","order"])])}}});const bt=ae(gt,[["__scopeId","data-v-68b06a8a"]]);export{bt as default};
