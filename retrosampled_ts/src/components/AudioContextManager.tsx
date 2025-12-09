import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  PropsWithChildren,
  useCallback,
} from "react";
import WaveSurfer from "wavesurfer.js";

interface PlayerState {
  currentId: string | null;
  isPlaying: boolean;
  progress: number;
}

interface Sample {
  id: string | number;
  authorId: string | number;
  author?: string;
  title: string;
  tags: string[];
  audioUrl: string;
  time: string;
  key: string;
  bpm: string | number;
  type?: string;
  price: string | number;
}

interface AudioContextManager {
  state: PlayerState;
  currentSample: Sample | null;

  play: (sample: Sample, options?: any) => void;
  togglePlay: () => void;
  seekTo: (progress: number) => void;

  // можно расширять внутренними методами
}

const AudioPlayerContext = createContext<AudioContextManager | null>(null);

export const useAudioManager = () => {
  const ctx = useContext(AudioPlayerContext);
  if (!ctx) {
    throw new Error("useAudioManager must be used inside AudioPlayerProvider");
  }
  return ctx;
};

export const AudioPlayerProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const waveRef = useRef<WaveSurfer | null>(null);
  const [currentSample, setCurrentSample] = useState<Sample | null>(null);

  const [state, setState] = useState<PlayerState>({
    currentId: null,
    isPlaying: false,
    progress: 0,
  });

  /**
   * Создаём WaveSurfer при монтировании провайдера
   */
  useEffect(() => {
    const ws = WaveSurfer.create({
      container: document.createElement("div"), // скрытый контейнер
      waveColor: "#999",
      progressColor: "#fff",
      height: 0,
      responsive: false,
    });

    waveRef.current = ws;

    return () => {
      ws.destroy();
    };
  }, []);

  /**
   * Подписки на события WaveSurfer
   */
  useEffect(() => {
    const ws = waveRef.current;
    if (!ws) return;

    const handleProgress = () => {
      const duration = ws.getDuration() || 1;
      const current = ws.getCurrentTime();
      setState(prev => ({ ...prev, progress: current / duration }));
    };

    const handleFinish = () => {
      setState(prev => ({ ...prev, isPlaying: false, progress: 0 }));
    };

    ws.on("audioprocess", handleProgress);
    ws.on("seek", handleProgress);
    ws.on("finish", handleFinish);

    return () => {
      ws.un("audioprocess", handleProgress);
      ws.un("seek", handleProgress);
      ws.un("finish", handleFinish);
    };
  }, [state.currentId]);

  /**
   * PLAY (выбрать новый семпл + запустить)
   */
  const play = useCallback(
    async (sample: Sample, options?: any) => {
      const ws = waveRef.current;
      if (!ws) return;

      const isSame = sample.id === state.currentId;

      if (!isSame) {
        // Загружаем новый трек
        setCurrentSample(sample);
        setState(prev => ({
          ...prev,
          currentId: sample.id.toString(),
          progress: 0,
        }));

        ws.load(sample.audioUrl);
      }

      // Ждём загрузки
      ws.once("ready", () => {
        ws.play();
        setState(prev => ({ ...prev, isPlaying: true }));
      });
    },
    [state.currentId]
  );

  /**
   * TOGGLE PLAY / PAUSE
   */
  const togglePlay = useCallback(() => {
    const ws = waveRef.current;
    if (!ws || !state.currentId) return;

    if (state.isPlaying) {
      ws.pause();
      setState(prev => ({ ...prev, isPlaying: false }));
    } else {
      ws.play();
      setState(prev => ({ ...prev, isPlaying: true }));
    }
  }, [state.currentId, state.isPlaying]);

  /**
   * SEEK
   */
  const seekTo = useCallback((progress: number) => {
    const ws = waveRef.current;
    if (!ws) return;
    ws.seekTo(progress);
  }, []);

  /**
   * Значение провайдера
   */
  const value = useMemo<AudioContextManager>(
    () => ({
      state,
      currentSample,
      play,
      togglePlay,
      seekTo,
    }),
    [state, currentSample, play, togglePlay, seekTo]
  );

  return (
    <AudioPlayerContext.Provider value={value}>
      {children}
    </AudioPlayerContext.Provider>
  );
};
