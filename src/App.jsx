import { useState, useEffect } from "react";

// 
// CONFIG  (change PIN in .env  VITE_ADMIN_PIN)
// 
const ADMIN_PIN   = import.meta.env.VITE_ADMIN_PIN || "DARKSKIN";
const RELEASE_DATE = new Date("2026-06-13T00:00:00");

// 
// DESIGN TOKENS
// 
const C = {
  bg:"#080808", bgCard:"#111111", bgWarm:"#120800",
  gold:"#D4A017", goldLight:"#F0C040", orange:"#E07B2A",
  cream:"#F5ECD7", muted:"#888888", mutedDk:"#333333",
  border:"rgba(212,160,23,0.22)",
  green:"#2ECC71", red:"#E74C3C",
};

// 
// DEFAULT QUESTIONS  (admin can override via dashboard)
// 
const DEFAULT_QUESTIONS = [
  {
    id:"q1", type:"funny", emoji:"",
    question:"Which food could Yusluv probably eat every week without complaining?",
    options:["Shawarma","Jollof Rice","Indomie","Bread & Eggs"],
    correct:2,
    reveal:"It's always Indomie szn for Yusluv "
  },
  {
    id:"q2", type:"funny", emoji:"",
    question:"What phrase does Yusluv say way too much?",
    options:["Stay Calm","We Move","Never Alone","No Stress"],
    correct:2,
    reveal:'"Never Alone" lives rent-free in his vocabulary '
  },
  {
    id:"q3", type:"nostalgic", emoji:"",
    question:"Which Yusluv song first made you take him seriously?",
    options:["Pain","Kim","Cruel World","Oshimiri"],
    correct:0,
    reveal:"Pain hit different for a lot of people. That record changed things."
  },
  {
    id:"q4", type:"discovery", emoji:"",
    question:"Where did you first discover Yusluv?",
    options:["University campus","Instagram / TikTok","A friend sent it","Spotify algorithm"],
    correct:1,
    reveal:"The algorithm brought you, or someone real did. Either way  you're here."
  },
  {
    id:"q5", type:"emotional", emoji:"",
    question:"Which Yusluv song causes the most emotional damage per second?",
    options:["Validation","Kim","Pain","Cruel World"],
    correct:0,
    reveal:"Validation does NOT miss. That record is a weapon."
  },
  {
    id:"q6", type:"darkskin", emoji:"",
    question:"What do you think DarkSkin Fav is really about?",
    options:["Self-confidence","A specific person","Love & identity","All of the above and more"],
    correct:3,
    reveal:"DarkSkin Fav is more than a song. You'll understand Friday. "
  },
  {
    id:"q7", type:"funny", emoji:"",
    question:"Yusluv in the studio at 2AM is most likely:",
    options:["Perfecting the mix","Eating Indomie ","Writing new verses","On a long phone call"],
    correct:2,
    reveal:"Crafting greatness even at 2AM. The process never sleeps."
  },
  {
    id:"q8", type:"music", emoji:"",
    question:"How would you describe the vibe of Yusluv's catalog?",
    options:["Party anthems","Late-night emotional","Street rap","Pure untouched vibes"],
    correct:1,
    reveal:"Music for people who actually feel things. That's the real fan base."
  },
  {
    id:"q9", type:"personal", emoji:"",
    question:"What's Yusluv's energy right before a major drop?",
    options:["Nervous but ready","Always calm","Hype and excited","Focused. No distractions."],
    correct:3,
    reveal:"Locked in. DarkSkin Fav doesn't drop by accident. This was calculated."
  },
  {
    id:"q10", type:"final", emoji:"",
    question:"When DarkSkin Fav drops Friday, you will:",
    options:["Stream it once","Stream on repeat all day","Share it immediately","Stream on repeat AND share it "],
    correct:3,
    reveal:"DarkSkin Fav on repeat. Share it. That's the only correct answer. Friday. "
  },
];

const TIERS = [
  { min:90, badge:"RIDE OR DIE ",  color:"#FFD700", vibe:"You probably know Yusluv personally at this point " },
  { min:70, badge:"DAY ONE ",      color:"#FF8C00", vibe:"Real one. You were there before the algorithm." },
  { min:50, badge:"LOYAL FAN ",    color:"#C0C0C0", vibe:"You're here, you care, you're valid." },
  { min:30, badge:"CASUAL FAN ",   color:"#CD7F32", vibe:"Stream DarkSkin Fav ten times. Come back." },
  { min:0,  badge:"NEW ARRIVAL ",  color:"#888888", vibe:"This is your origin story. Welcome to the fam." },
];

const getTier = (s, t) => {
  const p = t > 0 ? (s / t) * 100 : 0;
  return TIERS.find(x => p >= x.min) || TIERS[4];
};

// 
// STORAGE  (localStorage  works on any hosted site)
// 
const store = {
  getQuestions:    ()      => { try { const r = localStorage.getItem("yusluv_questions"); return r ? JSON.parse(r) : null; } catch { return null; } },
  setQuestions:    (qs)    => { try { localStorage.setItem("yusluv_questions", JSON.stringify(qs)); } catch {} },
  getSubmissions:  ()      => { try { const r = localStorage.getItem("yusluv_subs"); return r ? JSON.parse(r) : []; } catch { return []; } },
  addSubmission:   (entry) => { try { const s = store.getSubmissions(); s.push(entry); localStorage.setItem("yusluv_subs", JSON.stringify(s)); } catch {} },
};

// 
// GLOBAL CSS
// 
const GlobalStyles = () => (
  <style>{`
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { background: #080808; color: #F5ECD7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; overflow-x: hidden; }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-thumb { background: #D4A017; border-radius: 2px; }
    input, textarea { background: #1a1a1a; border: 1px solid rgba(212,160,23,0.25); color: #F5ECD7; border-radius: 8px; padding: 12px 16px; font-size: 15px; width: 100%; outline: none; transition: border-color 0.2s; font-family: inherit; }
    input:focus, textarea:focus { border-color: #D4A017; }
    input::placeholder, textarea::placeholder { color: #555; }
    button { font-family: inherit; }
    @keyframes fadeUp   { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeIn   { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideIn  { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes shake    { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-10px)} 40%{transform:translateX(10px)} 60%{transform:translateX(-6px)} 80%{transform:translateX(6px)} }
    @keyframes glow     { 0%,100%{box-shadow:0 0 0 rgba(212,160,23,0)} 50%{box-shadow:0 0 24px rgba(212,160,23,0.55)} }
    @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
    @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:0.55} }
    @keyframes confetti { 0%{transform:translateY(-10px) rotate(0deg);opacity:1} 100%{transform:translateY(100vh) rotate(720deg);opacity:0} }
    .fadeUp   { animation: fadeUp   0.55s ease both; }
    .fadeIn   { animation: fadeIn   0.4s  ease both; }
    .slideIn  { animation: slideIn  0.5s  ease both; }
    .float    { animation: float    3.2s  ease-in-out infinite; }
    .pulse    { animation: pulse    2s    ease-in-out infinite; }
  `}</style>
);

