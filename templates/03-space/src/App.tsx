/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import IntroRocket from './components/IntroRocket';
import BabyShowerCard from './components/BabyShowerCard';
import { LullabySynth } from './utils/audioSynth';
import { loadEvento } from './lib/loadEvento';

export default function App() {
  const [showCard, setShowCard] = useState(false);
  const [carriedSynth, setCarriedSynth] = useState<LullabySynth | null>(null);
  const [babyName, setBabyName] = useState<string | undefined>(undefined);

  useEffect(() => {
    loadEvento().then((result) => {
      if (result.details) setBabyName(result.details.babyName);
    });
  }, []);

  const handleIntroComplete = (audioSynthInstance: LullabySynth | null) => {
    setCarriedSynth(audioSynthInstance);
    setShowCard(true);
  };

  return (
    <div className="w-full min-h-screen bg-[#1a0a3a] overflow-x-hidden">
      {!showCard ? (
        <IntroRocket onIntroComplete={handleIntroComplete} babyName={babyName} />
      ) : (
        <BabyShowerCard initialAudioSynth={carriedSynth} />
      )}
    </div>
  );
}

