import { useState, useLayoutEffect } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { FormatNumber } from "./formatFunction";
import EngagementsModal from "./engagmentsModal";
am4core.useTheme(am4themes_animated);
am4core.options.autoDispose = true;
am4core.options.commercialLicense = true;
interface DataTypes {
  data: { total: number; min: number; max: number }[];
  picture: string;
}
const Engagements: React.FC<DataTypes> = ({ data, picture }) => {
  const [showModal, setShowModal] = useState<boolean>(false);

  useLayoutEffect(() => {
    let x = am4core.create("chartdiv", am4charts.XYChart);

    x.paddingRight = 20;

    x.data = data;
    x.x = am4core.percent(-15);

    let categoryAxis = x.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "total";
    categoryAxis.renderer.grid.template.disabled = true;
    categoryAxis.renderer.labels.template.disabled = true;
    let axisTooltip = categoryAxis.tooltip;
    axisTooltip.background.fill = am4core.color("#fff", 0.8);
    axisTooltip.dy = -140;
    axisTooltip.background.cornerRadius = 100;

    axisTooltip.background.strokeWidth = 0;

    categoryAxis.tooltip.label.adapter.add("html", function (text, target) {
      //add the image to the tooltip
      let dataItem = target.tooltipDataItem;
      if (dataItem) {
        return `<Card class="text-dark"> <b> ${(
          dataItem.dataContext.max * 100
        ).toFixed(1)}%   ${
          dataItem.dataContext.min
            ? "- " + (dataItem.dataContext.min * 100).toFixed(1) + "%"
            : ""
        }  </b> <br> <small> ${FormatNumber(
          dataItem.dataContext.total,
        )} Median </small> </Card> `;
      }
      return text;
    });

    categoryAxis.renderer.line.strokeWidth = 5;
    categoryAxis.renderer.line.strokeOpacity = 1;

    //give category axis a right padding as the column series will be aligned to the right

    categoryAxis.renderer.line.stroke = am4core.color("#e5e5e5");

    let valueAxis = x.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;
    valueAxis.renderer.minWidth = 35;
    valueAxis.renderer.grid.template.disabled = true;
    valueAxis.renderer.labels.template.disabled = true;

    let series = x.series.push(new am4charts.ColumnSeries());
    series.tooltip.disabled = true;
    series.dataFields.categoryX = "total";
    series.dataFields.valueY = "total";
    series.tooltipText = "{valueY.value}";
    series.fill = am4core.color("#e5e5e5");
    series.stroke = am4core.color("#e5e5e5");
    series.columns.template.width = am4core.percent(40);
    series.events.on("inited", function () {
      series.columns.each(function (column) {
        column.toBack();
        if (column.dataItem.dataContext?.median) {
          let bullet = column.createChild(am4core.Image);
          bullet.href = picture;

          bullet.x = am4core.percent(50);
          bullet.y = am4core.percent(100);
          bullet.width = 40;
          bullet.height = 40;
          bullet.verticalCenter = "bottom";
          bullet.dy = -3;
          bullet.toFront();
        }
      });
    });

    let columnTemplate = series.columns.template;
    let hoverState = columnTemplate.states.create("hover");
    hoverState.properties.fill = am4core.color("#666871");
    hoverState.properties.stroke = am4core.color("#666871");

    // series.columns.template.events.on("over", function (e) {
    //   let index = e.target.dataItem.index;
    // });

    series.columns.template.events.on("out", function () {
      categoryAxis.renderer.line.animate(
        [
          {
            property: "stroke",
            to: am4core.color("#e5e5e5"),
          },
        ],
        500,
      );
    });

    x.cursor = new am4charts.XYCursor();

    return () => {
      x.dispose();
    };
  }, [data]);

  return (
    <>
      {" "}
      <EngagementsModal modal={showModal} setModal={setShowModal} data={data} />
      <div id="chartdiv" style={{ width: "300px", height: "200px" }}></div>{" "}
      <p style={{ cursor: "pointer" }} onClick={() => setShowModal(true)}>
        view more
      </p>
    </>
  );
};

export default Engagements;
