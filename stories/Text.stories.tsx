import { Meta, StoryObj } from "@storybook/react";

import { Text } from "@visx/text/";

const width = 600;
const height = 300;

const meta = {
  title: "UI/Text",
  component: Text,
  args: {
    x: width / 2,
    y: height / 2,
  },
  argTypes: {},
  decorators: [
    (Story) => (
      <svg width={width} height={height}>
        <Story />
      </svg>
    ),
  ],
} satisfies Meta<typeof Text>;
export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultText: Story = {
  args: {
    children: "Enschede",
  },
};

export const LongText: Story = {
  args: {
    width: 250,
    height: 50,
    verticalAnchor: "start",
    fontSize: 10,
    lineHeight: 12.5,
    children:
      "Der gleiche Ansatz ist anzuwenden, wenn das IMM-Modell kein Profil für die spezielle buchhalterische Bewertungsregeln gelten (wie z.B. Das erste Ziel besteht in der Stressphase weiterhin Kapital als Grundlage für das laufende Geschäft der Banken zur Verfügung steht. Der Betrag, der vom harten Kernkapital abzuziehen ist, als die Summe sämtlicher Positionen, die insgesamt mehr als 10% des harten Kernkapitals der Bank (nach vollständiger Anwendung aller anderen vorgenannten regulatorischen Anpassungen), muss der Betrag, der vom zusätzlichen Kernkapital abzuziehen ist, ergibt sich aus dem nachfolgenden Abschnitt „Abzug von Beträgen über dem Schwellenwert“. Das erste Ziel besteht in der Bilanz als Aktivum ausgewiesenen leistungsorientierten Pensionsfonds sollte das Aktivum bei der Berechnung des harten Kernkapitals am gesamten Eigenkapital. Derartige zum Ausgleich herangezogene Vermögenswerte sollten mit dem Risikogewicht versehen werden, das sie als unmittelbares Eigentum der Bank als Sicherheit akzeptiert werden. Die Geschäftsleitung muss dieser Einheit genügend Ressourcen zuweisen, damit deren Systeme ausreichend leistungsfähig sind in Bezug auf Bedienungsrechte von Hypotheken ist der volle Betrag in Abzug zu bringen, nach Bereinigung um entsprechende latente Steuerverbindlichkeiten, die erlöschen würden, falls sich der Betrag, der vom Ergänzungskapital abzuziehen ist, ergibt sich aus dem nachfolgenden Abschnitt „Abzug von Beträgen über dem Schwellenwert“. Für international tätige Banken analysieren die geografische Struktur ihrer Kreditengagements gegenüber dem privaten Sektor offenlegen, die in die Berechnung der oben dargestellten CVA-Kapitalanforderung.",
  },
};
