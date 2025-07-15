(()=>{var e={};e.id=612,e.ids=[612],e.modules={3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},10762:e=>{"use strict";e.exports=import("@neondatabase/serverless")},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},24467:()=>{},26418:(e,t,r)=>{"use strict";r.a(e,async(e,s)=>{try{r.d(t,{FH:()=>p,JE:()=>_,ME:()=>h,OJ:()=>w,aN:()=>f,ht:()=>m,jw:()=>E,kg:()=>c});var a=r(58617),n=r(62462),i=r(55511),u=r.n(i),o=e([n]);async function l(e){return a.Ay.hash(e,12)}async function d(e,t){return a.Ay.compare(e,t)}async function c(e,t,r){let s=await l(r),a=u().randomBytes(32).toString("hex");return(await (0,n.l)`
    INSERT INTO users (username, email, password_hash, verification_token)
    VALUES (${e}, ${t}, ${s}, ${a})
    RETURNING id, username, email, avatar_url, is_admin, is_verified, created_at
  `)[0]}async function p(e,t){let r=await (0,n.l)`
    SELECT id, username, email, password_hash, avatar_url, is_admin, is_verified, created_at
    FROM users
    WHERE (email = ${e} OR username = ${e}) AND is_verified = true
  `;if(r?.length===0)return null;let s=r[0];return await d(t,s.password_hash)?{id:s.id,username:s.username,email:s.email,avatar_url:s.avatar_url,is_admin:s.is_admin,is_verified:s.is_verified,created_at:s.created_at}:null}async function m(e){let t=await (0,n.l)`
    SELECT id, username, email, avatar_url, is_admin, is_verified, created_at
    FROM users
    WHERE email = ${e}
  `;return t?.length>0?t[0]:null}async function _(e){let t=await (0,n.l)`
    SELECT id, username, email, avatar_url, is_admin, is_verified, created_at
    FROM users
    WHERE username = ${e}
  `;return t?.length>0?t[0]:null}async function E(e){let t=u().randomBytes(32).toString("hex"),r=new Date(Date.now()+6048e5);return await (0,n.l)`
    INSERT INTO sessions (user_id, session_token, expires_at)
    VALUES (${e}, ${t}, ${r})
  `,t}async function f(e){let t=await (0,n.l)`
    SELECT u.id, u.username, u.email, u.avatar_url, u.is_admin, u.is_verified, u.created_at
    FROM users u
    JOIN sessions s ON u.id = s.user_id
    WHERE s.session_token = ${e} AND s.expires_at > NOW()
  `;return t?.length>0?t[0]:null}async function h(e){await (0,n.l)`DELETE FROM sessions WHERE session_token = ${e}`}async function w(e,t){await (0,n.l)`
    UPDATE users
    SET avatar_url = ${t}, updated_at = CURRENT_TIMESTAMP
    WHERE id = ${e}
  `}n=(o.then?(await o)():o)[0],s()}catch(e){s(e)}})},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},44865:(e,t,r)=>{"use strict";r.a(e,async(e,s)=>{try{r.r(t),r.d(t,{POST:()=>o});var a=r(28142),n=r(26418),i=r(62462),u=e([n,i]);async function o(e){try{let{username:t,email:r,password:s}=await e.json();if(!t||!r||!s)return a.NextResponse.json({error:"All fields are required"},{status:400});if(s?.length<6)return a.NextResponse.json({error:"Password must be at least 6 characters"},{status:400});if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r))return a.NextResponse.json({error:"Invalid email format"},{status:400});if(!/^[a-zA-Z0-9_]{3,20}$/.test(t))return a.NextResponse.json({error:"Username must be 3-20 characters and contain only letters, numbers, and underscores"},{status:400});if(await (0,n.ht)(r))return a.NextResponse.json({error:"Email already exists"},{status:400});if(await (0,n.JE)(t))return a.NextResponse.json({error:"Username already exists"},{status:400});let u=await (0,n.kg)(t,r,s);return await (0,i.l)`UPDATE users SET is_verified = true WHERE id = ${u.id}`,a.NextResponse.json({success:!0,message:"Account created successfully. You can now log in."})}catch(e){return console.error("Registration error:",e),a.NextResponse.json({error:"Registration failed"},{status:500})}}[n,i]=u.then?(await u)():u,s()}catch(e){s(e)}})},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},55511:e=>{"use strict";e.exports=require("crypto")},61419:()=>{},62462:(e,t,r)=>{"use strict";r.a(e,async(e,s)=>{try{r.d(t,{l:()=>i});var a=r(10762),n=e([a]);a=(n.then?(await n)():n)[0];let i=(0,a.neon)("postgres://neondb_owner:npg_S3FPlxKdyQ6j@ep-floral-heart-adkjfqfm-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require");s()}catch(e){s(e)}})},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},82086:(e,t,r)=>{"use strict";r.a(e,async(e,s)=>{try{r.r(t),r.d(t,{patchFetch:()=>l,routeModule:()=>d,serverHooks:()=>m,workAsyncStorage:()=>c,workUnitAsyncStorage:()=>p});var a=r(43007),n=r(44360),i=r(98343),u=r(44865),o=e([u]);u=(o.then?(await o)():o)[0];let d=new a.AppRouteRouteModule({definition:{kind:n.RouteKind.APP_ROUTE,page:"/api/auth/register/route",pathname:"/api/auth/register",filename:"route",bundlePath:"app/api/auth/register/route"},resolvedPagePath:"E:\\front\\MarsLemon's-Blog\\app\\api\\auth\\register\\route.ts",nextConfigOutput:"",userland:u}),{workAsyncStorage:c,workUnitAsyncStorage:p,serverHooks:m}=d;function l(){return(0,i.patchFetch)({workAsyncStorage:c,workUnitAsyncStorage:p})}s()}catch(e){s(e)}})}};var t=require("../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),s=t.X(0,[535,960],()=>r(82086));module.exports=s})();