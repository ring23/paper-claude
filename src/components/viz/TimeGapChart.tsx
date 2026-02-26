import React from "react";
import * as d3 from "d3";
import { useD3 } from "./useD3";
import { chartTheme } from "./chartTheme";
import styles from "./TimeGapChart.module.css";

interface BraathenVizData {
  type: "braathen";
  run1Time: string;
  combinedTime: string;
  competitors: { name: string; margin: string }[];
  run1MarginNote: string;
  droughtYears: number;
  droughtEditions: number;
}

interface TimeGapChartProps {
  data: BraathenVizData;
}

const BAR_CHART_WIDTH = 300;
const BAR_CHART_HEIGHT = 120;
const TIMELINE_WIDTH = 300;
const TIMELINE_HEIGHT = 40;

export function TimeGapChart({ data }: TimeGapChartProps) {
  const barRef = useD3(
    (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>) => {
      svg.selectAll("*").remove();

      const margin = { top: 8, right: 50, bottom: 8, left: 90 };
      const width = BAR_CHART_WIDTH - margin.left - margin.right;
      const height = BAR_CHART_HEIGHT - margin.top - margin.bottom;

      const entries = [
        { name: "Braathen", margin: 0 },
        ...data.competitors.map((c) => ({
          name: c.name.split(" ").pop() as string,
          margin: parseFloat(c.margin),
        })),
      ];

      const maxMargin = d3.max(entries, (d) => d.margin) ?? 1.5;

      const x = d3.scaleLinear().domain([0, maxMargin * 1.15]).range([0, width]);

      const y = d3
        .scaleBand()
        .domain(entries.map((d) => d.name))
        .range([0, height])
        .padding(0.35);

      const g = svg
        .attr("width", BAR_CHART_WIDTH)
        .attr("height", BAR_CHART_HEIGHT)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // Bars
      g.selectAll("rect")
        .data(entries)
        .join("rect")
        .attr("x", 0)
        .attr("y", (d) => y(d.name) ?? 0)
        .attr("height", y.bandwidth())
        .attr("rx", 3)
        .attr("fill", (d) =>
          d.name === "Braathen" ? chartTheme.gold : chartTheme.navy
        )
        .attr("width", 0)
        .transition()
        .duration(800)
        .ease(d3.easeCubicOut)
        .attr("width", (d) => (d.margin === 0 ? 18 : x(d.margin)));

      // Athlete names on the left
      g.selectAll(".name-label")
        .data(entries)
        .join("text")
        .attr("class", "name-label")
        .attr("x", -6)
        .attr("y", (d) => (y(d.name) ?? 0) + y.bandwidth() / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "end")
        .attr("font-family", chartTheme.fontFamily.label)
        .attr("font-size", chartTheme.fontSize.label)
        .attr("fill", chartTheme.slate)
        .text((d) => d.name);

      // Margin values at end of bars
      g.selectAll(".margin-label")
        .data(entries)
        .join("text")
        .attr("class", "margin-label")
        .attr("y", (d) => (y(d.name) ?? 0) + y.bandwidth() / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "start")
        .attr("font-family", chartTheme.fontFamily.data)
        .attr("font-size", chartTheme.fontSize.dataSm)
        .attr("fill", chartTheme.navy)
        .attr("opacity", 0)
        .attr("x", 0)
        .transition()
        .duration(800)
        .ease(d3.easeCubicOut)
        .attr("opacity", 1)
        .attr("x", (d) => (d.margin === 0 ? 18 + 6 : x(d.margin) + 6))
        .textTween((d) => {
          if (d.margin === 0) return () => "0.00";
          const interp = d3.interpolateNumber(0, d.margin);
          return (t: number) => `+${interp(t).toFixed(2)}`;
        });
    },
    [data]
  );

  const timelineRef = useD3(
    (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>) => {
      svg.selectAll("*").remove();

      const margin = { top: 16, right: 16, bottom: 8, left: 16 };
      const width = TIMELINE_WIDTH - margin.left - margin.right;
      const lineY = TIMELINE_HEIGHT - margin.bottom - 4;

      const g = svg
        .attr("width", TIMELINE_WIDTH)
        .attr("height", TIMELINE_HEIGHT)
        .append("g")
        .attr("transform", `translate(${margin.left},0)`);

      // Horizontal line
      g.append("line")
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", lineY)
        .attr("y2", lineY)
        .attr("stroke", chartTheme.mist)
        .attr("stroke-width", 1.5);

      // Gold dot at 2026 end
      g.append("circle")
        .attr("cx", width)
        .attr("cy", lineY)
        .attr("r", 4)
        .attr("fill", chartTheme.gold);

      // Year labels
      g.append("text")
        .attr("x", 0)
        .attr("y", lineY + 12)
        .attr("font-family", chartTheme.fontFamily.label)
        .attr("font-size", chartTheme.fontSize.label)
        .attr("fill", chartTheme.slate)
        .text("1924");

      g.append("text")
        .attr("x", width)
        .attr("y", lineY + 12)
        .attr("text-anchor", "end")
        .attr("font-family", chartTheme.fontFamily.label)
        .attr("font-size", chartTheme.fontSize.label)
        .attr("fill", chartTheme.slate)
        .text("2026");

      // Annotation above line
      g.append("text")
        .attr("x", width / 2)
        .attr("y", lineY - 8)
        .attr("text-anchor", "middle")
        .attr("font-family", chartTheme.fontFamily.data)
        .attr("font-size", chartTheme.fontSize.dataSm)
        .attr("fill", chartTheme.navy)
        .text(`${data.droughtYears} years · 0 South American medals`);
    },
    [data]
  );

  return (
    <div className={styles.wrapper}>
      <svg ref={barRef} />
      <svg ref={timelineRef} />
    </div>
  );
}

export default TimeGapChart;
