import * as d3 from "d3";
import { useD3 } from "./useD3";
import { chartTheme } from "./chartTheme";
import styles from "./GoldLeaderboard.module.css";

interface GoldLeaderboardProps {
  careerGolds: number;
  previousRecord: { holders: string[]; golds: number };
}

export default function GoldLeaderboard({
  careerGolds,
  previousRecord,
}: GoldLeaderboardProps) {
  const width = 300;
  const barHeight = 16;
  const rowGap = 6;
  const labelWidth = 80;
  const countWidth = 28;
  const barAreaWidth = width - labelWidth - countWidth - 8;

  const leaders = [
    { name: "Klæbo", golds: careerGolds, highlight: true },
    ...previousRecord.holders.map((name) => ({
      name,
      golds: previousRecord.golds,
      highlight: false,
    })),
  ];

  const totalRows = leaders.length;
  const height = totalRows * (barHeight + rowGap) - rowGap + 8;

  const ref = useD3(
    (svg) => {
      const x = d3.scaleLinear().domain([0, 12]).range([0, barAreaWidth]);

      leaders.forEach((leader, i) => {
        const y = i * (barHeight + rowGap) + 4;

        // Name label
        svg
          .append("text")
          .attr("x", labelWidth - 8)
          .attr("y", y + barHeight / 2)
          .attr("text-anchor", "end")
          .attr("dominant-baseline", "central")
          .attr("fill", leader.highlight ? chartTheme.navy : chartTheme.slate)
          .attr("font-family", chartTheme.fontFamily.label)
          .attr("font-size", chartTheme.fontSize.label)
          .attr("font-weight", leader.highlight ? 600 : 400)
          .text(leader.name);

        // Bar — animate width from 0
        const bar = svg
          .append("rect")
          .attr("x", labelWidth)
          .attr("y", y)
          .attr("width", 0)
          .attr("height", barHeight)
          .attr("rx", 3)
          .attr("fill", leader.highlight ? chartTheme.gold : chartTheme.mist)
          .attr("opacity", leader.highlight ? 1 : 0.5);

        bar
          .transition()
          .delay(i * 100)
          .duration(600)
          .ease(d3.easeCubicOut)
          .attr("width", x(leader.golds));

        // Gold count at end of bar
        const countText = svg
          .append("text")
          .attr("x", labelWidth + x(leader.golds) + 6)
          .attr("y", y + barHeight / 2)
          .attr("dominant-baseline", "central")
          .attr("fill", leader.highlight ? chartTheme.navy : chartTheme.slate)
          .attr("font-family", chartTheme.fontFamily.data)
          .attr("font-size", chartTheme.fontSize.dataSm)
          .attr("font-weight", 700)
          .attr("opacity", 0)
          .text(leader.golds);

        countText
          .transition()
          .delay(i * 100 + 600)
          .duration(250)
          .attr("opacity", 1);
      });
    },
    [careerGolds, previousRecord]
  );

  return (
    <div className={styles.wrapper}>
      <svg ref={ref} width={width} height={height} />
    </div>
  );
}
