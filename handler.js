export async function electionIntegration(event) {
  //serverless invoke local -f electionIntegration -p events/test.json
  return {
    message: "Go Serverless v3! Your function executed successfully!",
    input: event,
  };
}
