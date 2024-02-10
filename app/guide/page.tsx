import Image from 'next/image';
import Typography from '@mui/material/Typography';

import newContractIcon from './images/newContractIcon.jpg';
import inGameContractInfoPage from './images/inGameContractInfoPage.png';
import farmReadyToReceiveCBs from './images/farmReadyToReceiveCBs.png';
import farmAfterSendingCBsWithTimer from './images/farmAfterSendingCBsWithTimer.png';
import howToJoinTheMajeggstics from './images/howToJoinTheMajeggstics.png';

export default function Guide() {
    return (
        <main id="guide">
            <section>
                <Typography variant="h2" gutterBottom>
                    Majeggstics Guide & Rule Book!
                </Typography>
                <Typography variant="body1" gutterBottom>Welcome to The Majeggstics, where <em>No Farmer is Left Behind!</em></Typography>
                <Typography variant="body1" gutterBottom>
                    Majeggstics is a worldwide group of Egg Inc. players with the common goal of making sure <em>every</em> player can complete <em>every</em> contract, by optimizing play strategies and making fair contributions to our co-ops.
                </Typography>
            </section>
            <section>
                <Typography variant="h4" gutterBottom>Minimum rules</Typography>
                <Typography variant="body1" gutterBottom>
                    The Majeggstics are a team - we expect everyone to contribute to our co-ops. When you register for a contract, you are agreeing to meet the minimum contribution for that contract.
                </Typography>
                <Typography variant="body1" gutterBottom>
                    <b>The minimum egg laying rate for each contract is posted in #mj-announcements. Minimum is measured at 12 and 24 hours after contract start.</b>
                </Typography>
                <Typography variant="body1" gutterBottom>
                    The 12 hour minimum is lower than the 24 hour minimum. If you meet the 12 hour minimum, you have passed! If you don’t meet the 12 hour minimum, you still have not failed, but you must meet the 24 hour minimum to pass.
                </Typography>
                <Typography variant="body1" gutterBottom>
                    You will receive a strike for joining your contract later than 5 hours after start, and an additional strike if you have not joined by the 24 hour check. (Strikes may also be given for inappropriate behavior in chat, and server staff are notified when server rules are broken.)
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Tokens are the human players who manage the Majeggstics - we recruit new members, help people play the game more efficiently, start and add people to co-op groups, and confirm everyone has met the minimum required laying rate for each contract.
                </Typography>
                <Typography variant="body1" gutterBottom>
                    A token will communicate with you if you receive a strike. Strikes are recorded. After four strikes, you will be removed from Majeggstics. Strikes are only counted for the last 20 contracts you complete - after that, strikes are erased.
                </Typography>
                <Typography variant="body1" gutterBottom>
                    After a strike, a token will create a <b>private thread</b> in #the_majeggstics to talk to you about what happened, and make sure you are supported to be successful in the future. If you’re concerned you won’t be successful, you can send <em>mj-support</em> anywhere in Majeggstics channels and a support Token will help you out. It can take time to respond, so ask for help using <em>mj-support</em> early on!
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Remember that the Majeggstic’s goal is to see everyone succeed. Minimums are meant to help you, not hurt. If you’re struggling to meet minimum or need help with a contract, ask for advice in #the_majeggstics or your grade’s Majeggstics channel. The group would be thrilled to help, and everyone will have the chance to learn along with you!
                </Typography>
            </section>
            <section>
                <Typography variant="h4" gutterBottom>Registering for a Contract
                </Typography>
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
                            <td>16:00 (4 PM)</td>
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
                            <td>AEST +10 (Australian Eastern Time)
                            </td>
                            <td>02:00 (2 AM)
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2}>Contract release times are affected by Daylight Savings Time in the US and may change throughout the year.
                            </td>
                        </tr>
                    </tbody>
                </table>
                <br />
                <Typography variant="body1" gutterBottom>
                    <Image
                        src={newContractIcon}
                        alt="New Contract Icon"
                    />
                    <span>
                        [Image Description: New Contract Icon]
                    </span>
                </Typography>
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
                <Typography variant="body1" gutterBottom>
                    When a new contract is released, Wonky, our beloved bot, will generate a registration post in #mj-announcements. Select a time slot - we start contracts at 3 times - +1, +6, and +12 hours after the contract release. Register for the time slot that&apos;s most convenient for your schedule. You must join your co-op and start your farm within 5 hours of your start time. It is your responsibility to register early and join your co-op.
                </Typography>
                <Typography variant="body1" gutterBottom>Registration for each time slot is finalized when Wonky creates co-ops. We recommend you sign up at least 15 minutes early, as co-ops may be created up to 5 minutes early because of the size of our group. If co-ops are late, be patient with initiators. </Typography>
                <Typography variant="body1" gutterBottom>Late registrations may be accepted depending on initiator availability and available spaces in our co-ops. If you are unable to register for a contract with Majeggstics, you can join a public co-op in the &quot;Co-Op Recruitment&quot; section and join us for the next contract! </Typography>
            </section>
            <section>
                <Typography variant="h4" gutterBottom>Joining your Co-op</Typography>
                <Typography variant="body1" gutterBottom>Ping! Pong! Wonky generated your co-op and started a thread in your grade’s channel. Check your DMs from Wonky for the contract code. If you’re the first person, double-check your contract code, then start the co-op immediately. Do not wait in the lobby.</Typography>

                <ul>
                    <li>Our co-ops are set to <b>private</b> to ensure that everyone participating meets our expectations. Do not share your co-op code or set the co-op to public - this can result in Majeggstics getting kicked from our co-ops and makes extra work for tokens.
                        <ul>
                            <li>
                                The toggle needs to stay to the left for the co-op to remain private.
                            </li>
                        </ul>
                    </li>

                    <li>
                        Notify an available token immediately if there is an error with your registration (ex: wrong grade, registered in multiple co-ops) or if you registered and teams have been made but you were not assigned to a co-op.
                    </li>

                    <ul>
                        <li>
                            There is currently a known bug when joining co-ops - you appear joined on your device, but not on the Egg Inc servers. Please confirm your game is in sync with the server by checking the eicoop link in your co-op thread <em>before boosting.</em>
                        </li>
                    </ul>

                    <li>
                        Wonky groups members together to ensure we have balanced teams. You must join the co-op you are assigned to. If you:
                        <ul>
                            <li>Join your co-op later than 5 hours after start, you will receive one strike.</li>
                            <li>Do not join your co-op before the 24-hour check, you will receive two strikes.</li>
                            <li>Join a Majeggstics co-op without being assigned by Wonky or a token, you will be removed from Majeggstics.</li>
                        </ul>
                    </li>

                    <li>Tokens monitor many co-op threads and can't respond to every message. If you need help, make sure to ask in #the_majeggstics or your grade's Majeggstic channel to make sure an available token sees your message. Don't be afraid to interrupt off-topic chat - our priority is helping your co-op complete successfully.</li>
                </ul>
            </section>
            <section>
                <Typography variant="h4" gutterBottom>Start and grow your contract farm</Typography>
                <ul>
                    <li>Finish common research, buy habs, and buy transport.
                        <ul>
                            <li>Use artifacts that increase income like Demeter's Necklace, Tungsten Ankh, Book of Basan; and artifacts that hold Shell Stones, Soul Stones, and Prophecy Stones.</li>

                            <li>Puzzle cubes will lower research costs - use your income-boosting artifacts, then switch your puzzle cube on while you’re buying. If you need to save more, swap the cube out for a better income artifact.</li></ul>
                    </li>

                    <li>Equip your best <b>Ship in a Bottle (SIAB)</b> to help your co-op mates earn more money. Your SIAB is worth more to the team than any artifact you can equip for yourself. Tachyon deflectors are not useful until after teammates have boosted, so equip an extra artifact for yourself until then.</li>

                    <li><b>Soul Mirror</b> a higher EB player if you can’t finish your common research or buy large enough habs/transport for your intended boosts.
                        <ul>
                            <li>
                                The person in your contract with the highest EB will have a soul mirror icon next to their name in your Discord thread.
                            </li>


                            <li>Majeggstics is privileged to have many high EB players with good availability who can help you maximize your earnings, but they are not required to do anything beyond following regular Majeggstics rules for playing the contract.</li>

                            <li>Use Bird Feed and Yon Calculator to maximize your earnings, no matter your mirror’s EB.</li>
                        </ul>
                    </li>
                    <li>Send <b>Chicken Boxes</b> every 3 hours to help your co-op mates grow their farms.
                    </li>
                    <li>
                        Request or send <b>tokens</b> to other co-op members upon request.
                    </li>
                    <ul>
                        <li>
                            Sending tokens to another player lowers their contract teamwork score - be thoughtful when sending tokens, and do not spam send individual tokens. Consider if your teammate has already boosted and how many tokens an AFK player will return to before you send tokens.
                        </li>
                        <li>
                            Spamming individual tokens or token dumping is not allowed.
                        </li>
                    </ul>
                </ul>
                <p>
                    <Image className="responsive-image" src={inGameContractInfoPage} alt="In-game contract info page with highlighted farm sharing button and CB ready icon circled" />
                    <br />
                    <span>
                        [ID: In-game contract info page with highlighted farm sharing button and CB ready icon circled]
                    </span>
                </p>
                <p>
                    <Image className="responsive-image" src={farmReadyToReceiveCBs} alt="A friend’s farm ready to receive CBs" />
                    <br />
                    <span>
                        [ID: A friend’s farm ready to receive CBs]
                    </span>
                </p>
                <p>
                    <Image className="responsive-image" src={farmAfterSendingCBsWithTimer} alt="A friend’s farm immediately after sending CBs showing the cooldown timer" />
                    <br />
                    <span>
                        [ID: A friend’s farm immediately after sending CBs showing the cooldown timer]
                    </span>
                </p>
            </section>
            <section>
                <Typography variant="h4" gutterBottom>
                    Boosting
                </Typography>
                <ul>
                    <li>
                        Use <a href='https://docs.google.com/spreadsheets/d/1qeqmgsn3Bsqbs2AfQ6kLZcNpsELEyiIrfo95IBKXWBg/edit#gid=36558563' target='_blank' rel="noreferrer"> GomCalc ↗</a>, <a href='https://saladfork.github.io/egg-inc-tools/' target='_blank' rel="noreferrer">SaladForks’ Egg Inc Tools ↗</a>, and <a href='https://hashtru.netlify.app/contractboost/' target='_blank' rel="noreferrer">Hashtru’s Contract Boost Calculator ↗</a> to help determine the best boost combination for your goals - these will vary widely depending on the contract, number of players in your group, your EB, and artifacts.
                        <ul>
                            <li>Most players can use a <b>Legendary Tachyon Prism & Epic Boost Beacon</b> to completely fill habs. </li>
                            <li>Players with Tier 4 Artifacts can often use <b>two Epic Tachyon Prisms</b> (together or separately) to fill habs over 50%. </li>
                            <li>Advanced artifact players with powerful dilithium and life sets can often hablock with a single Epic Tachyon and a few chicken runs post-boost. A powerful tachyon artifact set can result in shipping locking. </li>
                            <li>Consider the number of people in your contract and the impact deflectors will have on your laying rate - choose more GE efficient boosts in larger co-ops.</li>
                        </ul>
                    </li>
                    <li>
                        Before boosting, equip artifacts with <b>dilithium stones</b> to increase your boost time.
                    </li>
                    <li>
                        Immediately after starting your boosts, switch to your <b>best monocle, chalice, and artifacts with life stones</b>. Leave the farm to take advantage of the Internal Hatchery Calm Epic Research. If needed, equip a <b>gusset</b> to increase hab space.
                    </li>
                </ul>
            </section>
            <section>
                <Typography variant="h4" gutterBottom>
                    Post-boosting
                </Typography>
                <ul>
                    <li>
                        <b>Tachyon Deflectors</b> boost your co-op mates' laying rates - since Majeggstics aim for equal contributions, a deflector will benefit your co-op overall more than any artifact that only works on your individual farm.
                    </li>
                    <li>
                        <b>Metronome</b> and artifacts with <b>tachyon stones</b> boost egg laying rate.
                    </li>
                    <li>
                        <b>Compass</b> and artifacts with <b>quantum stones</b> increase shipping rate.
                    </li>
                    <li>
                        <b>Check in regularly</b> and don’t let your chickens fall asleep!
                        <ul>
                            <li>
                                The game does not update automatically. You must open your co-op farm and sync with the server for us to see your earnings before minimums are checked. Please check-in 15 minutes before your minimum check and confirm your lay rate using the eicoop link in your thread to avoid getting a strike.
                            </li>
                        </ul>
                    </li>
                    <li>
                        <b>Contact a token:</b>
                        <ul>
                            <li>
                                If you see glitching in your group. Glitching is not allowed in Majeggstics co-ops.
                            </li>
                            <li>
                                Enforcing minimum is the responsibility of tokens. Do not ping low performing members yourself, allow tokens to contact them and offer support.
                            </li>
                            <li>
                                Removing members from our contracts is not allowed. If you remove Majeggstics players from our co-op without specific instructions from a token, you will be removed from Majeggstics.
                            </li>
                        </ul>
                    </li>
                </ul>
            </section>
            <section>
                <Typography variant="h4" gutterBottom>Completion</Typography>
                <ul>
                    <li>Check in ASAP after the contract has finished so that your contract score can be calculated. </li>
                </ul>
            </section>
            <section>
                <Typography variant="h4" gutterBottom>Taking Breaks & Leaving</Typography>
                <Typography variant="body1" gutterBottom>
                    We’re here to help you be successful with contracts, but we understand that sometimes you need a break.
                </Typography>
                <ul>
                    <li><b>Not registering</b> - you can skip registering for contracts with us whenever you like with no penalties.
                    </li>
                    <li>
                        <b>Leaving the group</b> - if you’re not enjoying being a Majeggstic, want to join another Wonky group, or are retiring from the game, ping our Member Manager and ask to be removed from Majeggstics.
                    </li>
                    <li>
                        <b>Staying to socialize</b> - If you quit playing but enjoy the community, you can stay in the group. You don’t have to play Egg Inc, and we enjoy having friends!
                    </li>
                </ul>
            </section>
            <section>
                <Typography variant="h4" gutterBottom>Code of Conduct</Typography>
                <Typography variant="body1" gutterBottom>Is it a privilege for Majeggstics to have access to private channels and Wonky in the Egg, Inc. server. Because of our special status, we have high expectations for your behavior in our channels and around the server.</Typography>
                <ul>
                    <li><b><a href='https://discord.com/channels/455380663013736479/972559672814993418/972560766957924442' target='_blank' rel="noreferrer">Follow server #rules ↗</a>. Majeggstics members and channels must follow the Egg, Inc. server rules. Violating server rules will lead to removal from Majeggstics and the Egg, Inc. server.</b></li>
                    <li>Keep chat in Majeggstics kind and appropriate for all, and be a good representative of Majeggstics in public channels. </li>
                    <li>Respect Majeggstics tokens when asked to change your behavior. </li>
                    <li>Current events and politics can only be discussed in Off-Topic &gt;#current-events. </li>
                    <li>Majeggstics is a friendly and caring group of people, but we are limited in the support we can provide. If you need to chat about mental health, check out:
                        <ul>
                            <li><a href='https://www.7cups.com/' target='_blank' rel="noreferrer">7 Cups of Tea ↗</a>: Free 24/7 chat by trained volunteers. </li>
                            <li><a href='https://dialecticalbehaviortherapy.com/' target='_blank' rel="noreferrer">Dialectical Behaviour Therapy ↗</a>: Free, anonymous, independent skills and tools to help manage big feelings. </li>
                            <li><a href='https://projectlets.org' target='_blank' rel="noreferrer">Project Lets ↗</a>: Community-support based mental health care, by and for folks with lived experience of mental illness/madness, Disability, trauma, & neurodivergence. </li>
                        </ul>
                    </li>
                    <li>
                        Majeggstics has a system for recruiting that respects server rules and makes sure new members are a good fit for our group and play style.
                        <ul>
                            <li>Respect server rules about recruitment and co-op chat. </li>
                            <li>Check the pins in Co-op Recruitment &gt; #?-grade-coops to make sure we are currently recruiting, and have friends follow the instructions in our pinned post.</li>
                            <li>People struggling with public co-ops may not be a good fit for Majeggstics. Let them know about Co-Op Recruitment channels and the pinned posts, and allow them to choose the group that’s right for them. </li>
                        </ul>
                    </li>
                    <li>Keep chat about Majeggstics and Wonky in our channels - in public channels this often becomes recruitment or bragging, and reflects poorly on our group. </li>
                    <li>There are many private co-op groups in the server, with different play styles and requirements for joining. Be respectful of the other groups and how they play the game, even if it’s different from us. </li>
                    <li>You will be removed from Majeggstics for glitching/cheating in our co-ops.
                        <ul>
                            <li>
                                Server staff are notified of cheating players and may apply server-wide penalties.
                            </li>
                        </ul>
                    </li>
                    <li>
                        Use bot commands channels instead of discussion channels to send commands:
                        <ul>
                            <li>Utilities &gt; #bot-commands</li>
                            <li>Wonky &gt; #public-wonky-commands</li>
                            <li>Majeggstics &gt; # wonky-spam</li>
                        </ul>
                    </li>
                    <li>
                        Don’t try to break bots, and be patient when bots are down.
                    </li>
                    <li>
                        Keep spam in Off Topic &gt; #spam.
                    </li>
                    <li>
                        Direct Messages (DM)
                        <ul>
                            <li>Majeggstics is privileged to have threads for all of our co-ops - ping members in your thread instead of sending a DM or sending tokens in-game. </li>
                            <li>Use Majeggstics and server channels to ask general questions instead of sending DMs to other players, tokens, or server staff. </li>
                            <li>If you see inappropriate chat in Majeggstics channels, or glitching in our co-ops, you can react with the :flag_white: emoji to notify Majeggstics Tokens. Wonky will automatically remove your reaction to protect your privacy, and Tokens will get a copy of the message. </li>
                            <li>Follow instructions in Utilities &gt; #ticket-tool for help from server staff (unwanted/inappropriate DMs, glitching in non-Majeggstic co-ops, etc)</li>
                        </ul>
                    </li>
                </ul>
            </section>
            <section>
                <Typography variant="h4" gutterBottom>Useful Links</Typography>
                <ul>
                    <li><a href='https://discord.com/channels/455380663013736479/972559672814993418/972560766957924442' target='_blank' rel="noreferrer">Server #rules ↗</a></li>
                    <li><a href='https://discord.com/chttps://discord.com/channels/455380663013736479/807641608538292254/1121583305410740314hannels/455380663013736479/807641608538292254/1121583305410740314' target='_blank' rel="noreferrer">Ciria’s Useful Links Pin in #the_majeggstics ↗</a></li>
                    <li><a href='https://discord.com/channels/455380663013736479/1121015323005554808' target='_blank' rel="noreferrer">Ciria’s Amazing Infographics Thread in #the_majeggstics ↗</a></li>
                    <li><a href='https://discord.com/channels/455380663013736479/801187025742331996' target='_blank' rel="noreferrer">#artichat ↗</a> - Artifacts, crafting XP, ship drops, material farming, sets</li>
                    <li><a href='https://discord.com/channels/455380663013736479/455385659079917569' target='_blank' rel="noreferrer">#tips-and-tricks ↗</a> - Prestige strategies, fuel guides, diamond trophy guide, Royal Physique’s Epic Research calculator</li>
                </ul>
            </section>
            <section>
                <Typography variant="h4" gutterBottom>Joining Majeggstics</Typography>
                <Typography variant="body1" gutterBottom>Ready to get started?</Typography>
                <Typography variant="body1" gutterBottom>Open the game and find your <b>EID</b>: Open the ‘9 dots’ menu, touch ‘Help’, then ‘Data Loss Issue’. This will open an email, and you can copy your EID from the subject line. You’ll receive a confirmation DM from Wonky, the bot who helps run our co-ops, and your EID will be deleted from the chat to protect your privacy.</Typography>
                <Typography variant="body1" gutterBottom>By sending the /join command, you are agreeing to follow Majeggstics rules. </Typography>
                <Typography variant="body1" gutterBottom>
                    <Image className="responsive-image" src={howToJoinTheMajeggstics} alt="How to join the Mageggstics" />
                </Typography>
                <Typography variant="body1" gutterBottom>
                    <b> Welcome to the Majeggstics, we’re happy to have you!</b>
                </Typography>
                <Typography variant="body1" gutterBottom>
                    <b>If Majeggstics won’t be a good fit for you, DM @megadanger and ask to be removed from the group. Check the staff list in #mj-announcements to find our current member manager.</b>
                </Typography>
                <Typography variant="body1" gutterBottom>
                    <b>The public “#Co-Op Recruitment” section can help you find co-ops, or you can look for other open groups that may fit your goals and needs better.</b>
                </Typography>
            </section>
        </main >
    )
}