import React, { useEffect } from "react";
import { useTheme } from "@amcharts/amcharts4/core";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4plugins_wordCloud from "@amcharts/amcharts4/plugins/wordCloud";

interface StepCountChartProps {
  data: { tag: string; freq: number }[];
}
const WordCloud: React.FC<StepCountChartProps> = ({ data }) => {
  useTheme(am4themes_animated);

  useEffect(() => {
    let chart = am4core.create("wordCloud", am4plugins_wordCloud.WordCloud);

    let series = chart.series.push(new am4plugins_wordCloud.WordCloudSeries());

    series.data = data?.user_profile?.relevant_tags;

    series.dataFields.word = "tag";
    series.dataFields.value = "freq";
    series.randomness = 0;

    // Cleanup on component unmount
    return () => {
      chart.dispose();
    };
  }, []);

  return <div id="wordCloud" />;
};

export default WordCloud;
