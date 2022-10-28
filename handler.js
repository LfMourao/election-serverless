//import { writeJsonFile } from "write-json-file";
//import { UFS } from "./utils/ufs";
("use strict");
const axios = require("axios");
const AWS = require("aws-sdk");
const { appSyncMutation } = require("./appSyncMutation.js");
require("isomorphic-fetch");
AWS.config.update({ region: "us-east-2" });

module.exports.electionIntegration = async (event) => {
  //serverless invoke local -f electionIntegration -p events/essentials.json

  const UFS = [
    { nome: "Brasil", sigla: "BR" },
    { nome: "Rio de Janeiro", sigla: "RJ" },
  ];
  // , { nome: "Rio de Janeiro", sigla: "RJ" }, { nome: "São Paulo", sigla: "SP" }

  let promises = [];
  var output = [];
  output = event;

  // for (var i = 0; i < UFS.length; i++) {
  //   const uf = UFS[i].sigla.toLowerCase();

  //   var config = {
  //     method: "get",
  //     //     url: `https://resultados.tse.jus.br/oficial/ele2022/544/dados-simplificados/${uf}/${uf}-c0001-e000544-r.json`,
  //     url: `https://resultados.tse.jus.br/oficial/ele2022/545/dados-simplificados/${uf}/${uf}-c0001-e000545-r.json`,
  //     headers: {},
  //   };

  //   console.log("config", config);

  //   promises.push(
  //     axios(config)
  //       .then(function (response) {
  //         //console.log(JSON.stringify(response.data));
  //         //writeJsonFile(`schemas/${uf}.json`, response.data);
  //         output.push(response.data);
  //       })
  //       .catch(function (error) {
  //         console.log(error);
  //       })
  //   );
  // }

  var appSync;

  for (var i = 0; i < output.length; i++) {
    appSync = await appSyncMutation(output[i]);
  }

  //const appSync = await appSyncMutation();

  return Promise.all(promises).then(() => ({
    message: "Go Serverless v3! Your function executed successfully!",
    body: output,
    size: output.length,
    appSync,
  }));
};
