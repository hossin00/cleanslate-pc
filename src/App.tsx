import { useState } from 'react';
import { Trash2, Shield, Zap, RefreshCw, Check, AlertCircle } from 'lucide-react';
interface CleanItem { id:string; name:string; category:string; size:string; description:string; cleared:boolean; }
const ITEMS:CleanItem[]=[
  {id:'1',name:'Browser cache',category:'Browser',size:'247 MB',description:'Temporary website data and images',cleared:false},
  {id:'2',name:'Download history',category:'Browser',size:'<1 MB',description:'List of previously downloaded files',cleared:false},
  {id:'3',name:'Form autofill',category:'Browser',size:'<1 MB',description:'Saved form data and search history',cleared:false},
  {id:'4',name:'Temp files',category:'System',size:'1.2 GB',description:'Temporary Windows files no longer needed',cleared:false},
  {id:'5',name:'Thumbnail cache',category:'System',size:'89 MB',description:'Explorer thumbnail preview cache',cleared:false},
  {id:'6',name:'Recycle Bin',category:'System',size:'0 MB',description:'Files waiting to be permanently deleted',cleared:false},
  {id:'7',name:'Error reports',category:'System',size:'32 MB',description:'Windows error and crash report files',cleared:false},
  {id:'8',name:'DNS cache',category:'Network',size:'<1 MB',description:'Cached DNS lookups that may expose browsing',cleared:false},
  {id:'9',name:'Recent files',category:'Privacy',size:'<1 MB',description:'Recently accessed files list in Explorer',cleared:false},
  {id:'10',name:'Search history',category:'Privacy',size:'<1 MB',description:'Windows search bar history',cleared:false},
];
const CAT_COLORS:{[k:string]:string}={Browser:'#3b82f6',System:'#8b5cf6',Network:'#06b6d4',Privacy:'#ec4899'};
const ac='#8b5cf6';
export default function App() {
  const [items,setItems]=useState<CleanItem[]>(ITEMS);
  const [selected,setSelected]=useState<Set<string>>(new Set());
  const [cleaning,setCleaning]=useState(false);
  const [done,setDone]=useState(false);
  const categories=[...new Set(items.map(i=>i.category))];
  const toggle=(id:string)=>{const s=new Set(selected);s.has(id)?s.delete(id):s.add(id);setSelected(s);};
  const selectAll=()=>setSelected(selected.size===items.length?new Set():new Set(items.map(i=>i.id)));
  const clean=async()=>{
    if(selected.size===0)return;
    setCleaning(true);
    await new Promise(r=>setTimeout(r,1500));
    setItems(prev=>prev.map(i=>selected.has(i.id)?{...i,cleared:true}:i));
    setCleaning(false);setDone(true);
    setTimeout(()=>setDone(false),3000);
  };
  const totalSize=items.filter(i=>selected.has(i.id)).map(i=>parseFloat(i.size)||0).reduce((s,n)=>s+n,0);
  const cleared=items.filter(i=>i.cleared).length;
  return(
    <div style={{minHeight:'100vh',background:'#080808',display:'flex',flexDirection:'column'}}>
      <header style={{padding:'14px 20px',borderBottom:'1px solid #1e0a3c',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{display:'flex',alignItems:'center',gap:'9px'}}>
          <div style={{width:'34px',height:'34px',borderRadius:'9px',background:`linear-gradient(135deg,${ac},#6d28d9)`,display:'flex',alignItems:'center',justifyContent:'center'}}><Shield size={15} color="white"/></div>
          <div><div style={{fontWeight:'700',fontSize:'15px',color:'white',lineHeight:1}}>CleanSlatePc</div>
          <div style={{fontSize:'10px',color:'#4a1d96',marginTop:'2px'}}>{cleared}/{items.length} items cleared</div></div>
        </div>
        <button onClick={selectAll} style={{padding:'6px 12px',borderRadius:'8px',background:'#1e0a3c',border:'none',color:'#c4b5fd',fontSize:'11px',fontWeight:'500',cursor:'pointer',fontFamily:'Inter'}}>{selected.size===items.length?'Deselect all':'Select all'}</button>
      </header>
      <div style={{flex:1,overflow:'auto',padding:'12px 20px'}}>
        {done&&<div style={{padding:'12px 16px',borderRadius:'10px',background:'#10b98120',border:'1px solid #10b98140',marginBottom:'12px',display:'flex',alignItems:'center',gap:'8px'}}>
          <Check size={16} style={{color:'#34d399',flexShrink:0}}/><span style={{color:'#6ee7b7',fontSize:'13px'}}>✅ Cleaned {selected.size} items successfully!</span>
        </div>}
        {categories.map(cat=>(
          <div key={cat} style={{marginBottom:'16px'}}>
            <div style={{fontSize:'11px',fontWeight:'600',textTransform:'uppercase',letterSpacing:'0.1em',color:CAT_COLORS[cat],marginBottom:'8px'}}>{cat}</div>
            {items.filter(i=>i.category===cat).map(item=>(
              <div key={item.id} style={{display:'flex',alignItems:'center',gap:'10px',padding:'11px 13px',background:'#100818',border:`1px solid ${selected.has(item.id)?ac+'40':item.cleared?'#052e1c':'#1e0a3c'}`,borderRadius:'10px',marginBottom:'6px',cursor:'pointer',transition:'all 0.2s',opacity:item.cleared?0.5:1}}
                onClick={()=>!item.cleared&&toggle(item.id)}>
                <div style={{width:'18px',height:'18px',borderRadius:'4px',border:`2px solid ${selected.has(item.id)?ac:'#2d1b69'}`,background:selected.has(item.id)?ac:'transparent',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,transition:'all 0.2s'}}>
                  {selected.has(item.id)&&<Check size={11} color="white"/>}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{color:item.cleared?'#4a1d96':'white',fontSize:'13px',fontWeight:'500',textDecoration:item.cleared?'line-through':'none'}}>{item.name}</div>
                  <div style={{color:'#4a1d96',fontSize:'11px',marginTop:'2px'}}>{item.description}</div>
                </div>
                <span style={{fontSize:'12px',fontWeight:'600',color:item.cleared?'#4a1d96':parseFloat(item.size)>100?'#f87171':'#c4b5fd',flexShrink:0}}>{item.cleared?'✓ Cleared':item.size}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
      {selected.size>0&&<div style={{padding:'14px 20px',borderTop:'1px solid #1e0a3c',background:'#080808'}}>
        <button onClick={clean} disabled={cleaning} style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',padding:'13px',borderRadius:'11px',background:cleaning?'#1e0a3c':ac,border:'none',color:'white',fontSize:'14px',fontWeight:'600',cursor:cleaning?'not-allowed':'pointer',fontFamily:'Inter',boxShadow:cleaning?'none':`0 6px 20px ${ac}40`,transition:'all 0.2s'}}>
          {cleaning?<><RefreshCw size={16} style={{animation:'spin 1s linear infinite'}}/> Cleaning...</>:<><Trash2 size={16}/> Clean {selected.size} item{selected.size!==1?'s':''}  {totalSize>0?`(~${totalSize.toFixed(0)} MB)`:''}</>}
        </button>
      </div>}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
