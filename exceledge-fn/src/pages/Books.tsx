import { useState, useEffect, useRef } from "react";
import {
  Search,
  BookOpen,
  FileText,
  Video,
  Headphones,
  Filter,
  ChevronDown,
  ArrowLeft,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Maximize,
  Minimize,
} from "lucide-react";
import { MainLayout } from "../components/layouts/MainLayout";
import LibraryImg from "../assets/resources.jpg";
import { getAllBooks } from "../services/service";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { BeatLoader } from "react-spinners";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

interface Book {
  id: string;
  title: string;
  author: string;
  coverImageUrl: string;
  language: string;
  type: string[];
  createdBy: { firstName: string; secondName: string };
  pdfUrl: string;
  audioUrl: string;
  videoUrl: string;
  duration?: number;
}

export const BookLibrary = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFormats, setSelectedFormats] = useState({
    pdf: false,
    audio: false,
    video: false,
  });
  const [selectedLanguages, setSelectedLanguages] = useState({
    English: false,
    Kinyarwanda: false,
    French: false,
  });
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<Error | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<
    "pdf" | "audio" | "video"
  >("pdf");

  // PDF Viewer State
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfScale, setPdfScale] = useState(1);
  const [isPdfLoading, setIsPdfLoading] = useState(true);

  // Audio Player State
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);

  // Video Player State
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const allBooks = await getAllBooks();
        const booksWithDefaults = allBooks.map((book: any) => ({
          ...book,
          duration: book.duration || Math.floor(Math.random() * 300) + 60,
          type: book.type || [],
          createdBy: book.createdBy || {
            firstName: "Unknown",
            secondName: "Author",
          },
        }));
        setBooks(booksWithDefaults);
      } catch (error) {
        setErr(
          error instanceof Error ? error : new Error("Failed to load books")
        );
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [selectedFormat, selectedBook]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setVideoCurrentTime(video.currentTime);
    const updateDuration = () => setVideoDuration(video.duration);
    const handleEnded = () => setIsVideoPlaying(false);

    video.addEventListener("timeupdate", updateTime);
    video.addEventListener("loadedmetadata", updateDuration);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("timeupdate", updateTime);
      video.removeEventListener("loadedmetadata", updateDuration);
      video.removeEventListener("ended", handleEnded);
    };
  }, [selectedFormat, selectedBook]);

  const toggleFormat = (format: keyof typeof selectedFormats) => {
    setSelectedFormats({
      ...selectedFormats,
      [format]: !selectedFormats[format],
    });
  };

  const toggleLanguage = (language: keyof typeof selectedLanguages) => {
    setSelectedLanguages({
      ...selectedLanguages,
      [language]: !selectedLanguages[language],
    });
  };

  const hasActiveFilters = () => {
    return (
      Object.values(selectedFormats).some((v) => v) ||
      Object.values(selectedLanguages).some((v) => v)
    );
  };

  const clearFilters = () => {
    setSelectedFormats({
      pdf: false,
      audio: false,
      video: false,
    });
    setSelectedLanguages({
      English: false,
      Kinyarwanda: false,
      French: false,
    });
  };

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());

    const activeFormats = Object.entries(selectedFormats)
      .filter(([_, isSelected]) => isSelected)
      .map(([format]) => format);

    const matchesFormat =
      activeFormats?.length === 0 ||
      activeFormats.some((format) => book.type.includes(format));

    const activeLanguages = Object.entries(selectedLanguages)
      .filter(([_, isSelected]) => isSelected)
      .map(([language]) => language);

    const matchesLanguage =
      activeLanguages?.length === 0 || activeLanguages.includes(book.language);

    return matchesSearch && matchesFormat && matchesLanguage;
  });

  const FormatIcon = ({ format }: { format: string }) => {
    switch (format.toLowerCase()) {
      case "pdf":
        return <FileText size={16} className="text-yellow-600" />;
      case "audio":
        return <Headphones size={16} className="text-green-600" />;
      case "video":
        return <Video size={16} className="text-red-600" />;
      default:
        return null;
    }
  };

  // PDF Viewer Functions
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsPdfLoading(false);
  };

  const goToPrevPage = () => pageNumber > 1 && setPageNumber(pageNumber - 1);
  const goToNextPage = () =>
    numPages && pageNumber < numPages && setPageNumber(pageNumber + 1);
  const zoomIn = () => setPdfScale(pdfScale + 0.25);
  const zoomOut = () => pdfScale > 0.5 && setPdfScale(pdfScale - 0.25);

  // Audio Player Functions
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(
        audioRef.current.currentTime + 15,
        duration
      );
    }
  };

  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(
        audioRef.current.currentTime - 15,
        0
      );
    }
  };

  // Video Player Functions
  const toggleVideoPlayPause = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  const handleVideoSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setVideoCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const skipVideoForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(
        videoRef.current.currentTime + 15,
        videoDuration
      );
    }
  };

  const skipVideoBackward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(
        videoRef.current.currentTime - 15,
        0
      );
    }
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;

    if (!document.fullscreenElement) {
      videoRef.current.requestFullscreen().catch(console.error);
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const renderBookContent = (book: Book) => {
    if (!book) return <div>No content available for this book</div>;
    switch (selectedFormat) {
      case "pdf":
        return (
          <div className="bg-white rounded-lg p-6 shadow-md h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{book.title} - PDF</h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  Page {pageNumber} of {numPages || "..."}
                </span>
              </div>
            </div>

            <div className="flex-grow bg-gray-100 rounded-md overflow-hidden relative">
              {isPdfLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-600"></div>
                </div>
              )}

              <div className="h-full overflow-auto p-4 flex justify-center">
                {book?.pdfUrl ? (
                  <Document
                    file={book.pdfUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={() => setIsPdfLoading(false)}
                    loading={
                      <div className="text-center py-8">
                        <BeatLoader size={24} color="yellow" />
                      </div>
                    }
                    error={
                      <div className="text-red-500 text-center py-8">
                        Failed to load PDF. Please try again later.
                      </div>
                    }
                    className="pdf-document"
                  >
                    <Page
                      pageNumber={pageNumber}
                      scale={pdfScale}
                      renderTextLayer={true}
                      renderAnnotationLayer={true}
                      loading={
                        <div className="text-center py-8">Loading page...</div>
                      }
                      error={
                        <div className="text-red-500 text-center py-8">
                          Failed to load page.
                        </div>
                      }
                    />
                  </Document>
                ) : (
                  <p className="text-center text-gray-500 mt-4">
                    No PDF available
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={goToPrevPage}
                  disabled={pageNumber <= 1}
                  className={`p-2 rounded-md ${
                    pageNumber <= 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-yellow-600 hover:bg-yellow-50"
                  }`}
                >
                  <SkipBack size={20} />
                </button>
                <button
                  onClick={goToNextPage}
                  disabled={pageNumber >= (numPages || 0)}
                  className={`p-2 rounded-md ${
                    pageNumber >= (numPages || 0)
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-yellow-600 hover:bg-yellow-50"
                  }`}
                >
                  <SkipForward size={20} />
                </button>
                <span className="text-sm text-gray-600">
                  {pageNumber} / {numPages || "..."}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={zoomOut}
                  disabled={pdfScale <= 0.5}
                  className={`p-2 rounded-md ${
                    pdfScale <= 0.5
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-yellow-600 hover:bg-yellow-50"
                  }`}
                >
                  <Minimize size={20} />
                </button>
                <span className="text-sm text-gray-600">
                  {Math.round(pdfScale * 100)}%
                </span>
                <button
                  onClick={zoomIn}
                  disabled={pdfScale >= 2}
                  className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-md"
                >
                  <Maximize size={20} />
                </button>
              </div>

              <a
                href={book.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md text-sm"
              >
                Download PDF
              </a>
            </div>
          </div>
        );
      case "audio":
        return (
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">{book.title} - Audio</h2>
              <p className="text-gray-600">
                By {book.author} • {book.language}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center justify-center mb-6">
                <img
                  src={book.coverImageUrl}
                  alt={book.title}
                  className="w-32 h-32 rounded-full object-cover shadow-md"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://via.placeholder.com/300x300?text=No+Cover";
                  }}
                />
              </div>

              <audio
                ref={audioRef}
                src={book.audioUrl}
                preload="metadata"
                className="hidden"
              />

              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right,rgb(218, 246, 59) 0%,rgb(224, 246, 59) ${
                      (currentTime / (duration || 1)) * 100
                    }%, #e5e7eb ${
                      (currentTime / (duration || 1)) * 100
                    }%, #e5e7eb 100%)`,
                  }}
                />
              </div>

              <div className="flex justify-center items-center space-x-6 mb-6">
                <button
                  onClick={skipBackward}
                  className="p-2 text-gray-700 hover:text-yellow-600 rounded-full hover:bg-gray-100"
                >
                  <SkipBack size={24} />
                </button>
                <button
                  onClick={togglePlayPause}
                  className="p-4 bg-yellow-600 text-white rounded-full hover:bg-yellow-700"
                >
                  {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </button>
                <button
                  onClick={skipForward}
                  className="p-2 text-gray-700 hover:text-yellow-600 rounded-full hover:bg-gray-100"
                >
                  <SkipForward size={24} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={toggleMute}
                    className="text-gray-700 hover:text-yellow-600"
                  >
                    <Volume2 size={20} />
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-24 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <a
                  href={book.audioUrl}
                  download
                  className="text-yellow-600 hover:text-yellow-800 text-sm"
                >
                  Download Audio
                </a>
              </div>
            </div>
          </div>
        );
      case "video":
        return (
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">{book.title} - Video</h2>
              <p className="text-gray-600">
                By {book.author} • {book.language}
              </p>
            </div>

            <div className="relative bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                src={book.videoUrl}
                className="w-full"
                onClick={toggleVideoPlayPause}
              />

              <div className="absolute inset-0 flex items-center justify-center">
                {!isVideoPlaying && (
                  <button
                    onClick={toggleVideoPlayPause}
                    className="p-6 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70"
                  >
                    <Play size={48} />
                  </button>
                )}
              </div>

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                <div className="flex items-center mb-2">
                  <button
                    onClick={toggleVideoPlayPause}
                    className="text-white mr-4"
                  >
                    {isVideoPlaying ? <Pause size={20} /> : <Play size={20} />}
                  </button>
                  <span className="text-white text-sm mr-4">
                    {formatTime(videoCurrentTime)} / {formatTime(videoDuration)}
                  </span>
                  <input
                    type="range"
                    min="0"
                    max={videoDuration || 0}
                    value={videoCurrentTime}
                    onChange={handleVideoSeek}
                    className="flex-grow h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right,rgb(202, 231, 35) 0%,rgb(218, 246, 59) ${
                        (videoCurrentTime / (videoDuration || 1)) * 100
                      }%, #6b7280 ${
                        (videoCurrentTime / (videoDuration || 1)) * 100
                      }%, #6b7280 100%)`,
                    }}
                  />
                  <button
                    onClick={toggleFullscreen}
                    className="text-white ml-4"
                  >
                    {isFullscreen ? (
                      <Minimize size={20} />
                    ) : (
                      <Maximize size={20} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <div className="flex space-x-2">
                <button
                  onClick={skipVideoBackward}
                  className="p-2 text-gray-700 hover:text-yellow-600 rounded-md hover:bg-gray-100"
                >
                  <SkipBack size={20} />
                </button>
                <button
                  onClick={skipVideoForward}
                  className="p-2 text-gray-700 hover:text-yellow-600 rounded-md hover:bg-gray-100"
                >
                  <SkipForward size={20} />
                </button>
              </div>
              <a
                href={book.videoUrl}
                download
                className="text-yellow-600 hover:text-yellow-800 text-sm"
              >
                Download Video
              </a>
            </div>
          </div>
        );
      default:
        return <div>No content available</div>;
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-600"></div>
        </div>
      </MainLayout>
    );
  }

  if (err) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-screen">
          <div className="text-red-500 text-center">
            <p>Error loading books:</p>
            <p>{err.message}</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (selectedBook) {
    return (
      <MainLayout>
        <div className=" mx-auto p-8">
          <button
            className="mb-4 flex items-center text-white p-1 hover:text-yellow-800  border rounded-md bg-yellow-600"
            onClick={() => setSelectedBook(null)}
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to Library
          </button>

          <div className="flex gap-6 flex-col md:flex-row">
            <div className="w-full md:w-1/4">
              <img
                src={selectedBook.coverImageUrl}
                alt={selectedBook.title}
                className="w-full rounded-lg shadow-md"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://via.placeholder.com/300x400?text=No+Cover";
                }}
              />
              <div className="mt-4">
                <h2 className="font-bold text-xl">{selectedBook.title}</h2>
                <p className="text-gray-600 mt-1">By {selectedBook.author}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Language: {selectedBook.language}
                </p>
              </div>

              <div className="mt-6">
                <h3 className="font-medium mb-3">Available Formats</h3>
                <div className="space-y-2">
                  {selectedBook.type.includes("PDF") && (
                    <button
                      className={`flex items-center w-full px-3 py-2 rounded-md ${
                        selectedFormat === "pdf"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-50 hover:bg-gray-100"
                      }`}
                      onClick={() => setSelectedFormat("pdf")}
                    >
                      <FileText size={18} className="mr-2" />
                      <span>PDF</span>
                    </button>
                  )}

                  {selectedBook.type.includes("Audio") && (
                    <button
                      className={`flex items-center w-full px-3 py-2 rounded-md ${
                        selectedFormat === "audio"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-50 hover:bg-gray-100"
                      }`}
                      onClick={() => setSelectedFormat("audio")}
                    >
                      <Headphones size={18} className="mr-2" />
                      <span>Audio</span>
                    </button>
                  )}

                  {selectedBook.type.includes("Video") && (
                    <button
                      className={`flex items-center w-full px-3 py-2 rounded-md ${
                        selectedFormat === "video"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-50 hover:bg-gray-100"
                      }`}
                      onClick={() => setSelectedFormat("video")}
                    >
                      <Video size={18} className="mr-2" />
                      <span>Video</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="w-full md:w-3/4">
              {renderBookContent(selectedBook)}
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="relative">
        <div className="relative w-full h-[50vh] overflow-hidden">
          <img
            src={LibraryImg}
            alt="Library"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-end">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-12 text-center">
              Book Library
            </h1>
            <p className="text-xl md:text-2xl text-white text-center max-w-2xl px-4 mb-4">
              Explore our collection of books in multiple formats
            </p>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto pt-6 px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Book Library</h1>

          <div className="w-full md:w-auto flex flex-col md:flex-row gap-4">
            <div className="relative w-full md:w-64">
              <Search
                size={18}
                className="absolute left-3 top-2.5 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search books..."
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-600"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="relative">
              <button
                className="flex items-center px-4 py-2 bg-white border rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-600"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <Filter size={18} className="mr-2" />
                <span className="mr-1">Filters</span>
                {hasActiveFilters() && (
                  <span className="bg-yellow-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {Object.values(selectedFormats).filter((v) => v)?.length +
                      Object.values(selectedLanguages).filter((v) => v)?.length}
                  </span>
                )}
                <ChevronDown size={14} className="ml-2" />
              </button>

              {isFilterOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10 border">
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium">Filters</h3>
                      {hasActiveFilters() && (
                        <button
                          className="text-sm text-yellow-600 hover:text-yellow-800 focus:outline-none"
                          onClick={clearFilters}
                        >
                          Clear all
                        </button>
                      )}
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Format
                      </h4>
                      <div className="space-y-2">
                        {["PDF", "Audio", "Video"].map((format) => (
                          <label
                            key={format}
                            className="flex items-center cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={
                                selectedFormats[
                                  format as keyof typeof selectedFormats
                                ]
                              }
                              onChange={() =>
                                toggleFormat(
                                  format as keyof typeof selectedFormats
                                )
                              }
                              className="rounded text-yellow-600 mr-2 focus:ring-yellow-600"
                            />
                            <div className="flex items-center">
                              <FormatIcon format={format} />
                              <span className="ml-2 capitalize">{format}</span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Language
                      </h4>
                      <div className="space-y-2">
                        {["English", "Kinyarwanda", "French"].map(
                          (language) => (
                            <label
                              key={language}
                              className="flex items-center cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={
                                  selectedLanguages[
                                    language as keyof typeof selectedLanguages
                                  ]
                                }
                                onChange={() =>
                                  toggleLanguage(
                                    language as keyof typeof selectedLanguages
                                  )
                                }
                                className="rounded text-yellow-600 mr-2 focus:ring-yellow-600"
                              />
                              <span>{language}</span>
                            </label>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-gray-600">
            {filteredBooks?.length}{" "}
            {filteredBooks?.length === 1 ? "book" : "books"} found
            {hasActiveFilters() && " with selected filters"}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              onClick={() => setSelectedBook(book)}
            >
              <div className="h-52 overflow-hidden flex items-center justify-center shadow-md">
                <img
                  src={book.coverImageUrl}
                  alt={book.title}
                  className="object-cover w-full h-full rounded-md"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://via.placeholder.com/300x400?text=No+Cover";
                  }}
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-sm mb-1 line-clamp-2">
                  {book.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3">By {book.author}</p>

                <div className="flex items-center justify-between mb-2">
                  <div className="flex space-x-1">
                    {book.type.map((t: string) => (
                      <span key={t} className="inline-flex items-center">
                        <FormatIcon format={t} />
                      </span>
                    ))}
                  </div>
                  <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded">
                    {book.language}
                  </span>
                </div>

                <button
                  className="w-full mt-2 bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded-md text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedBook(book);
                  }}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredBooks?.length === 0 && (
          <div className="text-center py-12">
            <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">
              No books found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filter to find what you're looking
              for.
            </p>
            {hasActiveFilters() && (
              <button
                className="mt-4 text-yellow-600 hover:text-yellow-800 focus:outline-none focus:ring-2 focus:ring-yellow-600 rounded px-2 py-1"
                onClick={clearFilters}
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};
