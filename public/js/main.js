$(document).ready(function() {

  numeral.defaultFormat('$0,0.00');

  var socket = io();

  socket.on('id', function(results) {
    var content;
      for (i=0; i < results.length; i++) {
        var gear = {
          desc: results[i].desc,
          qty: results[i].qty,
          cost: results[i].cost
        }
       var cost = numeral(gear.cost);
       content = $( "<ul class='list-unstyled'><li><h4 class='armyguns'><strong>(" + gear.qty + ")</strong>&nbsp;" + gear.desc + "&nbsp;</h4><p><small>Total Original Acquisition Value: </small><strong style='color: #DD0048;'>" + cost.format() + "</strong></p></li></ul>" );
       content.appendTo($("#sidebar"));
      }
      sidebar.show();
    });

     var map = L.map('map', {center: [39.8282, -98.5795], zoom: 4})
        .addLayer(new L.tileLayer.provider('Stamen.TonerBackground'));

     var legend = L.control({position: 'topright'});

     //map.legendControl.addLegend(document.getElementById('legend').innerHTML);

    var sidebar = L.control.sidebar('sidebar', {
      position: 'left'
    });

    legend.onAdd = function (map) {
      var div = L.DomUtil.create('div', 'info legend nav'),
          products = [ 'Under $1', '$1 < $10', '$10 < $50', '$50 < $100', '$100 < $1000' ],
          labels = [];
      div.innerHTML += '<p class="lead muted">1033 Program Military Equipment Acquisition Costs Per Household</p>';

      // loop through our buckets and generate a label with a colored square for each interval
      for (var i = 0; i < products.length; i++) {
          div.innerHTML +=
              '<span class="legend" style="background:' + getColor(products[i]) + '"></span><label> ' +
              products[i] +  '</label><br>';
      }
      div.innerHTML += '<h4><span style="color: #DD0048" class="ion-arrow-left-a"></span>Click on a county for details</h4><p><small>Data Source: <a href="https://github.com/TheUpshot/Military-Surplus-Gear">The New York Times via Github</a></small></p>';
      return div;
    };
    map.addControl(sidebar);

    legend.addTo(map);

    function getColor(d) {

    return d == 'Under $1' ? '#bcbddc' :
           d == '$1 < $10' ? '#9e9ac8' :
           d == '$10 < $50' ? '#807dba' :
           d == '$50 < $100' ? '#6a51a3' :
           d == '$100 < $1000' ? '#4a1486' :
           d == 'Parts' ? '#800026' :
                      '#FFEDA0';
    }

  var div = d3.select("#map")
      .append("div")
      .attr("class", "tooltip")
      .style("background", "rgba(0,0,0,0.7)")
      .style("opacity", 0);

  var color = d3.scale.threshold()
    .domain( [1, 10, 50, 100, 1000])
    .range([ "#bcbddc", "#9e9ac8", "#807dba", "#6a51a3", "#4a1486"]);


    d3.json("/js/us.json", function(error, us) {
        if (error) return console.error(error);

        var svg = d3.select(map.getPanes().overlayPane).append("svg"),
          g = svg.append("g").attr("class", "leaflet-zoom-hide");

        var transform = d3.geo.transform({point: projectPoint}),
            path = d3.geo.path().projection(transform);

        var feature = g.selectAll("path")
            .data(topojson.feature(us, us.objects.counties).features)
          .enter().append("path")
            .style("fill", function(d) {
              var cost = d.properties.cost;
              var households = d.properties.households;
              var costPerHousehold = cost / households;
              return color(costPerHousehold);
            })
            .style({ 'stroke': 'rgba(0,0,0,1)', 'stroke-width': '0.3px' })
            .attr("d", path)
            .on("mouseover", function(d) {
              var county = d.properties.Areaname;
              var cost = numeral(d.properties.cost);

              if (county == undefined) {
                county = 'No 1033 Program Acquisitions';
              }

                div.transition().duration(500).style("opacity", 0);
                div.transition().duration(200).style("opacity", .9);
                div.html( "<h3>" + county + "</h3><p><span class='ion-jet'></span>" + cost.format('$ 0,0[.]00') + "</p>").style("left", (d3.event.pageX) + "px").style("top", (d3.event.pageY) + "px");
            })

            .on("mouseout", function(d) {
              div.transition().duration(500).style("opacity", 0);
            })

            .on("click", function(d) {
                  $("#sidebar").empty();

                  var county = d.properties.Areaname;
                  var households = numeral(d.properties.households);
                  var cost = numeral(d.properties.cost);
                  var costPerHousehold = numeral(d.properties.cost / d.properties.households);

                  if (county == undefined) {
                    sidebar.hide();
                    return;
                  } else {
                    $("#sidebar").prepend('<p class="lead"><span class="s-1">Since 2006</span>, state and local law enforcement agencies in <span class="s-2">' + county + ' </span> requested and recieved around <span class="s-3">' + cost.format() + ' </span>  worth of Military Equipment via the <a href="http://www.dispositionservices.dla.mil/leso/Pages/1033ProgramFAQs.aspx">Department of Defense 1033 Program.</a><p><span class="s-4"> There are approximately ' + households.format('0,0') + ' households in ' + county + ' </span ></p></br><span class="s-5">Cost per Household: ' + costPerHousehold.format() + '</span></p><hr/><p class="s-items"><span class="ion-clipboard"></span>Items Recieved <span style="color: #DD0048; vertical-align: middle" class="ion-arrow-down-a"></span></p>');
                  }
                  socket.emit('getid', county);
                  });

        map.on("viewreset", reset);
        reset();

        function reset() {
          var bounds = path.bounds(topojson.feature(us, us.objects.counties)),
              topLeft = bounds[0],
              bottomRight = bounds[1];

          svg .attr("width", bottomRight[0] - topLeft[0])
              .attr("height", bottomRight[1] - topLeft[1])
              .style("left", topLeft[0] + "px")
              .style("top", topLeft[1] + "px");

          g   .attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");

          feature
            .attr("d", path);
        }

    // Use Leaflet to implement a D3 geometric transformation.
    function projectPoint(x, y) {
      var point = map.latLngToLayerPoint(new L.LatLng(y, x));
      this.stream.point(point.x, point.y);
    }

      });
});
