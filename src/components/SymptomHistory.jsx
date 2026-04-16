import { useState, useEffect } from 'react';
import { loadSymptoms, loadMindEntries, getWeeklySummary } from '../utils/storage';
import './SymptomHistory.css';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

export default function SymptomHistory() {
  const [symptoms, setSymptoms] = useState([]);
  const [mindEntries, setMindEntries] = useState([]);
  const [weeklySummary, setWeeklySummary] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const now = new Date();
  const [calYear, setCalYear] = useState(now.getFullYear());
  const [calMonth, setCalMonth] = useState(now.getMonth());

  useEffect(() => {
    setSymptoms(loadSymptoms());
    setMindEntries(loadMindEntries());
    setWeeklySummary(getWeeklySummary());
  }, []);

  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay = getFirstDayOfMonth(calYear, calMonth);

  // Map date -> entries
  const dateMap = {};
  symptoms.forEach(s => {
    const d = new Date(s.date);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    if (!dateMap[key]) dateMap[key] = [];
    dateMap[key].push({...s, type:'body'});
  });
  mindEntries.forEach(m => {
    const d = new Date(m.date);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    if (!dateMap[key]) dateMap[key] = [];
    dateMap[key].push({...m, type:'mind'});
  });

  const selectedKey = selectedDate 
    ? `${selectedDate.getFullYear()}-${selectedDate.getMonth()}-${selectedDate.getDate()}`
    : null;

  const selectedEntries = selectedKey ? (dateMap[selectedKey] || []) : [];

  const prevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y-1); }
    else setCalMonth(m => m-1);
    setSelectedDate(null);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y+1); }
    else setCalMonth(m => m+1);
    setSelectedDate(null);
  };

  return (
    <div className="symptom-history">
      {/* Weekly Summary */}
      {weeklySummary ? (
        <div className="glass-card-orange weekly-card fade-in">
          <div className="weekly-header">
            <div className="weekly-icon">📊</div>
            <div>
              <h2 className="weekly-title">Weekly Health Summary</h2>
              <p className="weekly-sub">Last 7 days overview</p>
            </div>
            <div className={`trend-badge ${weeklySummary.trend}`}>
              {weeklySummary.trend === 'improving' ? '📈 Improving' : 
               weeklySummary.trend === 'moderate' ? '➡️ Stable' : '📉 Worsening'}
            </div>
          </div>
          <div className="weekly-stats">
            <div className="stat-item">
              <span className="stat-value">{weeklySummary.totalEntries}</span>
              <span className="stat-label">Entries</span>
            </div>
            <div className="stat-divider"/>
            <div className="stat-item">
              <span className="stat-value">{weeklySummary.avgPain}</span>
              <span className="stat-label">Avg Pain</span>
            </div>
            <div className="stat-divider"/>
            <div className="stat-item">
              <span className="stat-value" style={{textTransform:'capitalize', fontSize:'14px'}}>
                {weeklySummary.mostFrequentPart?.replace(/-/g,' ')}
              </span>
              <span className="stat-label">Most Frequent</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-card empty-summary">
          <p className="empty-title">📊 No weekly data yet</p>
          <p className="empty-sub">Start logging symptoms using the Body or Mind tabs to see your weekly health summary</p>
        </div>
      )}

      {/* Calendar */}
      <div className="glass-card calendar-wrap">
        <div className="cal-header">
          <button className="cal-nav-btn" onClick={prevMonth} id="cal-prev">‹</button>
          <h3 className="cal-title">{MONTHS[calMonth]} {calYear}</h3>
          <button className="cal-nav-btn" onClick={nextMonth} id="cal-next">›</button>
        </div>

        <div className="cal-grid">
          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
            <div key={d} className="cal-day-label">{d}</div>
          ))}
          {/* Empty cells */}
          {Array.from({length: firstDay}).map((_, i) => (
            <div key={`empty-${i}`} className="cal-cell empty"/>
          ))}
          {/* Day cells */}
          {Array.from({length: daysInMonth}).map((_, i) => {
            const day = i + 1;
            const key = `${calYear}-${calMonth}-${day}`;
            const hasEntries = !!dateMap[key];
            const bodyCount = dateMap[key]?.filter(e=>e.type==='body').length || 0;
            const mindCount = dateMap[key]?.filter(e=>e.type==='mind').length || 0;
            const isToday = day === now.getDate() && calMonth === now.getMonth() && calYear === now.getFullYear();
            const isSelected = selectedDate?.getDate() === day && selectedDate?.getMonth() === calMonth;

            return (
              <button
                key={day}
                className={`cal-cell ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${hasEntries ? 'has-entry' : ''}`}
                onClick={() => setSelectedDate(new Date(calYear, calMonth, day))}
                id={`cal-day-${day}`}
              >
                <span className="cal-day-num">{day}</span>
                {hasEntries && (
                  <div className="entry-dots">
                    {bodyCount > 0 && <span className="dot orange">{bodyCount}</span>}
                    {mindCount > 0 && <span className="dot cyan">{mindCount}</span>}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="cal-legend">
          <span><span className="dot orange small"/> Body Symptoms</span>
          <span><span className="dot cyan small"/> Mind Entries</span>
        </div>
      </div>

      {/* Selected date entries */}
      {selectedDate && (
        <div className="glass-card entries-panel fade-in">
          <h3 className="entries-title">
            📅 {selectedDate.toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' })}
          </h3>
          {selectedEntries.length === 0 ? (
            <p className="no-entries">No health entries recorded on this date</p>
          ) : (
            <div className="entries-list">
              {selectedEntries.map((entry, i) => (
                <div key={i} className={`entry-item ${entry.type}`}>
                  <div className="entry-icon">
                    {entry.type === 'body' ? '🦴' : '🧠'}
                  </div>
                  <div className="entry-content">
                    {entry.type === 'body' ? (
                      <>
                        <div className="entry-header">
                          <span className="entry-type">Body Symptom</span>
                          <span className="entry-time">
                            {new Date(entry.date).toLocaleTimeString('en-US', {hour:'2-digit', minute:'2-digit'})}
                          </span>
                        </div>
                        <p className="entry-main">{entry.bodyPart?.replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase())}</p>
                        <div className="entry-meta">
                          <span className="badge badge-orange">Pain: {entry.painIntensity}/10</span>
                          <span className="badge badge-cyan">{entry.duration}</span>
                          {entry.aiDiagnosis && <span className="badge" style={{background:'rgba(168,85,247,0.1)',color:'#c084fc',border:'1px solid rgba(168,85,247,0.2)'}}>
                            AI: {entry.aiDiagnosis}
                          </span>}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="entry-header">
                          <span className="entry-type">Mind Entry</span>
                          <span className="entry-time">
                            {new Date(entry.date).toLocaleTimeString('en-US', {hour:'2-digit', minute:'2-digit'})}
                          </span>
                        </div>
                        <div className="entry-meta">
                          <span className="badge badge-green">Mood: {entry.mood}/10</span>
                          <span className="badge badge-cyan">Sleep: {entry.sleep}/10</span>
                          <span className="badge badge-red">Stress: {entry.stress}/10</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Recent history list */}
      {symptoms.length > 0 && (
        <div className="glass-card recent-list">
          <h3 className="entries-title">📋 Recent Symptom Log</h3>
          <div className="entries-list">
            {symptoms.slice(0, 10).map((s, i) => (
              <div key={i} className="entry-item body">
                <div className="entry-icon">🦴</div>
                <div className="entry-content">
                  <div className="entry-header">
                    <span className="entry-main">{s.bodyPart?.replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase())}</span>
                    <span className="entry-time">{new Date(s.date).toLocaleDateString()}</span>
                  </div>
                  <div className="entry-meta">
                    <span className="badge badge-orange">Pain: {s.painIntensity}/10</span>
                    {s.aiDiagnosis && <span className="badge" style={{background:'rgba(168,85,247,0.1)',color:'#c084fc',border:'1px solid rgba(168,85,247,0.2)'}}>
                      {s.aiDiagnosis}
                    </span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
