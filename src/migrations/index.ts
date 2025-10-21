import * as migration_20251009_155501_initial from './20251009_155501_initial';
import * as migration_20251021_091600_fix_users_role from './20251021_091600_fix_users_role';
import * as migration_20251021_092647_campusnet_full_schema from './20251021_092647_campusnet_full_schema';

export const migrations = [
  {
    up: migration_20251009_155501_initial.up,
    down: migration_20251009_155501_initial.down,
    name: '20251009_155501_initial',
  },
  {
    up: migration_20251021_091600_fix_users_role.up,
    down: migration_20251021_091600_fix_users_role.down,
    name: '20251021_091600_fix_users_role',
  },
  {
    up: migration_20251021_092647_campusnet_full_schema.up,
    down: migration_20251021_092647_campusnet_full_schema.down,
    name: '20251021_092647_campusnet_full_schema'
  },
];
