import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
@Component({
  selector: 'app-chart3',
  templateUrl: './chart3.component.html',
  styleUrls: ['./chart3.component.css']
})
export class Chart3Component implements OnInit {
  constructor() { }
  public w;
  public h;
  public dataY;
  public dataX;
  public svg;
  ngOnInit() {
    const elmnt = document.getElementById('graphic3');
    this.w = elmnt.offsetWidth;
    this.h = 450;
    this.dataY = [0, 250, 500, 750, 1000];
    this.dataX = [8, 9, 10, 11, 12];
    this.svg = d3.select('#graphic3')
      .append('svg')
      .attr('width', this.w)
      .attr('height', this.h);
    const fakeRed =  [ { 'month': 8, 'x': 40, 'y': 290},  { 'month': 9, 'x': (this.w - 140) / 4 + 40, 'y': 280},
      { 'month': 10, 'x': (this.w - 140) / 4 * 2 + 40, 'y': 260}, { 'month': 11, 'x': (this.w - 140) / 4 * 3 + 40, 'y': 270},
      { 'month': 12, 'x': this.w - 100, 'y': 250}];
    const fakeBlue =  [ { 'month': 8, 'x': 40, 'y': 280},  { 'month': 9, 'x': (this.w - 140) / 4 + 40, 'y': 240},
      { 'month': 10, 'x': (this.w - 140) / 4 * 2 + 40, 'y': 220}, { 'month': 11, 'x': (this.w - 140) / 4 * 3 + 40, 'y': 200},
      { 'month': 12, 'x': this.w - 100 , 'y': 190}];
    const fakeGray =  [ { 'month': 8, 'x': 40, 'y': 200},  { 'month': 9, 'x': (this.w - 140) / 4 + 40, 'y': 180},
      { 'month': 10, 'x': (this.w - 140) / 4 * 2 + 40, 'y': 170}, { 'month': 11, 'x': (this.w - 140) / 4 * 3 + 40, 'y': 160},
      { 'month': 12, 'x': this.w - 100 , 'y': 140}];
    this.renderChart(this.w, this.h, this.dataY, this.dataX, this.svg, fakeRed, fakeBlue, fakeGray);
    this.drawLine(this.svg, fakeRed, this.w, '250', 'red');
    this.drawLine(this.svg, fakeBlue, this.w, '190', 'blue');
    this.drawLine(this.svg, fakeGray, this.w, '140', 'gray');
  }

  renderChart(w, h, dataY, dataX, svg, fakeRed, fakeBlue, fakeGray) {
    let yScale, yAxis, xScale, xAxis;

    yScale = d3.scaleLinear()
      .domain([d3.min(dataY), d3.max(dataY)])
      .range([h - 50, 100]);

    yAxis = d3.axisRight()
      .scale(yScale)
      .ticks(5)
      .tickFormat(d => d + '平');

    svg.append('g')
      .attr('class', 'gY')
      .attr('transform', 'translate(' + (w - 70) + ', -20)')
      .style('font-size', '20px')
      .attr('text-anchor', 'middle')
      .call(yAxis);

    xScale = d3.scaleLinear()
      .domain([d3.min(dataX), d3.max(dataX)])
      .range([40, w - 100]);

    xAxis = d3.axisBottom()
      .scale(xScale)
      .ticks(5)
      .tickFormat(d => d + '内');

    svg.append('g')
      .attr('class', 'gX  ')
      .attr('transform', 'translate(0, 377)')
      .style('font-size', '20px')
      .call(xAxis);

    ////////////Render x line fuzzy//////////////
    svg.append('line')
      .attr('class', 'line')
      .attr('x1', 0)
      .attr('x2', w - 80)
      .attr('y1', 83)
      .attr('y2', 83);
    svg.append('line')
      .attr('class', 'line')
      .attr('x1', 0)
      .attr('x2', w - 80)
      .attr('y1', 155)
      .attr('y2', 155);
    svg.append('line')
      .attr('class', 'line')
      .attr('x1', 0)
      .attr('x2', w - 80)
      .attr('y1', 229)
      .attr('y2', 229);
    svg.append('line')
      .attr('class', 'line')
      .attr('x1', 0)
      .attr('x2', w - 80)
      .attr('y1', 307)
      .attr('y2', 307);
    svg.append('line')
      .attr('class', 'line')
      .attr('x1', 0)
      .attr('x2', w - 80)
      .attr('y1', 377)
      .attr('y2', 377);

    ////////////Add Title//////////////
    svg.append('text')
      .attr('x', (w / 2))
      .attr('text-anchor', 'middle')
      .style('font-size', '26px')
      .attr('y', 30)
      .text('アクティブユーザー411人');
    svg.append('text')
      .attr('x', (w / 2))
      .attr('text-anchor', 'middle')
      .style('font-size', '26px')
      .attr('y', 60)
      .text('2位／278社中');

    ////////////Add ToolTip and Line when Hover//////////////
    const div = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    const mouseG = svg.append('g')
      .attr('class', 'mouse-over-effects');
    mouseG.append('path') // this is the black vertical line to follow mouse
      .attr('class', 'mouse-line')
      .style('stroke', 'gray')
      .style('stroke-dasharray', '10,10')
      .style('opacity', '1');

    this.toolTip(svg, div, fakeRed, 'red');
    this.toolTip(svg, div, fakeBlue, 'blue');
    this.toolTip(svg, div, fakeGray, 'gray');

  }

