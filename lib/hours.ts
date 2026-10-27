import { format } from 'date-fns';
type P={resource_id:string;project_id:string|null;started:string;ended:string|null;pause:number|null};
type A={resource_id:string;project_id:string|null;day:string;assignment_type:string};
export const absentTypes=['vacation','unpaid','sick'];
const hrs=(a:string,b:string,pause=0)=>Math.max(0,(Date.parse(b)-Date.parse(a))/3600000-pause/60);
const hm=(s:string)=>format(new Date(s),'HH:mm');
export const meal=(type:string,absenceHours:number)=>absentTypes.includes(type)?0:absenceHours>=24?28:absenceHours>=8?14:0;

// Derives one day of the timesheet from punches. Stamps without a project are travel;
// absence runs from the first travel stamp to the last stamp-out of the day.
export function dayInfo(assignments:A[],punches:P[],resourceId:string,day:string){
  const a=assignments.find(x=>x.resource_id===resourceId&&x.day===day);
  const type=a?.assignment_type||'';
  const ps=punches.filter(x=>x.resource_id===resourceId&&x.ended&&format(new Date(x.started),'yyyy-MM-dd')===day).sort((x,y)=>x.started.localeCompare(y.started));
  const travel=ps.filter(p=>!p.project_id),work=ps.filter(p=>p.project_id);
  const sum=(l:P[])=>l.reduce((n,p)=>n+hrs(p.started,p.ended!,p.pause||0),0);
  const lastEnd=ps.reduce((m,p)=>p.ended!>m?p.ended!:m,'');
  const away=absentTypes.includes(type);
  return {
    type,
    projectId:work[0]?.project_id||a?.project_id||null,
    travelStart:travel.length?hm(travel[0].started):'',
    travelEnd:travel.length?hm(lastEnd):'',
    travelHours:travel.length?sum(travel).toFixed(2):'',
    absence:away?'0':travel.length?hrs(travel[0].started,lastEnd).toFixed(2):'',
    workStart:work.length?hm(work[0].started):'',
    workEnd:work.length?hm(work.reduce((m,p)=>p.ended!>m?p.ended!:m,'')):'',
    pause:work.some(p=>p.pause)?String(work.reduce((n,p)=>n+(p.pause||0),0)):'',
    workHours:away?'8.00':work.length?sum(work).toFixed(2):'',
  };
}
