(()=>{var a={};a.id=1219,a.ids=[1219],a.modules={2421:(a,b,c)=>{Promise.resolve().then(c.bind(c,31036))},3295:a=>{"use strict";a.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},8128:a=>{"use strict";a.exports=require("next/dist/server/runtime-reacts.external.js")},10846:a=>{"use strict";a.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},19121:a=>{"use strict";a.exports=require("next/dist/server/app-render/action-async-storage.external.js")},28354:a=>{"use strict";a.exports=require("util")},29294:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-async-storage.external.js")},31036:(a,b,c)=>{"use strict";c.r(b),c.d(b,{default:()=>d});let d=(0,c(77943).registerClientReference)(function(){throw Error("Attempted to call the default export of \"C:\\\\Users\\\\TuF\\\\Desktop\\\\tms\\\\tms\\\\app\\\\(dashboard)\\\\display\\\\page.js\" from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"C:\\Users\\TuF\\Desktop\\tms\\tms\\app\\(dashboard)\\display\\page.js","default")},33873:a=>{"use strict";a.exports=require("path")},38522:a=>{"use strict";a.exports=require("node:zlib")},41025:a=>{"use strict";a.exports=require("next/dist/server/app-render/dynamic-access-async-storage.external.js")},44277:(a,b,c)=>{Promise.resolve().then(c.bind(c,48690))},46060:a=>{"use strict";a.exports=require("next/dist/shared/lib/no-fallback-error.external.js")},48690:(a,b,c)=>{"use strict";c.r(b),c.d(b,{default:()=>l});var d=c(48249),e=c(67484),f=c(99959),g=c(61666),h=c(35107),i=c(62955);function j(a){return String(a??"").replace(/\d/g,a=>"۰۱۲۳۴۵۶۷۸۹"[a])}function k(a){return({truck:"کامیون",trailer:"تریلی",pickup:"وانت",van:"ون"})[a]||a||"—"}function l(){let[a,b]=(0,e.useState)([]),[c,l]=(0,e.useState)([]),[m,n]=(0,e.useState)(""),[o,p]=(0,e.useState)("");return(0,d.jsxs)("main",{className:"main-content display-page",children:[(0,d.jsx)("style",{children:`
                @media (min-width: 1100px) {
                    .display-grid.display-grid-drivers-first {
                        display: grid;
                        grid-template-columns: 2fr 1fr;
                        align-items: start;
                    }

                    .display-grid.display-grid-drivers-first > .display-panel {
                        min-width: 0;
                    }
                }

                .display-panel-drivers .display-driver-name strong {
                    font-size: 20px;
                }

                .display-panel-drivers .display-driver-badge {
                    font-size: 13px;
                }

                .display-panel-drivers .display-driver-phone {
                    font-size: 15px;
                }

                .display-panel-drivers .display-driver-vehicle {
                    font-size: 16px;
                }

                .display-panel-drivers .display-driver-avatar {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    width: 52px;
                    height: 52px;
                    font-size: 24px;
                    font-weight: 800;
                }

                .display-panel-drivers .display-driver-item {
                    padding-top: 20px;
                    padding-bottom: 20px;
                }

                /* بارها: متن درشت‌تر برای نمایش روی تلویزیون */

                .display-panel-loads .display-item-title strong {
                    font-size: 22px;
                }

                .display-panel-loads .display-item-title span {
                    font-size: 14px;
                }

                .display-panel-loads .display-company {
                    font-size: 17px;
                }

                .display-panel-loads .display-route {
                    font-size: 18px;
                }

                .display-panel-loads .display-load-meta {
                    font-size: 16px;
                }

                .display-panel-loads .display-load-status {
                    font-size: 16px;
                }

                .display-panel-loads .display-item-icon svg,
                .display-panel-loads .display-load-meta svg {
                    width: 22px;
                    height: 22px;
                }

                .display-panel-loads .display-load-item {
                    padding-top: 20px;
                    padding-bottom: 20px;
                }
            `}),(0,d.jsxs)("div",{className:"display-grid display-grid-drivers-first",children:[(0,d.jsxs)("section",{className:"display-panel display-panel-drivers",children:[(0,d.jsxs)("div",{className:"display-panel-header",children:[(0,d.jsxs)("div",{className:"display-panel-title",children:[(0,d.jsx)("div",{className:"display-panel-icon display-panel-blue",children:(0,d.jsx)(f.A,{size:21})}),(0,d.jsxs)("div",{children:[(0,d.jsx)("h2",{children:"رانندگان امروز"}),(0,d.jsx)("p",{children:"رانندگان ثبت‌شده در ورود روزانه امروز"})]})]}),(0,d.jsxs)("span",{className:"display-count blue",children:[j(a.length)," راننده"]})]}),(0,d.jsx)("div",{className:"display-list",children:a.map((a,b)=>{let c="guest"===a.type,e=a.driverId&&"object"==typeof a.driverId?a.driverId:null;return(0,d.jsxs)("div",{className:"display-driver-item",children:[(0,d.jsxs)("div",{className:"display-driver-main",children:[(0,d.jsx)("div",{className:"display-driver-avatar",children:j(b+1)}),(0,d.jsxs)("div",{className:"display-driver-info",children:[(0,d.jsxs)("div",{className:"display-driver-name",children:[(0,d.jsx)("strong",{children:a.name}),(0,d.jsx)("span",{className:c?"display-driver-badge guest":"display-driver-badge",children:c?"مهمان":"اصلی"})]}),(0,d.jsx)("span",{className:"display-driver-phone",children:a.phone||"—"})]})]}),(0,d.jsxs)("div",{className:"display-driver-vehicle",children:[(0,d.jsx)(g.A,{size:20}),(0,d.jsx)("span",{children:k(a.vehicleType||e?.vehicleType)})]})]},a._id)})}),0===a.length&&(0,d.jsxs)("div",{className:"display-empty",children:[(0,d.jsx)(f.A,{size:30}),(0,d.jsx)("strong",{children:"امروز راننده‌ای ثبت نشده"}),(0,d.jsx)("span",{children:"از بخش ورود روزانه رانندگان، راننده ثبت کنید."})]})]}),(0,d.jsxs)("section",{className:"display-panel display-panel-loads",children:[(0,d.jsxs)("div",{className:"display-panel-header",children:[(0,d.jsxs)("div",{className:"display-panel-title",children:[(0,d.jsx)("div",{className:"display-panel-icon display-panel-orange",children:(0,d.jsx)(h.A,{size:21})}),(0,d.jsxs)("div",{children:[(0,d.jsx)("h2",{children:"بارها"}),(0,d.jsx)("p",{children:"لیست بارهای ثبت‌شده در سیستم"})]})]}),(0,d.jsxs)("span",{className:"display-count orange",children:[j(c.length)," بار"]})]}),(0,d.jsx)("div",{className:"display-list",children:c.map(a=>{let b="delivered"===a.status?{label:"تحویل شده",className:"delivered"}:{label:"تحویل نشده",className:"undelivered"};return(0,d.jsxs)("div",{className:"display-load-item",children:[(0,d.jsxs)("div",{className:"display-item-main",children:[(0,d.jsx)("div",{className:"display-item-icon load",children:(0,d.jsx)(h.A,{size:19})}),(0,d.jsxs)("div",{className:"display-item-info",children:[(0,d.jsxs)("div",{className:"display-item-title",children:[(0,d.jsx)("strong",{children:a.title||"بدون عنوان"}),(0,d.jsx)("span",{children:a.loadId||"—"})]}),(0,d.jsx)("span",{className:"display-company",children:a.companyName||a.company?.name||"—"}),(0,d.jsxs)("div",{className:"display-route",children:[(0,d.jsx)("span",{children:a.origin||"—"}),(0,d.jsx)("span",{className:"route-arrow",children:"←"}),(0,d.jsx)("span",{children:a.destination||"—"})]})]})]}),(0,d.jsxs)("div",{className:"display-load-meta",children:[(0,d.jsxs)("div",{children:[(0,d.jsx)(g.A,{size:15}),(0,d.jsx)("span",{children:k(a.vehicleType)})]}),(0,d.jsxs)("div",{children:[(0,d.jsx)(i.A,{size:15}),(0,d.jsx)("span",{className:"delivered"===b.className?"display-load-status delivered":"display-load-status",children:b.label})]})]})]},a._id||a.loadId)})}),0===c.length&&(0,d.jsxs)("div",{className:"display-empty",children:[(0,d.jsx)(h.A,{size:30}),(0,d.jsx)("strong",{children:"باری ثبت نشده است"}),(0,d.jsx)("span",{children:"هنوز هیچ باری در سیستم ثبت نشده است."})]})]})]})]})}},61666:(a,b,c)=>{"use strict";c.d(b,{A:()=>f});var d=c(89950);let e={name:"truck",size:24,node:[["path",{d:"M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2",key:"wrbu53"}],["path",{d:"M15 18H9",key:"1lyqi6"}],["path",{d:"M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14",key:"lysw3i"}],["circle",{cx:"17",cy:"18",r:"2",key:"332jqn"}],["circle",{cx:"7",cy:"18",r:"2",key:"19iecd"}]]};e.node;let f=(0,d.A)(e)},62955:(a,b,c)=>{"use strict";c.d(b,{A:()=>f});var d=c(89950);let e={name:"map-pin",size:24,node:[["path",{d:"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",key:"1r0f0z"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}]]};e.node;let f=(0,d.A)(e)},63033:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},93402:(a,b,c)=>{"use strict";c.r(b),c.d(b,{__next_app__:()=>v,handler:()=>x,routeModule:()=>w});var d=c(21635),e=c(86315),f=c(1020),g=c(61287),h={};for(let a in g)0>["default","__next_app__","routeModule","handler"].indexOf(a)&&(h[a]=()=>g[a]);c.d(b,h);let i=(0,d.p)(()=>Promise.resolve().then(c.bind(c,39450))),j=(0,d.p)(()=>Promise.resolve().then(c.t.bind(c,95547,23))),k=(0,d.p)(()=>Promise.resolve().then(c.t.bind(c,55091,23))),l=(0,d.p)(()=>Promise.resolve().then(c.t.bind(c,45270,23))),m=(0,d.p)(()=>Promise.resolve().then(c.t.bind(c,28193,23))),n=(0,d.p)(()=>Promise.resolve().then(c.bind(c,86918))),o=(0,d.p)(()=>Promise.resolve().then(c.t.bind(c,95547,23))),p=(0,d.p)(()=>Promise.resolve().then(c.t.bind(c,55091,23))),q=(0,d.p)(()=>Promise.resolve().then(c.t.bind(c,45270,23))),r=(0,d.p)(()=>Promise.resolve().then(c.t.bind(c,28193,23))),s=(0,d.p)(()=>Promise.resolve().then(c.t.bind(c,95547,23))),t={children:["",{children:["(dashboard)",{children:["display",{children:["__PAGE__",{},{page:[(0,d.p)(()=>Promise.resolve().then(c.bind(c,31036))),"C:\\Users\\TuF\\Desktop\\tms\\tms\\app\\(dashboard)\\display\\page.js"]}]},{"global-error":[s,"next/dist/client/components/builtin/global-error.js"]},[]]},{layout:[n,"C:\\Users\\TuF\\Desktop\\tms\\tms\\app\\(dashboard)\\layout.js"],"global-error":[o,"next/dist/client/components/builtin/global-error.js"],"not-found":[p,"next/dist/client/components/builtin/not-found.js"],forbidden:[q,"next/dist/client/components/builtin/forbidden.js"],unauthorized:[r,"next/dist/client/components/builtin/unauthorized.js"],metadata:{icon:[async a=>(await (0,d.p)(()=>Promise.resolve().then(c.bind(c,46055)))()).default(a)],apple:[],openGraph:[],twitter:[],manifest:void 0}},[]]},{layout:[i,"C:\\Users\\TuF\\Desktop\\tms\\tms\\app\\layout.js"],"global-error":[j,"next/dist/client/components/builtin/global-error.js"],"not-found":[k,"next/dist/client/components/builtin/not-found.js"],forbidden:[l,"next/dist/client/components/builtin/forbidden.js"],unauthorized:[m,"next/dist/client/components/builtin/unauthorized.js"],metadata:{icon:[async a=>(await (0,d.p)(()=>Promise.resolve().then(c.bind(c,46055)))()).default(a)],apple:[],openGraph:[],twitter:[],manifest:void 0}},[]]}.children,u=(0,e.H)({tree:t,page:"/(dashboard)/display/page",pathname:"/display",require:c,loadChunk:()=>Promise.resolve(),interopDefault:f.T}),v=u.__next_app__,w=u.routeModule,x=u.handler}};var b=require("../../../webpack-runtime.js");b.C(a);var c=b.X(0,[4741,2430,6138,7844],()=>b(b.s=93402));module.exports=c})();