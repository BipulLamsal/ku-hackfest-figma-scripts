const axios = require("axios");
const ACCESSTOKEN = "figd__S5nfSEZSZXxrJzaMt2cp-WjajxHAFWtDra8V03A";
const FILEID = "GwUwyUIO7IsunfxG2FHxf9";
const URL = `https://api.figma.com/v1/files/${FILEID}`;
const FRAMENAME = "PAPER";
async function getFile() {
  try {
    const response = await axios.get(URL, {
      headers: {
        "X-Figma-Token": ACCESSTOKEN,
      },
    });

    if (response.status === 200) {
      const fileData = response.data;
      const fileName = fileData.name;
      console.log(`File Name: ${fileName}`);
      return fileData;
    } else {
      console.error(`Error: ${response.status} - ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

async function getFileComponents(response) {
  const components =  await response.components;
  //   console.log(typeof(components))
  //   converting object to array
  const componentsArray = Object.values(components);
  const filterdComponent = componentsArray.filter((item) => {
    return item.name === FRAMENAME;
  });
  if (filterdComponent.length == 0) {
    console.log(`No Component Named ${FRAMENAME}`);
  } else {
    // gets the first frame only other duplicate frames are ignored
    // console.log(filterdComponent);
    const COMPONENTID = filterdComponent[0].key;
    const ComponentUrl = `https://api.figma.com/v1/files/${FILEID}/components`;
    return {
      ComponentUrl: ComponentUrl,
      ComponentId: COMPONENTID,
    };
  }
}

async function componentCopier(component) {

    try {
        const createComponentResponse = await axios.post(
          `https://api.figma.com/v1/files/${FILEID}/components`,
          {
            name: "PAPER_NEW", 
            key: component.ComponentId, 
          },
          {
            headers: {
              "X-Figma-Token": ACCESSTOKEN,
            },
          }
        );
        if (createComponentResponse.status === 200) {
          console.log(`Component copied successfully.`);
          const newComponentKey = createComponentResponse.data.meta.id;
        } else {
          console.error(`Error creating the component: ${createComponentResponse.status} - ${createComponentResponse.statusText}`);
        }
      } catch (error) {
        console.error("Error:", error.message);
      }
}

getFile()
  .then((response) => {
    getFileComponents(response).then((component) => {
      componentCopier(component);
    });
  })
  .catch((error) => {
    console.log(error);
  });
