"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Bomb, Diamond, RotateCcw, DollarSign, Zap, Plus, Minus } from 'lucide-react';

export default function RetroMinesGame() {
  const [gridSize] = useState(25); // 5x5 grid
  const [mineCount, setMineCount] = useState(3);
  const [gameState, setGameState] = useState<'setup' | 'playing' | 'gameOver' | 'won'>('setup');
  const [grid, setGrid] = useState<boolean[]>([]);
  const [revealedTiles, setRevealedTiles] = useState<Set<number>>(new Set());
  const [balance, setBalance] = useState(1000);
  const [stakeAmount, setStakeAmount] = useState(10);
  const [currentWinnings, setCurrentWinnings] = useState(0);
  const [diamondsFound, setDiamondsFound] = useState(0);
  
  // Audio references for sounds
  const bombAudioRef = useRef<HTMLAudioElement | null>(null);
  const clickAudioRef = useRef<HTMLAudioElement | null>(null);
  const cashoutAudioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio on component mount
  useEffect(() => {
    bombAudioRef.current = new Audio('/sounds/bomb.mp3');
    bombAudioRef.current.volume = 0.6; // Set volume to 60%
    
    cashoutAudioRef.current = new Audio('/sounds/cashout.mp3');
    cashoutAudioRef.current.volume = 0.6; // Set volume to 60%
    
    // Create a simple click sound using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  }, []);

  // Play click sound
  const playClickSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
      console.log('Click sound failed:', error);
    }
  };

  // Calculate payout multiplier based on mine count
  const getMultiplier = (mines: number) => {
    const multipliers: { [key: number]: number } = {
      1: 0.1, 2: 0.2, 3: 0.4, 4: 0.6, 5: 0.9,
      6: 1.2, 7: 1.6, 8: 2.1, 9: 2.7, 10: 3.5
    };
    return multipliers[mines] || 0.4;
  };

  // Initialize game grid
  const initializeGame = () => {
    if (balance < stakeAmount) {
      alert('Insufficient balance!');
      return;
    }

    setBalance(prev => prev - stakeAmount);
    
    const newGrid = Array(gridSize).fill(null).map(() => false);
    
    // Place mines randomly
    const minePositions = new Set();
    while (minePositions.size < mineCount) {
      const randomPos = Math.floor(Math.random() * gridSize);
      minePositions.add(randomPos);
    }
    
    minePositions.forEach(pos => {
      newGrid[pos as number] = true; // true = mine, false = monad
    });
    
    setGrid(newGrid);
    setRevealedTiles(new Set());
    setGameState('playing');
    setCurrentWinnings(0);
    setDiamondsFound(0);
  };

  // Handle tile click
  const handleTileClick = async (index: number) => {
    if (gameState !== 'playing' || revealedTiles.has(index)) return;

    // Play click sound for any tile click
    playClickSound();

    const newRevealed = new Set(revealedTiles);
    newRevealed.add(index);
    setRevealedTiles(newRevealed);

    if (grid[index]) {
      // Hit a mine - game over
      // Play bomb explosion sound
      if (bombAudioRef.current) {
        try {
          bombAudioRef.current.currentTime = 0; // Reset audio to start
          await bombAudioRef.current.play();
        } catch (error) {
          console.log('Audio playback failed:', error);
        }
      }
      
      setGameState('gameOver');
      // Reveal all mines
      const allMines = new Set<number>();
      grid.forEach((isMine, idx) => {
        if (isMine) allMines.add(idx);
      });
      setRevealedTiles(prev => new Set([...prev, ...allMines]));
    } else {
      // Found a monad
      const newDiamonds = diamondsFound + 1;
      setDiamondsFound(newDiamonds);
      const multiplier = getMultiplier(mineCount);
      const newWinnings = Math.round(newDiamonds * multiplier * stakeAmount);
      setCurrentWinnings(newWinnings);

      // Check if won (found all monads)
      if (newRevealed.size === gridSize - mineCount) {
        setGameState('won');
      }
    }
  };

  // Cash out
  const cashOut = async () => {
    // Play cashout sound
    if (cashoutAudioRef.current) {
      try {
        cashoutAudioRef.current.currentTime = 0; // Reset audio to start
        await cashoutAudioRef.current.play();
      } catch (error) {
        console.log('Cashout audio playback failed:', error);
      }
    }
    
    setBalance(prev => prev + stakeAmount + currentWinnings);
    setGameState('setup');
  };

  // Reset game
  const resetGame = () => {
    setGameState('setup');
    setRevealedTiles(new Set());
    setCurrentWinnings(0);
    setDiamondsFound(0);
  };

  const renderTile = (index: number) => {
    const isRevealed = revealedTiles.has(index);
    const isMine = grid[index];
    
    return (
      <button
        key={index}
        onClick={() => handleTileClick(index)}
        disabled={gameState !== 'playing'}
        className={`
          aspect-square relative transition-all duration-100 font-black text-xs
          border-2 border-black
          ${isRevealed 
            ? isMine 
              ? 'bg-red-500 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' 
              : ' text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
            : 'bg-white text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]'
          }
          ${gameState === 'playing' && !isRevealed ? 'cursor-pointer' : 'cursor-default'}
        `}
      >
        {isRevealed && (
          <div className="absolute inset-0 flex items-center justify-center">
            {isMine ? (
              <span className="text-lg">💣</span>
            ) : (
              <img 
                src="/monad.png" 
                alt="Monad" 
                className="w-16 h-16 object-contain"
              />
            )}
          </div>
        )}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-white p-4 font-mono">
      <div className="max-w-sm mx-auto space-y-4">
        
        {/* Header */}
        <div className="bg-purple-500 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4">
          <h1 className="text-2xl font-black text-black text-center">
            🎯 RETRO MINES 🎯
          </h1>
        </div>

        {/* Balance Card */}
        <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-black">BALANCE</h2>
              <p className="text-2xl font-black text-black">${balance}</p>
            </div>
            {currentWinnings > 0 && (
              <div className="bg-purple-500 border-2 border-black px-3 py-1">
                <p className="text-sm font-black text-black">WIN</p>
                <p className="text-lg font-black text-black">+${currentWinnings}</p>
              </div>
            )}
          </div>
        </div>

        {/* Game Setup */}
        {gameState === 'setup' && (
          <div className="space-y-4">
            {/* Stake Amount */}
            <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4">
              <h3 className="text-lg font-black text-black mb-3">STAKE AMOUNT</h3>
              
              <div className="flex items-center gap-2 mb-3">
                <button
                  onClick={() => setStakeAmount(Math.max(5, stakeAmount - 5))}
                  className="bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all duration-100 p-2"
                >
                  <Minus className="w-4 h-4 text-black" />
                </button>
                
                <input
                  type="number"
                  value={stakeAmount}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    setStakeAmount(Math.max(5, Math.min(500, value)));
                  }}
                  className="bg-purple-500 border-2 border-black px-4 py-2 flex-1 text-center text-xl font-black text-black focus:outline-none focus:ring-2 focus:ring-purple-300"
                  min="5"
                  max="500"
                />
                
                <button
                  onClick={() => setStakeAmount(Math.min(500, stakeAmount + 5))}
                  className="bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all duration-100 p-2"
                >
                  <Plus className="w-4 h-4 text-black" />
                </button>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {[5, 10, 25, 50, 100].map(amount => (
                  <button
                    key={amount}
                    onClick={() => setStakeAmount(amount)}
                    className={`
                      py-2 px-2 font-black text-sm border-2 border-black transition-all duration-100
                      ${stakeAmount === amount 
                        ? 'bg-purple-500 text-black shadow-none translate-x-[2px] translate-y-[2px]' 
                        : 'bg-white text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]'
                      }
                    `}
                  >
                    ${amount}
                  </button>
                ))}
              </div>
            </div>

            {/* Mine Count */}
            <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4">
              <h3 className="text-lg font-black text-black mb-1">MINES</h3>
              <p className="text-sm font-black text-black mb-3">
                {mineCount} mines • {getMultiplier(mineCount)}x multiplier
              </p>
              
              <div className="flex items-center gap-2 mb-3">
                <button
                  onClick={() => setMineCount(Math.max(1, mineCount - 1))}
                  className="bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all duration-100 p-2"
                >
                  <Minus className="w-4 h-4 text-black" />
                </button>
                
                <input
                  type="number"
                  value={mineCount}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    setMineCount(Math.max(1, Math.min(10, value)));
                  }}
                  className="bg-purple-500 border-2 border-black px-4 py-2 flex-1 text-center text-xl font-black text-black focus:outline-none focus:ring-2 focus:ring-purple-300"
                  min="1"
                  max="10"
                />
                
                <button
                  onClick={() => setMineCount(Math.min(10, mineCount + 1))}
                  className="bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all duration-100 p-2"
                >
                  <Plus className="w-4 h-4 text-black" />
                </button>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {[1, 3, 5, 7, 10].map(count => (
                  <button
                    key={count}
                    onClick={() => setMineCount(count)}
                    className={`
                      py-2 px-2 font-black text-sm border-2 border-black transition-all duration-100
                      ${mineCount === count 
                        ? 'bg-purple-500 text-black shadow-none translate-x-[2px] translate-y-[2px]' 
                        : 'bg-white text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]'
                      }
                    `}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={initializeGame}
              disabled={balance < stakeAmount}
              className={`
                w-full py-4 px-6 font-black text-xl border-2 border-black transition-all duration-100
                ${balance >= stakeAmount
                  ? 'bg-purple-500 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]'
                  : 'bg-gray-300 text-gray-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-not-allowed'
                }
              `}
            >
              {balance >= stakeAmount ? 'START GAME' : 'INSUFFICIENT FUNDS'}
            </button>
          </div>
        )}

        {/* Game Screen */}
        {gameState !== 'setup' && (
          <div className="space-y-4">
            {/* Game Stats */}
            <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm font-black text-black">MINES</p>
                  <p className="text-2xl font-black text-black">{mineCount}</p>
                </div>
                <div>
                  <p className="text-sm font-black text-black">FOUND</p>
                  <p className="text-2xl font-black text-black">{diamondsFound}</p>
                </div>
                <div>
                  <p className="text-sm font-black text-black">STAKE</p>
                  <p className="text-2xl font-black text-black">${stakeAmount}</p>
                </div>
              </div>
            </div>

            {/* Game Grid */}
            <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4">
              <div className="grid grid-cols-5 gap-2">
                {Array(gridSize).fill(null).map((_, index) => renderTile(index))}
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-2">
              {gameState === 'playing' && currentWinnings > 0 && (
                <button
                  onClick={cashOut}
                  className="flex-1 bg-purple-500 text-black py-3 px-4 font-black text-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all duration-100"
                >
                  CASH OUT ${stakeAmount + currentWinnings}
                </button>
              )}
              <button
                onClick={resetGame}
                className="bg-white text-black py-3 px-4 font-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all duration-100"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Game Over Modal */}
        {gameState === 'gameOver' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 text-center max-w-xs w-full">
              <div className="text-4xl mb-4">💥</div>
              <h2 className="text-2xl font-black text-black mb-2">GAME OVER!</h2>
              <p className="text-lg font-black text-black mb-2">Hit a mine!</p>
              <p className="text-sm font-black text-red-600 mb-4">Lost: ${stakeAmount}</p>
              <button
                onClick={resetGame}
                className="bg-purple-500 text-black py-2 px-6 font-black text-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all duration-100"
              >
                TRY AGAIN
              </button>
            </div>
          </div>
        )}

        {/* Win Modal */}
        {gameState === 'won' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 text-center max-w-xs w-full">
              <div className="text-4xl mb-4">🏆</div>
              <h2 className="text-2xl font-black text-black mb-2">PERFECT!</h2>
              <p className="text-lg font-black text-black mb-2">All monads found!</p>
              <div className="bg-purple-500 border-2 border-black p-3 mb-4">
                <p className="text-xl font-black text-black">WON: ${stakeAmount + currentWinnings}</p>
              </div>
              <button
                onClick={() => {
                  cashOut();
                  resetGame();
                }}
                className="bg-purple-500 text-black py-2 px-6 font-black text-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all duration-100"
              >
                COLLECT
              </button>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4">
          <h3 className="text-lg font-black text-black mb-3">HOW TO PLAY</h3>
          <div className="space-y-2 text-sm font-black text-black">
            <p>• Set stake amount & mine count</p>
            <p>• Click tiles to find monads 🎯</p>
            <p>• Avoid mines 💣 or lose stake</p>
            <p>• More mines = higher payouts</p>
            <p>• Cash out anytime to win</p>
          </div>
        </div>
      </div>
    </div>
  );
}