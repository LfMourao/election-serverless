const gql = require("graphql-tag");
const AWSAppSyncClient = require("aws-appsync").default;
const m = require("moment");

async function appSyncMutation(output) {
  const client = new AWSAppSyncClient({
    url: "https://k4m3clv7nrbltpiyclcl66od4m.appsync-api.us-east-2.amazonaws.com/graphql",
    region: "us-east-2",
    auth: {
      type: "API_KEY",
      apiKey: "da2-wqocl7zrhbfv7fpr4l54dtft2u",
    },
    disableOffline: true,
  });

  const uf = output.cdabr.toUpperCase();
  const updateTime = m(output.dg + " " + output.hg, "DD/MM/YYYY hh:mm:ss").toISOString();
  const id = uf + "#" + updateTime;

  const bolsonaroData = output.cand.find((eachCand) => eachCand.n === "22");
  const lulaData = output.cand.find((eachCand) => eachCand.n === "13");

  console.log({ bolsonaroData, lulaData });

  const votesCount = parseInt(bolsonaroData.vap) + parseInt(lulaData.vap);

  const bolsonaro = parseFloat(bolsonaroData.pvap) / 100;
  const lula = parseFloat(lulaData.pvap) / 100;

  votesProportion = parseFloat(output.psi) / 100;

  const input = {
    id,
    uf,
    updateTime,
    fetchTime: new Date().toISOString(),
    votesCount,
    votesProportion,
    bolsonaro,
    lula,
  };

  console.log("input", input);

  let mutationResponse;

  mutationResponse = await mutation("update", client, input, "ElectionPartial");

  if (!mutationResponse.err) return mutationResponse;
  else {
    mutationResponse = await mutation("create", client, input, "ElectionPartial");
    return mutationResponse;
  }
}

async function mutation(action = "create", client, input, table = "ElectionPartial") {
  let mutation = gql`mutation ${action}${table}($input: ${
    action.charAt(0).toUpperCase() + action.slice(1)
  }${table}Input!) {
        ${action}${table}(input: $input) {
            id
            uf
            updateTime
            fetchTime
            votesCount
            votesProportion
            bolsonaro
            lula
            createdAt
            updatedAt
        }
    }`;

  let res;

  //console.log("mutation", mutation);

  try {
    res = await client.mutate({
      mutation,
      variables: { input },
    });
  } catch (e) {
    //console.log("error", e);
    res = { err: e, input };
  }

  return res;
}

module.exports = {
  appSyncMutation,
};
