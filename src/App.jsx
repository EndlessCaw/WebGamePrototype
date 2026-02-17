import React, { useState, useEffect } from 'react';
import {
  Shield,
  Flame,
  Sword,
  User,
  Ghost,
  Trophy,
  Map as MapIcon,
  ChevronRight,
  RotateCcw,
  Coins,
  Skull,
  Move,
  LogOut,
  Info,
  Wallet,
  Zap
} from 'lucide-react';

// Константы баланса
const GRID_SIZE = 5;
const BASE_RAID_COST = 100;
const ARMOR_RECOVERY_STEPS = 5;

const PRICES = {
  shield: 50,
  torch: 30,
  sword: 40
};

const CELL_TYPES = {
  EMPTY: 'empty',
  WALL: 'wall',
  MONSTER: 'monster',
  CHEST_S: 'chest_s',
  CHEST_M: 'chest_m',
  CHEST_L: 'chest_l',
  EXIT: 'exit',
  START: 'start'
};

const MULTIPLIERS = {
  knight: { [CELL_TYPES.CHEST_S]: 1.08, [CELL_TYPES.CHEST_M]: 1.25, [CELL_TYPES.CHEST_L]: 1.80 },
  thief: { [CELL_TYPES.CHEST_S]: 1.15, [CELL_TYPES.CHEST_M]: 1.45, [CELL_TYPES.CHEST_L]: 2.40 }
};

