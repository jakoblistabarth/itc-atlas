import { FC, useEffect, useState } from "react";
import JoyRide, { Step } from "react-joyride";
import Beacon from "../../components/Tour/Beacon";

type Props = {
  steps: Step[];
};

const Tour: FC<Props> = ({ steps }) => {
  const [isSSR, setISsSR] = useState(true);
  useEffect(() => setISsSR(false), []);

  return !isSSR ? (
    <JoyRide
      steps={steps}
      continuous
      showProgress
      showSkipButton
      beaconComponent={Beacon}
    />
  ) : (
    <></>
  );
};

export default Tour;
