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
    curentPage : number = 1
    constructor(private ngZone: NgZone) {
    }
    ngOnInit() {
        this.renderChart();
    }



    renderChart() {
        console.log(this.curentPage);
        let curentPage= this.curentPage;

        let svg = d3.select("svg"),
            margin = {top: 20, right: 20, bottom: 30, left: 40},
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
            .padding(0.05);

        let y = d3.scaleLinear()
        //chiều cao của biểu đồ
            .rangeRound([height, 0]);

        let z = d3.scaleOrdinal()
        //màu của 2 cột
            .range(["#98abc5", "#8a89a6"]);
        d3.csv('assets/data.csv').then(function (data) {
            let seft=this;
            // key =["Trắng", "Xanh"]
            var keys = data.columns.slice(1);
            // ["CA", "TX", "NY", "FL", "IL", "PA"] data.map(function(d) { return d.State; })
            x0.domain(data.map(function (d) {
                return d.State;
            }));
            //chiều rộng côt chính  : x0.bandwidth() 137
            x1.domain(keys).rangeRound([0, x0.bandwidth()]);
            y.domain([0, d3.max(data, function (d) {
                return d3.max(keys, function (key) {
                    return d[key];
                });
            })]).nice();
            //x0(d.State) : dịch chuyển các cột với trục ox giá trị tăng dần
            g.append("g")
                .selectAll("g")
                .data(data)
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
                .ticks(3, "s")
                .tickSize(width)
                .tickPadding(10);
            g.append("g")
                .attr("class", "axis")
                .call(yAxis)
                .append("text")
                .attr("transform", "translate(" + 0 + ", 0)")
                .attr("x", 2)
                .attr("y", y(y.ticks().pop()) + 0.5)
                .attr("dy", "0.32em")
                .attr("fill", "#000")
                .attr("font-weight", "bold")
                .attr("text-anchor", "start")
                .text("Giá trị");


            var legend = g.append("g")
                .attr("font-family", "sans-serif")
                .attr("font-size", 10)
                .attr("text-anchor", "end")
                .selectAll("g")
                .data(keys.slice().reverse())
                .enter().append("g")
                .attr("transform", function (d, i) {
                    return "translate(0," + i * 20 + ")";
                });

            legend.append("rect")
                .attr("x", width - 19)
                .attr("width", 19)
                .attr("height", 19)
                .attr("fill", z);

            legend.append("text")
                .attr("x", width - 24)
                .attr("y", 9.5)
                .attr("dy", "0.32em")
                .text(function (d) {
                    return d;
                });


            var legend_colum = g.append("g")
                .attr("font-family", "sans-serif")
                .attr("font-size", 10)
                .attr("text-anchor", "end")
                .attr("font-weight", "bold")
                .selectAll("g")
                .data(keys.slice())
                .enter().append("g")
                .attr("transform", function (d, i) {
                    return "translate(" + (50 + 10 * i) * (i + 1) + "," + ((1 - data[0][keys[i]] / 9000) * 500 - 60) + ")";
                })

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
                        return 'blue'
                    }
                    return 'red'
                })
                .text(function (d) {
                    return d;
                });

        });
    }


}
