import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/home.module.css";
import { MdOutlineArrowRightAlt } from "react-icons/md";
import Link from "next/link";
import Footer from "../components/footer";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>ITC Atlas</title>
        <meta name="description" content="ITC Atlas" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to the World of ITC</h1>

        <p className={styles.description}>A prototype of ITC's hybrid atlas</p>

        <div className={styles.grid}>
          <Link href="/travels">
            <a className={styles.card}>
              <h2>
                Travels <MdOutlineArrowRightAlt />
              </h2>
              <p>Insights into ITC's travels around the globe.</p>
            </a>
          </Link>

          <Link href="/projects">
            <a className={styles.card}>
              <h2>
                Projects <MdOutlineArrowRightAlt />
              </h2>
              <p>Mapping ITC's activity throughout the decades.</p>
            </a>
          </Link>

          <Link href="/phds">
            <a className={styles.card}>
              <h2>
                PhDs <MdOutlineArrowRightAlt />
              </h2>
              <p>Mapping ITC's PhDs.</p>
            </a>
          </Link>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Home;
