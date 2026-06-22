/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import InteractiveEnvelope from "./components/InteractiveEnvelope";

export default function App() {
  return (
    <main className="w-full min-h-screen bg-transparent flex flex-col justify-between">
      {/* Immersive interactive envelope section */}
      <InteractiveEnvelope />
    </main>
  );
}

