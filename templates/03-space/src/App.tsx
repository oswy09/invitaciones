/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import IntroRocket from './components/IntroRocket';
import BabyShowerCard from './components/BabyShowerCard';
import { LullabySynth } from './utils/audioSynth';

export default function App() {
  const [showCard, setShowCard] = useState(false);
  const [carriedSynth, setCarriedSynth] = useState<LullabySynth | null>(null);

  const handleIntroComplete = (audioSynthInstance: LullabySynth | null) => {
    setCarriedSynth(audioSynthInstance);
    setShowCard(true);
  };

  return (
    <div className="w-full min-h-screen bg-[#1a0a3a] overflow-x-hidden">
      {!showCard ? (
        <IntroRocket onIntroComplete={handleIntroComplete} />
      ) : (
        <BabyShowerCard initialAudioSynth={carriedSynth} />
      )}
    </div>
  );
}

