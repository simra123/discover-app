/* Imports */
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { useEffect, memo } from "react";

/* Chart code */
interface AgeProps {
  data: {
    code: string;
    weight: number;
  }[];
}

const Reachability: React.FC<AgeProps> = ({ data }) => {
  useEffect(() => {
    am4core.useTheme(am4themes_animated);
    // Themes end

    let chart = am4core.create("reachability", am4charts.XYChart);
    chart.colors.list = [am4core.color("#595d66")];
    chart.height = 200;
    chart.y = 0;
    let xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    xAxis.dataFields.category = "code";
    xAxis.renderer.cellStartLocation = 0.3;
    xAxis.renderer.cellEndLocation = 0.9;
    xAxis.renderer.grid.template.location = -0;
    xAxis.renderer.minGridDistance = 30;
    xAxis.renderer.labels.template.wrap = true;
    xAxis.renderer.labels.template.fontSize = 13;
    xAxis.renderer.labels.template.maxWidth = 150;
    xAxis.renderer.labels.template.truncate = true;
    xAxis.renderer.grid.template.strokeOpacity = 0;
    xAxis.renderer.labels.template.adapter.add("html", (text, target: any) => {
      if (target.dataItem?.dataContext) {
        const dataItem = target.dataItem.dataContext;

        return ` <span class=""> ${dataItem.code} <br> <small> following </small>   </span>`;
      }

      return text;
    });
    let yAxis = chart.yAxes.push(new am4charts.ValueAxis());
    yAxis.min = 0;

    xAxis.renderer.line.disabled = true;
    yAxis.renderer.grid.template.strokeOpacity = 0;
    yAxis.renderer.labels.template.disabled = true;

    function createSeries(value: string, name: string) {
      let series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueY = value;
      series.dataFields.categoryX = "code";
      series.name = name;
      series.columns.template.width = 15;
      const columnTemplate = series.columns.template;

      columnTemplate.column.cornerRadius(60, 60, 10, 10);
      //   series.fill = "black";

      let bullet = series.bullets.push(new am4charts.LabelBullet());
      bullet.interactionsEnabled = false;
      //bullet.dy = -39;
      bullet.label.text = "{valueY.formatNumber('#0.00')}%";
      bullet.label.adapter.add("html", function (text, data: any) {
        if (data.dataItem?.dataContext) {
          return `<span class="w-100  "> ${(
            data.dataItem?.dataContext?.weight * 100
          ).toFixed(1)}%   </span>`;
        }
        return text;
      });

      bullet.label.fontSize = 9;
      bullet.label.dy = 9;
      bullet.label.dx = 23;
      bullet.label.fill = am4core.color("black");

      return series;
    }

    chart.data = data;
    createSeries("weight", "The First");

    return () => chart.dispose();
  }, [data]);

  return <div style={{ height: "200px" }} className="mb-1" id="reachability" />;
};
export default memo(Reachability);
