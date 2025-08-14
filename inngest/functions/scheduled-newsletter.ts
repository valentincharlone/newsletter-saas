import { fetchArticles } from "@/lib/news";
import { inngest } from "../client";
import { marked } from "marked";
import emailjs from "@emailjs/nodejs";
import { createClient } from "@/lib/client";

export default inngest.createFunction(
  {
    id: "newsletter/scheduled",
    cancelOn: [
      {
        event: "newsletter.schedule.deleted",
        if: "async.data.userId == event.data.userId",
      },
    ],
  },
  { event: "newsletter.schedule" },
  async ({ event, step, runId }) => {
    const isUserActive = await step.run("check-user-status", async () => {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("user_preferences")
        .select("is_active")
        .eq("user_id", event.data.userId)
        .single();

      if (error) {
        return false;
      }

      return data.is_active || false;
    });

    // If user has paused their newsletter, exit early
    if (!isUserActive) {
      console.log(
        `User ${event.data.userId} has paused their newsletter. Skipping processing.`
      );
      return {
        skipped: true,
        reason: "User newsletter is paused",
        userId: event.data.userId,
        runId: runId,
      };
    }

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

    // 4️⃣ Schedule the next newsletter based on frequency
    await step.run("schedule-next", async () => {
      const now = new Date();
      let nextScheduleTime: Date;

      switch (event.data.frequency) {
        case "daily":
          nextScheduleTime = new Date(now.getTime() + 24 * 60 * 60 * 1000);
          break;
        case "weekly":
          nextScheduleTime = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
          break;
        case "biweekly":
          nextScheduleTime = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
          break;
        default:
          nextScheduleTime = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      }

      nextScheduleTime.setHours(9, 0, 0, 0);

      // Schedule the next newsletter
      await inngest.send({
        name: "newsletter.schedule",
        data: {
          userId: event.data.userId,
          email: event.data.email,
          categories: event.data.categories,
          frequency: event.data.frequency,
          scheduledFor: nextScheduleTime.toISOString(),
        },
        ts: nextScheduleTime.getTime(),
      });

      console.log(
        `Next newsletter scheduled for: ${nextScheduleTime.toISOString()}`
      );
    });

    const result = {
      newsletter: newsletterContent,
      articleCount: allArticles.length,
      categories: event.data.categories,
      emailSent: true,
      nextScheduled: true,
      success: true,
      runId: runId,
    };

    return result;
  }
);
