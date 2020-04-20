import { h } from "preact";
import {
  sourceCode,
  jsonString,
  jsonNull,
  jsonKey,
  jsonBool,
  jsonNumber,
  indent
} from "./Source.scss";
import ToggleBox from "./ToggleBox";

const replacer = (key, value) => {
  if (typeof value === "string" && key === value) {
    return <span class={jsonKey}>&quot;{value}&quot;</span>;
  }
  if (typeof value === "string") {
    return <span class={jsonString}>&quot;{value}&quot;</span>;
  }
  if (typeof value === "number") {
    return <span class={jsonNumber}>{value}</span>;
  }
  if (value === null) {
    return <span class={jsonNull}>null</span>;
  }
  if (value === true || value === false) {
    return <span class={jsonBool}>{`${value}`}</span>;
  }
  if (Array.isArray(value)) {
    return (
      <span>
        [
        <div class={indent}>
          {value.map((v, k, l) => (
            <span key={k}>
              {replacer(k, v)}
              {k < l.length - 1 ? ",\n" : "\n"}
            </span>
          ))}
        </div>
        ]
      </span>
    );
  }
  if (typeof value === "object") {
    return (
      <span>
        {"{\n"}
        <div class={indent}>
          {Object.entries(value).map(([k, v], i, l) => (
            <span key={i}>
              {replacer(k, k)}: {replacer(k, v)}
              {k < l.length - 1 ? ",\n" : "\n"}
            </span>
          ))}
        </div>
        {"}"}
      </span>
    );
  }

  return value;
};

export const Source = ({ code }) => (
  <ToggleBox term="source">
    <div class={sourceCode}>{replacer("", code)}</div>
  </ToggleBox>
);
