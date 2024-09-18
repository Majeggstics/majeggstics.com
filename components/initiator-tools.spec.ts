import { expect } from 'chai';
import { Timeslot, parseNotInMessage } from './initiator-tools';

describe('parseNotInMessage', () => {
	it('should parse an empty message', () => {
		const parsed = parseNotInMessage('');
		void expect(parsed).to.be.an('object').that.is.empty;
	});

	it('should parse one timeslot and one username', () => {
		const parsed = parseNotInMessage(`
			Timeslot :one::
			<:grade_aaa:> [foo](<link>) ([thread](<link>)): <@1111> (\`foo\`)
			<:grade_aaa:111> [bar](<link>) ([thread](<link>)): <@2222> (\`bar\`)

			(no pings were sent)
		`);

		expect(parsed).to.have.key(':one:');
		expect(parsed[':one:'])
			.to.deep.include({
				user: '<@1111> (`foo`)',
				threadUrl: 'link',
			})
			.and.to.deep.include({
				user: '<@2222> (`bar`)',
				threadUrl: 'link',
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
		expect(parsed[':one:'])
			.to.deep.include({
				user: '<@11> (`foo`)',
				threadUrl: 'link',
			})
			.and.to.deep.include({
				user: '<@22> (`bar`)',
				threadUrl: 'link',
			});
		expect(parsed[':two:'])
			.to.deep.include({
				user: '<@33> (`baz`)',
				threadUrl: 'link',
			})
			.and.to.include({
				user: '<@44> (`quux`)',
				threadUrl: 'link',
			});
	});
});
