import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync}from'node:fs';
import {projections}from'./sync-i18n.mjs';
const config=JSON.parse(readFileSync(new URL('../i18n.config.json',import.meta.url)));
test('additional language projects types, menu input, static loader and contract',()=>{
 const fixture={...config,locales:[...config.locales,{tag:'ja-JP',label:'日本語',direction:'ltr',catalog:'./messages/ja-JP',export:'jaJP'}]};
 const files=projections(fixture,{i18n:{},keep:true});
 assert.match(files.get(`${config.output}/catalogs.generated.ts`),/messages\/ja-JP/);
 assert.match(files.get(`${config.output}/registry.generated.ts`),/日本語/);
 assert.ok(JSON.parse(files.get('app.contract.json')).i18n.supportedLocales.includes('ja-JP'));
 assert.equal(JSON.parse(files.get('app.contract.json')).keep,true);
 assert.deepEqual(projections(fixture,{i18n:{},keep:true}),files);
 assert.throws(()=>projections({...fixture,defaultLocale:'xx-XX'},{i18n:{}}));
});
