(()=>{var e={};e.id=673,e.ids=[673],e.modules={3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},10762:e=>{"use strict";e.exports=import("@neondatabase/serverless")},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},24467:()=>{},26418:(e,t,a)=>{"use strict";a.a(e,async(e,r)=>{try{a.d(t,{FH:()=>p,JE:()=>_,ME:()=>E,OJ:()=>f,aN:()=>y,ht:()=>m,jw:()=>h,kg:()=>d});var s=a(58617),n=a(62462),i=a(55511),u=a.n(i),o=e([n]);async function c(e){return s.Ay.hash(e,12)}async function l(e,t){return s.Ay.compare(e,t)}async function d(e,t,a){let r=await c(a),s=u().randomBytes(32).toString("hex");return(await (0,n.l)`
    INSERT INTO users (username, email, password_hash, verification_token)
    VALUES (${e}, ${t}, ${r}, ${s})
    RETURNING id, username, email, avatar_url, is_admin, is_verified, created_at
  `)[0]}async function p(e,t){let a=await (0,n.l)`
    SELECT id, username, email, password_hash, avatar_url, is_admin, is_verified, created_at
    FROM users
    WHERE (email = ${e} OR username = ${e}) AND is_verified = true
  `;if(a?.length===0)return null;let r=a[0];return await l(t,r.password_hash)?{id:r.id,username:r.username,email:r.email,avatar_url:r.avatar_url,is_admin:r.is_admin,is_verified:r.is_verified,created_at:r.created_at}:null}async function m(e){let t=await (0,n.l)`
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
  `,t}async function y(e){let t=await (0,n.l)`
    SELECT u.id, u.username, u.email, u.avatar_url, u.is_admin, u.is_verified, u.created_at
    FROM users u
    JOIN sessions s ON u.id = s.user_id
    WHERE s.session_token = ${e} AND s.expires_at > NOW()
  `;return t?.length>0?t[0]:null}async function E(e){await (0,n.l)`DELETE FROM sessions WHERE session_token = ${e}`}async function f(e,t){await (0,n.l)`
    UPDATE users
    SET avatar_url = ${t}, updated_at = CURRENT_TIMESTAMP
    WHERE id = ${e}
  `}n=(o.then?(await o)():o)[0],r()}catch(e){r(e)}})},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},55511:e=>{"use strict";e.exports=require("crypto")},60993:(e,t,a)=>{"use strict";a.a(e,async(e,r)=>{try{a.d(t,{H:()=>u,U:()=>i});var s=a(26418),n=e([s]);async function i(e){try{let t=e.cookies.get("session-token")?.value;if(!t)return!1;let a=await (0,s.aN)(t);return a?.is_admin===!0}catch(e){return!1}}async function u(e){try{let t=e.cookies.get("session-token")?.value;if(!t)return null;return await (0,s.aN)(t)}catch(e){return null}}s=(n.then?(await n)():n)[0],r()}catch(e){r(e)}})},61419:()=>{},62418:(e,t,a)=>{"use strict";a.a(e,async(e,r)=>{try{a.r(t),a.d(t,{GET:()=>u});var s=a(28142),n=a(60993),i=e([n]);async function u(e){try{let t=await (0,n.H)(e);if(!t)return s.NextResponse.json({error:"Not authenticated"},{status:401});return s.NextResponse.json({user:t})}catch(e){return s.NextResponse.json({error:"Failed to get user"},{status:500})}}n=(i.then?(await i)():i)[0],r()}catch(e){r(e)}})},62462:(e,t,a)=>{"use strict";a.a(e,async(e,r)=>{try{a.d(t,{l:()=>i});var s=a(10762),n=e([s]);s=(n.then?(await n)():n)[0];let i=(0,s.neon)("postgres://neondb_owner:npg_S3FPlxKdyQ6j@ep-floral-heart-adkjfqfm-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require");r()}catch(e){r(e)}})},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},86288:(e,t,a)=>{"use strict";a.a(e,async(e,r)=>{try{a.r(t),a.d(t,{patchFetch:()=>c,routeModule:()=>l,serverHooks:()=>m,workAsyncStorage:()=>d,workUnitAsyncStorage:()=>p});var s=a(43007),n=a(44360),i=a(98343),u=a(62418),o=e([u]);u=(o.then?(await o)():o)[0];let l=new s.AppRouteRouteModule({definition:{kind:n.RouteKind.APP_ROUTE,page:"/api/auth/me/route",pathname:"/api/auth/me",filename:"route",bundlePath:"app/api/auth/me/route"},resolvedPagePath:"E:\\front\\MarsLemon's-Blog\\app\\api\\auth\\me\\route.ts",nextConfigOutput:"",userland:u}),{workAsyncStorage:d,workUnitAsyncStorage:p,serverHooks:m}=l;function c(){return(0,i.patchFetch)({workAsyncStorage:d,workUnitAsyncStorage:p})}r()}catch(e){r(e)}})}};var t=require("../../../../webpack-runtime.js");t.C(e);var a=e=>t(t.s=e),r=t.X(0,[535,960],()=>a(86288));module.exports=r})();