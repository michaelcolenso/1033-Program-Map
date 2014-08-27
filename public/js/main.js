$(document).ready(function() {

  var socket = io();

  socket.on('id', function(results) {
    console.log(results);
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
      var newRow   = tableRef.insertRow(0);
      newRow.innerHTML = '<td>' + moment(sale.date).fromNow() + '</td>' + '<td>' + numeral(sale.price).format('$0,0[.]00') + '</td>' + '<td>' + sale.buyer + '</td><td>' + sale.seller + '</td><td>' + sale.terms + '</td>';
    }
    p.innerHTML = '<p>This property has&nbsp;<span style="color: #01FF70">' + data.length + '</span>&nbsp;public records in the sales database.</p>';
  });

  var map = L.map('map', {center: [44.7631, -85.6206], zoom: 14})
  .addLayer(new L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.'
    }));

  var div = d3.select(".offer-content")
    .insert("div", ":first-child")
    .attr("class", "info")
    .style("opacity", 0);

  var legend = d3.select("#legend li");

  var table = d3.select("#saledata")
    .style("opacity", 0);

  var div = d3.select("#map")
        .append("div")
        .attr("class", "tooltip")
        .style("background", "rgba(0,0,0,0.7)")
        .style("opacity", 0);

  var color = d3.scale.threshold()
    .domain( [1, 10, 50, 100, 1000])
    .range([ "#bcbddc", "#9e9ac8", "#807dba", "#6a51a3", "#4a1486"])


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
                div.html( "<h3>" + county + "</h3><p>1033 Acquisition Value:</p><p><span class='ion-cash'></span>" + cost.format('$ 0,0[.]00') + "</p>").style("left", (d3.event.pageX) + "px").style("top", (d3.event.pageY) + "px");
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
                    $("#sidebar").prepend('<h1>' + county + '</h1><h4>Total 1033 Acquisition Value: ' + cost.format() + '</h4><h4>Number of Households: ' + households.format('0,0') + '</h4><h2>Cost per Household: ' + costPerHousehold.format() + '</h2><hr/>');
                  }

                  socket.emit('getid', county);
                  });

        map.on("viewreset", reset);
        reset();

    // Reposition the SVG to cover the features.
    function reset() {
      var bounds = path.bounds(collection),
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

  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-53567676-1', 'auto');
  ga('send', 'pageview');

});
