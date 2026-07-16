"use client";

import { useEffect, useRef } from "react";

/**
 * A pointer-driven signature canvas. Emits a PNG data URL via onChange whenever
 * the drawing changes (null after a clear). Works with mouse, touch, and pen.
 */
export function SignaturePad({
  onChange,
  disabled,
}: {
  onChange: (dataUrl: string | null) => void;
  disabled?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawing = useRef(false);
  const dirty = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);

  // Size the canvas backing store to its rendered size (crisp on HiDPI).
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.round(rect.width * ratio);
    canvas.height = Math.round(rect.height * ratio);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(ratio, ratio);
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    // Ink color follows the injected brand foreground token; never hardcoded.
    const ink = getComputedStyle(document.documentElement)
      .getPropertyValue("--brand-foreground")
      .trim();
    ctx.strokeStyle = ink || "currentColor";
  }, []);

  function pointFromEvent(e: React.PointerEvent<HTMLCanvasElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function start(e: React.PointerEvent<HTMLCanvasElement>) {
    if (disabled) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drawing.current = true;
    last.current = pointFromEvent(e);
  }

  function move(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current || disabled) return;
    const ctx = canvasRef.current?.getContext("2d");
    const from = last.current;
    if (!ctx || !from) return;
    const to = pointFromEvent(e);
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
    last.current = to;
    dirty.current = true;
  }

  function end() {
    if (!drawing.current) return;
    drawing.current = false;
    last.current = null;
    const canvas = canvasRef.current;
    if (canvas && dirty.current) onChange(canvas.toDataURL("image/png"));
  }

  function clear() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    dirty.current = false;
    onChange(null);
  }

  return (
    <div>
      <canvas
        ref={canvasRef}
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={end}
        onPointerLeave={end}
        role="img"
        aria-label="Signature drawing area"
        className="signature-canvas h-40 w-full rounded-md border border-foreground/20 bg-white"
      />
      <div className="mt-2 flex items-center justify-between">
        <p className="text-xs text-muted">Draw your signature above.</p>
        <button
          type="button"
          onClick={clear}
          disabled={disabled}
          className="text-xs font-medium text-brand underline underline-offset-2 hover:text-brand-dark disabled:opacity-50"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
