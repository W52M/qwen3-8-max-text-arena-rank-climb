import React from 'react';
import {Composition} from 'remotion';
import {TextArenaRankClimb} from './TextArenaRankClimb';

export const Root: React.FC = () => (
  <Composition
    id="TextArenaRankClimb"
    component={TextArenaRankClimb}
    durationInFrames={240}
    fps={30}
    width={1080}
    height={1920}
  />
);