  drawLine(svg, data, w, h, check) {
    let colorLine = '';
    let colorText = '';
    let text = '';
    if (check === 'red') {
      colorLine = 'lineRed';
      colorText = 'txtRed';
      text = '平均';
    } else if (check === 'blue') {
      colorLine = 'lineBlue';
      colorText = 'txtBlue';
      text = '自社';
    } else {
      colorLine = 'lineGray';
      colorText = 'txtGray';
      text = 'TOP';
    }
    const valueline = d3.line()
      .x(function(d) { return (d.x); })
      .y(function(d) { return (d.y); });
    svg.append('path')
      .data([data])
      .attr('class', colorLine)
      .attr('d', valueline);
    svg.append('text')
      .attr('class', colorText)
      .attr('transform', 'translate(' + (w - 70) + ', ' + h + ')')
      .attr('text-anchor', 'middle')
      .text(text);
  }

  toolTip(svg, div, data, color) {
    svg.selectAll('dot')
      .data(data)
      .enter().append('circle')
      .attr('r', 3)
      .attr('class', color)
      .attr('cx', function(d) { return (d.x); })
      .attr('cy', function(d) { return (d.y); })
      .on('mouseover', function() {
        div .attr('addcss', color)
        d3.select('.mouse-line')
          .style('opacity', '1');
        d3.selectAll('.mouse-per-line circle')
          .style('opacity', '1');
        d3.selectAll('.mouse-per-line text')
          .style('opacity', '1');
        return div.style('opacity', 1);
      })
      .on('mousemove', function(d) {
        const mouse = d3.mouse(this);
        const value = (300 - (d.y - 83)) / 300 * 40;
        const number = value.toFixed(2);
        div	.html('2018事' + (d.month) + '者 12 事' + '<br/>'  + number + '%')
        d3.select('.mouse-line')
          .attr('d', function() {
            let d = 'M' + mouse[0] + ',' + 377;
            d += ' ' + mouse[0] + ',' + 83;
            return d;
          });
        return div.style('top', (d3.event.pageY - 10) + 'px').style('left', (d3.event.pageX + 10) + 'px');
      })
      .on('mouseout', function() {
        d3.select('.mouse-line')
          .style('opacity', '0');
        d3.selectAll('.mouse-per-line circle')
          .style('opacity', '0');
        d3.selectAll('.mouse-per-line text')
          .style('opacity', '0');
        return div.style('opacity', 0);
      });
  }
  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  getRandomSetText(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  btnPreview3() {
    d3.selectAll('#graphic3 svg > *').remove();
    const dataX = [1, 2, 3, 4, 5];
    const yRed = this.getRandomSetText(230, 280); // Set position text
    const yBlue = this.getRandomSetText(160, 180); // Set position text
    const yGray = this.getRandomSetText(90, 140); // Set position text
    const fakeRed =  [ { 'month': 8, 'x': 40, 'y': this.getRandomInt(280, 300)},
      { 'month': 9, 'x': (this.w - 140) / 4 + 40, 'y': this.getRandomInt(270, 290)},
      { 'month': 10, 'x': (this.w - 140) / 4 * 2 + 40, 'y': this.getRandomInt(260, 270)},
      { 'month': 11, 'x': (this.w - 140) / 4 * 3 + 40, 'y': this.getRandomInt(240, 260)},
      { 'month': 12, 'x': this.w - 100, 'y': yRed}];
    const fakeBlue =  [ { 'month': 8, 'x': 40, 'y': this.getRandomInt(200, 250)},
      { 'month': 9, 'x': (this.w - 140) / 4 + 40, 'y': this.getRandomInt(180, 230)},
      { 'month': 10, 'x': (this.w - 140) / 4 * 2 + 40, 'y': this.getRandomInt(190, 210)},
      { 'month': 11, 'x': (this.w - 140) / 4 * 3 + 40, 'y': this.getRandomInt(180, 190)},
      { 'month': 12, 'x': this.w - 100 , 'y': yBlue}];
    const fakeGray =  [ { 'month': 8, 'x': 40, 'y': this.getRandomInt(100, 200)},
      { 'month': 9, 'x': (this.w - 140) / 4 + 40, 'y': this.getRandomInt(100, 170)},
      { 'month': 10, 'x': (this.w - 140) / 4 * 2 + 40, 'y': this.getRandomInt(100, 150)},
      { 'month': 11, 'x': (this.w - 140) / 4 * 3 + 40, 'y': this.getRandomInt(100, 140)},
      { 'month': 12, 'x': this.w - 100 , 'y': yGray}];
    this.renderChart(this.w, this.h, this.dataY, dataX, this.svg, fakeRed, fakeBlue, fakeGray);
    this.drawLine(this.svg, fakeRed, this.w, yRed, 'red');
    this.drawLine(this.svg, fakeBlue, this.w, yBlue, 'blue');
    this.drawLine(this.svg, fakeGray, this.w, yGray, 'gray');
  }
  btnNext3() {
    d3.selectAll('#graphic3 svg > *').remove();
    const dataX = [6, 7, 8, 9, 10];
    const yRed = this.getRandomSetText(230, 280); // Set position text
    const yBlue = this.getRandomSetText(160, 180); // Set position text
    const yGray = this.getRandomSetText(90, 140); // Set position text
    const fakeRed =  [ { 'month': 8, 'x': 40, 'y': this.getRandomInt(280, 300)},
      { 'month': 9, 'x': (this.w - 140) / 4 + 40, 'y': this.getRandomInt(270, 290)},
      { 'month': 10, 'x': (this.w - 140) / 4 * 2 + 40, 'y': this.getRandomInt(260, 270)},
      { 'month': 11, 'x': (this.w - 140) / 4 * 3 + 40, 'y': this.getRandomInt(240, 260)},
      { 'month': 12, 'x': this.w - 100, 'y': yRed}];
    const fakeBlue =  [ { 'month': 8, 'x': 40, 'y': this.getRandomInt(200, 250)},
      { 'month': 9, 'x': (this.w - 140) / 4 + 40, 'y': this.getRandomInt(180, 230)},
      { 'month': 10, 'x': (this.w - 140) / 4 * 2 + 40, 'y': this.getRandomInt(190, 210)},
      { 'month': 11, 'x': (this.w - 140) / 4 * 3 + 40, 'y': this.getRandomInt(180, 190)},
      { 'month': 12, 'x': this.w - 100 , 'y': yBlue}];
    const fakeGray =  [ { 'month': 8, 'x': 40, 'y': this.getRandomInt(100, 200)},
      { 'month': 9, 'x': (this.w - 140) / 4 + 40, 'y': this.getRandomInt(100, 170)},
      { 'month': 10, 'x': (this.w - 140) / 4 * 2 + 40, 'y': this.getRandomInt(100, 150)},
      { 'month': 11, 'x': (this.w - 140) / 4 * 3 + 40, 'y': this.getRandomInt(100, 140)},
      { 'month': 12, 'x': this.w - 100 , 'y': yGray}];
    this.renderChart(this.w, this.h, this.dataY, dataX, this.svg, fakeRed, fakeBlue, fakeGray);
    this.drawLine(this.svg, fakeRed, this.w, yRed, 'red');
    this.drawLine(this.svg, fakeBlue, this.w, yBlue, 'blue');
    this.drawLine(this.svg, fakeGray, this.w, yGray, 'gray');
  }
}
