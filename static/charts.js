function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var sampleArray = data.samples;
    //console.log(sampleArray)

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filteredSampleArray = sampleArray.filter(sampleId => sampleId.id == sample);
    //console.log(filteredSampleArray)

    var result = filteredSampleArray.sort((a, b) => b.sample_values - a.sample_values)
    
    //  5. Create a variable that holds the first sample in the array.
    var firstResult = result[0]
    //console.log(result)

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
     
    // Sorted IDs, Labels, Samples - NOT SLICED
    var otuIds = firstResult.otu_ids;
    var otuLabels = firstResult.otu_labels;
    var otuSampleValues = firstResult.sample_values;

    // Sliced IDs, Labels, Samples - SLICED

    var topTenOtuIds = otuIds.slice(0,10);
    var topTenLabels = otuLabels.slice(0,10);
    var topTenSampleValues = otuSampleValues.slice(0,10);

    console.log(otuIds);
    console.log(otuLabels);
    console.log(otuSampleValues);
    //console.log("Slices");
    //console.log(topTenLabels);
    //console.log(topTenSampleValues);
    
    
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    //sortedTopTenOtuIds = topTenOtuIds.map((otuIds => OTU ${otuID})).reverse();
    sortedTopTenOtuIds = topTenOtuIds.map(function(otuID){
      return `OTU ${otuID}`
      });
    
    //console.log(sortedTopTenOtuIds);

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: topTenSampleValues,
      y: sortedTopTenOtuIds,
      type: 'bar',
      orientation: 'h'
    }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: 'Top 10 Bacteria Cultures Found',
      xaxis: { title: 'Number of Bacteria Found'}
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot('bar', barData, barLayout);
  
   //Bubble charts    
    // 1. Create the trace for the bubble chart.
    
    var bubbleData = [{
      x: otuIds,
      y: otuSampleValues,
      text: otuLabels,
      type: 'bubble',
      mode: 'markers',
      marker: {
        //color: otu_ids,
        colorscale: 'earth',
        size: otuSampleValues
      },
  
    }];

    // 2. Create the layout for the bubble chart.
    // Add title, label for x-axis, margins, and hovermode property
    var bubbleLayout = {
      title: 'Bacteria Culture Per Sample',
      xaxis: { title: 'OTU ID' },
      
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    // Gauge Chart
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result1 = resultArray[0];
    console.log(result1);
    var wfreq = result1.wfreq;
    
    //console.log(typeof wfreq)

    // 4. Create the trace for the gauge chart.
    var gaugeData = [ {
      domain: { x: [0, 1], y: [0, 1] },
      value: wfreq,
      title: { text: "Belly Button Washing Frequency" },
      type: 'indicator',
      mode: 'gauge+number',
      gauge: {
        axis: {range: [null, 10] },
        bar: {color: 'black'},
        steps: [
          { range: [0, 2], color:'red' },
          { range: [2, 4], color:'orange' },
          { range: [4, 6], color:'yellow' },
          { range: [6, 8], color:'greenyellow' },
          { range: [8, 10], color:'green' }
        ]
      }
    }
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 500,
      height: 400,
      margin: { t: 25, r: 25, l: 25, b: 25 },
      paper_bgcolor: "gainsboro",
      font: { color: "darkblue", family: "Droid Sans" }
    };
     
    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);
  })};