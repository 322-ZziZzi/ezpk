import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const source=fs.readFileSync(path.join(root,'worker.js'),'utf8');
const mySource=fs.readFileSync(path.join(root,'my','my.js'),'utf8');
function take(start,end){const a=source.indexOf(start);const b=source.indexOf(end,a);if(a<0||b<0)throw new Error(`missing source block ${start}`);return source.slice(a,b)}
const code=[
  take('const DEFAULT_PROMOTION_RULES','async function getPromotionRules'),
  take('function industryNumber','async function memberActivityStatus'),
].join('\n')+'\nthis.OUT={DEFAULT_PROMOTION_RULES,canonicalPromotionRule,promotionRuleInput,promotionState};';
const ctx={structuredClone}; vm.createContext(ctx); vm.runInContext(code,ctx);
const {DEFAULT_PROMOTION_RULES,canonicalPromotionRule,promotionRuleInput,promotionState}=ctx.OUT;
const helperStart=mySource.indexOf('function promotionRequiredPowerText');
const helperEnd=mySource.indexOf('function promotionCurrentState',helperStart);
if(helperStart<0||helperEnd<0)throw new Error('member-facing promotion display helper missing');
const myCtx={};vm.createContext(myCtx);vm.runInContext(mySource.slice(helperStart,helperEnd)+';this.format=promotionRequiredPowerText;',myCtx);
const checks=[];
function check(name,actual,expected){const pass=JSON.stringify(actual)===JSON.stringify(expected);checks.push({name,pass,actual,expected});if(!pass)throw new Error(`${name}: ${JSON.stringify(actual)} != ${JSON.stringify(expected)}`)}
const m=promotionRuleInput({industryLevel:7,vehicle1PowerValue:500,vehicle1PowerUnit:'M'});
check('500M normalized',{value:m.vehicle1PowerValue,unit:m.vehicle1PowerUnit,normalized:m.vehicle1PowerNormalized},{value:500,unit:'M',normalized:500});
const g=promotionRuleInput({industryLevel:7,vehicle1PowerValue:.5,vehicle1PowerUnit:'G'});
check('0.5G normalized',{value:g.vehicle1PowerValue,unit:g.vehicle1PowerUnit,normalized:g.vehicle1PowerNormalized},{value:.5,unit:'G',normalized:500});
const legacy=canonicalPromotionRule({industryLevel:7,vehicle1PowerNormalized:500},DEFAULT_PROMOTION_RULES.R2);
check('legacy normalized-only rule stays backward compatible',{value:legacy.vehicle1PowerValue,unit:legacy.vehicle1PowerUnit,normalized:legacy.vehicle1PowerNormalized},{value:.5,unit:'G',normalized:500});
const stored=canonicalPromotionRule({industryLevel:7,vehicle1PowerNormalized:500,vehicle1PowerValue:500,vehicle1PowerUnit:'M'},DEFAULT_PROMOTION_RULES.R2);
check('stored M display preserved',{value:stored.vehicle1PowerValue,unit:stored.vehicle1PowerUnit,normalized:stored.vehicle1PowerNormalized},{value:500,unit:'M',normalized:500});
const rules={R2:stored,R3:promotionRuleInput({industryLevel:8,vehicle1PowerValue:1.3,vehicle1PowerUnit:'G'})};
const state=promotionState({member_rank:'R1',industry_level:'I7',vehicle1_power_normalized:500,status:'active',approval_status:'approved'},rules,{eligible:true});
check('promotion state preserves required display',{requiredValue:state.vehicle1.requiredValue,requiredUnit:state.vehicle1.requiredUnit,requiredNormalized:state.vehicle1.requiredNormalized,passed:state.vehicle1.passed},{requiredValue:500,requiredUnit:'M',requiredNormalized:500,passed:true});
check('member-facing M display',myCtx.format(state.vehicle1),'500M');
check('member-facing G display',myCtx.format({requiredValue:.5,requiredUnit:'G',requiredNormalized:500}),'0.5G');
const result={version:'v434',pass:checks.every(x=>x.pass),checks};
const out=process.argv[2];if(out)fs.writeFileSync(out,JSON.stringify(result,null,2)+'\n');else console.log(JSON.stringify(result,null,2));
