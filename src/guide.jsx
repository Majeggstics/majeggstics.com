import newContractIcon from './assets/newContractIcon.jpg'

export default function Guide() {
  return (
    <main>
      <section>
        <h1>
          Majeggstics Guide & Rule Book!
        </h1>
        <p>Welcome to The Majeggstics, where No Farmer is Left Behind!</p>
        <p>
          Majeggstics is a worldwide group of Egg Inc. players with the common goal of making sure every player can complete every contract, by optimizing play strategies and making fair contributions to our co-ops.
        </p>
      </section>
      <section>
        <h2>Minimum rules</h2>
        <p>
          The Majeggstics are a team - we expect everyone to contribute to our co-ops. When you register for a contract, you are agreeing to meet the minimum contribution for that contract.
        </p>
        <p className="bold">
          The minimum egg laying rate for each contract is posted in #MJ-Announcements. Minimum is measured at 12 and 24 hours after contract start.
        </p>
        <p>
          The 12 hour minimum is lower than the 24 hour minimum. If you meet the 12 hour minimum, you have passed! If you don’t meet the 12 hour minimum, you still have not failed, but you must meet the 24 hour minimum to pass.
        </p>
        <p>
          You will receive a strike for joining your contract later than 5 hours after start, and an additional strike if you have not joined by the 24 hour check. (Strikes may also be given for inappropriate behavior in chat, and server staff are notified when server rules are broken.)
        </p>
        <p>
          Tokens are the human players who manage the Majeggstics - we recruit new members, help people play the game more efficiently, start and add people to co-op groups, and confirm everyone has met the minimum required laying rate for each contract.
        </p>
        <p>
          A token will communicate with you if you receive a strike. Strikes are recorded. After four strikes, you will be removed from Majeggstics. Strikes are only counted for the last 20 contracts you complete - after that, strikes are erased.
        </p>
        <p>
          After a strike, a token will create a private thread in #the_majeggstics to talk to you about what happened, and make sure you are supported to be successful in the future. If you’re concerned you won’t be successful, you can send mj-support anywhere in Majeggstics channels and a support Token will help you out. It can take time to respond, so ask for help using mj-support early on!
        </p>
        <p>
          Remember that the Majeggstic’s goal is to see everyone succeed. Minimums are meant to help you, not hurt. If you’re struggling to meet minimum or need help with a contract, ask for advice in #the_majeggstics or your grade’s Majeggstics channel. The group would be thrilled to help, and everyone will have the chance to learn along with you!
        </p>
      </section>
      <section>
        <h2>Registering for a Contract
        </h2>
        <table>
          <thead>
            <tr>
              <th colSpan={2}>Contracts are released 3 times a week at:
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>UTC 0 (Coordinated Universal Time)
              </td>
              <td>16:00 (5 PM)</td>
            </tr>
            <tr>
              <td>PT -8 (Pacific Time, NA)
              </td>
              <td>09:00 (9 AM)
              </td>
            </tr>
            <tr>
              <td>ET -5 (Eastern Time, NA)
              </td>
              <td>12:00 (12 PM)
              </td>
            </tr>
            <tr>
              <td colSpan={2}>Contract release times are affected by Daylight Savings Time in the US and may change throughout the year.
              </td>
            </tr>
          </tbody>
        </table>
        <br />
        <p>
          <img src={newContractIcon} alt="New Contract Icon" />
        </p>
        <ul>
          <li>
            Monday has a new contract for everyone. The first Monday of each month has a new Prophecy Egg (PE) contract.
          </li>
          <li>
            Wednesday and Friday have leggacy contracts. Wednesday has a non-PE contract, and Friday has a PE contract.
          </li>
          <li>
            If you want to be pinged when contracts are released, go to #optional-roles and select the “Contracts” role.
          </li>
        </ul>
        <p>
          When a new contract is released, Wonky, our beloved bot, will generate a registration post in #mj-announcements. Select a time slot - we start contracts at 3 times - +1, +6, and +12 hours after the contract release. Register for the time slot that&apos;s most convenient for your schedule. You must join your co-op and start your farm within 5 hours of your start time. It is your responsibility to register early and join your co-op.
        </p>
        <p>Registration for each time slot is finalized when Wonky creates co-ops. We recommend you sign up at least 15 minutes early, as co-ops may be created up to 5 minutes early because of the size of our group. If co-ops are late, be patient with initiators. </p>
        <p>Late registrations may be accepted depending on initiator availability and available spaces in our co-ops. If you are unable to register for a contract with Majeggstics, you can join a public co-op in the &quot;Co-Op Recruitment&quot; section and join us for the next contract! </p>
      </section>
    </main>
  )
}