import { useState, useRef, useEffect } from 'react';
import { Info } from 'lucide-react';

interface Props {
    text: string;
    placement?: 'top' | 'bottom';
}

export default function InfoTooltip({ text, placement = 'top' }: Props) {
    const [show, setShow] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!show) return;
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setShow(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [show]);

    return (
        <div ref={ref} style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
            <button
                className="info-tooltip-btn"
                onClick={() => setShow((s) => !s)}
                onMouseEnter={() => setShow(true)}
                onMouseLeave={() => setShow(false)}
                aria-label="More info"
            >
                <Info size={13} />
            </button>
            {show && (
                <div className={`tooltip-popover tooltip-popover--${placement}`}>
                    {text}
                </div>
            )}
        </div>
    );
}
