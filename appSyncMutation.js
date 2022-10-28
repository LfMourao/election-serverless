const gql = require("graphql-tag");
const AWSAppSyncClient = require("aws-appsync").default;
const m = require("moment");

async function appSyncMutation(output) {
  const client = new AWSAppSyncClient({
    url: "https://vqplhbs6hzgqxgf27fqreaujwm.appsync-api.us-east-2.amazonaws.com/graphql",
    region: "us-east-2",
    auth: {
      type: "API_KEY",
      apiKey: "da2-j32lvdltpjhdzltk7wxqwmblqm",
    },
    disableOffline: true,
  });

  const uf = output.cdabr;
  const updateTime = m(output.dg + " " + output.hg, "DD/MM/YYYY hh:mm:ss").toISOString();
  const id = uf + "#" + updateTime;

  const bolsonaroData = output.cand.filter((eachCand) => eachCand.n === "22")[0];
  const lulaData = output.cand.filter((eachCand) => eachCand.n === "13")[0];

  const votesCount = parseInt(bolsonaroData.vap) + parseInt(lulaData.vap);

  const bolsonaro = parseFloat(bolsonaroData.pvap);
  const lula = parseFloat(lulaData.pvap);

  votesProportion = parseFloat(output.psnt);

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
