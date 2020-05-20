import { navigateToUrl } from "single-spa";

export function navigate({ to }) {
  const target = interpolateString(to, {
    spaBase: window.spaBase,
    openmrsBase: window.openmrsBase,
    openmrsSpaBase: window.getOpenmrsSpaBase()
  });
  const isSpaPath = target.startsWith(window.getOpenmrsSpaBase());

  isSpaPath ? navigateToUrl(target) : location.assign(target);
}

// package-local
export function interpolateString(template: string, params: object) {
  const names = Object.keys(params);
  const vals = Object.values(params);
  if (template.includes("`")) {
    throw Error("Template may not include backticks");
  }
  return new Function(...names, `return \`${template}\`;`)(...vals);
}

declare global {
  interface Window {
    spaBase: string;
    openmrsBase: string;
    getOpenmrsSpaBase: () => string;
  }
}
