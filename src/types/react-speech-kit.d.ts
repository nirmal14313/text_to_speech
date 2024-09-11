declare module 'react-speech-kit' {
    import { ReactNode } from 'react';
  
    export interface SpeechRecognitionOptions {
      onResult: (result: string) => void;
      onEnd?: () => void;
      lang?: string;
      interimResults?: boolean;
      continuous?: boolean;
      onError?: (error: any) => void;
    }
  
    export function useSpeechRecognition(
      options: SpeechRecognitionOptions
    ): {
      listen: () => void;
      listening: boolean;
      stop: () => void;
      supported: boolean;
    };
  
    export interface SpeechSynthesisOptions {
      text: string;
      voice?: SpeechSynthesisVoice;
      rate?: number;
      pitch?: number;
      volume?: number;
      onEnd?: () => void;
    }
  
    export function useSpeechSynthesis(): {
      speak: (options: SpeechSynthesisOptions) => void;
      speaking: boolean;
      cancel: () => void;
      supported: boolean;
      voices: SpeechSynthesisVoice[];
    };
  
    export interface SpeechSynthesisVoice {
      name: string;
      lang: string;
    }
  
    export interface SpeechSynthesisProps {
      children?: ReactNode;
      text: string;
      voice?: SpeechSynthesisVoice;
      rate?: number;
      pitch?: number;
      volume?: number;
      onEnd?: () => void;
    }
  
    export function SpeechSynthesis(props: SpeechSynthesisProps): JSX.Element;
  }
  