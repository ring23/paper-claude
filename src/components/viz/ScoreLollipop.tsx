import * as d3 from "d3";
import { useD3 } from "./useD3";
import { chartTheme } from "./chartTheme";
import styles from "./ScoreLollipop.module.css";

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

interface ScoreLollipopProps {
  data: LiuVizData;
}

export function ScoreLollipop({ data }: ScoreLollipopProps) {
  const svgRef = useD3(
    (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>) => {
      const width = 300;
      const height = 60;
      const labelWidth = 70;
      const rightPad = 10;
      const circleRadius = 6;
      const rowHeight = 24;
      const topPad = 8;

      svg.attr("viewBox", `0 0 ${width} ${height}`);

      // Scale: start at ~220 to magnify the gap
      const scaleMin = 220;
      const scaleMax = Math.ceil(data.totalScore) + 1;
      const x = d3
        .scaleLinear()
        .domain([scaleMin, scaleMax])
        .range([labelWidth, width - rightPad]);

      const rows = [
        {
          name: "Liu",
          score: data.totalScore,
          color: chartTheme.gold,
          y: topPad + rowHeight * 0.5,
        },
        {
          name: data.silverName.split(" ").pop() ?? data.silverName,
          score: data.silverScore,
          color: chartTheme.slate,
          y: topPad + rowHeight * 1.5,
        },
      ];

      for (const row of rows) {
        // Name label on the left
        svg
          .append("text")
          .attr("x", labelWidth - 8)
          .attr("y", row.y)
          .attr("dy", "0.35em")
          .attr("text-anchor", "end")
          .attr("font-family", chartTheme.fontFamily.label)
          .attr("font-size", chartTheme.fontSize.label)
          .attr("fill", row.color)
          .text(row.name);

        // Lollipop line — starts at left edge, animates to score
        svg
          .append("line")
          .attr("x1", x(scaleMin))
          .attr("x2", x(scaleMin))
          .attr("y1", row.y)
          .attr("y2", row.y)
          .attr("stroke", row.color)
          .attr("stroke-width", 2)
          .attr("stroke-linecap", "round")
          .transition()
          .duration(800)
          .ease(d3.easeCubicOut)
          .attr("x2", x(row.score));

        // Circle at end — starts at left, animates to score position
        svg
          .append("circle")
          .attr("cx", x(scaleMin))
          .attr("cy", row.y)
          .attr("r", circleRadius)
          .attr("fill", row.color)
          .transition()
          .duration(800)
          .ease(d3.easeCubicOut)
          .attr("cx", x(row.score));

        // Score label — appears after animation
        svg
          .append("text")
          .attr("x", x(row.score))
          .attr("y", row.y - circleRadius - 4)
          .attr("text-anchor", "middle")
          .attr("font-family", chartTheme.fontFamily.data)
          .attr("font-size", chartTheme.fontSize.dataSm)
          .attr("font-weight", 600)
          .attr("fill", row.color)
          .style("opacity", 0)
          .text(row.score.toFixed(2))
          .transition()
          .delay(600)
          .duration(300)
          .style("opacity", 1);
      }
    },
    [data]
  );

  return (
    <div className={styles.wrapper}>
      <svg ref={svgRef} />
    </div>
  );
}
