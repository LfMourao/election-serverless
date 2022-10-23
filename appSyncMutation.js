import gql from "graphql-tag";
const AWSAppSyncClient = require("aws-appsync").default;

async function appSyncMutation() {
  const client = new AWSAppSyncClient({
    url: "https://vqplhbs6hzgqxgf27fqreaujwm.appsync-api.us-east-2.amazonaws.com/graphql",
    region: "us-east-2",
    auth: {
      type: "API_KEY",
      apiKey: "da2-j32lvdltpjhdzltk7wxqwmblqm",
    },
    disableOffline: true,
  });

  //console.log("client", client);

  const input = {
    id: "BR#2022-10-23T13:30:51.531Z",
    uf: "BR",
    updateTime: "2022-10-23T13:30:51.531Z",
    fetchTime: "2022-10-23T13:30:51.531Z",
    votesCount: 1,
    votesProportion: 0.01,
    bolsonaro: 1,
    lula: 0,
  };

  return await mutation("create", client, input, "ElectionPartial");
}

async function mutation(action = "create", client, input, table = "ElectionPartial") {
  let mutation = gql`mutation ${action}${table}($input: ${
    action.charAt(0).toUpperCase() + action.slice(1)
  }${table}Input!) {
        ${action}${table}(input: $input) {
            id
            assetId
            motion
            tenant
            lat
            lng
            deviceId
            time
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
    console.log("error", e);
    res = { err: e, input };
  }

  return res;
}

export default appSyncMutation;
