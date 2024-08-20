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

  const timeslotHeaderMap = {
    "+1": "Timeslot 1",
    "+6": "Timeslot 2",
    "+12": "Timeslot 3",
  };

  const parseInput = (input) => {
    const timeslotRegex = /Timeslot\s:([a-z]+)::\n((?:.|\n)+?)(?=(Timeslot\s:[a-z]+::|\(no pings were sent\)|$))/g;
    const matches = [...input.matchAll(timeslotRegex)];
    const timeslotGroups = matches.reduce((acc, match) => {
      const emoji = `:${match[1]}:`;
      const timeslot = timeslotMap[emoji] || "";
      const content = match[2].trim().split('\n')
        .map(line => {
          // Extract thread URL and username
          const threadMatch = line.match(/\[thread\]\(<([^>]+)>\)/);
          const userMatch = line.match(/<@(\d+)> \(([^)]+)\)/);
          if (userMatch) {
            return {
              user: userMatch[2].trim(),
              threadUrl: threadMatch ? convertToDiscordUrl(threadMatch[1].trim()) : null
            };
          }
          return null;
        })
        .filter(entry => entry !== null);

      if (timeslot) {
        acc[timeslot] = (acc[timeslot] || []).concat(content);
      }
      return acc;
    }, {});
    return timeslotGroups;
  };

  const convertToDiscordUrl = (url) => {
    const match = url.match(/discord.com\/channels\/(\d+)\/(\d+)/);
    if (match) {
      const [_, channelId, messageId] = match;
      const discordUrl = `discord://-/channels/${channelId}/${messageId}`;
      return discordUrl;
    }
    return url;
  };

  const generateOutput = () => {
    const timeslotGroups = parseInput(notInMessage);
    const outputElements = [];

    Object.entries(timeslotGroups).forEach(([timeslot, users], timeslotIndex) => {
      const hourMap = { "+1": 18, "+6": 23, "+12": 5 };
      const hour = hourMap[timeslot];
      const date = moment().tz("America/Toronto").hour(hour).minute(0).second(0);
      const now = date.unix();
      const discordTimestamp = `<t:${now}:t>`;

      // Add a smaller header for each timeslot
      const timeslotHeader = timeslotHeaderMap[timeslot] || `Timeslot ${timeslot}`;

      outputElements.push(
        <Fragment key={`header-${timeslotIndex}`}>
          <h4>{timeslotHeader}</h4> {/* Changed to h4 for smaller header */}
        </Fragment>
      );

      users.forEach((userEntry, userIndex) => {
        const { user, threadUrl } = userEntry;
        const textToBeCopied = `${user}. Courtesy reminder to join your coop ASAP! You will receive a strike if you don’t join by ${timeslot} (${discordTimestamp} in your time zone).`;
        const isCopied = copiedElements[timeslotIndex] && copiedElements[timeslotIndex][userIndex];

        outputElements.push(
          <Fragment key={`${timeslot}-${userIndex}`}>
            <p>
              {threadUrl && <a href={threadUrl} target="_blank" rel="noopener noreferrer">[Thread]</a>}
              {isCopied ? ' ✅ ' : ' ❌ '}
              {textToBeCopied}
            </p>
            <button onClick={() => copyToClipboard(textToBeCopied, timeslotIndex, userIndex)}>Copy to Clipboard</button>
          </Fragment>
        );
      });
    });

    return outputElements;
  };

  const [copiedElements, setCopiedElements] = useState<{[key: number]: {[key: number]: boolean}}>({});

  const copyToClipboard = (text, timeslotIndex, userIndex) => {
    const copyResult = copy(text);

    if (copyResult) {
      notify('Message copied');

      setCopiedElements((prev) => ({
        ...prev,
        [timeslotIndex]: {
          ...prev[timeslotIndex],
          [userIndex]: true,
        },
      }));
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
