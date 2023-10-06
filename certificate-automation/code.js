//main function that runs at first
//make sure to have only one component in the page of type COMPONENT  (only work for this!)
//select only one item and run the plugin
async function runPlugin() {
  //custom api request allowing cros form localhost
  await figma.loadFontAsync({ family: "Poppins", style: "Light" });
  await figma.loadFontAsync({ family: "Poppins", style: "Bold" });
  await figma.loadFontAsync({ family: "Poppins", style: "Medium" });

  const page = figma.currentPage.selection[0];
  if (page.name === "JUDGE") {
    await getAPIrequest("http://localhost:1939/api/judges");
  } else if (page.name === "TEAM") {
    await getAPIrequest("http://localhost:1939/api/teams");
  }
}

async function getAPIrequest(apiURL) {
  try {
    const response = await fetch(apiURL);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    //selects the first index of the selected component
    const certificate = figma.currentPage.selection[0];
    if (!certificate || certificate.type !== "COMPONENT") {
      figma.notify(
        "Make sure to select a design which should be COMPONENT typed"
      );
      figma.closePlugin();
      return;
    }
    //allowing only array from the api response
    if (Array.isArray(data.data)) {
      //cloning the document based on the data
      await cloneDocument(certificate, data.data);
    } else {
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
    if (layer.name == "NAME") {
      const fontName = layer.fontName;
      console.log(fontName.family);
      //async waiting the text layer to load the font object and applying filter (main async required!!)
      await figma.loadFontAsync({
        family: fontName.family,
        style: fontName.style,
      });
      //executes once the font is fully loaded
      layer.characters = parsedData.Name;
    }
    if (layer.name == "DESCRIPTION") {
      const text = layer.characters;
      const fontStylesPerWord = [];
      let currentWord = "";
      let currentFontFamily = null;
      let currentFontWeight = null;
      let currentFontColor = null;
      let isSpace = false;

      for (const letter of text) {
        if (letter === " " || letter === "\n" || letter === "\t") {
          isSpace = letter;
        } else {
          currentWord += letter;

          const fontName = layer.getRangeFontName(
            text.indexOf(letter),
            text.indexOf(letter) + 1
          );
          if (fontName.family !== currentFontFamily) {
            currentFontFamily = fontName.family;
          }
          if (fontName.style.includes("Bold") && currentFontWeight !== "Bold") {
            currentFontWeight = "Bold";
          } else if (
            !fontName.style.includes("Bold") &&
            currentFontWeight !== "Light"
          ) {
            currentFontWeight = "Light";
          }
        }

        if (isSpace === " " || isSpace === "\n" || isSpace === "\t") {
          if (currentWord) {
            if (currentWord === "[REPLACE]") {
              currentWord = parsedData.Team;
            }
            fontStylesPerWord.push({
              word: currentWord,
              fontFamily: currentFontFamily,
              fontWeight: currentFontWeight,
            });
            fontStylesPerWord.push({
              word: isSpace,
              fontFamily: currentFontFamily,
              fontWeight: currentFontWeight,
            });
          }
          currentWord = "";
          isSpace = false;
        }
      }
      if (currentWord) {
        fontStylesPerWord.push({
          word: currentWord,
          fontFamily: currentFontFamily,
          fontWeight: currentFontWeight,
        });
      }
      let insertPosition = 0;
      console.log(fontStylesPerWord);

      // Iterate through the fontStylesPerWord array and insert characters into the layer
      layer.characters = "";
      for (const item of fontStylesPerWord) {
        const wordLength = item.word.length;
        const insertText = item.word;

        await figma.loadFontAsync({ family: "Alex Brush", style: "Regular" });
        // Replace text in the layer at the specified position with the new word and font style
        layer.insertCharacters(insertPosition, insertText);

        // Set the font style for the inserted word
        // Color is needed to implemented still
        // Still Font Weight is not automated!!
        layer.setRangeFontName(insertPosition, insertPosition + wordLength, {
          family: item.fontFamily,
          style: item.fontWeight,
        });

        // Update the insert position for the next word
        insertPosition += wordLength;
      }
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
