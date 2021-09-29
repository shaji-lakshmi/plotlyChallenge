// Get the Roadster endpoint
const url = "./samples.json";
var sample; 
function selectionInit(){
  var selector = d3.select("#selDataset");
  d3.json(url).then(function (data) {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample); 
    });
    doit(sampleNames[0])
  });
}

selectionInit();

function doit(sample){
// Fetch the JSON data and console log it
d3.json(url).then(function (data) {
  console.log(data);

  //get all info needed 
  var info = data.samples;
  var sampleAccess = info.filter(sampleObject => sampleObject.id == sample);
  var fin = sampleAccess[0];

  // Use sample_values as the values for the bar chart.
  var labels = fin.otu_ids;
  // Use otu_ids as the labels for the bar chart.
  var hovertxt = fin.otu_labels;
  // Use otu_labels as the hovertext for the chart.
  var values = fin.sample_values;

  var bar_data = [
    {
      y: labels.slice(0, 10).map(id => `OTU ${id}`).reverse(),
      x: values.slice(0, 10).reverse(),
      text: hovertxt.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h"

    }
  ];

  var barLayout = {
    title: "Top 10 Bacteria Cultures Found"
  };

  Plotly.newPlot("bar", bar_data, barLayout);


  var bubble_layout = {
    xaxis: { title: "OTU IDs" }
  };

  var bubble_data = [
    {
      //Use otu_ids for the x values.
      x: labels,
      // Use sample_values for the y values.
      y: values,
      // Use otu_labels for the text values.
      text: hovertxt,
      mode: "markers",
      marker: {
        // Use otu_ids for the marker colors.
        color: labels,
        // Use sample_values for the marker size.
        size: values,
      }
    }
  ];

  Plotly.plot("bubble", bubble_data, bubble_layout);


    // Display the sample metadata, i.e., an individual's demographic information.
    var metadata = data.metadata;
    var access = metadata.filter(object => object.id == sample);
    var accessResult = access[0];

    console.log(accessResult);

    var div = d3.select("#sample-metadata");
    div.html("");
    div.append("p").text(`id: ${accessResult.id}`);
    div.append("p").text(`ethnicity: ${accessResult.ethnicity}`);
    div.append("p").text(`gender: ${accessResult.gender}`);
    div.append("p").text(`age: ${accessResult.age}`);
    div.append("p").text(`location: ${accessResult.location}`);
    div.append("p").text(`bbtype: ${accessResult.bbtype}`);
    div.append("p").text(`wferq: ${accessResult.wfreq}`);

});
};

function optionChanged(newSample) {
  doit(newSample);
}

