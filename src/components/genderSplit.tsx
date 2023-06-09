import React, { useEffect, useState } from "react";
import { create, useTheme } from "@amcharts/amcharts4/core";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { PieChart, PieSeries, Legend } from "@amcharts/amcharts4/charts";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import AgeSplitModal from "./genderModal";
// Apply the animated theme

interface StepCountChartProps {
  data: { code: string; weight: number }[];
}
const DonutChart: React.FC<StepCountChartProps> = ({ data }) => {
  useTheme(am4themes_animated);

  useEffect(() => {
    // Create chart instance

    const chart = create("gendersplit", PieChart);
    chart.width = 150;
    chart.x = am4core.percent(25);
    chart;
    // Disable labels and ticks on the inner radius of the donut chart
    chart.innerRadius = am4core.percent(55);
    const updatedData = data?.map((item, index) => {
      if (item.code === "FEMALE") {
        return {
          ...item,
          color: "#ababab",
        };
      } else {
        return {
          ...item,
          color: "#595966",
        };
      }
    });
    // Add data
    chart.data = updatedData;

    // Create series
    const series = chart.series.push(new PieSeries());
    series.dataFields.value = "weight";
    series.dataFields.category = "code";
    var rgm = new am4core.RadialGradientModifier();
    rgm.brightnesses.push(-0.8, -0.8, -0.5, 0, -0.5);

    series.slices.template.propertyFields.fill = "color";
    series.tooltip.background.stroke = am4core.color("#595d66");
    series.slices.template.stroke = am4core.color("#595d66");
    series.slices.template.strokeWidth = 1;
    series.slices.template.strokeOpacity = 1;
    // Add labels
    series.tooltip.label.adapter.add("text", (text, target) => {
      const category = target.tooltipDataItem.category;
      const value = target.tooltipDataItem.value;

      return `[bold]${category}[/]\nValue: ${(value * 100).toFixed(2)}%`;
    });

    series.labels.template.disabled = true;

    chart.legend = new am4charts.Legend();
    chart.legend.labels.template.html = `<small >{code}</small> <br>`;

    // Cleanup on component unmount
    return () => {
      chart.dispose();
    };
  }, []);
  const [showModal, setShowModal] = useState<boolean>(false);

  return (
    <>
      <AgeSplitModal modal={showModal} setModal={setShowModal} data={data} />
      <div
        style={{ height: "300px" }}
        className="mb-2 mx-auto"
        id="gendersplit"
      />
      <p
        onClick={() => setShowModal(true)}
        style={{ cursor: "pointer" }}
        className="mx-4 "
      >
        view more
      </p>
    </>
  );
};

export default DonutChart;