// 
// SUB-COMPONENTS
// 
const CountdownTile = ({ val, label }) => (
  <div style={{ textAlign:"center", minWidth:56 }}>
    <div style={{ fontSize:30, fontWeight:900, fontFamily:"Georgia,serif", color:C.gold, lineHeight:1 }}>
      {String(val ?? 0).padStart(2,"0")}
    </div>
    <div style={{ fontSize:9, color:C.muted, letterSpacing:"0.18em", marginTop:4 }}>{label}</div>
  </div>
);

const Countdown = ({ cd }) => {
  if (cd.dropped) return (
    <div style={{ color:C.gold, fontFamily:"Georgia,serif", fontSize:16, fontStyle:"italic" }}>
      DarkSkin Fav is out now 
    </div>
  );
  return (
    <div style={{ display:"flex", gap:20, alignItems:"center", justifyContent:"center" }}>
      <CountdownTile val={cd.days}    label="DAYS" />
      <span style={{ color:C.gold, fontSize:22, marginBottom:8 }}>:</span>
      <CountdownTile val={cd.hours}   label="HRS" />
      <span style={{ color:C.gold, fontSize:22, marginBottom:8 }}>:</span>
      <CountdownTile val={cd.minutes} label="MIN" />
      <span style={{ color:C.gold, fontSize:22, marginBottom:8 }}>:</span>
      <CountdownTile val={cd.seconds} label="SEC" />
    </div>
  );
};

const ProgressBar = ({ current, total }) => (
  <div style={{ width:"100%", height:3, background:"rgba(255,255,255,0.08)", borderRadius:2, overflow:"hidden" }}>
    <div style={{
      width: `${(current/total)*100}%`,
      height:"100%",
      background:`linear-gradient(90deg,${C.gold},${C.orange})`,
      borderRadius:2,
      transition:"width 0.4s ease"
    }} />
  </div>
);

