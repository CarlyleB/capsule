import { SyntheticEvent } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { ActionFunction } from "@remix-run/router";
import { useFetcher } from "@remix-run/react";
import { Button, Group, PasswordInput, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';

import { auth as serverAuth } from "../firebase.server";
import { auth as clientAuth } from "../firebase.client";
import { createUserSession } from "~/sessions.server";

const FIVE_DAYS = 60 * 60 * 24 * 5 * 1000;

interface FormValues {
  email: string;
  password: string;
}

export default function Login() {
  const fetcher = useFetcher();

  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();
    const values = form.getValues();
    const email = values.email;
    const password = values.password;

    try {
      const credential = await signInWithEmailAndPassword(clientAuth, email, password);
      const idToken = await credential.user.getIdToken();
      // Trigger a POST request which the action will handle
      fetcher.submit({ idToken }, { method: "post", action: "/login" });
    } catch (e) {
      console.log(e);
    }
  }

  const form = useForm<FormValues>({
    mode: 'uncontrolled',
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });

  return (
    <form onSubmit={handleSubmit}>
      <TextInput
        withAsterisk
        label="Email"
        placeholder="your@email.com"
        key={form.key('email')}
        {...form.getInputProps('email')}
      />
      <PasswordInput
        label="Input label"
        description="Input description"
        placeholder="Input placeholder"
        key={form.key('password')}
        {...form.getInputProps('password')}
      />
      <Group justify="flex-end" mt="md">
        <Button type="submit">Submit</Button>
      </Group>
    </form>
  )
}

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const idToken = form.get("idToken")?.toString();
  if (!idToken) {
    throw new Error("Failed to retrieve user id token. Login failed.");
  }

  await serverAuth.verifyIdToken(idToken);
  const jwt = await serverAuth.createSessionCookie(idToken, {
    expiresIn: FIVE_DAYS,
  });

  return createUserSession(jwt, FIVE_DAYS);
};
