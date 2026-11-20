/*
 * The product line a model belongs to, for the catalogue's "Serie" facet.
 *
 * With 54 Lenovo generations in the laptop list, "Lenovo" stopped narrowing
 * anything: a buyer who wants an X1 or a T-series machine had to know the
 * search box would find it. Buyers ask for the line ("en ThinkPad T14",
 * "EliteBook"), so the facet uses the manufacturers' own line names, read
 * from the model name. Docks have no line and get none.
 */
export type ModelSeries = { id: string; label: string };

const LINES: [RegExp, ModelSeries][] = [
  [/ThinkPad X1\b/, { id: "thinkpad-x1", label: "ThinkPad X1" }],
  [/ThinkPad X13\b/, { id: "thinkpad-x13", label: "ThinkPad X13" }],
  [/ThinkPad T\d/, { id: "thinkpad-t", label: "ThinkPad T" }],
  [/ThinkPad L\d/, { id: "thinkpad-l", label: "ThinkPad L" }],
  [/ThinkPad E\d/, { id: "thinkpad-e", label: "ThinkPad E" }],
  [/ThinkPad P\d/, { id: "thinkpad-p", label: "ThinkPad P" }],
  [/EliteBook/, { id: "elitebook", label: "EliteBook" }],
  [/ProBook/, { id: "probook", label: "ProBook" }],
  [/ZBook/, { id: "zbook", label: "ZBook" }],
  [/Latitude/, { id: "latitude", label: "Latitude" }],
  [/ThinkCentre/, { id: "thinkcentre", label: "ThinkCentre" }],
  [/EliteDesk/, { id: "elitedesk", label: "EliteDesk" }],
  [/OptiPlex/, { id: "optiplex", label: "OptiPlex" }],
  [/ThinkVision/, { id: "thinkvision", label: "ThinkVision" }],
  [/EliteDisplay/, { id: "elitedisplay", label: "EliteDisplay" }],
  [/UltraSharp/, { id: "ultrasharp", label: "UltraSharp" }],
];

export function modelSeries(name: string): ModelSeries | undefined {
  return LINES.find(([pattern]) => pattern.test(name))?.[1];
}
