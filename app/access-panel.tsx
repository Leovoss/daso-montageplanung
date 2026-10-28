'use client';
import { useState } from 'react';
import { Archive, ArchiveRestore, Check, KeyRound, Pencil, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export type AppUser = { id: string; email: string; name: string; access_role: string; resource_id: string | null };
export type AuditEntry = { id: string; at: string; actor_name: string; actor_email: string; action: string; target: string };
type Person = { id: string; name: string; role: string; archived_at?: string | null };

const roles: Record<string, string> = { planer: 'Planer', obermonteur: 'Obermonteur', monteur: 'Monteur' };
const actions: Record<string, string> = {
  user: 'Zugang gespeichert', deleteUser: 'Zugang entfernt', employee: 'Mitarbeiter gespeichert',
  resource: 'Ressource gespeichert', archiveResource: 'Mitarbeiter archiviert', restoreResource: 'Mitarbeiter wiederhergestellt',
  deleteResource: 'Ressource gelöscht', project: 'Projekt gespeichert', archiveProject: 'Projekt archiviert',
  restoreProject: 'Projekt wiederhergestellt', deleteProject: 'Projekt gelöscht', assign: 'Einteilung angelegt',
  deleteAssignment: 'Einteilung gelöscht', unassign: 'Einteilungen entfernt', customer: 'Kunde gespeichert',
  deleteCustomer: 'Kunde gelöscht', contact: 'Ansprechpartner gespeichert', deleteContact: 'Ansprechpartner gelöscht',
};
const blank = { userId: '', resourceId: '', name: '', role: 'Monteur', email: '', accessRole: 'monteur' };

export function AccessPanel({ users, employees, audit, mutate }: { users: AppUser[]; employees: Person[]; audit: AuditEntry[]; mutate: (body: unknown, close?: boolean) => Promise<boolean> }) {
  const [form, setForm] = useState(blank);
  const [edit, setEdit] = useState<(typeof blank & { key: string }) | null>(null);
  const set = (k: keyof typeof blank, v: string) => setForm(f => ({ ...f, [k]: v }));
  const setE = (k: keyof typeof blank, v: string) => setEdit(f => f && { ...f, [k]: v });
  const userOf = (rid: string) => users.find(u => u.resource_id === rid);
  const ordered = [...employees.filter(e => !e.archived_at), ...employees.filter(e => e.archived_at)];
  const loose = users.filter(u => !employees.some(e => e.id === u.resource_id));

  const send = (f: typeof blank) => mutate(f.role
    ? { action: 'employee', id: f.resourceId || undefined, name: f.name, role: f.role, email: f.email.trim(), accessRole: f.accessRole }
    : { action: 'user', id: f.userId || undefined, name: f.name, email: f.email.trim(), accessRole: f.accessRole, resourceId: null }, false);
  const add = async () => { if (await send(form)) setForm(blank); };
  const saveEdit = async () => { if (edit && await send(edit)) setEdit(null); };

  const editEmployee = (e: Person) => {
    const u = userOf(e.id);
    setEdit({ key: e.id, userId: u?.id || '', resourceId: e.id, name: e.name, role: e.role === 'Obermonteur' ? 'Obermonteur' : 'Monteur', email: u?.email || '', accessRole: u?.access_role || 'monteur' });
  };
  const removeAccess = (u: AppUser) => {
    if (window.confirm(`Zugang von ${u.name} entfernen?`)) mutate({ action: 'deleteUser', id: u.id }, false);
  };
  const valid = (f: typeof blank) => f.name.trim() && (f.role || f.email.trim());
  const accessSelect = (f: typeof blank, on: (k: keyof typeof blank, v: string) => void) => (
    <NativeSelect value={f.accessRole} onChange={e => on('accessRole', e.target.value)}>
      {Object.entries(roles).map(([k, v]) => <NativeSelectOption key={k} value={k}>{v}</NativeSelectOption>)}
    </NativeSelect>
  );
  const saveCancel = (f: typeof blank) => (
    <div className="button-row justify-end">
      <Button variant="ghost" size="icon" aria-label="Speichern" title="Speichern" disabled={!valid(f)} onClick={saveEdit}><Check /></Button>
      <Button variant="ghost" size="icon" aria-label="Abbrechen" title="Abbrechen" onClick={() => setEdit(null)}><X /></Button>
    </div>
  );

  return (
    <section className="panel resource-panel">
      <div className="section-heading">
        <div>
          <h2>Mitarbeiter und Zugänge</h2>
          <p>Hier legst du Mitarbeiter an, vergibst den Zugang per Firmen-E-Mail und archivierst, wer das Unternehmen verlässt. Archivierte bleiben in alten Auswertungen, sind aber nicht mehr in der Planung und können sich nicht mehr anmelden.</p>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '1rem', alignItems: 'end', padding: '1rem 1.25rem' }}>
        <div className="form-field"><Label>Name</Label><Input value={form.name} onChange={e => set('name', e.target.value)} /></div>
        <div className="form-field">
          <Label>Funktion</Label>
          <NativeSelect value={form.role} onChange={e => set('role', e.target.value)}>
            <NativeSelectOption value="Monteur">Monteur</NativeSelectOption>
            <NativeSelectOption value="Obermonteur">Obermonteur</NativeSelectOption>
            <NativeSelectOption value="">Nur Zugang, kein Mitarbeiter</NativeSelectOption>
          </NativeSelect>
        </div>
        <div className="form-field"><Label>E-Mail für den Zugang</Label><Input type="email" placeholder="optional" value={form.email} onChange={e => set('email', e.target.value)} /></div>
        <div className="form-field">
          <Label>Zugriffsrolle</Label>
          {accessSelect(form, set)}
        </div>
        <div className="button-row">
          <Button disabled={!valid(form)} onClick={add}>Hinzufügen</Button>
        </div>
      </div>
      <Table>
        <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Funktion</TableHead><TableHead>Zugang</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Aktionen</TableHead></TableRow></TableHeader>
        <TableBody>
          {ordered.map(e => {
            const u = userOf(e.id);
            const archived = !!e.archived_at;
            if (edit?.key === e.id) return (
              <TableRow key={e.id}>
                <TableCell><Input value={edit.name} onChange={x => setE('name', x.target.value)} /></TableCell>
                <TableCell>
                  <NativeSelect value={edit.role} onChange={x => setE('role', x.target.value)}>
                    <NativeSelectOption value="Monteur">Monteur</NativeSelectOption>
                    <NativeSelectOption value="Obermonteur">Obermonteur</NativeSelectOption>
                  </NativeSelect>
                </TableCell>
                <TableCell><div style={{ display: 'grid', gap: '.5rem' }}><Input type="email" placeholder="E-Mail, leer = kein Zugang" value={edit.email} onChange={x => setE('email', x.target.value)} />{accessSelect(edit, setE)}</div></TableCell>
                <TableCell>{archived ? 'Archiviert' : 'Aktiv'}</TableCell>
                <TableCell>{saveCancel(edit)}</TableCell>
              </TableRow>
            );
            return (
              <TableRow key={e.id} style={archived ? { opacity: 0.6 } : undefined}>
                <TableCell><b>{e.name}</b></TableCell>
                <TableCell>{e.role}</TableCell>
                <TableCell>{u ? <>{u.email}<br /><small>{roles[u.access_role] || u.access_role}</small></> : <small>Kein Zugang</small>}</TableCell>
                <TableCell>{archived ? 'Archiviert' : 'Aktiv'}</TableCell>
                <TableCell>
                  <div className="button-row justify-end">
                    <Button variant="ghost" size="icon" aria-label={e.name + ' bearbeiten'} title="Bearbeiten" onClick={() => editEmployee(e)}><Pencil /></Button>
                    <Button variant="ghost" size="icon" aria-label={e.name + (archived ? ' wiederherstellen' : ' archivieren')} title={archived ? 'Wiederherstellen' : 'Archivieren'} onClick={() => mutate({ action: 'archiveResource', id: e.id, archived: !archived }, false)}>{archived ? <ArchiveRestore /> : <Archive />}</Button>
                    {u && <Button variant="ghost" size="icon" aria-label={'Zugang von ' + e.name + ' entfernen'} title="Zugang entfernen" onClick={() => removeAccess(u)}><KeyRound /></Button>}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
          {loose.map(u => edit?.key === u.id ? (
            <TableRow key={u.id}>
              <TableCell><Input value={edit.name} onChange={x => setE('name', x.target.value)} /></TableCell>
              <TableCell><small>Kein Mitarbeiter</small></TableCell>
              <TableCell><div style={{ display: 'grid', gap: '.5rem' }}><Input type="email" value={edit.email} onChange={x => setE('email', x.target.value)} />{accessSelect(edit, setE)}</div></TableCell>
              <TableCell>Aktiv</TableCell>
              <TableCell>{saveCancel(edit)}</TableCell>
            </TableRow>
          ) : (
            <TableRow key={u.id}>
              <TableCell><b>{u.name}</b></TableCell>
              <TableCell><small>Kein Mitarbeiter</small></TableCell>
              <TableCell>{u.email}<br /><small>{roles[u.access_role] || u.access_role}</small></TableCell>
              <TableCell>Aktiv</TableCell>
              <TableCell>
                <div className="button-row justify-end">
                  <Button variant="ghost" size="icon" aria-label={u.name + ' bearbeiten'} title="Bearbeiten" onClick={() => setEdit({ key: u.id, userId: u.id, resourceId: '', name: u.name, role: '', email: u.email, accessRole: u.access_role })}><Pencil /></Button>
                  <Button variant="ghost" size="icon" aria-label={'Zugang von ' + u.name + ' entfernen'} title="Zugang entfernen" onClick={() => removeAccess(u)}><Trash2 /></Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <details style={{ padding: '1rem 1.25rem' }}>
        <summary style={{ cursor: 'pointer', fontWeight: 600 }}>Verlauf ({audit.length})</summary>
        {audit.length === 0 ? <p style={{ marginTop: '.75rem' }}>Noch keine Einträge.</p> : (
          <Table>
            <TableHeader><TableRow><TableHead>Zeitpunkt</TableHead><TableHead>Von</TableHead><TableHead>Aktion</TableHead><TableHead>Betrifft</TableHead></TableRow></TableHeader>
            <TableBody>
              {audit.map(a => (
                <TableRow key={a.id}>
                  <TableCell>{new Date(a.at).toLocaleString('de-DE', { dateStyle: 'short', timeStyle: 'short' })}</TableCell>
                  <TableCell>{a.actor_name || a.actor_email}</TableCell>
                  <TableCell>{actions[a.action] || a.action}</TableCell>
                  <TableCell>{a.target}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </details>
    </section>
  );
}
