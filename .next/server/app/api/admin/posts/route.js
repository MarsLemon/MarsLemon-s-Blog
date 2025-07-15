(()=>{var e={};e.id=215,e.ids=[215],e.modules={3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},10762:e=>{"use strict";e.exports=import("@neondatabase/serverless")},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},24467:()=>{},26418:(e,t,r)=>{"use strict";r.a(e,async(e,a)=>{try{r.d(t,{FH:()=>p,JE:()=>y,ME:()=>m,OJ:()=>E,aN:()=>h,ht:()=>g,jw:()=>x,kg:()=>c});var s=r(58617),n=r(62462),i=r(55511),l=r.n(i),o=e([n]);async function u(e){return s.Ay.hash(e,12)}async function d(e,t){return s.Ay.compare(e,t)}async function c(e,t,r){let a=await u(r),s=l().randomBytes(32).toString("hex");return(await (0,n.l)`
    INSERT INTO users (username, email, password_hash, verification_token)
    VALUES (${e}, ${t}, ${a}, ${s})
    RETURNING id, username, email, avatar_url, is_admin, is_verified, created_at
  `)[0]}async function p(e,t){let r=await (0,n.l)`
    SELECT id, username, email, password_hash, avatar_url, is_admin, is_verified, created_at
    FROM users
    WHERE (email = ${e} OR username = ${e}) AND is_verified = true
  `;if(r?.length===0)return null;let a=r[0];return await d(t,a.password_hash)?{id:a.id,username:a.username,email:a.email,avatar_url:a.avatar_url,is_admin:a.is_admin,is_verified:a.is_verified,created_at:a.created_at}:null}async function g(e){let t=await (0,n.l)`
    SELECT id, username, email, avatar_url, is_admin, is_verified, created_at
    FROM users
    WHERE email = ${e}
  `;return t?.length>0?t[0]:null}async function y(e){let t=await (0,n.l)`
    SELECT id, username, email, avatar_url, is_admin, is_verified, created_at
    FROM users
    WHERE username = ${e}
  `;return t?.length>0?t[0]:null}async function x(e){let t=l().randomBytes(32).toString("hex"),r=new Date(Date.now()+6048e5);return await (0,n.l)`
    INSERT INTO sessions (user_id, session_token, expires_at)
    VALUES (${e}, ${t}, ${r})
  `,t}async function h(e){let t=await (0,n.l)`
    SELECT u.id, u.username, u.email, u.avatar_url, u.is_admin, u.is_verified, u.created_at
    FROM users u
    JOIN sessions s ON u.id = s.user_id
    WHERE s.session_token = ${e} AND s.expires_at > NOW()
  `;return t?.length>0?t[0]:null}async function m(e){await (0,n.l)`DELETE FROM sessions WHERE session_token = ${e}`}async function E(e,t){await (0,n.l)`
    UPDATE users
    SET avatar_url = ${t}, updated_at = CURRENT_TIMESTAMP
    WHERE id = ${e}
  `}n=(o.then?(await o)():o)[0],a()}catch(e){a(e)}})},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},41565:(e,t,r)=>{"use strict";r.d(t,{d:()=>o,u:()=>l});var a=r(2824),s=r(76605),n=r(51694);a.xI.use((0,s.x)({langPrefix:"hljs language-",highlight(e,t){let r=n.A.getLanguage(t)?t:"plaintext";return n.A.highlight(e,{language:r}).value}}));let i=new a.xI.Renderer;function l(e){return a.xI.parse(e)}function o(e,t=160){let r=e.replace(/#{1,6}\s+/g,"").replace(/\*\*(.*?)\*\*/g,"$1").replace(/\*(.*?)\*/g,"$1").replace(/`(.*?)`/g,"$1").replace(/\[(.*?)\]$$.*?$$/g,"$1").replace(/!\[(.*?)\]$$.*?$$/g,"$1").replace(/^>\s+/gm,"").replace(/^\s*[-*+]\s+/gm,"").replace(/^\s*\d+\.\s+/gm,"").replace(/\n/g," ").replace(/\s+/g," ").trim();return r?.length>t?r.substring(0,t)+"...":r}i.link=(e,t,r)=>{let a=e?.startsWith("http")&&!e.includes(window?.location?.hostname||""),s=t?` title="${t}"`:"";return`<a href="${e}"${s}${a?' target="_blank" rel="noopener noreferrer"':""}>${r}</a>`},i.image=(e,t,r)=>{let a=t?` title="${t}"`:"",s=r?` alt="${r}"`:"";return`<img src="${e}"${s}${a} loading="lazy" class="rounded-lg shadow-sm" />`},i.table=(e,t)=>`<div class="overflow-x-auto my-6">
    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead class="bg-gray-50 dark:bg-gray-800">${e}</thead>
      <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">${t}</tbody>
    </table>
  </div>`,i.blockquote=e=>`<blockquote class="border-l-4 border-primary pl-4 py-2 my-4 bg-muted/50 rounded-r-lg italic">${e}</blockquote>`,i.code=(e,t)=>{let r=t&&n.A.getLanguage(t)?t:"plaintext",a=n.A.highlight(e,{language:r}).value;return`<div class="relative my-6">
    <div class="flex items-center justify-between bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-t-lg">
      <span class="text-sm font-medium text-gray-600 dark:text-gray-400">${r}</span>
      <button onclick="navigator.clipboard.writeText(\`${e.replace(/`/g,"\\`")}\`)"
              class="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
        Copy
      </button>
    </div>
    <pre class="bg-gray-900 text-gray-100 p-4 rounded-b-lg overflow-x-auto"><code class="hljs language-${r}">${a}</code></pre>
  </div>`},a.xI.setOptions({renderer:i,gfm:!0,breaks:!0,pedantic:!1,sanitize:!1,smartypants:!0}),[{name:"taskList",level:"block",start:e=>e.match(/^\s*[-*+] \[[ x]\]/)?.index,tokenizer(e){let t=/^(\s*)([-*+]) \[([x ])\] (.+)$/gm.exec(e);if(t)return{type:"taskList",raw:t[0],checked:"x"===t[3],text:t[4]}},renderer(e){let t=e.checked?"checked":"";return`<div class="flex items-center gap-2 my-1">
        <input type="checkbox" ${t} disabled class="rounded" />
        <span class="${e.checked?"line-through text-gray-500":""}">${e.text}</span>
      </div>`}},{name:"alert",level:"block",start:e=>e.match(/^> \[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/)?.index,tokenizer(e){let t=/^> \[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*\n((?:> .*\n?)*)/m.exec(e);if(t){let e=t[1].toLowerCase(),r=t[2].replace(/^> /gm,"").trim();return{type:"alert",raw:t[0],alertType:e,text:r}}},renderer(e){let t={note:{icon:"ℹ️",class:"bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200"},tip:{icon:"\uD83D\uDCA1",class:"bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200"},important:{icon:"❗",class:"bg-purple-50 border-purple-200 text-purple-800 dark:bg-purple-900/20 dark:border-purple-800 dark:text-purple-200"},warning:{icon:"⚠️",class:"bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200"},caution:{icon:"\uD83D\uDEA8",class:"bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200"}},r=t[e.alertType]||t.note;return`<div class="border-l-4 p-4 my-4 rounded-r-lg ${r.class}">
        <div class="flex items-start gap-2">
          <span class="text-lg">${r.icon}</span>
          <div class="flex-1">
            <div class="font-semibold uppercase text-xs mb-1">${e.alertType}</div>
            <div>${a.xI.parse(e.text)}</div>
          </div>
        </div>
      </div>`}}].forEach(e=>a.xI.use({extensions:[e]}))},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},54448:(e,t,r)=>{"use strict";r.a(e,async(e,a)=>{try{r.r(t),r.d(t,{GET:()=>u,POST:()=>d});var s=r(28142),n=r(62462),i=r(67533),l=r(60993),o=e([n,i,l]);async function u(){try{let e=await (0,n.l)`
      SELECT * FROM posts
      ORDER BY is_pinned DESC, created_at DESC
    `;return s.NextResponse.json(e)}catch(e){return s.NextResponse.json({error:"Failed to fetch posts"},{status:500})}}async function d(e){try{if(!await (0,l.U)(e))return s.NextResponse.json({error:"Unauthorized"},{status:401});let{title:t,content:r,cover_image:a,is_featured:o,is_pinned:u}=await e.json();if(!t||!r)return s.NextResponse.json({error:"Title and content are required"},{status:400});let d=(0,i.z9)(t),c=(0,i.dn)(r),p=await (0,n.l)`SELECT id FROM posts WHERE slug = ${d}`;if(p?.length>0)return s.NextResponse.json({error:"A post with this title already exists"},{status:400});let g=await (0,n.l)`
      INSERT INTO posts (title, slug, excerpt, content, cover_image, is_featured, is_pinned)
      VALUES (${t}, ${d}, ${c}, ${r}, ${a||null}, ${o||!1}, ${u||!1})
      RETURNING *
    `;return s.NextResponse.json(g[0])}catch(e){return s.NextResponse.json({error:"Failed to create post"},{status:500})}}[n,i,l]=o.then?(await o)():o,a()}catch(e){a(e)}})},55511:e=>{"use strict";e.exports=require("crypto")},60993:(e,t,r)=>{"use strict";r.a(e,async(e,a)=>{try{r.d(t,{H:()=>l,U:()=>i});var s=r(26418),n=e([s]);async function i(e){try{let t=e.cookies.get("session-token")?.value;if(!t)return!1;let r=await (0,s.aN)(t);return r?.is_admin===!0}catch(e){return!1}}async function l(e){try{let t=e.cookies.get("session-token")?.value;if(!t)return null;return await (0,s.aN)(t)}catch(e){return null}}s=(n.then?(await n)():n)[0],a()}catch(e){a(e)}})},61419:()=>{},62462:(e,t,r)=>{"use strict";r.a(e,async(e,a)=>{try{r.d(t,{l:()=>i});var s=r(10762),n=e([s]);s=(n.then?(await n)():n)[0];let i=(0,s.neon)("postgres://neondb_owner:npg_S3FPlxKdyQ6j@ep-floral-heart-adkjfqfm-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require");a()}catch(e){a(e)}})},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},67533:(e,t,r)=>{"use strict";r.a(e,async(e,a)=>{try{r.d(t,{N7:()=>o,dn:()=>g,n0:()=>d,uY:()=>p,y9:()=>y,z9:()=>c,zU:()=>u,zX:()=>l});var s=r(62462),n=r(41565),i=e([s]);async function l(){return await (0,s.l)`
    SELECT * FROM posts
    WHERE published = true
    ORDER BY is_pinned DESC, created_at DESC
  `}async function o(e){let t=await (0,s.l)`
    SELECT * FROM posts
    WHERE slug = ${e} AND published = true
    LIMIT 1
  `;return t?.length>0?t[0]:null}async function u(){let e=await (0,s.l)`
    SELECT * FROM posts
    WHERE is_featured = true AND published = true
    ORDER BY created_at DESC
    LIMIT 1
  `;return e?.length>0?e[0]:null}async function d(e=3){return await (0,s.l)`
    SELECT * FROM posts
    WHERE published = true AND is_featured = false
    ORDER BY is_pinned DESC, created_at DESC
    LIMIT ${e}
  `}function c(e){return e.toLowerCase().replace(/[^\w\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-").trim()}function p(e){return(0,n.u)(e)}function g(e,t=160){return(0,n.d)(e,t)}async function y(){try{return await (0,s.l)`SELECT * FROM posts WHERE published = true   ORDER BY created_at DESC`||[]}catch(e){return console.error("Failed to fetch posts:",e),[]}}s=(i.then?(await i)():i)[0],a()}catch(e){a(e)}})},85088:(e,t,r)=>{"use strict";r.a(e,async(e,a)=>{try{r.r(t),r.d(t,{patchFetch:()=>u,routeModule:()=>d,serverHooks:()=>g,workAsyncStorage:()=>c,workUnitAsyncStorage:()=>p});var s=r(43007),n=r(44360),i=r(98343),l=r(54448),o=e([l]);l=(o.then?(await o)():o)[0];let d=new s.AppRouteRouteModule({definition:{kind:n.RouteKind.APP_ROUTE,page:"/api/admin/posts/route",pathname:"/api/admin/posts",filename:"route",bundlePath:"app/api/admin/posts/route"},resolvedPagePath:"E:\\front\\MarsLemon's-Blog\\app\\api\\admin\\posts\\route.ts",nextConfigOutput:"",userland:l}),{workAsyncStorage:c,workUnitAsyncStorage:p,serverHooks:g}=d;function u(){return(0,i.patchFetch)({workAsyncStorage:c,workUnitAsyncStorage:p})}a()}catch(e){a(e)}})}};var t=require("../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),a=t.X(0,[535,960,659],()=>r(85088));module.exports=a})();