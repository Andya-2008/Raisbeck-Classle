  import React, { useState, useEffect } from 'react';
  import { CheckCircle, XCircle, RotateCcw, Calendar, Infinity } from 'lucide-react';
  import { Crown, ArrowUp, ArrowDown } from 'lucide-react';
  import { initializeApp } from 'firebase/app';
  import { getFirestore, collection, doc, setDoc, getDoc, updateDoc, arrayUnion, Timestamp } from 'firebase/firestore';
  import { increment } from 'firebase/firestore';
  import { getDocs } from 'firebase/firestore';

  // Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyA0FfF7Y4ypx-KU7G6Jo8xPbe3Q9n96SyQ",
    authDomain: "clae-aad06.firebaseapp.com",
    projectId: "clae-aad06",
    storageBucket: "clae-aad06.firebasestorage.app",
    messagingSenderId: "467490081043",
    appId: "1:467490081043:web:0936c59fdea5dc2f0d32e6",
    measurementId: "G-Q3SD66TVH6"
  };
  const GRADE_LABELS = {
  freshman: 'Freshmen',
  sophomore: 'Sophomores',
  junior: 'Juniors',
  senior: 'Seniors'
};

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  // Your actual school classes
  const CLASSES = [
    { name: "Algebra 2", teacher: "Campbell", floor: "3", subject: "Math", type: "Class", room: "3160" },
    { name: "Pre-Calculus", teacher: "Campbell", floor: "3", subject: "Math", type: "Class", room: "3160" },
    { name: "Health", teacher: "Campbell", floor: "3", subject: "Miscellaneous", type: "Class", room: "3160" },
    { name: "English 10", teacher: "Carmichael", floor: "3", subject: "English", type: "Class", room: "3130" },
    { name: "Aviation Theater", teacher: "Carmichael", floor: "3", subject: "Arts", type: "Class", room: "3130" },
    { name: "Shop", teacher: "Fenbert", floor: "1", subject: "Science", type: "Class", room: "1810" },
    { name: "CAD 1 / CAD 2", teacher: "Fenbert", floor: "1", subject: "Science", type: "Class", room: "1810" },
    { name: "Applied Physics", teacher: "Fenbert", floor: "1", subject: "Science", type: "Class", room: "1810" },
    { name: "Geometry", teacher: "Gross", floor: "3", subject: "Math", type: "Class", room: "3180" },
    { name: "Leadership", teacher: "Gross", floor: "3", subject: "Miscellaneous", type: "Class", room: "3180" },
    { name: "Intro to Aerospace", teacher: "Heineman", floor: "1", subject: "Science", type: "Class", room: "1830" },
    { name: "Robotics", teacher: "Heineman", floor: "1", subject: "Science", type: "Class", room: "1830" },
    { name: "AP Computer Science", teacher: "Heineman", floor: "1", subject: "Science", type: "Class", room: "1830" },
    { name: "AP Calculus", teacher: "Joshi", floor: "3", subject: "Math", type: "Class", room: "3500" },
    { name: "UW Astronomy", teacher: "Joshi", floor: "3", subject: "Science", type: "Class", room: "3500" },
    { name: "Pre-Calculus", teacher: "Joshi", floor: "3", subject: "Math", type: "Class", room: "3500" },
    { name: "Chemistry", teacher: "Lutz", floor: "3", subject: "Science", type: "Class", room: "3550" },
    { name: "Visual Arts", teacher: "Marshalla", floor: "3", subject: "Arts", type: "Class", room: "3140" },
    { name: "Spanish 2", teacher: "Marshalla", floor: "3", subject: "Language", type: "Class", room: "3140" },
    { name: "Spanish 3 / AP Spanish", teacher: "Marshalla", floor: "3", subject: "Language", type: "Class", room: "3140" },
    { name: "Advanced Aerospace", teacher: "McComb", floor: "2", subject: "Science", type: "Class", room: "2350" },
    { name: "Physics of Flight", teacher: "McComb", floor: "2", subject: "Science", type: "Class", room: "2350" },
    { name: "ISSB", teacher: "Nelson", floor: "3", subject: "History", type: "Class", room: "3510" },
    { name: "APUSH", teacher: "Nipert", floor: "3", subject: "History", type: "Class", room: "3170" },
    { name: "English 12", teacher: "Nipert", floor: "3", subject: "English", type: "Class", room: "3170" },
    { name: "Aviation Careers", teacher: "Nurzhanov", floor: "2", subject: "Miscellaneous", type: "Class", room: "2310" },
    { name: "English 9", teacher: "Nurzhanov", floor: "2", subject: "English", type: "Class", room: "2310" },
    { name: "APES", teacher: "Olson", floor: "3", subject: "Science", type: "Class", room: "3580" },
    { name: "Biology", teacher: "Olson", floor: "3", subject: "Science", type: "Class", room: "3580" },
    { name: "APES", teacher: "Porter", floor: "3", subject: "Science", type: "Class", room: "3580" },
    { name: "Human History", teacher: "Porter", floor: "2", subject: "History", type: "Class", room: "2320" },
    { name: "AP Language and Composition", teacher: "Salnick", floor: "3", subject: "English", type: "Class", room: "3520" },
    { name: "Business", teacher: "Salnick", floor: "3", subject: "Miscellaneous", type: "Class", room: "3520" },
    { name: "Photography", teacher: "Schwimmer", floor: "2", subject: "Arts", type: "Class", room: "2370" },
    { name: "Publishing", teacher: "Schwimmer", floor: "2", subject: "Arts", type: "Class", room: "2370" },
    { name: "Yearbook", teacher: "Schwimmer", floor: "2", subject: "Arts", type: "Class", room: "2370" },
    { name: "Spanish 1", teacher: "St Clair", floor: "3", subject: "Language", type: "Class", room: "3150" },
    { name: "Aviation Careers", teacher: "St Clair", floor: "3", subject: "Miscellaneous", type: "Class", room: "3150" },
    { name: "Civics", teacher: "St Clair", floor: "3", subject: "History", type: "Class", room: "3150" },
    { name: "AP Statistics", teacher: "Stolz", floor: "2", subject: "Math", type: "Class", room: "2380" },
    { name: "Algebra 1", teacher: "Stolz", floor: "2", subject: "Math", type: "Class", room: "2380" },
    { name: "Algebra 2", teacher: "Stolz", floor: "2", subject: "Math", type: "Class", room: "2380" },
    { name: "UW English", teacher: "Wombold", floor: "3", subject: "English", type: "Class", room: "3530" },
    { name: "Science Olympiad", teacher: "McComb", floor: "2", subject: "Science", type: "Club", room: "2350" },
    { name: "AIAA", teacher: "McComb", floor: "2", subject: "Science", type: "Club", room: "2350" },
    { name: "ACE", teacher: "Campbell", floor: "3", subject: "Science", type: "Club", room: "3160" },
    { name: "Key Club", teacher: "Olson", floor: "3", subject: "Miscellaneous", type: "Club", room: "3580" },
    { name: "Environmental Club", teacher: "Olson", floor: "3", subject: "Science", type: "Club", room: "3580" },
    { name: "NHS (National Honor Society)", teacher: "Gross", floor: "3", subject: "Miscellaneous", type: "Club", room: "3180" },
    { name: "TSA (Technology Student Association)", teacher: "Schwimmer", floor: "2", subject: "Science", type: "Club", room: "2370" },
    { name: "Robotics", teacher: "Carmichael", floor: "1", subject: "Science", type: "Club", room: "3130" },
  ];

  const ATTRIBUTES = ['teacher', 'floor', 'room', 'subject', 'type'];
  // Confetti component
  const Confetti = () => {
    const [pieces, setPieces] = useState([]);

    useEffect(() => {
      const newPieces = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        animationDuration: 2 + Math.random() * 3,
        animationDelay: Math.random() * 2,
        color: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#a29bfe'][Math.floor(Math.random() * 6)]
      }));
      setPieces(newPieces);
    }, []);

    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
        {pieces.map(piece => (
          <div
            key={piece.id}
            className="absolute w-3 h-3 opacity-80"
            style={{
              left: `${piece.left}%`,
              top: '-10px',
              backgroundColor: piece.color,
              animation: `fall ${piece.animationDuration}s linear ${piece.animationDelay}s infinite`,
              transform: 'rotate(45deg)'
            }}
          />
        ))}
        <style>{`
          @keyframes fall {
            to {
              transform: translateY(100vh) rotate(405deg);
            }
          }
            @keyframes dailyPulse {
  0% {
    box-shadow: 0 0 0 0 rgba(99,102,241,0.5);
  }
  70% {
    box-shadow: 0 0 0 12px rgba(99,102,241,0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(99,102,241,0);
  }
}

.animate-daily-pulse {
  animation: dailyPulse 2.5s infinite;
}
        `}</style>
      </div>
    );
  };

  export default function ClassWordleGame() {
    const [gameMode, setGameMode] = useState(null); // 'daily' or 'unlimited'
    const [targetClass, setTargetClass] = useState(null);
    const [guesses, setGuesses] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [won, setWon] = useState(false);
    const [todaysPuzzle, setTodaysPuzzle] = useState(null);
    const [alreadyCompleted, setAlreadyCompleted] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [loading, setLoading] = useState(true);
    const [shakeWrong, setShakeWrong] = useState(false);
    const [revealingGuess, setRevealingGuess] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [showGradePrompt, setShowGradePrompt] = useState(false);
    const [userGrade, setUserGrade] = useState(null);
    const [leaderboardData, setLeaderboardData] = useState({
  freshman: 0,
  sophomore: 0,
  junior: 0,
  senior: 0
});

    const [previousRanks, setPreviousRanks] = useState({});
    const [rankChanges, setRankChanges] = useState({});
    const [view, setView] = useState('game'); 
    const [leaderboardHistory, setLeaderboardHistory] = useState([]);
    const [lifetimeLeaderboard, setLifetimeLeaderboard] = useState(null);

    const getTodayString = () => {
      const today = new Date();
      return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    };
    const [pointToast, setPointToast] = useState(null);
    const getDailyClass = (dateString) => {
      // Simple hash function to get consistent daily puzzle
      let hash = 0;
      for (let i = 0; i < dateString.length; i++) {
        const char = dateString.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash | 0; // Convert to 32bit integer
      }
      const index = Math.abs(hash) % CLASSES.length;
      return CLASSES[index];
    };

    const getRandomClass = () => {
      return CLASSES[Math.floor(Math.random() * CLASSES.length)];
    };

    const loadGameState = async () => {
      setLoading(true);
      const today = getTodayString();
      const dailyClass = getDailyClass(today);
      setTodaysPuzzle(today);

      try {
        const result = localStorage.getItem(`class-wordle-${today}`);
        if (result) {
          const savedData = JSON.parse(result);
          if (savedData.completed) {
  setTargetClass(dailyClass);
  setAlreadyCompleted(true);
  setGuesses(savedData.guesses || []);
  setWon(savedData.won || false);
  setGameOver(true);

  if (savedData.won) {
    setShowConfetti(true);
  }

  const savedGrade = localStorage.getItem(`class-wordle-grade-${today}`);
  if (savedGrade) {
    setUserGrade(savedGrade);
    await loadLeaderboard();
setView('leaderboard');
  }
}
        }
      } catch (error) {
        console.log('No saved game for today');
      }
      setLoading(false);
    };

    useEffect(() => {
  loadGameState();
  loadLeaderboard();          // 👈 ADD THIS
  finalizeDayIfNeeded(getTodayString());
      
      // Developer mode: Ctrl + Alt + M to reset
      const handleKeyDown = (e) => {
        if (e.ctrlKey && e.altKey && e.key === 'm') {
          e.preventDefault();
          setGuesses([]);
          setSelectedClass('');
          setInputValue('');
          setShowDropdown(false);
          setGameOver(false);
          setWon(false);
          setAlreadyCompleted(false);
          setShowConfetti(false);
          setShowGradePrompt(false);
          setUserGrade(null);
          setShowLeaderboard(false);
          // Clear localStorage
          const today = getTodayString();
          localStorage.removeItem(`class-wordle-${today}`);
          console.log('Developer mode: Puzzle reset - including grade prompt');
        }
      };
      
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const rankedClasses = Object.entries(leaderboardData)
  .map(([grade, points]) => ({ grade, points }))
  .sort((a, b) => b.points - a.points);
    const saveGameState = async (newGuesses, isWon, isGameOver) => {
      if (gameMode !== 'daily') return; // Only save for daily mode
      
      const today = getTodayString();
      const gameData = {
        date: today,
        guesses: newGuesses,
        won: isWon,
        completed: isGameOver,
        timestamp: new Date().toISOString()
      };

      try {
        localStorage.setItem(
  `class-wordle-${today}`,
  JSON.stringify(gameData)
);
      } catch (error) {
        console.error('Failed to save game:', error);
      }
    };

    const startGame = (mode) => {
      setGameMode(mode);
      if (mode === 'daily') {
        const today = getTodayString();
        setTargetClass(getDailyClass(today));
      } else {
        setTargetClass(getRandomClass());
      }
      setGuesses([]);
      setSelectedClass('');
      setInputValue('');
      setShowDropdown(false);
      setGameOver(false);
      setWon(false);
      setShowConfetti(false);
    };

    const playAgainUnlimited = () => {
      setTargetClass(getRandomClass());
      setGuesses([]);
      setSelectedClass('');
      setInputValue('');
      setShowDropdown(false);
      setGameOver(false);
      setWon(false);
      setShowConfetti(false);
    };
    const loadLeaderboard = async () => {
  const today = getTodayString();
  const docRef = doc(db, 'leaderboards', today);
  const snap = await getDoc(docRef);

  if (!snap.exists()) return;

  const data = {
    freshman: snap.data().freshman || 0,
    sophomore: snap.data().sophomore || 0,
    junior: snap.data().junior || 0,
    senior: snap.data().senior || 0
  };

  const sorted = Object.entries(data)
    .map(([grade, points]) => ({ grade, points }))
    .sort((a, b) => b.points - a.points);

  // Build new rank map
  const newRanks = {};
  sorted.forEach((item, index) => {
    newRanks[item.grade] = index + 1;
  });

  // Compare against previous ranks
  const movement = {};
  Object.keys(newRanks).forEach(grade => {
    if (previousRanks[grade]) {
      movement[grade] = previousRanks[grade] - newRanks[grade];
      // positive = moved UP
    }
  });

  setPreviousRanks(newRanks);
  setRankChanges(movement);
  setLeaderboardData(data);
};

const finalizeDayIfNeeded = async (date) => {
  const winnerRef = doc(db, 'dailyWinners', date);
  const leaderboardRef = doc(db, 'leaderboards', date);

  const alreadyDone = await getDoc(winnerRef);
  if (alreadyDone.exists()) return;

  const lbSnap = await getDoc(leaderboardRef);
  if (!lbSnap.exists()) return;

  const data = lbSnap.data();

  const grades = {
    freshman: data.freshman || 0,
    sophomore: data.sophomore || 0,
    junior: data.junior || 0,
    senior: data.senior || 0
  };

  const sorted = Object.entries(grades)
    .sort((a, b) => b[1] - a[1]);

  const [winner, points] = sorted[0];

  // Save daily winner
  await setDoc(winnerRef, {
    winner,
    points,
    date
  });

  // Increment lifetime leaderboard
  const lifetimeRef = doc(db, 'lifetimeLeaderboard', 'global');
  await setDoc(
    lifetimeRef,
    { [winner]: increment(1), lastUpdated: Timestamp.now() },
    { merge: true }
  );
};
const loadLeaderboardHistory = async () => {
  const snap = await getDocs(collection(db, 'leaderboards'));

  const days = snap.docs
    .map(d => ({ date: d.id, ...d.data() }))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  setLeaderboardHistory(days);

  const lifetimeSnap = await getDoc(
    doc(db, 'lifetimeLeaderboard', 'global')
  );

  if (lifetimeSnap.exists()) {
    setLifetimeLeaderboard(lifetimeSnap.data());
  }
};
    const checkGuess = (guessClass) => {
      const results = {};
      results.className = (guessClass.name === targetClass.name && guessClass.teacher === targetClass.teacher) ? 'correct' : 'incorrect';
      
      ATTRIBUTES.forEach(attr => {
        if (attr === 'room') {
          // Check room numbers for close proximity
          const guessRoom = parseInt(guessClass.room);
          const targetRoom = parseInt(targetClass.room);
          const difference = Math.abs(guessRoom - targetRoom);
          
          if (guessClass.room === targetClass.room) {
            results[attr] = 'correct';
          } else if (difference <= 20) {
            results[attr] = 'close';
          } else {
            results[attr] = 'incorrect';
          }
        } else {
          if (guessClass[attr] === targetClass[attr]) {
            results[attr] = 'correct';
          } else {
            results[attr] = 'incorrect';
          }
        }
      });
      return results;
    };

    const handleGuess = () => {
      if (!selectedClass || gameOver || revealingGuess) return;

      const guessClass = selectedClass;
      const results = checkGuess(guessClass);
      
      setRevealingGuess(true);
      
      // Add guess with animation delay
      setTimeout(() => {
        const newGuesses = [...guesses, { class: guessClass, results }];
        setGuesses(newGuesses);
        setSelectedClass('');
        setInputValue('');
        setShowDropdown(false);

        const isWon = guessClass.name === targetClass.name && guessClass.teacher === targetClass.teacher;
        const isGameOver = isWon || newGuesses.length >= 5;

        if (isWon) {
          setTimeout(() => {
            setWon(true);
            setGameOver(true);
            if (gameMode === 'daily') {
              setAlreadyCompleted(true);
              setShowGradePrompt(true);
            }
            setShowConfetti(true);
            saveGameState(newGuesses, true, true);
            setRevealingGuess(false);
          }, 800);
        } else if (isGameOver) {
          setShakeWrong(true);
          setTimeout(() => {
            setShakeWrong(false);
            setGameOver(true);
            if (gameMode === 'daily') {
              setAlreadyCompleted(true);
            }
            saveGameState(newGuesses, false, true);
            setRevealingGuess(false);
          }, 600);
        } else {
          // Wrong guess but game continues
          setShakeWrong(true);
          setTimeout(() => {
            setShakeWrong(false);
            setRevealingGuess(false);
          }, 600);
        }
      }, 100);
    };

    const handleInputChange = (e) => {
      const value = e.target.value;
      setInputValue(value);
      setShowDropdown(value.length > 0);
      setSelectedClass('');
      setHighlightedIndex(-1);
    };

    const handleKeyDown = (e) => {
      if (showDropdown && filteredClasses.length > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setHighlightedIndex(prev => 
            prev < filteredClasses.length - 1 ? prev + 1 : prev
          );
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setHighlightedIndex(prev => prev > 0 ? prev - 1 : 0);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (highlightedIndex >= 0 && highlightedIndex < filteredClasses.length) {
            handleSelectClass(filteredClasses[highlightedIndex]);
          }
        }
      } else if (e.key === 'Enter' && selectedClass) {
        e.preventDefault();
        handleGuess();
      }
    };
    const getPointsForGuesses = (guessCount) => {
      if (guessCount <= 3) return 5;
      return 3; // 4–5 guesses
    };
    const handleSelectClass = (cls) => {
      setSelectedClass(cls);
      setInputValue(cls.name);
      setShowDropdown(false);
    };

    const filteredClasses = CLASSES.filter(cls => 
      cls.name.toLowerCase().includes(inputValue.toLowerCase()) ||
      cls.teacher.toLowerCase().includes(inputValue.toLowerCase()) ||
      cls.subject.toLowerCase().includes(inputValue.toLowerCase())
    );

    const getAttributeColor = (status) => {
      if (status === 'correct') return 'bg-green-500 text-white';
      if (status === 'close') return 'bg-yellow-500 text-white';
      return 'bg-gray-300 text-gray-700';
    };

    const getTimeUntilTomorrow = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const diff = tomorrow - now;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      return `${hours}h ${minutes}m`;
    };
    const handleGradeSubmit = async (grade) => {
  setUserGrade(grade);
  setShowGradePrompt(false);

  if (gameMode !== 'daily') return;

  const today = getTodayString();
  const points = getPointsForGuesses(guesses.length);
  const gradeKey = grade.toLowerCase();

  try {
    const docRef = doc(db, 'leaderboards', today);

    await setDoc(
      docRef,
      {
        [gradeKey]: increment(points),
        updatedAt: Timestamp.now()
      },
      { merge: true }
    );

    await loadLeaderboard();
setView('leaderboard');

    setPointToast({
      grade: gradeKey,
      points
    });
    localStorage.setItem(
  `class-wordle-grade-${today}`,
  gradeKey
);

    setTimeout(() => setPointToast(null), 2500);

  } catch (err) {
    console.error('Failed to submit leaderboard points', err);
  }
};

    // Mode Selection Screen
    if (loading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-8 flex items-center justify-center">
          <div className="text-xl text-indigo-600">Loading...</div>
        </div>
      );
    }

    if (!gameMode && !alreadyCompleted) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-8 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full">
            <h1
  className={`text-3xl sm:text-4xl font-bold mb-4 ${
    gameMode === 'daily'
      ? 'text-indigo-600'
      : 'text-purple-600'
  }`}
