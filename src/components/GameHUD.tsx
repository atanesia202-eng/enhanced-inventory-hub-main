import { Skill, Inventory, Character, InventoryItem } from '@/game/types';
import { useState } from 'react';

interface GameHUDProps {
  hp: number;
  maxHp: number;
  chakra: number;
  maxChakra: number;
  exp: number;
  maxExp: number;
  level: number;
  gold: number;
  diamonds: number;
  combo: number;
  skills: Skill[];
  inventory: Inventory;
  player: Character;
  attackPower: number;
  baseAttackPower: number;
  equipmentBonus: number;
  onSkill: (index: number) => void;
  onInventory: () => void;
}

const GameHUD = ({ hp, maxHp, chakra, maxChakra, exp, maxExp, level, gold, diamonds, skills, inventory, player, attackPower, baseAttackPower, equipmentBonus, onSkill, onInventory }: GameHUDProps) => {
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [statsItem, setStatsItem] = useState<InventoryItem | null>(null);

  const openStats = () => {
    let equipmentAttack = 0;
    let equipmentDefense = 0;
    let equipmentHP = 0;
    let equipmentMP = 0;
    Object.values(inventory.equipped).forEach(item => {
      if (item) {
        equipmentAttack += item.stats?.attack || 0;
        equipmentDefense += item.stats?.defense || 0;
        equipmentHP += item.stats?.hp || 0;
        equipmentMP += item.stats?.mp || 0;
      }
    });
    setStatsItem({
      id: 'player-stats',
      name: 'สเตตัสรวม',
      type: 'weapon' as any,
      rarity: 'common' as const,
      icon: '📊',
      stats: {
        attack: attackPower + equipmentAttack,
        defense: player.baseDefense + equipmentDefense,
        hp: player.baseMaxHp + equipmentHP,
        mp: player.baseMaxChakra + equipmentMP,
      },
      equipped: false,
    } as InventoryItem);
    setShowStatsModal(true);
  };

  return (
    <>
      <div className="absolute top-0 left-0 right-0 z-20 pointer-events-none">
        <div className="p-2 max-w-md">
          <div className="flex items-center gap-2 mb-1 pointer-events-auto">
            <span className="font-pixel text-[10px] gold-text">Lv.{level}</span>
            <div className="flex items-center gap-2 text-[8px] font-pixel">
              <span className="text-foreground">⚔️ {baseAttackPower}{equipmentBonus > 0 ? <span className="text-game-stat-green">+{equipmentBonus}</span> : ''}</span>
              <span className="gold-text">🪙 {gold}</span>
              <span className="text-accent">💎 {diamonds}</span>
            </div>
            <button onClick={openStats} className="game-btn-info px-2 py-0.5 rounded text-[7px] font-pixel">📊 สเตตัส</button>
          </div>
          <div className="game-bar mb-1">
            <div className="game-bar-fill bg-hp" style={{ width: `${(hp / maxHp) * 100}%` }} />
            <span className="absolute inset-0 flex items-center justify-between px-2 text-[7px] font-pixel">
              <span className="text-hp">HP</span>
              <span className="text-foreground">{Math.ceil(hp)}/{maxHp}</span>
            </span>
          </div>
          <div className="game-bar mb-1">
            <div className="game-bar-fill bg-chakra" style={{ width: `${(chakra / maxChakra) * 100}%` }} />
            <span className="absolute inset-0 flex items-center justify-between px-2 text-[7px] font-pixel">
              <span className="text-chakra">CK</span>
              <span className="text-foreground">{Math.ceil(chakra)}/{maxChakra}</span>
            </span>
          </div>
          <div className="game-bar">
            <div className="game-bar-fill bg-exp" style={{ width: `${(exp / maxExp) * 100}%` }} />
            <span className="absolute inset-0 flex items-center justify-between px-2 text-[7px] font-pixel">
              <span className="text-exp">EXP</span>
              <span className="text-foreground">{Math.floor((exp / maxExp) * 100)}%</span>
            </span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {skills.map((skill, i) => {
          const cdPercent = skill.currentCooldown / skill.cooldown;
          const isReady = skill.currentCooldown <= 0;
          return (
            <div key={skill.id} className="flex flex-col items-center gap-1">
              <button
                className={`skill-btn ${!isReady ? 'on-cooldown' : ''}`}
                onClick={() => onSkill(i)}
                title={`${skill.nameTh} (${skill.key})`}
              >
                <span className="text-lg">{skill.icon}</span>
                {!isReady && (
                  <div className="cooldown-overlay" style={{ clipPath: `inset(${(1 - cdPercent) * 100}% 0 0 0)` }} />
                )}
              </button>
              <span className="font-pixel text-[7px] text-muted-foreground">
                <span className="text-foreground">{skill.key}</span> {skill.nameTh}
              </span>
            </div>
          );
        })}
      </div>

      <div className="absolute bottom-1 left-1 z-20 font-pixel text-[6px] text-muted-foreground opacity-50">
        <div>A/D เดิน · W กระโดด · S ลง</div>
        <div>Z/J โจมตี · 1234 สกิล · B กระเป๋า</div>
      </div>

      {showStatsModal && statsItem && (() => {
        let equipmentDefense = 0;
        let equipmentHP = 0;
        let equipmentMP = 0;
        Object.values(inventory.equipped).forEach(item => {
          if (item) {
            equipmentDefense += item.stats?.defense || 0;
            equipmentHP += item.stats?.hp || 0;
            equipmentMP += item.stats?.mp || 0;
          }
        });
        return (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80">
            <div className="game-panel rounded-xl p-6 min-w-[400px] max-w-[500px]">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-pixel text-sm gold-text">📊 สเตตัสรวม</h3>
                <button onClick={() => setShowStatsModal(false)} className="text-game-stat-red hover:brightness-125 text-xl font-bold">✕</button>
              </div>
              <div className="space-y-3 text-[11px] font-pixel">
                <div className="game-stat-row"><span className="text-game-stat-red">⚔️ ATK</span><span>{attackPower}<span className="text-game-stat-green"> (+{equipmentBonus})</span></span></div>
                <div className="game-stat-row"><span className="text-game-stat-yellow">🛡️ DEF</span><span>{player.baseDefense}<span className="text-game-stat-green"> (+{equipmentDefense})</span></span></div>
                <div className="game-stat-row"><span className="text-game-stat-green">❤️ HP</span><span>{player.baseMaxHp}<span className="text-game-stat-green"> (+{equipmentHP})</span></span></div>
                <div className="game-stat-row"><span className="text-game-stat-blue">💧 MP</span><span>{player.baseMaxChakra}<span className="text-game-stat-green"> (+{equipmentMP})</span></span></div>
              </div>
              <div className="mt-3">
                <h4 className="font-pixel text-[10px] text-muted-foreground mb-2">อุปกรณ์ที่สวมใส่</h4>
                {Object.entries(inventory.equipped).map(([slot, item]) => (
                  item && (
                    <div key={slot} className="game-stat-row mb-2 text-[10px] font-pixel">
                      <span>{item.icon} {slot}</span><span className="gold-text">{item.name}</span>
                    </div>
                  )
                ))}
                {Object.values(inventory.equipped).filter(Boolean).length === 0 && (
                  <div className="text-[10px] text-muted-foreground font-pixel">ไม่มีอุปกรณ์</div>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </>
  );
};

export default GameHUD;
