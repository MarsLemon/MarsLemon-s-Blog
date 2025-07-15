(()=>{var e={};e.id=758,e.ids=[758],e.modules={3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},10762:e=>{"use strict";e.exports=import("@neondatabase/serverless")},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},24467:()=>{},26418:(e,t,a)=>{"use strict";a.a(e,async(e,r)=>{try{a.d(t,{FH:()=>p,JE:()=>_,ME:()=>v,OJ:()=>w,aN:()=>E,ht:()=>m,jw:()=>h,kg:()=>c});var s=a(58617),n=a(62462),i=a(55511),u=a.n(i),o=e([n]);async function l(e){return s.Ay.hash(e,12)}async function d(e,t){return s.Ay.compare(e,t)}async function c(e,t,a){let r=await l(a),s=u().randomBytes(32).toString("hex");return(await (0,n.l)`
    INSERT INTO users (username, email, password_hash, verification_token)
    VALUES (${e}, ${t}, ${r}, ${s})
    RETURNING id, username, email, avatar_url, is_admin, is_verified, created_at
  `)[0]}async function p(e,t){let a=await (0,n.l)`
    SELECT id, username, email, password_hash, avatar_url, is_admin, is_verified, created_at
    FROM users
    WHERE (email = ${e} OR username = ${e}) AND is_verified = true
  `;if(a?.length===0)return null;let r=a[0];return await d(t,r.password_hash)?{id:r.id,username:r.username,email:r.email,avatar_url:r.avatar_url,is_admin:r.is_admin,is_verified:r.is_verified,created_at:r.created_at}:null}async function m(e){let t=await (0,n.l)`
    SELECT id, username, email, avatar_url, is_admin, is_verified, created_at
    FROM users
    WHERE email = ${e}
  `;return t?.length>0?t[0]:null}async function _(e){let t=await (0,n.l)`
    SELECT id, username, email, avatar_url, is_admin, is_verified, created_at
    FROM users
    WHERE username = ${e}
  `;return t?.length>0?t[0]:null}async function h(e){let t=u().randomBytes(32).toString("hex"),a=new Date(Date.now()+6048e5);return await (0,n.l)`
    INSERT INTO sessions (user_id, session_token, expires_at)
    VALUES (${e}, ${t}, ${a})
  `,t}async function E(e){let t=await (0,n.l)`
    SELECT u.id, u.username, u.email, u.avatar_url, u.is_admin, u.is_verified, u.created_at
    FROM users u
    JOIN sessions s ON u.id = s.user_id
    WHERE s.session_token = ${e} AND s.expires_at > NOW()
  `;return t?.length>0?t[0]:null}async function v(e){await (0,n.l)`DELETE FROM sessions WHERE session_token = ${e}`}async function w(e,t){await (0,n.l)`
    UPDATE users
    SET avatar_url = ${t}, updated_at = CURRENT_TIMESTAMP
    WHERE id = ${e}
  `}n=(o.then?(await o)():o)[0],r()}catch(e){r(e)}})},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},55511:e=>{"use strict";e.exports=require("crypto")},59884:(e,t,a)=>{"use strict";a.a(e,async(e,r)=>{try{a.r(t),a.d(t,{patchFetch:()=>l,routeModule:()=>d,serverHooks:()=>m,workAsyncStorage:()=>c,workUnitAsyncStorage:()=>p});var s=a(43007),n=a(44360),i=a(98343),u=a(68611),o=e([u]);u=(o.then?(await o)():o)[0];let d=new s.AppRouteRouteModule({definition:{kind:n.RouteKind.APP_ROUTE,page:"/api/auth/login/route",pathname:"/api/auth/login",filename:"route",bundlePath:"app/api/auth/login/route"},resolvedPagePath:"E:\\front\\MarsLemon's-Blog\\app\\api\\auth\\login\\route.ts",nextConfigOutput:"",userland:u}),{workAsyncStorage:c,workUnitAsyncStorage:p,serverHooks:m}=d;function l(){return(0,i.patchFetch)({workAsyncStorage:c,workUnitAsyncStorage:p})}r()}catch(e){r(e)}})},61419:()=>{},62462:(e,t,a)=>{"use strict";a.a(e,async(e,r)=>{try{a.d(t,{l:()=>i});var s=a(10762),n=e([s]);s=(n.then?(await n)():n)[0];let i=(0,s.neon)("postgres://neondb_owner:npg_S3FPlxKdyQ6j@ep-floral-heart-adkjfqfm-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require");r()}catch(e){r(e)}})},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},68611:(e,t,a)=>{"use strict";a.a(e,async(e,r)=>{try{a.r(t),a.d(t,{POST:()=>o});var s=a(28142),n=a(26418),i=a(53943),u=e([n]);async function o(e){try{let{emailOrUsername:t,password:a}=await e.json();if(!t||!a)return s.NextResponse.json({error:"Email/Username and password are required"},{status:400});let r=await (0,n.FH)(t,a);if(!r)return s.NextResponse.json({error:"Invalid credentials"},{status:401});let u=await (0,n.jw)(r.id);return(await (0,i.UL)()).set("session-token",u,{httpOnly:!0,secure:!0,sameSite:"strict",maxAge:604800,path:"/"}),s.NextResponse.json({success:!0,user:{id:r.id,username:r.username,email:r.email,avatar_url:r.avatar_url,is_admin:r.is_admin}})}catch(e){return console.error("Login error:",e),s.NextResponse.json({error:"Login failed"},{status:500})}}n=(u.then?(await u)():u)[0],r()}catch(e){r(e)}})}};var t=require("../../../../webpack-runtime.js");t.C(e);var a=e=>t(t.s=e),r=t.X(0,[535,943,960],()=>a(59884));module.exports=r})();