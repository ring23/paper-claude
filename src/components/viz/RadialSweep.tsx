import * as d3 from "d3";
import { useD3 } from "./useD3";
import { chartTheme } from "./chartTheme";
import styles from "./RadialSweep.module.css";

interface RadialSweepProps {
  events: { event: string; margin?: string; marginNote?: string }[];
}

export default function RadialSweep({ events }: RadialSweepProps) {
  const width = 160;
  const height = 160;
  const cx = width / 2;
  const cy = height / 2;
  const innerRadius = 35;
  const outerRadius = 60;

  const ref = useD3(
    (svg) => {
      const g = svg.append("g").attr("transform", `translate(${cx},${cy})`);

      // Create 6 equal segments using d3.pie
      const pieGen = d3
        .pie<{ event: string }>()
        .value(1)
        .sort(null)
        .startAngle(-Math.PI / 2)
        .endAngle(-Math.PI / 2 + 2 * Math.PI);

      const arcs = pieGen(events);

      const arcGen = d3
        .arc<d3.PieArcDatum<{ event: string }>>()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius)
        .padAngle(0.04)
        .cornerRadius(2);

      // Background ring (muted)
      arcs.forEach((arc) => {
        g.append("path")
          .attr("d", arcGen(arc))
          .attr("fill", chartTheme.mist)
          .attr("opacity", 0.25);
      });

      // Animated gold segments — staggered, each sweeping open
      const segmentDelay = 300;
      const segmentDuration = 400;

      arcs.forEach((arc, i) => {
        const segment = g
          .append("path")
          .datum(arc)
          .attr(
            "d",
            arcGen({
              ...arc,
              endAngle: arc.startAngle,
            })
          )
          .attr("fill", chartTheme.gold);

        segment
          .transition()
          .delay(i * segmentDelay)
          .duration(segmentDuration)
          .ease(d3.easeCubicOut)
          .attrTween("d", () => {
            const interp = d3.interpolate(arc.startAngle, arc.endAngle);
            return (t: number) =>
              arcGen({ ...arc, endAngle: interp(t) }) ?? "";
          });
      });

      // Center text "6/6" — appears after all segments finish
      const totalDelay = (events.length - 1) * segmentDelay + segmentDuration;

      const centerText = g
        .append("text")
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "central")
        .attr("fill", chartTheme.navy)
        .attr("font-family", chartTheme.fontFamily.data)
        .attr("font-size", chartTheme.fontSize.dataLg)
        .attr("font-weight", 700)
        .attr("opacity", 0)
        .text(`${events.length}/${events.length}`);

      centerText
        .transition()
        .delay(totalDelay)
        .duration(300)
        .attr("opacity", 1);
    },
    [events]
  );

  return (
    <div className={styles.wrapper}>
      <svg ref={ref} width={width} height={height} />
    </div>
  );
}
