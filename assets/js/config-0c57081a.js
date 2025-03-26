import{d as q,q as A,M as g,c as C,b as l,w as t,u as P,r as u,o as D,a as m,y as h,P as B,h as r,E as y,_ as E}from"./index-831cb100.js";const N={class:"payment-config-container"},R={class:"card-header"},T={class:"left"},M=q({__name:"config",setup(S){const _=P(),s=A(),a=g({alipay:{enabled:!0,appId:"",privateKey:"",publicKey:"",notifyUrl:""},wechat:{enabled:!0,mchId:"",appId:"",apiKey:"",notifyUrl:""},bank:{enabled:!0,merchantId:"",apiKey:"",notifyUrl:""},common:{timeout:30,autoClose:!0,notify:["email","sms"]}}),I=g({alipay:{appId:[{required:!0,message:"请输入支付宝AppID",trigger:"blur"}],privateKey:[{required:!0,message:"请输入商户私钥",trigger:"blur"}],publicKey:[{required:!0,message:"请输入支付宝公钥",trigger:"blur"}],notifyUrl:[{required:!0,message:"请输入回调地址",trigger:"blur"}]},wechat:{mchId:[{required:!0,message:"请输入微信商户号",trigger:"blur"}],appId:[{required:!0,message:"请输入微信AppID",trigger:"blur"}],apiKey:[{required:!0,message:"请输入API密钥",trigger:"blur"}],notifyUrl:[{required:!0,message:"请输入回调地址",trigger:"blur"}]},bank:{merchantId:[{required:!0,message:"请输入商户号",trigger:"blur"}],apiKey:[{required:!0,message:"请输入API密钥",trigger:"blur"}],notifyUrl:[{required:!0,message:"请输入回调地址",trigger:"blur"}]}}),c=()=>{_.back()},U=async()=>{s.value&&await s.value.validate(V=>{V&&(console.log("保存配置:",a),y.success("配置保存成功"))})},k=()=>{y.info("正在测试支付配置..."),setTimeout(()=>{y.success("支付配置测试成功")},2e3)};return(V,e)=>{const f=u("el-button"),p=u("el-divider"),i=u("el-switch"),n=u("el-form-item"),d=u("el-input"),w=u("el-input-number"),b=u("el-checkbox"),K=u("el-checkbox-group"),v=u("el-form"),x=u("el-card");return D(),C("div",N,[l(x,null,{header:t(()=>[m("div",R,[m("div",T,[l(f,{onClick:c,icon:h(B)},{default:t(()=>e[17]||(e[17]=[r("返回")])),_:1},8,["icon"])]),e[18]||(e[18]=m("div",{class:"right"},[m("span",null,"支付配置")],-1))])]),default:t(()=>[l(v,{ref_key:"formRef",ref:s,model:a,rules:I,"label-width":"120px",class:"payment-form"},{default:t(()=>[l(p,{"content-position":"left"},{default:t(()=>e[19]||(e[19]=[r("支付宝配置")])),_:1}),l(n,{label:"支付宝状态",prop:"alipay.enabled"},{default:t(()=>[l(i,{modelValue:a.alipay.enabled,"onUpdate:modelValue":e[0]||(e[0]=o=>a.alipay.enabled=o)},null,8,["modelValue"])]),_:1}),l(n,{label:"AppID",prop:"alipay.appId"},{default:t(()=>[l(d,{modelValue:a.alipay.appId,"onUpdate:modelValue":e[1]||(e[1]=o=>a.alipay.appId=o),placeholder:"请输入支付宝AppID"},null,8,["modelValue"])]),_:1}),l(n,{label:"商户私钥",prop:"alipay.privateKey"},{default:t(()=>[l(d,{modelValue:a.alipay.privateKey,"onUpdate:modelValue":e[2]||(e[2]=o=>a.alipay.privateKey=o),type:"textarea",rows:3,placeholder:"请输入商户私钥"},null,8,["modelValue"])]),_:1}),l(n,{label:"支付宝公钥",prop:"alipay.publicKey"},{default:t(()=>[l(d,{modelValue:a.alipay.publicKey,"onUpdate:modelValue":e[3]||(e[3]=o=>a.alipay.publicKey=o),type:"textarea",rows:3,placeholder:"请输入支付宝公钥"},null,8,["modelValue"])]),_:1}),l(n,{label:"回调地址",prop:"alipay.notifyUrl"},{default:t(()=>[l(d,{modelValue:a.alipay.notifyUrl,"onUpdate:modelValue":e[4]||(e[4]=o=>a.alipay.notifyUrl=o),placeholder:"请输入支付回调地址"},null,8,["modelValue"])]),_:1}),l(p,{"content-position":"left"},{default:t(()=>e[20]||(e[20]=[r("微信支付配置")])),_:1}),l(n,{label:"微信支付状态",prop:"wechat.enabled"},{default:t(()=>[l(i,{modelValue:a.wechat.enabled,"onUpdate:modelValue":e[5]||(e[5]=o=>a.wechat.enabled=o)},null,8,["modelValue"])]),_:1}),l(n,{label:"商户号",prop:"wechat.mchId"},{default:t(()=>[l(d,{modelValue:a.wechat.mchId,"onUpdate:modelValue":e[6]||(e[6]=o=>a.wechat.mchId=o),placeholder:"请输入微信商户号"},null,8,["modelValue"])]),_:1}),l(n,{label:"AppID",prop:"wechat.appId"},{default:t(()=>[l(d,{modelValue:a.wechat.appId,"onUpdate:modelValue":e[7]||(e[7]=o=>a.wechat.appId=o),placeholder:"请输入微信AppID"},null,8,["modelValue"])]),_:1}),l(n,{label:"API密钥",prop:"wechat.apiKey"},{default:t(()=>[l(d,{modelValue:a.wechat.apiKey,"onUpdate:modelValue":e[8]||(e[8]=o=>a.wechat.apiKey=o),placeholder:"请输入API密钥"},null,8,["modelValue"])]),_:1}),l(n,{label:"回调地址",prop:"wechat.notifyUrl"},{default:t(()=>[l(d,{modelValue:a.wechat.notifyUrl,"onUpdate:modelValue":e[9]||(e[9]=o=>a.wechat.notifyUrl=o),placeholder:"请输入支付回调地址"},null,8,["modelValue"])]),_:1}),l(p,{"content-position":"left"},{default:t(()=>e[21]||(e[21]=[r("银行卡支付配置")])),_:1}),l(n,{label:"银行卡支付状态",prop:"bank.enabled"},{default:t(()=>[l(i,{modelValue:a.bank.enabled,"onUpdate:modelValue":e[10]||(e[10]=o=>a.bank.enabled=o)},null,8,["modelValue"])]),_:1}),l(n,{label:"商户号",prop:"bank.merchantId"},{default:t(()=>[l(d,{modelValue:a.bank.merchantId,"onUpdate:modelValue":e[11]||(e[11]=o=>a.bank.merchantId=o),placeholder:"请输入商户号"},null,8,["modelValue"])]),_:1}),l(n,{label:"API密钥",prop:"bank.apiKey"},{default:t(()=>[l(d,{modelValue:a.bank.apiKey,"onUpdate:modelValue":e[12]||(e[12]=o=>a.bank.apiKey=o),placeholder:"请输入API密钥"},null,8,["modelValue"])]),_:1}),l(n,{label:"回调地址",prop:"bank.notifyUrl"},{default:t(()=>[l(d,{modelValue:a.bank.notifyUrl,"onUpdate:modelValue":e[13]||(e[13]=o=>a.bank.notifyUrl=o),placeholder:"请输入支付回调地址"},null,8,["modelValue"])]),_:1}),l(p,{"content-position":"left"},{default:t(()=>e[22]||(e[22]=[r("通用配置")])),_:1}),l(n,{label:"支付超时时间",prop:"common.timeout"},{default:t(()=>[l(w,{modelValue:a.common.timeout,"onUpdate:modelValue":e[14]||(e[14]=o=>a.common.timeout=o),min:1,max:60,placeholder:"请输入支付超时时间(分钟)"},null,8,["modelValue"])]),_:1}),l(n,{label:"自动关闭订单",prop:"common.autoClose"},{default:t(()=>[l(i,{modelValue:a.common.autoClose,"onUpdate:modelValue":e[15]||(e[15]=o=>a.common.autoClose=o)},null,8,["modelValue"])]),_:1}),l(n,{label:"支付通知",prop:"common.notify"},{default:t(()=>[l(K,{modelValue:a.common.notify,"onUpdate:modelValue":e[16]||(e[16]=o=>a.common.notify=o)},{default:t(()=>[l(b,{label:"email"},{default:t(()=>e[23]||(e[23]=[r("邮件通知")])),_:1}),l(b,{label:"sms"},{default:t(()=>e[24]||(e[24]=[r("短信通知")])),_:1}),l(b,{label:"webhook"},{default:t(()=>e[25]||(e[25]=[r("Webhook通知")])),_:1})]),_:1},8,["modelValue"])]),_:1}),l(n,null,{default:t(()=>[l(f,{type:"primary",onClick:U},{default:t(()=>e[26]||(e[26]=[r("保存配置")])),_:1}),l(f,{onClick:k},{default:t(()=>e[27]||(e[27]=[r("测试配置")])),_:1})]),_:1})]),_:1},8,["model","rules"])]),_:1})])}}});const j=E(M,[["__scopeId","data-v-8d57d3ca"]]);export{j as default};
