import type React from "react";
import { Fragment } from "react";
import { ArchiveBlock } from "@/blocks/ArchiveBlock/Component";
import { CallToActionBlock } from "@/blocks/CallToAction/Component";
import { ContentBlock } from "@/blocks/Content/Component";
import { CTASectionComponent } from "@/blocks/CTASection/Component";
import { DashboardStatsComponent } from "@/blocks/DashboardStats/Component";
import { FacultyShowcaseComponent } from "@/blocks/FacultyShowcase/Component";
import { FeaturesComponent } from "@/blocks/Features/Component";
import { FeaturesGridComponent } from "@/blocks/FeaturesGrid/Component";
import { FormBlock } from "@/blocks/Form/Component";
import { MediaBlock } from "@/blocks/MediaBlock/Component";
import { NewsEventsComponent } from "@/blocks/NewsEvents/Component";
import { ProgramsShowcaseComponent } from "@/blocks/ProgramsShowcase/Component";
import { RegistrationFormComponent } from "@/blocks/RegistrationForm/Component";
import { TestimonialsComponent } from "@/blocks/Testimonials/Component";
import { UniversityHeroComponent } from "@/blocks/UniversityHero/Component";
import type { Page } from "@/payload-types";

const blockComponents = {
	archive: ArchiveBlock,
	content: ContentBlock,
	cta: CallToActionBlock,
	ctaSection: CTASectionComponent,
	formBlock: FormBlock,
	mediaBlock: MediaBlock,
	"university-hero": UniversityHeroComponent,
	"programs-showcase": ProgramsShowcaseComponent,
	"registration-form": RegistrationFormComponent,
	"dashboard-stats": DashboardStatsComponent,
	"news-events": NewsEventsComponent,
	"faculty-showcase": FacultyShowcaseComponent,
	features: FeaturesComponent,
	featuresGrid: FeaturesGridComponent,
	testimonials: TestimonialsComponent,
};

export const RenderBlocks: React.FC<{
	blocks: Page["layout"][0][];
}> = (props) => {
	const { blocks } = props;

	const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0;

	if (hasBlocks) {
		return (
			<Fragment>
				{blocks.map((block, index) => {
					const { blockType } = block;

					if (blockType && blockType in blockComponents) {
						const Block = blockComponents[blockType];

						if (Block) {
							return (
								<div className="my-16" key={block.id || index}>
									{/* @ts-expect-error there may be some mismatch between the expected types here */}
									<Block {...block} disableInnerContainer />
								</div>
							);
						}
					}
					return null;
				})}
			</Fragment>
		);
	}

	return null;
};
