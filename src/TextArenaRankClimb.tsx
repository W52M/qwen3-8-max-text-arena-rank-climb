import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const clamp = {
  extrapolateLeft: 'clamp' as const,
  extrapolateRight: 'clamp' as const,
};

const BOARD_W = 1500;
const BOARD_H = 1620;
const ROW_H = 98;
const FIRST_ROW_Y = 510;

const models = [
  {rank: 1, lab: 'Anthropic', model: 'claude-fable-5', score: 1509, error: 6, modelRank: 1, spread: '1 ↔ 4', logo: 'AI', color: '#111111'},
  {rank: 2, lab: 'Meta', model: 'muse-spark-1.1', score: 1490, error: 6, modelRank: 9, spread: '4 ↔ 18', logo: '∞', color: '#1677ff'},
  {rank: 3, lab: 'Google', model: 'gemini-3-pro', score: 1486, error: 4, modelRank: 11, spread: '5 ↔ 19', logo: 'G', color: '#2b78e4'},
  {rank: 4, lab: 'Moonshot', model: 'kimi-k3-max', score: 1485, error: 10, modelRank: 13, spread: '4 ↔ 31', logo: 'K', color: '#111111'},
  {rank: 5, lab: 'OpenAI', model: 'gpt-5.6-sol-xhigh', score: 1483, error: 6, modelRank: 15, spread: '5 ↔ 29', logo: '◎', color: '#111111'},
  {rank: 6, lab: 'SpaceXAI', model: 'grok-4.20-beta1', score: 1474, error: 5, modelRank: 25, spread: '13 ↔ 40', logo: '⌁', color: '#111111'},
  {rank: 7, lab: 'Z.ai', model: 'glm-5.2-max', score: 1469, error: 5, modelRank: 33, spread: '18 ↔ 47', logo: 'Z', color: '#151515'},
  {rank: 8, lab: 'Baidu', model: 'ernie-5.1', score: 1468, error: 5, modelRank: 38, spread: '19 ↔ 48', logo: '◇', color: '#1685f8'},
  {rank: 9, lab: 'Xiaomi', model: 'mimo-v2.5-pro', score: 1466, error: 4, modelRank: 40, spread: '21 ↔ 51', logo: 'mi', color: '#222222'},
  {rank: 10, lab: 'DeepSeek', model: 'deepseek-v4-pro', score: 1458, error: 4, modelRank: 49, spread: '39 ↔ 60', logo: '◒', color: '#4169ff'},
];

const ease = (frame: number, from: number, to: number) =>
  interpolate(frame, [from, to], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });

const LabLogo: React.FC<{text: string; color: string; active?: boolean}> = ({text, color, active}) => (
  <div
    style={{
      width: 34,
      height: 34,
      display: 'grid',
      placeItems: 'center',
      color: active ? '#0b55ff' : color,
      fontFamily: 'Arial, Helvetica, sans-serif',
      fontSize: text.length > 1 ? 13 : 22,
      fontWeight: 900,
      letterSpacing: -1,
      flex: '0 0 auto',
    }}
  >
    {text}
  </div>
);

