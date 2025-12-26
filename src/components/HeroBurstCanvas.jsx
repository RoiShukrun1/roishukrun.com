import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Billboard } from "@react-three/drei";
import * as THREE from "three";
import React, {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const DEFAULT_PARTICLE_COUNT = 16;
const LIFE_MS_MIN = 1400;
const LIFE_MS_MAX = 1900;

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function makeCanvasTexture(draw, size = 128) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Transparent background
  ctx.clearRect(0, 0, size, size);
  draw(ctx, size);

  // Hard mask to a circle so the particle can never look rectangular,
  // even when shadows/glow are used and many particles overlap.
  ctx.save();
  ctx.globalCompositeOperation = "destination-in";
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size * 0.49, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  return texture;
}

// CS/Engineering icon-like glyphs (simple vector-ish drawings)
function withAlpha(color, alpha) {
  // Prefer modern CSS color syntax if using hsl()
  if (typeof color === "string" && color.trim().startsWith("hsl(")) {
    return color.trim().replace(/\)$/, ` / ${alpha})`);
  }
  // Fallback: keep a reasonable purple glow
  return "rgba(139, 92, 246, 0.45)";
}

function createIconTextures(color = "hsl(262 83% 58%)") {
  const stroke = color;
  const glow = withAlpha(color, 0.45);

  const common = (ctx, size) => {
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = stroke;
    ctx.fillStyle = stroke;
    ctx.shadowColor = glow;
    ctx.shadowBlur = 10;
  };

  const cpu = makeCanvasTexture((ctx, s) => {
    common(ctx, s);
    const pad = s * 0.22;
    const w = s - pad * 2;
    ctx.lineWidth = s * 0.06;
    ctx.strokeRect(pad, pad, w, w);
    ctx.fillRect(pad + w * 0.28, pad + w * 0.28, w * 0.44, w * 0.44);
    // pins
    const pinCount = 4;
    for (let i = 0; i < pinCount; i++) {
      const t = (i + 1) / (pinCount + 1);
      const x = pad + w * t;
      ctx.beginPath();
      ctx.moveTo(x, pad - s * 0.08);
      ctx.lineTo(x, pad);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, pad + w);
      ctx.lineTo(x, pad + w + s * 0.08);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(pad - s * 0.08, pad + w * t);
      ctx.lineTo(pad, pad + w * t);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(pad + w, pad + w * t);
      ctx.lineTo(pad + w + s * 0.08, pad + w * t);
      ctx.stroke();
    }
  });

  const database = makeCanvasTexture((ctx, s) => {
    common(ctx, s);
    ctx.lineWidth = s * 0.06;
    const cx = s / 2;
    const topY = s * 0.28;
    const rX = s * 0.22;
    const rY = s * 0.1;
    const stack = 3;
    for (let i = 0; i < stack; i++) {
      const y = topY + i * s * 0.14;
      ctx.beginPath();
      ctx.ellipse(cx, y, rX, rY, 0, 0, Math.PI * 2);
      ctx.stroke();
      if (i < stack - 1) {
        ctx.beginPath();
        ctx.moveTo(cx - rX, y);
        ctx.lineTo(cx - rX, y + s * 0.14);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx + rX, y);
        ctx.lineTo(cx + rX, y + s * 0.14);
        ctx.stroke();
      }
    }
  });

  const terminal = makeCanvasTexture((ctx, s) => {
    common(ctx, s);
    ctx.lineWidth = s * 0.06;
    const pad = s * 0.2;
    ctx.strokeRect(pad, pad, s - pad * 2, s - pad * 2);
    // >_
    ctx.shadowBlur = 0;
    ctx.font = `bold ${Math.floor(
      s * 0.32
    )}px ui-monospace, SFMono-Regular, Menlo, monospace`;
    ctx.fillStyle = stroke;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(">_", pad + s * 0.14, s / 2);
  });

  const cloud = makeCanvasTexture((ctx, s) => {
    common(ctx, s);
    ctx.lineWidth = s * 0.06;
    const y = s * 0.56;
    ctx.beginPath();
    ctx.moveTo(s * 0.28, y);
    ctx.bezierCurveTo(s * 0.18, y, s * 0.16, s * 0.42, s * 0.28, s * 0.4);
    ctx.bezierCurveTo(s * 0.3, s * 0.28, s * 0.42, s * 0.24, s * 0.5, s * 0.34);
    ctx.bezierCurveTo(
      s * 0.56,
      s * 0.22,
      s * 0.72,
      s * 0.26,
      s * 0.72,
      s * 0.4
    );
    ctx.bezierCurveTo(s * 0.84, s * 0.42, s * 0.84, y, s * 0.72, y);
    ctx.lineTo(s * 0.28, y);
    ctx.stroke();
  });

  const network = makeCanvasTexture((ctx, s) => {
    common(ctx, s);
    ctx.lineWidth = s * 0.06;
    const pts = [
      [s * 0.32, s * 0.34],
      [s * 0.68, s * 0.3],
      [s * 0.6, s * 0.7],
      [s * 0.28, s * 0.64],
    ];
    // edges
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    ctx.lineTo(pts[1][0], pts[1][1]);
    ctx.lineTo(pts[2][0], pts[2][1]);
    ctx.lineTo(pts[3][0], pts[3][1]);
    ctx.closePath();
    ctx.stroke();
    // nodes
    pts.forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, s * 0.06, 0, Math.PI * 2);
      ctx.fill();
    });
  });

  // Git logo: branching tree structure
  const git = makeCanvasTexture((ctx, s) => {
    common(ctx, s);
    ctx.lineWidth = s * 0.05;
    const cx = s / 2;
    const cy = s / 2;
    // Main trunk
    ctx.beginPath();
    ctx.moveTo(cx, s * 0.22);
    ctx.lineTo(cx, cy);
    ctx.stroke();
    // Left branch
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx - s * 0.2, cy + s * 0.15);
    ctx.stroke();
    // Right branch
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + s * 0.2, cy + s * 0.15);
    ctx.stroke();
    // Top node
    ctx.beginPath();
    ctx.arc(cx, s * 0.22, s * 0.06, 0, Math.PI * 2);
    ctx.fill();
    // Branch nodes
    ctx.beginPath();
    ctx.arc(cx - s * 0.2, cy + s * 0.15, s * 0.05, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx + s * 0.2, cy + s * 0.15, s * 0.05, 0, Math.PI * 2);
    ctx.fill();
    // Center merge node
    ctx.beginPath();
    ctx.arc(cx, cy, s * 0.05, 0, Math.PI * 2);
    ctx.fill();
  });

  const code = makeCanvasTexture((ctx, s) => {
    common(ctx, s);
    ctx.shadowBlur = 0;
    ctx.fillStyle = stroke;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `700 ${Math.floor(
      s * 0.46
    )}px ui-monospace, SFMono-Regular, Menlo, monospace`;
    ctx.fillText("</>", s / 2, s / 2);
  });

  const braces = makeCanvasTexture((ctx, s) => {
    common(ctx, s);
    ctx.shadowBlur = 0;
    ctx.fillStyle = stroke;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `800 ${Math.floor(
      s * 0.5
    )}px ui-monospace, SFMono-Regular, Menlo, monospace`;
    ctx.fillText("{}", s / 2, s / 2);
  });

  const server = makeCanvasTexture((ctx, s) => {
    common(ctx, s);
    ctx.lineWidth = s * 0.06;
    const padX = s * 0.22;
    const padY = s * 0.22;
    const w = s - padX * 2;
    const h = s * 0.16;
    for (let i = 0; i < 3; i++) {
      const y = padY + i * s * 0.2;
      ctx.strokeRect(padX, y, w, h);
      // indicator dots
      ctx.beginPath();
      ctx.arc(padX + w * 0.12, y + h / 2, s * 0.03, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(padX + w * 0.24, y + h / 2, s * 0.03, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  const lock = makeCanvasTexture((ctx, s) => {
    common(ctx, s);
    ctx.lineWidth = s * 0.06;
    const cx = s / 2;
    const top = s * 0.28;
    const bodyW = s * 0.34;
    const bodyH = s * 0.34;
    // shackle
    ctx.beginPath();
    ctx.arc(cx, top + s * 0.12, s * 0.16, Math.PI, 0);
    ctx.stroke();
    // body
    ctx.strokeRect(cx - bodyW / 2, top + s * 0.22, bodyW, bodyH);
    // keyhole
    ctx.beginPath();
    ctx.arc(cx, top + s * 0.36, s * 0.03, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx, top + s * 0.39);
    ctx.lineTo(cx, top + s * 0.48);
    ctx.stroke();
  });

  const bug = makeCanvasTexture((ctx, s) => {
    common(ctx, s);
    ctx.lineWidth = s * 0.06;
    const cx = s / 2;
    // body
    ctx.beginPath();
    ctx.ellipse(cx, s * 0.56, s * 0.16, s * 0.2, 0, 0, Math.PI * 2);
    ctx.stroke();
    // head
    ctx.beginPath();
    ctx.arc(cx, s * 0.34, s * 0.1, 0, Math.PI * 2);
    ctx.stroke();
    // antennae
    ctx.beginPath();
    ctx.moveTo(cx - s * 0.05, s * 0.24);
    ctx.lineTo(cx - s * 0.14, s * 0.16);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx + s * 0.05, s * 0.24);
    ctx.lineTo(cx + s * 0.14, s * 0.16);
    ctx.stroke();
    // legs
    const legYs = [s * 0.46, s * 0.56, s * 0.66];
    legYs.forEach((y) => {
      ctx.beginPath();
      ctx.moveTo(cx - s * 0.16, y);
      ctx.lineTo(cx - s * 0.28, y - s * 0.03);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx + s * 0.16, y);
      ctx.lineTo(cx + s * 0.28, y - s * 0.03);
      ctx.stroke();
    });
  });

  const graph = makeCanvasTexture((ctx, s) => {
    common(ctx, s);
    ctx.lineWidth = s * 0.06;
    const pad = s * 0.24;
    // axes
    ctx.beginPath();
    ctx.moveTo(pad, pad);
    ctx.lineTo(pad, s - pad);
    ctx.lineTo(s - pad, s - pad);
    ctx.stroke();
    // line
    const pts = [
      [pad + s * 0.06, s - pad - s * 0.06],
      [pad + s * 0.16, s - pad - s * 0.18],
      [pad + s * 0.28, s - pad - s * 0.12],
      [pad + s * 0.4, s - pad - s * 0.3],
    ];
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.stroke();
    pts.forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, s * 0.03, 0, Math.PI * 2);
      ctx.fill();
    });
  });

  const api = makeCanvasTexture((ctx, s) => {
    common(ctx, s);
    ctx.shadowBlur = 0;
    ctx.fillStyle = stroke;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `900 ${Math.floor(
      s * 0.42
    )}px ui-monospace, SFMono-Regular, Menlo, monospace`;
    ctx.fillText("API", s / 2, s / 2);
  });

  const http = makeCanvasTexture((ctx, s) => {
    common(ctx, s);
    ctx.shadowBlur = 0;
    ctx.fillStyle = stroke;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `900 ${Math.floor(
      s * 0.34
    )}px ui-monospace, SFMono-Regular, Menlo, monospace`;
    ctx.fillText("HTTP", s / 2, s / 2);
  });

  const ai = makeCanvasTexture((ctx, s) => {
    common(ctx, s);
    ctx.lineWidth = s * 0.06;
    const pad = s * 0.22;
    const w = s - pad * 2;
    ctx.strokeRect(pad, pad, w, w);
    // pins (top/bottom)
    for (let i = 0; i < 4; i++) {
      const t = (i + 1) / 5;
      const x = pad + w * t;
      ctx.beginPath();
      ctx.moveTo(x, pad - s * 0.07);
      ctx.lineTo(x, pad);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, pad + w);
      ctx.lineTo(x, pad + w + s * 0.07);
      ctx.stroke();
    }
    // AI text
    ctx.shadowBlur = 0;
    ctx.fillStyle = stroke;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `900 ${Math.floor(
      s * 0.34
    )}px ui-monospace, SFMono-Regular, Menlo, monospace`;
    ctx.fillText("AI", s / 2, s / 2 + s * 0.02);
  });

  const binary = makeCanvasTexture((ctx, s) => {
    common(ctx, s);
    ctx.shadowBlur = 0;
    ctx.fillStyle = stroke;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `800 ${Math.floor(
      s * 0.26
    )}px ui-monospace, SFMono-Regular, Menlo, monospace`;
    ctx.fillText("0101", s / 2, s / 2 - s * 0.1);
    ctx.fillText("1010", s / 2, s / 2 + s * 0.12);
  });

  const shield = makeCanvasTexture((ctx, s) => {
    common(ctx, s);
    ctx.lineWidth = s * 0.06;
    const cx = s / 2;
    const top = s * 0.22;
    const w = s * 0.34;
    ctx.beginPath();
    ctx.moveTo(cx, top);
    ctx.lineTo(cx - w, top + s * 0.1);
    ctx.lineTo(cx - w * 0.9, top + s * 0.36);
    ctx.quadraticCurveTo(cx, top + s * 0.64, cx + w * 0.9, top + s * 0.36);
    ctx.lineTo(cx + w, top + s * 0.1);
    ctx.closePath();
    ctx.stroke();
    // check mark
    ctx.beginPath();
    ctx.moveTo(cx - s * 0.1, top + s * 0.32);
    ctx.lineTo(cx - s * 0.02, top + s * 0.42);
    ctx.lineTo(cx + s * 0.14, top + s * 0.26);
    ctx.stroke();
  });

  const memory = makeCanvasTexture((ctx, s) => {
    common(ctx, s);
    ctx.lineWidth = s * 0.06;
    const padX = s * 0.2;
    const padY = s * 0.32;
    const w = s - padX * 2;
    const h = s * 0.28;
    ctx.strokeRect(padX, padY, w, h);
    // slots
    for (let i = 0; i < 3; i++) {
      const x = padX + w * (0.25 + i * 0.25);
      ctx.beginPath();
      ctx.moveTo(x, padY);
      ctx.lineTo(x, padY + h);
      ctx.stroke();
    }
    // pins
    for (let i = 0; i < 5; i++) {
      const t = (i + 1) / 6;
      const x = padX + w * t;
      ctx.beginPath();
      ctx.moveTo(x, padY + h);
      ctx.lineTo(x, padY + h + s * 0.08);
      ctx.stroke();
    }
  });

  const container = makeCanvasTexture((ctx, s) => {
    common(ctx, s);
    ctx.lineWidth = s * 0.06;
    const pad = s * 0.2;
    ctx.strokeRect(pad, pad, s - pad * 2, s - pad * 2);
    // small boxes grid
    const box = s * 0.1;
    const gap = s * 0.05;
    const startX = pad + s * 0.1;
    const startY = pad + s * 0.14;
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 3; col++) {
        ctx.strokeRect(
          startX + col * (box + gap),
          startY + row * (box + gap),
          box,
          box
        );
      }
    }
    // ship/container baseline
    ctx.beginPath();
    ctx.moveTo(pad + s * 0.06, pad + s * 0.6);
    ctx.lineTo(s - pad - s * 0.06, pad + s * 0.6);
    ctx.stroke();
  });

  const mobile = makeCanvasTexture((ctx, s) => {
    common(ctx, s);
    ctx.lineWidth = s * 0.06;
    const w = s * 0.42;
    const h = s * 0.62;
    const x = (s - w) / 2;
    const y = (s - h) / 2;
    // rounded rect
    const r = s * 0.06;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.stroke();
    // home indicator
    ctx.beginPath();
    ctx.arc(s / 2, y + h - s * 0.1, s * 0.03, 0, Math.PI * 2);
    ctx.fill();
  });

  // REST API icon
  const rest = makeCanvasTexture((ctx, s) => {
    common(ctx, s);
    ctx.shadowBlur = 0;
    ctx.fillStyle = stroke;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `900 ${Math.floor(
      s * 0.38
    )}px ui-monospace, SFMono-Regular, Menlo, monospace`;
    ctx.fillText("REST", s / 2, s / 2);
  });

  // Figma logo: stylized "F"
  const figma = makeCanvasTexture((ctx, s) => {
    common(ctx, s);
    ctx.lineWidth = s * 0.08;
    const pad = s * 0.24;
    const w = s - pad * 2;
    const h = s - pad * 2;
    const x = pad;
    const y = pad;
    // Outer rounded square
    const r = s * 0.08;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.stroke();
    // "F" shape
    ctx.lineWidth = s * 0.1;
    ctx.beginPath();
    ctx.moveTo(x + w * 0.28, y + h * 0.2);
    ctx.lineTo(x + w * 0.28, y + h * 0.8);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + w * 0.28, y + h * 0.2);
    ctx.lineTo(x + w * 0.72, y + h * 0.2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + w * 0.28, y + h * 0.5);
    ctx.lineTo(x + w * 0.6, y + h * 0.5);
    ctx.stroke();
  });

  // React logo: atom symbol
  const react = makeCanvasTexture((ctx, s) => {
    common(ctx, s);
    ctx.lineWidth = s * 0.04;
    const cx = s / 2;
    const cy = s / 2;
    const r = s * 0.28;
    // Three orbital rings at 60-degree angles
    for (let i = 0; i < 3; i++) {
      const angle = (Math.PI * 2 * i) / 3;
      const a = Math.cos(angle);
      const b = Math.sin(angle);
      ctx.beginPath();
      ctx.ellipse(
        cx,
        cy,
        r * Math.abs(a),
        r * Math.abs(b),
        angle,
        0,
        Math.PI * 2
      );
      ctx.stroke();
    }
    // Center dot
    ctx.beginPath();
    ctx.arc(cx, cy, s * 0.06, 0, Math.PI * 2);
    ctx.fill();
  });

  // Node.js: hexagon with "JS"
  const nodejs = makeCanvasTexture((ctx, s) => {
    common(ctx, s);
    ctx.lineWidth = s * 0.06;
    const cx = s / 2;
    const cy = s / 2;
    const r = s * 0.28;
    // Hexagon
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 6;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
    // "JS" text
    ctx.shadowBlur = 0;
    ctx.fillStyle = stroke;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `900 ${Math.floor(
      s * 0.32
    )}px ui-monospace, SFMono-Regular, Menlo, monospace`;
    ctx.fillText("JS", cx, cy);
  });

  // Docker: whale/container ship
  const docker = makeCanvasTexture((ctx, s) => {
    common(ctx, s);
    ctx.lineWidth = s * 0.05;
    const cx = s / 2;
    const cy = s * 0.58;
    // Whale body (rounded top)
    ctx.beginPath();
    ctx.moveTo(s * 0.22, cy);
    ctx.quadraticCurveTo(s * 0.18, s * 0.32, cx, s * 0.32);
    ctx.quadraticCurveTo(s * 0.82, s * 0.32, s * 0.78, cy);
    ctx.lineTo(s * 0.22, cy);
    ctx.stroke();
    // Container boxes on top
    const boxW = s * 0.12;
    const boxH = s * 0.1;
    for (let i = 0; i < 3; i++) {
      const x = s * 0.32 + i * s * 0.16;
      const y = s * 0.24;
      ctx.strokeRect(x, y, boxW, boxH);
    }
    // Tail
    ctx.beginPath();
    ctx.moveTo(s * 0.78, cy);
    ctx.lineTo(s * 0.88, cy - s * 0.08);
    ctx.lineTo(s * 0.88, cy + s * 0.08);
    ctx.closePath();
    ctx.stroke();
  });

  // Python: snake symbol
  const python = makeCanvasTexture((ctx, s) => {
    common(ctx, s);
    ctx.lineWidth = s * 0.06;
    const cx = s / 2;
    const cy = s / 2;
    // Snake body (S-curve)
    ctx.beginPath();
    ctx.moveTo(cx - s * 0.2, cy - s * 0.15);
    ctx.bezierCurveTo(
      cx - s * 0.1,
      cy - s * 0.25,
      cx + s * 0.1,
      cy - s * 0.05,
      cx,
      cy
    );
    ctx.bezierCurveTo(
      cx - s * 0.1,
      cy + s * 0.05,
      cx + s * 0.1,
      cy + s * 0.25,
      cx + s * 0.2,
      cy + s * 0.15
    );
    ctx.stroke();
    // Head
    ctx.beginPath();
    ctx.arc(cx - s * 0.2, cy - s * 0.15, s * 0.06, 0, Math.PI * 2);
    ctx.fill();
    // Tail
    ctx.beginPath();
    ctx.arc(cx + s * 0.2, cy + s * 0.15, s * 0.04, 0, Math.PI * 2);
    ctx.fill();
  });

  // JavaScript: "JS" letters
  const javascript = makeCanvasTexture((ctx, s) => {
    common(ctx, s);
    ctx.shadowBlur = 0;
    ctx.fillStyle = stroke;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `900 ${Math.floor(
      s * 0.4
    )}px ui-monospace, SFMono-Regular, Menlo, monospace`;
    ctx.fillText("JS", s / 2, s / 2);
  });

  // TypeScript: "TS" letters
  const typescript = makeCanvasTexture((ctx, s) => {
    common(ctx, s);
    ctx.shadowBlur = 0;
    ctx.fillStyle = stroke;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `900 ${Math.floor(
      s * 0.38
    )}px ui-monospace, SFMono-Regular, Menlo, monospace`;
    ctx.fillText("TS", s / 2, s / 2);
  });

  // Kubernetes: ship wheel
  const kubernetes = makeCanvasTexture((ctx, s) => {
    common(ctx, s);
    ctx.lineWidth = s * 0.05;
    const cx = s / 2;
    const cy = s / 2;
    const r = s * 0.28;
    // Outer circle
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
    // Spokes (8 spokes)
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8;
      const x1 = cx + r * 0.4 * Math.cos(angle);
      const y1 = cy + r * 0.4 * Math.sin(angle);
      const x2 = cx + r * Math.cos(angle);
      const y2 = cy + r * Math.sin(angle);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
    // Center hub
    ctx.beginPath();
    ctx.arc(cx, cy, s * 0.08, 0, Math.PI * 2);
    ctx.fill();
  });

  // AWS: cloud with arrow
  const aws = makeCanvasTexture((ctx, s) => {
    common(ctx, s);
    ctx.lineWidth = s * 0.06;
    // Cloud shape
    const y = s * 0.5;
    ctx.beginPath();
    ctx.moveTo(s * 0.28, y);
    ctx.bezierCurveTo(s * 0.18, y, s * 0.16, s * 0.38, s * 0.28, s * 0.36);
    ctx.bezierCurveTo(s * 0.3, s * 0.24, s * 0.42, s * 0.2, s * 0.5, s * 0.3);
    ctx.bezierCurveTo(
      s * 0.56,
      s * 0.18,
      s * 0.72,
      s * 0.22,
      s * 0.72,
      s * 0.36
    );
    ctx.bezierCurveTo(s * 0.84, s * 0.38, s * 0.84, y, s * 0.72, y);
    ctx.lineTo(s * 0.28, y);
    ctx.stroke();
    // Arrow
    ctx.beginPath();
    ctx.moveTo(s * 0.5, s * 0.44);
    ctx.lineTo(s * 0.58, s * 0.5);
    ctx.lineTo(s * 0.5, s * 0.56);
    ctx.lineTo(s * 0.54, s * 0.5);
    ctx.closePath();
    ctx.fill();
  });

  // Linux: Tux penguin (simplified)
  const linux = makeCanvasTexture((ctx, s) => {
    common(ctx, s);
    ctx.lineWidth = s * 0.05;
    const cx = s / 2;
    // Body (oval)
    ctx.beginPath();
    ctx.ellipse(cx, s * 0.58, s * 0.2, s * 0.24, 0, 0, Math.PI * 2);
    ctx.stroke();
    // Head
    ctx.beginPath();
    ctx.arc(cx, s * 0.32, s * 0.18, 0, Math.PI * 2);
    ctx.stroke();
    // Beak
    ctx.beginPath();
    ctx.moveTo(cx, s * 0.32);
    ctx.lineTo(cx + s * 0.08, s * 0.36);
    ctx.lineTo(cx, s * 0.4);
    ctx.closePath();
    ctx.fill();
    // Feet
    ctx.beginPath();
    ctx.ellipse(cx - s * 0.1, s * 0.78, s * 0.06, s * 0.04, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx + s * 0.1, s * 0.78, s * 0.06, s * 0.04, 0, 0, Math.PI * 2);
    ctx.fill();
  });

  return [
    cpu,
    database,
    terminal,
    cloud,
    network,
    git,
    code,
    braces,
    server,
    lock,
    bug,
    graph,
    api,
    http,
    ai,
    binary,
    shield,
    memory,
    container,
    mobile,
    rest,
    figma,
    react,
    nodejs,
    docker,
    python,
    javascript,
    typescript,
    kubernetes,
    aws,
    linux,
  ].filter(Boolean);
}

