# Certificate Automation Plugin

## CSV Files
CSV files should be stored inside the `CSVs` directory with capitalized letters: `ORGSTEAMS.csv`, `JUDGE.csv`.

## API and Parsing the CSV Files
To use the API and parse the CSV files, follow these steps:
 **Run the Node.js Server:**
   Execute the following command to start the Node.js server:

   ```bash
   node index.js
   ```
**API Endpoints:**
 - /api/teams
 - /api/judges

## Figma Frame Configuration

To configure your Figma frame for the plugin, follow these guidelines:
 -  **Frame Conversion:**
	Ensure that the frame is converted into a component for the plugin to work correctly.

 - **Frame Naming:**
    The frame should be named using capital letters as follows:
	 - TEAM
	 - Team

- **Font Styles:**
	Implement the required font styles at the top of the file asynchronously inside `code.js`:

	```
	await figma.loadFontAsync({ family: "Poppins", style: "Light" }); 
	await figma.loadFontAsync({ family: "Poppins", style: "Bold" }); 
	await figma.loadFontAsync({ family: "Poppins", style: "Medium" });
	```
-	**Layer Naming:**
	The name layer in Figma should be named `NAME`.
	The certification description layer in Figma should be named `DESCRIPTION`.
	`['REPLACE']` is placed inside the description layer of figma requried to replace.


