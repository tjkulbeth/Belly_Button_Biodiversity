function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  var metaData = d3.select("#sample-metadata");
  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
      const defaultURL = `/metadata/${sample}`;
      let response = d3.json(defaultURL);
      console.log(response)
  
    

    // Use `.html("") to clear any existing metadata
    metaData.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    response.then(function(data) {
      Object.entries(data).forEach(([key, value]) => {
        metaData.append("h6").text(`${key}: ${value}`)
      });
    });

    // BONUS: Build the Gauge Chart
    // buildGauge(response.WFREQ);
    //     //Start of copied code from documentation
    //     // Enter a speed between 0 and 180
    // var level = response.WFREQ;
    // console.log(level);

    // // Trig to calc meter point
    // var degrees = 180 - level,
    //     radius = .5;
    // var radians = degrees * Math.PI / 180;
    // var x = radius * Math.cos(radians);
    // var y = radius * Math.sin(radians);

    // // Path: may have to change to create a better triangle
    // var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
    //     pathX = String(x),
    //     space = ' ',
    //     pathY = String(y),
    //     pathEnd = ' Z';
    // var path = mainPath.concat(pathX,space,pathY,pathEnd);

    // var data = [{ type: 'scatter',
    //   x: [0], y:[0],
    //     marker: {size: 28, color:'850000'},
    //     showlegend: false,
    //     name: 'Belly Button Washing Frequency',
    //     text: level,
    //     hoverinfo: 'text+name'},
    //   { values: [50/6, 50/6, 50/6, 50/6, 50/6, 50/6, 50],
    //   rotation: 90,
    //   text: ['TOO FAST!', 'Pretty Fast', 'Fast', 'Average',
    //             'Slow', 'Super Slow', ''],
    //   textinfo: 'text',
    //   textposition:'inside',
    //   marker: {colors:['rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
    //                         'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
    //                         'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)',
    //                         'rgba(255, 255, 255, 0)']},
    //   labels: ['0-1', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-8', '8-9'],
    //   hoverinfo: 'label',
    //   hole: .5,
    //   type: 'pie',
    //   showlegend: false
    // }];

    // var layout = {
    //   shapes:[{
    //       type: 'path',
    //       path: path,
    //       fillcolor: '850000',
    //       line: {
    //         color: '850000'
    //       }
    //     }],
    //   title: '<b>Gauge</b> <br> Speed 0-100',
    //   height: 1000,
    //   width: 1000,
    //   xaxis: {zeroline:false, showticklabels:false,
    //             showgrid: false, range: [-1, 1]},
    //   yaxis: {zeroline:false, showticklabels:false,
    //             showgrid: false, range: [-1, 1]}
    // };

    // Plotly.newPlot('gauge', data, layout);

};

async function buildCharts(sample) {

    console.log(sample)
  // @TODO: Use `d3.json` to fetch the sample data for the plots

    // @TODO: Build a Bubble Chart using the sample data
      const defaultURL = `/samples/${sample}`;
      console.log(defaultURL)
      let response = await d3.json(defaultURL);
      console.log(response)
      const bubbleTrace = {
        x: response.otu_ids,
        y: response.sample_values,
        mode: 'markers',
        marker: {
          size: response.sample_values,
          color: response.otu_ids,
          colorscale: 'Earth'
        },
        text: response.otu_labels,
        type: 'bubble',
      };

      const bubbleData = [bubbleTrace];

      const bubbleLayout = { 
        title: {
          text:'OTU vs. Sample Values',
          font: {
            family: 'Time New Roman, Times, serif',
            size: 20
          }
        },
        xaxis: {
          title: {
            text: 'Operational Taxonomic Unit (OTU)',
            font: {
              family: 'Time New Roman, Times, serif',
              size: 18,
              color: '#7f7f7f'
            }
          }
        },
        yaxis: {
          title: {
            text: 'Sample Values',
            font: {
              family: 'Time New Roman, Times, serif',
              size: 18,
              color: '#7f7f7f'
            }
          }
        },
        margin: {
          l: 100,
          r: 50,
          b: 50,
          t: 100,
          pad: 4
        },
        showlegend: false,
       };
       
      Plotly.plot("bubble", bubbleData, bubbleLayout);
  

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    // const sortData = response.sort(function compareFunction(firstNum, secondNum){
    //   return secondNum-firstNum
    // });
    // console.log(sortData);  

      const pieTrace = {
        values: response.sample_values.slice(0,10),
        labels: response.otu_ids.slice(0,10),
        hoverinfo: response.otu_labels.slice(0,10),
        textposition: "inside",
        type: 'pie'
      };

      const pieData = [pieTrace];

      const pieLayout = {
        title: {
          text:'Belly Button Pie Chart',
          font: {
            family: 'Time New Roman, Times, serif',
            size: 20
          }
        },
        width: 800,
        heigth: 600
      };

      Plotly.plot("pie", pieData, pieLayout)
    
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  console.log(`option changed to ${newSample}`)
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();