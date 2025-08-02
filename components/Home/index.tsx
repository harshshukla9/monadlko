'use client'

import { FarcasterActions } from '@/components/Home/FarcasterActions'
import { User } from '@/components/Home/User'
import { WalletActions } from '@/components/Home/WalletActions'
import { NotificationActions } from './NotificationActions'
import { Dialog, DialogContent, DialogTrigger } from '@/components/dialog'
import RetroCoinFlipGame from '@/components/ui/games/retro_coinflip_game'
import RetroMinesGame from '@/components/ui/games/retro_mines_game'
import RetroDiceGame from '@/components/ui/games/retro_dice_game'

export function Demo() {
  return (
    <div className="min-h-screen bg-white font-mono">
    {/* Retro Header */}
    <header className="border-b-4 border-black bg-purple-500 shadow-[0px_4px_0px_0px_rgba(0,0,0,1)]">
      <div className="px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-none flex items-center justify-center">
            <span className="text-black font-black text-xl">🎰</span>
          </div>
          <div>
            <h1 className="text-xl font-black text-black tracking-wider">
              RETRO CASINO
            </h1>
            <p className="text-xs font-black text-black opacity-80">PLAY & WIN BIG</p>
          </div>
        </div>
        <div className="bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] px-3 py-2">
          <span className="font-black text-black">💰 $1,000</span>
        </div>
      </div>
    </header>

    {/* Main Content */}
    <main className="px-4 py-6 space-y-6 bg-white">
      {/* Welcome Section */}
      <div className="text-center space-y-3">
        <div className="bg-purple-500 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 mx-4">
          <h2 className="text-2xl font-black text-black tracking-wider">
            🎮MAKE SOME MONEY🎮
          </h2>
        </div>
        <div className="bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] p-3 mx-6">
          <p className="text-sm font-black text-black">
            PICK A GAME AND START WINNING!
          </p>
        </div>
      </div>

      {/* Games Section */}
      <section className="space-y-4">
        {/* Coin Flip Game */}
        <div className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-purple-500 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
              <span className="text-3xl">🪙</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-black text-black tracking-wide">COIN FLIP</h3>
                <div className="bg-red-500 border-2 border-black px-2 py-1">
                  <span className="text-xs font-black text-white">HOT!</span>
                </div>
              </div>
              <p className="text-sm font-black text-black opacity-80 mb-2">
                CLASSIC HEADS OR TAILS BETTING
              </p>
              <div className="flex items-center justify-between text-xs font-black text-black">
                <span>MIN: $1 • MAX: $10,000</span>
                <span className="bg-purple-500 border border-black px-2 py-1">2X PAYOUT</span>
              </div>
            </div>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <button className="w-full h-12 bg-purple-500 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all duration-100 font-black text-black text-lg tracking-wider">
                🎯 PLAY COIN FLIP 🎯
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-[100vw] max-h-[100vh] w-full h-full bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none p-0 m-0">
              <div className="h-full overflow-y-auto">
                <RetroCoinFlipGame />
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Dice Game */}
        <div className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-blue-400 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
              <span className="text-3xl">🎲</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-black text-black tracking-wide">DICE ROLL</h3>
                <div className="bg-blue-500 border-2 border-black px-2 py-1">
                  <span className="text-xs font-black text-white">STRATEGY</span>
                </div>
              </div>
              <p className="text-sm font-black text-black opacity-80 mb-2">
                ROLL OVER OR UNDER YOUR TARGET
              </p>
              <div className="flex items-center justify-between text-xs font-black text-black">
                <span>MIN: $1 • MAX: $1,000</span>
                <span className="bg-blue-400 border border-black px-2 py-1">UP TO 98X</span>
              </div>
            </div>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <button className="w-full h-12 bg-blue-400 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all duration-100 font-black text-black text-lg tracking-wider">
                🎯 PLAY DICE ROLL 🎯
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-[100vw] max-h-[100vh] w-full h-full bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none p-0 m-0">
              <div className="h-full overflow-y-auto">
                <RetroDiceGame />
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Mines Game */}
        <div className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-green-400 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
              <span className="text-3xl">💎</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-black text-black tracking-wide">MINES</h3>
                <div className="bg-purple-500 border-2 border-black px-2 py-1">
                  <span className="text-xs font-black text-white">DANGER!</span>
                </div>
              </div>
              <p className="text-sm font-black text-black opacity-80 mb-2">
                FIND DIAMONDS, AVOID THE MINES
              </p>
              <div className="flex items-center justify-between text-xs font-black text-black">
                <span>MIN: $1 • MAX: $1,000</span>
                <span className="bg-green-400 border border-black px-2 py-1">UP TO 24X</span>
              </div>
            </div>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <button className="w-full h-12 bg-green-400 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all duration-100 font-black text-black text-lg tracking-wider">
                🎯 PLAY MINES 🎯
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-[100vw] max-h-[100vh] w-full h-full bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none p-0 m-0">
              <div className="h-full overflow-y-auto">
                <RetroMinesGame />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      {/* Retro Stats Section */}
      <div className="bg-purple-500 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-4">
        <div className="bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] p-4 mb-4">
          <h3 className="text-xl font-black text-black text-center tracking-wider">
            📊 YOUR STATS 📊
          </h3>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] p-3 text-center">
            <div className="w-10 h-10 bg-purple-500 border-2 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] mx-auto mb-2 flex items-center justify-center">
              <span className="text-lg">💰</span>
            </div>
            <p className="text-xs font-black text-black">WINNINGS</p>
            <p className="text-lg font-black text-black">$2,450</p>
          </div>
          <div className="bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] p-3 text-center">
            <div className="w-10 h-10 bg-purple-500 border-2 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] mx-auto mb-2 flex items-center justify-center">
              <span className="text-lg">🎯</span>
            </div>
            <p className="text-xs font-black text-black">GAMES</p>
            <p className="text-lg font-black text-black">127</p>
          </div>
          <div className="bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] p-3 text-center">
            <div className="w-10 h-10 bg-purple-500 border-2 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] mx-auto mb-2 flex items-center justify-center">
              <span className="text-lg">🏆</span>
            </div>
            <p className="text-xs font-black text-black">WIN RATE</p>
            <p className="text-lg font-black text-black">68%</p>
          </div>
        </div>
      </div>

      {/* Retro Warning Banner */}
      <div className="bg-red-500 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4">
        <div className="bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] p-3 text-center">
          <p className="text-sm font-black text-black">
            ⚠️ PLAY RESPONSIBLY! SET LIMITS AND KNOW WHEN TO STOP! ⚠️
          </p>
        </div>
      </div>

      {/* Fun Animations */}
      <div className="text-center py-4">
        <div className="inline-flex animate-bounce">
          <span className="text-4xl">🎰</span>
        </div>
        <div className="inline-flex animate-pulse ml-2">
          <span className="text-4xl">💰</span>
        </div>
        <div className="inline-flex animate-bounce ml-2">
          <span className="text-4xl">🎲</span>
        </div>
      </div>
    </main>

    {/* Retro Footer */}
    <footer className="border-t-4 border-black bg-purple-500 shadow-[0px_-4px_0px_0px_rgba(0,0,0,1)] mt-8">
      <div className="px-4 py-4 text-center">
        <div className="bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] px-4 py-2 inline-block">
          <p className="text-xs font-black text-black tracking-wider">
            © MONAD CASINO • PLAY RESPONSIBLY
          </p>
        </div>
      </div>
    </footer>
  </div>
    // <div className="flex min-h-screen flex-col items-center justify-center p-4 space-y-8">
    //   <h1 className="text-3xl font-bold text-center">
    //     Monad Farcaster MiniApp Template
    //   </h1>
    //   <div className="w-full max-w-4xl space-y-6">
    //     <User />
    //     <FarcasterActions />
    //     <NotificationActions />
    //     <WalletActions />
    //   </div>
    // </div>
  )
}
