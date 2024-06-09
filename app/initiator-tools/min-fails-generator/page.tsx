"use client";

import { Fragment, useState } from 'react';
import copy from 'copy-to-clipboard';

import ToastMessage, { notify } from '@/components/ToastMessage';

export default function MinFailsGeneratorPage() {
  const [notInMessage, setNotInMessage] = useState('');

  // console.log('notInMessage', notInMessage);
  // Get the content of the textarea
  const textareaContent = notInMessage;

  // Split the content into an array of lines
  const fails = textareaContent.split('\n')
    ?.filter(elem => elem?.toLowerCase().includes('spent'))
    ?.map(elem => elem?.replace("<:b_icon_token:1123683788258549861>", ":b_icon_token:")?.replace("<:clock:1123686591412576357>", ":clock:"));    

  // console.log({ fails });

  const [copiedElements, setCopiedElements] = useState<boolean[]>(Array(fails.length).fill(false));

  const copyToClipboard = (text: string, index: number) => {
    const copyResult = copy(text);

    if (copyResult) {
      // console.log('Copied', copyResult);
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
      <h1>Minimum Fails Generator</h1>
      <p style={{ display: 'flex', flexDirection: 'column' }}>
        <label htmlFor="#notInMessage">Minimum check message from Wonky</label>
        <textarea name='notInMessage' id='notInMessage' value={notInMessage} onChange={(event) => setNotInMessage(event.target.value)} style={{ margin: '1rem 0' }} rows={10} />
      </p>
      
      {fails.map((elem, index) => {
        return (
          <Fragment key={index}>
            <p>{copiedElements[index] ? '✅' : '❌'} {elem}</p>
            <button onClick={() => copyToClipboard(elem, index)}>Copy to Clipboard</button>
          </Fragment>
        )
      })}
    </div>
  )
}