import{d as B,r as b,c as v,b as l,w as t,f as d,g as m,e as a,i as s,F as X,h as E,E as I,k as R,t as u,_ as N}from"./index-57e0277e.js";const F={class:"company-info-container"},L={class:"card-header"},M={class:"certificate-list"},O={class:"cert-header"},T={class:"cert-content"},A={class:"dialog-footer"},G=B({__name:"index",setup(P){const g=b([{name:"高新技术企业证书",number:"GR202337001234",issueDate:"2023-12-01",expireDate:"2026-11-30",status:"valid"},{name:"ISO9001质量管理体系认证",number:"ISO9001-2021-1234",issueDate:"2022-06-01",expireDate:"2025-05-31",status:"valid"},{name:"机器人生产许可证",number:"RL-2021-0123",issueDate:"2023-01-01",expireDate:"2026-12-31",status:"valid"},{name:"软件企业认定证书",number:"R-2021-0123",issueDate:"2022-01-01",expireDate:"2024-12-31",status:"warning"},{name:"进出口经营资质证书",number:"IE-2020-0456",issueDate:"2021-07-01",expireDate:"2024-06-30",status:"warning"},{name:"安全生产许可证",number:"SP-2020-0789",issueDate:"2022-01-01",expireDate:"2025-12-31",status:"valid"}]),x=i=>({valid:"success",expired:"danger",warning:"warning"})[i]||"info",w=i=>({valid:"有效",expired:"已过期",warning:"即将过期"})[i]||"未知",r=b(!1),D=()=>{r.value=!0},y=()=>{I.success("保存成功"),r.value=!1};return(i,e)=>{const p=d("el-button"),n=d("el-descriptions-item"),f=d("el-descriptions"),c=d("el-tag"),_=d("el-card"),k=d("el-col"),C=d("el-row"),S=d("el-form"),V=d("el-dialog");return m(),v("div",F,[l(_,null,{header:t(()=>[a("div",L,[e[3]||(e[3]=a("span",{class:"title"},"山东纳智达机器人有限公司",-1)),l(p,{type:"primary",onClick:D},{default:t(()=>e[2]||(e[2]=[s("编辑")])),_:1})])]),default:t(()=>[l(f,{column:2,border:""},{default:t(()=>[l(n,{label:"企业名称"},{default:t(()=>e[4]||(e[4]=[s("山东纳智达机器人有限公司")])),_:1}),l(n,{label:"法定代表人"},{default:t(()=>e[5]||(e[5]=[s("王志远")])),_:1}),l(n,{label:"统一社会信用代码"},{default:t(()=>e[6]||(e[6]=[s("91370100MA3XXXXXX8B")])),_:1}),l(n,{label:"注册资本"},{default:t(()=>e[7]||(e[7]=[s("5000万元")])),_:1}),l(n,{label:"企业类型"},{default:t(()=>e[8]||(e[8]=[s("股份有限公司")])),_:1}),l(n,{label:"成立日期"},{default:t(()=>e[9]||(e[9]=[s("2018-06-15")])),_:1}),l(n,{label:"经营范围"},{default:t(()=>e[10]||(e[10]=[s(" 工业机器人、服务机器人、特种机器人的研发、生产、销售及技术服务；智能装备及零部件的设计、制造、销售；自动化系统集成及技术咨询；软件开发；进出口业务 ")])),_:1}),l(n,{label:"注册地址"},{default:t(()=>e[11]||(e[11]=[s(" 山东省济南市高新区新泺大街1768号科汇大厦B座12层 ")])),_:1})]),_:1}),e[16]||(e[16]=a("div",{class:"section-title"},"联系方式",-1)),l(f,{column:2,border:""},{default:t(()=>[l(n,{label:"联系电话"},{default:t(()=>e[12]||(e[12]=[s("0531-88888888")])),_:1}),l(n,{label:"电子邮箱"},{default:t(()=>e[13]||(e[13]=[s("contact@shandong-robot.com")])),_:1}),l(n,{label:"传真"},{default:t(()=>e[14]||(e[14]=[s("0531-88888889")])),_:1}),l(n,{label:"网址"},{default:t(()=>e[15]||(e[15]=[s("www.shandong-robot.com")])),_:1})]),_:1}),e[17]||(e[17]=a("div",{class:"section-title"},"资质证书",-1)),a("div",M,[l(C,{gutter:20},{default:t(()=>[(m(!0),v(X,null,E(g.value,o=>(m(),R(k,{span:8,key:o.name},{default:t(()=>[l(_,{shadow:"hover",class:"cert-card"},{header:t(()=>[a("div",O,[a("span",null,u(o.name),1),l(c,{type:x(o.status)},{default:t(()=>[s(u(w(o.status)),1)]),_:2},1032,["type"])])]),default:t(()=>[a("div",T,[a("p",null,"证书编号："+u(o.number),1),a("p",null,"发证日期："+u(o.issueDate),1),a("p",null,"有效期至："+u(o.expireDate),1)])]),_:2},1024)]),_:2},1024))),128))]),_:1})])]),_:1}),l(V,{title:"编辑企业信息",modelValue:r.value,"onUpdate:modelValue":e[1]||(e[1]=o=>r.value=o),width:"800px"},{footer:t(()=>[a("span",A,[l(p,{onClick:e[0]||(e[0]=o=>r.value=!1)},{default:t(()=>e[18]||(e[18]=[s("取 消")])),_:1}),l(p,{type:"primary",onClick:y},{default:t(()=>e[19]||(e[19]=[s("确 定")])),_:1})])]),default:t(()=>[l(S,{ref:"formRef",model:i.form,rules:i.rules,"label-width":"120px"},null,8,["model","rules"])]),_:1},8,["modelValue"])])}}});const $=N(G,[["__scopeId","data-v-59efc762"]]);export{$ as default};
