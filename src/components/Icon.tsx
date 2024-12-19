export const Icon = ({
	gameResource,
	title,
}: {
	readonly gameResource: string;
	readonly title: string;
}): React.ReactNode => (
	<img
		src={`/images/gameResources/${gameResource.replace(/^\/|\.png$/g, '')}.png`}
		title={title}
		className="icon"
	/>
);
