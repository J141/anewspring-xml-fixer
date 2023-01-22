import './style.css'
import {addFileSubmitHandler} from "./src/formHandler.js";
import {fixANewSpringXml} from "./src/xmlValidator.js";
import {download} from "./src/downloadHelper.js";

document.querySelector('#app').innerHTML = `
  <div>
    <form action="javascript:void(0)" style="text-align: left">
        <div style="margin-bottom: 5px"><input type="file" accept=".xml"/></div>
        <div>
            <input type="submit" value="Bestand fixen"/>
        </div>
    </form>
  </div>
`

addFileSubmitHandler((xmlContents, fileName) => {
    const fixedXml = fixANewSpringXml(xmlContents);
    download(fileName, fixedXml)
});
