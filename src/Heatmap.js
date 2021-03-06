import { Component } from "react";
import * as d3 from 'd3';

class Heatmap extends Component{
    constructor(props){
        super(props)
        this.drawHeatmap = this.drawHeatmap.bind(this);
        this.colorCode = this.colorCode.bind(this);
    }
    componentDidMount(){
        fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json").then(response => response.json()).then(data => {this.drawHeatmap(data);return data;});
    }
    colorCode(variance){
        let temp = variance + 8.66;
        temp=temp.toFixed(1);
        if(temp<=3.9){
            return "rgb(69, 117, 180)";
        }
        else if(temp<=5){
            return "rgb(116, 173, 209)"; 
        }
        else if(temp<=6.1){
            return "rgb(171, 217, 233)"; 
        }
        else if(temp<=7.2){
            return "rgb(224, 243, 248)"; 
        }
        else if(temp<=8.3){
            return "rgb(255, 255, 191)"; 
        }
        else if(temp<=9.5){
            return "rgb(254, 224, 144)"; 
        }
        else if(temp<=10.6){
            return "rgb(253, 174, 97)"; 
        }
        else if(temp<=11.7){
            return "rgb(244, 109, 67)"; 
        }
        else if(12.8<=temp){
            return "rgb(215, 48, 39)"; 
        }
        return "rgb(215, 48, 39)";
    }
    drawHeatmap(data){
        console.log(data.monthlyVariance[0]);
        data.monthlyVariance = data.monthlyVariance.map(x => {
            switch (x.month) {
                case 1:
                    return {month:"January",year:x.year,variance:x.variance};
                case 2:
                    return {month:"February",year:x.year,variance:x.variance};
                case 3:
                    return {month:"March",year:x.year,variance:x.variance};
                case 4:
                    return {month:"April",year:x.year,variance:x.variance};
                case 5:
                    return {month:"May",year:x.year,variance:x.variance};
                case 6:
                    return {month:"June",year:x.year,variance:x.variance};
                case 7:
                    return {month:"July",year:x.year,variance:x.variance};
                case 8:
                    return {month:"August",year:x.year,variance:x.variance};
                case 9:
                    return {month:"September",year:x.year,variance:x.variance};
                case 10:
                    return {month:"October",year:x.year,variance:x.variance};
                case 11:
                    return {month:"November",year:x.year,variance:x.variance};
                case 12:
                    return {month:"December",year:x.year,variance:x.variance};     
                default:
                    return x
            }
        })
        var margin = {top: 10, right: 30, bottom: 90, left: 40},
            width = 1250 - margin.left - margin.right,
            height = 550 - margin.top - margin.bottom;
        var svg=d3.select(this.refs.canvas).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .style("border", "1px solid black")
            .append("g")
            .attr("transform","translate(" + margin.left + "," + margin.top + ")");
        var maxYear = d3.max(data.monthlyVariance, (d,i)=> {
            return d.year
        });
        var minYear = d3.min(data.monthlyVariance, (d,i)=> {
            return d.year;
        });
        let array = [];
        for (let index = 1760; index <= 2010; index=index+10) {
            array.push(index);
        }
        var x = d3.scaleLinear();
        x.range([0,width]);
        x.domain([minYear,maxYear]);
        svg.append("g")
        .attr("transform", "translate(20," + height + ")")
        .call(d3.axisBottom(x).tickValues(array));
        let months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
        months = months.reverse();
        var y = d3.scaleBand();
        y.range([height,0])
        y.domain(months);
        svg.append("g").call(d3.axisLeft(y)).attr("transform", "translate(20,0)");

        const tooltip = d3.select("body")
        .append("div")
        .attr("class","d3-tooltip")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .style("color", "#fff")
        .text("a simple tooltip"); 

        svg.selectAll("mybar")
        .data(data.monthlyVariance)
        .enter()
        .append("rect")
        .attr("x",(d,i) =>{
            return x(d.year) + 20;
        })
        .attr("y",(d,i)=> {
            return y(d.month);
        })
        .attr("width",3)
        .attr("height",37.3)
        .style("stroke", "black")
        .style("stroke-width", "0.1px")
        .style("fill",(d,i)=>{
            let color = this.colorCode(d.variance);
            return color;
        })
        .on("mouseover", function(d, i) {
            tooltip.html(`<div>${i.year} - ${i.month}<br/>${(i.variance+8.66).toFixed(1)+"???"}<br/>${i.variance.toFixed(1)+"???"}</d>`).style("visibility", "visible");
          })
        .on("mousemove", function(event){
            tooltip
              .style("top", (event.pageY-10)+"px")
              .style("left",(event.pageX+10)+"px");
        })
        .on("mouseout", function() {
            tooltip.html(``).style("visibility", "hidden");
          });
        
        svg.append("text")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .attr("y", -20)
            .attr("x", -200)
            .style("fill","black")
            .style("font-size","16")
            .text("Months");  
        svg.append("text")
            .attr("text-anchor", "end")
            .attr("y", 490)
            .attr("x", 1250/2-10)
            .style("fill","black")
            .style("font-size","16")
            .text("Years");
        svg.append("defs")
        .append("linearGradient")
        .attr("id", "legendGradientMulti")
        .attr("x1", "0%").attr("y1", "0%")
        .attr("x2", "100%").attr("y2", "0%")
        .selectAll("stop")
        .data([
        {offset: "0%", color: "rgb(69, 117, 180)"},
        {offset: "12.5%", color: "rgb(116, 173, 209)"},
        {offset: "25%", color: "rgb(171, 217, 233)"},
        {offset: "37.5%", color: "rgb(224, 243, 248)"},
        {offset: "50%", color: "rgb(255, 255, 191)"},
        {offset: "62.5%", color: "rgb(254, 224, 144)"},
        {offset: "75%", color: "rgb(253, 174, 97)"},
        {offset: "87.5%", color: "rgb(244, 109, 67)"},
        {offset: "100%", color: "rgb(215, 48, 39)"} ])
        .enter().append("stop")
        .attr("offset", function(d) { return d.offset; })
        .attr("stop-color", function(d) { return d.color; });


        var tempX = d3.scaleLinear();
        tempX.range([0,240]);
        tempX.domain([2.0,14.0]);
        var legendWidth=200;
        var legendHeight=16;
        var legendsvg = svg
        .append("g")
        .attr("id", "legend")
        .attr(
          "transform",
          "translate(" + 20 + "," + (height-20) + ")"
        );
    
        legendsvg
        .append("rect")
        .attr("class", "legendRect")
        .attr("x", 30)
        .attr("y", 74)
        .attr("width", legendWidth)
        .attr("height", legendHeight)
        .style("fill", "url(#legendGradientMulti)")
        legendsvg.append("g").attr("transform", "translate(20," + 90 + ")")
        .call(d3.axisBottom(tempX)); 

        
    }
    render(){
        return (<div ref="canvas">
        </div>);
    }
}
export default Heatmap;