const TableRow: React.FC<{
  rank: number;
  lab: string;
  model: string;
  score: number;
  error: number;
  modelRank: number;
  spread: string;
  logo: string;
  color: string;
  y: number;
  opacity: number;
  blur: number;
  active?: boolean;
  z?: number;
  impact?: number;
  barProgress?: number;
}> = ({rank, lab, model, score, error, modelRank, spread, logo, color, y, opacity, blur, active = false, z = 0, impact = 0, barProgress = 1}) => {
  const raised = active ? 48 * (1 - impact) : 0;
  return (
    <div
      style={{
        position: 'absolute',
        left: 46,
        top: y,
        width: 1408,
        height: ROW_H,
        display: 'grid',
        gridTemplateColumns: '210px 520px 290px 190px 198px',
        alignItems: 'center',
        boxSizing: 'border-box',
        background: active
          ? 'linear-gradient(90deg, rgba(243,255,247,.99), rgba(250,255,251,.99))'
          : '#fffefd',
        borderTop: '1px solid #e8e6e2',
        borderBottom: '1px solid #e8e6e2',
        borderLeft: active ? '2px solid #35b566' : '1px solid #ece9e5',
        borderRight: active ? '2px solid #35b566' : '1px solid #ece9e5',
        borderRadius: active ? 12 : 0,
        boxShadow: active
          ? `0 ${18 + raised / 3}px 36px rgba(34,78,48,.24), 0 0 ${32 + impact * 42}px rgba(56,193,104,.28)`
          : '0 2px 4px rgba(43,38,31,.025)',
        color: '#3e3b38',
        fontFamily: 'Arial, Helvetica, sans-serif',
        transform: `translate3d(0,0,${z + raised}px) rotateX(${active ? -1.4 * (1 - impact) : 0}deg)`,
        transformStyle: 'preserve-3d',
        opacity,
        filter: `blur(${blur}px)`,
        overflow: 'hidden',
      }}
    >
      {active && (
        <div
          style={{
            position: 'absolute',
            left: 740,
            top: 68,
            width: 250 * barProgress,
            height: 7,
            borderRadius: 99,
            background: 'linear-gradient(90deg, #25c864, #87e99f)',
            boxShadow: '0 0 14px rgba(44,194,94,.38)',
          }}
        />
      )}
      <div style={{height: '100%', display: 'grid', placeItems: 'center', borderRight: '1px solid #ece9e5', fontSize: 25, fontWeight: 700}}>
        {rank}
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: 14, paddingLeft: 26}}>
        <LabLogo text={logo} color={color} active={active} />
        <div>
          <div style={{fontFamily: 'Menlo, Consolas, monospace', fontSize: active ? 25 : 23, letterSpacing: 0.2, color: '#2f2d2a'}}>{lab}</div>
          <div style={{fontSize: 18, marginTop: 6, color: '#5e5a55'}}>{model}</div>
        </div>
      </div>
      <div style={{fontSize: active ? 25 : 23, position: 'relative'}}>
        <span style={{fontWeight: active ? 700 : 500}}>{score}</span>
        <span style={{fontSize: 17, color: '#77716a', marginLeft: 12}}>±{error}</span>
        {active && <span style={{fontSize: 15, marginLeft: 10, color: '#69645e'}}>ⓘ</span>}
      </div>
      <div style={{textAlign: 'center', fontSize: 23, fontWeight: 500}}>{modelRank}</div>
      <div style={{textAlign: 'center', fontSize: 21, color: '#58534d'}}>{spread}</div>
    </div>
  );
};

const HeaderCell: React.FC<{children: React.ReactNode; align?: 'left' | 'center'}> = ({children, align = 'left'}) => (
  <div style={{fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 20, fontWeight: 700, color: '#47433f', textAlign: align}}>
    {children}
  </div>
);

