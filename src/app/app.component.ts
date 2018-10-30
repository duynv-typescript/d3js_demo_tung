import { Component, OnInit,NgModule, VERSION,enableProdMode,NgZone  } from '@angular/core';
import * as d3 from 'd3';

declare const $: any;
interface ChartData {
  date: string,
  price: number,
}
enableProdMode();
@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    index=0;
    index_data=0;
    data_now:any=[];
    data_begin= [
        {State: "1回", 平均: "10", 自社: "30"},
        {State: "2回", 平均: "40", 自社: "50"},
        {State: "3回", 平均: "20", 自社: "60"},
        {State: "4回", 平均: "10", 自社: "10"},
        {State: "5回", 平均: "50", 自社: "75"},
        {State: "6回", 平均: "70", 自社: "40"},
        {State: "7回", 平均: "40", 自社: "10"},
        {State: "8回", 平均: "50", 自社: "10"},
        {State: "9回", 平均: "75", 自社: "40"},
        {State: "10回", 平均: "10", 自社: "50"},
        {State: "11回", 平均: "50", 自社: "10"},
        {State: "12回", 平均: "40", 自社: "90"},
    ];

    constructor(private ngZone: NgZone) {
    }
    ngOnInit() {
        this.renderChart(this.data_begin);
    }
    renderChart(data_input) {

        let svg = d3.select("svg"),
            margin = {top: 20, right: 20, bottom: 30, left: 75},
            width = +svg.attr("width") - margin.left - margin.right,
            height = +svg.attr("height") - margin.top - margin.bottom,
            g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        let x0 = d3.scaleBand()
        //chiều rộng các của biểu đồ
            .rangeRound([0, width])
            //margin giữa các côt chính
            .paddingInner(0.1);

        let x1 = d3.scaleBand()
        //margin giữa 2 côt


        let y = d3.scaleLinear()
        //chiều cao của biểu đồ
            .rangeRound([height, 0]);
        let z = d3.scaleOrdinal()
        //màu của 2 cột
            .range(["red", "blue"]);
            let data=data_input;
            let i=0;
            this.data_now=data.filter((currElement, index) => {
                if(index >= this.index && i<=10 ){
                    i++;
                    this.index_data=index;
                    return currElement;
                }
            });
        this.data_now['columns']=["State", "平均", "自社"];
            // key =["Trắng", "Xanh"]
            var keys = this.data_now['columns'].slice(1);
            // ["CA", "TX", "NY", "FL", "IL", "PA"] data.map(function(d) { return d.State; })
            x0.domain(this.data_now.map(function (d) {
                return d.State;
            }));
            //chiều rộng côt chính  : x0.bandwidth() 137
            x1.domain(keys).rangeRound([0, x0.bandwidth()]);
            y.domain([0, d3.max(this.data_now, function (d) {
                return d3.max(keys, function (key) {
                    return d[key];
                });
            })]).nice();
            let dataFirst=this.data_now;
            //x0(d.State) : dịch chuyển các cột với trục ox giá trị tăng dần
            g.append("g")
                .selectAll("g")
                .data(this.data_now)
                .enter().append("g")
                .attr("transform", function (d) {
                    return "translate(" + x0(d.State) + ",0)";
                })
                .selectAll("rect")
                .data(function (d) {
                    return keys.map(function (key) {
                        return {key: key, value: d[key]};
                    });
                })
                .enter().append("rect")
                .attr("x", function (d) {
                    return x1(d.key);
                })
                .attr("y", function (d) {
                    return y(d.value);
                })
                .attr("class", "y axis")
                .attr("width", x1.bandwidth())
                .attr("height", function (d) {
                    return height - y(d.value);
                })
                .attr("fill", function (d) {
                    return z(d.key);
                });


            g.append("g")
                .attr("class", "axis")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x0));
            let yAxis = d3.axisRight(y)
                .tickFormat(d =>  d + '%')
                .ticks(2, "s")
                .tickSize(width)
            g.append("g")
                .attr("class", "axis")
                .call(yAxis)
                .append("text")
                .attr("transform", "translate(" + 0 + ", 0)")
                .attr("x", 890)
                .attr("y", y(y.ticks().pop()) + 0.5)
                .attr("dy", "0.32em")
                .attr("fill", "#000")
                .attr("font-weight", "bold")
                .attr("text-anchor", "start")
                .text("Giá trị");
        g.append("text")
            .attr("class", "title")
            .attr("x", width/2)
            .attr("y", 10 - (margin.top / 2))
            .attr("text-anchor", "middle")
            .text("Testing");

            var legend_colum = g.append("g")
                .attr("font-family", "sans-serif")
                .attr("font-size", 10)
                .attr("text-anchor", "end")
                .attr("font-weight", "bold")
                .selectAll("g")
                .data(keys.slice())
                .enter().append("g")
                .attr("transform", function (d, i) {
                    let max = d3.max(dataFirst, function (d) {
                        return d3.max(keys, function (key) {
                            return d[key];
                        });
                    });
                    return "translate(" + (25 + 7 * i) * (i + 1) + "," + ((1 - dataFirst[0][keys[i]] / max) * 400 - 100*((1 - dataFirst[0][keys[i]] / max))) + ")";
                });
            legend_colum.append("text")
                .attr("font-family", "sans-serif")
                .attr("font-size", 10)
                .attr("text-anchor", "end")
                .attr("font-weight", "bold")
                .attr("x", 0)
                .attr("y", 10.5)
                .attr("dy", "0.32em")
                .style("fill", function (d, i) {
                    if (i == 0) {
                        return 'red'
                    }
                    return 'blue'
                })
                .text(function (d) {
                    return d;
                });
    }
    update_pre(){
            d3.select("svg").select('g').remove();
            if(this.index > 0){
                this.index--;
            }
            this.renderChart(this.data_begin);
    }
    update_next(){
        if(this.data_begin.length != this.index_data+1){
            d3.select("svg").select('g').remove();
            this.index++;
            this.renderChart(this.data_begin);
        }
    }
}
