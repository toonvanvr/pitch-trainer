import { PitchDetection, pitchDetection as ml5PitchDetection } from 'ml5'

/** This is the only model supported by ml5 */
const crepeModelUrl =
  'https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe'

/** Create an ML5.js PitchDetection instance */
export async function initPitchDetection(): Promise<PitchDetection> {
  const mediaStream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false,
  })
  const audioContext = new AudioContext()

  const pitchDetection = ml5PitchDetection(
    crepeModelUrl,
    audioContext,
    mediaStream,
  )
  await pitchDetection.ready

  return pitchDetection
}
