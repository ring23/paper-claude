import * as d3 from "d3";
import { useD3 } from "./useD3";
import { chartTheme } from "./chartTheme";
import styles from "./PositionSwap.module.css";

interface LiuVizData {
  type: "liu";
  totalScore: number;
  silverScore: number;
  silverName: string;
  afterShortProgram: number;
  finalPosition: number;
  droughtYears: number;
  droughtLastWinner: string;
  droughtLastYear: number;
}

interface PositionSwapProps {
  data: LiuVizData;
}

export function PositionSwap({ data }: PositionSwapProps) {
  const svgRef = useD3(
    (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>) => {
      const width = 200;
      const height = 80;
      const dotRadius = 10;
      const dotY = 38;
      const positions = [50, 100, 150]; // x coords for 1st, 2nd, 3rd

      svg.attr("viewBox", `0 0 ${width} ${height}`);

      // Title text (top)
      const titleText = svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", 12)
        .attr("text-anchor", "middle")
        .attr("font-family", chartTheme.fontFamily.label)
        .attr("font-size", chartTheme.fontSize.label)
        .attr("fill", chartTheme.slate)
        .text("After Short Program");

      // Initial state: positions after short program
      // 1st = someone (mist), 2nd = someone (mist), 3rd = Liu (gold)
      const initialData = [
        { label: "1st", x: positions[0], color: chartTheme.mist, isLiu: false },
        { label: "2nd", x: positions[1], color: chartTheme.mist, isLiu: false },
        { label: "Liu", x: positions[2], color: chartTheme.gold, isLiu: true },
      ];

      // Dot groups
      const groups = svg
        .selectAll<SVGGElement, (typeof initialData)[number]>("g.dot-group")
        .data(initialData)
        .join("g")
        .attr("class", "dot-group")
        .attr("transform", (d) => `translate(${d.x}, ${dotY})`);

      // Circles
      groups
        .append("circle")
        .attr("r", dotRadius)
        .attr("fill", (d) => d.color)
        .attr("stroke", (d) => (d.isLiu ? chartTheme.gold : chartTheme.slate))
        .attr("stroke-width", 1.5);

      // Name labels above dots
      groups
        .append("text")
        .attr("y", -16)
        .attr("text-anchor", "middle")
        .attr("font-family", chartTheme.fontFamily.data)
        .attr("font-size", chartTheme.fontSize.dataSm)
        .attr("font-weight", (d) => (d.isLiu ? 600 : 400))
        .attr("fill", (d) => (d.isLiu ? chartTheme.gold : chartTheme.slate))
        .text((d) => (d.isLiu ? "Liu" : ""));

      // Position labels below dots
      const posLabels = groups
        .append("text")
        .attr("y", 24)
        .attr("text-anchor", "middle")
        .attr("font-family", chartTheme.fontFamily.label)
        .attr("font-size", chartTheme.fontSize.label)
        .attr("fill", chartTheme.slate)
        .text((d) => d.label);

      // After 500ms pause, animate the swap
      d3.timeout(() => {
        // Liu (index 2) moves to 1st position, others shift right
        // Final: Liu at positions[0], old-1st→2nd, old-2nd→3rd
        const finalXMap = [positions[1], positions[2], positions[0]];

        groups
          .data(finalXMap.map((x, i) => ({ ...initialData[i], targetX: x })))
          .transition()
          .duration(600)
          .ease(d3.easeCubicInOut)
          .attr("transform", (d) => `translate(${d.targetX}, ${dotY})`);

        // Update position labels
        const finalLabels = ["2nd", "3rd", "1st"];
        posLabels
          .transition()
          .duration(300)
          .style("opacity", 0)
          .on("end", function (_d, i) {
            d3.select(this).text(finalLabels[i]).transition().duration(300).style("opacity", 1);
          });

        // Update title
        titleText
          .transition()
          .duration(300)
          .style("opacity", 0)
          .on("end", function () {
            d3.select(this).text("Final Standing").transition().duration(300).style("opacity", 1);
          });
      }, 500);
    },
    [data]
  );

  return (
    <div className={styles.wrapper}>
      <svg ref={svgRef} />
    </div>
  );
}
