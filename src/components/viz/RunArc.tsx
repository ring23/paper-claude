import * as d3 from "d3";
import { useD3 } from "./useD3";
import { chartTheme } from "./chartTheme";
import styles from "./RunArc.module.css";

interface ChoiVizData {
  type: "choi";
  runs: { run: number; score: number | null; note?: string }[];
  competitors: {
    name: string;
    bestScore: number;
    medal: "gold" | "silver" | "bronze";
  }[];
  ageYears: number;
  ageDays: number;
}

interface RunArcProps {
  data: ChoiVizData;
}

export function RunArc({ data }: RunArcProps) {
  const width = 300;
  const runChartHeight = 120;
  const lollipopHeight = 60;
  const totalHeight = runChartHeight + lollipopHeight;

  const svgRef = useD3(
    (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>) => {
      svg.attr("viewBox", `0 0 ${width} ${totalHeight}`);

      // ──────────────────────────────────────────
      // Top section: 3-point run chart
      // ──────────────────────────────────────────
      const runGroup = svg.append("g").attr("class", "run-chart");

      const margin = { top: 16, right: 30, bottom: 24, left: 30 };
      const chartW = width - margin.left - margin.right;
      const chartH = runChartHeight - margin.top - margin.bottom;

      const xScale = d3
        .scalePoint<string>()
        .domain(data.runs.map((r) => `Run ${r.run}`))
        .range([margin.left, margin.left + chartW])
        .padding(0.1);

      const yScale = d3
        .scaleLinear()
        .domain([0, 100])
        .range([margin.top + chartH, margin.top]);

      // Build points array: null scores map to y=0
      const points: [number, number][] = data.runs.map((r) => {
        const xPos = xScale(`Run ${r.run}`) ?? margin.left;
        const yPos = r.score !== null ? yScale(r.score) : yScale(0);
        return [xPos, yPos];
      });

      // Connecting line
      const lineGen = d3
        .line<[number, number]>()
        .x((d) => d[0])
        .y((d) => d[1]);

      const pathData = lineGen(points);
      if (pathData) {
        const path = runGroup
          .append("path")
          .attr("d", pathData)
          .attr("fill", "none")
          .attr("stroke", chartTheme.mist)
          .attr("stroke-width", 2)
          .attr("stroke-linecap", "round")
          .attr("stroke-linejoin", "round");

        // Animate: stroke-dasharray draw-in over 1.2s
        const totalLength = (path.node() as SVGPathElement).getTotalLength();
        path
          .attr("stroke-dasharray", totalLength)
          .attr("stroke-dashoffset", totalLength)
          .transition()
          .duration(1200)
          .ease(d3.easeQuadOut)
          .attr("stroke-dashoffset", 0);
      }

      // Points: X marks for crashes, gold circle for scoring run
      data.runs.forEach((r, i) => {
        const cx = points[i][0];
        const cy = points[i][1];

        if (r.score === null) {
          // X mark for crash/fall
          const xSize = 5;
          const xMark = runGroup
            .append("g")
            .attr("transform", `translate(${cx}, ${cy})`)
            .style("opacity", 0);

          xMark
            .append("line")
            .attr("x1", -xSize)
            .attr("y1", -xSize)
            .attr("x2", xSize)
            .attr("y2", xSize)
            .attr("stroke", chartTheme.slate)
            .attr("stroke-width", 2.5)
            .attr("stroke-linecap", "round");

          xMark
            .append("line")
            .attr("x1", xSize)
            .attr("y1", -xSize)
            .attr("x2", -xSize)
            .attr("y2", xSize)
            .attr("stroke", chartTheme.slate)
            .attr("stroke-width", 2.5)
            .attr("stroke-linecap", "round");

          // Appear at staggered times: 0ms for Run 1, 400ms for Run 2
          xMark
            .transition()
            .delay(i * 400)
            .duration(250)
            .style("opacity", 1);
        } else {
          // Gold circle for scoring run
          const circle = runGroup
            .append("circle")
            .attr("cx", cx)
            .attr("cy", yScale(0))
            .attr("r", 6)
            .attr("fill", chartTheme.gold)
            .style("opacity", 0);

          // Appear at 800ms, animate upward to actual score position
          circle
            .transition()
            .delay(800)
            .duration(400)
            .ease(d3.easeCubicOut)
            .attr("cy", cy)
            .style("opacity", 1);

          // Score label next to gold circle
          const scoreLabel = runGroup
            .append("text")
            .attr("x", cx + 10)
            .attr("y", cy)
            .attr("dy", "0.35em")
            .attr("text-anchor", "start")
            .attr("font-family", chartTheme.fontFamily.data)
            .attr("font-size", chartTheme.fontSize.dataSm)
            .attr("font-weight", 600)
            .attr("fill", chartTheme.gold)
            .style("opacity", 0)
            .text(r.score.toFixed(2));

          scoreLabel
            .transition()
            .delay(1000)
            .duration(300)
            .style("opacity", 1);
        }
      });

      // X-axis labels: "Run 1", "Run 2", "Run 3"
      data.runs.forEach((r) => {
        const xPos = xScale(`Run ${r.run}`);
        if (xPos !== undefined) {
          runGroup
            .append("text")
            .attr("x", xPos)
            .attr("y", margin.top + chartH + 16)
            .attr("text-anchor", "middle")
            .attr("font-family", chartTheme.fontFamily.label)
            .attr("font-size", chartTheme.fontSize.label)
            .attr("fill", chartTheme.slate)
            .text(`Run ${r.run}`);
        }
      });

      // ──────────────────────────────────────────
      // Bottom section: Score lollipop comparison
      // ──────────────────────────────────────────
      const lolliGroup = svg
        .append("g")
        .attr("class", "lollipop-chart")
        .attr("transform", `translate(0, ${runChartHeight})`);

      const labelWidth = 80;
      const rightPad = 10;
      const circleRadius = 5;
      const rowHeight = lollipopHeight / data.competitors.length;

      // Scale from ~82 to magnify differences
      const allScores = data.competitors.map((c) => c.bestScore);
      const scaleMin = Math.floor(Math.min(...allScores)) - 3;
      const scaleMax = Math.ceil(Math.max(...allScores)) + 1;

      const lolliX = d3
        .scaleLinear()
        .domain([scaleMin, scaleMax])
        .range([labelWidth, width - rightPad]);

      data.competitors.forEach((comp, i) => {
        const rowY = rowHeight * (i + 0.5);
        const isGold = comp.medal === "gold";
        const color = isGold ? chartTheme.gold : chartTheme.slate;

        // Name label on left
        lolliGroup
          .append("text")
          .attr("x", labelWidth - 8)
          .attr("y", rowY)
          .attr("dy", "0.35em")
          .attr("text-anchor", "end")
          .attr("font-family", chartTheme.fontFamily.label)
          .attr("font-size", chartTheme.fontSize.label)
          .attr("fill", color)
          .text(comp.name.split(" ").pop() ?? comp.name);

        // Lollipop line: animates from left to target
        const line = lolliGroup
          .append("line")
          .attr("x1", lolliX(scaleMin))
          .attr("x2", lolliX(scaleMin))
          .attr("y1", rowY)
          .attr("y2", rowY)
          .attr("stroke", color)
          .attr("stroke-width", 2)
          .attr("stroke-linecap", "round");

        line
          .transition()
          .delay(1000)
          .duration(600)
          .ease(d3.easeCubicOut)
          .attr("x2", lolliX(comp.bestScore));

        // Circle at end
        const circle = lolliGroup
          .append("circle")
          .attr("cx", lolliX(scaleMin))
          .attr("cy", rowY)
          .attr("r", circleRadius)
          .attr("fill", color);

        circle
          .transition()
          .delay(1000)
          .duration(600)
          .ease(d3.easeCubicOut)
          .attr("cx", lolliX(comp.bestScore));

        // Score label above circle
        const scoreText = lolliGroup
          .append("text")
          .attr("x", lolliX(comp.bestScore))
          .attr("y", rowY - circleRadius - 3)
          .attr("text-anchor", "middle")
          .attr("font-family", chartTheme.fontFamily.data)
          .attr("font-size", chartTheme.fontSize.label)
          .attr("font-weight", 600)
          .attr("fill", color)
          .style("opacity", 0)
          .text(comp.bestScore.toFixed(2));

        scoreText
          .transition()
          .delay(1400)
          .duration(300)
          .style("opacity", 1);
      });
    },
    [data]
  );

  return (
    <div className={styles.wrapper}>
      <svg ref={svgRef} />
    </div>
  );
}
