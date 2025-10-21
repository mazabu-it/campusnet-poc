import * as migration_20250121_120000_make_professors_optional from "./20250121_120000_make_professors_optional";
import * as migration_20251009_155501_initial from "./20251009_155501_initial";
import * as migration_20251021_091600_fix_users_role from "./20251021_091600_fix_users_role";
import * as migration_20251021_092647_campusnet_full_schema from "./20251021_092647_campusnet_full_schema";
import * as migration_20251021_093930_fix_payload_rels from "./20251021_093930_fix_payload_rels";

export const migrations = [
	{
		up: migration_20251009_155501_initial.up,
		down: migration_20251009_155501_initial.down,
		name: "20251009_155501_initial",
	},
	{
		up: migration_20251021_091600_fix_users_role.up,
		down: migration_20251021_091600_fix_users_role.down,
		name: "20251021_091600_fix_users_role",
	},
	{
		up: migration_20251021_092647_campusnet_full_schema.up,
		down: migration_20251021_092647_campusnet_full_schema.down,
		name: "20251021_092647_campusnet_full_schema",
	},
	{
		up: migration_20251021_093930_fix_payload_rels.up,
		down: migration_20251021_093930_fix_payload_rels.down,
		name: "20251021_093930_fix_payload_rels",
	},
	{
		up: migration_20250121_120000_make_professors_optional.up,
		down: migration_20250121_120000_make_professors_optional.down,
		name: "20250121_120000_make_professors_optional",
	},
];