export const TextArenaRankClimb: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();

  const entrance = spring({frame, fps, durationInFrames: 40, config: {damping: 15, stiffness: 155, mass: 0.75}});
  const climb = ease(frame, 38, 158);
  const impact = spring({frame: frame - 158, fps, durationInFrames: 28, config: {damping: 8, stiffness: 245, mass: 0.62}});
  const reveal = ease(frame, 178, 230);
  const rankFloat = interpolate(climb, [0, 1], [11, 2]);
  const aliY = interpolate(entrance, [0, 1], [FIRST_ROW_Y + 13 * ROW_H, FIRST_ROW_Y + 10 * ROW_H]) - climb * 9 * ROW_H;

  const cameraScale = interpolate(
    frame,
    [0, 28, 42, 158, 176, 230],
    [1.72, 1.58, 1.46, 1.4, 1.28, 0.76],
    {...clamp, easing: Easing.bezier(0.22, 1, 0.36, 1)},
  );
  const boardTop = 150;
  const trackY = height * 0.52 - (boardTop + BOARD_H / 2 + cameraScale * (aliY - BOARD_H / 2));
  const cameraY = interpolate(reveal, [0, 1], [trackY, -120]);
  const cameraX = interpolate(frame, [0, 42, 158, 230], [360, 300, 190, 0], clamp);
  const rotateX = interpolate(frame, [0, 42, 158, 230], [57, 39, 24, 1.2], clamp);
  const rotateY = interpolate(frame, [0, 42, 158, 230], [-20, -13, -6, 0], clamp);
  const rotateZ = interpolate(frame, [0, 42, 158, 230], [-5.6, -3.2, -1.3, 0], clamp);
  const impactPulse = interpolate(frame, [156, 163, 170, 181], [0, 1, 0.24, 0], clamp);
  const shakeX = Math.sin(frame * 2.9) * impactPulse * 17;
  const shakeY = Math.sin(frame * 3.7 + 0.6) * impactPulse * 10;
  const motionBlur = interpolate(frame, [0, 5, 18, 34, 153, 162, 171], [17, 12, 1.5, 0, 0, 5.5, 0], clamp);
  const aliRank = Math.max(2, Math.ceil(rankFloat));
  const pageReveal = interpolate(frame, [184, 225], [0.12, 1], clamp);

  return (
    <AbsoluteFill style={{background: '#e9e7e2', overflow: 'hidden', color: '#34312e'}}>
      <div
        style={{
          position: 'absolute',
          inset: -80,
          background: 'radial-gradient(circle at 50% 46%, #fffefa 0%, #ece9e3 66%, #d9d5ce 100%)',
        }}
      />
      <div style={{position: 'absolute', inset: 0, perspective: 1800, perspectiveOrigin: '50% 48%', filter: `blur(${motionBlur}px)`, transform: `translate3d(${shakeX}px,${shakeY}px,0)`}}>
        <div
          style={{
            position: 'absolute',
            left: (width - BOARD_W) / 2,
            top: boardTop,
            width: BOARD_W,
            height: BOARD_H,
            transformOrigin: '50% 50%',
            transformStyle: 'preserve-3d',
            transform: `translate3d(${cameraX}px,${cameraY}px,0) scale(${cameraScale}) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`,
          }}
        >
          <div style={{position: 'absolute', inset: 0, background: '#fffefd', border: '1px solid #e8e5df', boxShadow: '0 54px 100px rgba(54,47,38,.24)', transform: 'translateZ(-20px)'}} />

          <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 72, borderBottom: '1px solid #e8e5df', display: 'flex', alignItems: 'center', padding: '0 40px', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 18, color: '#3d3935', opacity: pageReveal}}>
            <div style={{fontSize: 26, marginRight: 15}}>⌘</div><div style={{marginRight: 320}}>Overview</div>
            <div style={{marginRight: 52}}>Agent</div><div style={{padding: '15px 28px', background: '#efebe5', borderRadius: 10, marginRight: 34}}>Chat⌄</div>
            <div style={{marginRight: 48}}>Code⌄</div><div style={{marginRight: 48}}>Image⌄</div><div>Video⌄</div>
            <div style={{marginLeft: 'auto', background: '#22211f', color: 'white', padding: '15px 22px', borderRadius: 7}}>Start Voting</div>
          </div>

          <div style={{position: 'absolute', left: 46, right: 46, top: 110, height: 212, opacity: pageReveal}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
              <div style={{fontFamily: 'Georgia, serif', fontSize: 36, color: '#2d2925'}}>Text Arena</div>
              <div style={{background: '#efebe5', borderRadius: 9, padding: '10px 20px', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 18}}>🏆 Overall</div>
            </div>
            <div style={{fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 18, color: '#514c47', marginTop: 15}}>
              View overall rankings across various AI models in text-to-text tasks across math, coding, creative writing, and other open-ended domains.
            </div>
            <div style={{fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, color: '#6d6761', marginTop: 23, wordSpacing: 6}}>
              ◴ Aug 1, 2026　 ☑ 7,571,037 votes　 ♙ 27 labs　ϟ 1 AutoEval
            </div>
          </div>

          <div style={{position: 'absolute', left: 46, right: 46, top: 315, height: 72, borderTop: '1px solid #e8e5df', display: 'flex', alignItems: 'center', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 17, opacity: pageReveal}}>
            <span style={{fontSize: 23, margin: '0 15px'}}>⌘</span> Show Filters
            <div style={{marginLeft: 'auto', display: 'flex', gap: 18, alignItems: 'center'}}>
              <span>Models</span><span style={{background: '#efebe5', padding: '10px 20px', borderRadius: 9}}>Labs</span><span>│　⌕　▥</span>
            </div>
          </div>

          <div style={{position: 'absolute', left: 46, top: 387, width: 1408, height: 86, display: 'grid', gridTemplateColumns: '210px 520px 290px 190px 198px', alignItems: 'center', padding: '0 0', border: '1px solid #e8e5df', borderRadius: '12px 12px 0 0', boxSizing: 'border-box', background: '#fffefd'}}>
            <div style={{height: '100%', display: 'grid', placeItems: 'center', borderRight: '1px solid #e8e5df'}}><HeaderCell>Lab Rank　↕</HeaderCell></div>
            <div style={{paddingLeft: 32}}><HeaderCell>Lab　↕</HeaderCell></div>
            <HeaderCell>Model Score　ⓘ ↓</HeaderCell>
            <HeaderCell align="center">Model Rank　↕</HeaderCell>
            <HeaderCell align="center">Rank Spread　ⓘ</HeaderCell>
          </div>

          {models.map((model) => {
            const passAt = model.rank === 1 ? 999 : 38 + ((11 - model.rank) / 9) * 120;
            const displacementProgress = ease(frame, passAt - 7, passAt + 8);
            const y = FIRST_ROW_Y + (model.rank - 1) * ROW_H + displacementProgress * ROW_H;
            const distance = Math.abs(y - aliY);
            const blur = (1 - reveal) * Math.max(0, Math.min(4.2, (distance - 90) / 165));
            return (
              <TableRow
                key={model.lab}
                {...model}
                rank={model.rank + (displacementProgress > 0.5 ? 1 : 0)}
                y={y}
                opacity={interpolate(distance, [80, 440, 850], [0.92, 0.54, 0.18], clamp) * (1 - reveal) + reveal}
                blur={blur}
              />
            );
          })}

          {frame < 36 && [1, 2].map((trail) => (
            <div key={trail} style={{position: 'absolute', left: 46, top: aliY + trail * 76, width: 1408, height: ROW_H, border: '2px solid rgba(47,177,96,.23)', borderRadius: 12, background: 'rgba(81,221,128,.08)', opacity: (1 - entrance) * (0.4 / trail), filter: `blur(${3 + trail * 3}px)`, transform: `translateZ(${54 + trail * 8}px)`}} />
          ))}

          <TableRow
            rank={aliRank}
            lab="Alibaba"
            model="qwen3.8-max"
            score={1496}
            error={10}
            modelRank={5}
            spread="1 ↔ 17"
            logo="✣"
            color="#0b55ff"
            y={aliY}
            opacity={interpolate(frame, [0, 4], [0, 1], clamp)}
            blur={0}
            active
            z={interpolate(impact, [0, 1], [74, 0])}
            impact={impact}
            barProgress={interpolate(frame, [25, 158], [0.05, 1], clamp)}
          />

          <div style={{position: 'absolute', left: 56, top: FIRST_ROW_Y + ROW_H - 8, width: 1388, height: ROW_H + 16, border: '3px solid rgba(45,181,96,.72)', borderRadius: 16, opacity: impactPulse * 0.82, boxShadow: '0 0 54px rgba(46,186,97,.42)', transform: `translateZ(${14 * (1 - impact)}px) scale(${1 + impactPulse * 0.035})`}} />
        </div>
      </div>

      <div style={{position: 'absolute', inset: 0, pointerEvents: 'none', background: `radial-gradient(circle at 50% 48%, transparent 30%, rgba(67,58,48,${interpolate(reveal, [0, 1], [0.48, 0.12])}) 100%)`, mixBlendMode: 'multiply'}} />
      <div style={{position: 'absolute', inset: 0, opacity: impactPulse * 0.3, background: 'radial-gradient(circle at 52% 29%, rgba(76,230,128,.7), transparent 28%)', mixBlendMode: 'screen'}} />
    </AbsoluteFill>
  );
};
