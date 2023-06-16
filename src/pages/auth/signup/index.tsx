import React from 'react';
import { getProviders, getSession } from 'next-auth/react';
import { AppProviders } from 'next-auth/providers';
import { GetServerSideProps } from 'next';
import Login from '../login';

export default function SignUp(props: {
  providers: AppProviders;
  baseUrl: string;
}) {
  return (
    <Login
      providers={props.providers}
      baseUrl={props.baseUrl}
      title="Sign up"
    />
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const providers = await getProviders();
  const session = await getSession({ req });
  const baseUrl = process.env.NEXTAUTH_URL;

  if (session) {
    return {
      redirect: {
        statusCode: 302,
        destination: `/user/${session.user.username}`,
      },
    };
  }

  return {
    props: { providers: providers, baseUrl: baseUrl },
  };
};
