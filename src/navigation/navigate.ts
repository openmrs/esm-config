import { navigateToUrl } from "single-spa";

export function navigate({ to }: NavigateOptions): void {
  const target = interpolateUrl(to);
  const isSpaPath = target.startsWith(window.getOpenmrsSpaBase());
  if (isSpaPath) {
    const spaTarget = target.replace(
      new RegExp("^" + window.getOpenmrsSpaBase()),
      ""
    );
    navigateToUrl(spaTarget);
  } else {
    window.location.assign(target);
  }
}

// package-local / "protected"
export function interpolateUrl(template: string): string {
  return interpolateString(template, {
    openmrsBase: window.openmrsBase,
    openmrsSpaBase: window.getOpenmrsSpaBase()
  }).replace(/^\/\//, "/"); // remove extra initial slash if present
}

// package-local / "protected"
export function interpolateString(template: string, params: object): string {
  const names = Object.keys(params);
  const vals = Object.values(params);
  if (template.includes("`")) {
    throw Error("Template may not include backticks");
  }
  return new Function(...names, `return \`${template}\`;`)(...vals);
}

type NavigateOptions = {
  to: string;
};

declare global {
  interface Window {
    spaBase: string;
    openmrsBase: string;
    getOpenmrsSpaBase: () => string;
  }
}
