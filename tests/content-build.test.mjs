import {test} from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {mkdtemp,writeFile,readFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
test('fixed release inputs cannot fall back to baseline on missing files, wrong site or hash',async()=>{
 const dir=await mkdtemp(join(tmpdir(),'cms-build-')),file=join(dir,'snapshot.json');
 const base=JSON.parse(await readFile('content/baseline.snapshot.json','utf8'));
 const env={PATH:process.env.PATH,CONTENT_BASELINE:'1',CONTENT_RELEASE_ID:base.releaseId,CONTENT_SNAPSHOT_PATH:file,CONTENT_SNAPSHOT_HASH:'0'.repeat(64)};
 const run=e=>spawnSync(process.execPath,['scripts/prepare-content.mjs'],{env:e,encoding:'utf8'});
 assert.notEqual(run({...env,CONTENT_SNAPSHOT_PATH:undefined}).status,0);
 assert.notEqual(run(env).status,0);
 await writeFile(file,JSON.stringify({...base,siteId:'footwear'}));assert.notEqual(run(env).status,0);
 await writeFile(file,JSON.stringify(base));assert.notEqual(run(env).status,0);
 assert.notEqual(run({PATH:process.env.PATH}).status,0);
});