>
  {gameMode === 'daily' ? 'Daily Raisbeck' : 'Raisbeck Unlimited'}
</h1>
            <p className="text-gray-600 text-center mb-8">Choose your game mode:</p>
            
            <div className="relative flex flex-col items-center mb-6">
              {/* Unlimited Mode (background) */}
  <div className="flex flex-col items-center gap-4 mb-6">
  {/* Daily Mode – Primary */}
  <button
    onClick={() => {
      const today = getTodayString();
      setGameMode('daily');
      setTargetClass(getDailyClass(today));
      setGuesses([]);
      setSelectedClass('');
      setInputValue('');
      setShowDropdown(false);
      setGameOver(false);
      setWon(false);
      setShowConfetti(false);
      loadGameState();
    }}
    className="
      w-full max-w-md
      px-10 py-4 rounded-2xl
      text-xl font-extrabold text-white
      bg-gradient-to-r from-indigo-600 to-purple-600
      shadow-xl shadow-indigo-400
      hover:scale-105 transition-all duration-300
      animate-daily-pulse
    "
  >
    🎯 Daily Raisbeck
  </button>

  <p className="text-sm text-indigo-600 font-medium">
    New puzzle every day • Compete with your class
  </p>

  {/* Unlimited Mode – Secondary */}
  <button
    onClick={() => {
      setGameMode('unlimited');
      setTargetClass(getRandomClass());
      setGuesses([]);
      setSelectedClass('');
      setInputValue('');
      setShowDropdown(false);
      setGameOver(false);
      setWon(false);
      setShowConfetti(false);
      setAlreadyCompleted(false);
    }}
    className="
      px-6 py-2 rounded-lg
      text-sm font-semibold
      bg-gray-200 text-gray-700
      hover:bg-gray-300
      transition-all
    "
  >
    Play Unlimited
  </button>
