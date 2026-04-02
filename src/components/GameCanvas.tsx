import { useEffect, useRef, useState, useCallback } from 'react';
import { allocateStat, createInitialState, equipItem, unequipItem, update, useSkill, getEquipmentAttackBonus, deleteItem } from '@/game/engine';
import { render, loadSkillImages, loadCharacterImages, loadGateImage, loadMap0BackgroundImage, loadEnemyImages } from '@/game/renderer';
import { InventoryItem, GameState } from '@/game/types';
import { WORLD_WIDTH, WORLD_HEIGHT } from '@/game/constants';
import GameHUD from './GameHUD';
import InventoryPanel from './Inventory';
import skill1Img from '@/assets/skill/1.png';
import skill3Img from '@/assets/skill/3.png';
import playerIdleImg from '@/assets/character/SW/sowd.png';
import playerAttackImg from '@/assets/character/SW/AT.png';
import gateHomeImg from '@/assets/gate/home.png';
import map0BackgroundImg from '@/assets/map/MAP0.png';
import orc1Img from '@/assets/monter/ORC/_PNG/1_ORK/ORK_01_IDLE_000.png';
import orc2Img from '@/assets/monter/ORC/_PNG/2_ORK/ORK_02_IDLE_000.png';
import orc3Img from '@/assets/monter/ORC/_PNG/3_ORK/ORK_03_IDLE_000.png';

// Animation frames for ORC 1
import orc1Idle00 from '@/assets/monter/ORC/_PNG/1_ORK/ORK_01_IDLE_000.png';
import orc1Idle01 from '@/assets/monter/ORC/_PNG/1_ORK/ORK_01_IDLE_001.png';
import orc1Idle02 from '@/assets/monter/ORC/_PNG/1_ORK/ORK_01_IDLE_002.png';
import orc1Idle03 from '@/assets/monter/ORC/_PNG/1_ORK/ORK_01_IDLE_003.png';
import orc1Idle04 from '@/assets/monter/ORC/_PNG/1_ORK/ORK_01_IDLE_004.png';
import orc1Idle05 from '@/assets/monter/ORC/_PNG/1_ORK/ORK_01_IDLE_005.png';
import orc1Idle06 from '@/assets/monter/ORC/_PNG/1_ORK/ORK_01_IDLE_006.png';
import orc1Idle07 from '@/assets/monter/ORC/_PNG/1_ORK/ORK_01_IDLE_007.png';
import orc1Idle08 from '@/assets/monter/ORC/_PNG/1_ORK/ORK_01_IDLE_008.png';
import orc1Idle09 from '@/assets/monter/ORC/_PNG/1_ORK/ORK_01_IDLE_009.png';

import orc1Walk00 from '@/assets/monter/ORC/_PNG/1_ORK/ORK_01_WALK_000.png';
import orc1Walk01 from '@/assets/monter/ORC/_PNG/1_ORK/ORK_01_WALK_001.png';
import orc1Walk02 from '@/assets/monter/ORC/_PNG/1_ORK/ORK_01_WALK_002.png';
import orc1Walk03 from '@/assets/monter/ORC/_PNG/1_ORK/ORK_01_WALK_003.png';
import orc1Walk04 from '@/assets/monter/ORC/_PNG/1_ORK/ORK_01_WALK_004.png';
import orc1Walk05 from '@/assets/monter/ORC/_PNG/1_ORK/ORK_01_WALK_005.png';
import orc1Walk06 from '@/assets/monter/ORC/_PNG/1_ORK/ORK_01_WALK_006.png';
import orc1Walk07 from '@/assets/monter/ORC/_PNG/1_ORK/ORK_01_WALK_007.png';
import orc1Walk08 from '@/assets/monter/ORC/_PNG/1_ORK/ORK_01_WALK_008.png';
import orc1Walk09 from '@/assets/monter/ORC/_PNG/1_ORK/ORK_01_WALK_009.png';

