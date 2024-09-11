
// Unit tests for: NewSpeech


import { useSpeechRecognition, useSpeechSynthesis } from 'react-speech-kit';

import { NewSpeech } from '../NewSpeech';


// Mock the react-speech-kit hooks
jest.mock("react-speech-kit", () => ({
  useSpeechRecognition: jest.fn(),
  useSpeechSynthesis: jest.fn(),
}));

describe('NewSpeech() NewSpeech method', () => {
  let mockListen, mockStop, mockSpeak, mockVoices;

  beforeEach(() => {
    mockListen = jest.fn();
    mockStop = jest.fn();
    mockSpeak = jest.fn();
    mockVoices = [{ name: 'Voice 1' }, { name: 'Voice 2' }, { name: 'Voice 3' }];

    useSpeechRecognition.mockReturnValue({
      listen: mockListen,
      stop: mockStop,
      listening: false,
    });

    useSpeechSynthesis.mockReturnValue({
      speak: mockSpeak,
      voices: mockVoices,
    });
  });

  // Happy Path Tests
  describe('Happy Path', () => {
    it('should render the component with initial state', () => {
      render(<NewSpeech />);
      expect(screen.getByPlaceholderText('Speech recognition text')).toBeInTheDocument();
      expect(screen.getByText('Start')).toBeInTheDocument();
      expect(screen.getByText('Stop')).toBeInTheDocument();
      expect(screen.getByText('Reset')).toBeInTheDocument();
      expect(screen.getByText('Not listening')).toBeInTheDocument();
    });

    it('should start listening when the Start button is clicked', () => {
      render(<NewSpeech />);
      fireEvent.click(screen.getByText('Start'));
      expect(mockListen).toHaveBeenCalled();
    });

    it('should stop listening when the Stop button is clicked', () => {
      render(<NewSpeech />);
      fireEvent.click(screen.getByText('Stop'));
      expect(mockStop).toHaveBeenCalled();
    });

    it('should reset the text area when the Reset button is clicked', () => {
      render(<NewSpeech />);
      const textArea = screen.getByPlaceholderText('Speech recognition text');
      fireEvent.change(textArea, { target: { value: 'Some text' } });
      fireEvent.click(screen.getByText('Reset'));
      expect(textArea.value).toBe('');
    });

    it('should speak the text when the Speak button is clicked', () => {
      render(<NewSpeech />);
      fireEvent.click(screen.getByText('Speak'));
      expect(mockSpeak).toHaveBeenCalled();
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should handle no voices available gracefully', () => {
      useSpeechSynthesis.mockReturnValue({
        speak: mockSpeak,
        voices: [],
      });
      render(<NewSpeech />);
      fireEvent.click(screen.getByText('Speak'));
      expect(mockSpeak).not.toHaveBeenCalled();
    });

    it('should handle interim results correctly', () => {
      const mockOnResult = jest.fn();
      useSpeechRecognition.mockReturnValue({
        listen: mockListen,
        stop: mockStop,
        listening: true,
        onResult: mockOnResult,
      });

      render(<NewSpeech />);
      fireEvent.click(screen.getByText('Start'));
      expect(mockListen).toHaveBeenCalled();
      // Simulate interim result
      mockOnResult('Interim result');
      expect(screen.getByPlaceholderText('Speech recognition text').value).toBe('Interim result');
    });
  });
});

// End of unit tests for: NewSpeech
