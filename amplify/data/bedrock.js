export function request(ctx) {
    const { ingredients = [] } = ctx.args;

    // Prompt Explanation:
    // This prompt employs Instruction-based Prompting with Few-shot Patterns:
    // 1. **Instruction-based Prompting**: The AI is guided with explicit instructions about its role (culinary assistant), task (recipe suggestion), and output format (structured HTML).
    // 2. **Few-shot Patterns**: Although no examples are given, the structured breakdown provides a clear pattern for generating output.
    // 3. **Task Chaining**: The steps are sequenced logically:
    //     - Analyse user inputs.
    //     - Prioritise recipes matching the criteria.
    //     - Include a wildcard recipe.
    //     - Format the output in HTML.
    // This structure ensures the AI generates consistent, relevant, and well-formatted responses.
    const prompt = `
      You are a expert culinary expert. Your goal is to suggest recipes based on specific user inputs, including: Ingredients, Cuisine, Dietary Requirements, Cooking Time, Skill Level, and Other preferences.

      Inputs: ${ingredients}.

      1. Analyze user inputs to suggest simple, accurate, and diverse recipes, prioritizing those that match all criteria. If no perfect match exists, suggest the closest alternatives.
      2. Verify the recipe details, including preparation steps, estimated time, and compatibility with the provided inputs.
      3. Limit the suggestions to two recipes only.
      4. Output the response in HTML format with:
          - A recipe list,
          - Each recipe's name as a header (<h2>),
          - Each recipe's "Ingredients" and "Instructions" as a header (<h3>),
          - Brief description (<p>),
          - Ingredients as a list (<ul>),
          - Instructions as a list (<ol>).
      5. Do not include any introductory or explanatory text; provide only the HTML content for the recipes.
      6. Provide source links for each recipe in the format "Source: <a href>".
      7. If no recipes match the criteria, suggest a wildcard recipe that uses any ingredients provided.
      8. If no recipes match the criteria or wildcard recipe, suggest a generic recipe based on the provided inputs.
    `;
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