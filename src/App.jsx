import React, { useState, useMemo } from 'react';
import SearchBar from './components/SearchBar';
import GenreDropdown from './components/GenreDropdown';
import BpmDropdown from './components/BpmDropdown';
import KeyDropdown from './components/KeyDropdown';
import SampleRow from './components/SampleRow';

const samples = [
  {
    id: 1,
    authorId: 101,
    author: "@bagamemphis",
    title: "alesha_popovich_type_sample",
    tags: ["hip-hop", "hip-hop"],
    time: "0:12",
    key: "Am",
    bpm: "140",
    type: "One-shot",
    price: 15,
    audioUrl: "/public/audio/BRUNO THEME CHOP.wav"
  },
  {
    id: 2,
    authorId: 101,
    author: "@bagamemphis",
    title: "alesha_popovich_type_sample",
    tags: ["hip-hop", "boom-bap"],
    time: "0:05",
    key: "C",
    bpm: "90",
    type: "One-shot",
    price: 15,
    audioUrl: "/public/audio/BUCKETHEAD ELECTRIC TEARS CHOP.wav"
  },
  {
    id: 3,
    authorId: 101,
    author: "@bagamemphis",
    title: "alesha_popovich_type_sample",
    tags: ["hip-hop", "trap"],
    time: "0:45",
    key: "G#m",
    bpm: "128",
    type: "One-shot",
    price: 15,
    audioUrl: "/public/audio/BULLET CHOP.wav"
  },
  {
    id: 4,
    authorId: 101,
    author: "@bagamemphis",
    title: "alesha_popovich_type_sample",
    tags: ["hip-hop", "pluggnb"],
    time: "0:02",
    key: "F",
    bpm: "150",
    type: "One-shot",
    price: 15,
    audioUrl: "/public/audio/CALDERA CHOP.wav"
  },
  {
    id: 5,
    authorId: 101,
    author: "@bagamemphis",
    title: "alesha_popovich_type_sample",
    tags: ["hip-hop", "hip-hop"],
    time: "1:20",
    key: "Dm",
    bpm: "85",
    type: "One-shot",
    price: 15,
    audioUrl: "/public/audio/CHECK OUT TIME LOOP.wav"
  },
  {
    id: 6,
    authorId: 101,
    author: "@bagamemphis",
    title: "alesha_popovich_type_sample",
    tags: ["hip-hop", "hip-hop"],
    time: "0:08",
    key: "Em",
    bpm: "160",
    type: "One-shot",
    price: 15,
    audioUrl: "/public/audio/BRUNO THEME CHOP.wav"
  },
  {
    id: 7,
    authorId: 101,
    author: "@bagamemphis",
    title: "alesha_popovich_type_sample",
    tags: ["hip-hop", "boom-bap"],
    time: "0:30",
    key: "Bm",
    bpm: "110",
    type: "One-shot",
    price: 15,
    audioUrl: "/public/audio/BUCKETHEAD ELECTRIC TEARS CHOP.wav"
  },
  {
    id: 8,
    authorId: 101,
    author: "@bagamemphis",
    title: "alesha_popovich_type_sample",
    tags: ["hip-hop", "trap"],
    time: "0:15",
    key: "C#",
    bpm: "135",
    type: "One-shot",
    price: 15,
    audioUrl: "/public/audio/BULLET CHOP.wav"
  },
  {
    id: 9,
    authorId: 101,
    author: "@bagamemphis",
    title: "alesha_popovich_type_sample",
    tags: ["hip-hop", "pluggnb"],
    time: "0:55",
    key: "A#m",
    bpm: "95",
    type: "One-shot",
    price: 15,
    audioUrl: "/public/audio/CALDERA CHOP.wav"
  },
  {
    id: 10,
    authorId: 101,
    author: "@bagamemphis",
    title: "alesha_popovich_type_sample",
    tags: ["hip-hop", "hip-hop"],
    time: "0:10",
    key: "D",
    bpm: "145",
    type: "One-shot",
    price: 15,
    audioUrl: "/public/audio/CHECK OUT TIME LOOP.wav"
  }
];

function App() {
  const [currentPlayingId, setCurrentPlayingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [bpmRange, setBpmRange] = useState({ min: '', max: '' });

  // Получаем уникальные жанры из всех сэмплов
  const allGenres = useMemo(() => {
    const genres = new Set();
    samples.forEach(sample => {
      sample.tags.forEach(tag => genres.add(tag));
    });
    return Array.from(genres);
  }, []);

  // Получаем уникальные тональности из всех сэмплов
  const allKeys = useMemo(() => {
    const keys = new Set();
    samples.forEach(sample => {
      if (sample.key) keys.add(sample.key);
    });
    return Array.from(keys).sort();
  }, []);

  const handlePlay = (id) => {
    setCurrentPlayingId(id);
  };

  const handleBpmChange = (min, max) => {
    setBpmRange({ min, max });
  };

  const filteredSamples = samples.filter(sample => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = (
      sample.title.toLowerCase().includes(query) ||
      sample.author.toLowerCase().includes(query) ||
      sample.tags.some(tag => tag.toLowerCase().includes(query))
    );

    const matchesGenre = selectedGenres.length === 0 || 
      sample.tags.some(tag => selectedGenres.includes(tag));

    const matchesKey = selectedKeys.length === 0 || 
      selectedKeys.includes(sample.key);

    const sampleBpm = parseInt(sample.bpm, 10);
    const minBpm = bpmRange.min ? parseInt(bpmRange.min, 10) : 0;
    const maxBpm = bpmRange.max ? parseInt(bpmRange.max, 10) : Infinity;
    const matchesBpm = sampleBpm >= minBpm && sampleBpm <= maxBpm;

    return matchesSearch && matchesGenre && matchesKey && matchesBpm;
  });

  return (
    <>
      <header>
        {/* Do header */}
      </header>

      <div className="filters">
        <SearchBar onSearch={setSearchQuery} />

        <div className="filters__dropdowns">
            <GenreDropdown 
                options={allGenres} 
                selectedGenres={selectedGenres} 
                onChange={setSelectedGenres} 
            />
            <BpmDropdown 
                minBpm={bpmRange.min} 
                maxBpm={bpmRange.max} 
                onChange={handleBpmChange} 
            />
            <KeyDropdown 
                options={allKeys} 
                selectedKeys={selectedKeys} 
                onChange={setSelectedKeys} 
            />
        </div>
      </div>

      <div className="samples-container">
        {filteredSamples.map((sample) => (
          <SampleRow 
            key={sample.id} 
            sample={sample} 
            currentPlayingId={currentPlayingId} 
            onPlay={handlePlay} 
          />
        ))}
      </div>

      <footer className="footer">
        created by @squaredealer
      </footer>
    </>
  );
}

export default App;
