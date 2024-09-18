'use client';

import copy from 'copy-to-clipboard';
import { Fragment, useState } from 'react';
import { CustomSelectInput } from '@/components/CustomInput';
import ToastMessage, { notify } from '@/components/ToastMessage';

export default function NotInFailsGeneratorPage() {
  const [notInMessage, setNotInMessage] = useState('');
  const [nitroMode, setNitroMode] = useState(false);

  const contractEggRegex = /Not in\s<(:[^:]+:)\d+>/;
  const contractEggMatch = contractEggRegex.exec(notInMessage);
  const contractEgg = contractEggMatch ? contractEggMatch[1].trim() : '';

  const contractNameRegex = /Not in\s<:[^:]+:\d+> \*\*(.+?)\*\*/;
  const contractNameMatch = contractNameRegex.exec(notInMessage);
  const contractName = contractNameMatch ? contractNameMatch[1].trim() : '';

  const contract = `${nitroMode ? contractEgg : ''} ${contractName}`.trim();

  const timeslotMap: Record<string, string> = {
    ':one:': '+1',
    ':two:': '+6',
    ':three:': '+12',
  };

  const parseInput = (input: string) => {
    const timeslotRegex = /Timeslot\s:([a-z]+)::\n((?:.|\n)+?)(?=(Timeslot\s:[a-z]+::|\(no pings were sent\)|$))/g;
    const matches = [...input.matchAll(timeslotRegex)];
    return matches.reduce<Record<string, string[]>>((acc, match) => {
      const emoji = `:${match[1]}:`;
      const timeslot = timeslotMap[emoji] || '';
      const content = match[2]
        .trim()
        .split('\n')
        .flatMap((elem) => elem.split(','))
        .map((elem) => elem.slice(elem.indexOf('`') + 1, elem.lastIndexOf('`')));

      if (timeslot) {
        acc[timeslot] = (acc[timeslot] || ([] as string[])).concat(content);
      }

      return acc;
    }, {});
  };

  const generateOutput = () => {
    const timeslotGroups = parseInput(notInMessage);
    return Object.entries(timeslotGroups)
      .map(([timeslot, farmers]) => {
        return `## ${contract} ${timeslot} notins\n${farmers.map((elem) => `${elem}, failure to join after 5 hours`).join('\n')}`;
      })
      .join('\n\n');
  };

  const failsOutput = generateOutput();

  return (
    <div style={{ margin: '2rem 1rem' }}>
      <ToastMessage />
      <h1>NotIn Fails Generator</h1>

      <p style={{ display: 'flex', flexDirection: 'column' }}>
        <label htmlFor="#notInMessage">Not in message from Wonky</label>
        <textarea
          name="notInMessage"
          id="notInMessage"
          value={notInMessage}
          onChange={(event) => setNotInMessage(event.target.value)}
          style={{ margin: '1rem 0' }}
          rows={10}
        />
      </p>

      <p style={{ display: 'flex', flexDirection: 'column', rowGap: '1rem' }}>
        <button onClick={() => setNitroMode(!nitroMode)} style={{ width: 'fit-content' }}>
          {nitroMode ? 'Nitro mode ON 🚀' : 'Nitro mode (include egg emoji in output)'}
        </button>

        <textarea name="failsOutput" id="failsOutput" value={failsOutput} rows={10} disabled />
        <Fragment>
          <button
            onClick={() => {
              const copyResult = copy(failsOutput);

              if (copyResult) {
                notify('Message copied');
              }
            }}
            style={{ width: 'fit-content' }}
          >
            Copy to Clipboard
          </button>
        </Fragment>
      </p>
    </div>
  );
}
