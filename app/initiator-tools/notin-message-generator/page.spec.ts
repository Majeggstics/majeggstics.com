import { expect } from 'chai';
import { Timeslot, parseNotInMessage } from './page';

describe('parseNotInMessage', () => {
	it('should parse an empty message', () => {
		const parsed = parseNotInMessage('');
		void expect(parsed).to.be.an('array').that.is.empty;
	});

	it('should parse one timeslot and one username', () => {
		const parsed = parseNotInMessage(`
			Timeslot :one::
			<:grade_aaa:> [foo](<link>) ([thread](<link>)): <@1111> (\`foo\`)
			<:grade_aaa:111> [bar](<link>) ([thread](<link>)): <@2222> (\`bar\`)

			(no pings were sent)
		`);

		expect(parsed).to.have.deep.members([
			{
				timeslot: Timeslot.One,
				user: '<@1111> (`foo`)',
				threadUrl: 'link',
			},
			{
				timeslot: Timeslot.One,
				user: '<@2222> (`bar`)',
				threadUrl: 'link',
			},
		]);
	});

	it('should parse multiple timeslots and multiple usernames', () => {
		const parsed = parseNotInMessage(`
			Timeslot :one::
			<:grade_aaa:> [foo](<link>) ([thread](<link>)): <@11> (\`foo\`), <@22> (\`bar\`)

			Timeslot :two::
			<:grade_aaa:> [foo](<link>) ([thread](<link>)): <@33> (\`baz\`), <@44> (\`quux\`)

			(no pings were sent)
		`);
		expect(parsed).to.have.deep.members([
			{
				timeslot: Timeslot.One,
				user: '<@11> (`foo`)',
				threadUrl: 'link',
			},
			{
				timeslot: Timeslot.One,
				user: '<@22> (`bar`)',
				threadUrl: 'link',
			},
			{
				timeslot: Timeslot.Two,
				user: '<@33> (`baz`)',
				threadUrl: 'link',
			},
			{
				timeslot: Timeslot.Two,
				user: '<@44> (`quux`)',
				threadUrl: 'link',
			},
		]);
	});
});
