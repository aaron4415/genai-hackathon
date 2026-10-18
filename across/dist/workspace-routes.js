// UI routing only; workspace selection is not authentication or access control.
const candidate = {
  '': 'candidate', overview:'candidate', discover:'discover', saved:'saved',
  applications:'applications', details:'profile', cv:'cv-demo', 'cv-editor':'cv',
  profile:'talent-profile', apply:'apply', tools:'tools', resources:'resources'
};
const employer = {
  '':'employer', overview:'employer', jobs:'vacancies', marketing:'marketing',
  talent:'talent', tools:'tools', resources:'resources'
};
const routes={candidate,employer};
const owner={candidate:'candidate',discover:'candidate',saved:'candidate',applications:'candidate',profile:'candidate',cv:'candidate','cv-demo':'candidate','talent-profile':'candidate',apply:'candidate',employer:'employer',vacancies:'employer',marketing:'employer',talent:'employer'};
export function resolveWorkspaceRoute(value='',currentWorkspace='candidate'){
  const raw=String(value).replace(/^#/,'');
  const parts=raw.split('/');
  const scoped=parts.length>1&&Object.hasOwn(routes,parts[0]);
  const legacyOwner=Object.hasOwn(owner,raw)?owner[raw]:null;
  const workspace=scoped?parts[0]:legacyOwner||(currentWorkspace==='employer'?'employer':'candidate');
  const table=routes[workspace];
  const view=scoped?(parts.length===2&&Object.hasOwn(table,parts[1])?table[parts[1]]:null):legacyOwner?raw:['tools','resources'].includes(raw)?raw:null;
  const target=view||table[''];
  const slug=Object.keys(table).find(key=>table[key]===target)||'';
  return {workspace,view:target,hash:workspace+(slug?'/'+slug:'')};
}
