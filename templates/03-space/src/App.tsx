/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import IntroRocket from './components/IntroRocket';
import BabyShowerCard from './components/BabyShowerCard';
import { LullabySynth } from './utils/audioSynth';
import { loadEvento } from './lib/loadEvento';
import { usePreviewBridge } from './hooks/usePreviewBridge';
import { InvitationData, InvitationDetails, fromInvitationData } from './types';

export default function App() {
  const [showCard, setShowCard] = useState(false);
  const [carriedSynth, setCarriedSynth] = useState<LullabySynth | null>(null);
  const [babyName, setBabyName] = useState<string | undefined>(undefined);
  const [extra, setExtra] = useState<Record<string, any> | undefined>(undefined);
  const [previewDetails, setPreviewDetails] = useState<InvitationDetails | null>(null);
  const [previewPagado, setPreviewPagado] = useState(false);

  const handlePreviewUpdate = useCallback((data: InvitationData, pagado: boolean) => {
    const details = fromInvitationData(data);
    setPreviewDetails(details);
    setPreviewPagado(pagado);
    setBabyName(details.babyName);
  }, []);

  const isPreview = usePreviewBridge<InvitationData>(handlePreviewUpdate);

  useEffect(() => {
    if (isPreview) return; // en preview, los datos llegan por postMessage, no por Supabase
    loadEvento().then((result) => {
      if (result.details) {
        setBabyName(result.details.babyName);
        setExtra(result.details.extra);
      }
    });
  }, [isPreview]);

  const handleIntroComplete = (audioSynthInstance: LullabySynth | null) => {
    setCarriedSynth(audioSynthInstance);
    setShowCard(true);
  };

  const currentExtra = isPreview ? previewDetails?.extra : extra;

  return (
    <div className="w-full min-h-screen bg-[#1a0a3a] overflow-x-hidden">
      {!showCard ? (
        <IntroRocket onIntroComplete={handleIntroComplete} babyName={babyName} extra={currentExtra} />
      ) : (
        <BabyShowerCard
          initialAudioSynth={carriedSynth}
          previewDetails={previewDetails}
          previewPagado={isPreview ? previewPagado : undefined}
        />
      )}
    </div>
  );
}
