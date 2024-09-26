import * as chai from 'chai';
import { Timeslot, parseNotInMessage } from './initiator-tools';

chai.config.truncateThreshold = 0;
const expect = chai.expect;

describe('Timeslot#fromWonkyMessage', () => {
	it('should parse from a min-fails message', () => {
		const timeslot = Timeslot.fromWonkyMessage(`
			## Minimum check for :egg_unknown: Contract Name
			### Formula \`Majeggstics 24h\`, Timeslot :one:
		`);

		expect(timeslot?.index).to.equal(0);
	});

	it('should parse from notins message', () => {
		const timeslot = Timeslot.fromWonkyMessage(`
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

	it('should parse one timeslot and one username', () => {
		const parsed = parseNotInMessage(`
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
		const parsed = parseNotInMessage(`
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
});
