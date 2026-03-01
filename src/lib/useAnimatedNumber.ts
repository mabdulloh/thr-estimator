import { useEffect, useRef, useState } from 'react';

function easeOutQuart(t: number): number {
    return 1 - Math.pow(1 - t, 4);
}

export function useAnimatedNumber(target: number, duration = 500): number {
    const [display, setDisplay] = useState(target);
    const startRef = useRef<number | null>(null);
    const fromRef = useRef(target);
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
        const from = fromRef.current;
        if (from === target) return;

        if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
        startRef.current = null;

        const animate = (now: number) => {
            if (startRef.current === null) startRef.current = now;
            const elapsed = now - startRef.current;
            const progress = Math.min(elapsed / duration, 1);
            const eased = easeOutQuart(progress);
            setDisplay(Math.round(from + (target - from) * eased));

            if (progress < 1) {
                rafRef.current = requestAnimationFrame(animate);
            } else {
                fromRef.current = target;
            }
        };

        rafRef.current = requestAnimationFrame(animate);
        return () => {
            if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
        };
    }, [target, duration]);

    // Sync fromRef when target stops changing
    useEffect(() => {
        fromRef.current = display;
    });

    return display;
}
