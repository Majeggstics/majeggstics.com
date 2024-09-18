// Currently doesn't support Wonky's "(from timeslot xx)"
'use client';

import copy from 'copy-to-clipboard';
import moment from 'moment-timezone';
import { Fragment, useState } from 'react';
import ToastMessage, { notify } from '@/components/ToastMessage';

interface ThreadMatch {
  threadUrl: string | null;
  user: string;
}

const convertToDiscordUrl = (url: string) => {
  const match = /discord.com\/channels\/(\d+)\/(\d+)/.exec(url);
  if (match) {
    const [_, channelId, messageId] = match;
    return `discord://-/channels/${channelId}/${messageId}`;
  }

  return url;
};

export default function NotInMessageGeneratorPage() {
  const [notInMessage, setNotInMessage] = useState('');
  const [copiedElements, setCopiedElements] = useState<{ [key: number]: { [key: number]: boolean } }>({});

  const timeslotMap: Record<string, string> = {
    ':one:': '+1',
    ':two:': '+6',
    ':three:': '+12',
  };

  const timeslotHeaderMap: Record<string, string> = {
    '+1': 'Timeslot 1',
    '+6': 'Timeslot 2',
    '+12': 'Timeslot 3',
  };

  const parseInput = (input: string) => {
    const timeslotRegex = /Timeslot\s:([a-z]+)::\n((?:.|\n)+?)(?=(Timeslot\s:[a-z]+::|\(no pings were sent\)|$))/g;
    const matches = [...input.matchAll(timeslotRegex)];

    return matches.reduce<Record<string, ThreadMatch[]>>((acc, match) => {
      const emoji = `:${match[1]}:`;
      const timeslot = timeslotMap[emoji] || '';
      const content: ThreadMatch[] = match[2]
        .trim()
        .split('\n')
        .flatMap((line) => {
          // Extract thread URL and all user mentions
          const threadMatch = /\[thread]\(<([^>]+)>\)/.exec(line);
          const userMatches = [...line.matchAll(/<@\d+> \(`[^)]+`\)/g)].join(',');

          if (userMatches.length > 0) {
            return {
              user: userMatches,
              threadUrl: threadMatch ? convertToDiscordUrl(threadMatch[1].trim()) : null,
            };
          }

          return null;
        })
        .filter<ThreadMatch>((thread): thread is ThreadMatch => thread !== null);

      if (timeslot) {
        acc[timeslot] = (acc[timeslot] || ([] as ThreadMatch[])).concat(content);
      }

      return acc;
    }, {});
  };

  const copyToClipboard = (text: string, timeslotIndex: number, userIndex: number): void => {
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

  const generateOutput = () => {
    const timeslotGroups = parseInput(notInMessage);
    const outputElements: ReturnType<typeof Fragment>[] = [];

    for (const [timeslotIndex, [timeslot, users]] of Object.entries(timeslotGroups).entries()) {
      const hourMap = { '+1': 18, '+6': 23, '+12': 5 };
      // TODO: this cast is stupid, proper typing will fix it
      const hour = hourMap[timeslot as '+1' | '+6' | '+12'];
      const date = moment().tz('America/Toronto').hour(hour).minute(0).second(0);
      const now = date.unix();
      const discordTimestamp = `<t:${now}:t>`;

      // Add a smaller header for each timeslot
      const timeslotHeader = timeslotHeaderMap[timeslot] || `Timeslot ${timeslot}`;

      outputElements.push(
        <Fragment key={`header-${timeslotIndex}`}>
          <h4>{timeslotHeader}</h4> {/* Changed to h4 for smaller header */}
        </Fragment>,
      );

      for (const [userIndex, userEntry] of users.entries()) {
        const { user, threadUrl } = userEntry;
        const textToBeCopied = `${user}. Courtesy reminder to join your coop ASAP! You will receive a strike if you don’t join by +${Number.parseInt(timeslot, 10) + 5} (${discordTimestamp} in your time zone).`;
        const isCopied = copiedElements[timeslotIndex]?.[userIndex];

        outputElements.push(
          <Fragment key={`${timeslot}-${userIndex}`}>
            <p>
              {threadUrl && (
                <a href={threadUrl} target="_blank" rel="noopener noreferrer">
                  [Thread]
                </a>
              )}
              {isCopied ? ' ✅ ' : ' ❌ '}
              {textToBeCopied}
            </p>
            <button onClick={() => copyToClipboard(textToBeCopied, timeslotIndex, userIndex)}>Copy to Clipboard</button>
          </Fragment>,
        );
      }
    }

    return outputElements;
  };

  return (
    <div style={{ margin: '2rem 1rem' }}>
      <ToastMessage />
      <h1>NotIn Message Generator</h1>
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

      {generateOutput()}
    </div>
  );
}
