import { useEffect, useRef, useState } from "react";

export function useTransientState<T>({
  value,
  delay = 1000,
}: {
  value: T;
  delay?: number;
}) {
  const [visibleValue, setVisibleValue] = useState<T | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>(undefined);
  const prevValueRef = useRef<T | undefined>(undefined);

  useEffect(() => {
    if (prevValueRef.current === value) return;

    if (prevValueRef.current === undefined) {
      prevValueRef.current = value;
      return;
    }

    prevValueRef.current = value;

    setVisibleValue(value);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setVisibleValue(null);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay]);

  return visibleValue;
}
