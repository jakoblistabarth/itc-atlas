export const mapToSponsor = (str?: string) => {
  if (!str) return undefined;
  if (
    !!str.match(
      /N(UFFIC|uffic)|NFP|Netherlands|Holland |OKP|OTS|Koninklijk (\w*\s)?Instituut|Ministerie/
    )
  )
    return "Dutch";
  if (!!str.match(/ERASMUS|European Commission|European Union/i)) return "EU";
  if (!!str.match(/ITC\s?\/?|UT |Universiteit Twente/)) return "ITC/UT";
  if (!!str.match(/own accounter/i)) return "own accounter";
  if (!!str.match(/Ltd\.|GmbH|Co\.|S\.L\./i)) return "company";
  if (!!str.match(/World Bank/i)) return "World Bank";
  if (!!str.match(/United Nations|UNU /i)) return "UN";
  if (!!str.match(/^TU |school|universit[y|eit|at]/i))
    return "other university";
  return "other";
};
