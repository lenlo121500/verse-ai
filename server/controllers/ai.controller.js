import logger from "../utils/logger.js";
import APIError from "../utils/APIError.js";
import OpenAI from "openai";
import { CLIPDROP_API_KEY, GEMINI_API_KEY } from "../config/envVars.js";
import sql from "../config/db.js";
import { clerkClient } from "@clerk/express";
import axios from "axios";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import pdf from "pdf-parse/lib/pdf-parse.js";

const AI = new OpenAI({
  apiKey: GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

export const generateArticle = async (req, res, next) => {
  logger.info("getArticle controller hit.");
  try {
    const { userId } = req.auth();
    const { prompt, length } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (plan !== "premium" && free_usage >= 10) {
      return next(new APIError(403, "You have reached your free usage limit."));
    }

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: length,
    });

    const content = response.choices[0].message.content;

    await sql`INSERT INTO creations (
        user_id, prompt, content, type
    ) VALUES (
       ${userId}, ${prompt}, ${content}, "article")`;

    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }

    res.status(200).json({ success: true, content });
  } catch (error) {
    logger.error(`Error in getArticle controller: ${error.message}`);
    next(error);
  }
};

export const generateBlogTitle = async (req, res, next) => {
  logger.info("getBlogTitle controller hit.");
  try {
    const { userId } = req.auth();
    const { prompt } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (plan !== "premium" && free_usage >= 10) {
      return next(new APIError(403, "You have reached your free usage limit."));
    }

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 100,
    });

    const content = response.choices[0].message.content;

    await sql`INSERT INTO creations (
        user_id, prompt, content, type
    ) VALUES (
       ${userId}, ${prompt}, ${content}, "blog-title")`;

    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }

    res.status(200).json({ success: true, content });
  } catch (error) {
    logger.error(`Error in getBlogTitle controller: ${error.message}`);
    next(error);
  }
};

export const generateImage = async (req, res, next) => {
  logger.info("getBlogTitle controller hit.");
  try {
    const { userId } = req.auth();
    const { prompt, publish } = req.body;
    const plan = req.plan;

    if (plan !== "premium") {
      return next(
        new APIError(403, "This feature is only available to premium users.")
      );
    }

    const formData = new FormData();
    formData.append("prompt", prompt);
    const { data } = await axios.post(
      "'https://clipdrop-api.co/text-to-image/v1'",
      formData,
      {
        headers: {
          "x-api-key": CLIPDROP_API_KEY,
        },
        responseType: "arraybuffer",
      }
    );

    const base64Image = `data:image/png;base64,${Buffer.from(
      data,
      "binary"
    ).toString("base64")}`;

    const { secure_url } = await cloudinary.uploader.upload(base64Image);

    await sql`INSERT INTO creations (
        user_id, prompt, content, type, publish
    ) VALUES (
       ${userId}, ${prompt}, ${secure_url}, "image", ${publish ?? false})`;

    res.status(200).json({ success: true, content });
  } catch (error) {
    logger.error(`Error in getBlogTitle controller: ${error.message}`);
    next(error);
  }
};

export const removeImageBackground = async (req, res, next) => {
  logger.info("removeImageBackground controller hit.");
  try {
    const { userId } = req.auth();
    const { image } = req.file;
    const plan = req.plan;

    if (plan !== "premium") {
      return next(
        new APIError(403, "This feature is only available to premium users.")
      );
    }

    const { secure_url } = await cloudinary.uploader.upload(image.path, {
      transformation: [
        {
          effect: "background_removal",
          background_removal: "remove_the_background",
        },
      ],
    });

    await sql`INSERT INTO creations (
        user_id, prompt, content, type
    ) VALUES (
       ${userId}, "Remove background from image", ${secure_url}, "image"
    )`;

    res.status(200).json({ success: true, content: secure_url });
  } catch (error) {
    logger.error(`Error in removeImageBackground controller: ${error.message}`);
    next(error);
  }
};

export const removeImageObject = async (req, res, next) => {
  logger.info("getBlogTitle controller hit.");
  try {
    const { userId } = req.auth();
    const { object } = req.body;
    const { image } = req.file;
    const plan = req.plan;

    if (plan !== "premium") {
      return next(
        new APIError(403, "This feature is only available to premium users.")
      );
    }

    const { public_id } = await cloudinary.uploader.upload(image.path);

    const imageUrl = cloudinary.url(public_id, {
      transformation: [
        {
          effect: `gen_remove:${object}`,
        },
      ],
      resource_type: "image",
    });

    await sql`INSERT INTO creations (
        user_id, prompt, content, type, 
    ) VALUES (
       ${userId}, ${`Remove ${object} from image`}, ${imageUrl}, "image")`;

    res.status(200).json({ success: true, content: imageUrl });
  } catch (error) {
    logger.error(`Error in removeImageObject controller: ${error.message}`);
    next(error);
  }
};

export const reviewResume = async (req, res, next) => {
  logger.info("getBlogTitle controller hit.");
  try {
    const { userId } = req.auth();
    const resume = req.file;
    const plan = req.plan;

    if (plan !== "premium") {
      return next(
        new APIError(403, "This feature is only available to premium users.")
      );
    }

    if (resume.size > 5 * 1024 * 1024) {
      return next(new APIError(400, "Resume size should be less than 5MB."));
    }

    const dataBuffer = fs.readFileSync(resume.path);
    const pdfData = await pdf(dataBuffer);

    const prompt = `Review the following resume and provide constructive feedback on its strengths, weaknesses, and areas for improvement. Resume Content:\n\n${pdfData.text}`;

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const content = response.choices[0].message.content;

    await sql`INSERT INTO creations (
        user_id, prompt, content, type, 
    ) VALUES (
       ${userId}, ${prompt}, ${content}, "resume-review")`;

    res.status(200).json({ success: true, content });
  } catch (error) {
    logger.error(`Error in removeImageObject controller: ${error.message}`);
    next(error);
  }
};
