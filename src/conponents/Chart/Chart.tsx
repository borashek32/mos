import { useState } from "react";
import ReactEChartsCore from "echarts-for-react/lib/core";
import * as echarts from "echarts/core";
import { GraphChart } from "echarts/charts";
import { TooltipComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { Item, Link } from "../../types/types";
import { data } from "../../data/data";
import { SKILLS_RADIUS } from "../../constants/constants";

echarts.use([TooltipComponent, GraphChart, CanvasRenderer]);

export const Chart = () => {
  const [currentFocus, setCurrentFocus] = useState<Item | null>(null);

  const Items: Item[] = [];
  const links: Link[] = [];

  // add professions
  data.forEach((profession, index) => {
    Items.push({
      id: `profession-${index}`,
      name: profession.name,
      category: "profession",
      symbolSize: 23.7,
      itemStyle: {
        color: currentFocus && currentFocus.id === `profession-${index}` ? "rgba(0, 163, 114, 1)" : "rgba(173, 173, 173, 1)",
      },      
      x: Math.cos((index / data.length) * 2 * Math.PI) * 200,
      y: Math.sin((index / data.length) * 2 * Math.PI) * 200,
    });
  });

  const skillMap = new Map<string, Item>();
  const uniqueSkills = Array.from(
    new Set(data.flatMap((profession) => [...profession.mainSkills, ...profession.otherSkills]))
  );

  // add skills
  uniqueSkills.forEach((skill, index) => {
    const angle = (index / uniqueSkills.length) * 2 * Math.PI;
    const x = Math.cos(angle) * SKILLS_RADIUS;
    const y = Math.sin(angle) * SKILLS_RADIUS;

    skillMap.set(skill, {
      id: `skill-${skill}`,
      name: skill,
      category: "skill",
      symbolSize: 27.5,
      itemStyle: { color: "rgba(255, 122, 0, 1)" },
      x,
      y,
    });
  });

  Items.push(...Array.from(skillMap.values()));

  // add connections between professions and skills
  if (currentFocus) {
    if (currentFocus.category === "profession") {
      const profession = data.find((item) => item.name === currentFocus.name);
      if (profession) {
        profession.mainSkills.forEach((skill) => {
          links.push({
            source: currentFocus.id,
            target: `skill-${skill}`,
            lineStyle: { color: "rgba(255, 122, 0, 1)", width: 2 },
          });
        });

        profession.otherSkills.forEach((skill) => {
          links.push({
            source: currentFocus.id,
            target: `skill-${skill}`,
            lineStyle: { color: "rgba(143, 89, 185, 1)", width: 2 },
          });
        });
      }
    } else if (currentFocus.category === "skill") {
      data.forEach((profession, index) => {
        if (
          profession.mainSkills.includes(currentFocus.name) ||
          profession.otherSkills.includes(currentFocus.name)
        ) {
          links.push({
            source: `profession-${index}`,
            target: currentFocus.id,
            lineStyle: {
              color: profession.mainSkills.includes(currentFocus.name)
                ? "rgba(255, 122, 0, 1)"
                : "rgba(143, 89, 185, 1)",
              width: 2,
            },
          });
        }
      });
    }
  }

  // diagram config
  const option = {
    tooltip: {
      trigger: "item",
      formatter: "{b}",
      show: currentFocus === null,
    },
    animationDuration: 1000,
    series: [
      {
        type: "graph",
        layout: "none",
        data: Items,
        links: links,
        roam: true,
        focusItemAdjacency: true,
        lineStyle: {
          width: 2,
          curveness: 0.5,
        },
        label: {
          show: true,
          position: "right",
        },
      },
    ],
  };

  const onEvents = {
    click: (params: { data: Item }) => {
      setCurrentFocus(params.data);
    },
  };

  return (
    <ReactEChartsCore
      echarts={echarts}
      option={option}
      onEvents={onEvents}
      style={{ height: "700px", width: "100%" }}
    />
  );
}