function runPlugin() {
  const apiURL = "http://localhost:1939/api/certificates";

  // Fetch data from the API and pass it to the cloneDocument function
  fetch(apiURL)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // Handle the response data from the server
      console.log("Data from Express server:", data);
      cloneDocument(data); // Pass the data to the cloneDocument function
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  // Accessing the current page
  // Make sure to select only one certificate design, not multiple
  // After selecting the certificate design, run the plugin
  // Make sure the type of the element is COMPONENT
  const certificate = figma.currentPage.selection[0];
  if (certificate.type !== "COMPONENT") {
    figma.notify(
      "Make sure to select a design which should be COMPONENT typed"
    );
    figma.closePlugin();
    return;
  }
  // Note: You should not call cloneDocument here; it should be called after fetching the data.
  // cloneDocument(certificate);
}

function cloneDocument(parsedData) {
  // Now you can use the parsedData within this function
  parsedData.forEach((element) => {
    // Your logic to clone the component and use parsedData here
    const clonedCertificate = certificate.clone(); // Assuming certificate is defined in the outer scope
    const originalXcord = certificate.x;
    const width = certificate.width;
    clonedCertificate.x = originalXcord + width + 10;
    figma.currentPage.appendChild(clonedCertificate);
  });
}

runPlugin();
