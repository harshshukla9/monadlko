"use client";

import React, { useState, useEffect } from 'react';
import { DollarSign, Plus, Minus, TrendingUp, TrendingDown, RotateCcw } from 'lucide-react';

interface HistoryEntry {
  id: number;
  roll: number;
  bet: number;
  target: number;
  type: string;
  won: boolean;
  payout: number;
  timestamp: string;
}

export default function RetroDiceGame() {
  const [balance, setBalance] = useState(1000);
  const [betAmount, setBetAmount] = useState(10);
  const [targetNumber, setTargetNumber] = useState(50);
  const [betType, setBetType] = useState<'over' | 'under'>('over');
  const [lastRoll, setLastRoll] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [currentRoll, setCurrentRoll] = useState(50);

  // Calculate win chance and multiplier
  const getWinChance = () => {
    if (betType === 'over') {
      return ((100 - targetNumber) / 100) * 100;
    } else {
      return (targetNumber / 100) * 100;
    }
  };

  const getMultiplier = () => {
    const winChance = getWinChance();
    return parseFloat((98 / winChance).toFixed(4)); // 98% house edge
  };

  const getPayout = () => {
    return (betAmount * getMultiplier()).toFixed(2);
  };

  // Roll dice
  const rollDice = async () => {
    if (balance < betAmount) {
      alert('Insufficient balance!');
      return;
    }

    setIsRolling(true);
    setBalance(prev => prev - betAmount);

    // Simulate rolling animation
    let animationCount = 0;
    const rollAnimation = setInterval(() => {
      setCurrentRoll(Math.floor(Math.random() * 100));
      animationCount++;
      
      if (animationCount >= 20) {
        clearInterval(rollAnimation);
        const finalRoll = Math.floor(Math.random() * 100);
        setCurrentRoll(finalRoll);
        setLastRoll(finalRoll);
        
        // Check win condition
        let won = false;
        if (betType === 'over' && finalRoll > targetNumber) {
          won = true;
        } else if (betType === 'under' && finalRoll < targetNumber) {
          won = true;
        }

        // Update balance and history
        if (won) {
          const payout = parseFloat(getPayout());
          setBalance(prev => prev + payout);
        }

        // Add to history
        const newEntry = {
          id: Date.now(),
          roll: finalRoll,
          bet: betAmount,
          target: targetNumber,
          type: betType,
          won: won,
          payout: won ? parseFloat(getPayout()) : 0,
          timestamp: new Date().toLocaleTimeString()
        };

        setHistory(prev => [newEntry, ...prev.slice(0, 9)]); // Keep last 10
        setIsRolling(false);
      }
    }, 50);
  };

  return (
    <div className="min-h-screen bg-white p-4 font-mono">
      <div className="max-w-sm mx-auto space-y-4">
        
        {/* Header */}
        <div className="bg-purple-700 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4">
          <h1 className="text-2xl font-black text-black text-center">
            🎲 RETRO DICE 🎲
          </h1>
        </div>

        {/* Balance Card */}
        <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4">
          <div className="text-center">
            <h2 className="text-lg font-black text-black">BALANCE</h2>
            <p className="text-3xl font-black text-black">${balance.toFixed(2)}</p>
          </div>
        </div>

        {/* Dice Display */}
        <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6">
          <div className="text-center">
            <div className={`text-6xl font-black mb-2 ${isRolling ? 'animate-pulse' : ''}`}>
              🎲
            </div>
            <div className="bg-purple-500 border-2 border-black p-4 mb-2">
              <span className="text-4xl font-black text-black">
                {currentRoll.toFixed(2)}
              </span>
            </div>
            {lastRoll !== null && !isRolling && (
              <div className="text-sm font-black text-black">
                Last Roll: {lastRoll.toFixed(2)}
              </div>
            )}
          </div>
        </div>

        {/* Bet Controls */}
        <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4">
          <h3 className="text-lg font-black text-black mb-3">BET AMOUNT</h3>
          
          <div className="flex items-center gap-2 mb-3">
            <button
              onClick={() => setBetAmount(Math.max(1, betAmount - 1))}
              disabled={isRolling}
              className="bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all duration-100 p-2 disabled:opacity-50"
            >
              <Minus className="w-4 h-4" />
            </button>
            
            <div className="bg-purple-500 border-2 border-black px-4 py-2 flex-1 text-center">
              <span className="text-xl font-black text-black">${betAmount}</span>
            </div>
            
            <button
              onClick={() => setBetAmount(Math.min(balance, betAmount + 1))}
              disabled={isRolling}
              className="bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all duration-100 p-2 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[1, 5, 10, 25].map(amount => (
              <button
                key={amount}
                onClick={() => setBetAmount(amount)}
                disabled={isRolling}
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

        {/* Bet Type Selection */}
        <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4">
          <h3 className="text-lg font-black text-black mb-3">BET TYPE</h3>
          
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button
              onClick={() => setBetType('over')}
              disabled={isRolling}
              className={`
                py-3 px-4 font-black text-sm border-2 border-black transition-all duration-100 disabled:opacity-50 flex items-center justify-center gap-2
                ${betType === 'over' 
                  ? 'bg-purple-500 text-black shadow-none translate-x-[2px] translate-y-[2px]' 
                  : 'bg-white text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]'
                }
              `}
            >
              <TrendingUp className="w-4 h-4" />
              OVER
            </button>
            
            <button
              onClick={() => setBetType('under')}
              disabled={isRolling}
              className={`
                py-3 px-4 font-black text-sm border-2 border-black transition-all duration-100 disabled:opacity-50 flex items-center justify-center gap-2
                ${betType === 'under' 
                  ? 'bg-purple-500 text-black shadow-none translate-x-[2px] translate-y-[2px]' 
                  : 'bg-white text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]'
                }
              `}
            >
              <TrendingDown className="w-4 h-4" />
              UNDER
            </button>
          </div>

          {/* Target Number */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={() => setTargetNumber(Math.max(1, targetNumber - 1))}
                disabled={isRolling}
                className="bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all duration-100 p-2 disabled:opacity-50"
              >
                <Minus className="w-4 h-4" />
              </button>
              
              <div className="bg-purple-500 border-2 border-black px-4 py-2 flex-1 text-center">
                <span className="text-xl font-black text-black">{targetNumber}</span>
              </div>
              
              <button
                onClick={() => setTargetNumber(Math.min(99, targetNumber + 1))}
                disabled={isRolling}
                className="bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all duration-100 p-2 disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            <input
              type="range"
              min="1"
              max="99"
              value={targetNumber}
              onChange={(e) => setTargetNumber(parseInt(e.target.value))}
              disabled={isRolling}
              className="w-full h-4 bg-white border-2 border-black appearance-none cursor-pointer disabled:opacity-50"
            />
          </div>

          <p className="text-sm font-black text-black text-center mb-2">
            Roll {betType} {targetNumber} to win
          </p>
        </div>

        {/* Game Stats */}
        <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4">
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <p className="font-black text-black">WIN CHANCE</p>
              <p className="text-lg font-black text-black">{getWinChance().toFixed(1)}%</p>
            </div>
            <div>
              <p className="font-black text-black">MULTIPLIER</p>
              <p className="text-lg font-black text-black">{getMultiplier()}x</p>
            </div>
            <div>
              <p className="font-black text-black">PAYOUT</p>
              <p className="text-lg font-black text-black">${getPayout()}</p>
            </div>
          </div>
        </div>

        {/* Roll Button */}
        <button
          onClick={rollDice}
          disabled={isRolling || balance < betAmount}
          className={`
            w-full py-4 px-6 font-black text-xl border-2 border-black transition-all duration-100
            ${!isRolling && balance >= betAmount
              ? 'bg-purple-500 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]'
              : 'bg-gray-300 text-gray-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-not-allowed'
            }
          `}
        >
          {isRolling ? 'ROLLING...' : balance >= betAmount ? 'ROLL DICE' : 'INSUFFICIENT FUNDS'}
        </button>

        {/* History */}
        {history.length > 0 && (
          <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4">
            <h3 className="text-lg font-black text-black mb-3">RECENT ROLLS</h3>
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
                        🎲 {entry.roll.toFixed(2)} 
                      </span>
                      <span className="text-black ml-2">
                        ({entry.type.toUpperCase()} {entry.target})
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-black">
                        ${entry.bet} → {entry.won ? `$${entry.payout.toFixed(2)}` : '$0'}
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
            <p>• Choose OVER or UNDER</p>
            <p>• Set target number (1-99)</p>
            <p>• Roll dice to win or lose</p>
            <p>• Higher risk = higher payout</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        input[type="range"] {
          background: linear-gradient(to right, #9D00FF 0%, #9D00FF ${targetNumber}%, #ffffff ${targetNumber}%, #ffffff 100%);
        }
        
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          height: 24px;
          width: 24px;
          background: #000000;
          border: 2px solid #ffffff;
          cursor: pointer;
          box-shadow: 2px 2px 0 rgba(0,0,0,0.5);
        }
        
        input[type="range"]::-moz-range-thumb {
          height: 24px;
          width: 24px;
          background: #000000;
          border: 2px solid #ffffff;
          cursor: pointer;
          box-shadow: 2px 2px 0 rgba(0,0,0,0.5);
          border-radius: 0;
        }
      `}</style>
    </div>
  );
}