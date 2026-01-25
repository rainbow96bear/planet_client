// src/routes/api/signup/+server.ts
import { SIGNUP_MUTATION } from "$lib/graphql";
import { graphqlRequest } from "$lib/server/graphqlRequest";
import type { RequestHandler } from "@sveltejs/kit";

const AUTH_SERVER_GRAPHQL = process.env.VITE_AUTH_SERVER_GRAPHQL;

export const POST: RequestHandler = async ({ request }) => {
  try {
    const formData = await request.formData();

    const signupToken = formData.get("signup_token") as string;
    const provider = formData.get("provider") as string;
    const nickname = formData.get("nickname") as string;
    const bio = formData.get("bio") as string | null;
    const profileImage = formData.get("profile_image") as string | null;

    if (!signupToken || !nickname || !provider) {
      return new Response(
        JSON.stringify({ error: "signup_token, provider, nickname은 필수입니다." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const variables = {
      input: {
        signupToken,
        nickname,
        bio,
        profileImage
      }
    };

    const data = await graphqlRequest(
      AUTH_SERVER_GRAPHQL!,
      SIGNUP_MUTATION,
      variables
    );
    
    const user = data.signup.user;

    return new Response(JSON.stringify({ user }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    console.error("GraphQL signup error:", err);

    return new Response(JSON.stringify({ error: "회원가입 실패" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