</div>


  <p className="mt-16 text-sm text-indigo-600 font-medium text-center">
    New puzzle every day • Class leaderboard
  </p>
</div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-8">
        {pointToast && (
  <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-toast">
    <div className="bg-indigo-600 text-white px-6 py-3 rounded-full shadow-xl font-bold text-lg">
      {GRADE_LABELS[pointToast.grade]} gained +{pointToast.points} points!
    </div>
  </div>
)}
        {showConfetti && <Confetti />}
        
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center gap-3 mb-6">
  <button
    onClick={() => setView('game')}
    className={`px-4 py-2 rounded-lg font-semibold ${
      view === 'game'
        ? 'bg-indigo-600 text-white'
        : 'bg-gray-200 text-gray-700'
    }`}
  >
    🎮 Play
  </button>

  <button
    onClick={() => setView('leaderboard')}
    className={`px-4 py-2 rounded-lg font-semibold ${
      view === 'leaderboard'
        ? 'bg-indigo-600 text-white'
        : 'bg-gray-200 text-gray-700'
    }`}
  >
    🏆 Leaderboard
  </button>
</div>
      {view === 'game' && (
          <div className="bg-white rounded-lg shadow-xl p-4 sm:p-8">
            {/* Header */}
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-indigo-600">
  {gameMode === 'daily'
    ? 'Daily Raisbeck'
    : 'Raisbeck Unlimited'}
</h1>
              
              <p className="text-gray-600 text-sm sm:text-base">Guess the mystery class or club based on its attributes!</p>
              {gameMode === 'daily' && (
                <div className="flex items-center justify-center gap-2 mt-2 text-xs sm:text-sm text-gray-500">
                  <Calendar size={16} />
                  <span>Puzzle #{Math.floor((new Date() - new Date('2025-01-01')) / (1000 * 60 * 60 * 24))}</span>
                </div>
              )}
            </div>
            

            {/* Already Completed - Daily Mode Celebration */}
            {alreadyCompleted && won && gameMode === 'daily' && !showGradePrompt && (
              <div className="mb-6 p-6 rounded-lg bg-gradient-to-r from-green-400 to-emerald-500 text-white text-center">
                <div className="mt-10 mb-12 flex flex-col items-center">
  <button
    onClick={() => {
      setGameMode('unlimited');
      setTargetClass(getRandomClass());
      setGuesses([]);
      setSelectedClass('');
      setInputValue('');
      setShowDropdown(false);
      setGameOver(false);
      setWon(false);
      setShowConfetti(false);
    }}
    className="
      px-8 py-4
      bg-white text-emerald-700
      rounded-xl
      font-bold text-lg
      shadow-lg
      hover:scale-105
      transition-all
    "
  >
    ▶ Play Unlimited While You Wait
  </button>
</div>
                <CheckCircle size={56} className="mx-auto mb-6 text-white" />
<h2 className="text-2xl font-bold mb-2">Congratulations! 🎉</h2>
                <p className="text-lg mb-1">You completed today's puzzle in {guesses.length} {guesses.length === 1 ? 'guess' : 'guesses'}!</p>
                {userGrade && (
  <button
    onClick={async () => {
      await loadLeaderboard();
      setView('leaderboard');
    }}
    className="underline font-semibold mt-2"
  >
    View Leaderboard
  </button>
)}
                {!userGrade && (
                  <p className="text-sm opacity-90 mt-3">Come back tomorrow for a new puzzle!</p>
                )}
                <div className="mt-4 text-lg font-semibold">
                  Next puzzle in: {getTimeUntilTomorrow()}
                </div>
                
              </div>
            )}
            
            {/* Grade Prompt */}
            {showGradePrompt && gameMode === 'daily' && (
              <div className="mb-6 p-6 rounded-lg bg-gradient-to-r from-purple-400 to-indigo-500 text-white text-center">
                <h2 className="text-2xl font-bold mb-4">Amazing! What grade are you in?</h2>
                <p className="text-sm mb-4">Your score will be added to the leaderboard!</p>
                <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                  <button
                    onClick={() => handleGradeSubmit('Freshman')}
                    className="px-6 py-3 bg-white text-purple-600 rounded-lg hover:bg-gray-100 font-semibold text-lg"
                  >
                    Freshman
                  </button>
                  <button
                    onClick={() => handleGradeSubmit('Sophomore')}
                    className="px-6 py-3 bg-white text-purple-600 rounded-lg hover:bg-gray-100 font-semibold text-lg"
                  >
                    Sophomore
                  </button>
                  <button
                    onClick={() => handleGradeSubmit('Junior')}
                    className="px-6 py-3 bg-white text-purple-600 rounded-lg hover:bg-gray-100 font-semibold text-lg"
                  >
                    Junior
                  </button>
                  <button
                    onClick={() => handleGradeSubmit('Senior')}
                    className="px-6 py-3 bg-white text-purple-600 rounded-lg hover:bg-gray-100 font-semibold text-lg"
                  >
                    Senior
                  </button>
                </div>
              </div>
            )}



            {/* Already Completed - Daily Mode Failed */}
            {alreadyCompleted && !won && gameMode === 'daily' && (
              <div className="mb-6 p-6 rounded-lg bg-gradient-to-r from-orange-400 to-red-500 text-white text-center">
                <XCircle size={48} className="mx-auto mb-3" />
                <h2 className="text-2xl font-bold mb-2">Nice try!</h2>
                <p className="text-lg mb-1">You've completed today's puzzle.</p>
                <p className="text-sm opacity-90">The answer was: <span className="font-bold">{targetClass.name}</span></p>
                <p className="text-sm opacity-90 mt-3">Come back tomorrow for a new puzzle!</p>
                <div className="mt-4 text-lg font-semibold">
                  Next puzzle in: {getTimeUntilTomorrow()}
                </div>
              </div>
            )}

            {/* Guesses History */}
            <div className={`mb-6 space-y-3 ${shakeWrong ? 'animate-shake' : ''}`}>
              {guesses.map((guess, idx) => (
                <div 
                  key={idx} 
                  className="border-2 border-gray-200 rounded-lg p-3 sm:p-4 animate-slideIn"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className={`font-semibold text-base sm:text-lg mb-3 px-3 py-2 rounded text-center transition-all duration-500 ${
                    guess.results.className === 'correct' 
                      ? 'bg-green-500 text-white animate-bounce-once' 
                      : 'bg-gray-200 text-gray-800'
                  }`}>
                    {guess.class.name}
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {ATTRIBUTES.map((attr, attrIdx) => (
                      <div 
                        key={attr} 
                        className={`${getAttributeColor(guess.results[attr])} rounded px-2 sm:px-3 py-2 text-center text-xs sm:text-sm transition-all duration-300 animate-flip`}
                        style={{ animationDelay: `${attrIdx * 0.15}s` }}
                      >
                        <div className="font-semibold capitalize">{attr}</div>
                        <div className="text-xs mt-1">{guess.class[attr]}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <style>{`
              @keyframes slideIn {
                from {
                  opacity: 0;
                  transform: translateY(-20px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
              
              @keyframes flip {
                0% {
                  transform: rotateX(0deg);
                  opacity: 0.3;
                }
                50% {
                  transform: rotateX(90deg);
                  opacity: 0.5;
                }
                100% {
                  transform: rotateX(0deg);
                  opacity: 1;
                }
              }
              
              @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                20%, 40%, 60%, 80% { transform: translateX(5px); }
              }
              
              @keyframes bounceOnce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
              }
              
              .animate-slideIn {
                animation: slideIn 0.5s ease-out forwards;
                opacity: 0;
              }
              
              .animate-flip {
                animation: flip 0.6s ease-out forwards;
              }
              
              .animate-shake {
                animation: shake 0.5s ease-in-out;
              }
              
              .animate-bounce-once {
                animation: bounceOnce 0.6s ease-out;
              }
                
            @keyframes toast {
  0% { opacity: 0; transform: translate(-50%, -10px) scale(0.9); }
  15% { opacity: 1; transform: translate(-50%, 0) scale(1); }
  85% { opacity: 1; }
  100% { opacity: 0; transform: translate(-50%, -10px) scale(0.95); }
}

.animate-toast {
  animation: toast 2.5s ease forwards;
}
  @keyframes rankUp {
  0% { transform: scale(1); }
  40% { transform: scale(1.04); background-color: #dcfce7; }
  100% { transform: scale(1); }
}

.animate-rank-up {
  animation: rankUp 0.6s ease-out;
}
            `}</style>

            {/* Input Area */}
            {!gameOver && targetClass && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type to search for a class or club (Attempt {guesses.length + 1}/5):
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      onFocus={() => setShowDropdown(inputValue.length > 0)}
                      placeholder="Type class or club name..."
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none text-sm sm:text-base"
                    />
                    {showDropdown && filteredClasses.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border-2 border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {filteredClasses.map((cls, idx) => (
                          <div
                            key={`${cls.name}-${cls.teacher}-${idx}`}
                            onClick={() => handleSelectClass(cls)}
                            className={`px-4 py-2 cursor-pointer text-sm sm:text-base ${
                              idx === highlightedIndex 
                                ? 'bg-indigo-200' 
                                : 'hover:bg-indigo-100'
                            }`}
                          >
                            {cls.name} <span className="text-gray-500">- {cls.teacher} ({cls.subject})</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleGuess}
                    disabled={!selectedClass || revealingGuess}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold transition-all hover:scale-105 active:scale-95"
                  >
                    {revealingGuess ? 'Checking...' : 'Guess'}
                  </button>
                </div>
              </div>
            )}

            {/* Game Over - Unlimited Mode */}
            {gameOver && gameMode === 'unlimited' && (
              <div className={`mb-6 p-6 rounded-lg ${won ? 'bg-green-100 border-2 border-green-500' : 'bg-red-100 border-2 border-red-500'}`}>
                <div className="flex items-center gap-2 mb-2 justify-center">
                  {won ? (
                    <>
                      <CheckCircle className="text-green-600" />
                      <span className="font-bold text-green-800">Congratulations! You won in {guesses.length} {guesses.length === 1 ? 'guess' : 'guesses'}!</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="text-red-600" />
                      <span className="font-bold text-red-800">Game Over!</span>
                    </>
                  )}
                </div>
                {!won && (
                  <p className="text-sm text-center mb-3">
                    The answer was: <span className="font-semibold">{targetClass.name}</span>
                  </p>
                )}
                <button
                  onClick={playAgainUnlimited}
                  className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold flex items-center justify-center gap-2"
                >
                  <RotateCcw size={20} />
                  Play Again
                </button>
              </div>
            )}

            {/* Legend */}
            <div className="mt-8 pt-6 border-t-2 border-gray-200">
              <h3 className="font-semibold text-gray-700 mb-3">How to Play:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                {gameMode === 'daily' && <li>• A new puzzle is available every day at midnight</li>}
                <li>• Type to search and select a class from the dropdown</li>
                <li>• <span className="inline-block w-4 h-4 bg-green-500 rounded"></span> Green = Correct attribute or exact class match</li>
                <li>• <span className="inline-block w-4 h-4 bg-yellow-500 rounded"></span> Yellow = Room number is close (within 20)</li>
                <li>• <span className="inline-block w-4 h-4 bg-gray-300 rounded"></span> Gray = Incorrect attribute</li>
                <li>• You have 5 attempts to find the correct class or club</li>
                <li>• Select a class or club from the dropdown and press Enter to guess</li>
                {gameMode === 'daily' && <li>• Your progress is saved automatically</li>}
              </ul>
            </div>
          </div>
          )}
                      {/* Leaderboard */}
{view === 'leaderboard' && (
  <div className="space-y-6 mt-6">

    <div className="bg-white rounded-lg shadow-xl p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">
        🏆 Class Leaderboard
      </h2>
      <div className="mb-6 p-4 rounded-lg bg-indigo-50 border border-indigo-200 text-sm text-indigo-800">
  <h3 className="font-semibold mb-2 flex items-center gap-2">
  🧮 How points work
</h3>
  <ul className="space-y-1">
    <li>• 5 points if you solve the Daily puzzle in 1–3 guesses</li>
    <li>• 3 points if you solve it in 4–5 guesses</li>
    <li>• Points are awarded once per day per player</li>
    <li>• Winning class is determined by total daily points</li>
  </ul>
</div>

      {rankedClasses.map((entry, idx) => {
        const movement = rankChanges[entry.grade];

        return (
          <div
            key={entry.grade}
            className={`relative border-2 rounded-lg p-4 mb-3 transition-all ${
              idx === 0
                ? 'border-yellow-400 bg-yellow-50'
                : 'border-indigo-200'
            } ${movement > 0 ? 'animate-rank-up' : ''}`}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 font-bold text-lg">
                #{idx + 1} {GRADE_LABELS[entry.grade]}
                {idx === 0 && <Crown className="text-yellow-500" />}
              </div>

              <div className="flex items-center gap-2 font-semibold">
                {entry.points} pts
                {movement > 0 && <ArrowUp className="text-green-600" />}
                {movement < 0 && <ArrowDown className="text-red-600" />}
              </div>
            </div>
          </div>
        );
      })}

      {/* Back button (extra clarity) */}
      <button
        onClick={() => setView('game')}
        className="mt-6 w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold"
      >
        ← Back to Game
      </button>
    </div>

  </div>
)}
        </div>
        
      </div>
    );
  }