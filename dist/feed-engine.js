export const clone=x=>structuredClone(x);
export const present=x=>x==null?'—':typeof x==='object'?JSON.stringify(x):String(x);
const empty=v=>v==null||v===''||(Array.isArray(v)&&!v.length);
export function number(value,decimal='auto'){
 let s=String(value??'').trim().replace(/[\s\u00a0]/g,'').replace(/(?:руб\.?|₽|м²|m²|RUB|USD|KZT)$/i,'');
 if(decimal==='comma')s=s.replace(/\./g,'').replace(',','.');else if(decimal==='dot')s=s.replace(/,/g,'');else if(s.includes(',')&&s.includes('.'))s=s.lastIndexOf(',')>s.lastIndexOf('.')?s.replace(/\./g,'').replace(',','.'):s.replace(/,/g,'');else s=s.replace(',','.');
 if(!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(s))throw Error('Не удалось распознать число. Укажите числовое значение или исправьте источник.');const n=Number(s);if(!Number.isFinite(n))throw Error('Число вне допустимого диапазона');return n;
}
// A small expression grammar, deliberately without JavaScript evaluation or object access.
export function expression(code,value,record={}){
 const src=String(code).trim().replace(/^return\s+/,'').replace(/;$/,'');if(src.length>1500)throw Error('Формула слишком длинная');
 const tokens=[];const re=/\s*(?:(\d+(?:\.\d+)?)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|([A-Za-z_][A-Za-z_0-9]*(?:\.[A-Za-z_]+)?)|(===|!==|==|!=|>=|<=|&&|\|\||[+*/%<>()!,?:-]))/gy;
 let at=0;while(at<src.length){re.lastIndex=at;const m=re.exec(src);if(!m)throw Error('Неизвестный символ в формуле');tokens.push({v:m[1]??m[2]??m[3]??m[4],type:m[1]?'n':m[2]?'s':m[3]?'id':'op'});at=re.lastIndex;}tokens.push({v:'END'});let pos=0;
 const peek=()=>tokens[pos]?.v, take=v=>{if(peek()!==v)throw Error('Ожидалось «'+v+'»');pos++};
 const funcs={num:number,round:Math.round,floor:Math.floor,ceil:Math.ceil,abs:Math.abs,min:Math.min,max:Math.max,len:v=>String(v??'').length,src:p=>record[String(p)],'Math.round':Math.round,'Math.floor':Math.floor,'Math.ceil':Math.ceil,'Math.abs':Math.abs,'Math.min':Math.min,'Math.max':Math.max};
 const precedence={'||':1,'&&':2,'===':3,'!==':3,'==':3,'!=':3,'>':4,'<':4,'>=':4,'<=':4,'+':5,'-':5,'*':6,'/':6,'%':6};
 function atom(depth){if(depth>40)throw Error('Формула слишком вложенная');const t=tokens[pos++];if(!t)throw Error('Незавершённая формула');if(t.type==='n')return ()=>Number(t.v);if(t.type==='s'){const s=t.v.slice(1,-1).replace(/\\(['"\\])/g,'$1');return ()=>s;}if(t.v==='('){const n=parse(0,depth+1);take(')');return n;}if(['!','-','+'].includes(t.v)){const n=atom(depth+1);return ()=>t.v==='!'?!n():t.v==='-'?-n():+n();}if(t.v==='value')return ()=>value;if(t.v==='true'||t.v==='false'||t.v==='null')return ()=>({true:true,false:false,null:null})[t.v];if(t.type==='id'&&Object.hasOwn(funcs,t.v)){take('(');const args=[];if(peek()!==')'){do{if(args.length)take(',');args.push(parse(0,depth+1));}while(peek()===',')}take(')');return ()=>funcs[t.v](...args.map(f=>f()));}throw Error('Разрешены value, src(), num(), round(), floor(), ceil(), abs(), min(), max(), len()');}
 function parse(min=0,depth=0){let left=atom(depth);while(Object.hasOwn(precedence,peek())&&precedence[peek()]>=min){const op=tokens[pos++].v,right=parse(precedence[op]+1,depth+1),a=left;left=()=>{const x=a();if(op==='&&')return x&&right();if(op==='||')return x||right();const y=right();switch(op){case '+':return x+y;case '-':return x-y;case '*':return x*y;case '/':if(y===0)throw Error('Деление на ноль');return x/y;case '%':return x%y;case '===':case '==':return x===y;case '!==':case '!=':return x!==y;case '>':return x>y;case '<':return x<y;case '>=':return x>=y;case '<=':return x<=y;}};}if(min===0&&peek()==='?'){pos++;const yes=parse(0,depth+1);take(':');const no=parse(0,depth+1),test=left;left=()=>test()?yes():no();}return left;}
 const result=parse();take('END');return result();
}
export function transform(value,step,record){const p=step.params||{},s=String(value??'');switch(step.type){
 case 'trim':return typeof value==='string'?value.trim():value;
 case 'required':if(empty(value))throw Error('Обязательное значение отсутствует');return value;
 case 'number_clean':return number(value,p.decimal);
 case 'to_int':return Math.trunc(number(value));
 case 'number_format':{const n=number(value),k=10**Math.min(8,Math.max(0,Number(p.decimals)||0));return ({round:Math.round,floor:Math.floor,ceil:Math.ceil}[p.round]||Math.round)(n*k)/k;}
 case 'default_value':return empty(value)?p.value:value;
 case 'dictionary':{const norm=x=>p.ci===false?String(x):String(x).toLowerCase(),row=(p.rows||[]).find(r=>norm(r.from)===norm(value));if(row)return row.to;if(!empty(p.fallback))return p.fallback;throw Error('Нет соответствия для «'+s+'». Добавьте его в словарь.');}
 case 'to_boolean':{const check=k=>String(p[k]||'').split(',').map(t=>t.trim().toLowerCase()).includes(s.toLowerCase());if(check('truthy'))return true;if(check('falsy'))return false;if(p.fallback==='true'||p.fallback==='false')return p.fallback==='true';throw Error('Не удалось распознать Да/Нет');}
 case 'convert_case':return p.mode==='upper'?s.toUpperCase():p.mode==='ucfirst'?s.charAt(0).toUpperCase()+s.slice(1):p.mode==='title'?s.replace(/\S+/g,w=>w.charAt(0).toUpperCase()+w.slice(1).toLowerCase()):s.toLowerCase();
 case 'find_replace':{if(!p.search)return value;if(!p.ci)return s.split(p.search).join(p.replace||'');let start=0,out='',ix;const lower=s.toLowerCase(),term=String(p.search).toLowerCase();while((ix=lower.indexOf(term,start))>=0){out+=s.slice(start,ix)+(p.replace||'');start=ix+term.length;}return out+s.slice(start);}
 case 'regex':throw Error('Regex не исполняется в этом макете. Используйте «Найти и заменить».');
 case 'truncate':return s.length>Number(p.limit)?s.slice(0,Math.max(0,Number(p.limit)))+(p.ellipsis??'…'):s;
 case 'template':return String(p.template||'').replace(/\{\{\s*(value|field:[^}]+)\s*\}\}/g,(_,key)=>present(key.trim()==='value'?value:record[key.replace('field:','').trim()]).replace(/^—$/,''));
 case 'math':case 'expression':return expression(p.expr??p.code??'value',value,record);
 case 'strip_tags':return s.replace(/<[^>]*>/g,'').replace(/\s+/g,' ').trim();
 case 'html_decode':return s.replace(/&(amp|lt|gt|quot|apos|nbsp|#39);/g,(_,k)=>({amp:'&',lt:'<',gt:'>',quot:'"',apos:"'",nbsp:' ','#39':"'"})[k]);
 case 'explode':return s.split(p.delimiter||';').map(v=>v.trim());
 case 'implode':return Array.isArray(value)?value.join(p.glue??', '):value;
 case 'unique':return Array.isArray(value)?[...new Set(value)]:value;
 case 'array_filter':return Array.isArray(value)?value.filter(v=>!empty(v)):value;
 case 'limit':return Array.isArray(value)?value.slice(0,Math.max(0,Number(p.max)||0)):value;
 case 'absolute_url':{const url=v=>{try{const u=new URL(v,p.base||undefined);if(!['http:','https:'].includes(u.protocol))throw Error();return u.href;}catch{throw Error('Укажите полный HTTP(S)-адрес или базовый URL');}};return Array.isArray(value)?value.map(url):url(s);}
 case 'strtotime':case 'date_format':{const t=Date.parse(s);if(!Number.isFinite(t))throw Error('Не удалось распознать дату');return step.type==='strtotime'?Math.floor(t/1000):new Date(t).toISOString().slice(0,10);}
 case 'keyword_filter':{const keys=String(p.keywords||'').split(',').map(k=>k.trim().toLowerCase()).filter(Boolean);if(!keys.some(k=>s.toLowerCase().includes(k)))throw Error('Запись не содержит заданных ключевых слов');return value;}
 case 'geocode':throw Error('Для геокодирования требуется подключённый сервис');
 default:throw Error('Неизвестное преобразование');}}
export function run(field,m,record){const stages=[];let value=null,error=null;const mapped=m&&m.mode!=='empty'&&(m.mode==='const'||m.source||(m.steps||[]).some(s=>s.enabled!==false&&['template','expression'].includes(s.type)));if(!mapped)return {final:null,stages,empty:true,error:field.required?'Не задан источник обязательного поля':null};value=m.mode==='const'?m.const:record[m.source];stages.push({label:'Исходное значение',value});try{for(const step of m.steps||[]){if(step.enabled===false)continue;value=transform(value,step,record);stages.push({id:step.id,value});}if(field.required&&empty(value))throw Error('Обязательное значение отсутствует');if(!empty(value)){if(field.type==='number'&&(typeof value!=='number'||!Number.isFinite(value)))throw Error('Ожидается число. Добавьте преобразование числа.');if(field.type==='enum'&&field.enumv&&!field.enumv.includes(value))throw Error('Значение «'+present(value)+'» не входит в допустимые. Настройте словарь.');if(field.type==='bool'&&typeof value!=='boolean')throw Error('Ожидается Да/Нет. Добавьте логическое преобразование.');if(field.type==='collection'&&!Array.isArray(value))throw Error('Ожидается список. Добавьте разбиение по разделителю.');}}catch(err){error=err.message;}return {final:value,stages,error,empty:empty(value)};}
export function assess(fields,mapping,samples){const results=fields.map(field=>({field,traces:samples.map(s=>run(field,mapping[field.key],s.data))}));const issues=results.flatMap(r=>r.traces.flatMap((trace,index)=>trace.error?[{field:r.field,index,record:samples[index]._id,message:trace.error}]:[]));return {results,issues,required:results.filter(r=>r.field.required).length,covered:results.filter(r=>r.field.required&&r.traces.length&&r.traces.every(t=>!t.error&&!t.empty)).length,mapped:results.filter(r=>r.traces.some(t=>!t.empty)).length};}
