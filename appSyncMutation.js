const gql = require('graphql-tag');
const AWSAppSyncClient = require('aws-appsync').default;

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

  const uf = output.cdabr

  const input = {
    id: "BR#2022-10-23T13:30:51.531Z",
    uf: "BR",
    updateTime: "2022-10-23T13:30:51.531Z",
    fetchTime: new Date().toISOString(),
    votesCount: 1,
    votesProportion: 0.01,
    bolsonaro: 1,
    lula: 0,
  };

  let mutationResponse

  mutationResponse = await mutation("update", client, input, "ElectionPartial");

  if (!mutationResponse.err) return mutationResponse;
  else {
    mutationResponse = await mutation("create", client, input, table);
    return mutationResponse;
  }
}

async function mutation(action = "create", client, input, table = "ElectionPartial") {

  let mutation = gql`mutation ${action}${table}($input: ${action.charAt(0).toUpperCase() + action.slice(1)
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
    console.log("error", e);
    res = { err: e, input };
  }

  return res;
}

module.exports = {
  appSyncMutation
};
