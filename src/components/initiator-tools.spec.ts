import * as chai from 'chai';
import { stripIndent } from 'common-tags';
import { Timeslot, parseNotInMessage, parseMinsMessage } from './initiator-tools';

chai.config.truncateThreshold = 0;

const expect = chai.expect;

describe('Timeslot#fromWonkyMessage', () => {
	it('should parse from a min-fails message', () => {
		const timeslot = Timeslot.fromWonkyMessage(stripIndent`
			## Minimum check for :egg_unknown: Contract Name
			### Formula \`Majeggstics 24h\`, Timeslot :one:
		`);

		expect(timeslot?.index).to.equal(0);
	});

	it('should parse from notins message', () => {
		const timeslot = Timeslot.fromWonkyMessage(stripIndent`
			Not in <:egg:1> **Contract** <:egg:1> - \`contract-id\`:
			Timeslot :three::
			<:grade_aaa:1> [code](<carpet>) ([thread](<discord>)): <@11> (\`foo\`)

			(no pings were sent)
		`);

		expect(timeslot?.index).to.equal(2);
	});
});

describe('parseNotInMessage', () => {
	it('should parse an empty message', () => {
		const parsed = parseNotInMessage('');
		void expect(parsed).to.be.an('object').that.is.empty;
	});

	it('should parse one timeslot and no usernames', () => {
		const parsed = parseNotInMessage(stripIndent`
			Timeslot :three::

			(no pings were sent)
		`);
		expect(parsed).to.have.key(':three:');
		void expect(parsed[':three:']).to.be.an('array').that.is.empty;
	});

	it('should parse one timeslot and one username', () => {
		const parsed = parseNotInMessage(stripIndent`
			Timeslot :one::
			<:grade_aaa:> [foo](<link>) ([thread](<thread1>)): <@1111> (\`foo\`)
			<:grade_aaa:111> [bar](<link>) ([thread](<thread2>)): <@2222> (\`bar\`)

			(no pings were sent)
		`);

		expect(parsed).to.have.key(':one:');
		expect(parsed[':one:'])
			.to.deep.include({
				users: [{ discordId: '1111', ign: 'foo', combinedIdentifier: '<@1111> (`foo`)' }],
				threadUrl: 'thread1',
			})
			.and.to.deep.include({
				users: [{ discordId: '2222', ign: 'bar', combinedIdentifier: '<@2222> (`bar`)' }],
				threadUrl: 'thread2',
			});
	});

	it('should parse multiple timeslots and multiple usernames', () => {
		const parsed = parseNotInMessage(stripIndent`
			Timeslot :one::
			<:grade_aaa:> [foo](<link>) ([thread](<link>)): <@11> (\`foo\`), <@22> (\`bar\`)

			Timeslot :two::
			<:grade_aaa:> [foo](<link>) ([thread](<link>)): <@33> (\`baz\`), <@44> (\`quux\`)

			(no pings were sent)
		`);
		expect(parsed).to.have.keys(':one:', ':two:');
		expect(parsed[':one:']).to.deep.include({
			users: [
				{ discordId: '11', ign: 'foo', combinedIdentifier: '<@11> (`foo`)' },
				{ discordId: '22', ign: 'bar', combinedIdentifier: '<@22> (`bar`)' },
			],
			threadUrl: 'link',
		});
		expect(parsed[':two:']).to.deep.include({
			users: [
				{ discordId: '33', ign: 'baz', combinedIdentifier: '<@33> (`baz`)' },
				{ discordId: '44', ign: 'quux', combinedIdentifier: '<@44> (`quux`)' },
			],
			threadUrl: 'link',
		});
	});

	it('parses from-timeslot players to their signup, not assignment', () => {
		const parsed = parseNotInMessage(stripIndent`
			Not in :egg_supermaterial: **Federal Reggserve** :egg_supermaterial: - \`federal-reggserve\`:

			Timeslot :one::
			<:grade_aaa:11> [coop1](<carpet>) ([thread](<coop1>)): <@11> (\`foo\`) (from timeslot 2)
			<:grade_aaa:11> [coop2](<carpet>) ([thread](<coop2>)): <@22> (\`bar\`)

			Timeslot :two::
			<:grade_aaa:11> [coop3](<carpet>) ([thread](<coop3>)): <@33> (\`baz\`)

			(no pings were sent)
		`);
		const userFoo = { discordId: '11', ign: 'foo', combinedIdentifier: '<@11> (`foo`)' };
		expect(parsed).to.have.keys(':one:', ':two:');
		expect(parsed[':one:']).not.to.deep.include({
			users: [userFoo],
			threadUrl: 'coop1',
		});
		expect(parsed[':two:']).to.deep.include({
			users: [userFoo],
			threadUrl: 'coop1',
		});
	});
});

