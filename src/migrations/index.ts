import * as migration_20250121_140000_production_complete_schema from "./20250121_140000_production_complete_schema";

export const migrations = [
	{
		up: migration_20250121_140000_production_complete_schema.up,
		down: migration_20250121_140000_production_complete_schema.down,
		name: "20250121_140000_production_complete_schema",
	},
];
