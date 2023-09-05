/* Imports */
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { useEffect, memo, useState } from "react";
import AgeSplitModal from "./ageSplitModal";

/* Chart code */
interface AgeProps {
  data: {
    code: string;
    male: string;
    female: string;
  }[];
  followers?: number;
}
const AgeGenderColumns: React.FC<AgeProps> = ({ data, followers }) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  useEffect(() => {
    am4core.useTheme(am4themes_animated);
    // Themes end

    let chart = am4core.create("ageGender", am4charts.XYChart);
    chart.colors.step = 2;
    chart.colors.list = [
      am4core.color("#00000054"), // First color
      am4core.color("#595d66"), // Second color
      // am4core.color("#0000FF"), // Third color
      // Add more colors as needed
    ];

    let xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    xAxis.dataFields.category = "code";
    xAxis.renderer.cellStartLocation = 0.3;
    xAxis.renderer.cellEndLocation = 0.9;
    xAxis.renderer.grid.template.location = 0;
    xAxis.renderer.labels.template.fontSize = 13;
    xAxis.renderer.minGridDistance = 30;
    xAxis.renderer.labels.template.wrap = true;
    xAxis.renderer.labels.template.maxWidth = 150;
    xAxis.renderer.labels.template.truncate = true;
    xAxis.renderer.grid.template.strokeOpacity = 0;
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
      series.columns.template.width = 20;
      const columnTemplate = series.columns.template;

      columnTemplate.column.cornerRadius(60, 60, 10, 10);
      //   series.fill = "black";

      let bullet = series.bullets.push(new am4charts.LabelBullet());
      bullet.interactionsEnabled = false;
      bullet.dy = -10;
      bullet.label.text = "{valueY.formatNumber('#0.00' * 100)}%";
      bullet.label.adapter.add("html", function (text, data: any) {
        if (data.dataItem?.dataContext) {
          return value == "male"
            ? (data.dataItem?.dataContext?.male * 100).toFixed(1) + "%"
            : (data.dataItem?.dataContext?.female * 100).toFixed(1) + "%";
        }
        return text;
      });

      bullet.label.fontSize = 10;

      bullet.label.fill = am4core.color("black");

      return series;
    }

    chart.data = data;
    createSeries("female", "The First");
    createSeries("male", "The Second");
    return () => chart.dispose();
  }, [data]);

  return (
    <>
      <AgeSplitModal
        followers={followers}
        modal={showModal}
        setModal={setShowModal}
        data={data}
      />
      <div style={{ height: "300px" }} className="" id="ageGender" />{" "}
      <p
        style={{ cursor: "pointer" }}
        onClick={() => setShowModal(true)}
        className="mx-4 "
      >
        view more
      </p>
    </>
  );
};
export default memo(AgeGenderColumns);
