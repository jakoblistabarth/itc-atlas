export const mapToOrganizationGroup = (str?: string) => {
  if (!str) return undefined;
  if (
    !!str.match(
      /(NWO|OKP|OTS|NFP)|N(UFFIC|uffic)|Netherlands|Holland |Koninklijk (\w*\s)?Instituut|Ministerie/
    )
  )
    return "Dutch";
  if (!!str.match(/ERASMUS|European (Commission|Union)|^EU /i)) return "EU";
  if (!!str.match(/ITC\s?\/?|UT |Universit(eit|y) (of )?Twente/))
    return "ITC/UT";
  if (!!str.match(/own accounter/i)) return "own accounter";
  if (!!str.match(/Ltd\.|GmbH|Co\.|S\.L\./i)) return "company";
  if (!!str.match(/World Bank/i)) return "World Bank";
  if (
    !!str.match(
      /^UN(U|ESCO)?(\s|-|\/)|United Nations|W(orld )?H(ealth )?O(rgani(z|s)ation)?/i
    )
  )
    return "UN";
  if (!!str.match(/^TU |school|universi(t(y|eit|(ä|a)t|é)|dad)|Univ\./i))
    return "other university";
  return "other";
};
