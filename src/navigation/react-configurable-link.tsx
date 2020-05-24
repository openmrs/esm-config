import React, { FunctionComponent } from "react";
import { navigate, interpolateUrl } from "./navigate";

const ConfigurableLink: FunctionComponent<ConfigurableLinkProps> = ({
  to,
  children,
  ...otherProps
}) => (
  <a
    onClick={event => handleClick(event, to)}
    href={interpolateUrl(to)}
    {...otherProps}
  >
    {children}
  </a>
);

function handleClick(event, url: string) {
  if (!event.ctrlKey && !event.metaKey && event.which == 0) {
    event.preventDefault();
    navigate({ to: url });
  }
}

type ConfigurableLinkProps = {
  to: string;
  className?: string;
};

export default ConfigurableLink;
