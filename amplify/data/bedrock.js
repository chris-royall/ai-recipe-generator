export function request(ctx) {
    const { ingredients = [] } = ctx.args;
  
    // Construct the prompt with the provided ingredients
    const prompt = `Suggest multiple recipes with detailed instructions. ${ingredients}. Output list of ingrediants and instructions. Provide the output with: HTML styling, no line spacing, no introduction text.`;
    console.log("Prompt:", prompt);
  
    // Return the request configuration
    return {
      resourcePath: `/model/anthropic.claude-3-sonnet-20240229-v1:0/invoke`,
      method: "POST",
      params: {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          anthropic_version: "bedrock-2023-05-31",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `\n\nHuman: ${prompt}\n\nAssistant:`,
                },
              ],
            },
          ],
        }),
      },
    };
  }
  
  export function response(ctx) {
    console.log("Raw Bedrock Response:", ctx.result.body);
    // Parse the response body
    const parsedBody = JSON.parse(ctx.result.body);
  
    // Validate content structure
    if (!parsedBody.content || !Array.isArray(parsedBody.content) || parsedBody.content.length === 0) {
      console.log("Error: Invalid response format from Bedrock API.");
      return {
        body: "Error observed, please try again",
      };
    }
  
    // Extract the text content from the response
    const res = {
      body: parsedBody.content[0].text,
    };
  
    // Return the response
    return res;
  }  