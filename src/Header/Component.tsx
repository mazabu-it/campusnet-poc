import type { Header } from "@/payload-types";
import { getCachedGlobal } from "@/utilities/getGlobals";
import { HeaderClient } from "./Component.client";

export async function HeaderComponent() {
	const headerData: Header = await getCachedGlobal("header", 1)();

	return <HeaderClient data={headerData} />;
}
