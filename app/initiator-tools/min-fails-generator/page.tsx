"use client";

import { Fragment, useState } from 'react';
import copy from 'copy-to-clipboard';

import ToastMessage, { notify } from '@/components/ToastMessage';
import { CustomSelectInput } from '@/components/CustomInput';

export default function MinFailsGeneratorPage() {
  const [notInMessage, setNotInMessage] = useState('');
  const [coopTimeslot, setCoopTimeslot] = useState('1');
  const [contract, setContract] = useState(contractOptions?.[0]?.value);

  // console.log('notInMessage', notInMessage);
  // Get the content of the textarea

  // Split the content into an array of lines
  const fails = notInMessage?.slice().split('\n')
    ?.filter(elem => elem?.toLowerCase().includes('spent'))
    ?.map(elem => elem?.replace("<:b_icon_token:1123683788258549861>", ":b_icon_token:")?.replace("<:clock:1123686591412576357>", ":clock:")?.replace("* ", "- "));

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

  const twentyFourHourNotins = notInMessage?.slice()?.split('\n')
    ?.filter(elem => elem?.toLowerCase().includes('missing'))
    ?.map(elem => elem?.replace("* ", "")?.replace(" is missing.", "")?.concat(", failure to join after 24 hours"));

  console.log('twentyFourHourNotins', twentyFourHourNotins);

  const coopsInDanger = notInMessage?.slice()?.split('\n')
    ?.filter(elem => elem?.toLowerCase().includes(':warning'))
  // ?.map(elem => elem?.replace("* ", "")?.replace(" is missing.", "")?.concat(", failure to join after 24 hours"));

  console.log('coopsInDanger', coopsInDanger);

  const contractNameWithTimeslot = contract + " +" + coopTimeslot;

  return (
    <div style={{ margin: '2rem 1rem' }}>
      <ToastMessage />
      <h1>Minimum Fails Generator</h1>
      <p style={{ display: 'flex', flexDirection: 'column' }}>
        <label htmlFor="coopTimeslot">Boarding group</label>
        <CustomSelectInput name='coopTimeslot' options={timeSlotOptions} value={coopTimeslot} handleChange={(event: any) => setCoopTimeslot(event.target.value)} style={{ width: '100px', height: '2rem', marginTop: '1rem' }} />
      </p>

      <p style={{ display: 'flex', flexDirection: 'column' }}>
        <label htmlFor="contract">Contract</label>
        <CustomSelectInput name='contract' options={contractOptions} value={contract} handleChange={(event: any) => setContract(event.target.value)} style={{ width: '200px', height: '2rem', marginTop: '1rem' }} />
      </p>

      <p style={{ display: 'flex', flexDirection: 'column' }}>
        <label htmlFor="#notInMessage">Minimum check message from Wonky</label>
        <textarea name='notInMessage' id='notInMessage' value={notInMessage} onChange={(event) => setNotInMessage(event.target.value)} style={{ margin: '1rem 0' }} rows={10} />
      </p>

      <div>
        <h2>{contractNameWithTimeslot} Coops in danger ⚠️</h2>
        {coopsInDanger?.length > 0 ? coopsInDanger?.map((elem, index) => (
          <p key={index}>{elem}</p>
        )) : <p>No coops in danger</p>}
        <p>
          <button onClick={() => {
            let stringToBeCopied = "## " + contractNameWithTimeslot + " Coops in danger" + "\n";

            stringToBeCopied = stringToBeCopied + coopsInDanger.join("\n");

            copy(stringToBeCopied);
          }}>
            Copy to Clipboard
          </button>
        </p>
      </div>

      <div style={{ margin: '4rem 0' }}>
        <h2>{contractNameWithTimeslot} 24 hour notins</h2>
        {twentyFourHourNotins?.length > 0 ? twentyFourHourNotins?.map((elem, index) => (
          <p key={index}>{elem}</p>
        )) : <p>No 24 hour notins</p>}
        <p>
          <button onClick={() => {
            let stringToBeCopied = "## " + contractNameWithTimeslot + " 24 hour notins" + "\n";

            stringToBeCopied = stringToBeCopied + twentyFourHourNotins.join("\n");

            copy(stringToBeCopied);
          }}>
            Copy to Clipboard
          </button>
        </p>
      </div>

      <div>
        <h2>{contractNameWithTimeslot} Minimum fails</h2>
        <p>
          <button onClick={() => copy("## " + contractNameWithTimeslot + " Minimum fails")}>Copy heading to Clipboard</button>
        </p>
        {fails?.length > 0 ? fails.map((elem, index) => {
          return (
            <div key={index} style={{ marginBottom: '3rem' }}>
              <p>{copiedElements[index] ? '✅' : '❌'} {elem}</p>
              <button onClick={() => copyToClipboard(elem, index)}>Copy to Clipboard</button>
            </div>
          )
        }) : (
          <div>
            <p>No fails</p>
            <p>
              <button onClick={() => copy("No fails")}>Copy to Clipboard</button>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

const timeSlotOptions = [
  { value: '1', text: '+1' },
  { value: '6', text: '+6' },
  { value: '12', text: '+12' },
]

const contractOptions = [
  {
    value: ':egg_medical: Tummy Aches',
    text: 'Tummy Aches'
  },
  {
    value: ':egg_tachyon: Tachyon Deflector',
    text: 'Tachyon Deflector'
  }
];