function PixelPerfectOrthoCamera() {
  const { camera, size } = useThree();
  useLayoutEffect(() => {
    // Make 1 world unit = 1 pixel.
    camera.left = -size.width / 2;
    camera.right = size.width / 2;
    camera.top = size.height / 2;
    camera.bottom = -size.height / 2;
    camera.near = 0.1;
    camera.far = 2000;
    camera.position.set(0, 0, 200);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera, size.height, size.width]);
  return null;
}

function Particle({ p, onDone }) {
  const meshRef = useRef(null);
  const matRef = useRef(null);

  useFrame((_, delta) => {
    // Integrate in real-time
    p.age += delta * 1000;
    if (p.age >= p.life) {
      onDone(p.id);
      return;
    }

    // Less drag => particles travel farther
    const drag = Math.pow(0.93, delta * 60);
    const gravity = -420; // px/s^2

    p.vel.multiplyScalar(drag);
    p.vel.y += gravity * delta * 0.08; // lighter gravity => longer float

    p.pos.addScaledVector(p.vel, delta);
    p.rot += p.rotVel * delta;

    if (meshRef.current) {
      meshRef.current.position.copy(p.pos);
      meshRef.current.rotation.z = p.rot;
    }
    if (matRef.current) {
      matRef.current.opacity = clamp(1 - p.age / p.life, 0, 1);
    }
  });

  return (
    <Billboard follow>
      <mesh ref={meshRef} position={p.pos} rotation={[0, 0, p.rot]}>
        {/* Render particles as circles so they don't look like square cards */}
        <circleGeometry args={[p.size / 2, 40]} />
        <meshBasicMaterial
          ref={matRef}
          map={p.tex}
          transparent
          alphaTest={0.05}
          premultipliedAlpha
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={1}
        />
      </mesh>
    </Billboard>
  );
}

