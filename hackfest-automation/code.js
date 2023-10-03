//main function that runs at first
//make sure to have only one component in the page of type COMPONENT  (only work for this!)
//select only one item and run the plugin 
async function runPlugin() {
  //custom api request allowing cros form localhost
  const apiURL = "http://localhost:1939/api/teams";
  try {
    const response = await fetch(apiURL);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();

    const certificate = figma.currentPage.selection[0];
    if (!certificate || certificate.type !== "COMPONENT") {
      figma.notify("Make sure to select a design which should be COMPONENT typed");
      figma.closePlugin();
      return;
    }
    //allowing only array from the api response
    if (Array.isArray(data.data)) {
      //cloning the document based on the data
      await cloneDocument(certificate, data.data);
    } else {
      console.log(data.data)
      console.error("Invalid data format. Expected an array.");
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    figma.closePlugin();
  }
}

async function configDocument(certificate, parsedData) {
  for (const layer of certificate.children) {
    if (layer.name == 'TEAMNAME') {
      const fontName = layer.fontName;
      //async waiting the text layer to load the font object and applying filter (main async required!!)
      await figma.loadFontAsync({ family: fontName.family, style: fontName.style });
      //executes once the font is fully loaded
      layer.characters = parsedData.Name;
    }
  }
}
async function cloneDocument(certificate, parsedData) {
  let originalXcord = certificate.x;
  for (const element of parsedData) {
    console.log(element);
    const clonedCertificate = certificate.clone();
    //async will edit the document text
    await configDocument(clonedCertificate, element);
    clonedCertificate.x = originalXcord + certificate.width + 10;
    figma.currentPage.appendChild(clonedCertificate);
    originalXcord = clonedCertificate.x;
  }
}
runPlugin();
