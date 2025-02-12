(()=>{"use strict";var e={975:e=>{function t(e){if("string"!=typeof e)throw new TypeError("Path must be a string. Received "+JSON.stringify(e))}function r(e,t){for(var r,s="",n=0,i=-1,o=0,l=0;l<=e.length;++l){if(l<e.length)r=e.charCodeAt(l);else{if(47===r)break;r=47}if(47===r){if(i===l-1||1===o);else if(i!==l-1&&2===o){if(s.length<2||2!==n||46!==s.charCodeAt(s.length-1)||46!==s.charCodeAt(s.length-2))if(s.length>2){var a=s.lastIndexOf("/");if(a!==s.length-1){-1===a?(s="",n=0):n=(s=s.slice(0,a)).length-1-s.lastIndexOf("/"),i=l,o=0;continue}}else if(2===s.length||1===s.length){s="",n=0,i=l,o=0;continue}t&&(s.length>0?s+="/..":s="..",n=2)}else s.length>0?s+="/"+e.slice(i+1,l):s=e.slice(i+1,l),n=l-i-1;i=l,o=0}else 46===r&&-1!==o?++o:o=-1}return s}var s={resolve:function(){for(var e,s="",n=!1,i=arguments.length-1;i>=-1&&!n;i--){var o;i>=0?o=arguments[i]:(void 0===e&&(e=process.cwd()),o=e),t(o),0!==o.length&&(s=o+"/"+s,n=47===o.charCodeAt(0))}return s=r(s,!n),n?s.length>0?"/"+s:"/":s.length>0?s:"."},normalize:function(e){if(t(e),0===e.length)return".";var s=47===e.charCodeAt(0),n=47===e.charCodeAt(e.length-1);return 0!==(e=r(e,!s)).length||s||(e="."),e.length>0&&n&&(e+="/"),s?"/"+e:e},isAbsolute:function(e){return t(e),e.length>0&&47===e.charCodeAt(0)},join:function(){if(0===arguments.length)return".";for(var e,r=0;r<arguments.length;++r){var n=arguments[r];t(n),n.length>0&&(void 0===e?e=n:e+="/"+n)}return void 0===e?".":s.normalize(e)},relative:function(e,r){if(t(e),t(r),e===r)return"";if((e=s.resolve(e))===(r=s.resolve(r)))return"";for(var n=1;n<e.length&&47===e.charCodeAt(n);++n);for(var i=e.length,o=i-n,l=1;l<r.length&&47===r.charCodeAt(l);++l);for(var a=r.length-l,c=o<a?o:a,u=-1,d=0;d<=c;++d){if(d===c){if(a>c){if(47===r.charCodeAt(l+d))return r.slice(l+d+1);if(0===d)return r.slice(l+d)}else o>c&&(47===e.charCodeAt(n+d)?u=d:0===d&&(u=0));break}var h=e.charCodeAt(n+d);if(h!==r.charCodeAt(l+d))break;47===h&&(u=d)}var g="";for(d=n+u+1;d<=i;++d)d!==i&&47!==e.charCodeAt(d)||(0===g.length?g+="..":g+="/..");return g.length>0?g+r.slice(l+u):(l+=u,47===r.charCodeAt(l)&&++l,r.slice(l))},_makeLong:function(e){return e},dirname:function(e){if(t(e),0===e.length)return".";for(var r=e.charCodeAt(0),s=47===r,n=-1,i=!0,o=e.length-1;o>=1;--o)if(47===(r=e.charCodeAt(o))){if(!i){n=o;break}}else i=!1;return-1===n?s?"/":".":s&&1===n?"//":e.slice(0,n)},basename:function(e,r){if(void 0!==r&&"string"!=typeof r)throw new TypeError('"ext" argument must be a string');t(e);var s,n=0,i=-1,o=!0;if(void 0!==r&&r.length>0&&r.length<=e.length){if(r.length===e.length&&r===e)return"";var l=r.length-1,a=-1;for(s=e.length-1;s>=0;--s){var c=e.charCodeAt(s);if(47===c){if(!o){n=s+1;break}}else-1===a&&(o=!1,a=s+1),l>=0&&(c===r.charCodeAt(l)?-1==--l&&(i=s):(l=-1,i=a))}return n===i?i=a:-1===i&&(i=e.length),e.slice(n,i)}for(s=e.length-1;s>=0;--s)if(47===e.charCodeAt(s)){if(!o){n=s+1;break}}else-1===i&&(o=!1,i=s+1);return-1===i?"":e.slice(n,i)},extname:function(e){t(e);for(var r=-1,s=0,n=-1,i=!0,o=0,l=e.length-1;l>=0;--l){var a=e.charCodeAt(l);if(47!==a)-1===n&&(i=!1,n=l+1),46===a?-1===r?r=l:1!==o&&(o=1):-1!==r&&(o=-1);else if(!i){s=l+1;break}}return-1===r||-1===n||0===o||1===o&&r===n-1&&r===s+1?"":e.slice(r,n)},format:function(e){if(null===e||"object"!=typeof e)throw new TypeError('The "pathObject" argument must be of type Object. Received type '+typeof e);return function(e,t){var r=t.dir||t.root,s=t.base||(t.name||"")+(t.ext||"");return r?r===t.root?r+s:r+e+s:s}("/",e)},parse:function(e){t(e);var r={root:"",dir:"",base:"",ext:"",name:""};if(0===e.length)return r;var s,n=e.charCodeAt(0),i=47===n;i?(r.root="/",s=1):s=0;for(var o=-1,l=0,a=-1,c=!0,u=e.length-1,d=0;u>=s;--u)if(47!==(n=e.charCodeAt(u)))-1===a&&(c=!1,a=u+1),46===n?-1===o?o=u:1!==d&&(d=1):-1!==o&&(d=-1);else if(!c){l=u+1;break}return-1===o||-1===a||0===d||1===d&&o===a-1&&o===l+1?-1!==a&&(r.base=r.name=0===l&&i?e.slice(1,a):e.slice(l,a)):(0===l&&i?(r.name=e.slice(1,o),r.base=e.slice(1,a)):(r.name=e.slice(l,o),r.base=e.slice(l,a)),r.ext=e.slice(o,a)),l>0?r.dir=e.slice(0,l-1):i&&(r.dir="/"),r},sep:"/",delimiter:":",win32:null,posix:null};s.posix=s,e.exports=s}},t={};function r(s){var n=t[s];if(void 0!==n)return n.exports;var i=t[s]={exports:{}};return e[s](i,i.exports,r),i.exports}r.d=(e,t)=>{for(var s in t)r.o(t,s)&&!r.o(e,s)&&Object.defineProperty(e,s,{enumerable:!0,get:t[s]})},r.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var s={};r.r(s),r.d(s,{default:()=>g});function n(e,t,r,s){return new(r||(r=Promise))((function(n,i){function o(e){try{a(s.next(e))}catch(e){i(e)}}function l(e){try{a(s.throw(e))}catch(e){i(e)}}function a(e){var t;e.done?n(e.value):(t=e.value,t instanceof r?t:new r((function(e){e(t)}))).then(o,l)}a((s=s.apply(e,t||[])).next())}))}Object.create;Object.create;"function"==typeof SuppressedError&&SuppressedError;const i=require("obsidian"),o={rootDir:"33. RESOURCES/Lectures/class101",baseUrl:"http://125.133.148.194:4000",templateDir:"93. templates/class101",lectureFolder:"lectures",reviewFolder:"reviews",noteFolder:"notes",scriptFolder:"scripts",classFolder:"classes",overwrite:!1};class l extends i.PluginSettingTab{constructor(e,t){super(e,t),this.plugin=t}display(){const{containerEl:e}=this;e.empty(),e.createEl("h2",{text:"Class101 설정"}),new i.Setting(e).setName("루트 디렉토리").setDesc("Class101 강의 노트가 저장될 기본 경로입니다.").addText((e=>e.setPlaceholder("예: 33. RESOURCES/Lectures/class101").setValue(this.plugin.settings.rootDir).onChange((e=>n(this,void 0,void 0,(function*(){this.plugin.settings.rootDir=e,yield this.plugin.saveSettings()})))))),new i.Setting(e).setName("기본 URL").setDesc("Class101 API 서버의 기본 URL입니다.").addText((e=>e.setPlaceholder("예: http://125.133.148.194:4000").setValue(this.plugin.settings.baseUrl).onChange((e=>n(this,void 0,void 0,(function*(){this.plugin.settings.baseUrl=e,yield this.plugin.saveSettings()})))))),new i.Setting(e).setName("템플릿 디렉토리").setDesc("템플릿 파일들이 저장된 디렉토리 경로입니다.").addText((e=>e.setPlaceholder("예: 93. templates/class101").setValue(this.plugin.settings.templateDir).onChange((e=>n(this,void 0,void 0,(function*(){this.plugin.settings.templateDir=e,yield this.plugin.saveSettings()})))))),new i.Setting(e).setName("파일 덮어쓰기").setDesc("파일이 이미 존재할 경우 덮어쓸지 여부를 설정합니다.").addToggle((e=>e.setValue(this.plugin.settings.overwrite).onChange((e=>n(this,void 0,void 0,(function*(){this.plugin.settings.overwrite=e,yield this.plugin.saveSettings()}))))));[{key:"lectureFolder",name:"강의",desc:"강의 파일"},{key:"reviewFolder",name:"리뷰",desc:"리뷰 파일"},{key:"noteFolder",name:"노트",desc:"노트 파일"},{key:"scriptFolder",name:"자막",desc:"자막 파일"},{key:"classFolder",name:"클래스",desc:"클래스 파일"}].forEach((({key:t,name:r,desc:s})=>{new i.Setting(e).setName(`${r} 폴더`).setDesc(`${s}이 저장될 하위 경로입니다.`).addText((e=>e.setPlaceholder(`예: ${t.replace("Folder","")}`).setValue(String(this.plugin.settings[t])).onChange((e=>n(this,void 0,void 0,(function*(){this.plugin.settings[t]=e,yield this.plugin.saveSettings()}))))))}))}}class a{constructor(e){this.baseUrl=e}getClassIds(){return n(this,void 0,void 0,(function*(){return this.fetchJson(`${this.baseUrl}/lecture/_repo/class101/json/myclassIds.json`)}))}getAllClasses(){return n(this,void 0,void 0,(function*(){return this.fetchJson(`${this.baseUrl}/lecture/_repo/class101/json/myclasses.json`)}))}fetchJson(e){return n(this,void 0,void 0,(function*(){try{console.log("Fetching JSON from:",e);const t=yield fetch(e);if(!t.ok)throw new Error(`HTTP error! status: ${t.status}`);return yield t.json()}catch(t){throw console.error(`Error fetching JSON from ${e}:`,t),t}}))}fetchHtml(e){return n(this,void 0,void 0,(function*(){try{const t=yield fetch(e);if(!t.ok)throw new Error(`HTTP error! status: ${t.status}`);return yield t.text()}catch(t){throw console.error(`Error fetching HTML from ${e}:`,t),t}}))}getClassInfo(e){return n(this,void 0,void 0,(function*(){try{const t=yield this.fetchJson(`${this.baseUrl}/lecture/_repo/class101/json/classes/${e}.json`),r=(yield this.fetchJson(`${this.baseUrl}/lecture/_repo/class101/json/myclasses.json`)).find((t=>t.classId===e));if(!r)throw new Error(`Class ID ${e} not found in myclasses.json`);const s=Array.isArray(t)?t:t.lectures;return Object.assign(Object.assign({},r),{lectures:s||[]})}catch(t){throw console.error(`Error fetching class info for ${e}:`,t),t}}))}getLectureInfo(e){return n(this,void 0,void 0,(function*(){return this.fetchJson(`${this.baseUrl}/lecture/_repo/class101/json/classes/${e}.json`)}))}getCategory(e){return n(this,void 0,void 0,(function*(){try{const[t,r,s]=yield Promise.all([this.fetchJson(`${this.baseUrl}/lecture/_repo/class101/json/myclasses.json`),this.fetchJson(`${this.baseUrl}/lecture/_repo/class101/json/subCategories.json`),this.fetchJson(`${this.baseUrl}/lecture/_repo/class101/json/categories.json`)]),n=t.find((t=>t.classId===e));if(!n)return"";const i=r.find((e=>e.categoryId===n.categoryId));if(!i)return"";const o=s.find((e=>e.categoryId===i.ancestorId));return o?`${o.title0}/${o.title}/${i.title}`:""}catch(e){return console.error("Error in getCategory:",e),""}}))}fetchAttachments(e,t){return n(this,void 0,void 0,(function*(){try{const r=`${this.baseUrl}/api/files/${e}/${t}`,s=yield fetch(r);if(!s.ok){if(404===s.status)return[];throw new Error(`HTTP error! status: ${s.status}`)}const n=yield s.json();return n.files&&Array.isArray(n.files)?n.files.filter((e=>!e.startsWith("@")&&!e.startsWith("."))):[]}catch(e){return console.error(`Error fetching attachments for lecture ${t}:`,e),[]}}))}getScriptContent(e,t,r){return n(this,void 0,void 0,(function*(){try{const e=`${this.baseUrl}/lecture/class101/${t}/${r}.vtt`,s=yield fetch(e);return s.ok?yield s.text():(console.log(`Script not found for lecture ${r}`),null)}catch(e){return console.error("Error getting script content:",e),null}}))}getLectureNote(e,t){return n(this,void 0,void 0,(function*(){const r=`${this.baseUrl}/lecture/_repo/class101/html/classes/${e}/${t}/materials/index.html`;return(yield fetch(r)).text()}))}getLectureAttachments(e,t){return n(this,void 0,void 0,(function*(){const r=`${this.baseUrl}/api/files/${e}/${t}`,s=yield fetch(r);if(!s.ok)return[];return(yield s.json()).files||[]}))}getLectureScript(e,t){return n(this,void 0,void 0,(function*(){const r=`${this.baseUrl}/lecture/class101/${e}/${t}.vtt`,s=yield fetch(r);return s.ok?s.text():null}))}}var c=r(975);class u{constructor(e,t){this.app=e,this.settings=t}ensureFolder(e){return n(this,void 0,void 0,(function*(){var t;try{(yield this.app.vault.adapter.exists(e))||(yield this.app.vault.createFolder(e))}catch(e){if(!this.settings.overwrite||!(null===(t=e.message)||void 0===t?void 0:t.includes("Folder already exists")))throw e}}))}createFileWithOverwriteCheck(e,t){return n(this,void 0,void 0,(function*(){if((yield this.app.vault.adapter.exists(e))&&!this.settings.overwrite)throw new Error(`파일이 이미 존재합니다: ${e}`);yield this.app.vault.create(e,t)}))}getTemplate(e){return n(this,void 0,void 0,(function*(){try{const t=(0,c.join)(this.settings.templateDir,`${e}.md`);return yield this.app.vault.adapter.read(t)}catch(t){return console.error(`Error reading ${e} template:`,t),this.getDefaultTemplate(e)}}))}getDefaultTemplate(e){switch(e){case"review":return"---\ntitle: {{lectureTitle}}\nviewCount: 0\ndifficulty: 3\nlikeability: 3\ntags:\n  - review/class101\n---\n\n### 정리/요약\n\n\n\n### 3줄평\n\n\n### 원본 노트\n\n[[{{noteTitle}}|강의노트]]\n\n";case"lecture":return'---\ntitle: {{title}}\nsourceURL: {{sourceURL}}\nduration: {{duration}}\ncategory: {{category}}\ntags: {{tags}}\n---\n\n<video controls>\n  <source src="{{videoUrl}}">\n</video>\n\n{{navigationLinks}}\n\n## 리뷰\n{{reviewLink}}\n\n## 노트\n{{noteLink}}\n\n## 자막\n{{scriptLink}}\n';default:return""}}createClassList(e){return n(this,void 0,void 0,(function*(){var t,r;try{new i.Notice("클래스 목록을 생성하고 있습니다...");let s="| 제목 | 카테고리 | 크리에이터 | 링크 |\n";s+="|------|-----------|------------|------|\n";for(const n of e){const e=n.title.replace(/\|/g,"\\|"),i=(null===(t=n.categoryTitle)||void 0===t?void 0:t.replace(/\|/g,"\\|"))||"",o=(null===(r=n.creatorName)||void 0===r?void 0:r.replace(/\|/g,"\\|"))||"";s+=`| ${e} | ${i} | ${o} | ${`[[${this.sanitizeName(e)}|🔗]]`} |\n`}const n=`---\ntitle: class101\ntags: \n  - lecture/class101\n---\n\n## 클래스 목록\n\n${s}`,o=(0,c.join)(this.settings.rootDir,"myclasses.md");yield this.createFileWithOverwriteCheck(o,n),new i.Notice("클래스 목록이 생성되었습니다.")}catch(e){console.error("Error creating class list:",e),new i.Notice("클래스 목록 생성 중 오류가 발생했습니다.")}}))}sanitizeName(e){return e.replace(/\[/g,"(").replace(/\]/g,")").replace(/[^\uAC00-\uD7A3a-zA-Z0-9_\(\)\<\>,\s]/g,"").replace(/\s+/g," ").trim()}getPath(e,t){const r=this.settings.rootDir,s={lectures:this.settings.lectureFolder,reviews:this.settings.reviewFolder,notes:this.settings.noteFolder,scripts:this.settings.scriptFolder,classes:this.settings.classFolder};return t?(0,c.join)(r,s[e],t):(0,c.join)(r,s[e])}createClassIndex(e){return n(this,void 0,void 0,(function*(){const{classTitle:t,noteTitles:r,category:s,sanitizedClassTitle:n}=e,i=`---\ntitle: "${t}"\nsource: ${`https://class101.net/ko/classes/${e.classId}`}\ncategory: ${s}\ntags: \n  - class101/class\n---\n\n## 클래스 소개\n\n[[${n}_intro|클래스 소개]]\n\n\n## 준비물\n\n[[${n}_kit|준비물]]\n\n\n## 커리큘럼\n\n${r.map((e=>`### [[${e}]]`)).join("\n\n")}`,o=(0,c.join)(this.settings.rootDir,this.settings.classFolder,`${n}.md`);yield this.createFileWithOverwriteCheck(o,i)}))}getFilePath(e,t){return(0,c.join)(e,t)}createFile(e,t){return n(this,void 0,void 0,(function*(){yield this.createFileWithOverwriteCheck(e,t)}))}getReviewTemplate(){return n(this,void 0,void 0,(function*(){return this.getTemplate("review")}))}createReviewContent(e){const{template:t,lectureTitle:r,source:s,videoUrl:n,noteTitle:i}=e;return t.replace("{{lectureTitle}}",r).replace("{{source}}",s).replace("{{videoUrl}}",n).replace("{{noteTitle}}",i)}createLectureMarkdown(e){return n(this,void 0,void 0,(function*(){const t=yield this.getTemplate("lecture"),{lecture:r,noteTitle:s,source:n,category:i,sanitizedClassTitle:o,prevNoteTitle:l,nextNoteTitle:a}=e,c=[l?`[[${l}|← 이전 강의]]`:"",`[[${o}|❖ 전체 목록]]`,a?`[[${a}|다음 강의 →]]`:""].filter(Boolean).join(" | "),u=`${this.settings.baseUrl}/lecture/class101/${o}/${s}.mkv`,d=`[[${s}_review|리뷰 작성]]`,h=`[[${s}_note|수업 노트]]`,g=`[[${s}_script|자막 보기]]`,f=i?`class101/${i.replace(/\s+/g,"")}`:"class101";return t.replace("{{title}}",r.title).replace("{{sourceURL}}",n).replace("{{duration}}",this.formatDuration(r.duration)).replace("{{category}}",i).replace("{{tags}}",f).replace("{{videoUrl}}",u).replace("{{navigationLinks}}",c).replace("{{reviewLink}}",d).replace("{{noteLink}}",h).replace("{{scriptLink}}",g)}))}formatDuration(e){const t=Math.floor(e/3600),r=Math.floor(e%3600/60),s=e%60;return t>0?`${String(t).padStart(2,"0")}:${String(r).padStart(2,"0")}:${String(s).padStart(2,"0")}`:`${String(r).padStart(2,"0")}:${String(s).padStart(2,"0")}`}parseVttContent(e){const t=e.split("\n"),r=[];for(let e=0;e<t.length;e++){const s=t[e].trim();s.includes("--\x3e")||("WEBVTT"===s||s.startsWith("X-TIMESTAMP-MAP=")||/^\d+$/.test(s)||""!==s&&r.push(s))}return r.join("\n")}createScriptContent(e,t){return n(this,void 0,void 0,(function*(){const{lecture:r,noteTitle:s}=t,n=this.parseVttContent(e);return`---\ntitle: "${r.title} 자막"\ntags:\n  - script/class101\n---\n\n[[${s}|← 돌아가기]]\n\n${n}`}))}}function d(e){return e.replace(/\[/g,"(").replace(/\]/g,")").replace(/[^\uAC00-\uD7A3a-zA-Z0-9_\(\)\<\>,\s]/g,"").replace(/\s+/g," ").trim()}class h{constructor(e){this.currentClassId=null,this.currentLectureSlug=null,this.baseUrl=e}setContext(e,t){this.currentClassId=e,this.currentLectureSlug=t}convertHtmlToMarkdown(e){return n(this,arguments,void 0,(function*(e,t=[]){try{if(!e)return"";const r=function(e){return e.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,"").replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi,"").replace(/<!--[\s\S]*?-->/g,"")}(e),s=(new DOMParser).parseFromString(r,"text/html");!function(e){var t,r,s;const n=e.evaluate("//h3[contains(text(), '첨부')]",e,null,XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,null);for(let e=0;e<n.snapshotLength;e++){const i=n.snapshotItem(e);if(!i)continue;let o=i;for(;o&&o.nextElementSibling&&o.nextElementSibling instanceof HTMLElement&&!(null===(t=o.nextElementSibling.textContent)||void 0===t?void 0:t.trim().startsWith("수업 노트"));){const e=o.nextElementSibling;null===(r=o.parentNode)||void 0===r||r.removeChild(o),o=e}o&&(null===(s=o.parentNode)||void 0===s||s.removeChild(o))}}(s);let n="";t.length>0&&this.currentClassId&&this.currentLectureSlug&&(n+=`### 첨부 파일\n\n${t.map((e=>{const t=encodeURIComponent(e);return`[${e}](${this.baseUrl}/lecture/_repo/class101/html/classes/${this.currentClassId}/${this.currentLectureSlug}/files/${t})`})).join("\n\n")}\n\n`),n+="### 수업 노트\n\n";return n+=this.processNode(s.body).replace(/### 수업 노트\n\n/g,""),this.cleanupMarkdown(n)}catch(e){return console.error("Error converting HTML to Markdown:",e),""}}))}processNode(e){var t;if(!e)return"";if(e.nodeType===Node.TEXT_NODE){const r=(null===(t=e.textContent)||void 0===t?void 0:t.trim())||"";return r?r+" ":""}if(e.nodeType!==Node.ELEMENT_NODE)return"";const r=e,s=r.tagName.toLowerCase();let n="";const i=Array.from(r.childNodes).map((e=>this.processNode(e))).join("").trim();switch(s){case"h1":n=`# ${i}\n\n`;break;case"h2":n=`## ${i}\n\n`;break;case"h3":n=`### ${i}\n\n`;break;case"h4":n=`#### ${i}\n\n`;break;case"h5":n=`##### ${i}\n\n`;break;case"h6":n=`###### ${i}\n\n`;break;case"p":case"div":n=`${i}\n\n`;break;case"strong":case"b":n=` **${i}** `;break;case"em":case"i":n=` *${i}* `;break;case"a":const e=r.getAttribute("href");n=e?`[${i}](${e})`:i;break;case"img":const t=r.getAttribute("src"),s=function(e){try{if(!/[ì|í|ë|ê|å|ã]/.test(e))return e;const t=e.split("").map((e=>e.charCodeAt(0)));return new TextDecoder("utf-8").decode(new Uint8Array(t))}catch(t){return console.error("Error fixing broken Korean:",t),e}}(r.getAttribute("alt")||"");n=t?`![${s}](${t})\n\n`:"";break;case"ul":n=Array.from(r.children).map((e=>`- ${this.processNode(e)}`)).join("\n\n")+"\n\n";break;case"ol":n=Array.from(r.children).map(((e,t)=>`${t+1}. ${this.processNode(e)}`)).join("\n\n")+"\n\n";break;case"li":default:n=i;break;case"br":n="\n\n";break;case"code":n=`\`${i}\``;break;case"pre":n=`\`\`\`\n${i}\n\`\`\`\n\n`;break;case"blockquote":n=`> ${i}\n\n`}return n}cleanupMarkdown(e){return e.replace(/\*\*([^*\n]+)\*\*(\s*)\*\*/g," **$1** ").replace(/\n{3,}/g,"\n\n").replace(/\s+\n/g,"\n").replace(/\n\s+/g,"\n").replace(/([^\n])\n([^\n])/g,"$1\n\n$2").replace(/^\s+|\s+$/g,"").replace(/(!\[[^\]]*\]\([^)]+\))([^\n])/g,"$1\n\n$2").trim()}parseVTT(e){try{const t=e.split("\n");let r="",s=!0;for(const e of t){if(s){""===e.trim()&&(s=!1);continue}if(/^\d+$/.test(e.trim()))continue;if(e.includes("--\x3e"))continue;if(""===e.trim())continue;if(e.includes("X-TIMESTAMP-MAP"))continue;const t=e.trim();t&&(r+=t+"\n")}return r.trim()}catch(e){return console.error("Error parsing VTT:",e),""}}}class g extends i.Plugin{constructor(){super(...arguments),this.currentClassId=null,this.currentLectureSlug=null}onload(){return n(this,void 0,void 0,(function*(){yield this.loadSettings(),this.apiClient=new a(this.settings.baseUrl),this.fileManager=new u(this.app,this.settings),this.converter=new h(this.settings.baseUrl),console.log("Class101 플러그인이 로드되었습니다."),this.addSettingTab(new l(this.app,this)),this.addCommand({id:"process-single-class",name:"Process Single Class from Clipboard",callback:()=>this.processSingleClass()}),this.addCommand({id:"process-all-classes",name:"Process All Classes from Server",callback:()=>this.processAllClasses()}),this.addCommand({id:"process-in-file",name:"Process Classes from Current File",callback:()=>this.processInFile()}),this.addCommand({id:"create-class-list",name:"Create Class List",callback:()=>this.createClassList()})}))}onunload(){console.log("Class101 플러그인이 언로드되었습니다.")}loadSettings(){return n(this,void 0,void 0,(function*(){this.settings=Object.assign({},o,yield this.loadData())}))}saveSettings(){return n(this,void 0,void 0,(function*(){yield this.saveData(this.settings)}))}extractClassId(e){try{if(console.log("URL 분석:",e),!e.includes("/"))return console.log("직접 입력된 classId:",e),e;if(e.includes("class101.net/ko/classes/")){const t=e.split("classes/")[1].split("/")[0];return console.log("매칭된 classId:",t),t}if(e.includes("class101.net/classes/")){const t=e.split("classes/")[1].split("/")[0];return console.log("매칭된 classId:",t),t}return null}catch(e){return console.error("URL 변환 오류:",e),null}}processSingleClass(){return n(this,void 0,void 0,(function*(){try{const e=yield navigator.clipboard.readText();console.log("클립보드 내용:",e);const t=this.extractClassId(e);if(console.log("추출된 classId:",t),!t)return void new i.Notice("유효한 Class101 URL이 클립보드에 없습니다.");new i.Notice("강의 정보를 가져오고 있습니다..."),yield this.generateMarkdown(t)}catch(e){console.error("Error:",e),new i.Notice(`강의 처리 중 오류가 발생했습니다: ${e.message}`)}}))}processAllClasses(){return n(this,void 0,void 0,(function*(){try{new i.Notice("서버에서 클래스 목록을 가져오는 중...");const e=yield this.apiClient.getClassIds();if(!Array.isArray(e)||0===e.length)return void new i.Notice("처리할 클래스가 없습니다.");new i.Notice(`${e.length}개의 클래스를 처리합니다...`);for(const t of e)try{new i.Notice(`클래스 처리 중: ${t}`),yield this.generateMarkdown(t)}catch(e){console.error(`Error processing class ${t}:`,e),new i.Notice(`클래스 처리 중 오류 발생: ${t}`)}new i.Notice("모든 클래스 처리가 완료되었습니다.")}catch(e){console.error("Error in processAllClasses:",e),new i.Notice("클래스 처리 중 오류가 발생했습니다.")}}))}processInFile(){return n(this,void 0,void 0,(function*(){try{const e=this.app.workspace.getActiveFile();if(!e)return void new i.Notice("처리할 파일이 선택되지 않았습니다.");const t=yield this.app.vault.read(e);console.log("파일 내용:",t);const r=t.split("\n").map((e=>e.trim().replace(/\s+/g,"")));console.log("분리된 줄:",r);const s=r.filter((e=>{const t=e.length>20&&/^[a-zA-Z0-9\/:]+$/.test(e);return console.log(`라인 "${e}": 길이=${e.length}, 유효성=${t}`),t}));if(console.log("유효한 줄:",s),0===s.length)return void new i.Notice("처리할 유효한 classId/URL이 없습니다.");new i.Notice(`${s.length}개의 클래스를 처리합니다...`);for(const e of s)try{const t=this.extractClassId(e);console.log(`처리 중인 라인: "${e}", 추출된 classId: ${t}`),t&&(new i.Notice(`클래스 처리 중: ${t}`),yield this.generateMarkdown(t))}catch(t){console.error(`Error processing class ${e}:`,t),new i.Notice(`클래스 처리 중 오류 발생: ${e}`)}new i.Notice("모든 클래스 처리가 완료되었습니다.")}catch(e){console.error("Error in processInFile:",e),new i.Notice("클래스 처리 중 오류가 발생했습니다.")}}))}createClassList(){return n(this,void 0,void 0,(function*(){try{const e=yield this.apiClient.getAllClasses();yield this.fileManager.createClassList(e)}catch(e){console.error("Error in createClassList:",e),new i.Notice("클래스 목록 생성 중 오류가 발생했습니다.")}}))}generateMarkdown(e){return n(this,void 0,void 0,(function*(){try{this.currentClassId=e;const[t,r]=yield Promise.all([this.apiClient.getAllClasses(),this.apiClient.getClassInfo(e)]),s=r.lectures,n=t.find((t=>t.classId===e));if(!n)throw new Error(`Class ID ${e} not found in myclasses.json`);const o=n.title,l=yield this.apiClient.getCategory(e),a=d(o),c=[],u={lectures:this.fileManager.getPath("lectures",a),reviews:this.fileManager.getPath("reviews",a),notes:this.fileManager.getPath("notes",a),scripts:this.fileManager.getPath("scripts",a),classes:this.fileManager.getPath("classes")};for(const e of Object.values(u))yield this.fileManager.ensureFolder(e);for(let t=0;t<s.length;t++){const r=s[t],n=this.getLectureSlug(r),h=`${r.sn.toString().padStart(3,"0")}_${d(r.title)}`;c.push(h),new i.Notice(`강의 처리 중: ${h}`),this.currentLectureSlug=n,yield this.processLecture({lecture:r,classId:e,classTitle:o,category:l,sanitizedClassTitle:a,noteTitle:h,paths:u,prevNoteTitle:t>0?c[t-1]:null,nextNoteTitle:t<s.length-1?`${s[t+1].sn.toString().padStart(3,"0")}_${d(s[t+1].title)}`:null})}yield this.fileManager.createClassIndex({classTitle:o,noteTitles:c,category:l,sanitizedClassTitle:a,classId:e}),new i.Notice(`${o} 강의 처리가 완료되었습니다.`)}catch(e){throw console.error("Error in generateMarkdown:",e),e}}))}getLectureSlug(e){return`${e.sn.toString().padStart(3,"0")}_${e.lectureId}`}processLecture(e){return n(this,void 0,void 0,(function*(){const{lecture:t,classId:r,classTitle:s,category:n,sanitizedClassTitle:i,noteTitle:o,paths:l,prevNoteTitle:a,nextNoteTitle:c}=e,u=`https://class101.net/ko/classes/${r}/lectures/${t.lectureId}`,d=this.getLectureSlug(t);try{const e=yield this.apiClient.getLectureNote(r,d),t=yield this.apiClient.getLectureAttachments(r,d),s=yield this.converter.convertHtmlToMarkdown(e,t);if(s){const e=this.fileManager.getFilePath(l.notes,`${o}_note.md`);yield this.fileManager.createFile(e,s)}}catch(e){console.log(`No note content found for lecture ${d}`)}try{const e=yield this.apiClient.getLectureScript(i,o);if(e){const r=yield this.fileManager.createScriptContent(e,{lecture:t,noteTitle:o}),s=this.fileManager.getFilePath(l.scripts,`${o}_script.md`);yield this.fileManager.createFile(s,r)}}catch(e){console.log(`No script content found for lecture ${d}`)}const h=yield this.fileManager.getReviewTemplate(),g=`${this.settings.baseUrl}/lecture/class101/${i}/${o}.mkv`,f=this.fileManager.createReviewContent({template:h,lectureTitle:t.title,source:u,videoUrl:g,noteTitle:o}),p=this.fileManager.getFilePath(l.reviews,`${o}_review.md`);yield this.fileManager.createFile(p,f);const v=yield this.fileManager.createLectureMarkdown({lecture:t,classTitle:s,noteTitle:o,source:u,category:n,sanitizedClassTitle:i,prevNoteTitle:a,nextNoteTitle:c,classId:r}),y=this.fileManager.getFilePath(l.lectures,`${o}.md`);yield this.fileManager.createFile(y,v)}))}}var f=exports;for(var p in s)f[p]=s[p];s.__esModule&&Object.defineProperty(f,"__esModule",{value:!0})})();