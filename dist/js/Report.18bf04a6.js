(self["webpackChunkstraight"]=self["webpackChunkstraight"]||[]).push([[392],{7279:function(e,t,r){"use strict";r.r(t),r.d(t,{default:function(){return D}});r(8309);var n=r(5166),a=(0,n.withScopeId)("data-v-3b137306");(0,n.pushScopeId)("data-v-3b137306");var o={class:"page"},c={class:"box"},i={class:"form"},l=(0,n.createTextVNode)("搜索"),u={class:"box"},d={class:"chart"},s={class:"pie_charts",ref:"pie_charts"},p={class:"knowledege"},f=(0,n.createTextVNode)("知识点分析"),h={class:"left"},m={class:"right"},g={class:"box"},v={key:0,class:"question"},b={class:"list"},k={class:"ord"},y={class:"content"},V={class:"pagination"};(0,n.popScopeId)();var w=a((function(e,t,r,_,w,N){var j=(0,n.resolveComponent)("el-option"),B=(0,n.resolveComponent)("el-select"),O=(0,n.resolveComponent)("el-form-item"),C=(0,n.resolveComponent)("el-date-picker"),x=(0,n.resolveComponent)("el-button"),E=(0,n.resolveComponent)("el-form"),S=(0,n.resolveComponent)("el-progress"),P=(0,n.resolveComponent)("el-scrollbar"),R=(0,n.resolveComponent)("el-pagination"),D=(0,n.resolveComponent)("el-empty");return(0,n.openBlock)(),(0,n.createBlock)("div",o,[(0,n.createVNode)("div",c,[(0,n.createVNode)("div",i,[(0,n.createVNode)(E,{model:e.search_data,inline:""},{default:a((function(){return[(0,n.createVNode)(O,{prop:"grade_id"},{default:a((function(){return[(0,n.createVNode)(B,{modelValue:e.search_data.team_id,"onUpdate:modelValue":t[1]||(t[1]=function(t){return e.search_data.team_id=t}),placeholder:"选择班级",clearable:""},{default:a((function(){return[((0,n.openBlock)(!0),(0,n.createBlock)(n.Fragment,null,(0,n.renderList)(e.condition_data.team,(function(e,t){return(0,n.openBlock)(),(0,n.createBlock)(j,{key:t,label:e.name,value:e.id},null,8,["label","value"])})),128))]})),_:1},8,["modelValue"])]})),_:1}),(0,n.createVNode)(O,{prop:"subject_id"},{default:a((function(){return[(0,n.createVNode)(B,{modelValue:e.search_data.subject_id,"onUpdate:modelValue":t[2]||(t[2]=function(t){return e.search_data.subject_id=t}),placeholder:"选择科目",clearable:""},{default:a((function(){return[((0,n.openBlock)(!0),(0,n.createBlock)(n.Fragment,null,(0,n.renderList)(e.condition_data.subject,(function(e,t){return(0,n.openBlock)(),(0,n.createBlock)(j,{key:t,label:e.title,value:e.id},null,8,["label","value"])})),128))]})),_:1},8,["modelValue"])]})),_:1}),(0,n.createVNode)(O,{prop:"student_id"},{default:a((function(){return[(0,n.createVNode)(B,{modelValue:e.search_data.student_id,"onUpdate:modelValue":t[3]||(t[3]=function(t){return e.search_data.student_id=t}),placeholder:"选择学生",clearable:""},{default:a((function(){return[((0,n.openBlock)(!0),(0,n.createBlock)(n.Fragment,null,(0,n.renderList)(e.condition_data.student,(function(e,t){return(0,n.openBlock)(),(0,n.createBlock)(j,{key:t,label:e.name,value:e.id},null,8,["label","value"])})),128))]})),_:1},8,["modelValue"])]})),_:1}),(0,n.createVNode)(O,{prop:"date_range"},{default:a((function(){return[(0,n.createVNode)(C,{modelValue:e.search_data.date_range,"onUpdate:modelValue":t[4]||(t[4]=function(t){return e.search_data.date_range=t}),type:"daterange","range-separator":"-","start-placeholder":"开始日期","end-placeholder":"结束日期"},null,8,["modelValue"])]})),_:1}),(0,n.createVNode)(O,null,{default:a((function(){return[(0,n.createVNode)(x,{type:"primary",onClick:_.doSearch},{default:a((function(){return[l]})),_:1},8,["onClick"])]})),_:1})]})),_:1},8,["model"])])]),(0,n.createVNode)("div",u,[(0,n.createVNode)("div",d,[(0,n.createVNode)("div",s,null,512)]),(0,n.createVNode)("div",p,[(0,n.createVNode)("h4",null,[f,(0,n.createVNode)("span",null,"共收录"+(0,n.toDisplayString)(e.count)+"道错题",1)]),(0,n.createVNode)(P,{style:{height:"100%"}},{default:a((function(){return[(0,n.createVNode)("ul",null,[((0,n.openBlock)(!0),(0,n.createBlock)(n.Fragment,null,(0,n.renderList)(e.knowledge,(function(e,t){return(0,n.openBlock)(),(0,n.createBlock)("li",{key:t},[(0,n.createVNode)("div",h,[(0,n.createVNode)("h5",null,(0,n.toDisplayString)(e.name),1),(0,n.createVNode)(S,{percentage:100*e.rate,color:e.color},null,8,["percentage","color"])]),(0,n.createVNode)("div",m,(0,n.toDisplayString)(e.count)+"道题",1)])})),128))])]})),_:1})])]),(0,n.createVNode)("div",g,[e.count>0?((0,n.openBlock)(),(0,n.createBlock)("div",v,[(0,n.createVNode)("div",b,[((0,n.openBlock)(!0),(0,n.createBlock)(n.Fragment,null,(0,n.renderList)(e.list,(function(e,t){return(0,n.openBlock)(),(0,n.createBlock)("div",{class:"item",key:t},[(0,n.createVNode)("div",k,(0,n.toDisplayString)(t+1)+".",1),(0,n.createVNode)("div",y,[(0,n.createVNode)("div",{innerHTML:e.content_all},null,8,["innerHTML"])])])})),128))]),(0,n.createVNode)("div",V,[(0,n.createVNode)(R,{onCurrentChange:_.handleCurrentChange,"current-page":e.page,"page-size":e.limit,layout:"prev, pager, next,jumper",total:e.count},null,8,["onCurrentChange","current-page","page-size","total"])])])):((0,n.openBlock)(),(0,n.createBlock)(D,{key:1,description:"未找到数据"}))])])})),N=(r(1249),r(4624)),j=(r(5666),r(7171)),B=(r(5266),r(2119)),O=(r(4438),r(6564)),C=r(1984);r(129);function x(e){return(0,C.W)({url:"/ins/Report/getCondition",params:e})}function E(e){return(0,C.W)({url:"/ins/Report/index",params:e})}function S(e){return(0,C.W)({url:"/ins/Report/getQuestionList",params:e})}var P=r(4736),R={components:{},props:{},setup:function(e,t){(0,B.tv)(),(0,B.yj)(),(0,O.oR)();var r=(0,n.reactive)({search_data:{team_id:"",subject_id:"",student_id:"",date_range:""},condition_data:{team:[],subject:[],student:[]},pie_charts:(0,n.ref)(),pie_charts_now:null,options:{title:{text:"错题报告数据"},tooltip:{trigger:"item",formatter:"{a} <br/>{b} : {c} ({d}%)"},legend:{orient:"vertical",right:"right",data:["直接访问","邮件营销","联盟广告","视频广告","搜索引擎"]},series:[{name:"错题占比",type:"pie",radius:"55%",center:["50%","60%"],data:[{value:335,name:"直接访问"},{value:310,name:"邮件营销"},{value:234,name:"联盟广告"},{value:135,name:"视频广告"},{value:1548,name:"搜索引擎"}],emphasis:{itemStyle:{shadowBlur:10,shadowOffsetX:0,shadowColor:"rgba(0, 0, 0, 0.5)"}}}]},knowledge:[],page:1,count:0,limit:20,list:[]});(0,n.onMounted)((function(){a(),c(),o()}));var a=function(){var e=(0,j.Z)(regeneratorRuntime.mark((function e(){var t,n,a;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,x();case 2:t=e.sent,n=t.code,a=t.data,n||(r.condition_data.team=a.team,r.condition_data.subject=a.subject,r.condition_data.student=a.student);case 6:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),o=function(){var e=(0,j.Z)(regeneratorRuntime.mark((function e(){var t,n,a,o;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return t={team_id:r.search_data.team_id,subject_id:r.search_data.subject_id,student_id:r.search_data.student_id},_.isArray(r.search_data.date_range)&&(t.start_time=(0,P.EK)(r.search_data.date_range[0]),t.end_time=(0,P.EK)(r.search_data.date_range[1])),e.next=4,E(t);case 4:return n=e.sent,a=n.code,o=n.data,a||(r.knowledge=o.knowledge.map((function(e){return(0,N.Z)({color:(0,P.Us)()},e)})),r.count=o.count,r.pie_charts_now=window.echarts.init(r.pie_charts),r.options.title.text=o.title,r.options.legend.data=o.xAxis,r.options.series[0].data=o.yAxis,r.pie_charts_now.setOption(r.options,!0)),e.next=10,c();case 10:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),c=function(){var e=(0,j.Z)(regeneratorRuntime.mark((function e(){var t,n,a,o;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return t={page:r.page,limit:r.limit,team_id:r.search_data.team_id,subject_id:r.search_data.subject_id,student_id:r.search_data.student_id},_.isArray(r.search_data.date_range)&&(t.start_time=(0,P.EK)(r.search_data.date_range[0]),t.end_time=(0,P.EK)(r.search_data.date_range[1])),e.next=4,S(t);case 4:n=e.sent,a=n.code,o=n.data,a||(r.list=o.list,r.count=o.count);case 8:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),i=_.debounce((function(e){r.page=e,c()}),300);return(0,N.Z)((0,N.Z)({},(0,n.toRefs)(r)),{},{doSearch:o,handleCurrentChange:i})}};R.render=w,R.__scopeId="data-v-3b137306";var D=R},8533:function(e,t,r){"use strict";var n=r(2092).forEach,a=r(9341),o=r(9207),c=a("forEach"),i=o("forEach");e.exports=c&&i?[].forEach:function(e){return n(this,e,arguments.length>1?arguments[1]:void 0)}},9554:function(e,t,r){"use strict";var n=r(2109),a=r(8533);n({target:"Array",proto:!0,forced:[].forEach!=a},{forEach:a})},1249:function(e,t,r){"use strict";var n=r(2109),a=r(2092).map,o=r(1194),c=r(9207),i=o("map"),l=c("map");n({target:"Array",proto:!0,forced:!i||!l},{map:function(e){return a(this,e,arguments.length>1?arguments[1]:void 0)}})},8309:function(e,t,r){var n=r(9781),a=r(3070).f,o=Function.prototype,c=o.toString,i=/^\s*function ([^ (]*)/,l="name";n&&!(l in o)&&a(o,l,{configurable:!0,get:function(){try{return c.call(this).match(i)[1]}catch(e){return""}}})},5003:function(e,t,r){var n=r(2109),a=r(7293),o=r(5656),c=r(1236).f,i=r(9781),l=a((function(){c(1)})),u=!i||l;n({target:"Object",stat:!0,forced:u,sham:!i},{getOwnPropertyDescriptor:function(e,t){return c(o(e),t)}})},9337:function(e,t,r){var n=r(2109),a=r(9781),o=r(3887),c=r(5656),i=r(1236),l=r(6135);n({target:"Object",stat:!0,sham:!a},{getOwnPropertyDescriptors:function(e){var t,r,n=c(e),a=i.f,u=o(n),d={},s=0;while(u.length>s)r=a(n,t=u[s++]),void 0!==r&&l(d,t,r);return d}})},7941:function(e,t,r){var n=r(2109),a=r(7908),o=r(1956),c=r(7293),i=c((function(){o(1)}));n({target:"Object",stat:!0,forced:i},{keys:function(e){return o(a(e))}})},4747:function(e,t,r){var n=r(7854),a=r(8324),o=r(8533),c=r(8880);for(var i in a){var l=n[i],u=l&&l.prototype;if(u&&u.forEach!==o)try{c(u,"forEach",o)}catch(d){u.forEach=o}}},4624:function(e,t,r){"use strict";r.d(t,{Z:function(){return o}});r(2526),r(7327),r(9554),r(5003),r(9337),r(7941),r(4747);function n(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function o(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){n(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}}}]);