describe('parseMinsMessage', () => {
	it('parses an empty message', () => {
		const parsed = parseMinsMessage('');
		expect(parsed).to.deep.equal({
			inDanger: [],
			minFails: [],
			notins: [],
		});
	});

	it('parses a coop in danger', () => {
		const parsed = parseMinsMessage(stripIndent`
			## Minimum check for <:egg_edible:11> Contract Name Here
			### Formula \`Majeggstics 24h\`, Timeslot :one:
			<:grade_aaa:11> [**\`coop1\`**](<link>) <:warning:11> ([**thread**](<link>))
		`);

		expect(parsed.inDanger).to.have.length(1);
		expect(parsed.inDanger[0]).to.include('coop1');
		expect(parsed.minFails).to.deep.equal([]);
		expect(parsed.notins).to.deep.equal([]);
	});

	it('parses a non-scrolled min fail', () => {
		const parsed = parseMinsMessage(stripIndent`
			## Minimum check for <:egg_edible:11> Contract Name Here
			### Formula \`Majeggstics 24h\`, Timeslot :one:
			<:grade_aaa:11> [**\`coop1\`**](<link>) ([**thread**](<link>))
			* \`ign\` (@ user) (X1): \`0\`/\`2.53q\` (\`0%\`). Spent 1 <:b_icon_token:11>, <:clock:11> 7h42m
		`);

		expect(parsed.inDanger).to.deep.equal([]);
		expect(parsed.minFails).to.have.length(1);
		expect(parsed.minFails[0]).to.include('ign');
		expect(parsed.notins).to.deep.equal([]);
	});

	it('parses a min-fail with a short offline time', () => {
		const parsed = parseMinsMessage(stripIndent`
			## Minimum check for <:egg_edible:11> Contract Name Here
			### Formula \`Majeggstics 24h\`, Timeslot :one:
			<:grade_aaa:11> [**\`coop1\`**](<link>) ([**thread**](<link>))
			* \`ign\` (@ user) (X1): \`0\`/\`2.53q\` (\`0%\`). Spent 1 <:b_icon_token:11>, <:clock:11> 1m
		`);

		expect(parsed.inDanger).to.deep.equal([]);
		expect(parsed.minFails).to.have.length(1);
		expect(parsed.minFails[0]).to.include('ign');
		expect(parsed.notins).to.deep.equal([]);
	});

	it('parses a min-fail with no offline time', () => {
		const parsed = parseMinsMessage(stripIndent`
			## Minimum check for <:egg_edible:11> Contract Name Here
			### Formula \`Majeggstics 24h\`, Timeslot :one:
			<:grade_aaa:11> [**\`coop1\`**](<link>) ([**thread**](<link>))
			* \`ign\` (@ user) (X1): \`0\`/\`2.53q\` (\`0%\`). Spent 1 <:b_icon_token:11>
		`);

		expect(parsed.inDanger).to.deep.equal([]);
		expect(parsed.minFails).to.have.length(1);
		expect(parsed.minFails[0]).to.include('ign');
		expect(parsed.notins).to.deep.equal([]);
	});

	it('parses a scrolled min fail', () => {
		const parsed = parseMinsMessage(stripIndent`
			## Minimum check for <:egg_edible:11> Contract Name Here
			### Formula \`Majeggstics 24h\`, Timeslot :one:
			<:grade_aaa:11> [**\`coop4\`**](<link>) <:green_scroll:11> ([**thread**](<link>))
			* \`ign\` (@ user) (X1): \`0\`/\`2.53q\` (\`0%\`). Spent 1 <:b_icon_token:11>, <:clock:11> 7h42m
		`);

		expect(parsed.inDanger).to.deep.equal([]);
		expect(parsed.minFails).to.have.length(0);
		expect(parsed.notins).to.deep.equal([]);
	});

	it('parses a non-scrolled notin', () => {
		const parsed = parseMinsMessage(stripIndent`
			## Minimum check for <:egg_edible:11> Contract Name Here
			### Formula \`Majeggstics 24h\`, Timeslot :one:
			<:grade_aaa:11> [**\`coop1\`**](<link>) ([**thread**](<link>))
			* Missing Egger is missing.
		`);

		expect(parsed.inDanger).to.deep.equal([]);
		expect(parsed.minFails).to.deep.equal([]);
		expect(parsed.notins).to.have.length(1);
		expect(parsed.notins[0]).to.include('Missing Egger');
	});

	it('parses a scrolled notin', () => {
		const parsed = parseMinsMessage(stripIndent`
			## Minimum check for <:egg_edible:11> Contract Name Here
			### Formula \`Majeggstics 24h\`, Timeslot :one:
			<:grade_aaa:11> [**\`coop1\`**](<link>) <:green_scroll:11> ([**thread**](<link>))
			* Missing Egger is missing.
		`);

		expect(parsed.inDanger).to.deep.equal([]);
		expect(parsed.minFails).to.deep.equal([]);
		expect(parsed.notins).to.deep.equal([]);
	});

	it('parses a message with all of those', () => {
		const parsed = parseMinsMessage(stripIndent`
			## Minimum check for <:egg_edible:11> Contract Name Here
			### Formula \`Majeggstics 24h\`, Timeslot :one:
			<:grade_aaa:11> [**\`no-scroll min fail\`**](<link>) ([**thread**](<link>))
			* \`ign1\` (@ user1) (X1): \`0\`/\`2.53q\` (\`0%\`). Spent 1 <:b_icon_token:11>, <:clock:11> 7h42m

			<:grade_aaa:11> [**\`scroll min fail\`**](<link>) <:green_scroll:11> ([**thread**](<link>))
			* \`ign2\` (@ user2) (X1): \`0\`/\`2.53q\` (\`0%\`). Spent 1 <:b_icon_token:11>

			<:grade_aaa:11> [**\`in danger and notin\`**](<link>) <:warning:11> ([**thread**](<link>))
			* Missing Egger is missing.
			* Gone Gamer is missing.

			<:grade_aaa:11> [**\`scroll not in\`**](<link>) <:green_scroll:11> ([**thread**](<link>))
			* Missing Egger's Alt is missing.
		 `);

		expect(parsed.inDanger).to.have.length(1);
		expect(parsed.inDanger[0]).to.include('in danger and notin');
		expect(parsed.minFails).to.have.length(1);
		expect(parsed.minFails[0]).to.include('ign1');
		expect(parsed.notins).to.have.length(2);
		expect(parsed.notins).to.include.members([
			'* Missing Egger is missing.',
			'* Gone Gamer is missing.',
		]);
	});
});
