import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Replace copy with the exact text from the Figma frames.
const SLIDES = [
  { title: 'Plan your day', body: 'Organise your priorities and focus on what matters most.' },
  { title: 'Work in focused blocks', body: 'Set aside 25 uninterrupted minutes, then take a short break.' },
  { title: 'Review your progress', body: 'Close the day by checking what you finished and what moves to tomorrow.' }
];

export default function FocusNotes() {
  const [index, setIndex] = useState(0);
  const total = SLIDES.length;
  const go = (n) => setIndex((n + total) % total);
  const slide = SLIDES[index];

  return (
    <section className="card notes" aria-roledescription="carousel" aria-label="Focus notes">
      <p className="notes-count">Focus notes: {index + 1} of {total}</p>
      <div aria-live="polite">
        <h2>{slide.title}</h2>
        <p>{slide.body}</p>
      </div>
      <div className="notes-controls">
        <div className="dots" role="group" aria-label="Choose slide">
          {SLIDES.map((s, i) => (
            <button key={s.title} className={`dot ${i === index ? 'active' : ''}`}
              onClick={() => go(i)} aria-label={`Go to slide ${i + 1}: ${s.title}`} aria-current={i === index} />
          ))}
        </div>
        <div className="row">
          <button className="btn ghost" onClick={() => go(index - 1)} aria-label="Previous slide"><ChevronLeft size={18} />Previous</button>
          <button className="btn ghost" onClick={() => go(index + 1)} aria-label="Next slide">Next<ChevronRight size={18} /></button>
        </div>
      </div>
    </section>
  );
}
