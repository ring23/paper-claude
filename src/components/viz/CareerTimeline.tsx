import React from "react";
import * as d3 from "d3";
import { useD3 } from "./useD3";
import { chartTheme } from "./chartTheme";
import styles from "./CareerTimeline.module.css";

interface MeyersTaylorVizData {
  type: "meyers-taylor";
  totalTime: string;
  silverMargin: string;
  bronzeMargin: string;
  heat4Time: string;
  trailedThrough: string;
  age: number;
  careerMedals: {
    year: number;
    city: string;
    event: string;
    medal: "gold" | "silver" | "bronze";
  }[];
  totalMedalCount: { gold: number; silver: number; bronze: number };
}

interface CareerTimelineProps {
  data: MeyersTaylorVizData;
}

const WIDTH = 360;
const HEIGHT = 140;

const MEDAL_COLORS: Record<string, string> = {
  bronze: "#CD7F32",
  silver: "#C0C0C0",
  gold: chartTheme.gold,
};

export function CareerTimeline({ data }: CareerTimelineProps) {
  const ref = useD3(
    (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>) => {
      const margin = { top: 24, right: 30, bottom: 40, left: 30 };
      const width = WIDTH - margin.left - margin.right;
      const lineY = 50;

      svg.attr("width", WIDTH).attr("height", HEIGHT);

      // Glow filter for the 2026 gold medal
      const defs = svg.append("defs");
      const filter = defs
        .append("filter")
        .attr("id", "gold-glow")
        .attr("x", "-50%")
        .attr("y", "-50%")
        .attr("width", "200%")
        .attr("height", "200%");
      filter
        .append("feGaussianBlur")
        .attr("stdDeviation", "3")
        .attr("result", "blur");
      const merge = filter.append("feMerge");
      merge.append("feMergeNode").attr("in", "blur");
      merge.append("feMergeNode").attr("in", "SourceGraphic");

      const g = svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // Unique years for the scale
      const years = [2010, 2014, 2018, 2022, 2026];

      const x = d3.scalePoint<number>().domain(years).range([0, width]);

      // Horizontal connecting line
      g.append("line")
        .attr("x1", x(2010)!)
        .attr("x2", x(2026)!)
        .attr("y1", lineY)
        .attr("y2", lineY)
        .attr("stroke", chartTheme.mist)
        .attr("stroke-width", 1.5)
        .attr("stroke-opacity", 0.5);

      // Group medals by year for positioning
      interface MedalNode {
        year: number;
        city: string;
        event: string;
        medal: "gold" | "silver" | "bronze";
        cx: number;
        cy: number;
        r: number;
        index: number; // sequential index for stagger animation
      }

      const nodes: MedalNode[] = [];
      let seqIndex = 0;

      years.forEach((year) => {
        const yearMedals = data.careerMedals.filter((m) => m.year === year);
        if (yearMedals.length === 1) {
          const m = yearMedals[0];
          const isGold2026 = m.year === 2026 && m.medal === "gold";
          nodes.push({
            year: m.year,
            city: m.city,
            event: m.event,
            medal: m.medal,
            cx: x(year)!,
            cy: lineY,
            r: isGold2026 ? 10 : 7,
            index: seqIndex++,
          });
        } else if (yearMedals.length === 2) {
          // Stack two medals vertically
          yearMedals.forEach((m, i) => {
            nodes.push({
              year: m.year,
              city: m.city,
              event: m.event,
              medal: m.medal,
              cx: x(year)!,
              cy: lineY + (i === 0 ? -9 : 9),
              r: 7,
              index: seqIndex++,
            });
          });
        }
      });

      // Medal circles with staggered animation
      g.selectAll("circle.medal")
        .data(nodes)
        .join("circle")
        .attr("class", "medal")
        .attr("cx", (d) => d.cx)
        .attr("cy", (d) => d.cy)
        .attr("r", 0)
        .attr("fill", (d) => MEDAL_COLORS[d.medal])
        .attr("filter", (d) =>
          d.year === 2026 && d.medal === "gold" ? "url(#gold-glow)" : null
        )
        .transition()
        .duration(400)
        .delay((d) => d.index * 200)
        .ease(d3.easeBackOut.overshoot(1.4))
        .attr("r", (d) => d.r);

      // Pulse animation for the 2026 gold node
      const gold2026 = nodes.find(
        (n) => n.year === 2026 && n.medal === "gold"
      );
      if (gold2026) {
        const pulseCircle = g
          .append("circle")
          .attr("cx", gold2026.cx)
          .attr("cy", gold2026.cy)
          .attr("r", 10)
          .attr("fill", "none")
          .attr("stroke", chartTheme.gold)
          .attr("stroke-width", 2)
          .attr("opacity", 0);

        // Start pulse after the medal appears
        pulseCircle
          .transition()
          .delay(gold2026.index * 200 + 400)
          .duration(0)
          .attr("opacity", 0.6)
          .transition()
          .duration(1000)
          .ease(d3.easeCubicOut)
          .attr("r", 18)
          .attr("opacity", 0)
          .on("end", function repeat() {
            d3.select(this)
              .attr("r", 10)
              .attr("opacity", 0.6)
              .transition()
              .duration(1000)
              .ease(d3.easeCubicOut)
              .attr("r", 18)
              .attr("opacity", 0)
              .on("end", repeat);
          });
      }

      // City labels below each year node
      const cityLabels = years.map((year) => {
        const m = data.careerMedals.find((medal) => medal.year === year);
        return { year, city: m?.city ?? "" };
      });

      g.selectAll("text.city")
        .data(cityLabels)
        .join("text")
        .attr("class", "city")
        .attr("x", (d) => x(d.year)!)
        .attr("y", lineY + 28)
        .attr("text-anchor", "middle")
        .attr("font-family", chartTheme.fontFamily.label)
        .attr("font-size", chartTheme.fontSize.label)
        .attr("fill", chartTheme.slate)
        .attr("opacity", 0)
        .text((d) => d.city)
        .transition()
        .delay((_, i) => i * 200)
        .duration(300)
        .attr("opacity", 1);

      // Year labels above each node
      g.selectAll("text.year")
        .data(years)
        .join("text")
        .attr("class", "year")
        .attr("x", (d) => x(d)!)
        .attr("y", lineY - 22)
        .attr("text-anchor", "middle")
        .attr("font-family", chartTheme.fontFamily.label)
        .attr("font-size", chartTheme.fontSize.label)
        .attr("fill", chartTheme.mist)
        .attr("opacity", 0)
        .text((d) => d)
        .transition()
        .delay((_, i) => i * 200)
        .duration(300)
        .attr("opacity", 1);

      // "59.51s" callout below 2026 node
      g.append("text")
        .attr("x", x(2026)!)
        .attr("y", lineY + 42)
        .attr("text-anchor", "middle")
        .attr("font-family", chartTheme.fontFamily.data)
        .attr("font-size", chartTheme.fontSize.dataSm)
        .attr("fill", chartTheme.navy)
        .attr("font-weight", 600)
        .attr("opacity", 0)
        .text(`${data.heat4Time}s`)
        .transition()
        .delay(years.length * 200 + 200)
        .duration(400)
        .attr("opacity", 1);
    },
    [data]
  );

  return (
    <div className={styles.wrapper}>
      <svg ref={ref} />
    </div>
  );
}

export default CareerTimeline;
