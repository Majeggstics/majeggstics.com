"use client";

import { Fragment, useState } from 'react';
import moment from 'moment-timezone';
import copy from 'copy-to-clipboard';

import ToastMessage, { notify } from '@/components/ToastMessage';
import { CustomSelectInput } from '@/components/CustomInput';

export default function NotInMessageGeneratorPage() {
  const [coopTimeslot, setCoopTimeslot] = useState('1');
  const [notInMessage, setNotInMessage] = useState('');

  const hour = 12 + parseInt(coopTimeslot) + 5;

  const date = moment().tz("America/Toronto").hour(hour).minute(0).second(0);

  // Convert to Unix timestamp
  const now = date.unix();

  // Format it for Discord, <t:1711144800:t>
  const discordTimestamp = `<t:${now}:t>`;

  // console.log('notInMessage', notInMessage);
  // Get the content of the textarea
  const textareaContent = notInMessage;

  // Split the content into an array of lines
  const lines = textareaContent.split('\n');

  console.log({ lines });

  const usersToBePinged = [];
  for (let index = 0; index < lines.length; index++) {
    const line = lines[index];
    // console.log('line', line.split('):')?.[0]);
    // console.log('line', line.split('):'));

    // https://discord.com/channels/455380663013736479/1220779715225321523
    if (line.split('):').length > 1) {
      const user = line.split('):')[1].trim();
      usersToBePinged.push(user);
    }
  }
  console.log({ usersToBePinged });

  const [copiedElements, setCopiedElements] = useState<boolean[]>(Array(usersToBePinged.length).fill(false));

  const copyToClipboard = (text: string, index: number) => {
    const copyResult = copy(text);

    if (copyResult) {
      console.log('Copied', copyResult);
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
        <label htmlFor="coopTimeslot">Boarding group</label>
        <CustomSelectInput name='coopTimeslot' options={timeSlotOptions} value={coopTimeslot} handleChange={(event: any) => setCoopTimeslot(event.target.value)} style={{ width: '100px', marginTop: '1rem' }} />
      </p>
      <p style={{ display: 'flex', flexDirection: 'column' }}>
        <label htmlFor="#notInMessage">Not in message from Wonky</label>
        <textarea name='notInMessage' id='notInMessage' value={notInMessage} onChange={(event) => setNotInMessage(event.target.value)} style={{ margin: '1rem 0' }} rows={10} />
      </p>
      <p>Current time: {now}</p>
      <p>Current discordTimestamp: {discordTimestamp}</p>

      {usersToBePinged.map((userElem, index) => {
        const textToBeCopied = `${userElem}. Courtesy reminder to join your coop ASAP!  You will receive a strike if you don’t join by +${parseInt(coopTimeslot) + 5} (${discordTimestamp} in your time zone).`;

        return (
          <Fragment key={index}>
            <p>{copiedElements[index] ? '✅' : '❌'} {textToBeCopied}</p>
            <button onClick={() => copyToClipboard(textToBeCopied, index)}>Copy to Clipboard</button>
          </Fragment>
        )
      })}
    </div>
  )
}

const timeSlotOptions = [
  { value: '1', text: '+1' },
  { value: '6', text: '+6' },
  { value: '12', text: '+12' },
]