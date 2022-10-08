import { loadJsonFile } from "load-json-file";
import { UFS } from "../utils/ufs.js";
import round from "lodash.round";
import { writeJsonFile } from "write-json-file";

var ufData = {};

for (var i = 0; i < UFS.length; i++) {
  const uf = UFS[i].sigla.toLowerCase();

  const res = await loadJsonFile(`firstRoundData/${uf}.json`);

  ufData[uf] = {
    uf: res.cdabr.toUpperCase(),
    vv: parseInt(res.vv),
    pvv: round(parseInt(res.vv) / 118229719, 5),
    pvvc: parseFloat(res.pvvc.replace(",", ".")),
    name: UFS.find((e) => {
      console.log("e", e.sigla.toLowerCase(), uf);
      return e.sigla.toLowerCase() === uf;
    })?.nome,
  };
}

//console.log(await loadJsonFile("firstRoundData/br.json"));

console.log(
  "ufData",
  Object.values(ufData).sort((a, b) => b.pvv - a.pvv)
);

writeJsonFile(`firstRoundData/vvData.json`, ufData);
