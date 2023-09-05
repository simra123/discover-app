import React, { useEffect, useState } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import EngagementsLikerModal from "./engagmentsLikesModal";
import moment from "moment";
import { BsFillHeartFill } from "react-icons/bs";
import { FaComment } from "react-icons/fa";
import { FormatNumber } from ".";
interface ModifiedTypes {
  likes: number;
  comments: number;
  views: number;
  shares: number;
  saves: number;
  created: string;
  xAxis: number;
  link: string;
}

const StepCountChart: React.FC = ({ data }: any) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modifiedData, setModifiedData] = useState<ModifiedTypes[]>([]);

  useEffect(() => {
    let chart = am4core.create("engageStepchart", am4charts.XYChart);
    //chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
    const statArr = data.user_profile?.recent_posts?.map(
      (item: any, i: number) => ({
        ...item.stat,
        created: moment(item.created).format("LLL"),
        xAxis: i + 1,
        link: item.link,
      }),
    );
    setModifiedData(statArr);
    chart.data = statArr.reverse();

    chart.zoomOutButton.disabled = false;
    chart.numberFormatter.numberFormat = "#,##a";
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "xAxis";
    categoryAxis.renderer.grid.template.strokeOpacity = 0;
    categoryAxis.renderer.minGridDistance = 0;
    categoryAxis.renderer.labels.template.disabled = true;
    let axisTooltip: any = categoryAxis.tooltip;
    axisTooltip.background.fill = am4core.color("#fff", 0.8);
    axisTooltip.dy = -180;
    axisTooltip.background.cornerRadius = 4;

    axisTooltip.background.strokeWidth = 0;
    categoryAxis.tooltip.label.adapter.add("html", function (text, target) {
      console.log(target.tooltipDataItem, target);
      //add the image to the tooltip
      let dataItem = target.tooltipDataItem;

      if (dataItem) {
        return `<small  class="text-dark d-flex">&#10084; ${FormatNumber(
          dataItem?.dataContext?.likes,
        )} &#x1F4AC ${FormatNumber(
          dataItem?.dataContext?.comments,
        )}   <br>  ${moment(dataItem.dataContext?.created).format(
          "MMM DD, YYYY",
        )}  </small> `;
      }
      return text;
    });
    categoryAxis.renderer.line.strokeWidth = 0;
    categoryAxis.renderer.line.strokeOpacity = 1;

    //give category axis a right padding as the column series will be aligned to the right

    categoryAxis.renderer.line.stroke = am4core.color("#e5e5e5");
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    // valueAxis.renderer.inside = true;
    valueAxis.renderer.labels.template.fillOpacity = 0.5;
    valueAxis.renderer.grid.template.strokeOpacity = 0.2;
    valueAxis.min = 0;
    valueAxis.cursorTooltipEnabled = false;

    // goal guides
    let axisRange = valueAxis.axisRanges.create();
    axisRange.value = 6000;
    axisRange.grid.strokeOpacity = 1;

    axisRange.label.fillOpacity = 1;

    valueAxis.renderer.gridContainer.zIndex = 1;

    let axisRange2 = valueAxis.axisRanges.create();
    axisRange2.value = 12000;

    axisRange2.label.fillOpacity = 0.8;

    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "likes";
    series.dataFields.categoryX = "xAxis";
    series.tooltipText = "{valuex.value}";

    let columnTemplate = series.columns.template;
    columnTemplate.width = 20;
    columnTemplate.column.cornerRadiusTopLeft = 20;
    columnTemplate.column.cornerRadiusTopRight = 20;
    columnTemplate.strokeOpacity = 0;
    columnTemplate.fill = am4core.color("#595d66");

    let cursor = new am4charts.XYCursor();
    cursor.behavior = "panY";
    chart.cursor = cursor;
    cursor.lineX.disabled = true;
    cursor.lineY.disabled = true;

    cursor.events.on("cursorpositionchanged", updateTooltip);
    // dateAxis.events.on("datarangechanged", updateTooltip);

    function updateTooltip() {
      //   dateAxis.showTooltipAtPosition(3.5);
      series.showTooltipAtPosition(1.5, 0);
      // series.tooltip.validate(); // otherwise will show other columns values for a second
    }
  }, [data]);

  return (
    <>
      <EngagementsLikerModal
        modal={showModal}
        setModal={setShowModal}
        data={modifiedData}
      />
      <div
        style={{ width: "100%", margin: "auto", height: 250 }}
        id="engageStepchart"
      />{" "}
      <p
        style={{ cursor: "pointer" }}
        onClick={() => setShowModal(true)}
        className="mx-5 mt-2"
      >
        view more
      </p>
    </>
  );
};

export default StepCountChart;
