//  Make data call
window.onload = () => {

    // URL for data
  let url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json';

  const dataCall = async () => {
    const response = await fetch(url);
    const data = await response.json();
    // console.log(data[1].Name);

    // Sizing variables
  let margin = {
    top: 100,
    right: 20,
    bottom: 30,
    left: 60
  };

  let width = 920 - margin.left - margin.right;
  let height = 630 - margin.top - margin.bottom;

  let color = d3.scaleOrdinal(d3.schemeCategory10);

  // Scales
  let xScale = d3.scaleLinear().range([0, width]);

  let yScale = d3.scaleTime().range([0, height]);

  let timeFormat = d3.timeFormat('%M:%S');

  // Axes
  let xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));
  let yAxis = d3.axisLeft(yScale).tickFormat(timeFormat);

  // Create div for tooltip
  let tooltip = d3
            .select('body')
            .append('div')
            .attr('id', 'tooltip')
            .style('opacity', 0)
            .style('font-size', '14px')

  // Create svg for plot
  let svg = d3
            .select('body')
            .append('svg')
              .attr('width', width + margin.left + margin.right)
              .attr('height', height + margin.top + margin.bottom)
              .attr('id', 'title')
            // .append('g')
            //   .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      
      data.forEach(d => {
        d.Place += d.Place;
        let parsedTime = d.Time.split(':');
        d.Time = new Date(Date.UTC(1970, 0, 1, 0, parsedTime[0], parsedTime[1]));
      });
      
      xScale.domain([
        d3.min(data, (d) => {
        return d.Year - 1;
      }),
        d3.max(data, (d) => {
          return d.Year + 1;
        })
      ]);
      
      yScale.domain(d3.extent(data, (d) => {
        return d.Time;
      })
    );

    // Add axes to plot
    svg
      .append('g')
      .attr('id', 'x-axis')
      .attr('transform', 'translate(' + margin.left + ', 550)')
      .call(xAxis)
      .append('text')
      .attr('class', 'x-axis-label')
      .attr('x', width)
      .attr('y', -6)
      .style('text-anchor', 'end')
      .text('Year');
      
    svg
      .append('g')
      .attr('id', 'y-axis')
      .attr('transform', 'translate(' + margin.left + ', 50)')
      .call(yAxis)
      .append('text')
      .attr('class', 'y-axis-label')
      .attr('dy', '.71em')
      .attr('y', 6)
      .style('text-anchor', 'end')
      .text('Best Time (minutes)');
    
    svg
      .selectAll('.dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('r', 5)
      .attr('cx', (d) => {
        return xScale(d.Year) + 60;
      })
      .attr('cy', (d) => {
        return yScale(d.Time) + 50; 
      })
      .attr('data-xvalue', (d) => {
        return d.Year;
      })
      .attr('data-yvalue', (d) => {
        return d.Time.toISOString();
      })
      .style('fill', (d) => {
        return color(d.Doping !== '');
      })
      .on('mouseover', function(event, i) {
    
        // Position variables for tooltip location
        let pageX = event.pageX;
        let pageY = event.pageY;

        // Time conversion function
        const getDisplayTime = (seconds) => {
          let m = Math.floor(seconds % 3600 / 60);
          let s = Math.floor(seconds % 60);

          let display = m + ":" + s;
          return display;
        }
        let time = getDisplayTime(i.Seconds);

        tooltip.style('opacity', 1);
        tooltip.attr('data-year', i.Year)
        tooltip.html(
            `<p><b><em>${i.Name}</em></b>`+" ("+`${i.Nationality}`+")"+`<br>${i.Year}<br>`+'Time: '+ `${time}</p>`
                )
                .style('left', pageX + 25 + 'px')
                .style('top', pageY - 30 + 'px');
      })
      .on('mouseout', () => {
        tooltip.style('opacity', 0);
      });

      // Create legend
      let legendContainer = svg.append('g').attr('id', 'legend');

      let legend = legendContainer
          .selectAll('#legend')
          .data(color.domain())
          .enter()
          .append('g')
          .attr('transform', (d, i) => {
            return 'translate(0,' + (height / 2 - i * 20) + ')'
          })
          .style('fill', 'black');
        
      legend
          .append('circle')
          .attr('cx', width - 10)
          .attr('r', 5)
          .style('fill', color)

      legend
          .append('text')
          .attr('x', width - 30)
          .attr('y', 0)
          .attr('dy', '.35em')
          .style('text-anchor', 'end')
          .style('font-size', '15px')
          .text(d => {
            if (d) {
              return 'Bad Guys (Booo!)';
            } else {
              return 'Good guys (probably)'
            }
          });
  }
  dataCall();
}


  


