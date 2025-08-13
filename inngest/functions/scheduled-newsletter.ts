import { fetchArticles } from "@/lib/news";
import { inngest } from "../client";
import { marked } from "marked";
import emailjs from "@emailjs/nodejs";

export default inngest.createFunction(
  { id: "newsletter/scheduled" },
  { event: "newsletter.schedule" },
  async ({ event, step, runId }) => {
    const categories = event.data.categories;
    const allArticles = await step.run("fetch-news", async () => {
      return fetchArticles(categories);
    });

    const summary = await step.ai.infer("summarize-news", {
      model: step.ai.models.openai({ model: "gpt-3.5-turbo" }),
      body: {
        messages: [
          {
            role: "system",
            content: `You are an expert newsletter editor creating a personalized newsletter. 
              Write a concise, engaging summary that:
              - Highlights the most important stories
              - Provides context and insights
              - Uses a friendly, conversational tone
              - Is well-structured with clear sections
              - Keeps the reader informed and engaged
              Format the response as a proper newsletter with a title and organized content.
              Make it email-friendly with clear sections and engaging subject lines.`,
          },
          {
            role: "user",
            content: `Create a newsletter summary for these articles from the past week. 
              Categories requested: ${event.data.categories.join(", ")}
              
              Articles:
              ${allArticles
                .map(
                  (article, index: number) =>
                    `${index + 1}. ${article.title}\n   ${
                      article.description
                    }\n   Source: ${article.url}\n`
                )
                .join("\n")}`,
          },
        ],
      },
    });

    const newsletterContent = summary.choices[0].message.content;

    if (!newsletterContent) {
      throw new Error("Failed to generate newsletter content");
    }

    const htmlContent = marked(newsletterContent);

    await step.run("send-email", async () => {
      const templateParams = {
        to_email: event.data.email,
        newsletter_content: htmlContent,
        categories: event.data.categories.join(", "),
        article_count: allArticles.length,
        current_date: new Date().toLocaleDateString(),
      };

      const serviceId = process.env.EMAILJS_SERVICE_ID;
      const templateId = process.env.EMAILJS_TEMPLATE_ID;
      const publicKey = process.env.EMAILJS_PUBLIC_KEY;
      const privateKey = process.env.EMAILJS_PRIVATE_KEY;

      if (!serviceId || !templateId || !publicKey) {
        throw new Error("EmailJS configuration missing");
      }
      try {
        const response = await emailjs.send(
          serviceId,
          templateId,
          templateParams,
          {
            publicKey,
            privateKey,
          }
        );

        console.log("Email sent successfully:", response);
        return response;
      } catch (error) {
        console.error("Email sending failed:", error);
        throw error;
      }
    });

    return {};
  }
);
