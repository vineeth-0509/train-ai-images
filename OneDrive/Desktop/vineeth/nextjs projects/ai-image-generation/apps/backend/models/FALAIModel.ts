import { BaseModel } from "./BaseModel";
import { fal } from "@fal-ai/client";
export class FalAIModel extends BaseModel{
    constructor(){
        super();
    }

    public async generateImage(prompt: string, tensorPath: string){
        const {request_id, response_url} = await fal.queue.submit("fal-ai/flux-lora", {
            input: {
              prompt: prompt,
              loras:[{path: tensorPath, scale: 1}] 
              //loras (low-ranking-adaptation)
              //path: tensorPath  this represents the file path or identifier of the lora model stored in fal.ai LoRA models
              //are used to fine-tune diffusion models efficiently by adding specifc styles or features without retraining the entire model.
              //tensorPath: is a url , file path, or identifier of a lora model hosted in fal.ai


              //scale:
              /*
              This controls the strength of the LoRA model's effect on the final generated image.
              A value of 1 means full influence, while lower values reduce the impact of the LoRA model.
               */
            },
            webhookUrl: `${process.env.WEBHOOK_BASE_URL}/fal-ai/webhook/image`
          });
          return {request_id, response_url};
    }

   // we tell falai to train the model and falai hit our backned on the webhook, and we update the database. 
    public async trainModel(zipUrl: string, triggerWord: string){
            const {request_id, response_url} = await fal.queue.submit("fal-ai/flux-flora",{
                input:{
                      images_data_url: zipUrl,
                      triggered_word: triggerWord
                },
                webhookUrl:`${process.env.WEBHOOK_BASE_URL}/fal-ai/webhook/train`,
            });

            return {request_id, response_url};
    }
}