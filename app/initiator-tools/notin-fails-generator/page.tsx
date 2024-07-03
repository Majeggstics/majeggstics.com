"use client";

import { Fragment, useState } from 'react';
import copy from 'copy-to-clipboard';

import ToastMessage, { notify } from '@/components/ToastMessage';
import { CustomSelectInput } from '@/components/CustomInput';

export default function NotInFailsGeneratorPage() {
  const [notInMessage, setNotInMessage] = useState('');
  const [coopTimeslot, setCoopTimeslot] = useState('1');
  const [contract, setContract] = useState(contractOptions?.[0]?.value);

  // console.log('notInMessage', notInMessage);
  // Get the content of the textarea
  const textareaContent = notInMessage;

  // Split the content into an array of lines
  const failedFarmers = textareaContent.split('\n')
    ?.filter(elem => elem.includes('):'))
    .map(elem => elem.split(","))
    .flat()
    .map(elem => elem.substring(
      elem.indexOf("`") + 1,
      elem.lastIndexOf("`")
    ));

  // console.log({ failedFarmers });

  const failsOutput = "## " + contract + " +" + coopTimeslot  + " notins\n" + failedFarmers.map(elem => elem + ", failure to join after 5 hours").join("\n");

  return (
    <div style={{ margin: '2rem 1rem' }}>
      <ToastMessage />
      <h1>NotIn Fails Generator</h1>
      <p style={{ display: 'flex', flexDirection: 'column' }}>
        <label htmlFor="coopTimeslot">Boarding group</label>
        <CustomSelectInput name='coopTimeslot' options={timeSlotOptions} value={coopTimeslot} handleChange={(event: any) => setCoopTimeslot(event.target.value)} style={{ width: '100px', height: '2rem', marginTop: '1rem' }} />
      </p>
      
      <p style={{ display: 'flex', flexDirection: 'column' }}>
        <label htmlFor="contract">Contract</label>
        <CustomSelectInput name='contract' options={contractOptions} value={contract} handleChange={(event: any) => setContract(event.target.value)} style={{ width: '200px', height: '2rem', marginTop: '1rem' }} />
      </p>

      <p style={{ display: 'flex', flexDirection: 'column' }}>
        <label htmlFor="#notInMessage">Not in message from Wonky</label>
        <textarea name='notInMessage' id='notInMessage' value={notInMessage} onChange={(event) => setNotInMessage(event.target.value)} style={{ margin: '1rem 0' }} rows={10} />
      </p>
      <p style={{ display: 'flex', flexDirection: 'column', rowGap: '1rem' }}>
        <textarea name="failsOutput" id="failsOutput" value={failsOutput} rows={10} disabled />
        <Fragment>
          <button onClick={() => {
            const copyResult = copy(failsOutput);

            if (copyResult) {
              // console.log('Copied', copyResult);
              notify('Message copied');
            }
          }} style={{ width: 'fit-content' }}>Copy to Clipboard</button>
        </Fragment>
      </p>
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
    value: ':egg_firework: Paying Up',
    text: 'Paying Up'
  },
];