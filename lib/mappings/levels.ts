export enum Level {
  MASTER = "Master",
  CERTIFICATE_COURSE = "Certificate course",
  DIPLOMA = "Diploma",
  PHD = "PhD",
}

export const mapToLevel = (str?: string): Level | undefined => {
  if (str?.match(/^(COM|IME?|M|M?SC|PG)$/)) return Level.MASTER;
  if (str?.match(/^(DED?|GRAD.INT|RC|SCD|TM|)$/))
    return Level.CERTIFICATE_COURSE;
  if (str?.match(/^(DPL|)$/)) return Level.DIPLOMA;
  if (str?.match(/^(GRAD.(AIO|CO|E?PHD))$/)) return Level.PHD;
  return undefined;
};
