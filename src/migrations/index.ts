import * as migration_20251009_155501_initial from './20251009_155501_initial';
import * as migration_20251021_085919 from './20251021_085919';

export const migrations = [
  {
    up: migration_20251009_155501_initial.up,
    down: migration_20251009_155501_initial.down,
    name: '20251009_155501_initial',
  },
  {
    up: migration_20251021_085919.up,
    down: migration_20251021_085919.down,
    name: '20251021_085919'
  },
];
