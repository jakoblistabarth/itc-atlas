import type { NextPage } from "next";
import PageBase from "../../components/PageBase";
import Container from "../../components/Container";
import Section from "../../components/Section";
import Paragraph from "../../components/Paragraph";

const Page: NextPage = () => {
  return (
    <PageBase title="Privacy Statement">
      <Container className="[&_:is(h3,h4)]:mt-10 [&_h3]:text-2xl">
        <h2 className="my-10 text-5xl uppercase tracking-widest">ITC Atlas</h2>
        <Section>
          <h3>1 Introduction</h3>
          <Paragraph>
            This privacy statement describes how the University of Twente (UT)
            handles your personal data in the application <em>ITC atlas</em>.
          </Paragraph>
        </Section>
        <Section>
          <h3>2 Processing personal data</h3>
          <Paragraph>
            Within the <em>ITC atlas</em>, the following personal data was
            processed to create the <em>ITC atlas</em>:
          </Paragraph>
          <ul className="my-2 list-disc pl-5">
            <li>Names of PhD Candidates</li>
            <li>Country of origin of PhD Candidates</li>
          </ul>
        </Section>
        <Section>
          <h3>3 Collecting personal data</h3>
          <Paragraph>
            No personal data is collected when using this website.
          </Paragraph>
        </Section>
        <Section>
          <h3>4 Transfer personal data</h3>
          <Paragraph>
            We do not transfer any personal data to third parties.
          </Paragraph>
        </Section>
        <Section>
          <h3>5 Your rights</h3>
          <Paragraph>
            The UT processes your personal data, but as a data subject, you have
            several rights to keep control over your personal data. You will
            find more information on these rights below. In case you have any
            questions or you wish to exercise these rights, please contact the{" "}
            <a href="mailto:dpo@utwente.nl">Data Protection Officer</a>.
          </Paragraph>
          <h4>5.1 Right to access personal data</h4>
          <Paragraph>
            You have the right to receive, amongst others, a copy of your
            personal data which is being processed.
          </Paragraph>
          <h4>5.2 Right to erasure</h4>
          <Paragraph>
            The right to be forgotten. It is not always possible to erase all
            personal data.
          </Paragraph>
          <h4>5.3 Right to rectification</h4>
          <Paragraph>
            The right to have inaccurate personal data rectified, or completed
            if it is incomplete.
          </Paragraph>
          <h4>5.4 right to data portability</h4>
          <Paragraph>
            This right allows the data subject to obtain and reuse their
            personal data for their own purposes across different services.
          </Paragraph>
          <h4>5.5 Right to restrict processing</h4>
          <Paragraph>
            Under certain circumstances, you have the right to have less
            personal data being processed.
          </Paragraph>
          <h4>5.6 Right to object</h4>
          <Paragraph>
            In certain circumstances, you have the right to object to
            processing.
          </Paragraph>
        </Section>
        <Section>
          <h3>6 Complaints</h3>
          <Paragraph>
            In case you have a complaint about the way the UT handles your
            personal data, you can contact the Dutch Privacy Authority
            (Autoriteit Persoonsgegevens).
          </Paragraph>
        </Section>
        <Section>
          <h3>7 Contact</h3>
          <Paragraph>
            For questions about the <em>ITC atlas</em>, please contact{" "}
            <em>[generic email address for ITC ATLAS yet to be created]</em>.
            For questions regarding your personal data and privacy, please
            contact the privacy contact person of your faculty or service
            department (see{" "}
            <a href="https://www.utwente.nl/en/cyber-safety/contact/#privacy-contact-persons">
              utwente.nl/en/cyber-safety/contact/#privacy-contact-persons
            </a>
            ). You can also contact the Data Protcetion Officer:{" "}
            <a href="mailto:dpo@utwente.nl">dpo@utwente.nl</a>.
          </Paragraph>
        </Section>
      </Container>
    </PageBase>
  );
};

export default Page;