import orc1Attack00 from '@/assets/monter/ORC/_PNG/1_ORK/ORK_01_ATTAK_000.png';
import orc1Attack01 from '@/assets/monter/ORC/_PNG/1_ORK/ORK_01_ATTAK_001.png';
import orc1Attack02 from '@/assets/monter/ORC/_PNG/1_ORK/ORK_01_ATTAK_002.png';
import orc1Attack03 from '@/assets/monter/ORC/_PNG/1_ORK/ORK_01_ATTAK_003.png';
import orc1Attack04 from '@/assets/monter/ORC/_PNG/1_ORK/ORK_01_ATTAK_004.png';
import orc1Attack05 from '@/assets/monter/ORC/_PNG/1_ORK/ORK_01_ATTAK_005.png';
import orc1Attack06 from '@/assets/monter/ORC/_PNG/1_ORK/ORK_01_ATTAK_006.png';
import orc1Attack07 from '@/assets/monter/ORC/_PNG/1_ORK/ORK_01_ATTAK_007.png';
import orc1Attack08 from '@/assets/monter/ORC/_PNG/1_ORK/ORK_01_ATTAK_008.png';
import orc1Attack09 from '@/assets/monter/ORC/_PNG/1_ORK/ORK_01_ATTAK_009.png';

import orc1Hurt00 from '@/assets/monter/ORC/_PNG/1_ORK/ORK_01_HURT_000.png';
import orc1Hurt01 from '@/assets/monter/ORC/_PNG/1_ORK/ORK_01_HURT_001.png';
import orc1Hurt02 from '@/assets/monter/ORC/_PNG/1_ORK/ORK_01_HURT_002.png';
import orc1Hurt03 from '@/assets/monter/ORC/_PNG/1_ORK/ORK_01_HURT_003.png';
import orc1Hurt04 from '@/assets/monter/ORC/_PNG/1_ORK/ORK_01_HURT_004.png';
import orc1Hurt05 from '@/assets/monter/ORC/_PNG/1_ORK/ORK_01_HURT_005.png';
import orc1Hurt06 from '@/assets/monter/ORC/_PNG/1_ORK/ORK_01_HURT_006.png';
import orc1Hurt07 from '@/assets/monter/ORC/_PNG/1_ORK/ORK_01_HURT_007.png';
import orc1Hurt08 from '@/assets/monter/ORC/_PNG/1_ORK/ORK_01_HURT_008.png';
import orc1Hurt09 from '@/assets/monter/ORC/_PNG/1_ORK/ORK_01_HURT_009.png';

const normalizeKey = (e: KeyboardEvent) => {
  switch (e.code) {
    case 'KeyA': return 'move-left';
    case 'KeyD': return 'move-right';
    case 'KeyW': return 'move-up';
    case 'KeyS': return 'move-down';
    case 'Space': return 'jump';
    case 'KeyJ': case 'KeyZ': return 'attack';
    case 'Digit1': return 'skill-1';
    case 'Digit2': return 'skill-2';
    case 'Digit3': return 'skill-3';
    case 'Digit4': return 'skill-4';
    case 'KeyB': return 'inventory';
    default: return e.key.toLowerCase();
  }
};

const GameCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<GameState>(createInitialState());
  const animRef = useRef<number>(0);
  const [canvasSize, setCanvasSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [hudData, setHudData] = useState({
    hp: 100, maxHp: 100, chakra: 100, maxChakra: 100,
    exp: 0, maxExp: 100, level: 1, gold: 0, diamonds: 0, combo: 0,
    skills: stateRef.current.skills,
    inventory: stateRef.current.inventory,
    player: stateRef.current.player,
    attackPower: stateRef.current.player.attackPower,
    baseAttackPower: stateRef.current.player.baseAttackPower,
    equipmentBonus: getEquipmentAttackBonus(stateRef.current),
  });
  const [showInventory, setShowInventory] = useState(false);

  const toggleInventory = useCallback(() => {
    setShowInventory(prev => !prev);
    stateRef.current.showInventory = !stateRef.current.showInventory;
  }, []);

  const handleSkill = useCallback((index: number) => { useSkill(stateRef.current, index); }, []);
  const handleInventory = useCallback(() => { toggleInventory(); }, [toggleInventory]);
  const restart = useCallback(() => { stateRef.current = createInitialState(); }, []);
  const handleAllocateStat = useCallback((stat: 'str' | 'defPoints' | 'vit' | 'int' | 'agi') => { allocateStat(stateRef.current, stat, 1); }, []);
  const handleShowItemDetails = useCallback((item: InventoryItem) => {}, []);
  const handleEquipItem = useCallback((itemId: string) => { 
    equipItem(stateRef.current, itemId); 
    // Force immediate HUD update
    const state = stateRef.current;
    setHudData({
      hp: state.player.hp, maxHp: state.player.maxHp,
      chakra: state.player.chakra, maxChakra: state.player.maxChakra,
      exp: state.player.exp, maxExp: state.player.maxExp,
      level: state.player.level, gold: state.gold, diamonds: state.diamonds,
      combo: state.combo, skills: state.skills.map(s => ({ ...s })),
      inventory: state.inventory, player: state.player,
      attackPower: state.player.attackPower,
      baseAttackPower: state.player.baseAttackPower,
      equipmentBonus: getEquipmentAttackBonus(state),
    });
  }, []);
  const handleUnequipItem = useCallback((slotType: string) => { 
    unequipItem(stateRef.current, slotType); 
    // Force immediate HUD update
    const state = stateRef.current;
    setHudData({
      hp: state.player.hp, maxHp: state.player.maxHp,
      chakra: state.player.chakra, maxChakra: state.player.maxChakra,
      exp: state.player.exp, maxExp: state.player.maxExp,
      level: state.player.level, gold: state.gold, diamonds: state.diamonds,
      combo: state.combo, skills: state.skills.map(s => ({ ...s })),
      inventory: state.inventory, player: state.player,
      attackPower: state.player.attackPower,
      baseAttackPower: state.player.baseAttackPower,
      equipmentBonus: getEquipmentAttackBonus(state),
    });
  }, []);
  const handleDeleteItem = useCallback((itemId: string) => { 
    deleteItem(stateRef.current, itemId); 
    // Force immediate HUD update to show changes right away
    const state = stateRef.current;
    setHudData({
      hp: state.player.hp, maxHp: state.player.maxHp,
      chakra: state.player.chakra, maxChakra: state.player.maxChakra,
      exp: state.player.exp, maxExp: state.player.maxExp,
      level: state.player.level, gold: state.gold, diamonds: state.diamonds,
      combo: state.combo, skills: state.skills.map(s => ({ ...s })),
      inventory: state.inventory, player: state.player,
      attackPower: state.player.attackPower,
      baseAttackPower: state.player.baseAttackPower,
      equipmentBonus: getEquipmentAttackBonus(state),
    });
  }, []);

  useEffect(() => {
    const img1 = new Image(); img1.src = skill1Img;
    const img3 = new Image(); img3.src = skill3Img;
    const charIdle = new Image(); charIdle.src = playerIdleImg;
    const charAttack = new Image(); charAttack.src = playerAttackImg;
    const gateImg = new Image(); gateImg.src = gateHomeImg;
    const map0BgImg = new Image(); map0BgImg.src = map0BackgroundImg;
    
    // Load enemy images
    const orc1 = new Image(); orc1.src = orc1Img;
    const orc2 = new Image(); orc2.src = orc2Img;
    const orc3 = new Image(); orc3.src = orc3Img;
    
    // Load animation frames for ORC 1
    const orc1IdleFrames = [
      new Image(), new Image(), new Image(), new Image(), new Image(),
      new Image(), new Image(), new Image(), new Image(), new Image()
    ];
    const orc1WalkFrames = [
      new Image(), new Image(), new Image(), new Image(), new Image(),
      new Image(), new Image(), new Image(), new Image(), new Image()
    ];
    const orc1AttackFrames = [
      new Image(), new Image(), new Image(), new Image(), new Image(),
      new Image(), new Image(), new Image(), new Image(), new Image()
    ];
    const orc1HurtFrames = [
      new Image(), new Image(), new Image(), new Image(), new Image(),
      new Image(), new Image(), new Image(), new Image(), new Image()
    ];
    
    // Set sources for animation frames
    const idleImports = [orc1Idle00, orc1Idle01, orc1Idle02, orc1Idle03, orc1Idle04, orc1Idle05, orc1Idle06, orc1Idle07, orc1Idle08, orc1Idle09];
    const walkImports = [orc1Walk00, orc1Walk01, orc1Walk02, orc1Walk03, orc1Walk04, orc1Walk05, orc1Walk06, orc1Walk07, orc1Walk08, orc1Walk09];
    const attackImports = [orc1Attack00, orc1Attack01, orc1Attack02, orc1Attack03, orc1Attack04, orc1Attack05, orc1Attack06, orc1Attack07, orc1Attack08, orc1Attack09];
    const hurtImports = [orc1Hurt00, orc1Hurt01, orc1Hurt02, orc1Hurt03, orc1Hurt04, orc1Hurt05, orc1Hurt06, orc1Hurt07, orc1Hurt08, orc1Hurt09];
    
    orc1IdleFrames.forEach((img, i) => img.src = idleImports[i]);
    orc1WalkFrames.forEach((img, i) => img.src = walkImports[i]);
    orc1AttackFrames.forEach((img, i) => img.src = attackImports[i]);
    orc1HurtFrames.forEach((img, i) => img.src = hurtImports[i]);
    
    img1.onload = () => loadSkillImages({ skill1: img1, skill3: img3 });
    img3.onload = () => loadSkillImages({ skill1: img1, skill3: img3 });
    charIdle.onload = () => loadCharacterImages({ idle: charIdle, attack: charAttack });
    charAttack.onload = () => loadCharacterImages({ idle: charIdle, attack: charAttack });
    gateImg.onload = () => loadGateImage(gateImg);
    map0BgImg.onload = () => loadMap0BackgroundImage(map0BgImg);
    
    // Load enemy images when all are loaded
    orc1.onload = orc2.onload = orc3.onload = () => {
      loadEnemyImages({
        'bandit_normal': orc1,
        'rogue_ninja_normal': orc2,
        'shadow_clone_normal': orc3,
        'bandit_boss': orc1,
        'rogue_ninja_boss': orc2,
        'shadow_clone_boss': orc3
      });
    };
    
    const handleResize = () => { setCanvasSize({ width: window.innerWidth, height: window.innerHeight }); };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const onKeyDown = (e: KeyboardEvent) => {
      const state = stateRef.current;
      const key = normalizeKey(e);
      state.keys.add(key);
      if (key === 'skill-1') handleSkill(0);
      if (key === 'skill-2') handleSkill(1);
      if (key === 'skill-3') handleSkill(2);
      if (key === 'skill-4') handleSkill(3);
      if (key === 'inventory') handleInventory();
      if (key === 'jump' && state.gameOver) restart();
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) e.preventDefault();
    };
    const onKeyUp = (e: KeyboardEvent) => { stateRef.current.keys.delete(normalizeKey(e)); };
    const onBlur = () => { stateRef.current.keys.clear(); };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onBlur);

    let frameCount = 0;
    const gameLoop = () => {
      const state = stateRef.current;
      update(state);
      render(ctx, state, canvasSize.width, canvasSize.height);
      frameCount++;
      if (frameCount % 3 === 0) {
        setHudData({
          hp: state.player.hp, maxHp: state.player.maxHp,
          chakra: state.player.chakra, maxChakra: state.player.maxChakra,
          exp: state.player.exp, maxExp: state.player.maxExp,
          level: state.player.level, gold: state.gold, diamonds: state.diamonds,
          combo: state.combo, skills: state.skills.map(s => ({ ...s })),
          inventory: state.inventory, player: state.player,
          attackPower: state.player.attackPower,
          baseAttackPower: state.player.baseAttackPower,
          equipmentBonus: getEquipmentAttackBonus(state),
        });
      }
      animRef.current = requestAnimationFrame(gameLoop);
    };
    animRef.current = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onBlur);
    };
  }, [handleSkill, restart, canvasSize]);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <canvas ref={canvasRef} width={canvasSize.width} height={canvasSize.height} className="absolute inset-0" />
      <GameHUD {...hudData} onSkill={handleSkill} onInventory={handleInventory} />
      <button onClick={toggleInventory} className="absolute bottom-4 left-4 game-btn-primary px-4 py-2 rounded-lg font-pixel text-[10px] z-30">🎒กระเป๋า</button>
      {showInventory && (
        <InventoryPanel inventory={hudData.inventory} player={hudData.player} onAllocateStat={handleAllocateStat} onEquipItem={handleEquipItem} onUnequipItem={handleUnequipItem} onDeleteItem={handleDeleteItem} onShowItemDetails={handleShowItemDetails} onClose={toggleInventory} />
      )}
    </div>
  );
};

export default GameCanvas;
