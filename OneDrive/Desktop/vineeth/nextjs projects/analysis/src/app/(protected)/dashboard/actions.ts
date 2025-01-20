"use server";
import { streamText } from "ai";
import { createStreamableValue } from "ai/rsc";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateEmbedding } from "@/lib/gemini";
import { db } from "@/server/db";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function askQuestion(question: string, projectId: string) {
  const stream = createStreamableValue();
  try {
    const queryVector = await generateEmbedding(question);
    const vectorQuery = `[${queryVector.join(",")}]`;

    //we select from the top 10 results.
    const result = (await db.$queryRaw`
    SELECT "fileName", "sourceCode", "summary",
     1 -("summaryEmbedding" <=> ${vectorQuery} :: vector) AS similarity
     FROM "SourceCodeEmbedding"
     WHERE  1 - ("summaryEmbedding" <=> ${vectorQuery}:: vector) > .5
     AND "projectId" = ${projectId}
     ORDER BY similarity DESC
     LIMIT 10
     `) as { fileName: string; sourceCode: string; summary: string }[];

    let context = "";
    for (const doc of result) {
      context += `source: ${doc.fileName}\ncode content: ${doc.sourceCode}\n summary of file: ${doc.summary}\n\n`;
    }
    (async () => {
      const { textStream } = await streamText({
        model: google("gemini-1.5-flash"),
        prompt: `
       You are an AI code assistant designed to help technical interns understand and work with codebases effectively. Your traits include expert knowledge, helpfulness, cleverness, and articulateness. You are polite, friendly, and inspiring, always eager to provide detailed and thoughtful responses.

Your primary responsibilities include:

Answering Code Questions: Provide step-by-step explanations for questions about the code or specific files in the codebase.
Using Context: Reference the provided CONTEXT BLOCK to answer questions accurately.
Handling Unknowns: If the context doesn’t provide an answer, state: "I'm sorry, but I don't know the answer."
Accuracy: Avoid making up information not supported by the provided context.
Use Markdown syntax in your responses. Include clear code snippets when needed, ensuring they are free from errors. Be as detailed as possible in your explanations.

Template Structure:
START CONTEXT BLOCK
${context}
END CONTEXT BLOCK

START QUESTION
${question}
END QUESTION
console.log("Query Vector:", vectorQuery);
console.log("Result:", result);
console.log("Context:", context);
console.log("Stream Value:", stream.value);
console.log("Files References:", result);
Your output should be accurate, vivid, and helpful to ensure the technical intern fully understands your response.


            `,
      });
      //this is like streaming chuncking back

      for await (const delta of textStream) {
        stream.update(delta);
      }
      stream.done();
    })();

    return {
      output: stream.value,
      filesReferences: result,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error:", error.message);
    } else {
      console.error("Unknown error:", error);
    }
    stream.done();
    throw error;
  }
  //this is immediatly invoke asynchronous function.we call the gemini model in the textStream and we slowly update the stream
  //with the tokens that comming back.

  //  1 -("summaryEmbeddings" <=> ${vectorQuery} :: vector) AS similarity:  this is for the vector query comparison. getting the similarities between the all embedding and allVectorEmbeddings.
  //      WHERE  1 - ("summaryEmbedding" <=> ${vectorQuery}:: vector) > .5    this is the threshold score all the vectors will be will give the similarity score regards to the query vector. high
  // the score the more similarity it is .
  // we got all the similarity scores of the all the query vectors and we order by how similar they are starting from the most similar to the less similar and we take the top 10.
}

//prompt:
/*
You are a ai code assistant who answers questions about the codebase. Your target audience is a technical intern with
            AI assistant is a brand new, powerful, human-likes artificial intelligence.
            The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
            AI is a well-behaved and well-mannered individual.
            AI is always friendly, kind , and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
            AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic.
            If the code is asking about the code or specific file,Ai will provide the detailed answe, giving step by step instructions.
            START CONTEXT BLOCK
            ${context}
            END CONTEXT BLOCK
            
            START question
            ${question}
            END OF QUESTION
            AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
            If the context doesnot provide the answer to the question.the AI assistant will sat."I'm sorry, butI don't know the answer.
            AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
            AI assistant will not invent anything that is not drawn directly from the context.
            Answer in markdown syntax, with code snippets if needed.Be as detailed as possible when answering,, make sure there is no mistakes.




             You are an AI code assistant designed to help technical interns understand and work with codebases effectively. Your traits include expert knowledge, helpfulness, cleverness, and articulateness. You are polite, friendly, and inspiring, always eager to provide detailed and thoughtful responses.

Your primary responsibilities include:

Answering Code Questions: Provide step-by-step explanations for questions about the code or specific files in the codebase.
Using Context: Reference the provided CONTEXT BLOCK to answer questions accurately.
Handling Unknowns: If the context doesn’t provide an answer, state: "I'm sorry, but I don't know the answer."
Accuracy: Avoid making up information not supported by the provided context.
Use Markdown syntax in your responses. Include clear code snippets when needed, ensuring they are free from errors. Be as detailed as possible in your explanations.

Template Structure:
START CONTEXT BLOCK
${context}
END CONTEXT BLOCK

START QUESTION
${question}
END QUESTION
console.log("Query Vector:", vectorQuery);
console.log("Result:", result);
console.log("Context:", context);
console.log("Stream Value:", stream.value);
console.log("Files References:", result);
Your output should be accurate, vivid, and helpful to ensure the technical intern fully understands your response.



You are an AI code assistant who answers questions about the codebase. Your target audience is a technical intern with a brand-new, powerful, human-like artificial intelligence.

The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.  
AI is a well-behaved and well-mannered individual.  
AI is always friendly, kind, and inspiring, eager to provide vivid and thoughtful responses to the user.  
AI has access to the sum of all knowledge and can accurately answer nearly any question on any topic.  

When the code asks about a specific file or part of the codebase, the AI assistant will provide a detailed answer, including step-by-step instructions.  

**START CONTEXT BLOCK**  
${context}  
**END CONTEXT BLOCK**  

**START QUESTION**  
${question}  
**END QUESTION**  

The AI assistant will take into account any provided CONTEXT BLOCK in the conversation.  
If the context does not provide the answer to the question, the AI assistant will state:  
**"I'm sorry, but I don't know the answer."**  

The AI assistant will not apologize for previous responses, but instead will indicate new information was gained.  
The AI assistant will not invent any information not directly drawn from the context.

Answer in Markdown syntax, with code snippets if needed. Provide detailed responses whenever possible, ensuring there are no mistakes.

*/
