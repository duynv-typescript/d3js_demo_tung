import {Component, OnInit, enableProdMode, HostListener} from '@angular/core';
import * as d3 from 'd3';
enableProdMode();

@Component({
  selector: 'app-chart4',
  templateUrl: './chart4.component.html',
  styleUrls: ['./chart4.component.css']
})
export class Chart4Component implements OnInit {

  index= 0;
  index_data= 0;
  data_now: any= [];
  data_begin= [
    {month: '1', 平均: '10', 自社: '30', year: '2018'},
    {month: '2', 平均: '40', 自社: '50', year: '2018'},
    {month: '3', 平均: '20', 自社: '60', year: '2018'},
    {month: '4', 平均: '10', 自社: '10', year: '2018'},
    {month: '5', 平均: '50', 自社: '75', year: '2018'},
    {month: '6', 平均: '70', 自社: '40', year: '2018'},
    {month: '7', 平均: '40', 自社: '10', year: '2018'},
    {month: '8', 平均: '50', 自社: '10', year: '2018'},
    {month: '9', 平均: '75', 自社: '40', year: '2018'},
    {month: '10', 平均: '10', 自社: '50', year: '2018'},
    {month: '11', 平均: '50', 自社: '10', year: '2018'},
    {month: '12', 平均: '40', 自社: '90', year: '2018'},
    {month: '1', 平均: '30', 自社: '70', year: '2019'},
  ];
  constructor() {
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    d3.select('.chart-bar').select('g').remove();
    this.renderChart(this.data_begin);
  }
  ngOnInit() {
    this.renderChart(this.data_begin);
  }
  renderChart(data_input) {
    const svg = d3.select('.chart-bar'),
      margin = {top: 20, right: 20, bottom: 30, left: 75},
      width = + parseInt(d3.select('.box').style('width')) - margin.left - margin.right ,
      height = +svg.attr('height') - margin.top - margin.bottom,
      g = svg.append('g').attr('transform', 'translate(' + margin.right + ',' + margin.top + ')');
    svg.attr('width', parseInt(d3.select('.box').style('width')));
    const x0 = d3.scaleBand()
    // chiều rộng các của biểu đồ
      .rangeRound([0, width])
      // margin giữa các côt chính
      .paddingInner(0.1);

    const x1 = d3.scaleBand();
    // margin giữa 2 côt
    const y = d3.scaleLinear()
    // chiều cao của biểu đồ
      .rangeRound([height, 0]);
    const z = d3.scaleOrdinal()
    // màu của 2 cột
      .range(['red', 'blue']);
    const data = data_input;
    let i = 0;
    this.data_now = data.filter((currElement, index) => {
      if (index >= this.index && i <= 11 ){
        i++;
        this.index_data = index;
        return currElement;
      }
    });
    this.data_now['columns'] = ['month', '平均', '自社'];
    // key =["Trắng", "Xanh"]
    const keys = this.data_now['columns'].slice(1);
    //  ["CA", "TX", "NY", "FL", "IL", "PA"] data.map(function(d) { return d.month; })
    x0.domain(this.data_now.map(function (d) {
      return d.month;
    }));
    // chiều rộng côt chính  : x0.bandwidth() 137
    x1.domain(keys).rangeRound([0, x0.bandwidth()]);
    y.domain([0, d3.max(this.data_now, function (d) {
      return d3.max(keys, function (key) {
        return d[key];
      });
    })]).nice();
    const dataFirst = this.data_now;
    const tooltip = d3.select('body').append('div').attr('class', 'tooltip');
    // x0(d.month) : dịch chuyển các cột với trục ox giá trị tăng dần
    g.append('g')
      .selectAll('g')
      .data(this.data_now)
      .enter().append('g')
      .attr('transform', function (d) {
        return 'translate(' + x0(d.month) + ',0)';
      })
      .selectAll('rect')
      .data(function (d) {
        return keys.map(function (key) {
          return {key: key, value: d[key]};
        });
      })
      .enter().append('rect')
      .attr('x', function (d) {
        return x1(d.key);
      })
      .attr('y', function (d) {
        return y(d.value);
      })
      .attr('class', 'y axis')
      .attr('width', x1.bandwidth())
      .attr('height', function (d) {
        return height - y(d.value);
      })
      .attr('fill', function (d) {
        return z(d.key);
      })
      .attr('cursor', 'pointer')
      .on('mousemove', function(d){
        tooltip
          .style('left', d3.event.pageX - 50 + 'px')
          .style('top', d3.event.pageY - 70 + 'px')
          .style('display', 'block')
          .style('text-align', 'center')
          .style('border', '1px solid ' + z(d.key))
          .style('padding', '5px')
          .style('border-radius', '5px')
          .style('opacity', '1')
          .style('color', z(d.key))
          .style('background', 'white')
          .html( (d.key) + '<br>' + '' + (d.value));
      })
      .on('mouseout', function(d){  tooltip.style('display', 'none').style('opacity', '0'); });

    g.append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate(0,' + height + ')')

      .call(d3.axisBottom(x0).tickFormat((d , i) => {
        return (d + '回' + (((d == 1)) ? this.data_now[i]['year'] : ''));
      }));


    const yAxis = d3.axisRight(y)
      .tickFormat(d =>  d + '%')
      .ticks(3, 's')
      .tickSize(width);

    g.append('g')
      .attr('class', 'axis')
      .call(yAxis)
      .append('text')
      .attr('transform', 'translate(' + 0 + ', 0)')
      .attr('x', parseInt(d3.select('.box').style('width')) - 30 - margin.left - margin.right)
      .attr('y', y(y.ticks().pop()) + 0.5 - 10)
      .attr('dy', '0.32em')
      .attr('fill', '#000')
      .attr('font-weight', 'bold')
      .attr('text-anchor', 'start')
      .text('Giá trị');

    const legend_colum = g.append('g')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 10)
      .attr('text-anchor', 'end')
      .attr('font-weight', 'bold')
      .selectAll('g')
      .data(keys.slice())
      .enter().append('g')
      .attr('transform', function (d, i) {
        const max = d3.max(dataFirst, function (d) {
          return d3.max(keys, function (key) {
            return d[key];
          });
        });
        const a = (parseInt(d3.select('.box').style('width') ) - 200) / 44;
        return 'translate(' + (a + a / 2 + a * (i + i))  + ',' + ((1 - dataFirst[0][keys[i]] / max) * 320 - 100 * ((1 - dataFirst[0][keys[i]] / max))) + ')';
      });
    legend_colum.append('text')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 10)
      .attr('text-anchor', 'end')
      .attr('font-weight', 'bold')
      .attr('x', 0)
      .attr('y', 10.5)
      .attr('dy', '0.32em')
      .style('fill', function (d, i) {
        if (i === 0) {
          return 'red';
        }
        return 'blue';
      })
      .text(function (d) {
        return d;
      });
  }
  btnPreview() {
    d3.select('.chart-bar').select('g').remove();
    if (this.index > 0) {
      this.index--;
    }
    this.renderChart(this.data_begin);
  }
  btnNext() {
    if (this.data_begin.length !== this.index_data + 1) {
      d3.select('.chart-bar').select('g').remove();
      this.index++;
      this.renderChart(this.data_begin);
    }
  }

}