// 
// LANDING
// 
const Landing = ({ cd, totalFans, onStart, onAdmin, questions }) => (
  <div style={{ minHeight:"100vh", background:C.bg, position:"relative" }}>
    <GlobalStyles />

    {/*  Hero full-bleed  */}
    <div style={{ position:"relative", height:"100vh", display:"flex", flexDirection:"column" }}>
      <div style={{
        position:"absolute", inset:0,
        backgroundImage:"url(/hero1.jpg)",
        backgroundSize:"cover", backgroundPosition:"center top"
      }} />
      <div style={{
        position:"absolute", inset:0,
        background:"linear-gradient(180deg,rgba(8,8,8,0.35) 0%,rgba(8,8,8,0.15) 30%,rgba(8,8,8,0.88) 65%,#080808 100%)"
      }} />

      <div style={{ position:"relative", zIndex:2, flex:1, display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:"0 24px 52px", maxWidth:560, margin:"0 auto", width:"100%" }}>

        {/* Album art */}
        <div className="float" style={{ width:88, height:88, borderRadius:14, overflow:"hidden", marginBottom:22, boxShadow:"0 8px 32px rgba(0,0,0,0.75)", border:`1px solid ${C.border}`, flexShrink:0 }}>
          <img src="/cover.jpg" alt="DarkSkin Fav" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
        </div>

        <div className="fadeUp" style={{ marginBottom:8 }}>
          <span style={{ fontSize:10, letterSpacing:"0.22em", color:C.gold, background:"rgba(212,160,23,0.1)", padding:"4px 12px", borderRadius:20, border:`1px solid ${C.border}` }}>
            DROPPING FRIDAY
          </span>
        </div>

        <h1 className="fadeUp" style={{ fontSize:"clamp(38px,9vw,64px)", fontFamily:"Georgia,serif", fontStyle:"italic", fontWeight:700, lineHeight:1.05, color:C.cream, marginBottom:14, animationDelay:"0.1s" }}>
          Think You<br />Know Yusluv?
        </h1>

        <p className="fadeUp" style={{ fontSize:15, color:"rgba(245,236,215,0.68)", marginBottom:30, maxWidth:340, lineHeight:1.65, animationDelay:"0.18s" }}>
          {questions.length} questions. Nostalgia. Chaos. Memories.
          <br />Win the <span style={{ color:C.gold }}>DarkSkin Fav Care Package </span>
        </p>

        <div className="fadeUp" style={{ marginBottom:30, animationDelay:"0.24s" }}>
          <p style={{ fontSize:10, color:C.muted, letterSpacing:"0.18em", marginBottom:12 }}>DROPS IN</p>
          <Countdown cd={cd} />
        </div>

        {totalFans > 0 && (
          <div className="fadeUp" style={{ marginBottom:18, animationDelay:"0.28s" }}>
            <span style={{ fontSize:13, color:C.muted }}>
               <span style={{ color:C.cream, fontWeight:600 }}>{totalFans.toLocaleString()}</span> fans have taken the challenge
            </span>
          </div>
        )}

        <button
          className="fadeUp"
          onClick={onStart}
          style={{
            animationDelay:"0.32s",
            background:`linear-gradient(135deg,${C.gold},${C.orange})`,
            color:"#000", fontWeight:800, fontSize:16,
            padding:"17px 40px", borderRadius:50, border:"none",
            cursor:"pointer", letterSpacing:"0.06em",
            width:"100%", maxWidth:360,
            boxShadow:"0 4px 28px rgba(212,160,23,0.38)",
            transition:"transform 0.15s, box-shadow 0.15s"
          }}
          onMouseEnter={e => { e.target.style.transform="scale(1.02)"; e.target.style.boxShadow="0 6px 36px rgba(212,160,23,0.55)"; }}
          onMouseLeave={e => { e.target.style.transform="scale(1)";    e.target.style.boxShadow="0 4px 28px rgba(212,160,23,0.38)"; }}
        >
          START THE CHALLENGE 
        </button>
      </div>
    </div>

    {/*  Quote section with second photo  */}
    <div style={{ position:"relative", height:280, overflow:"hidden" }}>
      <div style={{ position:"absolute", inset:0, backgroundImage:"url(/hero2.jpg)", backgroundSize:"cover", backgroundPosition:"center 35%" }} />
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(180deg,#080808 0%,rgba(8,8,8,0.48) 40%,rgba(8,8,8,0.9) 100%)" }} />
      <div style={{ position:"relative", zIndex:2, display:"flex", alignItems:"center", justifyContent:"center", height:"100%", padding:"0 24px" }}>
        <div style={{ textAlign:"center" }}>
          <p style={{ fontFamily:"Georgia,serif", fontStyle:"italic", fontSize:"clamp(19px,5vw,30px)", color:C.cream, marginBottom:8, lineHeight:1.3 }}>
            "DarkSkin Fav drops Friday"
          </p>
          <p style={{ fontSize:12, color:C.muted, letterSpacing:"0.12em" }}> YUSLUV</p>
        </div>
      </div>
    </div>

    {/*  Info section  */}
    <div style={{ padding:"52px 24px 48px", maxWidth:500, margin:"0 auto" }}>
      <h2 style={{ fontFamily:"Georgia,serif", fontSize:22, color:C.cream, marginBottom:14 }}>What is this?</h2>
      <p style={{ color:"rgba(245,236,215,0.6)", lineHeight:1.85, fontSize:15 }}>
        A fan experience built around the release of <em>DarkSkin Fav</em>. Answer {questions.length} questions  some funny, some nostalgic, some emotional. Complete the challenge to download your personalised{" "}
        <strong style={{ color:C.gold }}>Yusluv Wrapped card</strong> and enter the giveaway draw.
      </p>

      <div style={{ display:"flex", gap:12, marginTop:24, flexWrap:"wrap" }}>
        {[" Orange Capri-Sun Pack"," KitKat Chocolate Pack"].map(item => (
          <div key={item} style={{ background:C.bgCard, border:`1px solid ${C.border}`, padding:"10px 18px", borderRadius:24, fontSize:13, color:C.cream }}>
            {item}
          </div>
        ))}
      </div>
    </div>

    {/* Hidden admin trigger */}
    <div style={{ textAlign:"center", padding:"0 0 60px" }}>
      <button onClick={onAdmin} style={{ background:"none", border:"none", color:C.mutedDk, cursor:"pointer", fontSize:10, letterSpacing:"0.1em" }}>
          
      </button>
    </div>
  </div>
);

// 
// QUIZ
// 
const Quiz = ({ questions, currentQ, selected, showFeedback, score, onAnswer, onNext }) => {
  const q = questions[currentQ];
  if (!q) return null;
  const isCorrect = selected === q.correct;
  const labels = ["A","B","C","D"];

  return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", flexDirection:"column" }} key={q.id}>
      <GlobalStyles />

      {/* Faint BG */}
      <div style={{ position:"fixed", inset:0, backgroundImage:"url(/hero2.jpg)", backgroundSize:"cover", backgroundPosition:"center", opacity:0.04, pointerEvents:"none" }} />

      {/* Top bar */}
      <div style={{ position:"sticky", top:0, background:C.bg, borderBottom:`1px solid ${C.border}`, padding:"14px 20px", zIndex:10, display:"flex", alignItems:"center", gap:14 }}>
        <img src="/cover.jpg" alt="" style={{ width:34, height:34, borderRadius:7, objectFit:"cover", flexShrink:0 }} />
        <div style={{ flex:1 }}>
          <ProgressBar current={currentQ} total={questions.length} />
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:6 }}>
            <span style={{ fontSize:11, color:C.muted }}>Question {currentQ+1} of {questions.length}</span>
            <span style={{ fontSize:11, color:C.gold, fontWeight:600 }}>{score} correct </span>
          </div>
        </div>
      </div>

      {/* Question body */}
      <div style={{ flex:1, position:"relative", zIndex:1, display:"flex", flexDirection:"column", alignItems:"center", padding:"28px 20px 40px", maxWidth:520, margin:"0 auto", width:"100%" }}>

        <div className="fadeUp" style={{ marginBottom:18, alignSelf:"flex-start" }}>
          <span style={{ fontSize:10, letterSpacing:"0.15em", color:C.muted, background:"rgba(255,255,255,0.05)", padding:"4px 12px", borderRadius:20, border:"1px solid rgba(255,255,255,0.08)" }}>
            {q.emoji} {q.type.toUpperCase()}
          </span>
        </div>

        <h2 className="fadeUp slideIn" style={{ fontFamily:"Georgia,serif", fontSize:"clamp(20px,5vw,26px)", color:C.cream, lineHeight:1.45, marginBottom:32, alignSelf:"flex-start", animationDelay:"0.06s" }}>
          {q.question}
        </h2>

        {/* Options */}
        <div style={{ display:"flex", flexDirection:"column", gap:11, width:"100%" }}>
          {q.options.map((opt, i) => {
            let bg = "rgba(255,255,255,0.03)";
            let bd = "rgba(255,255,255,0.09)";
            let col = C.cream;
            let extraStyle = {};

            if (showFeedback) {
              if (i === q.correct) {
                bg = "rgba(46,204,113,0.13)"; bd = C.green; col = C.green;
                extraStyle = { animation:"glow 1.2s ease" };
              } else if (i === selected && i !== q.correct) {
                bg = "rgba(231,76,60,0.13)"; bd = C.red; col = C.red;
                extraStyle = { animation:"shake 0.45s ease" };
              } else {
                bg = "rgba(255,255,255,0.015)"; bd = "rgba(255,255,255,0.04)"; col = "rgba(245,236,215,0.28)";
              }
            } else if (selected === i) {
              bg = "rgba(212,160,23,0.11)"; bd = C.gold;
            }

            return (
              <button
                key={i}
                onClick={() => onAnswer(i)}
                disabled={showFeedback}
                style={{
                  ...extraStyle,
                  background:bg, border:`1px solid ${bd}`, borderRadius:13,
                  padding:"15px 18px", cursor:showFeedback?"default":"pointer",
                  display:"flex", alignItems:"center", gap:14, textAlign:"left",
                  transition:"background 0.2s, border-color 0.2s",
                  width:"100%"
                }}
              >
                <span style={{ width:28, height:28, borderRadius:7, background:"rgba(255,255,255,0.05)", border:`1px solid ${bd}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:col, flexShrink:0, transition:"all 0.2s" }}>
                  {labels[i]}
                </span>
                <span style={{ fontSize:15, color:col, fontWeight:500, lineHeight:1.4, flex:1 }}>{opt}</span>
                {showFeedback && i === q.correct       && <span style={{ fontSize:16, marginLeft:"auto" }}></span>}
                {showFeedback && i === selected && i !== q.correct && <span style={{ fontSize:16, marginLeft:"auto" }}></span>}
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div className="fadeUp" style={{ marginTop:22, padding:"16px 20px", background:isCorrect?"rgba(46,204,113,0.08)":"rgba(231,76,60,0.08)", border:`1px solid ${isCorrect?C.green:C.red}`, borderRadius:13, width:"100%" }}>
            <div style={{ fontSize:14, fontWeight:700, color:isCorrect?C.green:C.red, marginBottom:6 }}>
              {isCorrect ? " Correct  you really know Yusluv." : " Nah."}
            </div>
            <div style={{ fontSize:13, color:"rgba(245,236,215,0.68)", lineHeight:1.65 }}>{q.reveal}</div>
          </div>
        )}

        {showFeedback && (
          <button className="fadeUp" onClick={onNext}
            style={{ marginTop:18, background:`linear-gradient(135deg,${C.gold},${C.orange})`, color:"#000", fontWeight:800, fontSize:15, padding:"15px", borderRadius:50, border:"none", cursor:"pointer", width:"100%", letterSpacing:"0.06em" }}>
            {currentQ+1 >= questions.length ? "See My Results " : "Next Question "}
          </button>
        )}
      </div>
    </div>
  );
};

// 
// RESULT
// 
const Result = ({ questions, score, onDownload, onGiveaway }) => {
  const tier = getTier(score, questions.length);
  const pct  = Math.round((score / questions.length) * 100);
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    if (pct >= 60) {
      const items = Array.from({ length:22 }, (_, i) => ({
        id:i, left:Math.random()*100, delay:Math.random()*1.8,
        color:["#FFD700","#E07B2A","#D4A017","#F0C040","#FF8C00","#FFF"][i%6],
        size:5+Math.random()*7, dur:2+Math.random()*2,
      }));
      setConfetti(items);
      setTimeout(() => setConfetti([]), 6000);
    }
  }, []);

  const shareWhatsApp = () => {
    const msg = `I scored ${score}/${questions.length} on the Yusluv Challenge \n${tier.badge}\nDarkSkin Fav drops Friday \n#YusluvChallenge`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div style={{ minHeight:"100vh", background:`linear-gradient(180deg,${C.bgWarm} 0%,${C.bg} 40%)`, paddingBottom:60 }}>
      <GlobalStyles />

      {confetti.map(c => (
        <div key={c.id} style={{ position:"fixed", left:`${c.left}%`, top:-10, width:c.size, height:c.size, background:c.color, borderRadius:"50%", animation:`confetti ${c.dur}s ${c.delay}s ease-in both`, zIndex:100, pointerEvents:"none" }} />
      ))}

      {/* Cover hero */}
      <div style={{ position:"relative", height:270, overflow:"hidden" }}>
        <img src="/cover.jpg" alt="DarkSkin Fav" style={{ width:"100%", height:"100%", objectFit:"cover", opacity:0.52 }} />
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(180deg,rgba(8,8,0,0.2) 0%,#080808 100%)" }} />
        <div style={{ position:"absolute", bottom:24, left:0, right:0, textAlign:"center" }}>
          <div style={{ fontSize:10, letterSpacing:"0.22em", color:C.gold, marginBottom:6 }}>YOUR YUSLUV WRAPPED</div>
          <div style={{ fontFamily:"Georgia,serif", fontStyle:"italic", fontSize:26, color:C.cream }}>DarkSkin Fav Edition</div>
        </div>
      </div>

      <div style={{ padding:"0 22px", maxWidth:480, margin:"0 auto" }}>

        {/* Score card */}
        <div className="fadeUp" style={{ textAlign:"center", margin:"28px 0 20px", padding:"30px 22px", background:C.bgCard, border:`1px solid ${C.border}`, borderRadius:20 }}>
          <div style={{ fontSize:10, letterSpacing:"0.2em", color:C.muted, marginBottom:14 }}>FINAL SCORE</div>
          <div style={{ fontFamily:"Georgia,serif", fontSize:76, fontWeight:900, color:C.gold, lineHeight:1 }}>
            {score}<span style={{ fontSize:28, color:C.muted }}>/{questions.length}</span>
          </div>
          <div style={{ fontSize:13, color:C.muted, margin:"6px 0 20px" }}>{pct}% correct</div>

          <div style={{ display:"inline-block", padding:"9px 24px", background:`linear-gradient(135deg,${tier.color}22,${tier.color}11)`, border:`1px solid ${tier.color}`, borderRadius:40, marginBottom:12 }}>
            <span style={{ fontSize:17, fontWeight:800, color:tier.color }}>{tier.badge}</span>
          </div>
          <p style={{ fontSize:14, color:"rgba(245,236,215,0.58)", lineHeight:1.55, maxWidth:280, margin:"0 auto" }}>{tier.vibe}</p>
        </div>

        {/* Score bar */}
        <div className="fadeUp" style={{ marginBottom:20, padding:"18px", background:C.bgCard, border:`1px solid ${C.border}`, borderRadius:14, animationDelay:"0.12s" }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
            <span style={{ fontSize:12, color:C.muted }}>Breakdown</span>
            <span style={{ fontSize:12, color:C.gold }}>{score} correct  {questions.length-score} missed</span>
          </div>
          <div style={{ height:8, background:"rgba(255,255,255,0.05)", borderRadius:4, overflow:"hidden" }}>
            <div style={{ width:`${pct}%`, height:"100%", background:`linear-gradient(90deg,${C.gold},${C.orange})`, borderRadius:4 }} />
          </div>
        </div>

        {/* Artist card */}
        <div className="fadeUp" style={{ marginBottom:22, display:"flex", gap:16, padding:"18px", background:C.bgCard, border:`1px solid ${C.border}`, borderRadius:14, alignItems:"center", animationDelay:"0.18s" }}>
          <img src="/solo.jpg" alt="Yusluv" style={{ width:70, height:70, borderRadius:12, objectFit:"cover", flexShrink:0, border:`2px solid ${C.border}` }} />
          <div>
            <div style={{ fontSize:15, fontWeight:700, color:C.cream, marginBottom:4 }}>Yusluv</div>
            <div style={{ fontSize:13, color:C.muted, lineHeight:1.55 }}>DarkSkin Fav drops Friday. One song. Maximum damage.</div>
            <div style={{ fontSize:12, color:C.gold, marginTop:5 }}>@yusluvofficial_</div>
          </div>
        </div>

        {/* Actions */}
        <div className="fadeUp" style={{ display:"flex", flexDirection:"column", gap:11, animationDelay:"0.22s" }}>
          <button onClick={onDownload}
            style={{ background:`linear-gradient(135deg,${C.gold},${C.orange})`, color:"#000", fontWeight:800, fontSize:15, padding:"15px", borderRadius:50, border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
             Download My Wrapped Card
          </button>
          <button onClick={shareWhatsApp}
            style={{ background:"rgba(37,211,102,0.1)", color:"#25D366", fontWeight:700, fontSize:14, padding:"14px", borderRadius:50, border:"1px solid rgba(37,211,102,0.28)", cursor:"pointer" }}>
             Share Score on WhatsApp
          </button>
          <button onClick={onGiveaway}
            style={{ background:`linear-gradient(135deg,rgba(212,160,23,0.13),rgba(232,99,26,0.08))`, color:C.cream, fontWeight:700, fontSize:14, padding:"14px", borderRadius:50, border:`1px solid ${C.border}`, cursor:"pointer" }}>
             Enter the DarkSkin Fav Giveaway
          </button>
        </div>

        <p style={{ textAlign:"center", fontSize:11, color:C.mutedDk, marginTop:18, lineHeight:1.6 }}>
          Stream DarkSkin Fav when it drops to be eligible 
        </p>
      </div>
    </div>
  );
};

// 
// EMAIL COLLECTION
// 
const EmailCollection = ({ fanInfo, setFanInfo, score, questions, onSubmit }) => {
  const tier      = getTier(score, questions.length);
  const [touched, setTouched] = useState({});
  const canSubmit = fanInfo.name.trim() && fanInfo.email.trim().includes("@");

  const fields = [
    { key:"name",  label:"Your Name",       placeholder:"Teni Adele",        type:"text",  required:true  },
    { key:"email", label:"Email Address",   placeholder:"you@email.com",     type:"email", required:true  },
    { key:"phone", label:"Phone Number",    placeholder:"+234 800 000 0000", type:"tel",   required:false },
    { key:"city",  label:"City / State",    placeholder:"Lagos, Nigeria",    type:"text",  required:false },
  ];

  return (
    <div style={{ minHeight:"100vh", background:C.bg, padding:"40px 22px 60px" }}>
      <GlobalStyles />
      <div style={{ maxWidth:440, margin:"0 auto" }}>

        <div className="fadeUp" style={{ textAlign:"center", marginBottom:30 }}>
          <div style={{ width:64, height:64, borderRadius:14, overflow:"hidden", margin:"0 auto 16px", border:`1px solid ${C.border}` }}>
            <img src="/cover.jpg" alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
          </div>
          <h1 style={{ fontFamily:"Georgia,serif", fontSize:26, color:C.cream, marginBottom:10 }}>Enter the Giveaway</h1>
          <div style={{ display:"inline-flex", padding:"6px 18px", background:`linear-gradient(135deg,${tier.color}22,${tier.color}11)`, border:`1px solid ${tier.color}`, borderRadius:40, marginBottom:12 }}>
            <span style={{ fontSize:14, fontWeight:700, color:tier.color }}>{tier.badge}  {score}/{questions.length}</span>
          </div>
          <p style={{ fontSize:14, color:C.muted, lineHeight:1.65 }}>
            Winners chosen randomly from all complete entries.<br />
            <span style={{ color:C.gold }}>DarkSkin Fav Care Package </span>
          </p>
        </div>

        <div className="fadeUp" style={{ display:"flex", flexDirection:"column", gap:14, animationDelay:"0.1s" }}>
          {fields.map(field => (
            <div key={field.key}>
              <label style={{ fontSize:11, color:C.muted, letterSpacing:"0.1em", display:"block", marginBottom:7 }}>
                {field.label.toUpperCase()}{field.required?" *":""}
              </label>
              <input
                type={field.type}
                placeholder={field.placeholder}
                value={fanInfo[field.key]}
                onBlur={() => setTouched(t => ({ ...t, [field.key]:true }))}
                onChange={e => setFanInfo(f => ({ ...f, [field.key]:e.target.value }))}
              />
              {touched.email && field.key==="email" && fanInfo.email && !fanInfo.email.includes("@") && (
                <div style={{ fontSize:11, color:C.red, marginTop:4 }}>Enter a valid email address</div>
              )}
            </div>
          ))}

          {/* Notify toggle */}
          <div
            onClick={() => setFanInfo(f => ({ ...f, notify:!f.notify }))}
            style={{ display:"flex", gap:12, alignItems:"flex-start", padding:"14px", background:C.bgCard, border:`1px solid ${C.border}`, borderRadius:10, cursor:"pointer" }}
          >
            <div style={{ width:20, height:20, borderRadius:4, border:`1.5px solid ${fanInfo.notify?C.gold:C.mutedDk}`, background:fanInfo.notify?C.gold:"transparent", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.2s", marginTop:1 }}>
              {fanInfo.notify && <span style={{ fontSize:11, color:"#000", fontWeight:900 }}></span>}
            </div>
            <span style={{ fontSize:13, color:C.cream, lineHeight:1.6 }}>
              Notify me when <strong style={{ color:C.gold }}>DarkSkin Fav</strong> drops on Friday
            </span>
          </div>

          <button
            onClick={onSubmit}
            disabled={!canSubmit}
            style={{ marginTop:6, background:canSubmit?`linear-gradient(135deg,${C.gold},${C.orange})`:"#1e1e1e", color:canSubmit?"#000":C.mutedDk, fontWeight:800, fontSize:15, padding:"16px", borderRadius:50, border:"none", cursor:canSubmit?"pointer":"not-allowed", transition:"all 0.2s", letterSpacing:"0.05em" }}
          >
            Submit My Entry 
          </button>
        </div>

        <p style={{ textAlign:"center", fontSize:11, color:C.mutedDk, marginTop:16, lineHeight:1.7 }}>
          Your info is only used for this giveaway. No spam ever.
          <br />Yusluv contacts winners directly via email.
        </p>
      </div>
    </div>
  );
};

// 
// SUCCESS
// 
const Success = ({ fanInfo, score, questions, onHome }) => {
  const tier = getTier(score, questions.length);
  const shareWhatsApp = () => {
    const msg = `I scored ${score}/${questions.length} on the Yusluv Challenge \n${tier.badge}\nDarkSkin Fav drops Friday \n#YusluvChallenge`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  };
  return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 24px", textAlign:"center" }}>
      <GlobalStyles />
      <div className="fadeUp" style={{ fontSize:60, marginBottom:16 }}></div>
      <h1 className="fadeUp" style={{ fontFamily:"Georgia,serif", fontSize:28, color:C.cream, marginBottom:12, animationDelay:"0.1s" }}>
        You're in, {fanInfo.name.split(" ")[0]}!
      </h1>
      <div className="fadeUp" style={{ padding:"8px 20px", background:`linear-gradient(135deg,${tier.color}22,${tier.color}11)`, border:`1px solid ${tier.color}`, borderRadius:40, marginBottom:16, animationDelay:"0.15s" }}>
        <span style={{ fontSize:15, fontWeight:700, color:tier.color }}>{tier.badge}</span>
      </div>
      <p className="fadeUp" style={{ fontSize:15, color:"rgba(245,236,215,0.6)", maxWidth:320, lineHeight:1.8, marginBottom:32, animationDelay:"0.2s" }}>
        Entry received. You'll be contacted at{" "}
        <strong style={{ color:C.gold }}>{fanInfo.email}</strong> if selected.
        <br /><br />
        Stream <strong style={{ color:C.gold }}>DarkSkin Fav</strong> when it drops Friday. 
      </p>
      <div className="fadeUp" style={{ display:"flex", flexDirection:"column", gap:11, width:"100%", maxWidth:320, animationDelay:"0.24s" }}>
        <button onClick={shareWhatsApp}
          style={{ background:"rgba(37,211,102,0.1)", color:"#25D366", fontWeight:700, fontSize:14, padding:"14px", borderRadius:50, border:"1px solid rgba(37,211,102,0.28)", cursor:"pointer" }}>
           Share My Score
        </button>
        <button onClick={onHome}
          style={{ background:"rgba(255,255,255,0.04)", color:C.muted, fontWeight:600, fontSize:14, padding:"13px", borderRadius:50, border:"1px solid rgba(255,255,255,0.08)", cursor:"pointer" }}>
           Back to Start
        </button>
      </div>
    </div>
  );
};

// 
// ADMIN LOGIN
// 
const AdminLogin = ({ pin, setPin, err, onLogin, onClose }) => (
  <div style={{ minHeight:"100vh", background:C.bg, display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 24px" }}>
    <GlobalStyles />
    <div style={{ width:"100%", maxWidth:340, textAlign:"center" }}>
      <div style={{ fontSize:42, marginBottom:16 }}></div>
      <h2 style={{ fontFamily:"Georgia,serif", fontSize:22, color:C.cream, marginBottom:8 }}>Admin Access</h2>
      <p style={{ fontSize:13, color:C.muted, marginBottom:24 }}>Enter your PIN to manage the challenge.</p>
      <input
        type="password" placeholder="Enter PIN"
        value={pin} onChange={e => setPin(e.target.value)}
        onKeyDown={e => e.key==="Enter" && onLogin()}
        style={{ textAlign:"center", letterSpacing:"0.35em", marginBottom:err?8:16 }}
      />
      {err && <div style={{ fontSize:12, color:C.red, marginBottom:12 }}>{err}</div>}
      <div style={{ display:"flex", gap:10 }}>
        <button onClick={onClose} style={{ flex:1, padding:"12px", borderRadius:40, border:"1px solid rgba(255,255,255,0.1)", background:"none", color:C.muted, cursor:"pointer", fontSize:14 }}>Cancel</button>
        <button onClick={onLogin} style={{ flex:2, padding:"12px", borderRadius:40, border:"none", background:`linear-gradient(135deg,${C.gold},${C.orange})`, color:"#000", fontWeight:700, cursor:"pointer", fontSize:14 }}>Unlock</button>
      </div>
    </div>
  </div>
);

// 
// ADMIN PANEL
// 
const Admin = ({ questions, submissions, saving, onSave, onBack }) => {
  const [tab, setTab]         = useState("questions");
  const [qs, setQs]           = useState(questions);
  const [editIdx, setEditIdx] = useState(null);
  const [editData, setEditData] = useState(null);
  const [adding, setAdding]   = useState(false);
  const labels = ["A","B","C","D"];

  const blankQ = () => ({ id:"q"+Date.now(), type:"funny", emoji:"", question:"", options:["","","",""], correct:0, reveal:"" });

  const startEdit = i  => { setEditIdx(i); setEditData({ ...qs[i], options:[...qs[i].options] }); setAdding(false); };
  const startAdd  = () => { setEditData(blankQ()); setEditIdx(null); setAdding(true); };
  const cancel    = () => { setEditIdx(null); setEditData(null); setAdding(false); };

  const save = () => {
    if (!editData?.question?.trim()) return;
    const updated = adding ? [...qs, editData] : qs.map((q,i) => i===editIdx ? editData : q);
    setQs(updated); onSave(updated); cancel();
  };

  const del = i => {
    const updated = qs.filter((_,j) => j!==i);
    setQs(updated); onSave(updated);
  };

  const avgScore = submissions.length
    ? (submissions.reduce((a,s) => a+(s.score||0), 0) / submissions.length).toFixed(1)
    : "";

  return (
    <div style={{ minHeight:"100vh", background:C.bg }}>
      <GlobalStyles />
      {/* Header */}
      <div style={{ borderBottom:`1px solid ${C.border}`, padding:"15px 20px", display:"flex", alignItems:"center", gap:14, position:"sticky", top:0, background:C.bg, zIndex:10 }}>
        <button onClick={onBack} style={{ background:"none", border:"none", color:C.muted, cursor:"pointer", fontSize:22, lineHeight:1, padding:"0 4px" }}></button>
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:700, color:C.cream, fontSize:15 }}>Admin Dashboard</div>
          <div style={{ fontSize:12, color:C.muted }}>DarkSkin Fav Fan Challenge</div>
        </div>
        {saving && <div className="pulse" style={{ fontSize:12, color:C.gold }}>Saving</div>}
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", borderBottom:`1px solid ${C.border}`, paddingLeft:20 }}>
        {[["questions","Questions"],["stats","Analytics"]].map(([t,label]) => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding:"14px 20px", background:"none", border:"none", color:tab===t?C.gold:C.muted, fontWeight:tab===t?700:400, fontSize:14, cursor:"pointer", borderBottom:tab===t?`2px solid ${C.gold}`:"2px solid transparent", transition:"color 0.2s" }}>
            {label}
          </button>
        ))}
      </div>

      <div style={{ padding:"20px", maxWidth:600, margin:"0 auto" }}>

        {/*  QUESTIONS TAB  */}
        {tab === "questions" && (
          <>
            {(editIdx !== null || adding) && editData ? (
              <div style={{ background:C.bgCard, border:`1px solid ${C.border}`, borderRadius:16, padding:"22px", marginBottom:20 }}>
                <h3 style={{ color:C.cream, marginBottom:20, fontSize:15 }}>{adding?"New Question":"Edit Question"}</h3>
                <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                  <div>
                    <label style={{ fontSize:11, color:C.muted, letterSpacing:"0.1em", display:"block", marginBottom:7 }}>QUESTION TEXT *</label>
                    <textarea rows={2} value={editData.question} onChange={e => setEditData(d => ({ ...d, question:e.target.value }))} placeholder="What do you want to ask?" style={{ resize:"vertical" }} />
                  </div>
                  <div style={{ display:"flex", gap:10 }}>
                    <div style={{ flex:1 }}>
                      <label style={{ fontSize:11, color:C.muted, letterSpacing:"0.1em", display:"block", marginBottom:7 }}>TYPE</label>
                      <input value={editData.type} onChange={e => setEditData(d => ({ ...d, type:e.target.value }))} placeholder="funny / nostalgic / music" />
                    </div>
                    <div style={{ width:72 }}>
                      <label style={{ fontSize:11, color:C.muted, letterSpacing:"0.1em", display:"block", marginBottom:7 }}>EMOJI</label>
                      <input value={editData.emoji} onChange={e => setEditData(d => ({ ...d, emoji:e.target.value }))} style={{ textAlign:"center" }} />
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize:11, color:C.muted, letterSpacing:"0.1em", display:"block", marginBottom:10 }}>OPTIONS  click circle to set correct answer</label>
                    <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
                      {editData.options.map((opt, i) => (
                        <div key={i} style={{ display:"flex", gap:10, alignItems:"center" }}>
                          <div onClick={() => setEditData(d => ({ ...d, correct:i }))}
                            style={{ width:28, height:28, borderRadius:"50%", border:`2px solid ${editData.correct===i?C.green:C.mutedDk}`, background:editData.correct===i?"rgba(46,204,113,0.15)":"transparent", cursor:"pointer", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, color:editData.correct===i?C.green:C.muted, fontWeight:700, transition:"all 0.2s" }}>
                            {labels[i]}
                          </div>
                          <input value={opt} onChange={e => setEditData(d => ({ ...d, options:d.options.map((o,j) => j===i?e.target.value:o) }))} placeholder={`Option ${labels[i]}`} />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize:11, color:C.muted, letterSpacing:"0.1em", display:"block", marginBottom:7 }}>REVEAL TEXT (shown after answering)</label>
                    <input value={editData.reveal} onChange={e => setEditData(d => ({ ...d, reveal:e.target.value }))} placeholder="Fun fact or context shown after selection" />
                  </div>
                </div>
                <div style={{ display:"flex", gap:10, marginTop:20 }}>
                  <button onClick={cancel}  style={{ flex:1, padding:"12px", borderRadius:40, border:"1px solid rgba(255,255,255,0.1)", background:"none", color:C.muted, cursor:"pointer", fontSize:14 }}>Cancel</button>
                  <button onClick={save}    style={{ flex:2, padding:"12px", borderRadius:40, border:"none", background:`linear-gradient(135deg,${C.gold},${C.orange})`, color:"#000", fontWeight:700, cursor:"pointer", fontSize:14 }}>Save Question </button>
                </div>
              </div>
            ) : null}

            {!adding && editIdx===null && (
              <button onClick={startAdd}
                style={{ width:"100%", padding:"14px", borderRadius:12, border:`1px dashed ${C.gold}`, background:"rgba(212,160,23,0.05)", color:C.gold, fontWeight:600, fontSize:14, cursor:"pointer", marginBottom:16, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                + Add New Question
              </button>
            )}

            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {qs.map((q, i) => (
                <div key={q.id} style={{ background:C.bgCard, border:`1px solid ${C.border}`, borderRadius:12, padding:"14px 16px", display:"flex", gap:12, alignItems:"flex-start" }}>
                  <div style={{ width:28, height:28, borderRadius:6, background:"rgba(255,255,255,0.05)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, color:C.gold, fontWeight:700, flexShrink:0, marginTop:1 }}>{i+1}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:14, color:C.cream, marginBottom:4, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{q.emoji} {q.question}</div>
                    <div style={{ fontSize:11, color:C.muted }}> Option {labels[q.correct]}  {q.type}</div>
                  </div>
                  <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                    <button onClick={() => startEdit(i)} style={{ background:"rgba(212,160,23,0.1)", border:`1px solid ${C.border}`, color:C.gold, padding:"5px 11px", borderRadius:6, fontSize:12, cursor:"pointer" }}>Edit</button>
                    <button onClick={() => del(i)}       style={{ background:"rgba(231,76,60,0.1)",  border:"1px solid rgba(231,76,60,0.3)", color:C.red, padding:"5px 11px", borderRadius:6, fontSize:12, cursor:"pointer" }}>Del</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/*  ANALYTICS TAB  */}
        {tab === "stats" && (
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              {[
                { icon:"", label:"Total Fans",      val:submissions.length },
                { icon:"", label:"Average Score",   val:avgScore },
                { icon:"", label:"Active Questions", val:qs.length },
                { icon:"", label:"Notify Signups",   val:submissions.filter(s=>s.notify).length },
              ].map(item => (
                <div key={item.label} style={{ background:C.bgCard, border:`1px solid ${C.border}`, borderRadius:12, padding:"16px" }}>
                  <div style={{ fontSize:22, marginBottom:8 }}>{item.icon}</div>
                  <div style={{ fontFamily:"Georgia,serif", fontSize:30, fontWeight:700, color:C.gold }}>{item.val}</div>
                  <div style={{ fontSize:12, color:C.muted, marginTop:2 }}>{item.label}</div>
                </div>
              ))}
            </div>

            {/* Recent entries */}
            <div style={{ background:C.bgCard, border:`1px solid ${C.border}`, borderRadius:12, padding:"16px" }}>
              <div style={{ fontSize:12, color:C.muted, letterSpacing:"0.12em", marginBottom:14 }}>RECENT ENTRIES</div>
              {submissions.length === 0 ? (
                <div style={{ textAlign:"center", padding:"32px 0", color:C.muted, fontSize:14 }}>No entries yet. Share the link! </div>
              ) : (
                submissions.slice(-15).reverse().map((s, i) => (
                  <div key={i} style={{ display:"flex", gap:12, padding:"10px 0", borderBottom:"1px solid rgba(255,255,255,0.04)", alignItems:"center" }}>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:13, color:C.cream, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{s.name}</div>
                      <div style={{ fontSize:11, color:C.muted, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{s.email}  {s.city||""}</div>
                    </div>
                    <div>
                      <span style={{ fontSize:12, color:C.gold, fontWeight:700 }}>{s.score}/{s.total}</span>
                    </div>
                    {s.notify && <span title="Wants notification" style={{ fontSize:14 }}></span>}
                  </div>
                ))
              )}
            </div>

            {/* Export button */}
            {submissions.length > 0 && (
              <button
                onClick={() => {
                  const csv = ["Name,Email,Phone,City,Score,Total,Badge,Notify,Date",
                    ...submissions.map(s => `"${s.name}","${s.email}","${s.phone||""}","${s.city||""}",${s.score},${s.total},"${s.badge}",${s.notify?1:0},"${s.timestamp||""}"`)
                  ].join("\n");
                  const a = document.createElement("a");
                  a.href = "data:text/csv;charset=utf-8,"+encodeURIComponent(csv);
                  a.download = "yusluv-challenge-entries.csv";
                  a.click();
                }}
                style={{ width:"100%", padding:"14px", borderRadius:40, border:`1px solid ${C.border}`, background:"rgba(212,160,23,0.06)", color:C.gold, fontWeight:600, fontSize:14, cursor:"pointer" }}
              >
                 Export All Entries as CSV
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// 
// DOWNLOAD CARD (Canvas)
// 
const buildCard = (score, questions) => {
  const tier   = getTier(score, questions.length);
  const canvas = document.createElement("canvas");
  canvas.width = 420; canvas.height = 660;
  const ctx    = canvas.getContext("2d");

  // Background gradient
  const bg = ctx.createLinearGradient(0, 0, 0, 660);
  bg.addColorStop(0, "#100800"); bg.addColorStop(0.5, "#1a0d00"); bg.addColorStop(1, "#080808");
  ctx.fillStyle = bg; ctx.fillRect(0, 0, 420, 660);

  // Gold outer border
  ctx.strokeStyle = "#D4A017"; ctx.lineWidth = 1.5;
  ctx.strokeRect(10, 10, 400, 640);
  // Inner thin border
  ctx.strokeStyle = "rgba(212,160,23,0.28)"; ctx.lineWidth = 0.5;
  ctx.strokeRect(18, 18, 384, 624);

  const coverImg = new Image();
  coverImg.onload = () => {
    // Cover art
    ctx.save();
    ctx.beginPath();
    ctx.rect(22, 22, 376, 210);
    ctx.clip();
    ctx.drawImage(coverImg, 22, 22, 376, 210);
    ctx.restore();
    const ovl = ctx.createLinearGradient(0, 22, 0, 232);
    ovl.addColorStop(0, "rgba(0,0,0,0.1)"); ovl.addColorStop(1, "rgba(0,0,0,0.78)");
    ctx.fillStyle = ovl; ctx.fillRect(22, 22, 376, 210);

    // DarkSkin Fav text on cover
    ctx.fillStyle = "#D4A017"; ctx.font = "italic bold 28px Georgia, serif";
    ctx.textAlign = "center";
    ctx.shadowColor = "rgba(212,160,23,0.5)"; ctx.shadowBlur = 12;
    ctx.fillText("DarkSkin Fav", 210, 218);
    ctx.shadowBlur = 0;

    // Divider
    ctx.strokeStyle = "rgba(212,160,23,0.28)"; ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.moveTo(50, 248); ctx.lineTo(370, 248); ctx.stroke();

    // Header
    ctx.fillStyle = "rgba(136,136,136,0.8)"; ctx.font = "500 9.5px -apple-system, sans-serif";
    ctx.letterSpacing = "2px"; ctx.fillText("HOW WELL I KNOW YUSLUV", 210, 272);

    // Score
    ctx.fillStyle = "#D4A017"; ctx.font = "900 82px Georgia, serif";
    ctx.shadowColor = "rgba(212,160,23,0.35)"; ctx.shadowBlur = 18;
    ctx.fillText(`${score}/${questions.length}`, 210, 368);
    ctx.shadowBlur = 0;

    // Pct
    ctx.fillStyle = "rgba(212,160,23,0.65)"; ctx.font = "400 13px -apple-system, sans-serif";
    ctx.fillText(`${Math.round((score/questions.length)*100)}% correct`, 210, 394);

    // Badge
    ctx.fillStyle = tier.color; ctx.font = "bold 19px -apple-system, sans-serif";
    ctx.shadowColor = tier.color; ctx.shadowBlur = 8;
    ctx.fillText(tier.badge, 210, 432);
    ctx.shadowBlur = 0;

    // Vibe
    ctx.fillStyle = "rgba(245,236,215,0.45)"; ctx.font = "400 12px -apple-system, sans-serif";
    const vibe = tier.vibe.length > 45 ? tier.vibe.slice(0, 44)+"" : tier.vibe;
    ctx.fillText(vibe, 210, 458);

    // Bottom divider
    ctx.strokeStyle = "rgba(212,160,23,0.2)"; ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.moveTo(50, 482); ctx.lineTo(370, 482); ctx.stroke();

    // Edition
    ctx.fillStyle = "rgba(136,136,136,0.6)"; ctx.font = "400 10px -apple-system, sans-serif";
    ctx.fillText("DarkSkin Fav Edition    Dropping Friday    ", 210, 504);

    // Handle
    ctx.fillStyle = "#D4A017"; ctx.font = "bold 13px -apple-system, sans-serif";
    ctx.fillText("@yusluvofficial_", 210, 636);

    // Download
    const a = document.createElement("a");
    a.download = "my-yusluv-wrapped.png";
    a.href = canvas.toDataURL("image/png", 1.0);
    a.click();
  };
  coverImg.src = "/cover.jpg";
};

// 
// MAIN APP
// 
export default function App() {
  const [view,         setView]         = useState("landing");
  const [questions,    setQuestions]    = useState(() => store.getQuestions() || DEFAULT_QUESTIONS);
  const [currentQ,     setCurrentQ]     = useState(0);
  const [selected,     setSelected]     = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score,        setScore]        = useState(0);
  const [fanInfo,      setFanInfo]      = useState({ name:"", email:"", phone:"", city:"", notify:true });
  const [countdown,    setCountdown]    = useState({});
  const [totalFans,    setTotalFans]    = useState(() => store.getSubmissions().length);
  const [submissions,  setSubmissions]  = useState(() => store.getSubmissions());
  const [showLogin,    setShowLogin]    = useState(false);
  const [pin,          setPin]          = useState("");
  const [pinErr,       setPinErr]       = useState("");
  const [saving,       setSaving]       = useState(false);

  useEffect(() => {
    const tick = () => {
      const diff = RELEASE_DATE - new Date();
      if (diff <= 0) { setCountdown({ dropped:true }); return; }
      setCountdown({ days:Math.floor(diff/86400000), hours:Math.floor((diff%86400000)/3600000), minutes:Math.floor((diff%3600000)/60000), seconds:Math.floor((diff%60000)/1000) });
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  const startQuiz = () => { setCurrentQ(0); setSelected(null); setShowFeedback(false); setScore(0); setView("quiz"); };

  const handleAnswer = i => {
    if (showFeedback) return;
    setSelected(i); setShowFeedback(true);
    if (i === questions[currentQ].correct) setScore(s => s+1);
  };

  const nextQuestion = () => {
    setShowFeedback(false); setSelected(null);
    if (currentQ+1 >= questions.length) setView("result");
    else setCurrentQ(q => q+1);
  };

  const adminLogin = () => {
    if (pin.trim().toUpperCase() === ADMIN_PIN.toUpperCase()) {
      setShowLogin(false); setView("admin"); setPinErr(""); setPin("");
    } else { setPinErr("Wrong PIN. Try again."); }
  };

  const saveQuestions = qs => { setSaving(true); store.setQuestions(qs); setQuestions(qs); setTimeout(() => setSaving(false), 500); };

  const submitFan = () => {
    if (!fanInfo.name.trim() || !fanInfo.email.trim()) return;
    const tier  = getTier(score, questions.length);
    const entry = { ...fanInfo, score, total:questions.length, badge:tier.badge, timestamp:new Date().toISOString() };
    store.addSubmission(entry);
    const updated = store.getSubmissions();
    setSubmissions(updated); setTotalFans(updated.length);
    setView("success");
  };

  if (showLogin) return <AdminLogin pin={pin} setPin={setPin} err={pinErr} onLogin={adminLogin} onClose={() => setShowLogin(false)} />;

  switch (view) {
    case "landing": return <Landing cd={countdown} totalFans={totalFans} onStart={startQuiz} onAdmin={() => setShowLogin(true)} questions={questions} />;
    case "quiz":    return <Quiz questions={questions} currentQ={currentQ} selected={selected} showFeedback={showFeedback} score={score} onAnswer={handleAnswer} onNext={nextQuestion} />;
    case "result":  return <Result questions={questions} score={score} onDownload={() => buildCard(score, questions)} onGiveaway={() => setView("email")} />;
    case "email":   return <EmailCollection fanInfo={fanInfo} setFanInfo={setFanInfo} score={score} questions={questions} onSubmit={submitFan} />;
    case "success": return <Success fanInfo={fanInfo} score={score} questions={questions} onHome={() => setView("landing")} />;
    case "admin":   return <Admin questions={questions} submissions={submissions} saving={saving} onSave={saveQuestions} onBack={() => setView("landing")} />;
    default:        return null;
  }
}

