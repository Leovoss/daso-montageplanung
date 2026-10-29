'use client';
import { useState } from 'react';
import { Check, Undo2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { workdays } from '@/lib/workdays';

export type VacationRequest = { id: string; resource_id: string; start_day: string; end_day: string; note: string; status: string; created_at: string; decided_at: string | null; decided_by: string };
type Named = { id: string; name: string };
type Slot = { resource_id: string; project_id: string | null; day: string; assignment_type: string };

const labels: Record<string, string> = { pending: 'Offen', approved: 'Genehmigt', rejected: 'Abgelehnt', withdrawn: 'Zurückgezogen' };
const de = (d: string) => d.split('-').reverse().join('.');
const period = (r: VacationRequest) => (r.start_day === r.end_day ? de(r.start_day) : `${de(r.start_day)} bis ${de(r.end_day)}`);
const dayCount = (r: VacationRequest) => workdays(r.start_day, r.end_day).length;
const plural = (n: number) => `${n} Arbeitstag${n === 1 ? '' : 'e'}`;

export function VacationPanel({ me, requests, resources, assignments, projects, mutate }: {
  me?: { accessRole: string; resourceId: string | null };
  requests: VacationRequest[];
  resources: Named[];
  assignments: Slot[];
  projects: Named[];
  mutate: (body: unknown, close?: boolean) => Promise<boolean>;
}) {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [note, setNote] = useState('');
  const planer = me?.accessRole === 'planer';
  const today = new Date().toLocaleDateString('sv-SE');
  const nameOf = (id: string) => resources.find(r => r.id === id)?.name || 'Unbekannt';
  const pending = requests.filter(r => r.status === 'pending');
  const decided = requests.filter(r => r.status !== 'pending').slice(0, 30);
  const mine = requests.filter(r => r.resource_id === me?.resourceId);
  const preview = start && end && end >= start ? plural(workdays(start, end).length) : '';

  async function send() {
    if (await mutate({ action: 'requestVacation', start, end, note: note.trim() }, false)) { setStart(''); setEnd(''); setNote(''); }
  }

  function clash(r: VacationRequest) {
    const days = workdays(r.start_day, r.end_day);
    const hits = assignments.filter(a => a.resource_id === r.resource_id && days.includes(a.day) && a.assignment_type !== 'vacation');
    if (!hits.length) return '';
    const names = [...new Set(hits.map(a => projects.find(p => p.id === a.project_id)?.name || a.assignment_type))].join(', ');
    const n = new Set(hits.map(a => a.day)).size;
    return `An ${n} Tag${n === 1 ? '' : 'en'} bereits eingeteilt (${names}). Bei Genehmigung werden diese Einteilungen ersetzt.`;
  }

  return (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      {planer && (
        <section className="panel resource-panel">
          <div className="section-heading">
            <div>
              <h2>Offene Urlaubsanträge ({pending.length})</h2>
              <p>Prüfe vorher die Planung. Bei Genehmigung wird der Urlaub automatisch in die Planung eingetragen und der Mitarbeiter sieht die Entscheidung.</p>
            </div>
          </div>
          {pending.length === 0 ? <p style={{ padding: '1rem 1.5rem' }}>Keine offenen Anträge.</p> : pending.map(r => (
            <div key={r.id} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem', borderTop: '1px solid #edf0f5' }}>
              <div style={{ minWidth: 220 }}>
                <b>{nameOf(r.resource_id)}</b>
                <div>{period(r)} <small>({plural(dayCount(r))})</small></div>
                {r.note && <small>Notiz: {r.note}</small>}
                {clash(r) && <div style={{ color: '#a65a00', fontSize: 13, marginTop: 4 }}>{clash(r)}</div>}
              </div>
              <div className="button-row">
                <Button onClick={() => mutate({ action: 'decideVacation', id: r.id, approve: true }, false)}><Check /> Genehmigen</Button>
                <Button variant="outline" onClick={() => mutate({ action: 'decideVacation', id: r.id, approve: false }, false)}><X /> Ablehnen</Button>
              </div>
            </div>
          ))}
        </section>
      )}

      {me?.resourceId && (
        <section className="panel resource-panel">
          <div className="section-heading">
            <div>
              <h2>Urlaub beantragen</h2>
              <p>Wochenenden werden nicht gezählt. Der Planer bekommt deinen Antrag und entscheidet.</p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '1rem', alignItems: 'end', padding: '1rem 1.25rem' }}>
            <div className="form-field"><Label>Von</Label><Input type="date" min={today} value={start} onChange={e => { setStart(e.target.value); if (!end || end < e.target.value) setEnd(e.target.value); }} /></div>
            <div className="form-field"><Label>Bis</Label><Input type="date" min={start || today} value={end} onChange={e => setEnd(e.target.value)} /></div>
            <div className="form-field"><Label>Notiz <span className="optional">optional</span></Label><Input value={note} maxLength={200} onChange={e => setNote(e.target.value)} /></div>
            <div className="button-row">
              <Button disabled={!start || !end || end < start} onClick={send}>Antrag senden</Button>
              {preview && <small>{preview}</small>}
            </div>
          </div>
          {mine.length > 0 && (
            <Table>
              <TableHeader><TableRow><TableHead>Zeitraum</TableHead><TableHead>Status</TableHead><TableHead>Notiz</TableHead><TableHead className="text-right">Aktion</TableHead></TableRow></TableHeader>
              <TableBody>
                {mine.map(r => (
                  <TableRow key={r.id}>
                    <TableCell><b>{period(r)}</b><br /><small>{plural(dayCount(r))}</small></TableCell>
                    <TableCell>{labels[r.status] || r.status}{r.status !== 'pending' && r.status !== 'withdrawn' && r.decided_by ? <><br /><small>von {r.decided_by}</small></> : null}</TableCell>
                    <TableCell>{r.note}</TableCell>
                    <TableCell>
                      <div className="button-row justify-end">
                        {r.status === 'pending' && <Button variant="ghost" size="sm" onClick={() => mutate({ action: 'withdrawVacation', id: r.id }, false)}><Undo2 /> Zurückziehen</Button>}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </section>
      )}

      {planer && decided.length > 0 && (
        <section className="panel resource-panel">
          <div className="section-heading"><div><h2>Entschiedene Anträge</h2></div></div>
          <Table>
            <TableHeader><TableRow><TableHead>Mitarbeiter</TableHead><TableHead>Zeitraum</TableHead><TableHead>Status</TableHead><TableHead>Entschieden von</TableHead></TableRow></TableHeader>
            <TableBody>
              {decided.map(r => (
                <TableRow key={r.id}>
                  <TableCell><b>{nameOf(r.resource_id)}</b></TableCell>
                  <TableCell>{period(r)}</TableCell>
                  <TableCell>{labels[r.status] || r.status}</TableCell>
                  <TableCell>{r.status === 'withdrawn' ? 'Mitarbeiter' : r.decided_by}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
      )}
    </div>
  );
}
