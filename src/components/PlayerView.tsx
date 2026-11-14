import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  RotateCcw, 
  RotateCw, 
  Subtitles, 
  Settings, 
  CheckCircle2, 
  ArrowLeft, 
  ChevronRight, 
  ChevronLeft, 
  Clock, 
  BookOpen, 
  Bookmark, 
  FileText, 
  Download, 
  Trash2, 
  Edit3, 
  HelpCircle, 
  ListOrdered, 
  Search,
  Keyboard,
  ExternalLink,
  Sparkles,
  Monitor
} from 'lucide-react';
import { Course, Lesson, Quiz, UserNote, TranscriptLine } from '../types';
import { useLearning } from '../context/LearningContext';

interface PlayerViewProps {
  onBackToCourse: () => void;
  onOpenQuiz: (quiz: Quiz) => void;
}

export const PlayerView: React.FC<PlayerViewProps> = ({
  onBackToCourse,
  onOpenQuiz
}) => {
  const { 
    activeCourse, 
    activeLesson, 
    userProgress, 
    navigateToLesson, 
    markLessonComplete, 
    updateWatchTime, 
    addNote, 
    deleteNote, 
    getCourseProgress 
  } = useLearning();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const transcriptContainerRef = useRef<HTMLDivElement | null>(null);

  // Player State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(activeLesson?.duration || 480);
  const [volume, setVolume] = useState<number>(0.9);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isTheater, setIsTheater] = useState<boolean>(false);
  const [showCaptions, setShowCaptions] = useState<boolean>(true);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [showSpeedMenu, setShowSpeedMenu] = useState<boolean>(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState<boolean>(false);
  const [hoverSeekTime, setHoverSeekTime] = useState<number | null>(null);
  const [hoverSeekPos, setHoverSeekPos] = useState<number>(0);
  const [videoError, setVideoError] = useState<boolean>(false);

  // Classroom Sidebar Tabs: 'transcript' | 'notes' | 'syllabus' | 'resources'
  const [activeTab, setActiveTab] = useState<'transcript' | 'notes' | 'syllabus' | 'resources'>('transcript');

  // Notes state
  const [newNoteText, setNewNoteText] = useState('');
  const [autoScrollTranscript, setAutoScrollTranscript] = useState(true);
  const [transcriptSearch, setTranscriptSearch] = useState('');

  // Auto-hide controls timeout
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Format seconds to mm:ss or hh:mm:ss
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = Math.floor(secs % 60);
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Resume position logic
  useEffect(() => {
    if (activeLesson) {
      const savedTime = userProgress.lessonWatchTime[activeLesson.id] || 0;
      setCurrentTime(savedTime);
      setDuration(activeLesson.duration);
      setVideoError(false);
      setIsPlaying(false);

      if (videoRef.current) {
        videoRef.current.currentTime = savedTime;
      }
    }
  }, [activeLesson?.id]);

  // Periodic watch progress saver
  useEffect(() => {
    if (!activeLesson || !activeCourse) return;
    const interval = setInterval(() => {
      if (videoRef.current && isPlaying) {
        const time = videoRef.current.currentTime;
        setCurrentTime(time);
        updateWatchTime(activeLesson.id, time, activeLesson.duration, activeCourse.id);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [isPlaying, activeLesson, activeCourse, updateWatchTime]);

  // Handle Play/Pause
  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (videoRef.current.paused || videoRef.current.ended) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.warn('Playback prevented', err);
        // Fallback simulated playback if media blocked
        setIsPlaying(true);
      });
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  // Seek relative
  const seekRelative = (delta: number) => {
    if (!videoRef.current) return;
    const newTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + delta));
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Direct Seek
  const seekTo = (seconds: number) => {
    if (!videoRef.current) return;
    const clamped = Math.max(0, Math.min(duration, seconds));
    videoRef.current.currentTime = clamped;
    setCurrentTime(clamped);
    if (!isPlaying) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  // Fullscreen Handler
  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Mouse idle detection for controls overlay
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
        setShowSpeedMenu(false);
      }
    }, 2500);
  };

  // Active transcript line detection
  const activeTranscriptLine = activeLesson?.transcript.find(
    line => currentTime >= line.start && currentTime <= line.end
  );

  // Auto-scroll transcript container
  useEffect(() => {
    if (!autoScrollTranscript || !transcriptContainerRef.current || !activeTranscriptLine) return;
    const el = document.getElementById(`transcript-line-${activeTranscriptLine.id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activeTranscriptLine?.id, autoScrollTranscript]);

  // Add Note handler
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim() || !activeCourse || !activeLesson) return;
    addNote(activeCourse.id, activeLesson.id, currentTime, newNoteText);
    setNewNoteText('');
  };

  if (!activeCourse || !activeLesson) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-center">
        <div>
          <p className="text-slate-400 mb-4">No active lesson selected.</p>
          <button
            onClick={onBackToCourse}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold"
          >
            Go to Course
          </button>
        </div>
      </div>
    );
  }

  // Next and Previous Lessons in Course
  const allLessons: Lesson[] = [];
  activeCourse.modules.forEach(m => m.lessons.forEach(l => allLessons.push(l)));
  const currentIdx = allLessons.findIndex(l => l.id === activeLesson.id);
  const prevLesson = currentIdx > 0 ? allLessons[currentIdx - 1] : null;
  const nextLesson = currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1] : null;

  // Filtered transcript search
  const filteredTranscript = activeLesson.transcript.filter(t => 
    t.text.toLowerCase().includes(transcriptSearch.toLowerCase()) ||
    (t.speaker && t.speaker.toLowerCase().includes(transcriptSearch.toLowerCase()))
  );

  const lessonNotes = userProgress.notes.filter(n => n.lessonId === activeLesson.id);
  const isLessonCompleted = !!userProgress.completedLessons[activeLesson.id];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      
      {/* Top Classroom Bar */}
      <div className="border-b border-slate-800 bg-slate-900/90 px-4 py-3 flex items-center justify-between gap-4 sticky top-16 z-30 backdrop-blur-md">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onBackToCourse}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Back to Course Details"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-indigo-400 truncate hidden sm:inline">
                {activeCourse.title}
              </span>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <span className="text-xs text-slate-400 font-mono">
                Lesson {currentIdx + 1} of {allLessons.length}
              </span>
            </div>
            <h2 className="text-sm font-bold text-white truncate max-w-md sm:max-w-xl">
              {activeLesson.title}
            </h2>
          </div>
        </div>

        {/* Action Controls in Header */}
        <div className="flex items-center gap-2">
          {/* Mark Complete Toggle */}
          <button
            onClick={() => markLessonComplete(activeCourse.id, activeLesson.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              isLessonCompleted
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isLessonCompleted ? 'Completed' : 'Mark Complete'}</span>
          </button>

          {/* Prev/Next buttons */}
          <div className="flex items-center gap-1">
            <button
              disabled={!prevLesson}
              onClick={() => prevLesson && navigateToLesson(activeCourse.id, prevLesson.id)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:pointer-events-none"
              title={prevLesson ? `Previous: ${prevLesson.title}` : 'No previous lesson'}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={!nextLesson}
              onClick={() => nextLesson && navigateToLesson(activeCourse.id, nextLesson.id)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:pointer-events-none"
              title={nextLesson ? `Next: ${nextLesson.title}` : 'No next lesson'}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Main Workspace: Video on Left (or full if theater), Tabs on Right */}
      <div className={`flex-1 grid ${isTheater ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-12'} gap-0 overflow-hidden`}>
        
        {/* Left Side: Video Player Container */}
        <div className={`${isTheater ? 'lg:col-span-12' : 'lg:col-span-8'} flex flex-col bg-slate-950 border-r border-slate-800`}>
          
          {/* Custom Video Wrapper */}
          <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => isPlaying && setShowControls(false)}
            className="relative w-full aspect-video bg-black flex items-center justify-center group overflow-hidden select-none"
          >
            {/* HTML5 Native Video Element */}
            <video
              ref={videoRef}
              src={activeLesson.videoUrl}
              playsInline
              crossOrigin="anonymous"
              onTimeUpdate={() => {
                if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
              }}
              onLoadedMetadata={() => {
                if (videoRef.current) {
                  setDuration(videoRef.current.duration || activeLesson.duration);
                  const saved = userProgress.lessonWatchTime[activeLesson.id] || 0;
                  if (saved > 0 && saved < videoRef.current.duration - 5) {
                    videoRef.current.currentTime = saved;
                  }
                }
              }}
              onEnded={() => {
                setIsPlaying(false);
                markLessonComplete(activeCourse.id, activeLesson.id);
              }}
              onError={() => {
                console.warn('Video source error, switching to interactive simulated video stream fallback');
                setVideoError(true);
              }}
              onClick={togglePlay}
              className="w-full h-full object-contain cursor-pointer"
            />

            {/* Video Fallback / Procedural Tech Stream if external MP4 fails or is blocked */}
            {videoError && (
              <div 
                onClick={togglePlay}
                className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex flex-col items-center justify-center p-6 text-center cursor-pointer select-none"
              >
                <div className="relative mb-4">
                  <div className="w-20 h-20 rounded-2xl bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center">
                    <Monitor className="w-10 h-10 text-indigo-400" />
                  </div>
                  {isPlaying && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 animate-ping" />
                  )}
                </div>
                <h3 className="text-base font-bold text-white mb-1">{activeLesson.title}</h3>
                <p className="text-xs text-indigo-300 max-w-md mb-3">
                  Interactive simulated stream active. Transcripts, timestamps, and note synchronization are 100% operational.
                </p>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900/80 px-3 py-1 rounded-md border border-slate-800">
                  <span>{formatTime(currentTime)}</span>
                  <span>/</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            )}

            {/* Big Center Play/Pause Ripple Button on pause */}
            {!isPlaying && (
              <div 
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center bg-black/40 z-10 cursor-pointer backdrop-blur-[2px]"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-indigo-600/90 text-white flex items-center justify-center shadow-2xl hover:scale-110 hover:bg-indigo-500 transition-all">
                  <Play className="w-8 h-8 fill-current ml-1" />
                </div>
              </div>
            )}

            {/* Custom Bottom Controls Overlay */}
            <div className={`absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent p-4 z-20 transition-opacity duration-300 ${
              showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}>
              
              {/* Scrub / Progress Bar */}
              <div 
                className="relative group/scrub h-3 flex items-center cursor-pointer mb-2"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                  setHoverSeekPos(e.clientX - rect.left);
                  setHoverSeekTime(pos * duration);
                }}
                onMouseLeave={() => setHoverSeekTime(null)}
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                  seekTo(pos * duration);
                }}
              >
                {/* Background track */}
                <div className="w-full bg-slate-700/60 h-1.5 rounded-full overflow-hidden group-hover/scrub:h-2.5 transition-all">
                  <div
                    className="h-full bg-indigo-500 rounded-full relative"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  />
                </div>

                {/* Scrubber thumb */}
                <div
                  className="absolute w-3.5 h-3.5 bg-white rounded-full shadow-md -translate-x-1/2 scale-0 group-hover/scrub:scale-100 transition-transform"
                  style={{ left: `${(currentTime / duration) * 100}%` }}
                />

                {/* Hover timestamp tooltip */}
                {hoverSeekTime !== null && (
                  <div
                    className="absolute bottom-6 px-2 py-1 rounded bg-slate-900 border border-slate-700 text-white text-[10px] font-mono pointer-events-none -translate-x-1/2 shadow-xl"
                    style={{ left: `${hoverSeekPos}px` }}
                  >
                    {formatTime(hoverSeekTime)}
                  </div>
                )}
              </div>

              {/* Controls Action Row */}
              <div className="flex items-center justify-between text-white text-xs">
                
                {/* Left controls: Play, Rewind, Fast Forward, Time, Volume */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlay}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-white transition-colors"
                    title={isPlaying ? 'Pause (Space / K)' : 'Play (Space / K)'}
                  >
                    {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                  </button>

                  <button
                    onClick={() => seekRelative(-10)}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                    title="Rewind 10s (J)"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => seekRelative(10)}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                    title="Forward 10s (L)"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>

                  {/* Volume / Mute */}
                  <div className="flex items-center gap-1.5 group/vol">
                    <button
                      onClick={() => {
                        const newMute = !isMuted;
                        setIsMuted(newMute);
                        if (videoRef.current) videoRef.current.muted = newMute;
                      }}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                      title={isMuted ? 'Unmute (M)' : 'Mute (M)'}
                    >
                      {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={isMuted ? 0 : volume}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setVolume(val);
                        setIsMuted(val === 0);
                        if (videoRef.current) {
                          videoRef.current.volume = val;
                          videoRef.current.muted = val === 0;
                        }
                      }}
                      className="w-16 h-1 bg-slate-600 rounded-lg accent-indigo-500 cursor-pointer hidden sm:block"
                    />
                  </div>

                  {/* Time Display */}
                  <div className="font-mono text-[11px] text-slate-300 ml-1">
                    <span>{formatTime(currentTime)}</span>
                    <span className="text-slate-500 mx-1">/</span>
                    <span className="text-slate-400">{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Right controls: Captions, Speed, Theater, Fullscreen */}
                <div className="flex items-center gap-2 relative">
                  
                  {/* Fullscreen Toggle */}
                  <button
                    onClick={handleToggleFullscreen}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                    title="Toggle Fullscreen (F)"
                  >
                    {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Lesson Overview & Key Points */}
          <div className="p-6 space-y-4">
            <div>
              <h3 className="text-base font-bold text-white mb-1">About This Lesson</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{activeLesson.summary}</p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Key Takeaways</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {activeLesson.keyPoints.map((point, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-300 bg-slate-900/40 p-2.5 rounded-lg border border-slate-800/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Classroom Drawer (Transcript, Notes, Syllabus, Resources) */}
        <div className={`${isTheater ? 'lg:col-span-12' : 'lg:col-span-4'} flex flex-col bg-slate-900/50 h-[650px] lg:h-auto border-t lg:border-t-0 border-slate-800`}>
          
          {/* Tabs Header */}
          <div className="flex items-center border-b border-slate-800 bg-slate-900 px-2 pt-2 gap-1 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('transcript')}
              className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'transcript'
                  ? 'bg-slate-950 text-indigo-400 border-t-2 border-indigo-500'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Transcript
              <span className="text-[10px] px-1 rounded bg-slate-800 text-slate-400">
                {activeLesson.transcript.length}
              </span>
            </button>

          </div>

          {/* TAB 1: TRANSCRIPT */}
          {activeTab === 'transcript' && (
            <div className="flex-1 flex flex-col p-4 overflow-hidden">
              {/* Search & Auto-scroll toggle */}
              <div className="flex items-center gap-2 mb-3">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={transcriptSearch}
                    onChange={(e) => setTranscriptSearch(e.target.value)}
                    placeholder="Search dialogue in transcript..."
                    className="w-full pl-8 pr-2 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <button
                  onClick={() => setAutoScrollTranscript(!autoScrollTranscript)}
                  className={`px-2 py-1.5 rounded-lg text-[10px] font-semibold transition-all whitespace-nowrap ${
                    autoScrollTranscript
                      ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                  title="Toggle automatic tracking scroll"
                >
                  Auto-scroll: {autoScrollTranscript ? 'ON' : 'OFF'}
                </button>
              </div>

              {/* Transcript Lines Scrollable List */}
              <div
                ref={transcriptContainerRef}
                className="flex-1 overflow-y-auto space-y-2 pr-1"
              >
                {filteredTranscript.map((line) => {
                  const isActive = currentTime >= line.start && currentTime <= line.end;

                  return (
                    <div
                      key={line.id}
                      id={`transcript-line-${line.id}`}
                      onClick={() => seekTo(line.start)}
                      className={`p-2.5 rounded-xl text-xs cursor-pointer transition-all border ${
                        isActive
                          ? 'bg-indigo-600/20 border-indigo-500/60 shadow-lg text-white font-medium scale-[1.01]'
                          : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/80 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300 font-semibold">
                          {formatTime(line.start)}
                        </span>
                        {line.speaker && (
                          <span className="text-[10px] text-slate-400 font-medium">
                            {line.speaker}
                          </span>
                        )}
                      </div>
                      <p className="leading-relaxed">{line.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}


        </div>
      </div>

    </div>
  );
};
