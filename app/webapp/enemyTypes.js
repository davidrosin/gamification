window.ENEMY_TYPES = {
  STRESS_CLOUD: {
    id: 'STRESS_CLOUD',
    displayName: 'Stress Cloud',
    description: 'Small but annoying cloud of daily stress.',
    color: '#66ccff',
    tier: 1,
    maxHp: 2,
    baseSpeed: 90,
    speedVariance: 0.2,
    movementPattern: 'sine',
    scoreValue: 50,
    width: 26,
    height: 22,
    onReachBottomEffect: 'teamStress',
    spriteKey: 'stressCloud',
    spriteSheets: {
      idle: {
        spriteKey: 'stressCloud',
        file: 'assets/enemies/stress-cloud.png',
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 4
      },
      hit: {
        spriteKey: 'stressCloud_hit_sheet',
        file: 'assets/enemies/stress-cloud_hit.png',
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 2
      },
      death: {
        spriteKey: 'stressCloud_death_sheet',
        file: 'assets/enemies/stress-cloud_death.png',
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 4
      }
    },
    anim: {
      idle: 'stressCloud_idle',
      hit: 'stressCloud_hit',
      death: 'stressCloud_death'
    }
  },

  DEADLINE_METEOR: {
    id: 'DEADLINE_METEOR',
    displayName: 'Deadline Meteor',
    description: 'Crashing pressure of incoming deadlines.',
    color: '#ff9933',
    tier: 2,
    maxHp: 4,
    baseSpeed: 90,
    speedVariance: 0.1,
    movementPattern: 'dash',
    scoreValue: 120,
    width: 30,
    height: 26,
    onReachBottomEffect: 'bigStressSpike',
    spriteKey: 'deadlineMeteor',
    spriteSheets: {
      idle: {
        spriteKey: 'deadlineMeteor',
        file: 'assets/enemies/deadline-meteor.png',
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 4
      },
      hit: {
        spriteKey: 'deadlineMeteor_hit_sheet',
        file: 'assets/enemies/deadline-meteor_hit.png',
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 2
      },
      death: {
        spriteKey: 'deadlineMeteor_death_sheet',
        file: 'assets/enemies/deadline-meteor_death.png',
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 4
      }
    },
    anim: {
      idle: 'deadlineMeteor_idle',
      hit: 'deadlineMeteor_hit',
      death: 'deadlineMeteor_death'
    }
  },

  BURNOUT_SHADOW: {
    id: 'BURNOUT_SHADOW',
    displayName: 'Burnout Shadow',
    description: 'Slow-moving but very damaging shadow of fatigue.',
    color: '#aa66ff',
    tier: 3,
    maxHp: 6,
    baseSpeed: 60,
    speedVariance: 0.1,
    movementPattern: 'straight',
    scoreValue: 200,
    width: 28,
    height: 24,
    onReachBottomEffect: 'majorTeamHpLoss',
    spriteKey: 'burnoutShadow',
    spriteSheets: {
      idle: {
        spriteKey: 'burnoutShadow',
        file: 'assets/enemies/burnout-shadow.png',
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 4
      },
      hit: {
        spriteKey: 'burnoutShadow_hit_sheet',
        file: 'assets/enemies/burnout-shadow_hit.png',
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 2
      },
      death: {
        spriteKey: 'burnoutShadow_death_sheet',
        file: 'assets/enemies/burnout-shadow_death.png',
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 4
      }
    },
    anim: {
      idle: 'burnoutShadow_idle',
      hit: 'burnoutShadow_hit',
      death: 'burnoutShadow_death'
    }
  },

  RUMOR_BUBBLE: {
    id: 'RUMOR_BUBBLE',
    displayName: 'Rumor Bubble',
    description: 'Floats around spreading negativity if ignored.',
    color: '#ff66aa',
    tier: 1,
    maxHp: 1,
    baseSpeed: 70,
    speedVariance: 0.25,
    movementPattern: 'zigzag',
    scoreValue: 80,
    width: 24,
    height: 22,
    onReachBottomEffect: 'teamMiscommunication',
    spriteKey: 'rumorBubble',
    spriteSheets: {
      idle: {
        spriteKey: 'rumorBubble',
        file: 'assets/enemies/rumor-bubble.png',
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 4
      },
      hit: {
        spriteKey: 'rumorBubble_hit_sheet',
        file: 'assets/enemies/rumor-bubble_hit.png',
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 2
      },
      death: {
        spriteKey: 'rumorBubble_death_sheet',
        file: 'assets/enemies/rumor-bubble_death.png',
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 4
      }
    },
    anim: {
      idle: 'rumorBubble_idle',
      hit: 'rumorBubble_hit',
      death: 'rumorBubble_death'
    }
  },

  LEGACY_RFC_MONSTER: {
    id: 'LEGACY_RFC_MONSTER',
    displayName: 'Legacy RFC Monster',
    description: 'Heavy old integration creature that refuses to die.',
    color: '#c2b280',
    tier: 3,
    maxHp: 8,
    baseSpeed: 50,
    speedVariance: 0.1,
    movementPattern: 'straight',
    scoreValue: 300,
    width: 32,
    height: 28,
    onReachBottomEffect: 'systemSlowdown',
    spriteKey: 'legacyRfc',
    spriteSheets: {
      idle: {
        spriteKey: 'legacyRfc',
        file: 'assets/enemies/legacy-rfc-monster.png',
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 4
      },
      hit: {
        spriteKey: 'legacyRfc_hit_sheet',
        file: 'assets/enemies/legacy-rfc-monster_hit.png',
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 2
      },
      death: {
        spriteKey: 'legacyRfc_death_sheet',
        file: 'assets/enemies/legacy-rfc-monster_death.png',
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 4
      }
    },
    anim: {
      idle: 'legacyRfc_idle',
      hit: 'legacyRfc_hit',
      death: 'legacyRfc_death'
    }
  },

  IDOC_GHOST: {
    id: 'IDOC_GHOST',
    displayName: 'IDoc Ghost',
    description: 'Haunted data packet drifting through the system.',
    color: '#66ffcc',
    tier: 2,
    maxHp: 3,
    baseSpeed: 80,
    speedVariance: 0.2,
    movementPattern: 'blink',
    scoreValue: 150,
    width: 26,
    height: 24,
    onReachBottomEffect: 'dataConfusion',
    spriteKey: 'idocGhost',
    spriteSheets: {
      idle: {
        spriteKey: 'idocGhost',
        file: 'assets/enemies/idoc-ghost.png',
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 4
      },
      hit: {
        spriteKey: 'idocGhost_hit_sheet',
        file: 'assets/enemies/idoc-ghost_hit.png',
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 2
      },
      death: {
        spriteKey: 'idocGhost_death_sheet',
        file: 'assets/enemies/idoc-ghost_death.png',
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 4
      }
    },
    anim: {
      idle: 'idocGhost_idle',
      hit: 'idocGhost_hit',
      death: 'idocGhost_death'
    }
  },

  TRANSPORT_FREEZE_BLOB: {
    id: 'TRANSPORT_FREEZE_BLOB',
    displayName: 'Transport Freeze Blob',
    description: 'Frozen blob blocking change transports.',
    color: '#66b2ff',
    tier: 2,
    maxHp: 4,
    baseSpeed: 70,
    speedVariance: 0.15,
    movementPattern: 'sine',
    scoreValue: 130,
    width: 26,
    height: 24,
    onReachBottomEffect: 'transportBlock',
    spriteKey: 'freezeBlob',
    spriteSheets: {
      idle: {
        spriteKey: 'freezeBlob',
        file: 'assets/enemies/transport-freeze-blob.png',
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 4
      },
      hit: {
        spriteKey: 'freezeBlob_hit_sheet',
        file: 'assets/enemies/transport-freeze-blob_hit.png',
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 2
      },
      death: {
        spriteKey: 'freezeBlob_death_sheet',
        file: 'assets/enemies/transport-freeze-blob_death.png',
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 4
      }
    },
    anim: {
      idle: 'freezeBlob_idle',
      hit: 'freezeBlob_hit',
      death: 'freezeBlob_death'
    }
  },

  PERFORMANCE_DUMP_CLOUD: {
    id: 'PERFORMANCE_DUMP_CLOUD',
    displayName: 'Performance Dump Cloud',
    description: 'Dangerous dump cloud slowing everything down.',
    color: '#ffcc66',
    tier: 2,
    maxHp: 5,
    baseSpeed: 75,
    speedVariance: 0.15,
    movementPattern: 'straight',
    scoreValue: 180,
    width: 28,
    height: 24,
    onReachBottomEffect: 'perfPenalty',
    spriteKey: 'dumpCloud',
    spriteSheets: {
      idle: {
        spriteKey: 'dumpCloud',
        file: 'assets/enemies/performance-dump-cloud.png',
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 4
      },
      hit: {
        spriteKey: 'dumpCloud_hit_sheet',
        file: 'assets/enemies/performance-dump-cloud_hit.png',
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 2
      },
      death: {
        spriteKey: 'dumpCloud_death_sheet',
        file: 'assets/enemies/performance-dump-cloud_death.png',
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 4
      }
    },
    anim: {
      idle: 'dumpCloud_idle',
      hit: 'dumpCloud_hit',
      death: 'dumpCloud_death'
    }
  },

  TASK_OVERLOAD_SWARM: {
    id: 'TASK_OVERLOAD_SWARM',
    displayName: 'Task Overload Swarm',
    description: 'Swarm of tiny tasks overwhelming everyone.',
    color: '#ffd700',
    tier: 1,
    maxHp: 3,
    baseSpeed: 100,
    speedVariance: 0.1,
    movementPattern: 'zigzag',
    scoreValue: 90,
    width: 22,  
    height: 18,
    onReachBottomEffect: 'teamOverload',
    spriteKey: 'taskSwarm',
    spriteSheets: {
      idle: {
        spriteKey: 'taskSwarm',
        file: 'assets/enemies/task-overload-swarm.png',
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 4
      },
      hit: {
        spriteKey: 'taskSwarm_hit_sheet',
        file: 'assets/enemies/task-overload-swarm_hit.png',
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 2
      },
      death: {
        spriteKey: 'taskSwarm_death_sheet',
        file: 'assets/enemies/task-overload-swarm_death.png',
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 4
      }
    },
    anim: {
      idle: 'taskSwarm_idle',
      hit: 'taskSwarm_hit',
      death: 'taskSwarm_death'
    }
  }
};
