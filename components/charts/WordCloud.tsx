import React, { useEffect, useState } from "react";
import { Text } from "@visx/text";
import Wordcloud from "@visx/wordcloud/lib/wordcloud";
import { scaleLog } from "d3";
import { removeStopwords } from "stopword";

interface Props {
  width: number;
  height: number;
  text: string;
  maxFontSize?: number;
}

export type WordData = {
  text: string;
  value: number;
};

// TODO: refactor with arquero?
function wordFreq(words: string[]): WordData[] {
  const freqMap: Record<string, number> = {};

  for (const w of words) {
    if (!freqMap[w]) freqMap[w] = 0;
    freqMap[w] += 1;
  }
  return Object.keys(freqMap)
    .map((word) => ({
      text: word,
      value: freqMap[word],
    }))
    .filter((d) => d.value > 2);
}

export default function Example({
  width,
  height,
  maxFontSize = 70,
  text,
}: Props) {
  // TODO: refactor to function, keep original upper/lower case for visual?
  const textWithoutPunctuation = text.replace(
    /[.,\/#!$%\^&\*;:{}=\-_`~()]/g,
    ""
  );
  const textWithoutStopwords = removeStopwords(
    textWithoutPunctuation.split(/\s/).map((d) => d.toLowerCase())
  );
  const words = wordFreq(textWithoutStopwords);

  const fontScale = scaleLog()
    .domain([
      Math.min(...words.map((w) => w.value)),
      Math.max(...words.map((w) => w.value)),
    ])
    .range([6, maxFontSize]);
  const fontSizeSetter = (datum: WordData) => fontScale(datum.value);
  const fontWeightSetter = (datum: WordData) =>
    datum.value > fontScale.domain()[1] / 2 ? "bold" : "normal";
  const rotationSetter = (d: WordData, i: number) => {
    const direction = i % 3 == 0 ? 1 : -1;
    const angle = i % 2 == 0 ? 0 : 90;
    return angle * direction;
  };

  const fixedValueGenerator = () => 0.5;

  const [isSSR, setIsSSR] = useState(true);
  useEffect(() => {
    setIsSSR(false);
  }, []);

  return (
    <Wordcloud
      words={words}
      width={width}
      height={height}
      fontSize={fontSizeSetter}
      fontWeight={fontWeightSetter}
      padding={2}
      font={"Fraunces"}
      rotate={rotationSetter}
      random={fixedValueGenerator}
    >
      {(cloudWords) =>
        isSSR ? (
          <g></g>
        ) : (
          cloudWords.map((w, i) => (
            <Text
              key={w.text}
              fill={"teal"}
              textAnchor={"middle"}
              transform={`translate(${w.x}, ${w.y}) rotate(${w.rotate})`}
              fontSize={w.size}
              fontWeight={w.weight}
              fontFamily={w.font}
            >
              {w.text}
            </Text>
          ))
        )
      }
    </Wordcloud>
  );
}
