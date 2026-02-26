import * as d3 from "d3";
import { useD3 } from "./useD3";
import { chartTheme } from "./chartTheme";
import styles from "./SaveGauge.module.css";

interface SaveGaugeProps {
  saves: number;
  shotsAgainst: number;
  savePercentage: number;
}

export default function SaveGauge({ saves, shotsAgainst, savePercentage }: SaveGaugeProps) {
  const width = 140;
  const height = 140;
  const cx = width / 2;
  const cy = height / 2;
  const outerRadius = 58;
  const innerRadius = 44;

  // 270° sweep: from -135° to +135° (in radians)
  const startAngle = (-3 / 4) * Math.PI;
  const endAngleFull = (3 / 4) * Math.PI;
  const fraction = shotsAgainst > 0 ? saves / shotsAgainst : 0;
  const targetEndAngle = startAngle + fraction * (endAngleFull - startAngle);

  const ref = useD3(
    (svg) => {
      const g = svg.append("g").attr("transform", `translate(${cx},${cy})`);

      const arcGen = d3
        .arc<{ startAngle: number; endAngle: number }>()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius)
        .cornerRadius(4);

      // Background arc (full 270°)
      g.append("path")
        .datum({ startAngle, endAngle: endAngleFull })
        .attr("d", arcGen)
        .attr("fill", chartTheme.mist)
        .attr("opacity", 0.3);

      // Filled arc — animate from startAngle to targetEndAngle
      const filled = g
        .append("path")
        .datum({ startAngle, endAngle: startAngle })
        .attr("d", arcGen)
        .attr("fill", chartTheme.gold);

      filled
        .transition()
        .duration(1000)
        .ease(d3.easeCubicOut)
        .attrTween("d", () => {
          const interp = d3.interpolate(startAngle, targetEndAngle);
          return (t: number) =>
            arcGen({ startAngle, endAngle: interp(t) }) ?? "";
        });

      // Center percentage text
      g.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "-0.1em")
        .attr("fill", chartTheme.navy)
        .attr("font-family", chartTheme.fontFamily.data)
        .attr("font-size", chartTheme.fontSize.dataLg)
        .attr("font-weight", 700)
        .text(`${savePercentage.toFixed(1)}%`);

      // Sub-label
      g.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "1.4em")
        .attr("fill", chartTheme.slate)
        .attr("font-family", chartTheme.fontFamily.label)
        .attr("font-size", chartTheme.fontSize.label)
        .text(`${saves} of ${shotsAgainst} saves`);
    },
    [saves, shotsAgainst, savePercentage]
  );

  return (
    <div className={styles.wrapper}>
      <svg ref={ref} width={width} height={height} />
    </div>
  );
}
