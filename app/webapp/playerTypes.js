window.PLAYER_TYPES = {
  PLAYER_1: {
    id: 'PLAYER_1',
    displayName: 'Blue Worker',
    description: 'Good Vibes Defender with blue energy pulse.',
    primaryColor: '#0FAAFF',
    spriteSheets: {
      idle: {
        spriteKey: 'player1_idle',
        file: 'assets/players/player1_idle.png',
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 4,
        animKey: 'player1_idle_anim',
        frameRate: 6,
        repeat: -1
      },
      walkLeft: {
        spriteKey: 'player1_walk_left',
        file: 'assets/players/player1_walk_left.png',
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 4,
        animKey: 'player1_walk_left_anim',
        frameRate: 8,
        repeat: -1
      },
      walkRight: {
        spriteKey: 'player1_walk_right',
        file: 'assets/players/player1_walk_right.png',
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 4,
        animKey: 'player1_walk_right_anim',
        frameRate: 8,
        repeat: -1
      },
      shoot: {
        spriteKey: 'player1_shoot',
        file: 'assets/players/player1_shoot.png',
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 4,
        animKey: 'player1_shoot_anim',
        frameRate: 10,
        repeat: 0
      },
      hit: {
        spriteKey: 'player1_hit',
        file: 'assets/players/player1_hit.png',
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 2,
        animKey: 'player1_hit_anim',
        frameRate: 8,
        repeat: 0
      },
      defeat: {
        spriteKey: 'player1_defeat',
        file: 'assets/players/player1_defeat.png',
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 3,
        animKey: 'player1_defeat_anim',
        frameRate: 6,
        repeat: 0
      }
    },
    projectile: {
      spriteKey: 'projectile_player1',
      file: 'assets/projectiles/projectile_player1.png',
      frameWidth: 32,
      frameHeight: 32,
      frameCount: 4,
      animKey: 'projectile_player1_anim',
      frameRate: 12,
      repeat: -1
    }
  },

  PLAYER_2: {
    id: 'PLAYER_2',
    displayName: 'Green Worker',
    description: 'Wellbeing guardian with healing beam.',
    primaryColor: '#00CC66',
    spriteSheets: {
      idle: {
        spriteKey: 'player2_idle',
        file: 'assets/players/player2_idle.png',
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 4,
        animKey: 'player2_idle_anim',
        frameRate: 6,
        repeat: -1
      },
      walkLeft: {
        spriteKey: 'player2_walk_left',
        file: 'assets/players/player2_walk_left.png',
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 4,
        animKey: 'player2_walk_left_anim',
        frameRate: 8,
        repeat: -1
      },
      walkRight: {
        spriteKey: 'player2_walk_right',
        file: 'assets/players/player2_walk_right.png',
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 4,
        animKey: 'player2_walk_right_anim',
        frameRate: 8,
        repeat: -1
      },
      shoot: {
        spriteKey: 'player2_shoot',
        file: 'assets/players/player2_shoot.png',
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 4,
        animKey: 'player2_shoot_anim',
        frameRate: 10,
        repeat: 0
      },
      hit: {
        spriteKey: 'player2_hit',
        file: 'assets/players/player2_hit.png',
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 2,
        animKey: 'player2_hit_anim',
        frameRate: 8,
        repeat: 0
      },
      defeat: {
        spriteKey: 'player2_defeat',
        file: 'assets/players/player2_defeat.png',
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 3,
        animKey: 'player2_defeat_anim',
        frameRate: 6,
        repeat: 0
      }
    },
    projectile: {
      spriteKey: 'projectile_player2',
      file: 'assets/projectiles/projectile_player2.png',
      frameWidth: 32,
      frameHeight: 32,
      frameCount: 4,
      animKey: 'projectile_player2_anim',
      frameRate: 12,
      repeat: -1
    }
  },

  PLAYER_3: {
    id: 'PLAYER_3',
    displayName: 'Yellow Worker',
    description: 'Cheerful defender with golden star shots.',
    primaryColor: '#FFDD33',
    spriteSheets: {
      idle: {
        spriteKey: 'player3_idle',
        file: 'assets/players/player3_idle.png',
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 4,
        animKey: 'player3_idle_anim',
        frameRate: 6,
        repeat: -1
      },
      walkLeft: {
        spriteKey: 'player3_walk_left',
        file: 'assets/players/player3_walk_left.png',
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 4,
        animKey: 'player3_walk_left_anim',
        frameRate: 8,
        repeat: -1
      },
      walkRight: {
        spriteKey: 'player3_walk_right',
        file: 'assets/players/player3_walk_right.png',
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 4,
        animKey: 'player3_walk_right_anim',
        frameRate: 8,
        repeat: -1
      },
      shoot: {
        spriteKey: 'player3_shoot',
        file: 'assets/players/player3_shoot.png',
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 4,
        animKey: 'player3_shoot_anim',
        frameRate: 10,
        repeat: 0
      },
      hit: {
        spriteKey: 'player3_hit',
        file: 'assets/players/player3_hit.png',
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 2,
        animKey: 'player3_hit_anim',
        frameRate: 8,
        repeat: 0
      },
      defeat: {
        spriteKey: 'player3_defeat',
        file: 'assets/players/player3_defeat.png',
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 3,
        animKey: 'player3_defeat_anim',
        frameRate: 6,
        repeat: 0
      }
    },
    projectile: {
      spriteKey: 'projectile_player3',
      file: 'assets/projectiles/projectile_player3.png',
      frameWidth: 32,
      frameHeight: 32,
      frameCount: 4,
      animKey: 'projectile_player3_anim',
      frameRate: 12,
      repeat: -1
    }
  },

  PLAYER_4: {
    id: 'PLAYER_4',
    displayName: 'Red Worker',
    description: 'Passionate teammate firing heart bursts.',
    primaryColor: '#FF4444',
    spriteSheets: {
      idle: {
        spriteKey: 'player4_idle',
        file: 'assets/players/player4_idle.png',
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 4,
        animKey: 'player4_idle_anim',
        frameRate: 6,
        repeat: -1
      },
      walkLeft: {
        spriteKey: 'player4_walk_left',
        file: 'assets/players/player4_walk_left.png',
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 4,
        animKey: 'player4_walk_left_anim',
        frameRate: 8,
        repeat: -1
      },
      walkRight: {
        spriteKey: 'player4_walk_right',
        file: 'assets/players/player4_walk_right.png',
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 4,
        animKey: 'player4_walk_right_anim',
        frameRate: 8,
        repeat: -1
      },
      shoot: {
        spriteKey: 'player4_shoot',
        file: 'assets/players/player4_shoot.png',
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 4,
        animKey: 'player4_shoot_anim',
        frameRate: 10,
        repeat: 0
      },
      hit: {
        spriteKey: 'player4_hit',
        file: 'assets/players/player4_hit.png',
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 2,
        animKey: 'player4_hit_anim',
        frameRate: 8,
        repeat: 0
      },
      defeat: {
        spriteKey: 'player4_defeat',
        file: 'assets/players/player4_defeat.png',
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 3,
        animKey: 'player4_defeat_anim',
        frameRate: 6,
        repeat: 0
      }
    },
    projectile: {
      spriteKey: 'projectile_player4',
      file: 'assets/projectiles/projectile_player4.png',
      frameWidth: 32,
      frameHeight: 32,
      frameCount: 4,
      animKey: 'projectile_player4_anim',
      frameRate: 12,
      repeat: -1
    }
  },

  PLAYER_5: {
    id: 'PLAYER_5',
    displayName: 'Purple Worker',
    description: 'Focused mind with brainwave bolts.',
    primaryColor: '#AA66FF',
    spriteSheets: {
      idle: {
        spriteKey: 'player5_idle',
        file: 'assets/players/player5_idle.png',
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 4,
        animKey: 'player5_idle_anim',
        frameRate: 6,
        repeat: -1
      },
      walkLeft: {
        spriteKey: 'player5_walk_left',
        file: 'assets/players/player5_walk_left.png',
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 4,
        animKey: 'player5_walk_left_anim',
        frameRate: 8,
        repeat: -1
      },
      walkRight: {
        spriteKey: 'player5_walk_right',
        file: 'assets/players/player5_walk_right.png',
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 4,
        animKey: 'player5_walk_right_anim',
        frameRate: 8,
        repeat: -1
      },
      shoot: {
        spriteKey: 'player5_shoot',
        file: 'assets/players/player5_shoot.png',
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 4,
        animKey: 'player5_shoot_anim',
        frameRate: 10,
        repeat: 0
      },
      hit: {
        spriteKey: 'player5_hit',
        file: 'assets/players/player5_hit.png',
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 2,
        animKey: 'player5_hit_anim',
        frameRate: 8,
        repeat: 0
      },
      defeat: {
        spriteKey: 'player5_defeat',
        file: 'assets/players/player5_defeat.png',
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 3,
        animKey: 'player5_defeat_anim',
        frameRate: 6,
        repeat: 0
      }
    },
    projectile: {
      spriteKey: 'projectile_player5',
      file: 'assets/projectiles/projectile_player5.png',
      frameWidth: 32,
      frameHeight: 32,
      frameCount: 4,
      animKey: 'projectile_player5_anim',
      frameRate: 12,
      repeat: -1
    }
  }
}