function Particles({ textures, burstQueueRef }) {
  const [particles, setParticles] = useState([]);

  // Consume queued bursts
  useFrame(() => {
    const now = performance.now();
    const queue = burstQueueRef.current;
    if (!queue.length) return;

    const next = [];
    for (const burst of queue.splice(0, queue.length)) {
      const { x, y, count, ringR } = burst;
      const n = count ?? DEFAULT_PARTICLE_COUNT;
      for (let i = 0; i < n; i++) {
        const angle = (Math.PI * 2 * i) / n + rand(-0.35, 0.35);
        // Higher speed => larger radius / more distance
        const speed = rand(220, 360);
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed - rand(20, 60); // bias upward
        const vz = rand(180, 320); // come forward from behind

        // Start from a ring so particles emerge around the circular photo edge (not on top of it).
        const startR = typeof ringR === "number" && ringR > 0 ? ringR : 0;
        const startX = x + Math.cos(angle) * startR;
        const startY = y + Math.sin(angle) * startR;

        next.push({
          id: `${now}-${i}-${Math.random().toString(16).slice(2)}`,
          life: rand(LIFE_MS_MIN, LIFE_MS_MAX),
          age: 0,
          pos: new THREE.Vector3(startX, startY, -80),
          vel: new THREE.Vector3(vx, vy, vz),
          rot: rand(-Math.PI, Math.PI),
          rotVel: rand(-2.4, 2.4),
          size: rand(26, 40),
          tex: pick(textures),
        });
      }
    }

    setParticles((prev) => prev.concat(next));
  });

  const handleDone = (id) => {
    setParticles((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <>
      {particles.map((p) => (
        <Particle key={p.id} p={p} onDone={handleDone} />
      ))}
    </>
  );
}

export const HeroBurstCanvas = forwardRef(function HeroBurstCanvas(
  { className, particleCount = DEFAULT_PARTICLE_COUNT, color },
  ref
) {
  const textures = useMemo(
    () => createIconTextures(color || undefined),
    [color]
  );
  const burstQueueRef = useRef([]);

  useImperativeHandle(ref, () => ({
    spawnBurst: (x, y, ringR) => {
      burstQueueRef.current.push({ x, y, ringR, count: particleCount });
    },
  }));

  return (
    <div className={className}>
      <Canvas
        orthographic
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
        style={{ width: "100%", height: "100%" }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <PixelPerfectOrthoCamera />
        <Particles textures={textures} burstQueueRef={burstQueueRef} />
      </Canvas>
    </div>
  );
});
