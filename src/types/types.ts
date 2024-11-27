export interface Profession {
  name: string;
  mainSkills: string[];
  otherSkills: string[];
}

export interface Item {
  id: string;
  name: string;
  category: "profession" | "skill";
  symbolSize: number;
  itemStyle: { color: string, border?: string, boxShadow?: string };
  x: number;
  y: number;
}

export interface Link {
  source: string;
  target: string;
  lineStyle: { color: string; width: number };
}