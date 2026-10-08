import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { closeModal } from '../state/actions';

export function Modal({ title, children }: { title: string; children: ReactNode }) {
  const close = useRef<HTMLButtonElement>(null);
  useEffect(() => { close.current?.focus(); }, []);
  return (
    <div className="scrim" onClick={closeModal}>
      <section className="modal card" role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <header>
          <h2>{title}</h2>
          <button ref={close} className="icon-btn" onClick={closeModal} aria-label="Close"><X size={22} /></button>
        </header>
        {children}
      </section>
    </div>
  );
}
