import * as d3 from "d3";
import { useD3 } from "./useD3";
import { chartTheme } from "./chartTheme";
import styles from "./ShotChart.module.css";

interface ShotData {
  total: { usa: number; canada: number };
  p2: { usa: number; canada: number };
}

interface ShotChartProps {
  shots: ShotData;
}

const USA_BLUE = "#5BA3D9";

export default function ShotChart({ shots }: ShotChartProps) {
  const width = 220;
  const height = 120;
  const margin = { top: 18, right: 10, bottom: 22, left: 10 };
  const chartW = width - margin.left - margin.right;
  const chartH = height - margin.top - margin.bottom;

  // Derive "Other" = total - p2 (combined P1 + P3 + OT)
  const otherCan = shots.total.canada - shots.p2.canada;
  const otherUsa = shots.total.usa - shots.p2.usa;

  const groups = [
    { label: "P2", canada: shots.p2.canada, usa: shots.p2.usa },
    { label: "Other", canada: otherCan, usa: otherUsa },
  ];

  const maxVal = d3.max(groups, (d) => Math.max(d.canada, d.usa)) ?? 20;

  const ref = useD3(
    (svg) => {
      const g = svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      const x0 = d3
        .scaleBand()
        .domain(groups.map((d) => d.label))
        .range([0, chartW])
        .paddingInner(0.35)
        .paddingOuter(0.15);

      const x1 = d3
        .scaleBand<string>()
        .domain(["CAN", "USA"])
        .range([0, x0.bandwidth()])
        .padding(0.15);

      const y = d3
        .scaleLinear()
        .domain([0, maxVal + 4])
        .range([chartH, 0]);

      // Draw bars for each group
      groups.forEach((group) => {
        const groupG = g
          .append("g")
          .attr("transform", `translate(${x0(group.label) ?? 0},0)`);

        const bars = [
          { key: "CAN", value: group.canada, fill: chartTheme.slate },
          { key: "USA", value: group.usa, fill: USA_BLUE },
        ];

        bars.forEach((bar) => {
          const barX = x1(bar.key) ?? 0;
          const barW = x1.bandwidth();

          // Animated bar — starts with 0 height
          groupG
            .append("rect")
            .attr("x", barX)
            .attr("y", chartH)
            .attr("width", barW)
            .attr("height", 0)
            .attr("rx", 2)
            .attr("fill", bar.fill)
            .transition()
            .duration(800)
            .ease(d3.easeCubicOut)
            .attr("y", y(bar.value))
            .attr("height", chartH - y(bar.value));

          // Value label above bar — fades in
          groupG
            .append("text")
            .attr("x", barX + barW / 2)
            .attr("y", y(bar.value) - 4)
            .attr("text-anchor", "middle")
            .attr("fill", chartTheme.navy)
            .attr("font-family", chartTheme.fontFamily.data)
            .attr("font-size", chartTheme.fontSize.dataSm)
            .attr("font-weight", 600)
            .attr("opacity", 0)
            .text(bar.value)
            .transition()
            .delay(600)
            .duration(400)
            .attr("opacity", 1);
        });
      });

      // Group labels along the bottom
      g.selectAll(".group-label")
        .data(groups)
        .join("text")
        .attr("class", "group-label")
        .attr("x", (d) => (x0(d.label) ?? 0) + x0.bandwidth() / 2)
        .attr("y", chartH + 14)
        .attr("text-anchor", "middle")
        .attr("fill", chartTheme.slate)
        .attr("font-family", chartTheme.fontFamily.label)
        .attr("font-size", chartTheme.fontSize.label)
        .text((d) => d.label);

      // Legend
      const legend = svg
        .append("g")
        .attr("transform", `translate(${width - margin.right - 90}, 8)`);

      [
        { label: "CAN", color: chartTheme.slate },
        { label: "USA", color: USA_BLUE },
      ].forEach((item, i) => {
        const lg = legend
          .append("g")
          .attr("transform", `translate(${i * 48}, 0)`);

        lg.append("rect")
          .attr("width", 8)
          .attr("height", 8)
          .attr("rx", 2)
          .attr("fill", item.color);

        lg.append("text")
          .attr("x", 11)
          .attr("y", 8)
          .attr("fill", chartTheme.navy)
          .attr("font-family", chartTheme.fontFamily.label)
          .attr("font-size", chartTheme.fontSize.label)
          .text(item.label);
      });
    },
    [shots]
  );

  return (
    <div className={styles.wrapper}>
      <svg ref={ref} width={width} height={height} />
    </div>
  );
}
