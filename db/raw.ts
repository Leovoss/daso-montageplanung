import { env } from 'cloudflare:workers';
export function db(): D1Database { if(!env.DB) throw new Error('Datenbank nicht verfügbar'); return env.DB; }
export function bucket(): R2Bucket { if(!env.BUCKET) throw new Error('Dateispeicher nicht verfügbar'); return env.BUCKET; }
export type AccessRole='planer'|'obermonteur'|'monteur';
export type CurrentUser={id:string;email:string;name:string;accessRole:AccessRole;resourceId:string|null};
export async function currentUser(r:Request):Promise<CurrentUser|null>{
  const email=r.headers.get('cf-access-authenticated-user-email')?.trim().toLowerCase();
  if(!email) return null;
  const row=await db().prepare('SELECT * FROM users WHERE email=?').bind(email).first<any>();
  if(!row) return null;
  return {id:row.id,email:row.email,name:row.name,accessRole:row.access_role,resourceId:row.resource_id};
}
