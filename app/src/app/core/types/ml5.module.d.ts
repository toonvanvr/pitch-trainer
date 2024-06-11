declare module 'ml5' {
  export class PitchDetection {
    model: string
    audioContext: AudioContext
    stream: MediaStream
    frequency: null | number
    ready: Promise<PitchDetection | T>

    static resample(audioBuffer: unknown, onComplete: unknown): void

    constructor(
      model: string,
      audioContext: AudioContext,
      stream: MediaStream,
      callback?: (error: unknown, pitchDetection: PitchDetection) => any,
    )

    async loadModel(model: string): Promise<PitchDetection>
    async processStream(): Promise<void>
    async processMicrophoneBuffer(event: unknown)
    async getPitch(
      callback?: (error: unknown | undefined, frequency?: number) => any,
    ): Promise<number>
  }

  export function pitchDetection(
    model: string = './',
    audioContext: AudioContext,
    stream: MediaStream,
    callback?: (
      error: unknown | undefined,
      pitchDetection?: PitchDetection,
    ) => void,
  ): PitchDetection
}
