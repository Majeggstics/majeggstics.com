"use client";

import { Fragment, useState } from 'react';
import moment from 'moment-timezone';
import copy from 'copy-to-clipboard';

import ToastMessage, { notify } from '@/components/ToastMessage';

export default function NotInMessageGeneratorPage() {
  const [notInMessage, setNotInMessage] = useState('');

  const timeslotMap = {
    ":one:": "+1",
    ":two:": "+6",
    ":three:": "+12",
  };

  const parseInput = (input) => {
    const timeslotRegex = /Timeslot\s:([a-z]+)::\n((?:.|\n)+?)(?=(Timeslot\s:[a-z]+::|\(no pings were sent\)|$))/g;
    const matches = [...input.matchAll(timeslotRegex)];
    const timeslotGroups = matches.reduce((acc, match) => {
      const emoji = `:${match[1]}:`;
      const timeslot = timeslotMap[emoji] || "";
      const content = match[2].trim().split('\n')
        .map(line => {
          const userMatch = line.match(/<@(\d+)> \(`([^`]+)`\)/);
          return userMatch ? userMatch[2].trim() : null;
        })
        .filter(user => user !== null);

      if (timeslot) {
        acc[timeslot] = (acc[timeslot] || []).concat(content);
      }
      return acc;
    }, {});
    return timeslotGroups;
  };

  const generateOutput = () => {
    const timeslotGroups = parseInput(notInMessage);
    return Object.entries(timeslotGroups).map(([timeslot, users], timeslotIndex) => {
      const hour = 12 + parseInt(timeslot.substring(1)) + 5;
      const date = moment().tz("America/Toronto").hour(hour).minute(0).second(0);
      const now = date.unix();
      const discordTimestamp = `<t:${now}:t>`;

      return (
        <Fragment key={`timeslot-${timeslotIndex}`}>
          <h3>Timeslot {timeslot}</h3>
          {users.map((userElem, userIndex) => {
            const textToBeCopied = `${userElem}. Courtesy reminder to join your coop ASAP! You will receive a strike if you don’t join by ${timeslot} (${discordTimestamp} in your time zone).`;

            return (
              <Fragment key={`${timeslot}-${userIndex}`}>
                <p>{textToBeCopied}</p>
                <button onClick={() => copyToClipboard(textToBeCopied, userIndex)}>Copy to Clipboard</button>
              </Fragment>
            );
          })}
        </Fragment>
      );
    });
  };

  const [copiedElements, setCopiedElements] = useState<boolean[]>(Array(generateOutput().length).fill(false));

  const copyToClipboard = (text, index) => {
    const copyResult = copy(text);

    if (copyResult) {
      notify('Message copied');

      setCopiedElements((prev) => {
        const newCopiedElements = [...prev];
        newCopiedElements[index] = true;
        return newCopiedElements;
      });
    }
  };

  return (
    <div style={{ margin: '2rem 1rem' }}>
      <ToastMessage />
      <h1>NotIn Message Generator</h1>
      <p style={{ display: 'flex', flexDirection: 'column' }}>
        <label htmlFor="#notInMessage">Not in message from Wonky</label>
        <textarea
          name='notInMessage'
          id='notInMessage'
          value={notInMessage}
          onChange={(event) => setNotInMessage(event.target.value)}
          style={{ margin: '1rem 0' }}
          rows={10}
        />
      </p>

      {generateOutput()}
    </div>
  );
}
