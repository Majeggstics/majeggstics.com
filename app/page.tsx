import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";

interface Foobar {
  foo: string;
}

export default function Home() {
  const foo: Foobar = { foo: 69 }; // break shit
  return (
    <main>
      <h1>The Majeggstics</h1>
      <section>
        <div>
          <h3>
            Welcome to The Majeggstics, where No Farmer is Left Behind!
          </h3>
          <p>
            Majeggstics is a worldwide group of Egg Inc. players with the common goal of making sure every player can complete every contract, by optimizing play strategies and making fair contributions to our co-ops.
          </p>
          <br />
          <p>
            How to join our group? <br />

            You&apos;ll need to join the Egg Inc. discord server at the link below and <abbr title="Direct Message">DM</abbr> one of our recruiters (@placeholder).
          </p>
          <br />
          <p>
            <a href="https://discord.gg/egginc" target='_blank' rel="noreferrer">Egg Inc. discord</a>
          </p>

          <p>
            <Link href="/guide">Guide</Link>
          </p>
          <p>
            <Link href="/contract-boost-calculator">Contract Boost Calculator</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
