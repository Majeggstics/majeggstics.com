import { Icon } from '/components/Icon';

// This whole object must be prettier-ignored to preserve its tabular shape, so be
// careful with your hand-formatting in there.
//
// This file should _not_ include any boosts: those go in src/components/Boosts.tsx.
//
// prettier-ignore
export const Icons = {
	Anygrade: () => <Icon gameResource="contract/contract_grade_any" title="Any grade"          />,
	Ultra:    () => <Icon gameResource="contract/Ultra_Subscription" title="Ultra Subscription" />,
	Token:    () => <Icon gameResource="contract/B_token"            title="Token"              />,
	OldToken: () => <Icon gameResource="contract/B_token-OLD"        title="OldToken"           />,

	Maj:         () => <Icon gameResource="other/maj"             title="The Majeggstics" />,
	FastRun:     () => <Icon gameResource="other/racecar"         title="Fast Runs"       />,
	SpeedRun:    () => <Icon gameResource="other/rocket"          title="Speed Runs"      />,
    ProphecyEgg: () => <Icon gameResource="other/Egg_of_Prophecy" title="Egg of Prophecy" />,
};