const App = () => {
  // Состояния баланса и меню
  const [balance, setBalance] = useState(1000);
  const [gameState, setGameState] = useState('menu'); // menu, playing, encounter, result
  const [playerClass, setPlayerClass] = useState('knight');
  const [inventory, setInventory] = useState({ shield: false, torch: false, sword: false });

  // Состояния рейда
  const [grid, setGrid] = useState([]);
  const [playerPos, setPlayerPos] = useState({ r: 0, c: 0 });
  const [multiplier, setMultiplier] = useState(1.0);
  const [armor, setArmor] = useState(1);
  const [armorCooldown, setArmorCooldown] = useState(0);
  const [shieldActive, setShieldActive] = useState(false);
  const [logs, setLogs] = useState([]);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showEncounterModal, setShowEncounterModal] = useState(false);
  const [isDead, setIsDead] = useState(false);
  const [currentRaidCost, setCurrentRaidCost] = useState(BASE_RAID_COST);

  useEffect(() => {
    let cost = BASE_RAID_COST;
    if (inventory.shield) cost += PRICES.shield;
    if (inventory.torch) cost += PRICES.torch;
    if (inventory.sword) cost += PRICES.sword;
    setCurrentRaidCost(cost);
  }, [inventory]);

  const generateMap = () => {
    const newGrid = [];
    const types = [
      { type: CELL_TYPES.EMPTY, weight: 50 },
      { type: CELL_TYPES.WALL, weight: 0 },
      { type: CELL_TYPES.MONSTER, weight: 20 },
      { type: CELL_TYPES.CHEST_S, weight: 12 },
      { type: CELL_TYPES.CHEST_M, weight: 5 },
      { type: CELL_TYPES.CHEST_L, weight: 2 },
      { type: CELL_TYPES.EXIT, weight: 2 }
    ];

    const flatPool = [];
    types.forEach(t => {
      for (let i = 0; i < t.weight; i++) flatPool.push(t.type);
    });

    for (let r = 0; r < GRID_SIZE; r++) {
      const row = [];
      for (let c = 0; c < GRID_SIZE; c++) {
        if (r === 0 && c === 0) {
          row.push({ type: CELL_TYPES.START, revealed: true });
        } else {
          const randomType = flatPool[Math.floor(Math.random() * flatPool.length)];
          row.push({ type: randomType, revealed: false });
        }
      }
      newGrid.push(row);
    }

    if (!newGrid.flat().some(cell => cell.type === CELL_TYPES.EXIT)) {
      newGrid[GRID_SIZE - 1][GRID_SIZE - 1].type = CELL_TYPES.EXIT;
    }
    return newGrid;
  };

  const startGame = () => {
    if (balance < currentRaidCost) return;
    setBalance(prev => prev - currentRaidCost);
    setGrid(generateMap());
    setPlayerPos({ r: 0, c: 0 });
    setMultiplier(1.0);
    setArmor(playerClass === 'knight' ? 1 : 0);
    setArmorCooldown(0);
    setShieldActive(inventory.shield);
    setIsDead(false);
    setLogs(['Поход начался. Ищите выход!']);
    setGameState('playing');
    setShowExitModal(false);
    setShowEncounterModal(false);
  };

  const addLog = (msg) => {
    setLogs(prev => [msg, ...prev].slice(0, 5));
  };

  const handleMove = (r, c) => {
    if (gameState !== 'playing' || showExitModal || showEncounterModal) return;

    const dr = Math.abs(playerPos.r - r);
    const dc = Math.abs(playerPos.c - c);
    if ((dr === 1 && dc === 0) || (dr === 0 && dc === 1)) {
      if (grid[r][c].type === CELL_TYPES.WALL) return;

      const isNewCell = !grid[r][c].revealed;
      const newGrid = [...grid];
      newGrid[r][c].revealed = true;

      setGrid(newGrid);
      setPlayerPos({ r, c });
      resolveCell(r, c, isNewCell);
    }
  };

  const resolveCell = (r, c, isNewCell) => {
    const cellType = grid[r][c].type;

    // Восстановление брони только за НОВЫЕ клетки
    if (playerClass === 'knight' && armor === 0 && isNewCell) {
      setArmorCooldown(prev => {
        const next = prev + 1;
        if (next >= ARMOR_RECOVERY_STEPS) {
          setArmor(1);
          addLog("Броня восстановлена!");
          return 0;
        }
        return next;
      });
    }

    if (cellType.startsWith('chest')) {
      const gain = MULTIPLIERS[playerClass][cellType];
      setMultiplier(prev => prev * gain);
      addLog(`Сундук собран!`);
      // Очищаем клетку после сбора
      const newGrid = [...grid];
      newGrid[r][c].type = CELL_TYPES.EMPTY;
      setGrid(newGrid);
    } else if (cellType === CELL_TYPES.MONSTER) {
      if (inventory.sword) {
        setShowEncounterModal(true);
      } else {
        handleMonster(false);
      }
    } else if (cellType === CELL_TYPES.EXIT) {
      setShowExitModal(true);
    }
  };

  const handleMonster = (attemptSword) => {
    setShowEncounterModal(false);
    let monsterDefeated = false;

    if (attemptSword) {
      setInventory(prev => ({ ...prev, sword: false }));
      if (Math.random() < 0.5) {
        setMultiplier(prev => prev * 2.0);
        addLog("КРИТ! Меч разрубил монстра: Множитель x2!");
        monsterDefeated = true;
      } else {
        addLog("ПРОМАХ! Меч сломан. Монстр атакует!");
      }
    }

    if (!monsterDefeated) {
      // Стандартная защита
      if (playerClass === 'thief' && Math.random() < 0.1) {
        setMultiplier(prev => prev + 0.5);
        addLog("ВОР: Уклонение! (+0.5x)");
        monsterDefeated = true;
      } else if (armor > 0) {
        setArmor(0);
        addLog("РЫЦАРЬ: Броня приняла удар!");
        monsterDefeated = true;
      } else if (shieldActive) {
        setShieldActive(false);
        addLog("Щит разбит, но вы живы!");
        monsterDefeated = true;
      }
    }

    if (monsterDefeated) {
      // Убираем монстра с карты
      const newGrid = [...grid];
      newGrid[playerPos.r][playerPos.c].type = CELL_TYPES.EMPTY;
      setGrid(newGrid);
    } else {
      setIsDead(true);
      setGameState('result');
      addLog("Монстр прикончил вас.");
    }
  };

  const useTorch = () => {
    if (!inventory.torch || gameState !== 'playing') return;
    const newGrid = [...grid];
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const nr = playerPos.r + i;
        const nc = playerPos.c + j;
        if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE) {
          newGrid[nr][nc].revealed = true;
        }
      }
    }
    setGrid(newGrid);
    setInventory(prev => ({ ...prev, torch: false }));
    addLog("Факел осветил тьму.");
  };

  const cashout = () => {
    const winAmount = BASE_RAID_COST * multiplier;
    setBalance(prev => prev + winAmount);
    setIsDead(false);
    setGameState('result');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 font-sans flex flex-col items-center relative overflow-hidden">

      {/* Баланс */}
      <div className="w-full max-w-2xl flex justify-between items-center mb-4 bg-slate-900/80 p-4 rounded-3xl border border-slate-800 shadow-2xl backdrop-blur-xl z-20">
        <div className="flex items-center gap-3">
            <div className="bg-indigo-500/20 p-2 rounded-xl border border-indigo-500/30">
                <Wallet className="text-indigo-400" size={20} />
            </div>
            <div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Ваш баланс</span>
                <span className="text-xl font-black text-white leading-none">{balance.toFixed(0)} $</span>
            </div>
        </div>
        {gameState === 'playing' && (
            <div className="text-right flex items-center gap-4">
                <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <span className="text-[10px] font-black text-green-500 uppercase block">Множитель</span>
                    <span className="text-xl font-black text-green-400 leading-none">x{multiplier.toFixed(2)}</span>
                </div>
            </div>
        )}
      </div>

      {gameState === 'menu' && (
        <div className="w-full max-w-2xl space-y-6 z-10 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button onClick={() => setPlayerClass('knight')} className={`p-6 rounded-3xl border-2 transition-all text-left flex gap-4 ${playerClass === 'knight' ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_30px_rgba(59,130,246,0.15)]' : 'border-slate-800 bg-slate-900 hover:border-slate-700'}`}>
                    <div className={`p-3 rounded-2xl h-fit ${playerClass === 'knight' ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-500'}`}><Shield size={32} /></div>
                    <div>
                        <div className="font-black text-xl uppercase italic">Рыцарь</div>
                        <p className="text-[11px] text-slate-400 leading-snug mt-1">
                        <span className="text-blue-400 font-bold">Броня</span> восстанавливается только при открытии новых клеток.
                        </p>
                    </div>
                </button>
                <button onClick={() => setPlayerClass('thief')} className={`p-6 rounded-3xl border-2 transition-all text-left flex gap-4 ${playerClass === 'thief' ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_30px_rgba(16,185,129,0.15)]' : 'border-slate-800 bg-slate-900 hover:border-slate-700'}`}>
                    <div className={`p-3 rounded-2xl h-fit ${playerClass === 'thief' ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-500'}`}><Ghost size={32} /></div>
                    <div>
                        <div className="font-black text-xl uppercase italic">Вор</div>
                        <p className="text-[11px] text-slate-400 leading-snug mt-1">
                        Шанс уклонения 10%. Сундуки дают на 30% больше прибыли.
                        </p>
                    </div>
                </button>
          </div>

          <div className="bg-slate-900 p-6 rounded-[2.5rem] border border-slate-800 space-y-4 shadow-2xl">
            <div className="flex justify-between px-2"><h3 className="font-black text-slate-500 uppercase text-[10px] tracking-[0.2em]">Снаряжение (1 на рейд)</h3></div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'shield', icon: <Shield size={20}/>, name: 'Щит', price: PRICES.shield, desc: 'Защита' },
                { id: 'torch', icon: <Flame size={20}/>, name: 'Факел', price: PRICES.torch, desc: 'Обзор' },
                { id: 'sword', icon: <Sword size={20}/>, name: 'Меч', price: PRICES.sword, desc: 'Бонус x2' }
              ].map(item => (
                <button key={item.id} onClick={() => setInventory(prev => ({ ...prev, [item.id]: !prev[item.id] }))} className={`p-4 rounded-2xl flex flex-col items-center gap-1 border-2 transition-all active:scale-95 ${inventory[item.id] ? 'border-indigo-500 bg-indigo-500/20 shadow-lg' : 'border-slate-800 bg-slate-950'}`}>
                  <div className={inventory[item.id] ? 'text-indigo-400' : 'text-slate-700'}>{item.icon}</div>
                  <div className="text-[10px] font-black uppercase text-white mt-1">{item.name}</div>
                  <div className="text-xs font-black text-amber-500">{item.price}$</div>
                </button>
              ))}
            </div>
            <div className="pt-4 border-t border-slate-800/50 flex justify-between items-center px-4 font-black">
                <span className="text-xs text-slate-500 uppercase tracking-widest">Ставка:</span>
                <span className="text-2xl text-white">{currentRaidCost} $</span>
            </div>
          </div>

          <button onClick={startGame} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-6 rounded-[2.5rem] shadow-2xl shadow-indigo-900/40 transition-all flex items-center justify-center gap-3 text-2xl active:scale-95 uppercase tracking-tighter">Начать рейд</button>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="w-full max-w-2xl flex flex-col md:flex-row gap-6 z-10 animate-in fade-in zoom-in-95 duration-300">
          <div className="flex-1">
            <div className="grid gap-1 bg-slate-800 p-2 rounded-[2rem] border-4 border-slate-900 shadow-2xl relative" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}>
              {grid.map((row, r) => row.map((cell, c) => {
                const isPlayer = playerPos.r === r && playerPos.c === c;
                const isAdjacent = Math.abs(playerPos.r - r) + Math.abs(playerPos.c - c) === 1;
                return (
                  <div key={`${r}-${c}`} onClick={() => isAdjacent && handleMove(r, c)} className={`aspect-square rounded flex items-center justify-center cursor-pointer transition-all duration-300 ${!cell.revealed ? 'bg-slate-950 border border-slate-900' : 'bg-slate-900'} ${isPlayer ? 'bg-indigo-600 ring-4 ring-indigo-500/50 z-10 scale-105 shadow-2xl shadow-indigo-500/50' : ''}`}>
                    {isPlayer ? (
                      <div className="flex flex-col items-center justify-center animate-in zoom-in duration-200">
                        {playerClass === 'knight' ? <Shield className="text-white drop-shadow-md" size={24}/> : <User className="text-white drop-shadow-md" size={24}/>}
                        <div className="scale-75 -mt-1 opacity-40"><CellIcon type={cell.type} /></div>
                      </div>
                    ) : (cell.revealed ? <CellIcon type={cell.type} /> : <Move className="text-slate-800 opacity-20" size={14}/>)}
                  </div>
                );
              }))}
            </div>
          </div>

          <div className="w-full md:w-64 space-y-4">
             <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 shadow-lg space-y-4">
                <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase text-slate-500"><span>{playerClass === 'knight' ? 'Броня' : 'Ловкость'}</span><span>{armor > 0 ? 'ГОТОВА' : 'ОТКАТ'}</span></div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800 p-0.5">
                        <div className="bg-blue-500 h-full rounded-full transition-all duration-700 shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{ width: `${armor > 0 ? 100 : (armorCooldown / ARMOR_RECOVERY_STEPS) * 100}%` }} />
                    </div>
                </div>
                <div className={`flex items-center gap-2 p-3 rounded-2xl border transition-all ${shieldActive ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-400' : 'bg-slate-950 border-slate-800 text-slate-700 opacity-30'}`}>
                    <Shield size={18} /><span className="text-[10px] font-black uppercase tracking-widest">{shieldActive ? 'Щит Активен' : 'Щит Сломан'}</span>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-2">
               <button disabled={!inventory.torch} onClick={useTorch} className="bg-slate-900 p-4 rounded-3xl border border-slate-800 flex flex-col items-center gap-1 hover:border-orange-500 disabled:opacity-30 transition-all active:scale-95"><Flame size={24} className="text-orange-400"/><span className="text-[10px] font-black uppercase">Факел</span></button>
               <div className={`bg-slate-900 p-4 rounded-3xl border flex flex-col items-center gap-1 transition-all ${inventory.sword ? 'border-indigo-500 text-indigo-400' : 'border-slate-800 text-slate-700 opacity-30'}`}>
                 <Sword size={24} /><span className="text-[10px] font-black uppercase">Меч</span>
               </div>
             </div>

             <div className="bg-slate-950 p-4 rounded-2xl border border-slate-900 h-32 flex flex-col gap-1 overflow-hidden shadow-inner text-[10px] text-slate-500 font-medium">
                {logs.map((log, i) => <div key={i} className={i === 0 ? 'text-indigo-300' : ''}>• {log}</div>)}
             </div>
          </div>
        </div>
      )}

      {/* Модальное окно встречи с монстром (Меч) */}
      {showEncounterModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
            <div className="bg-slate-900 border-2 border-indigo-500 w-full max-w-sm rounded-[3rem] p-8 shadow-[0_0_50px_rgba(79,70,229,0.3)] animate-in zoom-in duration-300">
                <div className="flex justify-center mb-6 text-red-500 bg-red-500/10 w-20 h-20 rounded-full items-center mx-auto border border-red-500/20 animate-bounce"><Ghost size={40} /></div>
                <h2 className="text-3xl font-black text-center mb-2 tracking-tighter">ЗАСАДА!</h2>
                <p className="text-slate-400 text-center text-sm mb-8 leading-relaxed">Использовать <span className="text-indigo-400 font-bold">Меч</span>? Победа даст <span className="text-green-400 font-black">x2 Множитель</span>, проигрыш сломает меч и монстр атакует.</p>
                <div className="flex flex-col gap-3">
                    <button onClick={() => handleMonster(true)} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-2 shadow-xl active:scale-95">АТАКОВАТЬ (50% ШАНС) <Zap size={20}/></button>
                    <button onClick={() => handleMonster(false)} className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-black py-4 rounded-2xl">ПРИНЯТЬ УДАР ЩИТОМ</button>
                </div>
            </div>
        </div>
      )}

      {showExitModal && gameState === 'playing' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-sm rounded-[3rem] p-8 shadow-2xl animate-in zoom-in">
            <div className="flex justify-center mb-6 text-green-400 bg-green-400/10 w-20 h-20 rounded-full items-center mx-auto border border-green-400/20 animate-pulse"><LogOut size={40} /></div>
            <h2 className="text-3xl font-black text-center mb-2 tracking-tighter">ВЫХОД</h2>
            <p className="text-slate-400 text-center text-sm mb-8 leading-relaxed">Вынести <span className="text-amber-400 font-bold">{(BASE_RAID_COST * multiplier).toFixed(0)} $</span> или продолжить риск?</p>
            <div className="flex flex-col gap-3">
              <button onClick={cashout} className="w-full bg-green-600 hover:bg-green-500 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-2 shadow-lg active:scale-95 uppercase">Забрать куш</button>
              <button onClick={() => setShowExitModal(false)} className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-black py-4 rounded-2xl uppercase text-xs">Продолжить</button>
            </div>
          </div>
        </div>
      )}

      {gameState === 'result' && (
        <div className="w-full max-w-md bg-slate-900 p-10 rounded-[4rem] border border-slate-800 shadow-2xl text-center space-y-8 z-10 animate-in zoom-in">
          {!isDead ? (
            <>
              <div className="relative mx-auto w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center border-2 border-green-500/50 shadow-[0_0_40px_rgba(34,197,94,0.2)]"><Trophy size={48} className="text-green-500" /></div>
              <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">ПОБЕДА</h2>
              <div className="bg-slate-950 p-6 rounded-[2.5rem] border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Ваша добыча</div>
                <div className="text-5xl font-black text-amber-400 tracking-tighter">{(BASE_RAID_COST * multiplier).toFixed(0)} $</div>
              </div>
            </>
          ) : (
            <>
              <div className="bg-red-500/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto border-2 border-red-500/30"><Skull size={48} className="text-red-500/80" /></div>
              <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">КОНЕЦ ПУТИ</h2>
              <div className="bg-slate-950 p-6 rounded-[2.5rem] border border-slate-800 opacity-50 grayscale">
                <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Потеряно</div>
                <div className="text-3xl font-black text-slate-400 tracking-tighter">{(BASE_RAID_COST * multiplier).toFixed(0)} $</div>
              </div>
            </>
          )}
          <button onClick={() => { setGameState('menu'); setInventory({ shield: false, torch: false, sword: false }); setMultiplier(1.0); }} className="w-full bg-white hover:bg-slate-200 text-slate-950 font-black py-6 rounded-[2rem] flex items-center justify-center gap-3 active:scale-95 text-xl uppercase tracking-widest"><RotateCcw size={24}/> В таверну</button>
        </div>
      )}
    </div>
  );
};

const CellIcon = ({ type }) => {
  switch (type) {
    case CELL_TYPES.MONSTER: return <Ghost size={20} className="text-red-600 animate-pulse" />;
    case CELL_TYPES.CHEST_S: return <Trophy size={16} className="text-amber-700" />;
    case CELL_TYPES.CHEST_M: return <Trophy size={18} className="text-slate-300" />;
    case CELL_TYPES.CHEST_L: return <Trophy size={22} className="text-amber-400 animate-bounce" />;
    case CELL_TYPES.EXIT: return <div className="flex items-center gap-1 text-green-500 font-black text-lg"><MapIcon size={20}/> E</div>;
    case CELL_TYPES.WALL: return <div className="w-full h-full bg-slate-800 rounded shadow-inner" />;
    case CELL_TYPES.START: return <div className="text-[10px] font-black text-slate-700 uppercase">Start</div>;
    default: return null;
  }
};

export default App;
