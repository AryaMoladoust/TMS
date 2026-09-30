(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[1219],{11494:(e,i,s)=>{"use strict";s.d(i,{A:()=>l});var a=s(91770);let t={name:"map-pin",size:24,node:[["path",{d:"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",key:"1r0f0z"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}]]};t.node;let l=(0,a.A)(t)},33783:(e,i,s)=>{"use strict";s.r(i),s.d(i,{default:()=>p});var a=s(95155),t=s(12115),l=s(37450),r=s(78063),d=s(77782),n=s(11494);function c(e){return String(e??"").replace(/\d/g,e=>"۰۱۲۳۴۵۶۷۸۹"[e])}function o(e){return({truck:"کامیون",trailer:"تریلی",pickup:"وانت",van:"ون"})[e]||e||"—"}function p(){let[e,i]=(0,t.useState)([]),[s,p]=(0,t.useState)([]),[h,y]=(0,t.useState)(""),[m,u]=(0,t.useState)("");async function v(){try{let e,s,a,t,[l,r]=await Promise.all([fetch(`/api/daily-drivers?date=${(s=(e=new Date).getFullYear(),a=String(e.getMonth()+1).padStart(2,"0"),t=String(e.getDate()).padStart(2,"0"),`${s}-${a}-${t}`)}`,{cache:"no-store"}),fetch("/api/loads",{cache:"no-store"})]);if(l.ok){let e=await l.json(),s=[...Array.isArray(e)?e:Array.isArray(e.dailyDrivers)?e.dailyDrivers:[]].sort((e,i)=>{let s=new Date(e.createdAt||0).getTime(),a=new Date(i.createdAt||0).getTime();return s-a});i(s)}if(r.ok){let e=await r.json(),i=[...Array.isArray(e)?e:Array.isArray(e.loads)?e.loads:[]].sort((e,i)=>{let s="delivered"===e.status,a="delivered"===i.status;if(s!==a)return s?1:-1;let t=new Date(e.createdAt||0).getTime();return new Date(i.createdAt||0).getTime()-t});p(i)}u(new Date().toLocaleTimeString("fa-IR",{hour:"2-digit",minute:"2-digit",second:"2-digit"}))}catch(e){console.error("Display data error:",e)}}return(0,t.useEffect)(()=>{let e=()=>{let e=new Date;y(e.toLocaleDateString("fa-IR")),u(e.toLocaleTimeString("fa-IR",{hour:"2-digit",minute:"2-digit",second:"2-digit"}))};e(),v();let i=setInterval(e,1e3),s=setInterval(v,5e3);return()=>{clearInterval(i),clearInterval(s)}},[]),(0,a.jsxs)("main",{className:"main-content display-page",children:[(0,a.jsx)("style",{children:`
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
            `}),(0,a.jsxs)("div",{className:"display-grid display-grid-drivers-first",children:[(0,a.jsxs)("section",{className:"display-panel display-panel-drivers",children:[(0,a.jsxs)("div",{className:"display-panel-header",children:[(0,a.jsxs)("div",{className:"display-panel-title",children:[(0,a.jsx)("div",{className:"display-panel-icon display-panel-blue",children:(0,a.jsx)(l.A,{size:21})}),(0,a.jsxs)("div",{children:[(0,a.jsx)("h2",{children:"رانندگان امروز"}),(0,a.jsx)("p",{children:"رانندگان ثبت‌شده در ورود روزانه امروز"})]})]}),(0,a.jsxs)("span",{className:"display-count blue",children:[c(e.length)," راننده"]})]}),(0,a.jsx)("div",{className:"display-list",children:e.map((e,i)=>{let s="guest"===e.type,t=e.driverId&&"object"==typeof e.driverId?e.driverId:null;return(0,a.jsxs)("div",{className:"display-driver-item",children:[(0,a.jsxs)("div",{className:"display-driver-main",children:[(0,a.jsx)("div",{className:"display-driver-avatar",children:c(i+1)}),(0,a.jsxs)("div",{className:"display-driver-info",children:[(0,a.jsxs)("div",{className:"display-driver-name",children:[(0,a.jsx)("strong",{children:e.name}),(0,a.jsx)("span",{className:s?"display-driver-badge guest":"display-driver-badge",children:s?"مهمان":"اصلی"})]}),(0,a.jsx)("span",{className:"display-driver-phone",children:e.phone||"—"})]})]}),(0,a.jsxs)("div",{className:"display-driver-vehicle",children:[(0,a.jsx)(r.A,{size:20}),(0,a.jsx)("span",{children:o(e.vehicleType||t?.vehicleType)})]})]},e._id)})}),0===e.length&&(0,a.jsxs)("div",{className:"display-empty",children:[(0,a.jsx)(l.A,{size:30}),(0,a.jsx)("strong",{children:"امروز راننده‌ای ثبت نشده"}),(0,a.jsx)("span",{children:"از بخش ورود روزانه رانندگان، راننده ثبت کنید."})]})]}),(0,a.jsxs)("section",{className:"display-panel display-panel-loads",children:[(0,a.jsxs)("div",{className:"display-panel-header",children:[(0,a.jsxs)("div",{className:"display-panel-title",children:[(0,a.jsx)("div",{className:"display-panel-icon display-panel-orange",children:(0,a.jsx)(d.A,{size:21})}),(0,a.jsxs)("div",{children:[(0,a.jsx)("h2",{children:"بارها"}),(0,a.jsx)("p",{children:"لیست بارهای ثبت‌شده در سیستم"})]})]}),(0,a.jsxs)("span",{className:"display-count orange",children:[c(s.length)," بار"]})]}),(0,a.jsx)("div",{className:"display-list",children:s.map(e=>{let i="delivered"===e.status?{label:"تحویل شده",className:"delivered"}:{label:"تحویل نشده",className:"undelivered"};return(0,a.jsxs)("div",{className:"display-load-item",children:[(0,a.jsxs)("div",{className:"display-item-main",children:[(0,a.jsx)("div",{className:"display-item-icon load",children:(0,a.jsx)(d.A,{size:19})}),(0,a.jsxs)("div",{className:"display-item-info",children:[(0,a.jsxs)("div",{className:"display-item-title",children:[(0,a.jsx)("strong",{children:e.title||"بدون عنوان"}),(0,a.jsx)("span",{children:e.loadId||"—"})]}),(0,a.jsx)("span",{className:"display-company",children:e.companyName||e.company?.name||"—"}),(0,a.jsxs)("div",{className:"display-route",children:[(0,a.jsx)("span",{children:e.origin||"—"}),(0,a.jsx)("span",{className:"route-arrow",children:"←"}),(0,a.jsx)("span",{children:e.destination||"—"})]})]})]}),(0,a.jsxs)("div",{className:"display-load-meta",children:[(0,a.jsxs)("div",{children:[(0,a.jsx)(r.A,{size:15}),(0,a.jsx)("span",{children:o(e.vehicleType)})]}),(0,a.jsxs)("div",{children:[(0,a.jsx)(n.A,{size:15}),(0,a.jsx)("span",{className:"delivered"===i.className?"display-load-status delivered":"display-load-status",children:i.label})]})]})]},e._id||e.loadId)})}),0===s.length&&(0,a.jsxs)("div",{className:"display-empty",children:[(0,a.jsx)(d.A,{size:30}),(0,a.jsx)("strong",{children:"باری ثبت نشده است"}),(0,a.jsx)("span",{children:"هنوز هیچ باری در سیستم ثبت نشده است."})]})]})]})]})}},37450:(e,i,s)=>{"use strict";s.d(i,{A:()=>l});var a=s(91770);let t={name:"user-check",size:24,node:[["path",{d:"m16 11 2 2 4-4",key:"9rsbq5"}],["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}]]};t.node;let l=(0,a.A)(t)},58851:(e,i,s)=>{Promise.resolve().then(s.bind(s,33783))},75416:(e,i,s)=>{"use strict";s.d(i,{default:()=>d});var a=s(12115);let t=(...e)=>e.filter((e,i,s)=>!!e&&""!==e.trim()&&s.indexOf(e)===i).join(" ").trim(),l={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"},r=(0,a.createContext)({}),d=(0,a.forwardRef)(({color:e,size:i,width:s,height:d,strokeWidth:n,absoluteStrokeWidth:c,nonScalingStroke:o,className:p="",children:h,iconNode:y=[],icon:m={node:y,aliases:[],size:24},...u},v)=>{let{size:x=24,strokeWidth:g=2,absoluteStrokeWidth:f=!1,nonScalingStroke:j=!1,color:N="currentColor",className:k=""}=(0,a.useContext)(r)??{},w=!!h||(e=>{for(let i in e)if(i.startsWith("aria-")||"role"===i||"title"===i)return!0;return!1})(u),[A,z,b=[]]=function(e,i={}){return function(e,i={}){let s=i.attributeNames??{},a=e=>s[e]??e,r=e.size??e.width??l.width,d=e.size??e.height??l.height,n=e.aliases?.filter(e=>"string"==typeof e&&""!==e.trim()).map(e=>`lucide-${e}`)??[],c=[...e.name?[`lucide-${e.name}`]:[],...n],o=i.className?.split(" ").filter(Boolean)??[],p=!1===i.includeDefaultClasses?t(...o):t("lucide",...c,...o),h=i.absoluteStrokeWidth?Number(i.strokeWidth??l["stroke-width"])*Number(e.size??e.width??l.width)/Number(i.size??i.width??l.width):i.strokeWidth??l["stroke-width"];return["svg",{...Object.entries(l).reduce((e,[i,s])=>(e[a(i)]=s,e),{}),..."color"in i&&i.color&&{[a("stroke")]:i.color},..."size"in i&&null!=i.size&&{[a("width")]:i.size,[a("height")]:i.size},..."width"in i&&null!=i.width&&{[a("width")]:i.width},..."height"in i&&null!=i.height&&{[a("height")]:i.height},[a("stroke-width")]:h,...p&&{[a("class")]:p},[a("viewBox")]:`0 0 ${r} ${d}`,...!1===i.hasA11yProp?{[a("aria-hidden")]:"true"}:{},..."attributes"in i&&i.attributes},e.node.map(e=>{let[s,t,l]=e,r=i.nonScalingStroke?{[a("vector-effect")]:"non-scaling-stroke",...t}:t;return l?[s,r,l]:[s,r]})]}(e,{...i,attributeNames:{...i.attributeNames,class:"className","stroke-width":"strokeWidth","stroke-linecap":"strokeLinecap","stroke-linejoin":"strokeLinejoin","vector-effect":"vectorEffect"}})}(m,{color:e??N,width:s??i??x,height:d??i??x,strokeWidth:n??g,absoluteStrokeWidth:c??f,nonScalingStroke:o??j,className:t(k,p),hasA11yProp:w,attributes:u});return(0,a.createElement)(A,{ref:v,...z},[...b.map(([e,i])=>(0,a.createElement)(e,i)),...Array.isArray(h)?h:[h]])})},77782:(e,i,s)=>{"use strict";s.d(i,{A:()=>l});var a=s(91770);let t={name:"package",size:24,node:[["path",{d:"M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z",key:"1a0edw"}],["path",{d:"M12 22V12",key:"d0xqtd"}],["polyline",{points:"3.29 7 12 12 20.71 7",key:"ousv84"}],["path",{d:"m7.5 4.27 9 5.15",key:"1c824w"}]]};t.node;let l=(0,a.A)(t)},78063:(e,i,s)=>{"use strict";s.d(i,{A:()=>l});var a=s(91770);let t={name:"truck",size:24,node:[["path",{d:"M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2",key:"wrbu53"}],["path",{d:"M15 18H9",key:"1lyqi6"}],["path",{d:"M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14",key:"lysw3i"}],["circle",{cx:"17",cy:"18",r:"2",key:"332jqn"}],["circle",{cx:"7",cy:"18",r:"2",key:"19iecd"}]]};t.node;let l=(0,a.A)(t)},91770:(e,i,s)=>{"use strict";s.d(i,{A:()=>l});var a=s(12115),t=s(75416);function l(e,i=[],s=[]){let r,d="string"==typeof e?function(e,i,s=[]){if(null==i)throw Error("[lucide]: iconNode is required when icon name is used");return{name:e?.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),size:24,node:i,...s.length>0?{aliases:s}:{}}}(e,i,s):e,n=(0,a.forwardRef)(({className:e,...i},s)=>(0,a.createElement)(t.default,{ref:s,icon:d,className:e,...i}));return d.name&&(n.displayName=(r=(e=>{let i="",s=!1;for(let a of e){if("-"===a||"_"===a||a<=" "){s=i.length>0;continue}0===i.length?i+=a.toLowerCase():i+=s?a.toUpperCase():a,s=!1}return i})(d.name)).charAt(0).toUpperCase()+r.slice(1)),n}}},e=>{e.O(0,[8441,4398,7358],()=>e(e.s=58851)),_N_E=e.O()}]);