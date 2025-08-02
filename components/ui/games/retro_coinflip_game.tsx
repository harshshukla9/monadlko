"use client";

import React, { useState, useEffect, useRef } from 'react';
import { DollarSign, Plus, Minus, RotateCcw } from 'lucide-react';

interface HistoryEntry {
  id: number;
  bet: number;
  guess: string;
  result: string;
  won: boolean;
  payout: number;
  timestamp: string;
}

export default function RetroCoinFlipGame() {
  const [balance, setBalance] = useState(10000);
  const [betAmount, setBetAmount] = useState(100);
  const [selectedSide, setSelectedSide] = useState<'heads' | 'tails'>('heads');
  const [isFlipping, setIsFlipping] = useState(false);
  const [coinSide, setCoinSide] = useState<'heads' | 'tails'>('heads');
  const [lastResult, setLastResult] = useState<'heads' | 'tails' | null>(null);
  const [resultMessage, setResultMessage] = useState('');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [flipCount, setFlipCount] = useState(0);
  
  // Audio reference for coin flip sound
  const coinFlipAudioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio on component mount
  useEffect(() => {
    coinFlipAudioRef.current = new Audio('/sounds/coinflip.mp3');
    coinFlipAudioRef.current.volume = 0.5; // Set volume to 50%
  }, []);

  // Flip coin with animation
  const flipCoin = async () => {
    if (balance < betAmount) {
      alert('Insufficient balance!');
      return;
    }

    setIsFlipping(true);
    setResultMessage('');
    setBalance(prev => prev - betAmount);

    // Play coin flip sound
    if (coinFlipAudioRef.current) {
      try {
        coinFlipAudioRef.current.currentTime = 0; // Reset audio to start
        await coinFlipAudioRef.current.play();
      } catch (error) {
        console.log('Audio playback failed:', error);
      }
    }

    // Generate random result
    const result = Math.random() < 0.5 ? 'heads' : 'tails';
    
    // Animate coin flipping for 2 seconds
    let animationFrames = 0;
    const flipAnimation = setInterval(() => {
      setCoinSide(animationFrames % 2 === 0 ? 'heads' : 'tails');
      animationFrames++;
      
      if (animationFrames >= 20) {
        clearInterval(flipAnimation);
        setCoinSide(result);
        setLastResult(result);
        
        // Check if won
        const won = selectedSide === result;
        const payout = won ? betAmount * 2 : 0;
        
        if (won) {
          setBalance(prev => prev + payout);
          setResultMessage(`You won $${betAmount}!`);
        } else {
          setResultMessage(`You lost $${betAmount}!`);
        }

        // Add to history
        const newEntry = {
          id: Date.now(),
          bet: betAmount,
          guess: selectedSide,
          result: result,
          won: won,
          payout: payout,
          timestamp: new Date().toLocaleTimeString()
        };

        setHistory(prev => [newEntry, ...prev.slice(0, 9)]); // Keep last 10
        setFlipCount(prev => prev + 1);
        setIsFlipping(false);
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-white p-4 font-mono">
      <div className="max-w-sm mx-auto space-y-4">
        
        {/* Header */}
        <div className="bg-purple-500 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4">
          <h1 className="text-2xl font-black text-black text-center">
            🪙 RETRO COIN FLIP 🪙
          </h1>
        </div>

        {/* Balance Card */}
        <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4">
          <div className="text-center">
            <h2 className="text-lg font-black text-black">BALANCE</h2>
            <p className="text-3xl font-black text-black">${balance.toLocaleString()}</p>
            {resultMessage && (
              <div className={`mt-2 p-2 border-2 border-black font-black ${
                resultMessage.includes('won') ? 'bg-green-200' : 'bg-red-200'
              }`}>
                {resultMessage}
              </div>
            )}
          </div>
        </div>

        {/* Coin Display */}
        <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6">
          <div className="text-center">
            <div className="relative mb-4">
              <div 
                className={`
                  w-32 h-32 mx-auto rounded-full border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                  flex items-center justify-center text-4xl font-black transition-all duration-100
                  ${isFlipping ? 'animate-spin' : ''}
                  ${coinSide === 'heads' ? 'bg-purple-500 text-black' : 'bg-gray-300 text-black'}
                `}
                style={{
                  animation: isFlipping ? 'spin 0.1s linear infinite' : 'none'
                }}
              >
                {coinSide === 'heads' ? '👑' : '🦅'}
              </div>
            </div>
            
            <div className="bg-purple-500 border-2 border-black p-3">
              <span className="text-2xl font-black text-black">
                {coinSide.toUpperCase()}
              </span>
            </div>
            
            {lastResult && !isFlipping && (
              <div className="mt-2 text-sm font-black text-black">
                Last Result: {lastResult.toUpperCase()}
              </div>
            )}
          </div>
        </div>

        {/* Bet Amount */}
        <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4">
          <h3 className="text-lg font-black text-black mb-3">BET AMOUNT</h3>
          
          <div className="flex items-center gap-2 mb-3">
            <button
              onClick={() => setBetAmount(Math.max(10, betAmount - 10))}
              disabled={isFlipping}
              className="bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all duration-100 p-2 disabled:opacity-50"
            >
              <Minus className="w-4 h-4" />
            </button>
            
            <div className="bg-purple-500 border-2 border-black px-4 py-2 flex-1 text-center">
              <span className="text-xl font-black text-black">${betAmount}</span>
            </div>
            
            <button
              onClick={() => setBetAmount(Math.min(balance, betAmount + 10))}
              disabled={isFlipping}
              className="bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all duration-100 p-2 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[50, 100, 250, 500].map(amount => (
              <button
                key={amount}
                onClick={() => setBetAmount(amount)}
                disabled={isFlipping}
                className={`
                  py-2 px-2 font-black text-sm border-2 border-black transition-all duration-100 disabled:opacity-50
                  ${betAmount === amount 
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

        {/* Side Selection */}
        <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4">
          <h3 className="text-lg font-black text-black mb-3">CHOOSE YOUR SIDE</h3>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setSelectedSide('heads')}
              disabled={isFlipping}
              className={`
                py-4 px-4 font-black text-lg border-2 border-black transition-all duration-100 disabled:opacity-50 flex flex-col items-center gap-2
                ${selectedSide === 'heads' 
                  ? 'bg-purple-500 text-black shadow-none translate-x-[2px] translate-y-[2px]' 
                  : 'bg-white text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]'
                }
              `}
            >
              <span className="text-2xl">👑</span>
              HEADS
            </button>
            
            <button
              onClick={() => setSelectedSide('tails')}
              disabled={isFlipping}
              className={`
                py-4 px-4 font-black text-lg border-2 border-black transition-all duration-100 disabled:opacity-50 flex flex-col items-center gap-2
                ${selectedSide === 'tails' 
                  ? 'bg-purple-500 text-black shadow-none translate-x-[2px] translate-y-[2px]' 
                  : 'bg-white text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]'
                }
              `}
            >
              <span className="text-2xl">🦅</span>
              TAILS
            </button>
          </div>

          <div className="mt-4 p-3 bg-gray-100 border-2 border-black text-center">
            <p className="font-black text-black text-sm">
              Betting ${betAmount} on {selectedSide.toUpperCase()}
            </p>
            <p className="font-black text-black text-sm">
              Win: ${betAmount * 2} | Lose: ${betAmount}
            </p>
          </div>
        </div>

        {/* Flip Button */}
        <button
          onClick={flipCoin}
          disabled={isFlipping || balance < betAmount}
          className={`
            w-full py-4 px-6 font-black text-xl border-2 border-black transition-all duration-100
            ${!isFlipping && balance >= betAmount
              ? 'bg-purple-500 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]'
              : 'bg-gray-300 text-gray-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-not-allowed'
            }
          `}
        >
          {isFlipping ? 'FLIPPING...' : balance >= betAmount ? 'FLIP COIN' : 'INSUFFICIENT FUNDS'}
        </button>

        {/* Game Stats */}
        <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4">
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <p className="font-black text-black">TOTAL FLIPS</p>
              <p className="text-lg font-black text-black">{flipCount}</p>
            </div>
            <div>
              <p className="font-black text-black">WIN RATE</p>
              <p className="text-lg font-black text-black">
                {flipCount > 0 ? `${Math.round((history.filter(h => h.won).length / flipCount) * 100)}%` : '0%'}
              </p>
            </div>
            <div>
              <p className="font-black text-black">PAYOUT</p>
              <p className="text-lg font-black text-black">2.00x</p>
            </div>
          </div>
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4">
            <h3 className="text-lg font-black text-black mb-3">RECENT FLIPS</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {history.map(entry => (
                <div
                  key={entry.id}
                  className={`
                    p-3 border-2 border-black text-sm font-black
                    ${entry.won ? 'bg-green-200' : 'bg-red-200'}
                  `}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-black">
                        🪙 {entry.result === 'heads' ? '👑' : '🦅'} {entry.result.toUpperCase()}
                      </span>
                      <span className="text-black ml-2">
                        (Bet: {entry.guess.toUpperCase()})
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-black">
                        ${entry.bet} → {entry.won ? `+$${entry.bet}` : `-$${entry.bet}`}
                      </div>
                      <div className="text-xs text-black opacity-70">
                        {entry.timestamp}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4">
          <h3 className="text-lg font-black text-black mb-3">HOW TO PLAY</h3>
          <div className="space-y-2 text-sm font-black text-black">
            <p>• Set your bet amount</p>
            <p>• Choose HEADS 👑 or TAILS 🦅</p>
            <p>• Click FLIP COIN to play</p>
            <p>• Correct guess = 2x your bet</p>
            <p>• Wrong guess = lose your bet</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotateY(0deg); }
          to { transform: rotateY(360deg); }
        }
        
        .animate-spin {
          animation: spin 0.1s linear infinite;
        }
      `}</style>
    </div>
  );
}