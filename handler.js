import axios from "axios";
//import { writeJsonFile } from "write-json-file";
import { UFS } from "./utils/ufs";

export async function electionIntegration(event) {
  //serverless invoke local -f electionIntegration -p events/test.json

  let promises = [];
  var output = [];

  for (var i = 0; i < UFS.length; i++) {
    const uf = UFS[i].sigla.toLowerCase();

    var config = {
      method: "get",
      url: `https://resultados.tse.jus.br/oficial/ele2022/544/dados-simplificados/${uf}/${uf}-c0001-e000544-r.json`,
      headers: {},
    };

    console.log("config", config);

    promises.push(
      axios(config)
        .then(function (response) {
          //console.log(JSON.stringify(response.data));
          //writeJsonFile(`schemas/${uf}.json`, response.data);
          output.push(response.data);
        })
        .catch(function (error) {
          console.log(error);
        })
    );
  }

  return Promise.all(promises).then(() => ({
    message: "Go Serverless v3! Your function executed successfully!",
    body: output,
    size: output.length,
  }));
}
